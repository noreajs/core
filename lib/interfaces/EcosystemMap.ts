import { Worker } from "cluster";
import { cpus } from "os";
import { Logger } from "..";

export type WorkerMap = {
  [id: number]: Worker;
};

export default class EcosystemMap {
  private _webs: WorkerMap = {};
  private _sockets: WorkerMap = {};

  public get workerCount(): number {
    return Object.keys(this._webs).length + Object.keys(this._sockets).length;
  }

  public get socketsWorkers(): WorkerMap {
    return this._sockets;
  }

  public get websWorkers(): WorkerMap {
    return this._webs;
  }

  /**
   * Add a web worker in the ecosytem
   * @param worker web worker
   */
  addWebWorker(worker: Worker) {
    if (this.workerCount >= cpus().length - 1) {
      Logger.log("cpus limit crossed", this.workerCount);
    } else {
      this._webs[worker.id] = worker;
    }
  }

  /**
   * Add a socket worker in the ecosystem
   * @param worker socket worker
   */
  addSocketWorker(worker: Worker) {
    if (this.workerCount >= cpus().length - 1) {
      Logger.log("cpus limit crossed", this.workerCount);
    } else {
      this._sockets[worker.id] = worker;
    }
  }

  /**
   * Get worker type
   * @param workerId worker id
   * @returns "socket"|"web"|undefined
   */
  getWorkerType(workerId): "socket" | "web" | undefined {
    if (this._sockets[workerId]) {
      return "socket";
    } else if (this._webs[workerId]) {
      return "web";
    } else {
      return undefined;
    }
  }

  /**
   * Delete worker
   * @param workerId worker id
   * @returns "socket"|"web"|undefined
   */
  deleteWorker(workerId: number): "socket" | "web" | undefined {
    if (this._sockets[workerId]) {
      delete this._sockets[workerId];
      return "socket";
    } else if (this._webs[workerId]) {
      delete this._webs[workerId];
      return "web";
    } else {
      return undefined;
    }
  }
}
