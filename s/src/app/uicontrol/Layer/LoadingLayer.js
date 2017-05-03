/**
 * Created by beyondray on 2015/8/31.
 * Desc: 加载过度
 */


var LoadingLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.full = params.full || false;
		this.attr({x:display.cx,y:display.cy,anchorX:0.5,anchorY:0.5});
		this.ignoreAnchor = false;
		//this.mask = new BYMask({ item : this});

		if(this.full){
			// 欢迎界面背景
			this.bg = new cc.Sprite(res.WelcomBg_png);
			this.bg.attr({x: display.cx, y: display.cy, anchorX: 0.5, anchorY: 0.5});
			this.addChild(this.bg);
			this.showFullScreen();
		}
		else{
			this.size = cc.size(400, 300);
			this.bg= new cc.Scale9Sprite(res.Bar_bg5_png, this.size,cc.rect(41,41,524,524));
			this.bg.setPosition(cc.p(display.cx,display.cy));
			this.addChild(this.bg);
			this.loadingActionShow();
		}
	},
	// 整屏显示
	showFullScreen:function(){
		var loading = new cc.Sprite(res.Loading_png);
		loading.setPosition(cc.p(display.cx,400));
		this.addChild(loading);
	},
	// 显示一个对话框
	loadingActionShow:function(){
		var swap = new cc.Sprite(res.Swap_png);
		swap.setPosition(cc.p(display.cx,display.cy))
		this.addChild(swap);

		var action1 = cc.spawn(cc.rotateTo(3, 180),cc.fadeOut(3));
		var action2 = cc.spawn(cc.rotateTo(3, 360),cc.fadeIn(3));
		var repeatAction = cc.repeatForever(cc.sequence(action1,action2));
		swap.runAction(repeatAction);
	}
})