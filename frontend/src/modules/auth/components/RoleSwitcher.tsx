import { useState } from 'react'
import { useAuth, MOCK_USERS } from '../context/AuthContext'
import { UserRole } from '../types'

const ROLE_LABELS: Record<UserRole, string> = {
  CEO: 'CEO', 
  Admin: 'Admin', 
  BranchManager: 'Branch Manager',
  TeamLeader: 'Team Leader', 
  SalesExecutive: 'Sales Executive', 
  BankingExecutive: 'Banking Executive',
}

export function RoleSwitcher() {
  const { currentUser, setCurrentUser } = useAuth()
  const [open, setOpen] = useState(false)

  // Style plainly — small monospace text button, no color, no pill/badge shape.
  // This is a dev/QA tool sitting on top of the product, not a feature of the product.
  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, fontFamily: 'monospace', fontSize: 12, zIndex: 1000 }}>
      <button 
        onClick={() => setOpen(o => !o)} 
        style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 6, 
          padding: '6px 10px', 
          color: 'var(--ink-soft)',
          cursor: 'pointer'
        }}
      >
        viewing as: {ROLE_LABELS[currentUser.role]}
      </button>
      {open && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '100%', 
            right: 0, 
            marginBottom: 4, 
            background: 'var(--surface)', 
            border: '1px solid var(--hairline)', 
            borderRadius: 6, 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {Object.keys(MOCK_USERS).map(role => (
            <button
              key={role}
              onClick={() => { setCurrentUser(MOCK_USERS[role as UserRole]); setOpen(false) }}
              style={{ 
                display: 'block', 
                width: '100%', 
                textAlign: 'left', 
                padding: '6px 12px', 
                border: 'none',
                background: role === currentUser.role ? 'var(--canvas)' : 'transparent', 
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: 11
              }}
            >
              {ROLE_LABELS[role as UserRole]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
