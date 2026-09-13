import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Bot, Github, MapPin, Send } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { askAyush } from '@/lib/ask-ayush';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const projects = [
  {
    index: '01',
    name: 'Multi-Agent Resume Ranking',
    description: 'A hiring workbench where seven specialist agents inspect, challenge, and verify resume evidence before a deterministic score lands. Built for useful disagreement, not magic.',
    tags: ['Python', 'FastAPI', 'Google Gemini', 'uv', 'Agent orchestration'],
    url: 'https://ranking-multi-agent-system.vercel.app/',
  },
  {
    index: '02',
    name: 'Welth — Finance Team Collab',
    description: 'A shared finance cockpit for teams: permissions, invites, recurring transactions, receipt parsing, monthly reports and alerts — with a little AI doing the boring parts.',
    tags: ['Next.js', 'MongoDB', 'Auth.js', 'Inngest', 'Resend', 'Gemini'],
    url: 'https://welth-finance-iota.vercel.app/',
  },
];

const skills = ['JavaScript', 'React', 'Redux', 'TypeScript', 'Next.js', 'Node.js', 'Express', 'GenAI', 'Python', 'FastAPI', 'SQL', 'MongoDB', 'DSA', 'Docker', 'Jenkins', 'AWS', 'GCP', 'RAG', 'Vector databases', 'Embeddings', 'LangChain', 'MCP', 'AI agents'];

const heroModes = [
  { prompt: 'whoami', title: 'I’m a dev', accent: 'who ships.' },
  { prompt: 'npm run vibe', title: 'I build', accent: 'the weird stuff.' },
  { prompt: 'git status', title: 'always', accent: 'shipping.' },
];

type SkillDetail = { note: string; evidence: string; use: string; signal: string };

const skillDetails: Record<string, SkillDetail> = {
  JavaScript: { note: 'Used across the product and service layer whenever an idea needs to become a working interface.', evidence: 'Resume experience: end-to-end product features across frontend and backend systems.', use: 'product features', signal: 'runtime: ready' },
  React: { note: 'The UI layer for turning product flows into interfaces people can actually use.', evidence: 'Resume project: Welth — Finance Team Collaboration Website.', use: 'product interfaces', signal: 'component brain online' },
  Redux: { note: 'A fit for shared state when a product has more than one role, flow or live surface.', evidence: 'Resume stack: Redux listed among core frontend tools.', use: 'shared UI state', signal: 'state: in sync' },
  TypeScript: { note: 'The safety rail for shipping quickly without letting a growing product become guesswork.', evidence: 'Recruiting Monk: Node and Express TypeScript microservices for Company, Admin and Candidate roles.', use: 'microservices', signal: 'strict, expressive, ship-ready' },
  'Next.js': { note: 'A full-stack product surface for moving from an idea to a deployed experience with fewer seams.', evidence: 'Resume project: Welth — Finance Team Collaboration Website, built with Next.js.', use: 'web products', signal: 'server + client sync' },
  'Node.js': { note: 'The runtime behind APIs, role-based services and the glue between product systems.', evidence: 'Recruiting Monk: leading features end to end across Node microservices.', use: 'backend systems', signal: 'event loop: caffeinated' },
  Express: { note: 'A straightforward base for services that need clear routes, boundaries and ownership.', evidence: 'Recruiting Monk: Node and Express TypeScript microservices.', use: 'service APIs', signal: 'routes: accounted for' },
  GenAI: { note: 'Not just prompting — building the evaluation loops and product context around useful AI.', evidence: 'Recruiting Monk: agentic AI services with model benchmarking.', use: 'agentic products', signal: 'context window: focused' },
  Python: { note: 'The quick path from an experiment to something that can inspect evidence and produce a useful result.', evidence: 'Resume project: Multi-Agent Resume Ranking, built with Python.', use: 'AI experiments', signal: 'prototype mode: on' },
  FastAPI: { note: 'A fast lane for shipping AI and data-heavy services without unnecessary ceremony.', evidence: 'Resume project: Multi-Agent Resume Ranking, built with FastAPI.', use: 'AI services', signal: 'latency stays low' },
  SQL: { note: 'Useful whenever a product needs reliable records, filters and answers that can be audited.', evidence: 'Resume stack: SQL listed among database and data tools.', use: 'structured data', signal: 'queries: composed' },
  MongoDB: { note: 'A flexible fit for product data that changes as the product and its workflows get clearer.', evidence: 'Resume project: Welth — Finance Team Collaboration Website, built with MongoDB.', use: 'finance data', signal: 'documents: connected' },
  DSA: { note: 'The fundamentals underneath the systems: choose the right shape before optimizing the surface.', evidence: 'Resume stack: Data Structures and Algorithms listed as a core strength.', use: 'problem solving', signal: 'complexity: considered' },
  Docker: { note: 'A repeatable boundary for getting services from a laptop to a shared environment.', evidence: 'Resume stack: Docker listed among development and deployment tools.', use: 'repeatable services', signal: 'containers: packed' },
  Jenkins: { note: 'Automation for the unglamorous steps that keep shipping from depending on memory.', evidence: 'Resume stack: Jenkins listed among CI/CD tools.', use: 'delivery pipelines', signal: 'build: automated' },
  AWS: { note: 'Cloud fluency for understanding where a service runs, how it scales and what it costs.', evidence: 'Resume stack: AWS listed among cloud platforms.', use: 'cloud systems', signal: 'region: available' },
  GCP: { note: 'The cloud layer behind services, monitoring and the foundations that make product work possible.', evidence: 'Cloud Edge Technology: worked across GCP, serverless patterns, monitoring and logging.', use: 'cloud foundations', signal: 'telemetry: online' },
  RAG: { note: 'Give a model the right evidence before asking it to make a useful decision.', evidence: 'Recruiting Monk: vector database, embeddings and a LangChain-powered skill graph.', use: 'grounded AI', signal: 'retrieval: relevant' },
  'Vector databases': { note: 'A practical memory layer for finding meaning across resumes, skills and product knowledge.', evidence: 'Recruiting Monk: building agentic AI services with a vector database.', use: 'semantic search', signal: 'nearest neighbors: found' },
  Embeddings: { note: 'Turning text into a shape that systems can compare, retrieve and reason over.', evidence: 'Recruiting Monk: embeddings used in the agentic AI service stack.', use: 'meaningful search', signal: 'vectors: aligned' },
  LangChain: { note: 'The connective tissue between models, tools, retrieval and a skill graph.', evidence: 'Recruiting Monk: LangChain-powered skill graph.', use: 'LLM workflows', signal: 'chains are linked' },
  MCP: { note: 'A cleaner way for tools and models to discover the context they need to do useful work.', evidence: 'Resume stack: MCP listed among AI engineering tools.', use: 'tool-connected AI', signal: 'context: discoverable' },
  'AI agents': { note: 'Small specialists that inspect, challenge and verify evidence before a result lands.', evidence: 'Resume project: Multi-Agent Resume Ranking and Recruiting Monk agentic AI services.', use: 'evidence workflows', signal: 'agents: collaborating' },
};

const getSkillDetails = (skill: string) =>
  skillDetails[skill] ?? {
    note: `${skill} is one of the tools in Ayush’s everyday problem-solving kit.`,
    evidence: 'Resume stack: listed among Ayush’s technical tools.',
    use: 'shipping software',
    signal: 'loaded into the toolkit',
  };

function Terminal() {
  const [history, setHistory] = useState<{ command: string; answer: string }[]>([
    { command: 'whoami', answer: 'Ayush Mishra — software developer, systems thinker, New Delhi.' },
    { command: 'status', answer: 'building thoughtful software across product, cloud and agentic AI.' },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = scrollRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: 'smooth' });
  }, [history, pending]);

  const ask = async (command: string) => {
    const question = command.trim();
    if (!question || pending) return;
    setPending(true);
    setHistory((items) => [...items, { command: question, answer: 'thinking…' }]);
    try {
      const answer = await askAyush(question, history);
      setHistory((items) => {
        const next = [...items];
        next[next.length - 1] = { command: question, answer };
        return next;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The host went quiet.';
      setHistory((items) => {
        const next = [...items];
        next[next.length - 1] = { command: question, answer: message };
        return next;
      });
    } finally {
      setPending(false);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    setInput('');
    void ask(command);
  };

  return (
    <div className="terminal-wrap reveal">
      <div className="terminal" data-testid="terminal-console">
        <div className="terminal-head"><i className="term-dot" /><i className="term-dot" /><i className="term-dot" /><span style={{ marginLeft: 7 }}>ayush@local — /curiosity</span></div>
        <div className="terminal-body" ref={scrollRef}>
          {history.map((item, index) => {
            const waiting = pending && index === history.length - 1;
            return (
              <div key={`${item.command}-${index}`}>
                <div className="terminal-line">$ <span>{item.command}</span></div>
                <div className={`terminal-answer${waiting ? ' is-pending' : ''}`}>{item.answer}</div>
              </div>
            );
          })}
        </div>
        <form className="term-form" onSubmit={submit}>
          <label htmlFor="terminal-input" className="terminal-line">$</label>
          <input id="terminal-input" data-testid="input-terminal-command" value={input} onChange={(event) => setInput(event.target.value)} placeholder="ask me something..." autoComplete="off" disabled={pending} />
          <button type="submit" data-testid="button-terminal-submit" disabled={pending}><Send size={14} /></button>
        </form>
      </div>
      <aside className="terminal-aside">
        <strong>Ask the host.</strong>
        Who is Ayush, why hire him, what he has shipped. Off-topic questions get roasted.
        <div className="command-list" aria-label="Suggested commands">
          {['who is ayush', 'why hire him', 'projects', 'experience'].map((command) => (
            <button key={command} type="button" data-testid={`button-command-${command.replaceAll(' ', '-')}`} onClick={() => void ask(command)} disabled={pending}>{command}</button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function isTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select'));
}

function firstLineBreakIndex(host: HTMLElement, text: string) {
  const newline = text.indexOf('\n');
  const sample = newline === -1 ? text : text.slice(0, newline);
  if (!sample) return 0;

  const probe = document.createElement('span');
  const style = getComputedStyle(host);
  probe.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'visibility:hidden',
    'pointer-events:none',
    'white-space:pre-wrap',
    `font:${style.font}`,
    `letter-spacing:${style.letterSpacing}`,
    `line-height:${style.lineHeight}`,
    `width:${Math.max(host.clientWidth, 1)}px`,
  ].join(';');
  probe.textContent = sample;
  document.body.appendChild(probe);

  const node = probe.firstChild;
  let wrapAt = sample.length;
  if (node) {
    const range = document.createRange();
    let firstBottom: number | null = null;
    for (let i = 0; i < sample.length; i += 1) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getBoundingClientRect();
      if (firstBottom === null) firstBottom = rect.bottom;
      else if (rect.top > firstBottom - 1) {
        wrapAt = i;
        break;
      }
    }
  }
  probe.remove();
  return newline !== -1 && wrapAt >= sample.length ? newline : wrapAt;
}

function Home() {
  const [heroMode, setHeroMode] = useState(0);
  const [customHeadline, setCustomHeadline] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState('TypeScript');
  const [heroTextVisible, setHeroTextVisible] = useState(true);
  const [lineSplit, setLineSplit] = useState(0);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const currentHero = heroModes[heroMode];
  const currentSkill = getSkillDetails(activeSkill);
  const customFirst = customHeadline === null ? '' : customHeadline.slice(0, lineSplit);
  const customRest = customHeadline === null ? '' : customHeadline.slice(lineSplit).replace(/^\n/, '');

  useEffect(() => {
    const headline = heroHeadlineRef.current;
    if (!headline) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroTextVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(headline);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroTextVisible) return;
    const preset = `${currentHero.title}\n${currentHero.accent}`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextField(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        setCustomHeadline((text) => (text ?? preset).slice(0, -1));
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        setCustomHeadline((text) => `${text ?? preset}\n`);
        return;
      }

      if (event.key.length !== 1) return;
      event.preventDefault();
      setCustomHeadline((text) => `${text ?? preset}${event.key}`);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [heroTextVisible, currentHero.accent, currentHero.title]);

  useLayoutEffect(() => {
    const host = heroHeadlineRef.current;
    if (!host || customHeadline === null) {
      setLineSplit(0);
      return;
    }

    const measure = () => setLineSplit(firstLineBreakIndex(host, customHeadline));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, [customHeadline]);

  return (
    <main className="app-shell">
      <div className="grain" />
      <header className="topbar">
        <a href="#top" className="mark" data-testid="link-home"><span className="mark-dot" /> AYUSH MISHRA</a>
        <nav className="topnav" aria-label="Main navigation">
          <a href="#work" data-testid="link-work">work</a>
          <a href="#experience" data-testid="link-experience">experience</a>
          <a href="#stack" data-testid="link-stack">stack</a>
          <a href="#contact" data-testid="link-contact">contact</a>
        </nav>
        <div className="topbar-end">
          <a
            className="bot-button"
            href="#curiosity"
            data-testid="link-bot"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('curiosity')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.setTimeout(() => document.getElementById('terminal-input')?.focus(), 450);
            }}
          >
            <Bot size={14} />
            bot
          </a>
          <div className="availability"><span className="pulse" /> open to good problems</div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow reveal">software developer / new delhi / <a href="mailto:knandan400@gmail.com">knandan400@gmail.com</a></div>
          <button
            className="hero-mode reveal delay-1"
            type="button"
            onClick={() => {
              setCustomHeadline(null);
              setHeroMode((mode) => (mode + 1) % heroModes.length);
            }}
            aria-label="Change the hero mode"
            data-testid="button-hero-mode"
          >
            <span className="hero-mode-prompt">$ {currentHero.prompt}</span>
            <span className="hero-mode-result">click to recompile <span>{heroMode + 1}/3</span></span>
          </button>
          <h1
            ref={heroHeadlineRef}
            className={`hero-headline-editor reveal delay-1${customHeadline !== null ? ' is-custom' : ''}`}
            spellCheck={false}
            aria-label="Hero headline. Type or press Backspace to rewrite while this section is on screen."
            data-testid="hero-headline-editor"
            title="Type to write · Backspace to erase · refresh to reset"
          >
            {customHeadline === null ? (
              <>
                <span className="line-one">{currentHero.title}</span>
                <br />
                <span className="line-two">
                  {currentHero.accent}
                  <i className="terminal-caret" aria-hidden="true" />
                </span>
              </>
            ) : (
              <>
                <span className="line-one">
                  {customFirst}
                  {!customRest ? <i className="terminal-caret" aria-hidden="true" /> : null}
                </span>
                {customRest ? (
                  <span className="line-two">
                    {customRest}
                    <i className="terminal-caret" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </h1>
          <div className="hero-edit-note reveal delay-2">just type · backspace to erase · refresh to reset</div>
          <div className="hero-intro reveal delay-2">
            <p>Ayush Mishra builds <strong>product software with a point of view</strong> — from sharp interfaces to cloud systems and agentic AI that knows when to show its work.</p>
            <div className="hero-meta"><b>currently</b><br />Shipping end-to-end features at Recruiting Monk.<br /><br /><b>elsewhere</b><br />Reading docs, drawing flows, chasing the clean abstraction.</div>
          </div>
        </div>
        <img className="hero-photo" src={`${import.meta.env.BASE_URL}ayush.jpg`} alt="Ayush Mishra" />
        <div className="scribble" aria-hidden="true">nice to meet you</div>
        <a href="#curiosity" className="scroll-cue" data-testid="link-scroll-cue"><span className="scroll-line" /> scroll / poke around <ArrowDown size={14} /></a>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-inner">typescript <span>◆</span> agentic systems <span>◆</span> product-minded engineering <span>◆</span> new delhi to anywhere <span>◆</span> typescript <span>◆</span> agentic systems <span>◆</span></div></div>

      <section className="section" id="curiosity">
        <div className="section-head">
          <div><div className="section-kicker">01 / curious?</div><h2>Talk to the<br />portfolio.</h2></div>
          <p className="section-note">A little command line trained on Ayush’s resume. Ask who he is, why hire him, what he built. Trick questions get a smirk.</p>
        </div>
        <Terminal />
      </section>

      <section className="section work-section" id="work">
        <div className="section-head">
          <div><div className="section-kicker">02 / selected work</div><h2>Things with<br />moving parts.</h2></div>
          <p className="section-note">Not case studies dressed as homework. Real product-shaped experiments with opinions about reliability, evidence and flow.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card reveal" key={project.index} data-testid={`card-project-${project.index}`}>
              <div className="project-index">{project.index} — 2025</div>
              <div><h3>{project.name}</h3><p>{project.description}</p><a className="project-arrow" href={project.url} target="_blank" rel="noreferrer">open live site <ArrowUpRight size={15} /></a></div>
              <div className="tag-wrap">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-head">
          <div><div className="section-kicker">03 / the timeline</div><h2>Learning in<br />public.</h2></div>
          <p className="section-note">Each role made the circle a little bigger: from cloud infrastructure to products where the agents are part of the team.</p>
        </div>
        <div className="experience-layout">
          <div className="timeline">
            <article className="timeline-item reveal" data-testid="experience-recruiting-monk">
              <div className="timeline-date">jul 2025 — aug 2026 / remote</div>
              <h3>Software Developer</h3><h4>Recruiting Monk</h4>
              <p>Leading features end to end across Node and Express TypeScript microservices for Company, Admin and Candidate roles. Building agentic AI services with model benchmarking, a vector database, embeddings and a LangChain-powered skill graph.</p>
            </article>
            <article className="timeline-item reveal delay-1" data-testid="experience-cloud-edge">
              <div className="timeline-date">jan — jun 2025 / remote</div>
              <h3>Cloud Engineer Intern</h3><h4>Cloud Edge Technology</h4>
              <p>Worked across GCP, microservices, serverless patterns, monitoring and logging — the unglamorous foundations that make the interesting parts possible.</p>
            </article>
          </div>
          <aside className="quote-card"><p>“Make the complex feel like it was always supposed to be this simple.”</p><small>— a working principle</small></aside>
        </div>
      </section>

      <section className="section skills-section" id="stack">
        <div className="section-head">
          <div><div className="section-kicker">04 / the toolbox</div><h2>Good with<br />the whole stack.</h2></div>
          <p className="section-note">The tool matters less than the question it helps answer. These are the ones I reach for often.</p>
        </div>
        <div className="skill-cloud" aria-label="Interactive technology stack">
          {skills.map((skill) => (
            <button
              className={`skill ${activeSkill === skill ? 'is-active' : ''}`}
              key={skill}
              type="button"
              aria-pressed={activeSkill === skill}
              onClick={() => setActiveSkill(skill)}
              onMouseEnter={() => setActiveSkill(skill)}
              data-testid={`skill-${skill.toLowerCase().replaceAll(' ', '-')}`}
            >
              {skill}
            </button>
          ))}
        </div>
        <div className="skill-playground reveal" aria-live="polite">
          <div className="stack-terminal">
            <div className="stack-console-line"><span>$</span> focus --on <strong>{activeSkill.toLowerCase().replaceAll(' ', '-')}</strong></div>
            <div className="stack-focus">
              <span>resume evidence</span>
              <h3>{activeSkill}</h3>
              <p>{currentSkill.note}</p>
              <blockquote>{currentSkill.evidence}</blockquote>
            </div>
            <div className="stack-console-line stack-signal-line"><span>signal</span> {currentSkill.signal}</div>
          </div>
          <div className="stack-use">
            <span>where it ships</span>
            <strong>{currentSkill.use}</strong>
            <span className="stack-pulse" aria-hidden="true" />
          </div>
        </div>
        <div className="education">
          <div><div className="section-kicker">education / 2021—2025</div><h3>B.Tech Computer Science</h3><p>GNIT, IPU · graduated June 2025</p></div>
          <div className="education-stat">8.7<small>CGPA / out of 10</small></div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="section-kicker">05 / your move</div>
        <h2>Have a hard problem<br />with a human shape?</h2>
        <div className="contact-row">
          <a className="contact-link" href="mailto:knandan400@gmail.com" data-testid="link-email">knandan400@gmail.com <ArrowUpRight size={26} /></a>
          <div className="contact-details"><div><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> New Delhi, India</div><a href="https://github.com/Ayushm19" target="_blank" rel="noreferrer" data-testid="link-github"><Github size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />github.com/Ayushm19</a></div>
        </div>
      </section>
      <footer className="footer"><span>AYUSH MISHRA</span><span>made with curiosity · 2025</span></footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;