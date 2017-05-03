/**
 * Created by beyondray on 2015/7/21.
 * Desc: �Զ�����ʾ����
 */

var display = {};
var OFFSET;
var BOTTOM_RECT;
var TOP_RECT;

var LEFT_CHECK_LIMIT;
var RIGHT_CHECK_LIMIT;
var UP_CHECK_LIMIT ;

var READY_BUBBLE_POS;
var WAIT_BUBBLE_POS;

//===============五个缸相关信息=================
var CROCK_INFOR = new Array(5);
//五个盒子的X坐标
var CROCK_POSX  = new Array(6) ;

// 缸的分数
var CROCK_SCORE = [100, 200, 500, 200, 100];

//五个缸显示分数的X坐标
var CROCK_SHOW_SCORE_POSX = new Array(5);

var topLimit;
var bottomLimit;

var GUIDE;
function  initDisplay() {

	var canvasSize = cc.director.getWinSize();//{width:960, height:1280};
	//cc.log("***************canvasSize.width="+canvasSize.width);

	display.screenScale = 1.0;
//display.contentScaleFactor = scale;
	display.size = {width: canvasSize.width, height: canvasSize.height};
	display.width = display.size.width;
	display.height = display.size.height;
	display.cx = display.width / 2;
	display.cy = display.height / 2;
	display.c_left = -display.width / 2;
	display.c_right = display.width / 2;
	display.c_top = display.height / 2;
	display.c_bottom = -display.height / 2;
	display.left = 0;
	display.right = display.width;
	display.top = display.height;
	display.bottom = 0;

	OFFSET  =   cc.p((display.width - DESIGN_WIDTH)/2, (display.height - DESIGN_HEIGHT)/2);  // 实际偏移量（Y不会偏移为0）
	BOTTOM_RECT   =   cc.rect(0,0,display.width,100); // 底部道具层的有效区域
	TOP_RECT   =   cc.rect(0,0,display.width,110); // 顶部层的有效区域

	LEFT_CHECK_LIMIT    =   OFFSET.x + BUBBLE_RADIUS;                           // 正确的左边检测限制
	RIGHT_CHECK_LIMIT   =   display.size.width - OFFSET.x - BUBBLE_RADIUS;     // 正确的右边检测限制
	UP_CHECK_LIMIT      =   display.height  - BUBBLE_RADIUS - TOP_RECT.height; //正确的上边检测限制

	READY_BUBBLE_POS    =   cc.p(display.cx, 403);      // 发射球的初始位置
	WAIT_BUBBLE_POS     =   cc.p(display.cx + 60, 333); // 等待球的初始位置


	topLimit = display.height - TOP_RECT.height + 2*BUBBLE_RADIUS;
	bottomLimit = BOTTOM_RECT.height - BUBBLE_RADIUS;



	CROCK_INFOR[0] =
	{
		pos : {x : OFFSET.x , y : BOTTOM_RECT.height - 45},
		image : res.CROCK1_png,
		flipx : false,
		depth : 1,
		mask :res.CROCKMASK1_png
	};
	CROCK_INFOR[1] =
	{
		pos : {x : OFFSET.x + 168.55, y : BOTTOM_RECT.height - 45 + 30},
		image : res.CROCK2_png,
		flipx : false,
		depth : 2,
		mask : res.CROCKMASK2_png
	};
	CROCK_INFOR[2] =
	{
		pos : {x : OFFSET.x + 297, y : BOTTOM_RECT.height - 45 + 50},
		image : res.CROCK3_png,
		flipx : false,
		depth : 6,
		mask :  res.CROCKMASK3_png
	};
	CROCK_INFOR[3] =
	{
		pos : {x : OFFSET.x + 411.25, y : BOTTOM_RECT.height - 45 + 30},
		image : res.CROCK2_png,
		flipx : true,
		depth : 5,
		mask : res.CROCKMASK2_png
	};
	CROCK_INFOR[4] =
	{
		pos : {x : OFFSET.x + 544.8, y : BOTTOM_RECT.height - 45},
		image : res.CROCK1_png,
		flipx : true,
		depth : 4,
		mask : res.CROCKMASK1_png
	};


	CROCK_POSX[0] = OFFSET.x-35;
	CROCK_POSX[1] = OFFSET.x+120;
	CROCK_POSX[2] = OFFSET.x+248;
	CROCK_POSX[3] = OFFSET.x+373;
	CROCK_POSX[4] = OFFSET.x+495;
	CROCK_POSX[5] = OFFSET.x+630;

//五个缸的Y坐标
	/*var CROCK_POSY  = new Array(6);
	 CROCK_POSY[0] = BOTTOM_RECT.height + 10;
	 CROCK_POSY[1] = BOTTOM_RECT.height + 35;
	 CROCK_POSY[2] = BOTTOM_RECT.height + 50;
	 CROCK_POSY[3] = BOTTOM_RECT.height + 35;
	 CROCK_POSY[4] = BOTTOM_RECT.height + 10;*/

	CROCK_SHOW_SCORE_POSX[0] = {x : OFFSET.x-40+150, r : -10 };
	CROCK_SHOW_SCORE_POSX[1] = {x : OFFSET.x+155+80, r : -5 };
	CROCK_SHOW_SCORE_POSX[2] = {x : OFFSET.x+263+100, r : 0 };
	CROCK_SHOW_SCORE_POSX[3] = {x : OFFSET.x+363+120, r : 5 };
	CROCK_SHOW_SCORE_POSX[4] = {x : OFFSET.x+472+150, r : 10 };

//display.widthInPixels      = display.sizeInPixels.width;
//display.heightInPixels     = display.sizeInPixels.height;

	GUIDE = {
//-----彩虹
		1 : {
			imagePath : res.Bubble01_png,
			initPos : cc.p(22,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "选中彩虹泡泡。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		2 : {
			//-- imagePath = "texture/newUI/head_bg.png",
			rect : cc.rect(display.cx - 140, display.cy +85 , 80, 70),
			initPos : cc.p(0,0),
			imagePos : cc.p(display.cx - 140,display.cy+10),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(50, 0), dir : "u" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "能当做任意颜色的球进行\n消除。", textPos :cc.p(240,85)},
			swallow : true //-- 高亮可点
		},
//-----冰淇淋
		11 : {
			imagePath : res.Bubble01_png,
			initPos : cc.p(16,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "选中冰淇淋泡泡。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		12 : {
//-- imagePath = "texture/newUI/head_bg.png",
			rect : cc.rect(display.cx - 50, display.cy -55, 100, 80),
			initPos : cc.p(0,0),
			imagePos : cc.p(display.cx - 50,display.cy +75),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(50, -160), dir : "u" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "消除所有接触的泡泡。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},

//-----冰球
		21 : {
			imagePath : res.Head_bg,
			initPos : cc.p(-110,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "选中冰球。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		22 : {
			imagePath : res.Head_bg,
			initPos : cc.p(0,0),
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
//-- tip = { image = "texture/newUI/new_guide_box.png", pos = cc.p(display.cx, display.cy + 300), text = "", textPos = cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		24 : {
			rect : cc.rect(display.cx - 50, display.cy +85, 100, 80),
			initPos : cc.p(0,0),
			imagePos : cc.p(display.cx - 50,display.cy +75),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(50, -60), dir : "u" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text: "消除所有碰到的泡泡。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},

//-----加十步
		31 : {
			imagePath : res.Head_bg,
			initPos : cc.p(-30,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "增加10球。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		32 : {
			imagePath : res.Head_bg,
			initPos : cc.p(0,0),
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			//-- tip = { image = "texture/newUI/new_guide_box.png", pos = cc.p(display.cx, display.cy + 300), text = "增加10球。", textPos = cc.p(240,90)},
			swallow : true //-- 高亮可点
		},

//-----加3
		41 : {
			imagePath : res.Bubble01_png,
			initPos : cc.p(15,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "使用+3泡泡。", textPos : cc.p(240,90)},
			swallow : true, //-- 高亮可点
		},

//-----魔法
		51 : {
			imagePath : res.Head_bg,
			initPos : cc.p(40,0), //-- 调整高亮区位置的偏移量
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "选中魔法泡泡。", textPos : cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		52 : {
			imagePath : res.Head_bg,
			initPos : cc.p(0,0),
			imagePos : cc.p(0,0),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(0, 100), dir : "d" },
//-- tip = { image = "texture/newUI/new_guide_box.png", pos = cc.p(display.cx, display.cy + 300), text = "dec", textPos = cc.p(240,90)},
			swallow : true //-- 高亮可点
		},
		54 : {
			rect : cc.rect(display.cx - 50, display.cy -75, 100, 80),
			initPos : cc.p(0,0),
			imagePos : cc.p(display.cx - 50,display.cy +75),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(50, -160), dir : "u" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "使碰到的有害泡泡变为\n普通泡泡。", textPos : cc.p(240,85)},
			swallow : true// -- 高亮可点
		},
//-- 第六关切换球引导
		61 : {
			rect : cc.rect(READY_BUBBLE_POS.x+5-60, 355-110,180,180),
			initPos : cc.p(0,0),
			imagePos : cc.p(display.cx - 50,display.cy +75),
			arrow : { image : res.New_guide_arrow, offerPos : cc.p(200, -380), dir : "l" },
			tip : { image : res.New_guide_box, pos : cc.p(display.cx, display.cy + 300), text : "切换泡泡。", textPos : cc.p(240,85)},
			swallow : true// -- 高亮可点
		}
	}



}