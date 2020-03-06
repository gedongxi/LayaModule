import BaseComponent from "../scene/base/BaseComponent";
import { EPoolName, EUIAlignFlag } from "../scene/base/BaseDefine";
import UIUtil from "../commonUnit/UIUtil";


export default class ToastComp extends BaseComponent {
  public static GetComponent(node: Laya.Sprite): ToastComp {
    return node.getComponent(ToastComp);
  }

  // 内容
  private labText: Laya.Label = null;

  // 背景
  public imgBG: Laya.Image = null;

  public onAwake() {

    super.onAwake();
    this.imgBG = this.owner.getChildByName("imgBG") as Laya.Image;
    this.labText = this.owner.getChildByName("labText") as Laya.Label;
    
  }

  public onStart() {
    
  }

  public onDestroy() {
    super.onDestroy();
  }

  public onDisable() {
  }

  public setToastMessage(message: string) {

    this.labText.text = message;
    // 文字居中
    this.labText.x = 60;
    this.labText.y = 20;
    
    this.imgBG.width = this.labText.width + 120;
    this.imgBG.height = this.labText.height + 40;

    const owner = this.owner as Laya.Sprite;
    owner.alpha = 1.0; 
    owner.width = this.imgBG.width;
    owner.height = this.imgBG.height; 

    // 居中
    UIUtil.setWidget(this.owner as Laya.Sprite, EUIAlignFlag.MIDDLE | EUIAlignFlag.CENTER);
    
    Laya.Tween.to(this.owner, {y: -70, alpha: 0}, 1300, null, Laya.Handler.create(this, () => {
      Laya.Pool.recover(EPoolName.Toast, owner);
      owner.removeSelf();
    }), 600);
  }
}
