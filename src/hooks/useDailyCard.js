import { useState, useEffect } from 'react'
import { getTodaysCard } from '../utils/cardSelector'

export function useDailyCard(offset = 0) {
  const [allCards, setAllCards] = useState(null)
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/cards.json')
      .then((res) => {
        if (!res.ok) throw new Error('cards.json not found')
        return res.json()
      })
      .then((cards) => {
        if (!cards.length) throw new Error('No cards found')
        setAllCards(cards)
        setCard(getTodaysCard(cards, offset))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (allCards) setCard(getTodaysCard(allCards, offset))
  }, [offset, allCards])

  return { card, loading, error }
}
