# Proyecto de Automatización de Pruebas E2E - Calidad Sin Humo

Este proyecto contiene la automatización de pruebas End-to-End (E2E) para la plataforma de [Calidad Sin Humo](https://playground.calidadsinhumo.com/), utilizando **Playwright** y **TypeScript**.

## 🚀 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/) - Framework principal de pruebas E2E.
- [TypeScript](https://www.typescriptlang.org/) - Para un tipado seguro y mejor experiencia de desarrollo.

## 📂 Estructura del Proyecto

```text
├── analisis/                # Análisis de requerimientos y casos de prueba (Metodología A.T.E.R.R.I.Z.A.)
│   └── login-aterriza.md    # Análisis detallado de la HU de Login
├── tests/                   # Directorio principal de pruebas
│   ├── api/                 # Pruebas a nivel de API (servicios web)
│   └── ui/                  # Pruebas a nivel de Interfaz de Usuario (UI)
│       └── login.spec.ts    # Casos de prueba automatizados para el Inicio de Sesión
├── playwright.config.ts     # Archivo de configuración principal de Playwright
├── package.json             # Dependencias del proyecto y scripts
└── README.md                # Documentación del proyecto
```

## 🛠️ Configuración e Instalación

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/irismoreno-qa/hola-mundo-qa-calidadsinhumo.git
   cd hola-mundo-qa-calidadsinhumo
   ```

2. **Instalar las dependencias:**
   Asegúrate de tener Node.js instalado, luego ejecuta:
   ```bash
   npm install
   ```

3. **Instalar los navegadores de Playwright:**
   ```bash
   npx playwright install
   ```

## ▶️ Ejecución de las Pruebas

Playwright ofrece varias formas de ejecutar los tests.

- **Ejecutar todas las pruebas en modo *headless* (sin interfaz gráfica):**
  ```bash
  npx playwright test
  ```

- **Ejecutar las pruebas con interfaz gráfica (modo visual):**
  ```bash
  npx playwright test --ui
  ```

- **Ejecutar un archivo de prueba específico:**
  ```bash
  npx playwright test tests/ui/login.spec.ts
  ```

- **Ejecutar las pruebas en modo *debug*:**
  ```bash
  npx playwright test --debug
  ```

## 📊 Reportes

Playwright genera automáticamente un reporte HTML detallado después de cada ejecución de pruebas. Para visualizar el reporte de la última ejecución, utiliza el siguiente comando:

```bash
npx playwright show-report
```

## 📝 Documentación de Casos de Prueba

En la carpeta `analisis/` encontrarás el análisis funcional, matriz de riesgos y el listado de escenarios de prueba para cada funcionalidad documentados bajo el framework **A.T.E.R.R.I.Z.A.**

Por ejemplo, los detalles sobre las pruebas del Inicio de Sesión (Camino feliz, casos negativos, seguridad, etc.) están documentados en `analisis/login-aterriza.md`.
