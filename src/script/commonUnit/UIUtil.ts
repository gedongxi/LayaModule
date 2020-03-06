import { EUIAlignFlag, IAlignInfo } from "../scene/base/BaseDefine";


export default class UIUtil {

  /**
   * 相对于ui父节点定位ui位置
   * @param owner     : 自身
   * @param alignFlag : 格式为 EUIAlignFlag.ALIGN_LEFT | EUIAlignFlag.ALIGN_TOP | ...
   * @param objAlign  : 该方向上的相对位置偏差(往右为正 往左为负 往下为正 往上为负)
   */
  public static setWidget(node: Laya.Node, alignFlag: number, objAlign: IAlignInfo = {}) {
    const parent = node.parent as Laya.Sprite;
    if (!parent) {
      return;
    }

    const owner: Laya.Sprite = node as Laya.Sprite;

    // 获取实际大小
    const parentWidth = parent.width;
    const parentHeight = parent.height;
    const ownerWidth = owner.width;
    const ownerHeight = owner.height;

    if (alignFlag & EUIAlignFlag.MIDDLE) {
      const deltaX = objAlign.mid ? objAlign.mid : 0;
      owner.x = (parentWidth - ownerWidth) >> 1 + owner.pivotX + deltaX;
    } else if (alignFlag & EUIAlignFlag.LEFT) {
      const deltaX = objAlign.left ? objAlign.left : 0;
      owner.x = owner.pivotX + deltaX;
    } else if (alignFlag & EUIAlignFlag.RIGHT) {
      const deltaX = objAlign.right ? objAlign.right : 0;
      owner.x = parentWidth - (ownerWidth - owner.pivotX) + deltaX;
    }

    if (alignFlag & EUIAlignFlag.CENTER) {
      const deltaY = objAlign.center ? objAlign.center : 0;
      owner.y = (parentHeight - ownerHeight) >> 1 + owner.pivotY + deltaY;
    } else if (alignFlag & EUIAlignFlag.TOP) {
      const deltaY = objAlign.top ? objAlign.top : 0;
      owner.y = owner.pivotY + deltaY;
    } else if (alignFlag & EUIAlignFlag.BOTTOM) {
      const deltaY = objAlign.bottom ? objAlign.bottom : 0;
      owner.y = parentHeight - (ownerHeight - owner.pivotY) + deltaY;
    }
  }
}
