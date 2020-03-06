import { RoomDispatcher } from "../../proto/ProtoDispatcher";
import { RoomEnterNotifyS2C, RoomUpdateCountS2C, RoomMakeRobotS2C } from "../../proto/mods/ProtoSectionRoom";
import Misc from "../../commonUnit/Misc";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
import { ProtoSection } from "../../proto/ProtoReflect";


export default class RoomNetHandler {

  constructor() {
    // 进入房间通知
    RoomDispatcher.on(RoomEnterNotifyS2C.EVENT_NAME, this, this.handleRoomEnterNotifyS2C);
    // 更新房间内玩家数量
    RoomDispatcher.on(RoomUpdateCountS2C.EVENT_NAME, this, this.handleRoomUpdateCountS2C);
    // 生成机器人返回
    RoomDispatcher.on(RoomMakeRobotS2C.EVENT_NAME, this, this.handleRoomMakeRobotS2C);

  }

  // 进入房间通知
  private handleRoomEnterNotifyS2C(event: any) {
    const msg: RoomEnterNotifyS2C = event;
    Misc.myLog(" ############ 进入房间通知 ############ ", msg);
    EventUtil.Dispatcher.event(Events.EVENT_MAIN_ENTER_NOTIFY, msg.roomId);
  }

  // 更新房间内玩家数量
  private handleRoomUpdateCountS2C(event: any) {
    const msg: RoomUpdateCountS2C = event;
    Misc.myLog(" ############ 更新房间内玩家数量 ############ ", msg);
    EventUtil.Dispatcher.event(Events.EVENT_MAIN_ROOM_UPDATE_COUNT, msg.count);
  }

  // 生成机器人返回
  private handleRoomMakeRobotS2C(event: any) {
    const msg: RoomMakeRobotS2C = event;
    Misc.myLog(" ############ 生成机器人返回 ############ ", msg);
    EventUtil.Dispatcher.event(Events.EVENT_MAIN_ROOM_MAKE_ROBOT, msg.count);
  }


}
