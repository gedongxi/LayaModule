
/**
 * Init场景
 * 2019/11/02
 */
import BaseScene from "../base/BaseScene";
import Misc from "../../commonUnit/Misc";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import { EGameSceneName, EGameSceneDir } from "../base/BaseDefine";

export default class TransitionScene extends BaseScene {

  // 下一个场景
  public static NextSceneName: EGameSceneName = null;

  // 初始化一些脚本
  public onAwake() {
    
    Misc.myLog("======== TransitionScene onAwake ========");
    
    super.onAwake();
    
    this.init();
  }

  public onDestroy() {
    
    Misc.myLog("======== TransitionScene onDestroy ========");

    super.onDestroy();
  }

  private init() {

    Misc.myLog(" ~~~~~~~~~~~~~~~~~~ 切换场景 ~~~~~~~~~~~~~~~~~~ ", TransitionScene.NextSceneName, EGameSceneDir[TransitionScene.NextSceneName]);

    // 加载 initui
    ResourecLoader.loadPrefabAsyn("prefabs/transition/TransitionUI.prefab", (nod: Laya.Sprite) => {
      if (nod) {
        // Misc.myLog("======== TransitionUI 下载成功 ========");
        const nodUI = nod;
        this.mUIRoot.addChild(nodUI); 
      } else {
        Misc.myLog("======== TransitionUI 下载失败 ========");
      }
    });

    Laya.timer.once(1000, this, () => {
      Laya.Scene.destroy(EGameSceneDir[EGameSceneName.TransitionScene]);
      Laya.Scene.open(EGameSceneDir[TransitionScene.NextSceneName]);
    });
  }
}
