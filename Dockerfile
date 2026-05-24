# Levanto una imagen con nodeJS
FROM node:22-alpine

WORKDIR /app
 
RUN npm install -g pnpm

# Usando la version de .nvmrc (lts/jod = Node 22)
COPY package.json pnpm-lock.yaml ./
ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true
RUN pnpm install --frozen-lockfile
 
EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host"]
 