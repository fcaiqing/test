/**
 * Created by beyondray on 2015/9/2.
 * Desc: 购买障碍界面
 */

var BuyNextStepLayer = cc.Layer.extend({
	ctor:function(message,callback){
		this._super();
		this.message = message;
		this.callback = callback;
		this.initData();
		this.initUI();
		game.playMusic(PRE_LOAD_MUSIC.popWin);
		uihelper.setCustomPopAction(this);
	},
	initData:function(){
		this.ignoreAnchor=false;
		this.setAnchorPoint(0.5,0.5);
		this.setPosition(display.cx,display.cy);

		this.size = cc.size(620,630);
		this.buySuccess = false;
	},
	initUI:function(){
		var boxBg = new cc.Sprite(res.Pay_item_13);
		boxBg.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});

		var fontDef = new cc.FontDefinition();
		fontDef.fontSize=28;
		fontDef.fontName=BUTTON_FONT;
		fontDef.fillStyle=cc.color(255, 82, 0, 255);
		var labelMessage = new cc.LabelTTF(this.message,fontDef);
		labelMessage.attr({
			anchorX:0.5,
			anchor:0.5,
			x:310,
			y:180
		})
		//labelMessage.setPosition(cc.p(50,220));
		boxBg.addChild(labelMessage);

		var bgSize = this.size;

		var controlBtn = BYBtn([res.BtnPayGold10_png],function(){
			performWithDelay(this,function(){
				var buyCount = 1;
				game.toCallBuyItem("item_13",buyCount,function(success){
					this.buySuccess=success;
					if(success){
						new BYMsgBox({
							type:2,
							effect:{offset:cc.p(0,0)},
							ico : res.Add_hp_success,
							title:res.Title_buy_success,
							text:"购买成功!",
							button1Data:{front:res.OK_text,callback:function(){}}
						});
						//-- 购买成功 障碍倒计时结束
						

					}
					this.parent.removeFromParent();	
				}.bind(this));
			}.bind(this),0.1);

		}.bind(this),false,true,false,false);
		controlBtn.attr({
			anchorX:0.5,
			anchor:0.5,
			x:305,
			y:85
		})
		boxBg.addChild(controlBtn);

		var closeBtn = BYBtn([res.Close_png],function(){
			this.parent.removeFromParent();
		}.bind(this),false,true,false,true);

		closeBtn.attr({
			anchorX:1,anchorY:1,
			x:this.size.width+15,
			y:this.size.height+15
		});

		boxBg.addChild(closeBtn);
		this.addChild(boxBg);
	},
	onExit:function(){
		this._super();
		if(this.callback){
			this.callback(this.buySuccess);
		}
	}

})