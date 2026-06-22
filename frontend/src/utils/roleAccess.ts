import { UserRole } from '../contexts/RoleContext'

export const MODULE_ACCESS: Record<string, UserRole[]> = {
  'sales-crm':   ['CEO', 'Branch Manager', 'Team Leader', 'Sales Executive', 'Admin'],
  'banking-crm': ['CEO', 'Branch Manager', 'Banking Executive', 'Admin'],
  'manager':     ['Branch Manager', 'Team Leader', 'Admin'],
  'ceo':         ['CEO', 'Admin'],
  'tasks':       ['CEO', 'Branch Manager', 'Team Leader', 'Sales Executive', 'Banking Executive', 'Admin'],
  'hr':          ['Admin'],
  'automation':  ['Admin'],
}

export function hasAccess(module: string, role: UserRole): boolean {
  return MODULE_ACCESS[module]?.includes(role) ?? false
}
