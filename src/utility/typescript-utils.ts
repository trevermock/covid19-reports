export type OverrideType<T, R> = Omit<T, keyof R> & R;
