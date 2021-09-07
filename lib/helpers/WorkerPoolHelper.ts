import { isMaster } from "cluster";
import { cpus } from "os";
import numeral from "numeral";
import { parentPort, Worker, WorkerOptions } from "worker_threads";
import Logger from "./Logger";
export type EventListenerType = "error" | "message" | "exit" | "online";
export enum WorkerPoolHelperEventType {
  "WORKER_STATUS" = "WORKER_STATUS",
  "WORKER_TASK" = "WORKER_TASK",
  "INITIALIZATION_ORDER" = "INITIALIZATION_ORDER",
}
export enum WorkerPoolInstanceStatus {
  "initialized" = "initialized",
  "pending" = "pending",
  "busy" = "busy",
}
export type WorkerPoolHelperMetrics = {
  totalWorkers: number;
  busyWorkers: number;
  pendingWorkers: number;
  pendingTasks: number;
  activeTasks: number;
};
export type WorkerInstanceParams = {
  filePath: string;
  options?: WorkerOptions;
};
export type WorkerPoolHelperRegisteredEvents = {
  [event in EventListenerType]?: (payload: any) => void | Promise<void>;
};
export type WorkerPoolHelperInitFuncParams = {
  workersCount?: number;
  workerInstanceFilePath: string;
  workerInstanceOptions?: WorkerOptions;
  logInstanceErrors?: boolean;
  registeredEvents?: WorkerPoolHelperRegisteredEvents;
  workerPendingByDefault?: boolean;
  poolName?: string;
  pendingTasksNotificationOffset?: number;
};

export default class WorkerPoolHelper {
  private static _pendingTasksNotificationOffset: number = 500;
  private static _poolName: string = "WorkerPoolHelper";

  public static get poolName(): string {
    return this._poolName;
  }

  public static set pendingTasksNotificationOffset(v: number) {
    this._pendingTasksNotificationOffset = v;
  }

  public static get pendingTasksNotificationOffset(): number {
    return this._pendingTasksNotificationOffset;
  }

  private static _pendingTasksUpdatesNotified = false;
  private static _pendingTasks: any[] = [];
  private static _workers: Set<Worker> = new Set<Worker>();
  private static _workersStatus: Map<number, WorkerPoolInstanceStatus> =
    new Map<number, WorkerPoolInstanceStatus>();
  private static _workersOnlineStatus: Map<number, boolean> = new Map<
    number,
    boolean
  >();
  private static _metrics: WorkerPoolHelperMetrics = {
    activeTasks: 0,
    busyWorkers: 0,
    pendingWorkers: 0,
    pendingTasks: 0,
    totalWorkers: 0,
  };
  private static _workerInstanceParams: WorkerInstanceParams;
  private static _logInstanceErrors: boolean = false;
  private static _workerPendingByDefault: boolean = false;
  private static _registeredEvents?: WorkerPoolHelperRegisteredEvents;

  public static init(params: WorkerPoolHelperInitFuncParams) {
    if (
      params.workersCount !== null &&
      params.workersCount !== undefined &&
      params.workersCount > cpus().length
    ) {
      throw new Error(
        `The workers count cannot be great than cpus count minus 1 => (${
          cpus().length - 1
        })`
      );
    }

    // set the default parameters
    this._logInstanceErrors = params.logInstanceErrors ?? false;
    this._metrics.totalWorkers = params.workersCount ?? cpus().length - 1;
    this._workerInstanceParams = {
      filePath: params.workerInstanceFilePath,
      options: params.workerInstanceOptions,
    };
    this._registeredEvents = params.registeredEvents;
    this._workerPendingByDefault = params.workerPendingByDefault ?? false;
    this._poolName = params.poolName ?? this._poolName;
    this._pendingTasksNotificationOffset =
      params.pendingTasksNotificationOffset ??
      this._pendingTasksNotificationOffset;

    // initialize workers
    this._initializeWorkers();
  }

  private static _initializeWorkers() {
    /**
     * Get registered event listener
     * @param eventName event name
     * @returns (value:any) => void | undefined
     */
    const getRegisteredEventListener = (eventName: string) => {
      if (
        this._registeredEvents &&
        Object.keys(this._registeredEvents).includes(eventName)
      ) {
        return this._registeredEvents[eventName];
      }
      return undefined;
    };

    /**
     * Call the registered event listener
     * @param eventName event name
     * @param payload Event payload
     */
    const callRegisteredEventListener = async (
      eventName: string,
      payload: any
    ) => {
      try {
        const eventListener = getRegisteredEventListener(eventName);
        if (eventListener) {
          if (typeof eventListener.then === "function") {
            await eventListener?.(payload);
          } else {
            eventListener?.(payload);
          }
        }
      } catch (error) {}
    };

    for (let index = 0; index < this._metrics.totalWorkers; index++) {
      const workerInstance = new Worker(
        this._workerInstanceParams.filePath,
        this._workerInstanceParams.options
      );

      workerInstance.on("message", async (payload) => {
        if (payload.type === WorkerPoolHelperEventType.WORKER_STATUS) {
          this._workersStatus.set(workerInstance.threadId, payload.status);

          // update metrics
          this._updateMetrics();
        } else {
          if (!isMaster) {
            parentPort?.postMessage(payload);
          }

          // call registered event listener if exists
          await callRegisteredEventListener("message", payload);
        }
      });

      workerInstance.on("online", async () => {
        this._workersOnlineStatus.set(workerInstance.threadId, true);

        // update metrics
        this._updateMetrics();

        // require pending initialization
        if (this._workerPendingByDefault) {
          workerInstance.postMessage({
            type: WorkerPoolHelperEventType.INITIALIZATION_ORDER,
          });
        }

        // call registered event listener if exists
        await callRegisteredEventListener("online", undefined);
      });

      workerInstance.on("exit", async (exitCode: number) => {
        this._workersOnlineStatus.set(workerInstance.threadId, false);

        // update metrics
        this._updateMetrics();

        // call registered event listener if exists
        await callRegisteredEventListener("exit", exitCode);
      });

      workerInstance.on("error", async (error) => {
        if (this._logInstanceErrors) {
          Logger.err(
            `Error in worker instance \`${workerInstance.threadId}\``,
            error
          );
        }

        // call registered event listener if exists
        await callRegisteredEventListener("error", error);
      });

      // add worker instance in the worker list
      this._workers.add(workerInstance);
    }

    // watch pending tasks
    this._watchPendingTasks();
  }

  /**
   * Update workers metrics
   */
  private static _updateMetrics() {
    // count workers status
    const countStatus = (status: WorkerPoolInstanceStatus) => {
      var count = 0;
      for (const key of this._workersStatus.keys()) {
        if (this._workersStatus.get(key) === status) {
          count += 1;
        }
      }
      return count;
    };

    // count workers online status
    const countOnlineStatus = (status: boolean) => {
      var count = 0;
      for (const key of this._workersOnlineStatus.keys()) {
        if (this._workersOnlineStatus.get(key) === status) {
          count += 1;
        }
      }
      return count;
    };

    this._metrics = {
      activeTasks: countOnlineStatus(true),
      busyWorkers: countStatus(WorkerPoolInstanceStatus.busy),
      pendingWorkers: countStatus(WorkerPoolInstanceStatus.pending),
      pendingTasks: this._pendingTasks.length,
      totalWorkers: this._metrics.totalWorkers,
    };
  }

  /**
   * Get the next pending worker
   * @returns
   */
  private static nextPendingWorker() {
    for (const worker of this._workers) {
      if (
        this._workersStatus.get(worker.threadId) ===
        WorkerPoolInstanceStatus.pending
      ) {
        return worker;
      }
    }
    return undefined;
  }

  /**
   * Watch and run pending tasks
   */
  private static _watchPendingTasks() {
    const interval = setInterval(() => {
      if (this._pendingTasks.length !== 0) {
        // get the first in task
        const firstInTask = this._pendingTasks.shift();
        // assign the task
        this.assignTask(firstInTask);
      }
    }, 500);
  }

  /**
   * Pending tasks notification
   */
  private static _pendingTasksNotification() {
    // limit reached
    if (
      this._pendingTasks.length % this._pendingTasksNotificationOffset ===
      0
    ) {
      if (!this._pendingTasksUpdatesNotified) {
        // notify
        Logger.log(
          `${this._poolName} >> pending tasks updates notification:`,
          this._metrics
        );
        // notify
        Logger.log(`${this._poolName} >> memory usage:`, {
          arrayBuffers: numeral(process.memoryUsage().arrayBuffers).format(
            "0.000 ib"
          ),
          external: numeral(process.memoryUsage().external).format("0.000 ib"),
          heapTotal: numeral(process.memoryUsage().heapTotal).format(
            "0.000 ib"
          ),
          heapUsed: numeral(process.memoryUsage().heapUsed).format("0.000 ib"),
          rss: numeral(process.memoryUsage().rss).format("0.000 ib"),
        });

        // update state
        this._pendingTasksUpdatesNotified = true;
      }
    } else {
      // update state
      this._pendingTasksUpdatesNotified = false;
    }
  }

  /**
   * Assign a task to the first free worker
   * @param payload payload for the tast
   */
  public static assignTask(payload: any): {
    added: boolean;
    pendingTasks: number;
  } {
    // notify pending
    this._pendingTasksNotification();

    // load worker
    var worker = this.nextPendingWorker();

    // worker exists
    if (worker) {
      worker.postMessage({
        type: WorkerPoolHelperEventType.WORKER_TASK,
        data: payload,
      });
      return {
        added: true,
        pendingTasks: this._metrics.pendingTasks,
      };
    } else {
      // add to pending task list
      this._pendingTasks.push(payload);

      // update metrics
      this._updateMetrics();

      return {
        added: false,
        pendingTasks: this._metrics.pendingTasks,
      };
    }
  }

  /**
   * Get the pool stats
   */
  public static get stats(): WorkerPoolHelperMetrics {
    return this._metrics;
  }
}
