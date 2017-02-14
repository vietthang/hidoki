export type PromiseOrValue<T> = T | PromiseLike<T>;

export type Iterator<T, U> = (value: T, index: number, collection: T[]) => PromiseOrValue<U>;

export type Reducer<T, U> = (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => PromiseOrValue<U>;