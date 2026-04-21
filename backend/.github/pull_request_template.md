## Summary
<!-- What does this PR do and why? -->

## Changes
<!-- List the specific changes made -->
-
-
-

## Type of Change
- [ ] New feature (non-breaking)
- [ ] Bug fix
- [ ] Refactor (no behaviour change)
- [ ] Breaking change
- [ ] Database migration included
- [ ] CI/CD change

## Testing
- [ ] `npm run lint` — passes locally
- [ ] `npx tsc --noEmit` — no type errors
- [ ] `npm run build` — compiles cleanly
- [ ] `npm test` — all tests pass
- [ ] Tested manually with Postman / Swagger

## Prisma Changes
- [ ] No schema changes in this PR
- [ ] Schema changed → migration file included → `npx prisma generate` run

## Screenshots (UI/Swagger changes only)
<!-- Attach before/after screenshots if endpoints changed -->

## Self-Review Checklist
- [ ] No business logic in controllers — only in services
- [ ] No `any` TypeScript types used
- [ ] Multi-table operations wrapped in `prisma.$transaction()`
- [ ] Soft delete used (`isActive: false`) — no hard DELETEs
- [ ] Audit log written for every critical action
- [ ] Input validated via DTO + class-validator
- [ ] No secrets, `.env` files, or credentials committed
- [ ] Branch created from latest `dev`
- [ ] PR is under 300 lines of change
