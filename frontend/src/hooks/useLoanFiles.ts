import { useState, useEffect, useCallback } from 'react'
import { LoanFile } from '../services/db'
import { getLoanFiles, getLoanFileById, createLoanFile, updateLoanFileStage, updateLoanFileDocuments } from '../services/loanFiles'

export function useLoanFiles() {
  const [loanFiles, setLoanFiles] = useState<LoanFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoanFiles = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLoanFiles()
      setLoanFiles(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loan files')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLoanFiles()
  }, [fetchLoanFiles])

  const addLoanFile = async (input: Omit<LoanFile, 'id' | 'documents' | 'disbursedAt'>) => {
    const newFile = await createLoanFile(input);
    setLoanFiles(prev => [newFile, ...prev]);
    return newFile;
  }

  const updateStage = async (id: number, stage: LoanFile['stage']) => {
    const updated = await updateLoanFileStage(id, stage);
    if (updated) {
      setLoanFiles(prev => prev.map(f => f.id === id ? updated : f));
    }
    return updated;
  }

  return { loanFiles, loading, error, refetch: fetchLoanFiles, addLoanFile, updateStage }
}

export function useLoanFileDetail(id: number) {
  const [loanFile, setLoanFile] = useState<LoanFile | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoanFile = useCallback(async () => {
    if (isNaN(id)) return;
    try {
      setLoading(true)
      const data = await getLoanFileById(id)
      setLoanFile(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loan file detail')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchLoanFile()
  }, [fetchLoanFile])

  const updateStage = async (stage: LoanFile['stage']) => {
    const updated = await updateLoanFileStage(id, stage);
    if (updated) {
      setLoanFile(updated);
    }
    return updated;
  }

  const updateDocs = async (docs: Record<string, boolean>) => {
    const updated = await updateLoanFileDocuments(id, docs);
    if (updated) {
      setLoanFile(updated);
    }
    return updated;
  }

  return { loanFile, loading, error, refetch: fetchLoanFile, updateStage, updateDocs }
}
