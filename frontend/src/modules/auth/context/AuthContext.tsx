import { createContext, useContext, useState, ReactNode } from 'react'
import { CurrentUser, UserRole, Capability, hasCapability } from '../types'

interface AuthContextValue {
  currentUser: CurrentUser
  setCurrentUser: (user: CurrentUser) => void
  can: (capability: Capability) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Mock users — one realistic example per role, used by the RoleSwitcher (Step 5) and
// as the default signed-in user on load.
export const MOCK_USERS: Record<UserRole, CurrentUser> = {
  CEO: { id: 'u1', name: 'Gautam Singhania', role: 'CEO' },
  Admin: { id: 'u2', name: 'Anita Desai', role: 'Admin' },
  BranchManager: { id: 'u3', name: 'Rohan Kapoor', role: 'BranchManager', branch: 'Mumbai' },
  TeamLeader: { id: 'u4', name: 'Priya Mehta', role: 'TeamLeader', branch: 'Mumbai', teamId: 'team-mumbai-1' },
  SalesExecutive: { id: 'u5', name: 'Rahul Sharma', role: 'SalesExecutive', branch: 'Mumbai', teamId: 'team-mumbai-1' },
  BankingExecutive: { id: 'u6', name: 'Sneha Kapoor', role: 'BankingExecutive', branch: 'Mumbai' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(MOCK_USERS.CEO)
  const can = (capability: Capability) => hasCapability(currentUser.role, capability)
  
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
