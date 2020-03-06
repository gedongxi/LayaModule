// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class RewardGetBoxC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6656;

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
export class RewardOpenBoxC2S implements IProtoMsgC2S {

  // 宝箱id
  public id: Uint16;
  private MSG_ID: Uint16 = 6657;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.id);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class RewardGetBoxS2C {
  public static EVENT_NAME: string = "RewardGetBoxS2C";

  public static decode(byteArray: ByteArray): RewardGetBoxS2C {
    const obj = new RewardGetBoxS2C();
    let len;
    obj.boxList = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.boxList.push(ProtoType.PItem.decode(byteArray));
    }
    return obj;
  }

  // 宝箱id列表
  public boxList: ProtoType.PItem[];
}
export class RewardOpenBoxS2C {
  public static EVENT_NAME: string = "RewardOpenBoxS2C";

  public static decode(byteArray: ByteArray): RewardOpenBoxS2C {
    const obj = new RewardOpenBoxS2C();
    let len;
    obj.itemList = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.itemList.push(ProtoType.PItem.decode(byteArray));
    }
    return obj;
  }

  // 物品列表
  public itemList: ProtoType.PItem[];
}
