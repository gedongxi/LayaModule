import GameCtl from "./GameCtl";
import { EResolutionPolicy, EPrefabUrl, EPoolName } from "./base/BaseDefine";
import Misc from "../commonUnit/Misc";
import I18N from "../i18n/I18N";
import UIText from "../i18n/UIText";
import ResourecLoader from "../commonUnit/ResourceLoader";
import AlertComp from "../commonUI/AlertComp";
import { ZORDER_UI_LAYER_BANNER } from "./base/IUI";

export default class GamePersist extends Laya.Script {

  private static singleInstance: GamePersist;

  private pfbToast: Laya.Prefab = null;
  private pfbAlert: Laya.Prefab = null;
  private pfbLoading: Laya.Prefab = null;

  public static New() {
    if (GamePersist.singleInstance) {
      Misc.myWarn(" GamePersist 只能存在一个实例 ");
      return;
    }

    // 做为常驻节点
    GamePersist.singleInstance = Laya.stage.addComponent(GamePersist);
  }

  // 全局变量
  public static get INSTANCE(): GamePersist {
    return GamePersist.singleInstance;
  }

  public onAwake() {

    Misc.myLog(" ############# GamePersist onAwake #############");

    // 协议错误
    // EventUtil.Dispatcher.on(Events.EVENT_PROTO_DEBUG, this, this.onRespDebug);
    // Laya.stage.frameRate = "slow";

    this.init();
  }

  public onDestroy() {
    Misc.myLog(" ############# GamePersist onDestroy #############");
  }

  // public initPersistUINode() {
  //     const tUINode = new Laya.Sprite();
  //     Laya.stage.addChild(tUINode);

  //     // 之前不能忍项目的适配方法
  //     if (GameCtl.INSTANCE.ResolutionPolicy === EResolutionPolicy.FixedHeight) {
  //         tUINode.size(Laya.stage.height * 1280 / 720, Laya.stage.height);
  //         tUINode.x = (Laya.stage.width - Laya.stage.height * 1280 / 720) / 2;
  //         tUINode.scale(Laya.stage.height / 720, Laya.stage.height / 720);
  //     } else if (GameCtl.INSTANCE.ResolutionPolicy === EResolutionPolicy.FixedWidth) {

  //         tUINode.size(Laya.stage.width, Laya.stage.width * 720 / 1280);
  //         tUINode.y = (Laya.stage.height - Laya.stage.width * 720 / 1280) / 2;
  //         tUINode.scale(Laya.stage.width / 1280, Laya.stage.width / 1280);
  //     }
  // }

  private init() {

    Laya.Shader3D.debugMode = true;

    this.preloadPersistResource();

    i18n.uiText = UIText;

    // // 预加载资源
    // const resource: string[] = [
    //     EPrefabUrl.Toast,
    // ];
    // await ResourecLoader.proloadRes(resource);
    // this.onPreLoadFinish();

    GameCtl.INSTANCE.init();

    // NetCtl.INSTANCE.createNetHandler();

    // 加载fps元素
    ResourecLoader.loadFileAsyn("prefabs/commonUI/FpsComp.prefab", (res: Laya.Prefab) => {
      const tSprFps: Laya.Sprite = res.create();
      this.owner.addChild(tSprFps);
      tSprFps.zOrder = ZORDER_UI_LAYER_BANNER;
    });

  }

  private preloadPersistResource() {
    // 同步加载 loading 预制
    // ResourecLoader.loadFileAsyn("", (res: Laya.Prefab) => {
    //   this.pfbLoading = res;
    //   Laya.Pool.recover(EPoolName.Loading, res.create());
    // });

    // 同步加载 toast 预制
    ResourecLoader.loadFileAsyn("prefabs/commonUI/ToastComp.prefab", (res: Laya.Prefab) => {
      if (res) {
        Misc.myLog(" ========== Toast预制下载成功 ========== ");
        this.pfbToast = res;
        for (let i = 0; i < 5; i++) {
          Laya.Pool.recover(EPoolName.Toast, res.create());
        }
      } else {
        Misc.myLog(" ========== Toast预制下载失败 ========== ");
      }

    });

    ResourecLoader.loadFileAsyn("prefabs/commonUI/AlertComp.prefab", (res: Laya.Prefab) => {
      if (res) {
        Misc.myLog(" ========== Alert 预制下载成功 ========== ");
        this.pfbAlert = res;
        Laya.Pool.recover(EPoolName.Alert, res.create());
      } else {
        Misc.myLog(" ========== Alert 预制下载失败 ========== ");
      }

    });
  }

  public showWaiting() {

  }

  public hideWaiting() {

  }

  public showAlert(textId: string, titleId?: string, ...args) {

    const node: Laya.Sprite = Laya.Pool.getItem(EPoolName.Alert);

    Misc.myLog("showAlert -- node", node);

    if (!GameCtl.INSTANCE.RootUI || !node) {
      return null;
    }

    let tStrText = "";
    let tStrTitle = "";

    if (args.length > 0) {
      tStrText = Misc.stringReplaceById(textId, ...args);
    } else {
      tStrText = I18N.getUIText(textId);
    }

    if (titleId) {
      tStrTitle = I18N.getUIText(titleId);
    }
    GameCtl.INSTANCE.RootUI.showAlert(node, tStrText, tStrTitle);
    return AlertComp.GetComponent(node);
  }

  public showToast(textId: string, ...args) {

    const node: Laya.Sprite = Laya.Pool.getItem(EPoolName.Toast);

    Misc.myLog("showToast -- node", node);

    if (!GameCtl.INSTANCE.RootUI || !node) {
      return null;
    }

    let tStrText = "";
    if (args.length > 0) {
      tStrText = Misc.stringReplaceById(textId, ...args);
    } else {
      tStrText = I18N.getUIText(textId);
    }
    GameCtl.INSTANCE.RootUI.showToast(node, tStrText);
  }

  // private onRespDebug(event: any) {
  //     const protoName = "proto_section_" + event.protoMsgSection;
  //     const errProto: any = {};
  //     errProto.errCode = event.errCode;
  //     errProto.errMsg = event.errMsg;
  //     errProto.protoName = protoName;
  //     errProto.eventName = event.eventName;
  //     Misc.myLog("=====协议错误====", protoName, "=======", errProto);
  //     this.showToast("common_text10000", event.errMsg);
  // }

  // private onPreLoadFinish() {
  //     const tToast =  Laya.Loader.getRes(EPrefabUrl.Toast);
  //     for (let i = 0; i < 15; i++) {
  //         Laya.Pool.recover(EPoolName.Toast, tToast.create());
  //     }
  // }
}
