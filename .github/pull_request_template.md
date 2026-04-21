## Summary
<!-- What does this PR do and why? -->

## Package(s) Changed
- [ ] `backend/`
- [ ] `frontend/`
- [ ] `docs/`
- [ ] `infra/`
- [ ] `.github/` (CI/CD)

## Type of Change
- [ ] New feature (non-breaking)
- [ ] Bug fix
- [ ] Refactor (no behaviour change)
- [ ] Breaking change
- [ ] Database migration included (backend only)

## Testing
- [ ] `npm run lint` — passes
- [ ] `npx tsc --noEmit` — no type errors
- [ ] `npm run build` — compiles
- [ ] `npm test` — all tests pass
- [ ] Tested manually (Postman / Swagger / browser)

## Prisma Changes (backend only)
- [ ] No schema changes
- [ ] Schema changed → migration file included → `npx prisma generate` run

## Screenshots (frontend / Swagger changes)
<!-- Attach before/after screenshots -->

## Self-Review Checklist
- [ ] No business logic in controllers (backend)
- [ ] No `any` TypeScript types
- [ ] Multi-table operations use `prisma.$transaction()` (backend)
- [ ] Soft delete used — no hard DELETEs (backend)
- [ ] Audit log written for critical actions (backend)
- [ ] No secrets or `.env` files committed
- [ ] Branch created from latest `dev`
- [ ] PR is under 300 lines of change
