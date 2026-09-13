import { askGemini } from '../artifacts/ayush-portfolio/src/lib/gemini-ask';

type AskRequest = {
  method?: string;
  body?: {
    message?: string;
    history?: { role?: string; text?: string }[];
  };
};

type AskResponse = {
  status: (code: number) => AskResponse;
  json: (body: Record<string, string>) => void;
};

export default async function handler(req: AskRequest, res: AskResponse) {
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
    const answer = await askGemini(apiKey, message, Array.isArray(req.body?.history) ? req.body.history : []);
    res.status(200).json({ answer });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Ask failed.';
    res.status(502).json({ error: detail });
  }
}
