/**
 * Created by beyondray on 2015/8/10.
 * Desc: 控制泡泡球的触摸层
 */

var TouchLayer = cc.Layer.extend({
    //=========【数据】=============
    scene:null,
    startTouchDic: "",
    clickSwapRectFlag:false,
    touchListener:null,
    //==============================
    ctor:function(scene){
        this._super();
        this.scene = scene;
        this.startTouchDic = "up"; //起初点击的位置在上面还是下面
        this.swapClickRect = cc.rect(READY_BUBBLE_POS.x+5-60, 355-110,180,180);
        this.addTouchEventListenser();
	    this.setDisable();
    },
    /**
     * 【Desc】: 点击触摸
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchBegan: function (touch, event) {
       // cc.log("touch begin");
	    //var touch=touches[0];

        var pos = touch.getLocation();
       // cc.log(pos.x,pos.y);
        this.caller.startTouchDic = returnUpOrDown(pos.y);

        var inRect = cc.rectContainsPoint(this.caller.swapClickRect, pos);
        if (inRect)this.caller.clickSwapRectFlag = true;
        var cur_m_real = returnCurReal(this.caller.startTouchDic,pos);
	    var curColor = this.caller.scene.m_curReady && this.caller.scene.m_curReady.getColor() || null;
        var angleRes = isAngle(pos.x, pos.y);
        if (angleRes.legal && !inRect && this.caller.scene.m_state == GAME_STATE.GS_START) {
	        this.caller.scene.lineLayer.createShotLine(curColor, cur_m_real);
	        this.caller.scene.lineLayer.updateShotLine(cur_m_real);
            this.caller.setShotParticle(angleRes.degree);
        }
        return true;
    },

    /**
     * 【Desc】：触摸移动
     * @param touch
     * @param event
     */
    onTouchMoved: function (touch, event) {
       // cc.log("touch move");
	    //var touch=touches[0];
        var pos = touch.getLocation();
        var x = pos.x, y = pos.y;
        var inRect = cc.rectContainsPoint(this.caller.swapClickRect, pos);
        if (!inRect)this.caller.clickSwapRectFlag = false;
        // 不在有效角度内不生效
        var cur_m_real = returnCurReal(this.caller.startTouchDic,pos);
        var angleRes = isAngle(x, y);
        if (angleRes.legal && !inRect && this.caller.startTouchDic == returnUpOrDown(y) && y > BOTTOM_RECT.height && this.caller.scene.m_state == GAME_STATE.GS_START) {
            this.caller.setShotParticle(angleRes.angle);
	        this.caller.scene.lineLayer.updateShotLine(cur_m_real);
        }
        else {
            this.caller.setShotParticle(0, 0);
			this.caller.scene.lineLayer.shieldShotLine();
        }
    },

    /**
     * 【Desc】：触摸结束
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchEnded:function(touch, event){
       // cc.log("touch end");

        var pos = touch.getLocation();
        var x = pos.x, y = pos.y;
        this.caller.setShotParticle(0, 0);
        this.caller.scene.lineLayer.shieldShotLine();
        var inRect = cc.rectContainsPoint(this.caller.swapClickRect, pos);
        if (inRect && this.caller.clickSwapRectFlag && this.caller.scene.m_state == GAME_STATE.GS_START) {
            this.caller.scene.swapShotBubble();
            //cc.log("swapShotBubble call");
            this.caller.clickSwapRectFlag = false;
            return true;
        }
        this.caller.clickSwapRectFlag = false;
        var angleRes = isAngle(x, y);
        if (angleRes.legal && !inRect && this.caller.startTouchDic == returnUpOrDown(y) && y > BOTTOM_RECT.height) {
            this.caller.scene.endShotting(pos, angleRes.degree);
            //cc.log("touchEnded func call");
        }
        return true;
    },

    /**
     * 【Desc】:添加触屏监听
     */
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

    setEnable: function () {
        cc.eventManager.addListener(this.touchListener,this);
    },

    setDisable: function (){
        //cc.log("*****remove touch Listener")
        cc.eventManager.removeListeners(this);
    }
});
//=======================
// Desc: 设置发射粒子
//=======================
TouchLayer.prototype.setShotParticle = function(){
    return;
};

