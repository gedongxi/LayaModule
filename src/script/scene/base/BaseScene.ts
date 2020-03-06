import Misc from "../../commonUnit/Misc";

export default class BaseScene extends Laya.Script {

  protected mUIRoot: Laya.Sprite = null;

  protected mOwner: Laya.Scene = null;

  public onAwake() {
    Misc.myLog("BaseScene onAwake");

    (this.owner as Laya.Scene).autoDestroyAtClosed = true;

    this.mOwner = this.owner as Laya.Scene;
    this.mUIRoot = this.mOwner.getChildByName("UIRoot") as Laya.Sprite;

    (this.owner as Laya.Scene).onDestroy = () => {
      Laya.Resource.destroyUnusedResources();
    };
  }

  public onDestroy() {
    Misc.myLog("BaseScene onDestroy");
  }
}
