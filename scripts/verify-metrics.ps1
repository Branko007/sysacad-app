# Script de Verificación de Métricas de Traefik (PowerShell)
# Verifica que todos los componentes estén correctamente configurados

Write-Host "🔍 Verificación de Métricas de Traefik" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar
function Check-Status {
    param (
        [bool]$Success,
        [string]$Message
    )
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
        return $false
    }
}

# 1. Verificar que Traefik está corriendo
Write-Host "1️⃣  Verificando Traefik..." -ForegroundColor Yellow
$traefik = docker-compose ps traefik 2>$null | Select-String "Up"
Check-Status -Success ($null -ne $traefik) -Message "Traefik está corriendo"
Write-Host ""

# 2. Verificar acceso al dashboard
Write-Host "2️⃣  Verificando Dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8091/api/overview" -UseBasicParsing -ErrorAction SilentlyContinue
    Check-Status -Success ($response.StatusCode -eq 200) -Message "Dashboard accesible en http://localhost:8091"
} catch {
    Check-Status -Success $false -Message "Dashboard accesible en http://localhost:8091"
}
Write-Host ""

# 3. Verificar router de gestion-service
Write-Host "3️⃣  Verificando Router gestion-service..." -ForegroundColor Yellow
try {
    $routers = Invoke-RestMethod -Uri "http://localhost:8091/api/http/routers" -UseBasicParsing
    $gestionRouter = $routers | Where-Object { $_.name -eq "gestion-service@docker" }
    
    if ($gestionRouter) {
        Write-Host "✅ Router 'gestion-service@docker' encontrado" -ForegroundColor Green
        
        # Verificar middlewares
        $middlewares = $gestionRouter.middlewares
        
        if ($middlewares -contains "gestion-service-ratelimit@docker") {
            Write-Host "  ✅ Middleware: Rate Limit" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Middleware: Rate Limit" -ForegroundColor Red
        }
        
        if ($middlewares -contains "gestion-service-retry@docker") {
            Write-Host "  ✅ Middleware: Retry" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Middleware: Retry" -ForegroundColor Red
        }
        
        if ($middlewares -contains "gestion-service-cb@docker") {
            Write-Host "  ✅ Middleware: Circuit Breaker" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Middleware: Circuit Breaker" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Router 'gestion-service@docker' NO encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error al verificar routers" -ForegroundColor Red
}
Write-Host ""

# 4. Verificar service y réplicas
Write-Host "4️⃣  Verificando Service y Réplicas..." -ForegroundColor Yellow
try {
    $services = Invoke-RestMethod -Uri "http://localhost:8091/api/http/services" -UseBasicParsing
    $gestionService = $services | Where-Object { $_.name -eq "gestion-service@docker" }
    
    if ($gestionService) {
        Write-Host "✅ Service 'gestion-service@docker' encontrado" -ForegroundColor Green
        
        # Contar réplicas
        $replicas = (docker-compose ps gestion-service 2>$null | Select-String "Up").Count
        if ($replicas -ge 2) {
            Write-Host "  ✅ Réplicas activas: $replicas" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Réplicas activas: $replicas (esperadas: 2)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Service 'gestion-service@docker' NO encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error al verificar services" -ForegroundColor Red
}
Write-Host ""

# 5. Verificar Redis
Write-Host "5️⃣  Verificando Redis..." -ForegroundColor Yellow
$redis = docker-compose ps redis 2>$null | Select-String "Up"
Check-Status -Success ($null -ne $redis) -Message "Redis está corriendo"
Write-Host ""

# 6. Verificar PostgreSQL
Write-Host "6️⃣  Verificando PostgreSQL..." -ForegroundColor Yellow
$db = docker-compose ps db 2>$null | Select-String "Up"
Check-Status -Success ($null -ne $db) -Message "PostgreSQL está corriendo"
Write-Host ""

# 7. Test de conectividad
Write-Host "7️⃣  Test de Conectividad..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://gestion.localhost:8090/health" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check: 200 OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health check falló" -ForegroundColor Red
}
Write-Host ""

# 8. Test de Rate Limit
Write-Host "8️⃣  Test de Rate Limit..." -ForegroundColor Yellow
Write-Host "   Enviando 15 peticiones rápidas..." -ForegroundColor Gray
$success = 0
$rateLimited = 0

for ($i = 1; $i -le 15; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://gestion.localhost:8090/api/gestion/cargos" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $success++
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            $rateLimited++
        }
    }
}

Write-Host "   200 OK: $success" -ForegroundColor Green
Write-Host "   429 Too Many Requests: $rateLimited" -ForegroundColor Yellow

if ($rateLimited -gt 0) {
    Write-Host "✅ Rate Limit está funcionando" -ForegroundColor Green
} else {
    Write-Host "⚠️  No se detectó Rate Limit (puede necesitar más peticiones)" -ForegroundColor Yellow
}
Write-Host ""

# 9. Verificar caché
Write-Host "9️⃣  Verificando Caché..." -ForegroundColor Yellow
Write-Host "   Primera petición (debe ir a DB)..." -ForegroundColor Gray
try {
    Invoke-WebRequest -Uri "http://gestion.localhost:8090/api/gestion/cargos" -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
    Start-Sleep -Seconds 1
    
    Write-Host "   Segunda petición (debe venir de caché)..." -ForegroundColor Gray
    $logs = docker-compose logs --tail=5 gestion-service 2>$null | Out-String
    if ($logs -match "Serving from Cache") {
        Write-Host "✅ Caché de Redis funcionando" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No se detectó hit de caché en logs recientes" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Error al verificar caché" -ForegroundColor Yellow
}
Write-Host ""

# Resumen
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "📊 Resumen de Verificación" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 URLs Importantes:" -ForegroundColor White
Write-Host "   • Dashboard Traefik: http://localhost:8091" -ForegroundColor Gray
Write-Host "   • API Gestion: http://gestion.localhost:8090/api/gestion/cargos" -ForegroundColor Gray
Write-Host "   • Health Check: http://gestion.localhost:8090/health" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentación:" -ForegroundColor White
Write-Host "   • Guía de Métricas: docs/traefik-metrics-guide.md" -ForegroundColor Gray
Write-Host "   • Análisis de k6: metrics_analysis.md" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Verificación completada!" -ForegroundColor Green
