import { AYUSH_SYSTEM_PROMPT } from './ayush-prompt';

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

export type HistoryItem = { role?: string; text?: string };

export async function askGemini(apiKey: string, message: string, history: HistoryItem[] = []) {
  const contents = [
    ...history
      .filter((item) => item.text?.trim())
      .map((item) => ({
        role: item.role === 'model' ? 'model' : 'user',
        parts: [{ text: item.text!.trim() }],
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

  const data = (await response.json()) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini request failed (${response.status})`);
  }

  const answer = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!answer) {
    throw new Error('Gemini returned an empty answer.');
  }

  return answer;
}
