# CLAUDE.md

Este archivo provee orientación a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Proyecto

Automatización de pruebas E2E para [playground.calidadsinhumo.com](https://playground.calidadsinhumo.com) usando Playwright + TypeScript. Los tests están organizados por funcionalidad dentro de `tests/ui/` y `tests/api/`.

## Comandos

```bash
# Ejecutar todos los tests (sin interfaz gráfica)
npx playwright test

# Ejecutar un único archivo de prueba
npx playwright test tests/ui/login.spec.ts

# Ejecutar con interfaz visual (modo UI)
npx playwright test --ui

# Depurar un test específico
npx playwright test tests/ui/login.spec.ts --debug

# Ver el último reporte HTML
npx playwright show-report
```

No hay un script `test` definido en el `package.json` — usar siempre `npx playwright test` directamente.

## Arquitectura

```
analisis/          # Documentos de análisis A.T.E.R.R.I.Z.A. por HU (historia de usuario)
tests/
  ui/              # Specs a nivel de navegador (interacciones con Playwright)
  api/             # Specs a nivel de API (vacío por ahora)
playwright.config.ts
proyecto-base-playwright/  # Proyecto plantilla de referencia — no es la suite activa
```

### Convención de nombres

- Archivos de spec: `<funcionalidad>.spec.ts` dentro de `tests/ui/` o `tests/api/`
- Bloque `test.describe`: `HU-<FUNCIONALIDAD>-<NN> - <descripción>` (ej. `HU-LOGIN-01 - Inicio de sesión`)
- IDs de test individuales: `E01`, `E02`, … coinciden con el número de escenario en el doc de `analisis/` correspondiente

### Metodología A.T.E.R.R.I.Z.A.

Cada HU tiene un archivo de análisis en `analisis/<funcionalidad>-aterriza.md` que define:
- Mapa funcional, actores, camino feliz, sistemas involucrados, datos de entrada/salida
- Matriz de riesgos (ALTO / MEDIO / BAJO) con justificaciones
- Catálogo completo de escenarios con trazabilidad a los riesgos

Los tests en `tests/ui/` implementan un subconjunto de esos escenarios. Los escenarios marcados **POR CONFIRMAR** en el archivo de análisis aún no están automatizados.

### baseURL vs URL real

`playwright.config.ts` define `baseURL: process.env.BASE_URL || 'http://localhost:3000'`, pero los specs actuales navegan a URLs absolutas (`https://playground.calidadsinhumo.com/...`). Usar rutas relativas con `page.goto('/')` solo si la variable de entorno `BASE_URL` apunta al playground real.

### Datos de prueba

- Cuenta estable: `ana.garcia@ejemplo.com` / `Segura2026!`
- Los tests de registro que ejercen el camino feliz generan un email único con `Date.now()` para evitar conflictos de email ya registrado.
