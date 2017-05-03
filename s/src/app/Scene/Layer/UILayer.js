/**
 * Created by beyondray on 2015/8/10.
 * Desc: 游戏场景中的内容UI(主要是动画）
 */

var UILayer = cc.Layer.extend({
	scene: null,
    bgSprite: null,
    armature:null,
    ctor:function(scene){
        this._super();
	    this.scene = scene;
        // 背景
        this.createBkGround();
        // 底部5个生物缸
        this.createCrock();
        // 松鼠
        this.createAmature();
        //交换区域
        this.createSwapRect();
    },
	createCrock : function(){
		for(var i in CROCK_INFOR){
			var crock = CROCK_INFOR[i];
			//创建生物缸的图片
			var crockSprite = new cc.Sprite(crock.image);
			crockSprite.attr({
				x: crock.pos.x,
				y: crock.pos.y-130,
				anchorX: 0,
				anchorY: 0
			});
			this.addChild(crockSprite, crock.depth);
			this.scene.totalCrock.push(crockSprite);
			//生物缸遮罩图片
			var maskSprite = new cc.Sprite(crock.mask);
			maskSprite.attr({
				x: crock.pos.x,
				y: crock.pos.y,
				anchorX: 0,
				anchorY: 0
			});
			this.scene.addChild(maskSprite,20+crock.depth);
            maskSprite.setVisible(false);
			//图片翻转
			if(crock.flipx)
			{
				crockSprite.setFlippedX(true);
				maskSprite.setFlippedX(true)
			}

			//初始时向上滑动动画
			var upMove = new cc.Sequence(
				(new cc.MoveBy(0.5, cc.p(0,130))).easing(cc.easeSineInOut()),
				new cc.CallFunc(function(){maskSprite.setVisible(true)})
			);
			crockSprite.runAction(upMove);

			//舌头动画
			var togueAniInfo = CROCK_TONGUE_ANI_INFOR[i];
			game.bulletManage.load(togueAniInfo.name);
			var animation = game.bulletManage.getAnimation(togueAniInfo.name,"start");
			if(animation)
			{
				var aniSp = new cc.Sprite();
				aniSp.attr({
					x:togueAniInfo.p.x,
					y:togueAniInfo.p.y,
					anchorX:0,
					anchorY:0
				});
				crockSprite.addChild(aniSp);
				this.scene.crockTongueAniList.push(aniSp);
				aniSp.setFlippedX(togueAniInfo.flip);
				aniSp.setSpriteFrame(animation.getFrames()[0].getSpriteFrame());
			}

			// 眼睛动画
			var eyeAniInfo = CROCK_EYE_ANI_INFOR[i];
			game.bulletManage.load(eyeAniInfo.name);
			animation = game.bulletManage.getAnimation(eyeAniInfo.name,"start");
			if(animation)
			{
				var aniSp = new cc.Sprite();
				aniSp.attr({
					x:eyeAniInfo.p.x,
					y:eyeAniInfo.p.y,
					anchorX:0,
					anchorY:0
				});
				crockSprite.addChild(aniSp);
				aniSp.runAction(cc.animate(animation).repeatForever());
			}
		}
	},
    createAmature:function(){
        ccs.armatureDataManager.addArmatureFileInfo(res.Armature1_png,res.Armature1_plist,res.Armature1_xml);
        this.armature = new ccs.Armature("shortanimation");
        this.armature.getAnimation().play("idle");
        this.armature.getAnimation().setSpeedScale(24/60);
        this.armature.attr({
            x:READY_BUBBLE_POS.x,
            y:READY_BUBBLE_POS.y+230
        });
        this.addChild(this.armature);
    },
	createSavedGhost:function(pos){
		var unitData = ARMATURE_CONFIG[1];
		ccs.armatureDataManager.addArmatureFileInfo(res.SavedGhost_png,res.SavedGhost_plist,res.SavedGhost_xml);
		this.savedGhost = new ccs.Armature("savedGhost");
		this.savedGhost.getAnimation().setSpeedScale(unitData.fps/60);
		this.savedGhost.getAnimation().play("idle");
		this.savedGhost.attr({
			x:pos.x,
			y:pos.y,
			anchorX:0.5,
			anchorY:0.5
		});
		this.scene.addChild(this.savedGhost, 3000);
		return this.savedGhost;
	},
    createBkGround : function(){
        // 添加背景
        this.bgSprite = new cc.Sprite(res.BackGround_jpg);
        this.bgSprite.attr({
            x: display.cx,
            y: display.cy
        });
        this.addChild(this.bgSprite);
    },

    createSwapRect: function(){
        // 交换旋转箭头
        var swap = new cc.Sprite(res.Swap_png);
        swap.attr({x:READY_BUBBLE_POS.x+10, y:355});
        this.addChild(swap,11);
        var action1 = new cc.Spawn(
            new cc.RotateTo(3, 180),
            new cc.FadeOut(3));
        var action2 = new cc.Spawn(
            new cc.RotateTo(3, 360),
            new cc.FadeIn(3));
        var repeatAction = new cc.RepeatForever(new cc.Sequence(action1,action2));
        swap.runAction(repeatAction);

        // 等待球台子
        var shot_box = new cc.Sprite(res.Shot_box_png);
        shot_box.attr({x:WAIT_BUBBLE_POS.x,y:WAIT_BUBBLE_POS.y-40});
        this.addChild(shot_box);
    }

});