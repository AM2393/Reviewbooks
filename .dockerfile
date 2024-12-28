# Build stage for React client
FROM node:20-slim as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build stage for server
FROM node:20-slim as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .

# Production stage
FROM node:20-slim
WORKDIR /app

# Copy built client files
COPY --from=client-builder /app/client/build /app/client/build

# Copy server files and dependencies
COPY --from=server-builder /app/server /app/server

# Set working directory to server
WORKDIR /app/server

# Expose the port your server runs on
EXPOSE 8080

# Start the server
CMD ["node", "app.js"]