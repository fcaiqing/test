/**
 * Created by beyondray on 2015/7/23.
 * Desc: 游戏主要玩法
 */
var GameLayer = cc.Layer.extend({
	super:function(){
		this._super().call(this);
	},
    ctor:function(params){
        this._super();
	    this.batchNode=new cc.SpriteBatchNode(res.BubblePics);

        //初始化数据
        this.initData(params);
        this.initUI();
    },
	setUpdateBubble:function(bValue) {
		this.updateBubble = bValue;
	},
    GameUpdate:function(dt){
        if(this.updateBubble)
            this.bubbleUpdate(dt);
    },
	bubbleUpdate : function(delta) {
		//cc.log("bubbleUpdate call");
		// 这里用修正会引起左边有半径大小的间隔时可以穿过问题(改过要测试)
		this.iceBubbleHitTwo = this.iceBubbleHitTwo || 0;

        var collInfo= isCollisionWithBorder(this.m_curReady);

        var collisionFlag=collInfo.isCollision;
        var dir =collInfo.dir;

        if(collisionFlag) {
            game.playMusic(PRE_LOAD_MUSIC.hitwall);

            if (this.m_curReady.getItemId() == ITEM_ID.ice) {
                this.iceBubbleHitTwo = this.iceBubbleHitTwo + 1;
            }

            if (dir == "left") {
                //-- 碰到边时要先修正位置，防止抖动
                var offx = LEFT_CHECK_LIMIT - this.m_curReady.getPositionX();
                var offy = (offx * this.real.y) / this.real.x;
                this.m_curReady.setPosition(LEFT_CHECK_LIMIT, this.m_curReady.getPositionY() + offy);
            }else {
                var limitX = RIGHT_CHECK_LIMIT;
                var offx = this.m_curReady.getPositionX() - limitX;
                var offy = (offx * this.real.y) / this.real.x;
                this.m_curReady.setPosition(limitX, this.m_curReady.getPositionY() - offy);
            }
            this.real.x = -this.real.x;
        }

		//发射泡泡前进
		//MoveBubbleThinkBorder(this.m_curReady, BUBBLE_SPEED, this.real, delta);
		var pos = cc.p(this.m_curReady.getPositionX(),this.m_curReady.getPositionY());
		this.m_curReady.setPosition(pos.x + this.real.x * BUBBLE_SPEED/2/60, pos.y + this.real.y * BUBBLE_SPEED/2/60);


		// 如果是冰球出了屏幕顶部或碰边两次则消除
		if(this.m_curReady.getItemId() == ITEM_ID.ice &&
		 ((this.m_curReady.getPositionY() + this.getPositionY()) > (display.height - TOP_RECT.height)
		 || this.iceBubbleHitTwo == 2 ))
		 {
             this.real = cc.p(0,0);
             game.playMusic(MUSIC_CONFIG.iceItemEnd);
             this.m_curReady.Clear();

             //-- TODO 加冰球消失特殊
             //-- game:playMusic(MUSIC_CONFIG.iceItemEnd)
             //--掉落检测
             var fallList = this.checkFallBubble();
             this.fallBubble(fallList,function() {
                 this.adjustLayerPos();
                 this.scene.setState();
                 //-- 每回合结束后每个球触发
                 checkWhenOneAfter(this);
                 this.scene.checkDoubleHit();
                 this.scene.checkWaitAndReadColorVaild(this.currentTotalColores().curTotalColores);
                 this.checkGameOver();
             }.bind(this));
             this.setUpdateBubble(false);
             this.canScheduler = false;
             //-- 激活点击发射
             this.scene.setEnable();

             //cc.log("******gamelayer touch enable");
             return;
		 }

		//碰撞检测
		var colliInfo;
        if(this.m_curReady.getItemId() == ITEM_ID.ice) {
            colliInfo= checkCollision(this.m_board, this.m_curReady, this.real, BUBBLE_SPEED, delta,true);

        }else{
            colliInfo=checkCollision(this.m_board, this.m_curReady, this.real, BUBBLE_SPEED, delta);

        }

		var rc = colliInfo.colliRc;
		var hitRc=colliInfo.hitRc;
		//碰撞了！！！
		if (rc != null) {

			// 碰到冰球特殊处理
			if (this.m_curReady.getItemId() == ITEM_ID.ice) {
                var hitBubble = this.m_board[ hitRc.m_nRow +"_"+ hitRc.m_nCol];
                if(hitBubble) {

                    //cc.log("***********in ice effect ****!!!!*****!!!!")
                    hitBubble.hit(rc, clone(this.m_curReady.getModel()));
                }
			}
			else {
				// 让发射球加到面板上
				this.adjustBubblePosition(rc);
				//被打到的球周围一层抖动
				var tempList = [];
				tempList.push(rc);
				GetAroundInCludeVaild(rc.m_nRow, rc.m_nCol, tempList);
				crowdEffect(this.m_board, tempList, this.real.x, this.real.y, 10, 0, rc);
				//被达到球周围二层抖动
				var tempList2 = [];
				findAGroundInList(this.m_board, tempList, tempList2);
				crowdEffect(this.m_board, tempList2, this.real.x, this.real.y, 6, 1, rc);

				// 保存发射的球的颜色，因为发射球可能被清除（在解救模式2 时需要知道发射球的颜色）
				var curShotBubbleModel = this.m_curReady.getModel();

				// 清除同色泡泡（这步按理不会触发特殊球）
				if (this.execClearBubble(this.m_curReady)) {
					//cc.log("++++++++ execClearBubble");
					this.curCheckFallFlag = true;
				}else
					game.playMusic(PRE_LOAD_MUSIC.whenHitNoClear);

				// 特殊球碰到触发检测
				checkSpecialHit(rc, this.m_board, curShotBubbleModel);

				//=================【掉落和回合过度处理】====================
				this.setUpdateBubble(false);        //bubbleUpdate()不更新了

                //结束处理
                var endDealWith = (function(){
                    //由于清除转轮产生的新的掉落
                    var fallList = this.save3Flag?this.checkSave3FallBubble():this.checkFallBubble();
                    this.fallBubble(fallList);
                    moveRevolveWheel(this.revolveWheelList, this.m_board, (function(){
                        performWithDelay(this, (function(){
                            //由于转轮移动产生的新的掉落
                            var fallList = this.save3Flag?this.checkSave3FallBubble():this.checkFallBubble();
                            this.fallBubble(fallList);
                            this.boutEndTrigger();
                        }).bind(this), 0.2)	;
                    }).bind(this), this.moveBubbleRCList);
                }).bind(this);

				//掉落检测
				if (this.curCheckFallFlag) {
					//延迟表现掉落
					var callback = (function() {
						var fallList = this.save3Flag?this.checkSave3FallBubble():this.checkFallBubble();
						this.fallBubble(fallList, endDealWith);
					}).bind(this);
					 performWithDelay(this, callback, this.fallDelay);
				}
				else
				{
					endDealWith();
				}
			}
		}

	}

});
//===========================================【初始化相关Begin】================================================
/**
 * Desc: 初始化数据
 * @param params
 */
GameLayer.prototype.initData = function(params){
    this.scene = params.scene;
    this.jsonObj = params.jsonObj || {};
    this.level = params.level;
    this.graph = this.jsonObj.level.graph;
	this.save3Flag = params.save3Flag;
    this.clearMinRow = 0;       // 当前消除的最上面即最小行数
    this.curMaxRow = 0;         // 当前最大行数
	this.curTotalColores = {};  // 记录当前所有球的颜色
    this.m_board = {};          // 整个面板所有能放的泡泡 // pairs
	this.revolveWheelList = {}; //整个面板的所有旋转滚轮
	this.moveBubbleRCList = {}; // 每圈球对应的RC数组(共X圈）
    this.m_curReady = null;    // 当前正要发射的泡泡
    this.real = cc.p(0, 0);   // 移动单位向量
	this.clearedAniList = [];   // 顶端已清除的动画
	this.curCheckFallFlag = false;  // 是否检测掉落泡泡
	this.curHoldList = [];        // 当前被困动物中心点
	this.fallDelay = 0.2;

    // 重载当前关卡的最大行列数(暂时未用)
    MAX_ROWS = Number(this.jsonObj.level.maxRow);
    MAX_COLS = Number(this.jsonObj.level.maxCol);
    MAX_RANDOM = Number(this.jsonObj.level.maxRandomColors);
    RANDOM_OFFSET = randomInt(1,4);    //这里最大值为4，保证4+6（maxColor)%6(matColor) + 1 = 5(小于6maxColor)
    ROW_HEIGHT = 2 * BUBBLE_RADIUS * Math.sin(PI/3); // 实际行高

    this.updateBubble = false;
    this.initBoard();

    //=================【未使用】===================
    this.m_dRadian  = 0;          // 范围为30度到150;默认为90度， 竖直方向
    this.m_nRotation  = 0;        // 发射器角度改变方向，也是玩的反弹角度

    this.m_nScore  = 0;         // 游戏所得到的分数

    this.m_nGoldenBubbleCount = 0; // 特殊球金球
    this.m_nSliveryBubbleCount = 0; // 特殊球银球
};
/**
 * Desc: 初始化UI
 */
GameLayer.prototype.initUI = function(){
    // 表示顶端的线
    var initX = (display.width - 3*237)/2;
    for(var i = 0;i <= 3;i++)
    {
        var topLineSp = new cc.Sprite(res.TOP_LINE_png);
        topLineSp.attr({
            x: initX + i*237,
            y: display.height - TOP_RECT.height+10
            //anchorX: 0,
            // anchorY: 0.5
        });
        this.addChild(topLineSp);
    }
};
/**
 * Desc: 初始化泡泡球的面板
 */
GameLayer.prototype.initBoard = function(){
	//this.addChild(this.batchNode,1);
	//【初始化每个泡泡球的数据】
    for(var i=0;i < this.graph.length;i++)
    {
        var bubbleData = this.graph[i];
        // 偏移创建则可以保证颜色多样性
	    bubbleData.color = offsetCreateColor(bubbleData.color, RANDOM_OFFSET, MAX_COLOR);
        var bubble = new BubbleSprite(new BubbleBasic(bubbleData));
	    //this.colorBatchNodes[bubble.getColor()].addChild(bubble);
	    //注意：BUBBLE_DEPTH[bubble.model.type], TODO

	    this.addChild(bubble, BUBBLE_DEPTH[bubble.model.type]);

	    //this.batchNode.addChild(bubble, BUBBLE_DEPTH[bubble.model.type]);

	    bubble.initAroundList();
	    bubble.setGameLayer(this);
	    this.m_board[bubbleData.row + "_" + bubbleData.col] = bubble;

	    //旋转滚轮
	    if(bubbleData.type == BUBBLE_TYPE.revolveWheel){
		    this.revolveWheelList[bubbleData.row+ "_"+bubbleData.col] = bubble;
	    }

	    if(CURRENT_MODE == LEVEL_MODEL.save || CURRENT_MODE == LEVEL_MODEL.save3){
		    //拯救模式
		    if ((bubbleData.save2Hold && bubbleData.save2Hold > 0) || (bubbleData.hold && bubbleData.hold > 0) ||
			    bubbleData.hitHold && bubbleData.hitHold > 0) {
			    this.curHoldList.push({ m_nRow: bubbleData.row, m_nCol: bubbleData.col });
		    }
	    }
    }
	checkRevolveWheel(this.revolveWheelList,  this.m_board, this.moveBubbleRCList);
	if(CURRENT_MODE == LEVEL_MODEL.save || CURRENT_MODE == LEVEL_MODEL.save3)
		this.totalSaveCount = this.curHoldList.length;


	//【顶端的空气漩涡泡泡动画】
    if(CURRENT_MODE != LEVEL_MODEL.wheel){
        for(var i=0;i<=MAX_COLS - 1;i++){
            var pos = getPosByRowAndCol(0,i);
            var airSwirl = new cc.Sprite(res.Top_Clear_png);
            airSwirl.setPosition(pos);
            this.addChild(airSwirl);
            if (!this.m_board[ 0 +"_"+ i])
            {
                airSwirl.setVisible(true);
	            //运行空气漩涡动画
                airSwirl.runAction(repeatAroundAction(3));
            }
            else
                airSwirl.setVisible(false);
            this.clearedAniList.push(airSwirl);
        }
    }
};
//===========================================【初始化相关end】================================================

/**
 * Desc: 返回当前所有球的颜色集合
 * @returns {{}|*}
 */
GameLayer.prototype.currentTotalColores = function(){
    var colorList = [];
    var maxRow = 0;
    for(var key in this.m_board){


        var bubble = this.m_board[key];
	    if(!bubble){
		    continue;
	    }
        if(bubble.getColor() > 0 && bubble.getColor() < MAX_COLOR){
            colorList.push(bubble.getColor());
        }
        if(bubble.getRow() > maxRow){
            maxRow = bubble.getRow();
        }
    }
    colorList = uniqueArray(colorList, true);
    if (colorList.length == 0 && this.scene.m_curReady)
    // 将要发射的球颜色要记入所有的颜色集中，防止只剩下特殊球时#tempCurColores为0而不生成球
        colorList.push(this.scene.m_curReady.getColor() > 0? this.scene.m_curReady.getColor() : randomInt(1,MAX_COLOR));

    this.curTotalColores = colorList;

    return {curTotalColores:this.curTotalColores, maxRow:maxRow};//maxRow返回省略
}

/**
 * Desc: 指定位置增加一个球
 * @param rowCol
 * @param bubble
 */
GameLayer.prototype.addBubbleByRC = function(rowCol,bubble){
    var bub = new BubbleSprite(new BubbleBasic(bubble.getModel()));
    bub.setGameLayer(this);
    bub.setRowColIndex(rowCol.m_nRow, rowCol.m_nCol);
    bub.initAroundList();

    var tempPoint = getPosByRowAndCol(rowCol.m_nRow, rowCol.m_nCol);
    bub.attr({x:tempPoint.x, y:tempPoint.y});
    this.addChild(bub);
    this.m_board[rowCol.m_nRow+ "_"+rowCol.m_nCol]=bub;
}
/**
 * Desc: 消除上限下限不可见的球
 */

GameLayer.prototype.cullInVisibleBubble = function(dt){
	for(var i in this.m_board){
		var bubble = this.m_board[i];
		if(!bubble){
			continue;
		}

		var wp = this.convertToWorldSpace(bubble.getPosition());
		//cc.log("wp.x:",wp.x,"wp.y", wp.y)
		if(wp.y > topLimit || wp.y < bottomLimit){
			bubble.setVisible(false);
		}
		else
			bubble.setVisible(true);
	}
}
/**
 * Desc: 调整球的位置
 * @param useEasing
 * @param callback
 * @param executeFlag
 */
GameLayer.prototype.adjustLayerPos = function(useEasing,callback,executeFlag){
    var executeFlag = executeFlag || false;
    var useEasing = useEasing || false;
    var maxRow = this.findMaxRow();
    this.clearMinRow = maxRow;

    if (this.curMaxRow == maxRow) return; 
    this.curMaxRow = maxRow;
    var maxY = maxRow * ROW_HEIGHT + 150; //BOTTOM_RECT.height+50 50是为了跟之前设计的BOTTOM_RECT的高度一致
    var moveTargetY = (maxY - display.cy );

    // 移动时间以移动的最终距离为依据
	var moveUp = (function(){
		// 有清除时要延迟执行
		var delayTime = 0.01;
		if (this.curCheckFallFlag)
			delayTime = 0.3;
		var moveTime = moveTargetY/display.height;
		var sequence = null;
		if(useEasing){
			sequence = cc.sequence(
				cc.callFunc((function(){this.schedule(this.cullInVisibleBubble)}).bind(this)),
				cc.moveTo(moveTime,cc.p(this.x,moveTargetY*3/4)),
				cc.moveTo(moveTime,cc.p(this.x,moveTargetY)).easing(cc.easeExponentialOut()),
				cc.delayTime(delayTime),
				 cc.callFunc((function(){
					    this.unschedule(this.cullInVisibleBubble);
						if(callback)callback();
					}).bind(this))
			);
		}
		else{
			sequence = cc.sequence(
				cc.callFunc((function(){this.schedule(this.cullInVisibleBubble)}).bind(this)),
				cc.moveTo(0.5,cc.p(this.x,moveTargetY)), cc.delayTime(delayTime),
				cc.callFunc((function(){
					this.unschedule(this.cullInVisibleBubble);
					if(callback)callback();
			}).bind(this)));
		}
		this.runAction(sequence);
		return;
	}).bind(this);

    if (moveTargetY > 0)
    {
	   moveUp();
    }
    else if(this.y > 0){
	    moveTargetY = 0;
	    moveUp();
    }
    else if(executeFlag && callback)
    {
        callback();
    }
}

GameLayer.prototype.findMaxRow = function(){
    var maxRow = 0;
    for(var key in this.m_board)
    {
        var bubble = this.m_board[key];
	    if(!bubble){
		    continue;
	    }

        if (bubble.getRow() > maxRow)
            maxRow = bubble.getRow();
    }
    return maxRow;
}

/**
 * Desc:设定当前发射球
 * @param curReady
 */
GameLayer.prototype.setCurReady  = function(curReady){
    var model = curReady.getModel();
    model.setSpriteFrameWithColor(model.color);
    var lPos = this.convertToNodeSpace(curReady.getPosition());
    this.m_curReady = new BubbleSprite(curReady.getModel());
    this.m_curReady.attr({x:lPos.x,y:lPos.y});
	this.m_curReady.setGameLayer(this);
    this.addChild(this.m_curReady,SHOT_BUBBLE_DEP);
    //this.m_curReady.playProgressAni()
}

GameLayer.prototype.adjustBubblePosition = function(rowCol){
    /*var speedx=this.real.x*BUBBLE_SPEED;
	var speedy=this.real.y*BUBBLE_SPEED;
	rowCol=findTrueBlankPos(this.m_board, rowCol, this.m_curReady, speedx, speedy);
*/
    var row = rowCol.m_nRow;
    var col = rowCol.m_nCol;
    var adjustPos = getPosByRowAndCol(row, col);
    this.m_curReady.attr({x:adjustPos.x,y:adjustPos.y});

    this.m_curReady.setRowColIndex(row, col);

    this.m_board[row +"_"+ col] = this.m_curReady;
    this.m_curReady.initAroundList();
}
//
GameLayer.prototype.clearBubble = function(bubbleList,specialEffect,delay){
    var nRow, nCol;
    for(var k in bubbleList)
    {
        var rowCol = bubbleList[k];
        nRow = rowCol.m_nRow;
        nCol = rowCol.m_nCol;
        var bubble = this.m_board[nRow +"_"+ nCol];
        if(bubble)
        {
            // 炸弹、泡泡龙、解救占位球、旋转中心球 除外
            if(specialEffect && (
	        bubble.getType() != BUBBLE_TYPE.bomb &&
            bubble.getType() != BUBBLE_TYPE.dragon &&
            bubble.getType() != BUBBLE_TYPE.save2Alpha &&
            bubble.getType() != BUBBLE_TYPE.center &&
            bubble.getType() != BUBBLE_TYPE.saveAlpha))
            {
                bubble.aniId = specialEffect;
            }
	        bubble.Clear(bubbleList,delay);
        }
    }
    game.playMusic(PRE_LOAD_MUSIC.clear);
}

// 根据调整过后的球的位置和颜色类型， 作出相应的处理，如：金银色特殊泡泡的爆炸，球的下落等
GameLayer.prototype.execClearBubble = function(pReadyBubble){
	var haveClearBubble = false;
    var clearBubbleList = this.findClearBubble(pReadyBubble);
    if(clearBubbleList)
    {
        this.clearBubble(clearBubbleList);
	    haveClearBubble = true;
    }
    else
    {
        //cc.log("没有超过3个同色");
    }
    return haveClearBubble;
}

// 查找需要清除的球的集合 // pairs
GameLayer.prototype.findClearBubble = function(pReadyBubble){
    var clearRowCollist = [];
    if (! pReadyBubble )
    {
        //cc.log("ready bublle is null");
        return clearRowCollist;
    }

    // 彩虹球，特殊处理(发射的球为特殊球的情况是用道具时)
    if (pReadyBubble.getItemId() == ITEM_ID.rainbow) {

        var totalList = [];
        for(var i = 1;i <= 5;i++){
            var tempList = this.findRainbow(pReadyBubble, i);
	        //cc.log("++++++++calc tempList");
            if (tempList.length-1 >= REMOVE_COUNT) {
                for (var j = 1; j <= tempList.length-1; j++) {
                    totalList.push(tempList[j]);
                }
            }
            tempList = null;
        }
        //-- 去重
        for(var k=0;k<totalList.length;k++) {
            var rc = totalList[k];
            if (!RcKeyOf(clearRowCollist, rc)) {
                clearRowCollist.push(rc);
            }
        }

        if (clearRowCollist.length < REMOVE_COUNT) {
            clearRowCollist = null;
        }
    }
    else
    {
        clearRowCollist = this.findSameBubble(pReadyBubble, function(findBubble){
	        if(pReadyBubble.getColor() == findBubble.getColor() &&  (findBubble.getType() == BUBBLE_TYPE.normal || (findBubble.getType() == BUBBLE_TYPE.fog && !findBubble.fog) ||
			        findBubble.getType() == BUBBLE_TYPE.color))
		        return true;
        });
        if (clearRowCollist.length < REMOVE_COUNT)
            clearRowCollist = null;
    }
    return clearRowCollist;
}

//-- 彩虹球处理
GameLayer.prototype.findRainbow=function(pReadyBubble,color) {
    var samelist = [];
    samelist[0] = {};
    var tempSameList = {};
    var nColor = color;
    var nRow = pReadyBubble.getRow();
    var nCol = pReadyBubble.getCol();
    samelist.push({m_nRow: nRow, m_nCol: nCol});
    tempSameList[nRow + "_" + nCol] = true;

    var index = 1
    do {
        var itCur = samelist[index];
        //cc.log("*****index="+index);
        var vecRowCol = this.m_board[itCur.m_nRow + "_" + itCur.m_nCol].aroundList;
        //-- GetAround(itCur.m_nRow, itCur.m_nCol, vecRowCol)

        for (var i = 0; i < vecRowCol.length; i++) {
            var rowCol = vecRowCol[i];
            var pCurBubble = this.m_board[ vecRowCol[i].m_nRow + "_" + vecRowCol[i].m_nCol];

            if (index == 1 && pCurBubble) {
                if (pCurBubble.getType() == BUBBLE_TYPE.fog) {
                    //--定位后泡泡周围有未知泡泡则去掉上面的轿雾
                    pCurBubble.removeFog();
                }
            }

            //-- 只检测普通类型的球、未知、变色球时要检测是否雾被清除
            if (pCurBubble && !tempSameList[rowCol.m_nRow + "_" + rowCol.m_nCol] && pCurBubble.getColor() == Number(nColor)
                && (pCurBubble.getType() == BUBBLE_TYPE.normal ||
                    (pCurBubble.getType() == BUBBLE_TYPE.fog && !pCurBubble.fog) ||
                    pCurBubble.getType() == BUBBLE_TYPE.color )) {
                var rc = {m_nRow: rowCol.m_nRow, m_nCol: rowCol.m_nCol};
                samelist.push(rc);
                tempSameList[rowCol.m_nRow + "_" + rowCol.m_nCol] = true;

            }
        }

        index = index + 1
    }while(index <= samelist.length-1)

    //cc.log("*******out of index loop");
    return samelist;
}


// 找到同样的球，并返回找到的同样的球的集合 // pairs
GameLayer.prototype.findSameBubble = function(pReadyBubble, judgeFunc, findDoSthFunc){
    var samelist = [];
    var sameListFlag = {};
    var nRow = pReadyBubble.getRow();
    var nCol = pReadyBubble.getCol();

    sameListFlag[nRow +"_"+ nCol] = true;
    samelist.push({m_nRow : nRow, m_nCol : nCol});

    var index = 0;
    while(index < samelist.length)
    {
        var itCur = samelist[index];
        var itemBoard=this.m_board[itCur.m_nRow +"_"+itCur.m_nCol];
        if(!itemBoard){
            index++;
            continue;
        }
        var arroundRowCol = itemBoard.aroundList;
        //cc.log("第"+index+"次迭代");
        for(var i in arroundRowCol)
        {
            var rowCol = arroundRowCol[i];
            //cc.log("row;",rowCol.m_nRow, "col:", rowCol.m_nCol);
            var pCurBubble = this.m_board[ rowCol.m_nRow +"_"+ rowCol.m_nCol ];

            if(index == 0 && pCurBubble)
            {
                if(pCurBubble.getType() == BUBBLE_TYPE.fog)
                //定位后泡泡周围有未知泡泡则去掉上面的轿雾
                    pCurBubble.removeFog();
            }

            //只检测普通类型的球、未知、变色球时要检测是否雾被清除
            if(pCurBubble && !sameListFlag[rowCol.m_nRow +"_"+ rowCol.m_nCol] && judgeFunc(pCurBubble))
            {
               // var rc = {m_nRow : rowCol.m_nRow, m_nCol : rowCol.m_nCol};
	            if(findDoSthFunc)findDoSthFunc(pCurBubble);
                samelist.push(rowCol);
                sameListFlag[rowCol.m_nRow +"_"+ rowCol.m_nCol] = true;
                //cc.log("找到相同色");
            }
        }
        index++;
    }

    return samelist;
};

/**
 * Desc: 检测掉落球
 */
GameLayer.prototype.checkFallBubble = function(){
    var LinkBubbleList = [];    //[{ m_nRow = ?, m_nCol = ? },...]
    var NoLinkBubblelist = [];  //[{ m_nRow = ?, m_nCol = ? },...]
    var existLinkList = {};     //{ [Row_Col] = true, ...}

    // 检测当前消除最小行再往上十为挂点（如果出现消除时触发最小行往上十行有掉落则会有bug不掉落）
    var startRow = this.clearMinRow - 10;
	if(startRow < 0) startRow = 0;
    for (var i = 0;i<=MAX_COLS - 1;i++)
    {
        if(this.m_board[startRow +"_"+ i])
        {
            LinkBubbleList.push( { m_nRow : startRow, m_nCol : i });
            existLinkList[startRow +"_"+ i] = true;
        }
    }

	// 顶端都没有球了
    if(LinkBubbleList.length == 0)
    {
        for(var k in this.m_board)
        {
            var bubble = this.m_board[k];
            NoLinkBubblelist.push({ m_nRow : bubble.getRow(), m_nCol : bubble.getCol() });
        }
        return NoLinkBubblelist;
    }

	// 从顶端链接球开始遍历寻找所有链接的球
    var index = 0;
    while(index < LinkBubbleList.length)
    {
        var curRC = LinkBubbleList[index];
        var vecRowCol = this.m_board[curRC.m_nRow +"_"+curRC.m_nCol].aroundList;
        for(var k in vecRowCol)
        {
            var rc = vecRowCol[k];
            var pBubble = this.m_board[rc.m_nRow +"_"+ rc.m_nCol];
            if(pBubble && rc.m_nRow > startRow && !existLinkList[rc.m_nRow +"_"+ rc.m_nCol] )
            {
                //var pos = { m_nRow : rc.m_nRow, m_nCol : rc.m_nCol };
                LinkBubbleList.push(rc);
                existLinkList[rc.m_nRow +"_"+ rc.m_nCol] = true;
            }
        }
        index++;
    }

	// 除链接球之外的所有球皆为未链接球
    for(var k in this.m_board)
    {
        var bubble = this.m_board[k];
	    if(!bubble){
		    continue;
	    }
        var findRowCol = { m_nRow : bubble.getRow(), m_nCol : bubble.getCol() };
        if(bubble.getRow() > startRow && !existLinkList[findRowCol.m_nRow +"_"+ findRowCol.m_nCol])
        {
            NoLinkBubblelist.push(findRowCol);
        }
    }
    return NoLinkBubblelist;
};

GameLayer.prototype.checkSave3FallBubble = function(){
	var LinkBubbleList = [];    //[{ m_nRow = ?, m_nCol = ? },...]
	var NoLinkBubblelist = [];  //[{ m_nRow = ?, m_nCol = ? },...]
	var existLinkList = {};     //{ [Row_Col] = true, ...}

	if(this.curHoldList.length == 0){
		for(var i in this.m_board){
			var bubble = this.m_board[i];
			var findRowCol = { m_nRow : bubble.getRow(), m_nCol : bubble.getCol() };
			NoLinkBubblelist.push(findRowCol);
		}
		//cc.log("curHoldList len=0");
		return NoLinkBubblelist;
	}


	for(var k=0;k< this.curHoldList.length;k++){
		var holdRc = this.curHoldList[k];
		existLinkList[holdRc.m_nRow +"_"+ holdRc.m_nCol] = true;
		LinkBubbleList.push(holdRc);
	}

	for(var i = 0; i <= MAX_COLS - 1;i++){
		if(this.m_board[0 + "_" + i]){
			LinkBubbleList.push({ m_nRow : 0, m_nCol : i });
			existLinkList[0 +"_"+ i] = true;
		}
	}

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
}

/**
 * Desc: 将泡泡球改变到物理世界中（为了执行掉落）
 * @param pBubble
 */
GameLayer.prototype.changeBubbleToPhysicWorld = function(pBubble){
	var pos = pBubble.getPosition();
	var worldPos = this.scene.gameLayer.convertToWorldSpace(pos);
	this.scene.physicLayer.createPhysicBubble(pBubble.getModel(), worldPos.x, worldPos.y);
	pBubble.removeFromParent();
}
/**
 * Desc: 让可以掉落的泡泡掉落
 * @param fallBubbleList
 * @param callback
 * @constructor
 */
GameLayer.prototype.fallBubble = function(fallBubbleList,callback, noDelay){
	//构造fallBubbleSpriteList
    var fallBubbleSpriteList = []; //[BubbleSprite,...]
    for(var k=0;k<fallBubbleList.length;k++)
    {
        var rc = fallBubbleList[k];
        var pBubble = this.m_board[ rc.m_nRow +"_"+ rc.m_nCol ];
        if(pBubble)
        {
            fallBubbleSpriteList.push(pBubble);
            delete  this.m_board[ rc.m_nRow+"_"+ rc.m_nCol ];
	        //this.m_board[ rc.m_nRow+"_"+ rc.m_nCol ]=null;
        }
    }

	//执行掉落事件
    var index = 0;
	var fallBubbleListLength = fallBubbleSpriteList.length;
    var executeFall = (function(){
	    if(index < fallBubbleListLength) {
		    var pBubble = fallBubbleSpriteList[index];
		    if (pBubble) {
			    // 普通球掉落效果
			    if (pBubble.getType() == BUBBLE_TYPE.normal || pBubble.getType() == BUBBLE_TYPE.black
			    || pBubble.getType() == BUBBLE_TYPE.fog || pBubble.getType() == BUBBLE_TYPE.color
			    || pBubble.getType() == BUBBLE_TYPE.alpha || pBubble.getType() == BUBBLE_TYPE.dragon
			    || pBubble.getType() == BUBBLE_TYPE.three) {
				   this.changeBubbleToPhysicWorld(pBubble);
			    }
			    else{
				    // 解救模式占位泡泡要有掉落效果
				    if(pBubble.getType() == BUBBLE_TYPE.saveAlpha){
					    var pos = pBubble.getPosition();
					    var worldPos = this.scene.gameLayer.convertToWorldSpace(pos);
					    this.scene.physicLayer.createPhysicBubble(pBubble.getModel(), worldPos.x, worldPos.y);
				    }
				    pBubble.fall();
			    }
		    }
		    index++;
            if(noDelay){
                executeFall();
            }
            else{
                if(index%2==0)
                    performWithDelay(this, executeFall, 0.01);
                else
                    executeFall();
            }
	    }
	    else{
            if(noDelay){
                if(callback)callback();
            }
            else {
                if (callback) {
                    performWithDelay(this, callback, 0.2);
                }
            }
	    }

    }).bind(this);
    executeFall();
};
/**
 * Desc: 每回合检查结束
 */
GameLayer.prototype.checkGameOver = function(){
	var clearBubbleNum = 0;
	if(this.scene.m_state != GAME_STATE.GS_END)
	{
		//根据顶部清除球来判定游戏是否结束
		if(CURRENT_MODE == LEVEL_MODEL.classic || CURRENT_MODE == LEVEL_MODEL.save2)
		{
			var clearBubbleNums = 0;
			for(var i = 0; i <= MAX_COLS - 1;i++)
			{
				if(CURRENT_MODE == LEVEL_MODEL.classic)
				{
					if(this.m_board[0+"_"+i])
					{
						if(this.clearedAniList[i].isVisible())
						{
							this.clearedAniList[i].setVisible(false);
							this.clearedAniList[i].stopAllActions();
						}
					}
					else
					{
						clearBubbleNums++;
						if(!this.clearedAniList[i].isVisible())
						{
							this.clearedAniList[i].setVisible(true);
							this.clearedAniList[i].runAction(repeatAroundAction(3));
						}
					}
				}
			}
			if(clearBubbleNums >= GEND_TOPNULLBUBS)
			{
				clearBubbleNums = GEND_TOPNULLBUBS;
				//清除所有漩涡空气泡泡，结束游戏
				if(CURRENT_MODE == LEVEL_MODEL.classic)
				{
					for(var j in this.clearedAniList)
					{
						var clearAni = this.clearedAniList[j];
						clearAni.stopAllActions();
						clearAni.removeFromParent();
					}
				}
				//成功过关（result:1)
				this.scene.gameOver({result : 1});
			}
			//进度标签
			this.scene.topLayer.updateGameProgress(clearBubbleNums + "/" + GEND_TOPNULLBUBS);
		}
		else if(CURRENT_MODE == LEVEL_MODEL.save || CURRENT_MODE == LEVEL_MODEL.save3)
		{
			var curHoldListLen = this.curHoldList.length;
			this.scene.topLayer.updateGameProgress((this.totalSaveCount- curHoldListLen) +"/"+ this.totalSaveCount);
			//cc.log("this.curHoldList:",curHoldListLen);
			if(curHoldListLen == 0){
				this.scene.gameOver({result : 1});
				return;
			}
		}
	}

	//等待发射球用完了(失败重试（result:0))
	if (this.scene.waitBubbleNum == 0)
		this.scene.gameOver({result:0});

}
/**
 * Desc: 回合结束的触发与检测（包括状况状态调整）
 * @type {Function}
 */
GameLayer.prototype.boutEndTrigger = function () {
	// 每回合结束后每个球触发
	checkWhenOneAfter(this);
	this.scene.checkDoubleHit();
	this.scene.checkWaitAndReadColorVaild(this.currentTotalColores().curTotalColores);

	// 掉落结束后再调整层位置
	if(CURRENT_MODE!= LEVEL_MODEL.wheel)
		this.adjustLayerPos();

	// 这里每回合都要检测，因为这进度有增加有减
	this.checkGameOver();
	this.curCheckFallFlag = false;
	if(this.scene.m_state != GAME_STATE.GS_END &&
		this.scene.m_state != GAME_STATE.GS_SHOWEND){
		this.scene.setState();              //游戏状态改变
		this.scene.touchLayer.setEnable();   //激活点击发射
	}
};

/**
 * //Desc: 掉落所有的泡泡
 * @param dt
 * @constructor
 */
GameLayer.prototype.fallAllBubble = function() {
	//掉落所有泡泡
	var fallBubbleList = [];
	for(var i in this.m_board)
	{

		var bubble = this.m_board[i];
		if(!bubble){
			continue;
		}
		fallBubbleList.push({m_nRow:bubble.getRow(), m_nCol:bubble.getCol()});
	}
	this.fallBubble(fallBubbleList);
};
/**
 * Desc: 游戏结束时的闪电划过全部泡泡掉落效果
 * @param hitRC
 */
GameLayer.prototype.effectFlashWhenGameOver = function(hitRC){
	this.effectFlash(hitRC);
	this.fallAllBubble();
}

/**
 * Desc: 一行划过，以下部分全部清除(默认掉落)的闪电效果
 * @param hitRC
 */
GameLayer.prototype.effectFlashWithClearOneRow = function(hitRC, noFall){
	this.effectFlash(hitRC);

	var clearBubbleList = clearOneRowByRC(hitRC, this.m_board);
	this.clearBubble(clearBubbleList);

	//执行掉落
	if(!noFall){
		var fallList = this.save3Flag?this.checkSave3FallBubble():this.checkFallBubble();
		this.fallBubble(fallList);
	}
}
/**
 * Desc: 闪电划过效果
 * @param hitRC
 */

GameLayer.prototype.effectFlash = function(hitRC){
	game.playMusic(MUSIC_CONFIG.flash);
	//添加闪电
	var localPos = getPosByRowAndCol(hitRC.m_nRow, hitRC.m_nCol);
	var worldPos = this.convertToWorldSpace(localPos);
	var flashEffectAni = new cc.Sprite();
	flashEffectAni.attr({x:display.cx-50,y:worldPos.y});
	this.scene.addChild(flashEffectAni);
	//闪电动画
	game.bulletManage.load("type_2");
	var animation = game.bulletManage.getAnimation("type_2", "progress");
	flashEffectAni.runAction(new cc.Animate(animation));
	flashEffectAni.setScaleX(1.5);
}

// 执行炸弹泡泡 isIcoCream:表示被冰淇淋泡泡打中，显示相应的消失效果
GameLayer.prototype.effectBomb = function(hitRC,noFall,isIcoCream){
	var localPos = getPosByRowAndCol(hitRC.m_nRow, hitRC.m_nCol);
	var worldPos = this.convertToWorldSpace(localPos);
	var clearBubbleList = clearAroundByRC(hitRC,this.m_board);
	// 延时执行清除球的图片
	this.clearBubble(clearBubbleList,isIcoCream && "itemId_5_normal" || null, 0.3 );

	//执行掉落
	if(!noFall){
		var fallList = this.checkFallBubble();
		this.fallBubble(fallList);
	}
}


