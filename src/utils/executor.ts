import { PromiseOrValue } from './common'

class DeferPromise<T> extends Promise<T> {

  public resolve: (value?: T | PromiseLike<T>) => void;

  public reject: (reason?: any) => void;

  constructor() {
    super((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

}

function defer(func: () => void) {
  if (typeof setImmediate === 'function') {
    setImmediate(func);
  } else {
    setTimeout(func, 0);
  }
}

export class PromiseExecutor {

  private capacity: number;

  private size: number;

  private waitQueue: DeferPromise<void>[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    this.waitQueue = [];
  }

  async execute<T>(func: () => PromiseOrValue<T>): Promise<T> {
    while (this.size >= this.capacity) {
      const promise = new DeferPromise<void>();
      this.waitQueue.push(promise);
      await (promise as Promise<void>);
    }

    this.size += 1;
    try {
      const ret = await func();
      this.size -= 1;
      const promise = this.waitQueue.shift()
      if (promise) {
        promise.resolve();
      }
      return ret;
    } catch (e) {
      defer(() => {
        this.waitQueue.forEach(promise => promise.reject(e));
        this.waitQueue = [];
        this.size = 0;
      });

      throw e;
    }
  }

}