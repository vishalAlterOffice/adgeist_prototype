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
COPY --from=dependencies /app/node_modules ./node_modules

# Copy the api folder to the runner stage
COPY --from=builder /app/api ./api


# Use an ARG to accept the Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy the appropriate .env file based on NODE_ENV if it exists
RUN if [ -f .env.${NODE_ENV} ]; then cp .env.${NODE_ENV} .env.${NODE_ENV}; fi

RUN apt-get update && apt-get install -y curl

CMD npm run start:prod



