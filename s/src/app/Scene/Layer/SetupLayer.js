/**
 * Created by beyondray on 2015/8/28.
 * Desc: 控制条（音乐，音效，facebook?, 返回）
 */

// var welcomeIcoPos1 = {
// 	soundP : {x : 80, y : 42},
// 	musicP : {x : 188, y : 42},
// 	fbP : {x : 296, y : 42},
// 	exitP : {x : 440, y : 48}
// 	}

var welcomeIcoPos = {
	soundP : {x : 60, y : 42},
	musicP : {x : 190, y : 42}
}
var welcomeIcoPos_qq = {
	soundP : {x : 60, y : 42},
	musicP : {x : 170, y : 42},
	forumP : {x : 280, y : 42}
}

var otherIcoPos = {
	soundP : {x : 110, y : 42},
	musicP : {x : 250, y : 42},
	exitP : {x : 420, y : 48}
	}
var otherIcoPos_qq = {
soundP : {x : 80, y : 42},
musicP : {x : 180, y : 42},
forumP : {x : 280, y : 42},
exitP : {x : 420, y : 48}
}

var SetupLayer = cc.Layer.extend({
	ctor:function(params){
		this._super();
		this.initData(params);
		this.initUI();
	},
	initData:function(params){
		this.name = params.name;
		this.level = params.level;
		this.callBack = params.callBack;
		this.size = servermode=="QQ" ? cc.size(349,288) : cc.size(289,288);
		this.scene = params.scene;

		this.offsetY = params.offsetY || 0;

		if(this.name!="WelcomeScene") {
			this.bgPos = cc.p(40, this.offsetY); // 背景位置
		}else{
			this.bgPos = cc.p(-100+175, this.offsetY); // 背景位置
		}

		this.state = "close";

		if(this.name == "WelcomeScene")
			this.IcoPos = servermode=="QQ" ? welcomeIcoPos_qq : welcomeIcoPos;
		else
			this.IcoPos = servermode=="QQ" ? otherIcoPos_qq : otherIcoPos;
	},
	initUI:function(){
		var first = true;
		//圆形果冻按钮
		this.setUp_btn = PYButton(res.Setup_bg_png, null, 0, (function(){
			if (this.state == "open")
				this.close();
			else
				this.open();
			this.setUp_btn.runAction(uihelper.getCustomEasingAction());
		}).bind(this),false,true);
		this.setUp_btn.attr({anchorX:0, anchorY:0, x:-25, y:-25+this.offsetY});
		this.addChild(this.setUp_btn, 3);

		//背景
		if(this.name=="WelcomeScene"){
			var rect = servermode=="QQ" ? cc.rect(115,0,385,92):cc.rect(175,0,325,92);
			this.bg = new cc.Sprite(res.Setup_open_bg_png,rect);
		}
		else{
			this.bg = new cc.Sprite(res.Setup_open_bg_png);
		}

		this.bg.attr({anchorX: 0, anchorY:0, x: this.bgPos.x, y:this.bgPos.y});
		this.addChild(this.bg, 2);

		//mask
		this.mask = new cc.Layer();
		this.mask.setPositionX(this.mask.x-OFFSET.x);
		this.addChild(this.mask);
		this.mask.addChild(new cc.LayerColor(new cc.color(0, 0, 0, 150)), -1);
		cc.eventManager.addListener(cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: function(){return true},
			onTouchEnded:(function(){this.close();}).bind(this)
		}), this.mask);

		//音效
		var soundBtn = new ccui.CheckBox(res.Sound_off_png, res.Sound_on_png);
		soundBtn.x = this.IcoPos.soundP.x;
		soundBtn.y = this.IcoPos.soundP.y;
		soundBtn.setAnchorPoint(cc.p(0, 0.5));
		var onSoundBtnStateChanged = function(){
			if(!first){
				game.playMusic(PRE_LOAD_MUSIC.click);
				game.gameData.soundOn = !game.gameData.soundOn;
				GameDataMgr.save(game.gameData);
			}
		}
		soundBtn.addEventListener(onSoundBtnStateChanged, this);
		this.bg.addChild(soundBtn);
		soundBtn.setSelected(game.gameData.soundOn);

		//背景音乐
		var musicBtn = new ccui.CheckBox(res.Music_off_png, res.Music_on_png);
		musicBtn.x = this.IcoPos.musicP.x;
		musicBtn.y = this.IcoPos.musicP.y;
		musicBtn.setAnchorPoint(cc.p(0, 0.5));
		var onMusicBtnStateChanged = function(){
			if(!first){
				game.playMusic(PRE_LOAD_MUSIC.click);
				game.gameData.musicOn = !game.gameData.musicOn;
				GameDataMgr.save(game.gameData);
				if(game.gameData.musicOn){
					game.playBackMusic();
				}
				else{
					game.stopMusic();
				}
			}
		}
		musicBtn.addEventListener(onMusicBtnStateChanged, this);
		this.bg.addChild(musicBtn);
		musicBtn.setSelected(game.gameData.musicOn);

		//facebook登录按钮
		if(this.name == "WelcomeScene"){
			/*
			var fbLoginBtn = new ccui.CheckBox(res.Facebook_on_png, res.Facebook_off_png);
			fbLoginBtn.x = this.IcoPos.fbP.x;
			fbLoginBtn.y = this.IcoPos.fbP.y ;
			fbLoginBtn.setAnchorPoint(cc.p(0, 0.5));
			fbLoginBtn.addEventListener(function(){}, this);
			this.bg.addChild(fbLoginBtn);
			*/
		}
		//论坛按钮
		if(servermode == "QQ"){
			var forumBtn = new ccui.Button(res.Forum_png); 
            var forumClick = (function(){
				forumBtn.runAction(uihelper.getCustomEasingAction());
				window.location.href=gameforumurl;
			}).bind(this);

			forumBtn.x=this.IcoPos.forumP.x;
            forumBtn.y=this.IcoPos.forumP.y;
            forumBtn.setAnchorPoint(cc.p(0, 0.5));
            forumBtn.addTouchEventListener(forumClick, this);
			this.bg.addChild(forumBtn);
		}

		//退出按钮
		if(this.name!="WelcomeScene") {
			var exitBtn = new ccui.Button(res.Exit_btn_png);
			exitBtn.x = this.IcoPos.exitP.x;
			exitBtn.y = this.IcoPos.exitP.y;
			exitBtn.setAnchorPoint(cc.p(0.5, 0.5));
			this.bg.addChild(exitBtn);

			var exitBtnClick = (function () {
				if (this.name == "SelectMapScene") {
					//this.removeFromParent();.
					game.stopMusic();
					switchScene("WelcomeScene");
				}
				else if (this.name == "PlayScene" /*|| this.name == "WelcomeScene"*/) {
						new BYMsgBox({
							type : 2,
							ico : [
								 {image : res.Fail_ico_bg_png,offset : cc.p(0,0), scale:2},
								{image : res.Heart_break_big,offset : cc.p(0,0), scale:2}
								],
							titleBg : { offset : cc.p(90,40) },
							title : res.Title_exitLevel,
							text : "你将失去一个体力!",
							button1Data : {front : res.Continue_btn, text : "",offset : cc.p(0,0),callback:function() {
									this.close();
							}.bind(this)},
							button2Data :  {front : res.End_btn, text : "",offset : cc.p(0,0),callback:function() {
								game.failLevel(this.level);
								//-- 记录未结束游戏时退出
								game.setEvent("exitLevelNotOver", {level: this.level, bubbleNum: this.parent.waitBubbleNum || 10000});

								cc.director.resume();
								switchScene("SelectMapScene");
							}.bind(this)}
					})
				}
			}).bind(this);
			exitBtn.addTouchEventListener(exitBtnClick, this);
		}
		first = false;
		this.close();
	},
	open:function(){
		this.state = "open";
		this.bg.setPosition(cc.p(-300,this.bgPos.y));
		this.bg.setVisible(true);
		this.mask.setVisible(true);

		if(this.scene){
			this.scene.pause();
		}

		this.bg.runAction(cc.moveTo(0.3, cc.p(this.bgPos.x, this.bgPos.y)).easing(cc.easeExponentialOut()));

	},
	close:function(){
		this.state = "close";
		this.bg.setVisible(false);
		this.mask.setVisible(false);

		if(this.scene){
			this.scene.resume();
		}

		if(this.name == "PlayScene"){
			//game.hideBannerAd();
		}
	}

})