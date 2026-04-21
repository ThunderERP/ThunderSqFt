import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import FinanceLayout from './layouts/FinanceLayout'

// Lazy-loaded page components
const Dashboard = lazy(() => import('./modules/finance/pages/dashboard'))
const Salary = lazy(() => import('./modules/finance/pages/salary'))
const Receivables = lazy(() => import('./modules/finance/pages/receivables'))
const Payables = lazy(() => import('./modules/finance/pages/payables'))
const Cashflow = lazy(() => import('./modules/finance/pages/cashflow'))
const FinancialReports = lazy(() => import('./modules/finance/pages/financial-reports'))
const Invoices = lazy(() => import('./modules/finance/pages/invoices'))
const Expenses = lazy(() => import('./modules/finance/pages/expenses'))
const Accounts = lazy(() => import('./modules/finance/pages/accounts'))
const Reports = lazy(() => import('./modules/finance/pages/reports'))

function PageLoader() {
  return (
    <div className="w-full h-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl border border-gray-100 neu-card"></div>
        ))}
      </div>
      
      {/* Content Area Skeleton */}
      <div className="h-[400px] bg-gray-100 rounded-2xl border border-gray-100 neu-card"></div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FinanceLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="salary" element={<Suspense fallback={<PageLoader />}><Salary /></Suspense>} />
          <Route path="receivables" element={<Suspense fallback={<PageLoader />}><Receivables /></Suspense>} />
          <Route path="payables" element={<Suspense fallback={<PageLoader />}><Payables /></Suspense>} />
          <Route path="cashflow" element={<Suspense fallback={<PageLoader />}><Cashflow /></Suspense>} />
          <Route path="financial-reports" element={<Suspense fallback={<PageLoader />}><FinancialReports /></Suspense>} />
          <Route path="invoices" element={<Suspense fallback={<PageLoader />}><Invoices /></Suspense>} />
          <Route path="expenses" element={<Suspense fallback={<PageLoader />}><Expenses /></Suspense>} />
          <Route path="accounts" element={<Suspense fallback={<PageLoader />}><Accounts /></Suspense>} />
          <Route path="reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
