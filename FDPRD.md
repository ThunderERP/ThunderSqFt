**THUNDER ERP**

Frontend Product Requirements \& Antigravity Build Prompt

v1.0 | June 2026 | For Client Presentation

|React + TypeScript|97 Components|6 Role Views|Blueprint Design|
|-|-|-|-|
|Vite · Tailwind · Framer Motion|Pages, shared, CRM, banking, HR|CEO · Manager · Leader · Sales · Banking · Admin|Whiteprint + Cyanotype dual mode|

# 1\. Purpose \& Scope

This document defines the frontend-only requirements for Thunder ERP (product name: PropFlow). The backend NestJS API is complete and unchanged. This PRD covers every fix, refactor, and enhancement needed to bring the React/TypeScript frontend to a client-ready, production-quality standard.

*All work described here is purely inside the /frontend/src directory. No backend routes, controllers, services, or database schemas are touched.*

## 1.1 What Needs to be Fixed (Priority Order)

|Issue|Description|
|-|-|
|Route Duplication|AppRouter.tsx uses finance/Sidebar and finance/TopBar as the global shell — completely wrong. The shared Sidebar and shared TopBar must be the global layout. Finance module has its own sub-layout already (FinanceLayout.tsx).|
|App.css Pollution|App.css contains leftover Vite boilerplate (.hero, .counter, #next-steps etc.). None of it belongs. Must be wiped clean.|
|Duplicate Modules|CEO dashboard exists in 3 places: modules/ceo/, modules/dashboard/, and modules/crm/. Consolidate to single canonical path.|
|TopBar Hardcoded Titles|TopBar uses a static pageTitles record — adding any new route breaks the title. Must be driven by route meta or dynamic.|
|Dark Mode Contrast|Dark mode (Cyanotype) uses white on #002266. Small text at this combo may fail WCAG AA 4.5:1. Audit and fix --ink-soft in dark mode.|
|Missing aria-labels|Icon-only buttons (hamburger, theme toggle) have no aria-label. Chart canvases have no role or aria-label. Must add.|
|Tailwind !important Override|index.css globally overrides Tailwind grey colors via !important — fragile and causes side effects. Replace with Tailwind theme config.|
|Finance Module Isolation|Finance module has its own Sidebar.tsx and TopBar.tsx that duplicate shared components. These must be deleted; finance pages use the shared shell.|

## 1.2 What Gets Enhanced

|Enhancement|Description|
|-|-|
|CEO Dashboard|Add date range selector, branch filter dropdown, and real-time KPI refresh button to the existing charts.|
|Leads Page|Add column sort (click header), bulk status update, and keyboard-accessible modal for Add Lead.|
|Loan Pipeline|Pending Tracker needs a click-through to filter the loans list by the clicked stage.|
|Mobile Responsiveness|Sidebar drawer must trap focus on open. Charts must have a minimum height of 200px on mobile (currently overflow on small screens).|
|Empty States|All list pages need illustrated empty states (float-bounce class already in CSS) for zero-data scenarios.|
|Page Transitions|PageTransition wrapper exists but is not used on all pages. Apply consistently to all page-level components.|
|Settings Page|Preferences page needs to actually persist theme choice to localStorage and apply on reload.|

# 2\. Current Frontend File Structure

The frontend lives entirely at: frontend/src/

|File / Folder|What it is|Action|
|-|-|-|
|src/index.css|Blueprint Design System tokens, component classes, animations, bento grid|KEEP — source of truth for all design tokens|
|src/App.css|Leftover Vite boilerplate — .hero, .counter, .ticks etc.|DELETE all content, leave empty file|
|src/App.tsx|Root app component|Keep, minor cleanup|
|src/routes/AppRouter.tsx|Global route tree — currently broken (uses finance shell globally)|REWRITE — use shared Sidebar + TopBar|
|src/layouts/AppLayout.tsx|Correct layout using shared Sidebar + TopBar + Outlet|This is the correct layout — use it|
|src/layouts/FinanceLayout.tsx|Finance-specific sub-layout|Keep for finance section routes|
|src/context/RoleContext.tsx|Role state + isModuleVisible() gate function|Keep unchanged|
|src/context/ThemeContext.tsx|Dark/light theme toggle with html.dark class|Add localStorage persistence|
|src/modules/shared/|Sidebar, TopBar, PageHeader, Modal, DataTable, StatusBadge, StatCard, MotionComponents, PulseBar, FunnelLine, LedgerCard|Canonical shared components — use these everywhere|
|src/modules/finance/components/Sidebar.tsx|Duplicate of shared Sidebar|DELETE — use shared Sidebar|
|src/modules/finance/components/TopBar.tsx|Duplicate of shared TopBar|DELETE — use shared TopBar|
|src/modules/sales/|leads, lead-detail, follow-ups, site-visits, bookings, dashboard|Primary CRM module — keep + enhance|
|src/modules/banking/|loans, loan-files, loan-file-detail, banks, pending-tracker|Banking CRM — keep + enhance|
|src/modules/ceo/|dashboard, branch-comparison|CANONICAL CEO pages — keep these|
|src/modules/dashboard/|ceo-dashboard, manager-dashboard, RealEstateDashboard, CEODashboardView, etc.|DUPLICATE — delete, redirect to /ceo|
|src/modules/crm/|dashboard, leads, lead-detail, site-visits, executives, executive-detail|DUPLICATE of sales module — audit and remove or absorb|
|src/modules/hr/|directory, leave/leaves, attendance, performance|Keep unchanged|
|src/modules/finance/pages/|dashboard, salary, cashflow, financial-reports, invoices, expenses, accounts, receivables, payables, reports|Keep — wrap in AppLayout + FinanceLayout|
|src/modules/automation/|automation, triggers|Keep unchanged|
|src/modules/settings/|preferences|Add localStorage persistence|

# 3\. Blueprint Design System — Reference

All visual decisions must stay inside the Blueprint Design System already defined in index.css. No new colors, no new fonts, no shadows or gradients. If a CSS variable already exists, use it.

## 3.1 CSS Custom Properties

|Token|Value|Usage|
|-|-|-|
|--paper|Light: #FFFFFF / Dark: #002266|Page and card background|
|--ink|Light: #0033A0 / Dark: #FFFFFF|Primary text and borders|
|--ink-soft|Light: rgba(0,51,160,0.7) / Dark: rgba(255,255,255,0.7)|Secondary text|
|--blueprint-accent|Light: #0055FF / Dark: #66AAFF|Buttons, active states, links|
|--grid-line|rgba(0,51,160,0.15) / rgba(255,255,255,0.15)|Background dot grid|
|--color-success|#10B981|Status: approved, disbursed, present|
|--color-warning|#F59E0B|Status: pending, follow-up, soon|
|--color-error|#EF4444|Status: lost, overdue, absent|
|--color-info|var(--blueprint-accent)|Status: new, contacted, in-progress|

## 3.2 Component Classes (index.css)

|Class|Description|
|-|-|
|.neu-card|Standard card: sharp corners (radius 0), 1px --ink border, no shadow. Use for all content cards.|
|.btn-primary|Primary CTA. Blue fill. Use for Add, Save, Submit actions.|
|.btn-secondary|Outlined secondary button. Use for Cancel, Export, Filter actions.|
|.input-field|Form input with focus ring. Use for all text inputs and selects.|
|.pulse-numeral|IBM Plex Mono + tabular-nums. Use for all monetary values and counts.|
|.bento-grid|4-col responsive grid (→ 2 → 1 on smaller screens). Gap: 24px.|
|.bento-span-{N}|Column span 1–4 for bento grid children.|
|.animate-fade-in|Page-load fade with 8px Y slide. Variants: -delay-1 -delay-2 -delay-3.|
|.anim-row|Row stagger. Set for index-based delay (35ms × N).|
|.anim-card|Card stagger. Set . Delay: 50ms × N.|
|.card-lift|Hover: translateY(-3px). Add to clickable cards.|
|.stat-card|KPI card hover: translateY(-2px). Add to metric cards.|
|.avatar-circle|36px circle for user initials. Scale(1.1) on hover.|
|.tab-active|Active tab indicator: 2px blue bottom border slides in (60% width).|
|.progress-animated|Progress bar fill animation from 0 width. 0.8s cubic-bezier.|
|.badge-pop|New badge appear: scale 0.7 → 1.08 → 1. 0.35s.|
|.float-bounce|Empty state illustration: 6px Y bounce loop. 2.5s infinite.|
|.mono-text|IBM Plex Mono. Use for email addresses, IDs, codes.|
|.page-eyebrow|Section label: 10px bold uppercase tracked. Use above section titles.|
|.hairline-divide|Adds top border to every child after first — for list items.|

## 3.3 Typography

|Role|Font Family|Config|
|-|-|-|
|Headings (h1–h6)|Space Grotesk|font-weight: 600, letter-spacing: -0.02em|
|Body text|Public Sans|Weight 400, -webkit-font-smoothing: antialiased|
|Monetary values|IBM Plex Mono|.pulse-numeral class, tabular-nums variant|
|Email / IDs / code|IBM Plex Mono|.mono-text class|
|Section labels|Public Sans|.page-eyebrow — 10px bold uppercase|

# 4\. Role-Based Access — Frontend

Role gating is handled entirely on the frontend via useRole() hook from RoleContext. The activeRole state determines which NavLinks appear in Sidebar and which data is shown on each page.

## 4.1 Roles \& Module Visibility

|Role|Scope|Gate Logic|
|-|-|-|
|CEO|All modules, all branches, all data|isModuleVisible('ceo') → true only for CEO|
|manager|Sales CRM, Banking, HR — own branch only|isModuleVisible('salesCrm'), 'bankingCrm', 'hr'|
|leader|Sales CRM for own team only|isModuleVisible('salesCrm')|
|sales|Own leads, follow-ups, visits, bookings only|isModuleVisible('salesCrm') — data filtered by assignedExecutiveId|
|banking|Loan files, banks, pending tracker — no CRM, no HR|isModuleVisible('bankingCrm') only|
|admin|All modules + Settings + Audit log|All isModuleVisible() return true|

## 4.2 Data Scoping Rules (Frontend Client-Side — Phase 1)

* CEO / admin / manager / leader → no filter, see all records
* sales role → leads.filter(l => l.assignedExecutiveId === currentUser.name)
* banking role → no CRM data access; only loan-related endpoints
* Preview Role selector in Sidebar lets authorised users switch views without re-login
* Phase 2: move all scoping to backend query params — frontend passes role as header

# 5\. Page Specifications

## 5.1 Global Layout (AppLayout.tsx)

Every page except Finance must render inside AppLayout. AppLayout renders:

* Sidebar (250px fixed, shared/components/Sidebar.tsx) — left panel
* TopBar (72px, shared/components/TopBar.tsx) — sticky header
* <Outlet /> — page content area, max-width 1400px, p-4 md:p-8
* Mobile: Sidebar is a drawer (translate-x-full until open). Hamburger in TopBar triggers it.
* On Sidebar open: add aria-modal='true' and trap focus inside the drawer. ESC closes it.

## 5.2 Sidebar (shared/components/Sidebar.tsx)

Current state is correct. Fix required:

* TopBar titles must not be hardcoded. Instead: Sidebar NavLinks can pass state={{ title, subtitle }} in link state, OR use a routeMeta config object in a shared routes.ts file that both Sidebar and TopBar import.
* Add aria-label to every NavLink: aria-label='Go to Leads'
* Add aria-label to hamburger close button: aria-label='Close navigation'
* Ensure mobile overlay (backdrop div) has role='presentation' and onClick closes drawer

## 5.3 CEO Dashboard (/ceo)

* Canonical file: src/modules/ceo/pages/dashboard.tsx — use this, delete all duplicates
* KPI strip: 6 tiles (Total Leads, Site Visits, Bookings, Revenue ₹, Conversion %, Loan Files). Each tile: .stat-card + .anim-card with --i index.
* Add date range selector (last 7 / 30 / 90 days / custom) — state only, no API call in Phase 1
* Add branch filter dropdown (All Branches + individual branch names) — state filter
* Add refresh button (RefreshCw icon from Lucide) with .anim-rotate spinner on click
* Charts must use <ResponsiveContainer width='100%' height='100%'> always
* Chart containers must have role='img' and aria-label describing the chart

## 5.4 Leads Page (/sales/leads)

* Status tab bar: horizontal scrollable on mobile (overflow-x-auto, hide scrollbar)
* Table header cells: add cursor-pointer and onClick sort handler for Name, City, Budget, Status
* Sort state: { key: 'name'|'budget'|'status', dir: 'asc'|'desc' } — local useState
* Add Lead modal: trap focus, ESC closes, first input auto-focuses on open
* Bulk actions: checkboxes on each row → show 'X selected' bar at bottom with 'Update Status' and 'Export Selected' options
* Follow-up badge: OVERDUE (red, bold), SOON (amber, bold) — already implemented, keep
* Empty state: show float-bounce icon + 'No leads found' + 'Add your first lead' button
* Export PDF: keep existing jsPDF implementation, just add loading spinner during generation

## 5.5 Lead Detail Page (/sales/leads/:id)

* Activity timeline: keep ActivityTimeline component, ensure newest entry is at top
* Status stepper (LeadStatusStepper): show all 10 statuses, current highlighted
* Lead score card: keep LeadScoreCard, render inside right column
* Add Edit button in page header that opens inline edit mode (not a separate page)
* Next follow-up date: clicking opens a date picker inline

## 5.6 Loan Pipeline (/banking/loans)

* LoanStageStepper: each stage pill is clickable → opens loans filtered by that stage
* Document checklist: each item has a checkbox. On check, show a subtle badge-pop confirmation
* Pending Tracker (/banking/pending-tracker): clicking a stage count → navigate to /banking/loans?stage=X
* Loans table: add overdue indicator if loan has been in same stage > 7 days

## 5.7 HR Module

* Employee directory: search input already works. Add department filter dropdown.
* Leave requests: pending requests show at top. Approve/Reject buttons for manager+ roles.
* Attendance: today's date highlighted. Calendar grid view (monthly) as alternative to list.

## 5.8 Finance Module

* Finance pages use FinanceLayout.tsx (has its own sidebar) nested inside AppLayout.tsx
* Delete src/modules/finance/components/Sidebar.tsx and src/modules/finance/components/TopBar.tsx
* Finance pages import from shared components where possible
* Charts in finance pages must follow Blueprint design (no shadows, no gradients)

## 5.9 Settings — Preferences

* Theme toggle must call localStorage.setItem('theme', 'dark'|'light') on change
* ThemeContext must read localStorage on init: const saved = localStorage.getItem('theme')
* On init, apply html.dark class if saved === 'dark' before first paint (prevents flash)
* Add script in index.html <head> before React loads: if(localStorage.theme==='dark') document.documentElement.classList.add('dark')

# 6\. Shared Component Catalogue

All shared components live in src/modules/shared/components/. Never duplicate these elsewhere. When a module needs one, import from the shared path.

|Component|Purpose \& Usage|
|-|-|
|Sidebar.tsx|250px navigation shell. Groups with AnimatePresence expand/collapse. Role-gated NavLinks. Preview Role selector. User profile footer.|
|TopBar.tsx|72px sticky header. Mobile hamburger. Page title (dynamic). Dark/light toggle. Notification bell placeholder.|
|PageHeader.tsx|Page-level header. Props: title, subtitle, actions (ReactNode slot for buttons). Render at top of every page.|
|Modal.tsx|Accessible modal. Renders via Portal. ESC key closes. Focus trapped inside. Backdrop click closes. Use for Add Lead, Add Loan File etc.|
|DataTable.tsx|Sortable, filterable table. Props: columns, data, onRowClick. Row animations via .anim-row.|
|StatusBadge.tsx|Semantic status pill. Props: status (string), domain, size, variant. Maps status string to correct color + icon automatically.|
|StatCard.tsx|KPI metric card. Props: title, value, icon, trend, color. Renders with .stat-card + .anim-card classes.|
|MotionComponents.tsx|PageTransition: wraps page content with fade-in. ScrollReveal: animates element on scroll into view. ScrollProgress: top-of-page reading indicator.|
|PulseBar.tsx|Animated horizontal bar for pipeline/progress visualisation. Props: value (0–100), color, label.|
|FunnelLine.tsx|SVG connector between funnel stages. Used in lead and loan pipeline views.|
|LedgerCard.tsx|Blueprint-styled card with horizontal ledger dividers between content rows.|

# 7\. Bugs \& Issues Checklist

|Priority|Bug / Issue|Fix|
|-|-|-|
|CRITICAL|AppRouter.tsx uses Finance sidebar/topbar as global shell|Rewrite to use AppLayout.tsx (shared Sidebar + shared TopBar)|
|CRITICAL|App.css has Vite boilerplate — pollutes global styles|Delete all content from App.css|
|CRITICAL|Finance module has duplicate Sidebar.tsx and TopBar.tsx|Delete both, update finance imports to shared|
|HIGH|ThemeContext doesn't persist to localStorage|Add localStorage read on init, write on toggle|
|HIGH|TopBar page titles are hardcoded in static object|Replace with routeMeta config or React Router state|
|HIGH|Duplicate CEO dashboard in 3 module folders|Keep ceo/pages/dashboard.tsx, delete dashboard/ and update routes|
|HIGH|Duplicate CRM module mirrors sales module|Audit overlap, delete duplicates, update AppRouter routes|
|MEDIUM|Icon-only buttons have no aria-label (hamburger, theme toggle)|Add aria-label to all icon-only interactive elements|
|MEDIUM|Chart canvases have no accessibility attributes|Add role='img' and aria-label to all <ResponsiveContainer> parent divs|
|MEDIUM|Sidebar drawer does not trap focus on mobile|Implement focus-trap when isOpen === true|
|MEDIUM|Dark mode --ink-soft may fail WCAG AA on small text|Test contrast ratio; adjust rgba alpha in html.dark vars|
|LOW|Tailwind color overrides use !important in index.css|Replace with tailwind.config.js theme.extend.colors|
|LOW|Not all pages use PageTransition wrapper|Wrap all page-level components in <PageTransition>|
|LOW|Empty states missing on list pages (leads, loans, employees)|Add float-bounce empty state component to all list pages|

**T**

# 8\. Delivery \& Acceptance Criteria

The following checklist must be fully green before client handover:

|Criterion|Acceptance Condition|
|-|-|
|AppRouter uses correct shell|AppLayout (shared Sidebar + TopBar) wraps all non-finance routes. Finance routes have nested FinanceLayout.|
|App.css clean|File exists but is empty. No Vite boilerplate anywhere.|
|No duplicate components|finance/Sidebar and finance/TopBar deleted. dashboard/ and crm/ module folders deleted.|
|Theme persists on reload|Dark/light preference written to localStorage. No flash of wrong theme on page load.|
|Role switching works|Preview Role selector in sidebar switches data scope without page refresh.|
|All pages have PageTransition|Navigating between any two routes shows smooth fade-in transition.|
|All list pages have empty states|Lead list, loan files, employee directory all show float-bounce empty state when data is empty.|
|CEO dashboard has filters|Date range selector and branch filter render above KPI strip.|
|Accessibility baseline|All icon-only buttons have aria-label. Chart containers have role='img'.|
|Mobile drawer works|Sidebar drawer opens/closes. Focus trapped inside when open. ESC closes it.|
|No console errors|Production build (vite build) has zero TypeScript errors and zero console errors.|
|Dark mode looks correct|Both themes work across all pages. No hardcoded colors visible in either mode.|

**Thunder ERP | Frontend PRD v1.0 | For Client Presentation | June 2026**

