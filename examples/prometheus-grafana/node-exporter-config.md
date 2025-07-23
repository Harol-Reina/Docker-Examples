# Configuración optimizada para Node Exporter en Docker
# 
# Mejoras aplicadas:
# 1. Deshabilitado systemd collector para evitar errores de AppArmor
# 2. Reducido interval de health check para evitar broken pipes
# 3. Habilitados solo collectors esenciales
# 4. Removido acceso a dbus para evitar problemas de permisos
#
# Collectors habilitados:
# - cpu: Métricas de CPU
# - diskstats: Estadísticas de disco
# - filesystem: Uso del sistema de archivos
# - loadavg: Load average
# - meminfo: Información de memoria
# - netdev: Estadísticas de red
# - stat: Estadísticas generales del sistema
# - time: Tiempo del sistema
# - uname: Información del sistema
# - vmstat: Estadísticas de memoria virtual
#
# Collectors deshabilitados:
# - systemd: Requiere dbus y permisos especiales
# - textfile: Directorio de archivos de texto no necesario
# - boottime, conntrack, entropy, hwmon, etc.: Collectors adicionales no críticos
