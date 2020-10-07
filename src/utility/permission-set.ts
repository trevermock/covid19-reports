// Utility functions for permission objects (objects that consist of many boolean fields).

export function permissionsToString<T extends object>(permissionObject: T) {
  let filteredCount = 0;
  const allowed = Object.keys(permissionObject).filter(key => {
    const value = Reflect.get(permissionObject, key);
    if (typeof value === 'boolean' && value) {
      return true;
    }
    filteredCount += 1;
    return false;
  });
  if (allowed.length === 0) {
    return '';
  }
  if (filteredCount === 0) {
    return '*';
  }
  return allowed.join(',');
}

export function setAllPermissions<T extends object>(permissionObject: T, newValue: boolean) {
  Object.keys(permissionObject).forEach(key => {
    const value = Reflect.get(permissionObject, key);
    if (typeof value === 'boolean') {
      Reflect.set(permissionObject, key, newValue);
    }
  });
}

export function parsePermissions<T extends object>(permissionObject: T, permissions: string | undefined): T {
  if (!permissions) {
    return permissionObject;
  }
  const split = permissions.split(',').filter(permission => permission.length > 0);
  if (split.length === 0) {
    setAllPermissions(permissionObject, false);
  } else if (split.length === 1 && split[0] === '*') {
    setAllPermissions(permissionObject, true);
  } else {
    setAllPermissions(permissionObject, false);
    split.forEach(permission => {
      if (permissionObject.hasOwnProperty(permission)) {
        Reflect.set(permissionObject, permission, true);
      }
    });
  }
  return permissionObject;
}
