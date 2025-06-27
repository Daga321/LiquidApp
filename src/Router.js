import Navigo from 'navigo';

const router = new Navigo('/', { hash: true });

function loadView(view) {
  fetch(`/src/html/${view}.html`)
    .then(res => res.text())
    .then(html => {
      const app = document.getElementById('app');
      // Crea un contenedor temporal para el nuevo contenido
      const temp = document.createElement('div');
      temp.innerHTML = html;
      // Cuando el HTML ya está listo, reemplaza el contenido de #app
      app.innerHTML = html;
    });
}

// Define routes
router.on({
  '/': () => router.navigate('datos-generales'),
  '/datos-generales': () => loadView('GeneralDataForm'),
  '/propiedades': () => loadView('PropertiesForm'),
  '/ajustes': () => loadView('AdjustmensForm'),
  '/resultados': () => loadView('Results'),
}).resolve();

// Make routing case-insensitive
router.hooks({
  before: (done, params) => {
    // Lowercase the path before matching
    if (window.location.pathname !== window.location.pathname.toLowerCase()) {
      window.history.replaceState(
        {},
        '',
        window.location.pathname.toLowerCase() + window.location.search + window.location.hash
      );
    }
    done();
  }
});