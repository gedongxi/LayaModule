import { AccDispatcher } from "../../proto/ProtoDispatcher";
import { AccServertimeS2C, AccLoginS2C, AccLoginC2S, AccServertimeC2S, AccCreateS2C, AccEnterS2C, AccReloginC2S, AccReloginS2C} from "../../proto/mods/ProtoSectionAcc";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
import NetCtl from "../NetCtl";

export default class AccNetHandler {

  // 时间同步
  private mNumServerTimeHandler: number = null;

  constructor() {
    AccDispatcher.on(AccServertimeS2C.EVENT_NAME, this, this.handleServerTime);
    AccDispatcher.on(AccLoginS2C.EVENT_NAME, this, this.handleLoginS2C);
    AccDispatcher.on(AccCreateS2C.EVENT_NAME, this, this.handleCreateS2C);
    AccDispatcher.on(AccEnterS2C.EVENT_NAME, this, this.handleEnterS2C);
    AccDispatcher.on(AccReloginS2C.EVENT_NAME, this, this.handleReloginS2C);
  }

  // 服务器返回的登陆结果
  private handleLoginS2C(event: any) {
    const msg: AccLoginS2C = event;
    console.log(" ############ 正常登录返回 ############ ", msg);
    EventUtil.Dispatcher.event(Events.EVENT_LOGIN_NORMAL_BACK, msg);
    
    // 请求服务器时间
    // EventUtil.Dispatcher.event(Events.EVENT_START_SYNC_TIME);

    // 登录成功之后开启时间同步
    this.startSyncServerTime();
  }

  private handleReloginS2C(data) {
    const msg: AccReloginS2C = data;
    console.log(" ############ 重新登录返回 ############ ", msg);
    EventUtil.Dispatcher.event(Events.EVENT_LOGIN_RELOGIN_BACK, msg);
  }


  // 处理收到的服务器时间
  private handleServerTime(event: any) {
    const serverTime: AccServertimeS2C = event;
    EventUtil.Dispatcher.event(Events.EVENT_SERVER_TIME, serverTime.time);
  }

  // 服务器返回创建角色的结果
  private handleCreateS2C(event: any) {
    const msg: AccCreateS2C = event;
    
    EventUtil.Dispatcher.event(Events.EVENT_LOGIN_CREATE_ROLE_BACK, msg);
  }

  // 服务器返回确认成功进入游戏
  private handleEnterS2C(event: any) {
    const msg: AccEnterS2C = event;
    EventUtil.Dispatcher.event(Events.EVENT_LOGIN_SURE_ENTER_GAME, msg);
  }

  // 开始同步时间
  private startSyncServerTime() {
    if (!this.mNumServerTimeHandler) {
      const self = this;
      this.mNumServerTimeHandler = setInterval(() => {
        self.requestServerTime();
      }, 5000);
  
      // 自调一次
      this.requestServerTime(); 
    }
  }

  // 请求服务器时间
  private requestServerTime() {
    if (NetCtl.INSTANCE.IsConnected) {
      EventUtil.Dispatcher.event(Events.EVENT_SEND_SERVER_TIME, Date.now());
      const serverTime = new AccServertimeC2S();
      NetCtl.INSTANCE.send(serverTime);
    }
  }
}
