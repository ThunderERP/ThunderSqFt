import { useState, useEffect, useCallback } from 'react'
import { Lead } from '../services/db'
import { getLeads, getLeadById, createLead, updateLeadFollowUp } from '../services/leads'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLeads()
      setLeads(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const addLead = async (input: Omit<Lead, 'id' | 'loadScore' | 'LastFollowUpAt' | 'callNotes' | 'createdAt'>) => {
    const newLead = await createLead(input);
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  }

  const updateFollowUp = async (id: number, nextDate: string | null, note?: string) => {
    const updated = await updateLeadFollowUp(id, nextDate, note);
    if (updated) {
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
    }
    return updated;
  }

  return { leads, loading, error, refetch: fetchLeads, addLead, updateFollowUp }
}

export function useLeadDetail(id: number) {
  const [lead, setLead] = useState<Lead | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLead = useCallback(async () => {
    if (isNaN(id)) return;
    try {
      setLoading(true)
      const data = await getLeadById(id)
      setLead(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lead detail')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const updateFollowUp = async (nextDate: string | null, note?: string) => {
    const updated = await updateLeadFollowUp(id, nextDate, note);
    if (updated) {
      setLead(updated);
    }
    return updated;
  }

  return { lead, loading, error, refetch: fetchLead, updateFollowUp }
}
