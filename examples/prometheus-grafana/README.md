# 📊 Stack de Monitoreo Prometheus + Grafana

Stack completo de monitoreo y observabilidad con Prometheus, Grafana, AlertManager, cAdvisor y aplicación de demostración que incluye métricas personalizadas, alertas configuradas y dashboards listos para usar.

## 🚀 Características

- **Prometheus**: Recolección y almacenamiento de métricas de series temporales
- **Grafana**: Visualización avanzada con dashboards preconfigurados
- **AlertManager**: Gestión inteligente de alertas y notificaciones
- **Node Exporter**: Métricas detalladas del sistema operativo
- **cAdvisor**: Monitoreo específico de contenedores Docker
- **Demo App**: Aplicación que genera métricas personalizadas
- **Reglas de Alerta**: Configuradas para CPU, memoria, disco y contenedores
- **Auto-provisioning**: Datasources y dashboards automáticamente configurados

## 🛠️ Tecnologías

- **Prometheus**: v2.45.0 - Base de datos de series temporales
- **Grafana**: v10.0.0 - Plataforma de visualización
- **AlertManager**: v0.25.0 - Gestión de alertas
- **Node Exporter**: v1.6.0 - Exportador de métricas del sistema
- **cAdvisor**: v0.47.0 - Monitoreo de contenedores
- **Demo App**: Node.js + Express + prom-client

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

## 🔧 Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose instalados
- Puertos libres: 3000, 8000, 8080, 9090, 9093, 9100

### Pasos

1. **Clonar y navegar**:
```bash
cd examples/prometheus-grafana
```

2. **Ejecutar stack completo**:
```bash
docker-compose up -d
```

3. **Verificar servicios**:
```bash
docker-compose ps
```

4. **Ver logs**:
```bash
docker-compose logs -f
```

## 🌐 Servicios Disponibles

### Grafana - Visualización
- **URL**: http://localhost:3000
- **Usuario**: admin
- **Contraseña**: admin123
- **Características**: Dashboards automáticos, datasource preconfigurado

### Prometheus - Métricas
- **URL**: http://localhost:9090
- **Características**: Web UI, query explorer, targets status, alerts

### AlertManager - Alertas
- **URL**: http://localhost:9093
- **Características**: Gestión de alertas, silenciamiento, webhooks

### Demo App - Métricas Personalizadas
- **URL**: http://localhost:8000
- **Métricas**: http://localhost:8000/metrics
- **Health**: http://localhost:8000/health

### cAdvisor - Monitoreo de Contenedores
- **URL**: http://localhost:8080
- **Características**: Métricas de contenedores Docker en tiempo real

### Node Exporter - Métricas del Sistema
- **Puerto**: 9100
- **Métricas**: CPU, memoria, disco, red, procesos

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

## 🚨 Alertas Configuradas

### Alertas Críticas
- **ContainerDown**: Contenedor caído > 30s
- **LowDiskSpace**: Espacio en disco > 90%
- **PrometheusTargetDown**: Target no accesible > 1m

### Alertas de Warning
- **HighCpuUsage**: CPU > 80% por 2m
- **HighMemoryUsage**: Memoria > 85% por 2m
- **ContainerHighCpuUsage**: Contenedor CPU > 80% por 2m
- **ContainerHighMemoryUsage**: Contenedor memoria > 80% por 2m

## 🔍 Comandos y Consultas Útiles

### Prometheus Queries

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

#### Métricas de la Demo App
```promql
# Rate de requests HTTP
rate(demo_app_http_requests_total[1m])

# Duración promedio de requests
rate(demo_app_http_request_duration_seconds_sum[1m]) / rate(demo_app_http_request_duration_seconds_count[1m])

# Conexiones activas
demo_app_active_connections
```

### Testing de la Demo App

#### Generar carga HTTP
```bash
# Requests normales
for i in {1..100}; do curl http://localhost:8000/ & done

# Simular carga con delay
curl http://localhost:8000/simulate/load

# Simular errores
curl http://localhost:8000/simulate/error

# Generar carga de CPU
curl http://localhost:8000/load/5000  # 5 segundos de carga
```

#### Ver métricas en tiempo real
```bash
# Ver métricas de la demo app
curl http://localhost:8000/metrics

# Health check
curl http://localhost:8000/health

# Generar tráfico continuo
while true; do curl -s http://localhost:8000/ > /dev/null; sleep 1; done
```

## 📊 Dashboards Recomendados

### Para importar en Grafana (Dashboard ID):
- **1860**: Node Exporter Full
- **893**: Docker and System Monitoring
- **315**: Kubernetes cluster monitoring
- **11074**: Node Exporter for Prometheus

### Dashboards Personalizados
```bash
# En Grafana, ir a + > Import
# Usar los IDs arriba o crear dashboards personalizados
```

## 🔧 Configuración Avanzada

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

### Agregar nuevas alertas

Crear archivo en `prometheus/rules/`:
```yaml
groups:
  - name: custom-alerts
    rules:
      - alert: CustomAlert
        expr: your_metric > threshold
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Custom alert description"
```

## 🚨 Solución de Problemas

### Problema: Prometheus no puede scraping targets
```bash
# Verificar conectividad de red
docker-compose exec prometheus wget -O- http://node-exporter:9100/metrics

# Verificar configuración
docker-compose exec prometheus promtool check config /etc/prometheus/prometheus.yml

# Ver logs
docker-compose logs prometheus
```

### Problema: Grafana no muestra datos
```bash
# Verificar datasource
curl http://localhost:3000/api/datasources

# Verificar conectividad a Prometheus desde Grafana
docker-compose exec grafana wget -O- http://prometheus:9090/api/v1/label/__name__/values

# Ver logs
docker-compose logs grafana
```

### Problema: AlertManager no envía alertas
```bash
# Verificar configuración
docker-compose exec alertmanager amtool config show

# Verificar alertas activas
curl http://localhost:9093/api/v1/alerts

# Test de webhook
curl -X POST http://localhost:8000/webhook/alerts \
  -H "Content-Type: application/json" \
  -d '{"test": "alert"}'
```

### Problema: cAdvisor no muestra métricas
```bash
# Verificar permisos de Docker socket
ls -la /var/run/docker.sock

# Verificar métricas
curl http://localhost:8080/metrics

# Reiniciar con privilegios
docker-compose restart cadvisor
```

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
docker-compose exec grafana tar -czf /tmp/grafana-backup.tar.gz /var/lib/grafana

# Backup de Prometheus
docker-compose exec prometheus tar -czf /tmp/prometheus-backup.tar.gz /prometheus
```

### Limpieza de datos antiguos
```bash
# Los datos se limpian automáticamente según retention (30d)
# Para limpiar manualmente:
docker-compose down
docker volume rm prometheus-grafana_prometheus_data
docker-compose up -d
```

### Actualización de versiones
```bash
# Editar docker-compose.yml con nuevas versiones
# Reconstruir servicios
docker-compose build
docker-compose up -d
```

## 📖 Recursos Adicionales

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [AlertManager Guide](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [cAdvisor Documentation](https://github.com/google/cadvisor)

## 🎯 Métricas Clave para Monitorear

### Golden Signals (SRE)
- **Latency**: Tiempo de respuesta de requests
- **Traffic**: Rate de requests por segundo
- **Errors**: Rate de errores
- **Saturation**: Utilización de recursos

### USE Method
- **Utilization**: % de tiempo que el recurso está ocupado
- **Saturation**: Cantidad de trabajo extra en cola
- **Errors**: Count de eventos de error

### RED Method
- **Rate**: Requests por segundo
- **Errors**: Rate de requests que fallan
- **Duration**: Tiempo que toman los requests

## 🔄 Limpieza

```bash
# Parar servicios
docker-compose down

# Eliminar volúmenes (CUIDADO: borra métricas históricas)
docker-compose down -v

# Eliminar imágenes
docker rmi $(docker images "prometheus-grafana*" -q)
```

---

**¡Disfruta monitoreando con Prometheus y Grafana! 📊**
