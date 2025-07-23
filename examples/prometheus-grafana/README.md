# 📊 Stack de Monitoreo Prometheus + Grafana + AlertManager

Un stack completo de monitoreo con **Prometheus**, **Grafana**, **AlertManager** y aplicación demo con webhook personalizado para gestión de alertas en tiempo real.

## 🎯 Características Principales

- ✅ **Monitoreo completo** con métricas del sistema y contenedores
- 📊 **Visualización avanzada** con Grafana preconfigurado
- 🚨 **Sistema de alertas inteligente** con webhook personalizado
- 🐳 **Deployment con Docker Compose** listo para usar
- 📱 **Dashboard web responsivo** para gestión de alertas
- 🧪 **Scripts de testing** para verificar funcionalidad

## 🏗️ Arquitectura del Sistema

### Servicios Core
- **🔍 Prometheus** (`:9090`) - Motor de métricas y alertas
- **📊 Grafana** (`:3000`) - Dashboards y visualización
- **🚨 AlertManager** (`:9093`) - Gestión de alertas

### Recolección de Métricas
- **📈 Node Exporter** (`:9100`) - Métricas del sistema host
- **🐳 cAdvisor** (`:8080`) - Métricas de contenedores Docker

### Aplicación Demo
- **🎯 Demo App** (`:8000`) - App con métricas personalizadas y webhook

## 🚀 Inicio Rápido

### 1. Levantar el Stack
```bash
# Clonar e ir al directorio
cd examples/prometheus-grafana

# Iniciar todos los servicios
docker compose up -d

# Verificar estado de servicios
docker compose ps
```

### 2. Verificar Servicios
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs específicos
docker compose logs demo-app
docker compose logs prometheus
```

### 3. Acceder a las Interfaces
| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Demo App** | http://localhost:8000 | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin/admin123 |
| **AlertManager** | http://localhost:9093 | - |
| **Node Exporter** | http://localhost:9100 | - |
| **cAdvisor** | http://localhost:8080 | - |

## 🎯 Demo App - Funcionalidades

### Endpoints Principales
```bash
GET  /                      # Información general y lista de endpoints
GET  /alerts               # Dashboard web de alertas recibidas
GET  /alerts/api          # API JSON con estadísticas de alertas
POST /webhook/alerts      # Webhook endpoint para AlertManager
GET  /metrics             # Métricas para Prometheus
GET  /health              # Health check del servicio
```

### Simulación para Testing
```bash
GET /simulate/load         # Simular carga de trabajo
GET /simulate/error        # Simular errores aleatorios
GET /simulate/cpu/:seconds # Simular carga de CPU por X segundos
GET /simulate/memory       # Simular alto uso de memoria
```

## 🚨 Sistema de Alertas

### Reglas de Infraestructura
- **ContainerDown** - Contenedor no disponible (30s)
- **HighCpuUsage** - CPU del sistema > 80% (2min)
- **HighMemoryUsage** - Memoria del sistema > 85% (2min)
- **LowDiskSpace** - Espacio en disco < 10% (1min)

### Reglas de Contenedores
- **ContainerHighCpuUsage** - CPU contenedor > 80% (2min)
- **ContainerHighMemoryUsage** - Memoria contenedor > 80% (2min)
- **PrometheusTargetDown** - Target de Prometheus caído (1min)

### Reglas de Testing del Webhook
- **WebhookTestAlert** - Se activa con > 3 requests (5s)
- **DemoAppHighTraffic** - Rate > 0.1 req/s (30s)
- **DemoAppHighCPU** - CPU demo > 50% (30s)
- **DemoAppHighMemory** - Memoria demo > 80% (30s)
- **AlwaysFireAlert** - Alerta siempre activa para testing

## 🧪 Testing del Webhook

### Método 1: Script Automatizado
```bash
# Ejecutar script interactivo
./test-webhook.sh

# Opciones disponibles:
# 1) Verificar demo app
# 2) Generar requests (activar alertas)
# 3) Simular carga de CPU/memoria
# 4) Probar webhook manualmente
# 5) Mostrar estado actual
# 6) Prueba completa automática
# 7) Abrir dashboard de alertas
```

### Método 2: Testing Manual
```bash
# Generar requests para activar WebhookTestAlert
for i in {1..5}; do curl http://localhost:8000/; done

# Simular carga de CPU por 10 segundos
curl http://localhost:8000/simulate/cpu/10

# Simular alto uso de memoria
curl http://localhost:8000/simulate/memory

# Ver alertas recibidas en el webhook
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
      "labels": {
        "alertname": "TestManual",
        "severity": "warning"
      },
      "annotations": {
        "summary": "Prueba manual del webhook"
      }
    }]
  }'
```

## 📊 Dashboard de Alertas

Accede a **http://localhost:8000/alerts** para ver:

### Características del Dashboard
- ✅ **Interfaz web moderna** con diseño responsive
- 📱 **Compatible con móviles** y tablets
- 🎨 **Códigos de color** por severidad (crítico/warning/info)
- 🔄 **Auto-refresh** cada 30 segundos
- 📊 **Estadísticas en tiempo real** (total/activas/resueltas)
- 🕐 **Timeline de alertas** con timestamps
- 🏷️ **Detalles completos** de labels y anotaciones

## 📈 Métricas Disponibles

### Sistema Operativo (Node Exporter)
```promql
node_cpu_seconds_total          # Uso de CPU por core
node_memory_MemTotal_bytes      # Memoria total del sistema
node_memory_MemAvailable_bytes  # Memoria disponible
node_filesystem_size_bytes      # Tamaño del filesystem
node_filesystem_avail_bytes     # Espacio disponible en disco
node_load1                      # Load average 1 minuto
node_network_receive_bytes_total # Bytes recibidos por red
```

### Contenedores Docker (cAdvisor)
```promql
container_cpu_usage_seconds_total     # Uso de CPU del contenedor
container_memory_usage_bytes          # Uso de memoria del contenedor
container_spec_memory_limit_bytes     # Límite de memoria configurado
container_network_receive_bytes_total # Tráfico de red del contenedor
container_fs_usage_bytes              # Uso del filesystem del contenedor
```

### Demo App (Métricas Personalizadas)
```promql
demo_app_http_requests_total          # Total de requests HTTP
demo_app_http_request_duration_seconds # Duración de requests HTTP
demo_app_active_connections           # Conexiones activas simuladas
demo_app_business_value              # Métrica de negocio personalizada
demo_app_cpu_usage                   # Simulación de uso de CPU
demo_app_memory_usage               # Simulación de uso de memoria
```

## 🔍 Consultas PromQL Útiles

### Métricas del Sistema
```promql
# CPU usage total del sistema
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)

# Memoria disponible en porcentaje
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espacio usado en disco
(1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100

# Load average del sistema
node_load1
```

### Métricas de Contenedores
```promql
# Rate de CPU por contenedor
rate(container_cpu_usage_seconds_total{name!=""}[1m])

# Uso de memoria por contenedor en porcentaje
(container_memory_usage_bytes{name!=""} / container_spec_memory_limit_bytes{name!=""}) * 100

# Tráfico de red por contenedor
rate(container_network_receive_bytes_total{name!=""}[1m])
```

### Métricas de la Demo App
```promql
# Rate de requests HTTP
rate(demo_app_http_requests_total[1m])

# Percentil 95 de latencia
histogram_quantile(0.95, rate(demo_app_http_request_duration_seconds_bucket[5m]))

# Conexiones activas
demo_app_active_connections

# Métrica de negocio
demo_app_business_value
```

## 📁 Estructura del Proyecto

```
prometheus-grafana/
├── docker-compose.yml              # Orquestación de todos los servicios
├── prometheus/
│   ├── prometheus.yml              # Configuración principal de Prometheus
│   └── rules/
│       └── alerts.yml              # Reglas de alertas personalizadas
├── alertmanager/
│   └── alertmanager.yml           # Configuración de AlertManager
├── grafana/
│   └── provisioning/              # Configuración automática de Grafana
│       ├── datasources/           # Configuración de datasources
│       └── dashboards/            # Dashboards predefinidos
├── demo-app/
│   ├── app.js                     # Aplicación Node.js con webhook
│   ├── package.json               # Dependencias de la aplicación
│   └── Dockerfile                 # Imagen de la demo app
├── test-webhook.sh                # Script de testing del webhook
└── README.md                      # Esta documentación
```

## ⚙️ Configuración Avanzada

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
          description: "Descripción detallada de la alerta"
```

### Agregar Nuevos Targets
Editar `prometheus/prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'new-service'
    static_configs:
      - targets: ['new-service:port']
    scrape_interval: 15s
    metrics_path: /metrics
```

### Configurar Notificaciones por Email
Editar `alertmanager/alertmanager.yml`:
```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alertmanager@example.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'

receivers:
  - name: 'email-alerts'
    email_configs:
      - to: 'admin@example.com'
        subject: 'Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}
```

## 🛠️ Troubleshooting

### Verificar Estado de Servicios
```bash
# Estado de todos los contenedores
docker compose ps

# Logs de servicios específicos
docker compose logs prometheus
docker compose logs alertmanager
docker compose logs demo-app

# Verificar health checks
docker compose logs | grep health
```

### Problemas Comunes

**1. Alertas no llegan al webhook:**
```bash
# Verificar configuración de AlertManager
curl http://localhost:9093/api/v1/status

# Verificar conectividad al webhook
curl -X POST http://localhost:8000/webhook/alerts -d '{}'

# Ver logs de AlertManager
docker compose logs alertmanager
```

**2. Métricas no aparecen en Prometheus:**
```bash
# Verificar targets
curl http://localhost:9090/api/v1/targets

# Verificar configuración
docker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml

# Verificar reglas de alertas
docker compose exec prometheus promtool check rules /etc/prometheus/rules/alerts.yml
```

**3. Grafana no muestra datos:**
```bash
# Verificar datasource
curl http://localhost:3000/api/datasources

# Verificar conectividad desde Grafana a Prometheus
docker compose exec grafana wget -O- http://prometheus:9090/api/v1/label/__name__/values

# Ver logs de Grafana
docker compose logs grafana
```

**4. Demo app no responde:**
```bash
# Verificar salud de la aplicación
curl http://localhost:8000/health

# Ver métricas de la aplicación
curl http://localhost:8000/metrics

# Verificar logs de la aplicación
docker compose logs demo-app
```

## 🔧 Comandos Útiles

### Gestión del Stack
```bash
# Iniciar servicios en background
docker compose up -d

# Parar todos los servicios
docker compose down

# Reiniciar un servicio específico
docker compose restart demo-app

# Ver recursos utilizados
docker compose top

# Limpiar volúmenes (⚠️ elimina datos)
docker compose down -v
```

### Testing y Debugging
```bash
# Generar carga continua
while true; do curl -s http://localhost:8000/ > /dev/null; sleep 1; done

# Ver alertas activas en Prometheus
curl http://localhost:9090/api/v1/alerts | jq

# Ver configuración de AlertManager
curl http://localhost:9093/api/v1/status | jq

# Verificar estado del webhook
curl http://localhost:8000/alerts/api | jq
```

### Monitoreo en Tiempo Real
```bash
# Ver logs en tiempo real
docker compose logs -f demo-app

# Monitorear métricas
watch -n 2 'curl -s http://localhost:8000/metrics | grep demo_app'

# Ver alertas recibidas
watch -n 5 'curl -s http://localhost:8000/alerts/api | jq ".total, .firing, .resolved"'
```

## 📚 Recursos de Aprendizaje

### Interfaces Web
- **Prometheus UI**: http://localhost:9090
  - Targets: `/targets`
  - Rules: `/rules`
  - Alerts: `/alerts`
  - Graph: `/graph`

- **AlertManager UI**: http://localhost:9093
  - Status: `/#/status`
  - Alerts: `/#/alerts`
  - Silences: `/#/silences`

- **Grafana**: http://localhost:3000
  - Usuario: `admin`
  - Contraseña: `admin123`

### Documentación Oficial
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [AlertManager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)

## 🎯 Casos de Uso

### Monitoreo de Aplicaciones
1. Instrumentar aplicación con métricas Prometheus
2. Configurar scraping en `prometheus.yml`
3. Crear alertas específicas para la aplicación
4. Configurar dashboards en Grafana

### Alertas Críticas
1. Definir umbrales críticos en `alerts.yml`
2. Configurar múltiples canales de notificación
3. Implementar escalamiento de alertas
4. Crear runbooks para respuesta a incidentes

### Análisis de Performance
1. Usar métricas de latencia y throughput
2. Crear dashboards para análisis histórico
3. Configurar alertas proactivas
4. Implementar SLI/SLO monitoring

## 🔒 Consideraciones de Seguridad

### Para Producción
- Cambiar credenciales por defecto de Grafana
- Configurar HTTPS para todas las interfaces
- Implementar autenticación y autorización
- Configurar network policies restrictivas
- Usar secrets para credenciales sensibles

### Ejemplo de Configuración Segura
```yaml
# En docker-compose.yml para producción
environment:
  - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
  - GF_SECURITY_SECRET_KEY=${GRAFANA_SECRET_KEY}
secrets:
  - grafana_admin_password
  - alertmanager_smtp_password
```

---

## 📞 Soporte

Este proyecto es parte de los ejemplos de Docker. Para preguntas o problemas:
- Revisar la sección de [Troubleshooting](#🛠️-troubleshooting)
- Verificar logs con `docker compose logs [servicio]`
- Probar conectividad con los comandos de testing

**¡Happy Monitoring!** 📊🚀
