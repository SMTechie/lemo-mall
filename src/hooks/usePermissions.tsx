"use client";

import { createContext, useContext } from "react";
import type { PermissionName } from "@/lib/permissions";

type PermissionContextValue = {
  permissions: string[];
  roles: string[];
  can: (permission: PermissionName) => boolean;
  hasRole: (role: string) => boolean;
};

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  roles: [],
  can: () => false,
  hasRole: () => false
});

export function PermissionProvider({
  children,
  permissions,
  roles
}: {
  children: React.ReactNode;
  permissions: string[];
  roles: string[];
}) {
  return (
    <PermissionContext.Provider
      value={{
        permissions,
        roles,
        can(permission) {
          return permissions.includes(permission);
        },
        hasRole(role) {
          return roles.includes(role);
        }
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}
