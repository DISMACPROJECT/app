/**
 * DCONTROL Backend - Google Apps Script
 *
 * Endpoints disponibles:
 * POST /auth/login
 * POST /auth/refresh-token
 * GET /user/profile
 * POST /attendance/mark
 * GET /attendance/history
 * POST /tasks
 * GET /tasks
 * GET /tasks/:id
 * PUT /tasks/:id
 * DELETE /tasks/:id
 * POST /tasks/:id/photos
 * GET /reports
 */

const JWT_SECRET = "tu_clave_super_secreta_cambiar_en_produccion";
const SPREADSHEET_ID = "REEMPLAZA_CON_TU_GOOGLE_SHEET_ID";

// ============================================================================
// CONFIGURACIÓN INICIAL - EJECUTAR UNA SOLA VEZ
// ============================================================================

function setupDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Crear hojas si no existen
  const sheets = ["users", "attendance", "tasks", "photos"];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });

  // Inicializar hoja de usuarios
  const usersSheet = ss.getSheetByName("users");
  if (usersSheet.getLastRow() === 0) {
    usersSheet.appendRow([
      "id", "email", "password", "name", "role", "department", "phone", "createdAt"
    ]);

    // Agregar usuarios de prueba (usar bcrypt en producción)
    usersSheet.appendRow([
      "user-admin", "dismac@dismac.com.ec", "1234", "Admin DISMAC", "ADMIN", "Corporativo", "+593999999999", new Date()
    ]);
    usersSheet.appendRow([
      "user-vendedor", "ventas@dismac.com.ec", "1234", "Vendedor Zona 1", "MERCADERISTAS", "Zona 1", "+593999999998", new Date()
    ]);
    usersSheet.appendRow([
      "user-biometrico", "biometrico@dismac.com.ec", "1234", "Operador Biométrico", "BIOMETRICO", "Planta", "+593999999997", new Date()
    ]);
    usersSheet.appendRow([
      "user-planta", "planta@dismac.com.ec", "1234", "Operador Planta", "PLANTA", "Planta", "+593999999996", new Date()
    ]);
  }

  // Inicializar hoja de asistencia
  const attendanceSheet = ss.getSheetByName("attendance");
  if (attendanceSheet.getLastRow() === 0) {
    attendanceSheet.appendRow([
      "id", "userId", "type", "timestamp", "latitude", "longitude", "accuracy", "verified"
    ]);
  }

  // Inicializar hoja de tareas
  const tasksSheet = ss.getSheetByName("tasks");
  if (tasksSheet.getLastRow() === 0) {
    tasksSheet.appendRow([
      "id", "title", "description", "assignedTo", "createdBy", "status", "priority", "dueDate", "notes", "createdAt", "updatedAt"
    ]);
  }

  // Inicializar hoja de fotos
  const photosSheet = ss.getSheetByName("photos");
  if (photosSheet.getLastRow() === 0) {
    photosSheet.appendRow([
      "id", "taskId", "userId", "driveFileId", "fileName", "uploadedAt"
    ]);
  }

  Logger.log("Database setup completado");
}

// ============================================================================
// JWT - MANEJO DE TOKENS
// ============================================================================

function createJWT(userId, email, role) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 3600; // 1 hora

  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    user_id: userId,
    email: email,
    role: role,
    iat: now,
    exp: now + expiresIn
  };

  const headerEncoded = Utilities.base64Encode(JSON.stringify(header))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const payloadEncoded = Utilities.base64Encode(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const message = headerEncoded + "." + payloadEncoded;
  const signature = Utilities.base64Encode(
    Utilities.computeHmacSha256Signature(message, JWT_SECRET)
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return message + "." + signature;
}

function verifyJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const headerEncoded = parts[0];
    const payloadEncoded = parts[1];
    const signatureEncoded = parts[2];

    const message = headerEncoded + "." + payloadEncoded;
    const signature = Utilities.base64Encode(
      Utilities.computeHmacSha256Signature(message, JWT_SECRET)
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== signatureEncoded) return null;

    const payloadString = Utilities.newBlob(
      Utilities.base64Decode(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'))
    ).getDataAsString();

    const payload = JSON.parse(payloadString);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) return null;

    return payload;
  } catch (e) {
    return null;
  }
}

// ============================================================================
// FUNCIONES DE DATOS
// ============================================================================

function getUserByEmail(email) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      return {
        id: data[i][0],
        email: data[i][1],
        password: data[i][2],
        name: data[i][3],
        role: data[i][4],
        department: data[i][5],
        phone: data[i][6]
      };
    }
  }
  return null;
}

function getUserById(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return {
        id: data[i][0],
        email: data[i][1],
        name: data[i][3],
        role: data[i][4],
        department: data[i][5],
        phone: data[i][6]
      };
    }
  }
  return null;
}

function saveAttendance(userId, type, latitude, longitude, accuracy) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("attendance");

  const id = "att-" + Date.now();
  sheet.appendRow([
    id,
    userId,
    type,
    new Date().toISOString(),
    latitude,
    longitude,
    accuracy,
    true
  ]);

  return { id, timestamp: new Date().toISOString() };
}

function getAttendanceHistory(userId, days = 30) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("attendance");
  const data = sheet.getDataRange().getValues();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const results = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId) {
      const date = new Date(data[i][3]);
      if (date >= cutoffDate) {
        results.push({
          id: data[i][0],
          userId: data[i][1],
          type: data[i][2],
          timestamp: data[i][3],
          location: {
            latitude: data[i][4],
            longitude: data[i][5],
            accuracy: data[i][6]
          }
        });
      }
    }
  }

  return results;
}

function createTask(title, description, assignedTo, createdBy, status, priority, dueDate, notes) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("tasks");

  const id = "task-" + Date.now();
  const now = new Date();

  sheet.appendRow([
    id,
    title,
    description,
    assignedTo,
    createdBy,
    status || "PENDING",
    priority || "MEDIUM",
    dueDate || "",
    notes || "",
    now.toISOString(),
    now.toISOString()
  ]);

  return { id };
}

function getTasksByUser(userId, role) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("tasks");
  const data = sheet.getDataRange().getValues();

  const results = [];

  for (let i = 1; i < data.length; i++) {
    // Admin ve todas, otros solo ven asignadas
    if (role === "ADMIN" || data[i][3] === userId || data[i][4] === userId) {
      results.push({
        id: data[i][0],
        title: data[i][1],
        description: data[i][2],
        assignedTo: data[i][3],
        createdBy: data[i][4],
        status: data[i][5],
        priority: data[i][6],
        dueDate: data[i][7],
        notes: data[i][8],
        createdAt: data[i][9],
        updatedAt: data[i][10]
      });
    }
  }

  return results;
}

// ============================================================================
// HTTP HANDLERS - MAIN ENDPOINTS
// ============================================================================

function doPost(e) {
  const path = e.pathInfo;
  const params = JSON.parse(e.postData.contents);

  try {
    // AUTH ENDPOINTS
    if (path === "auth/login") {
      return handleLogin(params);
    }

    if (path === "auth/refresh-token") {
      return handleRefreshToken(params);
    }

    // PROTECTED ENDPOINTS - requieren token
    const auth = e.parameter.Authorization || e.postData.headers?.Authorization || "";
    const token = auth.replace("Bearer ", "");
    const payload = verifyJWT(token);

    if (!payload) {
      return jsonResponse({ error: "Token inválido o expirado" }, 401);
    }

    // ATTENDANCE ENDPOINTS
    if (path === "attendance/mark") {
      return handleMarkAttendance(params, payload);
    }

    // TASKS ENDPOINTS
    if (path === "tasks") {
      return handleCreateTask(params, payload);
    }

    if (path.match(/^tasks\/.*\/photos$/)) {
      return handleUploadPhoto(params, payload, e);
    }

    return jsonResponse({ error: "Endpoint no encontrado" }, 404);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doGet(e) {
  const path = e.pathInfo;
  const auth = e.parameter.Authorization || "";
  const token = auth.replace("Bearer ", "");
  const payload = verifyJWT(token);

  try {
    if (!payload) {
      return jsonResponse({ error: "Token inválido o expirado" }, 401);
    }

    // USER ENDPOINTS
    if (path === "user/profile") {
      return handleGetProfile(payload);
    }

    // ATTENDANCE ENDPOINTS
    if (path === "attendance/history") {
      return handleGetAttendanceHistory(payload, e.parameter.days || 30);
    }

    // TASKS ENDPOINTS
    if (path === "tasks") {
      return handleGetTasks(payload, e.parameter);
    }

    if (path.match(/^tasks\/[^\/]+$/)) {
      const id = path.split("/")[1];
      return handleGetTask(id, payload);
    }

    // REPORTS ENDPOINTS
    if (path === "reports") {
      return handleGetReports(payload, e.parameter);
    }

    return jsonResponse({ error: "Endpoint no encontrado" }, 404);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

// ============================================================================
// HANDLERS - IMPLEMENTACIÓN DE ENDPOINTS
// ============================================================================

function handleLogin(params) {
  const { email, password } = params;

  if (!email || !password) {
    return jsonResponse({ error: "Email y password requeridos" }, 400);
  }

  const user = getUserByEmail(email);

  if (!user) {
    return jsonResponse({ error: "Credenciales inválidas" }, 401);
  }

  // En producción usar bcrypt
  if (user.password !== password) {
    return jsonResponse({ error: "Credenciales inválidas" }, 401);
  }

  const accessToken = createJWT(user.id, user.email, user.role);
  const refreshToken = Utilities.getUuid();

  return jsonResponse({
    success: true,
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      phone: user.phone
    }
  });
}

function handleRefreshToken(params) {
  const { refreshToken } = params;

  if (!refreshToken) {
    return jsonResponse({ error: "Refresh token requerido" }, 400);
  }

  // En producción: validar refresh token contra base de datos
  // Por ahora aceptar cualquier refresh token válido
  const newAccessToken = createJWT("user-id", "email@example.com", "ADMIN");

  return jsonResponse({
    success: true,
    accessToken: newAccessToken
  });
}

function handleGetProfile(payload) {
  const user = getUserById(payload.user_id);

  if (!user) {
    return jsonResponse({ error: "Usuario no encontrado" }, 404);
  }

  return jsonResponse({
    success: true,
    user: user
  });
}

function handleMarkAttendance(params, payload) {
  const { type, latitude, longitude, accuracy } = params;

  if (!type || !latitude || !longitude) {
    return jsonResponse({ error: "Parámetros requeridos: type, latitude, longitude" }, 400);
  }

  const result = saveAttendance(payload.user_id, type, latitude, longitude, accuracy || 0);

  return jsonResponse({
    success: true,
    attendance: result
  });
}

function handleGetAttendanceHistory(payload, days) {
  const history = getAttendanceHistory(payload.user_id, parseInt(days));

  return jsonResponse({
    success: true,
    attendance: history,
    total: history.length
  });
}

function handleCreateTask(params, payload) {
  // Solo admin y asignadores pueden crear
  if (payload.role !== "ADMIN" && payload.role !== "ASIGNADORES") {
    return jsonResponse({ error: "No tienes permiso para crear tareas" }, 403);
  }

  const { title, description, assignedTo, status, priority, dueDate, notes } = params;

  if (!title || !assignedTo) {
    return jsonResponse({ error: "Parámetros requeridos: title, assignedTo" }, 400);
  }

  const result = createTask(title, description || "", assignedTo, payload.user_id, status, priority, dueDate, notes);

  return jsonResponse({
    success: true,
    task: result
  });
}

function handleGetTasks(payload, params) {
  const tasks = getTasksByUser(payload.user_id, payload.role);

  return jsonResponse({
    success: true,
    tasks: tasks,
    total: tasks.length,
    pagination: {
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 10
    }
  });
}

function handleGetTask(id, payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("tasks");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return jsonResponse({
        success: true,
        task: {
          id: data[i][0],
          title: data[i][1],
          description: data[i][2],
          assignedTo: data[i][3],
          createdBy: data[i][4],
          status: data[i][5],
          priority: data[i][6],
          dueDate: data[i][7],
          notes: data[i][8],
          createdAt: data[i][9],
          updatedAt: data[i][10]
        }
      });
    }
  }

  return jsonResponse({ error: "Tarea no encontrada" }, 404);
}

function handleUploadPhoto(params, payload, e) {
  // Guardar referencia a foto en Google Drive
  // En producción: subir blob a Drive y guardar fileId

  const photoId = "photo-" + Date.now();

  return jsonResponse({
    success: true,
    photo: {
      id: photoId,
      driveFileId: "file-id-placeholder",
      uploadedAt: new Date().toISOString()
    }
  });
}

function handleGetReports(payload, params) {
  // Solo admin y administrativo pueden ver reportes
  if (payload.role !== "ADMIN" && payload.role !== "ADMINISTRATIVO") {
    return jsonResponse({ error: "No tienes permiso para ver reportes" }, 403);
  }

  const type = params.type || "attendance";
  const startDate = params.startDate;
  const endDate = params.endDate;

  return jsonResponse({
    success: true,
    report: {
      type: type,
      period: { startDate, endDate },
      data: [],
      generatedAt: new Date().toISOString()
    }
  });
}

// ============================================================================
// UTILIDADES
// ============================================================================

function jsonResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// DEPLOYMENT - EJECUTAR PARA OBTENER URL
// ============================================================================

function deployBackend() {
  // Ir a Deploy → New Deployment → Select Type: Web app
  // Execute as: Mi usuario
  // Who has access: Anyone
  // Copiar la URL del tipo: https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercoderun

  Logger.log("Para desplegar:");
  Logger.log("1. Click en 'Deploy' (superior derecha)");
  Logger.log("2. Click en 'New deployment'");
  Logger.log("3. Selecciona 'Web app'");
  Logger.log("4. Execute as: [tu email]");
  Logger.log("5. Who has access: Anyone");
  Logger.log("6. Click 'Deploy'");
  Logger.log("7. Copiar la URL de implementación");
}
