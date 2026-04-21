# ThunderERP — Infrastructure

## Contents

### `nginx/`
Nginx reverse proxy configuration for production.  
Routes `/api` to the NestJS backend and `/` to the React frontend.

### `scripts/`
Deployment and maintenance shell scripts.

## Production Architecture

```
Internet
    ↓
Nginx (port 80/443)
    ├── /api  →  NestJS backend  (port 3000)
    └── /     →  React frontend  (static files)
                       ↓
              PostgreSQL (port 5432)
```

## Deployment

See the GitHub Actions workflows in `../.github/workflows/deploy.yml`.  
Staging deploys automatically on merge to `dev`.  
Production deploys automatically on merge to `main` (requires manual approval).
