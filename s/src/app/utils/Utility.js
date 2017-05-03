/**
 * Created by beyondray on 2015/8/20.
 * Desc: 一些常用的算法
 */
//随机一个整数
var randomInt = function(min, max){
    return Math.floor(Math.random()*(max-min)+min);
};

//随机一个浮点数
var randomFloat = function(lower, greater){
	return Math.min(lower, greater) + Math.random()  * Math.abs(greater - lower);
};

//随机创建颜色
var randomCreateColor = function(){
	var color = randomInt(1,MAX_RANDOM);
	color +=  RANDOM_OFFSET;
	if(color >= MAX_COLOR){
		color = (color% MAX_COLOR +1);
	}
	return color;
}

//偏移创建颜色
var offsetCreateColor = function(curColor, offset, maxColor) {
	if(curColor == maxColor)
		return maxColor;
	var colorOffset = curColor + offset;
	if(colorOffset >= maxColor) //偏移到随机色时自动调整为1
		colorOffset = (colorOffset % maxColor) + 1;
	return colorOffset;
};

var sceneAdpt = function(){
	this.setAnchorPoint(0.5, 0);
	this.setContentSize(display.size);
	this.setPosition(cc.winSize.width/2, 0);
	this._ignoreAnchorPointForPosition = false;
}
/**
 * 【Desc】: 根据权重值从数据集合里面随机出
 * @param dataset 数据集合
 * @param field 权重域
 * @returns {*}
 */
var randWeight = function(dataset, field){
	if (! dataset ) return null ;
	field = field || "weight";

	// 计算权值总和
	var weightSum = 0;
	for(var key in dataset){
		var value = dataset[key];
		weightSum  += Number(value[field]);
	}

	var randWeight = randomFloat(0, weightSum);
	var returnKey; //防止权重为负时不返回，此时返回第最后一个
	for(var key in dataset){
		var value = dataset[key];
		returnKey = key;
		if( randWeight > Number(value[field]))
			randWeight -= Number(value[field]);
		else
			return key;
	}
	return returnKey;
};

// 从所给的颜色队列中随机取一种颜色来创建泡泡球
var randomBubble =function(totalColor){
    var key = randWeight(totalColor, "weight");
    var color = totalColor[key].color;
    // cc.log("i,color,weight",i,color,totalColor[i].weight);
    var pBubble = new BubbleSprite(new BubbleBasic({color : color}));
    return pBubble;
};

//得到对象自身属性的个数
var getOwnProperyLength = function(obj){
	var length = 0;
	for(var key in obj)
	{
		if(obj.hasOwnProperty(key))
			length++;
	}
	return length;
}

var getPosByRowAndCol = function(row, col){
    var posX = col * 2 * BUBBLE_RADIUS + BUBBLE_RADIUS + Math.abs(row % 2) * BUBBLE_RADIUS + OFFSET.x;
    var posY = display.size.height - ( row * 2 * BUBBLE_RADIUS * Math.sin(PI/3) + BUBBLE_RADIUS ) - TOP_RECT.height;
    return cc.p(posX, posY);
};

/*var loadMap = function(mapFilePath, self){
    cc.loader.loadJson(mapFilePath, function(error, data){
        var mapData = data["level"]["graph"];
        for(var i=0;i<mapData.length;i++) {
            self.sp = new BubbleSprite(new BubbleBasic(mapData[i]));
            self.addChild(self.sp);
        }
    });
};*/

var loadMapData = function(readLevel){
	var mapFilePath = "res/mapData/"+readLevel+".json";
	cc.loader.loadJson(mapFilePath, function(error, data){
		var sceneParams = {level:1, realLevel:1, jsonObj:data};
		cc.director.runScene(new TestScene());
	});
};

var uniqueJson = function(t, bArray){
    var check = {};
    var n = {};
    var idx = 0;
    for(var k in t)
    {
        v = t[k];
        if(!check[v])
        {
            if(bArray) {
                n[idx] = v;
                idx = idx + 1;
            }
            else
                n[k] = v;
            check[v] = true;
        }
    }
    return n;
};

var uniqueArray = function(t, bArray){
    var check = {};
    var n = [];
    var idx = 0;
    for(var k in t)
    {
        var v = t[k];
        if(!check[v])
        {
            if(bArray) {
                n[idx] = v;
                idx ++;
            }
            else
                n[k] = v;
            check[v] = true;
        }
    }
    return n;
};

var RcKeyOf = function(rowColTable, value){
	for(var k in rowColTable){
		var rowCol = rowColTable[k];
		if(rowCol.m_nRow == value.m_nRow &&
			rowCol.m_nCol == value.m_nCol){
			return k;
		}
	}
}

var removeByIdx =function(obj, dx)
{
	dx = Number(dx);
	if(isNaN(dx)||dx>obj.length){return false;}
	for(var i=0,n=0;i<obj.length;i++)
	{
		/*
		if(obj[i]!=obj[dx])*/
		if(i!=dx)
		{
			obj[n++]=obj[i]
		}
	}
	obj.length-=1;
}

//返回在发射球的上面还是下面
var returnUpOrDown = function(y){
    if (y > READY_BUBBLE_POS.y)
        return "top";
    else
        return "down";
};
//弧度转换成角度
var toDegree = function(radius){
   return radius/(2*Math.PI)*360.0;
};
//生成发射球角度
var isAngle = function (dxNew, dyNew){
    var a1 = Math.atan((dxNew - READY_BUBBLE_POS.x) / (dyNew - READY_BUBBLE_POS.y));
    var r = 90 - toDegree(a1);
    if (r > SHOT_ANGLE && r < 180-SHOT_ANGLE)
        return {degree:r, legal:true};
    return {degree:0, legal:false};
};

//=================================================
// Desc; 根据开始点所在发射球的上下面返回单位向量
//==================================================
var returnCurReal = function(dic,startP) {
    if (dic == "top")
        return cc.pNormalize(cc.pSub(startP, cc.p(READY_BUBBLE_POS.x, READY_BUBBLE_POS.y)));
    else
        return cc.pNormalize(cc.pSub(cc.p(READY_BUBBLE_POS.x,READY_BUBBLE_POS.y), startP));
};

// 是否和底部碰撞
var isCollisionWithBottomBorder = function(bubble){
	if(bubble.y < READY_BUBBLE_POS.y)
		return true;
	return false;
}

// 是否和顶层边缘碰撞
var isCollisionWithTopBorder = function(bubble){
	if(bubble.y > display.height - TOP_RECT.height - BUBBLE_RADIUS)
		return true;
	return false;
}

// 与上边界碰撞（带边界修订）
var ColliWithTopBorder = function(bubble, real){
	var limitY = display.size.height - BUBBLE_RADIUS - TOP_RECT.height;
	var offsetY = bubble.y - limitY;
	bubble.setPosition(bubble.x,limitY-offsetY);
	real.y = -real.y;
}

// 是否和左右边缘碰撞
var isCollisionWithBorder = function(bubble){
    var posX = bubble.x;
    if(posX < LEFT_CHECK_LIMIT)
        return {isCollision:true, dir: "left"};
    else if(posX > RIGHT_CHECK_LIMIT)
        return {isCollision:true, dir: "right"};
    else
        return {isCollision:false, dir: ""}

};
// 边界修订
var ColliWithBorder = function(bubble, speed, real){
	var posX = bubble.x;
	var posY = bubble.y;

	//碰撞时修正边界
	if(posX < LEFT_CHECK_LIMIT || posX > RIGHT_CHECK_LIMIT){
		var BORDER_LIMIT = (posX < LEFT_CHECK_LIMIT)?LEFT_CHECK_LIMIT:RIGHT_CHECK_LIMIT;
		var offsetX = BORDER_LIMIT - posX;
		bubble.setPosition(cc.p(BORDER_LIMIT+offsetX, posY));
		real.x = -real.x;
		return true;
	}
	return false;
}

//发射泡泡前进（含边界修订)
var MoveBubbleThinkBorder = function(bubble, speed, real, delta){
	ColliWithBorder(bubble, speed, real);
	if(typeof  delta != "number")
		delta = delta || 1;
	//bubble.setPosition(cc.p(bubble.x+speed*real.x*delta, bubble.y+speed*real.y*delta));
	bubble.setPosition(cc.p(bubble.x+speed*real.x, bubble.y+speed*real.y));
}

//发射泡泡前进（含边界修订)辅助线
var MoveLineBubbleThinkBorder = function(bubble, speed, real, delta){
	ColliWithBorder(bubble, speed, real);
	if(typeof  delta != "number")
		delta = delta || 1;
	bubble.setPosition(cc.p(bubble.x+speed*real.x*delta, bubble.y+speed*real.y*delta));
}

var dia = 2*BUBBLE_RADIUS; //直径
var realRowHeight = (dia *Math.sin(Math.PI/3)); //实现行高
var GetRowColByPos = function( nPosX, nPosY){
    nPosX = nPosX - OFFSET.x;
    nPosY = display.size.height - nPosY - TOP_RECT.height;

    var nRow, nCol;
    nRow = Math.floor(nPosY/realRowHeight);

    if (nRow%2 == 0)
        nCol = nPosX/(dia);
    else
    {
        nCol = (nPosX - BUBBLE_RADIUS) / (dia );
	    if(CURRENT_MODE != LEVEL_MODEL.wheel){
		    if(nCol > 9)
			    nCol = 9;

	    }
    }
	if(CURRENT_MODE != LEVEL_MODEL.wheel){
		if(nCol < 0)
			nCol = 0;
	}

	nCol = Math.floor(nCol);
    return {m_nRow: nRow, m_nCol: nCol};
};

/**
 * Desc:碰撞检测返回要定位的坐标
 * @param curPoint
 * @returns {*}
 */
var checkCollision = function(board, curPoint, real, speed, delta,iceFlag) {
	//速度
	delta =  1;
	var speedx = real.x * speed * delta;
	var speedy = real.y * speed * delta;
	//当前点和上一点坐标
	var newx = curPoint.x;
	var newy = curPoint.y;
	var oldx = newx - speedx;
	var oldy = newy - speedy;

	//得到周围和中心检测列表
	var rowCol = GetRowColByPos(newx, newy);
	var _r = rowCol.m_nRow;
	var _c = rowCol.m_nCol;
	var checkList = [];
	if (board[_r + "_" + _c]) {
		checkList.push(board[_r + "_" + _c]);
	}
	var vecRowCol = GetAround(_r, _c);

	for (var i=0;i<vecRowCol.length;i++) {
		var rc = vecRowCol[i];
		if (board[rc.m_nRow + "_" + rc.m_nCol])
			checkList.push(board[rc.m_nRow + "_" + rc.m_nCol]);
	}

	var hitRow=-1;
	var hitCol=-1;
	var mindist = 10000000; //碰撞距离
	var row_col = "";     //碰撞时位置连接字符串
	var truex = -1, truey = -1; //碰撞时发射球坐标
	// cc.log("object:",i, vecRowCol[i].m_nRow, vecRowCol[i].m_nCol);
	var r = BUBBLE_RADIUS - COLLISON_OFFSET;
	for (var j=0;j<checkList.length;j++) {
		var bubble = checkList[j];
		var h = distance(bubble.x, bubble.y, oldx, oldy, newx, newy);
		if (h < 2 * r - 1e-4) {
			var vp = chuizu(bubble.x, bubble.y, oldx, oldy, newx, newy);
			var dd = Math.sqrt(4 * r * r - h * h); //相撞时球的坐标到垂足的距离
			var coliX = vp.x - speedx * dd / speed;// coliX,,coliY 表示相碰撞时所在坐标
			var coliY = vp.y - speedy * dd / speed;

			if (((coliX - oldx) * (coliX - newx) <= 0) && ((coliY - oldy) * (coliY - newy) <= 0)) {
				var ddd = dist(oldx, oldy, coliX, coliY);  //保证找到最先碰到的那个球
				if (ddd < mindist) {
					mindist = ddd;
					row_col = bubble.getRow() + "_" + bubble.getCol();
					hitRow=bubble.getRow();
					hitCol=bubble.getCol();

                    if(iceFlag){
                        return {colliRc:{m_nRow:bubble.getRow(),m_nCol:bubble.getCol()},colliPos:{x:coliX,y:coliY},hitRc:{m_nRow:hitRow,m_nCol:hitCol}};
                    }

					truex = coliX;
					truey = coliY;
				}
			}
		}
	}

	//碰撞到球了
	if (row_col != "") {

		var rc = GetRowColByPos(truex, truey);
        rc = findTrueBlankPos(board, rc, curPoint, speedx, speedy);
		return {colliRc: rc, colliPos:{x: truex, y: truey },hitRc:{m_nRow:hitRow,m_nCol:hitCol}};
	}
	else
	{
		// 跟顶部碰撞了
		if (CURRENT_MODE != LEVEL_MODEL.wheel && newy > UP_CHECK_LIMIT) {
			var rc1 = findTrueBlankPos(board, GetRowColByPos(newx,UP_CHECK_LIMIT), curPoint, speedx, speedy);
			return {colliRc: rc1, colliPos: {x: newx, y: newy },hitRc:rc1};
		}else //无碰撞
			return  {colliRc:null, colliPos:null}
	}
}

/**
 * Desc:碰撞检测返回要定位的坐标
 * @param curPoint
 * @returns {*}
 */
var checkLineCollision = function(board, curPoint, real, speed, delta,iceFlag) {
	//速度
	delta =  delta||1;
	var speedx = real.x * speed* delta;
	var speedy = real.y * speed* delta;
	//当前点和上一点坐标
	var newx = curPoint.x;
	var newy = curPoint.y;
	var oldx = newx - speedx;
	var oldy = newy - speedy;

	//得到周围和中心检测列表
	var rowCol = GetRowColByPos(newx, newy);
	var _r = rowCol.m_nRow;
	var _c = rowCol.m_nCol;
	var checkList = [];
	if (board[_r + "_" + _c]) {
		checkList.push(board[_r + "_" + _c]);
	}
	var vecRowCol = GetAround(_r, _c);

	for (var i=0;i<vecRowCol.length;i++) {
		var rc = vecRowCol[i];
		if (board[rc.m_nRow + "_" + rc.m_nCol])
			checkList.push(board[rc.m_nRow + "_" + rc.m_nCol]);
	}

	var mindist = 10000000; //碰撞距离
	var row_col = "";     //碰撞时位置连接字符串
	var truex = -1, truey = -1; //碰撞时发射球坐标
	// cc.log("object:",i, vecRowCol[i].m_nRow, vecRowCol[i].m_nCol);
	var r = BUBBLE_RADIUS - COLLISON_OFFSET;
	for (var j=0;j<checkList.length;j++) {
		var bubble = checkList[j];
		var h = distance(bubble.x, bubble.y, oldx, oldy, newx, newy);
		if (h < 2 * r - 1e-4) {
			var vp = chuizu(bubble.x, bubble.y, oldx, oldy, newx, newy);
			var dd = Math.sqrt(4 * r * r - h * h); //相撞时球的坐标到垂足的距离
			var coliX = vp.x - speedx * dd / speed;// coliX,,coliY 表示相碰撞时所在坐标
			var coliY = vp.y - speedy * dd / speed;

			if (((coliX - oldx) * (coliX - newx) <= 0) && ((coliY - oldy) * (coliY - newy) <= 0)) {
				var ddd = dist(oldx, oldy, coliX, coliY);  //保证找到最先碰到的那个球
				if (ddd < mindist) {
					mindist = ddd;
					row_col = bubble.getRow() + "_" + bubble.getCol();
					if(iceFlag){
						return {colliRc:{m_nRow:bubble.getRow(),m_nCol:bubble.getCol()},colliPos:{x:coliX,y:coliY}};
					}

					truex = coliX;
					truey = coliY;
				}
			}
		}
	}

	//碰撞到球了
	if (row_col != "") {

		var rc = GetRowColByPos(truex, truey);
		rc = findTrueBlankPos(board, rc, curPoint, speedx, speedy);

		return {colliRc: rc, colliPos:{x: truex, y: truey }};
	}
	else
	{

		// 跟顶部碰撞了
		if (CURRENT_MODE != LEVEL_MODEL.wheel && newy > UP_CHECK_LIMIT)
			return {colliRc:rowCol, colliPos:{x: newx, y: UP_CHECK_LIMIT }};
		else //无碰撞
			return  {colliRc:null, colliPos:null}
	}
}

/**
 * Desc: 寻找正确的面板位置
 * @param rc
 * @param currentXY
 * @param speedx
 * @param speedy
 * @returns {*}
 */
var findTrueBlankPos = function(board, rc, currentXY, speedx, speedy){
	var res = rc;
	//行列无效或面板中没有泡泡球时
	if(!IsValidPos(rc.m_nRow, rc.m_nCol) || (board[rc.m_nRow +"_"+ rc.m_nCol]))
	{
		var dia = BUBBLE_RADIUS *2;
		var r = BUBBLE_RADIUS/2;
		var skewSpeed = Math.sqrt(Math.pow(speedx, 2) + Math.pow(speedy, 2));
		for(var i = 0; i <= dia; i++)
		{
			var oldx = currentXY.x - r * speedx /skewSpeed * i;
			var oldy = currentXY.y - r * speedy /skewSpeed * i;
			var rowCol = GetRowColByPos(oldx,oldy);
			if(IsValidPos(rowCol.m_nRow, rowCol.m_nCol) && (!board[rowCol.m_nRow +"_"+ rowCol.m_nCol])){
				return rowCol;
			}
		}
	}
	return res;
};

//==========================
// Desc:判断行列是否有效
//==========================
var IsValidPos = function(nRow, nCol){
    if(CURRENT_MODE == LEVEL_MODEL.wheel)
    // 旋转模式判断
    {
       /* if (nRow < -Math.floor(MAX_ROWS / 2) || nCol < -Math.floor(MAX_COLS / 2))
            return false;*/
    }
    else if(CURRENT_MODE == LEVEL_MODEL.classic || CURRENT_MODE == LEVEL_MODEL.save
        || CURRENT_MODE == LEVEL_MODEL.save2 || CURRENT_MODE == LEVEL_MODEL.save3)
    {
        // 经典模式判断
        if (nRow < 0 || nCol < 0)return false;

        if(nCol >= (MAX_COLS - nRow % 2))return false;
    }
    return true;
};

//获得周围停靠位置的列表nRow,nCol为要计算的停靠位置，vecPos返回它周围的位置
var GetAround = function(nRow, nCol){

	/*if(!IsValidPos())return;*/
    if(!IsValidPos(nRow,nCol))return [];

	var vecRowCol = [];
    //同一行
    if(IsValidPos(nRow, nCol-1))
        vecRowCol.push({m_nRow : nRow, m_nCol : (nCol - 1)});
    if(IsValidPos(nRow, nCol+1))
        vecRowCol.push({m_nRow : nRow, m_nCol : (nCol + 1)});

    //一边斜线
    if(IsValidPos(nRow-1, nCol))
        vecRowCol.push({m_nRow : (nRow-1), m_nCol : nCol});
    if(IsValidPos(nRow+1, nCol))
        vecRowCol.push({m_nRow : (nRow+1), m_nCol : nCol});

    //另一边斜线
    var col = nRow % 2 == 0?(nCol-1):(nCol+1);
    if(IsValidPos(nRow-1, col))
        vecRowCol.push({m_nRow : (nRow-1), m_nCol : col});
    if(IsValidPos(nRow+1, col))
        vecRowCol.push({m_nRow : (nRow+1), m_nCol : col});
	return vecRowCol;
};

// 点(x1,y1)到直线(x2,y2,x3,y3)的距离   d=|Aa+Bb+C|/√(A^2+B^2)
var distance = function(x1, y1, x2, y2, x3, y3){
    var temp1 = trianglearea(x1,y1,x2,y2,x3,y3);
    var temp2 = dist_Point(cc.p(x2,y2),cc.p(x3,y3)); //dist(x2,y2,x3,y3)
    return 2*temp1/temp2;
};

//三点求三角形面积 S=(1/2)*(x1y2+x2y3+x3y1-x1y3-x2y1-x3y2)
var trianglearea = function(x1,y1,x2,y2,x3,y3) {
    var temp = (x2 * y3 - y2 * x3 + x3 * y1 - y3 * x1 + x1 * y2 - x2 * y1);
    return Math.abs(1.0 / 2 * temp);
};

var chuizu = function( x1, y1, x2, y2, x3, y3){
    if(x2 == x3)  //竖着的一直线
        return cc.p(x2,y1);
    else if(y2 == y3) //横着的一直线
        return cc.p(x1,y2);
    else
    {
        var k = (y3 - y2) / (x3 - x2);
        var xx = (k * k * x2 + k * (y1 - y2) + x1) / (k * k + 1);
        var yy = k * (xx - x2) + y2;
        return cc.p(xx, yy);
    }
};

//两点距离
var dist = function(x1, y1, x2, y2){
    var deltaX = (x1-x2);
    var deltaY = (y1-y2);
    return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
};

var dist_Point = function(pos1, pos2){
    return dist(pos1.x,  pos1.y,  pos2.x,  pos2.y)
};

// 包括无效位置
var GetAroundInCludeVaild = function( nRow, nCol, vecPos ){
    if(!IsValidPos())return;

    //同一行
    vecPos.push({m_nRow : nRow, m_nCol : nCol - 1});
    vecPos.push({m_nRow : nRow, m_nCol : nCol + 1});

    //一边斜线
    vecPos.push({m_nRow : nRow-1, m_nCol : nCol});
    vecPos.push({m_nRow : nRow+1, m_nCol : nCol});

    //另一边斜线
    var col = nRow % 2 == 0?nCol-1:nCol+1;
    vecPos.push({m_nRow : nRow-1, m_nCol : col});
    vecPos.push({m_nRow : nRow+1, m_nCol : col});
};



var findAGroundInList = function(board, list, ret){
    var keymap = {};
    for(var key in list)
    {
        var rc = list[key];
        var nRow = rc.m_nRow;
        var nCol = rc.m_nCol;
        //if(board[nRow+"_"+nCol])
            keymap[nRow +"_"+ nCol] = true;
    }

    for(var key in list)
    {
        var rc = list[key];
        var nRow = rc.m_nRow;
        var nCol = rc.m_nCol;
        var vec = [];
        //if(board[nRow+"_"+nCol])
            GetAroundInCludeVaild(nRow, nCol, vec);

        for(var k in vec)
        {
            var rc2 = vec[k];
            if (! keymap[rc2.m_nRow +"_"+ rc2.m_nCol] )
            {
                keymap[rc2.m_nRow +"_"+ rc2.m_nCol] = true;
                ret.push(rc2);
            }
        }
    }
};

// 每回合结束后每个球触发
var checkWhenOneAfter = function(gameLayer){
    for(var k in gameLayer.m_board)
    {
        var bubble = gameLayer.m_board[k];
	    if(!bubble){
		    continue;
	    }
        bubble.checkOneAfter();
    }

	var checkHoldAround = function(holdRC){
		var vecRowCol = GetAround(holdRC.m_nRow, holdRC.m_nCol);
		//cc.log("vecRowCol len:",vecRowCol.length);
		for(var i in vecRowCol){
			var rc = vecRowCol[i];
			if(gameLayer.m_board[rc.m_nRow+ "_"+ rc.m_nCol])
				return;
		}
		var itemInBoard = gameLayer.m_board[holdRC.m_nRow +"_"+ holdRC.m_nCol];
		if(itemInBoard){
			itemInBoard.clearHitHold();
		}
	}

    //如果是解救3（hit）模式，则要检测所有据点周围是否有全被消除的，有则削除据点
	if(CURRENT_MODE == LEVEL_MODEL.save3){
		for(var j=0;j<gameLayer.curHoldList.length;j++){
			var curHold = gameLayer.curHoldList[j];
			checkHoldAround(curHold);
		}
	}
};

var table_keyof = function(hashtable, value){
    for(var k in hashtable)
    {
        var v = hashtable[k];
        if(v == value)return k;
    }
    return null;
};

// 显示所给球周围的未知泡泡
var showFogForRowCol = function(rowCol,m_board){
    var vecRowCol = []
    GetAround(rowCol.m_nRow, rowCol.m_nCol, vecRowCol);
    for(var i in vecRowCol){
        var pCurBubble = m_board[ rowCol.m_nRow +"_"+ rowCol.m_nCol ];
        if(pCurBubble && pCurBubble.getType() == BUBBLE_TYPE.fog)
        {
            pCurBubble.removeFog();
        }
    }
};

/*
var randomInColorSet = function(curColores){
    var length = curColores.length;
    var randI = randomInt(0, length);
    var color =curColores[randI];
    var bubble = new BubbleSprite(new BubbleBasic({color:color}));
    return bubble;
};*/

// 返回坐标对应在哪个缸
var getCrockIndexByX = function(posX){
	for(var i = 1;i<= 5;i++)
	{
		var x = CROCK_POSX[i]+50; //50偏移量
		if(posX <x)
			return i-1;
	}
	return  4;
}

// id转成真实的关卡ID
var idTrunRealLevel = function(id){
	id = Number(id);
	for(var i in SELECTE_CONFIG){
		var mapData = SELECTE_CONFIG[i];
		for(var j in mapData){
			var data = mapData[j];
			if(data.id == id){
				return id - data.obstacle;
			}
		}
	}
	return id;
}

//值是否相等
var ValueEqual = function(value1, value2){
	//value1, value2存在时
	if(typeof  value1 == "number" && typeof  value2 == "number")
	{
		if(Math.abs(value1 - value2) < 0.001)
			return true;
		else
			return false;
	}
	else if(typeof value1 == "object" && typeof  value2 == "object"){
		if(value1 == null || value2 == null)return false;
		if(value1.length != value2.length)return false;
		for(var key in value1){
			var hasAttr = key in value2;
			if(hasAttr)
			{
				if(!ValueEqual(value1[key], value2[key]))
					return false;
			}
			else
				return false;
		}
		return true;
	}
	else
	{
		return (value1 == value2);
	}
}

// 根据ID找到对应的关卡地图的索引
var findMapCellIdxById = function(id){
	for(var cellIndex in SELECTE_CONFIG){
		var cellData = SELECTE_CONFIG[cellIndex];
		for(var i in cellData){
			var data = cellData[i];
			if(data.id == id)
				return cellIndex;
		}
	}
}

// 根据ID找到对应的关卡地图信息
var getMapDataById = function(id){
	for(var cellIndex in SELECTE_CONFIG){
		var cellData = SELECTE_CONFIG[cellIndex];
		for(var i in cellData){
			var data = cellData[i];
			if(data.id == id)
				return data;
		}
	}
}

// 显示所给球周围的未知泡泡
var showFogForRowCol = function(rowCol,m_board){
	var vecRowCol = GetAround(rowCol.m_nRow, rowCol.m_nCol);
	for(var i in vecRowCol){
		var rowCol = vecRowCol[i];
		var pBubble = m_board[ rowCol.m_nRow +"_"+ rowCol.m_nCol ];
		if(pBubble && pBubble.getType() == BUBBLE_TYPE.fog){
			pBubble.removeFog();
		}
	}
}

// notAddRandom是否加上随机数(默认false增加)，结束时发射的球不需要加随机
var createBubbleByColor = function (color,notAddOffset) {
	var r_color = color;
	if (!notAddOffset) {
		var t = color + RANDOM_OFFSET;
		r_color = t >= MAX_COLOR && (t % MAX_COLOR + 1) || t;
	}

	var pBubble = new BubbleSprite(new BubbleBasic({color: r_color}));
	return pBubble;
}

// 清除所给表中指定行数的球
var clearOneRowByRC = function(rowCol,m_board){
	var list =[];
	for(var i in m_board){
		var pBubble = m_board[i];
		if(pBubble.getRow() == rowCol.m_nRow){
			list.push({m_nRow : rowCol.m_nRow, m_nCol : pBubble.getCol()});
		}
	}
	return list;
}

// 清除所给坐标的周围
var clearAroundByRC = function(rowCol,m_board, excludeRC){
	var list = [];
	var vecRowCol = GetAround(rowCol.m_nRow, rowCol.m_nCol);
	for(var i in vecRowCol){
		var rc = vecRowCol[i];
		if(m_board[rc.m_nRow + "_" + rc.m_nCol]){
			if(!excludeRC || (excludeRC.m_nRow != rc.m_nRow || excludeRC.m_nCol != rc.m_nCol)){
				list.push(rc);
			}
		}
	}
	return list;
}

// 发射球周围碰撞触发检测（特殊球是否触发）
// rowCol为定位后的坐标
var checkSpecialHit = function(rowCol,m_board,curShotBubbleModel){
	var vecRowCol = GetAround(rowCol.m_nRow, rowCol.m_nCol);

	// 魔法泡泡道具特殊处理
	var shotBubble = m_board[ rowCol.m_nRow+"_"+ rowCol.m_nCol ];
	if(shotBubble) {
		if (shotBubble.getItemId() == ITEM_ID.magic) {
			shotBubble.showMagicEffect();
			var normalList = [];
			var specialList = [];
			for (var i in vecRowCol) {
				var rc = vecRowCol[i];
				var bubble = m_board[rc.m_nRow + "_" + rc.m_nCol];
				if (bubble) {
					if (bubble.getType() == BUBBLE_TYPE.normal) {
						normalList.push(bubble);
					}
					else if (bubble.getType() == BUBBLE_TYPE.black
						|| bubble.getType() == BUBBLE_TYPE.fog
						|| bubble.getType() == BUBBLE_TYPE.color
						|| bubble.getType() == BUBBLE_TYPE.dragon
						|| bubble.getType() == BUBBLE_TYPE.alpha) {
						specialList.push(bubble);
					}
				}
			}
			var normalListLen = normalList.length;
			var specialListLen = specialList.length;
			//cc.log("normalListLen:", normalListLen);
			//cc.log("specialListLen", specialListLen);
			if (normalListLen > 0) {
				normalList[randomInt(0, normalListLen - 1)].hit(rowCol, curShotBubbleModel);
			}
			if (specialListLen > 0) {
				specialList[randomInt(0, specialListLen - 1)].hit(rowCol, curShotBubbleModel);
			}
			return;
		}
		else if (shotBubble.getItemId() == ITEM_ID.rainbow || shotBubble.getItemId() == ITEM_ID.iceCream) {
			// 冰淇沐、彩虹泡泡道具这里要先清除自身，防止直接打到第一行跟其他球不相撞时不清除自己
			shotBubble.clearMe();
		}
	}

	// 记录透明泡泡
	var alphaList = [];
	for(var i in vecRowCol){
		var rc = vecRowCol[i];
		var bubble = m_board[rc.m_nRow +"_"+ rc.m_nCol];
		if(bubble){
			if(bubble.getType() == BUBBLE_TYPE.alpha){
				alphaList.push(rc);
			}
			else{
				bubble.hit(rowCol,curShotBubbleModel);
			}
		}
	}

	// 找出有效的透明泡泡（这里可能会被炸弹，闪电这种泡泡先削除）
	for(var key in alphaList){
		var rc = alphaList[key];
		var bubble = m_board[rc.m_nRow +"_"+ rc.m_nCol];
		if(!bubble){
			delete  alphaList[key];
		}
	}

	// 设置各透明泡泡的权重值
	var alphaNum = alphaList.length;
	var weightList = [];
	if(alphaNum > 0){
		for(var key in alphaList){
			var rc = alphaList[key];
			rc.weight = 100/alphaNum;
			weightList.push(rc);
		}
		var selectedRc = weightList[randWeight(weightList, "weight")];
		m_board[selectedRc.m_nRow +"_"+ selectedRc.m_nCol].hit(rowCol,curShotBubbleModel);
	}
}

//重新排序
var reorderRC = function(row, col, dir){
	var vecRowCol = GetAround(row, col);
	var reorderRCList = [];
	var order = {
		clockwise:{
			even:[3, 5, 0, 4, 2, 1],
			odd:[5, 3, 0, 2, 4, 1]

		},
		counterclockwise:{
			even:[2, 4, 0, 5, 3, 1],
			odd:[4, 2, 0, 3, 5, 1]
		}
	}
	var setOderList = function(arr){
		for(var i = 0; i < arr.length;i++){
			reorderRCList.push(vecRowCol[arr[i]]);
		}
	}
	// 奇偶行数不同处理
	// 顺时针
	if(Number(dir) == 1){
		if( row%2 == 0 ){
			setOderList(order.clockwise.even);
		}
		else{
			setOderList(order.clockwise.odd);
		}
	}
	//逆时针
	else{
		if( row%2 == 0 ){
			setOderList(order.counterclockwise.even);
		}
		else{
			setOderList(order.counterclockwise.even);
		}
	}
	return reorderRCList;
}
var checkRevolveWheel = function(revolveWheelList, m_board, moveBubbleRCList){
	var checkedRevolve = {}; // 检测过的转轮
	//找到所有转轮周围的泡泡
	for(var key in revolveWheelList){
		var centerBubble = revolveWheelList[key];
		if(centerBubble.getModel().isRevolve){
			var thisAroundList = []; //当前圈周围所有泡泡
			//找到连接转轮一圈周围的泡泡
			var findMoveBubble = function (bubble, begIdx) {
				var _key = bubble.getRow()+"_"+bubble.getCol();
				if (!checkedRevolve[_key]) {
					checkedRevolve[_key] = true;
					var vecRowCol = reorderRC(bubble.getRow(), bubble.getCol(), bubble.getModel().attributes.revolveDir);
					var idx = begIdx;
					var firstPushFlag = false;
					var firstRC = {};
					for(var count = 0; count <= 5; count++){
						var rc = vecRowCol[idx];
						var bubble = m_board[rc.m_nRow+"_"+rc.m_nCol];
						if (bubble && bubble.getModel().attributes.revolveDir) {
							if(firstPushFlag){  //保证第一个不为转轮,跳过的转轮会在最后一次迭代
								findMoveBubble(bubble, idx-1>=0?idx-1:5);
							}
						}
						else {
							if(!firstPushFlag){
								thisAroundList.push({m_nRow: rc.m_nRow, m_nCol: rc.m_nCol});
								firstRC[rc.m_nRow+"_"+rc.m_nCol] = true;
								firstPushFlag = true;
							}
							else{
								if(firstRC[rc.m_nRow+"_"+rc.m_nCol])		 //绕行一圈
									return thisAroundList;
								else
									thisAroundList.push({m_nRow: rc.m_nRow, m_nCol: rc.m_nCol});
							}
						}
						idx++;
						if(idx >= 6)idx=0;
					}
					return thisAroundList;
				}
			}
			if(findMoveBubble(centerBubble, 0))
				moveBubbleRCList[centerBubble.getRow()+"_"+centerBubble.getCol()]=thisAroundList;
		}
	}
}

var moveRevolveWheel = function(revolveWheelList, m_board, callback, moveBubbleRCList){
	//老鼠跑动动画
	for(var key in revolveWheelList) {
		var centerBubble = revolveWheelList[key];
		if(!centerBubble){
			continue;
		}
		if (centerBubble.getModel().isRevolve) {
			centerBubble.playRevolveAni();
		}
	}
	//旋转所有圈的球
	var revolveCycleNums = getOwnProperyLength(moveBubbleRCList);
	//cc.log("圈数：", revolveCycleNums);
	if(revolveCycleNums > 0){
		for(var i in moveBubbleRCList){
			var revolveCycle = moveBubbleRCList[i];
			var revolveCycleBubNums = revolveCycle.length;
			//cc.log("一圈循环的泡泡数：", revolveCycleBubNums);
			if(revolveCycleBubNums > 0){
				//移动到下一个节点
				var firstBubble = m_board[revolveCycle[0].m_nRow+"_"+revolveCycle[0].m_nCol];
				var moveToNextInCycle = function(index){
					var rc = revolveCycle[index];
					var trargetRC = revolveCycle[ index == revolveCycleBubNums -1 ? 0 : index + 1 ];
					var bubble = (index == 0?firstBubble:m_board[ rc.m_nRow +"_"+  rc.m_nCol ]);
					if(bubble){
						m_board[ trargetRC.m_nRow +"_"+ trargetRC.m_nCol ] = bubble;
						bubble.setRow(trargetRC.m_nRow);
						bubble.setCol(trargetRC.m_nCol);
						bubble.initAroundList();
						bubble.stopAllActions();
						bubble.runAction(cc.moveTo(0.5, getPosByRowAndCol(trargetRC.m_nRow, trargetRC.m_nCol)));
					}
					else{
						delete m_board[ trargetRC.m_nRow +"_"+ trargetRC.m_nCol ];
					}
				}
				//循环移动所有节点
				var idx = revolveCycleBubNums-1;
				while(idx >= 0){
					moveToNextInCycle(idx);
					idx--;
				}
			}
		}
	}
	//回调函数
	if(callback)callback();
}

var createItemBubbleById=function(id){
	return new BubbleSprite(new BubbleBasic({itemId:id,color:-1}));
}

var realLevelTurnId=function(levelId) {
	var levelId = Number(levelId);
	for (var index in SELECTE_CONFIG) {
		var data = SELECTE_CONFIG[index];
		for (var _index in data) {
			var infor = data[_index];
			if (infor.id - infor.obstacle == levelId) {
				return infor.id;
			}
		}
	}
	return levelId;
}

var clone =function(object){
	if(typeof(object)=="object"){
		var cloned={};
		for(var prop in object){
			if(prop=="model"){
				cloned[prop]=clone(object[prop]);
			}else{
				if(typeof(object[prop])=="function"){
					cloned[prop]=function(){
						return object[prop].apply(cloned,arguments);
					}
				}else{
					cloned[prop] = object[prop];
				}
			}
		}

		return cloned;
	}
}

/*
var performWithDelay=function(node,callback,delay){

	var action = new cc.sequence(
		new cc.delayTime(delay),
		new cc.callFunc(callback)
	);
	node.runAction(action);
	return action;
}
*/

/*
var network={};

network.createHTTPRequest=function(callback, url, method)
	if not method then method = "GET" end
	if string.upper(tostring(method)) == "GET" then
	method = cc.GET;
	else
	method = cc.POST;
	end
	cc.HttpMethod
	return cc.HTTPRequest:createWithUrl(callback, url, method)
end
*/


