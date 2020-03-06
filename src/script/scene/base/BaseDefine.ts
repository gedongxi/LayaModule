
export const FRAME_INTERVAL_TIME_MILLI = 66;  // 逻辑帧长度(毫秒)

export const ROTATION_RATIO = 3;        // 同步的角度和实际角度比例

export const SELF_MOVE_CIRCLE = 0.5;


// 游戏资源的设计分辨率
export const DesignResolutionWidth  = 720;
export const DesignResolutionHeight = 1280;

// 分帧加载list时，单次加载数量
export const LoadBatchCount = 1;
export const LoadBatchInterval = 0.05;
export const LoadBatchInterval2 = 0.1;

// widget的类型
export const WidgetTop    = 1 << 0;
export const WidgetBottom = 1 << 1;
export const WidgetLeft   = 1 << 2;
export const WidgetRight  = 1 << 3;


export interface IProtoError {
  errCode: number;
  errMsg: string;
  protoName: string;
}

export const PosList = [
  [1, 0, 7],
  [-3, 0, 6],
  [1, 0, -1],
  [-2, 0, -10],
  [8, 0, 5],
];

// 对其数据
export interface IWidgetSize {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

// 配置文件的游戏资源目录
export const RESOURCE_CONFIG_PATH_ROOT = "config/";

// 配置文件的游戏资源目录
export const RESOURCE_FONT_PATH_ROOT = "font/";

// 游戏中的场景名字
export enum EGameSceneName {
  TransitionScene      = "TransitionScene",
  InitScene            = "InitScene",
  LoginScene           = "LoginScene",
  MainScene            = "MainScene",
  FightScene           = "FightScene",
}

// 游戏中的场景路径
export enum EGameSceneDir {
  TransitionScene      = "transition/TransitionScene.scene",
  InitScene            = "init/InitScene.scene",
  LoginScene           = "login/LoginScene.scene",
  MainScene            = "main/MainScene.scene",
  FightScene           = "fight/FightScene.scene",
}

export enum EUIAlignFlag {

  NULL    = 0,

  LEFT    = 1 << 0,    // 靠左
  RIGHT   = 1 << 1,    // 靠右
  MIDDLE  = 1 << 2,    // 左右居中

  TOP     = 1 << 3,    // 靠上
  BOTTOM  = 1 << 4,    // 靠下
  CENTER  = 1 << 5,    // 上下居中
}

export interface IAlignInfo {

  left?: number;
  right?: number;
  mid?: number;

  top?: number;
  bottom?: number;
  center?: number;
}

// 对象池的名字
export enum EPoolName {
  Toast            = "Toast",
  Alert            = "Alert",
  Loading          = "Loading",
}

// 预制路径
export enum EPrefabUrl {
  Toast            = "prefabs/commonUI/ToastComp.prefab",
}

// 适配类型
export enum EResolutionPolicy {
  FixedWidth  = 1,
  FixedHeight = 2,
}

export class DiffTime {
  public mDiffDay: number  = 0;
  public mDiffHour: number = 0;
  public mDiffMinute: number = 0;
  public mDiffSecond: number = 0;
}

// 对象池的名字
export enum ETankAnimationName {
  Idle           = "idle",
  Run            = "run",
  Attack         = "attack",
  Dead           = "dead",
}
















