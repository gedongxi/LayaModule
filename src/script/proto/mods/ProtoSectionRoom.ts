// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class RoomCreateC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5120;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class RoomJoinC2S implements IProtoMsgC2S {

  // 房间id
  public roomId: Uint32;
  private MSG_ID: Uint16 = 5121;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedInt(this.roomId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class RoomStartC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5124;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class RoomMakeRobotC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5125;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class RoomEnterNotifyS2C {
  public static EVENT_NAME: string = "RoomEnterNotifyS2C";

  public static decode(byteArray: ByteArray): RoomEnterNotifyS2C {
    const obj = new RoomEnterNotifyS2C();
    obj.roomId = byteArray.readUnsignedInt();
    return obj;
  }

  // 房间id
  public roomId: Uint32;
}
export class RoomUpdateCountS2C {
  public static EVENT_NAME: string = "RoomUpdateCountS2C";

  public static decode(byteArray: ByteArray): RoomUpdateCountS2C {
    const obj = new RoomUpdateCountS2C();
    obj.count = byteArray.readUnsignedByte();
    return obj;
  }

  // 玩家数量
  public count: Uint8;
}
export class RoomMakeRobotS2C {
  public static EVENT_NAME: string = "RoomMakeRobotS2C";

  public static decode(byteArray: ByteArray): RoomMakeRobotS2C {
    const obj = new RoomMakeRobotS2C();
    obj.count = byteArray.readUnsignedShort();
    return obj;
  }

  // 机器人数量
  public count: Uint16;
}
