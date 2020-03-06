/*
 * author:陈晓亮
 * date: 2019/12/20
 * desc：预编译shader信息 E:\DYGame_new\tank\tank-client-project_ok\bin\raw\shader\shaderVariant.json
 * tips：
*/

import ResourecLoader from "../../../commonUnit/ResourceLoader";

export default class ShaderCompileVariant {

  public static get INSTANCE(): ShaderCompileVariant {
    if (ShaderCompileVariant.singleInstance === null) {
      this.singleInstance = new ShaderCompileVariant();
    }
    return ShaderCompileVariant.singleInstance;
  }
  private static singleInstance: ShaderCompileVariant = null;

  private callbackCompileDone: Function = null;

  private mIsCompileDone: boolean = false;

  constructor() {
    this.mIsCompileDone = false;
  }

  public deconstructor() {
    ShaderCompileVariant.singleInstance = null;
  }

  public start(callbackFun: Function) {

    this.callbackCompileDone = callbackFun;

    if (this.mIsCompileDone) {
      if (this.callbackCompileDone) {
        this.callbackCompileDone();
      }
    } else {
      ResourecLoader.loadFileAsyn("raw/shader/shaderVariant.json", (res) => {
        if (res) {
          this.precomileShaderVariant(res);
        }
      });
    }
  }


  private precomileShaderVariant(objShaderVariants: any) {
    for (const key in objShaderVariants) {
      if (objShaderVariants.hasOwnProperty(key)) {
        const shader: Laya.Shader3D = Laya.Shader3D.find(key);
        if (!shader) {
          continue;
        }
        const variant: any[] = objShaderVariants[key];
        for (let i = 0, length = variant.length; i < length; i++) {
          const obj = variant[i];
          const shadervariant = new Laya.ShaderVariant(shader, obj.subShaderIndex, obj.passIndex, obj.defineNames);
          // 将构建的shadervariant添加到debugShaderVariantCollection中
          Laya.Shader3D.debugShaderVariantCollection.add(shadervariant);
        }
      }
    }

    Laya.Shader3D.debugShaderVariantCollection.compile();

    this.mIsCompileDone = true;

    if (this.callbackCompileDone) {
      this.callbackCompileDone();
    }    
  }
}
