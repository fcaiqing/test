/**
 * Created by beyondray on 2015/9/2.
 */

var BYBtn = function(imageFiles, listener, movable,swallow,sound,noSound,clickEffect){
	//if(!imageFiles || !imageFiles[0])return;
	sound = sound || PRE_LOAD_MUSIC.click;

	if(typeof(clickEffect)=="undefined"){
		clickEffect=true;
	}

	var rootSp = new cc.Sprite();
	//跟据参数初始化按钮状态图片
	for(var i in imageFiles){
		if(i == "0")rootSp.setTexture(imageFiles["0"]);
		var image = imageFiles[i];
		var sp = new cc.Sprite(image);
		sp.setPosition(cc.p(rootSp.getContentSize().width/2, rootSp.getContentSize().height/2));
		sp.setTag(i);
		rootSp.addChild(sp);
	}

	var touchListener = cc.EventListener.create({
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		swallowTouches: swallow,
		onTouchBegan: function(touch, event){
			var wp = touch.getLocation();
			var touchInSprite = cc.rectContainsPoint(rootSp.getBoundingBoxToWorld(), wp);
			return touchInSprite;
		},
		onTouchMoved: function(touch, event){
			if(movable){
				var delta = touch.getDelta();
				rootSp.x += delta.x;
				rootSp.y += delta.y;
			}
		},
		onTouchEnded:function(){
			if(!noSound){
				game.playMusic(sound);
			}
			if(clickEffect) {
				rootSp.runAction(uihelper.getCustomEasingAction());
			}
			if(typeof(listener)=="function"){
				listener();
			}else if(typeof(listener)=="object"){
				listener.callback();
			}
		}

	});

	cc.eventManager.addListener(touchListener, rootSp);
	rootSp.setTouchEnabled = function(bValue){
		if(bValue) {
			cc.eventManager.addListener(touchListener, rootSp);
		}
		else{
			cc.eventManager.removeListener(touchListener);
		}
	}
	rootSp.setEnable= function(bValue){
		this.setTouchEnabled(bValue);
	}
	return rootSp;
}