/**
 * Created by beyondray on 2015/7/21.
 * Desc: 泡泡基类
 */

var BubbleBasic = cc.Class.extend({
    ctor:function(data){
	    // 地图编辑器中不随机显示
        this.inMapEdit = data.randomFlag;
        if(!this.inMapEdit)
        {
	        this.color = Number(data.color);
			cc.assert((this.color && this.color <= MAX_COLOR)
           /* || this.color == SHOTLINE_BUB_COLOR, "Error: 超过最大可使用的颜色！！")*/);
	        // MAX_COLOR表示需要随机一种颜色
            if(this.color == MAX_COLOR)
                this.color = randomCreateColor();
        }

        // 泡泡球属性
        this.type = Number(data.type) || 0;
        this.row = data.row;
        this.col = data.col;
        this.attributes = data.attributes || {typeThree : 3}; //there need to modify
        this.speed = data.speed || 5;
        this.hold = Number(data.hold) || 0;
        this.hitHold = Number(data.hitHold) || 0;
        this.save2Hold = Number(data.save2Hold) || 0;
        this.itemId = Number(data.itemId) || 0;
        this.score = 10;

        //道具
        if (this.itemId != 0) {
            this.color = -1;
            this.imageFilename = res[string.format("Item_bubble%d_png", "%d", this.itemId)];
	        this.spriteFrameName=string.format("item_bubble%d.png", "%d", this.itemId);
        }
        else if(this.type == BUBBLE_TYPE.normal || this.type == BUBBLE_TYPE.fog ||
            this.type == BUBBLE_TYPE.color || this.type == BUBBLE_TYPE.save2Alpha) {
            // 未知、变色泡泡、解救模式2占位球 颜色不覆盖
            this.imageFilename = res[string.format("Bubble%d_png", "%d", string.ZERO_PRE_MODE(this.color))];
	        this.spriteFrameName=string.format("bublle%d.png", "%d", string.ZERO_PRE_MODE(this.color));

            //在编辑器中未知、变色泡泡显示特殊球的图片
            this.roundCenter = data.roundCenter || 0;    //是否是旋转中心点
        }
	    else if(this.type == BUBBLE_TYPE.center){
			//特殊颜色为0
	        this.color = 0;
	        this.imageFilename = res.Special88_editer_png;
	        this.spriteFrameName="special88_editer.png";
        }
	    else if(this.type == BUBBLE_TYPE.hitAlpha){
			if(this.hitHold > 0){
				this.imageFilename = res.AlphaBubble_png;
				this.spriteFrameName="alphaBubble.png";
			}
	        else{
				this.imageFilename = res[string.format("special%d_png","%d", string.ZERO_PRE_MODE(this.type))];
				this.spriteFrameName=string.format("special%d.png","%d", string.ZERO_PRE_MODE(this.type));
			}
        }
        else if(this.type == BUBBLE_TYPE.revolveWheel){
	        //旋转转轮，特殊球的颜色为0
	        this.color = 0;
	        this.isRevolve = true;
	        this.imageFilename = res[string.format("special%d_png","%d", string.ZERO_PRE_MODE(this.type))];
	        this.spriteFrameName=string.format("special%d.png","%d", string.ZERO_PRE_MODE(this.type));
        }
	    else{
	        //特殊球的颜色为0
	        this.color = 0;
	        // 占位球为透明球
	        if(this.type == BUBBLE_TYPE.saveAlpha && this.hold > 0 ){
		        this.imageFilename = res.AlphaBubble_png;
		        this.spriteFrameName="alphaBubble.png";
	        }
	        else{
		        this.imageFilename = res[string.format("special%d_png","%d", string.ZERO_PRE_MODE(this.type))];
		        this.spriteFrameName = string.format("special%d.png","%d", string.ZERO_PRE_MODE(this.type));
	        }
        }

	    this.roundCenter = data.roundCenter || 0;
    }
});
BubbleBasic.prototype.setSpriteFrameWithColor = function(color){
    //道具
        if (this.itemId != 0) {
            this.color = -1;
	        this.spriteFrameName=string.format("item_bubble%d.png", "%d", this.itemId);
        }
        else if(this.type == BUBBLE_TYPE.normal || this.type == BUBBLE_TYPE.fog ||
            this.type == BUBBLE_TYPE.color || this.type == BUBBLE_TYPE.save2Alpha) {
	        this.spriteFrameName=string.format("bublle%d.png", "%d", string.ZERO_PRE_MODE(color));
        }
}
BubbleBasic.prototype.returnSpriteFrameName  = function (){

    if(this.itemId != 0) {
	    var skey=string.format("Item_bubble%d_png", "%d", this.itemId + "");
	    this.imageFilename = res[skey];
    }else {
	    //cc.log("+++++type="+this.type+",color="+this.color);
	    if (this.type == BUBBLE_TYPE.normal) {
		    this.imageFilename = res[string.format("Bubble%d_png", "%d", string.ZERO_PRE_MODE(this.color))];
	    }
	    else if (this.type == BUBBLE_TYPE.fog || this.type == BUBBLE_TYPE.color) {
		    this.imageFilename = res[string.format("Bubble%d_png", "%d", string.ZERO_PRE_MODE(this.color))];
	    }
	    else {// this.type >= 10 需要另行处理，暂不考虑
		    this.imageFilename = res[string.format("Special%d_png", "%d", string.ZERO_PRE_MODE(this.type))];

	    }
    }
	return this.imageFilename;
}