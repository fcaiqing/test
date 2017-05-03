var NewYearGiftLayer = cc.Layer.extend({
    cellheight:106,
    cellwidth:500,
    rankdata:null,
    isvip:false,
    ctor:function(){
        this._super();
        //显示自己
        this.size = cc.size(601,835);
        this.listwidth = 530;
        this.listheight = 620;
        this.leftpadding = (this.size.width-this.listwidth)/2;
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
        
        //播放声音
        uihelper.setCustomPopAction(this);
		game.playMusic(PRE_LOAD_MUSIC.popWin);
        
        //初始化界面
        this.iniUI();
    },
    iniUI:function(){
        //背景图片
        var boxBg = new cc.Sprite(res.NewYearGift_back);
		boxBg.setPosition(display.cx,display.cy);
		this.addChild(boxBg, 0, 1007);
        
        this.addCloseBtn();
        this.addTitleText();
        if(servermode=="WANBA"){
			checkVIP(function(vip){
				this.isvip = vip == 1;
				this.addBuyBtn();
			}.bind(this));
		}
		else{
			this.addBuyBtn();
		}
        
    },
    addCloseBtn:function(){
		var closeBtn = PYButton(res.Close_png,null,25,function() {
			this.mask.removeFromParent();
		}.bind(this));
		closeBtn.attr({
			anchorX:1,
			anchorY:1
		});
		closeBtn.setPosition(this.size.width+(display.width-this.size.width)/2+15,this.size.height+(display.height-this.size.height)/2-55);

		this.addChild(closeBtn);
	},
    addBuyBtn:function(){
        var price = 80;
        var ratio = this.isvip ? 0.8 : 1;
        if(servermode == "HGAME"){
            ratio = 0.1;  //小伙伴平台显示人民币
        }
        else if(servermode == "NOSDK"){
            ratio = 0;
        }
        price = price * ratio;
        var btntext = ""+price+cfgPayUnit;
        
        var buyBtn = PYButton(res.NewYearGift_button,btntext,25,function() {
			this.payForGift(price);
		}.bind(this));
		buyBtn.attr({
			anchorX:0.5,
			anchorY:0.5
		});
		buyBtn.setPosition(display.cx, (display.height-this.size.height)/2+120);
		this.addChild(buyBtn);
    },
    addTitleText:function(){
        var fontDef = new cc.FontDefinition();
			fontDef.fontSize=24;
			fontDef.fontName=BUTTON_FONT;
			fontDef.fillStyle=cc.color(0, 0, 0, 255);
        var lblText = new cc.LabelTTF("活动时间: 2月3日18时 - 2月13日24时",fontDef);
        lblText.attr({
            anchorX:0.5,
			anchorY:0.5
        });
        lblText.setPosition(display.cx, this.size.height+(display.height-this.size.height)/2 - 275);
		this.addChild(lblText);
    },
    payForGift:function(price){
        if (game.getGold() >= 9999999) {
            this._customPayFailed("金币数量已达到上限");
            return;
        }
        var itemid = "C-PACKAGE-001";
        var gold = 188;
        game.payByStar(itemid, price,gold, function(success){
            if(success){
                //道具各6个
                var item4count = game.getItemCountByID(4);
                game.setItemCountByID(4, item4count + 6);
                var item5count = game.getItemCountByID(5);
                game.setItemCountByID(5, item5count + 6);
                var item6count = game.getItemCountByID(6);
                game.setItemCountByID(6, item5count + 6);
                
                game.addGold(gold);
            }
        }.bind(this));
	},
    _customPayFailed:function(msg){
		new BYMsgBox({
			type: 2,
			ico: res.Heart_break_big,
			title: res.Failure,
			text: msg,
			unlock:true,
			button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {

			}}
		});
	}
})