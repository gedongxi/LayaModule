/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.animation {
    export class anim11UI extends Laya.EffectAnimation {
		public ani1:Laya.FrameAnimation;
        public static  uiView:any ={"type":"View","props":{},"compId":2,"child":[{"type":"Sprite","props":{"y":-52,"x":-51,"texture":"tempUI/operate/attack-button.png"},"compId":3}],"animations":[{"nodes":[{"target":3,"keyframes":{"scaleY":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleY","index":0},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleY","index":5},{"value":1,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleY","index":10}],"scaleX":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleX","index":0},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleX","index":5},{"value":1,"tweenMethod":"linearNone","tween":true,"target":3,"key":"scaleX","index":10}]}}],"name":"ani1","id":1,"frameRate":24,"action":0}],"loadList":["tempUI/operate/attack-button.png"],"loadList3D":[]};
        constructor(){ super();this.effectData =ui.animation.anim11UI.uiView;}
    }
    REG("ui.animation.anim11UI",anim11UI);
}
export module ui.fight {
    export class FightSceneUI extends Laya.Scene {
		public UIRoot:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("fight/FightScene");
        }
    }
    REG("ui.fight.FightSceneUI",FightSceneUI);
}
export module ui.init {
    export class InitSceneUI extends Laya.Scene {
		public UIRoot:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("init/InitScene");
        }
    }
    REG("ui.init.InitSceneUI",InitSceneUI);
}
export module ui.login {
    export class LoginSceneUI extends Laya.Scene {
		public UIRoot:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("login/LoginScene");
        }
    }
    REG("ui.login.LoginSceneUI",LoginSceneUI);
}
export module ui.main {
    export class MainSceneUI extends Laya.Scene {
		public UIRoot:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("main/MainScene");
        }
    }
    REG("ui.main.MainSceneUI",MainSceneUI);
}
export module ui.transition {
    export class TransitionSceneUI extends Laya.Scene {
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("transition/TransitionScene");
        }
    }
    REG("ui.transition.TransitionSceneUI",TransitionSceneUI);
}