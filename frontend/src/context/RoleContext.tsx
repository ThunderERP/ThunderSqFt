import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, MOCK_USERS } from '../modules/auth/context/AuthContext'
import { UserRole } from '../modules/auth/types'

export type Role = 'ceo' | 'manager' | 'leader' | 'sales' | 'banking' | 'admin';

export interface VisibilityConfig {
  manager: boolean;
  ceo: boolean;
  salesCrm: boolean;
  bankingCrm: boolean;
  tasks: boolean;
  hr: boolean;
  automation: boolean;
  finance: boolean;
}

export const roleVisibility: Record<Role, VisibilityConfig> = {
  ceo:     { manager: true,  ceo: true,  salesCrm: true,  bankingCrm: true,  tasks: true, hr: true,  automation: true,  finance: true  },
  manager: { manager: true,  ceo: false, salesCrm: true,  bankingCrm: true,  tasks: true, hr: true,  automation: true,  finance: false },
  leader:  { manager: true,  ceo: false, salesCrm: true,  bankingCrm: false, tasks: true, hr: false, automation: false, finance: false },
  sales:   { manager: false, ceo: false, salesCrm: true,  bankingCrm: false, tasks: true, hr: false, automation: false, finance: false },
  banking: { manager: false, ceo: false, salesCrm: false, bankingCrm: true,  tasks: true, hr: false, automation: false, finance: false },
  admin:   { manager: true,  ceo: false, salesCrm: true,  bankingCrm: true,  tasks: true, hr: true,  automation: true,  finance: true  },
};

export const defaultRouteByRole: Record<Role, string> = {
  ceo: '/ceo',
  manager: '/manager',
  admin: '/manager',
  leader: '/sales/dashboard',
  sales: '/sales/dashboard',
  banking: '/banking/loans',
};

interface RoleContextValue {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isModuleVisible: (module: keyof VisibilityConfig) => boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('thunder_erp_role');
    return (saved as Role) || 'ceo';
  });

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const roleMapping: Record<Role, UserRole> = {
      ceo: 'CEO',
      manager: 'BranchManager',
      leader: 'TeamLeader',
      sales: 'SalesExecutive',
      banking: 'BankingExecutive',
      admin: 'Admin'
    };
    setCurrentUser(MOCK_USERS[roleMapping[activeRole]]);
  }, [activeRole, setCurrentUser]);

  const navigate = useNavigate();
  const location = useLocation();

  const isModuleVisible = (module: keyof VisibilityConfig) => {
    return roleVisibility[activeRole][module];
  };

  const setActiveRole = (role: Role) => {
    localStorage.setItem('thunder_erp_role', role);
    setActiveRoleState(role);

    // // TODO(Phase 2): enforce server-side gating of routes
    const defaultRoute = defaultRouteByRole[role];
    
    // Check if the current route is still accessible
    const currentPath = location.pathname;
    let isCurrentAllowed = true;

    if (currentPath.startsWith('/ceo') && !roleVisibility[role].ceo) isCurrentAllowed = false;
    else if (currentPath.startsWith('/manager') && !roleVisibility[role].manager) isCurrentAllowed = false;
    else if (currentPath.startsWith('/sales') && !roleVisibility[role].salesCrm) isCurrentAllowed = false;
    else if (currentPath.startsWith('/banking') && !roleVisibility[role].bankingCrm) isCurrentAllowed = false;
    else if (currentPath.startsWith('/tasks') && !roleVisibility[role].tasks) isCurrentAllowed = false;
    else if (currentPath.startsWith('/hr') && !roleVisibility[role].hr) isCurrentAllowed = false;
    else if (currentPath.startsWith('/automation') && !roleVisibility[role].automation) isCurrentAllowed = false;
    else if (currentPath.startsWith('/finance') && !roleVisibility[role].finance) isCurrentAllowed = false;

    if (!isCurrentAllowed) {
      navigate(defaultRoute);
    }
  };

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, isModuleVisible }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
