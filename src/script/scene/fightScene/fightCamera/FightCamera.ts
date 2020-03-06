/*
 * author:陈晓亮
 * date: 2019/11/19
 * desc：战斗场景的摄像机
 * tips：
*/

import Misc from "../../../commonUnit/Misc";
import EventUtil from "../../../event/EventUtil";
import { Events } from "../../../event/Event";
import { ECampType } from "../FightDefine";

// 摄像机初始的平移和旋转
// const CAMERA_TRANSFORM_POS    = new Laya.Vector3(0, 40.7, 32);
// const CAMERA_TRANSFORM_ROTATE = new Laya.Vector3(-52, 0, 0);

const CAMERA_TRANSFORM_POS_CAMP1    = new Laya.Vector3(0, 40.7, -32);
const CAMERA_TRANSFORM_ROTATE_CAMP1 = new Laya.Vector3(-52, 180, 0);

const CAMERA_TRANSFORM_POS_CAMP2    = new Laya.Vector3(0, 40.7, 32);
const CAMERA_TRANSFORM_ROTATE_CAMP2 = new Laya.Vector3(-52, 0, 0);

export default class FightCamera {

  constructor(scene3D: Laya.Scene3D) {
    
    Misc.myLog("======== FightCamera constructor ========");

    // 监听玩家自身移动时，摄像机跟随移动
    EventUtil.Dispatcher.on(Events.EVENT_MYSELF_TRANSFORM_CHANGED, this, this.onCameraFollowMyself);

    this.init(scene3D);
  }

  public deconstructor() {

    Misc.myLog("======== FightCamera deconstructor ========");

    EventUtil.Dispatcher.off(Events.EVENT_MYSELF_TRANSFORM_CHANGED, this, this.onCameraFollowMyself);
    
    this.mCamera3D = null;
    this.mRotationMartix = null;
    this.mCurFollowPosition = null;
  }

  // 是否已经初始化
  private mIsInitialize: boolean = false;

  // 摄像机
  private mCamera3D: Laya.Camera = null;

  // 摄像机的旋转矩阵
  private mRotationMartix: Laya.Matrix4x4 = new Laya.Matrix4x4();

  // 当前的位置
  private mCurFollowPosition: Laya.Vector3 = new Laya.Vector3();

  private init(scene3D: Laya.Scene3D) {
    if (this.mIsInitialize) {
      return;
    }

    // 初始化摄像机
    const tCamera = new Laya.Camera(0, 0.3, 100) as Laya.Camera;
    this.mCamera3D = tCamera;
    scene3D.addChild(tCamera);
    tCamera.transform.translate(CAMERA_TRANSFORM_POS_CAMP1);
    tCamera.transform.rotate(CAMERA_TRANSFORM_ROTATE_CAMP1, true, false);
    
    tCamera.clearColor = new Laya.Vector4(0, 0, 0, 1);
    tCamera.orthographic = false;
    // tCamera.orthographic = true;
    // tCamera.orthographicVerticalSize = 16;
    tCamera.fieldOfView = 13;
    tCamera.transform.worldMatrix.decomposeTransRotMatScale(new Laya.Vector3(), this.mRotationMartix, new Laya.Vector3());

    
  }

  public get Camera(): Laya.Camera {
    return this.mCamera3D;
  }
  
  public get CameraRotationMartix(): Laya.Matrix4x4 {
    return this.mRotationMartix;
  }

  // 将屏幕向量转换成场景内的向量
  public CalculateScreenVector2CameraVector(vec: Laya.Vector2, isNormalize: boolean = false) {
    const martix = this.mRotationMartix;
    const resultVec = new Laya.Vector3();
    resultVec.x = martix.elements[0] * vec.x + martix.elements[8] * vec.y + martix.elements[12];
    resultVec.y = 0;
    resultVec.z = martix.elements[2] * vec.x + martix.elements[10] * vec.y + martix.elements[14];
    if (isNormalize) {
      // 是否需要归一化
      Laya.Vector3.normalize(resultVec, resultVec);
    }
    return resultVec;
  }

  // 检测是3d场景中的点否在屏幕可视范围内
  public checkIsInScreen(pos: Laya.Vector3) {
    if (pos.x < this.mNumCameraViewMinX 
      || pos.x > this.mNumCameraViewMaxX 
      || pos.z < this.mNumCameraViewMinZ 
      || pos.z > this.mNumCameraViewMaxZ) {
      return false;
    } else {
      return true;
    }
  }

  // 玩家自身的矩阵发生变化
  private onCameraFollowMyself(event: any) {

    // 玩家自身的矩阵
    const tSelfTransform: Laya.Vector3 = event;

    if (tSelfTransform.z === this.mCurFollowPosition.z) {
      return;
    }

    // 更新数据
    // this.mCurFollowPosition.x = tSelfTransform.x;
    // this.mCurFollowPosition.y = tSelfTransform.y;
    this.mCurFollowPosition.z = tSelfTransform.z;

    const tCameraPos = CAMERA_TRANSFORM_POS_CAMP1;

    // 更新摄像机的position
    // this.mCamera3D.transform.localPositionX = tSelfTransform.x + tCameraPos.x;
    // this.mCamera3D.transform.localPositionY = tSelfTransform.y + tCameraPos.y;
    this.mCamera3D.transform.localPositionZ = tSelfTransform.z + tCameraPos.z;

    // 同时更新摄像机能看到场景的范围
    // this.refreshCameraViewRange();
  }


  /***
   *   更新摄像机能看到场景的范围
   */

  // 屏幕viewport坐标
  private mLTScreenCoord    = new Laya.Vector3(0, 0, 0);
  private mRTScreenCoord    = new Laya.Vector3(Laya.stage.width, 0, 0);
  private mLBScreenCoord    = new Laya.Vector3(0, Laya.stage.height, 0);
  private mRBScreenCoord    = new Laya.Vector3(Laya.stage.width, Laya.stage.height, 0);
  
  // 屏幕坐标转换到摄像机正交坐标
  private mLTOrthoCoord     = new Laya.Vector3();
  private mRTOrthoCoord     = new Laya.Vector3();
  private mLBOrthoCoord     = new Laya.Vector3();
  private mRBOrthoCoord     = new Laya.Vector3();

  // 左顶到左底向量
  private mLT2LBVec         = new Laya.Vector3();

  // 右底到左底向量
  private mRB2LBVec         = new Laya.Vector3();

  // 上述两向量的叉积
  private mVerticalVec      = new Laya.Vector3();

  // 战场的范围
  private mNumCameraViewMinX = 0;
  private mNumCameraViewMinZ = 0;
  private mNumCameraViewMaxX = 0;
  private mNumCameraViewMaxZ = 0;

  // 更新摄像机能看到场景的范围
  private refreshCameraViewRange() {

    return;

    // 将屏幕的四角位置转换为摄像机坐标系下位置
    this.mCamera3D.convertScreenCoordToOrthographicCoord(this.mLTScreenCoord, this.mLTOrthoCoord);
    this.mCamera3D.convertScreenCoordToOrthographicCoord(this.mRTScreenCoord, this.mRTOrthoCoord);
    this.mCamera3D.convertScreenCoordToOrthographicCoord(this.mLBScreenCoord, this.mLBOrthoCoord);
    this.mCamera3D.convertScreenCoordToOrthographicCoord(this.mRBScreenCoord, this.mRBOrthoCoord);


    // 在摄像机的视镜体中，屏幕处的三维正交向量
    Laya.Vector3.subtract(this.mLBOrthoCoord, this.mLTOrthoCoord, this.mLT2LBVec);
    Laya.Vector3.subtract(this.mLBOrthoCoord, this.mRBOrthoCoord, this.mRB2LBVec);
    Laya.Vector3.cross(this.mLT2LBVec, this.mRB2LBVec, this.mVerticalVec);


    // 根据相似三角形成比例原理
    let tMinX = null;
    let tMinY = null;
    let tMaxX = null;
    let tMaxY = null;
    for (const tPos of [this.mLBScreenCoord, this.mLTScreenCoord, this.mRBScreenCoord, this.mRTScreenCoord]) {
      const tTemp = (0 - tPos.y) / this.mVerticalVec.y;
      const tNewX = tTemp * this.mVerticalVec.x + tPos.x;
      const tNewY = tTemp * this.mVerticalVec.z + tPos.z;
      if (tMinX === null || tMinX > tNewX) {
        tMinX = tNewX;
      }
      if (tMinY === null || tMinY > tNewY) {
        tMinY = tNewY;
      }
      if (tMaxX === null || tMaxX < tNewX) {
        tMaxX = tNewX;
      }
      if (tMaxY === null || tMaxY < tNewY) {
        tMaxY = tNewY;
      }
    }

    this.mNumCameraViewMinX = tMinX;
    this.mNumCameraViewMinZ = tMinY;
    this.mNumCameraViewMaxX = tMaxX;
    this.mNumCameraViewMaxZ = tMaxY;
  }
}
