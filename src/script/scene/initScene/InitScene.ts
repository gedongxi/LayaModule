
/**
 * Init场景
 * 2019/11/02
 */
import BaseScene from "../base/BaseScene";
import Misc from "../../commonUnit/Misc";
import ResourecLoader from "../../commonUnit/ResourceLoader";

export default class InitScene extends BaseScene {
  // 初始化一些脚本
  public onAwake() {
    
    Misc.myLog("======== InitScene onAwake ========");
    
    super.onAwake();
    
    this.init();
  }

  public onDestroy() {
    
    Misc.myLog("======== InitScene onDestroy ========");

    super.onDestroy();
  }

  private init() {
    // 加载initui
    ResourecLoader.loadPrefabAsyn("prefabs/init/InitUI.prefab", (nod: Laya.Sprite) => {
      if (nod) {
        Misc.myLog("======== InitUI 下载成功 ========");
        const nodUI = nod;
        this.mUIRoot.addChild(nodUI); 
      } else {
        Misc.myLog("======== InitUI 下载失败 ========");
      }
    });
  }
}
