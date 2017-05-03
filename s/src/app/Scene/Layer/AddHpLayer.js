/**
 * Created by zhengliming on 2015/10/29.
 * Desc:
 */

var AddHpLayer = cc.Layer.extend({
	ctor: function(){
		this._super();
		//this.parent = params.parent
		this.size = cc.size(608,606);
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
		if (game.getIsFirstNoLife()) {
			this.mask.removeFromParent();
			game.setIsFirstNoLife();
			this.showRewardHP();
		}else {
			this.initUI();
		}
		uihelper.setCustomPopAction(this);
		game.playMusic(PRE_LOAD_MUSIC.popWin);

	},

	//-- 第一次没体力时提示送三条
	showRewardHP:function() {
		game.addHP(3);

		new BYMsgBox({
			type: 2,
			ico: res.HP_heartes,
			title: res.Zs_title,
			text: "赠送3个体力",
			button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {

			}}
		});
	},

	initUI:function(){

		var boxBg = new cc.Sprite(ITEM_INFOR["item_" + HP_ITEM_ID].image);
		boxBg.setPosition(display.cx,display.cy);
		this.addChild(boxBg);

		var price = Number(ITEM_INFOR["item_" + HP_ITEM_ID].price);
		var buyBtn = BYBtn([res.Btn_bg1_big,res.OK_text],
			function() {
				if (game.getHP() < MAX_HP_INCLUE_ACTIVE) {
					//-- 调用购买生命API
					var itemCount = 5; //MAX_HP - game.getHP();  固定购买5体力
					game.toCallBuyItem("item_"+HP_ITEM_ID, 5, function (success) {
						//-- 弹出购买成功
						if (success) {

							// new BYMsgBox({
							// 	type: 2,
							// 	effect: {image: res.Effect_bg_png, offset: cc.p(0, 0)},
							// 	ico:  res.Add_hp_success,
							// 	title: BuySuccess,
							// 	text: "两小时体力无限!",
							// 	button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {

							// 	}}
							// });
							game.playMusic(MUSIC_CONFIG.buy_hp_success);

							//game.addGold(0-price*itemCount);
							game.addHP(itemCount);
						}
						this.mask.removeFromParent();
					}.bind(this))
				} else {
					//-- 已达最大生命上限
					this.payFailure();
				}
			}.bind(this),false,true,false,false);
			buyBtn.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:304,
				y:105});
			boxBg.addChild(buyBtn);

		var closeBtn = PYButton(res.Close_png,null,25,function() {
			this.mask.removeFromParent();
		}.bind(this));
		closeBtn.attr({
			anchorX:1,
			anchorY:1
		});
		closeBtn.setPosition(this.size.width+(display.width-this.size.width)/2+15,this.size.height+(display.height-this.size.height)/2+15)
		this.addChild(closeBtn);
	},
	payFailure:function(){
		//-- 弹出失败窗口
		new BYMsgBox({
			type: 2,
			ico: [
				{image: res.Heart_break_big, offset: cc.p(0, 0), scale: 1 }
			],
			title: Failure,
			text:"已达到生命值上限",
			button1Data: {front: res.OK_text2, text: "", offset: cc.p(0, 0), callback:null}
		});
	},

})