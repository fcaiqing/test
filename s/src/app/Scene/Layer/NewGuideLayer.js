/**
 * Created by zhengliming  on 2015/10/27.
 * Desc: 新手引导层
 */

var NewGuideLayer = cc.Layer.extend({
	ctor: function (params) {
		this._super();
		this.initData(params);
	},
	initData: function (params) {
		params = params || {};
		var msgId = params.msgId || 0;
		var msgData = SysMsg[msgId];
		this.color = params.color || display.COLOR_WHITE;
		this.text = msgData && msgData.text || params.text;
		this.type = msgData && msgData.type || params.type;

		this.bg = params.bg || "#box_bg.png";
		this.effect = params.effect;
		this.title = params.title;
		this.ico = params.ico;

		this.size = cc.size(609, 609);
		this.attr({
			anchorX: 0.5,
			anchorY: 0.5,
			x: display.cx,
			y: display.cy
		});

		this.button1Data = params.button1Data || {};
		this.button2Data = params.button2Data || {};
		this.button1Data.offset = this.button1Data.offset || cc.p(0, 0);
		if (getOwnProperyLength(self.button2Data) > 0) {
			this.button2Data.offset = this.button2Data.offset || cc.p(0, 0);
		}
		this.showBox();
	},

	showBox: function () {

		if (cc.director.getRunningScene().getChildByTag(MSG_POP_WIN_TAG)) {
			cc.director.getRunningScene().removeChildByTag(MSG_POP_WIN_TAG)
			return;
		}
		this.attr({
			anchorX: 0.5,
			anchorY: 0.5,
			x: display.cx,
			y: display.cy
		});

		var boxBg = new cc.Scale9Sprite(res.Bar_bg5_png, cc.rect(0, 0, 310, 306), cc.rect(60, 60, 211, 196));
		boxBg.setPosition(display.cx, display.cy);
		this.addChild(boxBg);

		var maskLayer = new BYMask({});
		maskLayer.addChild(this);
		cc.director.getRunningScene().addChild(maskLayer, 99999, MSG_POP_WIN_TAG);


		if (this.ico && typeof(this.ico) == "string") {
			//-- 说明图片

			var ico = new cc.Sprite(this.ico);
			ico.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: boxBg.getContentSize().width / 2 + 5,
				y: boxBg.getContentSize().height / 2 + 130
			});
			boxBg.addChild(ico);
		} else if (typeof(this.ico) == "object") {

			for (var i = 0; i < this.ico.length; i++) {
				var img = this.ico[i];
				var sp = new cc.Sprite(img.image);
				sp.attr({
					anchorX: 0.5,
					anchorY: 0.5,
					x: boxBg.getContentSize().width / 2 + img.offset.x,
					y: boxBg.getContentSize().height / 2 + img.offset.y
				})
				boxBg.addChild(sp);
			}
		}

		//--说明文字:
		if (this.text) {
			var whiteBg = new cc.Sprite(res.Fireds_cell_bg);
			whiteBg.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: 304,
				y: 205
			});
			boxBg.addChild(whiteBg);

			var descLabel = new cc.LabelTTF(this.text, "Arial", 25, cc.size(420, 120), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
			descLabel.setPosition(whiteBg.getContentSize.width / 2, 58);
			descLabel.setColor(display.COLOR_UPDATE);
			whiteBg.addChild(descLabel);

		}

		var btnNum = getOwnProperyLength(this.button2Data) > 0 ? 2 : 1;

		if (btnNum == 1) {
			var button1 = BYBtn([res.Btn_bg1, this.button1Data.front], function () {
				if (this.button1Data.callback) {
					this.button1Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this), false, true, false, false);

			button1.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: this.size.width / 2 + this.button1Data.offset.x,
				y: 85 + this.button1Data.offset.y
			});
			boxBg.addChild(button1);

		} else {

			var button1 = BYBtn([res.Btn_bg1, this.button1Data.front], function () {
				if (this.button1Data.callback) {
					this.button1Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this), false, true, false, false);

			button1.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: this.size.width / 2 + this.button1Data.offset.x - 10,
				y: 20 + this.button1Data.offset.y
			});
			boxBg.addChild(button1);

			var button2 = BYBtn([res.Btn_bg2, this.button2Data.front], function () {
				if (this.button2Data.callback) {
					this.button2Data.callback();
				}
				this.parent.removeFromParent();
			}.bind(this), false, true, false, false);

			button2.attr({
				anchorX: 0.5,
				anchorY: 0.5,
				x: this.size.width / 2 + this.button2Data.offset.x + 10,
				y: 20 + this.button2Data.offset.y
			});
			boxBg.addChild(button2);
		}

	}
})