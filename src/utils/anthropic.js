export async function fetchClue(card) {
  const response = await fetch('/api/clue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card }),
  })
  if (!response.ok) throw new Error(`API error ${response.status}`)
  const data = await response.json()
  return data.clue
}

export async function streamFunFacts(card, onChunk, onDone, onError) {
  try {
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card }),
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
      buffer = lines.pop()

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
