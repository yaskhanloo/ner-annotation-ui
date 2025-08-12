# NER Annotation Tool - Docker Build
# Multi-stage build: Frontend (React) + Backend (Node.js + Python)

# ============================================================================
# Stage 1: Build React Frontend
# ============================================================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci                          # Install dependencies

COPY frontend/ ./
RUN npm run build                   # Build React app for production

# ============================================================================
# Stage 2: Backend with Python Support
# ============================================================================
FROM node:18-alpine AS backend

# Install Python and build tools for PDF processing
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-setuptools \
    build-base \
    python3-dev \
    libffi-dev \
    openssl-dev

# Setup Node.js backend
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --only=production   # Install Node.js dependencies

# Install Python dependencies (pdfplumber for PDF parsing)
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy built React frontend to be served by Express
COPY --from=frontend-builder /app/frontend/dist ./public

# Create directory for PDF uploads
RUN mkdir -p uploads

# Expose port 3001
EXPOSE 3001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the Express server
CMD ["npm", "start"]