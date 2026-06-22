import { useState, useEffect, useCallback } from 'react'
import { Branch } from '../services/db'
import { getBranches } from '../services/branches'

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getBranches()
      setBranches(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch branches')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return { branches, loading, error, refetch: fetchBranches }
}
