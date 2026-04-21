# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # desarrollo local
npm run build    # build de producción
npm run lint     # ESLint
```

No hay tests. El CI usa `npm ci --legacy-peer-deps` (necesario por incompatibilidad de `vite-plugin-pwa` con Vite 8).

## Arquitectura

App sin backend. Todo el estado vive en `localStorage` via `useLocalStorage(key, initial)`.

**Flujo de datos:**
```
App.jsx
  ├── useLocalStorage → estado persistido (earnings, fuelLogs, expenses, settings)
  ├── filterByPeriod / getPreviousPeriodData → datos filtrados por período
  ├── useCalculations → métricas derivadas (netProfit, periodChange, efficiency, etc.)
  └── props hacia componentes (solo lectura + callbacks onAdd/onDelete/onUpdate)
```

**Período activo:** `filterPeriod` puede ser `'all'`, `'week'`, `'month'`, `'year'`. Los filtros viven en `dateUtils.js`. `getPreviousPeriodData` devuelve `[]` para `'all'` y `'year'` (no hay comparativa en esos casos).

**Modo de cálculo de nafta:** `profitMode` puede ser `'trip'` (estima consumo proporcional por km) o `'logs'` (suma cargas reales del período). Lo maneja `useCalculations`.

## Convenciones

- **Estilos:** Tailwind puro. Clases compartidas (`inputCls`, `inlineCls`) exportadas desde `src/utils/formatters.js`.
- **Dark mode:** `darkMode: 'class'` — el toggle agrega/quita clase `dark` en el div raíz de `App.jsx`.
- **IDs:** `crypto.randomUUID()` para nuevas entradas.
- **Ordenamiento:** todos los arrays se mantienen ordenados por fecha con `sorted()` en `App.jsx`.
- **Moneda:** ARS, formateada con `formatCurrency` (es-AR, sin decimales).

## Deploy

GitHub Actions → `peaceiris/actions-gh-pages@v3` → rama `gh-pages` → GitHub Pages.
El workflow está en `.github/workflows/deploy.yml`. Se dispara en cada push a `main`.
