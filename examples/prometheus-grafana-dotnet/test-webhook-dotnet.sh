#!/bin/bash

# Script para probar el webhook de AlertManager - Versión .NET
# Este script envía requests a la demo app .NET para generar métricas y activar alertas

echo "🧪 Script de prueba del webhook de AlertManager (.NET + Blazor)"
echo "=============================================================="

DEMO_APP_URL="http://localhost:8000"
WEBHOOK_URL="http://localhost:8000/api/webhook/alerts"
ALERTS_DASHBOARD="http://localhost:8000/alerts"

echo ""
echo "📊 URLs importantes (.NET Demo):"
echo "   Demo App (.NET): ${DEMO_APP_URL}"
echo "   Dashboard de Alertas: ${ALERTS_DASHBOARD}"
echo "   Webhook: ${WEBHOOK_URL}"
echo "   API de Alertas: ${DEMO_APP_URL}/api/alerts"
echo "   Prometheus: http://localhost:9090"
echo "   AlertManager: http://localhost:9093"
echo "   Grafana: http://localhost:3000 (admin/admin123)"
echo ""

# Función para verificar si la demo app está disponible
check_demo_app() {
    echo "🔍 Verificando demo app .NET..."
    if curl -s "${DEMO_APP_URL}/health" > /dev/null 2>&1; then
        echo "✅ Demo app .NET está disponible"
        return 0
    else
        echo "❌ Demo app .NET no está disponible"
        return 1
    fi
}

# Función para generar requests
generate_requests() {
    echo "🚀 Generando requests para activar alertas (.NET)..."
    
    for i in {1..10}; do
        echo "   Request $i/10..."
        curl -s "${DEMO_APP_URL}/" > /dev/null
        curl -s "${DEMO_APP_URL}/health" > /dev/null
        curl -s "${DEMO_APP_URL}/metrics" > /dev/null
        curl -s "${DEMO_APP_URL}/api" > /dev/null
        sleep 1
    done
    
    echo "✅ Requests generados"
}

# Función para simular carga
simulate_load() {
    echo "⚡ Simulando carga para activar alertas de CPU y memoria (.NET)..."
    
    # Simular carga de CPU
    curl -s "${DEMO_APP_URL}/api/simulate/cpu/5" > /dev/null &
    curl -s "${DEMO_APP_URL}/api/simulate/cpu/3" > /dev/null &
    
    # Simular uso de memoria
    curl -s "${DEMO_APP_URL}/api/simulate/memory" > /dev/null
    
    # Generar más requests
    for i in {1..5}; do
        curl -s "${DEMO_APP_URL}/api/simulate/load" > /dev/null &
    done
    
    echo "✅ Carga simulada (.NET)"
}

# Función para probar webhook manualmente
test_webhook_manual() {
    echo "🔗 Probando webhook .NET manualmente..."
    
    # Crear payload de prueba similar al que envía AlertManager
    PAYLOAD='{
      "receiver": "webhook-demo",
      "status": "firing",
      "alerts": [
        {
          "status": "firing",
          "labels": {
            "alertname": "TestManualDotNet",
            "severity": "warning",
            "instance": "manual-test-dotnet",
            "technology": ".NET + Blazor"
          },
          "annotations": {
            "summary": "Alerta de prueba manual (.NET + Blazor)",
            "description": "Esta es una alerta de prueba enviada manualmente para verificar el webhook de la aplicación .NET con Blazor Server"
          },
          "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
          "endsAt": "0001-01-01T00:00:00Z",
          "fingerprint": "manual-test-dotnet-'$(date +%s)'"
        }
      ],
      "groupLabels": {
        "alertname": "TestManualDotNet"
      },
      "commonLabels": {
        "alertname": "TestManualDotNet",
        "severity": "warning",
        "technology": ".NET"
      },
      "externalURL": "http://localhost:9093",
      "version": "4",
      "groupKey": "{}:{alertname=\"TestManualDotNet\"}"
    }'
    
    echo "📤 Enviando alerta de prueba al webhook .NET..."
    
    RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST "${WEBHOOK_URL}" \
        -H "Content-Type: application/json" \
        -d "${PAYLOAD}")
    
    HTTP_STATUS=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "✅ Webhook respondió correctamente"
        echo "📋 Respuesta: $BODY"
    else
        echo "❌ Error en webhook. Status: $HTTP_STATUS"
        echo "📋 Respuesta: $BODY"
    fi
}

# Función para mostrar estado
show_status() {
    echo "📊 Estado actual del sistema (.NET):"
    echo ""
    
    echo "🔍 Verificando servicios..."
    if curl -s "${DEMO_APP_URL}/health" > /dev/null 2>&1; then
        echo "   ✅ Demo App .NET: OK"
    else
        echo "   ❌ Demo App .NET: ERROR"
    fi
    
    if curl -s "http://localhost:9090/-/healthy" > /dev/null 2>&1; then
        echo "   ✅ Prometheus: OK"
    else
        echo "   ❌ Prometheus: ERROR"
    fi
    
    if curl -s "http://localhost:9093/-/healthy" > /dev/null 2>&1; then
        echo "   ✅ AlertManager: OK"
    else
        echo "   ❌ AlertManager: ERROR"
    fi
    
    echo ""
    echo "📈 Estadísticas de alertas (.NET):"
    STATS=$(curl -s "${DEMO_APP_URL}/api/alerts" 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "$STATS" | jq '.' 2>/dev/null || echo "$STATS"
    else
        echo "   ❌ No se pudieron obtener estadísticas"
    fi
}

# Función para prueba completa
full_test() {
    echo "🧪 Ejecutando prueba completa (.NET + Blazor)..."
    echo "================================================"
    
    if check_demo_app; then
        echo ""
        echo "1️⃣ Generando requests para activar alertas..."
        generate_requests
        
        echo ""
        echo "2️⃣ Simulando carga del sistema..."
        simulate_load
        
        echo ""
        echo "3️⃣ Probando webhook manualmente..."
        test_webhook_manual
        
        echo ""
        echo "4️⃣ Esperando procesamiento de alertas..."
        sleep 10
        
        echo ""
        echo "5️⃣ Mostrando estado final..."
        show_status
        
        echo ""
        echo "✅ Prueba completa finalizada"
        echo "🌐 Puedes ver los resultados en:"
        echo "   - Dashboard: ${ALERTS_DASHBOARD}"
        echo "   - API: ${DEMO_APP_URL}/api/alerts"
        echo "   - Prometheus: http://localhost:9090/alerts"
    else
        echo "❌ La demo app .NET no está disponible. Verifica que Docker Compose esté ejecutándose."
        echo "💡 Ejecuta: docker compose up -d"
    fi
}

# Función para abrir dashboard
open_dashboard() {
    echo "🌐 Abriendo dashboard de alertas (.NET)..."
    
    # Detectar el comando para abrir URLs según el SO
    if command -v xdg-open > /dev/null; then
        xdg-open "${ALERTS_DASHBOARD}"
    elif command -v open > /dev/null; then
        open "${ALERTS_DASHBOARD}"
    elif command -v start > /dev/null; then
        start "${ALERTS_DASHBOARD}"
    else
        echo "📋 Abre manualmente: ${ALERTS_DASHBOARD}"
    fi
}

# Menú principal
while true; do
    echo ""
    echo "🎯 Selecciona una opción:"
    echo "1) Verificar demo app .NET"
    echo "2) Generar requests (activar alertas)"
    echo "3) Simular carga (CPU/memoria)"
    echo "4) Probar webhook manualmente"
    echo "5) Mostrar estado actual"
    echo "6) Prueba completa automatizada"
    echo "7) Abrir dashboard de alertas"
    echo "8) Mostrar información del proyecto"
    echo "0) Salir"
    echo ""
    read -p "Opción: " option
    
    case $option in
        1)
            check_demo_app
            ;;
        2)
            generate_requests
            ;;
        3)
            simulate_load
            ;;
        4)
            test_webhook_manual
            ;;
        5)
            show_status
            ;;
        6)
            full_test
            ;;
        7)
            open_dashboard
            ;;
        8)
            echo ""
            echo "📊 Proyecto: Prometheus + Grafana + AlertManager (.NET + Blazor)"
            echo "🛠️ Tecnología: ASP.NET Core 8.0 + Blazor Server + Prometheus"
            echo "🐳 Deployment: Docker Compose"
            echo "📈 Métricas: prometheus-net"
            echo "🎨 UI: Blazor Server + Bootstrap 5"
            echo "🔗 Webhook: ASP.NET Core Web API"
            echo "📊 Dashboard: Interfaz web responsiva"
            echo ""
            echo "🌐 URLs principales:"
            echo "   - Demo App: http://localhost:8000"
            echo "   - Alertas: http://localhost:8000/alerts"
            echo "   - API: http://localhost:8000/api"
            echo "   - Métricas: http://localhost:8000/metrics"
            echo "   - Health: http://localhost:8000/health"
            ;;
        0)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            ;;
    esac
done
