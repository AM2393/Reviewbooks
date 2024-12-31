# Dockerfile
# Build stage for React client
FROM node:20-slim as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
# Ensure environment variables are set for production build
ENV NODE_ENV=production
ENV CI=true
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

# Copy built client files and server files
COPY --from=client-builder /app/client/build ./client/build
COPY --from=server-builder /app/server ./server

# Set working directory to server
WORKDIR /app/server

# Install only production dependencies
RUN npm install --only=production

# Expose the port
EXPOSE 8080

# Create a shell script to run both commands
RUN echo '#!/bin/sh\nnpm run init-db && node app.js' > /app/server/start.sh
RUN chmod +x /app/server/start.sh

# Use the shell script as the entry point
CMD ["/app/server/start.sh"]