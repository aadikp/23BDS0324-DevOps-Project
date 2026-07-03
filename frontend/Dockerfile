# ═══════════════════════════════════════════════════════════════════════════════
# TravelSphere Frontend — Multi-Stage Dockerfile
# ═══════════════════════════════════════════════════════════════════════════════
#
# Stage 1 │ BUILD   — Install npm dependencies and run Vite production build
# Stage 2 │ RUNTIME — Serve the /dist assets with NGINX + API reverse-proxy
#
# Usage:
#   docker build -t travelsphere-frontend .
#   docker run -p 80:80 travelsphere-frontend
#
# NGINX forwards /api/* → travelsphere-backend:8080
# Configure this via nginx.conf or an environment-specific override.
# ═══════════════════════════════════════════════════════════════════════════════


# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:18-alpine AS build

LABEL stage="build"

WORKDIR /app

# Copy package manifests first — this layer is cached as long as package.json
# and package-lock.json don't change, so npm install is skipped on source-only
# changes (major build-time saving).
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies needed for Vite build).
# --frozen-lockfile ensures reproducible installs (same versions as lock file).
RUN npm ci --frozen-lockfile

# Copy the full source tree and run the Vite production build.
# Output lands in /app/dist
COPY . .
RUN npm run build


# ─── Stage 2: Production Runtime ──────────────────────────────────────────────
FROM nginx:alpine AS runtime

LABEL maintainer="TravelSphere DevOps <devops@travelsphere.io>"
LABEL version="1.0.0"
LABEL description="TravelSphere React Frontend served by NGINX"

# ── Remove default NGINX placeholder content ──────────────────────────────────
RUN rm -rf /usr/share/nginx/html/*

# ── Copy production build assets from Stage 1 ────────────────────────────────
# Only the compiled /dist assets cross into this stage.
# No Node, no npm, no source code — keeps the final image tiny (~25 MB).
COPY --from=build /app/dist /usr/share/nginx/html

# ── Copy custom NGINX configuration ──────────────────────────────────────────
# Replaces the default nginx.conf with our SPA-aware config that:
#   • Handles client-side React Router fallback (try_files → index.html)
#   • Proxies /api/* to the Spring Boot backend container
#   • Enables gzip compression and long-lived asset caching
#   • Adds security headers (X-Frame-Options, CSP, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ── Port ──────────────────────────────────────────────────────────────────────
EXPOSE 80

# ── Healthcheck ───────────────────────────────────────────────────────────────
# Verify that NGINX is up and serving the index page.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1/ || exit 1

# ── Entrypoint ────────────────────────────────────────────────────────────────
# Run NGINX in the foreground (daemon off) so Docker can track the process.
CMD ["nginx", "-g", "daemon off;"]
