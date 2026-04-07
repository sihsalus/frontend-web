# Dockerfile

# Stage 1: Build local @sihsalus/* modules — deterministic, no network required
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy manifest files first — install cache survives source-only changes
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY .yarn/ ./.yarn/

# Copy only package.json files to preserve install cache across source changes
COPY packages/apps/*/package.json ./packages/apps/
COPY packages/libs/*/package.json ./packages/libs/
COPY packages/tooling/*/package.json ./packages/tooling/

ENV CI=true
RUN yarn install --immutable

# Now copy full source and build
COPY packages/ ./packages/
RUN yarn turbo run build --filter='./packages/apps/*' --filter='!@sihsalus/esm-form-entry-app'

# Stage 2: Init container image
# Runs at deployment time: assembles built modules into SPA_OUTPUT_DIR.
# The infra repo mounts a shared volume at SPA_OUTPUT_DIR; nginx serves from it.
FROM node:22-alpine AS init
WORKDIR /app

ENV NODE_ENV=production
ENV SPA_OUTPUT_DIR=/spa

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/apps ./packages/apps
COPY --from=builder /app/packages/tooling/assemble-importmap.js ./packages/tooling/assemble-importmap.js
COPY config/spa-assemble-config.json ./config/spa-assemble-config.json

CMD ["node", "packages/tooling/assemble-importmap.js"]
