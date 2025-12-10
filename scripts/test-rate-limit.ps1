# Test de Rate Limit - Envía 20 peticiones rápidas
# Verifica que Traefik bloquea peticiones después del límite (10 req/s)

Write-Host "`n🛡️  Test de Rate Limit (10 req/s)" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$success = 0
$rateLimited = 0
$errors = 0

1..20 | ForEach-Object {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8090/api/gestion/cargos" `
                                      -Headers @{"Host"="gestion.localhost"} `
                                      -UseBasicParsing `
                                      -ErrorAction Stop
        
        Write-Host "Petición $_`: " -NoNewline
        Write-Host "$($response.StatusCode) OK" -ForegroundColor Green
        $success++
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        Write-Host "Petición $_`: " -NoNewline
        
        if ($statusCode -eq 429) {
            Write-Host "$statusCode Too Many Requests" -ForegroundColor Yellow
            $rateLimited++
        } else {
            Write-Host "$statusCode Error" -ForegroundColor Red
            $errors++
        }
    }
    
    # Pequeña pausa para no saturar completamente
    Start-Sleep -Milliseconds 50
}

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "📊 Resultados:" -ForegroundColor White
Write-Host "  ✅ Exitosas (200): $success" -ForegroundColor Green
Write-Host "  ⚠️  Bloqueadas (429): $rateLimited" -ForegroundColor Yellow
Write-Host "  ❌ Errores: $errors" -ForegroundColor Red

if ($rateLimited -gt 0) {
    Write-Host "`n✅ Rate Limit está funcionando correctamente!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  No se detectó Rate Limit. Intenta con más peticiones o más rápido." -ForegroundColor Yellow
}
