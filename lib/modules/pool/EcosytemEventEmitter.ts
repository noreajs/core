import WorkerPoolHelperEventType from "./interfaces/WorkerPoolHelperEventType";
import WorkerPoolInstanceStatus from "./interfaces/WorkerPoolInstanceStatus";

export default class EcosytemEventEmitter {
  /**
   * Submit event to parent process
   */
  public static submit(
    type: WorkerPoolHelperEventType,
    status: WorkerPoolInstanceStatus
  ) {
    process.send({
      type: type,
      status: status,
    });
  }

  /**
   * Submit status event to parent process
   */
  public static submitStatus(status: WorkerPoolInstanceStatus) {
    process.send({
      type: WorkerPoolHelperEventType.WORKER_STATUS,
      status: status,
    });
  }

  /**
   * Submit buzy event to parent process
   */
  public static buzy() {
    process.send({
      type: WorkerPoolHelperEventType.WORKER_STATUS,
      status: WorkerPoolInstanceStatus.busy,
    });
  }

  /**
   * Submit free event to parent process
   */
  public static free() {
    process.send({
      type: WorkerPoolHelperEventType.WORKER_STATUS,
      status: WorkerPoolInstanceStatus.free,
    });
  }
}
