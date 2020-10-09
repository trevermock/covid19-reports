// Utility functions for permission objects (objects that consist of many boolean fields).

export function permissionsToArray<T extends object>(permissionObject: T) {
  let filteredCount = 0;
  const allowed = Object.keys(permissionObject).filter(key => {
    const value = Reflect.get(permissionObject, key);
    if (typeof value === 'boolean' && value) {
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

export function setAllPermissions<T extends object>(permissionObject: T, newValue: boolean) {
  Object.keys(permissionObject).forEach(key => {
    const value = Reflect.get(permissionObject, key);
    if (typeof value === 'boolean') {
      Reflect.set(permissionObject, key, newValue);
    }
  });
}

export function parsePermissions<T extends object>(permissionObject: T, permissions: string[] | undefined): T {
  if (!permissions) {
    return permissionObject;
  }
  if (permissions.length === 0) {
    setAllPermissions(permissionObject, false);
  } else if (permissions.length === 1 && permissions[0] === '*') {
    setAllPermissions(permissionObject, true);
  } else {
    setAllPermissions(permissionObject, false);
    permissions.forEach(permission => {
      if (permissionObject.hasOwnProperty(permission)) {
        Reflect.set(permissionObject, permission, true);
      }
    });
  }
  return permissionObject;
}
