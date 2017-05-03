/**
 * Created by chuan on 2015/11/25.
 */

var PayBtn = function(listener,price,swallow,sound,mute,clickEffect,images){
	var imageFiles;
	if(typeof(images) == 'undefined' || !images){
		imageFiles = [res.Btn_bg3];
	}
	else{
		imageFiles = images;
	}

	sound = sound || PRE_LOAD_MUSIC.click;

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
	var fontDef = new cc.FontDefinition();
	fontDef.fontSize=30;
	fontDef.fontName=BUTTON_FONT;
	fontDef.fillStyle=cc.color(255,255,255,255);		
	var strUnit = cfgPayUnit;

	var lblPrice = new cc.LabelTTF(price+strUnit, fontDef);
	lblPrice.setPosition(cc.p(rootSp.getContentSize().width/2, rootSp.getContentSize().height/2));
	lblPrice.setTag(i+1);
	rootSp.addChild(lblPrice);

	var touchListener = cc.EventListener.create({
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		swallowTouches: swallow,
		onTouchBegan: function(touch, event){
			var wp = touch.getLocation();
			var touchInSprite = cc.rectContainsPoint(rootSp.getBoundingBoxToWorld(), wp);
			return touchInSprite;
		},
		onTouchMoved: function(touch, event){
		},
		onTouchEnded:function(){
			if(!mute){
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
			lblPrice.setString("已购买");
		}
	}
	rootSp.setEnable= function(bValue){
		this.setTouchEnabled(bValue);
	}
	return rootSp;
}