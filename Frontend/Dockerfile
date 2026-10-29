# STAGE 1: Build the Vite React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build argument for backend API URL (defaults to localhost:5000/api if not specified)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle (generates /app/dist)
RUN npm run build

# STAGE 2: Lightweight Production Web Server
FROM nginx:alpine

# Copy custom Nginx configuration (handles React Router SPA reload & caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
