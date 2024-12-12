# Stage 1: Dependencies
FROM node:20.14.0 as dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20.14.0 as builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Runner
FROM node:20.14.0-slim as runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=dependencies /app/node_modules ./node_modules

CMD npm run start:prod