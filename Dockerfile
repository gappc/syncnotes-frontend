# Built by deploy (hosting plan v0.3b, laptop or --on-server): npm ci from the lockfile, base images
# pinned by tag and index digest (fully qualified - podman on the server has no short names).
# .env.production comes from deploy (public build values, VITE_WEBSOCKET_URL) and ends up in the bundle.
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
# the commit, for the deploy's version check (hosting deploy-contract.md)
ARG DEPLOY_SHA=unknown
RUN printf '%s\n' "$DEPLOY_SHA" > dist/_version

# Production image
FROM docker.io/joseluisq/static-web-server:2.44.1-alpine@sha256:2fe3e5c0a20691f23fb270338578c8d31b5f7a19abb308c4c1ec901a7eefbe2e AS build

# port from the server's port register; /health answers for the container health check
ENV SERVER_ROOT=/public \
    SERVER_PORT=3221 \
    SERVER_HEALTH=true
COPY --from=builder /app/dist /public
