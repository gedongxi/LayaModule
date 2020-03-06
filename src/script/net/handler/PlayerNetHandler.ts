import { PlayerDispatcher } from "../../proto/ProtoDispatcher";
import { PlayerSelfInfoS2C, PlayerFortuneS2C} from "../../proto/mods/ProtoSectionPlayer";
import DataPlayer from "../../data/DataPlayer";
import Misc from "../../commonUnit/Misc";

export default class PlayerNetHandler {
  constructor() {
    PlayerDispatcher.on(PlayerSelfInfoS2C.EVENT_NAME, this, this.handlePlayerSelfInfo);
  }

  // 玩家自己的信息
  private handlePlayerSelfInfo(event: any) {
    // console.log("handlePlayerSelfInfo", data);
    const respData: PlayerSelfInfoS2C = event;
    console.log("===============用户信息========", respData);

    DataPlayer.INSTANCE.PlayerId     = respData.player.id;
    DataPlayer.INSTANCE.PlayerLv     = respData.player.lvl;
    DataPlayer.INSTANCE.WeaponId     = respData.player.weapon;
  }

}
