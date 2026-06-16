import { test, expect } from '@playwright/test';

test.describe('HU-LOGIN-01 - Inicio de sesión', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegamos a la URL antes de cada prueba
    await page.goto('https://playground.calidadsinhumo.com/login');
  });

  test('E01 - Login con email y contraseña válidos', async ({ page }) => {
    // Llenar campos
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
    await page.getByLabel('Contraseña').fill('Segura2026!');
    
    // Enviar formulario
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Aserción: Verificar mensaje de éxito
    const successMessage = page.getByText('Has iniciado sesión correctamente.');
    await expect(successMessage).toBeVisible();
  });

  test('E02 - Login con email válido y contraseña incorrecta', async ({ page }) => {
    // Llenar campos con clave errónea
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
    await page.getByLabel('Contraseña').fill('ClaveFalsa123');
    
    // Enviar formulario
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Aserción: Verificar que aparece un mensaje de error (alert o texto de error general)
    // Se usa un selector general semántico para alertas de error
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
  });

  test('E03 - Login con campos vacíos no envía el formulario', async ({ page }) => {
    // No llenamos ningún campo, vamos directo a hacer clic
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Aserción: La URL no debe cambiar, lo que indica que el form no hizo submit al backend
    await expect(page).toHaveURL('https://playground.calidadsinhumo.com/login');
    
  });
});
