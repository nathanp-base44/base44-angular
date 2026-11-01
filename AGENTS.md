# Base44 Dev Environment

## Stack
- Angular 18 frontend (port 4200 inside compose, proxied to 3000)
- Node/Express API (`db/server.js`) serving GET /api/orders and CRUD /api/users (GET, POST, PATCH /:id, DELETE /:id) from Postgres
- Postgres 16 database (orders and users tables, each seeded when empty by `db/seed.js`)
- Admin user management page at `/admin/users` (sidebar "Users"). The app has no auth yet, so the page is not access-gated.
- `node --watch` only reloads `server.js`; after editing `db/seed.js` restart the `api` service to re-run seeding.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
App is served on port 3000 via nginx, which proxies `/api/*` to the api service and everything else to the Angular dev server.

## Services
- `web` — Angular dev server with live reload (`ng serve`)
- `api` — Express API (`node --watch`), queries Postgres
- `postgres` — postgres:16, persistent `pgdata` volume, healthchecked with `pg_isready`
- Seeding: `api` runs the idempotent `db/seed.js` on every start before launching the server
- `proxy` — nginx routing /api to api:4000 and / to web:4200

## Notes
- The dev server uses `--allowed-hosts all` (Angular 18 builder has no `--disable-host-check`).
- `npm install` runs on every container start for both `web` and `api` (node_modules in anonymous volumes).
- The api service reads `/run/base44/app.env` last so user-provided DB credentials override the inline defaults.
- No external secrets required for local dev; Postgres credentials are inline generated defaults.
