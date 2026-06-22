import { useState, useEffect, useCallback } from 'react'
import { AutomationRule } from '../services/db'
import { getAutomationRules, toggleAutomationRule } from '../services/automationRules'

export function useAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAutomationRules()
      setRules(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch automation rules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const toggleRule = async (id: number) => {
    const updated = await toggleAutomationRule(id);
    if (updated) {
      setRules(prev => prev.map(r => r.id === id ? updated : r));
    }
    return updated;
  }

  return { rules, loading, error, refetch: fetchRules, toggleRule }
}
