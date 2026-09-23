FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código del proyecto
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
