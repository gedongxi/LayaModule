
import * as ConfigVO from "./vo/ConfigVO";
import { ByteArray } from "../commonUnit/NetByteArray";

const ClazzMap = {};


// 加载配置文件的入口
export function loadAll(callback: Function) {
  // 加载服务列表

  const loadTask = ["server", "zip"];
  const taskFinish = function(pTask: string) {
    const idx = loadTask.indexOf(pTask);
    if (idx < 0) {
      return;
    }
    loadTask.splice(idx, 1);
    if (loadTask.length === 0) {
      callback();
    }
  };

  loadTaskServerList("server", taskFinish);
  loadTaskZip("zip", taskFinish);
}

function loadTaskServerList(pTaskName: string, finishCallback: Function) {
  const tStrResPath: string = "raw/config/ServerList.json";
  Laya.loader.load(tStrResPath, Laya.Handler.create(null, (res) => {
    if (res) {
      onConfigLoaded("ServerList", res);
      Laya.loader.clearRes(tStrResPath);
      finishCallback(pTaskName);
    }
  }));
}

function loadTaskZip(pTaskName, finishCallback: Function) {
  const tStrResPath: string = "raw/config/other.zip";
  Laya.loader.load(tStrResPath, Laya.Handler.create(null, (res) => {
    if (res) {
      const files: any = Partner.unzipConfig(res);
      Laya.loader.clearRes(tStrResPath);
      onZipLoaded(files);
      finishCallback(pTaskName);
    }
  }), null, Laya.Loader.BUFFER);
}

/*
// 用于异步预加载
function asyncPreLoad(pResPath: string) {
    Laya.loader.load(pResPath, Laya.Handler.create(null, function (res) {
        console.log("######async Preload:", pResPath, "  result:", !!res);
    }));
}
*/



/*

// 加载服务器列表
function loadServerList(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        Laya.loader.load("raw/config/ServerList.json", Laya.Handler.create(null, function (res) {
            resolve(res)
        }));
    });
}

// 加载配置文件压缩包
function loadConfigZip(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        Laya.loader.load("raw/config/other.zip", Laya.Handler.create(null, function (res) {
            if (!res) {
                resolve(null);
                return;
            }
            resolve(Partner.unzipConfig(res));
        }), null, Laya.Loader.BUFFER);
    });
}
*/


function onConfigLoaded(configName: string, data: any) {
  /*
  if (configName === "SysLanguageCN" || configName === "SysLanguageEN") {
    setI18NSysLanguage(configName, data);
    return;
  }
  */

  const name = configName.replace(/^(?:Sys|Client)?(.*)$/, "$1");
  if (ConfigVO[name]) {
    const vo = ConfigVO[name];
    if (vo.isInited) {
      return;
    }
  }

  ConfigVO[name].setClass(ClazzMap[name]);
  ConfigVO[name].initData(data);
}


// 处理加载好的zip文件
function onZipLoaded(files: any) {
  for (const fileName of Object.keys(files)) {
    const data = files[fileName] as Uint8Array;
    const bytes: ByteArray = new ByteArray(data);
    const fileContent = bytes.readUTFBytes(bytes.bytesAvailable);
    const confName = fileName.split(".")[0];
    onConfigLoaded(confName, JSON.parse(fileContent));
  }
}


function setI18NSysLanguage(configName: string, data: any) {
  if (configName === "SysLanguageCN" && i18n.locale === "cn") {
    i18n.sysData = data;
  } else if (configName === "SysLanguageEN" && i18n.locale === "en") {
    i18n.sysData = data;
  }
}
