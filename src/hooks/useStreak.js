import { useState, useEffect } from 'react'

export function useStreak() {
  const [streak, setStreak] = useState(1)

  useEffect(() => {
    // POST on load — server computes and persists the new streak
    fetch('/api/streak', { method: 'POST' })
      .then((res) => res.json())
      .then(({ streak }) => setStreak(streak))
      .catch(() => {
        // Fall back to localStorage if API is unavailable
        const today = new Date().toISOString().slice(0, 10)
        const lastVisit = localStorage.getItem('lastVisitDate')
        const stored = parseInt(localStorage.getItem('streakCount') || '0', 10)
        let newStreak = 1
        if (lastVisit === today) {
          newStreak = stored || 1
        } else if (lastVisit) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yStr = yesterday.toISOString().slice(0, 10)
          newStreak = lastVisit === yStr ? (stored || 1) + 1 : 1
        }
        localStorage.setItem('lastVisitDate', today)
        localStorage.setItem('streakCount', String(newStreak))
        setStreak(newStreak)
      })
  }, [])

  return streak
}
