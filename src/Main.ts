import GameConfig from "./GameConfig";
import GamePersist from "./script/scene/GamePersist";
import { UIConfig } from "./UIConfig";
import EventUtil from "./script/event/EventUtil";
import { Events } from "./script/event/Event";

class Main {
  constructor() {
    // 根据IDE设置初始化引擎		
    if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    // 兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    // 打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError = true;

    // // 测试代码TankArena
    // const tTankArena = new TkArena();
    // tTankArena.sayHello();

    // 激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

  }

  onVersionLoaded(): void {
    // 激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  }

  onConfigLoaded(): void {


    console.error(" ############# 屏幕数据 ############# ");

    console.log( "配置宽高", GameConfig.width, GameConfig.height);
    console.log( "设计宽高", Laya.stage.designWidth, Laya.stage.designHeight);
    console.log( "Stage宽高", Laya.stage.width, Laya.stage.height);
    console.log( "屏幕宽高", Laya.Browser.clientWidth, Laya.Browser.clientHeight);
    console.log( "物理宽高", Laya.Browser.width, Laya.Browser.height);

    // TK作为常驻节点
    GamePersist.New();

    // 加载IDE指定的场景
    console.log(" 开启初始场景 ############# ", GameConfig.startScene);
    // this.setUIConfig();
    GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
  }

  // private setUIConfig() {
  //   const anyWindow: any = window;
  //   const layaExt = anyWindow.LayaExt || {};
  //   anyWindow.LayaExt = layaExt;
  //   if (!LayaExt.UI) {
  //       LayaExt.UI = new UIConfig();
  //   }
    
  //   const scale             = Laya.stage.height / 720;
  //   LayaExt.UI.scale        = scale;
  //   LayaExt.UI.designHeight  = 720;
  //   LayaExt.UI.designWidth  = Laya.stage.width / scale;
  //   LayaExt.UI.realWidth    = Laya.stage.width;
  //   LayaExt.UI.realHeight   = Laya.stage.height;

  //   const xGap              = (Laya.stage.width - LayaExt.UI.realWidth) / 2;
  //   LayaExt.UI.uiX          = xGap;

  //   // 在UI内部的Gap需要考虑到缩放，所以把Gap在变化一下
  //   const scaleGap          = xGap / scale;
  //   LayaExt.UI.visibleLeft  = -scaleGap;
  //   LayaExt.UI.visibleRight = 1280 + scaleGap;

  //   EventUtil.Dispatcher.event(Events.EVENT_STAGE_RESIZE);
  // }
}
// 激活启动类
new Main();
