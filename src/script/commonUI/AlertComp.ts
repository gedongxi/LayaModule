import BaseComponent from "../scene/base/BaseComponent";
import { EPoolName, EUIAlignFlag } from "../scene/base/BaseDefine";
import UIUtil from "../commonUnit/UIUtil";
export default class AlertComp extends BaseComponent {
  
  public static GetComponent(node: Laya.Sprite): AlertComp {
    return node.getComponent(AlertComp);
  }

  // 显示内容
  private labMessage: Laya.Label = null;       

  // 显示标题
  private labTitle: Laya.Label = null;        

  // 确认按钮
  private btnOk: Laya.Button = null;              

  // 取消按钮
  private btnCancel: Laya.Button = null;


  private mTarget: any = null;
  private mOkCallback: Function = null;
  private mCancelCallback: Function = null;

  public onAwake() {
    super.onAwake();
    UIUtil.setWidget(this.owner as Laya.Sprite, EUIAlignFlag.MIDDLE | EUIAlignFlag.CENTER);

    this.labTitle = this.owner.getChildByName("labTitle") as Laya.Label;
    this.labMessage = this.owner.getChildByName("labMessage") as Laya.Label;

    this.btnOk = this.owner.getChildByName("btnOk") as Laya.Button;
    this.btnOk.on(Laya.Event.CLICK, this, this.onBtnOkCallback);

    this.btnCancel = this.owner.getChildByName("btnCancel") as Laya.Button;
    this.btnCancel.on(Laya.Event.CLICK, this, this.onBtnCancelCallback);
  } 
  
  public onEnable() {
  }

  public onDestroy() {
    super.onDestroy();
  }

  public onDisable() {

    this.mTarget = null;
    this.mOkCallback = null;
    this.mCancelCallback = null;
    this.labMessage.text = "";
    this.labTitle.text = "";
  }

  // 设置显示内容
  public setAlertMessage(pStrText: string) {
    this.labMessage.text = pStrText;
  }

  // 设置显示标题
  public setAlertTitle(pStrTitle: string) {
    this.labTitle.text = pStrTitle;
  }

  /* 设置ok按钮回调
    * 注意：如果不设置 target 的值，那么callback一定要传入“箭头式函数”
  */
  public setOkBtnCallback(callback: () => void, target?: any) {
    this.mOkCallback = callback;
    if (target) {
      this.mTarget = target;
    }
  }

  /* 设置cancel按钮回调
  * 注意：如果不设置 target 的值，那么callback一定要传入“箭头式函数”
  */
  public setCancelBtnCallback(callback: () => void, target?: any) {
      this.mCancelCallback = callback;
      if (target) {
        this.mTarget = target;
      }
  }

  // ok 按钮
  private onBtnOkCallback() {
    if (this.mOkCallback) {
      if (this.mTarget) {
        this.mOkCallback.call(this.mTarget);
      } else {
        this.mOkCallback();
      }
    }

    Laya.Pool.recover(EPoolName.Alert, this.owner);

    this.owner.removeSelf();
  }

  // cancel 按钮
  private onBtnCancelCallback() {
    if (this.mCancelCallback) {
      if (this.mTarget) {
        this.mCancelCallback.call(this.mTarget);
      } else {
        this.mCancelCallback();
      }
    }

    Laya.Pool.recover(EPoolName.Alert, this.owner);

    this.owner.removeSelf();
  }
}
