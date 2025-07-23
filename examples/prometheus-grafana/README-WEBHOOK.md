# 📊 Prometheus + Grafana + AlertManager Stack con Webhook

Stack completo de monitoreo con **Prometheus**, **Grafana**, **AlertManager** y **webhook personalizado** para gestión de alertas en tiempo real.

## 🏗️ Componentes

### Core Services
- **🔍 Prometheus** (`:9090`) - Recolección de métricas y motor de alertas
- **📊 Grafana** (`:3001`) - Visualización y dashboards (admin/admin)
- **🚨 AlertManager** (`:9093`) - Gestión y enrutamiento de alertas

### Data Collection
- **📈 Node Exporter** (`:9100`) - Métricas del sistema host
- **🐳 cAdvisor** (`:8082`) - Métricas de contenedores Docker

### Demo Application
- **🎯 Demo App** (`:3000`) - App con métricas personalizadas y webhook

## 🚀 Inicio Rápido

```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f demo-app
```

## 🔗 Acceso a Servicios

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Demo App** | http://localhost:8000 | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin/admin123 |
| **AlertManager** | http://localhost:9093 | - |
| **Node Exporter** | http://localhost:9100 | - |
| **cAdvisor** | http://localhost:8080 | - |

## 🎯 Demo App - Endpoints

### Principales
- `GET /` - Información general y endpoints disponibles
- `GET /alerts` - **Dashboard web de alertas recibidas** 🎨
- `GET /alerts/api` - API JSON con alertas y estadísticas
- `POST /webhook/alerts` - **Webhook para AlertManager** 🔗

### Métricas y Health
- `GET /metrics` - Métricas para Prometheus
- `GET /health` - Health check del servicio

### Simulación (para testing)
- `GET /simulate/load` - Simular carga de trabajo
- `GET /simulate/error` - Simular errores aleatorios
- `GET /simulate/cpu/:seconds` - Simular carga de CPU
- `GET /simulate/memory` - Simular uso de memoria

## 🚨 Sistema de Alertas

### Reglas Configuradas

#### **Infraestructura**
- `ServiceDown` - Servicio no disponible (30s)
- `HighCPUUsage` - CPU > 80% (2min)
- `HighMemoryUsage` - Memoria > 85% (5min)
- `LowDiskSpace` - Disco < 20% libre (1min)

#### **Contenedores**
- `ContainerHighCPU` - Contenedor CPU > 80% (2min)
- `ContainerHighMemory` - Contenedor memoria > 90% (2min)

#### **Testing del Webhook** 🧪
- `WebhookTestAlert` - Se activa con > 3 requests (5s)
- `DemoAppHighTraffic` - Rate > 0.1 req/s (30s)
- `DemoAppHighCPU` - CPU demo > 50% (30s)
- `AlwaysFireAlert` - Siempre activa para testing

### Configuración AlertManager

```yaml
# Enrutamiento de alertas
route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 30s
  repeat_interval: 1h
  receiver: 'webhook-demo'

# Webhook receiver
receivers:
  - name: 'webhook-demo'
    webhook_configs:
      - url: 'http://demo-app:3000/webhook/alerts'
        send_resolved: true
```

## 🧪 Testing del Webhook

### Método 1: Script Automatizado
```bash
# Usar el script interactivo
./test-webhook.sh

# Opciones disponibles:
# 1) Verificar demo app
# 2) Generar requests (activar alertas)
# 3) Simular carga
# 4) Probar webhook manualmente
# 5) Mostrar estado
# 6) Prueba completa
# 7) Abrir dashboard
```

### Método 2: Manual
```bash
# Generar requests para activar WebhookTestAlert
for i in {1..5}; do curl http://localhost:8000/; done

# Simular carga de CPU
curl http://localhost:8000/simulate/cpu/10

# Simular uso de memoria
curl http://localhost:8000/simulate/memory

# Ver alertas recibidas
curl http://localhost:8000/alerts/api | jq
```

### Método 3: Webhook Directo
```bash
# Enviar alerta directamente al webhook
curl -X POST http://localhost:8000/webhook/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "receiver": "webhook-demo",
    "status": "firing",
    "alerts": [{
      "status": "firing",
      "labels": {"alertname": "TestManual", "severity": "warning"},
      "annotations": {"summary": "Prueba manual del webhook"}
    }]
  }'
```

## 📊 Dashboard de Alertas

Accede a **http://localhost:8000/alerts** para ver:

- **📈 Estadísticas** - Total, activas, resueltas
- **🕐 Timeline** - Alertas en tiempo real
- **🏷️ Detalles** - Labels, anotaciones, timestamps
- **🔄 Auto-refresh** - Actualización cada 30s

### Características del Dashboard:
- ✅ **Interfaz web responsiva** con CSS moderno
- 📱 **Móvil-friendly** con diseño adaptativo
- 🎨 **Códigos de color** por severidad (crítico/warning/info)
- 🔄 **Actualización automática** cada 30 segundos
- 📊 **Estadísticas en tiempo real** con contadores
- 🔍 **Filtrado visual** por estado (firing/resolved)

## 🔧 Configuración Avanzada

### Personalizar Alertas
Editar `prometheus/rules/alerts.yml`:
```yaml
groups:
  - name: custom-alerts
    rules:
      - alert: MyCustomAlert
        expr: my_metric > 100
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Mi alerta personalizada"
```

### Webhook Personalizado
La demo app incluye un webhook completo que:
- ✅ Recibe alertas de AlertManager
- 💾 Almacena historial en memoria
- 📊 Proporciona API REST para consultas
- 🎨 Incluye dashboard web interactivo
- 📝 Registra logs detallados

## 📁 Estructura del Proyecto

```
prometheus-grafana/
├── docker-compose.yml          # Orquestación de servicios
├── prometheus/
│   ├── prometheus.yml          # Configuración de Prometheus
│   └── rules/
│       └── alerts.yml          # Reglas de alertas
├── alertmanager/
│   └── alertmanager.yml        # Configuración de AlertManager
├── grafana/
│   └── provisioning/           # Datasources y dashboards
├── demo-app/
│   ├── app.js                  # Aplicación Node.js con webhook
│   ├── package.json
│   └── Dockerfile
├── test-webhook.sh             # Script de pruebas
└── README.md                   # Esta documentación
```

## 🛠️ Troubleshooting

### Verificar Estado de Servicios
```bash
# Estado de contenedores
docker-compose ps

# Logs de servicios específicos
docker-compose logs prometheus
docker-compose logs alertmanager
docker-compose logs demo-app

# Verificar targets en Prometheus
curl http://localhost:9090/api/v1/targets | jq
```

### Problemas Comunes

**1. Alertas no se envían al webhook:**
- Verificar configuración en AlertManager: http://localhost:9093
- Revisar logs: `docker-compose logs alertmanager`
- Confirmar que demo-app esté disponible

**2. Métricas no aparecen:**
- Verificar targets en Prometheus: http://localhost:9090/targets
- Revisar conectividad de red entre contenedores
- Verificar puertos expuestos

**3. Webhook no recibe alertas:**
- Verificar endpoint: `curl http://localhost:8000/webhook/alerts`
- Revisar logs de demo-app: `docker-compose logs demo-app`
- Confirmar configuración de AlertManager

## 🎓 Recursos de Aprendizaje

### Prometheus
- **Targets**: http://localhost:9090/targets
- **Rules**: http://localhost:9090/rules
- **Alerts**: http://localhost:9090/alerts
- **Graph**: http://localhost:9090/graph

### Grafana
- **Datasources**: Configuración automática vía provisioning
- **Dashboards**: Importar desde Grafana.com
- **Usuarios**: admin/admin (cambiar en producción)

### AlertManager
- **Config**: http://localhost:9093/#/status
- **Alerts**: http://localhost:9093/#/alerts
- **Silences**: Gestión de silencios

## 🚀 Próximos Pasos

1. **Configurar dashboards personalizados** en Grafana
2. **Agregar más receivers** (Slack, PagerDuty, etc.)
3. **Implementar persistencia** para el webhook
4. **Configurar autenticación** y SSL/TLS
5. **Escalar horizontalmente** con federación de Prometheus

---

¡El stack está listo para monitorear tu infraestructura! 🎉

**Comando rápido para ver todo funcionando:**
```bash
./test-webhook.sh
# Selecciona opción 6 para prueba completa
# Luego visita: http://localhost:3000/alerts
```
