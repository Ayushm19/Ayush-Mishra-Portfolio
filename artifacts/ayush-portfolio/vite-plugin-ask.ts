import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import { askGemini, type HistoryItem } from './src/lib/gemini-ask';

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function sendJson(res: ServerResponse, status: number, body: Record<string, string>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function ayushAskPlugin(apiKey: string): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'POST only.' });
    }
    if (!apiKey) {
      return sendJson(res, 503, { error: 'GEMINI_API_KEY is missing from .env' });
    }

    try {
      const payload = JSON.parse((await readBody(req)) || '{}') as {
        message?: string;
        history?: HistoryItem[];
      };
      const message = payload.message?.trim();
      if (!message) {
        return sendJson(res, 400, { error: 'Message is required.' });
      }
      const answer = await askGemini(apiKey, message, payload.history ?? []);
      return sendJson(res, 200, { answer });
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Ask failed.';
      return sendJson(res, 502, { error: detail });
    }
  };

  return {
    name: 'ayush-ask',
    configureServer(server) {
      server.middlewares.use('/api/ask', handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ask', handle);
    },
  };
}
