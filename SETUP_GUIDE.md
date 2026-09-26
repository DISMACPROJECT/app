# DCONTROL - Setup Guide

## ✅ Checklist Previo

Antes de empezar, asegúrate de tener:

- [ ] Node.js >= 18.0.0 (`node --version`)
- [ ] npm >= 9.0.0 (`npm --version`)
- [ ] Acceso al repositorio GitHub
- [ ] ID del Google Apps Script deployment
- [ ] ID de la carpeta Google Drive del proyecto
- [ ] Dispositivo o emulador Android/iOS

---

## 🔧 Paso 1: Setup Inicial

### 1.1 Clonar el repositorio

```bash
git clone https://github.com/DISMACPROJECT/app.git
cd app
git checkout claude/dcontrol-react-native-app-7mxik8
```

### 1.2 Instalar Expo CLI globalmente

```bash
npm install -g expo-cli eas-cli
```

### 1.3 Instalar dependencias del proyecto

```bash
npm install
```

**Nota**: Si encuentras errores de dependencias, prueba:
```bash
npm install --legacy-peer-deps
```

---

## 🔐 Paso 2: Configurar Variables de Entorno

### 2.1 Crear archivo `.env.local`

```bash
cp .env.example .env.local
```

### 2.2 Editar `.env.local` con tus valores

```env
# 1. URL del Google Apps Script
# Obtener de: Google Apps Script → Deploy → Copiar URL
EXPO_PUBLIC_API_BASE_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercoderun

# 2. ID de la carpeta Google Drive
# Obtener de: Crear carpeta en Drive → Botón derecho → Obtener vínculo
EXPO_PUBLIC_DRIVE_PROJECT_FOLDER=YOUR_FOLDER_ID

# 3. Features (opcional, por defecto true)
EXPO_PUBLIC_ENABLE_BIOMETRIC=true
EXPO_PUBLIC_ENABLE_GPS=true
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true

# 4. Retención de datos
EXPO_PUBLIC_PHOTO_RETENTION_DAYS=60
EXPO_PUBLIC_TASK_RETENTION_DAYS=90

# 5. Logging
EXPO_PUBLIC_LOG_LEVEL=info
```

---

## 🚀 Paso 3: Ejecutar la App

### Opción A: Expo Go (Desarrollo Rápido)

**Requisito**: Expo Go app en tu teléfono

```bash
npm start
```

Luego:
- **Android**: Abre Expo Go → Escanea QR
- **iOS**: Abre cámara → Escanea QR

### Opción B: Emulador Android

**Requisitos**: Android Studio + AVD configurado

```bash
npm run android
```

### Opción C: Emulador iOS (macOS)

**Requisitos**: Xcode + iOS Simulator

```bash
npm run ios
```

### Opción D: Development Client (Recomendado)

```bash
npm install expo-dev-client
npm run android  # o npm run ios
```

---

## 🧪 Paso 4: Testing de Autenticación

### 4.1 Pantalla de Login

La app mostrará la pantalla de login. Actualmente esto es un **placeholder**.

Para probar:

1. Verifica que el campo de email valida formato email
2. Verifica que el campo de password requiere mínimo 6 caracteres
3. Verifica que muestra errores de validación

### 4.2 Simular respuesta del API

Para testing sin backend, puedes:

**Opción 1**: Mock del authService en desarrollo

Editar `src/services/api/authService.ts`:

```typescript
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    // TODO: Reemplazar con test data
    if (payload.email === 'test@dismac.com.ec' && 
        payload.password === 'password123') {
      return {
        user: {
          id: 'user-123',
          email: payload.email,
          name: 'Usuario Prueba',
          role: 'MERCADERISTAS',
          department: 'Zona 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'mock-token-abc123',
          refreshToken: 'mock-refresh-xyz789',
          expiresIn: 3600,
        },
      };
    }
    throw new Error('Credenciales inválidas');
  },
  // ... resto de métodos
};
```

**Opción 2**: Usar Postman para testing de API

```bash
POST https://script.google.com/macros/d/{ID}/usercoderun
Content-Type: application/json

{
  "action": "login",
  "email": "usuario@dismac.com.ec",
  "password": "password123"
}
```

---

## 📱 Paso 5: Verificar Características

### 5.1 Redux DevTools

Para debuggear Redux en desarrollo:

```bash
npm install redux-devtools-extension --save-dev
```

### 5.2 Network Inspector

En Expo Go, abre Developer Menu:
- Android: Shake device o `adb shell input keyevent 82`
- iOS: Shake device

Selecciona "Debug Network"

### 5.3 Logs

Ver logs en real-time:
```bash
npm start
# En terminal del dev server, presiona 'i' para iOS o 'a' para Android
# Luego 'j' para abrir debugger
```

---

## 🔗 Paso 6: Conectar Backend (Google Apps Script)

### 6.1 Estructura esperada en GAS

El backend debe tener estos endpoints:

**POST /auth/login**
```javascript
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  
  if (params.action === 'login') {
    // Validar credenciales en base de datos
    // Retornar tokens JWT
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: {
        user: {...},
        tokens: {...}
      },
      timestamp: new Date().toISOString()
    }));
  }
}
```

Ver [API_INTEGRATION.md](./API_INTEGRATION.md) para especificación completa.

### 6.2 Generar JWT tokens

En Google Apps Script, usar librería para JWT:

```javascript
// Agregar librería: ID de librería JWT
// Script ID: 1Sxq3j8KUxV3hLVvMcMakCXlvQdBVqMjpDRiV77lDGzLg-xNYJ_2eVRds

const jwt = require('jsonwebtoken');

const token = jwt.sign({
  sub: user.id,
  email: user.email,
  name: user.name,
  role: user.role
}, SECRET_KEY, { expiresIn: '1h' });
```

---

## 🛠️ Paso 7: Build para Producción

### 7.1 Preparar para EAS Build

```bash
eas login
eas init
```

### 7.2 Build para Android

```bash
eas build --platform android --local
# O: eas build --platform android (en cloud)
```

### 7.3 Build para iOS

```bash
eas build --platform ios --local
# Requiere Mac con Xcode
```

### 7.4 Submit a App Stores

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## 🐛 Troubleshooting

### Problema: Metro bundler crashed

**Solución**:
```bash
rm -rf node_modules .expo
npm install
npm start -- -c  # -c limpia cache
```

### Problema: "Cannot find module"

**Solución**:
```bash
# Verificar imports usan path aliases
import { colors } from '@theme/colors'  # ✅ Correcto
import { colors } from '../../../theme/colors'  # ❌ Evitar

# Si los aliases no funcionan:
npm start -- --clear
```

### Problema: Permisos de cámara/ubicación rechazados

**Solución**:
- Android: Ir a Configuración → Aplicaciones → DCONTROL → Permisos
- iOS: Configuración → DCONTROL → Permisos

### Problema: "Token inválido"

**Solución**:
- Limpiar almacenamiento: Desinstalar app y reinstalar
- O borrar manualmente en:
  - Android: Settings → Apps → DCONTROL → Storage → Clear Data
  - iOS: Settings → DCONTROL → Offload App (y reinstalar)

### Problema: App se congela al hacer login

**Solución**:
- Verificar que el API responde correctamente
- Usar Postman para testear endpoint de login
- Ver logs en: `npm start` → Developer Menu → Debug

---

## 📊 Paso 8: Monitoreo

### 8.1 Errores en Producción

Configurar Sentry para error tracking:

```bash
npm install @sentry/react-native
```

En `src/App.tsx`:
```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
});
```

### 8.2 Analytics

Implementar analytics con Expo Analytics o Firebase:

```bash
npm install expo-analytics
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en la terminal de desarrollo
2. Abre Developer Menu (shake device)
3. Selecciona "Show Inspector"
4. Verifica que las variables de entorno estén configuradas

Para reportar bugs:
- GitHub Issues: https://github.com/DISMACPROJECT/app/issues
- Slack: #dcontrol-dev

---

## ✅ Verificación Final

Antes de desplegar, verifica:

- [ ] `.env.local` está configurado correctamente
- [ ] API responde en `EXPO_PUBLIC_API_BASE_URL`
- [ ] App inicia sin errores
- [ ] Puedo ver la pantalla de login
- [ ] Los campos de login validan input
- [ ] Los estados de Redux se actualizan (DevTools)
- [ ] No hay warnings en consola

¡Listo para usar! 🎉

---

**Próximos pasos**:
1. Implementar backend endpoints en Google Apps Script
2. Conectar autenticación real
3. Implementar Fase 2: Marcajes biométricos
4. Agregar cámara y GPS

Para más información, ver [ARCHITECTURE.md](./ARCHITECTURE.md) y [API_INTEGRATION.md](./API_INTEGRATION.md).
