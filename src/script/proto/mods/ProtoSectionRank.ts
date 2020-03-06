// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class RankGetRankC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6912;

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
export class RankGainRewardC2S implements IProtoMsgC2S {

  // 天梯积分
  public rank: Uint16;
  // 是否广告
  public type: Uint8;
  private MSG_ID: Uint16 = 6913;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.rank);
    byteArray.writeByte(this.type);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class RankGetRankS2C {
  public static EVENT_NAME: string = "RankGetRankS2C";

  public static decode(byteArray: ByteArray): RankGetRankS2C {
    const obj = new RankGetRankS2C();
    let len;
    obj.rank = byteArray.readUnsignedShort();
    obj.rewardRanks = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.rewardRanks.push(byteArray.readUnsignedShort());
    }
    return obj;
  }

  // 天梯积分
  public rank: Uint16;
  // 未获取奖励的rank
  public rewardRanks: Uint16[];
}
export class RankGainRewardS2C {
  public static EVENT_NAME: string = "RankGainRewardS2C";

  public static decode(byteArray: ByteArray): RankGainRewardS2C {
    const obj = new RankGainRewardS2C();
    obj.rank = byteArray.readUnsignedShort();
    return obj;
  }

  // 天梯积分
  public rank: Uint16;
}
