# 🎯 Guía de Demostración Completa del Sistema

Esta guía te llevará paso a paso por una demostración completa de **Sysacad App**, mostrando todas las funcionalidades, microservicios, patrones de resiliencia y métricas.

---

## 📋 Tabla de Contenidos

1. [Preparación del Entorno](#1-preparación-del-entorno)
2. [Levantar la Infraestructura](#2-levantar-la-infraestructura)
3. [Verificar Servicios](#3-verificar-servicios)
4. [Probar API Principal](#4-probar-api-principal)
5. [Probar Microservicio de Gestión](#5-probar-microservicio-de-gestión)
6. [Verificar Patrones de Resiliencia](#6-verificar-patrones-de-resiliencia)
7. [Monitorear con Traefik](#7-monitorear-con-traefik)
8. [Ejecutar Tests](#8-ejecutar-tests)
9. [Pruebas de Carga con k6](#9-pruebas-de-carga-con-k6)
10. [Verificación Automatizada](#10-verificación-automatizada)

---

## 1. Preparación del Entorno

### ✅ Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [x] Node.js v18+ instalado
- [x] Docker Desktop corriendo
- [x] Git configurado
- [x] PowerShell o Terminal

### 📁 Verificar Estructura del Proyecto

```powershell
# Navegar al proyecto
cd C:\Users\Usuario\Desktop\sysacad-app

# Verificar estructura
dir
```

**Deberías ver:**
- `src/` - Código fuente principal
- `microservices/` - Microservicios
- `docs/` - Documentación
- `scripts/` - Scripts de utilidad
- `docker-compose.yml` - Orquestación
- `.env` - Variables de entorno

### 🔧 Verificar Variables de Entorno

```powershell
# Ver contenido del .env
cat .env
```

**Debe contener:**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=sysacad
DB_USER=postgres_user
DB_PASSWORD=postgres_user
JWT_SECRET=una_clave_secreta_segura
```

---

## 2. Levantar la Infraestructura

### 🐳 Paso 1: Levantar Docker Compose

```powershell
# Levantar todos los servicios
docker-compose up -d
```

**Esto iniciará:**
- ✅ PostgreSQL (puerto 5433)
- ✅ Redis (puerto 6379)
- ✅ Traefik (puertos 8090, 8091)
- ✅ Gestion-Service (2 réplicas)

### 📊 Paso 2: Verificar Contenedores

```powershell
# Ver estado de todos los contenedores
docker-compose ps
```

**Salida esperada:**
```
NAME                STATUS              PORTS
sysacad-app         Up 10 seconds       0.0.0.0:5433->5432/tcp
sysacad-redis       Up 10 seconds       0.0.0.0:6379->6379/tcp
traefik             Up 10 seconds       0.0.0.0:8090->80/tcp, 0.0.0.0:8091->8080/tcp
gestion-service-1   Up 10 seconds       3001/tcp
gestion-service-2   Up 10 seconds       3001/tcp
```

### 🔍 Paso 3: Ver Logs

```powershell
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f gestion-service

# Detener logs: Ctrl+C
```

**Busca estos mensajes:**
- ✅ `Database connected and synced` (gestion-service)
- ✅ `Redis Client Connected` (gestion-service)
- ✅ `Gestion Service running on port 3001` (gestion-service)

---

## 3. Verificar Servicios

### 🗄️ Paso 1: Verificar PostgreSQL

```powershell
# Conectar a PostgreSQL
docker exec -it sysacad-app psql -U postgres_user -d sysacad

# Dentro de psql:
\dt                    # Listar tablas
SELECT * FROM usuarios LIMIT 5;
\q                     # Salir
```

### 📦 Paso 2: Verificar Redis

```powershell
# Conectar a Redis
docker exec -it sysacad-redis redis-cli

# Dentro de redis-cli:
PING                   # Debe responder: PONG
KEYS *                 # Ver todas las claves
GET cargos:all         # Ver caché de cargos (si existe)
exit                   # Salir
```

### 🌐 Paso 3: Verificar Traefik

```powershell
# Verificar que Traefik responde
curl http://localhost:8091/api/overview
```

**Debe devolver JSON con información de Traefik**

---

## 4. Probar API Principal

### 🚀 Paso 1: Levantar Servidor Principal

```powershell
# En una nueva terminal
npm run dev
```

**Salida esperada:**
```
🚀 Servidor corriendo en http://localhost:3000
```

### 🔐 Paso 2: Probar Autenticación

**Login como Admin:**

```powershell
# Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@sysacad.com\",\"password\":\"12345678\"}'
```

**Respuesta esperada:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "admin@sysacad.com",
    "rol": "admin"
  }
}
```

**Nota:** Guarda la cookie de sesión para las siguientes peticiones.

### 👥 Paso 3: Probar Endpoints de Usuarios

```powershell
# Listar usuarios (requiere autenticación)
curl http://localhost:3000/api/usuarios `
  -H "Cookie: token=TU_TOKEN_AQUI"

# Obtener usuario específico
curl http://localhost:3000/api/usuarios/1 `
  -H "Cookie: token=TU_TOKEN_AQUI"
```

### 🎓 Paso 4: Probar Endpoints de Alumnos

```powershell
# Listar alumnos
curl http://localhost:3000/api/alumnos `
  -H "Cookie: token=TU_TOKEN_AQUI"

# Crear alumno
curl -X POST http://localhost:3000/api/alumnos `
  -H "Content-Type: application/json" `
  -H "Cookie: token=TU_TOKEN_AQUI" `
  -d '{
    "persona": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",
      "email": "juan.perez@example.com",
      "telefono": "123456789"
    },
    "legajo": "A-2024-001",
    "fecha_ingreso": "2024-03-01"
  }'
```

### 👨‍🏫 Paso 5: Probar Endpoints de Profesores

```powershell
# Listar profesores
curl http://localhost:3000/api/profesores `
  -H "Cookie: token=TU_TOKEN_AQUI"
```

---

## 5. Probar Microservicio de Gestión

### 🏥 Paso 1: Health Check

```powershell
# Verificar que el servicio está vivo
curl http://gestion.localhost:8090/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "service": "Gestion Service"
}
```

### 📚 Paso 2: Listar Cargos (con Caché)

**Primera petición (DB):**

```powershell
# Primera petición - va a la base de datos
curl http://gestion.localhost:8090/api/gestion/cargos
```

**Ver logs:**
```powershell
docker-compose logs --tail=10 gestion-service
```

**Deberías ver:** `Serving from DB`

**Segunda petición (Caché):**

```powershell
# Segunda petición - viene de Redis
curl http://gestion.localhost:8090/api/gestion/cargos
```

**Ver logs nuevamente:**
```powershell
docker-compose logs --tail=10 gestion-service
```
**Deberías ver:** `Serving from Cache` ✅

### 📝 Paso 3: Crear un Cargo (Invalida Caché)

**Windows (PowerShell):**

```powershell
# Crear nuevo cargo
Invoke-WebRequest -Uri "http://localhost:8090/api/gestion/cargos" `
  -Method POST `
  -Headers @{"Host"="gestion.localhost"; "Content-Type"="application/json"} `
  -Body '{"nombre":"Profesor Adjunto","puntos":80,"descripcion":"Cargo de profesor adjunto","categoriaCargoId":1}'
```

**macOS/Linux (bash/zsh):**

```bash
# Crear nuevo cargo
curl -X POST http://localhost:8090/api/gestion/cargos \
  -H "Host: gestion.localhost" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Profesor Adjunto",
    "puntos": 80,
    "descripcion": "Cargo de profesor adjunto",
    "categoriaCargoId": 1
  }'
```

**Campos obligatorios:**
- ✅ `nombre` - String
- ✅ `puntos` - Integer

**Esto invalida el caché automáticamente**

### 🔄 Paso 4: Verificar Invalidación de Caché

```powershell
# Hacer otra petición GET
curl http://gestion.localhost:8090/api/gestion/cargos

# Ver logs
docker-compose logs --tail=10 gestion-service
```

**Deberías ver:** `Serving from DB` (caché invalidado) ✅

### 📊 Paso 5: Probar Otros Endpoints

```powershell
# Categorías
curl http://gestion.localhost:8090/api/gestion/categorias

# Tipos de Dedicación
curl http://gestion.localhost:8090/api/gestion/dedicaciones

# Grupos
curl http://gestion.localhost:8090/api/gestion/grupos
```

---

## 6. Verificar Patrones de Resiliencia

### 🛡️ Paso 1: Rate Limiting (10 req/s)

**Enviar 20 peticiones rápidas:**

```powershell
# Script para enviar múltiples peticiones
1..20 | ForEach-Object {
    $response = curl -s -w "%{http_code}" http://gestion.localhost:8090/api/gestion/cargos
    Write-Host "Petición $_: $response"
}
```

**Resultado esperado:**
- Primeras ~10-15 peticiones: `200 OK`
- Siguientes peticiones: `429 Too Many Requests` ✅

**Ver logs de Traefik:**
```powershell
docker-compose logs traefik | Select-String "rate"
```

### 🔄 Paso 2: Retry (3 intentos)

**Simular fallo temporal:**

```powershell
# Escalar a 1 réplica (simula fallo de una instancia)
docker-compose up -d --scale gestion-service=1

# Hacer peticiones
curl http://gestion.localhost:8090/api/gestion/cargos

# Restaurar 2 réplicas
docker-compose up -d --scale gestion-service=2
```

**Ver logs de Traefik:**
```powershell
docker-compose logs traefik | Select-String "retry"
```

### ⚡ Paso 3: Circuit Breaker (>50% errores)

**Simular errores 5xx:**

```powershell
# Detener la base de datos
docker-compose stop db

# Hacer varias peticiones
1..10 | ForEach-Object {
    curl http://gestion.localhost:8090/api/gestion/cargos
}

# Restaurar la base de datos
docker-compose start db
```

**Resultado esperado:**
- Primeras peticiones: `500 Internal Server Error`
- Después del umbral: `503 Service Unavailable` (Circuit Breaker abierto) ✅

### 🔄 Paso 4: Balanceo de Carga

**Verificar que las peticiones se distribuyen entre réplicas:**

```powershell
# Ver logs de ambas réplicas
docker-compose logs -f gestion-service
```

**Hacer peticiones:**
```powershell
1..10 | ForEach-Object {
    curl http://gestion.localhost:8090/api/gestion/cargos
    Start-Sleep -Milliseconds 500
}
```

**Deberías ver logs alternando entre `gestion-service-1` y `gestion-service-2`** ✅

---

## 7. Monitorear con Traefik

### 🎛️ Paso 1: Acceder al Dashboard

**Abrir en el navegador:**
```
http://localhost:8091
```

### 📊 Paso 2: Verificar Routers

1. Click en **"HTTP"** → **"Routers"**
2. Buscar: `gestion-service@docker`
3. Verificar:
   - ✅ Status: **Enabled** (verde)
   - ✅ Rule: `Host(\`gestion.localhost\`)`
   - ✅ Service: `gestion-service@docker`
   - ✅ Middlewares: 3 aplicados

### 🔧 Paso 3: Verificar Services

1. Click en **"HTTP"** → **"Services"**
2. Buscar: `gestion-service@docker`
3. Verificar:
   - ✅ Load Balancer: **wrr** (weighted round robin)
   - ✅ Servers: **2 instancias UP** (verde)

### 🛡️ Paso 4: Verificar Middlewares

1. Click en **"HTTP"** → **"Middlewares"**
2. Verificar:

   **a) `gestion-service-ratelimit@docker`**
   - Type: `RateLimit`
   - Average: `10`
   - Burst: `5`

   **b) `gestion-service-retry@docker`**
   - Type: `Retry`
   - Attempts: `3`

   **c) `gestion-service-cb@docker`**
   - Type: `CircuitBreaker`
   - Expression: `ResponseCodeRatio(500, 600, 0, 600) > 0.5`

### 📈 Paso 5: API de Métricas

**Obtener métricas en JSON:**

```powershell
# Overview general
curl http://localhost:8091/api/overview | ConvertFrom-Json

# Routers HTTP
curl http://localhost:8091/api/http/routers | ConvertFrom-Json

# Services HTTP
curl http://localhost:8091/api/http/services | ConvertFrom-Json

# Middlewares HTTP
curl http://localhost:8091/api/http/middlewares | ConvertFrom-Json
```

---

## 8. Ejecutar Tests

### 🧪 Paso 1: Tests Unitarios

```powershell
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar tests específicos
npm test -- usuario.service.test.js
```

**Salida esperada:**
```
PASS  src/tests/services/usuario.service.test.js
PASS  src/tests/services/persona.service.test.js
PASS  src/tests/services/alumno.service.test.js

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```

### 📊 Paso 2: Ver Reporte de Coverage

```powershell
# Abrir reporte HTML
start coverage/lcov-report/index.html
```

---

## 9. Pruebas de Carga con k6

### 📦 Paso 1: Verificar Script de k6

```powershell
# Ver el script de prueba
cat load-test.js
```

### 🚀 Paso 2: Ejecutar Prueba de Carga

```powershell
# Ejecutar k6 con Docker
docker run --rm -i --network=mired grafana/k6 run - < load-test.js
```

**Parámetros de la prueba:**
- **Duración**: 2 minutos
- **Usuarios**: 0 → 20 → 0 (ramp up/down)
- **Endpoint**: `/api/gestion/cargos`

### 📊 Paso 3: Analizar Resultados

**Métricas clave:**

```
✓ http_req_duration.............avg=5.2ms    p(95)=8.5ms
✓ http_reqs.....................~3600 total
✓ http_req_failed...............20.59% (Rate Limit)
```

**Interpretación:**
- ✅ **79.41% éxito** → Peticiones servidas correctamente
- ✅ **20.59% fallo** → Bloqueadas por Rate Limit (429)
- ✅ **p95 < 10ms** → Caché de Redis funcionando óptimamente

### 📝 Paso 4: Ver Análisis Detallado

```powershell
# Abrir análisis completo
code metrics_analysis.md
```

---

## 10. Verificación Automatizada

### 🤖 Paso 1: Ejecutar Script de Verificación

```powershell
# Ejecutar script PowerShell
.\scripts\verify-metrics.ps1
```

**El script verifica automáticamente:**

1. ✅ Traefik está corriendo
2. ✅ Dashboard accesible
3. ✅ Router `gestion-service` configurado
4. ✅ Middlewares aplicados (Rate Limit, Retry, Circuit Breaker)
5. ✅ Service con 2 réplicas UP
6. ✅ Redis corriendo
7. ✅ PostgreSQL corriendo
8. ✅ Health check responde 200 OK
9. ✅ Rate Limit funciona (test de 15 peticiones)
10. ✅ Caché de Redis operativo

### 📊 Paso 2: Interpretar Resultados

**Salida esperada:**

```
🔍 Verificación de Métricas de Traefik
======================================

1️⃣  Verificando Traefik...
✅ Traefik está corriendo

2️⃣  Verificando Dashboard...
✅ Dashboard accesible en http://localhost:8091

3️⃣  Verificando Router gestion-service...
✅ Router 'gestion-service@docker' encontrado
  ✅ Middleware: Rate Limit
  ✅ Middleware: Retry
  ✅ Middleware: Circuit Breaker

4️⃣  Verificando Service y Réplicas...
✅ Service 'gestion-service@docker' encontrado
  ✅ Réplicas activas: 2

5️⃣  Verificando Redis...
✅ Redis está corriendo

6️⃣  Verificando PostgreSQL...
✅ PostgreSQL está corriendo

7️⃣  Test de Conectividad...
✅ Health check: 200 OK

8️⃣  Test de Rate Limit...
   Enviando 15 peticiones rápidas...
   200 OK: 12
   429 Too Many Requests: 3
✅ Rate Limit está funcionando

9️⃣  Verificando Caché...
   Primera petición (debe ir a DB)...
   Segunda petición (debe venir de caché)...
✅ Caché de Redis funcionando

======================================
📊 Resumen de Verificación
======================================

🔗 URLs Importantes:
   • Dashboard Traefik: http://localhost:8091
   • API Gestion: http://gestion.localhost:8090/api/gestion/cargos
   • Health Check: http://gestion.localhost:8090/health

✅ Verificación completada!
```

---

## 🎯 Checklist de Demostración Completa

Usa este checklist para asegurarte de que todo funciona:

### Infraestructura
- [ ] Docker Compose levantado (`docker-compose ps`)
- [ ] PostgreSQL corriendo (puerto 5433)
- [ ] Redis corriendo (puerto 6379)
- [ ] Traefik corriendo (puertos 8090, 8091)
- [ ] 2 réplicas de gestion-service UP

### API Principal
- [ ] Servidor principal corriendo (`npm run dev`)
- [ ] Login exitoso (admin@sysacad.com)
- [ ] Listar usuarios funciona
- [ ] Listar alumnos funciona
- [ ] Listar profesores funciona

### Microservicio de Gestión
- [ ] Health check responde 200 OK
- [ ] GET /cargos funciona
- [ ] Primera petición va a DB (log: "Serving from DB")
- [ ] Segunda petición viene de caché (log: "Serving from Cache")
- [ ] POST /cargos invalida caché
- [ ] GET /categorias funciona
- [ ] GET /dedicaciones funciona
- [ ] GET /grupos funciona

### Patrones de Resiliencia
- [ ] Rate Limit funciona (429 después de 10 req/s)
- [ ] Retry configurado (3 intentos)
- [ ] Circuit Breaker se activa con >50% errores
- [ ] Balanceo de carga entre 2 réplicas

### Traefik Dashboard
- [ ] Dashboard accesible en http://localhost:8091
- [ ] Router `gestion-service@docker` visible
- [ ] Service muestra 2 servers UP
- [ ] Middlewares aplicados correctamente

### Tests
- [ ] Tests unitarios pasan (`npm test`)
- [ ] Coverage > 80%

### Pruebas de Carga
- [ ] k6 ejecutado exitosamente
- [ ] Tasa de éxito ~79%
- [ ] Rate Limit bloqueó ~20% de peticiones
- [ ] Latencia p95 < 10ms

### Verificación Automatizada
- [ ] Script `verify-metrics.ps1` ejecutado
- [ ] Todas las verificaciones en verde ✅

---

## 🚨 Troubleshooting

### Problema: "Cannot connect to Docker daemon"

**Solución:**
```powershell
# Verificar que Docker Desktop está corriendo
docker version

# Si no está corriendo, iniciar Docker Desktop
```

### Problema: "Port 5433 already in use"

**Solución:**
```powershell
# Detener contenedores existentes
docker-compose down

# Cambiar puerto en docker-compose.yml o .env
```

### Problema: "gestion.localhost no resuelve"

**Solución:**
```powershell
# Usar el header Host
curl -H "Host: gestion.localhost" http://localhost:8090/health

# O agregar a C:\Windows\System32\drivers\etc\hosts:
# 127.0.0.1 gestion.localhost
```

### Problema: "Redis connection failed"

**Solución:**
```powershell
# Verificar que Redis está corriendo
docker-compose ps redis

# Ver logs de Redis
docker-compose logs redis

# Reiniciar Redis
docker-compose restart redis
```

### Problema: "Database connection failed"

**Solución:**
```powershell
# Verificar que PostgreSQL está corriendo
docker-compose ps db

# Ver logs de PostgreSQL
docker-compose logs db

# Conectar manualmente para verificar
docker exec -it sysacad-app psql -U postgres_user -d sysacad
```

---

## 📚 Recursos Adicionales

- **Guía de Métricas**: [`docs/traefik-metrics-guide.md`](traefik-metrics-guide.md)
- **Análisis de k6**: [`metrics_analysis.md`](../metrics_analysis.md)
- **README Principal**: [`README.md`](../README.md)
- **Tutorial Completo**: [`tutorial.md`](../tutorial.md)

---

## 🎉 ¡Demostración Completada!

Si todos los checks están en verde ✅, tu sistema está funcionando perfectamente con:

- ✅ Arquitectura de microservicios
- ✅ Patrones de resiliencia (Rate Limit, Retry, Circuit Breaker)
- ✅ Caché de objetos con Redis
- ✅ Balanceo de carga con 2 réplicas
- ✅ Monitoreo con Traefik
- ✅ Tests automatizados
- ✅ Pruebas de carga validadas

**¡Excelente trabajo!** 🚀

---

**Última actualización:** 2025-12-10  
**Versión:** 1.0.0
