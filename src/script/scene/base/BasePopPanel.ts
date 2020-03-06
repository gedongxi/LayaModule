/**
 * desc：弹框ui基类
 * 2019/11/02
 */

import BaseComponent from "./BaseComponent";
import { DesignResolutionWidth, DesignResolutionHeight } from "./BaseDefine";

export default class BasePopPanel extends BaseComponent { // implements IPanel {

  // 半透明适配背景
  protected nodAdaptationBg: Laya.Sprite = null;

  // public ViewNode(): Laya.Sprite {
  //   return this.owner as Laya.Sprite;
  // }

  
  public onAwake() {
    super.onAwake();

    const bg = new Laya.Box();
    bg.width = DesignResolutionWidth;
    bg.height = DesignResolutionHeight;
    bg.alpha = 0.8;
    bg.bgColor = "#000000";
    bg.mouseEnabled = true;
    bg.mouseThrough = true;
    this.nodAdaptationBg = bg;
    
    const parent = this.owner.parent;
    parent.addChildAt(bg, parent.getChildIndex(this.owner));
  }

  public onDestroy() {
    super.onDestroy();
  }

  // 设置适配背景的透明度
  public setAdaptationBgOpacity(opacity: number) {
    this.nodAdaptationBg.alpha = opacity;
  }

  // 是否开启触摸关闭界面
  public setTouchEndClosePanel(touch: boolean, callFun?: Function) {
    const func = (event) => {
      event.stopPropagation();
      if (!!callFun) {
        callFun();
      }
      this.onBtnClose();
    };
    if (touch) {
      this.nodAdaptationBg.on(Laya.Event.CLICK, this, func);
    } else {
      this.nodAdaptationBg.off(Laya.Event.CLICK, this, func);
    }
  }

  public onBtnClose() {
    this.nodAdaptationBg.destroy();
    this.owner.destroy();
     
  }
}

