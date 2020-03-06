
/*
 * author:陈晓亮
 * date: 2019/12/20
 * desc：收集shader信息，将打印信息复制到 E:\DYGame_new\tank\tank-client-project_ok\bin\raw\shader\shaderVariant.json中
 * tips：
*/

import { Fight3DFiles } from "./Fight3DFiles";
import Misc from "../../../commonUnit/Misc";
import ResourecLoader from "../../../commonUnit/ResourceLoader";

export default class ShaderCollectVariant {

  public static get INSTANCE(): ShaderCollectVariant {
    if (ShaderCollectVariant.singleInstance === null) {
      this.singleInstance = new ShaderCollectVariant();
    }
    return ShaderCollectVariant.singleInstance;
  }
  private static singleInstance: ShaderCollectVariant = null;

  constructor() {
  }

  public deconstructor() {
    ShaderCollectVariant.singleInstance = null;
  }

  private mNumCurIndex: number = 0;

  private mScene: Laya.Scene3D = null;

  public start() {
    const tArrFiles = Misc.deepClone(Fight3DFiles);
    ResourecLoader.loadResListAsyn(tArrFiles, (result: boolean) => {
      if (result) {
        this.mScene = new Laya.Scene3D();
        const camera = new Laya.Camera(0, 0.1, 1000);
        camera.transform.localPositionY = 50;
        camera.transform.localRotationEulerX = -90;
        camera.orthographic = true;
        camera.orthographicVerticalSize = 15;
        this.mScene.addChild(camera);
        Laya.stage.addChild(this.mScene);
        Laya.timer.loop(1000, this, this.add3DMould);
      } else {
        Misc.myError("ShaderCompileInfo 预加载文件失败");
      }
    });
  }

  private add3DMould() {
    const tStrFileName: string = Fight3DFiles[this.mNumCurIndex];
    Misc.myLog("加载资源", tStrFileName);
    this.mNumCurIndex ++;
    if (tStrFileName) {
      const res = Laya.loader.getRes(tStrFileName);
      this.mScene.addChild(res);
    } else {
      Misc.myLog("加载资源完成, 开始收集shader");
      Laya.timer.clear(this, this.add3DMould);
      this.collectShaderVariant();
    }
  }

  private collectShaderVariant() {
    let arr = null;
    const shaderObj: any = {};
    for (let i = 0; i < Laya.Shader3D.debugShaderVariantCollection.variantCount; i++) {
      const shadervariant: Laya.ShaderVariant = Laya.Shader3D.debugShaderVariantCollection.getByIndex(i);
      const shaderName: string = shadervariant.shader.name;
      if (!shaderObj[shaderName])  {
        shaderObj[shaderName] = [];
      }
      arr = shaderObj[shaderName];
      const obj: any = {};
      obj.defineNames = shadervariant.defineNames;
      obj.passIndex = shadervariant.passIndex;
      obj.subShaderIndex = shadervariant.subShaderIndex;
      arr.push(obj);
    }

    console.log(" =================== shader info =================== ：");
    console.log(JSON.stringify(shaderObj));
  }
}
