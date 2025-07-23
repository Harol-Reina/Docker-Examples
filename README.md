# Docker Examples 🐳

**Repositorio de ejemplos y casos de uso para Docker**: Proyectos prácticos y configuraciones para facilitar el aprendizaje y la implementación de contenedores Docker en distintos entornos.

## 📋 Tabla de Contenidos

- [Prerrequisitos](#-prerrequisitos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Ejemplos Disponibles](#-ejemplos-disponibles)
- [Casos de Uso](#-casos-de-uso)
- [Cómo Usar Este Repositorio](#-cómo-usar-este-repositorio)
- [Contribuir](#-contribuir)
- [Recursos Adicionales](#-recursos-adicionales)

## 🛠 Prerrequisitos

Antes de comenzar con los ejemplos, asegúrate de tener Docker instalado en tu sistema.

### Instalación de Docker

Para una guía completa de instalación de Docker, visita nuestro manual detallado:

**📖 [Manual de Instalación de Docker](https://harol-reina.github.io/blog/post-3/)**

Esta guía incluye:
- Instalación en sistemas Linux Debian
- Configuración inicial
- Verificación de la instalación
- Primeros pasos con Docker

## 📁 Estructura del Proyecto

```
Docker-Examples/
├── README.md
├── examples/                    # Ejemplos prácticos básicos
│   ├── simple-web-app/         # Aplicación web simple con Nginx
│   ├── multi-container/        # App multi-contenedor (Frontend + Backend)
│   └── node-mongo-app/         # Node.js + MongoDB + Docker
└── use-cases/                  # Casos de uso avanzados
```

## 🚀 Ejemplos Disponibles

### Aplicaciones Básicas

- **[Simple Web App](./examples/simple-web-app/)**: Ejemplo básico de una aplicación web containerizada con Nginx
  - Tecnologías: HTML, Nginx, Docker
  - Nivel: Principiante
  - Aprende: Conceptos básicos de containerización

### Aplicaciones Multi-Contenedor

- **[Multi-Container App](./examples/multi-container/)**: Comunicación entre frontend y backend
  - Tecnologías: HTML/JS, Node.js, Express, Docker Compose
  - Nivel: Intermedio
  - Aprende: Redes Docker, comunicación entre contenedores

### Aplicaciones con Base de Datos

- **[Node.js + MongoDB](./examples/node-mongo-app/)**: API REST completa con persistencia
  - Tecnologías: Node.js, Express, MongoDB, Mongoose
  - Nivel: Intermedio-Avanzado
  - Aprende: Persistencia de datos, API REST, ODM

## 🎯 Casos de Uso

Esta sección contendrá casos de uso más avanzados y específicos para diferentes escenarios.

*Casos de uso en desarrollo...*

## 📚 Cómo Usar Este Repositorio

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Harol-Reina/Docker-Examples.git
   cd Docker-Examples
   ```

2. **Navega al ejemplo que te interese**:
   ```bash
   cd examples/simple-web-app
   ```

3. **Sigue las instrucciones específicas** de cada ejemplo en su respectivo README.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ejemplos útiles o mejoras, por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nuevo-ejemplo`)
3. Commit tus cambios (`git commit -m 'Añadir nuevo ejemplo'`)
4. Push a la rama (`git push origin feature/nuevo-ejemplo`)
5. Abre un Pull Request

## 📖 Recursos Adicionales

- [Documentación Oficial de Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Manual de Instalación de Docker](https://harol-reina.github.io/blog/post-3/)
- [Best Practices para Docker](https://docs.docker.com/develop/best-practices/)

---

**Autor**: [Harol Reina](https://github.com/Harol-Reina)

**Licencia**: MIT
