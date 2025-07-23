import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Componente Header con navegación
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="nav-brand">
          <h1>🚀 React + Nginx</h1>
        </div>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            🏠 Inicio
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            ℹ️ Acerca de
          </Link>
          <Link to="/features" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            ⭐ Características
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            📞 Contacto
          </Link>
        </nav>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

// Componente Home
function Home() {
  const [stats, setStats] = useState({
    containers: 0,
    uptime: '0s',
    requests: 0
  });

  useEffect(() => {
    // Simular datos de estadísticas
    const interval = setInterval(() => {
      setStats(prev => ({
        containers: 2,
        uptime: `${Math.floor(Date.now() / 1000)}s`,
        requests: prev.requests + Math.floor(Math.random() * 5)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="container">
          <h1>🐳 Aplicación React con Docker + Nginx</h1>
          <p className="hero-subtitle">
            Una aplicación moderna construida con React, servida por Nginx y containerizada con Docker
          </p>
          <div className="hero-buttons">
            <Link to="/features" className="btn btn-primary">
              Ver Características
            </Link>
            <a 
              href="https://github.com/Harol-Reina/Docker-Examples" 
              className="btn btn-secondary"
              target="_blank" 
              rel="noopener noreferrer"
            >
              📋 Ver Código
            </a>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <h2>📊 Estadísticas en Tiempo Real</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🐳</div>
              <div className="stat-value">{stats.containers}</div>
              <div className="stat-label">Contenedores Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{stats.uptime}</div>
              <div className="stat-label">Tiempo Activo</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📡</div>
              <div className="stat-value">{stats.requests}</div>
              <div className="stat-label">Peticiones Servidas</div>
            </div>
          </div>
        </div>
      </section>

      <section className="architecture">
        <div className="container">
          <h2>🏗️ Arquitectura del Sistema</h2>
          <div className="architecture-diagram">
            <div className="arch-box">
              <h3>🌐 Cliente</h3>
              <p>Navegador Web</p>
            </div>
            <div className="arrow">→</div>
            <div className="arch-box">
              <h3>🔧 Nginx</h3>
              <p>Servidor Web</p>
              <small>Puerto 80</small>
            </div>
            <div className="arrow">→</div>
            <div className="arch-box">
              <h3>⚛️ React</h3>
              <p>Single Page App</p>
              <small>Build Estático</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente About
function About() {
  return (
    <div className="page about-page">
      <div className="container">
        <h1>ℹ️ Acerca de Esta Aplicación</h1>
        
        <div className="about-content">
          <section className="about-section">
            <h2>🎯 Propósito</h2>
            <p>
              Esta aplicación demuestra cómo crear, construir y desplegar una aplicación 
              React moderna usando Docker y Nginx como servidor web. Es un ejemplo 
              práctico de containerización frontend.
            </p>
          </section>

          <section className="about-section">
            <h2>🛠️ Tecnologías Utilizadas</h2>
            <div className="tech-grid">
              <div className="tech-card">
                <h3>⚛️ React 18</h3>
                <p>Framework frontend moderno con hooks y componentes funcionales</p>
              </div>
              <div className="tech-card">
                <h3>🔧 Nginx</h3>
                <p>Servidor web de alto rendimiento para servir contenido estático</p>
              </div>
              <div className="tech-card">
                <h3>🐳 Docker</h3>
                <p>Containerización para desarrollo y despliegue consistente</p>
              </div>
              <div className="tech-card">
                <h3>📱 Responsive Design</h3>
                <p>Diseño adaptable a diferentes dispositivos y pantallas</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>🚀 Características</h2>
            <ul className="feature-list">
              <li>✅ Build multi-stage optimizado</li>
              <li>✅ Servidor web Nginx de alto rendimiento</li>
              <li>✅ Enrutamiento del lado del cliente (SPA)</li>
              <li>✅ Diseño responsive y moderno</li>
              <li>✅ Configuración lista para producción</li>
              <li>✅ Fácil escalabilidad con Docker</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// Componente Features
function Features() {
  const features = [
    {
      icon: '🐳',
      title: 'Multi-Stage Build',
      description: 'Dockerfile optimizado con construcción en dos etapas para menor tamaño final',
      details: ['Node.js para build', 'Nginx Alpine para serving', 'Imagen final ligera']
    },
    {
      icon: '⚡',
      title: 'Alto Rendimiento',
      description: 'Nginx optimizado para servir contenido estático con máxima eficiencia',
      details: ['Gzip compression', 'Cache headers', 'Serving estático optimizado']
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Interfaz adaptable que funciona perfectamente en todos los dispositivos',
      details: ['Mobile first', 'Flexbox/Grid', 'Breakpoints optimizados']
    },
    {
      icon: '🔒',
      title: 'Seguridad',
      description: 'Configuraciones de seguridad implementadas siguiendo best practices',
      details: ['Headers de seguridad', 'Usuario no-root', 'Imagen Alpine']
    },
    {
      icon: '🔄',
      title: 'CI/CD Ready',
      description: 'Estructura preparada para integración y despliegue continuo',
      details: ['Build automatizable', 'Health checks', 'Environment agnostic']
    },
    {
      icon: '📊',
      title: 'Monitoreo',
      description: 'Logs y métricas para monitorear el estado de la aplicación',
      details: ['Nginx logs', 'Health endpoints', 'Docker metrics']
    }
  ];

  return (
    <div className="page features-page">
      <div className="container">
        <h1>⭐ Características Principales</h1>
        <p className="page-subtitle">
          Descubre todas las funcionalidades y optimizaciones implementadas en esta aplicación
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente FeatureCard
function FeatureCard({ feature }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`feature-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="feature-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="feature-icon">{feature.icon}</div>
        <h3>{feature.title}</h3>
        <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      <p className="feature-description">{feature.description}</p>
      {isExpanded && (
        <ul className="feature-details">
          {feature.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Componente Contact
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío de formulario
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form después de 3 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <h1>📞 Contacto</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>🤝 ¿Tienes Preguntas?</h2>
            <p>
              Este es un proyecto de demostración para aprender Docker con React y Nginx. 
              Si tienes preguntas o sugerencias, ¡no dudes en contactarnos!
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <span className="method-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>harol.reina@example.com</p>
                </div>
              </div>
              <div className="contact-method">
                <span className="method-icon">💼</span>
                <div>
                  <h3>GitHub</h3>
                  <a href="https://github.com/Harol-Reina" target="_blank" rel="noopener noreferrer">
                    github.com/Harol-Reina
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <span className="method-icon">🌐</span>
                <div>
                  <h3>Blog</h3>
                  <a href="https://harol-reina.github.io/blog/" target="_blank" rel="noopener noreferrer">
                    harol-reina.github.io/blog
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>💬 Envía un Mensaje</h2>
            {isSubmitted ? (
              <div className="success-message">
                <h3>✅ ¡Mensaje Enviado!</h3>
                <p>Gracias por tu interés. Esta es una demostración, pero tu mensaje ha sido registrado en la consola.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  📤 Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚀 React + Nginx Docker</h3>
            <p>Una demostración de aplicación React containerizada con Docker y servida por Nginx.</p>
          </div>
          <div className="footer-section">
            <h4>🔗 Enlaces</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/about">Acerca de</Link></li>
              <li><Link to="/features">Características</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>🛠️ Tecnologías</h4>
            <ul>
              <li>React 18</li>
              <li>Nginx Alpine</li>
              <li>Docker Multi-stage</li>
              <li>CSS3 & HTML5</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Harol Reina. Proyecto de demostración para Docker Examples.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
