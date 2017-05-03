/**
 * Created by beyondray on 2015/8/15.
 * Desc: 游戏控制管理中心
 */

var GameManage = cc.Class.extend({
	bulletManage: null,
	gameData: null,
	lastPayItem:null,
    timer : null,
    socket : null,
	ctor: function () {
		this.initUserData();
		this.initData();
	},
	initUserData: function () {
		this.gameData = GameDataMgr.load();
		if (!this.gameData) {
			//cc.log("initUserData");
			this.gameData = GameDataMgr.initDefaultData();
			GameDataMgr.save(this.gameData, false);
		}
	},
	initData: function () {
		this.isTimeModel = false;    // 当前是否是时间模式
		this.bulletManage = new BulletManager();
		this.curGameScore = 0;         // 当前游戏的分数
		this.curSelectedScrollY = 0;  // 选择界面滚动Y偏移量
		this.curLevel = this.gameData.lastLevel;
		this.backGroundMusic = 0;
		this.preKeyPressTime = true;
		this.totalGuideBtn = [];
		this.inGuide = false;
		/*this.user = User.new({name : "test"}); // 自己的FB信息
		 this.friends = {};
		 this.keyIsUserIdFriends = {};    // key 为userId
		 this.email = {};
		 this.loginFB = false ;   // 是否登陆了FACEBOOK*/
	},
	refreshScore: function (addScore) {
		this.curGameScore += addScore;
		cc.eventManager.dispatchCustomEvent("scoreUpdate", {score: this.curGameScore});
	},
	playBackMusic: function () {
		//cc.log("this.gameData.musicOn:", this.gameData.musicOn);
		if (!this.gameData.musicOn)return;

		this.stopMusic();
		var currentSceneName = cc.director.getRunningScene().getName();
		if (this.isTimeModel) {
			this.backGroundMusic = MUSIC_CONFIG.timeModel;
		}
		else {
			if (currentSceneName == "SelectMapScene" || currentSceneName == "WelcomeScene" || currentSceneName == "LoadingScene") {
				this.backGroundMusic = PRE_LOAD_MUSIC.selecteMapScene;
			}
			else if (currentSceneName == "PlayScene" && (CURRENT_MODE == LEVEL_MODEL.classic || CURRENT_MODE == LEVEL_MODEL.save2)) {
				this.backGroundMusic = MUSIC_CONFIG.classic;
			}
			else if (currentSceneName == "PlayScene" && (CURRENT_MODE == LEVEL_MODEL.save || CURRENT_MODE == LEVEL_MODEL.save3 )) {
				this.backGroundMusic = MUSIC_CONFIG.saveBg;
			}
			else if (currentSceneName == "PlayScene" && CURRENT_MODE == LEVEL_MODEL.wheel) {
				this.backGroundMusic = MUSIC_CONFIG.wheelBg;
			}
		}
                                                                   
		//cc.loader.load(this.backGroundMusic.res,function(){},function(){
			this.playMusic(this.backGroundMusic);
		//}.bind(this));

	},
	playMusic: function (musicData) {
		if (!musicData || musicData.res == "")return;

		//音乐
		if (musicData.type == 1) {
			if (this.gameData.musicOn) {
				cc.audioEngine.playMusic(musicData.res, musicData.isLoop == 1);
			}
		}//音效
		else {
			if (this.gameData.soundOn) {
				cc.audioEngine.playEffect(musicData.res, false);
				//cc.log("播放音效"+musicData.res);
				//cc.log(JSON.stringify(musicData));
			}
		}
	},
	stopMusic: function () {
		cc.audioEngine.stopMusic();
	},
	unloadMusic: function (releaseMusicData) {
		if (!releaseMusicData || releaseMusicData.res == "")return;

		//音乐
		if (releaseMusicData.type == 1) {
			cc.audioEngine.stopMusic(releaseMusicData.res);
		}//音效
		else {
			cc.audioEngine.unloadEffect(releaseMusicData.res);
		}
	},
	/*preloadMusic:function(musicData){
	 if(!musicData || musicData.res == "")return;

	 if(musicData.type == 1){
	 //audio.preloadMusic(musicData.res);
	 }
	 else{
	 //audio.preloadSound(musicData.res);
	 }
	 },
	 unloadMusic:function(musicData){
	 if(!musicData || musicData.res == "")return;

	 },*/
	// 获取指定关的星数及分数
	getStarAndScoreByLevel: function (level) {
		if(!this.gameData.levelInfor){
			return 0;
		}
		return this.gameData.levelInfor["level" + level];
	},
	setStarAndScoreByLevel: function (level, score, star) {
		var haveNewRecord = false;
		var score = Number(score);
		var star = Number(star);

		if (!game.gameData.levelInfor["level" + level]) {
			game.gameData.levelInfor["level" + level] = {score: 0, star: 0};
		}

		if (game.gameData.levelInfor["level" + level].score < score) {
			game.gameData.levelInfor["level" + level].score = score;
			haveNewRecord = true;
		}

		if (game.gameData.levelInfor["level" + level].star < star) {
			game.gameData.levelInfor["level" + level].star = star;
		}

		GameDataMgr.save(game.gameData);
		return haveNewRecord;
	},
	// 获取指定障碍开始时间
	getObstacleInforById: function (id) {
		return this.gameData.obstacleInfor[id] || null;
	},
	setObstacleInforById: function (id, time) {
		this.gameData.obstacleInfor[id] = time;
		GameDataMgr.save(this.gameData);
	},
	getResetTime: function () {
		return this.gameData.resetTime || 0;
	},
	setResetTime: function (time) {
		this.gameData.resetTime = time;
		GameDataMgr.save(this.gameData);
	},
	getHP: function () {
		return this.gameData.HP || 0;
	},
	addHP: function (offset, maxHp) {
		if(offset == 0){
			return;
		}
		//消耗生命记录时间
		if (offset < 0 && this.getHP() == MAX_HP) {
			this.setResetTime(getCurTime() + RESET_TIME);
		}

		var curHp = this.getHP();
		var newHp = curHp + offset;
		if (newHp < 0) {
			curHp = 0;
		}
		else if (offset == 1 && maxHp > 0 && curHp >= maxHp) {
			//do nothing;
		}
        else if(maxHp && maxHp > 0 && newHp > maxHp){
            curHp = maxHp;
        }
		else{
			curHp = newHp;
		}

		this.gameData.HP = curHp;
		GameDataMgr.save(this.gameData);
		cc.eventManager.dispatchCustomEvent("HPUpdate", {HP: curHp});
	},
	getGold: function () {
		return this.gameData.gold || 0;
	},
	addGold: function (offset) {
		var curGold = this.getGold() + offset;
		if (curGold < 0) {
			curGold = 0;
		}
		this.gameData.gold = curGold;
		GameDataMgr.save(this.gameData);
		cc.eventManager.dispatchCustomEvent("goldUpdate", {gold: curGold});
	},

	getItemCountByID: function (id) {
		return this.gameData.items[id];
	},

	setItemCountByID: function (id, count) {
		this.gameData.items[id] = count;
		GameDataMgr.save(this.gameData);
	},

	toCallBuyItem: function (itemId, itemCount, callback) {
		var buySuccess = this.buy(ITEM_INFOR[itemId].um_itemId, itemCount, ITEM_INFOR[itemId].price, callback);
		
        if (buySuccess) {
			callback(true)
		}
		else{
            //已经交给shoplayer处理
			//callback(false);
		}
	},
	buy: function (itemName, count, price, callback) {
		//cc.log("买道具"+itemName+",数量"+count+",价格"+price);
		if(price && game.getGold()>=price){
			game.addGold(0-price);
			return true;
		}
        var reqPaySdk = function(success){
            if(success){
                game.addGold(0-price);
            }
            if(callback){
                callback(success);
            }
        }
		new BYMsgBox({
			type: 2,
			ico: res.Heart_break_big,
			title: res.Failure,
			text: "金币不足",
			unlock:true,
			button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
				//var shopLayer = new ShopLayer({"callback":reqPaySdk,"price":price});
			}}
		});
		return false;
	},
	payByStar:function(itemid,price,gold, payCallback){
		if(servermode == 'WANBA'){
			payByWanbaStar(itemid,function(rsp){
				if(rsp.result == 0){
					payCallback && payCallback(true);
					this._paySuccess();
				}
				else if(rsp.result == 1004){
					this.lastPayItem = itemid;
					window.__paySuccess = function(){
						this.payByStar(itemid,price,gold, payCallback);
					}.bind(this);
					window.__payError = function(){
						this._customPayFailed("余额不足，充值失败");
					}.bind(this);
					window.__payClose = function(){
						this._customPayFailed("余额不足，充值已取消");
					}.bind(this);
					window.popPayTips({defaultScore : price});
				}
				else{
					var msg = this._getErrorMessage(rsp.result);
					this._customPayFailed(msg);
				}
			}.bind(this));
			return;
		}
		//通过服务器实现购买
		if(servermode == "QQ"){
            var userinfo = store.getAll();
            var qqid = userinfo["qbopenid"];
			var token = userinfo["refreshToken"];
			refreshToken(qqid, token, function(success){
                if(success){
                    pay(itemid,price,gold, function(param){
                        if(param == 0){
                            if(payCallback){
                                payCallback(true);
                            }
                            this._paySuccess();
                        }
                        else if(param == 1001){
                            this._reloginRequired();
                        }
                        else{
                            this._payFailed();
                        }
                    }.bind(this));
                }
                else{
                    //如果刷新失败
                    this._reloginRequired();
                }
            }.bind(this));
            return;
        }
        if(servermode == "HGAME"){
            var onPaySuccess = function(rsp){
                if(rsp.code === 0){
                    payCallback(true);
                }
                else if(rsp.code === -1){
                    this._customPayFailed("支付已取消");
                }
                else{
                    this._customPayFailed(rsp.message);
                }
            }.bind(this);
            devServer.getPayParam(price, itemid, "兑换金币 "+gold, onPaySuccess);
            return;
        }
        if(servermode=="NOSDK"){
            if(payCallback){
                payCallback(true);
            }
            this._paySuccess();
        }
	},
    _reloginRequired:function(){
        if(!game){
            return;
        }
        game.showAlertMessage("登录已过期，请重新登录！",function(){
            cc.director.runScene(new WelcomeScene());
        }.bind(this));
    },
	_paySuccess:function(){
		new BYMsgBox({
			type: 2,
			ico: res.PaySuccess_png,
			title: res.Title_buy_success,
			text: "购买成功!",
			unlock:true,
			button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {

			}}
		});
	},
	_payFailed:function(){
		this._customPayFailed("支付失败，请再试一次");
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
	},
	loadPayCfg: function () {
		cc.loader.loadJson("res/pay/cfg.json", function (x, payInfo) {
			ITEM_INFOR = payInfo;
		});
	},
	use: function (itemName, count, price) {
		//使用魔法药水
	},

	getGuideId: function () {
		return this.gameData.guideId || 0;
	},

	setGuideId: function (id) {
		this.gameData.guideId = id;
		GameDataMgr.save(this.gameData);
	},

	//-- 检测是否有引导
	checkNewGuide: function (level, cb) {
		var newGuideData = NEW_GUIDE[level];
		if (newGuideData) {
			new NewGuideLayer({
				ico: newGuideData.image,
				text: newGuideData.dec,
				button1Data: {text: "Play", offset: cc.p(0, 0), callback: function () {
					if (cb) {
						cb();
					}
				}
				}
			});

		}
	},

	setTodayFail: function (record) {
		var date = new Date();
		var month = date.getMonth();
		var day = date.getDay();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		var dateKey = date.getFullYear() + "-" + month + "-" + day;

		if (!this.gameData.todayFail[dateKey]) {
			this.gameData.todayFail[dateKey] = {};
		}
		this.gameData.todayFail[dateKey] = record || {};
		GameDataMgr.save(this.gameData);
	},

	getTodayFail: function () {
		var date = new Date();
		var month = date.getMonth();
		var day = date.getDay();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		var dateKey = date.getFullYear() + "-" + month + "-" + day;
		return this.gameData.todayFail[dateKey] || {};
	},

	getIsFirstNoLife: function () {
		return this.gameData.isFirstNoLife;
	},

	setIsFirstNoLife: function () {
		this.gameData.isFirstNoLife = false;
		GameDataMgr.save(this.gameData);
	},

	getIsFirstFail: function () {
		return this.gameData.isFirstFail;
	},

	setIsFirstFail: function () {
		this.gameData.isFirstFail = false;
		GameDataMgr.save(this.gameData);
	},

	//-- 更新当前的生命值
	updateCurrentHp: function () {
		var time = Math.floor(new Date().getTime() / 1000);
		if (game.getHP() < MAX_HP) {
			var resetTime = game.getResetTime();
			var offsetTime = resetTime - time;
			var leftTime = 0;
			var addHp = 0;
			if (offsetTime > 0) {
				//-- 未到恢复时间
				leftTime = offsetTime;
			} else {
				//-- 当前时间超过恢复时间
				addHp = Math.floor(Math.abs(offsetTime) / RESET_TIME) + 1;
				leftTime = RESET_TIME - Math.abs(offsetTime) % RESET_TIME;
			}
			if (game.getHP() + addHp >= MAX_HP) {
				game.addHP(MAX_HP - game.getHP());
				game.bonus(ONE_BONUS_HP.um_itemId, MAX_HP - game.getHP(), ONE_BONUS_HP.price, BonusTrigger.FROM_TIME_RESET);
				leftTime = 0;
				game.setResetTime(time * 10);
			} else {
				game.addHP(addHp);
				game.bonus(ONE_BONUS_HP.um_itemId, addHp, ONE_BONUS_HP.price, BonusTrigger.FROM_TIME_RESET);
				game.setResetTime(time + leftTime);
			}
		}
	},

	bonus: function (itemName, count, price, fromType) {
		//-- // 开发商赠送 1000 个虚拟币
		//-- // UMGameAgent.bonus(1000, BonusTrigger.KAI_FA_SHANG_ZENG_SONG);

	},

	//-- 两小时无限体力
	setTwoHourFree: function (state) {
		this.gameData.twoHourFree = state;
		GameDataMgr.save(this.gameData);

		if (state) {

			//-- 记录两小时后无限失效
			game.setResetTime(new Date().getTime()/1000 + FREE_HEAR_TIME);
			cc.eventManager.dispatchCustomEvent("refreshCounDownByFreeHeart");
		}
	},


	getTwoHourFree: function () {
		return this.gameData.twoHourFree || false;
	},


	startLevel: function (level){
		//调用服务器接口
        if(servermode == "HGAME" || servermode == "WANBA"){
            devServer.reportIntoLevel(level);
        }
	},

	failLevel:function(level){
		//调用Java


	},
	setEvent:function(eventName,mapTable){
		//调用Java

	},
	_getErrorMessage:function(code){
		var msg = "未知错误，代码"+code;
		//根据玩吧公共返回码，显示错误信息
		switch(Number(code)){
			case 1:
				msg = "请求的参数错误";
				break;
			case 1001:
				msg = "服务器繁忙";
				break;
			case 1002:
				msg = "登录超时";
				break;
			case 1003:
				msg = "账户被冻结";
				break;
			case 1004:
				msg = "账户余额不足";
				break;		
			case -5:
				msg = "签名验证错误";
				break;
		}
		return msg;
	},
	showAlertMessage:function(msg, onConfirmFunc){
		new BYMsgBox({
			type: 2,
			ico: res.Heart_break_big,
			title: res.Failure,
			text: msg,
			unlock:true,
			button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
				if(onConfirmFunc){
					onConfirmFunc();
				}
			}}
		});
	},
    updateLoginToken:function(){
        if(servermode == "QQ"){
           if(this.timer){
               clearInterval(this.timer);
           }
           this.timer = setInterval(function(){
             var userinfo = store.getAll();
             var qqid = userinfo["qbopenid"];
			 var token = userinfo["refreshToken"];
             
             refreshToken(qqid, token, function(success){
                //仅仅刷新 不做事情 
             }.bind(this));
             
           }.bind(this), 3600 * 1000); // 每小时运行一次刷新token
        }
    },
    keepSessionAlive:function(){
        if(servermode == "HGAME" || servermode == "WANBA"){
           if(this.timer){
               clearInterval(this.timer);
           }
           this.timer = setInterval(function(){
               devServer.updateSession();
           }.bind(this), 3600 * 1000); 
        }
    }
})