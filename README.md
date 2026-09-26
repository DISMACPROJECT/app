# DCONTROL - App Móvil de Control de Personal Operativo

[![Expo](https://img.shields.io/badge/Expo-v51.0.0-blue)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-v0.74.5-green)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0.0-blue)](https://www.typescriptlang.org)

App móvil React Native + Expo para control de personal operativo con marcajes biométricos, gestión de tareas y reportes offline-first.

## 🎯 Características

- ✅ **Autenticación JWT** con refresh tokens automáticos
- ✅ **Marcajes Biométricos** (entrada, salida, comedor)
- ✅ **Geolocalización GPS** con validación de ubicación
- ✅ **Gestión de Tareas** con fotos y ubicación
- ✅ **Reportes Dinámicos** en PDF
- ✅ **Modo Offline-First** con sincronización automática
- ✅ **7 Roles de Usuario** con permisos específicos
- ✅ **Almacenamiento Seguro** de tokens (SecureStore)
- ✅ **Tema Claro/Oscuro** personalizable

## 🏗️ Arquitectura

```
Expo (React Native)
    ↓
Redux Toolkit (State Management)
    ↓
React Navigation (Navegación)
    ↓
Axios + Interceptores (API)
    ↓
Google Apps Script Backend
```

## 📋 Requisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** o **Xcode** (para builds nativos)

## 🚀 Setup Inicial

### 1. Clonar repositorio
```bash
git clone https://github.com/DISMACPROJECT/app.git
cd app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
EXPO_PUBLIC_API_BASE_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun
EXPO_PUBLIC_ENABLE_BIOMETRIC=true
EXPO_PUBLIC_ENABLE_GPS=true
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
EXPO_PUBLIC_PHOTO_RETENTION_DAYS=60
```

### 4. Iniciar app
```bash
npm start
```

## 📱 Ejecutar en Dispositivos

### Expo Go (Desarrollo rápido)
```bash
npm start
# Escanear QR con Expo Go app
```

### Android
```bash
npm run android
# O: expo start --android
```

### iOS
```bash
npm run ios
# O: expo start --ios
```

## 🔐 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Todos los permisos del sistema |
| **ASIGNADORES** | Solo asignan tareas a mercaderistas |
| **MERCADERISTAS** | Solo ejecutan tareas asignadas |
| **OBRA** | Gestiona visitas a obra |
| **BIOMETRICO** | Accede al sistema biométrico |
| **PLANTA** | Crea usuarios y los usa en biométrico |
| **ADMINISTRATIVO** | Registra marcajes biométricos |
| **RUTA** | Tareas de despacho/distribución |

## 📱 Pantallas Principales

1. **Login Screen**
   - Autenticación con email/password
   - Recuperación de contraseña
   - Validación de forma en cliente

2. **Home (Dashboard)**
   - Resumen de actividad
   - Accesos directos a secciones
   - Notificaciones de tareas

3. **Marcajes**
   - Registrar entrada/salida
   - Comedor (entrada/salida)
   - Historial de marcajes
   - Verificación biométrica

4. **Tareas**
   - Listar tareas pendientes
   - Crear/editar tareas
   - Captura de fotos con GPS
   - Marcar como completadas

5. **Reportes**
   - Generar reportes dinámicos
   - Visualizar en PDF
   - Descargar/compartir

6. **Perfil**
   - Ver información de usuario
   - Cambiar contraseña
   - Cerrar sesión

## 🛠️ Estructura del Proyecto

```
src/
├── screens/           # Pantallas de la app
├── components/        # Componentes reutilizables
├── services/          # API, Storage, etc
├── store/             # Redux state management
├── hooks/             # Custom hooks
├── utils/             # Utilidades y helpers
├── types/             # TypeScript types
├── navigation/        # React Navigation config
├── theme/             # Colors, typography, spacing
└── config/            # Configuración
```

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para más detalles.

## 🔌 API Integration

La app se conecta a Google Apps Script via REST API.

**Endpoints esperados** en [API_INTEGRATION.md](./API_INTEGRATION.md):

- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /attendance/mark`
- `GET /attendance/history`
- `GET /tasks`
- `POST /tasks/{id}/photos`
- `POST /reports/generate`
- etc.

## 📦 Dependencias Principales

```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "@react-navigation/native": "^6.1.10",
  "@reduxjs/toolkit": "^1.9.7",
  "axios": "^1.6.0",
  "expo-location": "~17.0.1",
  "expo-camera": "~15.0.12",
  "expo-local-authentication": "~14.0.1",
  "expo-secure-store": "~13.0.1"
}
```

Ver [package.json](./package.json) para lista completa.

## 🔄 Flujo Offline-First

```
┌─ App inicia
├─ Cargar datos en caché local (AsyncStorage)
├─ Verificar conexión (NetInfo)
│  ├─ Online: Usar API en tiempo real
│  └─ Offline: Usar caché + queue
│
└─ Al regresar online:
    ├─ Sincronizar cola de cambios
    ├─ Resolver conflictos
    └─ Actualizar caché
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📝 Scripts Disponibles

```bash
npm start          # Iniciar dev server
npm run android    # Correr en Android
npm run ios        # Correr en iOS
npm run web        # Correr en web
npm test           # Ejecutar tests
npm run lint       # Lint de código
npm run type-check # Verificar tipos TypeScript
npm run format     # Formatear código
```

## 🔐 Seguridad

- ✅ Tokens almacenados en **SecureStore** (no AsyncStorage)
- ✅ Validación en cliente y servidor
- ✅ HTTPS obligatorio en producción
- ✅ Certificado pinning (opcional)
- ✅ Permisos solicitados en tiempo de uso
- ✅ Auto-logout en token expirado

## 📊 Performance

- ✅ Code splitting por ruta
- ✅ Lazy loading de componentes
- ✅ Memoization (React.memo, useMemo)
- ✅ Compresión automática de fotos
- ✅ Caching inteligente de API
- ✅ Bundle size optimizado

## 🚢 Deployment

### EAS Build (Recomendado)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login a Expo
eas login

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Submit a stores
eas submit --platform android
eas submit --platform ios
```

## 📚 Documentación

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura y decisiones
- [API_INTEGRATION.md](./API_INTEGRATION.md) - Especificación de endpoints
- [package.json](./package.json) - Dependencias

## 🐛 Troubleshooting

### Error: "Metro bundler crashed"
```bash
rm -rf node_modules .expo
npm install
npm start -- -c
```

### Error: "Permission denied" (macOS/Linux)
```bash
chmod +x node_modules/.bin/*
```

### Fotos no se capturan
- Verificar permisos en `app.json`
- Reinstalar app en dispositivo
- Limpiar caché: `npm start -- -c`

## 👥 Equipo

- **Backend**: Google Apps Script
- **Frontend**: React Native + Expo
- **Database**: Google Sheets + Drive

## 📄 Licencia

Propiedad de DISMAC. Uso restringido.

## 📞 Soporte

Contactar al equipo de desarrollo de DISMAC.

---

**Última actualización**: Septiembre 2026
**Versión**: 1.0.0
