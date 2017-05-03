/**
 * Created by beyondray on 2015/8/20.
 * Desc: 游戏顶部栏（进度，分数，等）
 */

var TopLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.initData(params);
		this.initUI();
		this.addTouchEventListenser();
		this.addScoreUpdateEventListenser();
	},
	initData:function(params){
		this.callBack = params.callBack;
		this.scene = params.scene;
		this.level = params.level || 1;
		this.time = params.time || 0;
		this.endTime = this.time;
		this.size = cc.size(DESIGN_WIDTH,TOP_RECT.height);
		this.setContentSize(this.size);
		this.maxScore = 0;
		this.score = 0;
		this.star = 0;
		this.starList = [];
		this.showedParticle = [];
		//UI
		this.progressLabel = null;
		this.scoreLabel = null;
		this.scoreBg = null;
		this.starProgress = null;
		this.timeLabel = null;
		this.timeProgress = null;
	},
	initUI:function(){
		//顶部背景
		var topBg = new cc.Scale9Sprite(res.GAME_TOP_PNG, cc.Rect(0, 0, this.size.width, this.size.height),cc.rect(0,0,0,0));
		topBg.attr({x: this.size.width/2, y:this.size.height/2+10});
		this.addChild(topBg);
		//倒计时
		if(this.time > 0)
			this.countDown();
		//游戏进度标签
		var fontDef = new cc.FontDefinition();
		fontDef.fontName = "debussy";
		fontDef.fontSize = 50;
		fontDef.textAlign = cc.TEXT_ALIGNMENT_CENTER;
		fontDef.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
		fontDef.fillStyle = cc.color(255, 255, 255);
		this.progressLabel = new cc.LabelTTF("0/0", fontDef);
		this.progressLabel.attr({
			x:this.size.width-20,
			y:this.size.height/2,
			anchorX: 1,
			anchorY: 0.5
		});
		this.addChild(this.progressLabel);

		//游戏进度类型图标
		var curModelIco = CURRENT_MODE == LEVEL_MODEL.save2 ? LEVEL_MODEL.save : CURRENT_MODE;
		var progressSp = new cc.Sprite(res[curModelIco + "_ico_png"]);
		progressSp.attr({
			x:this.size.width-this.progressLabel.getContentSize().width - 40,
			y:this.size.height/2+10,
			anchorX: 1,
			ahchorY: 0.5
		});
		this.addChild(progressSp);

		//关卡模式
		var gameModeIco = new cc.Sprite(res[curModelIco + "_ing_png"]);
		gameModeIco.attr({
			x:20,
			y:this.size.height/2+10,
			anchorX : 0,
			anchorY : 0.5,
			scale: 0.8
		});
		this.addChild(gameModeIco);
		fontDef.fontName = "debussy";
		fontDef.fontSize = 35;
		var levelLabel = new cc.LabelBMFont("第" + idTrunRealLevel(this.level)+"关", res.CN_FONT,-1,cc.TEXT_ALIGNMENT_LEFT,cc.p(0,0));
		levelLabel.attr({x: gameModeIco.getContentSize().width/2, y: 25});
		gameModeIco.addChild(levelLabel);

		//分数
		this.scoreBg = new cc.Sprite(res.game_top_smalbg_png);
		this.scoreBg.attr({
			x:gameModeIco.getContentSize().width + 40,
			y:this.size.height/2+10,
			anchorX:0,
			anchorY:0.5
		});
		this.addChild(this.scoreBg);
		fontDef.fontName = "debussy";
		fontDef.fontSize = 25;
		this.scoreLabel = new cc.LabelTTF("0", fontDef);
		this.scoreLabel.attr({x:this.scoreBg.getContentSize().width/2,y: this.scoreBg.getContentSize().height/2-2});
		this.scoreBg.addChild(this.scoreLabel);

		//【星数进度条】
		//数据
		var str = this.scene.levelData.level.starlevel;
		var scoreArr =str.split(",");
		this.maxScore = Number(scoreArr[scoreArr.length-1]);
		//进度条
		var sp = new cc.Sprite(res.starProgress_png);
		this.starProgress = new cc.ProgressTimer(sp);
		this.starProgress.type = cc.ProgressTimer.TYPE_BAR;
		this.starProgress.setPosition(cc.p(this.size.width/2+10,this.size.height/2+10));
		this.starProgress.setMidpoint(cc.p(0, 0));
		this.starProgress.setBarChangeRate(cc.p(1, 0));
		this.addChild(this.starProgress);
		this.starProgress.setPercentage(0);
		//进度条背景框
		var bg = new cc.Sprite(res.starProgressBg_png);
		bg.attr({x:this.width/2+10,y:this.size.height/2+10});
		this.addChild(bg);
		//进度条星型，标签（统称内容)
		this.starContent = new cc.Sprite();
		var bgSize = bg.getContentSize();
		this.starContent.attr({x:this.width/2+10,y:this.size.height/2+10});
		this.starContent.setContentSize(bgSize);
		this.addChild(this.starContent);
		var bgWidth = bg.getContentSize().width - 20;
		for(var i in scoreArr){
			var score = scoreArr[i];
			var tempX = (bgWidth*score/this.maxScore + 15);

			//暗星
			var starDisable = new cc.Sprite(res.progress_star_disable_png);
			starDisable.attr({x:tempX,y:bgSize.height/2});
			this.starContent.addChild(starDisable, 2);

			//Tag
			if(i != scoreArr.length-1){
				var progressTag = new cc.Sprite(res.progressTag_png);
				progressTag.attr({x:tempX, y: bgSize.height/2});
				this.starContent.addChild(progressTag);
			}

			//亮星
			var star = new cc.Sprite(res.progress_star_png);
			star.attr({x:tempX,y:bgSize.height/2});
			star.setVisible(false);
			this.starContent.addChild(star, 2);
			this.starList.push({sp : star, score : score});
		}
	},
	addTouchEventListenser: function () {
		this.touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			caller: this,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan
		});
		cc.eventManager.addListener(this.touchListener, this);
	},
	onTouchBegan:function(touch, event){
		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		var rect = cc.rect(0,0,this.caller.size.width,this.caller.size.height);
		if(cc.rectContainsPoint(rect, lp))
		{
			//cc.log("touch topLayer!!");
			return true;
		}
		else
			return false;
	},
	addScoreUpdateEventListenser: function(){
		this.scoreUpdateListenr = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			caller: this,
			eventName: "scoreUpdate",
			callback: this.scoreUpdate
		});
		cc.eventManager.addListener(this.scoreUpdateListenr, 1);
	},
	scoreUpdate:function(event){
		//cc.log("scoreUpdate");
		var data = event.getUserData();
		this.caller.score = data.score;
		this.caller.star = 0;

		//进度条
		var ratio = this.caller.score/this.caller.maxScore;
		if(ratio > 1.0) ratio = 1.0;
		this.caller.starProgress.setPercentage(ratio*100);
		//星形
		for(var i in this.caller.starList){
			var starData = this.caller.starList[i];
			if(this.caller.score > starData.score){
				starData.sp.setVisible(true);
				this.caller.star++;
				if(!this.caller.showedParticle[i]){
					// 显示星星特效
					game.bulletManage.load("top_star");
					var animation = game.bulletManage.getAnimation("top_star","start");
					if(animation){
						var aniSp = uiFactory.createSprite(null, starData.sp.x+1,starData.sp.y-1,0.5,0.5,this.caller.starContent,2);
						aniSp.setScale(2);
						aniSp.runAction(cc.sequence(cc.animate(animation), cc.callFunc(aniSp.removeFromParent)));
					}
					game.playMusic(PRE_LOAD_MUSIC.star);
					this.caller.showedParticle[i] = true;
				}
			}
		}
		//显示分数
		this.caller.scoreLabel.setString(this.caller.score);
		this.caller.scoreLabel.stopAllActions();
		this.caller.scoreLabel.runAction(new cc.Sequence(
			new cc.ScaleTo(0.1,1.1,1.1),
			new cc.ScaleTo(0.1,0.9,0.9),
			new cc.ScaleTo(0.1,1,1)
		));
	},
	// 更新当前游戏进度
	updateGameProgress:function(proStr){
		this.progressLabel.setString(proStr);
	},
	// 更新时间进度
	updateTimeProgress:function(updateTime){
		this.timeLabel.setString(updateTime);
		this.timeProgress.setPercentage(updateTime/this.endTime*100);
	},
	// 开始倒计时
	startTime:function(){
		this.state = "start";
		if(this.time > 0){
			var setCdTime = (function(){
				if(this.time > 0){
					this.time--;
					this.timeLabel.setString(string.PRE_ZERO(this.time, 2));
					this.timeLabel.runAction(new cc.sequence(
						cc.delayTime(1),
						cc.callFunc(setCdTime)
					));
				}else if(this.time == 0){
					this.timeLabel.setString("");
					//cc.log("When Time=0:", this.scene.m_state);
					if(this.scene.m_state == GAME_STATE.GS_FLY ||
						this.scene.m_state == GAME_STATE.GS_CHANGE){
						this.scene.waitBubbleNum = 0;
						//cc.log("FLY_END!!");
					}
					else{
						this.scene.gameOver({result:0}, true);
					}
				}
				this.timeProgress.setPercentage(( this.time)/this.endTime*100);
			}).bind(this);
			setCdTime();
		}
	},
	//停止倒计时
	stopTime:function(){
		if(this.timeLabel)
			this.timeLabel.stopAllActions();
	},
	//增加倒计时
	countDown:function(){
		this.state = "init";
		//时间条背景
		var cdBg = new cc.Sprite(res.cd_progress_bg_png);
		cdBg.attr({x:OFFSET.x + 40, y: READY_BUBBLE_POS.y});
		this.scene.addChild(cdBg);
		//时间条
		var cd = new cc.Sprite(res.cd_progress_png);
		this.timeProgress = new cc.ProgressTimer(cd);
		this.timeProgress.type = cc.ProgressTimer.TYPE_BAR;
		this.timeProgress.attr({x:OFFSET.x + 40, y: READY_BUBBLE_POS.y});
		this.timeProgress.setMidpoint(cc.p(0, 0));
		this.timeProgress.setBarChangeRate(cc.p(0, 1));
		this.timeProgress.setPercentage(100);
		this.scene.addChild(this.timeProgress);
		//时间标签
		var fontDef = new cc.FontDefinition();
		fontDef.fontName = "debussy";
		fontDef.fontSize = 22;
		fontDef.fillStyle = display.COLOR_UPDATE;
		fontDef.align = cc.TEXT_ALIGNMENT_CENTER;
		this.timeLabel = new cc.LabelTTF(this.time, fontDef);
		this.timeLabel.attr({x:OFFSET.x + 40,y:READY_BUBBLE_POS.y-3});
		this.scene.addChild(this.timeLabel);
	},
	//清除
	onCleanup:function(){
		this.removeEventListener(this.scoreUpdateListenr);
		this.scoreUpdateListenr = null;
	}
})