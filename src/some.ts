import { curry, bind, CurriedFunction1, CurriedFunction2, CurriedFunction3, identity } from 'lodash';

import { Iterator, PromiseOrValue } from './utils/common';
import { mapInternal } from './map';

async function someInternal<T>(
  iteratee: Iterator<T, boolean>,
  concurrency: number,
  collection: PromiseOrValue<T[]>,
) {
  const entries = await mapInternal(iteratee, concurrency, collection);

  return entries.some(identity);
}

export interface SomeConcurrent {
  <T>(iteratee: Iterator<T, boolean>, concurrency: number, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T>(iteratee: Iterator<T, boolean>, concurrency: number): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction2<number, PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(): CurriedFunction3<Iterator<T, boolean>, number, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const someConcurrent: SomeConcurrent = curry(someInternal);

export interface Some {
  <T>(iteratee: Iterator<T, boolean>, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(): CurriedFunction2<Iterator<T, boolean>, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const some: Some = bind(someInternal, null, bind.placeholder, Infinity, bind.placeholder) as any;

export const someSeries: Some = bind(someInternal, null, bind.placeholder, 1, bind.placeholder) as any;
