export const config = { runtime: 'edge' }

function buildCluePrompt(card) {
  const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const stripCloze = (text) => text.replace(/\{\{c\d+::(.*?)\}\}/g, '$1')
  const front = stripCloze(stripHtml(card.front))
  const back = stripCloze(stripHtml(card.back))

  return `You are helping a medical student study for USMLE Step 1.

Give ONE cryptic but genuinely helpful hint for this flashcard (max 15 words). Be playful. Do NOT reveal the answer directly.

Question: ${front}
Answer: ${back}

Reply with ONLY the hint, no preamble, no quotes.`
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { card } = await req.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 60,
      messages: [{ role: 'user', content: buildCluePrompt(card) }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    return new Response(text, { status: response.status })
  }

  const data = await response.json()
  const clue = data.content?.[0]?.text?.trim() ?? 'Think about the underlying mechanism...'
  return new Response(JSON.stringify({ clue }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
