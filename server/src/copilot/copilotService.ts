import { db } from '../database/sqlite.js';

export async function generateCopilotReply(userPrompt: string, simContext: unknown) {
  const provider = (process.env.AI_PROVIDER || 'demo').toLowerCase();
  const systemPrompt = `You are the AETHER-CITY GenAI Copilot for an Autonomous Multi-Agent Smart City Digital Twin. Answer concisely using ONLY this live telemetry context: ${JSON.stringify(simContext)}`;

  if (provider === 'ollama') {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.AI_MODEL || 'llama3.2';
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: `${systemPrompt}\nUser: ${userPrompt}`, stream: false }),
    });
    if (res.ok) {
      const data = (await res.json()) as { response: string };
      return { reply: data.response, providerLabel: `OLLAMA (${model})` };
    }
  }

  if (provider === 'openai' && process.env.EXTERNAL_LLM_API_KEY) {
    const baseUrl = process.env.EXTERNAL_LLM_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.AI_MODEL || 'gpt-4o-mini';
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXTERNAL_LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return { reply: data.choices[0].message.content, providerLabel: `EXTERNAL LLM (${model})` };
    }
  }

  const fallbackReply = `[DEMO AI MODE — Server Grounded Telemetry] Live state: ${JSON.stringify(simContext)}. Configure AI_PROVIDER=ollama or AI_PROVIDER=openai in .env for generative inference.`;
  db.prepare(
    `INSERT INTO copilot_conversations (user_prompt, assistant_reply, provider_used, created_at) VALUES (?, ?, ?, ?)`
  ).run(userPrompt, fallbackReply, 'DEMO AI MODE', new Date().toISOString());

  return { reply: fallbackReply, providerLabel: 'DEMO AI MODE' };
}
