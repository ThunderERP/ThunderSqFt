import { LoanFile, employeesDb } from '../../../services/db'

export interface PendingCounts {
  stuckCases: number
  pdPending: number
  docPending: number
  loginPending: number
  sanctionPending: number
  registrationPending: number
  disbursementPending: number
}

export function computePendingCounts(files: LoanFile[]): PendingCounts {
  let stuckCases = 0
  let pdPending = 0
  let docPending = 0
  let loginPending = 0
  let sanctionPending = 0
  let registrationPending = 0
  let disbursementPending = 0

  files.forEach(file => {
    // Simulated stuck case: Rajesh Kumar's file (id: 1) is stuck in PD Pending
    if (file.stage !== 'Disbursed' && file.id === 1) {
      stuckCases++
    }

    // count files at each stage from the live array using PRD stage enums
    switch (file.stage) {
      case 'PD Pending':
        pdPending++
        break
      case 'Doc Pending':
        docPending++
        break
      case 'Login Pending':
      case 'Credit Query':
        loginPending++
        break
      case 'Sanctioned':
      case 'Approved':
        sanctionPending++
        break
      case 'Registered':
        registrationPending++
        break
      case 'Disbursed':
        // Disbursed is the final stage, not counted as pending disbursement
        break
      default:
        break
    }
  })

  return {
    stuckCases,
    pdPending,
    docPending,
    loginPending,
    sanctionPending,
    registrationPending,
    disbursementPending
  }
}

export function computePendingCountsByEmployee(files: LoanFile[]): Record<string, PendingCounts> {
  const groups: Record<string, LoanFile[]> = {}
  
  files.forEach(file => {
    const owner = file.loanCoordinatorId || 'Unassigned'
    if (!groups[owner]) {
      groups[owner] = []
    }
    groups[owner].push(file)
  })

  const results: Record<string, PendingCounts> = {}
  for (const [owner, list] of Object.entries(groups)) {
    results[owner] = computePendingCounts(list)
  }

  return results
}

export function computePendingCountsByBranch(files: LoanFile[]): Record<string, PendingCounts> {
  const groups: Record<string, LoanFile[]> = {}

  files.forEach(file => {
    const employee = employeesDb.find(e => e.name === file.loanCoordinatorId)
    const branchName = employee?.branchId || 'Mumbai' // fallback to Mumbai if unknown
    if (!groups[branchName]) {
      groups[branchName] = []
    }
    groups[branchName].push(file)
  })

  const results: Record<string, PendingCounts> = {}
  for (const [branchName, list] of Object.entries(groups)) {
    results[branchName] = computePendingCounts(list)
  }

  return results
}
