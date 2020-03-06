import { RoomDispatcher, WeaponDispatcher } from "../../proto/ProtoDispatcher";
import Misc from "../../commonUnit/Misc";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
import { ProtoSection } from "../../proto/ProtoReflect";
import { WeaponSelectWeaponS2C } from "../../proto/mods/ProtoSectionWeapon";
import DataPlayer from "../../data/DataPlayer";


export default class WeaponNetHandler {

  constructor() {
    // 选择武器返回
    WeaponDispatcher.on(WeaponSelectWeaponS2C.EVENT_NAME, this, this.handleWeaponSelectWeaponS2C);
  }

  // 选择武器返回
  private handleWeaponSelectWeaponS2C(event: any) {
    const msg: WeaponSelectWeaponS2C = event;
    Misc.myLog(" ############ 选择武器返回 ############ ", msg);
    DataPlayer.INSTANCE.WeaponId = msg.weaponId;
    EventUtil.Dispatcher.event(Events.EVENT_MAIN_SELECT_WEAPON_BACK, msg.weaponId);
  }
}
