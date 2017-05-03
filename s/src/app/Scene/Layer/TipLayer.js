/**
 * Created by beyondray on 2015/9/7.
 * Desc:备用的提示框
 */

var TipLayer = cc.Layer.extend({
	ctor:function(text){
		this._super();
		this.initTipUI(text);
	},
	initTipUI:function(text){
		var listener = (function(){
			this.removeFromParent();
		}).bind(this);
		this.showFramework("ok", listener);
		var x =  this.blueBg.getContentSize().width/2;
		var y = this.blueBg.getContentSize().height/2;
		uiFactory.createTTF({ text : text, size : 30, color : display.COLOR_WHITE}, x, y, this.blueBg);
	},
	showFramework:function(btnText, clickListener){
		this.boxBg = new cc.Sprite(res.Bar_bg5_png);
		this.boxBg.setPosition(cc.p(display.cx,display.cy));
		this.addChild(this.boxBg);

		this.blueBg = new cc.Sprite(res.Blue_bg_png);
		this.blueBg.setPosition(cc.p(304,390));
		this.boxBg.addChild(this.blueBg);

		this.titleBg = new cc.Sprite(res.Bar_bg7_png);
		this.titleBg.setPosition(cc.p(this.boxBg.getContentSize().width/2+UI_CENTER_OFFER_X,this.boxBg.getContentSize().height+15));
		this.boxBg.addChild(this.titleBg);

		// 显示其上的按钮
		this.controlBtn = new PYButton(res.PlayButton_png, btnText, 30, clickListener, false, true);
		this.controlBtn.attr({ x : 304, y: 80, anchorX : 0.5, anchorY : 0.5});
		this.controlBtn.runAction(cc.sequence(uihelper.getCustomEasingAction(), cc.delayTime(1)).repeatForever());
		this.boxBg.addChild(this.controlBtn, 1);
	}
})