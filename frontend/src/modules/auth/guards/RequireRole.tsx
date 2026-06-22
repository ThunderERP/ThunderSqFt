import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

interface RequireRoleProps {
  allow: UserRole[]
  children: React.ReactNode
}

export function getDefaultRoute(role: UserRole): string {
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

export default function RequireRole({ allow, children }: RequireRoleProps) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/crm/leads" replace />
  }

  if (!allow.includes(currentUser.role)) {
    const defaultRoute = getDefaultRoute(currentUser.role)
    return <Navigate to={defaultRoute} replace />
  }

  return <>{children}</>
}
