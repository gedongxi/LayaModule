import AccNetHandler from "./handler/AccNetHandler";
import DebugNetHandler from "./handler/DebugNetHandler";
import GameSocket from "./socket/GameSocket";
import * as ProtoReflect from "../proto/ProtoReflect";
import * as ProtoCrypto from "../proto/ProtoCrypto";
import { SOCKET_DATA, SOCKET_CLOSE, SOCKET_CONNECT, SOCKET_ERROR } from "./socket/SocketDefine";
import { IProtoMsgC2S } from "../proto/ProtoDefine";
import { DispatcherList } from "../proto/ProtoDispatcher";
import { ByteArray } from "../commonUnit/NetByteArray";
import PlayerNetHandler from "./handler/PlayerNetHandler";
import Misc from "../commonUnit/Misc";
import EventUtil from "../event/EventUtil";
import { Events } from "../event/Event";
import RoomNetHandler from "./handler/RoomNetHandler";
import NetListener from "./NetListener";
import WeaponNetHandler from "./handler/WeaponNetHandler";

export default class NetCtl {
  // 获取NetControll实例
  public static get INSTANCE(): NetCtl {
    if (!NetCtl.singleInstance) {
      NetCtl.singleInstance = new NetCtl();
    }
    return NetCtl.singleInstance;
  }
  private static singleInstance: NetCtl;


  // // 需要出现loading的协议队列
  // private waitingList: number[];

  // 是否是手动断开socket（不主动重连）
  private isMaualCloseSocket: boolean = false;

  private protoBuffer: ByteArray;

  private gameSocket: GameSocket = null;
  private host: string;
  private port: number;
  private path: string;
  private isSecurity: boolean;

  private netListener: NetListener;

  // private connectFailedTimes: number;

  // 各协议的Handler
  private accNetHandler: AccNetHandler;
  private playerNetHandler: PlayerNetHandler;
  private debugNetHandler: DebugNetHandler;
  private roomNetHandler: RoomNetHandler;
  private weaponNetHandler: WeaponNetHandler;

  constructor() {

    // 创建缓存
    this.protoBuffer = new ByteArray();
    // 创建socket
    this.gameSocket = new GameSocket();
    this.gameSocket.type = GameSocket.TYPE_BINARY;

    // 处理重连
    this.netListener = new NetListener();

    // 监听socket状态
    EventUtil.Dispatcher.on(SOCKET_DATA, this, this.onSocketData);
    EventUtil.Dispatcher.on(SOCKET_CONNECT, this, this.onSocketOpen);
    EventUtil.Dispatcher.on(SOCKET_CLOSE, this, this.onSocketClose);
    EventUtil.Dispatcher.on(SOCKET_ERROR, this, this.onSocketError);
  }

  // 初始化
  public createNetHandler() {
    // 创建各个协议的处理
    this.debugNetHandler    = new DebugNetHandler();
    this.accNetHandler      = new AccNetHandler();
    this.playerNetHandler   = new PlayerNetHandler();
    this.roomNetHandler     = new RoomNetHandler();
    this.weaponNetHandler   = new WeaponNetHandler();
  }

  // 获取gameSocket
  public get GameSocket(): GameSocket {
    return this.gameSocket;
  }

  // 获取当时是否已经和服务器建立了连接
  public get IsConnected(): boolean {
    return this.gameSocket.connected;
  }

  // 连接服务器 可以同时制定paht和是否使用安全套接字
  public connect(host: string, port: number, path?: string, isSecurity?: boolean): void {
    this.host = host;
    this.port = port;
    this.path = path;
    this.isSecurity = isSecurity;
    this.close();
    this.doConnect();
  }

  public close() {
    if (this.gameSocket != null && this.gameSocket.connected) {
      console.log(" ############ 手动断开socket ############ ");
      this.isMaualCloseSocket = true;
      this.gameSocket.close();
    }
  }

  // 发送c2s协议
  public send(msg: IProtoMsgC2S, bForceWaiting: boolean = true) {
    // if (bForceWaiting) {
    //   const msgTemp: any = msg;
    //   this.waitingList.push(msgTemp.MSG_ID);
    //   GamePersist.INSTANCE.showWaiting();
    // }
    if (!this.gameSocket.connected) {
      return;
    }
    // console.log("############new send");
    const msgTemp: any = msg;
    if (msgTemp.MSG_ID !== 2567) {
      Misc.myLog("客户端发送", msgTemp);
      // console.log("sqq 客户端发送", msgTemp);
    }
    this.gameSocket.writeBytes(msg.encode());
  }

  public onSocketOpen(): void {
  }

  public onSocketClose(): void {
    console.log(" ############ socket连接失败 ############ ");
    if (!this.isMaualCloseSocket) {
      EventUtil.Dispatcher.event(Events.EVENT_RECONNECT); 
    } else {
      this.isMaualCloseSocket = false;
    }
  }

  public onSocketError(): void {
    // console.log("############onSocket Error");
  }

  public onSocketData(): void {
    // TODO 应该让内存循环使用
    // 放置占用一块过大的内存 如果当前始终缓存数据都已经处理 并且超过阈值就先释放
    const bufferLen: number = this.protoBuffer.length;
    if (bufferLen === this.protoBuffer.position && bufferLen >= 1024) {
      this.protoBuffer.clear();
    }
    this.gameSocket.readBytes(this.protoBuffer, this.protoBuffer.length);
    this.parseProto();
  }

  // 执行连接socket
  private doConnect() {
    const schema = this.isSecurity ? "wss://" : "ws://";
    let serverUrl = schema + this.host + ":" + this.port;
    if (this.path) {
      serverUrl += ("/" + this.path);
    }
    this.gameSocket.connectByUrl(serverUrl);
  }


  // 解析协议
  private parseProto(): void {
    while (this.protoBuffer.length !== this.protoBuffer.position) {
      const protoMsgLen = this.protoBuffer.readUnsignedShort();
      if (protoMsgLen > this.protoBuffer.bytesAvailable) {
        // 数据包尚未接收完整 把位置回退
        this.protoBuffer.position = this.protoBuffer.position - 2;
        break;
      }
      // 根据长度将协议数据包读入
      let bytes: ByteArray = new ByteArray();
      this.protoBuffer.readBytes(bytes, 0, protoMsgLen);
      // 读取index, 如果非0表示消息已经加密
      const index = bytes.readUnsignedByte();
      if (index) {
        bytes = ProtoCrypto.decode(index, bytes);
      }

      // 确定协议Id和解析类 进行协议的解析
      const protoMsgSecId = bytes.readUnsignedByte();
      const protoMsgSubId = bytes.readUnsignedByte();
      const protoMsgId = (protoMsgSecId << 8) + protoMsgSubId;
      const protoClazz = ProtoReflect.ProtoMsgMap[protoMsgId];
      
      if (protoClazz && protoClazz.decode && protoClazz.EVENT_NAME) {
        const protoMsg = protoClazz.decode(bytes);
        protoMsg.MSG_ID = protoMsgId;
        const protoMsgEventName: string = protoClazz.EVENT_NAME;
        const protoMsgDispatcher: Laya.EventDispatcher = DispatcherList[protoMsgSecId];
        if (protoMsgId !== 2567 && protoMsgId !== 5377 ) {
          Misc.myLog("=================> 服务器返回", protoClazz.EVENT_NAME, protoMsg);
        }
        protoMsgDispatcher.event(protoMsgEventName, protoMsg);
      } else {
        console.error("unknonw msg id: ", protoMsgId);
      }
    }
  }
}
