# ─────────────────────────────────────────────────────────────────────────────
# ThunderERP Backend — Makefile
# Run `make help` to see all commands.
# ─────────────────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help
.PHONY: help setup dev stop reset-db seed studio logs lint test test-cov \
        build clean db-migrate db-deploy docker-build docker-push

# ── Colours ───────────────────────────────────────────────────────────────────
CYAN  := \033[0;36m
GREEN := \033[0;32m
YELLOW:= \033[0;33m
RESET := \033[0m

# ─────────────────────────────────────────────────────────────────────────────
# HELP
# ─────────────────────────────────────────────────────────────────────────────
help: ## Show this help message
	@echo ""
	@echo "$(CYAN)ThunderERP Backend$(RESET) — available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ─────────────────────────────────────────────────────────────────────────────
# FIRST-TIME SETUP
# ─────────────────────────────────────────────────────────────────────────────
setup: ## Full first-time setup: install deps, start DB, migrate, seed
	@echo "$(CYAN)▶ Step 1/5 — Copying .env.example → .env$(RESET)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "  .env created"; else echo "  .env already exists — skipping"; fi

	@echo "$(CYAN)▶ Step 2/5 — Installing Node dependencies$(RESET)"
	npm install

	@echo "$(CYAN)▶ Step 3/5 — Starting PostgreSQL container$(RESET)"
	docker compose up -d postgres
	@echo "  Waiting for PostgreSQL to be ready..."
	@sleep 5

	@echo "$(CYAN)▶ Step 4/5 — Running Prisma generate + migrate$(RESET)"
	npx prisma generate
	npx prisma migrate dev --name init

	@echo "$(CYAN)▶ Step 5/5 — Seeding database$(RESET)"
	npm run db:seed

	@echo ""
	@echo "$(GREEN)✅ Setup complete!$(RESET)"
	@echo "   Run $(CYAN)make dev$(RESET) to start the development server."
	@echo "   API:    http://localhost:3000/api"
	@echo "   Docs:   http://localhost:3000/api/docs"
	@echo "   Health: http://localhost:3000/api/health"

# ─────────────────────────────────────────────────────────────────────────────
# DEVELOPMENT
# ─────────────────────────────────────────────────────────────────────────────
dev: ## Start the development server with hot-reload (starts DB if not running)
	@echo "$(CYAN)▶ Ensuring PostgreSQL is running...$(RESET)"
	docker compose up -d postgres
	@echo "$(CYAN)▶ Starting NestJS in watch mode...$(RESET)"
	npm run start:dev

stop: ## Stop all Docker containers (preserves data)
	@echo "$(CYAN)▶ Stopping containers...$(RESET)"
	docker compose down
	@echo "$(GREEN)✅ Containers stopped. Data preserved.$(RESET)"

logs: ## Tail live logs from the backend container
	docker compose logs -f backend

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────────────────────────
db-migrate: ## Create and apply a new Prisma migration (dev)
	@read -p "Migration name (e.g. add_discount_table): " name; \
	npx prisma migrate dev --name $$name

db-deploy: ## Apply pending migrations (production/staging use only)
	npx prisma migrate deploy

seed: ## Re-seed the database (safe — uses upsert, will not duplicate)
	@echo "$(CYAN)▶ Seeding database...$(RESET)"
	npm run db:seed

studio: ## Open Prisma Studio (database browser) in your browser
	npx prisma studio

reset-db: ## ⚠️  DANGER: Wipe all data, re-migrate, and re-seed (dev only)
	@echo "$(YELLOW)⚠️  WARNING: This will DELETE ALL DATA in your local database.$(RESET)"
	@read -p "Type YES to confirm: " confirm; \
	if [ "$$confirm" = "YES" ]; then \
		npm run db:reset; \
		echo "$(GREEN)✅ Database reset and reseeded.$(RESET)"; \
	else \
		echo "Cancelled."; \
	fi

clean: ## Remove node_modules and dist (use before a fresh npm install)
	@echo "$(CYAN)▶ Cleaning node_modules and dist...$(RESET)"
	rm -rf node_modules dist coverage
	@echo "$(GREEN)✅ Clean complete. Run$(RESET) make setup $(GREEN)to reinstall.$(RESET)"

# ─────────────────────────────────────────────────────────────────────────────
# CODE QUALITY
# ─────────────────────────────────────────────────────────────────────────────
lint: ## Run ESLint and auto-fix issues
	@echo "$(CYAN)▶ Running ESLint...$(RESET)"
	npm run lint

type-check: ## Run TypeScript compiler check (no output files)
	@echo "$(CYAN)▶ TypeScript type check...$(RESET)"
	npx tsc --noEmit

# ─────────────────────────────────────────────────────────────────────────────
# TESTING
# ─────────────────────────────────────────────────────────────────────────────
test: ## Run all unit tests
	@echo "$(CYAN)▶ Running tests...$(RESET)"
	npm test -- --forceExit

test-cov: ## Run tests with coverage report
	@echo "$(CYAN)▶ Running tests with coverage...$(RESET)"
	npm run test:cov

test-watch: ## Run tests in watch mode (re-runs on file save)
	npm run test:watch

# ─────────────────────────────────────────────────────────────────────────────
# BUILD & DOCKER
# ─────────────────────────────────────────────────────────────────────────────
build: ## Compile TypeScript to dist/ (production build)
	@echo "$(CYAN)▶ Building production bundle...$(RESET)"
	npm run build
	@echo "$(GREEN)✅ Build complete. Output in dist/$(RESET)"

docker-build: ## Build the Docker image locally
	@echo "$(CYAN)▶ Building Docker image...$(RESET)"
	docker build -t thunder-erp-backend:local .
	@echo "$(GREEN)✅ Image built: thunder-erp-backend:local$(RESET)"

docker-push: ## Build and push Docker image to registry (set DOCKER_USER env var)
	@if [ -z "$(DOCKER_USER)" ]; then echo "$(YELLOW)Set DOCKER_USER first: export DOCKER_USER=yourname$(RESET)"; exit 1; fi
	docker build -t $(DOCKER_USER)/thunder-erp-backend:latest .
	docker push $(DOCKER_USER)/thunder-erp-backend:latest
	@echo "$(GREEN)✅ Pushed $(DOCKER_USER)/thunder-erp-backend:latest$(RESET)"

# ─────────────────────────────────────────────────────────────────────────────
# CI SIMULATION (run these locally before opening a PR)
# ─────────────────────────────────────────────────────────────────────────────
ci: lint type-check build test ## Run all CI checks locally (same as GitHub Actions)
	@echo ""
	@echo "$(GREEN)✅ All CI checks passed. Safe to open a PR.$(RESET)"
