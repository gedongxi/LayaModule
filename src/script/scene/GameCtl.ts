
/**
 * 游戏控制中心
 * 2019/11/02
 */
import { EGameSceneName, EGameSceneDir } from "./base/BaseDefine";
import { IRootUI } from "./base/IUI";
import NetCtl from "../net/NetCtl";
import EventUtil from "../event/EventUtil";
import { Events } from "../event/Event";
import BaseScene from "./base/BaseScene";
import TransitionScene from "./transitionScene/TransitionScene";


export default class GameCtl {
  // 获取GamCtl单例
  public static get INSTANCE(): GameCtl {
    if (GameCtl.singleInstance === null) {
      this.singleInstance = new GameCtl();
    }
    return GameCtl.singleInstance;
  }
  private static singleInstance: GameCtl = null;

  // 当前ui
  private mCurUI: IRootUI = null;

  // 当前场景对象
  private mCurScene: BaseScene = null;

  // 当前场景name
  private mCurSceneName: EGameSceneName = EGameSceneName.InitScene;

  // 前一场景name
  private mPreSceneName: EGameSceneName  = EGameSceneName.InitScene;

  // 每5秒钟与服务器同步时间，因此在5秒内，客户端每秒自加+1
  private mNumServerTime: number = 0;
  private mNumAccuServerTimeHandler: number = null;

  // 请求服务器时间的时间
  private mNumHeartBeat: number = 0;
  private mNumHeartSendTime: number = 0;

  public init() {
    
    // 初始化协议收发和协议处理
    NetCtl.INSTANCE.createNetHandler();

    // 收到服务器时间
    EventUtil.Dispatcher.on(Events.EVENT_SERVER_TIME, this, this.onRespServerTime);
    EventUtil.Dispatcher.on(Events.EVENT_SEND_SERVER_TIME, this, this.onRespSetServerTime);

    // Laya.Stat.show();
  }

  // 切换场景
  public loadNextScene(sceneName: EGameSceneName, transtion: boolean = true) {
    this.mPreSceneName = this.mCurSceneName;
    this.mCurSceneName = sceneName;
    Laya.Scene.destroy(EGameSceneDir[this.mPreSceneName]);
    if (transtion) {
      TransitionScene.NextSceneName = sceneName;
      Laya.Scene.open(EGameSceneDir[EGameSceneName.TransitionScene]);
    } else {
      Laya.Scene.open(EGameSceneDir[sceneName]);
    }
  }

  public get CurSceneName(): EGameSceneName {
    return this.mCurSceneName;
  }
  public get PreSceneName(): EGameSceneName {
    return this.mPreSceneName;
  }

  // public get CurrentScene(): BaseScene {
  //   return this.mCurScene;
  // }

  // public set CurrentScene(value: BaseScene) {
  //   this.mCurScene = value;
  // }

  public set RootUI(value: IRootUI) {
    this.mCurUI = value;
  }

  public get RootUI(): IRootUI {
    return this.mCurUI;
  }

  // 收到服务器时间
  public get ServerTime(): number {
    return this.mNumServerTime;
  }

  private onRespServerTime(pNumServerTime: number) {

    // 前端插值两次心跳间的服务器时间
    if (!this.mNumAccuServerTimeHandler) {
      const self = this;
      this.mNumAccuServerTimeHandler = setInterval(() => {
        self.mNumServerTime += 1;
      }, 1000);
    }

    // 用服务器时间做矫正
    this.mNumServerTime = pNumServerTime;
    this.mNumHeartBeat = (Date.now() - this.mNumHeartSendTime) >> 1;
  }

  // 发送请求服务器时间
  private onRespSetServerTime(pNumTime: number) {
    this.mNumHeartSendTime = pNumTime;
  }

  // 获取心跳时间
  public get HeartBeat(): number {
    return this.mNumHeartBeat;
  }
}

