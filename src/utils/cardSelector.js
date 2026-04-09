function fnv1a(str) {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  return hash
}

export function getTodaysCard(cards, offset = 0) {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const index = (fnv1a(today) + offset) % cards.length
  return cards[index]
}
