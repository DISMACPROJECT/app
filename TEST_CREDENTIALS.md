# Credenciales de Prueba - DCONTROL

## 🔐 Usuarios para Testing

### 1️⃣ Admin (Acceso Total)
```
Email:    dismac@dismac.com.ec
Password: 1234
Rol:      ADMIN
Estado:   ✅ Activo
```
**Uso**: Testing de todas las funciones del sistema

---

### 2️⃣ Mercaderista (Ventas)
```
Email:    ventas@dismac.com.ec
Password: 1234
Rol:      MERCADERISTAS
Estado:   ✅ Activo
```
**Uso**: Testing de ejecución de tareas

---

### 3️⃣ Biométrico (Sistema Biométrico)
```
Email:    biometrico@dismac.com.ec
Password: 1234
Rol:      BIOMETRICO
Estado:   ✅ Activo
```
**Uso**: Testing de marcajes biométricos

---

### 4️⃣ Planta
```
Email:    planta@dismac.com.ec
Password: 1234
Rol:      PLANTA
Estado:   ✅ Activo
```
**Uso**: Testing de marcajes en planta

---

## 🧪 Flujo de Testing Recomendado

### Paso 1: Login como Admin
```
1. Abrir app
2. Email: dismac@dismac.com.ec
3. Password: 1234
4. Presionar "Iniciar Sesión"
5. ✅ Debe entrar al home con acceso total
```

### Paso 2: Validar Home Dashboard (Admin)
```
- Debe ver:
  ✅ Resumen completo
  ✅ Todas las secciones activas
  ✅ Acceso a configuración
  ✅ Botón de cerrar sesión
```

### Paso 3: Logout y Login como Mercaderista
```
1. Presionar Perfil
2. Cerrar Sesión
3. Email: ventas@dismac.com.ec
4. Password: 1234
5. ✅ Debe entrar con acceso limitado
```

### Paso 4: Validar Home Dashboard (Mercaderista)
```
- Debe ver:
  ✅ Solo mis tareas
  ✅ Opción de ejecutar tareas
  ✅ NO ver opciones de admin
  ✅ NO ver crear tareas
```

### Paso 5: Testing Biométrico
```
1. Logout de Mercaderista
2. Email: biometrico@dismac.com.ec
3. Password: 1234
4. ✅ Debe entrar
5. En pantalla de Marcajes:
   ✅ Poder marcar entrada
   ✅ Poder marcar salida
   ✅ Ver historial personal
```

---

## 📝 Datos de Ejemplo para Crear

Para testing más realista, crear estos datos en el backend:

### Usuarios
```json
[
  {
    "id": "user-admin",
    "email": "dismac@dismac.com.ec",
    "name": "Admin DISMAC",
    "role": "ADMIN",
    "department": "Corporativo",
    "phone": "+593999999999"
  },
  {
    "id": "user-vendedor",
    "email": "ventas@dismac.com.ec",
    "name": "Vendedor Zona 1",
    "role": "MERCADERISTAS",
    "department": "Zona 1",
    "phone": "+593999999998"
  },
  {
    "id": "user-biometrico",
    "email": "biometrico@dismac.com.ec",
    "name": "Operador Biométrico",
    "role": "BIOMETRICO",
    "department": "Planta",
    "phone": "+593999999997"
  }
]
```

### Tareas de Ejemplo
```json
[
  {
    "id": "task-001",
    "title": "Reposición Zona 1",
    "description": "Reponer productos en puntos de venta Zona 1",
    "assignedTo": "user-vendedor",
    "createdBy": "user-admin",
    "status": "PENDING",
    "priority": "HIGH",
    "dueDate": "2024-01-31T17:00:00Z",
    "notes": "Urgente antes de fin de mes"
  },
  {
    "id": "task-002",
    "title": "Verificación Zona 2",
    "description": "Verificar stock en Zona 2",
    "assignedTo": "user-vendedor",
    "createdBy": "user-admin",
    "status": "PENDING",
    "priority": "MEDIUM",
    "dueDate": "2024-02-05T17:00:00Z"
  }
]
```

### Marcajes de Ejemplo
```json
[
  {
    "id": "attendance-001",
    "userId": "user-biometrico",
    "type": "IN",
    "timestamp": "2024-01-26T08:00:00Z",
    "location": {
      "latitude": -0.2298,
      "longitude": -78.5248,
      "accuracy": 10
    },
    "verifiedByBiometric": true
  },
  {
    "id": "attendance-002",
    "userId": "user-biometrico",
    "type": "OUT",
    "timestamp": "2024-01-26T17:30:00Z",
    "location": {
      "latitude": -0.2298,
      "longitude": -78.5248,
      "accuracy": 10
    },
    "verifiedByBiometric": true
  }
]
```

---

## 🐛 Troubleshooting de Login

### Problema: "Las credenciales no son válidas"
- Verificar que el usuario existe en la base de datos
- Verificar password en el backend
- Usar Postman: `POST https://... /auth/login`

### Problema: "Token inválido"
- Limpiar app y reinstalar
- Borrar securestore: Settings → Apps → DCONTROL → Storage → Clear

### Problema: "No tienes permisos"
- Verificar rol del usuario en base de datos
- Verificar que el JWT incluye el rol correcto
- Ver logs del backend

---

## ✅ Checklist de Testing

- [ ] Login como admin funciona
- [ ] Login como vendedor funciona
- [ ] Login como biométrico funciona
- [ ] Dashboard muestra diferente según rol
- [ ] Admin ve todas las opciones
- [ ] Vendedor solo ve tareas asignadas
- [ ] Biométrico solo ve marcajes
- [ ] Logout funciona correctamente
- [ ] Token se almacena en SecureStore
- [ ] Refresh token funciona automático

---

## 🔄 Ciclo de Desarrollo

```
1. Setup backend en Google Apps Script
   ↓
2. Usar credenciales de prueba en API tests
   ↓
3. Integrar en app móvil
   ↓
4. Testing funcional completo
   ↓
5. Ir a producción con usuarios reales
```

---

**Última actualización**: Septiembre 2026
