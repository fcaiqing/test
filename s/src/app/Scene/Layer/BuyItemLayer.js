/**
 * Created by beyondray on 2015/9/2.
 * Desc: 购买道具选择框
 */

var BuyItemLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.initData(params);
		this.initUI();
		game.playMusic(PRE_LOAD_MUSIC.popWin);
		uihelper.setCustomPopAction(this);
	},
	initData:function(params){
		this.scene = params.scene;
		this.itemId = params.itemId || null;
		this.rebate = 1; // 折扣
		this.callback = params.callback;
		this.dontShowCount = params.dontShowCount || false; // 控制是否显示数量
		this.ignoreAnchor=false;
		this.setAnchorPoint(0.5,0.5);
		this.setPosition(display.cx,display.cy);

		this.size = cc.size(620,630);
		//this.mask = BYMask:new({ item : this })
		this.buySuccess = false;
		this.dntShowTipWin = params.dntShowTipWin || false; // 是否显示购买成功后的提示窗口，解锁购买成功不显示
	},
	initUI:function(){

		var itemTypeCount=0;
		for(var i in ITEM_ID){
			++itemTypeCount;
		}
		this.itemId = this.itemId || Math.floor(itemTypeCount*Math.random()+1);
		var boxBg = new cc.Sprite(ITEM_INFOR["item_" + this.itemId].image);
		boxBg.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});

		var bgSize = this.size;
		var curPrice =  Math.floor(ITEM_INFOR["item_" + this.itemId].price);

		var controlBtn = BYBtn([res.Btn_bg1_big,res.OK_text],function(){

			//购买逻辑

			//调用购买道具API

			performWithDelay(this,function(){
				var oldItemCount = game.getItemCountByID(this.itemId)||0;
				var buyCount = ITEM_INFOR["item_" + this.itemId].count || 1;
				game.toCallBuyItem("item_"+this.itemId,buyCount,function(success){
					this.buySuccess=success;
					if(success){
						if(!this.dntShowTipWin){
							new BYMsgBox({
								type:2,
								effect:{offset:cc.p(0,0)},
								ico : res.Add_hp_success,
								title:res.Title_buy_success,
								text:"购买成功!",
								button1Data:{front:res.OK_text2,callback:function(){}}
							});
						}
						//-- 购买成功增加相应的道具
						game.setItemCountByID(this.itemId, oldItemCount + buyCount);
						//game.addGold(-curPrice);

					}
					this.parent.removeFromParent();	
				}.bind(this));
			}.bind(this),0.1);

		}.bind(this),false,true,false,false);
		controlBtn.attr({
			anchorX:0.5,
			anchor:0.5,
			x:304,
			y:105
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
		//closeBtn.setPosition(boxBg.getContentSize().width+15,boxBg.getContentSize().height+15);

		boxBg.addChild(closeBtn);
		//uihelper.setCustomPopAction(this);
		//this.setNodeEventEnabled(true);
		this.addChild(boxBg);
	},
	onExit:function(){
		this._super();
		if(this.callback){
			this.callback(this.buySuccess);
		}
	}

})