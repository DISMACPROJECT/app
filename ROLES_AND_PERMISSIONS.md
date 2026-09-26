# Roles y Permisos - DCONTROL

## 📋 Estructura de Roles

| Rol | Acceso | Permisos |
|-----|--------|----------|
| **ADMIN** | Total | Todos los permisos del sistema |
| **ASIGNADORES** | Asignar | Asignar tareas a otros usuarios |
| **MERCADERISTAS** | Ejecución | Ejecutar tareas de mercadeo |
| **ADMINISTRATIVO** | Lectura | Solo lectura de datos |
| **PLANTA** | Biométrico | Marcar entrada/salida biométrica |
| **RUTA** | Despacho | Tareas de despacho/distribución |
| **OBRA** | Obra | Auto-asignar visitas a obra |

---

## 🔐 Matriz de Permisos Detallada

### ADMIN
```
✅ Crear usuarios
✅ Modificar roles
✅ Ver todos los datos
✅ Generar reportes
✅ Configurar sistema
✅ Eliminar datos
✅ Auditoría completa
```

### ASIGNADORES
```
✅ Asignar tareas a mercaderistas
✅ Ver listado de mercaderistas
✅ Ver tareas asignadas
❌ Ejecutar tareas (solo leer)
❌ Modificar usuarios
❌ Ver reportes sensibles
```

### MERCADERISTAS
```
✅ Ver tareas asignadas
✅ Ejecutar tareas (fotos, ubicación, notas)
✅ Ver historial personal
✅ Marcar tareas completadas
❌ Asignar tareas
❌ Ver tareas de otros
❌ Crear usuarios
```

### ADMINISTRATIVO
```
✅ Ver marcajes biométricos
✅ Ver tareas completadas
✅ Generar reportes
✅ Ver datos de usuarios
❌ Crear/eliminar registros
❌ Modificar datos históricos
❌ Acceso a configuración
```

### PLANTA
```
✅ Marcar entrada biométrica
✅ Marcar salida biométrica
✅ Ver su propio historial de marcajes
❌ Ver marcajes de otros
❌ Crear tareas
❌ Ejecutar tareas
```

### RUTA
```
✅ Ver tareas de despacho asignadas
✅ Ejecutar tareas de despacho (fotos, ubicación)
✅ Marcar como completadas
✅ Ver ruta en tiempo real
❌ Asignar tareas
❌ Ver tareas de otras áreas
```

### OBRA
```
✅ Ver visitas a obra
✅ Auto-asignar visitas
✅ Marcar como completadas
✅ Tomar fotos de obra
✅ Registrar ubicación
❌ Asignar visitas a otros
❌ Modificar visitas asignadas a otros
```

---

## 🔑 Credenciales de Prueba

### Admin
```
Email: dismac@dismac.com.ec
Contraseña: 1234
Rol: ADMIN
Permisos: TODOS
```

### Mercaderista (Ventas)
```
Email: ventas@dismac.com.ec
Contraseña: 1234
Rol: MERCADERISTAS
Permisos: Ejecutar tareas de mercadeo
```

### Biométrico
```
Email: biometrico@dismac.com.ec
Contraseña: 1234
Rol: BIOMETRICO
Permisos: Marcar entrada/salida
```

### Planta
```
Email: planta@dismac.com.ec
Contraseña: (por definir)
Rol: PLANTA
Permisos: Marcar entrada/salida en planta
```

---

## 📱 Acceso por Pantalla

### Home Dashboard
- **ADMIN**: Resumen completo del sistema
- **ASIGNADORES**: Tareas asignadas, mercaderistas
- **MERCADERISTAS**: Mis tareas, historial
- **ADMINISTRATIVO**: Estadísticas, reportes
- **PLANTA**: Estado biométrico personal
- **RUTA**: Rutas de despacho
- **OBRA**: Visitas asignadas

### Pantalla de Marcajes
- **ADMIN**: Ver todos los marcajes
- **ADMINISTRATIVO**: Ver todos los marcajes
- **PLANTA**: Marcar entrada/salida personal
- **Otros**: No acceso

### Pantalla de Tareas
- **ADMIN**: Todas las tareas, todas las acciones
- **ASIGNADORES**: Crear/asignar tareas
- **MERCADERISTAS**: Solo tareas asignadas
- **RUTA**: Solo tareas de despacho
- **OBRA**: Solo visitas a obra
- **ADMINISTRATIVO**: Ver solo (lectura)
- **PLANTA**: Sin acceso

### Pantalla de Reportes
- **ADMIN**: Todos los reportes
- **ADMINISTRATIVO**: Reportes generales
- **ASIGNADORES**: Reportes de tareas asignadas
- **Otros**: Sin acceso

---

## 🔄 Flujos por Rol

### ASIGNADOR → MERCADERISTA
```
1. Asignador crea tarea
   ↓
2. Sistema asigna a Mercaderista
   ↓
3. Mercaderista ve tarea en su lista
   ↓
4. Mercaderista ejecuta (fotos, ubicación)
   ↓
5. Mercaderista marca como completada
   ↓
6. Asignador ve completada en reportes
```

### PLANTA (Biométrico)
```
1. Trabajador llega a planta
   ↓
2. Abre app DCONTROL
   ↓
3. Selecciona "Entrada"
   ↓
4. Verifica biométrica (huella)
   ↓
5. Registra entrada con GPS
   ↓
6. Confirma
   ↓
7. ADMINISTRATIVO ve en reportes
```

### OBRA (Auto-asignación)
```
1. Usuario ve visitas disponibles a obra
   ↓
2. Selecciona una
   ↓
3. Sistema la auto-asigna
   ↓
4. Usuario ejecuta (fotos, ubicación, notas)
   ↓
5. Marca como completada
```

---

## 🛡️ Control de Acceso en Backend

Cada endpoint debe validar el rol:

```javascript
// Ejemplo en Google Apps Script

function checkPermission(userRole, requiredRole) {
  const PERMISSIONS = {
    'ADMIN': ['ALL'],
    'ASIGNADORES': ['assign_tasks', 'view_mercaderistas'],
    'MERCADERISTAS': ['execute_tasks', 'view_own_tasks'],
    'ADMINISTRATIVO': ['view_all_data', 'view_reports'],
    'PLANTA': ['mark_biometric', 'view_own_history'],
    'RUTA': ['execute_dispatch', 'view_route'],
    'OBRA': ['auto_assign_visits', 'execute_visits'],
  };

  const userPerms = PERMISSIONS[userRole] || [];
  
  if (userPerms.includes('ALL')) return true;
  return userPerms.includes(requiredRole);
}

// Usar en endpoints
function doPost(e) {
  const user = getUser(token);
  
  if (!checkPermission(user.role, 'assign_tasks')) {
    return errorResponse('FORBIDDEN', 'No tienes permisos');
  }
  
  // Proceder con la acción
}
```

---

## 📊 Testeo por Rol

Para testing, usa estas credenciales en orden:

1. **Admin** (dismac@dismac.com.ec / 1234)
   - Verifica acceso total
   - Verifica dashboard completo

2. **Mercaderista** (ventas@dismac.com.ec / 1234)
   - Verifica acceso solo a tareas asignadas
   - Verifica ejecución de tareas

3. **Biométrico** (biometrico@dismac.com.ec / 1234)
   - Verifica marcajes entrada/salida
   - Verifica historial personal

4. **Planta** (planta@dismac.com.ec)
   - Verifica acceso limitado a biométrico
   - Verifica sin acceso a otras pantallas

---

## ⚙️ Implementación en Código

En `src/store/slices/authSlice.ts`:

```typescript
// El JWT retornado del backend debe incluir:
{
  "sub": "user-123",
  "email": "ventas@dismac.com.ec",
  "name": "John Doe",
  "role": "MERCADERISTAS",  // Uno de los 7 roles
  "department": "Zona 1",
  "iat": 1704110400,
  "exp": 1704114000
}
```

En componentes:

```typescript
// Verificar rol
import { useUser } from '@store/hooks';

const MyComponent = () => {
  const user = useUser();
  
  // Solo mostrar si es admin o asignador
  if (['ADMIN', 'ASIGNADORES'].includes(user?.role)) {
    return <AssignTaskForm />;
  }
  
  return <TaskView />;
};
```

---

## 📝 Notas de Seguridad

1. **Validar siempre en backend**
   - El cliente solo muestra/oculta UI
   - Backend debe validar cada acción

2. **No confiar en tokens modificados**
   - Verificar firma JWT en backend
   - Validar fecha de expiración

3. **Audit logging**
   - Registrar cada acción por rol
   - Especialmente ADMIN

4. **Rate limiting**
   - Aplicar por rol
   - PLANTA: Marcajes limitados (1 por hora)
   - ASIGNADORES: Tareas (límite razonable)

---

**Última actualización**: Septiembre 2026
