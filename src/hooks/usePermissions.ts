import { useUser } from '@store/hooks';
import { createPermissionChecker, Permission } from '@utils/permissions';

/**
 * Hook para verificar permisos del usuario actual
 *
 * Uso en componentes:
 *
 * const permissions = usePermissions();
 *
 * if (permissions.can('assign_tasks')) {
 *   // Mostrar botón de asignar
 * }
 *
 * if (permissions.isMercaderista()) {
 *   // Mostrar UI específica para mercaderistas
 * }
 */
export const usePermissions = () => {
  const user = useUser();
  return createPermissionChecker(user?.role || null);
};

/**
 * Hook para proteger rutas basadas en permisos
 *
 * Uso:
 * const canAccess = useCanAccess('assign_tasks');
 * if (!canAccess) return <NotAuthorized />;
 */
export const useCanAccess = (permission: Permission): boolean => {
  const permissions = usePermissions();
  return permissions.can(permission);
};

/**
 * Hook para verificar si es un rol específico
 *
 * Uso:
 * const isMercaderista = useIsRole('MERCADERISTAS');
 */
export const useIsRole = (role: string): boolean => {
  const user = useUser();
  return user?.role === role;
};

/**
 * Hook para obtener descripción del rol
 */
export const useRoleDescription = (): string => {
  const user = useUser();
  if (!user) return 'No autenticado';

  const descriptions: Record<string, string> = {
    ADMIN: 'Administrador',
    ASIGNADORES: 'Asignador de Tareas',
    MERCADERISTAS: 'Mercaderista',
    ADMINISTRATIVO: 'Administrativo',
    PLANTA: 'Operador Planta',
    RUTA: 'Operador Ruta',
    OBRA: 'Operador Obra',
    BIOMETRICO: 'Biométrico',
  };

  return descriptions[user.role] || user.role;
};

export default usePermissions;
