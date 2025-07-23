# 📊 Stack de Monitoreo Prometheus + Grafana + AlertManager (.NET + Blazor)

Un stack completo de monitoreo con **Prometheus**, **Grafana**, **AlertManager** y aplicación demo desarrollada en **ASP.NET Core 8.0 + Blazor Server** con webhook personalizado para gestión de alertas en tiempo real.

## 🎯 Características Principales

- ✅ **Monitoreo completo** con métricas del sistema y contenedores
- 📊 **Visualización avanzada** con Grafana preconfigurado
- 🚨 **Sistema de alertas inteligente** con webhook personalizado
- 🐳 **Deployment con Docker Compose** listo para usar
- 📱 **Dashboard web Blazor** responsivo para gestión de alertas
- 🧪 **Scripts de testing** específicos para .NET
- 🛠️ **Tecnología moderna**: ASP.NET Core 8.0 + Blazor Server
- 📈 **Métricas nativas .NET** con prometheus-net

## 🏗️ Arquitectura del Sistema

### Servicios Core
- **🔍 Prometheus** (`:9090`) - Motor de métricas y alertas
- **📊 Grafana** (`:3000`) - Dashboards y visualización
- **🚨 AlertManager** (`:9093`) - Gestión de alertas

### Recolección de Métricas
- **📈 Node Exporter** (`:9100`) - Métricas del sistema host
- **🐳 cAdvisor** (`:8080`) - Métricas de contenedores Docker

### Aplicación Demo (.NET)
- **🎯 Demo App** (`:8000`) - App ASP.NET Core 8.0 + Blazor Server
- **📊 Métricas personalizadas** con prometheus-net
- **🌐 Interfaz web moderna** con Bootstrap 5
- **🔗 Web API** para webhook y simulación

## 🚀 Inicio Rápido

### 1. Prerrequisitos
```bash
# Asegúrate de tener instalado:
# - Docker & Docker Compose
# - .NET 8.0 SDK (opcional, para desarrollo local)
```

### 2. Levantar el Stack
```bash
# Clonar e ir al directorio
cd examples/prometheus-grafana-dotnet

# Iniciar todos los servicios
docker compose up -d

# Verificar estado de servicios
docker compose ps
```

### 3. Verificar Servicios
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs específicos de la app .NET
docker compose logs demo-app-dotnet
docker compose logs prometheus
```

### 4. Acceder a las Interfaces
| Servicio | URL | Credenciales | Tecnología |
|----------|-----|--------------|------------|
| **Demo App (.NET)** | http://localhost:8000 | - | ASP.NET Core 8.0 + Blazor |
| **Prometheus** | http://localhost:9090 | - | Go |
| **Grafana** | http://localhost:3000 | admin/admin123 | Go |
| **AlertManager** | http://localhost:9093 | - | Go |
| **Node Exporter** | http://localhost:9100 | - | Go |
| **cAdvisor** | http://localhost:8080 | - | Go |

## 🎯 Demo App .NET - Funcionalidades

### Páginas Blazor
```bash
GET  /                      # Dashboard principal Blazor
GET  /alerts               # Dashboard de alertas Blazor
```

### API Endpoints
```bash
GET  /api                  # Información de la API
GET  /metrics              # Métricas para Prometheus
GET  /health               # Health check
GET  /api/alerts           # API JSON con estadísticas de alertas
POST /api/webhook/alerts   # Webhook endpoint para AlertManager
```

### Simulación para Testing
```bash
GET /api/simulate/load         # Simular carga de trabajo
GET /api/simulate/error        # Simular errores aleatorios
GET /api/simulate/cpu/{seconds} # Simular carga de CPU por X segundos
GET /api/simulate/memory       # Simular alto uso de memoria
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

### Reglas de Testing del Webhook (.NET)
- **WebhookTestAlert** - Se activa con > 3 requests (5s)
- **DemoAppHighTraffic** - Rate > 0.1 req/s (30s)
- **DemoAppHighCPU** - CPU demo > 50% (30s)
- **DemoAppHighMemory** - Memoria demo > 80% (30s)
- **AlwaysFireAlert** - Alerta siempre activa para testing

## 🧪 Testing del Webhook (.NET)

### Método 1: Script Automatizado (.NET)
```bash
# Ejecutar script interactivo específico para .NET
./test-webhook-dotnet.sh

# Opciones disponibles:
# 1) Verificar demo app .NET
# 2) Generar requests (activar alertas)
# 3) Simular carga de CPU/memoria
# 4) Probar webhook manualmente
# 5) Mostrar estado actual
# 6) Prueba completa automatizada
# 7) Abrir dashboard de alertas
# 8) Mostrar información del proyecto
```

### Método 2: Testing Manual (.NET APIs)
```bash
# Generar requests para activar WebhookTestAlert
for i in {1..5}; do curl http://localhost:8000/; done
for i in {1..5}; do curl http://localhost:8000/api; done

# Simular carga de CPU por 10 segundos
curl http://localhost:8000/api/simulate/cpu/10

# Simular alto uso de memoria
curl http://localhost:8000/api/simulate/memory

# Ver alertas recibidas en el webhook (.NET)
curl http://localhost:8000/api/alerts | jq
```

### Método 3: Webhook Directo (.NET)
```bash
# Enviar alerta directamente al webhook de la app .NET
curl -X POST http://localhost:8000/api/webhook/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "receiver": "webhook-demo",
    "status": "firing",
    "alerts": [{
      "status": "firing",
      "labels": {
        "alertname": "TestManualDotNet",
        "severity": "warning",
        "technology": ".NET + Blazor"
      },
      "annotations": {
        "summary": "Prueba manual del webhook (.NET)",
        "description": "Alerta de prueba para la aplicación .NET con Blazor Server"
      }
    }]
  }'
```

## 📊 Dashboard de Alertas (Blazor Server)

Accede a **http://localhost:8000/alerts** para ver:

### Características del Dashboard Blazor
- ✅ **Interfaz Blazor Server** con componentes interactivos
- 📱 **Responsive Design** con Bootstrap 5
- 🎨 **Códigos de color** por severidad (crítico/warning/info)
- 🔄 **Auto-refresh** cada 30 segundos automático
- 📊 **Estadísticas en tiempo real** (total/activas/resueltas)
- 🕐 **Timeline de alertas** con timestamps formateados
- 🏷️ **Detalles completos** de labels y anotaciones
- 🔧 **Controles interactivos** para filtrado y limpieza
- ⚡ **SignalR** para actualizaciones en tiempo real

### Dashboard Principal (Blazor)
- 📈 **Estadísticas visuales** con tarjetas informativas
- 🎛️ **Controles de simulación** integrados
- 🔗 **Enlaces rápidos** a todos los servicios
- 📊 **Información de endpoints** disponibles

## 📈 Métricas Disponibles (.NET)

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

### Demo App .NET (Métricas Personalizadas)
```promql
demo_app_http_requests_total          # Total de requests HTTP (.NET)
demo_app_http_request_duration_seconds # Duración de requests HTTP
demo_app_active_connections           # Conexiones activas simuladas
demo_app_business_value              # Métrica de negocio personalizada
demo_app_cpu_usage                   # Simulación de uso de CPU
demo_app_memory_usage               # Simulación de uso de memoria
demo_app_simulation_total            # Contadores de simulación por tipo

# Métricas nativas de .NET (prometheus-net)
dotnet_total_memory_bytes            # Memoria total de .NET
dotnet_collection_count_total        # Conteo de GC por generación
process_cpu_seconds_total            # CPU del proceso .NET
process_working_set_bytes           # Working set del proceso
http_requests_in_progress           # Requests HTTP en progreso
```

## 🔍 Consultas PromQL Útiles (.NET)

### Métricas del Sistema
```promql
# CPU usage total del sistema
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)

# Memoria disponible en porcentaje
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espacio usado en disco
(1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100
```

### Métricas de la Demo App .NET
```promql
# Rate de requests HTTP en la app .NET
rate(demo_app_http_requests_total[1m])

# Percentil 95 de latencia HTTP (.NET)
histogram_quantile(0.95, rate(demo_app_http_request_duration_seconds_bucket[5m]))

# Conexiones activas simuladas
demo_app_active_connections

# Métricas de simulación por tipo
rate(demo_app_simulation_total[1m])

# Memoria del proceso .NET
process_working_set_bytes{job="demo-app-dotnet"}

# Garbage Collection en .NET
rate(dotnet_collection_count_total[1m])
```

## 📁 Estructura del Proyecto (.NET)

```
prometheus-grafana-dotnet/
├── docker-compose.yml              # Orquestación con app .NET
├── prometheus/
│   ├── prometheus.yml              # Configuración con target .NET
│   └── rules/
│       └── alerts.yml              # Reglas de alertas
├── alertmanager/
│   └── alertmanager.yml           # Config con webhook .NET
├── grafana/
│   └── provisioning/              # Configuración de Grafana
├── demo-app/                       # 🆕 Aplicación ASP.NET Core 8.0
│   ├── DemoApp.csproj             # Proyecto .NET con dependencias
│   ├── Program.cs                 # Configuración de la aplicación
│   ├── Models/
│   │   └── AlertModels.cs         # Modelos para alertas
│   ├── Services/
│   │   └── MetricsService.cs      # Servicio de métricas con prometheus-net
│   ├── Pages/
│   │   ├── Index.razor            # Dashboard principal Blazor
│   │   ├── Alerts.razor           # Dashboard de alertas Blazor
│   │   └── _Host.cshtml           # Página host
│   ├── Shared/
│   │   └── MainLayout.razor       # Layout principal
│   ├── wwwroot/
│   │   └── css/
│   │       └── site.css           # Estilos personalizados
│   ├── _Imports.razor             # Imports globales de Blazor
│   └── Dockerfile                 # Imagen Docker multi-stage
├── test-webhook-dotnet.sh          # 🆕 Script de testing para .NET
└── README.md                       # Esta documentación
```

## ⚙️ Configuración Avanzada (.NET)

### Personalizar Métricas .NET
Editar `Services/MetricsService.cs`:
```csharp
public class MetricsService : IMetricsService
{
    private readonly Counter _customCounter;
    private readonly Gauge _customGauge;

    public MetricsService()
    {
        _customCounter = Metrics
            .CreateCounter("my_custom_counter", "Description", new[] { "label1", "label2" });
        
        _customGauge = Metrics
            .CreateGauge("my_custom_gauge", "Description");
    }
    
    public void IncrementCustomMetric(string label1, string label2)
    {
        _customCounter.WithLabels(label1, label2).Inc();
    }
}
```

### Agregar Páginas Blazor
```csharp
// Nueva página en Pages/CustomPage.razor
@page "/custom"
@using DemoApp.Services
@inject IMetricsService MetricsService

<h3>Mi Página Personalizada</h3>

<button class="btn btn-primary" @onclick="IncrementMetric">
    Incrementar Métrica
</button>

@code {
    private void IncrementMetric()
    {
        MetricsService.IncrementCustomMetric("label1", "label2");
    }
}
```

### Configurar Logging Avanzado
Editar `Program.cs`:
```csharp
builder.Logging.AddConsole();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));

// Para producción
if (app.Environment.IsProduction())
{
    builder.Logging.AddJsonConsole();
}
```

## 🛠️ Troubleshooting (.NET)

### Verificar Estado de Servicios
```bash
# Estado de todos los contenedores
docker compose ps

# Logs específicos de la app .NET
docker compose logs demo-app-dotnet

# Verificar health checks de la app .NET
curl http://localhost:8000/health

# Ver logs en tiempo real de la app .NET
docker compose logs -f demo-app-dotnet
```

### Problemas Comunes (.NET)

**1. Alertas no llegan al webhook .NET:**
```bash
# Verificar configuración de AlertManager
curl http://localhost:9093/api/v1/status

# Verificar conectividad al webhook .NET
curl -X POST http://localhost:8000/api/webhook/alerts -d '{}'

# Ver logs de AlertManager y app .NET
docker compose logs alertmanager
docker compose logs demo-app-dotnet
```

**2. Métricas .NET no aparecen en Prometheus:**
```bash
# Verificar métricas directamente desde la app .NET
curl http://localhost:8000/metrics

# Verificar targets en Prometheus
curl http://localhost:9090/api/v1/targets

# Verificar logs de la app .NET
docker compose logs demo-app-dotnet | grep -i prometheus
```

**3. Blazor no funciona correctamente:**
```bash
# Verificar logs de la aplicación .NET
docker compose logs demo-app-dotnet | grep -i blazor

# Verificar en el navegador (F12) errores de JavaScript
# Verificar que SignalR esté funcionando

# Reiniciar solo la app .NET
docker compose restart demo-app-dotnet
```

**4. Build de la aplicación .NET falla:**
```bash
# Verificar Dockerfile
docker compose build demo-app-dotnet

# Ver logs del build
docker compose build --no-cache demo-app-dotnet

# Verificar dependencias NuGet
docker compose exec demo-app-dotnet dotnet list package
```

## 🔧 Comandos Útiles (.NET)

### Gestión del Stack .NET
```bash
# Iniciar servicios en background
docker compose up -d

# Rebuild solo la app .NET
docker compose up -d --build demo-app-dotnet

# Ver logs en tiempo real de la app .NET
docker compose logs -f demo-app-dotnet

# Ejecutar comandos dentro del contenedor .NET
docker compose exec demo-app-dotnet dotnet --version
docker compose exec demo-app-dotnet ls -la

# Verificar puerto y conectividad
docker compose port demo-app-dotnet 8000
```

### Desarrollo Local (.NET)
```bash
# Ejecutar la app localmente (requiere .NET 8.0 SDK)
cd demo-app
dotnet run

# Restaurar dependencias
dotnet restore

# Build local
dotnet build

# Publicar para producción
dotnet publish -c Release -o ./publish
```

### Testing y Debugging (.NET)
```bash
# Generar carga específica para .NET
while true; do curl -s http://localhost:8000/api > /dev/null; sleep 1; done

# Ver métricas específicas de .NET
curl -s http://localhost:8000/metrics | grep demo_app

# Monitorear alertas .NET
watch -n 5 'curl -s http://localhost:8000/api/alerts | jq ".total, .firing, .resolved"'

# Test del webhook con datos .NET
curl -X POST http://localhost:8000/api/webhook/alerts \
  -H "Content-Type: application/json" \
  -d '{"alerts":[{"status":"firing","labels":{"alertname":"TestDotNet"}}]}'
```

## 📚 Recursos de Aprendizaje (.NET)

### Tecnologías Utilizadas
- **ASP.NET Core 8.0**: Framework web moderno y multiplataforma
- **Blazor Server**: Framework UI interactivo del lado del servidor
- **prometheus-net**: Librería oficial de métricas Prometheus para .NET
- **Bootstrap 5**: Framework CSS para UI responsiva
- **Docker**: Containerización de la aplicación .NET

### Interfaces Web
- **Demo App .NET**: http://localhost:8000
  - Dashboard Principal: `/`
  - Dashboard Alertas: `/alerts`
  - API Info: `/api`
  - Métricas: `/metrics`
  - Health: `/health`

### Documentación Oficial
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Blazor Documentation](https://docs.microsoft.com/en-us/aspnet/core/blazor/)
- [prometheus-net Documentation](https://github.com/prometheus-net/prometheus-net)
- [Prometheus Documentation](https://prometheus.io/docs/)

## 🎯 Casos de Uso (.NET)

### Monitoreo de Aplicaciones .NET
1. Instrumentar aplicación .NET con prometheus-net
2. Configurar métricas personalizadas en `MetricsService`
3. Crear dashboards Blazor para visualización
4. Configurar alertas específicas para .NET

### Dashboard Interactivo con Blazor
1. Crear componentes Blazor personalizados
2. Implementar actualización en tiempo real con SignalR
3. Integrar con APIs de métricas
4. Crear experiencia de usuario rica

### Webhook Personalizado (.NET)
1. Implementar endpoint Web API para AlertManager
2. Procesar alertas con modelos tipados
3. Almacenar y consultar historial de alertas
4. Crear API REST para consumo externo

## 🔒 Consideraciones de Seguridad (.NET)

### Para Producción
- Cambiar credenciales por defecto de Grafana
- Configurar HTTPS para la aplicación .NET
- Implementar autenticación en la app .NET (Identity, JWT)
- Configurar CORS apropiadamente
- Usar secrets de Docker para credenciales sensibles
- Implementar rate limiting en la Web API

### Ejemplo de Configuración Segura (.NET)
```csharp
// En Program.cs para producción
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
    app.UseHsts();
    
    // Configurar CORS
    app.UseCors(policy => policy
        .WithOrigins("https://yourdomain.com")
        .WithMethods("GET", "POST")
        .WithHeaders("Content-Type"));
    
    // Rate limiting
    app.UseRateLimiter();
}
```

```yaml
# En docker-compose.yml para producción
environment:
  - ASPNETCORE_ENVIRONMENT=Production
  - ASPNETCORE_URLS=https://+:8000;http://+:8080
secrets:
  - app_secrets
```

## 🆚 Comparación con Versión Node.js

| Aspecto | Node.js Version | .NET Version |
|---------|----------------|--------------|
| **Runtime** | Node.js + Express | ASP.NET Core 8.0 |
| **UI Framework** | HTML/CSS/JS vanilla | Blazor Server + Bootstrap 5 |
| **Métricas** | prom-client | prometheus-net |
| **Performance** | Buena para I/O | Excelente general |
| **Tipado** | JavaScript (dinámico) | C# (estático) |
| **Ecosystem** | NPM packages | NuGet packages |
| **Development** | VS Code / Vim | Visual Studio / VS Code |
| **Debugging** | Node debugger | .NET debugger integrado |
| **Deployment** | Lightweight | Más robusto |
| **Scalability** | Horizontal | Vertical + Horizontal |

## 📞 Soporte

Este proyecto es la versión .NET del stack de monitoreo. Para preguntas o problemas:
- Revisar la sección de [Troubleshooting](#🛠️-troubleshooting-net)
- Verificar logs con `docker compose logs demo-app-dotnet`
- Probar conectividad con `curl http://localhost:8000/health`
- Usar el script de testing: `./test-webhook-dotnet.sh`

**¡Happy Monitoring con .NET!** 📊🚀🔵
