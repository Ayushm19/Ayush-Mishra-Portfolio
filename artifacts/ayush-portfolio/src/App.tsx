import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Github, Mail, MapPin, Send } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const skillDetails: Record<string, { note: string; use: string; signal: string }> = {
  TypeScript: { note: 'The default setting for turning fuzzy ideas into interfaces that behave.', use: 'product systems', signal: 'strict, expressive, ship-ready' },
  React: { note: 'For interfaces with enough personality to deserve a second look.', use: 'sharp interfaces', signal: 'component brain online' },
  'Node.js': { note: 'Where the useful plumbing happens: APIs, workers, queues and all the glue.', use: 'backend systems', signal: 'event loop: caffeinated' },
  FastAPI: { note: 'A fast lane for shipping AI and data-heavy services without the ceremony.', use: 'AI services', signal: 'latency stays low' },
  GenAI: { note: 'Not just prompting — building the guardrails, evals and product loops around it.', use: 'agentic products', signal: 'context window: focused' },
  Python: { note: 'The language of choice when the idea needs to become a useful experiment quickly.', use: 'models + tooling', signal: 'prototype mode: on' },
  'Next.js': { note: 'Full-stack product surfaces with the sharp edges sanded down.', use: 'web products', signal: 'server + client sync' },
  LangChain: { note: 'Prompt orchestration, skill graphs and the connective tissue between agents.', use: 'LLM workflows', signal: 'chains are linked' },
};

const getSkillDetails = (skill: string) =>
  skillDetails[skill] ?? {
    note: `${skill} is one of the tools in Ayush’s everyday problem-solving kit.`,
    use: 'shipping software',
    signal: 'loaded into the toolkit',
  };

const answerFor = (raw: string) => {
  const command = raw.trim().toLowerCase();
  if (!command) return 'Try a command. The short list is above — or ask me who Ayush is.';
  if (command.includes('help') || command === '?') return 'Try: about, work, skills, experience, location, contact, or a question like “what does Ayush build?”';
  if (command.includes('skill')) return 'Ayush works across TypeScript, React, Next.js, Node, FastAPI, cloud systems, RAG, vector databases, embeddings, LangChain, MCP and agentic AI.';
  if (command.includes('work') || command.includes('project') || command.includes('build')) return 'Two recent builds: a seven-agent resume ranking workbench and Welth, a collaborative finance product with server actions, recurring transactions and receipt parsing.';
  if (command.includes('experience') || command.includes('job')) return 'Software Developer at Recruiting Monk (Jul 2025–Aug 2026), after a Cloud Engineer internship at Cloud Edge Technology (Jan–Jun 2025).';
  if (command.includes('where') || command.includes('location')) return 'New Delhi, India. Remote-friendly, internet-native, usually somewhere between a terminal and a diagram.';
  if (command.includes('contact') || command.includes('email') || command.includes('hire')) return 'Write to knandan400@gmail.com. For code, find Ayushm19 on GitHub.';
  if (command.includes('about') || command.includes('who') || command.includes('ayush')) return 'Ayush Mishra is a software developer who turns messy product ideas into reliable systems — then gives the systems a little personality.';
  return 'I know Ayush’s work, stack, experience, location and contact details. Ask one of those, or type “help”.';
};

function Terminal() {
  const [history, setHistory] = useState<{ command: string; answer: string }[]>([
    { command: 'whoami', answer: 'Ayush Mishra — software developer, systems thinker, New Delhi.' },
    { command: 'status', answer: 'building thoughtful software across product, cloud and agentic AI.' },
  ]);
  const [input, setInput] = useState('');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    setHistory((items) => [...items, { command, answer: answerFor(command) }]);
    setInput('');
  };

  const run = (command: string) => {
    setHistory((items) => [...items, { command, answer: answerFor(command) }]);
  };

  return (
    <div className="terminal-wrap reveal">
      <div className="terminal" data-testid="terminal-console">
        <div className="terminal-head"><i className="term-dot" /><i className="term-dot" /><i className="term-dot" /><span style={{ marginLeft: 7 }}>ayush@local — /curiosity</span></div>
        <div className="terminal-body">
          {history.map((item, index) => (
            <div key={`${item.command}-${index}`}>
              <div className="terminal-line">$ <span>{item.command}</span></div>
              <div className="terminal-answer">{item.answer}</div>
            </div>
          ))}
          <form className="term-form" onSubmit={submit}>
            <label htmlFor="terminal-input" className="terminal-line">$</label>
            <input id="terminal-input" data-testid="input-terminal-command" value={input} onChange={(event) => setInput(event.target.value)} placeholder="ask me something..." autoComplete="off" />
            <button type="submit" data-testid="button-terminal-submit"><Send size={14} /></button>
          </form>
        </div>
      </div>
      <aside className="terminal-aside">
        <strong>Ask the small world.</strong>
        No API, no loading state, no pretend AI. Just a tiny local map of what Ayush makes and how he thinks.
        <div className="command-list" aria-label="Suggested commands">
          {['about', 'work', 'skills', 'contact'].map((command) => <button key={command} type="button" data-testid={`button-command-${command}`} onClick={() => run(command)}>{command}</button>)}
        </div>
      </aside>
    </div>
  );
}

function Home() {
  const [heroMode, setHeroMode] = useState(0);
  const [activeSkill, setActiveSkill] = useState('TypeScript');
  const currentHero = heroModes[heroMode];
  const currentSkill = getSkillDetails(activeSkill);

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
        <div className="availability"><span className="pulse" /> open to good problems</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow reveal">software developer / new delhi / 2025—now</div>
          <button
            className="hero-mode reveal delay-1"
            type="button"
            onClick={() => setHeroMode((mode) => (mode + 1) % heroModes.length)}
            aria-label="Change the hero mode"
            data-testid="button-hero-mode"
          >
            <span className="hero-mode-prompt">$ {currentHero.prompt}</span>
            <span className="hero-mode-result">click to recompile <span>{heroMode + 1}/3</span></span>
          </button>
          <h1 className="reveal delay-1" key={currentHero.prompt}>{currentHero.title}<br /><span className="line-two">{currentHero.accent}<i className="terminal-caret" aria-hidden="true" /></span></h1>
          <div className="hero-intro reveal delay-2">
            <p>Ayush Mishra builds <strong>product software with a point of view</strong> — from sharp interfaces to cloud systems and agentic AI that knows when to show its work.</p>
            <div className="hero-meta"><b>currently</b><br />Shipping end-to-end features at Recruiting Monk.<br /><br /><b>elsewhere</b><br />Reading docs, drawing flows, chasing the clean abstraction.</div>
          </div>
        </div>
        <div className="scribble" aria-hidden="true">nice to meet you</div>
        <a href="#curiosity" className="scroll-cue" data-testid="link-scroll-cue"><span className="scroll-line" /> scroll / poke around <ArrowDown size={14} /></a>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-inner">typescript <span>◆</span> agentic systems <span>◆</span> product-minded engineering <span>◆</span> new delhi to anywhere <span>◆</span> typescript <span>◆</span> agentic systems <span>◆</span></div></div>

      <section className="section" id="curiosity">
        <div className="section-head">
          <div><div className="section-kicker">01 / curious?</div><h2>Talk to the<br />portfolio.</h2></div>
          <p className="section-note">A little command line for the things that do not fit neatly in a bio. Type a question. I left the backend at home.</p>
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
              <span>currently into</span>
              <h3>{activeSkill}</h3>
              <p>{currentSkill.note}</p>
            </div>
            <div className="stack-console-line stack-signal-line"><span>signal</span> {currentSkill.signal}</div>
          </div>
          <div className="stack-use">
            <span>best used for</span>
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