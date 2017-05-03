/**
 * Created by beyondray on 2015/8/25.
 * Desc:辅助线
 */

var ShotLineLayer = cc.Layer.extend({
	ctor: function (params) {
		this._super();
		this.initData(params);
		this.createAllBubble();
	},
	initData: function (params) {
		this.endPointInfo=null, //碰撞到球或上边界的信息点，若非前述则为null
		this.maxHitBorderCount = 3,
		this.curHitBorderCount = 0,  //反弹后计数,用于反弹后的检测点最多只有两个检测
		this.minYIdx=0,      //到【准备球】点最近的辅助球的索引
		this.remainDis=0,    //拖拽后上次最近球到【准备球】点的距离
		this.wheelLines = []; //辅助泡泡数组
		this.pointInfos = [];//辅助线点信息集{x,y,real}, 若最后一点为调整辅助点，不可见
		this.scene = params.scene;
		this.real = {x: 0, y: 0 };
		this.maxLinePoint = 15;
		this.batchNode = null;
		this.collideWithBorder=false;
		this.afterCollidePointCount=0;
	},
	createAllBubble:function(){
		// 初始化所有点精灵
		this.batchNode = new cc.SpriteBatchNode(res.POINT6_PNG);
		for (var i = 1; i <= this.maxLinePoint + 1; i++) {
			var pointSp = new cc.Sprite(this.batchNode.texture);
			pointSp.attr({x: -1000, y: 1000});
			this.batchNode.addChild(pointSp);
			this.wheelLines.push(pointSp);
		}
		this.addChild(this.batchNode);
	},
	update: function (dt) {
		//cc.log("shotline update");
			this.moveAllBubble(dt);
	},
	resetInfo:function(){
		//重置=========================
		for(var i in this.pointInfos){
			delete  this.pointInfos[i];
		}
		this.pointInfos = [];
		for(var j in this.wheelLines)
		{
			this.wheelLines[j].attr({x: -1000, y: -1000});
			this.wheelLines[j].setVisible(true);
		}
		this.endPointInfo = null;
		//=============================
	},
	getNewShotPos:function(curReal, remainDis){
		var offsetX = this.wheelLines[this.minYIdx].x - READY_BUBBLE_POS.x;
		var offsetY = this.wheelLines[this.minYIdx].y - READY_BUBBLE_POS.y;
		var len = Math.sqrt(offsetX*offsetX+offsetY*offsetY);
		var beginPos = {x:READY_BUBBLE_POS.x+curReal.x*len, y:READY_BUBBLE_POS.y+curReal.y*len};
		this.remainDis = len;
		return beginPos;
	},
	_resetShotLine:function(curReal, beginPos){
		this.real = curReal;
		var realClone = {x:curReal.x, y:curReal.y};
		this.collideWithBorder=false;
		this.afterCollidePointCount=0;
		this.resetInfo();

		this.checkLine(beginPos, this.pointInfos, realClone);
		this.showAllBubble();
		this.minYIdx = 0;
	},
	// 创建辅助线
	_createLines: function (curReal) {
		this._resetShotLine(curReal, READY_BUBBLE_POS);
	},
	createShotLine: function (curColor, curReal) {
		this.setLineColor(curColor);
		this._createLines(curReal);
		this.setVisible(true);
	},
	updateShotLine: function (curReal) {
		if(!ValueEqual(this.real , curReal)){
			var beginPos = this.getNewShotPos(curReal, this.remainDis);
			this._resetShotLine(curReal, beginPos);
		}
		this.scheduleUpdate();
		this.setVisible(true);
	},
	shieldShotLine: function () {
		this.unscheduleUpdate();
		this.setVisible(false);
	},
	setLineColor: function (color) {
		if (color <= -1 || color >= 6) {
			color = 5;
		}
		this.batchNode.removeAllChildren();
		this.batchNode.removeFromParent();
		this.batchNode = new cc.SpriteBatchNode(res["POINT" + color + "_PNG"]);
		//SHOT_LINE_COLOR[color]
		for(var i in this.wheelLines){
			this.wheelLines[i].setTexture(this.batchNode.texture);
			this.batchNode.addChild(this.wheelLines[i]);
		}
		this.addChild(this.batchNode);
	},
	checkPointInLine:function(linePoint, points, real){
		var recordInfo = null;
		//检测与球和上边界碰撞，得到点数据

		//if(!this.collideWithBorder) {
			var lp = this.scene.gameLayer.convertToNodeSpace(linePoint);

			var colliInfo = checkLineCollision(this.scene.gameLayer.m_board, lp, real, CHECK_BUB_SPEED);
			if (colliInfo.colliRc != null) {
				var wp = this.scene.gameLayer.convertToWorldSpace(colliInfo.colliPos);
				this.endPointInfo = {x: wp.x, y: wp.y, real: {x: real.x, y: real.y}};
				return true;
			}
		//}
		//检测与左右边界碰撞，得到点数据
		var bColliBorder = ColliWithBorder(linePoint, CHECK_BUB_SPEED, real);
		if(bColliBorder) {
			this.curHitBorderCount++;
			this.collideWithBorder=true;
		}
		recordInfo = {x:linePoint.x, y:linePoint.y, real:{x:real.x, y:real.y}};

		if(!this.collideWithBorder) {
			this.pointInfos.push(recordInfo); //记录未碰撞的点或碰撞修正后的点
		}else if(this.collideWithBorder&&this.afterCollidePointCount<=2){
			this.pointInfos.push(recordInfo); //记录未碰撞的点或碰撞修正后的点
			this.afterCollidePointCount++;
		}else{
			this.endPointInfo=clone(this.pointInfos[this.pointInfos.length-1]);
			return true;
		}

		//移动
		linePoint.setPosition(cc.p(linePoint.x+real.x*CHECK_BUB_SPEED, linePoint.y+real.y*CHECK_BUB_SPEED));
		return false;
	},
	checkLine:function(beginPos, points, real){
		// 一个位于beginPos的精灵
		var linePoint = new cc.Sprite(res.POINT6_PNG);
		linePoint.setPosition(beginPos);
		this.scene.addChild(linePoint);
        var collide=false;
		for (var i = 1; i <= this.maxLinePoint; i++) {
			//中途碰到球后退出检测
			if (this.checkPointInLine(linePoint, points, real)) {
                //collide=true;
                //this.pointInfos.splice(this.pointInfos.length-1,1);
				break;
			}
		}
		var recordInfo = {
			x:linePoint.x - this.remainDis*real.x,
			y:linePoint.y - this.remainDis*real.y,
			real:{x:real.x, y:real.y}
		};
        //if(!collide) {
            this.pointInfos.push(recordInfo);
        //}
		linePoint.removeFromParent();
		return this.pointInfos;
	},
	moveBubble:function(bubble, speed, pointInfo, notVisiblePInfo, resetPosPInfo, dt){
		var bResetPos = false;
		MoveLineBubbleThinkBorder(bubble, speed,  pointInfo.real, dt);
		var offsetX = bubble.y < 800 ? 120 : 100;
		if(bubble.y >= resetPosPInfo.y){
			bubble.setVisible(true);
			bubble.setPosition(READY_BUBBLE_POS);
			pointInfo.real.x = this.real.x;
			bResetPos = true;
		}
		else if(notVisiblePInfo && bubble.y >= notVisiblePInfo.y){
			bubble.setVisible(false);
		}
		return bResetPos;
	},
	showAllBubble:function(){
		for (var i in this.pointInfos) {
			var pInfo = this.pointInfos[i];
			this.wheelLines[i].attr({x: pInfo.x, y: pInfo.y});
		}
		//调整辅助点不可见
		this.wheelLines[this.pointInfos.length-1].setVisible(false);
	},
	moveAllBubble:function(dt){
		var endIdx = this.pointInfos.length-1;
		for (var i = 0; i < endIdx; i++) {
			var pInfo = this.pointInfos[i];
			if(this.moveBubble(this.wheelLines[i], CHECK_BUB_SPEED, pInfo, this.endPointInfo, this.pointInfos[endIdx], dt))
				this.minYIdx = parseInt(i);
		}
	},
	// 清除辅助线
	clearLines: function () {
		this.removeAllChildren();
		this.resetInfo();
		this.setVisible(false);
		this.scene = null;
		this.removeFromParent();
	}
})
