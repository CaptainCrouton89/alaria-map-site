---
name: headless
description: Start/restart the alaria-map-site Next.js dev server (web) in background. Use when starting the dev server, checking status, debugging server issues, or needing to know where logs live.
allowed-tools: Bash, Read, Grep, Glob
---

# Headless Dev Servers

Start and manage the alaria-map-site Next.js dev server as a supervised background process. Logs are isolated per grove instance at `/tmp/grove/<path-slug>/` — run the script once to see the exact path.

## Quick Start

```bash
.claude/scripts/headless.sh              # start all (just web)
.claude/scripts/headless.sh web          # start the web server
.claude/scripts/headless.sh restart web  # restart it
.claude/scripts/headless.sh stop all     # stop everything
```

## Service Map

| Service | Port Source | Directory | Start Command | Log |
|---------|-------------|-----------|---------------|-----|
| web | `./.env` `PORT` (default 3000) | `.` | `PORT=$PORT pnpm dev` (Next.js 16, App Router) | `<LOG_DIR>/web-dev.log` |

The web service serves `/` (map viewer), `/codex` (lore browser), and `/pin` (admin pinning UI). Tiles are fetched from Cloudflare R2 at runtime — no local tile generation needed before `pnpm dev`.

## Finding logs for this instance

```bash
echo "/tmp/grove/$(pwd | sed 's|^/||; s|/|-|g')"
tail -100 /tmp/grove/$(pwd | sed 's|^/||; s|/|-|g')/web-dev.log
```

## Troubleshooting

- **Port already in use, "skipping web":** another grove instance or stray process holds the port. `lsof -i :<port> -sTCP:LISTEN` to find it. The supervisor only starts services whose port is free OR already owned by this repo path.
- **Tiles not loading:** the app fetches `https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/tiles/config.json` at runtime. If R2 is down or the bucket is empty, the map won't render. Check the browser console; this is not a dev-server problem.
- **`/pin` writes vanish in production:** the `/api/pin` route uses `fs.writeFileSync` to `data/*.json`. Works locally; fails on Vercel/serverless. This is by design (pinning is local-only).
- **Watchdog killed it:** if the supervisor logs `WATCHDOG: port X unresponsive for 30s`, the Next.js process was alive but not listening. This usually means a compile error inside `next dev` that didn't crash the process. Check the log above the WATCHDOG line for the actual error.
- **Stale `.next/`:** if dev server starts but pages 500 with weird hydration errors after a Next.js version bump, `rm -rf .next` and restart.

Check logs first, not dashboards. Check listening sockets with `lsof -i :<port> -sTCP:LISTEN`.

## Arguments

- `all` (or no args) — start every service
- `<alias>` — start only that service (currently only `web`)
- `stop <alias|all>` — stop without restarting
- `restart <alias|all>` — stop then start
