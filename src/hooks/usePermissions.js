/**
 * Permission Check Hook
 * 
 * Checks if the current authenticated user has permission to view, create, update, or delete
 * a given menu/module slug.
 * References:
 *   - ARCHITECTURE.md §9 (Frontend permission checking)
 */

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { permissions, isSuperAdmin } = useAuth();

  const getModulePerm = useCallback(
    (moduleSlug) => {
      if (isSuperAdmin) {
        return { canView: true, canCreate: true, canUpdate: true, canDelete: true };
      }
      const found = permissions.find((p) => p.menuSlug === moduleSlug);
      if (!found) {
        return { canView: false, canCreate: false, canUpdate: false, canDelete: false };
      }
      return found.effectivePermissions || found;
    },
    [permissions, isSuperAdmin]
  );

  const canView = useCallback((slug) => getModulePerm(slug).canView, [getModulePerm]);
  const canCreate = useCallback((slug) => getModulePerm(slug).canCreate, [getModulePerm]);
  const canUpdate = useCallback((slug) => getModulePerm(slug).canUpdate, [getModulePerm]);
  const canDelete = useCallback((slug) => getModulePerm(slug).canDelete, [getModulePerm]);

  return {
    getModulePerm,
    canView,
    canCreate,
    canUpdate,
    canDelete,
  };
};

export default usePermissions;
