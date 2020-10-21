// Utility functions for permission objects (objects that consist of many boolean fields).
export interface RolePermissions {
  [key: string]: boolean;
}

export interface NamedPermission {
  name: string,
}

export function permissionsToArray(permissionObject: RolePermissions) {
  let filteredCount = 0;
  const allowed = Object.keys(permissionObject).filter(key => {
    const value = permissionObject[key];
    if (value) {
      return true;
    }
    filteredCount += 1;
    return false;
  });
  if (filteredCount === 0) {
    return ['*'];
  }
  return allowed;
}

export function parsePermissions(available: NamedPermission[], allowed: string[] | undefined): RolePermissions {
  const permissions: RolePermissions = {};
  if (!allowed || allowed.length === 0) {
    available.forEach(permission => {
      permissions[permission.name] = false;
    });
  } else if (allowed.length === 1 && allowed[0] === '*') {
    available.forEach(permission => {
      permissions[permission.name] = true;
    });
  } else {
    available.forEach(permission => {
      permissions[permission.name] = allowed.indexOf(permission.name) >= 0;
    });
  }
  return permissions;
}
