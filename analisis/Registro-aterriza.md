# A.T.E.R.R.I.Z.A. — HU-REGISTRO-01: Crear cuenta

---

## CAPA A — MAPA FUNCIONAL

### 1. Objetivo
Permitir que un visitante nuevo se registre en la plataforma proporcionando sus datos personales para poder iniciar sesión en el futuro.

### 2. Actor/es
- **Visitante nuevo:** Usuario sin cuenta en la plataforma.
- **Permisos:** POR CONFIRMAR (no se especifican).

### 3. Flujo principal
1. El visitante accede a la pantalla de creación de cuenta.
2. Ingresa su nombre.
3. Ingresa su email.
4. Ingresa su contraseña.
5. Ingresa su edad.
6. Presiona el botón "Crear cuenta".
7. El sistema valida los datos.
8. El sistema crea la cuenta y muestra una confirmación.
9. **POR CONFIRMAR:** ¿Redirige a otra pantalla tras la confirmación o se mantiene en la misma?

### 4. Sistemas involucrados
- **Front-end:** Formulario de registro (campos nombre, email, contraseña, edad, botón "Crear cuenta") y visualización de mensajes de éxito/error.
- **Back-end / API:** Lógica de validación y creación de la cuenta (se infiere).
- **Base de datos:** Almacenamiento de las credenciales y datos del usuario (se infiere).

### 5. Datos de entrada
- **Nombre:** Obligatorio. **POR CONFIRMAR:** formato, caracteres permitidos, longitud mínima/máxima.
- **Email:** Obligatorio. Formato: debe contener un "@".
- **Contraseña:** Obligatoria. Mínimo 8 caracteres. **POR CONFIRMAR:** si requiere mayúsculas, números o caracteres especiales.
- **Edad:** Obligatoria. Tipo número, rango entre 1 y 150.
- **Datos de ejemplo proporcionados:** Ana García / ana.garcia@ejempl (**POR CONFIRMAR:** el dominio del email parece estar cortado en el ejemplo).

### 6. Datos de salida
- **Éxito (todos los datos válidos):** Se crea la cuenta en el sistema y se muestra mensaje de confirmación en pantalla. **POR CONFIRMAR:** texto exacto del mensaje de confirmación.
- **Error email sin @:** Muestra mensaje de error. **POR CONFIRMAR:** texto exacto del error.
- **Error contraseña < 8 caracteres:** Muestra mensaje de error. **POR CONFIRMAR:** texto exacto del error.
- **Error edad fuera de rango o no numérica:** **POR CONFIRMAR:** comportamiento esperado (¿mensaje de error?, texto exacto).
- **Campos vacíos:** El formulario no se envía (bloqueo en front-end).
- **POR CONFIRMAR:** comportamiento si se intenta registrar un email que ya existe en la base de datos.

---

## CAPA R — MATRIZ DE RIESGOS

| Descripción | Categoría | Impacto | Nivel | Justificación (si ALTO) |
|---|---|---|---|---|
| Contraseña almacenada en base de datos en texto plano | Seguridad | Exposición masiva de credenciales en caso de una filtración. | **ALTO** | El compromiso masivo de credenciales vulnera estándares básicos de seguridad y daña la confianza. |
| El sistema permite registrar múltiples cuentas con el mismo email | Datos | Inconsistencia de datos, errores al intentar iniciar sesión y posible suplantación. | **ALTO** | Rompe la unicidad de identidad del usuario y bloquea la funcionalidad core de inicio de sesión. |
| Inyección de código (SQL/XSS) a través de los campos de Nombre o Email | Seguridad | Acceso no autorizado a la base de datos o ejecución de scripts maliciosos. | **ALTO** | Puede resultar en la pérdida total, alteración o robo de la base de datos de usuarios. |
| Evadir validaciones de front-end (longitud de contraseña, edad, formato email) atacando la API directamente | Funcional | Ingreso de datos inválidos, corruptos o contraseñas débiles a la base de datos. | **MEDIO** | |
| Creación masiva de cuentas automatizadas (falta de Rate Limiting o Captcha) | Seguridad | Saturación de la base de datos (cuentas spam) e impacto en el rendimiento del servidor. | **MEDIO** | |
| El sistema permite registrar emails falsos/inválidos por falta de un flujo de verificación de correo | Negocio | Acumulación de usuarios inactivos o ficticios, afectando futuras comunicaciones. | **MEDIO** | |
| Múltiples peticiones enviadas al hacer doble clic rápido en el botón "Crear cuenta" | Técnico / UX | Posibles errores del servidor (HTTP 500) o intentos de inserción duplicada. | **MEDIO** | |
| Los mensajes de error de validación (ej. formato de edad, email) no son claros o no se muestran en pantalla | UX | Frustración del usuario al no saber qué dato debe corregir para poder avanzar. | **BAJO** | |
| Falta de redirección lógica o flujo confuso después del mensaje de confirmación exitosa | UX | El usuario se queda en la misma pantalla sin saber cómo ir al login. | **BAJO** | |

---

## CAPA R — RECORRE ESCENARIOS

### 1. DATOS *(Cubre riesgos ALTOS: email duplicado, inyección SQL/XSS)*
* **Crear cuenta con email ya registrado previamente:** El sistema no crea una nueva cuenta. Muestra un mensaje de error indicando que el correo ya está en uso (verificable consultando la base de datos).
* **Crear cuenta con intento de Inyección SQL en el campo Nombre:** La petición no corrompe la base de datos y la cuenta se crea con el texto literal escapado o es rechazada por caracteres inválidos (verificable en los logs del servidor y base de datos).
* **Crear cuenta con intento de XSS en el campo Nombre (`<script>alert(1)</script>`):** La cuenta se crea y al renderizarse el nombre en cualquier pantalla posterior no se ejecuta el script (verificable inspeccionando el DOM).

### 2. INTEGRACIÓN *(Cubre riesgos ALTOS: almacenamiento inseguro y evasión de front-end)*
* **Verificar almacenamiento seguro de contraseña:** Tras un registro exitoso, el campo de contraseña en la base de datos se guarda encriptado o hasheado (verificable consultando la base de datos, no es texto plano).
* **Enviar petición de registro a la API con datos inválidos saltando el front-end:** El back-end responde con código HTTP 400 u otro error coherente y el registro no se impacta en la base de datos (verificable en respuesta de red y base de datos).

### 3. CAMINO FELIZ
* **Registro con todos los datos válidos:** El sistema envía una única petición de red, muestra el mensaje de confirmación de éxito en pantalla, y el nuevo registro aparece en la base de datos.

### 4. NEGATIVOS
* **Registro con Email sin "@":** El botón "Crear cuenta" no dispara petición de red hacia el back-end y se visualiza un mensaje de error de formato.
* **Registro con Contraseña menor al mínimo requerido (7 caracteres):** El botón "Crear cuenta" no dispara petición de red y se visualiza un mensaje de error por longitud.
* **Registro con uno o más campos obligatorios vacíos:** El botón "Crear cuenta" no dispara petición de red. **POR CONFIRMAR:** si el botón está inactivo o si al presionarlo se activan mensajes de validación visuales.

### 5. BORDE / LÍMITES
* **Registro con edad en el límite inferior (1):** La cuenta se crea exitosamente y se muestra la confirmación.
* **Registro con edad en el límite superior (150):** La cuenta se crea exitosamente y se muestra la confirmación.
* **Registro con edad fuera del límite inferior (0):** El formulario no se envía y se visualiza mensaje de error de validación.
* **Registro con edad fuera del límite superior (151):** El formulario no se envía y se visualiza mensaje de error de validación.
* **Registro con contraseña exactamente en el límite mínimo (8 caracteres):** La cuenta se crea exitosamente y se muestra la confirmación.

### 6. ESTADOS
* **Hacer doble clic rápido en "Crear cuenta" con datos válidos:** En la pestaña Network (Red) de las herramientas de desarrollador se registra una sola petición al back-end, evitando registros duplicados.

### 7. ROLES Y PERMISOS
* **Acceder al formulario de registro como visitante nuevo:** El sistema permite ver y completar el formulario sin restricciones.
* **Intentar acceder a la URL de registro teniendo una sesión activa:** **POR CONFIRMAR:** El usuario es redirigido a la página de inicio o dashboard, sin permitirle crear una nueva cuenta sobre su sesión actual (verificable por la redirección automática).

### 8. REGRESIÓN
* **Iniciar sesión con la nueva cuenta inmediatamente después de crearla:** El módulo de inicio de sesión autentica exitosamente al usuario y le da acceso a la plataforma (verifica que la creación de credenciales no rompió el login existente).
