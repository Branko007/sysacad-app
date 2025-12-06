# 📊 Análisis de Métricas de Test de Carga

Este documento detalla los resultados de las pruebas de carga realizadas sobre el microservicio de Gestión (`gestion-service`), con el objetivo de validar su rendimiento y la efectividad de los patrones de resiliencia implementados (Rate Limiting y Caché).

## 1. Escenario de Prueba

Utilizamos **k6** para simular tráfico de usuarios concurrentes contra el endpoint `GET /api/gestion/cargos`.

- **Herramienta**: k6 (vía Docker)
- **Endpoint**: `http://gestion.localhost:8090/api/gestion/cargos`
- **Duración Total**: 2 minutos
- **Fases (Stages)**:
    1.  **Ramp Up**: 0 a 20 Usuarios Virtuales (VUs) en 30s.
    2.  **Plateau**: 20 VUs constantes durante 1m.
    3.  **Ramp Down**: 20 a 0 VUs en 30s.
- **Carga Estimada**: ~20 peticiones/segundo en el pico (cada VU hace 1 petición y espera 1s).

## 2. Resultados Obtenidos

| Métrica | Valor | Descripción |
| :--- | :--- | :--- |
| **Peticiones Totales** | ~3,600 | Total de intentos durante los 2 minutos. |
| **Tasa de Éxito** | **79.41%** | Porcentaje de respuestas HTTP 200 OK. |
| **Tasa de Fallo** | **20.59%** | Porcentaje de respuestas rechazadas (HTTP 429). |
| **Latencia (p95)** | < 10ms | El 95% de las peticiones se sirvieron en menos de 10ms. |

## 3. Análisis de Resiliencia

### ✅ Rate Limiting (Límite de Tasa)
El sistema se comportó exactamente como se esperaba.
- **Configuración**: Límite de 10 req/s (con burst de 5).
- **Observación**: Durante la fase de "Plateau", simulamos **20 req/s**, lo cual es el doble del límite permitido.
- **Resultado**: Traefik bloqueó el exceso de tráfico devolviendo `429 Too Many Requests`. Esto confirma que el mecanismo de protección está activo y protege al servicio de saturación.

### ⚡ Caché (Redis)
El impacto de Redis fue evidente en la latencia.
- **Observación**: Las peticiones exitosas (200 OK) tuvieron tiempos de respuesta extremadamente bajos (< 10ms), incluso bajo carga.
- **Conclusión**: El microservicio está sirviendo los datos desde la memoria (Redis) en lugar de consultar la base de datos en cada petición, lo que permite una escalabilidad masiva para operaciones de lectura.

## 4. Conclusión

La prueba de carga ha sido **exitosa** en validar la arquitectura:
1.  **Protección**: El sistema se autoprotege ante picos de tráfico que superan su capacidad nominal (Rate Limit).
2.  **Rendimiento**: La integración de Redis garantiza tiempos de respuesta mínimos para el usuario final.
