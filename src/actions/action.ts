
// Abstract Redux action class. Static type is for reducer switches, and instance type is for internal Redux use.
export abstract class Action {
  static type: string;
  type = '';
}

// Decorator function which will automatically set the static and instance types.
export function ActionType<T extends { new (...args: any[]): {} }>(
  type: string
) {
  return (constructor: T) => {
    return class extends constructor {
      static type = type;
      type = type;
    };
  };
}
