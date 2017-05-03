/**
 * Created by beyondray on 2015/7/22.
 * Desc: 泡泡球(继承泡泡基类)
 */

var BubbleSprite = cc.Sprite.extend({
	ctor:function(bubbleData){
		this._super();
		this.initData(bubbleData);
		this.loadAnimation();
	},
	//初始化数据
    initData:function(bubbleData){
        this.state = "init";  // 当前子弹状态 start,progress,over
        this.model = bubbleData;
        this.curCount = 0;
        this.effectTag = 100; // 附加效果TAG
        this.aroundList = [];  // 保存周围的球RC，用于掉落检测
        this.aniId = null; // 指定播放的动画ID，用于同type不同动画，如解救中的不同占位类型动画
	    this.clearWhenIsWheel = false; //标记为旋转转轮时是否已经被同组清除过
	    this.revolveWheelTag = 212; // 旋转转轮待机动画标记

	    //泡泡本身
	    //this.initWithFile(bubbleData.imageFilename);
	    this.initWithSpriteFrameName(bubbleData.spriteFrameName);

	    var pos = getPosByRowAndCol(bubbleData.row, bubbleData.col);
	    this.setPosition(pos);
	    //泡泡上特殊效果（如果有）
        this.effectSp = new cc.Sprite();
	    this.effectSp.setPosition(BUBBLE_RADIUS, BUBBLE_RADIUS);
        this.addChild(this.effectSp,2);

	    if(bubbleData.type == BUBBLE_TYPE.fog){
		    this.fog = new cc.Sprite(res.Fog_png);
		    this.effectSp.addChild(this.fog);
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.color){
			this.colorTag = new cc.Sprite(res.Special05_png);
		    this.effectSp.addChild(this.colorTag, 1, this.effectTag);
		    this.colorSpecialCount = new cc.Sprite(res.Special5_3_png);
		    this.effectSp.addChild(this.colorSpecialCount, 1);
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.saveAlpha){
			if(bubbleData.hold > 0){
				// 解救模式下的占位泡泡要显示被困动物
				var holdAniImage = res[string.format("Hold_ani%d_png", "%d", bubbleData.hold)];
				var posArr ={};
				posArr.p1 = {x : 65/2,y : 65/2 };
				posArr.p3 = {x : 35, y : 0 };
				posArr.p6 = {x : 35,y : 30};
				uiFactory.createSprite(holdAniImage, posArr["p"+ bubbleData.hold].x, posArr["p"+bubbleData.hold].y, 0.5, 0.5, this);
				this.aniId = "type_" + this.getType() + "_" + bubbleData.hold;
			}
		    else{
				this.setOpacity(0);
			}
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.hitAlpha){
			if(bubbleData.hitHold > 0){
				//解救3模式(hit)下的占位泡泡要显示六边形
				uiFactory.createSprite(res.Hit_bg_png, 35,39,0.5,0.5,this,1, 200);
				var clearAni1 = new cc.Sprite();
				clearAni1.setPosition(35,39);
				this.addChild(clearAni1,100,100);
				this.aniId = "type_" + this.getType() + "_" + bubbleData.hitHold;
				game.bulletManage.load("type_10_clear1");
				var animation = game.bulletManage.getAnimation("type_10_clear1","start");
				clearAni1.setSpriteFrame(animation.getFrames()[0].getSpriteFrame());
			}
		    else{
				this.setOpacity(0);
			}
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.save2Alpha && bubbleData.save2Hold > 0){
		   // 解救2模式下的占位泡泡
		    var holdMaskImage = res[string.format("Ice_hold%d_png", "%d", bubbleData.save2Hold)];
		    var posArr ={};
		    posArr.p1 = {x : 65/2,y : 65/2 };
		    posArr.p3 = {x : 35, y : 0 };
		    uiFactory.createSprite(holdMaskImage, posArr["p"+bubbleData.save2Hold].x, posArr["p"+bubbleData.save2Hold].y, 0.5, 0.5, this);
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.three){
		    var addSp = uiFactory.createSprite(null, 25,32, 0.5, 0.5, this);
			var addIco = uiFactory.createSprite(res.AddIco_png, 0, 0, 0.5, 0.5, addSp);
		    var addCount = uiFactory.createSprite(res[string.format("Add%d_png", "%d", Number(this.model.attributes.typeThree || 3))],
		    30, 10, 0.5, 0.5, addIco);
		    addSp.runAction(cc.sequence(
			    cc.scaleTo(0.7, 0.88,0.88),
			    cc.scaleTo(0.7, 1,1)
		    ).repeatForever());
	    }
	    else if(bubbleData.type == BUBBLE_TYPE.revolveWheel){

	    }
	    else if(bubbleData.type == BUBBLE_TYPE.dragon){
		    game.bulletManage.load("type_dragon");
		    var animation = game.bulletManage.getAnimation("type_dragon","start");
		    this.setSpriteFrame(animation.getFrames()[0].getSpriteFrame());
	    }
    },
	loadAnimation:function(){
		if(this.aniId){
			game.bulletManage.load(this.aniId);
			this.playStartAni();
		}
		else if(this.getItemId() == 0 && BULLET_CONFIG["type_" + this.getType()]){
			game.bulletManage.load("type_" + this.getType());
			this.playStartAni();
		}else if (this.getItemId() != 0 && BULLET_CONFIG["itemId_" + this.getItemId()]){
			game.bulletManage.load("itemId_" + this.getItemId());
			if(this.getItemId()!=ITEM_ID.rainbow&&this.getItemId()!=ITEM_ID.iceCream) {
				this.playStartAni();
			}
		}
	},
	setGameLayer:function(layer){
		this.gameLayer = layer;
		this.curCount = this.gameLayer.scene.curCount || 0;
	},

    getScore:function(){
        if (this.model.type == BUBBLE_TYPE.normal)
            return this.model.score;
        return 10;
    },

    getAniId:function() {
        var aniId = this.aniId || ( this.getItemId() != 0 && "itemId_" + this.getItemId() || "type_" + this.getType() );
        return aniId;
    },

    // 是否可掉落
    isCanFall:function(){
        var canFall = true;
        if(this.aroundList.length > 0)canFall = false;
        return canFall;
    },

	// 解救3（hit）模式下，据点周围所有的球被消时据点消除
	clearHitHold:function(){
		//中心点被打到则清除该据点
		this.clearMe(this,false,true);
		var k = RcKeyOf(this.gameLayer.curHoldList,{ m_nRow : this.getRow(), m_nCol : this.getCol() });
		removeByIdx(this.gameLayer.curHoldList, k);
	},

    hit:function(rc,curShotBubbleModel){

	    if(curShotBubbleModel)
	    {
		    switch(curShotBubbleModel.itemId) {
			    case ITEM_ID.ice:

				    //-- 道具碰到则算连击
				    this.gameLayer.scene.setDoubleHitVaild(cc.p(this.getPositionX(), this.getPositionY()));

				    if (this.model.type == BUBBLE_TYPE.normal || this.model.type == BUBBLE_TYPE.color
					    || this.model.type == BUBBLE_TYPE.three || this.model.type == BUBBLE_TYPE.alpha
					    || this.model.type == BUBBLE_TYPE.fog || this.model.type == BUBBLE_TYPE.black
					    || this.model.type == BUBBLE_TYPE.revolveWheel) {

					    //-- 被冰球碰到时消失动画特殊处理
					    performWithDelay(this, function () {
						    this.setTexture(new cc.Sprite(res.ALPHA_PNG).getTexture());
					    }.bind(this), 0.3);
					    this.aniId = "item_1_progress";
					    game.bulletManage.load("item_1_progress");

					    this.clearMe();
				    } else if (this.model.type == BUBBLE_TYPE.flash) {
					    this.clearMe();
					    this.gameLayer.effectFlash(this.getRowCol(), true);

				    } else if (this.model.type == BUBBLE_TYPE.bomb) {
					    this.clearMe();
					    this.gameLayer.effectBomb(this.getRowCol(), true);
				    } else if (this.model.type == BUBBLE_TYPE.hitAlpha) {
					    var hitBubble = this.gameLayer.m_board[ rc.m_nRow + "_" + rc.m_nCol];
					    if (this.model.hitHold == 0) {
						    //-- 解救模式3 消除巧克力显示同种颜色的球
						    this.clearIceAndSetAroundColor();
						    //-- 这里当触发消除同色时 hitBubble 已经被清除了
						    if (hitBubble) {
							    this.clearMe(hitBubble, true);
						    }
					    }
				    } else if (this.model.type == BUBBLE_TYPE.save2Alpha){
					    //-- 解救模式2
					    var hitBubble = this.gameLayer.m_board[ rc.m_nRow + "_" + rc.m_nCol ];
					    this.clearSameGroup(BUBBLE_TYPE.save2Alpha);
					    if (hitBubble) {
						    this.clearMe(hitBubble, true)
					    }
		            } else if (this.model.type == BUBBLE_TYPE.saveAlpha) {
					    this.clearSameGroup(BUBBLE_TYPE.saveAlpha);
				    }
				    return;

			    case ITEM_ID.magic:
				    //-- 道具碰到则算连击
				    this.gameLayer.scene.setDoubleHitVaild(cc.p(this.getPositionX(),this.getPositionY()));

				    //-- 魔法泡泡触发,所有同种球都设置成一种普通球
				    this.setSameTypeToNormalBubble(rc);

				    game.playMusic(MUSIC_CONFIG.magic_clear);
				    return;
			    case ITEM_ID.rainbow:
				    //-- 道具碰到则算连击
				    this.gameLayer.scene.setDoubleHitVaild(cc.p(this.getPositionX(),this.getPositionY()));

				    //-- 彩虹泡泡则要清除彩虹泡泡
				    var hitBubble = this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];
				    game.playMusic(MUSIC_CONFIG.rainbow);
				    if(hitBubble) {
					    this.clearMe(hitBubble, false);
				    }
				    break;
			    case ITEM_ID.iceCream:

				    //-- 道具碰到则算连击
				    this.gameLayer.scene.setDoubleHitVaild(cc.p(this.getPositionX(),this.getPositionY()));
				    //-- 冰淇沐泡泡
				    game.bulletManage.load("itemId_5_normal"); //-- 加普通球被冰淇淋击中的特效
				    this.gameLayer.effectBomb(rc,true,true);
				    var hitBubble = this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];
				    if(hitBubble) {
					    this.clearMe(hitBubble, false);
				    }
				    return;
		    }
	    }

        switch (this.model.type)
        {
	        case BUBBLE_TYPE.normal:return;
	        case BUBBLE_TYPE.flash:
		        this.clearMe();
		        this.gameLayer.effectFlashWithClearOneRow(this.getRowCol(),true);
		        break;
	        case BUBBLE_TYPE.bomb:
		        this.clearMe();
		        this.gameLayer.effectBomb(this.getRowCol(),true);
		        break;
	        case BUBBLE_TYPE.color:
		        this.swapNextColor();
		        break;
	        case BUBBLE_TYPE.three:
		        this.clearMe();
		        this.addWaitBubble(Number(this.model.attributes.typeThree));
		        break;
	        case BUBBLE_TYPE.alpha:
		        // 彩虹泡泡不能进入透明泡泡
		        if(curShotBubbleModel && curShotBubbleModel.itemId != ITEM_ID.rainbow){
			        var replaceBubble = this.gameLayer.m_board[ rc.m_nRow + "_"+ rc.m_nCol ];
			        if(replaceBubble){
				        var replaceModel = replaceBubble.getModel();
				        // 清除发射球
				        delete  this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];

				        replaceBubble.runAction(cc.sequence(
					            cc.moveTo(0.2,this.getPosition()),
						        cc.callFunc((function(){
							        this.setModel(replaceModel);
							        replaceBubble.removeFromParent();
							        if(this.effectSp){
								        this.effectSp.removeFromParent();
								        this.effectSp = null;
							        }
						        }).bind(this))
					        )
				        );
			        }
		        }
		        break;
	        case BUBBLE_TYPE.hitAlpha:
		        var hitBubble = this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];
		        // 解救模式3 消除巧克力显示同种颜色的球
		        if (this.model.hitHold == 0){
			        this.clearIceAndSetAroundColor();

			        // 这里当触发消除同色时 hitBubble 已经被清除了
			        if (hitBubble)this.clearMe(hitBubble, true);
		        }
				break;
	        case BUBBLE_TYPE.save2Alpha:
		        // 解救模式2
		        var hitBubble = this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];
		        if(curShotBubbleModel.itemId == ITEM_ID.rainbow || curShotBubbleModel.color == this.getColor()){
			        this.clearSameGroup(BUBBLE_TYPE.save2Alpha);
			        if (hitBubble)this.clearMe(hitBubble, true);
		        }
		        break;
        }
    },
	// 播放转轮动画
	playRevolveAni:function(){
		if(!this.effectSp)return;

		var angle = 60;
		if(Number(this.getModel().attributes.revolveDir) != 1){
			angle = -60;
		}
		game.bulletManage.load("type_12");
		var inAni = this.effectSp.getChildByTag(this.revolveWheelTag);
		if(inAni){
			inAni.stopAllActions();
			this.state = "revolve";
			var animation = game.bulletManage.getAnimation("type_12", "progress");
			inAni.runAction(cc.spawn(
				cc.sequence(cc.animate(animation),cc.callFunc((function(){
				inAni.setRotation(-this.getRotation()-this.gameLayer.getRotation());
			}).bind(this))),cc.rotateBy(0.5, -angle))
			);
		}
		this.runAction(cc.rotateBy(0.5, angle));
	},
    playStartAni:function(){

        if(this.state == "start")return;
        var aniId = this.getAniId();
        //播放音乐
        var music = game.bulletManage.getMusic(aniId,"start");
        if(music != 0 )
            game.playMusic(music);
	    var aniSp = null;
	    var playEffectFun = (function(phaseName){
		    var offset = game.bulletManage.getOffset(aniId,phaseName);
		    if(game.bulletManage.getIneffect(aniId,phaseName) == 2){
			    this.reorderChild(this.effectSp, game.bulletManage.getZorder(aniId,phaseName));
			    aniSp = new cc.Sprite();
			    aniSp.attr({x:offset.x,y:offset.y});
			    this.effectSp.addChild(aniSp, 1, this.revolveWheelTag);
		    }
		    else if(game.bulletManage.getIneffect(aniId,phaseName) == 0){
			    aniSp = this;
			    aniSp.attr({x:this.x+offset.x, y:this.y+offset.y});
			    aniSp.removeAllChildren();
		    }
		    else{
			    aniSp = new cc.Sprite();
			    this.gameLayer.scene.effectLayer.addChild(aniSp);
			    var lp = this.getPosition();
			    var wp = this.gameLayer.convertToWorldSpace(lp);
			    aniSp.attr({x:wp.x + offset.x,y:wp.y + offset.y});
		    }
	    }).bind(this);
	    var animation = game.bulletManage.getAnimation(aniId,"start");

	    if(animation){
		    playEffectFun("start");
		    aniSp.stopAllActions();
		    if(game.bulletManage.getLoop(aniId,"start") == 1){
			    aniSp.runAction(cc.repeatForever(cc.animate(animation)));
		    }
		    else{
			    aniSp.runAction(cc.animate(animation));
		    }
	    }
	    else if(game.bulletManage.getParticles(aniId,"start")){

		    var particleData = game.bulletManage.getParticles(aniId,"start");
		    var offset = particleData.offset || cc.p(0,0);
		    if(particleData.ineffect == 2){
			    this.effectSp.retain();
			    this.effectSp.removeFromParent();
			    this.addChild(this.effectSp,Number(particleData.zorder));
			    aniSp = new cc.Sprite();
			    aniSp.attr({x:offset.x,y:offset.y});
			    this.effectSp.addChild(aniSp);

		    }
		    else if(particleData.ineffect == 0){
			    aniSp = this;
			    aniSp.attr({x:this.x+offset.x,y:this.y+offset.y});
		    }
		    else{
			    aniSp = new cc.Sprite();
			    this.gameLayer.scene.effectLayer.addChild(aniSp);
			    var lp = this.getPosition();
			    var wp = this.gameLayer.convertToWorldSpace(lp);
			    aniSp.attr({x:wp.x + offset.x,y:wp.y + offset.y});
		    }
		    aniSp.stopAllActions();
		    this.particle = new cc.ParticleSystem(particleData.res);
		    this.particle.setPosition(cc.p(0,0));
		    this.particle.setPositionType(cc.ParticleSystem.RELATIVE);
		    aniSp.addChild(this.particle);
			//cc.log("*********add particle");

	    }
	    this.state = "start";
    },
	// 得到该泡泡球周围泡泡的列表信息: [{m_nRow : ?, m_nCol : ?},...]
    initAroundList:function(){
       this.aroundList = GetAround(this.model.row, this.model.col);
    },

    getModel:function(){
        return this.model;
    },

    setModel:function(model) {
        var oldR = this.getRow();
        var oldC = this.getCol();

        this.setType(model.type);
        this.model = model;
        this.setColor(model.color);
        this.setRow(oldR);
        this.setCol(oldC);
    },

    setRowColIndex:function(row, col){
        this.model.row = row;
        this.model.col = col;
    },

    getRowCol:function(){
        return { m_nRow : Number(this.model.row), m_nCol : Number(this.model.col) }
    },

    getType:function(){
        return Number(this.model.type);
    },

    setType:function(typeId){
        if(this.model.type != typeId)
        {
            if(this.effectSp && this.effectSp.getChildByTag(this.effectTag))
                this.effectSp.removeChildByTag(this.effectTag);
            this.model.type = typeId;
        }
    },

    getRow:function(){
        return Number(this.model.row);
    },

    setRow:function(row){
        this.model.row = row;
    },

    getCol:function(col){
        return Number(this.model.col);
    },

    setCol:function(col){
        this.model.col = col;
    },

    getItemId:function(){
        return Number(this.model.itemId);
    },

    setItemId:function(itemId){
        this.model.itemId = itemId;
    },

    getColor:function(){
        return Number(this.model.color);
    },

    setColor:function(color){
        //TODO
        /*if(typeof(color) == Object){

        }*/
        this.model.color = Number(color);
        this.model.returnSpriteFrameName();
		this.model.setSpriteFrameWithColor(Number(color));
	    this.initWithFile(this.model.imageFilename);
	    //cc.log("------------this.model.imageFilename="+this.model.imageFilename);

    },

    randomColor:function(lower,  greater){
        var m_color = randomInt(lower,  greater);
        this.model.color = m_color;
        return m_color;
    },

	setSameTypeToNormalBubble:function(rc) {
		var totalColors = this.gameLayer.currentTotalColores();
		var tColors = totalColors.curTotalColores;
		var maxRow = totalColors.maxRow;
		var weight = 100 / (tColors.length);
		var colorList = {};

		for (var i = 0; i < tColors.length; ++i) {
			var color = tColors[i];
			if (this.getColor() == color) {
				colorList[color] = {color: color, weight: 0};
			} else {
				colorList[color] = {color: color, weight: weight};
			}
		}

		var tempModel = randomBubble(colorList).getModel();
		var selfType = this.getType();
		var selfColor = this.getColor();

		//-- 发射光束效果
		var shotLight = function (bubble){
			var startPoint;
			if (CURRENT_MODE == LEVEL_MODEL.wheel) {
				var point = getPosByRowAndCol(rc.m_nRow, rc.m_nCol);
				if (point) {
					startPoint = point;

				} else {
					startPoint = getPosByRowAndCol(rc.m_nRow, rc.m_nCol);
				}
			} else {
				startPoint = getPosByRowAndCol(rc.m_nRow, rc.m_nCol);
			}

			var endPoint;
			if (CURRENT_MODE == LEVEL_MODEL.wheel) {
				var point = getPosByRowAndCol(bubble.getRow(), bubble.getCol());
				if (point) {
					endPoint = point;

				} else {
					endPoint = getPosByRowAndCol(bubble.getRow(), bubble.getCol());
				}
			} else {
				endPoint = getPosByRowAndCol(bubble.getRow(), bubble.getCol());
			}

			//-- local wStarP = self:convertToWorldSpace(startPoint)
			//-- local wEndP = self:convertToWorldSpace(endPoint)


			//cc.log("startpx="+startPoint.x+",startpy="+startPoint.y);
			//cc.log("endpx="+endPoint.x+",endpy="+endPoint.y);


			var particle = new cc.ParticleSystem(res.Magic_light_2);
			particle.setPosition(startPoint.x, startPoint.y);
			particle.setPositionType(cc.ParticleSystem.RELATIVE);
			this.gameLayer.addChild(particle, 1000);

			particle.runAction(new cc.Sequence(
				//new cc.MoveTo(0.6, cc.p(endPoint.x, endPoint.y)),
				//new cc.DelayTime(0.2),
				new cc.CallFunc(function () {
					particle.removeFromParent();
					if(bubble.gameLayer){
						bubble.stopAllActions();
						bubble.setModel(clone(tempModel));
					}
				})
			));

		}.bind(this);

		for(var rc1 in this.gameLayer.m_board){
			var bubble=this.gameLayer.m_board[rc1];
			if(bubble&&bubble.getType()==selfType){
				bubble.effectSp.removeFromParent();
				bubble.effectSp=null;
				bubble.colorSpecialCount=null;
				if(bubble.getType()>0){
					shotLight(bubble);
				}else if(bubble.getColor()==selfColor){
					shotLight(bubble);
				}
			}
		}

	}

});
BubbleSprite.prototype.removeFog = function(){
    //cc.log("removeFog");
    if(this.fog )
    {
        //TODO PLAYANI
        this.playAni("hit");
        this.fog.removeFromParent();
        this.fog = null;
    }
}

// 每回合结束触发
DRAGON_ANI = ["over","start","progress"];

BubbleSprite.prototype.checkOneAfter = function(){
    //变色泡泡(每三回合变一次色)
    if(this.model.type == BUBBLE_TYPE.color)
    {
		var curCount = 3 - (this.gameLayer.scene.curCount - this.curCount);
	    var frameNo = res[string.format("Special5_%d_png", "%d", (curCount <= 0 && 3 || curCount))];
	    if(this.effectSp){
		    this.colorSpecialCount.setTexture(frameNo);
	    }
		if(this.gameLayer.scene.curCount - this.curCount == 3){
			this.swapNextColor();
		}
    } //龙泡泡
    else if(this.model.type == BUBBLE_TYPE.dragon)
    {
		if(this.gameLayer.scene.curCount%3 == 0){
			var animation = game.bulletManage.getAnimation("type_dragon",DRAGON_ANI[this.gameLayer.scene.curCount%3]);
			if(animation){
				this.runAction(cc.sequence(cc.animate(animation), cc.callFunc((function(){
					if(this.gameLayer.scene.m_state != GAME_STATE.GS_END){
						this.addBubbleInRect();
					}
				}).bind(this))));
			}
		}
	    else{
			var animation = game.bulletManage.getAnimation("type_dragon",DRAGON_ANI[this.gameLayer.scene.curCount%3]);
			if(animation){
				this.runAction(cc.animate(animation));
			}

		}

    }
}
// 泡泡龙，在一定范围内增加指定球数，增加的球一定要连着
BubbleSprite.prototype.addBubbleInRect = function(){
	var obj = this.gameLayer.currentTotalColores();
	var curTotalColores = obj.curTotalColores;
	var maxRow = obj.maxRow;

	var weight = 100/curTotalColores.length;
	var colorList = {};
	for(var i in curTotalColores){
		var color = curTotalColores[i];
		colorList[color] = { color : color, weight : weight };
	}

	var checkMinRow = 0,minCol = 0;
	var centerRoundList = {}; //中心点周围的六个球

	//旋转模式分开处理
	if(CURRENT_MODE == LEVEL_MODEL.wheel){
		maxRow = 15, checkMinRow=0, minCol=-5;
		centerRoundList = centerRoundList = GetAround(this.gameLayer._centerRC.m_nRow, this.gameLayer._centerRC.m_nCol);
	}
	else{
		checkMinRow = (maxRow - 9) > 0 && (maxRow - 9) || 1;// 第一行不生成泡泡
		if(this.getRow() < ((maxRow - 9) > 0 && (maxRow - 9) || 0) ){
			return;
		}
	}

	var findNum = 0, count = 0;
	while(findNum < 3){
		count = count + 1;
		if( count >= 100){
			maxRow = maxRow + 1;
			count = 0;
		}

		maxRow = checkMinRow > maxRow && checkMinRow || maxRow;
		var rRow = randomInt(checkMinRow, maxRow-1);
		var rCol = randomInt(minCol, MAX_COLS-1);
		if(! this.gameLayer.m_board[ rRow +"_"+ rCol ] && ! RcKeyOf(centerRoundList,{ m_nRow : rRow , m_nCol : rCol })){
			var vecRowCol = GetAround(rRow, rCol);
			for(var k in vecRowCol){
				var rc = vecRowCol[k];
				if(this.gameLayer.m_board[ rc.m_nRow +"_"+ rc.m_nCol ]){
					findNum++;
					this.gameLayer.addBubbleByRC({ m_nRow : rRow, m_nCol : rCol }, randomBubble(colorList));
					break;
				}
			}
		}
	}
}

// 变色球的话，切换到下一个颜色
BubbleSprite.prototype.swapNextColor = function(){
	//cc.log("swapNextColor call!");
	// 当前回合数，保证一回合只变换一种颜色
	if(this.curCount == this.gameLayer.scene.curCount)
		return;
	this.curCount = this.gameLayer.scene.curCount;

	//重置数字3
	this.colorSpecialCount.setTexture(res.Special5_3_png);

	//从颜色集中随机取一种颜色
	var totalColor = {};
	for(var color in this.gameLayer.scene.curColores){
		totalColor[color] = true;
	}
	var totalColorsLen = getOwnProperyLength(totalColor);
	if(totalColorsLen > 0){
		for(var i = 1; i<=MAX_COLOR-1;i++){
			var nextColor = this.getColor() + i;
			if(nextColor >= MAX_COLOR){
				nextColor = (nextColor % MAX_COLOR) + 1;
			}
			if(totalColor[nextColor]){
				this.setColor(nextColor);
				return;
			}
		}
	}
}

// 找到周围是变色的球让他切换颜色
BubbleSprite.prototype.swapNearColor = function(excludeList){
	var vecRowCol = GetAround(this.getRow(), this.getCol());
	for(var i in vecRowCol){
		var rc = vecRowCol[i];
		//清除列表里不包含该元素时
		if(!RcKeyOf(excludeList, rc)){
			var pBubble = this.gameLayer.m_board[rc.m_nRow +"_"+ rc.m_nCol];
			if(pBubble && pBubble.getType() == BUBBLE_TYPE.color){
				pBubble.swapNextColor();
			}
		}
	}
}

// 清除周围的透明泡泡
BubbleSprite.prototype.clearAroundAlphaBubble = function(){
	var vecRowCol = GetAround(this.getRow(), this.getCol());
	for(var i in vecRowCol){
		var rc = vecRowCol[i];
		var pBubble = this.gameLayer.m_board[rc.m_nRow +"_"+ rc.m_nCol];
		if(pBubble && pBubble.getType() == BUBBLE_TYPE.alpha){
			this.clearMe(pBubble);
		}
	}
}

// 清除所有相连的旋转转轮
BubbleSprite.prototype.clearLinkWheel = function(){
	var samelist = {};
	var tempSameList = {};
	var nRow = this.getRow();
	var nCol = this.getCol();
}

// 清除同组中的泡泡
BubbleSprite.prototype.clearSameGroup = function(groupType){
	var clearRowColList = this.gameLayer.findSameBubble(this, function(findBubble){
		if(findBubble.getType() == groupType){
			return true;
		}
	});

	this.gameLayer.fallBubble(clearRowColList, (function(){
		if(this.gameLayer){
			this.gameLayer.checkGameOver();
		}
	}))
}

// 中心点显示被去掉最外层巧克力的效果
BubbleSprite.prototype.setHitCenterIce = function(){
	if(this.getChildByTag(100)){
		this.removeChildByTag(200);
		var animation = game.bulletManage.getAnimation("type_10_clear1","start");
		this.getChildByTag(100).runAction(cc.sequence(cc.animate(animation), cc.callFunc((function(){
			this.removeChildByTag(100);
		}).bind(this))));
	}
}

// 削除巧克力，周围显示同种颜色的球
BubbleSprite.prototype.clearIceAndSetAroundColor = function(){
	game.playMusic(MUSIC_CONFIG.save3ModelHit);

	var sameModel = createBubbleByColor(this.getColor(),true).getModel();

	var aroundList = this.gameLayer.findSameBubble(this, function(findBubble){
		if(findBubble.getType() == BUBBLE_TYPE.hitAlpha){
			return true;
		}
	}, (function(findBubble){
		if(findBubble.getModel().hitHold == 0){
			findBubble.setOpacity(255);
			findBubble.setModel(createBubbleByColor(this.getColor(),true).getModel());
		}
		else{
			findBubble.setHitCenterIce();
		}

	}).bind(this));

	this.setOpacity(255);
	this.setModel(createBubbleByColor(this.getColor(),true).getModel());
}

// 增加指定等待球数
BubbleSprite.prototype.addWaitBubble = function(num){
	//cc.log("addWaitBubble",this.gameLayer.scene.waitBubbleNum);
	num = num || 3;
	var curWaitNum = this.gameLayer.scene.waitBubbleNum + num;
	this.gameLayer.scene.updateBubbleNum(curWaitNum);
}

// 被困泡泡被解救效果
BubbleSprite.prototype.saveEffect = function(){
	// 解救模式下的占位泡泡要显示被困动物
	var holdAniImage = res[string.format("Saved%d_png", "%d", this.model.hold)];
	var posArr ={};
	posArr.p1 = {x : 65/2,y : 65/2 };
	posArr.p3 = {x : 35, y : 0 };
	posArr.p6 = {x : 35,y : 30};
	var tP = this.getPosition();
	var lP = cc.p(tP.x + posArr["p"+ this.model.hold].x, tP.y + posArr["p"+ this.model.hold].y);
	var wP = this.gameLayer.convertToWorldSpace(tP);
	var savedAni = uiFactory.createSprite(holdAniImage,wP.x, wP.y, 0.5, 0.5, this.gameLayer.scene, 3000);
	savedAni.runAction(cc.sequence(
		cc.scaleTo(0.2, 1.5, 1.5),
		cc.spawn(
			cc.moveTo(0.4,cc.p(display.width - OFFSET.x - 100 ,display.height - 50 )),
			cc.scaleTo(0.4, 0.8, 0.8)
		),
		cc.fadeOut(0.2)
	));
}

// 掉落 触发
BubbleSprite.prototype.fall = function(){
	//cc.log("Fall:",this.model.type,this.model.hold);
	this.clearMe();

	// 显示周围的未知泡泡
	showFogForRowCol(this.getRowCol(),this.gameLayer.m_board);

	if(this.model.type == BUBBLE_TYPE.normal)
		return;

	// 特殊球
	if(this.model.type == BUBBLE_TYPE.flash){
		// 闪电掉落要再检测一下是否有掉落，因为闪电消一行后可能会有新的掉落
		this.gameLayer.effectFlashWithClearOneRow(this.getRowCol(),false);
	}
	else if(this.model.type == BUBBLE_TYPE.bomb){
		this.gameLayer.effectBomb(this.getRowCol(),true);
	}
	else if(this.model.type == BUBBLE_TYPE.revolveWheel){
		delete this.gameLayer.revolveWheelList[this.getRow()+"_"+this.getCol()];
		delete this.gameLayer.moveBubbleRCList[this.getRow()+"_"+this.getCol()];
		//this.gameLayer.revolveWheelList[this.getRow()+"_"+this.getCol()]=null;
		//this.gameLayer.moveBubbleRCList[this.getRow()+"_"+this.getCol()]=null;

	}

}
// 清除 触发 excludeList不检查的队列
BubbleSprite.prototype.Clear = function(excludeList,delay){
    if (this.model.type != BUBBLE_TYPE.saveAlpha) {
        // 占位泡泡被清除时（被闪电，炸弹击中）不执行这一阶段，放在掉落阶段执行
        this.clearMe(null, null, null, delay);
        //cc.log("****clearMe");
    }
    // 如果是透明泡泡不参与检测
    if (this.model.type == BUBBLE_TYPE.alpha)return;

    // 显示周围的未知泡泡
    showFogForRowCol(this.getRowCol(),this.gameLayer.m_board);

    // 变色泡泡
    this.swapNearColor(excludeList || {});

    // 透明泡泡
    this.clearAroundAlphaBubble();

    // 普通泡泡
    if( this.model.type == BUBBLE_TYPE.normal )return;

    // 特殊球
	switch(this.model.type)
	{
		case BUBBLE_TYPE.flash:
			//cc.log("flash 一下");
			this.gameLayer.effectFlashWithClearOneRow(this.getRowCol(),true);
			break;
		case BUBBLE_TYPE.bomb:
			this.gameLayer.effectBomb(this.getRowCol(),true);
			break;
		case BUBBLE_TYPE.three:
			this.addWaitBubble();
			break;
		case BUBBLE_TYPE.saveAlpha:
			this.clearSameGroup(BUBBLE_TYPE.saveAlpha);
			break;
		case BUBBLE_TYPE.hitAlpha:
			// 解救模式3：消除巧克力显示同种颜色的球
			if(this.model.hitHold == 0)
				this.clearIceAndSetAroundColor();
			break;
		case BUBBLE_TYPE.save2Alpha: //解救模式2
			this.clearSameGroup(BUBBLE_TYPE.save2Alpha);
	}
}
// 清除自己
BubbleSprite.prototype.clearMe = function(bubble,noAni,clearHitHold,delay){
    // 先清除自己所在的坐标
    bubble = bubble || this;

	if(bubble.model.type == BUBBLE_TYPE.revolveWheel && ! this.clearWhenIsWheel){
		this.clearWhenIsWheel = true;
		// 清除所有相连的旋转转轮
		this.clearLinkWheel();
	}
    // 泡泡龙不能被清除只能掉落
    if(bubble.model.type == BUBBLE_TYPE.dragon)return;

    clearHitHold = clearHitHold || false;
    // 解救3（hit）模式下只有clearHitHold为true才会执行清除据点
    if(! clearHitHold && CURRENT_MODE == LEVEL_MODEL.save3 && bubble.model.type == BUBBLE_TYPE.hitAlpha &&
    bubble.model.hitHold > 0)
    {
        //cc.log("clearMe:",bubble.model.hitHold);
        return;
    }

    if(CURRENT_MODE != LEVEL_MODEL.wheel && CURRENT_MODE != LEVEL_MODEL.save3
        && bubble.getRow() >= 0 && bubble.getRow() < this.gameLayer.clearMinRow)
    {
	    // bubble:getRow()>0 是防止冰球row为-1
        this.gameLayer.clearMinRow = bubble.getRow();
        //cc.log("this.gameLayer.clearMinRow:",this.gameLayer.clearMinRow);
    }

    if(bubble.getModel().hold > 0)
    {
        bubble.saveEffect();
        var k = RcKeyOf(this.gameLayer.curHoldList,{ m_nRow : bubble.getRow(), m_nCol : bubble.getCol() });
        removeByIdx(this.gameLayer.curHoldList, k);
    }

    if(bubble.getModel().save2Hold > 0 )
    {
        //cc.log("解救模式2中掉落的效果");
	    var k = RcKeyOf(this.gameLayer.curHoldList,{ m_nRow : bubble.getRow(), m_nCol : bubble.getCol() });
	    //cc.log("k:",k);
	    removeByIdx(this.gameLayer.curHoldList, k);
    }

    var row = bubble.getRow();
    var col = bubble.getCol();
    if(this.gameLayer.m_board[ row + "_" + col ]) {
        delete this.gameLayer.m_board[ row + "_" + col ];
    }
    //  普通球消除、道具消除算连击
	this.gameLayer.curCheckFallFlag = true;
    if(bubble.model.type == BUBBLE_TYPE.normal)
    {
        this.gameLayer.scene.setDoubleHitVaild(bubble.getPosition());
    }
    else if(bubble.model.type == BUBBLE_TYPE.flash || bubble.model.type == BUBBLE_TYPE.bomb || bubble.model.type == BUBBLE_TYPE.three)
    {
        this.gameLayer.scene.setDoubleSpecialHitVaild(bubble.getPosition());
    }

    //深度调整成最高
    if(bubble.getParent())
    {
        bubble.getParent().reorderChild(bubble, 100 + bubble.model.type);
    }

    // 动画和粒子
    var aniId = bubble.getAniId();
    var animation = game.bulletManage.getAnimation(aniId,"over");
    var haveParticles = game.bulletManage.getParticles(aniId,"over");
	var ineffect2 = null;
	// 优先级：1.配置动画，2.缩放动画，3.无动画
    if(animation || haveParticles)
    {
	    if(animation){
		    ineffect2 = game.bulletManage.getIneffect(aniId,"over") == 2;
	    }
	    else{
		    ineffect2 = haveParticles.ineffect == 2;
	    }
	    bubble.playAni(BUB_ANI_PHASE.over, function(){
		    bubble.showAddScoreEffect();
		    bubble.removeFromParent();
	    }, delay);
	    //cc.log("bomb");
    }
    else if(!noAni)
    {
	    this.removeBubbleAction(bubble,function(){
		    bubble.showAddScoreEffect();
		    bubble.removeFromParent();
        });
    }
    else
    {
	    bubble.showAddScoreEffect();
	    bubble.removeFromParent();
    }
	//特效
    if(this.effectSp && this.effectSp.getChildByTag(this.effectTag))
    {
        this.effectSp.removeChildByTag(this.effectTag);
    }

    if(this.effectSp && this.colorSpecialCount)
    {
        this.colorSpecialCount.removeFromParent();
        this.colorSpecialCount = null;
    }
	// 移除特效层(如果Ineffect = 2 不移除)
    if(bubble.effectSp &&  !ineffect2){
        bubble.effectSp.removeFromParent();
        bubble.effectSp = null;
    }
}
BubbleSprite.prototype.playAni = function(phaseName, onCompleteCallback, delay){
	if(this.state == phaseName)return;
	if(phaseName == "progress" && this.state == "over")return;
	if(onCompleteCallback && typeof(onCompleteCallback) != "function"){
		//cc.log("completCallback is set to null!");
		onCompleteCallback=null;
	}

	//先清空粒子
	if(this.particle){
		this.particle.removeFromParent();
		this.particle = null;
	}

	var aniId = this.getAniId();
	//有音乐则播放
	var music = game.bulletManage.getMusic(aniId,phaseName);
	if( music != 0){
		game.playMusic(music);
	}

	var aniSp;
	var animation = game.bulletManage.getAnimation(aniId, phaseName);
	if(animation){
		var offset = game.bulletManage.getOffset(aniId,phaseName);
		var inEffect = game.bulletManage.getIneffect(aniId,phaseName);
		if(inEffect == 2){
			if(!this.effectSp){
				this.effectSp = new cc.Node();
				this.addChild(this.effectSp);
			}
			this.reorderChild(this.effectSp, game.bulletManage.getZorder(aniId,phaseName));
			aniSp = new cc.Sprite();
			aniSp.setPosition(offset);
			this.effectSp.addChild(aniSp);
		}
		else if(inEffect == 0){
			aniSp = this;
			aniSp.setPosition(cc.p(this.x+offset.x, this.y+offset.y));
			aniSp.removeAllChildren();
		}
		else{
			aniSp = new cc.Sprite();
			var lp = this.getPosition();
			var wp = this.gameLayer.convertToWorldSpace(lp)
			aniSp.setPosition(cc.p(wp.x + offset.x,wp.y + offset.y));
			this.gameLayer.scene.effectLayer.addChild(aniSp);
		}

		aniSp.setSpriteFrame(animation.getFrames()[0].getSpriteFrame());
		aniSp.stopAllActions();

		if(game.bulletManage.getLoop(aniId,phaseName) == 1){
			aniSp.runAction(cc.repeatForever(cc.animate(animation)));
		}
		else {
			// 有延时执行时直接替换球原先的图（被冰淇淋打中效果）
			if(delay){
				performWithDelay(this, (function(){
					this.initWithFile(res.ALPHA_PNG);
				}).bind(this), delay);
			}
			if(onCompleteCallback)
				aniSp.runAction(cc.sequence(cc.animate(animation), cc.callFunc(function(){aniSp.removeFromParent();onCompleteCallback();})));
			else
				aniSp.runAction(cc.sequence(cc.animate(animation), cc.callFunc(function(){aniSp.removeFromParent();})));
		}

		if(game.bulletManage.getAngle(aniId, phaseName) == 1){
			if(!this.frameUpdate){
				this.frameUpdate = function(dt){
					var angle = Math.atan2(this.gameLayer.real.y, this.gameLayer.real.x);
					aniSp.setRotation(90-angle*180/PI);
				};
			}
			switch (phaseName)
			{
				case "progress":
					this.schedule(this.frameUpdate);
				case "over":
					this.unschedule(this.frameUpdate);
			}
		}
	}
	else if (game.bulletManage.getParticles(aniId,phaseName)){
		// 有粒子效果则生成
		var particleData = game.bulletManage.getParticles(aniId,phaseName);
		var offset = particleData.offset || cc.p(0,0);
		if(particleData.ineffect == 2){
			this.effectSp.retain();
			this.effectSp.removeFromParent();
			this.addChild(this.effectSp,Number(particleData.zorder));
			aniSp = new cc.Sprite();
			aniSp.attr({x:offset.x,y:offset.y});
			this.effectSp.addChild(aniSp);
		}
		else if(particleData.ineffect == 0){
			aniSp = this;
			if(phaseName == BUB_ANI_PHASE.over){
				aniSp.initWithFile(res.ALPHA_PNG);
			}
			aniSp.attr({x:this.x+offset.x,y:this.y+offset.y});
		}
		else{
			aniSp = new cc.Sprite();
			this.gameLayer.scene.effectLayer.addChild(aniSp);
			var lp = this.getPosition();
			var wp = this.gameLayer.convertToWorldSpace(lp);
			aniSp.attr({x:wp.x + offset.x,y:wp.y + offset.y});
		}
		aniSp.stopAllActions();
		this.particle = new cc.ParticleSystem(particleData.res);
		this.particle.setPosition(cc.p(0,0));
		this.particle.setPositionType(particleData.particlePositionType || cc.POSITION_TYPE_RELATIVE);
		aniSp.addChild(this.particle);
		if(phaseName == BUB_ANI_PHASE.over){
			performWithDelay(this, (function(){
				this.particle.removeFromParent();
				this.removeFromParent();
			}).bind(this), 0.4);
		}
	}
	this.state = phaseName;
}

/**
 * Desc: 移除粒子的动画
 * @param pBubble
 * @param callback
 */
BubbleSprite.prototype.removeBubbleAction = function(pBubble, callback){
	callback = callback || (function(){});
	var action = cc.sequence(
		cc.delayTime(0.2),
		cc.scaleTo(0.2,1.1,1.1),
		cc.callFunc(callback)
	);
	pBubble.runAction(action);
}
/**
 * Desc: 泡泡爆炸
 */
BubbleSprite.prototype.bomb = function(bubble){
	var bomb = cc.Animation.create();
	for (var i = 1; i <= 10; i++){
		bomb.addSpriteFrameWithFile(res["BOMB_0"+i]);
	}
	bomb.setDelayPerUnit(0.017);
	bubble.sp = new cc.Sprite();
	bubble.gameLayer.addChild(this.sp);
	bubble.sp.attr({x:this.getPositionX(), y:this.getPositionY()});
	bubble.setVisible(false);
	bubble.sp.runAction(cc.sequence(cc.animate(bomb), cc.callFunc(function() {
		bubble.sp.removeFromParent();
		bubble.removeFromParent();
	})));
}
/**
 * Desc: 只有普通泡泡显示加分
 */
BubbleSprite.prototype.showAddScoreEffect = function(){
	//不更新分数的情况
    if((this.model.type != BUBBLE_TYPE.normal && this.model.type != BUBBLE_TYPE.fog
	    && this.model.type != BUBBLE_TYPE.color) || this.getItemId() != 0)
        return;
    var curSocre = this.getScore();
    if (curSocre == 0) return;

	//更新分数
    game.refreshScore(curSocre * this.gameLayer.scene.doubleHitCount);
    var scoreLabel = new cc.LabelBMFont(curSocre * this.gameLayer.scene.doubleHitCount,res.NUM_FONT2);
    scoreLabel.setRotation(5);
    scoreLabel.setScale(0.7);
	this.gameLayer.scene.effectLayer.addChild(scoreLabel, 200);
    var lp = this.getPosition();
    var wp = this.gameLayer.convertToWorldSpace(lp);
    scoreLabel.setPosition(wp);

    scoreLabel.runAction(
	    cc.sequence(
	        cc.spawn(
		        cc.sequence(
			        cc.scaleTo(0.1, 0.95, 0.95),
					cc.scaleTo(0.1, 0.78, 0.78),
					cc.scaleTo(0.1, 0.8, 0.8)
		        ),
		        cc.moveBy(0.3,cc.p(0,10)),
				cc.fadeIn(0.3)
	        ),
	        cc.moveBy(0.3,cc.p(0,10)),
	        cc.spawn(
		        cc.moveBy(0.15,cc.p(0,5)),
				cc.sequence(
					cc.scaleTo(0.1, 0.75, 0.75),
					cc.scaleTo(0.1, 1, 1)
				)
	        ),
	        cc.callFunc(function(){
		        if(scoreLabel)
			        scoreLabel.removeFromParent();
	        })
        )
    );

}


//-- 显示魔法泡泡消失特殊
BubbleSprite.prototype.showMagicEffect=function() {
	this.clearMe();
}



