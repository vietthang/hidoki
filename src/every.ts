import { curry, bind, CurriedFunction1, CurriedFunction2, CurriedFunction3, identity } from 'lodash';

import { Iterator, PromiseOrValue } from './utils/common';
import { mapInternal } from './map';

async function everyInternal<T>(
  iteratee: Iterator<T, boolean>,
  concurrency: number,
  collection: PromiseOrValue<T[]>,
) {
  const entries = await mapInternal(iteratee, concurrency, collection);

  return entries.every(identity);
}

export interface EveryConcurrent {
  <T>(iteratee: Iterator<T, boolean>, concurrency: number, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T>(iteratee: Iterator<T, boolean>, concurrency: number): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction2<number, PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(): CurriedFunction3<Iterator<T, boolean>, number, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const everyConcurrent: EveryConcurrent = curry(everyInternal);

export interface Every {
  <T>(iteratee: Iterator<T, boolean>, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(): CurriedFunction2<Iterator<T, boolean>, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const every: Every = bind(everyInternal, null, bind.placeholder, Infinity, bind.placeholder) as any;

export const everySeries: Every = bind(everyInternal, null, bind.placeholder, 1, bind.placeholder) as any;
