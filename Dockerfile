# Build stage for React client
FROM node:20-slim as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
ENV NODE_ENV=production
ENV CI=true
RUN npm run build

# Build stage for server
FROM node:20-slim as server-builder
WORKDIR /app/server
COPY server/package*.json ./

# Install build essentials for SQLite3
RUN apt-get update && \
    apt-get install -y python3 make g++ python3-pip build-essential
RUN npm install
COPY server/ .

# Production stage
FROM node:20-slim
WORKDIR /app

# Install required dependencies for SQLite3
RUN apt-get update && \
    apt-get install -y python3 make g++ python3-pip build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy built client files and server files
COPY --from=client-builder /app/client/build ./client/build
COPY --from=server-builder /app/server ./server

# Set working directory to server
WORKDIR /app/server

# Install production dependencies and rebuild SQLite3
RUN npm install --only=production && \
    npm rebuild sqlite3 --build-from-source

# Expose the port
EXPOSE 8080

# Set environment variable
ENV NODE_ENV=production

# Run database initialization and then start the server
CMD ["node", "app.js"]