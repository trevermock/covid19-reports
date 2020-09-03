export const blah = 0;
// // Abstract Redux action class. Static type is for reducer switches, and instance type is for internal Redux use.
// export abstract class Action {
//   static type: string;
//   type = '';
//   payload: any;
// }
//
// // TODO: Get this working with payloads...
//
// // Decorator function which will automatically set the static and instance types.
// export function ActionType(
//   type: string
// ) {
//   return (constructor: any) => {
//     return class extends constructor {
//       static type = type;
//       type = type;
//     };
//   };
// }
