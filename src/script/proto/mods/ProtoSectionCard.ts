// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class CardOwnedC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5633;

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
export class CardGroupC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 5634;

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
export class CardSwapC2S implements IProtoMsgC2S {

  // 卡组id 1-5
  public groupId: Uint8;
  // 交换的卡牌1
  public cardSite1: Uint8;
  // 交换的卡牌2
  public cardSite2: Uint8;
  private MSG_ID: Uint16 = 5635;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.groupId);
    byteArray.writeByte(this.cardSite1);
    byteArray.writeByte(this.cardSite2);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class CardEquipC2S implements IProtoMsgC2S {

  // 卡组id
  public groupId: Uint8;
  // 卡牌装备位置
  public cardSite: Uint8;
  // 请求装备的卡牌
  public cardId: Uint32;
  private MSG_ID: Uint16 = 5636;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.groupId);
    byteArray.writeByte(this.cardSite);
    byteArray.writeUnsignedInt(this.cardId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class CardSetGroupNameC2S implements IProtoMsgC2S {

  // 卡组id
  public groupId: Uint8;
  // 卡组名字
  public groupName: string;
  private MSG_ID: Uint16 = 5637;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.groupId);
    byteArray.writeUTF(this.groupName);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class CardSetGroupOnC2S implements IProtoMsgC2S {

  // 设置的卡组id
  public groupId: Uint8;
  private MSG_ID: Uint16 = 5638;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeByte(this.groupId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class CardOwnedS2C {
  public static EVENT_NAME: string = "CardOwnedS2C";

  public static decode(byteArray: ByteArray): CardOwnedS2C {
    const obj = new CardOwnedS2C();
    let len;
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(byteArray.readUnsignedInt());
    }
    return obj;
  }

  // 已拥有卡牌列表
  public list: Uint32[];
}
export class CardGroupS2C {
  public static EVENT_NAME: string = "CardGroupS2C";

  public static decode(byteArray: ByteArray): CardGroupS2C {
    const obj = new CardGroupS2C();
    let len;
    obj.on = byteArray.readUnsignedByte();
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PCardGroup.decode(byteArray));
    }
    return obj;
  }

  // 当前使用卡组
  public on: Uint8;
  // 卡组列表
  public list: ProtoType.PCardGroup[];
}
export class CardSwapS2C {
  public static EVENT_NAME: string = "CardSwapS2C";

  public static decode(byteArray: ByteArray): CardSwapS2C {
    const obj = new CardSwapS2C();
    obj.groupId = byteArray.readUnsignedByte();
    obj.card1 = ProtoType.PCard.decode(byteArray);
    obj.card2 = ProtoType.PCard.decode(byteArray);
    return obj;
  }

  // 卡组id 1-5
  public groupId: Uint8;
  // 交换的卡牌1
  public card1: ProtoType.PCard;
  // 交换的卡牌2
  public card2: ProtoType.PCard;
}
export class CardEquipS2C {
  public static EVENT_NAME: string = "CardEquipS2C";

  public static decode(byteArray: ByteArray): CardEquipS2C {
    const obj = new CardEquipS2C();
    obj.groupId = byteArray.readUnsignedByte();
    obj.equiped = ProtoType.PCard.decode(byteArray);
    return obj;
  }

  // 卡组id
  public groupId: Uint8;
  // 装备的卡牌
  public equiped: ProtoType.PCard;
}
export class CardSetGroupNameS2C {
  public static EVENT_NAME: string = "CardSetGroupNameS2C";

  public static decode(byteArray: ByteArray): CardSetGroupNameS2C {
    const obj = new CardSetGroupNameS2C();
    obj.groupId = byteArray.readUnsignedByte();
    obj.groupName = byteArray.readUTF();
    return obj;
  }

  // 卡组id
  public groupId: Uint8;
  // 卡组名字
  public groupName: string;
}
export class CardSetGroupOnS2C {
  public static EVENT_NAME: string = "CardSetGroupOnS2C";

  public static decode(byteArray: ByteArray): CardSetGroupOnS2C {
    const obj = new CardSetGroupOnS2C();
    obj.groupId = byteArray.readUnsignedByte();
    return obj;
  }

  // 设置的卡组id
  public groupId: Uint8;
}
