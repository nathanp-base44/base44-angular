# Base44 Dev Environment

## Stack
- Angular 18 frontend (port 4200 inside compose, proxied to 3000)
- Node/Express API (`db/server.js`) serving GET /api/orders from Postgres
- Postgres 16 database (orders table, seeded on first boot by `db/seed.js`)

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
App is served on port 3000 via nginx, which proxies `/api/*` to the api service and everything else to the Angular dev server.

## Services
- `web` — Angular dev server with live reload (`ng serve`)
- `api` — Express API (`node --watch`), queries Postgres
- `postgres` — postgres:16, persistent `pgdata` volume, healthchecked with `pg_isready`
- `seed` — one-shot, runs `db/seed.js` after postgres is healthy, then exits
- `proxy` — nginx routing /api to api:4000 and / to web:4200

## Notes
- The dev server uses `--allowed-hosts all` (Angular 18 builder has no `--disable-host-check`).
- `npm install` runs on every container start for both `web` and `api` (node_modules in anonymous volumes).
- The api service reads `/run/base44/app.env` last so user-provided DB credentials override the inline defaults.
- No external secrets required for local dev; Postgres credentials are inline generated defaults.
