/**
 * Created by beyondray on 2015/9/6.
 * Desc: 快速创建UI的便利函数
 */

uiFactory = {};
/**
 * Desc: 创建图片
 * @param res
 * @param x
 * @param y
 * @param anchorX
 * @param anchorY
 * @param parent
 * @param zorder
 * @returns {cc.Sprite}
 */
uiFactory.createSprite = function(res, x, y, anchorX, anchorY, parent, zorder, tag){
	if(res)
		var sp = new cc.Sprite(res);
	else
		var sp = new cc.Sprite();
	sp.setPosition(cc.p(x,y));
	sp.setAnchorPoint(cc.p(anchorX, anchorY));
	zorder = zorder || 0;
	tag = tag || 0;
	parent.addChild(sp, zorder, tag);
	return sp;
}

uiFactory.createSpriteWithSpriteFrameName = function(res, x, y, anchorX, anchorY, parent, zorder, tag){
	var sp = new cc.Sprite("#"+res);
	sp.setPosition(cc.p(x,y));
	sp.setAnchorPoint(cc.p(anchorX, anchorY));
	zorder = zorder || 0;
	tag = tag || 0;
	parent.addChild(sp, zorder, tag);
	return sp;
}

uiFactory.createTTF = function(params, x, y, parent,zorder){
	var fontDef = new cc.FontDefinition();
	if(params.fontName) fontDef.fontName = params.fontName;
	if(params.size)fontDef.fontSize = params.size;
	if(params.color)fontDef.fillStyle = params.color;
	var ttfLabel = new cc.LabelTTF(params.text, fontDef);
	ttfLabel.setPosition(cc.p(x, y));
	zorder = zorder || 0;
	parent.addChild(ttfLabel, zorder);
	return ttfLabel;
}

uiFactory.createScale9Sprite = function(picPath, rect, capInsets, x, y, parent, zorder){
	var sp = new cc.Scale9Sprite(picPath, rect, capInsets);
	sp.setPosition(x, y);
	zorder = zorder || 0;
	parent.addChild(sp, zorder);
	sp.attr({anchorX:0.5, anchorY:1});
	return sp;
}
