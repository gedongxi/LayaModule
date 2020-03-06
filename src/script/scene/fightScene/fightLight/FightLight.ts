import Misc from "../../../commonUnit/Misc";
import { ECampType } from "../FightDefine";

export default class FightLight {

  constructor(scene3D: Laya.Scene3D) {
    
    Misc.myLog("======== FightLight constructor ========");


    this.init(scene3D);
  }

  public deconstructor() {

    Misc.myLog("======== FightLight deconstructor ========");

    this.mLight = null;
  }

  // 是否已经初始化
  private mIsInitialize: boolean = false;

  // 摄像机
  private mLight: Laya.LightSprite = null;

  private init(scene3D: Laya.Scene3D) {

    if (this.mIsInitialize) {
      return;
    }
    this.mIsInitialize = true;

    // 创建平行光
    const tLight: Laya.DirectionLight = new Laya.DirectionLight();
    this.mLight = tLight;
    scene3D.addChild(tLight);

    // 设置平行光的方向
    const mat = tLight.transform.worldMatrix;
    mat.setForward(new Laya.Vector3(1, -1, 1));
    tLight.transform.worldMatrix = mat;

    tLight.color = new Laya.Vector3(1, 1, 1);
    tLight.shadow = true;
    tLight.intensity = 1.8;
    tLight.shadowDistance = 60;
    tLight.shadowResolution = 2048;
    tLight.shadowPSSMCount = 1;
    tLight.shadowPCFType = 3;
    // 设置漫反射光
    tLight.diffuseColor = new Laya.Vector3(0.4, 0.4, 0.4);
  }

  public get Light(): Laya.LightSprite {
    return this.mLight;
  }

  public setLightRotation(pNumX: number, pNumY: number, pNumZ: number) {
    const mat = this.mLight.transform.worldMatrix;
    mat.setForward(new Laya.Vector3(pNumX, pNumY, pNumZ));

    const ratation = new Laya.Matrix4x4();

    mat.decomposeTransRotMatScale(new Laya.Vector3(), ratation, new Laya.Vector3());

    console.log("光线ratation", ratation);
    this.mLight.transform.worldMatrix = mat;
    
    // this.mLight.transform.rotate(new Laya.Vector3(pNumX, pNumY, 0));
  }
}
