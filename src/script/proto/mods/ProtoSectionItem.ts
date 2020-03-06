// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class ItemItemChangeS2C {
  public static EVENT_NAME: string = "ItemItemChangeS2C";

  public static decode(byteArray: ByteArray): ItemItemChangeS2C {
    const obj = new ItemItemChangeS2C();
    obj.itemId = byteArray.readUnsignedShort();
    obj.number = byteArray.readUnsignedShort();
    return obj;
  }

  // 物品ID
  public itemId: Uint16;
  // 物品数量
  public number: Uint16;
}
