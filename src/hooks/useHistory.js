import { useState, useMemo, useCallback } from 'react'

const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const stripCloze = (text) => text.replace(/\{\{c\d+::(.*?)(?:::.*?)?\}\}/g, '$1')

export function useHistory() {
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchHistory = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/completion')
      .then(r => r.json())
      .then(({ completions, error }) => {
        if (error) throw new Error(error)
        setCompletions(completions ?? [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return completions
    const q = query.toLowerCase()
    return completions.filter(c => {
      const frontText = stripCloze(stripHtml(c.front)).toLowerCase()
      const tagText = (c.tags ?? []).map(t => t.split('::').pop()).join(' ').toLowerCase()
      return frontText.includes(q) || tagText.includes(q) || c.date.includes(q)
    })
  }, [completions, query])

  const grouped = useMemo(() => {
    const map = {}
    for (const c of filtered) {
      if (!map[c.date]) map[c.date] = []
      map[c.date].push(c)
    }
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({ date, items }))
  }, [filtered])

  return {
    completions,
    loading,
    error,
    query,
    setQuery,
    filtered,
    grouped,
    fetchHistory,
    refetch: fetchHistory,
  }
}
