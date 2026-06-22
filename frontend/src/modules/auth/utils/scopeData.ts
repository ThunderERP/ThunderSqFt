import { CurrentUser } from '../types'

interface ScopableRecord {
  branch?: string
  city?: string
  teamId?: string
  assignedExecutive?: string    // leads
  loanCoordinator?: string       // loan files
  salesExecutive?: string        // loan files / bookings
  assignedTo?: string            // tasks
  executive?: string             // site visits
  employeeName?: string          // leave requests
}

const EXECUTIVE_TEAMS: Record<string, string> = {
  'Rahul Sharma': 'Team-A',
  'Sneha Kapoor': 'Team-A',
  'Priya Sen': 'Team-A',
  'Vikram Singhal': 'Team-B',
  'Priya Mehta': 'Team-B',
  'Amit Verma': 'Team-C',
  'Vikram Singh': 'Team-D',
  'Rohan Gupta': 'Team-E',
  'Nisha Patel': 'Team-E',
  'Kavya Joshi': 'Team-F'
}

const EMPLOYEE_BRANCH_TEAMS: Record<string, { branch: string; teamId: string }> = {
  'Rahul Sharma': { branch: 'Mumbai', teamId: 'Team-A' },
  'Sneha Kapoor': { branch: 'Mumbai', teamId: 'Team-A' },
  'Priya Sen': { branch: 'Mumbai', teamId: 'Team-A' },
  'Vikram Singhal': { branch: 'Mumbai', teamId: 'Team-B' },
  'Priya Mehta': { branch: 'Pune', teamId: 'Team-B' },
  'Amit Verma': { branch: 'Bangalore', teamId: 'Team-C' },
  'Vikram Singh': { branch: 'Hyderabad', teamId: 'Team-D' },
  'Rohan Gupta': { branch: 'Delhi', teamId: 'Team-E' },
  'Nisha Patel': { branch: 'Gurugram', teamId: 'Team-E' },
  'Kavya Joshi': { branch: 'Dubai', teamId: 'Team-F' }
}

export function isRecordVisibleTo<T extends ScopableRecord>(record: T, user: CurrentUser): boolean {
  if (user.role === 'CEO' || user.role === 'Admin') return true
  
  // Resolve employee metadata if employeeName is present
  if (record.employeeName) {
    const profile = EMPLOYEE_BRANCH_TEAMS[record.employeeName]
    if (profile) {
      if (user.role === 'BranchManager') {
        return profile.branch.toLowerCase() === user.branch?.toLowerCase()
      }
      if (user.role === 'TeamLeader') {
        if (user.teamId === 'team-mumbai-1' && profile.teamId === 'Team-A') return true
        return profile.teamId === user.teamId
      }
      if (user.role === 'SalesExecutive' || user.role === 'BankingExecutive') {
        return record.employeeName === user.name
      }
    }
  }

  if (user.role === 'BranchManager') {
    const recordBranch = record.branch || record.city
    return recordBranch?.toLowerCase() === user.branch?.toLowerCase()
  }
  
  if (user.role === 'TeamLeader') {
    if (record.teamId && record.teamId === user.teamId) return true
    
    // Also match based on executive team mapping
    const execName = record.assignedExecutive || record.salesExecutive || record.loanCoordinator || record.assignedTo || record.executive
    if (execName) {
      const execTeam = EXECUTIVE_TEAMS[execName]
      if (execTeam) {
        // Map 'team-mumbai-1' of the TeamLeader to 'Team-A' in mock data
        if (user.teamId === 'team-mumbai-1' && execTeam === 'Team-A') return true
        if (execTeam === user.teamId) return true
      }
    }
    return false
  }
  
  if (user.role === 'SalesExecutive') {
    return (
      record.assignedExecutive === user.name ||
      record.salesExecutive === user.name ||
      record.assignedTo === user.name ||
      record.executive === user.name ||
      record.employeeName === user.name
    )
  }
  
  if (user.role === 'BankingExecutive') {
    return (
      record.loanCoordinator === user.name ||
      record.salesExecutive === user.name ||
      record.assignedTo === user.name ||
      record.executive === user.name ||
      record.employeeName === user.name
    )
  }
  
  return false
}

export function scopeRecords<T extends ScopableRecord>(records: T[], user: CurrentUser): T[] {
  return records.filter(record => isRecordVisibleTo(record, user))
}
