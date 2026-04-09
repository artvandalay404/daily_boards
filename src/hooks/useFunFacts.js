import { useState, useCallback, useRef } from 'react'
import { streamFunFacts } from '../utils/anthropic'

export function useFunFacts() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const calledRef = useRef(false)

  const fetch = useCallback((card) => {
    if (calledRef.current) return
    calledRef.current = true
    setLoading(true)
    setText('')
    setDone(false)
    setError(null)

    streamFunFacts(
      card,
      (chunk) => setText((prev) => prev + chunk),
      () => {
        setLoading(false)
        setDone(true)
      },
      (err) => {
        setLoading(false)
        setError(err.message)
      }
    )
  }, [])

  const reset = useCallback(() => {
    calledRef.current = false
    setText('')
    setLoading(false)
    setDone(false)
    setError(null)
  }, [])

  return { text, loading, done, error, fetch, reset }
}
