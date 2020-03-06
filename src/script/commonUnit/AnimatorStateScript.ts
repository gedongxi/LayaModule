import Misc from "./Misc";
// 动画事件状态脚本

export default class AnimatorStateScript extends Laya.AnimatorStateScript {
  public mStateName: string = "";

  public mEndFunc: Laya.Handler = null;

  public setEndFunc(pFunc: Laya.Handler) {
    // Misc.myLog("############动画设置回调");
    this.mEndFunc = pFunc;
  }

  public onStateEnter(): void {
    // Misc.myLog("#######动画 onStateEnter", this.mStateName);
  }

  public onStateUpdate(): void {

  }

  // 上一个动画状态被中断（同个动画切换 该方法不执行）
  public onStateInterrupt(): void {
    // Misc.myLog("#######动画 onStateInterrupt", this.mStateName);
  }

  public onStateExit(): void {
    // Misc.myLog("#######动画 onStateExit", this.mStateName, this.mEndFunc);

    if (this.mEndFunc) {
      const pEndFunc = this.mEndFunc;
      this.mEndFunc = null;
      pEndFunc.run();
    }
  }
}
