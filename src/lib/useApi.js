import { useState, useEffect, useRef } from 'react'
import { api } from './api'

export function useApi(table, params = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const paramsRef = useRef(JSON.stringify(params))

  const paramsKey = JSON.stringify(params)
  if (paramsKey !== paramsRef.current) paramsRef.current = paramsKey

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const result = await api.getAll(table, params)
        if (!cancelled) {
          setData(result.filter((i) => i.visible !== 0))
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, paramsRef.current])

  return { data, loading, error }
}
