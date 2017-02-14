import { curry, bind, CurriedFunction1, CurriedFunction2, CurriedFunction3 } from 'lodash';

import { Iterator, PromiseOrValue } from './utils/common';
import { mapInternal } from './map';

async function eachInternal<T>(
  iteratee: Iterator<T, void>,
  concurrency: number,
  collection: PromiseOrValue<T[]>,
) {
  await mapInternal(iteratee, concurrency, collection);
}

export interface EachConcurrent {
  <T>(iteratee: Iterator<T, void>, concurrency: number, collection: PromiseOrValue<T[]>): Promise<void>;
  <T>(iteratee: Iterator<T, void>, concurrency: number): CurriedFunction1<PromiseOrValue<T[]>, Promise<void>>;
  <T>(iteratee: Iterator<T, void>): CurriedFunction2<number, PromiseOrValue<T[]>, Promise<void>>;
  <T>(): CurriedFunction3<Iterator<T, void>, number, PromiseOrValue<T[]>, Promise<void>>;
}

export const eachConcurrent: EachConcurrent = curry(eachInternal);

export interface Each {
  <T>(iteratee: Iterator<T, void>, collection: PromiseOrValue<T[]>): Promise<void>;
  <T>(iteratee: Iterator<T, void>): CurriedFunction1<PromiseOrValue<T[]>, Promise<void>>;
  <T>(): CurriedFunction2<Iterator<T, void>, PromiseOrValue<T[]>, Promise<void>>;
}

export const each: Each = bind(eachInternal, null, bind.placeholder, Infinity, bind.placeholder) as any;

export const eachSeries: Each = bind(eachInternal, null, bind.placeholder, 1, bind.placeholder) as any;
