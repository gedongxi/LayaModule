import BaseUI from "../base/BaseUI";
import GameCtl from "../GameCtl";
import { EGameSceneName, EUIAlignFlag } from "../base/BaseDefine";
import Misc from "../../commonUnit/Misc";
import CommonIcon from "../../commonUnit/CommonIcon";
import UIUtil from "../../commonUnit/UIUtil";

export default class MainUI extends BaseUI {
  // 初始化一些脚本
  public onAwake() {

    Misc.myLog("======== MainUI onAwake ========");

    super.onAwake();

    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);

    const nodBottom = this.owner.getChildByName("nodBottom");
    UIUtil.setWidget(nodBottom, EUIAlignFlag.BOTTOM, {bottom: -100});

    const tBtnFight = nodBottom.getChildByName("btnFight") as Laya.Button;
    tBtnFight.on(Laya.Event.CLICK, this, this.onBtnFight);

    this.init();
  }

  public onDestroy() {

    Misc.myLog("======== MainUI onDestroy ========");

    super.onDestroy();
  }

  private init() {

    // 测试使用
    this.loadImg();

    // // 测试使用
    // ShaderCompileVariant.INSTANCE.start(null);
  }
  
  private onBtnFight() {
    GameCtl.INSTANCE.loadNextScene(EGameSceneName.FightScene);
  }

  // 加载一张图
  private loadImg() {

    // 测试测试
    const tCommonIcon: CommonIcon = CommonIcon.New("../laya/assets/comp/image.png", () => {
      tCommonIcon.setCommonIconSize(300, 0);
    });
    this.owner.addChild(tCommonIcon.owner);

    // 测试测试
    // const tImg = new Laya.Image();
    // tImg.skin = "../laya/assets/tempUI/operate/attack-bg.png";
    // this.owner.addChild(tImg);
  }
}
