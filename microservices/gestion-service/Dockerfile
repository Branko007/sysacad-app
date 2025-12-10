# Stage 1: Builder - Instala dependencias
FROM node:20-alpine AS builder

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production

# Copia el código fuente
COPY . .

# Stage 2: Runtime - Usa Distroless para seguridad
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

# Copia node_modules y código desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Usuario no-root por defecto en distroless
# No hay shell, por lo que usamos la forma exec de CMD
CMD ["src/index.js"]

EXPOSE 3001
