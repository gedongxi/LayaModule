// Auto Generate. Don't Change manually

import { ByteArray } from "../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, Uint16, Uint32, Uint64, Uint8 } from "./ProtoDefine";

// 玩家信息
export class PPlayer {

  public static decode(byteArray: ByteArray): PPlayer {
    const obj = new PPlayer();
    obj.id = byteArray.readDouble();
    obj.name = byteArray.readUTF();
    obj.sex = byteArray.readUnsignedByte();
    obj.lvl = byteArray.readUnsignedInt();
    obj.weapon = byteArray.readUnsignedInt();
    return obj;
  }

  // 玩家id
  public id: Uint64;
  // 名称
  public name: string;
  // 性别
  public sex: Uint8;
  // 玩家等级
  public lvl: Uint32;
  // 武器
  public weapon: Uint32;
}

// 同步初始化
export class PSynInit {

  public static decode(byteArray: ByteArray): PSynInit {
    const obj = new PSynInit();
    let len;
    obj.playerId = byteArray.readDouble();
    obj.playerName = byteArray.readUTF();
    obj.xpos = byteArray.readUnsignedInt();
    obj.ypos = byteArray.readUnsignedInt();
    obj.rotation = byteArray.readUnsignedByte();
    obj.weapon = byteArray.readUnsignedInt();
    obj.camp = byteArray.readUnsignedByte();
    obj.skill = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.skill.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 玩家id
  public playerId: Uint64;
  // 玩家姓名
  public playerName: string;
  // 坐标
  public xpos: Uint32;
  // 坐标
  public ypos: Uint32;
  // 角度
  public rotation: Uint8;
  // 武器
  public weapon: Uint32;
  // 阵营
  public camp: Uint8;
  // 技能
  public skill: Uint32[];
}

// 同步帧
export class PSynFrame {

  public static decode(byteArray: ByteArray): PSynFrame {
    const obj = new PSynFrame();
    obj.xspeed = byteArray.readUnsignedByte();
    obj.yspeed = byteArray.readUnsignedByte();
    obj.rotation = byteArray.readUnsignedByte();
    obj.skillRotation = byteArray.readUnsignedByte();
    obj.operator = byteArray.readUnsignedByte();
    obj.ejectRatio = byteArray.readUnsignedByte();
    return obj;
  }

  // 速度
  public xspeed: Uint8;
  // 速度
  public yspeed: Uint8;
  // 角度
  public rotation: Uint8;
  // 技能角度
  public skillRotation: Uint8;
  // 操作
  public operator: Uint8;
  // 抛射比例
  public ejectRatio: Uint8;
}

// 同步帧列表
export class PSynFrameList {

  public static decode(byteArray: ByteArray): PSynFrameList {
    const obj = new PSynFrameList();
    let len;
    obj.index = byteArray.readUnsignedShort();
    obj.frame = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.frame.push(PSynFrame.decode(byteArray));
    }
    return obj;
  }

  // 帧序列
  public index: Uint16;
  // 帧
  public frame: PSynFrame[];
}

// 同步技能列表
export class SkillFrame {

  public static decode(byteArray: ByteArray): SkillFrame {
    const obj = new SkillFrame();
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

// 卡组
export class PCardGroup {

  public static decode(byteArray: ByteArray): PCardGroup {
    const obj = new PCardGroup();
    let len;
    obj.groupId = byteArray.readUnsignedByte();
    obj.groupName = byteArray.readUTF();
    obj.cardList = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.cardList.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 卡组id
  public groupId: Uint8;
  // 卡组名字
  public groupName: string;
  // 卡片id列表
  public cardList: Uint32[];
}

// 卡组中的卡牌
export class PCard {

  public static decode(byteArray: ByteArray): PCard {
    const obj = new PCard();
    obj.site = byteArray.readUnsignedByte();
    obj.cardId = byteArray.readUnsignedInt();
    return obj;
  }

  // 卡牌在卡组中的位置
  public site: Uint8;
  // 卡牌id
  public cardId: Uint32;
}

// 武器
export class PWeapon {

  public static decode(byteArray: ByteArray): PWeapon {
    const obj = new PWeapon();
    obj.weaponId = byteArray.readUnsignedShort();
    obj.weaponLvl = byteArray.readUnsignedByte();
    return obj;
  }

  // 武器id
  public weaponId: Uint16;
  // 武器等级
  public weaponLvl: Uint8;
}

// 车身
export class PCar {

  public static decode(byteArray: ByteArray): PCar {
    const obj = new PCar();
    obj.carId = byteArray.readUnsignedShort();
    obj.carLvl = byteArray.readUnsignedByte();
    return obj;
  }

  // 车身id
  public carId: Uint16;
  // 车身等级
  public carLvl: Uint8;
}

// 槽位
export class PSlot {

  public static decode(byteArray: ByteArray): PSlot {
    const obj = new PSlot();
    obj.slotId = byteArray.readUnsignedShort();
    obj.weaponId = byteArray.readUnsignedShort();
    obj.carId = byteArray.readUnsignedShort();
    obj.status = byteArray.readUnsignedByte();
    return obj;
  }

  // 槽位id
  public slotId: Uint16;
  // 武器id
  public weaponId: Uint16;
  // 车身id
  public carId: Uint16;
  // 是否正在使用 0否1是
  public status: Uint8;
}

// 物品
export class PItem {

  public static decode(byteArray: ByteArray): PItem {
    const obj = new PItem();
    obj.id = byteArray.readUnsignedShort();
    obj.number = byteArray.readUnsignedShort();
    return obj;
  }

  // 物品id
  public id: Uint16;
  // 物品数量
  public number: Uint16;
}
