/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗正式开始前的资源和逻辑预加载
 * tips：
*/

import Misc from "../../../commonUnit/Misc";
import ResourecLoader from "../../../commonUnit/ResourceLoader";
import ShaderCompileVariant from "../fightShader/ShaderCompileVariant";
import UIUtil from "../../../commonUnit/UIUtil";
import { EUIAlignFlag } from "../../base/BaseDefine";
import BaseFullPanel from "../../base/BaseFullPanel";

export default class FightPreloadUI extends BaseFullPanel {

  public static GetComponent(nod: Laya.Sprite): FightPreloadUI {
    return nod.getComponent(FightPreloadUI);
  }


  private callbackPreloadDone: Function = null;

  private mArrFight2DResource: string[] = [];
  private mArrFight3DResource: string[] = [];

  public onAwake() {
    Misc.myLog("======== FightPreloadUI onAwake ========");
    super.onAwake();

    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);
  }

  public onDestroy() {
    Misc.myLog("======== FightPreloadUI onDestroy ========");
    super.onDestroy();

    this.mArrFight2DResource.length = 0;
    this.mArrFight2DResource = null;

    this.mArrFight3DResource.length = 0;
    this.mArrFight3DResource = null;
  }

  public onEnable() {
    Misc.myLog("======== FightPreloadUI onEnable ========");
  }

  public onDisable() {
    Misc.myLog("======== FightPreloadUI onDisable ========");
  }

  public init(callbackFun: Function) {

    this.callbackPreloadDone = callbackFun;

    // 预加载资源
    this.mArrFight2DResource = [
      
      // perfab file
      "prefabs/fight/FightUI.prefab",
    ];
      
    this.mArrFight3DResource = [

      // unity export file
      "raw/unity_export/TankMapScene.ls",
    ];

    // 此处需要深度复制， Laya.loader.create函数内部会改变resourceList数据
    const resourceList = [];
    for (let i = 0, lenght = this.mArrFight2DResource.length; i < lenght; i++) {
      resourceList.push(this.mArrFight2DResource[i]);
    }
    for (let i = 0, lenght = this.mArrFight3DResource.length; i < lenght; i++) {
      resourceList.push(this.mArrFight3DResource[i]);
    }

    const self = this;

    ResourecLoader.loadResListAsyn(resourceList, (result: boolean) => {

      if (result) {

        Misc.myLog(" ~~~~~~~~~~~~~~~~~~~~ 战斗资源加载 success ~~~~~~~~~~~~~~~~~~~~ ");

        if (self.callbackPreloadDone) {
          self.callbackPreloadDone();
        }
        
        // ShaderCompileVariant.INSTANCE.start(() => {
        //   if (self.callbackPreloadDone) {
        //     self.callbackPreloadDone();
        //   }
        // });
      } else {
        Misc.myLog(" ~~~~~~~~~~~~~~~~~~~~ 战斗资源加载 fail  ~~~~~~~~~~~~~~~~~~~~ ");
      }
    });
  }


  public releaseFightResource() {
    const length = this.mArrFight3DResource.length;
    for (let i = 0; i < length; i++) {
      const tStrFileName = this.mArrFight3DResource[i];
      Misc.myLog("释放资源", tStrFileName);
      const res = Laya.loader.getRes(tStrFileName);      
      res.destroy();
    }
  }
}
