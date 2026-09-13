export type TerminalTurn = { command: string; answer: string };

export async function askAyush(message: string, history: TerminalTurn[]) {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.slice(-8).flatMap((turn) => [
        { role: 'user', text: turn.command },
        { role: 'model', text: turn.answer },
      ]),
    }),
  });

  const data = (await response.json().catch(() => null)) as { answer?: string; error?: string } | null;
  if (!response.ok) {
    throw new Error(data?.error || 'The host went quiet. Try again in a second.');
  }
  if (!data?.answer) {
    throw new Error('Empty reply from the host.');
  }
  return data.answer;
}
