import BaseFullPanel from "./BaseFullPanel";
import { IRootUI, ZORDER_UI_LAYER_PANEL, ZORDER_UI_LAYER_POPPANEL, ZORDER_UI_LAYER_ALERT, ZORDER_UI_LAYER_TOAST, ZORDER_UI_LAYER_WAITING} from "./IUI";
import { EUIAlignFlag } from "./BaseDefine";
import GameCtl from "../GameCtl";
import ToastComp from "../../commonUI/ToastComp";
import AlertComp from "../../commonUI/AlertComp";
import UIUtil from "../../commonUnit/UIUtil";


// 所有场景入口UI的基类

export default class BaseUI extends BaseFullPanel implements IRootUI {
  public panelLayer: Laya.Sprite = null;
  public poppanelLayer: Laya.Sprite = null;
  public contaninerPanel: Laya.Sprite = null;
  private toastLayer: Laya.Sprite = null;
  private loadingLayer: Laya.Sprite = null;
  private alertLayer: Laya.Sprite = null;
  private tipsLayer: Laya.Sprite = null;

  /*
  ================
  生命周期回调
  ================
  */

  // pIsNotAdaptation参数 不需要适配与否
  public onAwake(pIsNotAdaptation?: boolean) {

    GameCtl.INSTANCE.RootUI = this;

    super.onAwake();

    const owner =  (this.owner as Laya.Sprite);
    owner.width = Laya.stage.width;
    owner.height = Laya.stage.height;

    // panel layer
    this.panelLayer = new Laya.Sprite();
    this.owner.addChild(this.panelLayer);
    this.panelLayer.zOrder = ZORDER_UI_LAYER_PANEL;
    this.panelLayer.width = Laya.stage.width;
    this.panelLayer.height = Laya.stage.height;


    // pop panel layer
    this.poppanelLayer = new Laya.Sprite();
    this.owner.addChild(this.poppanelLayer);
    this.poppanelLayer.zOrder = ZORDER_UI_LAYER_POPPANEL;
    this.poppanelLayer.width = Laya.stage.width;
    this.poppanelLayer.height = Laya.stage.height;

    // alert layer
    this.alertLayer = new Laya.Sprite();
    this.owner.addChild(this.alertLayer);
    this.alertLayer.zOrder = ZORDER_UI_LAYER_ALERT;
    this.alertLayer.width = Laya.stage.width;
    this.alertLayer.height = Laya.stage.height;

    // toast layer
    this.toastLayer = new Laya.Sprite();
    this.owner.addChild(this.toastLayer);
    this.toastLayer.zOrder = ZORDER_UI_LAYER_TOAST;
    this.toastLayer.width = Laya.stage.width;
    this.toastLayer.height = Laya.stage.height;

    // tips layer 
    this.tipsLayer = new Laya.Sprite();
    this.owner.addChild(this.tipsLayer);
    this.tipsLayer.zOrder = ZORDER_UI_LAYER_TOAST;
    this.tipsLayer.width = Laya.stage.width;
    this.tipsLayer.height = Laya.stage.height;

    // waiting layer
    this.loadingLayer = new Laya.Sprite();
    this.owner.addChild(this.loadingLayer);
    this.loadingLayer.zOrder = ZORDER_UI_LAYER_WAITING;
    this.loadingLayer.width = Laya.stage.width;
    this.loadingLayer.height = Laya.stage.height;
  }

  public onDestroy() {
    super.onDestroy();
    GameCtl.INSTANCE.RootUI = null;
  }

  public getPanelLayer(): Laya.Sprite {
    return this.panelLayer;
  }

  // 显示面板
  public showPanel(panelNode: Laya.Sprite) {
    
    // 先addchild
    this.owner.addChild(panelNode);

    // 再设置对其
    UIUtil.setWidget(panelNode, EUIAlignFlag.MIDDLE | EUIAlignFlag.CENTER);
  }

  // 显示pop panel 面板
  public showPopPanel(panelNode: Laya.Sprite) {
    this.owner.addChild(panelNode);
  }

  // 销毁panel中的节点 
  public destroyPanel() {
    this.panelLayer.removeChildren();
  }

  // ================================================
  // 显示loading
  public showWaiting(node: Laya.Sprite, msg?: string, immediate?: boolean) {
    // const waiting = LoadingComp.GetComponent(node);
    // node.parent = this.waitingLayer;
    // waiting.show(msg, immediate);
  }

  // 显示飘字
  public showToast(node: Laya.Sprite, message: string) {
    this.toastLayer.addChild(node);
    const toast: ToastComp = ToastComp.GetComponent(node);
    toast.setToastMessage(message);
  }

  // 显示Alter
  public showAlert(nodAlert: Laya.Sprite, message: string, title?: string) {
    const alertComp = AlertComp.GetComponent(nodAlert);
    this.alertLayer.addChild(nodAlert);
    alertComp.setAlertMessage(message);
    if (void 0 !== title) {
      alertComp.setAlertTitle(title);
    }
    // nodAlert.x = (DesignResolutionWidth - nodAlert.width) / 2;
    // nodAlert.y = (DesignResolutionHeight - nodAlert.height) / 2;
  }
}
