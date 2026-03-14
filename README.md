# Dashboard Uber

Dashboard Uber es una aplicación React + Vite para gestionar ingresos, cargas de combustible y gastos de una unidad de transporte.

Características principales:
- Registro de ingresos diarios, horas y viajes
- Registro de cargas de combustible y gastos varios
- Cálculo de ganancias netas y métricas (ganancia/hora, ticket promedio, ROI)
- Tema claro/oscuro con persistencia en localStorage

Requisitos
- Node.js 18+ y npm

Instalación y ejecución local

1. Instalar dependencias

```bash
npm ci
```

2. Ejecutar en modo desarrollo

```bash
npm run dev
```

3. Crear build de producción

```bash
npm run build
```

Notas útiles
- Si el toggle de tema no refleja el modo claro/oscuro localmente, abre la consola del navegador y ejecuta `localStorage.removeItem('uber_theme')` y refresca la página.
- El proyecto utiliza Tailwind CSS con `darkMode: 'class'`.

Despliegue (GitHub Pages)

Se añadió un workflow de GitHub Actions que construye el proyecto y despliega la carpeta `dist/` a la rama `gh-pages` para servir mediante GitHub Pages. El flujo se ejecuta automáticamente al hacer push en `main`.

Si querés desactivar el despliegue automático, borrá `.github/workflows/deploy.yml` o deshabilitá el workflow en la configuración del repo.

Licencia
Este repositorio es personal.

