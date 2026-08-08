import { useState, useEffect, useCallback } from 'react'
import { api } from './api'

const settingsCache = {}

export function clearSettingsCache(key) {
  if (key) {
    delete settingsCache[key]
  } else {
    Object.keys(settingsCache).forEach((k) => delete settingsCache[k])
  }
}

export function useSettings(section) {
  const [data, setData] = useState(settingsCache[section] || null)
  const [loading, setLoading] = useState(!settingsCache[section])
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getSettings(section)
      const content = section ? result[section] : result
      settingsCache[section] = content
      setData(content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    if (section && !settingsCache[section]) load()
  }, [section, load])

  return { data, loading, error, reload: load }
}

export function useAllSettings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getSettings()
      Object.assign(settingsCache, result)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
