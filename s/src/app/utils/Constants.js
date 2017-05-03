/*
* Created by beyondray on 2015/7/22.
* Desc: 一些常量定义
*/
var PI                  =   Math.PI;
//位置相关
var BUBBLE_RADIUS       =   32.72;                        // 球的半径  720/11/2
var BUBBLE_SPEED        = 60*60;          //球速(每帧球移动的球速为60/2=30)

var COLLISON_OFFSET     =   11;             //碰撞检测比真实半径小的数量
var ROUND_ATTENUATION   =   0.03;           //旋转速度衰减值（越大则旋转变慢的越快）
var ROUND_MAX_SPEED     =   50;             //旋转最大速度
var SHOT_ANGLE          =   18;             //发射角度
var GEND_TOPNULLBUBS   =   6;              //顶排空位为?时游戏结束
var CHECK_BUB_SPEED     = 60;

var MAX_WAIT_BUBBLE	    =   1;              // 最多有几个等待发射球（暂时只能为1）
var MAX_ROWS			=   11;             //这个值由外部配置文件重载
var MAX_COLS			=   11;             //这个值由外部配置文件重载


//颜色相关
var MAX_RANDOM          =   5;              //最大随机数，这个值由外部配置文件重载（MAX_RANDOM最大为5 即：MAX_COLOR-1）
var RANDOM_OFFSET       =   0;              // 当前随机数，用于加到所有球的颜色值上
var MAX_COLOR           =   6;              // 总共6种颜色球 从1 - 6 ：红粉蓝绿黄 随机


var BOARD_EXTRA_SIZE    =   10;
var REMOVE_COUNT		=   3;              //多少个可以消除

var CURRENT_MODE        =   "classic";      //当前游戏的模式
var ROW_HEIGHT          =   33;             //实际行高（动态计算）
var UNIQUE_COUNT        =   3;              //多少回合内允许一样颜色
var MAX_HP              =   5;              // 最大生命值,5
var MAX_HP_INCLUE_ACTIVE=   10;             // 最大生命值包括活动赠送的生命
var RESET_TIME          = 60*30;                 //-- 30分钟恢复一条生命
var FREE_HEAR_TIME      = 3600*2; //-- 无限生命时长
var OBSTACLE_TIME       = 3600 * 24; //-- 障碍解禁时间24小时

var DOUBLE_TRUE_ITEM    =   8;              // 连击8次后发射球随机变了一个道具球
var DEFAULT_HEAD_ICO    =   "#default_user_head.png"; // 默认用户头像

var SHOT_BUBBLE_DEP     =   12;     //发射球的层
var SWAP_BUBBLE_DEP     =   10;     //交换球的层

var DESIGN_WIDTH        =   720;    // 设计宽高
var DESIGN_HEIGHT       =   1280;


var UI_CENTER_OFFER_X   =   10;                              // 弹框居中偏移修正量


var INPUT_MODEL         =   false;  // 控制关卡是否手动输入
var AUTO_UPDATE         =   false;  // 是否自动更新
var IN_DEBUG            =   false;  // 控制是否在安卓上调用JAVA端接口，测试时为true
var SHOW_AD             =   true;   // 控制是否显示广告
var SHOW_AD_LEVEL       =   15;     // 控制15关后显示广告
var SHOW_RATE_LEVEL     =   10;     // 控制如果没评价过则10的倍数显示评价

// 用于返回键功能
var SETUP_TAG = 300; // 设置栏TAG
var POP_WIN_TAG = 330; //弹出提示窗TAG
var MIDDLE_WIN_TAG = 350; //中层弹出提示窗TAG
var  TOP_POP_WIN_TAG = 360; // 最上层提示窗TAG
var MSG_POP_WIN_TAG = 390; // 最上层消息提示窗TAG

// 物理相关
var GRA                 =   980;
var GRAVITY         = -1000;
var BUBBLE_MASS     =   1;    //球的质量
var BUBBLE_DENSITY       = 0;   // 球的密度 它被用于计算母体的质量属性。
var BUBBLE_FRICTION   = 0;      //球的摩擦力  它被用于进行物体间的相对运动。
var BUBBLE_ELASTICITY = 0.8;    //球的弹性 0-1之间 0说明不反弹，1说明完全反弹
var WALL_FRICTION   = 0;        //墙壁(接球盒子)的摩擦力  它被用于进行物体间的相对运动。
var WALL_ELASTICITY = 0.9;      //墙壁(接球盒子)的弹性 0-1之间 0说明不反弹，1说明完全反弹
var WALL_THICKNESS  = 64;
var BOTTOM_BOX_GROUP_TAG = 2;   //接球盒子group标记
var ZZ_GROUP_TAG        = 3;    //蜘蛛group标记
var ZZ_RADIUS           = 25;   //蜘蛛半径
var PHYSIC_TYPE = {
	BUBBLE : 1,//泡泡球物理类型
	STATIC: 2  //静态物理类型
}

/*
--[[
	* 取值在 1~10 之间，“1”已经被预先定义为“系统奖励”， 2~10 需要在网站设置含义
* @author ntop
*
]]
*/
BonusTrigger = {
	FROM_OTHER_PLAYER : 2, //--玩家赠送(1), 相互送生命
FROM_DAILY_LOGIN : 3,  //--开发商赠送(2) 每日登陆奖励
FROM_UNLOCK : 4, //--游戏奖励(3) 解锁时奖励道具
FROM_TIME_RESET : 5 //--时间恢复的生命奖励
};

// 舌头动画信息
CROCK_TONGUE_ANI_INFOR = new Array(5);
CROCK_TONGUE_ANI_INFOR[0] =
{
	flip : true,
	name : "crock3",
	p : cc.p(85,70)
},
CROCK_TONGUE_ANI_INFOR[1] =
{
	flip : true,
	name : "crock2",
	p : cc.p(20,60)
},
CROCK_TONGUE_ANI_INFOR[2] =
{
	flip : false,
	name : "crock1",
	p : cc.p(23,39)
},
CROCK_TONGUE_ANI_INFOR[3] =
{
	flip : false,
	name : "crock2",
	p : cc.p(25,60)
},
CROCK_TONGUE_ANI_INFOR[4] =
{
	flip : false,
	name : "crock3",
	p : cc.p(10,70)
}
// 眼睛动画信息
CROCK_EYE_ANI_INFOR = new Array(5);
CROCK_EYE_ANI_INFOR[0]  =
{
	flip : false,
	name : "eye1",
	p : cc.p(40,137)
},
CROCK_EYE_ANI_INFOR[1]  =
{
	flip : false,
	name : "eye2",
	p : cc.p(34,140)
},
CROCK_EYE_ANI_INFOR[2]  =
{
	flip : false,
	name : "eye3",
	p : cc.p(42,113)
},
CROCK_EYE_ANI_INFOR[3]  =
{
	flip : false,
	name : "eye4",
	p : cc.p(58,136)
},
CROCK_EYE_ANI_INFOR[4]  =
{
	flip : false,
	name : "eye5",
	p : cc.p(98,142)
}

var BUB_ANI_PHASE = {
	start: "start",
	process: "process",
	hit: "hit",
	over: "over"
}
/*
 0普通泡泡：带颜色可以消除掉落的泡泡。

 1黑心泡泡：无法被消除只能掉落的特殊泡泡。

 2闪电泡泡：触碰一次之后放出闪电，消除所在行的所有泡泡。

 3未知泡泡：触碰一次或者周围有一个泡泡消除时显示泡泡真正颜色。

 4炸弹泡泡：能把自己和触碰到的泡泡周围的泡泡炸没。

 5变色泡泡（自创）：被发射的球碰到或者周围有泡泡被消除，若没有被消除则随后变换颜色，若三回合没有被变换颜色则自动变换颜色，颜色只会在界面上存在的颜色之间规律变换。

 6泡泡三合一：触碰一次后增加额外的三颗球。掉落不加球数。

 7透明泡泡（自创）：碰撞后发射的泡泡直接代替透明泡泡的位置。若周围有泡泡被消除，透明泡泡也会被消除。

 8泡泡龙：每过三回合，泡泡龙会吐出3个普通泡泡随机出现在游戏中。
 */
var BUBBLE_TYPE = {
	normal  : 0,
	black : 1,
	flash : 2,  //一个球的周围不能同时有两个闪电
	fog : 3,    //
	bomb : 4,   //一个球的周围不能同时有两个炸弹
	color : 5,
	three : 6,
	alpha : 7,
	dragon : 8,     // 不在在旋转模式下放在中心点周围一圈
	saveAlpha : 9,  //- 解救模式中的占位透明球
	hitAlpha  : 10, // 解救模式3中的占位透明球
	save2Alpha: 11, // 解救模式2中的占位透明球
	revolveWheel : 12, // 旋转转轮
	center  : 88 //旋转模式的中心点球
};

// 不同连击显示的颜色
/*var DOUBLE_COLOR = new Array(5);
DOUBLE_COLOR[0] = cc.color(0, 0, 0, 1);
DOUBLE_COLOR[1] = cc.color(255, 0, 0, 1);
DOUBLE_COLOR[2] = cc.color(255, 255, 0, 1);
DOUBLE_COLOR[3] = cc.color(255, 0, 255, 1);
DOUBLE_COLOR[4] = cc.color(0, 0, 255, 1);*/

// 按钮上的字的颜色值
var BTN_TEXT_COLOR_BLUE = display.COLOR_BLUE; //cc.c3b(0,13,90)



// 球发射的状态
var GAME_STATE ={
		GS_START  : 1,
		GS_FLY    : 2,
		GS_HITED  : 3,  //球碰到定位
		GS_FALL   : 4,
		GS_END    : 5,
		GS_CHANGE : 6,
		GS_SHOWEND : 7
};

// 关卡模式
var LEVEL_MODEL = {
	classic : "classic",
	save  : "save",
	wheel : "wheel",
	save2  : "save2", // 少关卡用到
	save3  : "save3", // hit
	time : "time"
};

//  不同模式对应的关卡信息
 var LEVEL_MODEL_INFO = {
	//wheel : {text : "Free the ghost", img : "#explain_wheel.png"}
	 classic : {text : "解救蝴蝶", img : res.Explain_save},
	 save  : {text : "解救伙伴", img : res.Explain_save},
	 wheel : {text : "拯救精灵", img : res.Explain_save},
	 save2  : {text : "解救蝴蝶", img : res.Explain_save}, //-- 少关卡用到
	save3  : {text : "打倒兔子", img : res.Explain_save}, //-- hit
	time : {text : "解救蝴蝶", img : res.Explain_save}
};

// 初始时球的深度,索引为BUBBLE类型
var BUBBLE_DEPTH = new Array(14);
BUBBLE_DEPTH[0] = 1;
BUBBLE_DEPTH[1] = 2;
BUBBLE_DEPTH[2] = 3;
BUBBLE_DEPTH[3] = 4;
BUBBLE_DEPTH[4] = 21;
BUBBLE_DEPTH[5] = 5;
BUBBLE_DEPTH[6] = 6;
BUBBLE_DEPTH[7] = 7;
BUBBLE_DEPTH[8] = 8;
BUBBLE_DEPTH[9] = 9;
BUBBLE_DEPTH[10] = 10;
BUBBLE_DEPTH[11] = 11;
BUBBLE_DEPTH[12] = 24;
BUBBLE_DEPTH[13] = 88;

/*	[BUBBLE_TYPE.normal] : 1,
	[BUBBLE_TYPE.black] : 2
	[BUBBLE_TYPE.flash] : 3,
	[BUBBLE_TYPE.fog] : 4,
	[BUBBLE_TYPE.bomb] : 21,
	[BUBBLE_TYPE.color] : 5,
	[BUBBLE_TYPE.three] : 6,
	[BUBBLE_TYPE.alpha] : 7,
	[BUBBLE_TYPE.dragon] : 8,
	[BUBBLE_TYPE.saveAlpha] : 9,
	[BUBBLE_TYPE.hitAlpha] : 10,
	[BUBBLE_TYPE.save2Alpha] : 11,
    [BUBBLE_TYPE.revolveWheel] : 24,
	[BUBBLE_TYPE.center] : 88*/


// 道具类型
/*
	3.1游戏开始前道具
	1.冰球泡泡：摧毁一条路上所有的泡泡，碰撞顶部、精灵、2次碰撞侧壁后消失。

2.+10颗糖果泡泡：加10颗泡泡。

3.魔法球：发射一颗泡泡，让接触的一种泡泡或者有害特殊泡泡都变成另一种泡泡，若与2种泡泡同时接触，有害泡泡优先于普通泡泡，2种普通泡泡或以上则随机变换其中一种，变成的泡泡为该关卡自有的，不会出现多出一种泡泡的现象。


3.2游戏开始后道具：
1.彩虹泡泡：可以当成任何一种泡泡，不仅使触碰到的泡泡消除，更可以消除不接触但与接触的泡泡颜色相同的泡泡，但不能消除特殊泡泡。

2.冰淇淋泡泡：消除任何触碰到的泡泡，包括特殊泡泡。

3.加三步
*/

var ITEM_ID = {
	ice : 1,
	addTen : 2, // 主动触发
	magic : 3,
	rainbow : 4,
	iceCream : 5,
	addThree : 6
};

ITEM_INFOR = {};


//-- 续命道具（加5步和一个彩虹球）
RESUME_GAME_ITEM = 7;


HP_ITEM_ID = 8; //-- 生命ID
HP_PRICE = 12; //-- 生命价格


//--一条生命ID及价格
ONE_BONUS_HP = {
	name : "One Life",
	id : 10,
	price : 2.4,
	um_itemId : "One_Life"
};


//-- 购买成功后显示框内显示的图片
PAY_SUCCEES_ITEM_INFOR = {
	1: { image : res.Item_ico_off1},
	2: { image : res.Item_ico_off2},
	3: { image : res.Item_ico_off3},
	4: { image : res.Item_ico_off4},
	5: { image : res.Item_ico_off5},
	6: { image : res.Item_ico_off6},
	7: { image : res.Item_ico_off7},
	8: { image : res.HP_heartes},
	9: { image : res.Unlock_ico}
}

//-- 道具解锁配置
ITEM_UNLOCK = {
	2 : { itemId : ITEM_ID.rainbow, dec : "恭喜您! 获得一个道具" },
	7 : { itemId : ITEM_ID.iceCream , dec : "恭喜您! 获得一个道具" },
	11 : { itemId : ITEM_ID.ice , dec : "恭喜您! 获得一个道具" },
	16 : { itemId : ITEM_ID.addTen , dec : "恭喜您! 获得一个道具" },
	18 : { itemId : ITEM_ID.addThree , dec : "恭喜您! 获得一个道具" },
	21 : { itemId : ITEM_ID.magic , dec : "恭喜您! 获得一个道具" }
}

//-- 新手引导配置
NEW_GUIDE = {
	1 : {
	image : "res/texture/dontPack/newGuide/1.png",
	dec : "Save the elf by eliminate all bubbles around him!",
	},
	2 : {
	image : "res/texture/dontPack/newGuide/2.png",
	dec : "Eliminate 6 top bubbles to win this level!",
	},
	3 : {
	image : "res/texture/dontPack/newGuide/3.png",
	dec : "Use rainbow bubble to match with any color bubble!",
	},
	4 : {
	image : "res/texture/dontPack/newGuide/4.png",
	dec : "Use the walls' rebound to reach higher bubbles!",
	},
	5 : {
	image : "res/texture/dontPack/newGuide/5.png",
	dec : "You have a limited number of shots to complete the level!",
	},
	6 : {
	image : "res/texture/dontPack/newGuide/6.png",
	dec : "Swith shotting bubbles by tapping the shoot area!",
	},
	7 : {
	image : "res/texture/dontPack/newGuide/7.png",
	dec : "Some levels' time is limited!",
	},
	8 : {
	image : "res/texture/dontPack/newGuide/8.png",
	dec : "Use the Ice cream bubble to eliminate all access to the bubble!",
	},
	9 : {
	image : "res/texture/dontPack/newGuide/9.png",
	dec : "Aim carefully!Aiming Line can help you to do better!",
	},
	11:  {
	image : "res/texture/dontPack/newGuide/11.png",
	dec : "Break out the bubbles where animals are trapped inside to save them!",
	},
	12 : {
	image : "res/texture/dontPack/newGuide/12.png",
	dec : "Shoot the Ice Bubble to remove everything in its way! Even blockers!",
	},
	13 : {
	image : "res/texture/dontPack/newGuide/13.png",
	dec : "Shooting chocolate! Something was trapped inside!",
	},
	15 : {
	image : "res/texture/dontPack/newGuide/15.png",
	dec : "Move finger under the Launching pad, control the aiming line!",
	},
	16 : {
	image : "res/texture/dontPack/newGuide/16.png",
	dec : "We have to get rid of all these Black Bubbles to keep going up!",
	},
	23 : {
	image : "res/texture/dontPack/newGuide/23.png",
	dec : "Use magic bubble to transform all elements to same color bubble!",
	},
	24 : {
	image : "res/texture/dontPack/newGuide/24.png",
	dec : " Shot the Blast Bubble to remove all the bubbles which are on the same line!",
	},
	31 : {
	image : "res/texture/dontPack/newGuide/31.png",
	dec : "Shot chocolate bubble to find out true color of this bubble!",
	},
	41 : {
	image : "res/texture/dontPack/newGuide/41.png",
	dec : "Touch the bomb bubble to create an explosion that removes all surrounding bubbles!",
	},
	56 : {
	image : "res/texture/dontPack/newGuide/56.png",
	dec : "Every 3 rounds, a color bubble changes it's color.",
	},
	71 : {
	image : "res/texture/dontPack/newGuide/71.png",
	dec : "Shot the +3 bubbles to get 3 extra shotting chances!",
	},
	86 : {
	image : "res/texture/dontPack/newGuide/86.png",
	dec : "When shotting bubble reach the transparent bubble, it will be inhaled instead!",
	},
	101 : {
	image : "res/texture/dontPack/newGuide/101.png",
	dec : "When gthemo opens its mouth fully ,it will spawn 3 new bubbles!",
	}
};

// 地图信息
MAX_LEVEL           = 105;  // 总共多少关(包括障碍)

SELECTE_CONFIG = {
	1 : [{isObstacle : false, obstacle : 0, model : "wheel",id : 1, x : 190.2, y : 91.05}],
2 : [
{aniData : {
	1 : {
	name : "storehouse",
	p : cc.p(227,90),
	// scale : 1.3,
	flip : false
},
	2 : {
	name : "ripple3",
	p : cc.p(20,95),
	flip : true,
	rotation : 240,
	delay : 1,
	scale : 1.3
	},
	3 : {
	name : "ripple3",
	p : cc.p(400,40),
	flip : false,
	rotation : 110,
	scale : 1
	}
},isObstacle : false, obstacle : 0, model : "wheel",id : 2, x : 161.8, y : 16.2},
{isObstacle : false, obstacle : 0, model : "classic",id : 3, x : 230.15, y : 38.7},
{isObstacle : false, obstacle : 0, model : "classic",id : 4, x : 295.7, y : 66.25},
{isObstacle : false, obstacle : 0, model : "wheel",id : 5, x : 351.5, y : 110.3},
],
3 : [
{aniData : {
	1 : {
	name : "fish",
	p : cc.p(95,75),
	flip : false
	}
},isObstacle : false, obstacle : 0, model : "classic",id : 6, x : 312.6, y : 38.4},
{isObstacle : false, obstacle : 0, model : "classic",id : 7, x : 240.45, y : 60.1},
{isObstacle : false, obstacle : 0, model : "wheel",id : 8, x : 167.15, y : 90.65},
],
4 : [
{aniData : {
	1 : {
	name : "reptile",
	p : cc.p(0,130),
	flip : false
	},
	2 : {
	name : "ripple3",
	p : cc.p(360,70),
	flip : false,
	rotation : 45,
	delay : 1.5,
	scale : 1.3
	}
},isObstacle : false, obstacle : 0, model : "classic",id : 9, x : 104.25, y : 22.3},
{isObstacle : false, obstacle : 0, model : "classic",id : 10, x : 156.75, y : 61},
{isObstacle : false, obstacle : 0, model : "save",id : 11, x : 218.55, y : 83.95},
{isObstacle : false, obstacle : 0, model : "save",id : 12, x : 290.1, y : 105.05}
],
5 : [
{aniData : {
	1 : {
	name : "cetaceanEye",
	p : cc.p(30,90),
	flip : false
	}
},isObstacle : false, obstacle : 0, model : "save3",id : 13, x : 357.1, y : 0},
{isObstacle : false, obstacle : 0, model : "save3",id : 14, x : 400.4, y : 35.1},
{isObstacle : false, obstacle : 0, model : "classic",id : 15, x : 314.3, y : 44.05},
{isObstacle : false, obstacle : 0, model : "wheel",id : 16, x : 230.25, y : 39.9},
{isObstacle : false, obstacle : 0, model : "classic",id : 17, x : 154.8, y : 44.05},
{isObstacle : false, obstacle : 0, model : "wheel",id : 18, x : 80.4, y : 69.6},
{isObstacle : false, obstacle : 0, model : "classic",id : 19, x : 134.7, y : 101.65},
],
6 : [
{aniData : {
	1 : {
	name : "spray",
	p : cc.p(55,32),
	flip : false
	}
},isObstacle : false, obstacle : 0, model : "time",id : 20, x : 206.1, y : 0},
{isObstacle : false, obstacle : 0, model : "save",id : 21, x : 275.75, y : 7.45},
{isObstacle : false, obstacle : 0, model : "wheel",id : 22, x : 211.8, y : 51},
{isObstacle : false, obstacle : 0, model : "save3",id : 23, x : 141.1, y : 66.75},
{isObstacle : true, obstacle : 1, model : "classic",id : 24, x : 78.6, y : 99.85},
],
7 : [
{aniData : {
	1 : {
	name : "eye",
	p : cc.p(280,120),
	flip : false
	}
},isObstacle : false, obstacle : 1, model : "classic",id : 25, x : 148.6, y : 13.6},
{isObstacle : false, obstacle : 1, model : "time",id : 26, x : 241.5, y : 21.05},
{isObstacle : false, obstacle : 1, model : "classic",id : 27, x : 341.25, y : 30.75},
{isObstacle : false, obstacle : 1, model : "save",id : 28, x : 395.2, y : 83.95},
],
8 : [
{aniData : {
	1 : {
	name : "winnower",
	p : cc.p(75,75),
	flip : false
	}
},isObstacle : false, obstacle : 1, model : "save",id : 29, x : 349.15, y : 25.95},
{isObstacle : false, obstacle : 1, model : "classic",id : 30, x : 265.25, y : 31.85},
{isObstacle : false, obstacle : 1, model : "classic",id : 31, x : 170.9, y : 31.85},
{isObstacle : false, obstacle : 1, model : "classic",id : 32, x : 100.2, y : 59.4},
{isObstacle : false, obstacle : 1, model : "wheel",id : 33, x : 65.2, y : 115.95},
],
9 : [
{aniData : {
	1 : {
	name : "cat",
	p : cc.p(450,0),
	flip : false
	}
},isObstacle : false, obstacle : 1, model : "classic",id : 34, x : 131.1, y : 37.2},
{aniData : {
	1 : {
	name : "panda",
	p : cc.p(52,128),
	flip : false
	}
},isObstacle : false, obstacle : 1, model : "wheel",id : 35, x : 206.4, y : 53.95},
{isObstacle : false, obstacle : 1, model : "time",id : 36, x : 278.95, y : 74.35},
{isObstacle : false, obstacle : 1, model : "wheel",id : 37, x : 336.85, y : 118.4},
],
10 : [
{aniData : {
	1 : {
	name : "sirup",
	p : cc.p(175,45),
	flip : false,
	scale : 1.5,
	delay : 2
	}
},isObstacle : false, obstacle : 1, model : "classic",id : 38, x : 295.35, y : 55.15},

{isObstacle : false, obstacle : 1, model : "save",id : 39, x : 213.5, y : 67.85},
{isObstacle : false, obstacle : 1, model : "wheel",id : 40, x : 122.4, y : 80.5},
],
11 : [
{aniData : {
	1 : {
	name : "ripple",
	p : cc.p(365,103),
	flip : false
	}
},isObstacle : false, obstacle : 1, model : "save3",id : 41, x : 77, y : 16.95},
{aniData : {
	1 : {
	name : "sirup",
	p : cc.p(465,100),
	flip : false,
	scale : 1.5,
	delay : 1.5
	},
	2 : {
	name : "sirup",
	p : cc.p(495,90),
	flip : false,
	delay : 1
	}
},isObstacle : true, obstacle : 2, model : "classic",id : 42, x : 132.05, y : 86.15},
],
12 : [
{aniData : {
	1 : {
	name : "sirup",
	p : cc.p(470,100),
	flip : true,
	scale : 1.5,
	delay : 1.5
	}
	// 2 : {
	// name : "firebug",
		// p : cc.p(460,140),
		// flip : true,
		// }
},isObstacle : false, obstacle : 2, model : "classic",id : 43, x : 113.85, y : 46},
{aniData : {
	1 : {
	name : "tail3",
	p : cc.p(112,145),
	flip : false
	}
},isObstacle : false, obstacle : 2, model : "wheel",id : 44, x : 200.35, y : 65.15},
{isObstacle : false, obstacle : 2, model : "classic",id : 45, x : 282.9, y : 76.7},
{isObstacle : false, obstacle : 2, model : "save",id : 46, x : 356.3, y : 106.05},
],
13 : [
{aniData : {
	1: {
		name: "ripple3",
		p: cc.p(130, 95),
		flip: false,
		delay: 1
	}
},isObstacle : false, obstacle : 2, model : "save",id : 47, x : 281.55, y : 27.75},
{isObstacle : false, obstacle : 2, model : "wheel",id : 48,  x : 348.85, y : 57.5},
{isObstacle : false, obstacle : 2, model : "classic",id : 49, x : 429.2, y : 76.85},
],
14 : [
{aniData : {
	1 : {
	name : "ripple3",
	p : cc.p(225,40),
	flip : false,
	scale : 0.8,
	delay : 1.5
	},
	2 : {
	name : "ripple3",
	p : cc.p(460,115),
	flip : false,
	rotation : 30,
	scale : 0.8
	},
	3 : {
	name : "ripple3",
	p : cc.p(375,110),
	flip : false,
	rotation : 60,
	scale : 0.5
	}
},isObstacle : false, obstacle : 2, model : "classic",id : 50, x : 398.75, y : 6.5},
{isObstacle : false, obstacle : 2, model : "wheel",id : 51, x : 324.85, y : 20.75},
{isObstacle : false, obstacle : 2, model : "wheel",id : 52, x : 241.45, y : 71.2},
{isObstacle : false, obstacle : 2, model : "time",id : 53, x : 160.3, y : 50.55},
{isObstacle : false, obstacle : 2, model : "save3",id : 54, x : 90.35, y : 83.95},
],
15 : [
{aniData : {
	1 : {
	name : "firebug",
	p : cc.p(40,10),
	flip : false
	},
	2 : {
	name : "firebug",
	p : cc.p(460,140),
	flip : true
	}
},isObstacle : false, obstacle : 2, model : "wheel",id : 55, x : 122.4, y : 17.95},
{aniData : {
	1 : {
	name : "squirrel",
	p : cc.p(314,47),
	flip : false
	}
},isObstacle : false, obstacle : 2, model : "classic",id : 56, x : 187.9, y : 47.6},
{isObstacle : false, obstacle : 2, model : "save3",id : 57, x : 262.3, y : 67.65},
{isObstacle : true, obstacle : 3, model : "classic",id : 58, x : 334.4, y : 107.25},
],
16 : [
{aniData : {
	1 : {
	name : "rabbit",
	p : cc.p(50,18),
	flip : false
	}
},isObstacle : false, obstacle : 3, model : "wheel",id : 59, x : 387.45, y : 35.8},
{isObstacle : false, obstacle : 3, model : "save",id : 60, x : 425.4, y : 92.3},
],
17 : [
{aniData : {
	1 : {
	particle : true,
	name : "ditupiaoxue",
	p : cc.p(500,65),
	flip : true
	},
	2 : {
	name : "ripple3",
	p : cc.p(240,30),
	flip : false,
	rotation : 0,
	scale : 1
	},
	3 : {
	name : "ripple3",
	p : cc.p(320,110),
	flip : false,
	rotation : -80,
	scale : 0.8,
	delay : 1
	}
},isObstacle : false, obstacle : 3, model : "wheel",id : 61, x : 371.65, y : 7.45},
{aniData : {
	1 : {
	name : "light",
	p : cc.p(110,102),
	flip : false
	}
},isObstacle : false, obstacle : 3, model : "classic",id : 62, x : 297.85, y : 11.25},
{isObstacle : false, obstacle : 3, model : "classic",id : 63, x : 231.65, y : 55.9},
{isObstacle : false, obstacle : 3, model : "classic",id : 64, x : 157.25, y : 83.95},
],
18 : [
{aniData : {
	1 : {
	name : "light2",
	p : cc.p(73,91),
	flip : false
	},
	2 : {
	name : "ripple3",
	p : cc.p(270,50),
	flip : false,
	rotation : -80,
	scale : 0.6,
	delay : 1.5
	}
},isObstacle : false, obstacle : 3, model : "wheel",id : 65, x : 169.8, y : 24.15},
{isObstacle : false, obstacle : 3, model : "wheel",id : 66, x : 227.85, y : 64.35},
{isObstacle : false, obstacle : 3, model : "time",id : 67, x : 309.7, y : 68.2},
{isObstacle : false, obstacle : 3, model : "wheel",id : 68, x : 368.5, y : 24.15},
{isObstacle : false, obstacle : 3, model : "save",id : 69, x : 399, y : 80.7},
],
19 : [
{aniData : {
	1 : {
	name : "light_2",
	p : cc.p(82,56),
	flip : false
	}
},isObstacle : false, obstacle : 3, model : "save3",id : 70, x : 332.3, y : 0},
{aniData : {
	1 : {
	name : "spoondrift",
	p : cc.p(130,55),
	flip : false
	}
},isObstacle : false, obstacle : 3, model : "classic",id : 71, x : 297.35, y : 71.75},
],
20 : [
{isObstacle : false, obstacle : 3, model : "classic",id : 72, x : 227.5, y : 0},
{isObstacle : false, obstacle : 3, model : "wheel",id : 73, x : 125.55, y : 13.35},
{isObstacle : true, obstacle : 4, model : "classic",id : 74, x : 199.3, y : 79.45},
],
21 : [
{aniData : {
	1 : {
	particle : true,
	name : "ditupiaoxue",
	p : cc.p(500,65),
	flip : true
	}
},isObstacle : false, obstacle : 4, model : "classic",id : 75, x : 191.65, y : 32},
{isObstacle : false, obstacle : 4, model : "save3",id : 76, x : 269.85, y : 47.2},
{isObstacle : false, obstacle : 4, model : "classic",id : 77, x : 341.6, y : 61.25},
{isObstacle : false, obstacle : 4, model : "save3",id : 78, x : 321.55, y : 105.3},
{isObstacle : false, obstacle : 4, model : "save",id : 79, x : 250.35, y : 105.3},
{isObstacle : false, obstacle : 4, model : "classic",id : 80, x : 172.25, y : 105.3},
],
22 : [
{isObstacle : false, obstacle : 4, model : "classic",id : 81, x : 95.5, y : 4.45},
{isObstacle : false, obstacle : 4, model : "time",id : 82, x : 132.85, y : 54.25},
{isObstacle : false, obstacle : 4, model : "wheel",id : 83, x : 207.25, y : 83.95},
{isObstacle : false, obstacle : 4, model : "save",id : 84, x : 282.45, y : 98.3},
],
23 : [
{isObstacle : false, obstacle : 4, model : "classic",id : 85, x : 332.65, y : 21.65},
{isObstacle : false, obstacle : 4, model : "wheel",id : 86, x : 265.7, y : 65.7},
{isObstacle : false, obstacle : 4, model : "save",id : 87, x : 194.95, y : 89.6},
],
24 : [
{aniData : {
	1 : {
	name : "volcano",
	p : cc.p(80,20),
	flip : true
	}
},isObstacle : false, obstacle : 4, model : "classic",id : 88, x : 192.1, y : 21.5},
{isObstacle : false, obstacle : 4, model : "wheel",id : 89, x : 250.1, y : 65.55},
],
25 : [
{aniData : {
	1 : {
	name : "bird",
	p : cc.p(89,19),
	flip : false
	}
},isObstacle : true, obstacle : 5, model : "classic",id : 90, x : 257.55, y : 27.4},
{isObstacle : false, obstacle : 5, model : "classic",id : 91, x : 267.95, y : 107.45},
],
26 : [
{aniData : {
	1 : {
	name : "reptile2",
	p : cc.p(283,85),
	flip : false
	}
},isObstacle : false, obstacle : 5, model : "wheel",id : 92, x : 191.7, y : 26.05},
{isObstacle : false, obstacle : 5, model : "wheel",id : 93, x : 109.05, y : 53.55},
{isObstacle : false, obstacle : 5, model : "save3",id : 94, x : 39.9, y : 97.6},
],
27 : [
{aniData : {
	1 : {
	name : "cacti",
	p : cc.p(61,117),
	flip : false
	}
},isObstacle : false, obstacle : 5, model : "save",id : 95, x : 87.15, y : 27.4},
{isObstacle : false, obstacle : 5, model : "wheel",id : 96, x : 169, y : 35.35},
{isObstacle : false, obstacle : 5, model : "save",id : 97, x : 246.35, y : 40.9},
{isObstacle : false, obstacle : 5, model : "save",id : 98, x : 315.55, y : 75.9},
],
28 : [
{aniData : {
	1 : {
	name : "ripple4",
	p : cc.p(185,60),
	flip : false
	}
},isObstacle : false, obstacle : 5, model : "time",id : 99, x : 362.05, y : 15.1},
{isObstacle : false, obstacle : 5, model : "classic",id : 100, x : 301, y : 63.5},
{isObstacle : false, obstacle : 5, model : "classic",id : 101, x : 207.25, y : 83.95},
{isObstacle : false, obstacle : 5, model : "save",id : 102, x : 124.7, y : 83.95},
{isObstacle : false, obstacle : 5, model : "wheel",id : 103, x : 33.15, y : 96.6},
],
29 : [
{aniData : {
	1 : {
	name : "etelight",
	p : cc.p(435,7),
	flip : false
	}
},isObstacle : false, obstacle : 5, model : "save",id : 104, x : 81.15, y : 22.25},
{aniData : {
	1 : {
	comingsoon : true,
	name : res.Cloud1_png,
	p : cc.p(109,175)
	},
	2 : {
	comingsoon : true,
	name : res.Cloud2_png,
	p : cc.p(350,130)
	}
},isObstacle : false, obstacle : 5, model : "wheel",id : 105, x : 155.55, y : 52.05},
],
30 : {
},
	31 : {
},
	32 : {
}
}

// 系统提示信息
var Failure = res.Failure; // 购买、登陆等失败提示框的标题
// ConnectionFailed = "Connection Failed"
var ConnectionFailedTip = "No internet connection was found.\nPlease try again later."; // 请联网
var BuySuccess = res.Title_buy_success; // 购买成功
var Disconnected = "#Disconnected.png"; // 退出FB

//【登录信息】
SysMsg = [
	{
		placeHolder:true

	},
	{
		type : 1,
		text : "Update Failed! Please make sure your network is open and retry"
	},
	// FB登陆失败
	{
		type : 2,
		text : ConnectionFailedTip
	},
	// 退出FB成功
	{
		type : 2,
		text : "Disconnected frome Facebook"
	},
	// FB登陆成功
	{
		type : 2,
		text : "Successfully connected to Facebook."
	},
];

BUTTON_FONT = "Arial";

