export default class BaseComponent extends Laya.Script {
  
  public onAwake() {
    this.replaceLabel();
  }

  public onEnable() {
  }

  public onDestroy() {
  }

  private replaceLabel() {
    // const arrLabel =  this.owner.getComponents(Laya.Label);
    // arrLabel.forEach((lab) => {
    //   const textId =  lab.string;
    //   if (!lab.font) {
    //     lab.font = GamePersist.INSTANCE.fontNormal;  
    //   }
    //   lab.string = I18N.getUIText(textId);
    // });
  }
}
