# Gestion Service

Microservicio de Gestión Académica para SysAcad.

## 🚀 Características

- **API REST** para gestión de Cargos, Categorías, Tipos de Dedicación y Grupos
- **Caché con Redis** para optimizar consultas frecuentes
- **Circuit Breaker, Rate Limit y Retry** mediante Traefik
- **Imagen Distroless** para máxima seguridad
- **Balanceo de carga** con múltiples réplicas

## 📋 Requisitos

- Node.js 20 LTS
- PostgreSQL 15+
- Redis (para caché)

## ⚙️ Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores según tu entorno:

```bash
cp .env.example .env
```

Variables disponibles:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servicio | `3001` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5433` |
| `DB_NAME` | Nombre de la base de datos | `sysacad` |
| `DB_USER` | Usuario de PostgreSQL | `postgres_user` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres_user` |
| `REDIS_HOST` | Host de Redis | `localhost` |
| `REDIS_PORT` | Puerto de Redis | `6379` |

## 🏃 Ejecución

### Desarrollo local

```bash
npm install
npm run dev
```

### Producción

```bash
npm install --production
npm start
```

### Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d gestion-service
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### Cargos
```
GET    /api/gestion/cargos
POST   /api/gestion/cargos
```

### Categorías
```
GET    /api/gestion/categorias
POST   /api/gestion/categorias
```

### Tipos de Dedicación
```
GET    /api/gestion/dedicaciones
POST   /api/gestion/dedicaciones
```

### Grupos
```
GET    /api/gestion/grupos
POST   /api/gestion/grupos
```

## 🔒 Seguridad

- **Imagen Distroless**: Sin shell, package managers ni utilidades innecesarias
- **Usuario no-root**: Ejecuta con privilegios mínimos
- **Multi-stage build**: Separa dependencias de build y runtime

## 🎯 Patrones de Resiliencia

Configurados mediante Traefik:

- **Rate Limit**: 10 req/s con burst de 5
- **Retry**: 3 intentos automáticos
- **Circuit Breaker**: Se activa si >50% de respuestas son errores 5xx

## 📊 Caché

El servicio implementa caché de objetos con Redis:

- **TTL**: 1 hora (3600s)
- **Invalidación**: Automática en operaciones de escritura
- **Endpoints cacheados**: `GET /api/gestion/cargos`

## 🔄 Escalabilidad

El servicio está configurado para ejecutarse con **2 réplicas** por defecto, permitiendo:

- Balanceo de carga automático
- Alta disponibilidad
- Tolerancia a fallos

Para ajustar el número de réplicas, modifica `docker-compose.yml`:

```yaml
deploy:
  replicas: 3  # Ajusta según necesidad
```
