/**
 * Created by beyondray on 2015/8/31.
 */


var BYMsgBox = cc.Layer.extend({
	ctor:function(params){
		//this._super(cc.color(0,0,0,128));
		this._super();
		params = params || {};
		var msgId = params.msgId || 0;
		var msgData = SysMsg[msgId];
		this.color = params.color || display.COLOR_WHITE;
		this.text = msgData && msgData.text || params.text;
		this.type = msgData && msgData.type || params.type;
		this.closeBtn =params.closeBtn || false;

		this.titleBg = params.titleBg || null;
		this.effect = params.effect;
		this.title = params.title;
		this.ico = params.ico;
        this.unlock=params.unlock||false;
		this.size=cc.size(609,605);

		this.ignoreAnchor=false;
		this.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});

		if(this.type==1){
			this.flashMsg();
		}else{
			this.button1Data = params.button1Data||{};
			this.button2Data = params.button2Data||{};
			this.button1Data.offset = this.button1Data.offset || cc.p(0,0);

			if(getOwnProperyLength(this.button2Data)>0){
				this.button2Data.offset = this.button2Data.offset || cc.p(0,0);
			}
			//cc.log("before showBox***********");
			this.showBox();
		}

		if(this.closeBtn){
			var closeBtn=PYButton(res.Close_png,false,25,function(){
				this.removeFromParent();
			}.bind(this),false,true,false,false);
			closeBtn.attr({
				anchorX:1,
				anchorY:1,
				x:this.size.width+(display.width-this.size.width)/2+15,
				y:this.size.height+(display.height-this.size.height)/2+15
			});
			this.addChild(closeBtn);

		}

		uihelper.setCustomPopAction(this);

	},

	flashMsg:function(){

      //cc.log("in flashMsg********");

	},
	showBox:function(){
		//cc.log("in showBox")
		if(cc.director.getRunningScene().getChildByTag(MSG_POP_WIN_TAG)){
			cc.director.getRunningScene().removeChildByTag(MSG_POP_WIN_TAG);
		}


		var boxBg = new cc.Scale9Sprite(res.Bar_bg5_png,cc.rect(0,0,310,306),cc.rect(60,60,211,196));
		//boxBg.scale=2;
		boxBg.setContentSize(609,605);
		boxBg.attr({
			anchorX:0.5,
			anchorY:0.5
		})
		boxBg.setPosition(display.cx,display.cy);
		this.addChild(boxBg);

		var titleBg;

		if(this.titleBg) {

			titleBg= new cc.Sprite(res.Bar_bg7_png);
			titleBg.setPosition(boxBg.getContentSize().width/2 + UI_CENTER_OFFER_X,boxBg.getContentSize().height+15);

			boxBg.addChild(titleBg);
		}
		else{
			titleBg= new cc.Sprite(res.Bar_bg4_png);
			titleBg.setPosition(boxBg.getContentSize().width/2 ,585);
			boxBg.addChild(titleBg);
		}

		var buleBg = new cc.Scale9Sprite(res.Blue_bg_png,cc.rect(0,0,183,144),cc.rect(28,23,143,100));
		buleBg.setContentSize(492,296);
		buleBg.setPosition(304,390);
		boxBg.addChild(buleBg);

		var maskLayer=new BYMask({});
		maskLayer.addChild(this);
		cc.director.getRunningScene().addChild(maskLayer,99999,MSG_POP_WIN_TAG);


		//-- 特效
		if (this.effect) {
			var effect = new cc.Sprite(res.Effect_bg_png);
			effect.setPosition(250 + this.effect.offset.x, 153 + this.effect.offset.y);
			effect.scale = 2;
			buleBg.addChild(effect);
			var action1 = new cc.RotateTo(3, -180);
			var action2 = new cc.RotateTo(3, -360);
			var repeatAction = new cc.RepeatForever(new cc.Sequence(action1, action2));
			effect.runAction(repeatAction);
		}

		if (this.ico && typeof(this.ico) == "string") {
			//-- 说明图片
			var info = new cc.Sprite(this.ico);
			info.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: buleBg.getContentSize().width / 2,
				y: buleBg.getContentSize().height / 2
			})
			buleBg.addChild(info);
		}else if(typeof(this.ico) == "object") {

			for(var i=0;i<this.ico.length;++i){
				var img=this.ico[i];
				var sp=new cc.Sprite(img.image);
				sp.scale=img.scale;
				sp.attr({
					anchorX:0.5,
					anchorY:0.5,
					x:buleBg.getContentSize().width / 2 + img.offset.x,
					y:buleBg.getContentSize().height / 2 + img.offset.y
				})
				buleBg.addChild(sp);

			}

		}

		//--说明文字:
		if (this.text) {
			var whiteBg = new cc.Sprite(res.Fireds_cell_bg);
			whiteBg.attr({
				anchorX: 0.5,
				anchor: 0.5,
				x: 304,
				y: 180
			});
			boxBg.addChild(whiteBg);
            var descLable;
            //if(!this.unlock) {
            //    descLable = new cc.LabelBMFont(this.text, res.GUIDE_FONT, -1, cc.TEXT_ALIGNMENT_CENTER, cc.p(0, 0));
            //}else{
                descLable= new cc.LabelTTF(this.text,"Arial",25,null,cc.TEXT_ALIGNMENT_CENTER,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                descLable.setFontFillColor(cc.color(0,0,0,255));
            //}

            descLable.setPosition(whiteBg.getContentSize().width / 2, 55);
            whiteBg.addChild(descLable);
		}

		if (this.title) {

			if (this.title.indexOf("texture") != -1) {
				if (this.titleBg) {
					if (this.titleBg.offset) {
						offset = this.titleBg.offset;
					} else {
						offset = cc.p(0, 0);
					}
				} else {
					offset = cc.p(0, 0);
				}

				var titleSp = new cc.Sprite(this.title);
				titleSp.setPosition(160 + offset.x, 40 + offset.y);
				titleBg.addChild(titleSp);
			} else {
				//-- 标题文字
				var descLabel = new cc.LabelBMFont(this.title, res.CN_FONT, -1, cc.TEXT_ALIGNMENT_CENTER, cc.p(0, 0));
				descLabel.setPosition(160, 40);
				titleBg.addChild(descLabel);
			}
		}

		var btnNum = getOwnProperyLength(this.button2Data)>0?2:1;

		if(btnNum==1){
			var button1 = BYBtn([res.Btn_bg1,this.button1Data.front],function(){
				if(this.button1Data.callback){
					this.button1Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this),false,true,false,false);

			button1.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:this.size.width/2+this.button1Data.offset.x,
				y:80+this.button1Data.offset.y
			});
			boxBg.addChild(button1);

		}else{

			var button1 = BYBtn([res.Btn_bg1,this.button1Data.front],function(){
				if(this.button1Data.callback){
					this.button1Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this),false,true,false,false);

			button1.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:this.size.width/2+this.button1Data.offset.x-140,
				y:80+this.button1Data.offset.y
			});
			boxBg.addChild(button1);

			var button2 = BYBtn([res.Btn_bg2,this.button2Data.front],function(){
				if(this.button2Data.callback){
					this.button2Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this),false,true,false,false);

			button2.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:this.size.width/2+this.button2Data.offset.x+140,
				y:80+this.button2Data.offset.y
			});
			boxBg.addChild(button2);


		}

	}

})
