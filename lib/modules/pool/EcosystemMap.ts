import cluster, { Worker, ClusterSettings } from "cluster";
import { cpus } from "os";
import { Logger } from "../..";

export type WorkerMap = {
  [id: number]: Worker;
};

export type EcosytemScopes = {
  [key: string]: {
    clusterSettings?: ClusterSettings;
  };
};

export type EcosytemWorkers<T = string> = {
  [key in keyof EcosytemScopes]: WorkerMap;
};

export default class EcosystemMap<T = string> {
  private _scopes: EcosytemScopes = {};
  private _workers: EcosytemWorkers<T> = {};

  constructor(scopes: EcosytemScopes) {
    this._scopes = scopes;
  }

  public get workerCount(): number {
    var count = 0;
    for (const key of Object.keys(this._workers)) {
      const element = this._workers[key];
      if (element) {
        count += Object.keys(element).length;
      }
    }
    return count;
  }

  public get workers(): EcosytemWorkers<T> {
    return this._workers;
  }

  /**
   * Add many workers at the same time in the ecosystem
   * @param count number of worker
   * @param scope worker scope
   * @param settings cluster settings
   */
  addManyWorkers(count: number, scope: T, settings?: ClusterSettings) {
    for (let index = 0; index < count; index++) {
      this.addWorker(scope, settings);
    }
  }

  /**
   * Add a worker in the ecosytem
   * @param scope scope
   * @param settings cluster settings
   */
  addWorker(scope: T, settings?: ClusterSettings) {
    if (this.workerCount >= cpus().length - 1) {
      Logger.log(
        `cpus limit crossed: ${this.workerCount}/${cpus().length - 1} created`
      );
    } else {
      if (settings) {
        this._scopes[scope as any] = {
          clusterSettings: settings,
        };
      }
      const scopeOptions = this._scopes[scope as any];

      if (scopeOptions) {
        if (scopeOptions.clusterSettings) {
          // setup default cluster setting
          cluster.setupPrimary(scopeOptions.clusterSettings);
          // create worker
          const worker = cluster.fork();
          // add worker
          if (this._workers[scope as any]) {
            this._workers[scope as any][worker.id] = worker;
          } else {
            this._workers[scope as any] = {};
            this._workers[scope as any][worker.id] = worker;
          }
        }
      } else {
        // init scope
        this._scopes[scope as any] = {};
        // create worker
        const worker = cluster.fork();
        // add worker
        this._workers[scope as any][worker.id] = worker;
      }
    }
  }

  /**
   * Get worker type
   * @param workerId worker id
   * @returns "socket"|"web"|undefined
   */
  getWorkerScope(workerId): T | undefined {
    for (const key of Object.keys(this._workers)) {
      const element = this._workers[key];
      if (element[workerId]) {
        return key as any;
      }
    }
    return undefined;
  }

  /**
   * Delete worker
   * @param workerId worker id
   * @returns "socket"|"web"|undefined
   */
  deleteWorker(workerId: number): T | undefined {
    for (const key in this._workers) {
      if (Object.prototype.hasOwnProperty.call(this._workers, key)) {
        const element = this._workers[key];
        if (element[workerId]) {
          delete element[workerId];
          return key as any;
        }
      }
    }
    return undefined;
  }

  /**
   * Watch and restart ended worker
   */
  watchExit() {
    if (cluster.isPrimary) {
      /**
       * Watch worker exit
       */
      cluster.on("exit", (worker) => {
        Logger.log(`Worker ${worker.process.pid} died`);
        const workerScope = this.getWorkerScope(worker.id);

        // start a new worker
        this.addWorker(workerScope);
      });
    } else {
      Logger.err(
        "The `watchExit` method can be called only in `primary` worker."
      );
    }
  }
}
