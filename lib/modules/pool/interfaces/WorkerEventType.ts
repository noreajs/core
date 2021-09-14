export default interface WorkerEventType<
  EventType = string,
  PayloadType = any
> {
  type: EventType;
  payload?: PayloadType;
}
