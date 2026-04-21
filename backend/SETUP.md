# ThunderERP — Local Development Setup Guide

> **Read this before your first commit.** This guide takes you from a brand-new laptop to a fully running ThunderERP backend in under 15 minutes.

---

## Prerequisites — Install These First

You need three system tools. Install them in this order. Each has a verification command — do not move to the next step until the verification passes.

### 1. nvm (Node Version Manager)

`nvm` lets you switch between Node.js versions. We use it instead of installing Node directly because ThunderERP requires Node 20 exactly.

**macOS / Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
Close and reopen your terminal after this command, then verify:
```bash
nvm --version
# Expected: 0.39.x or higher
```

**Windows:**
Download and run the installer from: https://github.com/coreybutler/nvm-windows/releases
(Download `nvm-setup.exe` from the latest release.)

---

### 2. Node.js 20 (via nvm)

```bash
nvm install 20
nvm use 20
node -v
# Expected: v20.x.x
npm -v
# Expected: 10.x.x
```

> **Note:** Once you clone the repo, `nvm use` (with no version number) will automatically switch to Node 20 by reading the `.nvmrc` file.

---

### 3. Docker Desktop

Docker runs PostgreSQL for you. No manual database installation needed.

Download from: https://www.docker.com/products/docker-desktop

After installing, open Docker Desktop and wait for it to show **"Docker Desktop is running"** (green icon in taskbar/menubar).

Verify:
```bash
docker --version
# Expected: Docker version 24.x.x or higher

docker compose version
# Expected: Docker Compose version v2.x.x
```

> **Windows users:** Make sure "Use WSL 2 instead of Hyper-V" is enabled in Docker Desktop settings.

---

## Cloning the Repository

```bash
git clone https://github.com/ThunderERP/ThunderERP.git
cd ThunderERP
nvm use
# Expected: Now using node v20.x.x (npm v10.x.x)
```

---

## Option A — Automatic Setup (Recommended)

If you have `make` available (macOS/Linux have it by default; Windows users see note below), run:

```bash
make setup
```

This single command does everything: installs Node packages, starts the database, runs migrations, and seeds all 9 user accounts. Then run:

```bash
make dev
```

**Windows users without `make`:** Use Option B below, or install `make` via [Chocolatey](https://chocolatey.org/): `choco install make`.

---

## Option B — Manual Setup (Step by Step)

### Step 1 — Copy the environment file

```bash
cp .env.example .env
```

The `.env.example` file is pre-configured for the Docker database — you do not need to change anything for local development. Open it and confirm it looks like this:

```env
DATABASE_URL="postgresql://admin:thunder_dev_pass@localhost:5432/thunder_erp"
JWT_SECRET="thunder_jwt_secret_change_in_prod"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is in `.gitignore`. Keep real secrets out of git.

---

### Step 2 — Install Node dependencies

```bash
npm install
```

This installs all packages listed in `package.json` into `node_modules/`. It takes 1–2 minutes on first run. Expected output ends with something like `added 847 packages`.

---

### Step 3 — Start the database

```bash
docker compose up -d postgres
```

The `-d` flag runs it in the background. Verify it is healthy:

```bash
docker compose ps
# Expected: thunder-postgres    running (healthy)
```

Wait until the status shows `healthy`. This usually takes 10–15 seconds.

---

### Step 4 — Generate the Prisma client

```bash
npx prisma generate
```

This reads `prisma/schema.prisma` and generates the TypeScript database client in `node_modules/.prisma/`. You must run this every time `schema.prisma` changes.

Expected output: `✔ Generated Prisma Client`

---

### Step 5 — Create the database tables

```bash
npx prisma migrate dev --name init
```

This applies all migrations in `prisma/migrations/` to create the tables in your local PostgreSQL database.

Expected output: `Database is now in sync with your schema.`

---

### Step 6 — Seed the database

```bash
npm run db:seed
```

This creates all 9 user accounts and sample data (products, customers, suppliers, leads).

Expected output:
```
✅ 9 users ready
✅ 2 suppliers ready
✅ 8 products + inventory ready
✅ 3 customers ready
✅ Sample lead ready
🎉 Seed complete! All accounts use password: Thunder@123
```

---

### Step 7 — Start the server

```bash
npm run start:dev
```

Expected output ends with:
```
ThunderERP API running on http://localhost:3000/api
Swagger docs at http://localhost:3000/api/docs
```

---

## Verifying Everything Works

Open these in your browser:

| URL | Expected Result |
|-----|----------------|
| http://localhost:3000/api/health | `{ "status": "ok", "database": "connected" }` |
| http://localhost:3000/api/docs | Swagger UI with all endpoints listed |

Then test login via Swagger or Postman:

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@thundererp.com",
  "password": "Thunder@123"
}
```

Expected response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": { "id": 1, "email": "admin@thundererp.com", "role": "DEVELOPER_ADMIN" }
  }
}
```

Copy the `access_token` value and paste it into the Swagger **Authorize** button (top right) to test protected endpoints.

---

## Seed Account Credentials

All accounts use password: **`Thunder@123`**

| Email | Role | What they can do |
|-------|------|-----------------|
| `admin@thundererp.com` | DEVELOPER_ADMIN | Everything |
| `owner@thundererp.com` | BUSINESS_OWNER | Approve purchases, full reports |
| `salesmgr@thundererp.com` | SALES_MANAGER | Manage orders, approve discounts |
| `salesstaff@thundererp.com` | SALES_STAFF | Create orders and customers |
| `inventory@thundererp.com` | INVENTORY_MANAGER | Products, stock, suppliers, purchases |
| `finance@thundererp.com` | FINANCE_MANAGER | Invoices, payments, reports |
| `accountant@thundererp.com` | ACCOUNTANT | Record payments, view ledger |
| `crm@thundererp.com` | CRM_SUPPORT | Leads, complaints, customers |
| `refund@thundererp.com` | REFUND_HANDLER | Returns and refunds |

---

## Daily Development Workflow

```bash
# Start of every day:
make dev            # starts DB + hot-reload server

# Before opening a PR:
make ci             # runs lint + type-check + build + tests locally

# After pulling changes that include schema.prisma edits:
npx prisma generate
npx prisma migrate dev
```

See the [Git Workflow Guide](docs/git-workflow.md) for the full branching and PR process.

---

## Common Commands

```bash
make help           # see all available commands
make dev            # start development server
make test           # run unit tests
make lint           # fix code style issues
make studio         # open database browser in browser
make reset-db       # ⚠️  wipe and reseed (dev only)
make db-migrate     # create a new database migration
make build          # compile for production
make ci             # run all CI checks locally
```

---

## Troubleshooting

### "Cannot connect to database" or "Connection refused"

The PostgreSQL container is not running. Fix:
```bash
docker compose up -d postgres
docker compose ps     # confirm it shows "healthy"
```

If the container keeps restarting:
```bash
docker compose logs postgres
```
Look for `FATAL: password authentication failed` — this means your `.env` credentials do not match `docker-compose.yml`. Ensure both use `admin` / `thunder_dev_pass`.

---

### "prisma generate" fails or types are wrong

Always run `npx prisma generate` after pulling changes that include `schema.prisma` edits. If it still fails:
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

---

### "Port 3000 already in use"

Another process is using port 3000. Find and kill it:
```bash
# macOS / Linux:
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or change the port in `.env`: `PORT=3001`

---

### "Port 5432 already in use"

You have a local PostgreSQL installation running alongside Docker. Either stop the local one:
```bash
# macOS (Homebrew):
brew services stop postgresql

# Linux:
sudo systemctl stop postgresql
```
Or change the Docker port in `docker-compose.yml` from `"5432:5432"` to `"5433:5432"` and update `DATABASE_URL` in `.env` to use port `5433`.

---

### npm install fails or node_modules errors

```bash
make clean          # removes node_modules and dist
make setup          # fresh install
```

---

### "Module not found" errors after pulling

Someone added a new dependency. Run:
```bash
npm install
```

---

### Tests fail with "Cannot find module"

```bash
npx prisma generate   # regenerate the Prisma client
npm test
```

---

### Docker Desktop not starting on Windows

Enable WSL 2 in Docker Desktop settings. If missing WSL 2:
```powershell
wsl --install
# Restart computer
```

---

### "npx prisma migrate dev" fails with "migration already applied"

Your local database is ahead of or behind the migration history. Reset it:
```bash
make reset-db    # wipes data and re-applies all migrations
```

> ⚠️ This deletes all local data. It is safe in development — the seed will restore everything.

---

## Environment Variables Reference

| Variable | Required | Description | Default (local) |
|----------|----------|-------------|-----------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | set in `.env.example` |
| `JWT_SECRET` | ✅ | JWT signing secret — must be long and random in production | `thunder_jwt_secret_change_in_prod` |
| `JWT_EXPIRES_IN` | ✅ | Token lifetime | `24h` |
| `PORT` | ❌ | API server port | `3000` |
| `NODE_ENV` | ❌ | Environment mode | `development` |
| `THROTTLE_TTL` | ❌ | Rate limit window in seconds | `60` |
| `THROTTLE_LIMIT` | ❌ | Max requests per window | `100` |

> In production, `JWT_SECRET` must be a cryptographically random string. Generate one:
> ```bash
> openssl rand -hex 64
> ```

---

## Project Structure Quick Reference

```
src/
├── main.ts                  ← Bootstrap, Swagger, pipes, filters
├── app.module.ts            ← Root module — all 15 modules wired here
├── prisma/                  ← PrismaService (global singleton)
├── common/                  ← Shared: guards, decorators, filters, pagination
└── modules/
    ├── auth/                ← Login, JWT, role strategies
    ├── users/               ← User management
    ├── customers/           ← Customer records
    ├── suppliers/           ← Supplier management
    ├── products/            ← Product master + auto-creates inventory
    ├── inventory/           ← Stock levels, movements, atomic operations
    ├── orders/              ← Sales order lifecycle (atomic stock reservation)
    ├── invoices/            ← Invoice management
    ├── payments/            ← Payment recording + ledger entries
    ├── purchases/           ← Procurement + Business Owner approval
    ├── returns/             ← Return/Refund/Replacement state machine
    ├── crm/                 ← Leads + complaints
    ├── finance/             ← Dashboard, reports, cashflow
    ├── audit/               ← Non-volatile audit log
    └── health/              ← /api/health liveness probe
```

---

## Getting Help

- **Slack** — Post in `#thunder-erp-dev` before asking a colleague directly
- **Swagger** — http://localhost:3000/api/docs — all endpoints documented
- **Prisma Studio** — `make studio` — visual database browser
- **Git Workflow** — see [SETUP.md](SETUP.md) and your Git & GitHub guidebook

> If you have been stuck for more than 20 minutes, ask in Slack. Do not waste time — this is a fast-moving team.
