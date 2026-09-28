# DCONTROL Mobile App - Arquitectura

## Descripción General

DCONTROL es una aplicación React Native + Expo que se conecta a un backend en Google Apps Script. La app proporciona funcionalidades de control de personal operativo con marcajes biométricos, gestión de tareas, y reportes.

## Stack Tecnológico

- **Framework**: React Native + Expo
- **Lenguaje**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navegación**: React Navigation
- **API Client**: Axios
- **Storage Local**: AsyncStorage + Secure Store + SQLite
- **Autenticación**: JWT (Access Token + Refresh Token)
- **Sensores**: Camera, Location, Biometric

## Estructura de Carpetas

```
src/
├── App.tsx                    # Punto de entrada principal
├── index.ts                   # Exportador del app
│
├── navigation/                # Navegación
│   ├── RootNavigator.tsx      # Navegador principal
│   ├── AuthNavigator.tsx      # Stack de autenticación
│   ├── MainNavigator.tsx      # Tabs principales
│   └── types.ts               # Tipos de rutas
│
├── screens/                   # Pantallas de la app
│   ├── auth/
│   ├── home/
│   ├── attendance/
│   ├── tasks/
│   ├── reports/
│   └── profile/
│
├── components/                # Componentes reutilizables
│   ├── common/
│   ├── biometric/
│   ├── camera/
│   └── ...
│
├── services/                  # Servicios (API, Storage, etc)
│   ├── api/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── authService.ts
│   └── storage/
│       ├── secureStorage.ts
│       └── asyncStorage.ts
│
├── store/                     # Redux store
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── attendanceSlice.ts
│       ├── taskSlice.ts
│       └── uiSlice.ts
│
├── hooks/                     # Custom hooks
│
├── utils/                     # Utilidades
│   ├── constants.ts
│   ├── logger.ts
│   ├── errorHandling.ts
│   ├── validation.ts
│   ├── formatting.ts
│   └── env.ts
│
├── types/                     # TypeScript types
│   ├── common.ts
│   ├── user.ts
│   ├── attendance.ts
│   ├── task.ts
│   ├── api.ts
│   └── models.ts
│
├── theme/                     # Temas visuales
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
│
└── config/                    # Configuración
    └── storage.config.ts
```

## Flujos Principales

### 1. Autenticación

```
LoginScreen 
  → validateForm()
  → authService.login()
  → Guardar tokens en SecureStore
  → Actualizar Redux
  → Navegar a MainNavigator
```

### 2. Marcajes

```
AttendanceScreen
  → Solicitar permisos (GPS, Biometric)
  → Capturar ubicación GPS
  → Verificar biometría
  → authService.markAttendance()
  → Actualizar estado local
  → Sincronizar si está offline
```

### 3. Tareas

```
TaskListScreen
  → Obtener lista de tareas del API
  → Mostrar en lista
  → TaskDetailScreen (ver detalle)
  → TaskFormScreen (editar/crear)
    → Capturar fotos
    → Capturar ubicación
    → Guardar cambios
    → Sincronizar si está offline
```

## Manejo de Estado

### Redux Slices

#### authSlice
- `user`: Usuario autenticado
- `accessToken`: Token JWT actual
- `refreshToken`: Token para renovar acceso
- `isAuthenticated`: Estado de autenticación
- `isLoading`: Estado de carga

#### attendanceSlice
- `records`: Historial de marcajes
- `dailyAttendance`: Marcajes del día
- `todayStatus`: Estado de asistencia hoy
- `isSyncing`: Estado de sincronización

#### taskSlice
- `tasks`: Lista de tareas
- `selectedTask`: Tarea seleccionada
- `filters`: Filtros aplicados
- `stats`: Estadísticas de tareas
- `isSyncing`: Estado de sincronización

#### uiSlice
- `isOnline`: Estado de conexión
- `notifications`: Notificaciones activas
- `syncInProgress`: Sincronización en curso

## Autenticación y Tokens

### Flujo de JWT

1. **Login**: Email + Password → Access Token + Refresh Token
2. **Uso**: Cada request incluye `Authorization: Bearer {accessToken}`
3. **Refresh**: Si token expira (401), llamar refresh token endpoint
4. **Nuevo Token**: Guardar en SecureStore y reintentar request original

### Interceptores de Axios

```typescript
// Request: Agregar Bearer token
// Response: Manejar 401 y refrescar token automáticamente
```

## Sincronización Offline

### Queue Manager

Cuando está offline:
1. Guardar acción en cola de sincronización
2. Actualizar estado local (optimistic update)
3. Mostrar badge "Pendiente de sincronizar"

Cuando vuelve online:
1. Procesar queue FIFO
2. Enviar cambios al servidor
3. Resolver conflictos si es necesario
4. Actualizar estado local

## Almacenamiento Local

### SecureStore
- Access Token
- Refresh Token
- Datos sensibles

### AsyncStorage
- Redux state (persistido)
- Configuración de app
- Datos de usuario

### SQLite
- Caché de datos principales
- Cola de sincronización
- Historial offline

## Configuración de Desarrollo

### Variables de Entorno

```bash
# .env.local
EXPO_PUBLIC_API_BASE_URL=https://script.google.com/macros/d/{ID}/usercoderun
EXPO_PUBLIC_ENABLE_BIOMETRIC=true
EXPO_PUBLIC_ENABLE_GPS=true
```

### Scripts

```bash
npm start          # Iniciar dev server
npm run android    # Correr en Android
npm run ios        # Correr en iOS
npm run web        # Correr en web
npm test           # Ejecutar tests
npm run lint       # Lint de código
npm run type-check # Verificar tipos TypeScript
```

## Consideraciones de Seguridad

1. **Tokens**: Siempre usar SecureStore, nunca AsyncStorage
2. **HTTPS**: Todas las solicitudes deben ser HTTPS
3. **Certificado Pinning**: Implementar para mayor seguridad
4. **Validación**: Validar en cliente y servidor
5. **Permisos**: Solicitar en tiempo de uso (runtime)

## Performance

1. **Lazy Loading**: Cargar componentes bajo demanda
2. **Memoization**: Usar React.memo, useMemo
3. **Code Splitting**: Navegar por stack navigator
4. **Image Optimization**: Comprimir fotos automáticamente
5. **Caching**: Cachear respuestas de API

## Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Flujos principales
- **E2E Tests**: Detox (opcional)

## Próximos Pasos

1. Instalar dependencias: `npm install`
2. Configurar .env con URL del API
3. Iniciar dev server: `npm start`
4. Conectar con backend Google Apps Script
5. Implementar servicios de tareas y reportes
6. Agregar componentes de cámara y ubicación
