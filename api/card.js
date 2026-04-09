export const config = { runtime: 'edge' }

function fnv1a(str) {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  return hash
}

export default async function handler(req) {
  const url = new URL(req.url)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)

  try {
    const cardsUrl = new URL('/cards.json', url.origin)
    const res = await fetch(cardsUrl.toString())
    if (!res.ok) throw new Error('cards.json not found')
    const cards = await res.json()

    const today = new Date().toISOString().slice(0, 10)
    const index = (fnv1a(today) + offset) % cards.length
    const card = cards[index]

    return new Response(JSON.stringify({ card }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
