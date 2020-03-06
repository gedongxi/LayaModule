
/*
 * author:陈晓亮
 * date: 2019/12/24
 * desc：适配组件 类似ccc的CCWidget
 * tips：不支持改变节点尺寸，因此：
 *       TOP / BOTTOM / VerticalCenter只能共存一个
 *       LEFT / RIGHT / HorizontalCenter 只能存在一个
*/

import BaseComponent from "../scene/base/BaseComponent";


export class WidgetComp extends BaseComponent {

  /**
   * TOP  BOTTOM  VerticalCenter 只能存在一个值
   * 优先级： VerticalCenter > TOP > BOTTOM
   */
  // Top
  /** @prop {name: IsTop, tips:"是否对齐父节点顶边", type:Boolean} */
  public isAlignTop: boolean;

  /** @prop {name: Top, tips:"本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用", type:Number} */
  public topValue: number;

  // Bottom
  /** @prop {name: IsBottom, tips:"是否对齐父节点底边", type:Boolean} */
  public isAlignBottom: boolean;

  /** @prop {name: Bottom, tips:"本节点顶边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用", type:Number} */
  public bottomValue: number;

  // VerticalCenter
  /** @prop {name: IsVerticalCenter, tips:"是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消", type:Boolean} */
  public isAlignVerticalCenter: boolean;

  /** @prop {name: VerticalCenter, tips:"垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用", type:Number} */
  public verticalCenterValue: number;

  /**
   * LEFT  RIGHT  HorizontalCenter 只能存在一个值
   * 优先级： HorizontalCenter > LEFT > RIGHT
   */
  // Left
  /** @prop {name: IsLeft, tips:"是否对齐父节点左边", type:Boolean} */
  public isAlignLeft: boolean;

  /** @prop {name: Left, tips:"本节点顶边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用", type:Number} */
  public leftValue: number;

  // Right
  /** @prop {name: IsRight, tips:"是否对齐父节点右边", type:Boolean} */
  public isAlignRight: boolean;

  /** @prop {name: Right, tips:"本节点顶边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用", type:Number} */
  public rightValue: number;

  // HorizontalCenter
  /** @prop {name: IsHorizontalCenter, tips:"是否水平方向对齐中点，开启此项会将水平方向其他对齐选项取消", type:Boolean} */
  public isAlignHorizontalCenter: boolean;

  /** @prop {name: HorizontalCenter, tips:"水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用", type:Number} */
  public horizontalCenterValue: number;

  
  public onAwake() {

    const owner: Laya.Sprite = this.owner as Laya.Sprite;
    const parent: Laya.Sprite = this.owner.parent as Laya.Sprite;
    if (!parent) {
      console.error(" ############### 不存在父节点 ############### ", this.owner.name);
      return;
    }

    const parentWidth = parent.width;
    const parentHeight = parent.height;
    const ownerWidth = owner.width;
    const ownerHeight = owner.height;

    if (this.isAlignHorizontalCenter) {
      owner.x = (parentWidth - ownerWidth) >> 1 + owner.pivotX + this.verticalCenterValue;
    } else if (this.isAlignLeft) {
      owner.x = owner.pivotX + this.leftValue;
    } else if (this.isAlignRight) {
      owner.x = parentWidth - (ownerWidth - owner.pivotX) + this.rightValue;
    }

    if (this.isAlignVerticalCenter) {
      owner.y = (parentHeight - ownerHeight) >> 1 + owner.pivotY + this.horizontalCenterValue;
    } else if (this.isAlignTop) {
      owner.y = owner.pivotY + this.topValue;
    } else if (this.isAlignBottom) {
      owner.y = parentHeight - (ownerHeight - owner.pivotY) + this.bottomValue;
    }
  }
}


// // Left
// if (this.isAlignLeft) {
//   this.alignFlags |= EUIAlignFlag.ALIGN_LEFT;
// }

// // Bottom
// if (this.isAlignRight) {
//   this.alignFlags |= EUIAlignFlag.ALIGN_RIGHT;
// }

// // 开启此项会将水平方向其他对齐选项取消
// if (this.isAlignHorizontalCenter) {
//   this.isAlignLeft  = false;
//   this.isAlignRight = false;
//   this.alignFlags &= ~EUIAlignFlag.ALIGN_LEFT;
//   this.alignFlags &= ~EUIAlignFlag.ALIGN_RIGHT;
//   this.alignFlags |= EUIAlignFlag.ALIGN_CENTER;
// }

// // TOP
// if (this.isAlignTop) {
//   this.alignFlags |= EUIAlignFlag.ALIGN_TOP;
// }

// // Bottom
// if (this.isAlignBottom) {
//   this.alignFlags |= EUIAlignFlag.ALIGN_BOTTOM;
// }

// // 开启此项会将垂直方向其他对齐选项取消
// if (this.isAlignVerticalCenter) {
//   this.isAlignTop    = false;
//   this.isAlignBottom = false;
//   this.alignFlags &= ~EUIAlignFlag.ALIGN_TOP;
//   this.alignFlags &= ~EUIAlignFlag.ALIGN_BOTTOM;
//   this.alignFlags |= EUIAlignFlag.ALIGN_MIDDLE;
// }
