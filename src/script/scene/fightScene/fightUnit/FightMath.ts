
export default class FightMath {

  private static mCommonAngle: Laya.Vector2 = new Laya.Vector2(0, 1);
  
  // // 将屏幕向量转换成场景内的向量
  // public static CalculateScreenVector2SceneVector(vec: Laya.Vector2, isNormalize: boolean = false) {
  //   const martix = FightCtl.INSTANCE.FightCamera.CameraRotationMartix;
  //   const resultVec = new Laya.Vector3();
  //   resultVec.x = martix.elements[0] * vec.x + martix.elements[8] * vec.y + martix.elements[12];
  //   resultVec.y = 0;
  //   resultVec.z = martix.elements[2] * vec.x + martix.elements[10] * vec.y + martix.elements[14];
  //   if (isNormalize) {
  //     // 是否需要归一化
  //     Laya.Vector3.normalize(resultVec, resultVec);
  //   }
  //   return resultVec;
  // }

  // 计算夹角(基于向量(0, 1)) 
  public static calculateVectorCommonAngle(vecX: number, vecY: number) {
    const len1 = Math.pow(FightMath.mCommonAngle.x * FightMath.mCommonAngle.x + FightMath.mCommonAngle.y * FightMath.mCommonAngle.y, 0.5);
    const len2 = Math.pow(vecX * vecX + vecY * vecY, 0.5);
    if (len1 === 0 || len2 === 0) {
      return 0;
    }
    const dotProduct = FightMath.mCommonAngle.x * vecX + FightMath.mCommonAngle.y * vecY;
    const angle = Math.acos(dotProduct / (len1 * len2)) * 180 / Math.PI;
    const sub = FightMath.mCommonAngle.x * vecY - FightMath.mCommonAngle.y * vecX;
    if (sub >= 0) {
      return angle;
    } else {
      return 360 - angle;
    }
  }

  // 计算夹角
  public static calculateVectorAngle(vec1: Laya.Vector2, vec2: Laya.Vector2, isDir?: boolean) {
    const len1 = Math.pow(vec1.x * vec1.x + vec1.y * vec1.y, 0.5);
    const len2 = Math.pow(vec2.x * vec2.x + vec2.y * vec2.y, 0.5);
    if (len1 === 0 || len2 === 0) {
      return 0;
    }
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
    const angle = Math.acos(dotProduct / (len1 * len2)) * 180 / Math.PI;
    const sub = vec1.x * vec2.y - vec1.y * vec2.x;
    if (sub >= 0) {
      return angle;
    } else {
      if (isDir) {
        return -angle;
      } else {
        return 360 - angle;
      }
    }
  }
}
