/**
 * Created by beyondray on 2015/8/24.
 * Desc: UI相关
 */

uihelper = {}

var degrees2radians = function(angle){
	return angle * Math.PI / 180;
}

var radians2degrees = function(angle){
	return angle * 180 / Math.PI;
}

display = display || {};
// 定义颜色
display.COLOR_LIGHTYELLOW = cc.color(231, 217, 185);
display.COLOR_DARKYELLOW = cc.color(66, 40, 32);
display.COLOR_YELLOW = cc.color(255, 255, 0);
display.COLOR_BLUE = cc.color(0, 153, 204);
display.COLOR_GREEN = cc.color(11, 241, 6);
display.COLOR_BLACK = cc.color(0, 0, 0);
display.COLOR_ORANGE = cc.color(255, 144, 0);
display.COLOR_ORANGERED = cc.color(248, 82, 0);
display.COLOR_WHITE = cc.color(255, 255, 255);
display.COLOR_LIGHTGRAY = cc.color(169, 169, 169);
display.COLOR_LIGHTGREEN = cc.color(50, 205, 50);
display.COLOR_DARKBLUE = cc.color(0, 139, 139);
display.COLOR_FONT = cc.color(36, 36, 36);
display.COLOR_FONTGREEN = cc.color(2, 70, 30);	// 绿色按钮上 cc.color(2, 99, 46)
display.COLOR_BUTTON_STROKE = cc.color(36, 36, 36);	// 所有按钮上描边 #242424
display.COLOR_SHADOW = cc.color(0, 0, 0);
display.COLOR_BROWN = cc.color(111, 85, 71);
display.COLOR_DARKBROWN = cc.color(66, 45, 23);
display.COLOR_BORDER_BROWN = cc.color(49, 22, 0);
display.COLOR_BROWNSTROKE = cc.color(77, 42, 29);
display.COLOR_ORANGE = cc.color(254, 201, 16) ;//橙色
display.COLOR_LIGHTBLUE = cc.color(0, 255, 216); //水蓝色
display.COLOR_UPDATE = cc.color(28,68,122); // 更新界面的字体颜色
display.COLOR_TITLE = cc.color(3,23,58); // 标题颜色

/**
 * Desc: 切换场景
 * @param name 场景名字
 * @param params 传递给下一个场景的参数
 * @param callback 回调函数
 * @param transitionParams 切换效果参数
 */
var switchScene = function(name, params, callback, transitionParams){
	params = params || {};
	params.closemode = 1;
	var scene =  new (eval(name))(params);
	if(transitionParams){
		if(name == "WelcomeScene"){

			cc.director.runScene(new eval(transitionParams.type)(transitionParams.time, scene));
		}
		else{

			//loadingShow(true, true);
			var replaceScene = function(){
				cc.director.runScene(new eval(transitionParams.type)(transitionParams.time, scene));
			}
			cc.director.getRunningScene().scheduleOnce(replaceScene,1);
		}
	}
	else{
		if(name == "WelcomeScene"){
			cc.director.runScene(scene);

		}
		else{
			//loadingShow(true, true);
			cc.director.runScene(scene);


			/*var replaceScene = function(){
				cc.director.runScene(scene);
			}
			cc.director.getRunningScene().scheduleOnce(replaceScene, 1);*/
		}
	}

	if(typeof callback == "function"){
		cc.director.getRunningScene().scheduleOnce(callback, 0.5);
	}
}

var loadingShow = function(hold,full){
	full = full || false;
	var loadingMask = (new LoadingLayer({full:full}));
	/*loadingMask.setTag(TOP_POP_WIN_TAG + (hold && 1 || 0));*/
	cc.director.getRunningScene().addChild(loadingMask, 2000);
	if(!hold){
		loadingMask.runAction(cc.sequence(cc.delayTime(40), cc.callFunc(function(){loadingMask.removeFromParent()})));
	}
}

// 模仿KING的抖动效果
uihelper.getCustomEasingAction = function(){
	return new cc.Sequence(
		new cc.ScaleTo(0.08, 0.85, 1.15),
		new cc.ScaleTo(0.08, 1.15, 0.85),
		new cc.ScaleTo(0.08, 0.9, 1.1),
		new cc.ScaleTo(0.08, 1.1, 0.9),
		new cc.ScaleTo(0.08, 0.93, 1.07),
		new cc.ScaleTo(0.08, 1.07, 0.93),
		new cc.ScaleTo(0.08, 0.96, 1.04),
		new cc.ScaleTo(0.08, 1.04, 0.96),
		new cc.ScaleTo(0.08, 1, 1)
	);
}

uihelper.setCustomPopAction = function(node) {
	node.scale=0.7;
	node.runAction(new cc.Sequence(
		new cc.ScaleTo(0.1, 1.2, 1.2),
		new cc.ScaleTo(0.1, 0.9, 0.9),
		new cc.ScaleTo(0.1, 1, 1)));
}

//--- steRes:模板,isFlip:模板翻转；color4:纯色,clipRes:被剪切资源,isInverted:是否取反,node:被剪切node；
var getShaderNode=function(params) {
	var clip = null;
	var params = params || {};
	var steRes = params.steRes;
	var color4 = params.color4;
	var clipRes = params.clipRes;
	var scale = params.scale || 1;
	var isInverted = params.isInverted || false;
	var node = params.node;
	var isFlip = params.isFlip || false;

	if (params && steRes && (steRes || color4)) {
		var sten = new cc.Sprite(steRes);
		sten.setFlippedX(isFlip);
		clip = new cc.ClippingNode();
		clip.setStencil(sten);
		clip.setInverted(isInverted);
		clip.setPosition(cc.p(display.cx, display.cy));
		clip.setAlphaThreshold(0);

		if (color4) {
			var flayer = new cc.LayerColor(color4);
			flayer.setPosition(cc.p(-display.cx, -display.cy));
			clip.addChild(flayer);
		} else if (clipRes) {
			var sten = new cc.Sprite(clipRes);
			sten.scale = scale;
			sten.setPosition(cc.p(clip.getContentSize().width / 2, clip.getContentSize().height / 2));
			clip.addChild(sten);

		} else if (node) {
			node.setFlippedX(isFlip);
			node.setPosition(cc.p(clip.getContentSize().width / 2, clip.getContentSize().height / 2));
			clip.addChild(node);
		}
	}
	return clip;
}

var G_createGuideLayer=function(touchRect, canTouch, callback, hightLightClick) {
	var highLightNode = null;
	var isImg=false;
	if (touchRect.imagePath) {      //--图片
		isImg=true;
		highLightNode = new cc.Sprite(touchRect.imagePath);
		highLightNode.setPosition(touchRect.imagePos);
		highLightNode.setScale(touchRect.scale || 1);
		highLightNode.setRotation(touchRect.rotation || 0);
	} else {                                    //--CCRect 目前是矩形，可相应换成椭圆或固定图片
		var midX = cc.rectGetMidX(touchRect.rect);
		var midY = cc.rectGetMidY(touchRect.rect);
		highLightNode = new cc.Sprite(res.BackGround_jpg, touchRect.rect);
		highLightNode.setPosition(midX, midY);
	}

	var layer = new cc.Layer();

	//--压黑
	var layerColor = new cc.LayerColor(cc.color(0, 0, 0, 128), display.width, display.height);

	//--高亮
	var clipNode = new cc.ClippingNode();
	clipNode.setInverted(true);
	clipNode.addChild(layerColor);
	var stencilNode = new cc.Node();
	stencilNode.addChild(highLightNode);
	clipNode.setStencil(stencilNode);
	clipNode.setAlphaThreshold(0);

	layer.addChild(clipNode);

	//-- 显示箭头
	if (touchRect.arrow) {
		var arrow = new cc.Sprite(touchRect.arrow.image);
		arrow.setPosition(touchRect.arrow.offerPos.x + touchRect.imagePos.x, touchRect.arrow.offerPos.y + touchRect.imagePos.y);
		layer.addChild(arrow);

		if (touchRect.arrow.dir == "l") {
			var a1 = new cc.MoveBy(0.5, cc.p(20, 0));
			var a2 = a1.reverse();
			arrow.runAction(new cc.RepeatForever(new cc.Sequence(a1, a2)));
		} else if (touchRect.arrow.dir == "r") {
			arrow.setFlippedX(true);
			var a1 = new cc.MoveBy(0.5, cc.p(20, 0));
			var a2 = a1.reverse();
			arrow.runAction(new cc.RepeatForever(new cc.Sequence(a1, a2)));
		} else if (touchRect.arrow.dir == "u") {
			arrow.setRotation(90);
			var a1 = new cc.MoveBy(0.5, cc.p(0, 20));
			var a2 = a1.reverse();
			arrow.runAction(new cc.RepeatForever(new cc.Sequence(a1, a2)));
		} else if (touchRect.arrow.dir == "d") {
			arrow.setRotation(-90);
			var a1 = new cc.MoveBy(0.5, cc.p(0, 20));
			var a2 = a1.reverse();
			arrow.runAction(new cc.RepeatForever(new cc.Sequence(a1, a2)));
		}

	}

	//-- 提示框
	if (touchRect.tip) {
		var bg = new cc.Sprite(touchRect.tip.image);
		bg.setPosition(touchRect.tip.pos.x, touchRect.tip.pos.y);
		layer.addChild(bg);

		var label = new cc.LabelBMFont(touchRect.tip.text, res.GUIDE_FONT, null, cc.TEXT_ALIGNMENT_CENTER, 0);
		label.attr({
			anchorX: 0.5,
			anchorY: 0.5,
			x: touchRect.tip.textPos.x+100,
			y: touchRect.tip.textPos.y
		});
		bg.addChild(label);
	}

	//layer.setTouchEnabled(true);
	if (layer.swallowTouches) {
		layer.swallowTouches(!canTouch); //-- 不吞噬触摸
	}

	var onTouchBegan = function (touch, event) {
		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		if (layer.isVisible() == false) {
			return false;
		}
		//cc.log("+++++++++++G_createGuideLayer OnTouchBegan");

		if (canTouch == false) {
			return true;
		} else if ((cc.rectContainsPoint(highLightNode.getBoundingBox(), lp)&&isImg)||(cc.rectContainsRect(touchRect.rect,wp)&&!isImg)) {
			if (layer.swallowTouches) {
				layer.swallowTouches(false);
			}
			if (hightLightClick) {
				hightLightClick();
			}

			return false;
		} else {
			if (layer.swallowTouches) {
				layer.swallowTouches(true);
			}
			return true;
		}
	};

	var onTouchMoved = function (touch, event) {
		return true;
	};

	var onTouchEnded = function (touch, event) {
		if (canTouch == false) {
			if (callback) {
				callback()
			}
		}
	};

	var touchListener = cc.EventListener.create({
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		caller: layer,
		swallowTouches: true,
		onTouchBegan: onTouchBegan,
		onTouchMoved: onTouchMoved,
		onTouchEnded: onTouchEnded
	});
	cc.eventManager.addListener(touchListener, layer);

	return layer;
}


























