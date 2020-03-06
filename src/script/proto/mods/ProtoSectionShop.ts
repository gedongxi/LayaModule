// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class ShopBuyC2S implements IProtoMsgC2S {

  // 使用XX
  public useId: Uint16;
  // 购买XX
  public buyId: Uint16;
  private MSG_ID: Uint16 = 7168;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.useId);
    byteArray.writeUnsignedShort(this.buyId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class ShopBuyS2C {
  public static EVENT_NAME: string = "ShopBuyS2C";

  public static decode(byteArray: ByteArray): ShopBuyS2C {
    const obj = new ShopBuyS2C();
    obj.result = byteArray.readUnsignedByte();
    return obj;
  }

  // 购买结果
  public result: Uint8;
}
