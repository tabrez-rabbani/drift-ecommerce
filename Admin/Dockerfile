# STAGE 1: Build the Vite React Admin Panel
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Environment variables for build time
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_STOREFRONT_URL=http://localhost:5173
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STOREFRONT_URL=$VITE_STOREFRONT_URL

RUN npm run build

# STAGE 2: Lightweight Production Web Server
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
