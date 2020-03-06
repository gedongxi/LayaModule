import BaseComponent from "../base/BaseComponent";
import ResourecLoader from "../../commonUnit/ResourceLoader";
import { IServerListVO, ServerList } from "../../config/vo/ConfigVO";

export default class SelectServerItem extends BaseComponent {
  public static GetComponent(node: Laya.Sprite): SelectServerItem {
    return node.getComponent(SelectServerItem);
  }

  // 内容
  private btnSelect: Laya.Button = null;

  public onAwake() {

    super.onAwake();
  }

  public init(pServerId: number) {
    const tSysServer: IServerListVO = ServerList.get(pServerId);
    this.btnSelect = this.owner.getChildByName("btnSelect") as Laya.Button;
    this.btnSelect.label = tSysServer.name;
  }


  public onDestroy() {
    super.onDestroy();
  }

  public onDisable() {
  }
}
