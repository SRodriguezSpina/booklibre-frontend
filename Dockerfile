# Levanto una imagen con nodeJS
FROM node:22-alpine

WORKDIR /app
 
# Usando la version de .nvmrc (lts/jod = Node 22)
COPY package.json package-lock.json ./
RUN npm ci
 
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
 