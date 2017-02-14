import { curry, CurriedFunction1, CurriedFunction2, CurriedFunction3 } from 'lodash';

import { Reducer, PromiseOrValue } from './utils/common';

export async function reduceRightInternal<T, U>(
  iteratee: Reducer<T, U>,
  initialValue: PromiseOrValue<U>,
  collection: PromiseOrValue<T[]>,
) {
  return (await collection).reduceRight<Promise<U>>(
    async (prevValue, value, currentIndex, array) => {
      return await iteratee(await prevValue, value, currentIndex, array);
    },
    Promise.resolve(initialValue),
  );
}

export interface ReduceRight {
  <T, U>(iteratee: Reducer<T, U>, initialValue: PromiseOrValue<U>, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T, U>(iteratee: Reducer<T, U>, initialValue: PromiseOrValue<U>): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T, U>(iteratee: Reducer<T, U>): CurriedFunction2<PromiseOrValue<U>, PromiseOrValue<T[]>, Promise<boolean>>;
  <T, U>(): CurriedFunction3<Reducer<T, U>, PromiseOrValue<U>, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const reduceRight: ReduceRight = curry(reduceRightInternal);
