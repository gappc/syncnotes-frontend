# Built on the server by gappc-deploy (hosting plan v0.3): npm ci from the lockfile, base images
# pinned by tag and index digest (fully qualified - podman on the server has no short names).
# .env.production comes from the server (build.env, VITE_WEBSOCKET_URL) and ends up in the bundle.
FROM docker.io/library/node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS builder

ENV LANGUAGE='en_US:en'

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY public/ ./public/
COPY .env* ./
COPY index.html ./
COPY tsconfig.* ./
COPY vite.config.* ./
RUN npm run build

# Production image
FROM docker.io/joseluisq/static-web-server:2.44.1-alpine@sha256:2fe3e5c0a20691f23fb270338578c8d31b5f7a19abb308c4c1ec901a7eefbe2e AS build

# port from the server's port register; /health answers for the container health check
ENV SERVER_ROOT=/public \
    SERVER_PORT=3221 \
    SERVER_HEALTH=true
COPY --from=builder /app/dist /public
