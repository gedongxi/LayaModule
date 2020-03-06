/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗场景
 * tips：
*/

import BaseScene from "../base/BaseScene";
import Misc from "../../commonUnit/Misc";
import FightPreloadUI from "./fightUI/FightPreloadUI";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import FightCtl from "./FightCtl";

export default class FightScene extends BaseScene {

  private mSprFightUI: Laya.Sprite = null;

  private mSprFightPreloadUI: Laya.Sprite = null;
  
  // 初始化一些脚本
  public onAwake() {
    
    Misc.myLog("======== FightScene onAwake ========");
    
    super.onAwake();
    
    this.init();
  }

  public onDestroy() {
    
    Misc.myLog("======== FightScene onDestroy ========");

    super.onDestroy();

    FightCtl.INSTANCE.deconstructor();

    const compPreloadUI: FightPreloadUI = this.mSprFightPreloadUI.getComponent(FightPreloadUI);
    compPreloadUI.releaseFightResource();
  }

  private init() {

    FightCtl.INSTANCE.init();

    ResourecLoader.loadPrefabAsyn("prefabs/fight/fightUI/FightPreloadUI.prefab", (nodPreloadUI: Laya.Sprite) => {
      if (nodPreloadUI) {
        Misc.myLog("======== FightPreloadUI 下载成功 ========");
        this.mSprFightPreloadUI = nodPreloadUI;
        nodPreloadUI.zOrder = 10000; 
        this.mUIRoot.addChild(nodPreloadUI);
        const compPreloadUI: FightPreloadUI = nodPreloadUI.getComponent(FightPreloadUI);
        compPreloadUI.init(() => {
          this.onResourcePreloadComplete();
        });
        
      } else {
        Misc.myLog("======== FightPreloadUI 下载失败 ========");
      }
    });
  }

  // 资源加载完成
  private onResourcePreloadComplete() {

    Misc.myLog(" ======== 战斗预加载资源完成 ======== ");

    this.mSprFightPreloadUI.removeSelf();
    FightCtl.INSTANCE.startFight(); 

    // 显示主ui
    const pfbFightUI: Laya.Prefab = Laya.loader.getRes("prefabs/fight/FightUI.prefab");
    const nodFightUI: Laya.Sprite = pfbFightUI.create();
    this.mSprFightUI = nodFightUI;
    nodFightUI.zOrder = 1;
    this.mUIRoot.addChild(nodFightUI);

    // 初始话3D场景
    const nodArean = nodFightUI.getChildByName("nodArean") as Laya.Sprite;
    FightCtl.INSTANCE.initScene3D(nodFightUI, nodArean);
  }
}
