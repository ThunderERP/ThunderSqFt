# ThunderERP — Backend

> **Enterprise Resource Planning system** built with NestJS · TypeScript · PostgreSQL · Prisma

[![PR Checks](https://github.com/ThunderERP/ThunderERP/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/ThunderERP/ThunderERP/actions/workflows/pr-checks.yml)
[![Node](https://img.shields.io/badge/node-20.x-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Modules

| Module | Endpoints | Description |
|---|---|---|
| **Auth** | `POST /auth/login` · `POST /auth/register` · `GET /auth/profile` | JWT authentication, 9 roles |
| **Users** | `GET/PATCH /users` | User management (Developer Admin only) |
| **Customers** | `GET/POST/PATCH/DELETE /customers` | Customer records with order history |
| **Suppliers** | `GET/POST/PATCH/DELETE /suppliers` | Supplier management |
| **Products** | `GET/POST/PATCH/DELETE /products` | Product master data, auto-creates inventory |
| **Inventory** | `GET /inventory` · `PATCH /inventory/product/:id/adjust` | Stock levels, movements, low-stock alerts |
| **Orders** | `POST /orders` · `PATCH /orders/:id/confirm\|ship\|deliver\|complete\|cancel` | Full atomic order lifecycle with SELECT FOR UPDATE |
| **Invoices** | `GET /invoices` · `PATCH /invoices/:id` | Auto-generated on order confirm, PAID invoices locked |
| **Payments** | `POST /payments` · `GET /payments` | Payment recording, PARTIAL/PAID status, ledger entry |
| **Purchases** | `POST /purchases` · `PATCH /purchases/:id/approve\|receive\|complete` | Procurement with Business Owner approval gate |
| **Returns** | `POST /returns` · `PATCH /returns/:id/process` | REFUND / RETURN / REPLACEMENT state machine |
| **CRM** | `POST/GET/PATCH /crm/leads` · `POST/GET/PATCH /crm/complaints` | Lead pipeline, convert to customer, complaints |
| **Finance** | `GET /finance/dashboard\|accounts-receivable\|accounts-payable\|cash-flow\|sales-report` | Reporting engine |
| **Audit** | `GET /audit` · `GET /audit/:type/:id` | Non-volatile audit log (SRS §2.3) |
| **Health** | `GET /health` | Liveness probe for Docker / CI smoke tests |

---

## Quick Start

### Option A — Docker (recommended)

```bash
git clone https://github.com/ThunderERP/ThunderERP.git
cd ThunderERP

cp .env.example .env          # Edit with your values
docker compose up -d          # Starts PostgreSQL + NestJS backend
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npm run db:seed
```

API: http://localhost:3000/api  
Swagger docs: http://localhost:3000/api/docs

### Option B — Local (manual)

```bash
# Prerequisites: Node 20, PostgreSQL 16 running locally

git clone https://github.com/ThunderERP/ThunderERP.git
cd ThunderERP

nvm use                        # Switches to Node 20 via .nvmrc
npm install
cp .env.example .env           # Edit DATABASE_URL and JWT_SECRET

npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
npm run start:dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/thunder_erp` |
| `JWT_SECRET` | Secret for signing JWTs — use a long random string | `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | JWT lifetime | `24h` |
| `PORT` | Port the API listens on | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |

---

## Seed Accounts

After running `npm run db:seed`, all accounts use password **`Thunder@123`**:

| Email | Role |
|---|---|
| `admin@thundererp.com` | DEVELOPER_ADMIN |
| `owner@thundererp.com` | BUSINESS_OWNER |
| `salesmgr@thundererp.com` | SALES_MANAGER |
| `salesstaff@thundererp.com` | SALES_STAFF |
| `inventory@thundererp.com` | INVENTORY_MANAGER |
| `finance@thundererp.com` | FINANCE_MANAGER |
| `accountant@thundererp.com` | ACCOUNTANT |
| `crm@thundererp.com` | CRM_SUPPORT |
| `refund@thundererp.com` | REFUND_HANDLER |

---

## NPM Scripts

```bash
npm run start:dev       # Start with hot reload (development)
npm run build           # Compile TypeScript → dist/
npm run start:prod      # Run compiled production build
npm run lint            # ESLint check
npm test                # Jest unit tests
npm run test:cov        # Coverage report
npm run db:migrate      # Create + apply Prisma migration (dev)
npm run db:deploy       # Apply pending migrations (production)
npm run db:seed         # Seed database with all 9 roles + sample data
npm run db:studio       # Open Prisma Studio in browser
npm run db:reset        # ⚠️  Drop all data + re-migrate + seed (dev only)
```

---

## Architecture

```
Access Layer      →  API Gateway / JWT Auth
                      ↓
Logic Tier        →  Sales · Procurement · CRM · Inventory · Finance
                      ↓
Persistence Tier  →  Prisma ORM → PostgreSQL 16
                                   ↘
                              System Audit Log (non-volatile)
```

### Order Lifecycle (Atomic — matches SRS Sequence Diagram)

```
PENDING → CONFIRMED → SHIPPED → DELIVERED → COMPLETED
              ↓           ↓
          CANCELLED   CANCELLED          → RETURNED
```

On `CONFIRM`: `SELECT FOR UPDATE` locks each inventory row → validates stock →
moves `available_qty → reserved_qty` → creates Invoice. All in one transaction.
If any item is out of stock, the entire transaction rolls back.

On `DELIVER`: deducts from `reserved_qty` (physical outward movement).

On `CANCEL` (from CONFIRMED): releases `reserved_qty` back to `available_qty`.

---

## Git Workflow

See [`docs/git-workflow.md`](docs/git-workflow.md) for the complete team workflow.

Short version:
1. `git checkout dev && git pull origin dev`
2. `git checkout -b feature/<module>-<description>`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
4. `git push origin feature/...`
5. Open PR → target `dev` → CI must pass before review
6. Tech Lead merges `dev → main` → triggers production deploy

**Direct pushes to `dev` and `main` are blocked.**

---

## Project Structure

```
src/
├── main.ts                    # Bootstrap, Swagger, ValidationPipe
├── app.module.ts              # Root module
├── prisma/                    # PrismaService (global)
├── common/                    # Guards, decorators, filters, interceptors, pagination
└── modules/
    ├── auth/                  # JWT + Passport
    ├── users/
    ├── customers/
    ├── suppliers/
    ├── products/
    ├── inventory/             # atomicReserve, atomicRelease, atomicDeduct, atomicAdd
    ├── orders/                # Full atomic order flow
    ├── invoices/
    ├── payments/              # Ledger entries
    ├── purchases/             # Business Owner approval gate
    ├── returns/               # REFUND / RETURN / REPLACEMENT
    ├── crm/                   # Leads + complaints
    ├── finance/               # Reporting engine
    ├── audit/                 # Non-volatile audit log
    └── health/                # /api/health liveness probe
prisma/
    ├── schema.prisma          # All 16 models, all enums, all FK relationships
    └── seed.ts                # All 9 roles + sample data
```

---

## API Documentation

Swagger UI is available at **http://localhost:3000/api/docs** when the server is running.

All endpoints require a Bearer JWT except `POST /api/v1/auth/login` and `GET /api/v1/health`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (LTS) |
| Framework | NestJS 10 |
| Language | TypeScript 5 (strict mode) |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT + Passport |
| Validation | class-validator + class-transformer |
| Documentation | Swagger / OpenAPI |
| Testing | Jest + ts-jest |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
