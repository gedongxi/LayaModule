
/**
 * 登录场景
 * 2019/11/02
 */
import Misc from "../../commonUnit/Misc";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import BaseScene from "../base/BaseScene";

export default class LoginScene extends BaseScene {

  public onAwake() {

    Misc.myLog("======== LoginScene onAwake ========");

    super.onAwake();

    this.init();
  }

  public onDestroy() {
    
    Misc.myLog("======== InitScene onDestroy ========");

    super.onDestroy();
  }

  private init() {
    // 加载initui
    ResourecLoader.loadPrefabAsyn("prefabs/login/LoginUI.prefab", (nod: Laya.Sprite) => {
      if (nod) {
        Misc.myLog("======== LoginUI 下载成功 ========");
        const nodUI = nod;
        this.mUIRoot.addChild(nodUI); 
      } else {
        Misc.myLog("======== LoginUI 下载失败 ========");
      }
    });
  }
}
