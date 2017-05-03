/**
 * Created by beyondray on 2015/8/31.
 * Desc: 选择地图场景
 */
var  STAR_POS = [125,125,100];


var SelectMapScene = cc.Scene.extend({
	ctor:function(params){
		this._super();
		//cc.loader.load(play_scene_resources);
		this.setName("SelectMapScene");
		this.initData(params);
	},
	initData:function(params){
		this.autoScroll = params.autoScroll || false;
		this.enterNext = params.enterNext || false;
        
		this.pauseIng = false;
		this.leftTime = 0; // 障碍剩余时间
		this.lv = null;
		//cc.log("this.enterNext",this.enterNext);

		this.nextLevelBtn = null; // 最高关卡下一关进入按钮
		this.lastLevelAni = null; // 最高关卡标记动画
		this.reachObstacle = false; //到达当前关为障碍
		this.reachUnLockStar = false; //当前关为障碍并到达解锁星数
		this.enterNextMapCell = false; //人物是否进入下一个地图块（用于边界调整）

		this.totalObstacleStar = {}; //所有障碍各自的星数
		this.computeTotalObstacleStar();
        if(params.fromWelcome){
            //停服公告
          //  this.showStopServerNote();
        }
	},
	computeTotalObstacleStar:function(){
		var preTotalStar = 0, preTotalLevelNum = 0;
		for(var cellIndex in SELECTE_CONFIG){
			var cellMapData = SELECTE_CONFIG[cellIndex];
			for(var i in cellMapData){
				var levelData = cellMapData[i];
				preTotalLevelNum++;
				var starScore = game.getStarAndScoreByLevel(levelData.id);
				preTotalStar += starScore && starScore.star || 0;
				//是障碍
				if(levelData.isObstacle){
					this.totalObstacleStar[levelData.id] = { star : preTotalStar, levelNum : preTotalLevelNum };
					preTotalStar = 0;
					preTotalLevelNum = 0;
				}
			}
		}
	},
	showVisibleMapCell: function (dt) {
		var y = cc.winSize.height - this.lv.getItem(31).getParent().convertToWorldSpace(this.lv.getItem(31).getPosition()).y;
		var curIdx = 31 - Math.floor(y/240);

		//var curIdx=this.lv.getCurSelectedIndex();

		var skipDelta = 6;
		var begIdx = curIdx - skipDelta >=0 ?curIdx - skipDelta:0;
		var endIdx = curIdx + skipDelta <=31?curIdx + skipDelta:31;

		for(var i = 0;i < begIdx;i++)
			this.lv.getItem(i).setVisible(false);
		for(var j = begIdx;j <= endIdx; j++)
			this.lv.getItem(j).setVisible(true);
		for(var k = endIdx+1; k <= 31; k++)
			this.lv.getItem(k).setVisible(false);
		/*
		for(var i=0;i<=31;i++){
			this.lv.getItem(i).setVisible(true);

		}
		*/
		//cc.log("select child index = " +curIdx);
		return true;
	},
	createListView:function(){
		this.imageWH = cc.size(512,128); //512,128
		this.scaleRatio = display.width/this.imageWH.width;
		this.viewRatio = this.scaleRatio > 1 && 1 || this.scaleRatio;
		this.lv = new ccui.ListView();
		this.lv.setDirection(ccui.ScrollView.DIR_VERTICAL);
		this.lv.setTouchEnabled(true);
		this.lv.setBounceEnabled(false);
		this.lv.setSize(cc.size(display.width/this.scaleRatio, display.height/this.scaleRatio));
		this.lv.setScale(this.scaleRatio);
		this.lv.setAnchorPoint(cc.p(0.5,0));
		this.lv.setPosition(cc.p(display.width/2,0));
		var len = getOwnProperyLength(SELECTE_CONFIG);
		for(var i = len;i >= 1;i--) {
			var item = new ccui.Layout();
			item.setTouchEnabled(true);
			var content = this.createMapCell(i);
			item.addChild(content);
			if (i == len)
				item.setContentSize(this.imageWH.width, 43);
			else
				item.setContentSize(this.imageWH.width, this.imageWH.height);
			this.lv.pushBackCustomItem(item);
		}
		//this.lv.addEventListenerListView(this.showVisibleMapCell,this);
	},
	createMapAni:function(content, data){
		if(data.aniData){
			for(var j in data.aniData){
				var aniData = data.aniData[j];
				if(aniData.comingsoon){
					var action1 = cc.scaleBy(1, 1.05, 0.97);
					var action2 = cc.moveBy(1, cc.p(-5,-5));
					var cloud = new cc.Sprite(aniData.name);
					cloud.setPosition(aniData.p);
					content.addChild(cloud);
					cloud.runAction(cc.repeatForever(cc.sequence(cc.spawn(action1,action2), cc.spawn(action1.reverse(), action2.reverse()))));
					if(aniData.name  == res.Cloud2_png){
						var cominigsoon = new cc.Sprite(res.Comingsoon_png);
						cominigsoon.setPosition(cc.p(256,250));
						content.addChild(cominigsoon);
					}
				}
				else{
					game.bulletManage.load(aniData.name);
					var animation = game.bulletManage.getAnimation(aniData.name,"start");
					if(animation){
						var aniSp = new cc.Sprite();
						aniSp.setPosition(aniData.p);
						aniSp.setScale(aniData.scale || 1);
						aniSp.setFlippedX(aniData.flip || false);
						aniSp.setRotation(aniData.rotation || 0);
						aniSp.runAction(cc.sequence(cc.delayTime(aniData.delay || 0),cc.callFunc(function(){
							aniSp.stopAllActions();aniSp.runAction(cc.animate(animation).repeatForever())})));
						content.addChild(aniSp, 100);
					}
					else if(game.bulletManage.getParticles(aniData.name,"start")){
						/*game.bulletManage.load("itemId_1");
						var particleData = game.bulletManage.getParticles("itemId_1","start");
						var offset = particleData.offset || cc.p(0,0);
						//var particle = new cc.ParticleSystem(particleData.res);
						var particle = new cc.ParticleFire();
						particle.setPosition(offset);
						//particle.setPositionType(cc.POSITION_TYPE_GROUPED);
						content.addChild(particle, 100);*/
					}
				}
			}
		}
	},
	createMapButton:function(content, data){
		//【关卡按钮】
		var lockImg = data.isObstacle && res.Obstacle_lock_png || (res[(data.model == LEVEL_MODEL.save2 && LEVEL_MODEL.classic || data.model)+"_lock_png"]);
		var normalImg = data.isObstacle && res.Obstacle_finish_png || (res[(data.model == LEVEL_MODEL.save2 && LEVEL_MODEL.classic || data.model)+"_finish_png"]);
		var currentId = Number(data.id);
		var gameLastLevel = game.gameData.lastLevel;    // 是id不是真实的关卡
		if(currentId  == gameLastLevel){
			if(getMapDataById(gameLastLevel).isObstacle){
				normalImg = res.Obstacle_ing_png;
				lockImg = res.Obstacle_lock_png;
			}
			else{
				normalImg = res[(data.model == LEVEL_MODEL.save2 && LEVEL_MODEL.classic || data.model)+"_ing_png"];
			}
		}
		var callback = (function(){
			if(this.pauseIng || (data.isObstacle && currentId < gameLastLevel))return;
			//显示障碍提示
			if(data.isObstacle){
				//cc.log("显示障碍提示");
				var id=data.id;
				var totalIfAllThree =  this.totalObstacleStar[id].levelNum * 3;  //如果全部3星
				var minimumStar = Math.ceil(totalIfAllThree * 0.8);
				var totalNow = this.totalObstacleStar[id].star;
				var starNeed = minimumStar-totalNow;
				var maskLayer=new BYMask({});
				
				cc.director.getRunningScene().addChild(maskLayer,POP_WIN_TAG,POP_WIN_TAG);
				var msg = "解锁需要本区域达到"+minimumStar+"星星\n还需"+starNeed+"星星，是否使用10金币解锁";
				var buyNextStep = new BuyNextStepLayer(msg, function(success){
					if(!success){
						return;
					}
					game.gameData.lastLevel = id + 1;
					GameDataMgr.save(game.gameData);
					this.showEnterNextLevelAction();
				}.bind(this));
				maskLayer.addChild(buyNextStep, POP_WIN_TAG);
			}
			else{
				this.enterLevel(currentId);
			}
		}).bind(this);

		var passEnterBtn = BYBtn([normalImg, lockImg], callback, false, true,false,false,false);
		if(currentId <= gameLastLevel)
			passEnterBtn.getChildByTag("1").setTexture(normalImg);

		passEnterBtn.attr({anchorX:0, anchorY:0, x:data.x, y:data.y});
		passEnterBtn.setScale(0.4);
		content.addChild(passEnterBtn);

		//按钮上的字体
		var digit = new cc.LabelBMFont((data.isObstacle ? "" : (data.id- data.obstacle).toString()), res.EMAIL_FONT);
		digit.setPosition(cc.p(passEnterBtn.getContentSize().width/2,passEnterBtn.getContentSize().height/2-10));
		digit.setScale(0.8);
		passEnterBtn.addChild(digit);

		// 星数
		if(data.id < gameLastLevel){
			var star = game.getStarAndScoreByLevel((data.id));
			if(star){
				star.star = star.star > 0 && star.star || 1;
				var starSp = new cc.Sprite(res["Map_star_"+star.star+"_png"]);
				starSp.setPosition(cc.p(passEnterBtn.getContentSize().width/2,STAR_POS[star.star-1]));
				starSp.setScale(2);
				passEnterBtn.addChild(starSp);
			}
			else if(!data.isObstacle){
				var starSp = new cc.Sprite(res.Map_star_1_png);
				starSp.setPosition(cc.p(passEnterBtn.getContentSize().width/2,STAR_POS[0]));
				starSp.setScale(2);
				passEnterBtn.addChild(starSp);
			}
		}
		return passEnterBtn;
	},
	createMapCell:function(index){
		var content =null;
		if(index>=29) {
			content = new cc.Sprite("res/scenes/selectemap/" + index + ".png");
		}else{
			content = new cc.Sprite("res/scenes/selectemap/" + index + ".jpg");
		}

		content.attr({anchorX:0, anchorY:0, x:0, y: 0});

		var cellMapData = SELECTE_CONFIG[index];
		if(cellMapData){
			for(var i in cellMapData){
				var levelData = cellMapData[i];
				// 生成动画
				this.createMapAni(content, levelData);

				// 按钮
				var passEnterBtn = this.createMapButton(content, levelData);

				// 创建会行走漂浮的动物
				this.createAnimateAni(content, passEnterBtn, levelData);
			}
		}
		return content;
	},
	createAnimateAni:function(content, passEnterBtn, levelData){
		var lastLevel = game.gameData.lastLevel;    // 是id不是真实的关卡realLevel
		var lastLevelData = getMapDataById(lastLevel);
		var currentId = Number(levelData.id);

		if(lastLevelData.isObstacle){
			if(currentId == lastLevel){
				// 是否达到星数，如果达到直接解锁进入下一关
				this.reachObstacle = true;
				this.reachUnLockStar = this.fillUnlockStar(lastLevelData);
				this.EnterBtnAfterObstacle = passEnterBtn;
			}
			else if(currentId == lastLevel + 1){
				// 记录障碍下一关的，用于时间到时人物移动到这里
				this.nextLevelBtn = passEnterBtn;
				if(findMapCellIdxById(currentId) - findMapCellIdxById(lastLevel) == 1)
					this.enterNextMapCell = true;
				passEnterBtn.setTouchEnabled(false);
			}
			else if(currentId == lastLevel - 1){
				// 如果当前关是障碍则前一关显示人物所在位置
				this.animateUpDown(content, levelData);
			}
			else if(!INPUT_MODEL && currentId > lastLevel) {
				passEnterBtn.setTouchEnabled(false);
			}
		}
		else{
			if(this.enterNext){
				if(currentId == lastLevel - 1){
					this.animateUpDown(content, levelData);
					if(this.enterNextMapCell)this.showEnterNextLevelAction();
				}
				else if(currentId == lastLevel){
					this.nextLevelBtn = passEnterBtn;
					var curId = findMapCellIdxById(currentId);
					var lastId = findMapCellIdxById(currentId-1);
					if(curId - lastId == 1)
						this.enterNextMapCell = true;
					if(!INPUT_MODEL)passEnterBtn.setTouchEnabled(false);
					if(!this.enterNextMapCell)this.showEnterNextLevelAction();
				}
			}
			else{
				if(currentId == lastLevel){
					this.animateUpDown(content, levelData);
				}
			}

			if(!INPUT_MODEL && currentId > lastLevel) {
				passEnterBtn.setTouchEnabled(false);
			}
		}

		if(this.lastLevelAni && game.gameData.leadingFlipx){
			this.lastLevelAni.setAnchorPoint(cc.p(0,0.5));
			this.lastLevelAni.setFlippedX(true);
		}
	},
	animateUpDown:function(content,levelData){
		this.lastLevelAni = new cc.Sprite(res.Last_level_png);
		this.lastLevelAni.setPosition(cc.p(levelData.x-10,levelData.y+70));
		this.lastLevelAni.setScale(0.8);
		content.addChild(this.lastLevelAni, 1000);
		var action1 = cc.moveBy(0.8,cc.p(0,5));
		var action2 = action1.reverse();
		var action = cc.repeatForever(cc.sequence(action1,action2));
		this.lastLevelAni.runAction(action);
	},
	enterLevel:function(id){
		//不能超过当前关卡
		if(! INPUT_MODEL && id > game.gameData.lastLevel){
			//cc.log("非法操作：选择的关超过最高记录");
			return;
		}

		game.curLevel = id;
		if(INPUT_MODEL){
			game.gameData.lastLevel = id;
			GameDataMgr.save(game.gameData);
		}

		//记录滚动位置
		var mapCellIdx = findMapCellIdxById(id);
		game.curSelectedScrollY = 3329*(32-mapCellIdx+2)/32;

		// 记录当前进入的关卡是否为时间模式
		var realLevel = idTrunRealLevel(id);
		this.loadMapData(realLevel, (function(error, levelData){
			var time = Number(levelData.level.time) || 0; // 计时
			if(time > 0){
				game.isTimeModel = true;
			}
			else{
				game.isTimeModel = false;
			}
			//-- 弹出选择道具界面
			if (cc.director.getRunningScene().getChildByTag(POP_WIN_TAG)) {
				cc.director.getRunningScene().removeChildByTag(POP_WIN_TAG);
			}
			var mask=new BYMask({});
			var selecteItemLayer=new SelecteItemBeforeStart({model : levelData.level.mode, level : realLevel, callBack :
				function(items){
					game.addHP(-1);
					CURRENT_MODE = levelData.level.mode;
					switch (CURRENT_MODE)
					{
						case LEVEL_MODEL.wheel:
						case LEVEL_MODEL.classic:
						case LEVEL_MODEL.save:
							cc.loader.load(level_resources,function(){},function(){
								switchScene("PlayScene", {items:items,level : id, realLevel : realLevel, jsonObj : levelData });
							});
							return;
						case LEVEL_MODEL.save2:
							var tipLayer = new TipLayer("Save2模式暂未开放,敬请期待!");
							this.addChild(tipLayer);
							return;
						case LEVEL_MODEL.save3:
							cc.loader.load(level_resources,function(){},function(){
								switchScene("PlayScene", {items:items,level : id, realLevel : realLevel, jsonObj : levelData });
							});
							return;
					}
				}});
			mask.addChild(selecteItemLayer);
			cc.director.getRunningScene().addChild(mask,POP_WIN_TAG,POP_WIN_TAG);

		}).bind(this));
	},
	// 判定是否达到解锁的星数
	fillUnlockStar:function(ObstacleData){
		// 第一把锁特殊处理
		if(ObstacleData.id == 24)return true;

		// 得到三星关卡的比例
		var totalIfAllThree =  this.totalObstacleStar[ObstacleData.id].levelNum * 3;  //如果全部3星
		var totalNow = this.totalObstacleStar[ObstacleData.id].star;
		var rate = totalNow/totalIfAllThree *100;

		if(rate > 80)
			return true;
		else
			return false;
	},
	// 如果当前关是障碍则显示障碍清除倒计时  forceNext:星数达到时直接进入下一关
	showClearObstacleCountDown:function(node,forceNext){
		var lastLevelMapData = getMapDataById(game.gameData.lastLevel);

		// 显示剩余时间
		var createCountDown = (function(){
			this.timeLabel = new cc.LabelBMFont(this.leftTime, res.EMAIL_FONT);
			this.timeLabel.setScale(0.7);
			this.timeLabel.setPosition(cc.p(50,30));
			node.addChild(this.timeLabel);

			if(this.leftTime && this.leftTime > 0){
				var setCdTime = (function(){
					if(this.leftTime > 0 ){
						this.leftTime --;
						this.timeLabel.setString(sec_3_Format(this.leftTime));
						this.timeLabel.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(setCdTime)));
					}
					else{
						this.timeLabel.setString("");
						//cc.log("解禁");
						game.gameData.lastLevel = lastLevelMapData.id + 1;
						GameDataMgr.save(game.gameData);
						node.getChildByTag("1").setTexture(res.Obstacle_finish_png);
						node.setTouchEnabled(false);
						this.showEnterNextLevelAction();
					}
				}).bind(this);
				setCdTime();
			}
		}).bind(this);

		var obstacleEndTime = game.getObstacleInforById(lastLevelMapData.id);
		// 星数达到时直接进入下一关
		if(forceNext){
			//cc.log("星数达到时直接进入下一关");
			node.getChildByTag("1").setTexture(res.Obstacle_finish_png);
			node.setTouchEnabled(false);
			game.gameData.lastLevel = lastLevelMapData.id + 1;
			GameDataMgr.save(game.gameData);
			this.showEnterNextLevelAction();
		}
		else if(!obstacleEndTime){
			var endTime = getCurTime() + OBSTACLE_TIME;
			game.setObstacleInforById(lastLevelMapData.id, endTime);
			this.leftTime = OBSTACLE_TIME;
			createCountDown();
		}
		else if(obstacleEndTime - getCurTime() > 0){
			var leftTime = obstacleEndTime -getCurTime();
			this.leftTime = leftTime;
			createCountDown();
		}
		else{
			// 时间到显示进入下一关动画
			game.gameData.lastLevel = lastLevelMapData.id + 1;
			GameDataMgr.save(game.gameData);
			this.showEnterNextLevelAction();
		}
	},
	showEnterNextLevelAction:function(){
		if(this.nextLevelBtn && this.lastLevelAni){
			// 当前关不是障碍则显示动画
			this.lv.setEnabled(false);
			this.pauseIng = true;

			//计算下一个达到的局部坐标位置
			var nextLP = cc.p(this.nextLevelBtn.x-10,this.nextLevelBtn.y+70);
			if(this.enterNextMapCell)
				var thislP = cc.p(nextLP.x, nextLP.y+128);
			else
				var thislP = nextLP;
			var lP = thislP;

			// 检测主角是否要水平翻转
			if(this.lastLevelAni.x> lP.x){
				game.gameData.leadingFlipx = true;
				GameDataMgr.save(game.gameData);
				this.lastLevelAni.setAnchorPoint(cc.p(0,0.5));
				this.lastLevelAni.setFlippedX(true);
			}
			else{
				game.gameData.leadingFlipx = false;
				GameDataMgr.save(game.gameData);
				this.lastLevelAni.setAnchorPoint(cc.p(0.5,0.5));
				this.lastLevelAni.setFlippedX(false);
			}

			//行走动画
			var action = cc.sequence(
				cc.moveTo(2,lP),
				cc.callFunc((function(){
					this.enterLevel(game.gameData.lastLevel);

					this.lv.setEnabled(true);
					this.pauseIng = false;
					this.enterNext = false;
					// 设置按钮为正在进行状态
					var lastLevelData = getMapDataById(game.gameData.lastLevel);
					var tempStr = lastLevelData.model == LEVEL_MODEL.save2 && LEVEL_MODEL.classic || lastLevelData.model;
					var ingImage = res[tempStr + "_ing_png"];
					this.nextLevelBtn.getChildByTag("1").setTexture(ingImage);
					this.nextLevelBtn.setTouchEnabled(true);
				}).bind(this))
			)
			this.lastLevelAni.runAction(action);
		}
	},
	// 加载关卡数据
	loadMapData : function(readLevel, callback){
		var mapFilePath = "res/mapData/"+readLevel+".json";
		cc.loader.loadJson(mapFilePath, callback);
	},
	initUI:function(){
		//rootLayer
		var rootLayer = new cc.Layer();
		this.addChild(rootLayer);
		this.createListView();
		rootLayer.addChild(this.lv);
		rootLayer.schedule(this.showVisibleMapCell.bind(this));

		//顶部栏
		this.topLayer = new SelectTopLayer({scene: this });
		this.topLayer.setPosition(0,display.height-TOP_RECT.height/2+12);
		this.addChild(this.topLayer);
		
		//收藏分享按钮
		var onshareSuccess = function(){
				game.addGold(20);
				new BYMsgBox({
					type: 2,
					ico: res.ImageShare_png,
					title: res.Title_buy_success,
					text: "您获赠了20金币",
					unlock:true,
					button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
		
					}}
				});
			};
if(servermode == "QQ"){
		var btnSendtodesk = BYBtn([res.BtnSendtoDesk_png],function(){
			new BYMsgBox({
				type: 2,
				ico: res.ImageShare_png,
				title: res.TitleDesk_png,
				text: "收藏糖心泡泡快捷方式到桌面可得20金币",
				unlock:true,
				button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
					try{
						sendToDesktop({"ext":""}, onshareSuccess);
					}
					catch(e){
						util.debug(e.message);
					}
				}}
			});
			
		}.bind(this), false,true,false,false,true);
		btnSendtodesk.setPosition(display.width - 110,display.height-TOP_RECT.height/2 - 210);
		this.addChild(btnSendtodesk);
}
if(servermode == "HGAME" || servermode == "WANBA" || servermode == "QQ"){
        //排行榜按钮
        var btnRank = BYBtn([res.RankIcon_png],function(){
            new RanklistLayer({});
		}.bind(this), false,true,false,false,true);
		btnRank.setPosition(display.width - 110,display.height-TOP_RECT.height/2 - 110);
		this.addChild(btnRank);
}    
if(servermode == "HGAME"){    
        //分享有奖
       var btnShare = BYBtn([res.BtnShare_png],function(){
			new BYMsgBox({
				type: 2,
				ico: res.ImageShare_png,
				title: res.TitleShare_png,
				text: "分享糖心泡泡可得20金币",
				unlock:true,
				button1Data: {front: "res/texture/newUI/okBtn2.png", text: "", offset: cc.p(0, 0), callback: function () {
					try{
						shareGame(onshareSuccess);
					}
					catch(e){
						util.debug(e.message);
					}
				}}
			});
			
		}.bind(this), false,true,false,false,true);
		btnShare.setPosition(display.width - 110,display.height-TOP_RECT.height/2 - 210);
		this.addChild(btnShare);
}      
//新春礼包
var now = new Date();
var dateBegin = Date.parse("Wed Feb 3 2016 18:00:00 GMT+0800 (CST)");
var dateEnd = Date.parse("Sat Feb 13 2016 23:59:59 GMT+0800 (CST)");
if(now.getTime() >= dateBegin && now.getTime() <= dateEnd){
        //旋转光芒
        var lightpic = new cc.Sprite(res.NewYearGift_light);
        lightpic.setPosition(display.width - 110,display.height-TOP_RECT.height/2 - 310);
        lightpic.setBlendFunc(cc.ONE,cc.ONE);
		this.addChild(lightpic);
        
        lightpic.runAction(new cc.repeatForever(new cc.rotateBy(9, -360)));
        
        
        //排行榜按钮
        var btnNewYearGift = BYBtn([res.NewYearGift_icon],function(){
            new NewYearGiftLayer({});
		}.bind(this), false,true,false,false,true);
		btnNewYearGift.setPosition(display.width - 110,display.height-TOP_RECT.height/2 - 310);
		this.addChild(btnNewYearGift);

}  
		//底部选择栏
		this.setupLayer = new SetupLayer({name :"SelectMapScene", scene: this, offsetY : 0 });
		this.setupLayer.setPosition(cc.p(cc.winSize.width>=display.width?OFFSET.x:OFFSET.x,0));
		this.addChild(this.setupLayer, SETUP_TAG);

		//将listView滚动到合适的位置
		var mapCellIdx = findMapCellIdxById(game.gameData.lastLevel);
		game.curSelectedScrollY = 3700*(32-mapCellIdx-3)/31;
		if(this.autoScroll){
			this.lv._innerContainer.setPosition(0, game.curSelectedScrollY);
		}
		else if(game.curSelectedScrollY != 0){
			this.lv._innerContainer.setPosition(0, game.curSelectedScrollY);
		}

		//障碍计时与动画
		if(this.reachObstacle){
			if(this.reachUnLockStar){
				this.showClearObstacleCountDown(this.EnterBtnAfterObstacle, true);
			}
			else{
				this.showClearObstacleCountDown(this.EnterBtnAfterObstacle, false);
			}
		}
	},
	checkObstacleTime:function(){
		// 检测如果当前关是障碍，则检测时间是否到了，到了设置为下一关
		var lastMapData = getMapDataById(game.gameData.lastLevel);
		var lastObstacleEndTime = game.getObstacleInforById(game.gameData.lastLevel);
		if(lastMapData.isObstacle){
			var nowTime = getCurTime();
			if(!lastObstacleEndTime){
				var endTime = nowTime + OBSTACLE_TIME;
				game.setObstacleInforById(game.gameData.lastLevel, endTime);
			}
			else if(lastObstacleEndTime - nowTime <= 0){
				game.gameData.lastLevel++;
				GameDataMgr.save(game.gameData);
			}
		}
	},
	onEnter:function(){
		this._super();

		this.checkObstacleTime();

		this.initUI();

		game.isTimeModel = false;
		game.playBackMusic();
		cc.loader.load(level_resources);
		//显示广告
	},

	onExit:function(){
		this._super();
		game.bulletManage.dispose();

		//隐藏广告
	},
    
    showStopServerNote:function(){
        var boxBg = new cc.Sprite(res.StopServer_png);
        boxBg.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});
		var mask = new BYMask({});
		mask.addChild(boxBg);
		this.addChild(mask, MIDDLE_WIN_TAG, MIDDLE_WIN_TAG);
        this.addCloseBtn(mask);
    },
    addCloseBtn:function(layer){
		var closeBtn = PYButton(res.Close_png,null,25,function() {
			layer.removeFromParent();
		}.bind(this));
		closeBtn.attr({
			anchorX:1,
			anchorY:1
		});
		closeBtn.setPosition(600+(display.width-600)/2+15,834+(display.height-834)/2-55);

		layer.addChild(closeBtn);
	}
})