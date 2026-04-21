# ThunderERP — Frontend

> React 18 · TypeScript · Vite · TanStack Query · Zustand · Tailwind CSS

**Status: In Development**

## Setup (once backend is running)

```bash
cd frontend
nvm use 20
npm install
cp .env.example .env     # set VITE_API_URL=http://localhost:3000
npm run dev
```

App: http://localhost:5173

---

## Folder Structure

```
src/
├── modules/           ← One folder per backend module (1:1 match)
│   ├── auth/
│   ├── inventory/
│   ├── sales/
│   ├── purchases/
│   ├── finance/
│   ├── crm/
│   └── returns/
├── shared/
│   ├── components/    ← Reusable: DataTable, StatusBadge, Modal, PageHeader
│   ├── ui/            ← shadcn/ui base components
│   ├── utils/         ← formatCurrency, formatDate, etc.
│   └── constants/     ← queryKeys.ts, routes.ts
├── hooks/             ← useAuth, useDebounce, usePagination
├── lib/               ← axios.ts, queryClient.ts, store.ts (Zustand)
├── routes/            ← AppRouter.tsx, ProtectedRoute.tsx
└── types/             ← TypeScript interfaces mirroring backend DTOs
```

---
