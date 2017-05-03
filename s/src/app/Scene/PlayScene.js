/**
 * Created by beyondray on 2015/7/23.
 * Desc: 主要的泡泡场景
 */
var bubbleScale=0.7;


var PlayScene = cc.Scene.extend({
	items: null,
	level: 0,
	realLevel: 0,
	totalCrock: [],

	crockTongueAniList: [],
    resultTimer:null,
	ctor: function (params) {
		this._super();

		this.setName("PlayScene");
        cc.spriteFrameCache.addSpriteFrames(res.BubblePics_plist);

		//初始化数据
		this.initData(params);
		//初始化层级
		this.initLayer(params);
		//初始化泡泡球
		this.initBubble();
	},
	initData: function (params) {

		//效果层
		this.effectLayer = new cc.Layer();
		this.addChild(this.effectLayer, 1000);


		//触摸层
		this.touchLayer = new TouchLayer(this);
		this.addChild(this.touchLayer);

		//底部层 (底部栏)
		this.bottomLayer = new BottomLayer({scene: this, callBack: (function (selectedItem) {
			this.useOrCancelItem(selectedItem > 0 ? true : false, selectedItem);
		}).bind(this)});
		this.bottomLayer.attr({x: 0, y: 0});
		this.addChild(this.bottomLayer, 100);

		this.items = params.items || [];
		this.level = params.level;
		this.realLevel = params.realLevel;
		this.initJsonData(params.jsonObj);

		this.selectedItem = 0;
	},
	initLayer: function (params) {

		this.levelData = params.jsonObj;
		//UI层
		this.uiLayer = new UILayer(this);
		this.addChild(this.uiLayer);


		//物理层
		this.physicLayer = new PhysicLayer(this);
		this.addChild(this.physicLayer);
		//顶部层（顶部栏）
		this.topLayer = new TopLayer({level: this.level, scene: this, time: this.time });
		this.topLayer.attr({x: OFFSET.x, y: display.height - TOP_RECT.height});
		this.addChild(this.topLayer, 1001);


		// 辅助线层
		this.lineLayer = new ShotLineLayer({scene: this});
		this.lineLayer.attr({x: 0, y: 0});
		this.addChild(this.lineLayer);
		//玩法层
		if (CURRENT_MODE == LEVEL_MODEL.classic || CURRENT_MODE == LEVEL_MODEL.save/* || CURRENT_MODE == LEVEL_MODEL.save2*/) {
			this.gameLayer = new GameLayer({jsonObj: params.jsonObj, scene: this, level: params.level});
		}
		else if (CURRENT_MODE == LEVEL_MODEL.save3) {
			this.gameLayer = new GameLayer({jsonObj: params.jsonObj, scene: this, level: params.level, save3Flag: true});
		}
		else if (CURRENT_MODE == LEVEL_MODEL.wheel) {
			this.gameLayer = new WheelGameLayer({jsonObj: params.jsonObj, scene: this, level: params.level,
				offset: cc.p(display.cx, display.cy + 200)});
		}
		this.addChild(this.gameLayer);
		this.gameLayer.checkGameOver();
		//Setup返回层
		this.setupLayer = new SetupLayer({name: this.getName(), scene: this, level: this.level});
		this.setupLayer.setPosition(cc.p(cc.winSize.width >= DESIGN_WIDTH ? OFFSET.x : OFFSET.x, 0));
		this.addChild(this.setupLayer, SETUP_TAG);
	},
	onEnter: function () {
		this._super();
		//播放背景音乐
		game.playBackMusic();

		//-- 检测是否显示引导
		//print("game:getGuideId()",game:getGuideId(), self.items[1])
		if (this.realLevel == 1) {
			game.setGuideId(61);
		}
		if (game.getGuideId() != 0) {
			if (game.getGuideId() == 24) {
				//-- 冰球
				if (!(this.items.length > 0 && this.items[0] == ITEM_ID.ice)) {
					game.setGuideId(0);
				}
			} else if (game.getGuideId() == 54) {
				//-- 魔法球
				if (!(this.items.length > 0 && this.items[0] == ITEM_ID.magic)) {
					game.setGuideId(0);
				}
			}
			new ForceGuideLayer({}).showGuideById(game.getGuideId());

		}

		//-- 8、   第五关开始时提示该关卡额外加10步，玩家点击确定即可
		if (this.realLevel == 5) {
			new BYMsgBox({
				type: 2,
				effect: {image: res.Effect_bg_png, offset: cc.p(0, 0)},
				ico: [
					{image: res.Item_bubble2_png, scale: 2, offset: cc.p(0, 0)}
				],
				title: res.Zs_title,
				text: "该关卡额外加10步",
				button1Data: {front: res.OK_text2, text: "", offset: cc.p(0, 0), callback: function () {
					this.items = this.items || [];
					this.items.push(ITEM_ID.addTen);
					this.checkItem();
				}.bind(this)}
			});
		} else if (this.realLevel == 7) {
			/*
			var buyLayer = new BuyItemLayer({itemId: ITEM_ID.addTen, callback: function (buySuccessFlag) {
				if (buySuccessFlag) {

				}

			}});
			var mask = new BYMask({});
			mask.addChild(buyLayer);
			cc.director.getRunningScene().addChild(mask, POP_WIN_TAG, POP_WIN_TAG);
			*/
		} else if (this.realLevel > 7 && game.getGuideId() == 0) {
			//-- 之后每关开始时均有概率出现各种礼包(有新手引导时不显示)
			//this.showPack();
		}
	},


	onExit: function () {
        if(this.resultTimer){
            clearTimeout(this.resultTimer);
        }
		this._super();
		this.lineLayer.clearLines();
		this.removeAllChildren();
		game.bulletManage.dispose();
	},

	//-- 一定概率显示开局礼包界面
	showPack: function (){
		/*
		var rate = Number(ITEM_INFOR["item_10"].rate);
		var r = Math.random() * 100;
		if (r < rate) {
			var buyLayer = new BuyItemLayer({itemId: 10, callback: function (flag) {
				//-- 购买道具成功更新道具数量
				if (flag) {
					var reward = ITEM_INFOR["item_" + 10].reward;
					for (var key in reward) {
						var data = reward[key];
						var oldItemCount = game.getItemCountByID(Number(data.itemId)) || 0;
						game.setItemCountByID(Number(data.itemId), oldItemCount + Number(data.count));
					}
				}
			}});

			var mask = new BYMask({});
			mask.addChild(buyLayer);
			cc.director.getRunningScene().addChild(mask, POP_WIN_TAG, POP_WIN_TAG);
		}
		*/
	},

    initBubble:function(){
        // 调整球层位置
	    var callback = (function() {
		    this.initCurColores();  //得到颜色集
		    this.initReadyBubble(); //初始化准备球
		    this.initWaitBubble();  //初始化等待球
		    this.items = this.items || [];
	    }).bind(this);
	    if(CURRENT_MODE!=LEVEL_MODEL.wheel){
		    this.gameLayer.adjustLayerPos(true,callback,true);
	    }
	    else
		    callback();

	    //TODO:吃掉测试
	    /*var pBubble = new BubbleSprite(new BubbleBasic({color : 1}));
	    this.physicLayer.createPhysicBubble(pBubble.getModel(), 200, 500);*/
    },
	setEnable:function() {
		this.touchLayer.setEnable();
		this.canTouch = true;
	},
	useOrCancelItem:function(use,item){
		if(use){

			//cc.log("use=true");
			if (this.selectedItem > 0 && this.selectedItem != item) {
				//-- 当前要发射的球已经是道具时直接替换道具
				this.m_curReady.removeFromParent();
				this.m_curReady = createItemBubbleById(item);
				this.m_curReady.setPosition(READY_BUBBLE_POS.x, READY_BUBBLE_POS.y);
				this.addChild(this.m_curReady, SHOT_BUBBLE_DEP);
				this.selectedItem = item;
				return;
			}
			//-- 保存等待球
			this.old_wait = this.old_wait || this.m_wait;
			if (this.old_wait) {
				this.old_wait.setVisible(false);
			}
			this.m_wait = this.m_curReady;

			if(this.m_wait) {
				var actionToWait = new cc.Spawn(
					new cc.MoveTo(0.2, cc.p(WAIT_BUBBLE_POS.x, WAIT_BUBBLE_POS.y)),
					new cc.ScaleTo(0.2, bubbleScale));

				this.m_wait.runAction(new cc.Sequence(actionToWait, new cc.CallFunc(function () {
						if (this.m_wait) {
							this.m_wait.setPosition(WAIT_BUBBLE_POS.x, WAIT_BUBBLE_POS.y);
						}
					}.bind(this))
				));
			}
			//-- 增加一个球数
			var curWaitNum = this.waitBubbleNum + 1;
			this.updateBubbleNum(curWaitNum);
			this.m_curReady = createItemBubbleById(item);
			this.m_curReady.setPosition(READY_BUBBLE_POS.x,READY_BUBBLE_POS.y);
			this.addChild(this.m_curReady,SHOT_BUBBLE_DEP);
			this.selectedItem = item;
			game.playMusic(PRE_LOAD_MUSIC.whenSelectedItem);

		}else{

			//cc.log("use=false");
			//-- 减少一个球数
			var curWaitNum = this.waitBubbleNum - 1;
			this.updateBubbleNum(curWaitNum);
			if(this.m_curReady) {
				this.m_curReady.removeFromParent();

			}

			this.m_curReady = this.m_wait;

			if(this.m_curReady) {
				var actionToReady = new cc.Spawn(
					new cc.MoveTo(0.2, cc.p(READY_BUBBLE_POS.x, READY_BUBBLE_POS.y)),
					new cc.ScaleTo(0.2, 1)
				);

				this.m_curReady.runAction(new cc.Sequence(actionToReady, new cc.CallFunc(function () {
					this.m_curReady.setPosition(READY_BUBBLE_POS.x, READY_BUBBLE_POS.y);
					if (this.m_wait) {
						this.m_wait.setVisible(true);
					}

				}.bind(this))));
			}
			this.m_wait = this.old_wait;

			this.old_wait = null;

			this.selectedItem = 0;
		}
	}
});



PlayScene.prototype.showCrockScore=function(){





}


//=======================
// Desc: 初始化数据
//=======================
PlayScene.prototype.initJsonData = function(jsonObj){

    this.newRecord = false; // 是否有新记录
    this.prevDropTime = {}; // 记录各缸显示分数的对象数组
    this.doubleCreatItem = false; // 标记当前是否6连击生成了道具
    this.levelData = jsonObj;
    this.dropBubbleCount = 0;  // 当前在掉落的球数
    this.dropBubbleList = [];  // 掉落球的列表
	this.totalCrock = [];       // 底部的五个缸
	this.crockTongueAniList = []; // 缸舌动画
	this.result = 0;
	this.waitBubbleLabel = null;

    this.queueBubble = jsonObj.level.queueBubble || [6,6];

    this.m_wait = null;           // 正在等待发射的泡泡
    this.m_curReady = null;      // 当前正要发射的泡泡

    this.waitBubbleNum = Number(jsonObj.level.queue);
    this.time = Number(jsonObj.level.time) || 0;     // 计时
    if(this.time > 0) {
        game.isTimeModel = true;
        this.waitBubbleNum = 10000;
    }
    else
       game.isTimeModel = false;
    this.curColores = {};   //当前场景中所有球的颜色集，包括权重值

	this.subWeight = 0; //当前权重值
    this.curCount = 0;  // 当前回合数
    this.doubleHitCount = 0;  // 连击数
    this.doubleHitRecord = {};
    this.doubleSpecialRecord = {}; // 有益特殊泡泡连击记录
    this.doubleTrunItemCount = 0;  // 变成道具的连击数
    this.selectedItem = 0;  // 当前选择的道具
    this.doubleCrockRecord = {};  //缸的连击记录
    this.doubleScoreStateRecord = [1,1,1,1,1];  // 每个缸是否为双倍分数状态记录:1,2
    this.prevSoundTime = true;

    this.checkItem();
    // this:initDebugUI()
    game.curGameScore = 0;
}
//=================================
// Desc: 检测是否有主动道具
//=================================
PlayScene.prototype.checkItem = function() {
	if (game.isTimeModel) {
		uiFactory.createSprite(res.Time_waitNum_png, WAIT_BUBBLE_POS.x - 95, WAIT_BUBBLE_POS.y - 20, 0.5, 0.5, this, 11);
	}

	if (!this.waitBubbleLabel) {
		this.waitBubbleLabel = new cc.LabelBMFont(game.isTimeModel ? "" : this.waitBubbleNum, res.EMAIL_FONT);
		this.waitBubbleLabel.attr({x: WAIT_BUBBLE_POS.x - 95, y: WAIT_BUBBLE_POS.y - 20});
		this.addChild(this.waitBubbleLabel, 11);
	}

	for (var k = 0; k < this.items.length; k++) {
		var itemId = this.items[k];
		if (itemId == ITEM_ID.addTen) {
			//-- 先屏蔽点击

			var mask=new BYMaskNone();
			cc.director.getRunningScene().addChild(mask,POP_WIN_TAG,POP_WIN_TAG);
			this.touchLayer.setDisable();
			this.bottomLayer.setEnable(false);

			//-- 加十球为主动触发
			this.items.splice(k, 1);
			k--;
			//-- 这里显示加十球的特效
			var flyBubbleEffect;
			var cur_index = 1;
			flyBubbleEffect = function () {
				if (cur_index < 10) {

					var flySp = new cc.Sprite(res.Add_bubble_fly_ico);
					flySp.setPosition(display.cx, display.cy + 200);
					this.effectLayer.addChild(flySp);
					var bezier = [
						cc.p(display.cx, display.cy + 200),
						cc.p(display.cx / 2, display.cy),
						cc.p(WAIT_BUBBLE_POS.x - 95, WAIT_BUBBLE_POS.y - 20),
					]
					var bezierForward = new cc.BezierTo(0.6, bezier);
					flySp.runAction(
						new cc.Sequence(
							new cc.Spawn(
								bezierForward),
							new cc.FadeOut(0.2),
							new cc.CallFunc(function () {

								game.playMusic(MUSIC_CONFIG.addBubbleNum);
							}.bind(this))
						)
					);
					this.updateBubbleNum(this.waitBubbleNum + 1);
				} else if(cur_index==10){
					this.updateBubbleNum(this.waitBubbleNum + 1);
					this.touchLayer.setEnable();
					this.bottomLayer.setEnable(true);
					cc.director.getRunningScene().removeChildByTag(POP_WIN_TAG);
				}
			}.bind(this);

			//-- 先显示加十步的第一个动画
			var effectSp = new cc.Sprite(res.Add_10bubble_effect);
			effectSp.setPosition(display.cx, display.cy + 200);
			this.effectLayer.addChild(effectSp);
			effectSp.scale = 1.9;
			effectSp.opacity = 64;

			effectSp.runAction(new cc.Sequence(

				new cc.ScaleTo(0.2, 0.35, 0.35),
				new cc.Spawn(
					new cc.ScaleTo(0.2, 1.4, 1.4),
					new cc.FadeIn(0.2)
				),
				new cc.ScaleTo(0.1, 1, 1),
				new cc.ScaleTo(0.1, 0.66, 0.91),
				new cc.ScaleTo(0.1, 1.06, 1.11),
				new cc.ScaleTo(0.1, 1, 1),
				new cc.ScaleTo(0.2, 0.3, 0.3),
				new cc.CallFunc(function () {
					effectSp.removeFromParent();
					this.runAction(new cc.Repeat(new cc.Sequence(
						new cc.DelayTime(0.2),
						new cc.CallFunc(function () {
							flyBubbleEffect();
							cur_index = cur_index + 1;
						})), 10));
				}.bind(this))
			));
		}
	}

};
//=================================
// Desc: 初始化：this.curColores
//=================================
PlayScene.prototype.initCurColores = function(){
    var tColors = this.gameLayer.currentTotalColores().curTotalColores;
	//cc.log("*******");
	//cc.log(tColors);
    var weight = 100/(tColors.length);
	this.curColores={};
    for(var i=0;i<tColors.length;i++)
    {
        var color = tColors[i];
        this.curColores[color]={color:color,weight:weight};
    }
	//cc.log("+++++++");
	//cc.log(this.curColores);

}
//=================================
// Desc: 播放星束动画
//=================================
PlayScene.prototype.showStarEffect = function(){
	game.bulletManage.load("star_effect");
	var animation = game.bulletManage.getAnimation("star_effect","start");
	if(animation){
		var offset = game.bulletManage.getOffset("star_effect","start");
		var aniSp = uiFactory.createSprite(null,READY_BUBBLE_POS.x + offset.x, READY_BUBBLE_POS.y + offset.y,0.5,0.5,this,100);
		aniSp.setSpriteFrame(animation.getFrames()[0].getSpriteFrame());
		aniSp.setScale(2);

		this.m_curReady.setScale(0.1);
		this.m_curReady.runAction(cc.sequence(
			cc.delayTime(0.6),
			cc.scaleTo(0.3, 1.2, 1.2),
			cc.scaleTo(0.2, 1, 1)
		));
		aniSp.runAction(cc.sequence(cc.animate(animation), cc.callFunc((function(){
			game.playMusic(PRE_LOAD_MUSIC.init_ready_bubble);
			this.waitBubbleLabel.setVisible(true);
			this.m_state = GAME_STATE.GS_START;  // 当前游戏状态
			this.touchLayer.setEnable();
			this.gameLayer.schedule(this.gameLayer.GameUpdate);
			aniSp.removeFromParent();
		}).bind(this))));
	}
}
//=======================
// Desc: 初始化准备球
//=======================
PlayScene.prototype.initReadyBubble = function(){
    // 有道具球先生成第一个道具球
    if(this.items.length > 0)
    {
	    var curWaitNum = this.waitBubbleNum + 1;
	    this.updateBubbleNum(curWaitNum);
	    this.m_curReady = createItemBubbleById(this.items[0]);
    }
    else
    {
	    // 如果有指定第一球则生成指定颜色球
        if (this.queueBubble[0] && Number(this.queueBubble[0]) != MAX_COLOR) {
            this.initCurColores();
            this.m_curReady = createBubbleByColor(Number(this.queueBubble[0]));
            this.queueBubble.shift();
        }
        else
        {
            this.initCurColores();
            this.m_curReady = randomBubble(this.curColores);
        }
    }
    this.m_curReady.attr({x:READY_BUBBLE_POS.x,y:READY_BUBBLE_POS.y});
    this.addChild(this.m_curReady,SHOT_BUBBLE_DEP);

	// 显示粒子特效
	if(this.m_curReady)
		this.showStarEffect();

}

PlayScene.prototype.setDisableEnable=function(){
	this.touchLayer.setDisable();
}

//=======================
// Desc: 初始化等待球
//=======================
PlayScene.prototype.initWaitBubble = function(){
    if(this.items.length > 1)
    {
	    var curWaitNum = this.waitBubbleNum + 1;
	    this.updateBubbleNum(curWaitNum);
	    this.m_wait = createItemBubbleById(this.items[1]);
        this.initCurColores();
    }
    else if(this.items.length == 1)
    {
	    //如果只有一个被动道具，初始化：this.curColores
	    if (this.queueBubble[0] && Number(this.queueBubble[0]) != MAX_COLOR) {
		    this.initCurColores();
            this.m_wait = createBubbleByColor(Number(this.queueBubble[0]));
		    this.queueBubble.shift();
	    }
	    else
	    {
            this.initCurColores();
		    this.m_wait = randomBubble(this.curColores);
	    }
    }
    else
    {
        // 重新计算各颜色权重值(将准备球三分之一的颜色权重分配到其他球上)
        var curColor = this.m_curReady.getColor();
        var subWeight = this.curColores[curColor].weight/UNIQUE_COUNT;
        this.subWeight = subWeight;
        var addWeight = subWeight/(getOwnProperyLength(this.curColores)-1);

        for(var k in this.curColores)
        {
            var cw = this.curColores[k];
            if(cw.color == curColor)
                cw.weight -= subWeight;
            else
                cw.weight += addWeight;
        }

	    // 如果有指定球则生成指定颜色球
        if (this.queueBubble[0] && Number(this.queueBubble[0]) != MAX_COLOR)
        {
            this.m_wait = createBubbleByColor(Number(this.queueBubble[0]));
            this.queueBubble.shift();
            //cc.log("queuebuble");
        }
        else //普通球
            this.m_wait = randomBubble(this.curColores);

        if (this.m_wait.getColor() != curColor)
            this.subWeight = null;
    }
	this.m_wait.setScale(0.8);
    this.m_wait.attr({x:WAIT_BUBBLE_POS.x,y:WAIT_BUBBLE_POS.y});
    this.addChild(this.m_wait,SHOT_BUBBLE_DEP);
}

//=======================
// Desc: 生成等待球
//=======================
PlayScene.prototype.createWaitBubble = function(){
    //cc.log("create Wait bubble");
	this.m_wait = null;
    var tempCurColores = [];
    if(this.waitBubbleNum >= 1) {
	    tempCurColores = this.gameLayer.currentTotalColores().curTotalColores;
	    //球全被清除时,直接返回
	    if (tempCurColores.length == 0) {
		    this.m_wait = null;
		    return;
	    }
    }else return;

    //======【记录颜色权重列表】=======
    var tempColores = {};   //{[color]:{color:color, weight:weight},...}
    for(var key in tempCurColores){
        var color = tempCurColores[key];
        tempColores[color]=color;
    }

    //==========【增加颜色项】==========：
    // 如果颜色比之前增加或是不同，则要增加新颜色项，并把其他球的权重按平均比例分给它
    for(var key in tempColores){
        var color = tempColores[key];
        if(!this.curColores[key]){
            var totalAddW = 0;
            var count = this.curColores.length;
            for(var k in this.curColores){
                var cw = this.curColores[k];
                totalAddW += cw.weights/count;
            }
            //totalAddW/=getOwnProperyLength(this.curColores);
            this.curColores[key] = {color:color,  weight:totalAddW};
        }
    }

	// 重新计算各颜色权重值
	var curColor = this.m_curReady.getColor();
	var subWeight = 0;
	if(curColor > 0){
        var colorWeight = this.curColores[curColor] ? this.curColores[curColor].weight : 0;
		subWeight = this.subWeight || colorWeight/UNIQUE_COUNT;
    }
    //==========【删除颜色项】==========：
    // 找到当前不存在颜色，删除该颜色项，并把其欲分配给其他球的权重记录下来
    var totalWidth = 0;
    for(var key in this.curColores) {
        var CW = this.curColores[key];
        if (!tempColores[CW.color])
        {
            totalWidth += CW.weight;
            delete this.curColores[key];
        }
    }

	// 权重值再分配
    var addWeight = (subWeight+totalWidth)/(getOwnProperyLength(this.curColores)-1);
    for(var key in this.curColores){
        var colorWeight = this.curColores[key];
        if(colorWeight.weight == curColor)
        {
            var tempval = subWeight >= 0 ? colorWeight.weight - subWeight : 0;
            colorWeight.weight = colorWeight.weight - tempval;
        }
        else
            colorWeight.weight = colorWeight.weight + addWeight;
    }

	// 如果有指定球则生成指定颜色球
    if(this.queueBubble[0] && Number(this.queueBubble[0]) != MAX_COLOR){
        this.m_wait = createBubbleByColor(Number(this.queueBubble[0]));
        this.queueBubble.shift();
    }
    else
    {
        this.m_wait = randomBubble(this.curColores);
    }

    if(this.m_wait.getColor() != curColor)
        this.subWeight = null;
    else
        this.subWeight = subWeight;

    this.m_wait.setScale(0.8);
    this.m_wait.attr({x:WAIT_BUBBLE_POS.x,y:WAIT_BUBBLE_POS.y});
    this.addChild(this.m_wait, SHOT_BUBBLE_DEP);
}

//=======================
// Desc: 切换球
//=======================
PlayScene.prototype.swapShotBubble = function() {
    if (this.waitBubbleNum <= 0 || !this.m_wait || this.selectedItem > 0) {
	    //cc.log("swap none");
        return;
    }
    //播放音乐
    game.playMusic(PRE_LOAD_MUSIC.swapShot);
    this.m_wait.stopAllActions();
    this.m_curReady.stopAllActions();
    var temp = this.m_curReady;
    this.m_curReady = this.m_wait;
    this.m_wait = temp;

    var actionToReady = new cc.Spawn(
        new cc.MoveTo(0.2, cc.p(READY_BUBBLE_POS.x, READY_BUBBLE_POS.y)),
        new cc.ScaleTo(0.2, 1));
    var actionToWait = new cc.Spawn(
        new cc.MoveTo(0.2, cc.p(WAIT_BUBBLE_POS.x, WAIT_BUBBLE_POS.y)),
        new cc.ScaleTo(0.2, 0.8));

    this.m_wait.runAction(new cc.Sequence(actionToWait, new cc.CallFunc((function () {
                this.m_wait.attr({x: WAIT_BUBBLE_POS.x, y: WAIT_BUBBLE_POS.y});
                if (this.m_wait.getItemId() != 0) {
	                if (this.m_wait.getItemId() != ITEM_ID.rainbow && this.m_wait.getItemId() != ITEM_ID.iceCream) {
		                this.m_wait.playStartAni();
	                }
                }
            }).bind(this)
        ))
    );

    this.m_curReady.runAction(new cc.Sequence(actionToReady, new cc.CallFunc((function () {
                this.m_curReady.attr({x: READY_BUBBLE_POS.x, y: READY_BUBBLE_POS.y});
                if (this.m_curReady.getItemId() != 0) {
	                if(this.m_curReady.getItemId()!=ITEM_ID.rainbow&&this.m_curReady.getItemId()!=ITEM_ID.iceCream) {
		                this.m_curReady.playStartAni();
	                }
                }
            }).bind(this)
        ))
    );
}
//===================================
// Desc: 将wait状态的球换成ready状态
//===================================
PlayScene.prototype.changeWaitToReady = function(){
    this.m_state = GAME_STATE.GS_CHANGE;

	this.m_curReady.removeFromParent();
    this.m_curReady = this.m_wait;
    var action = new cc.spawn(
        cc.moveTo(0.2, cc.p(READY_BUBBLE_POS.x,READY_BUBBLE_POS.y)),
        cc.scaleTo( 0.1,  1));

    if(this.m_wait)
    {
        this.m_wait.runAction(cc.sequence(action, cc.callFunc((function(){
            // 这里防止切完时游戏已经结束
            // this.m_state = this.m_state == GAME_STATE.GS_END and GAME_STATE.GS_END or GAME_STATE.GS_START
            if (this.m_state == GAME_STATE.GS_END)
                this.m_state = GAME_STATE.GS_END;
            else if (this.m_state == GAME_STATE.GS_HITED)
            // 防止球先碰到，切换还没切完时马上发射报错
                this.m_state = GAME_STATE.GS_START;
            else
                this.m_state = GAME_STATE.GS_FLY;

            this.m_curReady.attr({x:READY_BUBBLE_POS.x,y:READY_BUBBLE_POS.y});

            // 如果之前用过道具，则取之前的等待球
            if (this.old_wait ) {
                this.m_wait = this.old_wait;
                this.m_wait.setVisible(true);
                this.old_wait = null;
                return
            }
            this.createWaitBubble();
        }).bind(this))))
    }
}
//=======================
// Desc: 开始发射
//=======================
PlayScene.prototype.startShotting = function(){
    //topLayer
	if(this.topLayer.state == "init"){
		this.topLayer.startTime();
	}

    this.curCount++;

	/*
    this.waitBubbleNum--;
    if(this.waitBubbleNum<0){
	    this.waitBubbleNum=0;
    }
	*/
	this.waitBubbleNum = this.waitBubbleNum-1 >=0 ?this.waitBubbleNum-1:0;

    if (!game.isTimeModel)
        this.waitBubbleLabel.setString(this.waitBubbleNum);
	else
        this.waitBubbleLabel.setString("");

    if( this.waitBubbleNum == 5 )
    {
	    //剩余5球声音提示
        game.playMusic(PRE_LOAD_MUSIC.when5wait);
    }

    this.gameLayer.setCurReady(this.m_curReady);

    this.gameLayer.setUpdateBubble(true);

	this.changeWaitToReady();


	//-- 道具选择还原
	this.bottomLayer.resetGroup();
	this.selectedItem = 0;
	performWithDelay(this,function() {
		this.bottomLayer.setEnable(true);
	}.bind(this), 0.1);

}
//=======================
// Desc: 结束发射
//=======================
PlayScene.prototype.endShotting = function(pos,angle){
    //cc.log("this.m_state",this.m_state);
    if(this.m_state != GAME_STATE.GS_START)return;

    //道具
    if(this.m_curReady.getItemId()!=0){
	    //-- 道具声音特殊处理
	    game.playMusic(PRE_LOAD_MUSIC.whenShotItem);
	    //-- 里面的道具才减道具数量，外面的道具（1-3）已经在进入之前减掉了
	    if (!this.doubleCreatItem && this.m_curReady.getItemId() > 3) {
		    var itemId = this.m_curReady.getItemId();
		    game.setItemCountByID(itemId, game.getItemCountByID(itemId) - 1);
	    } else {
		    this.doubleCreatItem = false;
	    }
    } else {
        game.playMusic(PRE_LOAD_MUSIC.shot);
    }

    this.gameLayer.real = returnCurReal(this.touchLayer.startTouchDic,pos);
    this.touchLayer.setDisable();
    this.m_state = GAME_STATE.GS_FLY;
    //this.bottomLayer.setEnable(false);

    //发射动作
    var dir = "attack";
    if(angle < 56)
        dir = "attack3";
    else if(angle > 124)
        dir = "attack2";
    this.startShotting();
    this.uiLayer.armature.getAnimation().play(dir);
	this.uiLayer.armature.getAnimation().setMovementEventCallFunc((function(armature, movementType, movementID){
		if (movementType == ccs.MovementEventType.complete) {
			if (movementID == dir) {
				this.uiLayer.armature.getAnimation().play("idle");
			}
		}
	}).bind(this));
}

//===================================
//Desc: 检测是否有连击，没有则重置为0
//===================================
PlayScene.prototype.checkDoubleHit = function(){
    if(!this.doubleHitRecord[this.curCount] && !this.doubleSpecialRecord[this.curCount])
    {
	    this.doubleHitCount = 0;
        this.doubleTrunItemCount = 0;

        // 一次减少两个
        this.setCrockDoubleState(false);
        this.setCrockDoubleState(false);
    }
}
//======================================================================
//Desc: 发射的球定位后要重新检测 准备及等待的球的颜色是否属于最新颜色集
//======================================================================
PlayScene.prototype.checkWaitAndReadColorVaild = function(colores){
    if(colores.length == 0)return;
    if(this.m_wait && this.m_wait.getColor() > 0)
    {
        if(!table_keyof(colores,this.m_wait.getColor()))
        {
            var i = randomInt(0, colores.length-1);
            var color = colores[i];
            this.m_wait.setColor(color);
	        //cc.log("设置等待球颜色");
        }
    }

    if(this.m_curReady && this.m_curReady.getColor() > 0)
    {
        if(!table_keyof(colores,this.m_curReady.getColor()))
        {
            var i = randomInt(0, colores.length-1);
            var color = colores[i];
            this.m_curReady.setColor(color);
	        //cc.log("设置准备球颜色");
        }
    }
}

//===============================================================
//Desc: 设置游戏状态
//===============================================================
PlayScene.prototype.setState = function(){
    if (this.m_state == GAME_STATE.GS_END)
        this.m_state = GAME_STATE.GS_END;
    else if(this.m_state == GAME_STATE.GS_CHANGE)
        // 球先碰到但切换球还没切完，这时要等切完才能发射
        this.m_state = GAME_STATE.GS_HITED;
    else
        this.m_state = GAME_STATE.GS_START;
}

//===============================================================
//Desc: 设置当前回合的二连击有效
//===============================================================
PlayScene.prototype.setDoubleHitVaild = function(pos){
    if(! this.doubleHitRecord[this.curCount]){
	    this.doubleHitCount++;
	    this.doubleHitRecord[this.curCount] = true;
        this.showDoubleLabelAndTrunItem(pos);
    }
}

PlayScene.prototype.setDoubleSpecialHitVaild = function(pos){
	if(! this.doubleSpecialRecord[this.curCount]){
		this.doubleHitCount++;
		this.doubleSpecialRecord[this.curCount] = true;
		this.showDoubleLabelAndTrunItem(pos);
	}
}

//===============================================================
//Desc: 显示二连击标签，并提示道具
//===============================================================
PlayScene.prototype.showDoubleLabelAndTrunItem = function(pos){
	pos = this.gameLayer.convertToWorldSpace(pos);
	this.setCrockDoubleState(true);

	// 显示当前回合数
	if(!this.roundLabel) {
		//根精灵
		var rootSp = new cc.Sprite();
		rootSp.attr({x: pos.x + 10, y: pos.y - 100});
		rootSp.setScale(0.9);
		this.addChild(rootSp);
		//combo
		var comboSp = new cc.Sprite(res.COMB0_PNG);
		comboSp.attr({x: -30, y: 50});
		rootSp.addChild(comboSp);
		// 数字标签
		this.roundLabel = new cc.LabelBMFont(this.doubleHitCount,
		res.NUM_FONT1, 60, cc.TEXT_ALIGNMENT_LEFT, cc.p(0,0));
		this.roundLabel.setRotation(10);
		rootSp.addChild(this.roundLabel);
		// x字样
		var xSp = new cc.Sprite(res.X_PNG);
		xSp.attr({x: -this.roundLabel.getContentSize().width / 2 - 30, y: -10});
		rootSp.addChild(xSp);

		//缩变动画
		rootSp.runAction(
			cc.sequence(
				cc.spawn(
					cc.sequence(
						cc.scaleTo(0.1, 0.95, 0.95),
						cc.scaleTo(0.1, 0.9, 0.9)
					),
					cc.fadeIn(0.3)
				),
				cc.moveBy(0.5, cc.p(0, 10)),
				cc.spawn(
					cc.moveBy(0.15, cc.p(0, 5)),
					cc.sequence(
						cc.scaleTo(0.1, 0.75, 0.75),
						cc.scaleTo(0.1, 1.2, 1.2)
					),
					cc.fadeOut(0.2)
				),
				cc.callFunc((function () {
					if (this.roundLabel)
						this.roundLabel.removeFromParent();
					this.roundLabel = null;
					rootSp.removeFromParent();
				}).bind(this))
			)
		);
	}else{
			this.roundLabel.setString(this.doubleHitCount);
	}

	/*this.doubleTrunItemCount++;
	if(this.doubleTrunItemCount >= DOUBLE_TRUE_ITEM){
		if(this.waitBubbleNum > 0){
			this.doubleTrunItemCount = 0;
			//this.bottomLayer.setEnable(false)
			performWithDelay(this, function(){
					var itemId = randomInt(4,5);
					this.doubleCreatItem = true;
					//this.useOrCancelItem(true,itemId);
			}, 0.3);
		}else{
			// 刚好没球游戏结束时不加道具球
			this.doubleTrunItemCount = 0;
		}
	}*/

}

//===============================================================
//Desc: 根据当前连击数设置各缸连击状态
//===============================================================
PlayScene.prototype.setCrockDoubleState = function(bAdd) {
	//增加双倍状态
	if (bAdd) {
		var l = 0, r = 4;
		var v1 = 1, v2 = 2;
		var changeIdx = function () {
			l++, r--;
		};
	} else { //减少双倍状态
		var l = r = 2;
		var v1 = 2, v2 = 1;
		var changeIdx = function () {
			l--, r++;
		};
	}

	var crockStateIter = (function () {
		if (l >= 0 && r <= 4 && l <= r) {
			if (l < r) {
				if (this.doubleScoreStateRecord[l] == v1 || this.doubleScoreStateRecord[r] == v1) {
					if (this.doubleScoreStateRecord[l] == v1) {
						if (this.doubleScoreStateRecord[r] == v1) {
							if (Math.random() > 0.5)
								this.doubleScoreStateRecord[l] = v2;
							else
								this.doubleScoreStateRecord[r] = v2;
						}
						else
							this.doubleScoreStateRecord[l] = v2;
					}
					else //this.doubleScoreStateRecord[r] = v1
						this.doubleScoreStateRecord[r] = v2;
				}
				else {
					changeIdx();
					crockStateIter();
				}
			}
			else if (l == r) {
				if (this.doubleScoreStateRecord[l] == v1)
					this.doubleScoreStateRecord[l] = v2;
				else {
					changeIdx();
					crockStateIter();
				}
			}
		}
	}).bind(this);
	crockStateIter();

	//测试使用
	/*for(var i in this.doubleScoreStateRecord)
	{
		var v = this.doubleScoreStateRecord[i];
		if( v == 2)
			this.totalCrock[i].setScaleY(2);
		else
			this.totalCrock[i].setScaleY(1);
	}*/
}
//===============================================================
//Desc: 显示掉入缸后加的分数效果
//===============================================================
PlayScene.prototype.showAddScoreEffect = function(posX){
	var crockIndex = getCrockIndexByX(posX);
	//一个回合内一个缸内掉落数（累计最大倍数为5）
	this.doubleCrockRecord[this.curCount] = this.doubleCrockRecord[this.curCount] || {}; // 当前回合每个缸掉落的泡泡数
	this.doubleCrockRecord[this.curCount][crockIndex] = this.doubleCrockRecord[this.curCount][crockIndex] || 0;
	this.doubleCrockRecord[this.curCount][crockIndex]++;
	var curCrockDropCount = this.doubleCrockRecord[this.curCount][crockIndex];
	curCrockDropCount = curCrockDropCount >= 5 ? 5 : curCrockDropCount;

	//建立并显示分数
	var addScore = CROCK_SCORE[crockIndex] * curCrockDropCount * this.doubleScoreStateRecord[crockIndex];
	if(this.prevDropTime[crockIndex])
	{
		this.prevDropTime[crockIndex].setString(Number(this.prevDropTime[crockIndex].getString()) + addScore);
		game.refreshScore(addScore);
		return;
	}
	else
	{
		var scoreLable = new cc.Sprite();
		scoreLable.attr({x:CROCK_SHOW_SCORE_POSX[crockIndex].x,y:200});
		this.addChild(scoreLable, 200);
		var score = new cc.LabelBMFont(addScore, res.NUM_FONT2, 200, cc.TEXT_ALIGNMENT_LEFT, 0);
		score.setRotation(CROCK_SHOW_SCORE_POSX[crockIndex].r);
		scoreLable.addChild(score);
		this.prevDropTime[crockIndex] = score;
	}
	//scoreLable.setColor(DOUBLE_COLOR[curCrockDropCount-1]);

	//分数跳动动画
	var callback = function(){
		if(scoreLable){
			this.prevDropTime[crockIndex] = null;
			scoreLable.removeFromParent();
		}
	};
	scoreLable.runAction(
		new cc.Sequence(
			new cc.Spawn(
				new cc.ScaleTo(0.1, 0.95, 0.95),
				new cc.ScaleTo(0.1, 0.78, 0.78),
				new cc.ScaleTo(0.1, 0.8, 0.8)
			),
			new cc.MoveBy(0.3,cc.p(0,10)),
			new cc.FadeIn(0.3),
			new cc.Spawn(
				new cc.MoveBy(0.15,cc.p(0,5)),
				new cc.Sequence(
					new cc.ScaleTo(0.1, 0.75, 0.75),
					new cc.ScaleTo(0.1, 1, 1)
				)
			),
			new cc.CallFunc(callback.bind(this))
		)
	)
	game.refreshScore(addScore);

	//显示相应缸舌动画(一次)
	var animation = game.bulletManage.getAnimation(CROCK_TONGUE_ANI_INFOR[crockIndex].name, "start");
	this.crockTongueAniList[crockIndex].runAction(new cc.Animate(animation));
}
//===============================================================
//Desc: 更新泡泡球的数量
//===============================================================
PlayScene.prototype.updateWaitBubbleNum = function(curNum){
	/*if(this.waitBubbleNum <= 1){
		this.waitBubbleNum = curNum;
		this.waitBubbleLabel.setString(curNum);
		if(!this.m_curReady){
			this.m_state = GAME_STATE.GS_START;
			this.initReadyBubble();
		}
		if(!this.m_wait){
			this.createWaitBubble();
		}
		return;
	}*/
	this.waitBubbleNum = curNum;
	//时间模式
	if(game.isTimeModel){
		this.waitBubbleLabel.setString("");
		this.waitBubbleLabel.setVisible(false);
	}else{
		this.waitBubbleLabel.setString(curNum);
	}
}
//===============================================================
//Desc: 游戏结束时弹射剩余的球
//===============================================================
PlayScene.prototype.shotWaitWhenGameOver = function(onFinish){
	var action = new cc.Spawn(
		new cc.MoveTo(0.2, cc.p(READY_BUBBLE_POS.x,READY_BUBBLE_POS.y)),
		new cc.ScaleTo( 0.2,  1));

	var shotReadyAndWaitBubble = (function(){
		//移除
		this.m_curReady.removeFromParent();
		//发射
		var shotColor = this.m_curReady.getColor();
		this.physicLayer.shotOnePhysicBubble(shotColor > 0 && shotColor || 1);

		//时间模式
		if(game.isTimeModel){
			this.topLayer.updateTimeProgress(this.waitBubbleNum);
		}

		//从等待队列中切换出来
		if(this.m_wait)
		{
			this.m_curReady =  this.m_wait;
			this.m_wait  = null;
			this.m_curReady.runAction(new cc.Sequence(action, new cc.CallFunc((function(){
					if(this.waitBubbleNum > 0){
						this.m_wait = createBubbleByColor(randomCreateColor(), true);
						this.updateWaitBubbleNum(this.waitBubbleNum - 1);
						this.m_wait.attr({x:WAIT_BUBBLE_POS.x,y:WAIT_BUBBLE_POS.y});
						this.addChild(this.m_wait, SHOT_BUBBLE_DEP);
					}
					shotReadyAndWaitBubble();
				}
			).bind(this))))
		}
		else{
            this.m_state = GAME_STATE.GS_SHOWEND;
            
            if(onFinish){
                onFinish();
            }
        }
			

	}).bind(this);
	shotReadyAndWaitBubble();
}
//===============================================================
//Desc: 游戏结束
//===============================================================
PlayScene.prototype.gameOver = function(params,bShowLayer){
	//cc.log("gameOver call!!");
	params  = params || {};
	bShowLayer = bShowLayer || false;

	// 时间模式特殊处理
	if(game.isTimeModel){
		this.topLayer.stopTime();
	}

	if(this.m_state != GAME_STATE.GS_END){
		this.result = params.result;
		this.bottomLayer.setEnable(false);
		this.m_state = GAME_STATE.GS_END;
		this.gameLayer.setUpdateBubble(false);
		if(this.result == 1 && this.gameLayer.m_curReady)
			this.gameLayer.changeBubbleToPhysicWorld(this.gameLayer.m_curReady);
		this.touchLayer.setDisable();
		this.lineLayer.shieldShotLine();
	}
    var funcOnFinish = function(){
        //手上的球全部发射完成, 等待几秒以后，必须结算
        this.resultTimer = setTimeout(function() {
            this.showSuccessOrFailUI(params, true);
        }.bind(this), 7000);
    }.bind(this);
	if(!bShowLayer && params.result == 1){
		var shotBubAndPlayMusic = (function(){
			if(this.waitBubbleNum > 0)
			{
				game.stopMusic();
				// 如果有剩余球则发射出来
				this.shotWaitWhenGameOver(funcOnFinish);
				game.playMusic(PRE_LOAD_MUSIC.shotWaitWhenWin);
			}
		}).bind(this);

		if(CURRENT_MODE != LEVEL_MODEL.wheel){
			// 过关 在第一行放闪电
			this.gameLayer.effectFlashWhenGameOver({m_nRow : 0,m_nCol : 1});

			// 时间模式
			if(game.isTimeModel)
			{
				if(this.topLayer.time > 0)
				{
					// 时间模式结束时发射剩余时间对应的球数
					this.waitBubbleNum = this.topLayer.time;
				}
			}

			shotBubAndPlayMusic();
		}
		else{
			this.gameLayer.playEndGhostAni(shotBubAndPlayMusic);
		}

	}
	// 最后一球过关且没有掉落时要直接显示结束界面
	this.showSuccessOrFailUI(params, bShowLayer);
}
//===============================================================
//Desc: 显示胜利或结束面板
//===============================================================
PlayScene.prototype.showSuccessOrFailUI = function(params, bShowLayer){
	if(!this.gameOverLayer && (( game.isTimeModel && this.dropBubbleCount <= 0) || (this.waitBubbleNum == 0 && this.dropBubbleCount <= 0) || bShowLayer))
	{
		var callback = (function(){
			this.gameOverLayer = new GameOverLayer({
				levelData : this.levelData,
				score : this.topLayer.score,
				star : this.topLayer.star,
				newRecord : this.newRecord,
				level : this.level,
				scene : this,
				result : (params.result || 0)
			});
			this.addChild(this.gameOverLayer, 2000);
		}).bind(this);
		if(params.result == 1){
			this.showSuccess(callback);
        }
		else{
			this.showFail(callback);
        }
        return true;
	}
    return false;
}
//===============================================================
//Desc: 显示胜利动作
//===============================================================
PlayScene.prototype.showSuccess = function(callBack){
	this.newRecord = game.setStarAndScoreByLevel(this.level, this.topLayer.score, this.topLayer.star);
	this.uiLayer.armature.getAnimation().play("cheer");
	this.uiLayer.armature.getAnimation().setMovementEventCallFunc((function(armature, movementType, movementID){
		if (movementType == ccs.MovementEventType.loopComplete) {
			this.uiLayer.armature.getAnimation().pause();
			callBack();
		}
	}).bind(this));

	//-- 检测是否有解锁道具
	var itemData = ITEM_UNLOCK[this.realLevel];
	if (itemData && game.gameData.lastLevel == this.level) {

		new BYMsgBox({
            type: 2,
            unlock:true,
			effect: {image: res.Effect_bg_png, offset: cc.p(0, 0)},
			ico: res[string.format("Item_bubble%d_png", "%d", itemData.itemId)],
			title: res[string.format("Title_unlock_%d", "%d", itemData.itemId)],
			text: itemData.dec,
			button1Data: {front:res.Continue_btn, offset: cc.p(0, 0), callback: function () {
			}}
		});

		//-- 设置相应的新手引导
		if (itemData.itemId == ITEM_ID.rainbow) {
			game.setGuideId(1);
		} else if (itemData.itemId == ITEM_ID.icoCream) {
			game.setGuideId(11);
		} else if (itemData.itemId == ITEM_ID.addThree) {
			game.setGuideId(41);
		} else if (itemData.itemId == ITEM_ID.ice) {
			game.setGuideId(21);
		} else if (itemData.itemId == ITEM_ID.addTen) {
			game.setGuideId(31);
		} else if (itemData.itemId == ITEM_ID.magic) {
			game.setGuideId(51);
		}

		//-- 增加相应的解锁道具
		game.setItemCountByID(itemData.itemId, game.getItemCountByID(itemData.itemId) + 1);

		game.bonus(ITEM_INFOR["item_" + itemData.itemId].um_itemId, 1, Number(ITEM_INFOR["item_" + itemData.itemId].price), BonusTrigger.FROM_UNLOCK);

	}

}
//===============================================================
//Desc: 显示失败动作
//===============================================================
PlayScene.prototype.showFail = function(callBack){
	this.uiLayer.armature.getAnimation().play("dead");
	this.uiLayer.armature.getAnimation().setMovementEventCallFunc((function(armature, movementType, movementID){
		if (movementType == ccs.MovementEventType.loopComplete) {
			this.uiLayer.armature.getAnimation().pause();
			//callBack();
			//-- 时间模式下不出现续命
			if(game.isTimeModel) {
				if (callBack) {
					callBack();
				}
				return;
			}
            var playScene=this;
			//--最后一颗球打到最下面时直接掉落（场景中没有未进缸的球），这时会触发两次游戏结束事件,所以这里做个判断
			if (!cc.director.getRunningScene().getChildByTag(POP_WIN_TAG)) {
				//-- 3、   第一次关卡失败提示赠送5步的界面，点击确认继续游戏
				if (game.getIsFirstFail()) {
					new BYMsgBox({
						type: 2,
						effect: {image: "res/texture/newUI/effect_bg.png", offset: cc.p(0, 0)},
						ico: [
							{image: "res/texture/newUI/first_fail_add5.png", scale: 2, offset: cc.p(0, 0)}
						],
						title: "res/texture/newUI/zs_title.png",
						text: "赠送5步",
						button1Data: {
							front: "res/texture/newUI/okBtn2.png",
							text: "",
							offset: cc.p(0, 0), callback: function () {
								game.setIsFirstFail();
								playScene.resumeGame();
							}
						}
					});
				} else {
					//安慰礼包
					var buyLayer = new BuyItemLayer({ itemId: RESUME_GAME_ITEM, dontShowCount: true, parent: playScene, callback: function (buySuccessFlag) {
						if (buySuccessFlag) {
							playScene.resumeGame();

							//-- 附加道具
							var reward = ITEM_INFOR["item_" + RESUME_GAME_ITEM].reward;

							for (var k = 0; k < reward.length; k++) {
								var data = reward[k];
								var oldItemCount = game.getItemCountByID(Number(data.itemId)) || 0;
								game.setItemCountByID(Number(data.itemId), oldItemCount + Number(data.count));
							}

							game.use(ITEM_INFOR["item_" + RESUME_GAME_ITEM].um_itemId, 1, Number(ITEM_INFOR["item_" + RESUME_GAME_ITEM].price));
						} else if (callBack) {
							callBack()
						}
					}});
					var maskLayer=new BYMask({});
					maskLayer.addChild(buyLayer);
					cc.director.getRunningScene().addChild(maskLayer,POP_WIN_TAG,POP_WIN_TAG);

				}

			}

		}
	}).bind(this));
}

PlayScene.prototype.resumeGame=function(){

	var oldItemCount = game.getItemCountByID(RESUME_GAME_ITEM) || 0;
	game.setItemCountByID(RESUME_GAME_ITEM, oldItemCount - 1);

	this.m_state = GAME_STATE.GS_START;

	this.setEnable();
	this.updateBubbleNum(5,true);
	//-- self.bottomLayer:setEnable(false)
	this.doubleCreatItem = true;
	//-- self:useOrCancelItem(true,ITEM_ID.rainbow)
	this.m_wait.setVisible(true);

	this.canSwap = true;

	//-- 刷新底部道具栏显示
	this.bottomLayer.refreshItemCountLabel();


}

//===============================================================
//Desc: 更新球的数量
//===============================================================
PlayScene.prototype.updateBubbleNum = function(curNum){
	if(this.waitBubbleNum <= 1){
		this.waitBubbleNum = curNum;
		this.waitBubbleLabel.setString(this.waitBubbleNum);
		if(!this.m_curReady){
			this.initReadyBubble();
			this.m_state = GAME_STATE.GS_START;
		}

		if(!this.m_wait){
			this.createWaitBubble();
		}
		return;
	}

	this.waitBubbleNum = curNum;
	if(game.isTimeModel){
		this.waitBubbleLabel.setVisible(false);
		this.waitBubbleLabel.setString("");
	}
	else{
		this.waitBubbleLabel.setString(this.waitBubbleNum);
	}

}