/**
 * Created by beyondray on 2015/8/28.
 * Desc: 一些动画表现
 */
//=======================
// Desc: 无限旋转动画
//=======================
var repeatAroundAction = function(time){
	var action1 = new cc.RotateTo(time, -180);
	var action2 = new cc.RotateTo(time, -360);
	var repeatAction = new cc.repeatForever(new cc.Sequence(action1, action2));
	return repeatAction;
}


//============================
// Desc: 被打到的球周围抖动
//============================
var rangeConstant = 10;
var rangeConstant2 = 6;
// 奇数行
var crowdRange = new Array(2);
crowdRange[0] = [
	{x : 0,y : 0}, // 中心点不变
	{x : -rangeConstant,y : 0},
	{x : rangeConstant,y : 0},
	{x : -rangeConstant,y : rangeConstant},
	{x : -rangeConstant,y : -rangeConstant},
	{x : rangeConstant,y : rangeConstant},
	{x : rangeConstant,y : -rangeConstant}
];
crowdRange[1] = [
	{x : -rangeConstant2,y : 0},
	{x : -4,y : 3},
	{x : -4,y : -3},
	{x : rangeConstant2,y : 0},
	{x : 4,y : 3},
	{x : 4,y : -3},
	{x : 0,y : rangeConstant2},
	{x : -3,y : 4},
	{x : 0,y : -rangeConstant2},
	{x : -3,y : -4},
	{x : 3,y : 4},
	{x : 3,y : -4}
];

// 偶数行
var crowdRange2 = new Array(2);
crowdRange2[0] = [
	{x : 0,y : 0}, // 中心点不变
	{x : -rangeConstant,y : 0},
	{x : rangeConstant,y : 0},
	{x : rangeConstant,y : rangeConstant},
	{x : rangeConstant,y : -rangeConstant},
	{x : -rangeConstant,y : rangeConstant},
	{x : -rangeConstant,y : -rangeConstant}
];

crowdRange2[1] = [
	{x : -rangeConstant2,y : 0},
	{x : -4,y : 3},
	{x : -4,y : -3},
	{x : rangeConstant2,y : 0},
	{x : 4,y : 3},
	{x : 4,y : -3},
	{x : 0,y : rangeConstant2},
	{x : 3,y : 4},
	{x : 0,y : -rangeConstant2},
	{x : 3,y : -4},
	{x : -3,y : 4},
	{x : -3,y : -4}
];

//抖动效果
var crowdEffect = function(board, rcList, speedx, speedy, deltaDistance,index,centerRc){
	for(var i in rcList)
	{
		var rc = rcList[i];
		var bubble = board[rc.m_nRow +"_"+ rc.m_nCol];
		if(bubble)
		{
			var oldx = bubble.getPositionX();
			var oldy = bubble.getPositionY();
			var temp = [];
			if (centerRc.m_nRow % 2 == 0)
				temp = crowdRange2;
			else
				temp = crowdRange;

			var deltax= temp[index][i].x;
			var deltay = temp[index][i].y;

			//抖动动画
			bubble.runAction(
				new cc.Sequence(
					new cc.MoveTo(0.03, cc.p(oldx+deltax, oldy+deltay)),
					new cc.MoveTo(0.3, cc.p(oldx, oldy))
				)
			)
		}
	}
};

//=======================
// Desc: 延迟表现
//=======================
var performWithDelay = function(Obj, callback, delay){
	var action = new cc.Sequence(new cc.DelayTime(delay),new cc.CallFunc(callback));
	Obj.runAction(action);
	return action;
};


