import { curry, bind, CurriedFunction1, CurriedFunction2, CurriedFunction3 } from 'lodash';

import { Iterator, PromiseOrValue } from './utils/common';
import { PromiseExecutor } from './utils/executor';

export async function mapInternal<T, U>(
  iteratee: Iterator<T, U>,
  concurrency: number,
  collection: PromiseOrValue<T[]>,
) {
  const executor = new PromiseExecutor(concurrency);
  const values = await collection;

  return await Promise.all(
    values.map(
      (value, index, collection) => executor.execute(() => iteratee(value, index, collection)),
    )
  );
}

export interface MapConcurrent {
  <T, U>(iteratee: Iterator<T, U>, concurrency: number, collection: PromiseOrValue<T[]>): Promise<U[]>;
  <T, U>(iteratee: Iterator<T, U>, concurrency: number): CurriedFunction1<PromiseOrValue<T[]>, Promise<U[]>>;
  <T, U>(iteratee: Iterator<T, U>): CurriedFunction2<number, PromiseOrValue<T[]>, Promise<U[]>>;
  <T, U>(): CurriedFunction3<Iterator<T, U>, number, PromiseOrValue<T[]>, Promise<U[]>>;
}

export const mapConcurrent: MapConcurrent = curry(mapInternal);

export interface Map {
  <T, U>(iteratee: Iterator<T, U>, collection: PromiseOrValue<T[]>): Promise<U[]>;
  <T, U>(iteratee: Iterator<T, U>): CurriedFunction1<PromiseOrValue<T[]>, Promise<U[]>>;
  <T, U>(): CurriedFunction2<Iterator<T, U>, PromiseOrValue<T[]>, Promise<U[]>>;
}

export const map: Map = bind(mapInternal, null, bind.placeholder, Infinity, bind.placeholder) as any;

export const mapSeries: Map = bind(mapInternal, null, bind.placeholder, 1, bind.placeholder) as any;
