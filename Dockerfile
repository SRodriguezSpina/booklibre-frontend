# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
 
WORKDIR /app
 
# Use .nvmrc version (lts/jod = Node 22)
COPY package.json package-lock.json ./
RUN npm ci
 
COPY . .
 
# VITE_API_URL is injected at build time via --build-arg
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
 
RUN npm run build
 
# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
 
# Remove default config
RUN rm /etc/nginx/conf.d/default.conf
 
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build /app/dist /usr/share/nginx/html
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
 