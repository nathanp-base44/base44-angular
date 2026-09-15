# Base44 Dev Environment

## Stack
- Angular 18 frontend (no backend, no database)
- Node 22 runtime via docker compose

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
App is served on port 3000 with live reload (watch mode).

## Notes
- The dev server uses `--allowed-hosts all` because Angular 18's application builder doesn't support `--disable-host-check`.
- `npm install` runs on every container start (node_modules are in an anonymous volume, not bind-mounted).
- No external secrets or credentials required.
