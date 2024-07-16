FROM node:20-alpine AS base
RUN apk add --update dumb-init
USER node
WORKDIR /app
COPY --chown=node:node package.json package.json
RUN yarn

# Install production dependencies only
FROM node:20-alpine AS deps
USER node
WORKDIR /app
COPY --chown=node:node package.json package.json
RUN yarn install --production

# Compile typescript sources
FROM base AS build
USER node
WORKDIR /app
COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node src/ src/
RUN yarn tsc

# Combine production only node_modules with compiled javascript files.
FROM node:20-alpine AS final
RUN apk add --update dumb-init
USER node
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist/
COPY --chown=node:node --from=build /app/package.json ./
CMD [ "dumb-init", "node", "/app/dist/index.js" ]