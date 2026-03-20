# Levanto una imagen con nodeJS
FROM node:22-alpine AS build
 
WORKDIR /app
 
# Usando la version de .nvmrc (lts/jod = Node 22)
COPY package.json package-lock.json ./
RUN npm ci
 
COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
 
RUN npm run build
 
# Run nginx (servidor web reverse proxy)
FROM nginx:1.27-alpine
 
# Cambio configuracion por defecto a la nuestra
RUN rm /etc/nginx/conf.d/default.conf
 
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build /app/dist /usr/share/nginx/html
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
 