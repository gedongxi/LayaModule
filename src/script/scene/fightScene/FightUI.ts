/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗场景主UI
 * tips：
*/

import BaseUI from "../base/BaseUI";
import Misc from "../../commonUnit/Misc";
import UIUtil from "../../commonUnit/UIUtil";
import { EUIAlignFlag, EGameSceneName } from "../base/BaseDefine";
import GameCtl from "../GameCtl";

export default class FightUI extends BaseUI {


  // 初始化一些脚本
  public onAwake() {

    Misc.myLog("======== FightUI onAwake ========");

    super.onAwake();

    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);

    const nodBottom = this.owner.getChildByName("nodBottom");
    UIUtil.setWidget(nodBottom, EUIAlignFlag.BOTTOM, {bottom: -100});

    const tBtnLeave = nodBottom.getChildByName("btnLeave") as Laya.Button;
    tBtnLeave.on(Laya.Event.CLICK, this, this.onBtnLeave);

    this.init();

  }

  public onDestroy() {

    Misc.myLog("======== FightUI onDestroy ========");
    
    super.onDestroy();
  }

  private init() {

    // 注册触摸事件
    Laya.MouseManager.multiTouchEnabled = true;
    this.owner.on(Laya.Event.MOUSE_DOWN, this, this.onTouchStart);
    this.owner.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
    this.owner.on(Laya.Event.MOUSE_OUT, this, this.onTouchEnd);
    this.owner.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd);
  }

  private onBtnLeave() {
    GameCtl.INSTANCE.loadNextScene(EGameSceneName.MainScene);
  }

  private onTouchStart(event: Laya.Event) {

    const tNumX: number = event.stageX;
    const tNumY: number = event.stageY;
  }

  private onTouchMove(event: Laya.Event) {

  }

  private onTouchEnd(event: Laya.Event) {

  }
}
