import { WorkerPool, pool, WorkerPoolOptions, isMainThread } from "workerpool";
import { parentPort } from "worker_threads";
import Logger from "./Logger";

export default class WorkerPoolHelper {
  private static _pool: WorkerPool;

  /**
   * Custom exec method
   * @param method method
   * @param params parameters
   * @param options pool options
   */
  public static exec<T extends (...args: any[]) => any>(
    method: T | string,
    params: Parameters<T> | null,
    options?: { on: (payload: any) => void }
  ) {
    if (this._pool) {
      // explode options
      const { on, ...restOptions } = options ?? {};

      // call the pool exec
      this._pool.exec<T>(method, params, {
        on: (payload) => {
          // propagate the message
          if (!isMainThread) {
            parentPort.postMessage(payload);
          }

          // call default on function
          on?.(payload);
        },
        ...restOptions,
      });
    } else {
      Logger.err("You should call the init method before the exec method.");
    }
  }

  /**
   * Initialize the worker pool
   * @param options worker pool options
   */
  static init(options?: WorkerPoolOptions) {
    if (!this._pool) {
      this._pool = pool(options);
    }
  }

  /**
   * Initialize the worker pool
   * @param workerPoolFilePath worker pool file path
   * @param options worker pool options
   */
  static initWithPath(workerPoolFilePath: string, options?: WorkerPoolOptions) {
    if (!this._pool) {
      this._pool = pool(workerPoolFilePath, options);
    }
  }

  /**
   * Get pool instance
   * @returns WorkerPool
   */
  public static get pool(): WorkerPool {
    if (this._pool) {
      return this._pool;
    } else {
      Logger.err(
        "You should call the init method before the getWorker method."
      );
    }
  }
}
