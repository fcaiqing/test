/**
 * Created by chuan on 2015/11/25.
 * Desc:
 */

var ShopLayer = cc.Layer.extend({
	payItemId:["A-PACKAGE-001","A-PACKAGE-002","B-PACKAGE-001","B-PACKAGE-002","B-PACKAGE-003"],
	isvip:false,
    callback:null,
    price:0,
	ctor: function(options){
		this._super();
        if(options){
            this.callback = options.callback;
            this.price = options.price;
        }
		//this.parent = params.parent
		this.size = cc.size(601,835);
		this.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});
        this.ignoreAnchor=false;
		this.mask = new BYMask({});
		this.mask.addChild(this);
		cc.director.getRunningScene().addChild(this.mask, MIDDLE_WIN_TAG, MIDDLE_WIN_TAG);
		if(servermode=="WANBA"){
			checkVIP(function(vip){
				this.isvip = vip == 1;
				this.initUI();
			}.bind(this));
		}
		else{
			this.initUI();
		}
	
		uihelper.setCustomPopAction(this);
		game.playMusic(PRE_LOAD_MUSIC.popWin);

	},

	initUI:function(){
		var boxBg = new cc.Sprite(res.ShopLayer_png);
		boxBg.setPosition(display.cx,display.cy);
		this.addChild(boxBg);
		for(var i = 1; i <= 4;i++){
			var payItem = this.buyGoldWithStar(i);
			var j = 5-i; //倒序取数组
			var payBtn = this.addPayBtn(this.payItemId[j],payItem.star,payItem.gold,460, -20+130*i);
			boxBg.addChild(payBtn);

			if(game.gameData.buyonce.p2 == 1 && i==4){
				payBtn.setEnable(false);
			}
		}
        var paySpecial= this.buyGoldWithStar(0);
		var giftBtn = this.addPayBtn(this.payItemId[0],paySpecial.star,paySpecial.gold, 470, 612,[res.btnGiftPack_png]);
		boxBg.addChild(giftBtn);
		if(game.gameData.buyonce.p1 == 1){
			giftBtn.setEnable(false);
		}
		this.addCloseBtn();
	},
	addPayBtn:function(itemid,price, gold,xOffset, yOffset,customimages){
		var payBtn = PayBtn(function(){
				if (game.getGold() >= 9999999) {
					this.payFailure();
					return;
				}
				
				game.payByStar(itemid, price,gold, function(success){
					if(success){
						if(itemid==this.payItemId[0]){
							var item4count = game.getItemCountByID(4);
							game.setItemCountByID(4, item4count + 3);
							var item5count = game.getItemCountByID(5);
							game.setItemCountByID(5, item5count + 3);
							//是购买一次的产品
							game.gameData.buyonce.p1=1;
                            payBtn.setEnable(false);
						}
						else if(itemid == this.payItemId[1]){
                            //是购买一次的产品
							game.gameData.buyonce.p2=1;
                            payBtn.setEnable(false);
						}
						game.addGold(gold);
                        if(game.getGold() > this.price){
                            if(this.callback){
                                this.callback(true);
                            }
                        }
                        else{
                            if(this.callback){
                                this.callback(false);
                            }
                        }
					}
					else{
						this.payFailure();
					}
				}.bind(this));
			}.bind(this),price,true,false,false,true,customimages);
			
			payBtn.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:xOffset,
				y:yOffset});
			return payBtn;
	},
	addCloseBtn:function(){
		var closeBtn = PYButton(res.Close_png,null,25,function() {
			this.mask.removeFromParent();
		}.bind(this));
		closeBtn.attr({
			anchorX:1,
			anchorY:1
		});
		closeBtn.setPosition(this.size.width+(display.width-this.size.width)/2+15,this.size.height+(display.height-this.size.height)/2-55)

		this.addChild(closeBtn);
	},
	payFailure:function(){
		
	},
	//用qbar的星星购买金币
	buyGoldWithStar:function(payID){
		var ratio = this.isvip ? 0.8 : 1;
        if(servermode == "HGAME"){
            ratio = 0.1;  //小伙伴平台显示人民币
        }
        else if(servermode == "NOSDK"){
            ratio = 0;
        }
		switch(payID){
			case 4:
				return {"gold":50,"star":20 * ratio};
				break;
			case 3:
				return {"gold":50,"star":50 * ratio};
				break;
			case 2:
				return {"gold":200,"star":180 * ratio};
				break;
			case 1:
				return {"gold":1000,"star":800 * ratio};
				break;
            case 0:
                return {"gold":128,"star":80 * ratio};
                break;
			default:
			break;
		}
		return null;
	}
})