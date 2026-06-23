**⚡ THUNDER ERP**

**Product & Design Requirements Document**

UI/UX Redesign — Command Center Visual System

**Prepared for:** Thunder ERP — Owner & Stakeholder Review

**Prepared by:** Product Design — Redesign Initiative

**Date:** June 2026

**Status:** Proposal for client sign-off

_Companion file: thunder-erp-redesign-concept.html — an interactive, clickable visual concept of the Command Center, Sales Pipeline, and Finance screens described in this document._

# Table of Contents

1\. Executive Summary

2\. Current State Assessment

3\. Goals & Success Criteria

4\. Target Users & Roles

5\. New Design System — “Command Center”

6\. Page-by-Page Redesign Plan

7\. Navigation & Information Architecture

8\. Accessibility & Responsiveness

9\. Technical Implementation Notes

10\. Rollout Plan

11\. Risks & Assumptions

12\. Appendix — Companion Concept File

# 1\. Executive Summary

Thunder ERP is a working, full-stack operations platform already covering CEO oversight, Sales/CRM, Banking & loan files, Finance, HR, Tasks and Automation across multiple branches. The product is functionally strong. This document proposes a focused visual and interaction redesign so the product looks and feels as capable as it actually is — a requirement for this build to support the upcoming client contract conversation.

The redesign keeps the existing technology stack (React, Tailwind CSS, Framer Motion, Chart.js / Recharts) and does not require a rebuild. It resolves a visual inconsistency in the current codebase, introduces one coherent "Command Center" design system, and applies it across every module so each screen — CEO, Sales, Finance, Banking, HR — reads as part of one premium product.

A clickable concept file (thunder-erp-redesign-concept.html) accompanies this PRD and demonstrates the new system on three flagship screens: the CEO Command Center, the Sales Pipeline, and the Finance Overview. It is intended for walking the client through the new direction before implementation begins.

# 2\. Current State Assessment

This assessment is based on a direct review of the Thunder ERP frontend codebase (React + Vite + Tailwind, modules under frontend/src/modules).

## 2.1 What already works

*   A genuine multi-module ERP: CEO command center, Branch comparison, Sales CRM (leads, lead detail, site visits, bookings, follow-ups), Banking (loans, loan files, banks, pending tracker), Finance (dashboard, invoices, payables, receivables, cashflow, salary, reports, accounts), HR (directory, leaves, attendance, performance), Tasks and an Automation engine.
*   Role-based access is already modeled (RequireRole, RequireCapability, a RoleContext with per-role default routes), which the redesign can lean on directly for role-specific dashboards.
*   A dark, data-forward visual direction is already the intended identity — CSS variables for an accent blue and a gold highlight color, card-based surfaces, and motion via Framer Motion are already wired in.

## 2.2 What is holding the design back

*   **Two design languages are mixed in the same app.** frontend/src/index.css defines a modern dark "card + glow" system (--bg-card, --shadow-hover, rounded-lg cards), while components such as StatCard.tsx and several page files still use an older flat "blueprint" language (bg-paper, border-ink, rounded-none, shadow-none). The result is visual inconsistency from screen to screen, which is the fastest way to make a capable product look unfinished in a client walkthrough.
*   **Generic placeholder visuals.** The hero asset shipped in frontend/src/assets/hero.png is an unbranded default 3D icon with no connection to Thunder ERP's identity or to real estate / lending, the business it actually serves.
*   **"Card soup" density.** Tailwind's box-shadow scale is already set to none across the board (boxShadow.card / .elevated / .floating all map to 'none' in tailwind.config.js) but several components still call those classes expecting elevation, so cards read as flat and slightly broken rather than intentionally flat.
*   **No signature visual idea.** Nothing in the current UI ties back to the "Thunder" name. The brand has no motif, so every screen looks like a generic admin template rather than a product with a point of view — which is the single biggest lever for a contract-deciding first impression.
*   **Inconsistent data formatting.** Currency, IDs and counts are sometimes set in monospace (.mono-text) and sometimes not, which undermines the "precise, trustworthy ledger" feeling a finance/lending product needs.

# 3\. Goals & Success Criteria

## 3.1 Goals

1.  Present a single, coherent visual identity across all 8 modules, suitable for a client to evaluate as a finished commercial product.
2.  Introduce one ownable signature element tied to the Thunder brand, used structurally (not decoratively) throughout the interface.
3.  Increase information density and legibility on data-heavy screens (branch tables, ledgers, loan files) without resorting to visual clutter.
4.  Ship the new system without a framework change — Tailwind tokens, React components, and existing libraries (Framer Motion, Recharts/Chart.js) are extended, not replaced.
5.  Meet baseline accessibility: visible keyboard focus, WCAG AA contrast on all text/background pairs, and respect for prefers-reduced-motion.

## 3.2 Success criteria

*   Every module (CEO, Sales, Banking, Finance, HR, Tasks, Automation, Settings) uses the same color tokens, type scale, card, table, and badge components — zero remaining "blueprint" classes in the codebase.
*   Client-facing walkthrough of the concept file results in sign-off without requests to "make it look more premium" / "make it feel less like a template."
*   No regression in load performance — the redesign is CSS/SVG-led, not image- or video-led.

# 4\. Target Users & Roles

| Role | Primary screens | What they need most |
| --- | --- | --- |
| Owner / CEO | Command Center, Branch Comparison | A fast, trustworthy read on revenue, pipeline health and branch performance at a glance |
| Branch / Sales Manager | Manager dashboard, Leads, Site Visits, Bookings | Pipeline visibility for their team and the ability to spot stalled leads quickly |
| Sales / CRM Agent | Leads, Lead detail, Follow-ups | A clear daily worklist and fast lead-stage updates |
| Finance Team | Cashflow, Invoices, Payables, Receivables, Salary, Reports | Ledger-accurate figures, status at a glance, exportable reports |
| Banking / Loan Officer | Loans, Loan Files, Loan File detail, Pending Tracker | Clear stage tracking per file and outstanding-document visibility |
| HR | Directory, Leaves, Attendance, Performance | Simple roster and approval workflows |

# 5\. New Design System — "Command Center"

Direction: Thunder ERP's identity comes from its own name. "Current" — the flow of electricity — becomes the literal signature: a slim gradient line that marks whatever is active or trending upward across the app (the active sidebar item, a rising KPI, a chart's lead series). It is used structurally to mean something specific, not as decoration. Around that one signature, everything else stays disciplined: a dark graphite surface, hairline dividers instead of heavy card borders, and monospaced numerals everywhere money, IDs or counts appear, reinforcing the ledger-grade precision a finance and lending product needs to project.

## 5.1 Color tokens

| ■■■■Base#F4F4F8App background | ■■■■Surface#F4F4F8Cards & panels | ■■■■Current — Blue#3D7FFFPrimary accent, active state, links | ■■■■Current — Gold#F2A93CRevenue & high-value figures | ■■■■Success#2ECF8BPaid / on-target / won | ■■■■Danger#FF6B6BOverdue / behind / at risk |
| --- | --- | --- | --- | --- | --- |

Supporting neutrals: ink #F3F4FA (primary text on dark surfaces), soft ink at 62% opacity (secondary text), hairline borders at 7–14% white opacity. A violet (#9B87F5) and amber (#F2B84B) round out status/category coding for Automation and "watch" states respectively. Full token values ship as CSS variables, matching the structure already in index.css, so existing components migrate with a find-and-replace rather than a rewrite.

## 5.2 Typography

| Role | Typeface | Usage |
| --- | --- | --- |
| Display / headings | Space Grotesk (600–700) | Page titles, panel titles, KPI labels — already in the codebase's font stack, kept and used consistently |
| Body / UI | Inter (400–600) | All running text, navigation, table content, buttons |
| Data / numerals | JetBrains Mono (500–600) | Every currency figure, ID, percentage and count — the "ledger" voice that signals precision |

## 5.3 Core components to standardize

*   **Sidebar navigation —** module groups with a single active-state treatment: a 2px blue-to-gold gradient "current" edge on the active item, replacing the inconsistent active states across current pages.
*   **KPI / stat card —** label, mono-numeral value, trend delta and a 14-point sparkline, with the signature current-line drawing in along the top edge on load. Replaces StatCard.tsx's flat blueprint styling.
*   **Data table —** hairline row dividers (no banding), right-aligned monospaced numerals, sortable column headers, row-hover highlight. Replaces ad hoc table styling across Finance, Banking and HR pages.
*   **Status badge —** one pill component with five semantic colors (success, warning, danger, info, neutral) used identically for lead status, loan stage, invoice status and HR leave status.
*   **Chart panels —** consistent panel chrome (title, subtitle, segmented control) wrapping Recharts/Chart.js output, with the blue/gold palette applied to every chart in the product.
*   **Empty & loading states —** a single illustrated empty-state pattern and skeleton loader, replacing default browser placeholders.

## 5.4 Motion principles

*   One orchestrated load sequence per page (KPI current-lines draw in, chart paths animate, table rows fade up in sequence) — not scattered hover effects everywhere.
*   Hover states lift rows and cards by 1px with a border-color change, not a heavy shadow — consistent with the flat, precise tone of the rest of the system.
*   All motion respects prefers-reduced-motion and falls back to an instant, fully-rendered state.

# 6\. Page-by-Page Redesign Plan

Applies the system above to every existing route in App.tsx. "Key changes" lists what changes — the underlying data and functionality are unchanged.

| Module | Pages | Key visual changes |
| --- | --- | --- |
| CEO | Command Center, Branch Comparison | New KPI row with sparklines; unified revenue-vs-target chart; branch table restyled with hairline rows and status badges; live activity feed |
| Manager | Manager Dashboard | Same KPI/table language scoped to one branch and team |
| Sales / CRM | Leads, Lead Detail, Site Visits, Bookings, Follow-ups | Pipeline view restyled as stage columns with lead cards (budget, project, assigned agent, priority tag); lead detail gets a timeline + document checklist treatment consistent with Banking's stepper |
| Banking | Loans, Loan Files, Loan File Detail, Banks, Pending Tracker | LoanStageStepper and DocumentChecklistCard restyled to the new badge/hairline language; pending tracker becomes a priority-sorted table |
| Finance | Dashboard, Cashflow, Invoices, Payables, Receivables, Salary, Accounts, Reports | Cashflow inflow/outflow bar chart; invoice/payable/receivable tables share one table component with mono-numeral amounts and due-date status badges |
| HR | Directory, Leaves, Leave, Attendance, Performance | Directory as a searchable card/table hybrid; leave & attendance status using the shared badge component |
| Tasks / Automation | Tasks, Automation, Triggers | Task list restyled with priority and due-date badges; automation rules shown as readable trigger → action rows instead of raw configuration |
| Settings | Preferences | Simplified into grouped sections matching the new card and form-control style |

# 7\. Navigation & Information Architecture

*   Keep the existing collapsible sidebar structure and role-based visibility (RequireModule, RoleContext) — only the visual treatment changes.
*   Group sidebar items exactly as App.tsx already groups routes (Overview, Sales, Finance, Banking, HR, Automation, Settings) so the redesign maps 1:1 onto existing routing — no information architecture rewrite required.
*   Add a persistent top bar across all modules (branch selector, date range, global search, notifications) — currently present in some modules (TopBar.tsx) but not styled consistently everywhere.

# 8\. Accessibility & Responsiveness

*   Minimum body text size 13px; all text/background pairs meet WCAG AA contrast (4.5:1) on the dark surface palette.
*   Every interactive element (nav item, button, table row action) has a visible focus ring, not just a hover state.
*   Layouts collapse from a 5-column KPI row to 2 columns at tablet width and 1 column at mobile width, consistent with existing Tailwind breakpoints already used in the codebase.
*   Animations are disabled or shortened to near-zero under prefers-reduced-motion.

# 9\. Technical Implementation Notes

For the engineering team and for the Antigravity build prompt that accompanies this PRD.

*   **No new framework.** Tailwind CSS, Framer Motion, Recharts and Chart.js stay; the work is tokens + component-level styling, not a rewrite.
*   **Token source of truth.** Consolidate everything into frontend/src/index.css custom properties and frontend/tailwind.config.js color/shadow extensions; remove the legacy --blueprint-accent / bg-paper / border-ink compatibility layer once migration is complete.
*   **Shared components to update once, reuse everywhere:** Sidebar.tsx, TopBar.tsx, StatCard.tsx, DataTable.tsx, StatusBadge.tsx, PageHeader.tsx, Modal.tsx, EmptyState.tsx, LedgerCard.tsx, ActivityTimeline.tsx, PulseBar.tsx, FunnelLine.tsx (all under frontend/src/modules/shared/components and the duplicated copies under modules/finance/components).
*   **De-duplicate.** Several components (ScrollProgress, ScrollReveal, StatCard, MotionComponents, DataTable, StatusBadge, Modal, PageHeader) currently exist in both modules/shared/components and modules/finance/components — consolidate to one shared copy during the redesign to prevent the two-design-language problem from recurring.

# 10\. Rollout Plan

| Phase | Scope | Outcome |
| --- | --- | --- |
| 1 — Foundations | Design tokens in index.css / tailwind.config.js; shared components (Sidebar, TopBar, StatCard, DataTable, StatusBadge) | The new system exists and renders correctly in isolation |
| 2 — Flagship modules | CEO Command Center, Branch Comparison, Sales pipeline | The screens used in the client walkthrough are fully redesigned (matches the concept file) |
| 3 — Finance & Banking | All Finance pages, all Banking pages | Highest-data-density modules brought to the new standard |
| 4 — HR, Tasks, Automation, Settings | Remaining modules | 100% of the product on one design system |
| 5 — QA & polish | Cross-browser/device check, accessibility audit, motion-preference testing | Production-ready handoff |

# 11\. Risks & Assumptions

*   Assumes current functionality and API contracts are unaffected — this is a visual/interaction layer change, not a data or business-logic change.
*   Two components currently duplicated across modules (see Section 9) must be reconciled; skipping that step would let the old inconsistency creep back in over time.
*   Brand assets (logo mark, hero imagery) referenced in this PRD are concept-stage; final artwork should be produced once the direction is approved.

# 12\. Appendix — Companion Concept File

thunder-erp-redesign-concept.html, delivered alongside this PRD, is a clickable implementation of the system described above across three screens: the CEO Command Center (KPIs, revenue chart, funnel, branch table, activity feed), the Sales Pipeline (stage columns with lead cards), and Finance Overview (cashflow chart and invoice table). Open it in any browser and use the left sidebar to switch between the three views. It is the recommended artifact to walk the client through directly.

A ready-to-use prompt for implementing this system inside Google Antigravity is provided as a separate file: thunder-erp-antigravity-prompt.md.