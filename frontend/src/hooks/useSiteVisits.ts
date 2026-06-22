import { useState, useEffect, useCallback } from 'react'
import { SiteVisit } from '../services/db'
import { getSiteVisits, createSiteVisit } from '../services/siteVisits'

export function useSiteVisits() {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSiteVisits = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getSiteVisits()
      setSiteVisits(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch site visits')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSiteVisits()
  }, [fetchSiteVisits])

  const addSiteVisit = async (input: Omit<SiteVisit, 'id'>) => {
    const newVisit = await createSiteVisit(input);
    setSiteVisits(prev => [newVisit, ...prev]);
    return newVisit;
  }

  return { siteVisits, loading, error, refetch: fetchSiteVisits, addSiteVisit }
}
