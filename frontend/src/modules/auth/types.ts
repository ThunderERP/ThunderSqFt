export type UserRole = 'CEO' | 'Admin' | 'BranchManager' | 'TeamLeader' | 'SalesExecutive' | 'BankingExecutive'

export interface CurrentUser {
  id: string
  name: string
  role: UserRole
  branch?: string    // undefined for CEO/Admin — they aren't branch-scoped
  teamId?: string     // set for TeamLeader and the members of their team
}

// A capability model, not a route allowlist. Pages and buttons check capabilities,
// not role names directly.
export type Capability =
  | 'view:ceo-dashboard'
  | 'view:manager-dashboard'
  | 'view:all-branches'
  | 'view:own-branch-only'
  | 'view:own-team-only'
  | 'view:own-records-only'
  | 'manage:leads:all'
  | 'manage:leads:own'
  | 'manage:loan-files:all'
  | 'manage:loan-files:own'
  | 'approve:leave-requests'
  | 'view:commission-data'
  | 'view:employee-directory'
  | 'view:hr-performance'
  | 'assign:tasks'
  | 'manage:users'
  | 'view:loan-files' // Add capability to view loan files route

export const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
  CEO: [
    'view:ceo-dashboard',
    'view:manager-dashboard',
    'view:all-branches',
    'manage:leads:all',
    'manage:loan-files:all',
    'approve:leave-requests',
    'view:commission-data',
    'view:employee-directory',
    'view:hr-performance',
    'assign:tasks',
    'manage:users',
    'view:loan-files'
  ],
  Admin: [
    'view:ceo-dashboard',
    'view:manager-dashboard',
    'view:all-branches',
    'manage:leads:all',
    'manage:loan-files:all',
    'approve:leave-requests',
    'view:commission-data',
    'view:employee-directory',
    'view:hr-performance',
    'assign:tasks',
    'manage:users',
    'view:loan-files'
  ],
  BranchManager: [
    'view:manager-dashboard',
    'view:own-branch-only',
    'manage:leads:all',
    'manage:loan-files:all',
    'approve:leave-requests',
    'view:employee-directory',
    'view:hr-performance',
    'assign:tasks',
    'view:loan-files'
  ],
  TeamLeader: [
    'view:manager-dashboard',
    'view:own-team-only',
    'manage:leads:all',
    'manage:loan-files:all',
    'assign:tasks',
    'view:loan-files'
  ],
  SalesExecutive: [
    'view:own-records-only',
    'manage:leads:own'
  ],
  BankingExecutive: [
    'view:own-records-only',
    'manage:loan-files:own',
    'view:loan-files'
  ],
}

export function hasCapability(role: UserRole, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role]?.includes(capability) || false
}
