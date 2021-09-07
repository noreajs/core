import EventListenerType from "./WorkerEventListenerType";

type WorkerHelperRegisteredEvents = {
  [event in EventListenerType]?: (payload: any) => void | Promise<void>;
}

export default WorkerHelperRegisteredEvents;