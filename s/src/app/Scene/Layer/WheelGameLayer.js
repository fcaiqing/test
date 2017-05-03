/* global this */
/**
 * Created by beyondray on 2015/9/15.
 * Desc: 旋转模式层
 */

var WheelGameLayer = GameLayer.extend({
	//借用父类构造函数
	initData:function(params){
		this.scene = params.scene;
		this.jsonObj = params.jsonObj || {};
		this.offset = params.offset || cc.p(0,0);
		this.level = params.level;
		this.size = display.size;
		this.curTotalColores = {};  // 记录当前所有球的颜色
		this.effectLayer = new cc.Layer();
		this.addChild(this.effectLayer);

		this.curCheckFallFlag = false; // 当前回合是否检测掉落（有消除事件才检查）
		this.m_board = {};      // 当前图上所有的球 // pairs
		this.revolveWheelList = {}; //整个面板的所有旋转滚轮
		this.moveBubbleRCList = {}; // 每圈球对应的RC数组(共X圈）
		this._centerRC = { m_nRow : 0, m_nCol : 0 };

		this._centerPointOffset = cc.p(0,0);
		this._rorateDegeree = 0;

		this.centerPp = null;    // 旋转点所在的球
		this.level = this.jsonObj.level;
		this.graph = this.jsonObj.level.graph;
		// 重载当前关卡的最大行列数(暂时未用)
		MAX_ROWS = Number(this.jsonObj.level.maxRow)+6;
		MAX_COLS = Number(this.jsonObj.level.maxCol)+6;
		MAX_RANDOM = Number(this.jsonObj.level.maxRandomColors);
		CUR_RANDOM = randomInt(1,4) //这里最大值为4，保证4+6（maxColor)%6(matColor) + 1 = 5(小于6maxColor)

		this._centerRC.m_nRow = Number(this.level.graphPivot.row);
		this._centerRC.m_nCol = Number(this.level.graphPivot.col);

		this.updateBubble = false;
        this.iceItemEnd=false;
		this.batchNode=new cc.SpriteBatchNode(res.BubblePics);
		this.initBoard();
	},
	initUI:function(){
		//this._super();
		this.calOffsetXY();
		//记录中心旋转点
		var centerRow = this.level.graphPivot.row;
		var centerCol = this.level.graphPivot.col;
		this.centerPp = this.m_board[ centerRow +"_"+ centerCol ];
		this.centerPp.setVisible(false);

		//缓存精灵的另外两个表情
		this.hurtFrame = new cc.Sprite(res.Special88_2_png);
		this.happyFrame = new cc.Sprite(res.Special88_3_png);
		this.normalFrame = new cc.Sprite(res.Special88_png);

		var x = this.centerPp.x;
		var y = this.centerPp.y;
		this.setPosition(this.offset);
		this.setAnchorPoint(cc.p(x/display.width, y/display.height));
		this.ignoreAnchor = false;
		this.centerGhost = new cc.Sprite(res.Special88_png);
		this.centerGhost.setPosition(this.convertToWorldSpace(this.centerPp.getPosition()));
		this.scene.addChild(this.centerGhost, 100);

		//发射球移动层
		this.createMoveLayer();

	},
	createMoveLayer:function(){
		this.scene.moveLayer = new cc.Layer();
		this.scene.addChild(this.scene.moveLayer);
		this.scene.moveLayer.scene = this.scene;
		this.scene.moveLayer.moveBubbleAndStick = (function(dt){
			if(!this.m_curReady)return;

			//左右边界碰撞修订的移动
			this.iceBubbleHitTwo = this.iceBubbleHitTwo || 0;
			MoveBubbleThinkBorder(this.m_curReady, BUBBLE_SPEED/2/60, this.real, dt);

            var collInfo= isCollisionWithBorder(this.m_curReady);

            var collisionFlag=collInfo.isCollision;
            var dir =collInfo.dir;

            if(collisionFlag) {
                game.playMusic(PRE_LOAD_MUSIC.hitwall);

                if (this.m_curReady.getItemId() == ITEM_ID.ice) {
                    this.iceBubbleHitTwo = this.iceBubbleHitTwo + 1;
                }
            }

			//检测与上下边界的碰撞
			if(isCollisionWithTopBorder(this.m_curReady)){
				if(this.m_curReady.getItemId() == ITEM_ID.ice){
                    this.iceBubbleHitTwo=2;
                    this.real.x=0;
                    this.real.y=0;
				}
				else{
					ColliWithTopBorder(this.m_curReady, this.real);
				}
			}
			else if(isCollisionWithBottomBorder(this.m_curReady)){
				this.m_curReady.removeFromParent();
				this.m_curReady = null;
				this.scene.setState();              //游戏状态改变
				this.scene.touchLayer.setEnable();   //激活点击发射
				this.checkGameOver();
				return;
			}

			//黏上
			this.stickAGrid(dt);
		}).bind(this);
	},
	/**
	 * Desc:设定当前发射球
	 * @param curReady
	 */
	setCurReady: function(curReady){
		    var model = curReady.getModel();
    	model.setSpriteFrameWithColor(model.color);
		var lPos = this.scene.moveLayer.convertToNodeSpace(curReady.getPosition());

		//var filename=curReady.getModel().returnSpriteFrameName();
		this.m_curReady = new BubbleSprite(curReady.getModel());
		this.m_curReady.attr({x:lPos.x,y:lPos.y});
		this.m_curReady.setGameLayer(this.scene.moveLayer);
		this.scene.moveLayer.addChild(this.m_curReady,SHOT_BUBBLE_DEP);
		//this.m_curReady.playProgressAni()
	},
	GameUpdate:function(dt){
		this.bubbleUpdate(dt);
	},
	centerRotate:function(){
		var addDegree = ROUND_ATTENUATION * this._rorateDegeree;
		var limitDegree = 4;

		//旋转值一直向0靠近，在限制区内时直接等于0不旋转
		if(this._rorateDegeree != 0){
			if(Math.abs(this._rorateDegeree) < limitDegree)
				this._rorateDegeree = 0;
			else
			{
				this.setRotation( this.getRotation() + addDegree);
				this._rorateDegeree -= addDegree;

			}
		}
	},
	computeRotateDegree:function(x, y, real){
		if(!ValueEqual(real, cc.p(0,0))){
			this._rorateDegeree = this.area( this.centerPp.x, this.centerPp.y, x, y, x+this.real.x, y+this.real.y );
			var absDegree = Math.abs(this._rorateDegeree);
			if(absDegree > ROUND_MAX_SPEED){
				this._rorateDegeree = this._rorateDegeree/absDegree*ROUND_MAX_SPEED;
				game.playMusic(MUSIC_CONFIG.wheelBig);
			}
			else{
				game.playMusic(MUSIC_CONFIG.wheelSmall);
			}

		}
	},
	bubbleUpdate:function(dt){
		//中心轴的旋转
		this.centerRotate();

		//泡泡的移动粘黏和消除
		if(this.updateBubble)
			this.scene.moveLayer.moveBubbleAndStick(dt);
		this.checkVoidBubble();
	},
	stickAGrid:function(delta){
		// 如果是冰球出了屏幕顶部或碰边两次则消除
		if(this.m_curReady.getItemId() == ITEM_ID.ice &&this.iceBubbleHitTwo == 2&&!this.iceItemEnd){
            this.real = cc.p(0,0);
            this.m_curReady.setGameLayer(this);
            game.playMusic(MUSIC_CONFIG.iceItemEnd);
            this.iceItemEnd=true;
            this.m_curReady.Clear();
            //self.playScene.curMoveBubble = nil
            //-- TODO 这里要加上冰球消失的特效

            //print("这里要加上冰球消失的特效")

            //--掉落检测
            var fallList = this.findNonLinkedBubble();
            this.fallBubble(fallList);
            //-- 每回合结束后每个球触发
            checkWhenOneAfter(this);
            this.scene.checkDoubleHit();

            this.scene.checkWaitAndReadColorVaild(this.currentTotalColores().curTotalColores);

			this.scene.setState();
            //-- 激活点击发射
            this.scene.setEnable();
            this.checkGameOver();

            return;
		}

		var curReadyPos = this.convertToNodeSpace(this.m_curReady.getPosition());
		var realEnd = this.convertToNodeSpace(this.real);
		var realBeg = this.convertToNodeSpace(cc.p(0,0));
		var real = cc.p(realEnd.x - realBeg.x, realEnd.y - realBeg.y);


		var colliInfo = null;

        if(this.m_curReady.getItemId() == ITEM_ID.ice) {
            colliInfo= checkCollision(this.m_board, curReadyPos, real, BUBBLE_SPEED,delta,true);
        }else{
            colliInfo= checkCollision(this.m_board, curReadyPos, real, BUBBLE_SPEED,delta);
        }

        var rc = colliInfo.colliRc;
		var hitRc=colliInfo.hitRc;

		//未碰撞！！！
		if(rc == null)
			return false;

		//冰球特殊处理
		if(this.m_curReady.getItemId() == ITEM_ID.ice){
			var hitBubble = this.m_board[ hitRc.m_nRow +"_"+ hitRc.m_nCol];
			if(hitBubble){
				hitBubble.hit(rc, this.m_curReady.getModel());
			}
            return;
		}

		var finalX = this.m_curReady.x;
		var finalY = this.m_curReady.y;

		var bubble = new BubbleSprite(this.m_curReady.getModel());
		var adjustPos = getPosByRowAndCol(rc.m_nRow, rc.m_nCol);
		bubble.setRowColIndex(rc.m_nRow, rc.m_nCol);
		bubble.setGameLayer(this);
		bubble.setPosition(adjustPos);
		bubble.initAroundList();
		this.addChild(bubble, BUBBLE_DEPTH[bubble.model.type]);
		this.m_board[ rc.m_nRow +"_"+ rc.m_nCol ] = bubble;
		this.m_curReady.removeFromParent();
		this.m_curReady = bubble;

		//计算旋转角度
		this.computeRotateDegree(finalX, finalY, this.real);

		//被打到的球周围一层抖动
		var tempList = [];
		tempList.push(rc);
		GetAroundInCludeVaild(rc.m_nRow, rc.m_nCol, tempList);
		crowdEffect(this.m_board, tempList, this.real.x, this.real.y, 10, 0, rc);
		//被达到球周围二层抖动
		var tempList2 = [];
		findAGroundInList(this.m_board, tempList, tempList2);
		crowdEffect(this.m_board, tempList2, this.real.x, this.real.y, 6, 1, rc);

		var curShotBubbleModel = this.m_curReady.getModel();

		// 清除同色泡泡（这步按理不会触发特殊球）
		if (this.execClearBubble(this.m_curReady))
			this.curCheckFallFlag = true;
		else
			game.playMusic(PRE_LOAD_MUSIC.whenHitNoClear);

		// 特殊球碰到触发检测（在解救模式2 时需要知道发射球的颜色）
		checkSpecialHit(rc, this.m_board, curShotBubbleModel);

		//=================【掉落和回合过度处理】====================
		this.setUpdateBubble(false);        //bubbleUpdate()不更新了

		//结束处理
		var endDealWith = (function(faceFrame){
			//由于清除转轮产生的新的掉落
			var fallList = this.checkFallBubble();
			this.fallBubble(fallList);
			moveRevolveWheel(this.revolveWheelList, this.m_board, (function(){
				performWithDelay(this, (function(){
					//由于转轮移动产生的新的掉落
					var fallList = this.checkFallBubble();
					this.fallBubble(fallList);
					this.playCenterGhostFaceAni(faceFrame);
					this.boutEndTrigger();
				}).bind(this), 0.2)	;
			}).bind(this), this.moveBubbleRCList);
		}).bind(this);

		//掉落检测
		if (this.curCheckFallFlag) {
			//延迟表现掉落
			var fallList = this.checkFallBubble();
			this.fallBubble(fallList, endDealWith(this.happyFrame));
		}
		else{
			endDealWith(this.hurtFrame);
		}

	},

    findNonLinkedBubble:function() {
        var LinkBubbleList = [];
        var NoLinkBubblelist = []; //-- ipairs
        var existLinkList = {};

        var center = this._centerRC;
        existLinkList[center.m_nRow + "_" + center.m_nCol] = true;
        LinkBubbleList.push(center);

        var index = 0;
        do {
            var itCur = LinkBubbleList[index];
            var vecRowCol = [];
            vecRowCol = GetAround(itCur.m_nRow, itCur.m_nCol);
            for (var i = 0; i < vecRowCol.length; i++) {
                var rc = vecRowCol[i];
                var pBubble = this.m_board[rc.m_nRow + "_" + rc.m_nCol];
                if (pBubble && !existLinkList[rc.m_nRow + "_" + rc.m_nCol]) {
                    var pos = {m_nRow: rc.m_nRow, m_nCol: rc.m_nCol };
                    LinkBubbleList.push(pos);
                    existLinkList[rc.m_nRow + "_" + rc.m_nCol] = true;
                }
            }

            index = index + 1;

        } while (index < LinkBubbleList.length);

        for (var rowCol in this.m_board) {
            var bubble = this.m_board[rowCol];
            var findRowCol = { m_nRow: bubble.getRow(), m_nCol: bubble.getCol() };
            if (!existLinkList[findRowCol.m_nRow + "_" + findRowCol.m_nCol]) {
                NoLinkBubblelist.push(findRowCol);
            }
        }

        //-- 有掉落球则显示缸的分数
        //if (NoLinkBubblelist.length > 0) {
           // this.scene.showCrockScore();
        //}

        return NoLinkBubblelist;

    },

	/**
	 * Desc: 有向面积
	 * 如果area>0，则说明ABC三点呈现顺时针排列；
	 * 如果area=0，则ABC三点共线；
	 * 如果area<0，则说明ABC三点呈现逆时针排列。
	 * @param x0
	 * @param y0
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 */
	area: function(x0,y0,x1,y1,x2,y2){
		return -(x0*y1+y0*x2+x1*y2-x2*y1-x0*y2-x1*y0);
	},
	//检测超出屏幕的无效球
	checkVoidBubble:function(){
		var removeBorderBubble = (function(bubble){
			this.changeBubbleToPhysicWorld(bubble);
			delete this.m_board[bubble.getRow()+"_"+bubble.getCol()];
			bubble.removeFromParent();
		}).bind(this);
		for(var i in this.m_board){
			var bubble = this.m_board[i];
			if(!bubble){
				continue;
			}
			var wp = this.convertToWorldSpace(bubble.getPosition());
			if(isCollisionWithTopBorder(wp) || isCollisionWithBottomBorder(wp)){
				removeBorderBubble(bubble);
			}
			else{
				var colliInfo = isCollisionWithBorder(wp);
				if(colliInfo.isCollision){
					removeBorderBubble(bubble);
				}
			}
		}
	},
	checkFallBubble:function(){
		var LinkBubbleList = [];    //[{ m_nRow = ?, m_nCol = ? },...]
		var NoLinkBubblelist = [];  //[{ m_nRow = ?, m_nCol = ? },...]
		var existLinkList = {};     //{ [Row_Col] = true, ...}

		var center = this._centerRC;
		LinkBubbleList.push(center);
		existLinkList[center.m_nRow+"_"+center.m_nCol]=true;

		var index = 0;
		while(index < LinkBubbleList.length){
			var itCur = LinkBubbleList[index];
			var vecRowCol = this.m_board[itCur.m_nRow +"_"+ itCur.m_nCol].aroundList;

			for(var key in vecRowCol){
				var rc = vecRowCol[key];
				var pBubble = this.m_board[rc.m_nRow +"_"+ rc.m_nCol];
				if(pBubble && !existLinkList[rc.m_nRow+"_"+ rc.m_nCol]){
					LinkBubbleList.push(rc);
					existLinkList[rc.m_nRow+"_"+ rc.m_nCol] = true;
				}
			}
			index++;
		}

		for(var i in this.m_board){
			var bubble = this.m_board[i];
			var findRowCol = { m_nRow : bubble.getRow(), m_nCol : bubble.getCol() };
			if(!existLinkList[findRowCol.m_nRow +"_"+ findRowCol.m_nCol])
				NoLinkBubblelist.push(findRowCol);
		}

		return NoLinkBubblelist;
	},
	playCenterGhostFaceAni:function(frame){
		this.centerGhost.stopAllActions();
		this.centerGhost.setTexture(frame.getTexture());
		this.centerGhost.runAction(cc.sequence(
			cc.delayTime(1.5),
			cc.callFunc((function(){
				this.centerGhost.setTexture(this.normalFrame.getTexture());
			}).bind(this))
		))
	},
	checkGameOver:function(){
		var vecRowCol = GetAround(this._centerRC.m_nRow, this._centerRC.m_nCol);
		for(var i in vecRowCol){
			var rc = vecRowCol[i];
			if(this.m_board[rc.m_nRow+"_"+rc.m_nCol]){
				this.scene.topLayer.updateGameProgress(0 +"/"+ 1);
				if(this.scene.waitBubbleNum == 0)
					this.scene.gameOver();
				return;
			}
		}

		this.scene.gameOver({result : 1});
	},
	playEndGhostAni:function(callback){
		// 解救精灵的动画
		this.ghostSp = this.scene.uiLayer.createSavedGhost(this.centerGhost.getPosition());
		this.centerGhost.removeFromParent();
		//var starParticle = new cc.ParticleSystem(res.SaveGhost_plist);
		//starParticle.setPosition(this.centerPp.getPosition());
		//this.scene.addChild(starParticle, 102);

		this.ghostSp.runAction(new cc.Sequence(
			new cc.Spawn(
				new cc.RotateBy(0.6, 360),
				new cc.ScaleTo(0.6, 1.5)
			),
			new cc.DelayTime(1),
			new cc.Spawn(
				new cc.MoveTo(0.4,cc.p(display.width - OFFSET.x- 100 ,display.height - 50 )),
				new cc.ScaleTo(0.4, 0.8, 0.8)
			),
			new cc.CallFunc((function(){
					//starParticle.removeFromParent();
					this.ghostSp.removeFromParent();
					this.scene.topLayer.updateGameProgress(1 +"/"+ 1)
					if(callback){
                        callback();
                    }
				}).bind(this)
			)
		));
	},
	// 执行炸弹泡泡 isIcoCream:表示被冰淇淋泡泡打中，显示相应的消失效果
	effectBomb : function(hitRC,noFall,isIcoCream) {
		var localPos = getPosByRowAndCol(hitRC.m_nRow, hitRC.m_nCol);
		var worldPos = this.convertToWorldSpace(localPos);
		var clearBubbleList = clearAroundByRC(hitRC, this.m_board,this._centerRC);
		// 延时执行清除球的图片
		this.clearBubble(clearBubbleList, isIcoCream && "itemId_5_normal" || null, 0.3);

		//执行掉落
		if (!noFall) {
			var fallList = this.checkFallBubble();
			this.fallBubble(fallList);
		}
	},

	getPosByRowAndCol:function(row, col) {
		var diffx = this._centerPointOffset.x;
		var	diffy = this._centerPointOffset.y;
		var	posX, posY, size;
		size = display.size;
		posX = col * 2 * BUBBLE_RADIUS + BUBBLE_RADIUS + (row % 2) * BUBBLE_RADIUS + diffx;
		posY = size.height - ( row * 2 * BUBBLE_RADIUS * Math.sin(PI / 3) + BUBBLE_RADIUS ) + diffy;
		return cc.p(posX, posY);
	},

	calOffsetXY:function() {
		var	origin = cc.director.getVisibleOrigin();
		var	visibleSize = cc.director.getWinSize();
		var	width = visibleSize.width - origin.x;
		var	height = visibleSize.height - origin.y;
		this._centerPoint = cc.p(this.size.width / 2, this.size.height / 2);
		var	centerPpPos = this.getPosByRowAndCol(this._centerRC.m_nRow, this._centerRC.m_nCol);
		this._centerPointOffset.x = OFFSET.x;
		this._centerPointOffset.y = display.cy - centerPpPos.y;
	}


});

