/**
 * date: 2019/11/12
 * desc：请求资源工具类
 */

import Misc from "./Misc";

export default class ResourecLoader {
  // static loadRes: Function;

  /////////////////////////////////////////// 加载文件 /////////////////////////////////////////

  // 加载预制资源
  public static loadPrefab(pStrPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Laya.loader.load(pStrPath, Laya.Handler.create(this, (res: Laya.Prefab) => {
        if (res) {
          resolve(res.create());
        } else {
          reject(null);
          Misc.myWarn(" loadPrefab 加载失败 ", pStrPath);
        }
      }));
    });
  }

  // 异步加载
  public static loadPrefabAsyn(pStrPath: string, callBack: (res: Laya.Node) => void) {
    Laya.loader.load(pStrPath, Laya.Handler.create(this, (res: Laya.Prefab) => {
      if (res) {
        callBack(res.create());
      } else {
        callBack(null);
        Misc.myWarn(" loadPrefabAsyn 加载失败", pStrPath);
      }
    }));
  }

  // 异步加载文件
  public static loadFile(strPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Laya.loader.load(strPath, Laya.Handler.create(this, (res) => {
        if (res) {
          resolve(res);
        } else {
          reject(null);
          Misc.myWarn(" loadFile 加载失败", strPath);
        }
      }));
    });
  }

  // 同步加载
  public static loadFileAsyn(strPath: string, callBack: (res) => void) {
    Laya.loader.load(strPath, Laya.Handler.create(this, (res) => {
      if (res) {
        callBack(res);
      } else {
        callBack(null);
        Misc.myWarn(" loadFileAsyn 加载失败", strPath);
      }
    }));
  }


  // 同步加载单资源 返回值是对象
  public static loadRes(resource: string, clone: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      Laya.loader.create(resource, Laya.Handler.create(this, (result: any) => {
        if (result) {
          if (clone) {
            resolve(result.clone());  
          } else {
            resolve(result);
          }          
        } else {
          resolve(null);
          Misc.myWarn(" loadRes 加载失败", resource);
        }
      }));
    });
  }

  // 异步加载单资源  返回值是对象
  public static loadResAsyn(resource: string, callBack: (result) => void, clone: boolean = true) {
    Laya.loader.create(resource, Laya.Handler.create(this, (result) => {
      if (result) {
        if (clone) {
          callBack(result.clone());  
        } else {
          callBack(result);
        }          
      } else {
        callBack(null);
      }
    }));
  }


  // 同步加载多资源 返回值是boolean
  public static loadResList(resource: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      Laya.loader.create(resource, Laya.Handler.create(this, (result: boolean) => {
        resolve(result);
      }));
    }).catch(
      (error) => {
        Misc.myWarn("文件预加载失败", resource);
      },
    );
  }

  // 异步加载多资源 返回值是boolean
  public static loadResListAsyn(resource: string[], callBack: (result: boolean) => void) {
    Laya.loader.create(resource, Laya.Handler.create(this, (result: boolean) => {
      callBack(result);
    }));
  }

  // // 加载场景
  // public static loadScene3D(pStrPath: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     Laya.Scene3D.load(pStrPath, Laya.Handler.create(this, (res: Laya.Scene3D) => {
  //       if (res) {
  //         resolve(res);
  //       } else {
  //         reject(null);
  //       }
  //     }));
  //   }).catch(
  //     (error) => {
  //       Misc.myWarn("场景文件加载失败", pStrPath);
  //     },
  //   );
  // }

  // // 异步加载
  // public static loadScene3DAsyn(pStrPath: string, callBack: (res) => void) {
  //   Laya.Scene3D.load(pStrPath, Laya.Handler.create(this, (res: Laya.Scene3D) => {
  //     if (res) {
  //       callBack(res);
  //     } else {
  //       callBack(null);
  //     }
  //   }));
  // }

  // // 加载预设
  // public static loadSprite3D(pStrPath: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     Laya.Sprite3D.load(pStrPath, Laya.Handler.create(this, function(res: Laya.Sprite3D): void {
  //       if (res) {
  //         resolve(res);
  //       } else {
  //         reject(null);
  //       }
  //     }));
  //   }).catch(
  //     (error) => {
  //       Misc.myWarn("预设文件加载失败", pStrPath);
  //     },
  //   );
  // }

  // // 异步加载
  // public static loadSprite3DAsyn(pStrPath: string, callBack: (res) => void) {
  //   Laya.Sprite3D.load(pStrPath, Laya.Handler.create(this, function(res: Laya.Sprite3D): void {
  //     if (res) {
  //       callBack(res);
  //     } else {
  //       callBack(null);
  //     }
  //   }));
  // }
}
