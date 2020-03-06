import BaseComponent from "../base/BaseComponent";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import { ServerList } from "../../config/vo/ConfigVO";
import SelectServerItem from "./SelectServerItem";
import EventUtil from "../../event/EventUtil";
import { Events } from "../../event/Event";
import Misc from "../../commonUnit/Misc";
import UIUtil from "../../commonUnit/UIUtil";
import { EUIAlignFlag } from "../base/BaseDefine";

export default class SelectServer extends BaseComponent {
  public static GetComponent(node: Laya.Sprite): SelectServer {
    return node.getComponent(SelectServer);
  }

  // 内容
  private listComp: Laya.List = null;


  public onAwake() {
    UIUtil.setWidget(this.owner as Laya.Sprite, EUIAlignFlag.MIDDLE | EUIAlignFlag.CENTER);
    super.onAwake();

    this.listComp = this.owner.getChildByName("listComp") as Laya.List;
    this.init();
  }

  public init() {
    this.listComp.vScrollBarSkin = null;
    const tBtnClose: Laya.Button = this.owner.getChildByName("btnClose") as Laya.Button;
    tBtnClose.on(Laya.Event.CLICK, this, this.onBtnClose);

    // 加载小元素预设
    ResourecLoader.loadFileAsyn("prefabs/login/SelectServerItem.prefab", (pNode: Laya.Prefab) => {
      this.loadItem(pNode);
    });
  }

  private loadItem(pNode: Laya.Prefab) {

    const tArrId: number[] = ServerList.getExtra("group_list")[0];
    // 竖间距
    const tNumSpaceY: number = 5;

    const tOwner = this.owner as Laya.Sprite;

    for (let i = 0; i < tArrId.length; i++) {
      const tNode = pNode.create();
      this.listComp.addChild(tNode);
      SelectServerItem.GetComponent(tNode).init(tArrId[i]);
      const tNumPosX: number = (tOwner.width - tNode.width) / 2;
      const tNumPosY: number = 20 + tNumSpaceY * i + i * tNode.height;
      tNode.x = tNumPosX;
      tNode.y = tNumPosY;

      const tBtnSelect: Laya.Button = tNode.getChildByName("btnSelect") as Laya.Button;
      tBtnSelect.on(Laya.Event.CLICK, this, () => {
        this.onBtnSwitchServer(tArrId[i]);
      });
    }

  }

  public onStart() {

  }

  public onBtnClose() {
    this.owner.destroy();
  }

  public onDestroy() {
    super.onDestroy();
  }

  public onDisable() {
  }

  private onBtnSwitchServer(pNumServerId: number) {
    Misc.myLog("===========选择", pNumServerId);
    // 通知LoginUI进行切换服务器的逻辑显示
    EventUtil.Dispatcher.event(Events.EVENT_LOGIN_SWITCH_SERVER, pNumServerId);
    this.onBtnClose();
  }
}
