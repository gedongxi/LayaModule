// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class MapSynC2S implements IProtoMsgC2S {

  // 速度
  public xspeed: Uint8;
  // 速度
  public yspeed: Uint8;
  // 角度
  public rotation: Uint8;
  // 角度
  public skillRotation: Uint8;
  // 操作
  public operator: Uint8;
  // 抛射比例
  public ejectRatio: Uint8;
  private MSG_ID: Uint16 = 5377;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.xspeed);
    byteArray.writeByte(this.yspeed);
    byteArray.writeByte(this.rotation);
    byteArray.writeByte(this.skillRotation);
    byteArray.writeByte(this.operator);
    byteArray.writeByte(this.ejectRatio);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapGoSynC2S implements IProtoMsgC2S {

  // 机器人id
  public aiId: Uint16;
  // 速度
  public xSpeed: Uint8;
  // 速度
  public ySpeed: Uint8;
  // 角度
  public rotation: Uint8;
  // 角度
  public skillRotation: Uint8;
  // 技能
  public operator: Uint8;
  // 抛射比例
  public ejectRatio: Uint8;
  private MSG_ID: Uint16 = 5477;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.aiId);
    byteArray.writeByte(this.xSpeed);
    byteArray.writeByte(this.ySpeed);
    byteArray.writeByte(this.rotation);
    byteArray.writeByte(this.skillRotation);
    byteArray.writeByte(this.operator);
    byteArray.writeByte(this.ejectRatio);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapDebugC2S implements IProtoMsgC2S {

  // 调试信息
  public msg: string;
  private MSG_ID: Uint16 = 5378;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUTF(this.msg);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapGoChooseSkillC2S implements IProtoMsgC2S {

  // 机器人id
  public aiId: Uint64;
  // 选择的技能id
  public skillId: Uint32;
  private MSG_ID: Uint16 = 5579;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeDouble(this.aiId);
    byteArray.writeUnsignedInt(this.skillId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapChooseSkillC2S implements IProtoMsgC2S {

  // 选择的技能id
  public id: Uint32;
  private MSG_ID: Uint16 = 5379;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedInt(this.id);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapGoUpgradeC2S implements IProtoMsgC2S {

  // 玩家id
  public playerId: Uint64;
  // 升到几级
  public lvl: Uint8;
  private MSG_ID: Uint16 = 5580;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeDouble(this.playerId);
    byteArray.writeByte(this.lvl);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapUpgradeC2S implements IProtoMsgC2S {

  // 升到几级
  public lvl: Uint8;
  private MSG_ID: Uint16 = 5380;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.lvl);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapDowngradeC2S implements IProtoMsgC2S {

  // 降到几级
  public lvl: Uint8;
  private MSG_ID: Uint16 = 5381;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.lvl);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapLeaveC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5382;

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
export class MapReloginFrameC2S implements IProtoMsgC2S {

  // 从第几帧开始
  public index: Uint16;
  private MSG_ID: Uint16 = 5383;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.index);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapLoadDoneC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5386;

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
export class MapRefreshSkillC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5388;

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
export class MapGetAllFramesC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5389;

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
export class MapGmAddSkillC2S implements IProtoMsgC2S {

  // 新加技能id
  public id: Uint32;
  private MSG_ID: Uint16 = 5476;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedInt(this.id);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class MapResultC2S implements IProtoMsgC2S {

  // 游戏结果
  public result: Uint8;
  private MSG_ID: Uint16 = 5487;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.result);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class MapStartNotifyS2C {
  public static EVENT_NAME: string = "MapStartNotifyS2C";

  public static decode(byteArray: ByteArray): MapStartNotifyS2C {
    const obj = new MapStartNotifyS2C();
    let len;
    obj.mapId = byteArray.readUnsignedInt();
    obj.seed = byteArray.readUnsignedInt();
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PSynInit.decode(byteArray));
    }
    return obj;
  }

  // 游戏id
  public mapId: Uint32;
  // 随机数种子
  public seed: Uint32;
  // 玩家初始化信息列表
  public list: ProtoType.PSynInit[];
}
export class MapSynS2C {
  public static EVENT_NAME: string = "MapSynS2C";

  public static decode(byteArray: ByteArray): MapSynS2C {
    const obj = new MapSynS2C();
    obj.frame = ProtoType.PSynFrameList.decode(byteArray);
    return obj;
  }

  // 同步帧
  public frame: ProtoType.PSynFrameList;
}
export class MapCloseArenaS2C {
  public static EVENT_NAME: string = "MapCloseArenaS2C";

  public static decode(byteArray: ByteArray): MapCloseArenaS2C {
    const obj = new MapCloseArenaS2C();
    return obj;
  }

}
export class MapChooseSkillS2C {
  public static EVENT_NAME: string = "MapChooseSkillS2C";

  public static decode(byteArray: ByteArray): MapChooseSkillS2C {
    const obj = new MapChooseSkillS2C();
    obj.index = byteArray.readUnsignedShort();
    obj.playerId = byteArray.readDouble();
    obj.id = byteArray.readUnsignedInt();
    return obj;
  }

  // 帧序列
  public index: Uint16;
  // 玩家id
  public playerId: Uint64;
  // 选择的技能id
  public id: Uint32;
}
export class MapGoUpgradeS2C {
  public static EVENT_NAME: string = "MapGoUpgradeS2C";

  public static decode(byteArray: ByteArray): MapGoUpgradeS2C {
    const obj = new MapGoUpgradeS2C();
    let len;
    obj.playerId = byteArray.readDouble();
    obj.jackpot = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.jackpot.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 玩家id
  public playerId: Uint64;
  // 可选技能
  public jackpot: Uint32[];
}
export class MapUpgradeS2C {
  public static EVENT_NAME: string = "MapUpgradeS2C";

  public static decode(byteArray: ByteArray): MapUpgradeS2C {
    const obj = new MapUpgradeS2C();
    let len;
    obj.jackpot = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.jackpot.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 可选技能
  public jackpot: Uint32[];
}
export class MapReloginFrameS2C {
  public static EVENT_NAME: string = "MapReloginFrameS2C";

  public static decode(byteArray: ByteArray): MapReloginFrameS2C {
    const obj = new MapReloginFrameS2C();
    let len;
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PSynFrameList.decode(byteArray));
    }
    return obj;
  }

  // 同步帧列表
  public list: ProtoType.PSynFrameList[];
}
export class MapReloginDoneS2C {
  public static EVENT_NAME: string = "MapReloginDoneS2C";

  public static decode(byteArray: ByteArray): MapReloginDoneS2C {
    const obj = new MapReloginDoneS2C();
    return obj;
  }

}
export class MapPlayerInMapS2C {
  public static EVENT_NAME: string = "MapPlayerInMapS2C";

  public static decode(byteArray: ByteArray): MapPlayerInMapS2C {
    const obj = new MapPlayerInMapS2C();
    return obj;
  }

}
export class MapEnterS2C {
  public static EVENT_NAME: string = "MapEnterS2C";

  public static decode(byteArray: ByteArray): MapEnterS2C {
    const obj = new MapEnterS2C();
    obj.index = byteArray.readUnsignedShort();
    obj.info = ProtoType.PSynInit.decode(byteArray);
    return obj;
  }

  // 帧序列
  public index: Uint16;
  // 玩家初始化信息
  public info: ProtoType.PSynInit;
}
export class MapRefreshSkillS2C {
  public static EVENT_NAME: string = "MapRefreshSkillS2C";

  public static decode(byteArray: ByteArray): MapRefreshSkillS2C {
    const obj = new MapRefreshSkillS2C();
    let len;
    obj.jackpot = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.jackpot.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 可选技能
  public jackpot: Uint32[];
}
export class MapStartBattleS2C {
  public static EVENT_NAME: string = "MapStartBattleS2C";

  public static decode(byteArray: ByteArray): MapStartBattleS2C {
    const obj = new MapStartBattleS2C();
    return obj;
  }

}
export class MapGmAddSkillS2C {
  public static EVENT_NAME: string = "MapGmAddSkillS2C";

  public static decode(byteArray: ByteArray): MapGmAddSkillS2C {
    const obj = new MapGmAddSkillS2C();
    obj.index = byteArray.readUnsignedShort();
    obj.playerId = byteArray.readDouble();
    obj.skillId = byteArray.readUnsignedInt();
    return obj;
  }

  // 帧序列
  public index: Uint16;
  // 玩家id
  public playerId: Uint64;
  // 技能id
  public skillId: Uint32;
}
