/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗的3D场景
 * tips：
*/

import Misc from "../../../commonUnit/Misc";
import EventUtil from "../../../event/EventUtil";
import { Events } from "../../../event/Event";

export default class FightMap {

  constructor(nodArean: Laya.Sprite) {
    
    Misc.myLog("======== FightMap constructor ========");

    // 通知添加child到rolelayer
    EventUtil.Dispatcher.on(Events.EVENT_ADD_CHILD_TO_ROLELAYER, this, this.onAddChildToRolelayer);

    // 通知添加child到missilelayer
    EventUtil.Dispatcher.on(Events.EVENT_ADD_CHILD_TO_MISSILELAYER, this, this.onAddChildToMissilelayer);

    this.init(nodArean);
  }

  public deconstructor() {

    Misc.myLog("======== FightMap deconstructor ========");

    // 通知添加child到rolelayer
    EventUtil.Dispatcher.off(Events.EVENT_ADD_CHILD_TO_ROLELAYER, this, this.onAddChildToRolelayer);

    // 通知添加child到missilelayer
    EventUtil.Dispatcher.off(Events.EVENT_ADD_CHILD_TO_MISSILELAYER, this, this.onAddChildToMissilelayer);

    // this.mScene3D.destroy();

    this.mScene3D = null;
    this.mSpr3DRoleLayer = null;
    this.mSpr3DMissionLayer = null;
  }

  // 是否已经初始化
  private mIsInitialize: boolean = false;

  // 战斗的3d场景
  private mScene3D: Laya.Scene3D = null;

  // role层
  private mSpr3DRoleLayer: Laya.Sprite3D = null;

  // missile层
  private mSpr3DMissionLayer: Laya.Sprite3D = null;

  // 初始化
  private init(nodArean: Laya.Sprite) {
    if (this.mIsInitialize) {
      return;
    }
    this.mIsInitialize = true;
    this.mScene3D = Laya.loader.getRes("raw/unity_export/TankMapScene.ls");
    // this.mScene3D = Laya.loader.getRes("raw/test/test.ls");
    nodArean.addChild(this.mScene3D);
    // 设置环境光
    this.mScene3D.ambientColor = new Laya.Vector3(0.8, 0.8, 0.8);

    // 创建role层
    this.mSpr3DRoleLayer = new Laya.Sprite3D();
    this.mSpr3DRoleLayer.name = "role_layer";
    this.mScene3D.addChild(this.mSpr3DRoleLayer);

    // 创建missile层
    this.mSpr3DMissionLayer = new Laya.Sprite3D();
    this.mSpr3DMissionLayer.name = "missile_layer";
    this.mScene3D.addChild(this.mSpr3DMissionLayer);

    // 隐藏默认摄像机
    const tSceneCamera: Laya.Camera = this.mScene3D.getChildByName("Main Camera") as Laya.Camera;
    tSceneCamera.active = false;

    // 隐藏默认光
    const tLight: Laya.DirectionLight = this.mScene3D.getChildByName("Directional Light") as Laya.DirectionLight;
    tLight.active = false;

    // 设置接收阴影
    const tTerrain: Laya.MeshSprite3D = this.mScene3D.getChildByName("tanke").getChildByName("Box159") as Laya.MeshSprite3D;
    tTerrain.meshRenderer.receiveShadow = true;    
  }

  // 添加child到rolelayer
  private onAddChildToRolelayer(event: any) {
    const child = event;
    this.mSpr3DRoleLayer.addChild(child);
  }

  // 添加child到rolelayer
  private onAddChildToMissilelayer(event: any) {
    const child = event;
    this.mSpr3DMissionLayer.addChild(child);
  }

  public get Scene3D(): Laya.Scene3D {
    return this.mScene3D;
  }

  public get RoleLayer(): Laya.Sprite3D {
    return this.mSpr3DRoleLayer;
  }

  public get MissileLayer(): Laya.Sprite3D {
    return this.mSpr3DMissionLayer;
  }
}
