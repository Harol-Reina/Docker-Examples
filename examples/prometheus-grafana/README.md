# 📊 Prometheus + Grafana + AlertManager Stack con Webhook

Stack completo de monitoreo con **Prometheus**, **Grafana**, **AlertManager** y **webhook personalizado** para gestión de alertas en tiempo real.

## 🏗️ Componentes

### Core Services
- **🔍 Prometheus** (`:9090`) - Recolección de métricas y motor de alertas
- **📊 Grafana** (`:3000`) - Visualización y dashboards (admin/admin123)
- **🚨 AlertManager** (`:9093`) - Gestión y enrutamiento de alertas

### Data Collection
- **📈 Node Exporter** (`:9100`) - Métricas del sistema host
- **🐳 cAdvisor** (`:8080`) - Métricas de contenedores Docker

### Demo Application
- **🎯 Demo App** (`:8000`) - App con métricas personalizadas y webhook

## 🚀 Inicio Rápido
```bash# Iniciar todos los servicios
docker compose up -d
# Verificar estado
docker compose ps
# Ver logs
docker compose logs -f demo-app
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

## 📈 Métricas Disponibles

### Sistema Operativo (Node Exporter)
```
node_cpu_seconds_total          # CPU usage por core
node_memory_MemTotal_bytes      # Memoria total
node_memory_MemAvailable_bytes  # Memoria disponible
node_filesystem_size_bytes      # Tamaño del sistema de archivos
node_filesystem_avail_bytes     # Espacio disponible
node_load1                      # Load average 1m
node_network_receive_bytes_total # Bytes recibidos por red
```

### Contenedores Docker (cAdvisor)
```
container_cpu_usage_seconds_total     # CPU usage del contenedor
container_memory_usage_bytes          # Uso de memoria del contenedor
container_spec_memory_limit_bytes     # Límite de memoria
container_network_receive_bytes_total # Tráfico de red
container_fs_usage_bytes              # Uso del sistema de archivos
```

### Aplicación Demo (Custom)
```
demo_app_http_requests_total          # Total de requests HTTP
demo_app_http_request_duration_seconds # Duración de requests
demo_app_active_connections           # Conexiones activas
demo_app_business_value               # Métrica de negocio personalizada
```





### Contenedores Docker (cAdvisor)
```
promqlcontainer_cpu_usage_seconds_total     # CPU usage del contenedor
container_memory_usage_bytes          # Uso de memoria del contenedor
container_spec_memory_limit_bytes     # Límite de memoria
container_network_receive_bytes_total # Tráfico de red
container_fs_usage_bytes              # Uso del sistema de archivos
```

### Aplicación Demo (Custom)
```
promqldemo_app_requests_total         # Total de requests HTTP
demo_app_cpu_usage                    # Simulación de uso de CPU
demo_app_memory_usage                 # Simulación de uso de memoria
demo_app_response_time_seconds        # Tiempo de respuesta
```

## 🔍 Consultas PromQL Útiles

#### Métricas del Sistema
```promql
# CPU usage por instancia
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)

# Memoria disponible
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espacio en disco usado
(1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100

# Load average
node_load1
```

#### Métricas de Contenedores
```promql
# CPU usage de contenedores
rate(container_cpu_usage_seconds_total{name!=""}[1m])

# Memoria usage de contenedores
(container_memory_usage_bytes{name!=""} / container_spec_memory_limit_bytes{name!=""}) * 100

# Tráfico de red
rate(container_network_receive_bytes_total{name!=""}[1m])
```

### Métricas de la Demo App
```promql
# Rate de requests HTTPrate(demo_app_requests_total[1m])

# CPU simulado
demo_app_cpu_usage

# Memoria simulada
demo_app_memory_usage
```


## 📁 Estructura del Proyecto

```
prometheus-grafana/
├── alertmanager/
│   └── alertmanager.yml        # Configuración de AlertManager
├── demo-app/
│   ├── app.js                  # Aplicación de demo con métricas
│   ├── package.json            # Dependencias Node.js
│   └── Dockerfile              # Imagen de la demo app
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── prometheus.yml  # Datasource automático
│   │   └── dashboards/
│   │       └── dashboard.yml   # Configuración de dashboards
│   └── dashboards/             # Dashboards personalizados
├── prometheus/
│   ├── prometheus.yml          # Configuración principal
│   └── rules/
│       └── alerts.yml          # Reglas de alertas
├── docker-compose.yml          # Orquestación completa
└── README.md                   # Esta documentación
```


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

### Webhook PersonalizadoLa demo app incluye un webhook completo que:
- ✅ Recibe alertas de AlertManager
- 💾 Almacena historial en memoria
- 📊 Proporciona API REST para consultas
- 🎨 Incluye dashboard web interactivo
- 📝 Registra logs detallados

### Agregar nuevos targets a Prometheus

Editar `prometheus/prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'new-service'
    static_configs:
      - targets: ['new-service:port']
    scrape_interval: 15s
    metrics_path: /metrics
```

### Configurar notificaciones por email

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
```
  
  ## 🛠️ Troubleshooting
  
  ### Verificar Estado de Servicios```bash# Estado de contenedoresdocker compose ps# Logs de servicios específicosdocker compose logs prometheusdocker compose logs alertmanagerdocker compose logs demo-app# Verificar targets en Prometheuscurl http://localhost:9090/api/v1/targets | jq```

### Problemas Comunes**1. Alertas no se envían al webhook:**- Verificar configuración en AlertManager: http://localhost:9093- Revisar logs: `docker compose logs alertmanager`- Confirmar que demo-app esté disponible**2. Métricas no aparecen:**- Verificar targets en Prometheus: http://localhost:9090/targets- Revisar conectividad de red entre contenedores- Verificar puertos expuestos**3. Webhook no recibe alertas:**- Verificar endpoint: `curl http://localhost:8000/webhook/alerts`- Revisar logs de demo-app: `docker compose logs demo-app`- Confirmar configuración de AlertManager**4. Prometheus no puede hacer scraping:**```bash# Verificar conectividad de reddocker compose exec prometheus wget -O- http://node-exporter:9100/metrics# Verificar configuracióndocker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml# Ver logsdocker compose logs prometheus```**5. Grafana no muestra datos:**

```bash# 
Verificar datasourcecurl http://localhost:3000/api/datasources# 
Verificar conectividad a Prometheus desde Grafana
docker compose exec grafana 
wget -O- http://prometheus:9090/api/v1/label/__name__/values# Ver logsdocker compose logs grafana
```

## 📊 Dashboards Recomendados### Para importar en Grafana (Dashboard ID):- **1860**: Node Exporter Full- **893**: Docker and System Monitoring- **315**: Kubernetes cluster monitoring- **11074**: Node Exporter for Prometheus### Crear Dashboards Personalizados```bash# En Grafana, ir a + > Import# Usar los IDs arriba o crear dashboards personalizados```## 🎯 Testing Completo### Generar carga en la Demo App```bash# Requests normalesfor i in {1..100}; do curl http://localhost:8000/ & done

# Simular carga con delay
curl http://localhost:8000/simulate/load

# Simular errores
curl http://localhost:8000/simulate/error

# Generar carga de CPU
curl http://localhost:8000/simulate/cpu/5

# Ver métricas en tiempo real
curl http://localhost:8000/metrics

# Generar tráfico continuo
while true; do curl -s http://localhost:8000/ > /dev/null; sleep 1; done
```

## 🎓 Recursos de Aprendizaje

### Prometheus
- **Targets**: http://localhost:9090/targets
- **Rules**: http://localhost:9090/rules
- **Alerts**: http://localhost:9090/alerts
- **Graph**: http://localhost:9090/graph

### Grafana
- **Datasources**: Configuración automática vía provisioning
- **Dashboards**: Importar desde Grafana.com
- **Usuarios**: admin/admin123 (cambiar en producción)

### AlertManager
- **Config**: http://localhost:9093/#/status
- **Alerts**: http://localhost:9093/#/alerts
- **Silences**: Gestión de silencios

## 📚 Casos de Uso Comunes

### Monitoreo de Aplicaciones
1. Instrumentar app con prom-client
2. Exponer endpoint /metrics
3. Agregar a prometheus.yml
4. Crear dashboard en Grafana
5. Configurar alertas específicas

### Monitoreo de Infraestructura
1. Instalar node-exporter en cada host
2. Configurar service discovery
3. Crear dashboards por datacenter
4. Alertas por umbrales críticos

### Monitoring de Docker
1. Usar cAdvisor para métricas de contenedores
2. Crear alertas por uso de recursos
3. Dashboard de estado de servicios
4. Logs centralizados

## 🔄 Mantenimiento

### Backup de configuraciones
```bash
# Backup de Grafana
docker compose exec grafana tar -czf /tmp/grafana-backup.tar.gz /var/lib/grafana

# Backup de Prometheus
docker compose exec prometheus tar -czf /tmp/prometheus-backup.tar.gz /prometheus
```

### Limpieza de datos antiguos
```bash
# Los datos se limpian automáticamente según retention (30d)
# Para limpiar manualmente:
docker compose down
docker volume rm prometheus-grafana_prometheus_data
docker compose up -d
```

### Actualización de versiones
```bash
# Editar docker-compose.yml con nuevas versiones
# Reconstruir servicios
docker compose build
docker compose up -d
```

## 🚀 Próximos Pasos

1. **Configurar dashboards personalizados** en Grafana
2. **Agregar más receivers** (Slack, PagerDuty, etc.)
3. **Implementar persistencia** para el webhook
4. **Configurar autenticación** y SSL/TLS
5. **Escalar horizontalmente** con federación de Prometheus

## 🔄 Limpieza

```bash
# Parar servicios
docker compose down

# Eliminar volúmenes (CUIDADO: borra métricas históricas)
docker compose down -v

# Eliminar imágenes
docker rmi $(docker images "prometheus-grafana*" -q)
```

## 📖 Recursos Adicionales

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [AlertManager Guide](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [cAdvisor Documentation](https://github.com/google/cadvisor)

---

¡El stack está listo para monitorear tu infraestructura! 🎉

**Comando rápido para ver todo funcionando:**
```bash
./test-webhook.sh
# Selecciona opción 6 para prueba completa
# Luego visita: http://localhost:8000/alerts
```

**¡Disfruta monitoreando con Prometheus y Grafana!** 📊
