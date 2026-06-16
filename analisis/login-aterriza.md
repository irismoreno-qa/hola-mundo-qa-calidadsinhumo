# A.T.E.R.R.I.Z.A. — HU-LOGIN-01: Inicio de sesión

---

## CAPA A — MAPA FUNCIONAL

### 1. Objetivo

Permitir que un usuario ya registrado se autentique en la plataforma mediante email y contraseña para acceder a su cuenta y las funcionalidades asociadas a ella.

### 2. Actor/es

| Actor | Rol | Permisos |
|---|---|---|
| Usuario registrado | Persona que ya tiene cuenta en la plataforma | POR CONFIRMAR: no se especifican niveles de permisos ni roles diferenciados (admin, usuario estándar, etc.) |

### 3. Flujo principal (camino feliz)

1. El usuario accede a la pantalla de inicio de sesión.
2. Ingresa su email en el campo correspondiente.
3. Ingresa su contraseña en el campo correspondiente.
4. Presiona el botón "Iniciar sesión".
5. El sistema autentica las credenciales.
6. El sistema muestra el mensaje "Has iniciado sesión correctamente."
7. **POR CONFIRMAR:** ¿A dónde se redirige al usuario después del mensaje? (dashboard, home, última página visitada, etc.)

### 4. Sistemas involucrados

| Sistema | Evidencia |
|---|---|
| **Front-end** | Se infiere: hay un formulario con campos email, contraseña y botón "Iniciar sesión". Muestra mensajes de éxito/error. |
| **Back-end / API de autenticación** | Se infiere: el sistema "autentica" las credenciales, lo que implica validación contra datos almacenados. |
| **Base de datos (usuarios)** | Se infiere: existe al menos una cuenta registrada (ana.garcia@ejemplo.com), por lo que hay un almacén de credenciales. |
| Servicios externos (OAuth, 2FA, etc.) | POR CONFIRMAR: no se mencionan. |

### 5. Datos de entrada

| Campo | Tipo | Obligatorio | Observaciones |
|---|---|---|---|
| Email | Texto (formato email) | Sí (CA-3) | POR CONFIRMAR: ¿hay validación de formato email antes del envío? |
| Contraseña | Texto (enmascarado) | Sí (CA-3) | POR CONFIRMAR: ¿hay longitud mínima/máxima validada en front? |

Cuenta de prueba proporcionada: `ana.garcia@ejemplo.com` / `Segura2026!`

### 6. Datos de salida

| Escenario | Salida |
|---|---|
| Credenciales válidas | Mensaje: "Has iniciado sesión correctamente." |
| Credenciales inválidas | Mensaje de error (POR CONFIRMAR: no se especifica el texto exacto del mensaje de error) |
| Campo/s vacío/s | El formulario no se envía (POR CONFIRMAR: ¿se muestra algún mensaje de validación al usuario o solo se bloquea el envío?) |

**POR CONFIRMAR adicionales:**
- ¿Se genera un token/sesión como resultado de la autenticación exitosa?
- ¿Hay límite de intentos fallidos o bloqueo de cuenta?
- ¿Existe opción "Recordarme" u "Olvidé mi contraseña"?
- ¿La contraseña tiene opción de mostrar/ocultar?

---

## CAPA R — MATRIZ DE RIESGOS

| # | Descripción | Categoría | Impacto | Nivel | Justificación (si ALTO) |
|---|---|---|---|---|---|
| R1 | Credenciales válidas son rechazadas (falso negativo en autenticación) | Funcional | El usuario legítimo no puede acceder a su cuenta. Bloqueo total del acceso. | **ALTO** | Es la función core de la HU; si falla, el usuario queda fuera de la plataforma. |
| R2 | Credenciales inválidas permiten el acceso (falso positivo en autenticación) | Seguridad | Un atacante o usuario no autorizado accede a datos/cuenta ajena. | **ALTO** | Acceso indebido = exposición de datos personales y posible daño al negocio. |
| R3 | Contraseña transmitida o almacenada en texto plano | Seguridad | Compromiso masivo de credenciales si hay filtración. | **ALTO** | Violación de estándares mínimos de seguridad; impacto en todos los usuarios. |
| R4 | Sin límite de intentos fallidos (fuerza bruta posible) | Seguridad | Un atacante puede probar combinaciones hasta encontrar la contraseña. | **ALTO** | POR CONFIRMAR si existe protección; si no la hay, la cuenta de cualquier usuario es vulnerable. |
| R5 | Formulario se envía con campos vacíos (validación front no funciona) | Funcional | Petición innecesaria al back-end; posible error no controlado del servidor. | **MEDIO** | CA-3 lo exige explícitamente; el impacto depende de si el back-end también valida. |
| R6 | Mensaje de error revela si el email existe o no en el sistema | Seguridad | Permite enumeración de usuarios registrados. | **MEDIO** | Facilita ataques dirigidos, pero requiere explotación adicional. |
| R7 | Fallo de comunicación front ↔ back-end (API caída, timeout) | Integración | El usuario no puede autenticarse; experiencia rota sin feedback claro. | **MEDIO** | Depende de infraestructura; impacto alto pero probabilidad variable. |
| R8 | Mensaje de éxito se muestra pero la sesión no se crea realmente | Técnico | El usuario cree estar autenticado pero no tiene sesión; falla en la siguiente acción. | **MEDIO** | Inconsistencia entre UI y estado real del sistema. |
| R9 | No hay validación de formato de email en front-end | Datos | Se envían datos malformados al back-end; posible inyección o error no controlado. | **MEDIO** | POR CONFIRMAR si existe; podría derivar en problemas de seguridad (inyección). |
| R10 | Mensaje de error no se muestra o es genérico/incomprensible | UX | El usuario no entiende qué salió mal; abandono o contacto innecesario a soporte. | **BAJO** | No impide el funcionamiento, pero degrada la experiencia. |
| R11 | El botón "Iniciar sesión" no responde o se puede presionar múltiples veces | UX / Técnico | Múltiples peticiones al back-end; posible comportamiento inesperado. | **BAJO** | Molesto pero generalmente no causa daño a datos. |
| R12 | Redirección post-login inexistente o incorrecta | UX | El usuario queda en una pantalla muerta tras autenticarse. POR CONFIRMAR destino. | **BAJO** | No afecta la autenticación en sí, pero rompe el flujo de uso. |

**Resumen por nivel:**
- **ALTO:** 4 riesgos (R1–R4) — todos relacionados con la función core o seguridad de acceso.
- **MEDIO:** 5 riesgos (R5–R9) — validaciones, integración y consistencia de estado.
- **BAJO:** 3 riesgos (R10–R12) — UX y usabilidad.

---

## CAPA R — ESCENARIOS DE PRUEBA

### 1. CAMINO FELIZ *(cubre R1)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E01 | Login con email y contraseña válidos (ana.garcia@ejemplo.com / Segura2026!) | Se muestra el texto exacto: "Has iniciado sesión correctamente." |

### 2. NEGATIVOS *(cubre R2, R5, R6)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E02 | Login con email válido y contraseña incorrecta | No se accede a la cuenta. Se muestra un mensaje de error visible en pantalla. |
| E03 | Login con email no registrado y contraseña cualquiera | No se accede a la cuenta. Se muestra un mensaje de error visible en pantalla. |
| E04 | Login con campo email vacío y contraseña completa | El formulario NO se envía (no hay petición de red al back-end). |
| E05 | Login con email completo y campo contraseña vacío | El formulario NO se envía (no hay petición de red al back-end). |
| E06 | Login con ambos campos vacíos | El formulario NO se envía (no hay petición de red al back-end). |

### 3. SEGURIDAD *(cubre R3, R4, R6)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E07 | Verificar que la contraseña no viaja en texto plano en la petición de red | En DevTools > Network: la petición usa HTTPS y/o el campo password no es legible como texto plano en el payload. POR CONFIRMAR: mecanismo de cifrado esperado. |
| E08 | Intentar login fallido N veces consecutivas rápidamente | POR CONFIRMAR: ¿existe bloqueo, captcha o delay? Si existe, verificar que se activa. Si no existe, documentar como riesgo abierto (R4). |
| E09 | Comparar el mensaje de error de E02 vs E03 | Ambos muestran el **mismo** mensaje genérico (no revelan si el email existe o no). POR CONFIRMAR: texto exacto del mensaje de error no especificado en la HU. |

### 4. BORDE / LÍMITES *(cubre R9)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E10 | Login con email sin formato válido (ej: "textosinArroba") | El formulario NO se envía, o se muestra mensaje de validación de formato. POR CONFIRMAR: si la validación es front o back. |
| E11 | Login con email con espacios al inicio/final (" ana.garcia@ejemplo.com ") | POR CONFIRMAR: ¿el sistema hace trim? Si sí → login exitoso. Si no → error. Verificar comportamiento real. |
| E12 | Login con contraseña que contiene solo espacios en blanco | No se accede a la cuenta. Se muestra mensaje de error. |

### 5. INTEGRACIÓN *(cubre R7, R8)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E13 | Login con back-end caído o sin respuesta (simular timeout/error 500) | El front muestra un mensaje de error comprensible al usuario (no pantalla rota, no spinner infinito). POR CONFIRMAR: mensaje esperado en este caso. |
| E14 | Tras login exitoso (E01), verificar que la sesión quedó realmente creada | El usuario puede acceder a una sección protegida sin que lo redirija al login. POR CONFIRMAR: qué sección protegida usar como verificación. |

### 6. DATOS *(combinaciones relevantes)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E15 | Login con email en mayúsculas (ANA.GARCIA@EJEMPLO.COM / Segura2026!) | POR CONFIRMAR: ¿el email es case-insensitive? Si sí → login exitoso. Si no → error. Verificar comportamiento real. |
| E16 | Login con contraseña correcta pero con mayúsculas cambiadas (segura2026!) | No se accede a la cuenta. Se muestra mensaje de error. (La contraseña debe ser case-sensitive). |

### 7. UX / ESTADOS *(cubre R10, R11, R12)*

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E17 | Verificar que el campo contraseña enmascara los caracteres | Los caracteres se muestran como puntos/asteriscos (type="password" en el input). |
| E18 | Hacer doble clic rápido en "Iniciar sesión" con datos válidos | Se envía una sola petición al back-end (verificar en DevTools > Network). No se muestra doble mensaje ni error. |
| E19 | Tras login exitoso, verificar redirección | POR CONFIRMAR: el usuario es redirigido a una página específica (destino no definido en la HU). |

### 8. ROLES Y PERMISOS

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| — | No aplican escenarios específicos | POR CONFIRMAR: la HU no define roles diferenciados ni permisos. Si existen, agregar escenarios. |

### 9. REGRESIÓN

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E20 | Tras un login exitoso seguido de logout, intentar login nuevamente | El segundo login funciona igual que E01: muestra "Has iniciado sesión correctamente." POR CONFIRMAR: existencia de funcionalidad de logout. |

---

### Trazabilidad: Riesgos → Escenarios

| Riesgo cubierto | Escenarios |
|---|---|
| R1 (ALTO) | E01 |
| R2 (ALTO) | E02, E03 |
| R3 (ALTO) | E07 |
| R4 (ALTO) | E08 |
| R5 (MEDIO) | E04, E05, E06 |
| R6 (MEDIO) | E09 |
| R7 (MEDIO) | E13 |
| R8 (MEDIO) | E14 |
| R9 (MEDIO) | E10, E11 |
| R10 (BAJO) | E17 |
| R11 (BAJO) | E18 |
| R12 (BAJO) | E19 |

**Total:** 20 escenarios | 7 con elementos POR CONFIRMAR
