import BaseComponent from "../scene/base/BaseComponent";
import Misc from "../commonUnit/Misc";
import GameCtl from "../scene/GameCtl";
import UIUtil from "../commonUnit/UIUtil";
import { EUIAlignFlag } from "../scene/base/BaseDefine";

export default class FpsComp extends BaseComponent {
  
  public static GetComponent(node: Laya.Sprite): FpsComp {
    return node.getComponent(FpsComp);
  }

  // 显示内容
  private txtText1: Laya.Text = null;
  private txtText2: Laya.Text = null;
  private txtText3: Laya.Text = null;
  private txtText4: Laya.Text = null;
  private txtText5: Laya.Text = null;
  private txtText6: Laya.Text = null;
  private txtText7: Laya.Text = null;
  private txtText8: Laya.Text = null;
  private txtText9: Laya.Text = null;
  private txtText10: Laya.Text = null;
  private txtText11: Laya.Text = null;

  private mMNum: number = 1024 * 1024;
  private mOriStatRenderFunction = null;

  public onAwake() {

    Misc.myLog(" ====== AlertComp onAwake ====== ");

    super.onAwake();
    UIUtil.setWidget(this.owner as Laya.Sprite, EUIAlignFlag.LEFT | EUIAlignFlag.TOP);

    const tPanel: Laya.Sprite = this.owner.getChildByName("sprList") as Laya.Sprite;
    this.txtText1 = tPanel.getChildByName("txtText1") as Laya.Text;
    this.txtText2 = tPanel.getChildByName("txtText2") as Laya.Text;
    this.txtText3 = tPanel.getChildByName("txtText3") as Laya.Text;
    this.txtText4 = tPanel.getChildByName("txtText4") as Laya.Text;
    this.txtText5 = tPanel.getChildByName("txtText5") as Laya.Text;
    this.txtText6 = tPanel.getChildByName("txtText6") as Laya.Text;
    this.txtText7 = tPanel.getChildByName("txtText7") as Laya.Text;
    this.txtText8 = tPanel.getChildByName("txtText8") as Laya.Text;
    this.txtText9 = tPanel.getChildByName("txtText9") as Laya.Text;
    this.txtText10 = tPanel.getChildByName("txtText10") as Laya.Text;
    this.txtText11 = tPanel.getChildByName("txtText11") as Laya.Text;


    const self = this;
    const anyStat: any = Laya.Stat;
    this.mOriStatRenderFunction = anyStat._StatRender.renderInfo;
    anyStat._StatRender.renderInfo = function() {
        self.refreshDebugPanel();
    };
    Laya.Stat.enable();
    anyStat._StatRender._show = true;
  } 

  public refreshDebugPanel() {
    if (this.destroyed) {
        return ;
    }
    const tStat = Laya.Stat as any;
    this.txtText1.text = tStat._fpsStr + "";
    this.txtText2.text = tStat._spriteStr + "";
    this.txtText3.text = Laya.Stat.renderBatches + "";
    this.txtText4.text = Laya.Stat.savedRenderBatches + "";
    this.txtText5.text = Math.floor(Laya.Resource.cpuMemory / this.mMNum * 100) / 100  + "M";
    this.txtText6.text = Math.floor(Laya.Resource.gpuMemory / this.mMNum * 100) / 100 + "M";
    this.txtText7.text = Laya.Stat.shaderCall + "";
    this.txtText8.text = Laya.Stat.trianglesFaces + "";
    this.txtText9.text = Laya.Stat.frustumCulling + "";
    this.txtText10.text = Laya.Stat.octreeNodeCulling + "";
    this.txtText11.text = GameCtl.INSTANCE.HeartBeat + "ms";
}
  
  public onEnable() {
    Misc.myLog(" ====== AlertComp onEnable ====== ");
  }

  public onDestroy() {
    
    Misc.myLog(" ====== AlertComp onDestroy ====== ");

    super.onDestroy();
  }

  public onDisable() {
    Misc.myLog(" ====== AlertComp onDisable ====== ");
  }
}
