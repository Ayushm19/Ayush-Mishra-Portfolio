const GEMINI_MODEL = 'gemini-3.5-flash-lite';

const AYUSH_RESUME = `
AYUSH MISHRA
New Delhi 110059 | +91 8826336732 | knandan400@gmail.com | GitHub: Ayushm19

SKILLS
Frontend: JavaScript, React, Redux, TypeScript, Next.js
Backend: Node.js, Express, TypeScript, GenAI, Python, FastAPI
Database: SQL, MongoDB
Core CS: Data Structures & Algorithms
DevOps: Docker, Jenkins, AWS, GCP
AI/LLM: RAG, Vector Databases, Embeddings, LangChain, MCP, AI Agents

WORK EXPERIENCE

Software Developer — Recruiting Monk (Remote) — Jul 2025 – Aug 2026
- Led features end to end from high-level design to low-level design, following SDLC and shipping with the team.
- Built scalable Node.js / Express TypeScript microservices for Company, Admin, and Candidate roles.
- Built agentic AI microservices; cut inference cost and improved response time by benchmarking and picking the right LLM for each worker.
- Built a vector database and embedding pipeline plus a skill graph for other agents, using LangChain for prompt orchestration.

Cloud Engineer Intern — Cloud Edge Technology (Remote) — Jan 2025 – Jun 2025
- Cloud application work on GCP: microservices and serverless architectures.
- Cloud monitoring and logging to track performance and catch issues.

PROJECTS

Multi-Agent Resume Ranking — Python, FastAPI, Google Gemini, multi-agent orchestration, uv
Live: https://ranking-multi-agent-system.vercel.app/
- Seven specialist agents (JD Analyst, Resume Parser, evaluators, Evidence Verifier, Deterministic Scorer, Critic) coordinated by a supervisor.
- Deterministic scoring in code so agents only emit bounded, evidence-backed opinions; no single agent owns the rank.
- Guardrails: file-type/size checks, prompt-injection scanning, PII redaction, bias screening, critic accept/revise/reject loop.
- Evidence verification that cross-checks cited quotes against the source resume.
- FastAPI service with REST endpoints and an interactive workbench; pluggable LLMs plus offline mock mode.

Welth — Finance Team Collab — Next.js Server Actions, MongoDB, Mongoose, Auth.js, Inngest, Resend, Google Gemini
Live: https://welth-finance-iota.vercel.app/
- Team collaboration backend: shared accounts, admin monthly spend limits, per-teammate permissions, transaction attribution.
- Auth.js OAuth with encrypted cookie sessions and Google token refresh.
- Token-based team invites with RBAC in server actions.
- Inngest jobs for recurring transactions, monthly reports, and budget-threshold alerts.
- Gemini 1.5 Flash parses uploaded receipts (amount, date, category).
- Resend + React Email for monthly summaries and budget alerts.

EDUCATION
B.Tech Computer Science — GNIT, IPU (Noida) — graduated Jun 2025 — CGPA 8.7 / 10
`.trim();

const AYUSH_SYSTEM_PROMPT = `You are the command-line on Ayush Mishra's portfolio. Ayush is your host. You speak like a sharp, friendly terminal: short, warm, a little mischievous. No markdown headings. No bullet walls unless they clearly want a list. Default to 2–6 sentences.

You ONLY answer questions about Ayush Mishra, using the resume below:
- who he is
- why someone should hire him
- skills and stack
- work experience
- projects
- education
- location and contact
- how he thinks and ships

If someone asks anything else — math, trivia, homework, news, riddles, "what is 2+2", general knowledge, unrelated coding help — do NOT answer it. Call them out playfully, like: "haha got you — you're trying to trick me. Try asking about my host." Vary the wording. Nudge them toward Ayush: who he is, why hire him, projects, experience.

Never invent jobs, dates, schools, or projects. If it is not in the resume, say you do not have that on file and point them to knandan400@gmail.com.

RESUME
${AYUSH_RESUME}`;

async function askGemini(apiKey, message, history = []) {
  const contents = [
    ...history
      .filter((item) => item && String(item.text || '').trim())
      .map((item) => ({
        role: item.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(item.text).trim() }],
      })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: AYUSH_SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error((data && data.error && data.error.message) || `Gemini request failed (${response.status})`);
  }

  const answer = (data.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || '')
    .join('')
    .trim();

  if (!answer) {
    throw new Error('Gemini returned an empty answer.');
  }

  return answer;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'GEMINI_API_KEY is missing.' });
    return;
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  try {
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const answer = await askGemini(apiKey, message, history);
    res.status(200).json({ answer });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : 'Ask failed.' });
  }
};
