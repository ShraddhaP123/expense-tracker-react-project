const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile';

export function canGenerateCoachNarrative() {
  return Boolean(GROQ_API_KEY);
}

export async function generateCoachNarrative(input) {
  if (!canGenerateCoachNarrative()) {
    return { text: null, model: null };
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: [
            'You are a concise monthly money coach.',
            'Use only the provided summary facts.',
            'Do not invent numbers, transactions, or recommendations.',
            'Write four short labeled lines: Changed, Good, Watch, Action.',
            'Keep the tone supportive and specific.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || payload.error || 'Groq narrative request failed');
  }

  return {
    text: payload.choices?.[0]?.message?.content?.trim() || null,
    model: GROQ_MODEL,
  };
}
