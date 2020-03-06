export const UI_LAYER_POP_TIPS: string  = "node-ui-pop-tips";
export const UI_LAYER_WAITING: string   = "node-ui-layer-waiting";

export const ZORDER_UI_LAYER_NEWS: number     = 99;
export const ZORDER_UI_LAYER_PANEL: number    = 100;
export const ZORDER_UI_LAYER_POPPANEL: number = 101;
export const ZORDER_UI_LAYER_PET_TIPS: number = 102;
export const ZORDER_UI_LAYER_GUIDE: number    = 103;
export const ZORDER_UI_LAYER_ALERT: number    = 104;
export const ZORDER_UI_LAYER_TOAST: number    = 105;
export const ZORDER_UI_LAYER_TIMER: number    = 106;
export const ZORDER_UI_LAYER_WAITING: number  = 107;
// export const ZORDER_UI_LAYER_TOKEN: number    = 108;

// banner广告 最高层级
export const ZORDER_UI_LAYER_BANNER: number   = 250;

// export interface IPanel {
//   ViewNode(): Laya.Sprite;
// }

export interface IRootUI {

 // ui tip feature
 showToast(node: Laya.Sprite, msg: string);
 showWaiting(node: Laya.Sprite, msg?: string, immediate?: boolean);
 showAlert(node: Laya.Sprite, msg: string, title?: string);

 // panel feature
 showPopPanel(panelNode: Laya.Sprite);
 showPanel(panelNode: Laya.Sprite);
 destroyPanel();

 // panel节点获取
 getPanelLayer(): Laya.Sprite;
}
