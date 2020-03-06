// Auto Generated. Please don't change manually!

import { ByteArray } from "../../commonUnit/NetByteArray";
import { Int16, Int32, Int64, Int8, IProtoMsgC2S, Uint16, Uint32, Uint64, Uint8 } from "../ProtoDefine";
import * as ProtoType from "../ProtoType";
import * as ProtoCrypto from "../ProtoCrypto";

export class WeaponSelectWeaponC2S implements IProtoMsgC2S {

  // 选择武器
  public weaponId: Uint32;
  private MSG_ID: Uint16 = 6145;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedInt(this.weaponId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class WeaponWeaponInfoC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6146;

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
export class WeaponCarInfoC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6147;

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
export class WeaponSlotInfoC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6148;

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
export class WeaponGetWeaponC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6149;

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
export class WeaponGetCarC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6150;

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
export class WeaponGetSlotC2S implements IProtoMsgC2S {

  private MSG_ID: Uint16 = 6151;

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
export class WeaponUpgradeWeaponC2S implements IProtoMsgC2S {

  // 武器id
  public weaponId: Uint16;
  private MSG_ID: Uint16 = 6152;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.weaponId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class WeaponUpgradeCarC2S implements IProtoMsgC2S {

  // 车身id
  public carId: Uint16;
  private MSG_ID: Uint16 = 6153;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.carId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}
export class WeaponUpdateSlotC2S implements IProtoMsgC2S {

  // 槽位id
  public slotId: Uint16;
  // 武器id
  public weaponId: Uint16;
  // 车身id
  public carId: Uint16;
  private MSG_ID: Uint16 = 6154;

  public encode(): ByteArray {
    const byteArray = new ByteArray();

    byteArray.writeUnsignedShort(0);
    byteArray.writeByte(0);
    byteArray.writeUnsignedShort(this.MSG_ID);
    byteArray.writeUnsignedShort(this.slotId);
    byteArray.writeUnsignedShort(this.weaponId);
    byteArray.writeUnsignedShort(this.carId);
    byteArray.position = 0;
    byteArray.writeUnsignedShort(byteArray.length - 2);
    return byteArray;
  }

}

export class WeaponSelectWeaponS2C {
  public static EVENT_NAME: string = "WeaponSelectWeaponS2C";

  public static decode(byteArray: ByteArray): WeaponSelectWeaponS2C {
    const obj = new WeaponSelectWeaponS2C();
    obj.weaponId = byteArray.readUnsignedInt();
    return obj;
  }

  // 选择武器
  public weaponId: Uint32;
}
export class WeaponWeaponInfoS2C {
  public static EVENT_NAME: string = "WeaponWeaponInfoS2C";

  public static decode(byteArray: ByteArray): WeaponWeaponInfoS2C {
    const obj = new WeaponWeaponInfoS2C();
    let len;
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PWeapon.decode(byteArray));
    }
    return obj;
  }

  // 武器列表
  public list: ProtoType.PWeapon[];
}
export class WeaponCarInfoS2C {
  public static EVENT_NAME: string = "WeaponCarInfoS2C";

  public static decode(byteArray: ByteArray): WeaponCarInfoS2C {
    const obj = new WeaponCarInfoS2C();
    let len;
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PCar.decode(byteArray));
    }
    return obj;
  }

  // 车身列表
  public list: ProtoType.PCar[];
}
export class WeaponSlotInfoS2C {
  public static EVENT_NAME: string = "WeaponSlotInfoS2C";

  public static decode(byteArray: ByteArray): WeaponSlotInfoS2C {
    const obj = new WeaponSlotInfoS2C();
    let len;
    obj.list = new Array();
    len = byteArray.readShort();
    for (let i = 0; i < len; i++) {
      obj.list.push(ProtoType.PSlot.decode(byteArray));
    }
    return obj;
  }

  // 槽位列表
  public list: ProtoType.PSlot[];
}
export class WeaponGetWeaponS2C {
  public static EVENT_NAME: string = "WeaponGetWeaponS2C";

  public static decode(byteArray: ByteArray): WeaponGetWeaponS2C {
    const obj = new WeaponGetWeaponS2C();
    obj.weapon = ProtoType.PWeapon.decode(byteArray);
    return obj;
  }

  // 获得武器
  public weapon: ProtoType.PWeapon;
}
export class WeaponGetCarS2C {
  public static EVENT_NAME: string = "WeaponGetCarS2C";

  public static decode(byteArray: ByteArray): WeaponGetCarS2C {
    const obj = new WeaponGetCarS2C();
    obj.car = ProtoType.PCar.decode(byteArray);
    return obj;
  }

  // 获得车身
  public car: ProtoType.PCar;
}
export class WeaponGetSlotS2C {
  public static EVENT_NAME: string = "WeaponGetSlotS2C";

  public static decode(byteArray: ByteArray): WeaponGetSlotS2C {
    const obj = new WeaponGetSlotS2C();
    obj.slot = ProtoType.PSlot.decode(byteArray);
    return obj;
  }

  // 获得槽位
  public slot: ProtoType.PSlot;
}
export class WeaponUpgradeWeaponS2C {
  public static EVENT_NAME: string = "WeaponUpgradeWeaponS2C";

  public static decode(byteArray: ByteArray): WeaponUpgradeWeaponS2C {
    const obj = new WeaponUpgradeWeaponS2C();
    obj.weapon = ProtoType.PWeapon.decode(byteArray);
    return obj;
  }

  // 升级武器
  public weapon: ProtoType.PWeapon;
}
export class WeaponUpgradeCarS2C {
  public static EVENT_NAME: string = "WeaponUpgradeCarS2C";

  public static decode(byteArray: ByteArray): WeaponUpgradeCarS2C {
    const obj = new WeaponUpgradeCarS2C();
    obj.car = ProtoType.PCar.decode(byteArray);
    return obj;
  }

  // 升级车身
  public car: ProtoType.PCar;
}
export class WeaponUpdateSlotS2C {
  public static EVENT_NAME: string = "WeaponUpdateSlotS2C";

  public static decode(byteArray: ByteArray): WeaponUpdateSlotS2C {
    const obj = new WeaponUpdateSlotS2C();
    obj.slot = ProtoType.PSlot.decode(byteArray);
    return obj;
  }

  // 更新槽位
  public slot: ProtoType.PSlot;
}
