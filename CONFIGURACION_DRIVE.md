# Configuración de Google Drive con Domain-Wide Delegation

## Problema
Las Service Accounts de Google no tienen cuota de almacenamiento propia. Para resolver esto, necesitamos usar **Domain-Wide Delegation** para que la Service Account actúe en nombre del usuario institucional (`alu.23130568@correo.itlalaguna.edu.mx`) y use su cuota de almacenamiento.

## Solución: Configurar Domain-Wide Delegation

### Paso 1: Habilitar Domain-Wide Delegation en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto: **`pulsotecdocumentos`**
3. Ve a **IAM & Admin** > **Service Accounts**
4. Busca y haz clic en tu Service Account: **`admin-832@pulsotecdocumentos.iam.gserviceaccount.com`**
5. En la sección **"Advanced settings"** o en los detalles de la Service Account, busca **"Show Domain-Wide Delegation"**
6. Marca la casilla **"Enable Google Workspace Domain-wide Delegation"**
7. Haz clic en **"Save"** o **"Guardar"**

### Paso 2: Verificar que la Carpeta Esté Compartida (Opcional pero Recomendado)

Aunque Domain-Wide Delegation permite acceder sin compartir, es buena práctica compartir la carpeta:

1. Inicia sesión con: `alu.23130568@correo.itlalaguna.edu.mx`
2. Abre la carpeta **PULSOTEC** en Google Drive
3. Haz clic en **"Compartir"**
4. Agrega: `admin-832@pulsotecdocumentos.iam.gserviceaccount.com`
5. Dale permisos de **"Editor"**
6. Desmarca "Notificar a las personas"
7. Guarda

### Paso 3: Verificar la Configuración en el Código

El archivo `php/drive_config.php` ya está configurado con:
- **DRIVE_FOLDER_ID**: `1zwIPD1kZc5SyXuhRgsGgSupHi9E2GO_Y`
- **DRIVE_FOLDER_OWNER**: `alu.23130568@correo.itlalaguna.edu.mx`

No necesitas cambiar nada en el código, solo asegúrate de que Domain-Wide Delegation esté habilitado en Google Cloud Console.

## Cómo Funciona

1. La Service Account se autentica con sus credenciales
2. Usa `setSubject()` para impersonar al usuario institucional
3. Google Drive permite que la Service Account actúe como si fuera el usuario
4. Los archivos se suben usando la cuota del usuario institucional, no de la Service Account

## Solución de Problemas

### Error: "invalid_grant"
- **Causa**: Domain-Wide Delegation no está habilitado o configurado incorrectamente
- **Solución**: Sigue el Paso 1 para habilitar Domain-Wide Delegation en Google Cloud Console

### Error: "storageQuotaExceeded"
- **Causa**: Domain-Wide Delegation no está funcionando correctamente
- **Solución**: 
  1. Verifica que Domain-Wide Delegation esté habilitado
  2. Verifica que el email en `DRIVE_FOLDER_OWNER` sea correcto
  3. Asegúrate de que la cuenta institucional tenga espacio disponible

### Error: "No se pudo acceder a la carpeta"
- **Causa**: El ID de la carpeta es incorrecto o no tienes acceso
- **Solución**: 
  1. Verifica el ID de la carpeta en `drive_config.php`
  2. Asegúrate de que la carpeta exista y sea accesible

## Notas Importantes

- Domain-Wide Delegation solo funciona con cuentas de **Google Workspace** (no con cuentas personales @gmail.com)
- La cuenta `alu.23130568@correo.itlalaguna.edu.mx` debe ser una cuenta institucional válida
- Una vez configurado, los archivos se subirán usando la cuota del usuario institucional
- Los archivos se harán públicos automáticamente para visualización

## Verificación

Después de configurar Domain-Wide Delegation:

1. Intenta crear un proyecto nuevo desde la aplicación
2. Si todo está bien, el archivo se subirá exitosamente a la carpeta PULSOTEC
3. Verifica en Google Drive que el archivo aparezca en la carpeta

