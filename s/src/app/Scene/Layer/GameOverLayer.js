/**
 * Created by beyondray on 2015/8/19.
 * 游戏结束弹出界面(成功or失败)
 */

var GameOverLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.initData(params);
		this.initUI();
		game.playMusic(PRE_LOAD_MUSIC.popWin);
	},
	initData:function(params){
		this.result = params.result || 0;
		this.scene = params.scene;
		this.levelData = params.levelData;
		this.newRecord = params.newRecord || false;
		this.level = params.level;
		this.retryFlag = false;
		this.score = params.score || 0;
		this.star = params.star || 1;
		this.size = cc.size(609,605);
		this.attr({x:display.cx,y:display.cy, anchorX:0.5, anchorY:0.5});
		this.ignoreAnchor = false;
		this.controlBtn = null;
		//this.mask = BYMask.new({ item : this });
	},
	initUI:function(){
		//var ratio = 0;
		//var recordData = game.getTodayFail();
		if(this.result == 1)
			this.showSuccessBlank();
		else
			this.showFailBlank();
	},
	showFramework:function(){
		this.boxBg = new cc.Scale9Sprite(res.Bar_bg5_png,cc.rect(0,0,310,306),cc.rect(60,60,211,196));
		this.boxBg.setContentSize(609,605);
		this.boxBg.setPosition(cc.p(display.cx,display.cy));
		this.addChild(this.boxBg);

		this.titleBg = new cc.Sprite(res.Bar_bg7_png);
		this.titleBg.setPosition(cc.p(this.boxBg.getContentSize().width/2+UI_CENTER_OFFER_X,this.boxBg.getContentSize().height+15));
		this.boxBg.addChild(this.titleBg);

		this.blueBg = new cc.Scale9Sprite(res.Blue_bg_png,cc.rect(0,0,183,144),cc.rect(28,23,143,100));
		this.blueBg.setContentSize(492,296);
		this.blueBg.setPosition(cc.p(304,390));
		this.boxBg.addChild(this.blueBg);


	},
	showSuccessBlank:function(){
		var clickListener = (function(){
			game.stopMusic(true);
			game.addHP(1);
			this.removeFromParent();
		}).bind(this);
		this.showFramework();

		// 显示其上的按钮
		this.controlBtn = BYBtn([res.PlayButton_png,res.Continue_btn],clickListener, false, true,false,false);
		this.controlBtn.attr({ x : 304, y: 80, anchorX : 0.5, anchorY : 0.5});
		this.controlBtn.runAction(cc.sequence(uihelper.getCustomEasingAction(), cc.delayTime(1)).repeatForever());
		this.boxBg.addChild(this.controlBtn, 1);

		//胜利文本
		var winText = new cc.Sprite(res.Win_text_png);
		winText.setPosition(cc.p(250,80));
		this.titleBg.addChild(winText);

		//胜利光圈效果
		var effect = new cc.Sprite(res.Effect_bg_png);
		effect.scale=2;
		effect.setPosition(cc.p(250,153));
		this.blueBg.addChild(effect);
		var action1 = cc.rotateTo(3, -180);
		var action2 = cc.rotateTo(3, -360);
		var repeatAction = cc.sequence(action1,action2).repeatForever();
		effect.runAction(repeatAction);

		var starPosSet = [
			{x:157.65,y:252,rotaion : -30},
			{x:256.85,y:280,rotaion : 0},
			{x:358.85,y:252,rotaion : 30}
		];
		for(var i in starPosSet){
			var starPos = starPosSet[i];
			if(this.star > i){
				var starSp = new cc.Sprite(res.Star_big_normal_png);
				starSp.setPosition(cc.p(starPos.x,starPos.y));
				starSp.setScale(1.4);
				starSp.setRotation(starPos.rotaion);
				this.blueBg.addChild(starSp, 2);
			}else{
				var starSp = new cc.Sprite(res.Star_big_disable_png);
				starSp.setPosition(cc.p(starPos.x,starPos.y));
				starSp.setScale(1.4);
				starSp.setRotation(starPos.rotaion);
				this.blueBg.addChild(starSp, 2);
			}
		}
		var winIco = new cc.Sprite(res.Win_ico_png);
		winIco.setPosition(cc.p(250, 120));
		this.blueBg.addChild(winIco);

		var whiteBg = new cc.Sprite(res.White_bg1_png);
		whiteBg.setPosition(304, 180);
		whiteBg.setAnchorPoint(cc.p(0.5, 0.5));
		this.boxBg.addChild(whiteBg);

		var level = uiFactory.createTTF({text : "第 "+ idTrunRealLevel(this.level)+" 关", size : 25, color : display.COLOR_TITLE},whiteBg.getContentSize().width/2, 70, whiteBg);
		var score = uiFactory.createTTF({text : this.score, size : 30, color : display.COLOR_TITLE}, whiteBg.getContentSize().width/2, 35, whiteBg);

		//  记录胜利后剩余的球数, TODO
		if(this.newRecord){
			uiFactory.createSprite(res.New_record_ico_png, 150,60, 0.5, 0.5, whiteBg);
			// 发送指定关卡的分数及星数到服务器, TODO
		}
		game.stopMusic(game.backGroundMusic);
		game.playMusic(PRE_LOAD_MUSIC.win);
	},
	showFailBlank:function(){
		var clickListener = (function(){
			game.stopMusic(true);
			this.retry(null);
			this.removeFromParent();
		}).bind(this);
		// 记录失败后剩余行数
		this.showFramework();

		// 显示其上的按钮
		this.controlBtn = BYBtn([res.PlayButton_png,res.Retry_btn],clickListener, false, true,false,false);
		this.controlBtn.attr({ x : 304, y: 80, anchorX : 0.5, anchorY : 0.5});
		this.controlBtn.runAction(cc.sequence(uihelper.getCustomEasingAction(), cc.delayTime(1)).repeatForever());
		this.boxBg.addChild(this.controlBtn, 1);

		//图片精灵
		uiFactory.createSprite(res.Fail_text_png, 250,80, 0.5, 0.5, this.titleBg);
		uiFactory.createSprite(res.Fail_ico_bg_png, 250,149, 0.5, 0.5, this.blueBg);
		uiFactory.createSprite(res.Fail_ico_png, 250,120, 0.5, 0.5, this.blueBg);
		var whiteBg = uiFactory.createSprite(res.White_bg1_png, 304,180, 0.5, 0.5, this.boxBg);
		uiFactory.createTTF({text : "第 "+ idTrunRealLevel(this.level)+" 关", size : 25, color : display.COLOR_UPDATE},
				whiteBg.getContentSize().width/2, 70, whiteBg);

		//关闭按钮
		var closeBtn = PYButton(res.Close_png, "", 30, (function(){this.removeFromParent();}).bind(this), false, true);
		closeBtn.setPosition(this.boxBg.getContentSize().width+15,this.boxBg.getContentSize().height+15);
		closeBtn.setAnchorPoint(cc.p(1.0, 1.0));
		this.boxBg.addChild(closeBtn);

		game.stopMusic(game.backGroundMusic);
		game.playMusic(PRE_LOAD_MUSIC.lost);
	},
	continuee:function(){
		var levelData,realLevel,level;

		if (this.level >= MAX_LEVEL) {
			return;
		}else {
			this.retryFlag = true;
		}
		var nextLevel = self.level + 1;

		levelData = this.loadData(nextLevel);
		realLevel = idTrunRealLevel(nextLevel);
		level = nextLevel;
		game.curLevel = nextLevel;

		this.loadMapData(realLevel, function(error, levelData) {
			var time = Number(levelData.level.time) || 0; // 计时
			if (time > 0) {
				game.isTimeModel = true;
			}
			else {
				game.isTimeModel = false;
			}
			//-- 弹出选择道具界面
			if (cc.director.getRunningScene().getChildByTag(POP_WIN_TAG)) {
				cc.director.getRunningScene().removeChildByTag(POP_WIN_TAG);
			}
			var mask = new BYMask({});
			var selecteItemLayer = new SelecteItemBeforeStart({model: levelData.level.mode, level: realLevel, callBack: function () {
				if (!INPUT_MODEL && game.getHP() <= 0) {
					//-- 弹出购买生命界面
					var addHpLayer = new AddHpLayer({});
					var mask = new BYMask({});
					mask.addChild(addHpLayer);
					cc.director.getRunningScene().addChild(mask, POP_WIN_TAG, POP_WIN_TAG);
					return;
				}

				if (!game.getTwoHourFree()) {
					game.addHP(-1);
				}
				if(!levelData){
					return;
				}
				else if (levelData.level.mode == LEVEL_MODEL.wheel){
					CURRENT_MODE = LEVEL_MODEL.wheel;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData ,
						offset : cc.p(display.cx,  display.cy+200)});
				}
				else if (levelData.level.mode == LEVEL_MODEL.classic){
					CURRENT_MODE = LEVEL_MODEL.classic;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save){
					CURRENT_MODE = LEVEL_MODEL.save;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save2){
					CURRENT_MODE = LEVEL_MODEL.save2;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save3){
					CURRENT_MODE = LEVEL_MODEL.save3;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData, save3Flag:true});
				}
			}});
			mask.addChild(selecteItemLayer);
			cc.director.getRunningScene().addChild(mask, POP_WIN_TAG, POP_WIN_TAG);

		});
	},
	retry:function(items){
		this.retryFlag = true;
		var levelData = this.levelData;
		var realLevel = idTrunRealLevel(this.level);
		var level = this.level;

		//-- 弹出选择道具界面
		if (cc.director.getRunningScene().getChildByTag(POP_WIN_TAG)) {
			cc.director.getRunningScene().removeChildByTag(POP_WIN_TAG);
		}
		var mask=new BYMask({});
		var selecteItemLayer=new SelecteItemBeforeStart({model : levelData.level.mode, 
        level : realLevel, callBack :
			function(items){
				if (!INPUT_MODEL && game.getHP() <= 0) {
					//-- 弹出购买生命界面
					var addHpLayer = new AddHpLayer({});
					//var mask = new BYMask({});
					//mask.addChild(addHpLayer);
					//cc.director.getRunningScene().addChild(mask, POP_WIN_TAG, POP_WIN_TAG);
					return;
				}

				if (!game.getTwoHourFree()) {
					game.addHP(-1);
				}
				if(!levelData){
					return;
				}
				else if (levelData.level.mode == LEVEL_MODEL.wheel){
					CURRENT_MODE = LEVEL_MODEL.wheel;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData ,
						offset : cc.p(display.cx,  display.cy+200)});
				}
				else if (levelData.level.mode == LEVEL_MODEL.classic){
					CURRENT_MODE = LEVEL_MODEL.classic;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save){
					CURRENT_MODE = LEVEL_MODEL.save;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save2){
					CURRENT_MODE = LEVEL_MODEL.save2;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData });
				}
				else if (levelData.level.mode == LEVEL_MODEL.save3){
					CURRENT_MODE = LEVEL_MODEL.save3;
					switchScene("PlayScene",{items : items,level : level, jsonObj : levelData, save3Flag:true});
				}
			},
            cancelCallback:function(){
                switchScene("SelectMapScene");   
            }});
		mask.addChild(selecteItemLayer);
		cc.director.getRunningScene().addChild(mask,POP_WIN_TAG,POP_WIN_TAG);
	},
	onEnter:function(){
		this._super();
		if(this.result == 1 && Number(game.curLevel) == Number(game.gameData.lastLevel)){
			if(game.curLevel == MAX_LEVEL )
				game.gameData.lastLevel = MAX_LEVEL;
			else
				game.gameData.lastLevel = game.curLevel +1;
			GameDataMgr.save(game.gameData);

            var levelId = idTrunRealLevel(game.curLevel);
			//向后台报告进度
			if(servermode == "WANBA" || servermode == "HGAME"|| servermode == "QQ"){
                devServer.reportProcess(levelId);
			}
		}
	},
	onExit:function(){
		this._super();

		game.stopMusic();
		// 重玩时不执行下面
		if(this.retryFlag)return;

		if(this.result == 1 && (Number(game.curLevel) + 1 == Number(game.gameData.lastLevel))){
			switchScene("SelectMapScene",{ enterNext : true, autoScroll : true });
		}
		else{
			switchScene("SelectMapScene");
		}
	}
})

