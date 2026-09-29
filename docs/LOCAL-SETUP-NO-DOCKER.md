# Local Setup — No Docker (Windows 10 Home, older builds)

For machines that can't run Docker Desktop (e.g. build 16299, low RAM). Uses direct installs.

## 1. Install Node 20 LTS
1. Go to https://nodejs.org → LTS 20.x Windows Installer (x64 `.msi`)
2. Install with defaults (includes npm). Reboot if prompted.
3. Verify in new PowerShell:
   ```
   node --version
   npm --version
   ```
4. Enable pnpm: `npm i -g pnpm` (or `corepack enable`).

## 2. Install Postgres 16 (EDB, no Docker)
1. Download: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads → PostgreSQL 16.x Windows x86-64
2. Run installer:
   - Install dir: `C:\Program Files\PostgreSQL\16` (default)
   - Components: Server + Command Line Tools (pgAdmin optional)
   - Data dir: default
   - Password: set `postgres` superuser password — **save it**
   - Port: `5432` (default)
   - Locale: default
3. Verify:
   ```
   psql --version
   ```

## 3. Create muzik2go DB
Open SQL Shell (psql) or pgAdmin, run:
```sql
CREATE USER muzik2go WITH PASSWORD 'muzik2go';
CREATE DATABASE muzik2go OWNER muzik2go;
GRANT ALL PRIVILEGES ON DATABASE muzik2go TO muzik2go;
```
Test:
```
psql -h localhost -U muzik2go -d muzik2go -c "select 1;"
```
(Password: `muzik2go`)

## 4. Redis — skip for dev (use Postgres queue)
Official Redis doesn't run natively on old Windows. Options:
- **Recommended for Phase 1-4:** skip Redis. Use in-memory BullMQ stub or `pg-boss` (Postgres as queue). Analysis jobs run inline in dev.
- Later (22H2 + WSL2): `wsl --install` then Redis in WSL, or Memurai Developer.
- Set in `.env`: `REDIS_URL=` (leave empty — API falls back to inline mode).

## 5. Env
```
copy .env.example .env
```
Edit `.env`:
```
DATABASE_URL=postgresql://muzik2go:muzik2go@localhost:5432/muzik2go
REDIS_URL=
BETTER_AUTH_SECRET=<any 32+ char random>
BETTER_AUTH_URL=http://localhost:3000
R2_ACCOUNT_ID= / R2 keys (real R2) — or leave blank; uploads stay local in dev
GROQ_API_KEY=<rotated key, server-only>
```

## 6. Install + migrate + run
```
cd web
pnpm install
pnpm drizzle-kit push   # after drizzle config wired (Phase 1 stub needs DATABASE_URL)
pnpm dev
```
Open http://localhost:3000 (landing → /start → /studio).

Mobile (later, needs Node too):
```
cd mobile
pnpm install
pnpm start
```

## 7. Verify Phase 1
- [ ] Landing loads, CTA → /start
- [ ] Email gate → /studio (stub auth-check)
- [ ] `psql` connects, tables created after migrate
- [ ] No Docker required

## Upgrade path
When you reach 22H2 + WSL2, switch to `docker compose up -d postgres redis` and set `REDIS_URL=redis://localhost:6379`. No code change needed.
