import EventDispatcher = Laya.EventDispatcher;


export default class EventUtil {
  // 默认的事件派发器
  public static get Dispatcher(): EventDispatcher {
    if (EventUtil.defaultInstance == null) {
      EventUtil.defaultInstance = new EventDispatcher();
    }
    return EventUtil.defaultInstance;
  }

  
  private static defaultInstance: EventDispatcher = null;
}
