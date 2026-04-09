export const config = { runtime: 'edge' }

function buildPrompt(card) {
  const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const stripCloze = (text) => text.replace(/\{\{c\d+::(.*?)\}\}/g, '$1')
  const front = stripCloze(stripHtml(card.front))
  const back = stripCloze(stripHtml(card.back))

  return `You are a fun, enthusiastic medical tutor helping a medical student named Samhi study for USMLE Step 1.

Given this flashcard:
FRONT: ${front}
BACK: ${back}

Please generate:
1. **Fun Facts** — Two or three genuinely surprising or delightful facts about this topic that go beyond what the card says
2. **Bottom Line** — One memorable mnemonic or clinical pearl to make this stick
3. **Go Deeper** — One or two links to real articles (PubMed, NEJM, Nature Medicine, etc.) that are actually interesting — only include links you are highly confident exist

Keep it conversational, warm, and a little playful. Use Samhi's name once naturally. No excessive jargon. Use markdown formatting. Do not use emojis.`
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
      max_tokens: 1000,
      stream: true,
      messages: [{ role: 'user', content: buildPrompt(card) }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    return new Response(text, { status: response.status })
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
