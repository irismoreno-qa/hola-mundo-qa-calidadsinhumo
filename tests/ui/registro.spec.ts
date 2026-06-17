import { test, expect } from '@playwright/test';

test.describe('HU-REGISTRO-01 - Crear cuenta', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegamos a la URL antes de cada prueba
    await page.goto('https://playground.calidadsinhumo.com/registro');
  });

  test('E01 - Crear cuenta con email ya registrado previamente', async ({ page }) => {
    // Llenar campos con los datos de ejemplo fijos
    await page.getByLabel(/nombre/i).fill('Ana García');
    await page.getByLabel(/email/i).fill('ana.garcia@ejemplo.com');
    await page.getByLabel(/contraseña/i).fill('Segura2026!');
    await page.getByLabel(/edad/i).fill('30');
    
    // Enviar formulario
    await page.getByRole('button', { name: /crear cuenta/i }).click();

    // Aserción: Verificar mensaje de error indicando que el correo ya está en uso
    const errorMessage = page.getByText(/ya está en uso|registrado/i);
    await expect(errorMessage).toBeVisible();
  });

  test('E02 - Registro con todos los datos válidos', async ({ page }) => {
    // Generar un email único para no chocar con la base de datos
    const timestamp = Date.now();
    const emailUnico = `ana.garcia+${timestamp}@ejemplo.com`;

    // Llenar campos
    await page.getByLabel(/nombre/i).fill('Ana García');
    await page.getByLabel(/email/i).fill(emailUnico);
    await page.getByLabel(/contraseña/i).fill('Segura2026!');
    await page.getByLabel(/edad/i).fill('30');

    // Interceptar y esperar la respuesta de red para validar que envía una única petición
    const [response] = await Promise.all([
      // Ajustar el regex del endpoint según el comportamiento real de la API si es necesario
      page.waitForResponse(response => response.url().includes('api') && response.request().method() === 'POST'),
      page.getByRole('button', { name: /crear cuenta/i }).click()
    ]);

    // Validar que la petición fue HTTP 200 o 201 (Exitosa)
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    // Aserción: Verificar el mensaje de confirmación de éxito en pantalla
    const successMessage = page.getByText(/Registro exitoso/i);
    await expect(successMessage).toBeVisible();
  });

  test('E03 - Registro con Contraseña menor al mínimo requerido (7 caracteres)', async ({ page }) => {
    // Llenar campos con una contraseña corta
    await page.getByLabel(/nombre/i).fill('Ana García');
    await page.getByLabel(/email/i).fill('ana.garcia+test@ejemplo.com');
    await page.getByLabel(/contraseña/i).fill('Corta12'); // Exactamente 7 caracteres
    await page.getByLabel(/edad/i).fill('30');

    // Monitorear peticiones de red para validar que NO se dispara ninguna
    let seDisparoPeticion = false;
    page.on('request', request => {
      if (request.method() === 'POST') {
        seDisparoPeticion = true;
      }
    });

    // Enviar formulario
    await page.getByRole('button', { name: /crear cuenta/i }).click();

    // Pequeña espera para asegurar que la red no reacciona
    await page.waitForTimeout(500);
    
    // Aserción: Validar que el botón no dispara petición
    expect(seDisparoPeticion).toBe(false);

    // Aserción: Se visualiza un mensaje de error por longitud de contraseña
    const lengthErrorMessage = page.getByText(/8 caracteres/i);
    await expect(lengthErrorMessage).toBeVisible();
  });

});
