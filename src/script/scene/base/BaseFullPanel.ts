/**
 * desc：全屏ui基类
 *  2019/11/02
 */

import BaseComponent from "./BaseComponent";

export default class BaseFullPanel extends BaseComponent { // implements IPanel {

  // public ViewNode(): Laya.Sprite {
  //   return this.owner as Laya.Sprite;
  // }
  
  public onAwake() {
    
    super.onAwake();

    const owner =  (this.owner as Laya.Sprite);
    owner.width = Laya.stage.width;
    owner.height = Laya.stage.height;
  }

  public onDestroy() {
    super.onDestroy();

  }
  public onBtnClose() {
    this.owner.destroy();
  }
}

