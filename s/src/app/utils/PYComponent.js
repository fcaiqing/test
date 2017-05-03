/**
 * Created by beyondray on 2015/8/28.
 * Desc: �Զ��尴ť����
 */

var PYButton = function(imageName, text, fontSize, listener, movable,swallow,sound,noSound){
	sound = sound || PRE_LOAD_MUSIC.click;
	var sprite = new cc.Sprite(imageName);

	if(text){
		var cs = sprite.getContentSize();
		var label = new cc.LabelTTF(text, "debussy", fontSize);
		label.attr({anchorX:0.5, anchorY:0.5, x: cs.width/2, y:cs.height/2});
		sprite.addChild(label);
	}

	var touchEvent = cc.EventListener.create({
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		swallowTouches: swallow,
		onTouchBegan: function(touch, event){
			var wp = touch.getLocation();
			var touchInSprite = cc.rectContainsPoint(sprite.getBoundingBoxToWorld(), wp);
			return touchInSprite;
		},
		onTouchMoved: function(touch, event){
			if(movable){
				var delta = touch.getDelta();
				sprite.x += delta.x;
				sprite.y += delta.y;
			}
		},
		onTouchEnded:function(){
			if(!noSound){
				game.playMusic(sound);
			}
			if(!sprite.visible){
				return;
			}
			listener();
		}
	});

	cc.eventManager.addListener(touchEvent, sprite);
	sprite.fireClickEvent = function(){
		if(listener){
			listener();
		}
	}.bind(this);
	return sprite;
}