class Router {
    constructor() {
      this.init();
      this.bindEvents();
    }
    
    init() {
      // Mostrar la página correspondiente al cargar
      this.showPage(window.location.hash || '#inicio');
      
      // Animación inicial
      setTimeout(() => {
        this.animateElements(document.querySelector('.page.active'));
      }, 300);
    }
    
    bindEvents() {
      // Navegación por clic
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = e.target.getAttribute('href');
          this.navigateTo(target);
        });
      });
      
      // Manejar el botón de retroceso/avance
      window.addEventListener('popstate', () => {
        this.showPage(window.location.hash || '#inicio');
      });
    }
    
    async navigateTo(target) {
      // No hacer nada si ya estamos en esa página
      if (window.location.hash === target) return;
      
      // Transición de salida
      await this.startTransition();
      
      // Cambiar la URL
      window.history.pushState(null, null, target);
      
      // Mostrar nueva página
      this.showPage(target);
      
      // Transición de entrada
      await this.endTransition();
    }
    
    async startTransition() {
      const transition = document.createElement('div');
      transition.className = 'page-transition';
      document.body.appendChild(transition);
      
      // Forzar renderizado
      await new Promise(resolve => {
        setTimeout(() => {
          transition.style.opacity = '1';
          resolve();
        }, 10);
      });
      
      // Esperar a que complete la animación
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    async endTransition() {
      const transition = document.querySelector('.page-transition');
      if (transition) {
        transition.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 600));
        transition.remove();
      }
    }
    
    showPage(hash) {
      const pageId = hash.substring(1) || 'inicio';
      
      // Ocultar todas las páginas
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Mostrar página activa
      const activePage = document.getElementById(pageId);
      if (activePage) {
        activePage.classList.add('active');
        
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === hash) {
            link.classList.add('active');
          }
        });
        
        // Scroll suave al inicio
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Animación de elementos
        this.animateElements(activePage);
      }
    }
    
    animateElements(container) {
      const elements = container.querySelectorAll('.content-animate');
      elements.forEach(el => {
        // Reiniciar animación
        el.style.animation = 'none';
        void el.offsetWidth; // Trigger reflow
        el.style.animation = '';
      });
    }
  }
  
  // Iniciar el router cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    new Router();
  });

  
