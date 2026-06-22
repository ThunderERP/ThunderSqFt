import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from './layouts/AppLayout'
import FinanceLayout from './layouts/FinanceLayout'
import { RoleProvider, useRole, VisibilityConfig, defaultRouteByRole } from './context/RoleContext'
import { AuthProvider } from './modules/auth/context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'sonner'

// Gating Component for routes based on visible modules
function RequireModule({ module, children }: { module: keyof VisibilityConfig; children: React.ReactNode }) {
  const { isModuleVisible, activeRole } = useRole()
  if (!isModuleVisible(module)) {
    return <Navigate to={defaultRouteByRole[activeRole]} replace />
  }
  return <>{children}</>
}

// Redirect root index based on role
function RootIndexRedirect() {
  const { activeRole } = useRole()
  return <Navigate to={defaultRouteByRole[activeRole]} replace />
}

// Lazy-loaded CEO pages
const CEODashboard = lazy(() => import('./modules/ceo/pages/dashboard'))
const BranchComparison = lazy(() => import('./modules/ceo/pages/branch-comparison'))

// Lazy-loaded Manager Dashboard
const ManagerDashboard = lazy(() => import('./modules/manager/pages/dashboard'))

// Lazy-loaded Sales CRM page components
const CRMDashboard = lazy(() => import('./modules/sales/pages/dashboard'))
const LeadList = lazy(() => import('./modules/sales/pages/leads'))
const LeadDetail = lazy(() => import('./modules/sales/pages/lead-detail'))
const SiteVisits = lazy(() => import('./modules/sales/pages/site-visits'))
const Bookings = lazy(() => import('./modules/sales/pages/bookings'))
const FollowUps = lazy(() => import('./modules/sales/pages/follow-ups'))

// Lazy-loaded Banking page components
const Loans = lazy(() => import('./modules/banking/pages/loans'))
const LoanFiles = lazy(() => import('./modules/banking/pages/loan-files'))
const LoanFileDetail = lazy(() => import('./modules/banking/pages/loan-file-detail'))
const Banks = lazy(() => import('./modules/banking/pages/banks'))
const PendingTracker = lazy(() => import('./modules/banking/pages/pending-tracker'))

// Lazy-loaded HR page components
const Directory = lazy(() => import('./modules/hr/pages/directory'))
const Leaves = lazy(() => import('./modules/hr/pages/leaves'))
const Leave = lazy(() => import('./modules/hr/pages/leave'))
const Attendance = lazy(() => import('./modules/hr/pages/attendance'))
const Performance = lazy(() => import('./modules/hr/pages/performance'))

// Lazy-loaded Unified Dashboard
const UnifiedDashboard = lazy(() => import('./modules/dashboard/pages/home'))

// Lazy-loaded Tasks
const Tasks = lazy(() => import('./modules/tasks/pages/tasks'))

// Lazy-loaded Automation Center
const Automation = lazy(() => import('./modules/automation/pages/automation'))
const Triggers = lazy(() => import('./modules/automation/pages/triggers'))

// Lazy-loaded Settings
const Preferences = lazy(() => import('./modules/settings/pages/preferences'))

// Lazy-loaded Finance pages
const FinanceDashboard = lazy(() => import('./modules/finance/pages/dashboard'))
const Salary = lazy(() => import('./modules/finance/pages/salary'))
const Cashflow = lazy(() => import('./modules/finance/pages/cashflow'))
const FinancialReports = lazy(() => import('./modules/finance/pages/financial-reports'))
const Invoices = lazy(() => import('./modules/finance/pages/invoices'))
const Expenses = lazy(() => import('./modules/finance/pages/expenses'))
const Accounts = lazy(() => import('./modules/finance/pages/accounts'))
const Receivables = lazy(() => import('./modules/finance/pages/receivables'))
const Payables = lazy(() => import('./modules/finance/pages/payables'))
const Reports = lazy(() => import('./modules/finance/pages/reports'))

function PageLoader() {
  return (
    <div className="w-full h-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <div className="h-6 bg-[var(--ink)]/10 w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-[var(--ink)]/10 w-64 animate-pulse"></div>
        </div>
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 neu-card animate-pulse"></div>
        ))}
      </div>
      
      {/* Content Area Skeleton */}
      <div className="h-96 neu-card animate-pulse"></div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <ThemeProvider>
            <Toaster richColors position="top-right" />
            <Routes>
              <Route path="/" element={<AppLayout />}>
                {/* Unified general dashboard */}
                <Route index element={<Suspense fallback={<PageLoader />}><UnifiedDashboard /></Suspense>} />
              
                {/* CEO Command Center */}
                <Route 
                  path="ceo" 
                  element={
                    <RequireModule module="ceo">
                      <Suspense fallback={<PageLoader />}><CEODashboard /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="ceo/branches" 
                  element={
                    <RequireModule module="ceo">
                      <Suspense fallback={<PageLoader />}><BranchComparison /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Manager Dashboard */}
                <Route 
                  path="manager" 
                  element={
                    <RequireModule module="manager">
                      <Suspense fallback={<PageLoader />}><ManagerDashboard /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Sales CRM Group */}
                <Route 
                  path="sales/dashboard" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><CRMDashboard /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="sales/leads" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><LeadList /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="sales/leads/:leadId" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><LeadDetail /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="sales/follow-ups" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><FollowUps /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="sales/visits" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><SiteVisits /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="sales/bookings" 
                  element={
                    <RequireModule module="salesCrm">
                      <Suspense fallback={<PageLoader />}><Bookings /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Banking CRM Group */}
                <Route 
                  path="banking/loans" 
                  element={
                    <RequireModule module="bankingCrm">
                      <Suspense fallback={<PageLoader />}><Loans /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="banking/loan-files" 
                  element={
                    <RequireModule module="bankingCrm">
                      <Suspense fallback={<PageLoader />}><LoanFiles /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="banking/loan-files/:id" 
                  element={
                    <RequireModule module="bankingCrm">
                      <Suspense fallback={<PageLoader />}><LoanFileDetail /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="banking/banks" 
                  element={
                    <RequireModule module="bankingCrm">
                      <Suspense fallback={<PageLoader />}><Banks /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="banking/pending-tracker" 
                  element={
                    <RequireModule module="bankingCrm">
                      <Suspense fallback={<PageLoader />}><PendingTracker /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* HR Module Group */}
                <Route 
                  path="hr/directory" 
                  element={
                    <RequireModule module="hr">
                      <Suspense fallback={<PageLoader />}><Directory /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="hr/leave" 
                  element={
                    <RequireModule module="hr">
                      <Suspense fallback={<PageLoader />}><Leave /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="hr/leaves" 
                  element={
                    <RequireModule module="hr">
                      <Suspense fallback={<PageLoader />}><Leaves /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="hr/attendance" 
                  element={
                    <RequireModule module="hr">
                      <Suspense fallback={<PageLoader />}><Attendance /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="hr/performance" 
                  element={
                    <RequireModule module="hr">
                      <Suspense fallback={<PageLoader />}><Performance /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Tasks Management Route */}
                <Route 
                  path="tasks" 
                  element={
                    <RequireModule module="tasks">
                      <Suspense fallback={<PageLoader />}><Tasks /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Automation Center Routes */}
                <Route 
                  path="automation" 
                  element={
                    <RequireModule module="automation">
                      <Suspense fallback={<PageLoader />}><Automation /></Suspense>
                    </RequireModule>
                  } 
                />
                <Route 
                  path="automation/triggers" 
                  element={
                    <RequireModule module="automation">
                      <Suspense fallback={<PageLoader />}><Triggers /></Suspense>
                    </RequireModule>
                  } 
                />

                {/* Settings Route (Available to all authenticated users) */}
                <Route 
                  path="settings" 
                  element={
                    <Suspense fallback={<PageLoader />}><Preferences /></Suspense>
                  } 
                />

                {/* Finance Suite — nested inside FinanceLayout */}
                <Route element={
                  <RequireModule module="finance">
                    <FinanceLayout />
                  </RequireModule>
                }>
                  <Route path="finance" element={<Suspense fallback={<PageLoader />}><FinanceDashboard /></Suspense>} />
                  <Route path="finance/salary" element={<Suspense fallback={<PageLoader />}><Salary /></Suspense>} />
                  <Route path="finance/cashflow" element={<Suspense fallback={<PageLoader />}><Cashflow /></Suspense>} />
                  <Route path="finance/financial-reports" element={<Suspense fallback={<PageLoader />}><FinancialReports /></Suspense>} />
                  <Route path="finance/invoices" element={<Suspense fallback={<PageLoader />}><Invoices /></Suspense>} />
                  <Route path="finance/expenses" element={<Suspense fallback={<PageLoader />}><Expenses /></Suspense>} />
                  <Route path="finance/accounts" element={<Suspense fallback={<PageLoader />}><Accounts /></Suspense>} />
                  <Route path="finance/receivables" element={<Suspense fallback={<PageLoader />}><Receivables /></Suspense>} />
                  <Route path="finance/payables" element={<Suspense fallback={<PageLoader />}><Payables /></Suspense>} />
                  <Route path="finance/reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />
                </Route>

              </Route>
              {/* Catch-all route redirects back to index */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ThemeProvider>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
