import BaseUI from "../base/BaseUI";
import GameCtl from "../GameCtl";
import Misc from "../../commonUnit/Misc";
import { EGameSceneName, EUIAlignFlag } from "../base/BaseDefine";
import * as ConfigEntry from "../../config/ConfigEntry";
import UIUtil from "../../commonUnit/UIUtil";

export default class InitUI extends BaseUI {

  // 初始化一些脚本
  public onAwake() {
    
    Misc.myLog("======== InitUI onAwake ========");

    super.onAwake();

    this.init();
  }

  public onDestroy() {

    Misc.myLog("======== InitUI onDestroy ========");
    
    super.onDestroy();
  }

  private init() {

    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);

    ConfigEntry.loadAll( () => {
      GameCtl.INSTANCE.loadNextScene(EGameSceneName.LoginScene);
    });
  }
}
