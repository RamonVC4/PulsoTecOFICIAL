# Configuración de OAuth para Google Drive

## Paso 1: Crear Credenciales OAuth en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: **`pulsotecdocumentos`**
3. Ve a **APIs & Services** > **Credentials**
4. Haz clic en **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
5. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo de usuario: **External**
   - Nombre de la app: **PulsoTec**
   - Email de soporte: tu email
   - Guarda y continúa
6. En "Scopes", agrega: `https://www.googleapis.com/auth/drive`
7. En "Test users", agrega: `alu.23130568@correo.itlalaguna.edu.mx`
8. Crea el OAuth Client ID:
   - Tipo de aplicación: **Web application**
   - Nombre: **PulsoTec Drive Upload**
   - Authorized redirect URIs: 
     ```
     http://localhost:8888/pulsotec/PulsoTecOFICIAL/php/drive_auth.php
     ```
     (Ajusta el puerto y ruta según tu configuración de MAMP)
9. Haz clic en **"CREATE"**
10. Descarga el archivo JSON de credenciales
11. Renombra el archivo a `drive_credentials.json`
12. Colócalo en la raíz del proyecto: `/Applications/MAMP/htdocs/pulsotec/PulsoTecOFICIAL/drive_credentials.json`

## Paso 2: Autenticarse por Primera Vez

1. Abre tu navegador y ve a:
   ```
   http://localhost:8888/pulsotec/PulsoTecOFICIAL/php/drive_auth.php
   ```
   (Ajusta el puerto según tu configuración de MAMP)

2. Se te pedirá que inicies sesión con tu cuenta de Google
3. Inicia sesión con: `alu.23130568@correo.itlalaguna.edu.mx`
4. Autoriza el acceso a Google Drive
5. El token se guardará automáticamente en `drive_token.json`

## Paso 3: Verificar que Funciona

1. Intenta crear un proyecto nuevo desde la aplicación
2. El archivo debería subirse a la carpeta PULSOTEC en tu Google Drive

## Estructura de Archivos

Después de la configuración, deberías tener:

```
PulsoTecOFICIAL/
├── drive_credentials.json  (Credenciales OAuth de la aplicación)
├── drive_token.json         (Token de acceso - se crea automáticamente)
└── php/
    ├── drive_config.php
    ├── drive_upload.php
    └── drive_auth.php
```

## Solución de Problemas

### Error: "No se encontró el archivo de credenciales OAuth"
- Verifica que `drive_credentials.json` esté en la raíz del proyecto
- Verifica que el archivo tenga el formato correcto (JSON válido)

### Error: "redirect_uri_mismatch"
- Verifica que la URL en "Authorized redirect URIs" en Google Cloud Console coincida exactamente con la URL que estás usando
- Debe ser: `http://localhost:8888/pulsotec/PulsoTecOFICIAL/php/drive_auth.php` (o el puerto que uses)

### Error: "Token expirado"
- Visita `drive_auth.php` nuevamente para refrescar el token
- El token se refrescará automáticamente si tienes un refresh token válido

### Error: "access_denied"
- Asegúrate de estar usando la cuenta correcta: `alu.23130568@correo.itlalaguna.edu.mx`
- Verifica que la app esté en modo "Testing" y que tu cuenta esté en "Test users"

## Ventajas de OAuth vs Service Account

✅ **Usa tu propia cuota de almacenamiento** (no hay límite de Service Account)  
✅ **Más simple de configurar** (no requiere Domain-Wide Delegation)  
✅ **Acceso directo a tu carpeta** (no necesitas compartir con Service Account)  
✅ **Más seguro** (solo tu cuenta tiene acceso)

## Notas

- El token se guarda localmente en `drive_token.json`
- El token se refresca automáticamente cuando expira
- Si el refresh token expira, necesitarás autenticarte nuevamente
- **NO subas `drive_token.json` a Git** (agrégalo a `.gitignore`)

