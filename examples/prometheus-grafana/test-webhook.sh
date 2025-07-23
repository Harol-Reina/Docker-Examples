#!/bin/bash

# Script para probar el webhook de AlertManager
# Este script envía requests a la demo app para generar métricas y activar alertas

echo "🧪 Script de prueba del webhook de AlertManager"
echo "=============================================="

DEMO_APP_URL="http://localhost:8000"
WEBHOOK_URL="http://localhost:8000/webhook/alerts"
ALERTS_DASHBOARD="http://localhost:8000/alerts"

echo ""
echo "📊 URLs importantes:"
echo "   Demo App: ${DEMO_APP_URL}"
echo "   Dashboard de Alertas: ${ALERTS_DASHBOARD}"
echo "   Webhook: ${WEBHOOK_URL}"
echo "   Prometheus: http://localhost:9090"
echo "   AlertManager: http://localhost:9093"
echo "   Grafana: http://localhost:3000 (admin/admin123)"
echo ""

# Función para verificar si la demo app está disponible
check_demo_app() {
    echo "🔍 Verificando demo app..."
    if curl -s "${DEMO_APP_URL}/health" > /dev/null 2>&1; then
        echo "✅ Demo app está disponible"
        return 0
    else
        echo "❌ Demo app no está disponible"
        return 1
    fi
}

# Función para generar requests
generate_requests() {
    echo "🚀 Generando requests para activar alertas..."
    
    for i in {1..10}; do
        echo "   Request $i/10..."
        curl -s "${DEMO_APP_URL}/" > /dev/null
        curl -s "${DEMO_APP_URL}/health" > /dev/null
        curl -s "${DEMO_APP_URL}/metrics" > /dev/null
        sleep 1
    done
    
    echo "✅ Requests generados"
}

# Función para simular carga
simulate_load() {
    echo "⚡ Simulando carga para activar alertas de CPU y memoria..."
    
    # Simular carga de CPU
    curl -s "${DEMO_APP_URL}/simulate/cpu/5" > /dev/null &
    curl -s "${DEMO_APP_URL}/simulate/cpu/3" > /dev/null &
    
    # Simular uso de memoria
    curl -s "${DEMO_APP_URL}/simulate/memory" > /dev/null
    
    # Generar más requests
    for i in {1..5}; do
        curl -s "${DEMO_APP_URL}/simulate/load" > /dev/null &
    done
    
    echo "✅ Carga simulada"
}

# Función para probar webhook manualmente
test_webhook_manual() {
    echo "🔗 Probando webhook manualmente..."
    
    # Crear payload de prueba similar al que envía AlertManager
    PAYLOAD='{
      "receiver": "webhook-demo",
      "status": "firing",
      "alerts": [
        {
          "status": "firing",
          "labels": {
            "alertname": "TestManual",
            "severity": "warning",
            "instance": "manual-test"
          },
          "annotations": {
            "summary": "Alerta de prueba manual",
            "description": "Esta es una alerta de prueba enviada manualmente para verificar el webhook"
          },
          "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
          "endsAt": "0001-01-01T00:00:00Z",
          "fingerprint": "manual-test-'$(date +%s)'"
        }
      ],
      "groupLabels": {
        "alertname": "TestManual"
      },
      "commonLabels": {
        "alertname": "TestManual",
        "severity": "warning"
      },
      "commonAnnotations": {
        "summary": "Alerta de prueba manual"
      },
      "externalURL": "http://alertmanager:9093",
      "version": "4",
      "groupKey": "{}:{alertname=\"TestManual\"}"
    }'
    
    # Enviar al webhook
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD" \
        "${WEBHOOK_URL}"
    
    echo ""
    echo "✅ Webhook probado manualmente"
}

# Función para mostrar estado
show_status() {
    echo ""
    echo "📈 Estado actual:"
    echo "   Métricas: ${DEMO_APP_URL}/metrics"
    echo "   Alertas: ${ALERTS_DASHBOARD}"
    echo ""
    
    if curl -s "${DEMO_APP_URL}/alerts/api" > /dev/null 2>&1; then
        STATS=$(curl -s "${DEMO_APP_URL}/alerts/api" | jq -r '.stats | "Total: \(.total), Firing: \(.firing), Resolved: \(.resolved)"' 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "   Estadísticas de alertas: $STATS"
        fi
    fi
}

# Función principal
main() {
    echo "Selecciona una opción:"
    echo "1) Verificar demo app"
    echo "2) Generar requests (activar alerta WebhookTestAlert)"
    echo "3) Simular carga (activar alertas de rendimiento)"
    echo "4) Probar webhook manualmente"
    echo "5) Mostrar estado"
    echo "6) Hacer todo (prueba completa)"
    echo "7) Abrir dashboard de alertas"
    echo ""
    
    read -p "Opción (1-7): " option
    
    case $option in
        1)
            check_demo_app
            ;;
        2)
            if check_demo_app; then
                generate_requests
                echo ""
                echo "💡 Espera 10-30 segundos y revisa:"
                echo "   - Prometheus: http://localhost:9090/alerts"
                echo "   - Dashboard: ${ALERTS_DASHBOARD}"
            fi
            ;;
        3)
            if check_demo_app; then
                simulate_load
                echo ""
                echo "💡 Espera 1-2 minutos para que se activen las alertas"
            fi
            ;;
        4)
            test_webhook_manual
            ;;
        5)
            show_status
            ;;
        6)
            if check_demo_app; then
                echo ""
                echo "🔄 Ejecutando prueba completa..."
                generate_requests
                sleep 2
                simulate_load
                sleep 2
                test_webhook_manual
                sleep 3
                show_status
                echo ""
                echo "✅ Prueba completa finalizada"
                echo "💡 Revisa el dashboard: ${ALERTS_DASHBOARD}"
            fi
            ;;
        7)
            echo "🌐 Abriendo dashboard de alertas..."
            if command -v xdg-open > /dev/null; then
                xdg-open "${ALERTS_DASHBOARD}"
            elif command -v open > /dev/null; then
                open "${ALERTS_DASHBOARD}"
            else
                echo "   Manual: ${ALERTS_DASHBOARD}"
            fi
            ;;
        *)
            echo "❌ Opción inválida"
            ;;
    esac
}

# Ejecutar función principal
main
