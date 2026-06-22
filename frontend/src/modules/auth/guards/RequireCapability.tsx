import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Capability } from '../types'

interface Props {
  capability: Capability
  children: React.ReactNode
}

// Wraps a route's element. If the signed-in user lacks the capability, redirect them
// to their own default landing route rather than showing a blank or error page.
export function RequireCapability({ capability, children }: Props) {
  const { currentUser, can } = useAuth()
  if (!can(capability)) {
    return <Navigate to={getDefaultRouteFor(currentUser.role)} replace />
  }
  return <>{children}</>
}

export function getDefaultRouteFor(role: string): string {
  switch (role) {
    case 'CEO':
    case 'Admin':
      return '/dashboard/ceo'
    case 'BranchManager':
    case 'TeamLeader':
      return '/dashboard/manager'
    case 'SalesExecutive':
      return '/crm/leads'
    case 'BankingExecutive':
      return '/banking/loan-files'
    default:
      return '/crm/leads'
  }
}
