# API Integration Guide - DCONTROL Backend (Google Apps Script)

## Base URL
```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun
```

## Response Format (Standard)

Todas las respuestas deben seguir este formato:

```json
{
  "status": "success|error",
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje legible",
    "details": {}
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 1. AUTENTICACIÓN

### POST /auth/login
**Descripción**: Autenticar usuario con email y contraseña

**Request**:
```json
{
  "email": "usuario@dismac.com.ec",
  "password": "password123"
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-123",
      "email": "usuario@dismac.com.ec",
      "name": "John Doe",
      "role": "MERCADERISTAS",
      "department": "Zona 1",
      "phone": "+593999999999",
      "avatar": "https://drive.google.com/uc?export=view&id=XXX",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response (Error)**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Las credenciales no son válidas"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Errores posibles**:
- `INVALID_CREDENTIALS`: Email o password incorrecto
- `USER_NOT_FOUND`: Usuario no existe
- `ACCOUNT_LOCKED`: Cuenta bloqueada

---

### POST /auth/refresh-token
**Descripción**: Renovar access token usando refresh token

**Request**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Errores posibles**:
- `TOKEN_EXPIRED`: Refresh token expirado
- `INVALID_TOKEN`: Token inválido

---

### POST /auth/logout
**Descripción**: Cerrar sesión (invalidar refresh token)

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "success": true
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 2. USUARIO

### GET /user/profile
**Descripción**: Obtener perfil del usuario autenticado

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-123",
    "email": "usuario@dismac.com.ec",
    "name": "John Doe",
    "role": "MERCADERISTAS",
    "department": "Zona 1",
    "phone": "+593999999999",
    "avatar": "https://drive.google.com/uc?export=view&id=XXX",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### PUT /user/profile
**Descripción**: Actualizar perfil del usuario

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "name": "Jane Doe",
  "phone": "+593999999998",
  "avatar": "base64_image_or_drive_url"
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "id": "user-123",
    "email": "usuario@dismac.com.ec",
    "name": "Jane Doe",
    "role": "MERCADERISTAS",
    "department": "Zona 1",
    "phone": "+593999999998",
    "avatar": "https://drive.google.com/uc?export=view&id=XXX",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### POST /user/change-password
**Descripción**: Cambiar contraseña

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "success": true
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Errores posibles**:
- `INVALID_PASSWORD`: Contraseña anterior incorrecta
- `PASSWORD_TOO_WEAK`: Nueva contraseña no cumple requisitos

---

## 3. MARCAJES (ATTENDANCE)

### POST /attendance/mark
**Descripción**: Registrar un marcaje (entrada, salida, comedor)

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "type": "IN|OUT|LUNCH_IN|LUNCH_OUT",
  "location": {
    "latitude": -0.2298,
    "longitude": -78.5248,
    "accuracy": 10,
    "altitude": 2850,
    "heading": 45,
    "speed": 0,
    "timestamp": 1704110400000
  },
  "photo": "base64_image_or_null",
  "notes": "Nota opcional",
  "verifiedByBiometric": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "id": "attendance-123",
    "userId": "user-123",
    "type": "IN",
    "timestamp": "2024-01-01T12:00:00Z",
    "location": {
      "latitude": -0.2298,
      "longitude": -78.5248,
      "accuracy": 10,
      "timestamp": 1704110400000
    },
    "photo": "https://drive.google.com/uc?export=view&id=XXX",
    "verifiedByBiometric": true,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### GET /attendance/today
**Descripción**: Obtener marcajes de hoy

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "date": "2024-01-01",
    "userId": "user-123",
    "checkIn": {
      "id": "attendance-123",
      "userId": "user-123",
      "type": "IN",
      "timestamp": "2024-01-01T08:00:00Z",
      "location": {...},
      "verifiedByBiometric": true,
      "createdAt": "2024-01-01T08:00:00Z"
    },
    "checkOut": null,
    "lunchIn": null,
    "lunchOut": null,
    "workHours": 4.5,
    "lunchDuration": 0,
    "status": "COMPLETED",
    "notes": "Nota"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### GET /attendance/history
**Descripción**: Obtener historial de marcajes

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `startDate`: "2024-01-01" (opcional)
- `endDate`: "2024-01-31" (opcional)
- `limit`: 50 (por defecto)
- `offset`: 0 (por defecto)

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "attendance-123",
        "userId": "user-123",
        "type": "IN",
        "timestamp": "2024-01-01T08:00:00Z",
        "location": {...},
        "verifiedByBiometric": true,
        "createdAt": "2024-01-01T08:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 50,
    "totalPages": 3
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 4. TAREAS (TASKS)

### GET /tasks
**Descripción**: Obtener lista de tareas

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `status`: "PENDING,IN_PROGRESS,COMPLETED,CANCELLED" (opcional)
- `priority`: "LOW,MEDIUM,HIGH,URGENT" (opcional)
- `assignedTo`: "user-123" (opcional)
- `createdBy`: "user-456" (opcional)
- `dateRange`: "2024-01-01,2024-01-31" (opcional)
- `search`: "búsqueda" (opcional)
- `limit`: 20 (por defecto)
- `offset`: 0 (por defecto)

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "task-123",
        "title": "Reposición Zona 1",
        "description": "Reponer productos en la Zona 1",
        "assignedTo": "user-123",
        "createdBy": "user-456",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "dueDate": "2024-01-05T17:00:00Z",
        "location": {
          "latitude": -0.2298,
          "longitude": -78.5248,
          "accuracy": 10,
          "timestamp": 1704110400000
        },
        "photos": [
          {
            "id": "photo-123",
            "uri": "https://drive.google.com/uc?export=view&id=XXX",
            "width": 1920,
            "height": 1080,
            "timestamp": 1704110400000,
            "size": 524288,
            "mimeType": "image/jpeg"
          }
        ],
        "notes": "Nota",
        "completedAt": null,
        "createdAt": "2024-01-01T08:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### GET /tasks/{id}
**Descripción**: Obtener detalle de una tarea

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Response**: Mismo formato que task anterior

---

### POST /tasks
**Descripción**: Crear nueva tarea

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "title": "Reposición Zona 2",
  "description": "Reponer productos en la Zona 2",
  "priority": "HIGH",
  "dueDate": "2024-01-05T17:00:00Z",
  "location": {
    "latitude": -0.2298,
    "longitude": -78.5248,
    "accuracy": 10,
    "timestamp": 1704110400000
  },
  "notes": "Nota"
}
```

**Response (Success)**: Task creada con ID

---

### PUT /tasks/{id}
**Descripción**: Actualizar tarea

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "status": "IN_PROGRESS",
  "notes": "Actualizando",
  "location": {...},
  "completedAt": null
}
```

**Response (Success)**: Task actualizada

---

### POST /tasks/{id}/photos
**Descripción**: Subir fotos a una tarea (multipart)

**Headers**: 
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Form Data**:
- `photo`: Archivo binario
- `location`: JSON con coordenadas (opcional)
- `notes`: Notas de la foto (opcional)

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "photoId": "photo-123",
    "url": "https://drive.google.com/uc?export=view&id=XXX",
    "thumbnailUrl": "https://drive.google.com/uc?export=view&id=YYY"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### POST /tasks/{id}/complete
**Descripción**: Marcar tarea como completada

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "notes": "Tarea completada exitosamente",
  "location": {
    "latitude": -0.2298,
    "longitude": -78.5248,
    "accuracy": 10,
    "timestamp": 1704110400000
  },
  "completedAt": "2024-01-01T17:30:00Z"
}
```

**Response (Success)**: Task con status COMPLETED

---

## 5. REPORTES (REPORTS)

### GET /reports
**Descripción**: Obtener lista de reportes

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `limit`: 20
- `offset`: 0

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "report-123",
        "title": "Reporte de Asistencia Enero 2024",
        "type": "ATTENDANCE",
        "generatedBy": "user-456",
        "dateRange": {
          "startDate": "2024-01-01",
          "endDate": "2024-01-31"
        },
        "fileUrl": "https://drive.google.com/uc?export=view&id=XXX",
        "createdAt": "2024-02-01T10:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### POST /reports/generate
**Descripción**: Generar nuevo reporte

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "type": "ATTENDANCE|TASKS|PRODUCTIVITY",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "filters": {
    "department": "Zona 1",
    "role": "MERCADERISTAS"
  }
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "reportId": "report-123",
    "url": "https://drive.google.com/uc?export=view&id=XXX",
    "generatedAt": "2024-02-01T10:00:00Z"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 6. SINCRONIZACIÓN (SYNC) - Offline-First

### POST /sync/push
**Descripción**: Sincronizar cambios offline al servidor

**Headers**: 
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "changes": [
    {
      "type": "CREATE|UPDATE|DELETE",
      "entity": "attendance|task",
      "entityId": "id-123",
      "payload": {...},
      "timestamp": 1704110400000
    }
  ]
}
```

**Response (Success)**:
```json
{
  "status": "success",
  "data": {
    "synced": 3,
    "failed": 0,
    "conflicts": 0,
    "errors": []
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Errores Comunes

### 400 Bad Request
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campos requeridos faltantes",
    "details": {
      "field": "email",
      "error": "Email inválido"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para esta acción"
  }
}
```

### 409 Conflict (Sincronización)
```json
{
  "status": "error",
  "error": {
    "code": "CONFLICT_DETECTED",
    "message": "El servidor tiene una versión más nueva",
    "details": {
      "serverVersion": {...},
      "clientVersion": {...}
    }
  }
}
```

---

## Notas de Implementación

1. **JWT Token**: Access token válido por 1 hora, refresh token por 30 días
2. **Timestamps**: Usar ISO 8601 format (yyyy-MM-ddTHH:mm:ssZ)
3. **Google Drive**: Almacenar fotos en carpeta del proyecto, devolver URLs
4. **Compresión**: Fotos se comprimen en cliente antes de enviar
5. **Offline Sync**: La app cola cambios cuando está offline, sincroniza cuando vuelve online
6. **Permisos**: Validar role del usuario en cada endpoint
7. **Rate Limiting**: Implementar si es necesario
8. **Logging**: Registrar todas las operaciones para auditoría
