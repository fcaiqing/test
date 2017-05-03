/**
 * Created by beyondray on 2015/8/31.
 */

var BYMaskNone = cc.Layer.extend({
    ctor:function() {

	    this._super();
	    this.ignoreAnchor=false;
	    this.setContentSize(cc.size(display.width,display.height));
	    this.attr({
		   anchorX:0.5,
		   anchorY:0.5,
		   x:display.cx,
		   y:display.cy

	     });

	    this.touchListener = cc.EventListener.create({
		    event: cc.EventListener.TOUCH_ONE_BY_ONE,
		    caller: this,
		    swallowTouches: true,
		    onTouchBegan: function(){return true;},
		    onTouchMoved: function(){},
		    onTouchEnded: function(){}
	    });
	    cc.eventManager.addListener(this.touchListener, this);
	    this.clickFunc = 1;
	    this.clickOut = 2;
	    //this.ObjSize = 3;
    }

});

BYMask.prototype.show = function(){

}

BYMask.prototype.hide = function(){

}

// 设置点击回调函数
BYMask.prototype.click = function(func){
	this.clickFunc = func;
}

BYMask.prototype.clickOut = function(func){
	this.clickOut = func;
}