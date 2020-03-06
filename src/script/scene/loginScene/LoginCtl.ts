
import DataAcc from "../../data/DataAcc";
import NetCtl from "../../net/NetCtl";
import { AccLoginS2C, AccCreateS2C, AccEnterS2C, AccEnterC2S, AccReloginS2C, AccCreateC2S, AccReloginC2S, AccLoginC2S } from "../../proto/mods/ProtoSectionAcc";
import GamePersist from "../GamePersist";
import GameCtl from "../GameCtl";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
// import SceneSwithCtl from "../sceneSwitch/SceneSwithCtl";
import { EGameSceneName } from "../base/BaseDefine";
import { SOCKET_CONNECT } from "../../net/socket/SocketDefine";
import DataPlayer from "../../data/DataPlayer";
import Misc from "../../commonUnit/Misc";
import { IServerListVO, ServerList } from "../../config/vo/ConfigVO";


/**
 * 登录流程：
 * 1，从init场景，进入login场景
 * 2，loginUI 初始化时执行Partner.doAccAuthorize，注册
 *    “成功获取用户信息”回调 -- getAccountCallback（带回用户数据）最终存储在 DataAcc 中
 *    “失败获取用户信息”回调 -- inputAccountCallback（决定显示“重新授权”按钮）
 *    Dev平台是通过手动输入账号，“登录按钮”中执行Partner.didAccAuthorize 模拟“获取用户信息”流程。
 * 3，成功获取用户信息之后，执行 LoginCtl.INSTANCE.didGetAuthorize 与服务器建立socket连接。
 * 4，socket连接成功后，通过“SOCKET_CONNECT”消息通知onServerConnected函数，执行loginc2s流程。
 * 5，requestLogin()函数中，执行loginc2s协议，参数如下
 *    platform        -- 从之前获取的用户信息（DataAcc：accPlatform）中获取
 *    channelParam    -- 从之前获取的用户信息（DataAcc：accPlatformParam）中获取
 *    channelOpenId   -- 从之前获取的用户信息（DataAcc：accOpenId）中获取
 *    gameAccountId   -- 尝试先从运行内存再从本地存储中获取 game_account_id
 *    gameAccountSign -- 尝试先从运行内存再从本地存储中获取 game_account_sign
 * 6，客户端收到logins2c的返回，数据包括
 *    gameAccountId（覆盖 DataAcc：gameAccountId和本地local）
 *    gameAccountSign（覆盖 DataAcc：gameAccountSign本地local）
 *    channelOpenId（覆盖 DataAcc：accOpenId）
 *    gameLoginKey（覆盖 DataAcc：accOpenKey）
 *    id（覆盖playerid）
 * 7，前端继续执行AccEnterC2S，等收到返回后正式进入游戏。
 */
export default class LoginCtl {
  // 获取LoginCtl单例
  public static get INSTANCE(): LoginCtl {
    if (LoginCtl.singleInstance === null) {
      this.singleInstance = new LoginCtl();
    }
    return LoginCtl.singleInstance;
  }
  private static singleInstance: LoginCtl = null;

  // 存储key
  private static mStrGameAccountKey: string = "crack_game_account";

  constructor() {
    EventUtil.Dispatcher.on(SOCKET_CONNECT, this, this.onServerConnected);
    // 服务器返回确认成功进入游戏
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_SURE_ENTER_GAME, this, this.didEnterGame);
    // 服务器返回创建角色的结果
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_CREATE_ROLE_BACK, this, this.onReceiveCreateS2C);
    // 服务器返回的登陆结果
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_NORMAL_BACK, this, this.onReceiveLoginS2C);
    // 重新登录返回
    EventUtil.Dispatcher.on(Events.EVENT_LOGIN_RELOGIN_BACK, this, this.onReceiveReloginS2C);
  }

  // 成功获取到用户账号的授权
  public didGetAuthorize(serverId: number, data: Partner.LoginData) {
    console.log("授权信息", serverId, data);
    DataAcc.INSTANCE.LoginData = data;
    DataAcc.INSTANCE.serverId = serverId;

    // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.AthAllSuc15, null, null);

    if (NetCtl.INSTANCE.IsConnected) {
      // 已经建立连接--发送登陆协议
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.LgSec19, null, null);
      this.requestLogin();
    } else {
      // 未建立连接--与服务器建立连接
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.SckFir16, null, null);
      this.connectServer();
    }
  }

  // 连接服务器
  private connectServer() {
    const serverVo: IServerListVO = ServerList.get(DataAcc.INSTANCE.serverId);
    console.log(" ############ 正常连接服务器参数 ############ ", DataAcc.INSTANCE.serverId, serverVo.ip, serverVo.port, serverVo.path, serverVo.security);
    // NetCtl.INSTANCE.connect(serverVo.ip, serverVo.port, serverVo.path, serverVo.security);
    const anyWindow: any = window;
    // 部分小小游戏运行时不支持wss 所以需要把端口降级到ws
    if (anyWindow && anyWindow.__DY_USE_DOWNGRADE_PORT) {
      console.log("###crack downgrade connect server:", serverVo.ip, serverVo.downgradePort, serverVo.path);
      NetCtl.INSTANCE.connect(serverVo.ip, serverVo.downgradePort, serverVo.path, false);
    } else {
      console.log("###crack connect server:", serverVo.ip, serverVo.port, serverVo.path, serverVo.security);
      NetCtl.INSTANCE.connect(serverVo.ip, serverVo.port, serverVo.path, serverVo.security);
    }
  }

  // 当前服务器链接成功
  private onServerConnected() {
    console.log(" ############ 服务器连接成功 ############ ", GameCtl.INSTANCE.CurSceneName);
    // 如果当前是已经进入游戏的状态 则走重新登录的逻辑
    if (GameCtl.INSTANCE.CurSceneName !== EGameSceneName.InitScene) {
      if (GameCtl.INSTANCE.CurSceneName === EGameSceneName.LoginScene) {
        console.log(" ############ 进入首次登录流程 ############ ");
        // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.SckFirSuc17, null, null);
        // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.LgFir18, null, null);
        this.requestLogin();
      } else {
        console.log(" ############ 进入重新登录流程 ############ ");
        if (this.isExistSavedGameAccount()) {
          this.requestRelogin();
        } else {
          console.log(" ############ 不存在账号 回登录场景 ############ ");
          GameCtl.INSTANCE.loadNextScene(EGameSceneName.LoginScene);
          NetCtl.INSTANCE.close();
        }
      }
    }
  }

  // 登出
  public logout() {
    console.log(" ############ 注销账号 清空账号 回登录场景 断开socket ############ ");

    this.cleanGameAccount();

    GameCtl.INSTANCE.loadNextScene(EGameSceneName.LoginScene);
    NetCtl.INSTANCE.close();
  }

  // 请求登陆
  public requestLogin() {
    const gameAccount = this.getGameAccount();
    const gameAccountId: string = gameAccount.game_account_id;
    const gameAccountSign: string = gameAccount.game_account_sign;

    if (!DataAcc.INSTANCE.accOpenId && !(gameAccountId && gameAccountSign)) {
      console.log(" ############ 客户端拒绝登录请求 ############ ", DataAcc.INSTANCE.accOpenId, gameAccountId, gameAccountSign);
      return;
    }

    const loginC2S = new AccLoginC2S();
    loginC2S.platform = "" + DataAcc.INSTANCE.accPlatform;
    loginC2S.channelParam = "" + DataAcc.INSTANCE.accPlatformParam;
    loginC2S.channelOpenId = "" + DataAcc.INSTANCE.accOpenId;
    loginC2S.gameAccountId = "" + gameAccountId;
    loginC2S.gameAccountSign = "" + gameAccountSign;
    loginC2S.mode = 0;
    console.log(" ############ 正常登录请求 platform=%s channelParam=%s channelOpenId=%s gameAccountId=%s gameAccountSign=%s ############ ", loginC2S.platform, loginC2S.channelParam, loginC2S.channelOpenId, loginC2S.gameAccountId, loginC2S.gameAccountSign);
    NetCtl.INSTANCE.send(loginC2S);
  }

  // 收到登陆请求的返回
  public onReceiveLoginS2C(msg: AccLoginS2C) {
    if (msg.code > 0) {
      // 登录失败
      console.log(" ############ 登录游戏失败 ############ ", msg.code);
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.LgErr21, null, null);
      GamePersist.INSTANCE.showToast("login_text10012");


      if (Partner.PARTNER_NAME !== "Dev") {
        EventUtil.Dispatcher.event(Events.EVENT_LOGIN_SHOW_TEXTINPUT, 2);
      }
    } else {
      console.log(" ############ 登录游戏成功 gameAccountId=%s, gameAccountSign=%s, channelOpenId=%s, gameLoginKey=%s, code=%d ############", msg.gameAccountId, msg.gameAccountSign, msg.channelOpenId, msg.gameLoginKey, msg.code);
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.LgSuc20, null, null);
      EventUtil.Dispatcher.event(Events.EVENT_LOGIN_SUCCESS);
      // GamePersist.INSTANCE.showToast("login_text10013");

      // 保存平台账号
      DataAcc.INSTANCE.gameAccountId = msg.gameAccountId;
      DataAcc.INSTANCE.gameAccountSign = msg.gameAccountSign;
      DataAcc.INSTANCE.accOpenId = msg.channelOpenId;
      DataAcc.INSTANCE.accOpenKey = msg.gameLoginKey;
      this.saveGameAccount();


      // 玩家的Id
      const tNumPlayerId = msg.id;
      if (tNumPlayerId > 0) {
        DataPlayer.INSTANCE.PlayerId = tNumPlayerId;
        this.doEnterGame(tNumPlayerId);
      } else {
        this.doCreatePlayer();
      }
    }
  }

  // 请求重新登录 断线重连
  private requestRelogin() {
    const gameAccount = this.getGameAccount();
    const gameAccountId: string = gameAccount.game_account_id;
    const gameAccountSign: string = gameAccount.game_account_sign;

    const reloginC2S = new AccReloginC2S();
    reloginC2S.platform = DataAcc.INSTANCE.accPlatform;
    reloginC2S.id = DataPlayer.INSTANCE.PlayerId;
    reloginC2S.gameAccountId = gameAccountId;
    reloginC2S.gameAccountSign = gameAccountSign;
    reloginC2S.channelParam = DataAcc.INSTANCE.accPlatformParam;
    console.log(" ############ 重新登录请求 ############ ", reloginC2S);
    NetCtl.INSTANCE.send(reloginC2S);
  }

  // 收到重新登录的返回
  public onReceiveReloginS2C(msg: AccReloginS2C) {
    if (msg.code === 0) {
      console.log(" ############ 重新登录默默的成功 ############ ", msg.code);
      return;
    } else if (msg.code === 2200) {
      console.log(" ############ 重新登录成功 回主界面 ############ ", msg.code);
      GameCtl.INSTANCE.loadNextScene(EGameSceneName.MainScene);
    } else {
      console.log(" ############ 重新登录失败 回初始界面 ############ ", msg.code);
      GameCtl.INSTANCE.loadNextScene(EGameSceneName.LoginScene);
      NetCtl.INSTANCE.close();
    }
  }

  // 通知服务器 执行进入游戏的逻辑
  private doEnterGame(pNumPlayerId: number) {
    const tAccEnterGame = new AccEnterC2S();
    tAccEnterGame.id = pNumPlayerId;
    NetCtl.INSTANCE.send(tAccEnterGame);
  }

  // 服务器确认进入了游戏
  public didEnterGame(pMsg: AccEnterS2C) {
    if (pMsg.code > 0) {
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.EnterErr28, null, null);
      console.log(" ############ 进入游戏出错 ############ ", pMsg.code);
      GamePersist.INSTANCE.showToast("login_text10014");
    } else {
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.EnterSuc27, null, null);
      console.log(" ############ 进入游戏正确 ############ ");
      GameCtl.INSTANCE.loadNextScene(EGameSceneName.MainScene);
    }
  }

  // 角色创建逻辑 如果平台支持获取用户信息 就不显示创建角色的界面
  private doCreatePlayer() {
    const tAccCreateC2S = new AccCreateC2S();
    NetCtl.INSTANCE.send(tAccCreateC2S);
  }

  // 服务器返回创建角色的结果
  public onReceiveCreateS2C(pMsg: AccCreateS2C) {
    if (pMsg.code > 0) {
      console.log(" ############ 创建角色失败 ############ ");
      // GameHttps.INSTANCE.sendLoginPointBI(null, GameBIType.PlayerErr24, null, null);
      GamePersist.INSTANCE.showToast("login_text10015");
      return;
    }
    console.log(" ############ 创建角色成功 ############ ");
    const tNumPlayerId = pMsg.id;
    DataPlayer.INSTANCE.PlayerId = tNumPlayerId;
    this.doEnterGame(tNumPlayerId);

  }

  // 是否存在保存的账号
  private isExistSavedGameAccount(): boolean {
    const gameAccount = this.getGameAccount();
    const gameAccountId = gameAccount.game_account_id;
    const gameAccountSign = gameAccount.game_account_sign;
    Misc.myLog(" ############ 当前记录的账号 gameAccountId ############ ", gameAccountId);
    Misc.myLog(" ############ 当前记录的账号 gameAccountSign ############ ", gameAccountSign);
    return gameAccountId !== "" && gameAccountSign !== "";
  }

  // 保存账号信息
  private saveGameAccount() {
    const gameAccount = {
      game_account_id: DataAcc.INSTANCE.gameAccountId,
      game_account_sign: DataAcc.INSTANCE.gameAccountSign,
    };
    const data: string = JSON.stringify(gameAccount);
    Laya.LocalStorage.setItem(DataAcc.INSTANCE.accOpenId + "_" + LoginCtl.mStrGameAccountKey, data);
  }

  // 用户授权账号更改 
  public onAccountChange(pMsg: any) {
    // 保存平台账号
    DataAcc.INSTANCE.gameAccountId = pMsg.account;
    DataAcc.INSTANCE.gameAccountSign = pMsg.sign;
    this.saveGameAccount();
  }

  // 获取本地存储的账号信息
  private getGameAccount() {
    const gameAccount = {
      game_account_id: DataAcc.INSTANCE.gameAccountId,
      game_account_sign: DataAcc.INSTANCE.gameAccountSign,
    };

    console.log(" ############ 运行内存中获取登录数据 id=%s, sign=%s ############ ", gameAccount.game_account_id, gameAccount.game_account_sign);

    if (gameAccount.game_account_id.length !== 0) {
      return gameAccount;
    }


    let data: string = Laya.LocalStorage.getItem(DataAcc.INSTANCE.accOpenId + "_" + LoginCtl.mStrGameAccountKey);
    try {
      if (data) {
        const savedJson = JSON.parse(data);
        console.log(" ############ 缓存中获取登录数据 id=%s, sign=%s ############ ", savedJson.game_account_id, savedJson.game_account_sign);
        if (savedJson.game_account_id) {
          gameAccount.game_account_id = savedJson.game_account_id;
          gameAccount.game_account_sign = savedJson.game_account_sign;
        }
      }
    } catch (e) {
      Misc.myWarn("failed parse account data");
    }

    if (Partner.PARTNER_NAME === "Toutiao") {
      data = Laya.LocalStorage.getItem(LoginCtl.mStrGameAccountKey);
      try {
        if (data) {
          const savedJson1 = JSON.parse(data);
          console.log(" ############ 缓存中获取登录数据 id=%s, sign=%s ############ ", savedJson1.game_account_id, savedJson1.game_account_sign);
          if (savedJson1.game_account_id) {
            gameAccount.game_account_id = savedJson1.game_account_id;
            gameAccount.game_account_sign = savedJson1.game_account_sign;
          }
        }
      } catch (e) {
        Misc.myWarn("failed parse account data");
      }
    }

    return gameAccount;
  }

  // 清除账号信息
  private cleanGameAccount() {
    console.log(" ########### 清除缓存数据 ############ ");
    DataAcc.INSTANCE.gameAccountId = "";
    DataAcc.INSTANCE.gameAccountSign = "";
    DataAcc.INSTANCE.LoginData = null;
  }


}
