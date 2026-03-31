# OMH Payroll Roster Web

Internal web application foundation for OMH payroll roster workflows:

- Standby
- Extra Service (ES)
- PESP

## One-command local bootstrap

From this directory, run:

```bash
npm run bootstrap:dev
```

The bootstrap script will:

1. install npm dependencies
2. create `.env` from `.env.example` if missing
3. start or create a local PostgreSQL Docker container
4. run Prisma generate and Prisma schema push
5. start the Next.js development server

Then open:

- `http://localhost:3000/dashboard`

## Manual startup (alternative)

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run dev
```

## Environment overrides for bootstrap

The bootstrap script supports optional environment overrides:

- `OMH_DB_CONTAINER_NAME` (default: `omh-postgres`)
- `OMH_DB_USER` (default: `postgres`)
- `OMH_DB_PASSWORD` (default: `postgres`)
- `OMH_DB_NAME` (default: `omh_payroll_roster`)
- `OMH_DB_PORT` (default: `5432`)

Example:

```bash
OMH_DB_PORT=5433 npm run bootstrap:dev
```
