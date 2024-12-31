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
RUN npm install
COPY server/ .

# Production stage
FROM node:20-slim
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy built client files and server files
COPY --from=client-builder /app/client/build ./client/build
COPY --from=server-builder /app/server ./server

# Set working directory to server
WORKDIR /app/server

# Create database directory
RUN mkdir -p /app/server/database && chown -R node:node /app/server/database

# Install only production dependencies
RUN npm install --only=production

# Switch to non-root user
USER node

# Create startup script with error handling
RUN echo '#!/bin/sh\n\
set -e\n\
\n\
# Ensure database directory exists\n\
mkdir -p /app/server/database\n\
\n\
# Initialize database with error handling\n\
echo "Initializing database..."\n\
npm run init-db || {\n\
    echo "Database initialization failed"\n\
    exit 1\n\
}\n\
\n\
# Start the server\n\
echo "Starting server..."\n\
exec node app.js\n\
' > /app/server/start.sh

RUN chmod +x /app/server/start.sh

# Expose the port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV DB_PATH=/app/server/database/OpenPage

# Use the startup script
CMD ["/app/server/start.sh"]