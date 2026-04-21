# Dashboard Uber

> Gestión financiera para conductores de Uber — ingresos, combustible, gastos y métricas en tiempo real.

**[Ver demo en vivo →](https://axeldelacanal.github.io/Dashboard-Uber/)**

---

## Características

### Registro de datos
| Feature | Detalle |
|---|---|
| 📅 Ingresos diarios | Monto, horas trabajadas y cantidad de viajes por día |
| ⏱️ Modo turno | Ingresá hora de inicio y fin — las horas se calculan solas |
| ⛽ Cargas de combustible | Monto y litros cargados — muestra automáticamente el precio por litro |
| 🔧 Gastos varios | Categorías: Mantenimiento, Seguro, Multas, Lavado, Otros |

### Análisis financiero
| Feature | Detalle |
|---|---|
| 💰 Bolsillo neto | Ingresos − nafta − gastos, en tiempo real |
| 🎯 Meta del período | Barra de progreso hacia tu objetivo de ingresos |
| 📈 Comparativa | % de cambio vs el período anterior (semana/mes) |
| 📊 Gráfico 7 días | Barras de ingresos con costos stackeados |
| 📉 Promedio por día | ¿Qué día ganás más? Estadísticas por día de la semana |
| 🔢 Métricas clave | Ganancia/hora, ticket promedio, eficiencia de nafta |

### Herramientas
| Feature | Detalle |
|---|---|
| 📤 Export CSV | Todos los datos en una planilla lista para Excel |
| 💾 Backup JSON | Exportá e importá todos tus datos — no pierdas nada si cambiás de browser |
| 🌙 Modo oscuro | Persistido en localStorage |
| 📱 Responsive | Optimizado para móvil y desktop |
| ⚡ PWA | Instalable en el celular, funciona offline |

### Filtros de período
`Todos` · `Semana` · `Mes` · `Año`

---

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS** (`darkMode: 'class'`)
- **Lucide React** para íconos
- **vite-plugin-pwa** para soporte offline
- **localStorage** para persistencia (sin backend, sin cuenta)
- **GitHub Actions** → deploy automático a GitHub Pages

---

## Instalación

```bash
git clone https://github.com/AxeldelaCanal/Dashboard-Uber.git
cd Dashboard-Uber
npm ci
npm run dev
```

Build de producción:

```bash
npm run build
```

---

## Modos de cálculo de nafta

El dashboard calcula el costo de nafta de dos maneras:

- **Por viaje** — estima el consumo proporcional según km recorridos y autonomía del tanque
- **Por carga real** — suma los registros de carga del período seleccionado

Se alterna desde el panel de Resumen Financiero.

---

## Backup y restore

Los datos se guardan en el navegador. Para no perderlos:

1. Hacé click en el ícono 💾 del header → descarga un `.json` con todo
2. Para restaurar, hacé click en el ícono de subida → seleccioná el archivo

---

## Deploy

GitHub Actions buildea y publica a `gh-pages` con cada push a `main`.

---

## Notas

- Si el tema claro/oscuro no responde: `localStorage.removeItem('uber_theme')` en consola y refrescá.
- Los datos existen solo en tu navegador. Sin backend, sin cuenta, sin internet requerido.
