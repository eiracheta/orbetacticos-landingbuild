# Orbe Tacticos - Website

Website corporativo completo para Orbe Tacticos, especialistas en soluciones de movilidad tactica para fuerzas de defensa y seguridad.

## Estructura del Proyecto

```
orbetacticos-landingbuild/
├── index.html              # Landing page (en construccion)
├── website.html            # Website completo
├── css/
│   ├── styles.css          # Estilos del landing page
│   └── website.css         # Estilos del website completo
├── js/
│   ├── main.js             # JavaScript del landing page
│   └── website.js          # JavaScript del website completo
├── data/
│   └── translations.json   # Contenido bilingue ES/EN
├── assets/
│   └── images/             # Carpeta para imagenes
└── README.md
```

## Caracteristicas

### Diseno Visual
- **Tema oscuro profesional** con colores tacticos/militares
- **Paleta de colores:**
  - Background: #0a0a0a (primario), #1a1a1a (secundario)
  - Verde tactico: #2d5f3f (acento principal)
  - Dorado: #d4a574 (acento secundario)
  - Texto: #f5f5f5 (primario), #a0a0a0 (secundario)
- **Tipografias:** Rajdhani (titulos), Inter (cuerpo)
- **Efectos visuales:** Sistema de particulas interactivo, grid overlay, animaciones al scroll

### Secciones del Website
1. **Navbar** - Navegacion fija con efecto blur al scroll
2. **Hero** - Seccion principal con CTA y scroll indicator
3. **Sobre Nosotros** - Mision, vision, valores y estadisticas
4. **Soluciones** - Categorias de vehiculos tacticos
5. **Clientes** - Grid de logos y categorias de clientes
6. **Socios Estrategicos** - Mapa mundial interactivo
7. **Capacidades** - Servicios y certificaciones
8. **Por Que Elegirnos** - Ventajas competitivas
9. **Contacto** - Formulario completo
10. **Footer** - Enlaces y legal

### Sistema Bilingue (ES/EN)
- Switcher de idioma en navbar y menu movil
- Persistencia en localStorage
- Traducciones cargadas desde JSON
- Cambio dinamico sin reload

### Funcionalidades JavaScript
- **Sistema de particulas** - Canvas animado con conexiones interactivas
- **Scroll animations** - Intersection Observer para fade-in al scroll
- **Menu movil** - Responsive con overlay
- **Navegacion activa** - Highlight automatico segun seccion visible
- **Formulario de contacto** - Validacion y almacenamiento local

## Instalacion y Uso

### Desarrollo Local
1. Clonar o descargar el repositorio
2. Abrir website.html en un servidor local (necesario para cargar JSON)

**Con VS Code Live Server:**
- Instalar extension Live Server en VS Code
- Click derecho en website.html > "Open with Live Server"

**Con Python:**
```bash
cd orbetacticos-landingbuild
python -m http.server 8000
# Abrir http://localhost:8000/website.html
```

**Con Node.js:**
```bash
npx serve
```

### Produccion
Los archivos estan listos para subir a cualquier hosting estatico:
- Netlify
- Vercel
- GitHub Pages
- Servidor web tradicional

## Personalizacion

### Cambiar Contenido
Editar data/translations.json para modificar textos en ambos idiomas.

### Agregar Imagenes
1. Colocar imagenes en assets/images/
2. Reemplazar los placeholders en el HTML
3. Los placeholders actuales son SVG inline

### Modificar Colores
Editar las CSS custom properties en css/website.css

## Compatibilidad

### Navegadores Soportados
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Caracteristicas Responsive
- Mobile-first design
- Breakpoints: 480px, 640px, 768px, 1024px
- Menu hamburguesa para movil
- Grid layouts adaptativos

### Accesibilidad
- Navegacion por teclado
- Contraste de colores WCAG AA
- Atributos ARIA
- Soporte para prefers-reduced-motion

## Licencia

(c) 2026 Orbe Tacticos. Todos los derechos reservados.
