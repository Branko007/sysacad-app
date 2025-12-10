#!/bin/bash

# Script de Verificación de Métricas de Traefik
# Verifica que todos los componentes estén correctamente configurados

echo "🔍 Verificación de Métricas de Traefik"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# 1. Verificar que Traefik está corriendo
echo "1️⃣  Verificando Traefik..."
docker-compose ps traefik | grep -q "Up"
check "Traefik está corriendo"
echo ""

# 2. Verificar acceso al dashboard
echo "2️⃣  Verificando Dashboard..."
curl -s http://localhost:8091/api/overview > /dev/null
check "Dashboard accesible en http://localhost:8091"
echo ""

# 3. Verificar router de gestion-service
echo "3️⃣  Verificando Router gestion-service..."
ROUTER=$(curl -s http://localhost:8091/api/http/routers | grep -o "gestion-service@docker" | head -1)
if [ "$ROUTER" == "gestion-service@docker" ]; then
    echo -e "${GREEN}✅ Router 'gestion-service@docker' encontrado${NC}"
    
    # Verificar middlewares
    MIDDLEWARES=$(curl -s http://localhost:8091/api/http/routers | jq -r '.[] | select(.name=="gestion-service@docker") | .middlewares[]' 2>/dev/null)
    
    if echo "$MIDDLEWARES" | grep -q "gestion-service-ratelimit"; then
        echo -e "${GREEN}  ✅ Middleware: Rate Limit${NC}"
    else
        echo -e "${RED}  ❌ Middleware: Rate Limit${NC}"
    fi
    
    if echo "$MIDDLEWARES" | grep -q "gestion-service-retry"; then
        echo -e "${GREEN}  ✅ Middleware: Retry${NC}"
    else
        echo -e "${RED}  ❌ Middleware: Retry${NC}"
    fi
    
    if echo "$MIDDLEWARES" | grep -q "gestion-service-cb"; then
        echo -e "${GREEN}  ✅ Middleware: Circuit Breaker${NC}"
    else
        echo -e "${RED}  ❌ Middleware: Circuit Breaker${NC}"
    fi
else
    echo -e "${RED}❌ Router 'gestion-service@docker' NO encontrado${NC}"
fi
echo ""

# 4. Verificar service y réplicas
echo "4️⃣  Verificando Service y Réplicas..."
SERVICE=$(curl -s http://localhost:8091/api/http/services | grep -o "gestion-service@docker" | head -1)
if [ "$SERVICE" == "gestion-service@docker" ]; then
    echo -e "${GREEN}✅ Service 'gestion-service@docker' encontrado${NC}"
    
    # Contar réplicas
    REPLICAS=$(docker-compose ps gestion-service | grep -c "Up")
    if [ "$REPLICAS" -ge 2 ]; then
        echo -e "${GREEN}  ✅ Réplicas activas: $REPLICAS${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Réplicas activas: $REPLICAS (esperadas: 2)${NC}"
    fi
else
    echo -e "${RED}❌ Service 'gestion-service@docker' NO encontrado${NC}"
fi
echo ""

# 5. Verificar Redis
echo "5️⃣  Verificando Redis..."
docker-compose ps redis | grep -q "Up"
check "Redis está corriendo"
echo ""

# 6. Verificar PostgreSQL
echo "6️⃣  Verificando PostgreSQL..."
docker-compose ps db | grep -q "Up"
check "PostgreSQL está corriendo"
echo ""

# 7. Test de conectividad
echo "7️⃣  Test de Conectividad..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://gestion.localhost:8090/health)
if [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✅ Health check: 200 OK${NC}"
else
    echo -e "${RED}❌ Health check: $RESPONSE${NC}"
fi
echo ""

# 8. Test de Rate Limit
echo "8️⃣  Test de Rate Limit..."
echo "   Enviando 15 peticiones rápidas..."
SUCCESS=0
RATE_LIMITED=0

for i in {1..15}; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://gestion.localhost:8090/api/gestion/cargos)
    if [ "$RESPONSE" == "200" ]; then
        ((SUCCESS++))
    elif [ "$RESPONSE" == "429" ]; then
        ((RATE_LIMITED++))
    fi
done

echo -e "   ${GREEN}200 OK: $SUCCESS${NC}"
echo -e "   ${YELLOW}429 Too Many Requests: $RATE_LIMITED${NC}"

if [ "$RATE_LIMITED" -gt 0 ]; then
    echo -e "${GREEN}✅ Rate Limit está funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  No se detectó Rate Limit (puede necesitar más peticiones)${NC}"
fi
echo ""

# 9. Verificar caché
echo "9️⃣  Verificando Caché..."
echo "   Primera petición (debe ir a DB)..."
curl -s http://gestion.localhost:8090/api/gestion/cargos > /dev/null
sleep 1

echo "   Segunda petición (debe venir de caché)..."
LOGS=$(docker-compose logs --tail=5 gestion-service 2>&1)
if echo "$LOGS" | grep -q "Serving from Cache"; then
    echo -e "${GREEN}✅ Caché de Redis funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  No se detectó hit de caché en logs recientes${NC}"
fi
echo ""

# Resumen
echo "======================================"
echo "📊 Resumen de Verificación"
echo "======================================"
echo ""
echo "🔗 URLs Importantes:"
echo "   • Dashboard Traefik: http://localhost:8091"
echo "   • API Gestion: http://gestion.localhost:8090/api/gestion/cargos"
echo "   • Health Check: http://gestion.localhost:8090/health"
echo ""
echo "📚 Documentación:"
echo "   • Guía de Métricas: docs/traefik-metrics-guide.md"
echo "   • Análisis de k6: metrics_analysis.md"
echo ""
echo "✅ Verificación completada!"
