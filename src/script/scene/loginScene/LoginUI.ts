import BaseUI from "../base/BaseUI";
import Misc from "../../commonUnit/Misc";
import LoginCtl from "./LoginCtl";
import GamePersist from "../GamePersist";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
import { ServerList, IServerListVO } from "../../config/vo/ConfigVO";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import ShaderCollectVariant from "../fightScene/fightShader/ShaderCollectVariant";
import UIUtil from "../../commonUnit/UIUtil";
import { EUIAlignFlag } from "../base/BaseDefine";

export default class LoginUI extends BaseUI {

  private mNumCurServerId: number = 0;

  // 登录按钮
  private mBtnLogin: Laya.Button = null;

  // 登录按钮
  private mBtnReLogin: Laya.Button = null;

  // 选服按钮
  private mBtnChooseServer: Laya.Button = null;

  // 收集shader信息
  private mBtnCollectShader: Laya.Button = null;

  // 账号输入框
  private mEdbAccount: Laya.TextInput = null;

  // 登录相关
  private mSprAccInput: Laya.Sprite = null;

  // 初始化一些脚本
  public onAwake() {

    Misc.myLog("======== LoginUI onAwake ========");

    super.onAwake();

    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_SUCCESS, this, this.onRespLoginSuccess);
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_SWITCH_SERVER, this, this.onSwitchServer);
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_SHOW_TEXTINPUT, this, this.showLoginTextinput);


    const nodCenter = this.owner.getChildByName("nodCenter");
    UIUtil.setWidget(nodCenter, EUIAlignFlag.CENTER);

    const nodTop = this.owner.getChildByName("nodTop");
    UIUtil.setWidget(nodTop, EUIAlignFlag.TOP, {top: 100});

    const nodBottom = this.owner.getChildByName("nodBottom");
    UIUtil.setWidget(nodBottom, EUIAlignFlag.BOTTOM, {bottom: -100});

    // 输入框
    this.mSprAccInput = nodCenter.getChildByName("nodAccInput") as Laya.Sprite;

    // 选择服务器
    this.mBtnChooseServer = this.mSprAccInput.getChildByName("btnChooseServer") as Laya.Button;
    this.mBtnChooseServer.on(Laya.Event.CLICK, this, this.onBtnSelectServer);

    this.mEdbAccount = this.mSprAccInput.getChildByName("edbAccount") as Laya.TextInput;

    // 登录按钮
    this.mBtnLogin = nodBottom.getChildByName("btnLogin") as Laya.Button;
    this.mBtnLogin.on(Laya.Event.CLICK, this, this.onBtnLoginWithInput);

    // 重新登录按钮
    this.mBtnReLogin = nodBottom.getChildByName("btnReLogin") as Laya.Button;
    this.mBtnReLogin.on(Laya.Event.CLICK, this, this.onBtnReLogin);


    // 收集shader信息
    this.mBtnCollectShader = nodTop.getChildByName("btnCollectShader") as Laya.Button;
    this.mBtnCollectShader.on(Laya.Event.CLICK, this, this.onBtnCollectShader);




    this.init();

    // const self = this;

    // // let serverGroup: string = Partner.SERVER_GROUP;
    // // serverGroup = "" + serverGroup;
    // // const groupList = ConfigVO.ServerList.getExtra("group_list")[serverGroup];
    // // Misc.myLog("####server group:", serverGroup);
    // // for (let i = 0; i < groupList.length; i++) {
    // //     const serverId: number = groupList[i];
    // //     if (ConfigVO.ServerList.get(serverId).default === 1 || i === groupList.length - 1) {
    // //         this.setServerData(serverId);
    // //         break;
    // //     }
    // // }
    // // Misc.myLog("####server id:", this.mNumServerId);
    // this.mNumServerId = 0;

    // // 获取到授权后的回调
    // const tGetAccountCb = function(data: any) {
    //     LoginCtl.INSTANCE.didGetAuthorize(self.mNumServerId, data);
    // };
    // // 如何显示账号输入相关的回调
    // const tShowAccOpCb = function(pHow: any) {
    //     self.showAccInput(pHow);
    // };

    // // 调用运行平台的授权方式
    // Partner.doAccAuthorize(tGetAccountCb, tShowAccOpCb, false);
  }

  public onDestroy() {

    Misc.myLog("======== LoginUI onDestroy ========");

    super.onDestroy();

    EventUtil.Dispatcher.off(Events.EVENT_LOGIN_SUCCESS, this, this.onRespLoginSuccess);
    EventUtil.Dispatcher.off(Events.EVENT_LOGIN_SWITCH_SERVER, this, this.onSwitchServer);
    EventUtil.Dispatcher.off(Events.EVENT_LOGIN_SHOW_TEXTINPUT, this, this.showLoginTextinput);
  }

  private init() {
    
    // // 计算服务器分组 如果当前是在审核状态则走审核服务器组
    // let serverGroup: string = Partner.SERVER_GROUP;
    // const anyWindow: any = window;
    // // AUDIT_SERVER_GROUP
    // if (anyWindow._DY_VERSION_STATUS === "audit" && Partner.AUDIT_SERVER_GROUP) {
    //   serverGroup = Partner.AUDIT_SERVER_GROUP;
    // }

    // // 如果某个渠道指定了服务器分组
    // Misc.myLog("###crack CHANNEL_SERVER_GROUP:" + anyWindow.CHANNEL_SERVER_GROUP);
    // if (anyWindow.CHANNEL_SERVER_GROUP) {
    //   const channelServerGroupKey: string = anyWindow.CHANNEL_SERVER_GROUP;
    //   const tChannelServerGroup = ServerChannelGroup.get(channelServerGroupKey);
    //   if (tChannelServerGroup) {
    //     Misc.myLog("###crack serverGroup:" + tChannelServerGroup.serverGroup);
    //     serverGroup = "" + tChannelServerGroup.serverGroup;
    //   } else {
    //     Misc.myLog("###crack serverGroup: undefine");
    //   }
    // }

    // TODO 暂时写死"0"
    let tServerGroup = "0";
    if (Partner.PARTNER_NAME === "Wechat") {
      tServerGroup = "1";
    }

    if (Partner.PARTNER_NAME === "Dev") {
      this.mBtnCollectShader.visible = true;
    }

    Partner.SERVER_GROUP = tServerGroup;

    // 选取默认服务器
    Misc.myLog(ServerList.getExtra("group_list"));
    const grouplist = ServerList.getExtra("group_list")[tServerGroup];
    for (let i = 0; i < grouplist.length; i++) {
      const serverId: number = grouplist[i];
      // 是默认服务器或者已经遍历到最后一个
      if (ServerList.get(serverId).default === 1 || i === grouplist.length - 1) {
        this.setServerData(serverId);
        break;
      }
    }

    // 获取到授权后的回调
    const authorizeCallback = (data: Partner.LoginData) => {
      LoginCtl.INSTANCE.didGetAuthorize(this.mNumCurServerId, data);
    };

    // 如何显示账号输入相关的回调
    const textinputCallback = (pHow: number) => {
      this.showLoginTextinput(pHow);
    };

    Partner.doAccAuthorize(authorizeCallback, textinputCallback, false);
  }

  // 该回调决定 是否可以用户自定义输入
  public showLoginTextinput(howTo: number) {
    if (howTo === 0) {
      // 拉起授权时全部隐藏
      this.mBtnReLogin.visible = false;
      this.mSprAccInput.visible = false;
    } else if (howTo === 1) {
      // dev的授权成功
      // this.mBtnReLogin.visible = false;
      // this.mSprAccInput.visible = true;
    } else if (howTo === 2) {
      // 授权失败(一般非dev平台用)
      this.mBtnReLogin.visible = true;
      this.mSprAccInput.visible = false;
    }
  }

  // dev下通过输入框的登录
  private onBtnLoginWithInput() {

    Misc.myLog("onBtnLoginWithInput");

    // this.test();

    // return;

    const account: string = this.mEdbAccount.text;
    if (!account || account.length < 1) {
      GamePersist.INSTANCE.showToast("login_text10000");

      return;
    }
    const data: any = {};
    data.openid = account;
    data.openkey = account;
    data.platform = Partner.PARTNER_NAME;

    const extrData: any = {};
    const launchOpts = Partner.getLaunchOptions();
    Misc.myLog("#################附带参数launchOpts", launchOpts);
    const tObjParam: any = { query: {} };
    if (!!launchOpts.RefereeId && Number(launchOpts.RefereeId) > 0) {
      tObjParam.query.referee_id = launchOpts.RefereeId;
      extrData.launch = tObjParam;
    }
    data.params = JSON.stringify(extrData);
    Misc.myLog("#################附带参数 data.params", data.params);

    // dev 直接模拟授权信息
    Partner.didAccAuthorize(data);
  }

  // 非dev下的重新登录
  private onBtnReLogin() {
    // 必须要再次拉起授权框，因为有些sdk必须在login界面中登录成功才算成功（比如快游戏）
    const authorizeCallback = (data: Partner.LoginData) => {
      LoginCtl.INSTANCE.didGetAuthorize(this.mNumCurServerId, data);
    };

    // 如何显示账号输入相关的回调
    const textinputCallback = (pHow: number) => {
      this.showLoginTextinput(pHow);
    };

    Partner.doAccAuthorize(authorizeCallback, textinputCallback, false);
  }

  private onBtnSelectServer() {
    ResourecLoader.loadPrefabAsyn("prefabs/login/SelectServer.prefab", (nod: Laya.Sprite) => {
      this.owner.addChild(nod);
    });
  }

  // 玩家通过选服界面进行了选服
  private onSwitchServer(event: any) {
    const serverId: number = event;
    this.setServerData(serverId);
  }

  // 收集shader信息
  private onBtnCollectShader() {
    ShaderCollectVariant.INSTANCE.start();
  }

  // 选定了服务器
  private setServerData(serverId: number) {
    this.mNumCurServerId = serverId;

    const tSysServer: IServerListVO = ServerList.get(serverId);
    this.mBtnChooseServer.label = tSysServer.name;
  }

  public onRespLoginSuccess() {
  }

  private test() {
    // const pool = new LSPool<PooTest>();
    // const obj1 = new PooTest();
    // pool.put(obj1);
    // pool.put(obj1);
    // // const obj2 = new PooTest1();
    // // pool.put(obj2);

    // const obj = pool.get();
    // obj.ok();

    // this.owner.on(Laya.Event.MOUSE_DOWN, this, (event: Laya.Event) => {
    //   Misc.myLog("触摸位置", event.stageX, event.stageY);

    //   const local1 = (this.owner as Laya.Sprite).globalToLocal(new Laya.Point(event.stageX, event.stageY));

    //   Misc.myLog("this.owner 本地触摸位置", local1.x, local1.y);

    //   const loacl2 = this.mBtnChooseServer.globalToLocal(new Laya.Point(event.stageX, event.stageY));

    //   Misc.myLog("this.btnChooseServer 本地触摸位置", loacl2.x, loacl2.y);

    // });

    // this.owner.on(Laya.Event.MOUSE_MOVE, this, (event: Laya.Event) => {
    //   // Misc.myLog("移动位置", event.stageX, event.stageY);
    // });

    // this.owner.on(Laya.Event.MOUSE_UP, this, (event: Laya.Event) => {
    //   Misc.myLog("抬起位置", event.stageX, event.stageY);
    // });

    // this.owner.on(Laya.Event.MOUSE_OUT, this, (event: Laya.Event) => {
    //   Misc.myLog("移动离开", event.stageX, event.stageY);
    // });

    // GamePersist.INSTANCE.showAlert("main_room_text10001", "main_room_text10000", "ssssssssssssss");
    // GamePersist.INSTANCE.showToast("main_room_text10001", "ssssssssssssss");
  }
}

// class PooTest {
//   constructor() {

//   }

//   public ok() {
//     Misc.myLog("PooTest ok");
//   }

//   private ok1() {
//     Misc.myLog("PooTest ok1");
//   }

//   private unuse() {
//     Misc.myLog("PooTest unuse");
//   }

//   private reuse() {
//     Misc.myLog("PooTest reuse");
//   }
// }

// class PooTest1 {
//   constructor() {

//   }

//   private unuse() {
//     Misc.myLog("PooTest unuse");
//   }

//   private reuse() {
//     Misc.myLog("PooTest reuse");
//   }

