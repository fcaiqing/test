/**
 * Created by beyondray on 2015/9/11.
 * Desc:地图顶部界面（血条，金钱)
 */

var SelectTopLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.initData(params);
		this.initUI();
		this.addHPUpdateEventListenser();
		// this.addGoldUpdateEventListenser();
	},
	initData:function(params){
		this.callBack = params.callBack;
		this.scene = params.scene;
		this.size = cc.size(TOP_RECT.width,TOP_RECT.height);
		this.setContentSize(this.size);
		this.setScale(TOP_RECT.width/DESIGN_WIDTH, TOP_RECT.width/DESIGN_WIDTH+0.3);
	},
	initUI:function(){
		var bg = uiFactory.createScale9Sprite(res.Map_top_bg_png,cc.size(0, 0, this.size.width, this.size.height),cc.rect(27,23,653,47),
				this.size.width/2,this.size.height/2, this);//res, x, y, anchorX, anchorY, parent, zorder

		//【生命】
		this.heartBg = uiFactory.createSprite(res.Map_top_blue_bg_png,bg.getContentSize().width/2 - 180,bg.getContentSize().height/2+7, 0.5, 0.5, bg);
		this.heartBg.setScale(0.9, 0.692);
		uiFactory.createSprite(res.Heart_png, -10,15, 0.5, 0.5, this.heartBg);
		//测试减少血量=======================
		//if(game.gameData.resetTime == 0)
			//game.addHP(-MAX_HP/2,MAX_HP);
		//===================================
		// 血量
		this.HP = uiFactory.createTTF({
			text : game.getHP(),
			fontName : "debussy",
			size : 30
		}, -10, 15, this.heartBg);
		var addHpcallback = function(){
			if(game.getHP() < MAX_HP_INCLUE_ACTIVE){
				var addHpLayer = new AddHpLayer({});
				//cc.director.getRunningScene().addChild(addHpLayer, POP_WIN_TAG);
				//game.addHP(1, MAX_HP);
			}
			else{
				new BYMsgBox({
					type: 2,
					ico: [
						{image: res.Heart_break_big, offset: cc.p(0, 0), scale: 1 }
					],
					title: Failure,
					text:"已达到生命值上限",
					button1Data: {front: res.OK_text2, text: "", offset: cc.p(0, 0), callback:null}
				});
			}
		}
		var addHp = new PYButton(res.Add_normal_png, null, 30, addHpcallback, false, true);
		addHp.attr({x:150,y:this.HP.y, anchorX:0.5, anchorY:0.5});
		this.heartBg.addChild(addHp);

		//【倒计时】
		this.countDown();
		this.checkCountDown();

		// //【金币】
		// this.goldBg = uiFactory.createSprite(res.Map_top_blue_bg_png,bg.getContentSize().width/2 + 180,bg.getContentSize().height/2+7, 0.5, 0.5, bg);
		// this.goldBg.setScale(0.9, 0.692);
		// uiFactory.createSprite(res.Gold_png, -10,15, 0.5, 0.5, this.goldBg);
		// // 金币数
		// this.gold = uiFactory.createTTF({
		// 	text : game.getGold(),
		// 	fontName : "debussy",
		// 	size : 30
		// }, 80,12, this.goldBg);
		// var addGoldcallback = function(){
		// 	if(game.getGold() < 9999999){
		// 		//var shopLayer = new ShopLayer({});
		// 		//cc.director.getRunningScene().addChild(shopLayer, POP_WIN_TAG);
		// 		//game.addGold(100);
        //         new BYMsgBox({
        //             type: 2,
        //             ico: res.Heart_break_big,
		// 	        title: res.Failure,
        //             text: "游戏即将停止运营，已暂停充值",
        //             unlock:true,
        //             button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
        //                 //var shopLayer = new ShopLayer({"callback":reqPaySdk,"price":price});
        //             }}
        //         });
		// 	}
		// }
		// var addGold = new PYButton(res.Add_normal_png, null, 30, addGoldcallback, false, true);
		// addGold.attr({x:150,y:this.gold.y+2, anchorX:0.5, anchorY:0.5});
		// this.goldBg.addChild(addGold);


	},
	addHPUpdateEventListenser: function(){
		this.HPUpdateListenr = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			caller: this,
			eventName: "HPUpdate",
			callback: function(event){
				var data = event.getUserData();
                this.caller.HP.setString(data.HP);
				if(data.HP >= MAX_HP){
					this.caller.timeLabel.stopAllActions();
					this.caller.timeLabel.setString("MAX");
				}
            }
		});
		cc.eventManager.addListener(this.HPUpdateListenr, 1);
	},
	/*addGoldUpdateEventListenser: function(){
		this.goldUpdateListenr = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			caller: this,
			eventName: "goldUpdate",
			callback: function(event){
				var data = event.getUserData();
				this.caller.gold.setString(data.gold);
			}
		});
		cc.eventManager.addListener(this.goldUpdateListenr, 1);
	},*/
	//增加倒计时
	countDown:function(){
		this.timeLabel = uiFactory.createTTF({text : "00:00" , size : 30, fontName : "debussy"},80,12, this.heartBg);
	},
	checkCountDown:function(){
        var defineMAX = "MAX";
		if(game.getHP() >= MAX_HP){
			this.timeLabel.stopAllActions();
			this.timeLabel.setString(defineMAX);
		}
		else{
			//【计算加血量及剩余恢复时间】
			var resetTime = Math.round(game.getResetTime());
			var offsetTime = resetTime - getCurTime();
			//cc.log("offsetTime:", offsetTime);
			var leftTime = 0, addHp = 0;
			//未到恢复时间
			if( offsetTime > 0){
				leftTime = offsetTime;
			}
			else{ //超过恢复时间
				addHp = Math.floor(Math.abs(offsetTime)/RESET_TIME);
				leftTime = RESET_TIME - Math.abs(offsetTime) % RESET_TIME;
			}
			//【加血】
			//cc.log("addHp:", addHp);
			game.addHP(addHp, MAX_HP);
			this.HP.setString(game.getHP());
			if(game.getHP() >= MAX_HP){
				leftTime = 0;
				this.timeLabel.stopAllActions();
				this.timeLabel.setString(defineMAX);
			}

			if(leftTime > 0){
				var setCdTime = (function(){
					if(leftTime > 0){
						leftTime--;
						var timeStr = sec_2_Format(leftTime);
						this.timeLabel.setString(timeStr);
						this.timeLabel.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(setCdTime)));
					}
					else if(leftTime == 0){
						this.timeLabel.setString(defineMAX);
						game.addHP(1, MAX_HP);
						this.HP.setString(game.getHP());
						game.setResetTime(getCurTime()+RESET_TIME);
						this.checkCountDown();
					}
				}).bind(this);
				setCdTime();
			}
		}
	}

})