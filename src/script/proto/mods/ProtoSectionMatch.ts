// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class MatchSingleMatchC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5888;

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
export class MatchCancelMatchC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5889;

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
export class MatchMatchedSumC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5890;

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

export class MatchCancelMatchS2C {
  public static EVENT_NAME: string = "MatchCancelMatchS2C";

  public static decode(byteArray: ByteArray): MatchCancelMatchS2C {
    const obj = new MatchCancelMatchS2C();
    obj.code = byteArray.readUnsignedByte();
    return obj;
  }

  // 错误码 0 退出成功
  public code: Uint8;
}
export class MatchMatchedSumS2C {
  public static EVENT_NAME: string = "MatchMatchedSumS2C";

  public static decode(byteArray: ByteArray): MatchMatchedSumS2C {
    const obj = new MatchMatchedSumS2C();
    obj.sum = byteArray.readUnsignedByte();
    return obj;
  }

  // 人数
  public sum: Uint8;
}
export class MatchPlayerInMatchS2C {
  public static EVENT_NAME: string = "MatchPlayerInMatchS2C";

  public static decode(byteArray: ByteArray): MatchPlayerInMatchS2C {
    const obj = new MatchPlayerInMatchS2C();
    obj.sum = byteArray.readUnsignedByte();
    return obj;
  }

  // 人数
  public sum: Uint8;
}
