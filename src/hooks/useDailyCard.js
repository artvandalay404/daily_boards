import { useState, useEffect } from 'react'

export function useDailyCard(offset = 0) {
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/card?offset=${offset}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load card')
        return res.json()
      })
      .then(({ card, error }) => {
        if (error) throw new Error(error)
        setCard(card)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [offset])

  return { card, loading, error }
}
