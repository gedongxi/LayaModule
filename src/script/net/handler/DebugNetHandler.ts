import { DebugDispatcher } from "../../proto/ProtoDispatcher";
import { DebugErrorS2C } from "../../proto/mods/ProtoSectionDebug";
import { ProtoErrorCode, ProtoMsgMap} from "../../proto/ProtoReflect";
import GamePersist from "../../scene/GamePersist";

export default class DebugNetHandler {
  constructor() {
      DebugDispatcher.on(DebugErrorS2C.EVENT_NAME, this, this.onReceiveMsgError);
  }
  private onReceiveMsgError(event: any) {
    const debugErrorS2C: DebugErrorS2C = event;
    const errCode = debugErrorS2C.code;
    const msgId = debugErrorS2C.msgid;
    const clazz   = ProtoMsgMap[msgId];
    const eventName: string = clazz ? clazz.EVENT_NAME : "未知模块名";
    const errMsg = ProtoErrorCode[errCode] || "ErrCode:" + errCode;
    const protoMsgSection = msgId >> 8;

    console.log("=====协议错误====", "protoMsgSection=%d, eventName=%s, errCode=%d, errMsg=%s", protoMsgSection, eventName, errCode, errMsg);
    GamePersist.INSTANCE.showToast("common_text10000", event.errMsg);
  }
}
