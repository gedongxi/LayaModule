
/**
 * 主场景
 * 2019/11/02
 */
import Misc from "../../commonUnit/Misc";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import BaseScene from "../base/BaseScene";

export default class MainScene extends BaseScene {
  // 初始化一些脚本
  public onAwake() {

    Misc.myLog("======== MainScene onAwake ========");

    super.onAwake();

    this.init();
  }

  public onDestroy() {

    Misc.myLog("======== MainScene onDestroy ========");

    super.onDestroy();
  }

  private init() {

    ResourecLoader.loadPrefabAsyn("prefabs/main/MainUI.prefab", (nod: Laya.Sprite) => {
      if (nod) {
        Misc.myLog("======== MainUI 下载成功 ========");
        const nodUI = nod;
        this.mUIRoot.addChild(nodUI); 
      } else {
        Misc.myLog("======== MainUI 下载失败 ========");
      }
    });
  }
}
