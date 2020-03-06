/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗显示层的控制器
 * tips：
*/

import Misc from "../../commonUnit/Misc";
import FightCamera from "./fightCamera/FightCamera";
import FightLight from "./fightLight/FightLight";
import FightMap from "./fightMap/FightMap";
import { EFightStatus } from "./FightDefine";

export default class FightCtl {

  // 单例
  private static singleInstance: FightCtl;
  public static get INSTANCE(): FightCtl {
    if (!FightCtl.singleInstance) {
      FightCtl.singleInstance = new FightCtl();
    }
    return FightCtl.singleInstance;
  }

  constructor() {

  }

  public deconstructor() {

    // 摄像机
    if (this.mFightCamera) {
      this.mFightCamera.deconstructor();
      this.mFightCamera = null;
    }

    // 灯光
    if (this.mFightLight) {
      this.mFightLight.deconstructor();  
      this.mFightLight = null;
    }


    // 3D场景
    if (this.mFightMap) {
      this.mFightMap.deconstructor(); 
      this.mFightMap = null;
    }

    
    FightCtl.singleInstance = null;
  }


  // 决斗场
  private nodArean: Laya.Sprite = null;

  // 战斗基础ui node
  private nodFightUI: Laya.Sprite = null;

  // 3D地图场景
  private mFightMap: FightMap = null;

  // 摄像机
  private mFightCamera: FightCamera = null;

  // 设置灯光
  private mFightLight: FightLight = null;

  
  // 当前战斗状态
  private mNumCurFightStatus: EFightStatus = EFightStatus.FightNone;

  // 初始化
  public init() {

    Misc.myLog(" ======== FightCtl init ======== ");
    
    // view层控制器 进入准备阶段
    this.preFight();
  }

  public initScene3D(nodBattleUI: Laya.Sprite, nodArean: Laya.Sprite) {
    
    this.nodArean = nodArean;
    this.nodFightUI = nodBattleUI;

    // 3D场景
    this.mFightMap = new FightMap(nodArean);

    // 摄像机
    this.mFightCamera = new FightCamera(this.mFightMap.Scene3D);

    // 灯光
    this.mFightLight = new FightLight(this.mFightMap.Scene3D);
  }

  // 准备战斗
  public preFight() {

    Misc.myLog(" ======== FightCtl preFight ======== ");

    this.mNumCurFightStatus = EFightStatus.FightPre;
  }

  // 开始战斗
  public startFight() {
    
    Misc.myLog(" ======== FightCtl startFight ======== ");

    this.mNumCurFightStatus = EFightStatus.FightIng;
  }

  // 结束战斗
  public endFight() {
    
    Misc.myLog(" ======== FightCtl endFight ======== ");

    this.mNumCurFightStatus = EFightStatus.FightEnd;
    // this.mLSCtl.endLSFight();

  }


  
  // 当前战斗状态
  public get FightStatus(): EFightStatus {
    return this.mNumCurFightStatus;
  }

  // 3d场景
  public get FightMap(): FightMap {
    return this.mFightMap;
  }
  public get Scene3D(): Laya.Scene3D {
    return this.mFightMap.Scene3D;
  }

  // 摄像机
  public get FightCamera(): FightCamera {
    return this.mFightCamera;
  }
  public get Camera(): Laya.Camera {
    return this.mFightCamera.Camera;
  }


  // 光
  public get FightLight(): FightLight {
    return this.mFightLight;
  }

  // 决斗场容器节点
  public get AreanNode() {
    return this.nodArean;
  }

  // fightUI实例
  public get FightUI() {
    return this.nodFightUI;
  }
}
