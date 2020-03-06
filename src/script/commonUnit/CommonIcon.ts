/**
 * 王秋月
 * 2019/11/08
 * 通用图片加载方法
 */
import BaseComponent from "../scene/base/BaseComponent";

export default class CommonIcon extends BaseComponent {
  public static GetComponent(pNode: Laya.Sprite): CommonIcon {
    return pNode.getComponent(CommonIcon);
  }

  // 图片路径
  private mStrIconDir: string;
  // 图片
  private mSprIcon: Laya.Sprite;
  // 创建图片后回调
  private mCallBack: Function;

  // 参数提示： pStrDir：图片路径  callback：图片设置成功后回调（PS: 设置大小setCommonIconSize和对齐方式setCommonIconWidget需在在callback里调用）
  public static New(pStrDir: string, callback: Function = null): CommonIcon {
    const tSprIcon: Laya.Sprite = new Laya.Sprite();
    const tCommonIconShow = tSprIcon.addComponent(CommonIcon);
    tCommonIconShow.initCommonIcon(pStrDir, tSprIcon, callback);
    return tCommonIconShow;
  }

  private mX: number = 0;
  private mY: number = 0;

  // 初始化数据
  public initCommonIcon(pStrIconDir: string, pSprIcon: Laya.Sprite, callback: Function) {
    this.mStrIconDir = pStrIconDir;
    this.mSprIcon = pSprIcon;
    this.mCallBack = callback;
  }

  public onAwake() {
    // 加载图片后 执行回调
    this.mSprIcon.loadImage(this.mStrIconDir, Laya.Handler.create(this, () => {
      if (!!this.mCallBack) {
        this.mCallBack();
      }
    }));
  }

  // 设置scale
  public setCommonIconScale(pNumScale: number, pNumScale2?: number) {
    const tChangeWidth = this.mSprIcon.width * pNumScale;
    const tChangeHeight = !!pNumScale2 ? this.mSprIcon.height * pNumScale2 : this.mSprIcon.height * pNumScale;
    this.mSprIcon.width = tChangeWidth;
    this.mSprIcon.height = tChangeHeight;
  }

  // 设置大小 pX 
  public setCommonIconSize(pX: number, pY: number) {
    this.mX = pX;
    this.mY = pY;
    if (this.mSprIcon.width === 0) {
      return;
    }
    this.setLastSize();
  }

  // 根据x y 进行最后调整
  public setLastSize() {
    if (this.mX === 0 && this.mY !== 0) {
      // 根据y调整大小
      this.setCommonIconScale(this.mY / this.mSprIcon.height);
    } else if (this.mY === 0 && this.mX !== 0) {
      // 根据x调整大小
      this.setCommonIconScale(this.mX / this.mSprIcon.width);
    } else if (this.mX !== 0 && this.mY !== 0) {
      // x,y各自调整大小
      this.setCommonIconScale(this.mX / this.mSprIcon.width, this.mY / this.mSprIcon.height);
    }
  }
}
