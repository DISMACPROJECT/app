# Desplegar Backend en Google Apps Script

## 📋 Requisitos

- Cuenta de Google (Gmail, Google Drive, etc.)
- Google Apps Script habilitado
- Google Sheets para almacenar datos

---

## 🚀 Pasos de Instalación

### Paso 1: Crear un Proyecto de Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Click en "Nuevo proyecto"
3. Dale un nombre: **DCONTROL Backend**

### Paso 2: Crear una Google Sheet para la Base de Datos

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Click en "Crear nueva hoja de cálculo"
3. Dale un nombre: **DCONTROL Database**
4. **COPIA EL ID DE LA SHEET** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```
   El ID es la parte entre `/d/` y `/edit`

### Paso 3: Copiar el Código del Backend

1. En [script.google.com](https://script.google.com), vuelve al proyecto **DCONTROL Backend**
2. Reemplaza todo el contenido de `Code.gs` con el contenido de `BACKEND_GOOGLE_APPS_SCRIPT.gs`
3. **REEMPLAZA ESTA LÍNEA:**
   ```javascript
   const SPREADSHEET_ID = "REEMPLAZA_CON_TU_GOOGLE_SHEET_ID";
   ```
   Con tu ID de la Sheet que copiaste en el Paso 2:
   ```javascript
   const SPREADSHEET_ID = "1a2b3c4d5e6f7g8h9i0j...";
   ```

### Paso 4: Ejecutar Configuración Inicial

1. En Google Apps Script, selecciona la función `setupDatabase`
2. Click en el botón ▶️ "Ejecutar"
3. Autoriza la aplicación (Google pedirá permisos)
4. Deberías ver en el log: "Database setup completado"

### Paso 5: Obtener el Deployment ID

1. Click en "Desplegar" (arriba a la derecha)
2. Click en "Nueva implementación"
3. Selecciona el ícono de engranaje (⚙️)
4. En "Tipo de implementación" selecciona "Aplicación web"
5. Completa:
   - **Ejecutar como**: Tu email (dismac@dismac.com.ec)
   - **Quién tiene acceso**: Cualquiera
6. Click en "Desplegar"
7. Se abrirá una ventana con la URL:
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun
   ```
8. **COPIA TODO EL LINK** - Este es tu `API_BASE_URL`

---

## 🔧 Configuración en la App

Una vez tengas el Deployment ID, actualiza `.env` en la app:

```
API_BASE_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun
```

Reemplaza `{DEPLOYMENT_ID}` con el ID que obtuviste en el Paso 5.

---

## 🧪 Probar el Backend

### Con Postman o cURL

**Login:**
```bash
curl -X POST \
  "https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dismac@dismac.com.ec",
    "password": "1234"
  }'
```

Debería retornar:
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid...",
  "user": {
    "id": "user-admin",
    "email": "dismac@dismac.com.ec",
    "name": "Admin DISMAC",
    "role": "ADMIN",
    "department": "Corporativo",
    "phone": "+593999999999"
  }
}
```

**Obtener Perfil:**
```bash
curl -X GET \
  "https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun/user/profile" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## 👥 Usuarios de Prueba

Después de ejecutar `setupDatabase`, tendrás estos usuarios:

| Email | Password | Rol | Acceso |
|-------|----------|-----|--------|
| dismac@dismac.com.ec | 1234 | ADMIN | Acceso total |
| ventas@dismac.com.ec | 1234 | MERCADERISTAS | Tareas |
| biometrico@dismac.com.ec | 1234 | BIOMETRICO | Marcajes |
| planta@dismac.com.ec | 1234 | PLANTA | Marcajes |

---

## 🔑 Variables de Entorno

Después de obtener el URL, actualiza `.env`:

```env
API_BASE_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun
API_TIMEOUT=30000
ENABLE_BIOMETRIC=true
ENABLE_GPS=true
ENABLE_OFFLINE_MODE=true
PHOTO_RETENTION_DAYS=60
LOG_LEVEL=info
DRIVE_PROJECT_FOLDER=dcontrol
```

---

## ⚠️ IMPORTANTE - Seguridad

**ANTES de poner en producción:**

1. **Cambiar JWT_SECRET:**
   ```javascript
   const JWT_SECRET = "tu_clave_super_secreta_cambiar_en_produccion";
   ```
   Usa una clave aleatoria fuerte.

2. **Hashear Passwords:**
   - El código actual guarda passwords en texto plano
   - En producción, usar bcrypt o similar

3. **Validar Permisos:**
   - El código verifica algunos permisos
   - Revisa y ajusta según tu lógica de negocio

4. **HTTPS:**
   - Google Apps Script usa HTTPS automáticamente
   - Las URLs son seguras por defecto

---

## 🐛 Troubleshooting

### Error: "SPREADSHEET_ID vacío"
- Asegúrate de actualizar `SPREADSHEET_ID` con tu ID real
- No dejes `REEMPLAZA_CON_TU_GOOGLE_SHEET_ID`

### Error 403 al autorizar
- Google está pidiendo permisos
- Click en "Autorizar" y selecciona tu cuenta
- Déjalo acceder a Google Sheets y Drive

### Error al desplegar
- Intenta de nuevo
- Si persiste: Delete deployment, crea uno nuevo
- Espera 30 segundos entre intentos

### Los datos no se guardan
- Verifica que `setupDatabase` se ejecutó correctamente
- Abre la Google Sheet y confirma que tiene datos
- Revisa los logs en Google Apps Script (View → Logs)

---

## 📞 Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Login con email/password
- `POST /auth/refresh-token` - Renovar access token

### Usuario
- `GET /user/profile` - Obtener perfil actual

### Asistencia
- `POST /attendance/mark` - Marcar entrada/salida
- `GET /attendance/history` - Historial de marcajes

### Tareas
- `POST /tasks` - Crear tarea (solo Admin/Asignadores)
- `GET /tasks` - Obtener tareas del usuario
- `GET /tasks/{id}` - Obtener detalle de tarea
- `POST /tasks/{id}/photos` - Subir foto a tarea

### Reportes
- `GET /reports` - Obtener reportes (solo Admin/Administrativo)

---

## ✅ Checklist de Deployment

- [ ] Proyecto de Google Apps Script creado
- [ ] Google Sheet creada y ID copiado
- [ ] Código pegado y SPREADSHEET_ID actualizado
- [ ] `setupDatabase()` ejecutado correctamente
- [ ] Deployment realizado y URL copiada
- [ ] `.env` de la app actualizado con API_BASE_URL
- [ ] Login probado con Postman/cURL
- [ ] Usuarios de prueba funcionan
- [ ] JWT_SECRET cambiado en producción
- [ ] Passwords hasheados (producción)

---

**¡Listo! Tu backend está funcionando. Ahora conecta la app en `.env` y comienza a testear.**
