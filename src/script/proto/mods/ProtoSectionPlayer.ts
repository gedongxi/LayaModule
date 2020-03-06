// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class PlayerAnnouncementC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 2819;

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

export class PlayerSelfInfoS2C {
  public static EVENT_NAME: string = "PlayerSelfInfoS2C";

  public static decode(byteArray: ByteArray): PlayerSelfInfoS2C {
    const obj = new PlayerSelfInfoS2C();
    obj.player = ProtoType.PPlayer.decode(byteArray);
    return obj;
  }

  // 玩家信息
  public player: ProtoType.PPlayer;
}
export class PlayerFortuneS2C {
  public static EVENT_NAME: string = "PlayerFortuneS2C";

  public static decode(byteArray: ByteArray): PlayerFortuneS2C {
    const obj = new PlayerFortuneS2C();
    obj.type = byteArray.readUnsignedByte();
    obj.val = byteArray.readUnsignedInt();
    return obj;
  }

  // 财富类型1:宝石 2:金币 3:体力 4: 经验
  public type: Uint8;
  // 财富数值
  public val: Uint32;
}
export class PlayerDailyClearedS2C {
  public static EVENT_NAME: string = "PlayerDailyClearedS2C";

  public static decode(byteArray: ByteArray): PlayerDailyClearedS2C {
    const obj = new PlayerDailyClearedS2C();
    return obj;
  }

}
export class PlayerAnnouncementS2C {
  public static EVENT_NAME: string = "PlayerAnnouncementS2C";

  public static decode(byteArray: ByteArray): PlayerAnnouncementS2C {
    const obj = new PlayerAnnouncementS2C();
    obj.content = byteArray.readUTF();
    obj.qq = byteArray.readUTF();
    return obj;
  }

  // 公告内容
  public content: string;
  // qq号
  public qq: string;
}
