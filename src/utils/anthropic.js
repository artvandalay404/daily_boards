export function buildPrompt(card) {
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

export async function fetchClue(card) {
  const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  const stripCloze = (text) => text.replace(/\{\{c\d+::(.*?)\}\}/g, '$1')
  const front = stripCloze(stripHtml(card.front))
  const back = stripCloze(stripHtml(card.back))

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 60,
      messages: [{
        role: 'user',
        content: `You are helping a medical student study for USMLE Step 1.

Give ONE cryptic but genuinely helpful hint for this flashcard (max 15 words). Be playful. Do NOT reveal the answer directly.

Question: ${front}
Answer: ${back}

Reply with ONLY the hint, no preamble, no quotes.`,
      }],
    }),
  })

  if (!response.ok) throw new Error(`API error ${response.status}`)
  const data = await response.json()
  return data.content?.[0]?.text?.trim() ?? 'Think about the mechanism...'
}

export async function streamFunFacts(card, onChunk, onDone, onError) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        stream: true,
        messages: [{ role: 'user', content: buildPrompt(card) }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`API error ${response.status}: ${err}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') continue
        try {
          const json = JSON.parse(data)
          if (json.type === 'content_block_delta' && json.delta?.text) {
            onChunk(json.delta.text)
          }
        } catch {
          // ignore parse errors on non-JSON lines
        }
      }
    }

    onDone()
  } catch (err) {
    onError(err)
  }
}
