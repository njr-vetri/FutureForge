type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function chatComplete(messages: ChatMessage[], fallback: string) {
  const apiKey = process.env.MENTRON_API_KEY || process.env.LLM_API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) return fallback;

  const baseUrl = process.env.MENTRON_BASE_URL || process.env.LLM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
  const model =
    process.env.MENTRON_MODEL ||
    process.env.LLM_MODEL ||
    process.env.NVIDIA_MODEL ||
    'meta/llama-3.1-70b-instruct';

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API Error:', response.status, errorText);
      return fallback;
    }
    const body = await response.json();
    return body?.choices?.[0]?.message?.content || fallback;
  } catch (error) {
    console.error('LLM Network Error:', error);
    return fallback;
  }
}
