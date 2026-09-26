import { UserRole } from '@types/user';

export type Permission =
  | 'view_all_data'
  | 'create_users'
  | 'modify_roles'
  | 'generate_reports'
  | 'configure_system'
  | 'delete_data'
  | 'audit_access'
  | 'assign_tasks'
  | 'view_mercaderistas'
  | 'execute_tasks'
  | 'view_own_tasks'
  | 'mark_biometric'
  | 'view_own_biometric'
  | 'execute_dispatch'
  | 'view_route'
  | 'auto_assign_visits'
  | 'execute_visits';

// Matriz de permisos por rol
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'view_all_data',
    'create_users',
    'modify_roles',
    'generate_reports',
    'configure_system',
    'delete_data',
    'audit_access',
    'assign_tasks',
    'view_mercaderistas',
    'execute_tasks',
    'view_own_tasks',
    'mark_biometric',
    'view_own_biometric',
    'execute_dispatch',
    'view_route',
    'auto_assign_visits',
    'execute_visits',
  ],
  ASIGNADORES: [
    'assign_tasks',
    'view_mercaderistas',
    'view_own_tasks',
    'generate_reports',
  ],
  MERCADERISTAS: [
    'execute_tasks',
    'view_own_tasks',
    'view_own_biometric',
  ],
  ADMINISTRATIVO: [
    'view_all_data',
    'generate_reports',
    'view_mercaderistas',
  ],
  PLANTA: [
    'mark_biometric',
    'view_own_biometric',
  ],
  RUTA: [
    'execute_dispatch',
    'view_route',
    'view_own_tasks',
  ],
  OBRA: [
    'auto_assign_visits',
    'execute_visits',
    'view_own_tasks',
  ],
  BIOMETRICO: [
    'mark_biometric',
    'view_all_data',
  ],
};

/**
 * Verificar si un rol tiene un permiso específico
 */
export const hasPermission = (
  role: UserRole | null,
  permission: Permission
): boolean => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Verificar si un rol tiene cualquiera de los permisos dados
 */
export const hasAnyPermission = (
  role: UserRole | null,
  permissions: Permission[]
): boolean => {
  return permissions.some((perm) => hasPermission(role, perm));
};

/**
 * Verificar si un rol tiene todos los permisos dados
 */
export const hasAllPermissions = (
  role: UserRole | null,
  permissions: Permission[]
): boolean => {
  return permissions.every((perm) => hasPermission(role, perm));
};

/**
 * Obtener todos los permisos de un rol
 */
export const getPermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Describir un rol en texto legible
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    ADMIN: 'Administrador - Acceso total al sistema',
    ASIGNADORES: 'Asignador - Asigna tareas a mercaderistas',
    MERCADERISTAS: 'Mercaderista - Ejecuta tareas de mercadeo',
    ADMINISTRATIVO: 'Administrativo - Ver datos y generar reportes',
    PLANTA: 'Planta - Marcar entrada/salida biométrica',
    RUTA: 'Ruta - Ejecutar tareas de despacho',
    OBRA: 'Obra - Auto-asignar visitas a obra',
    BIOMETRICO: 'Biométrico - Sistema biométrico',
  };
  return descriptions[role] || role;
};

/**
 * Hook para verificar permiso en componentes
 */
export const createPermissionChecker = (userRole: UserRole | null) => ({
  can: (permission: Permission): boolean =>
    hasPermission(userRole, permission),
  canAny: (permissions: Permission[]): boolean =>
    hasAnyPermission(userRole, permissions),
  canAll: (permissions: Permission[]): boolean =>
    hasAllPermissions(userRole, permissions),
  isAdmin: (): boolean => userRole === 'ADMIN',
  isMercaderista: (): boolean => userRole === 'MERCADERISTAS',
  isAsignador: (): boolean => userRole === 'ASIGNADORES',
  isPlanta: (): boolean => userRole === 'PLANTA',
  isRuta: (): boolean => userRole === 'RUTA',
  isObra: (): boolean => userRole === 'OBRA',
  isAdministrativo: (): boolean => userRole === 'ADMINISTRATIVO',
  isBiometrico: (): boolean => userRole === 'BIOMETRICO',
});

// Tipos exportados para uso en componentes
export type PermissionChecker = ReturnType<typeof createPermissionChecker>;
