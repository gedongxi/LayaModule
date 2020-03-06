import BaseUI from "../base/BaseUI";
import Misc from "../../commonUnit/Misc";
import UIUtil from "../../commonUnit/UIUtil";
import { EUIAlignFlag } from "../base/BaseDefine";

export default class TransitionUI extends BaseUI {

  // 初始化一些脚本
  public onAwake() {
    
    Misc.myLog("======== TransitionUI onAwake ========");

    super.onAwake();

    this.init();
  }

  public onDestroy() {

    Misc.myLog("======== TransitionUI onDestroy ========");
    
    super.onDestroy();
  }

  private init() {
    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);
  }
}
