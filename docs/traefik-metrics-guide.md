# 📊 Guía de Análisis de Métricas con Traefik

Esta guía explica cómo acceder, interpretar y analizar las métricas del microservicio `gestion-service` utilizando el dashboard de Traefik y herramientas complementarias.

---

## 📑 Tabla de Contenidos

1. [Acceso al Dashboard de Traefik](#1-acceso-al-dashboard-de-traefik)
2. [Métricas Disponibles](#2-métricas-disponibles)
3. [Interpretación de Métricas](#3-interpretación-de-métricas)
4. [Monitoreo de Patrones de Resiliencia](#4-monitoreo-de-patrones-de-resiliencia)
5. [Análisis de Pruebas de Carga](#5-análisis-de-pruebas-de-carga)
6. [Troubleshooting](#6-troubleshooting)
7. [Métricas Avanzadas con Prometheus](#7-métricas-avanzadas-con-prometheus-opcional)

---

## 1. Acceso al Dashboard de Traefik

### 🚀 Inicio Rápido

1. **Levantar los servicios:**
   ```bash
   docker-compose up -d
   ```

2. **Acceder al dashboard:**
   - **URL**: http://localhost:8091
   - **Puerto**: 8091 (configurado en `docker-compose.yml`)

3. **Verificar que Traefik está corriendo:**
   ```bash
   docker-compose ps traefik
   ```

### 🎯 Navegación del Dashboard

El dashboard de Traefik muestra:

- **HTTP Routers**: Rutas configuradas (ej: `gestion-service`)
- **HTTP Services**: Servicios backend y sus instancias
- **HTTP Middlewares**: Rate Limit, Circuit Breaker, Retry
- **Providers**: Docker (muestra contenedores detectados)

---

## 2. Métricas Disponibles

### 📊 Métricas en el Dashboard de Traefik

| Sección | Métrica | Descripción |
|---------|---------|-------------|
| **Routers** | Status | Estado del router (enabled/disabled) |
| | Rule | Regla de enrutamiento (ej: `Host(\`gestion.localhost\`)`) |
| | Service | Servicio asociado |
| | Middlewares | Middlewares aplicados |
| **Services** | Server Status | Estado de cada instancia (UP/DOWN) |
| | Load Balancer | Algoritmo de balanceo |
| | Servers | Número de réplicas activas |
| **Middlewares** | Rate Limit | Configuración de límite de tasa |
| | Circuit Breaker | Estado del circuit breaker |
| | Retry | Configuración de reintentos |

### 📈 Métricas de Traefik (API)

Traefik expone métricas en formato JSON:

```bash
# Obtener todas las métricas
curl http://localhost:8091/api/overview

# Obtener routers HTTP
curl http://localhost:8091/api/http/routers

# Obtener servicios HTTP
curl http://localhost:8091/api/http/services

# Obtener middlewares HTTP
curl http://localhost:8091/api/http/middlewares
```

---

## 3. Interpretación de Métricas

### 🔍 Verificar Configuración de `gestion-service`

#### **Paso 1: Verificar Router**

1. Accede a: http://localhost:8091/dashboard/#/http/routers
2. Busca: `gestion-service@docker`
3. Verifica:
   - ✅ **Status**: Debe estar en verde (enabled)
   - ✅ **Rule**: `Host(\`gestion.localhost\`)`
   - ✅ **Service**: `gestion-service@docker`
   - ✅ **Middlewares**: `gestion-service-ratelimit`, `gestion-service-retry`, `gestion-service-cb`

#### **Paso 2: Verificar Service**

1. Accede a: http://localhost:8091/dashboard/#/http/services
2. Busca: `gestion-service@docker`
3. Verifica:
   - ✅ **Load Balancer**: Debe mostrar el algoritmo (round-robin por defecto)
   - ✅ **Servers**: Debe mostrar **2 instancias** (réplicas configuradas)
   - ✅ **Status**: Ambas instancias deben estar **UP** (verde)

#### **Paso 3: Verificar Middlewares**

1. Accede a: http://localhost:8091/dashboard/#/http/middlewares
2. Busca y verifica:

   **a) `gestion-service-ratelimit@docker`**
   - Type: `RateLimit`
   - Average: `10` (10 req/s)
   - Burst: `5`

   **b) `gestion-service-retry@docker`**
   - Type: `Retry`
   - Attempts: `3`

   **c) `gestion-service-cb@docker`**
   - Type: `CircuitBreaker`
   - Expression: `ResponseCodeRatio(500, 600, 0, 600) > 0.5`

---

## 4. Monitoreo de Patrones de Resiliencia

### 🛡️ Rate Limiting

**Objetivo**: Proteger el servicio de sobrecarga limitando a 10 req/s.

**Cómo verificar:**

1. **Prueba manual:**
   ```bash
   # Enviar 20 peticiones rápidas
   for i in {1..20}; do
     curl -w "\nStatus: %{http_code}\n" http://gestion.localhost:8090/api/gestion/cargos
   done
   ```

2. **Resultado esperado:**
   - Primeras ~10-15 peticiones: `200 OK`
   - Siguientes peticiones: `429 Too Many Requests`

3. **En el dashboard:**
   - No hay contador visual, pero puedes ver logs de Traefik:
     ```bash
     docker-compose logs -f traefik
     ```

### 🔄 Retry

**Objetivo**: Reintentar automáticamente 3 veces en caso de fallo temporal.

**Cómo verificar:**

1. **Simular fallo temporal:**
   ```bash
   # Detener una réplica
   docker-compose scale gestion-service=1
   
   # Hacer peticiones
   curl http://gestion.localhost:8090/api/gestion/cargos
   
   # Restaurar réplicas
   docker-compose scale gestion-service=2
   ```

2. **Logs de Traefik:**
   ```bash
   docker-compose logs traefik | grep -i retry
   ```

### ⚡ Circuit Breaker

**Objetivo**: Cortar el tráfico si >50% de respuestas son errores 5xx.

**Cómo verificar:**

1. **Simular errores 5xx:**
   - Detener la base de datos temporalmente:
     ```bash
     docker-compose stop db
     ```

2. **Hacer peticiones:**
   ```bash
   for i in {1..10}; do
     curl -w "\nStatus: %{http_code}\n" http://gestion.localhost:8090/api/gestion/cargos
   done
   ```

3. **Resultado esperado:**
   - Primeras peticiones: `500 Internal Server Error`
   - Después de alcanzar el umbral: `503 Service Unavailable` (Circuit Breaker abierto)

4. **Restaurar:**
   ```bash
   docker-compose start db
   ```

---

## 5. Análisis de Pruebas de Carga

### 📊 Integración con k6

Ver el análisis completo en: [`metrics_analysis.md`](../metrics_analysis.md)

**Resumen de resultados:**

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| **Tasa de Éxito** | 79.41% | Rate Limit funcionando correctamente |
| **Tasa de Fallo** | 20.59% | Peticiones bloqueadas por Rate Limit (429) |
| **Latencia p95** | <10ms | Caché de Redis funcionando óptimamente |

### 🎯 Correlación con Métricas de Traefik

Durante la prueba de k6:

1. **Dashboard de Traefik** → Verificar que ambas réplicas estén UP
2. **Logs de Traefik** → Ver Rate Limit en acción:
   ```bash
   docker-compose logs -f traefik | grep -i "rate limit"
   ```
3. **Logs de gestion-service** → Ver hits de caché:
   ```bash
   docker-compose logs -f gestion-service | grep -i "cache"
   ```

---

## 6. Troubleshooting

### ❌ Problema: Router no aparece en el dashboard

**Solución:**
```bash
# Verificar que el contenedor tiene los labels correctos
docker inspect <container_id> | grep -i traefik

# Verificar logs de Traefik
docker-compose logs traefik | grep -i error
```

### ❌ Problema: Service muestra 0 servers

**Solución:**
```bash
# Verificar que las réplicas están corriendo
docker-compose ps gestion-service

# Verificar que el puerto está expuesto
docker-compose logs gestion-service | grep -i "running on port"
```

### ❌ Problema: Middlewares no se aplican

**Solución:**
```bash
# Verificar que los middlewares están en el router
curl http://localhost:8091/api/http/routers/gestion-service@docker | jq '.middlewares'

# Debe mostrar: ["gestion-service-ratelimit@docker", "gestion-service-retry@docker", "gestion-service-cb@docker"]
```

### ❌ Problema: Rate Limit no funciona

**Solución:**
```bash
# Verificar configuración del middleware
curl http://localhost:8091/api/http/middlewares/gestion-service-ratelimit@docker | jq

# Verificar que average=10 y burst=5
```

---

## 7. Métricas Avanzadas con Prometheus (Opcional)

Para un monitoreo más robusto, puedes integrar Prometheus + Grafana.

### 📊 Setup Rápido

1. **Habilitar métricas de Prometheus en Traefik:**

   Edita `docker-compose.yml`:
   ```yaml
   traefik:
     command:
       - "--api.insecure=true"
       - "--providers.docker=true"
       - "--entrypoints.web.address=:80"
       - "--metrics.prometheus=true"
       - "--metrics.prometheus.buckets=0.1,0.3,1.2,5.0"
   ```

2. **Agregar Prometheus y Grafana:**

   ```yaml
   prometheus:
     image: prom/prometheus:latest
     volumes:
       - ./prometheus.yml:/etc/prometheus/prometheus.yml
     ports:
       - "9090:9090"
     networks:
       - mired

   grafana:
     image: grafana/grafana:latest
     ports:
       - "3000:3000"
     networks:
       - mired
   ```

3. **Crear `prometheus.yml`:**

   ```yaml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'traefik'
       static_configs:
         - targets: ['traefik:8080']
   ```

4. **Acceder a Grafana:**
   - URL: http://localhost:3000
   - User: `admin`
   - Pass: `admin`

5. **Importar dashboard de Traefik:**
   - Dashboard ID: `11462` (Traefik 2.x)
   - Datasource: Prometheus

### 📈 Métricas de Prometheus

Con Prometheus habilitado, tendrás acceso a:

- `traefik_service_requests_total` - Total de peticiones por servicio
- `traefik_service_request_duration_seconds` - Latencia de peticiones
- `traefik_service_requests_bytes_total` - Bytes enviados/recibidos
- `traefik_entrypoint_requests_total` - Peticiones por entrypoint
- `traefik_backend_requests_total` - Peticiones por backend

---

## 📚 Recursos Adicionales

- [Documentación oficial de Traefik](https://doc.traefik.io/traefik/)
- [Traefik Metrics](https://doc.traefik.io/traefik/observability/metrics/overview/)
- [k6 Documentation](https://k6.io/docs/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)

---

## 🎯 Checklist de Verificación

Usa este checklist para verificar que todo está funcionando correctamente:

- [ ] Dashboard de Traefik accesible en http://localhost:8091
- [ ] Router `gestion-service@docker` visible y enabled
- [ ] Service `gestion-service@docker` muestra 2 servers UP
- [ ] Middlewares aplicados: rate limit, retry, circuit breaker
- [ ] Rate Limit funciona (429 después de 10 req/s)
- [ ] Balanceo de carga entre 2 réplicas
- [ ] Caché de Redis funcionando (logs muestran "Serving from Cache")
- [ ] Pruebas de k6 completadas exitosamente
- [ ] Logs de Traefik sin errores críticos

---

**Última actualización:** 2025-12-10  
**Versión:** 1.0.0
