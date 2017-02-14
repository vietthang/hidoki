import { curry, bind, CurriedFunction1, CurriedFunction2, CurriedFunction3 } from 'lodash';

import { Iterator, PromiseOrValue } from './utils/common';
import { mapInternal } from './map';

async function filterInternal<T>(
  iteratee: Iterator<T, boolean>,
  concurrency: number,
  collection: PromiseOrValue<T[]>,
) {
  const entries = await mapInternal(
    async (value: T, index: number, collection: T[]) => {
      return [await iteratee(value, index, collection), value] as [boolean, T];
    },
    concurrency,
    collection,
  );

  return entries.filter(([valid]) => valid).map(([, value]) => value);
}

export interface FilterConcurrent {
  <T>(iteratee: Iterator<T, boolean>, concurrency: number, collection: PromiseOrValue<T[]>): Promise<T[]>;
  <T>(iteratee: Iterator<T, boolean>, concurrency: number): CurriedFunction1<PromiseOrValue<T[]>, Promise<T[]>>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction2<number, PromiseOrValue<T[]>, Promise<T[]>>;
  <T>(): CurriedFunction3<Iterator<T, boolean>, number, PromiseOrValue<T[]>, Promise<T[]>>;
}

export const filterConcurrent: FilterConcurrent = curry(filterInternal);

export interface Filter {
  <T>(iteratee: Iterator<T, boolean>, collection: PromiseOrValue<T[]>): Promise<boolean>;
  <T>(iteratee: Iterator<T, boolean>): CurriedFunction1<PromiseOrValue<T[]>, Promise<boolean>>;
  <T>(): CurriedFunction2<Iterator<T, boolean>, PromiseOrValue<T[]>, Promise<boolean>>;
}

export const filter: Filter = bind(filterInternal, null, bind.placeholder, Infinity, bind.placeholder) as any;

export const filterSeries: Filter = bind(filterInternal, null, bind.placeholder, 1, bind.placeholder) as any;
