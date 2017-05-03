/**
 * Created by beyondray on 2015/8/14.
 * 物理世界（泡泡球掉落弹起的物理效果)
 */
var v = cp.v;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

var PhysicLayer = cc.Layer.extend({
	space:null,
	_debugNode:null,
	borderWidth:5,
	scene:null,
	ctor:function(scene){
		this._super(/* cc.color(0,0,0,255), cc.color(98*0.5,99*0.5,117*0.5,255)*/);
		this.scene = scene;
		this.space = new cp.Space();
		this.toRemoveShapeList = [],
		this.setSpace(this.space);
		this.setupDebugNode();
	},
	setSpace:function(space){
		space.iterations = 60;
		space.gravity = cp.v(0, GRAVITY);
		space.sleepTimeThreshold = 0.5;
		space.collisionSlop = 0.5;
	},
	update:function(dt){
		this.space.step(dt);
		this.removePhysicBubble();
		//cc.log("Update:", dt);
	},
	setupDebugNode:function(){
		// debug only
		this._debugNode = new cc.PhysicsDebugNode(this.space);
		this._debugNode.visible = false;
		this.addChild(this._debugNode);
	},
	onEnter:function(){
		this._super();
		//静态碰撞体
		this.createEdgeBox();
		this.createBotomBox();
		this.createAllClearBar();
		//计时器
		this.scheduleUpdate();
		//碰撞监听
		this.space.addCollisionHandler(
			PHYSIC_TYPE.BUBBLE, PHYSIC_TYPE.STATIC,
			this.collisionBegin.bind(this),
			this.collisionPre.bind(this),
			this.collisionPost.bind(this),
			this.collisionSeparate.bind(this)
		);
		this.space.addCollisionHandler(
			PHYSIC_TYPE.BUBBLE, PHYSIC_TYPE.BUBBLE,
			function(){}, null, null, null);
	},
	onExit:function(){
		this._super();
		this.space.removeCollisionHandler(PHYSIC_TYPE.BUBBLE, PHYSIC_TYPE.STATIC);
		this.space.removeCollisionHandler(PHYSIC_TYPE.BUBBLE, PHYSIC_TYPE.BUBBLE);
	},
	collisionBegin:function( arbiter, space ){
		//cc.log("collisionBegain");
		var shape = arbiter.getShapes();
		this.scene.showAddScoreEffect(shape[0].body.getPos().x);
		var shape =  arbiter.getShapes();
		this.toRemoveShapeList.push(shape[0]);
        this.scene.dropBubbleCount--;
		game.playMusic(PRE_LOAD_MUSIC.enterBucket);
		//cc.log("dropBubbleCount: ", this.scene.dropBubbleCount);
		//cc.log("waitBubbleCount: ", this.scene.waitBubbleNum);
		//cc.log("GAME_STATE:", this.scene.m_state);

		 if(this.scene.dropBubbleCount == 0 && (this.scene.waitBubbleNum == 0 ||this.scene.m_state == GAME_STATE.GS_SHOWEND))
		 {
		 	this.scene.showSuccessOrFailUI({result : this.scene.result},true);
		 }
		//return true;
	},
	collisionPre:function( arbiter, space ){
		//cc.log("collisionPre");
		//return true;
	},
	collisionPost:function( arbiter, space ){
		//cc.log("collisionPost");
	},
	collisionSeparate:function( arbiter, space ){
		//cc.log("collisionSeparate");
	},
	createPhysicBubble:function(model, x, y, rc, impluse){
		var downImpes = [-100, 100];
		var downImp = downImpes[randomInt(0, 1)];
		impluse = impluse || v(downImp,-50);

		var bubbleBody = this.space.addBody(new cp.Body(BUBBLE_MASS, cp.momentForCircle(3, 0, BUBBLE_RADIUS, cp.v(0, 0))));
		bubbleBody.setPos(cp.v(x, y));
		bubbleBody.applyImpulse(impluse, v(0, randomInt(-50,50)));
		var bubbleCircle = this.space.addShape(new cp.CircleShape(bubbleBody, BUBBLE_RADIUS, cp.v(0, 0)));
		bubbleCircle.setElasticity(BUBBLE_ELASTICITY);
		bubbleCircle.setFriction(BUBBLE_FRICTION);
		bubbleCircle.setCollisionType(PHYSIC_TYPE.BUBBLE);
		var bubble = new cc.PhysicsSprite(model.returnSpriteFrameName());
		bubble.setBody(bubbleBody);
		bubble.setPosition(cc.p(x, y));
		this.addChild(bubble,SHOT_BUBBLE_DEP);
		bubbleBody.bubble = bubble;
		this.scene.dropBubbleList.push(bubble);
		this.scene.dropBubbleCount++;
		return bubble;
	},
	shotOnePhysicBubble:function(color){
		var bubble = createBubbleByColor(color,  true);
		this.createPhysicBubble(bubble.getModel(), READY_BUBBLE_POS.x,READY_BUBBLE_POS.y, null,v(randomInt(-300,300),randomInt(1000,1200)));
	},
	removePhysicBubble:function(){
		if(this.toRemoveShapeList) {
			for(var i in this.toRemoveShapeList){
				var shape = this.toRemoveShapeList[i];
                try{
				    shape.body.bubble.removeFromParent();
				    this.space.removeBody(shape.body);
				    this.space.removeShape(shape);
                }
                catch(e){
                    //console.log("error:"+e.message);
                }
				delete this.toRemoveShapeList[i];
			}
		}
	},
	createEdgeBox:function(){
		var space = this.space;
		var boxRect = {
			left:OFFSET.x,
			right:display.width-OFFSET.x,
			top:2*display.height,
			bottom:0
		};

		var createBorder = function(begX, begY, endX, endY, borderWidth){
			var shape = space.addShape(new cp.SegmentShape(space.staticBody, v(begX, begY), v(endX, endY), borderWidth));
			shape.setElasticity(WALL_ELASTICITY);
			shape.setFriction(WALL_FRICTION);
			shape.setLayers(NOT_GRABABLE_MASK);
		};

		//左边界
		createBorder(boxRect.left, boxRect.bottom, boxRect.left, boxRect.top, this.borderWidth);
		//右边界
		createBorder(boxRect.right, boxRect.bottom, boxRect.right, boxRect.top, this.borderWidth);
		//上边界
		createBorder(boxRect.left,boxRect.top, boxRect.right, boxRect.top, this.borderWidth);
	},
	// 生成一个多边形物理对象
	createOneBox : function(index){
		if( index == 0)
		    var temp = [-12.55,-17, -7.05,20.85, 15.3,16.7,37.55,10.9,43.55,-17.05,43.55,-91.4,-12.55,-91.4];
		else if(index == 5)
		    var temp = [-12.55,-17,-7.05,10.85,15.3,16.7,37.55,20.9,43.55,-17.05,43.55,-91.4,-12.55,-91.4];
		else
			var temp = [-12.55,-17, -7.05,10.85, 0.3,12.7, 7.55,10.9, 13.55,-17.05 , 13.55,-91.4, -12.55,-91.4];
		 var vertexs = [];
		 for(var i = 0;i< temp.length;i+=2){
				 vertexs[i] = temp[i]+50;
				 vertexs[i+1] = temp[i+1];
		 }
		var space = this.space;
		var body = space.staticBody;
		body.setPos(v(CROCK_POSX[index], BOTTOM_RECT.height+50));
		var shape = space.addShape(new cp.PolyShape(body, vertexs, v(0,0)));
		shape.setElasticity(WALL_ELASTICITY);
		shape.setFriction(WALL_FRICTION);
		//body.maskBits = 16;

		var boxSp = new cc.PhysicsSprite();
		boxSp.setBody(body);
		boxSp.attr({x:CROCK_POSX[index], y:BOTTOM_RECT.height+50});
		this.addChild(boxSp);
		//return boxSp;
	},
	createBotomBox:function(){
		for(var i = 0;i< 6;i++){
			this.createOneBox(i);
		}
	},
	//创建清除屏障
	createClearBar:function(x, y, width, height){
		var space = this.space;
		var body = space.staticBody;
		body.setPos(v(x, y));
		var shape = space.addShape(new cp.BoxShape(body, width, height));
		shape.setElasticity(1);
		shape.setFriction(0);
		shape.setLayers(16);
		shape.setCollisionType(PHYSIC_TYPE.STATIC);
	},
	createAllClearBar:function(){
		//用于清除球的天花板
		this.createClearBar(display.cx,display.height+10100, display.width, 20000);

		//用于清除球的左墙
		this.createClearBar(OFFSET.x-50-BUBBLE_RADIUS,0,100,display.height*2);

		//用于清除球的右墙
		this.createClearBar(display.width-OFFSET.x+50+BUBBLE_RADIUS,0,100,display.height*2);

		//用于清除球的底板
		this.createClearBar(display.width,35,display.width*2,BOTTOM_RECT.height+100);
	}

})