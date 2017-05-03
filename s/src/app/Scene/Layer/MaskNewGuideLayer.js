/**
 * Created by zhengliming on 2015/10/27.
 * Desc:新手引导遮罩
 */

var MaskNewGuideLayer = cc.Layer.extend({
	ctor: function(params){
		this._super();
		params = params || {};
		this.parent =/* this.parent||*/params.parent;
		this.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});
		this.initUI();

	},
	initUI:function(){
		//-- local backLayer = display.newColorLayer(cc.c4b(0,0,0,100)):addTo(self)
		this.ico = getShaderNode({steRes : res.Shoot_guide_mask, color4 : cc.color(255,255,255,100)});
		this.ico.setAnchorPoint(cc.p(0,0));
		this.ico.setPosition(READY_BUBBLE_POS.x+35, 335);
		this.addChild(this.ico);
		this.swapClickRect = cc.rect(READY_BUBBLE_POS.x+5-60, 355-110,180,180);

		var arrowSp = new cc.Sprite(res.New_guide_arrow);
		arrowSp.setPosition(this.ico.getPositionX()+120,this.ico.getPositionY());
		this.addChild(arrowSp);

		var a1 = new cc.MoveBy(0.5, cc.p(-20,0));
		arrowSp.runAction(new cc.RepeatForever(new cc.Sequence(
			a1,a1.reverse()
		)));

		var tipBox=new cc.Sprite(res.New_guide_box);
		tipBox.setPosition(display.cx-100,595);
		this.addChild(tipBox);

		var label=new cc.LabelTTF("Tap here to switch \n bubbles!",BUTTON_FONT,30,cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		label.setPosition(360,104);
		label.setColor(display.COLOR_TITLE);
		tipBox.addChild(label);

		this.addTouchEventListenser();
	},

	addTouchEventListenser: function () {
		this.touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			caller: this,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded:this.onTouchEnded
		});
		cc.eventManager.addListener(this.touchListener, this);
	},

	swapShotBubble:function () {
		this.parent.swapShotBubble();
		this.removeFromParent();
	},

	onTouchBegan:function(touch, event){
		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		if(cc.rectContainsPoint(this.caller.swapClickRect, lp))
		{
			this.caller.clickSwapRectFlag = true;
			return true;
		}
		else
			return false;
	},

	onTouchMoved:function(touch,event){
		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		if(cc.rectContainsPoint(this.caller.swapClickRect, lp))
		{
			this.caller.clickSwapRectFlag = false;
			return true;
		}
		else
			return false;
	},

	onTouchEnded:function(touch,event){

		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		if(cc.rectContainsPoint(this.caller.swapClickRect, lp))
		{
			this.caller.swapShotBubble();
			this.caller.clickSwapRectFlag = false;
			return true;
		}
		else
			return false;
	}

})