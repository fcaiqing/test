/**
 * Created by zhengliming  on 2015/10/27.
 * Desc: 新手引导层
 */

var SelecteItemBeforeStart = cc.Layer.extend({
	ctor: function (params) {
		this._super();
		this.initData(params);

		this.checkPreferentialItem();
		this.initUI();
		uihelper.setCustomPopAction(this);
		game.playMusic(PRE_LOAD_MUSIC.popWin);
	},
	initData: function (params) {
		this.retryFlag = params.retryFlag || false;
		this.callBack = params.callBack;
        this.cancelCallback = params.cancelCallback;
		this.level = params.level;
		this.size = cc.size(612, 901);
		this.items = [];
		this.starAndScore = game.getStarAndScoreByLevel(realLevelTurnId(this.level)) || {star: 0, score: 0};
		this.star = this.starAndScore.star //-- 当前关获取的星数
		this.model = params.model || LEVEL_MODEL.classic;
		this.itemCountLabelList = [];
		this.addItemIcoList = [];
		this.attr({
			anchorX: 0.5,
			anchorY: 0.5,
			x: display.cx,
			y: display.cy
		});
		this.ignoreAnchor=false;
		this.randomItemId = null; //-- 打折道具ID

		//this.setNodeEventEnabled(true);
	},

	onEnter: function () {
		this._super();
		//-- 检测是否显示引导
		if (game.getGuideId() != 0 && (game.getGuideId() == 21 || game.getGuideId() == 31 || game.getGuideId() == 51)) {
			new ForceGuideLayer({}).showGuideById(game.getGuideId());
		}
	},

	//-- 检测是否有打折道具
	checkPreferentialItem: function (){
		var recordData = game.getTodayFail();
		var randomItems = [];


		for (var i = 1; i <= 3; i++) {
			if (game.getItemCountByID(i) <= 0) {
				//-- 时间模式加步数道具不参与
				if (!(game.isTimeModel && i == ITEM_ID.addTen)) {
					randomItems.push(i);
				}
			}
		}

		if (recordData["level" + this.level] == 1000) {
			if (randomItems.length > 0) {
				this.randomItemId = randomItems[randomInt(0, randomItems.length)]
			}
			recordData["level" + this.level] = 0;
			game.setTodayFail(recordData);
		}

	},

	refreshItemCountLabel:function() {
		for (var i = 0; i < this.itemCountLabelList.length; i++) {
			var label = this.itemCountLabelList[i];
			var itemCount = game.getItemCountByID(i + 1);
			label.setString(itemCount);
			if (itemCount == 0) {
				this.addItemIcoList[i].setSpriteFrame(new cc.Sprite(res.Add_normal_png).getSpriteFrame());
				label.setVisible(false);
			} else {
				this.addItemIcoList[i].setSpriteFrame(new cc.Sprite(res.Item_count_bg).getSpriteFrame());
				label.setVisible(true);
			}
		}


		if (this.randomItemId && this.preferentialIco && game.getItemCountByID(this.randomItemId) > 0) {
			this.preferentialIco.removeFromParent();
			this.preferentialIco = null
		}
	},

	initUI:function() {


		var boxBg = new cc.Scale9Sprite(res.Bar_bg5_png, cc.rect(0, 0, 310, 306), cc.rect(60, 60, 211, 196));
		boxBg.setContentSize(612, 715);
		boxBg.attr({
			anchorX: 0.5,
			anchorY: 0.5
		})
		boxBg.setPosition(display.cx, display.cy + 90);
		this.addChild(boxBg);


		var titleBg = new cc.Sprite(res.Bar_bg7_png);
		titleBg.setPosition(boxBg.getContentSize().width / 2 + UI_CENTER_OFFER_X, boxBg.getContentSize().height);
		boxBg.addChild(titleBg);


		var label = new cc.LabelBMFont(this.level, res.TITLE_FONT, -1, cc.TEXT_ALIGNMENT_CENTER, cc.p(0, 0));
		label.setPosition(250, 80);
		titleBg.addChild(label);

		var level_tit = new cc.Sprite(res.Level_title);
		level_tit.setPosition(250, 75);
		titleBg.addChild(level_tit);

		var buleBg = new cc.Scale9Sprite(res.Blue_bg_png, cc.rect(0, 0, 183, 144), cc.rect(28, 23, 143, 100));
		buleBg.setContentSize(492, 296);
		buleBg.setPosition(304 + UI_CENTER_OFFER_X, 400);
		boxBg.addChild(buleBg);

		var effect = new cc.Sprite(res.Effect_bg_png);
		effect.setPosition(250, 153);
		effect.scale = 2;
		buleBg.addChild(effect);
		var action1 = new cc.RotateTo(6, -180);
		var action2 = new cc.RotateTo(6, -360);
		var repeatAction = new cc.RepeatForever(new cc.Sequence(action1, action2));
		effect.runAction(repeatAction);

		var modelSp = new cc.Sprite(LEVEL_MODEL_INFO[this.model].img);
		modelSp.setPosition(buleBg.getContentSize().width / 2, buleBg.getContentSize().height / 2 - 20);
		buleBg.addChild(modelSp);

		var starPos = {
			1: {x: 182.65, y: 347},
			2: {x: 256.85, y: 365},
			3: {x: 333.85, y: 347}
		}

		for (var i in starPos) {
			var posXY = starPos[i];
			var sp;
			if (this.star >= i) {
				sp = new cc.Sprite(res.Star_big_normal_png);
			} else {
				sp = new cc.Sprite(res.Star_big_disable_png);
			}
			sp.setPosition(posXY.x, posXY.y);
			buleBg.addChild(sp);
		}

		var typeDec = new cc.LabelBMFont(LEVEL_MODEL_INFO[this.model].text, res.CN_FONT, -1, cc.TEXT_ALIGNMENT_CENTER, cc.p(0, 0));
		typeDec.setColor(display.COLOR_WHITE);
		typeDec.setPosition(255, 260);
		buleBg.addChild(typeDec);


		var closeBtn = BYBtn([res.Close_png],function () {
			this.parent.removeFromParent();
            if(this.cancelCallback){
                this.cancelCallback();
            }
			//cc.log("****close");
		}.bind(this),false,true,false,false);

		closeBtn.attr({
			anchorX: 1,
			anchorY: 1
		});
		closeBtn.setPosition(this.size.width + (display.width - this.size.width) / 2 + 15, this.size.height + (display.height - this.size.height) / 2 + 15);
		this.addChild(closeBtn);

		//-- 显示三个道具
		var updateCheckBoxButtonLabel = function (checkbox){
			var state = "";
			if (checkbox.isSelected()) {
				state = "on"
			} else {
				state = "off"
			}
		}

		var itemBtnList = [];

		for(var i = 1;i<=3;i++ ) {

			var itemBg = new cc.Sprite(res.Head_bg);
			itemBg.attr({
				anchorX: 0,
				anchorY: 0.5,
				x: (i - 1) * 180 + 80,
				y: 190
			});
			boxBg.addChild(itemBg);


			var itemCount = game.getItemCountByID(i);
			var itemCountLabel;

			itemCountLabel = new cc.LabelTTF(itemCount.toString(), BUTTON_FONT, 28);
			itemCountLabel.setFontFillColor(cc.color(0, 42, 255, 255));
			itemCountLabel.setPosition(22, 19);


			var itemBtn = new ccui.CheckBox(res[string.format("Item_ico_off%d", "%d", i)], res[string.format("Item_ico_off%d", "%d", i)],
				null, res[string.format("Item_bubble%d_disabled", "%d", i)], null, ccui.Widget.LOCAL_TEXTURE);

			var checkBoxListener = {caller:this,itemId:i,label:itemCountLabel,itemBg:itemBg, cb: function (checkBox, event) {

				game.playMusic(PRE_LOAD_MUSIC.click);
				var k = -1;
				for (var j = 0; j < this.caller.items.length; j++) {
					if (this.caller.items[j] == this.itemId) {
						k = j;
						break;
					}
				}
				if (event == ccui.CheckBox.EVENT_SELECTED) {
					//-- 弹出购买道具界面
					if (game.getItemCountByID(this.itemId) <= 0) {
						var buyLayer = new BuyItemLayer({itemId: this.itemId, callback: function (flag) {
							//-- 购买道具成功更新道具数量
							if (flag) {
								this.refreshItemCountLabel();
								checkBox.setSelected(true);
								checkBox._selectedEvent();

							}
						}.bind(this.caller)});
						var maskLayer = new BYMask({});
						maskLayer.addChild(buyLayer);
						cc.director.getRunningScene().addChild(maskLayer, MIDDLE_WIN_TAG, MIDDLE_WIN_TAG);
						checkBox.setSelected(false);
						checkBox._unSelectedEvent();
						return;
					}

					if (k == -1) {
						this.label.setVisible(false);
						this.caller.items.push(this.itemId);
						var rightIco = new cc.Sprite(res.Right_ico);
						rightIco.setPosition(90, 20);
						this.itemBg.addChild(rightIco, 10, 333);
					}

				} else if (event == ccui.CheckBox.EVENT_UNSELECTED) {
					if (k != -1) {
						this.label.setVisible(true);
						this.label.setString(game.getItemCountByID(this.itemId));
						this.caller.items.splice(k, 1);
						if (this.itemBg.getChildByTag(333)) {
							this.itemBg.getChildByTag(333).removeFromParent();
						}
					}
				}
			}
			};
			itemBtn.addEventListenerCheckBox(checkBoxListener.cb, checkBoxListener);
			itemBtn.attr({
				anchorX: 0.5,
				anchorY: 0.5
			})
			itemBtn.setPosition(itemBg.getContentSize().width / 2, itemBg.getContentSize().height / 2);
			itemBg.addChild(itemBtn);

			var itemCountBg;
			if (itemCount > 0) {
				itemCountBg = new cc.Sprite(res.Item_count_bg);
			} else {
				itemCountBg = new cc.Sprite(res.Add_normal_png);
				itemCountLabel.setVisible(false);
			}
			itemCountBg.setPosition(90, 20);
			itemBg.addChild(itemCountBg);

			this.addItemIcoList.push(itemCountBg);

			//-- 注册引导按钮
			if (i == 1) {
				game.totalGuideBtn[21] = itemCountBg;
			} else if (i == 2) {
				game.totalGuideBtn[31] = itemCountBg;
			} else if (i == 3) {
				game.totalGuideBtn[51] = itemCountBg;
			}
			itemCountBg.addChild(itemCountLabel);

			//-- 时间模式加步数道具不能点
			if ((game.isTimeModel||game.curLevel==5) && i == ITEM_ID.addTen) {
				//-- 增加不可用说明
				itemBtn.setEnabled(false);
			}
			itemBtn.setScale(0.8);
			itemBtnList[i] = itemBtn;
			this.itemCountLabelList.push(itemCountLabel);

		}

		this.playBtn = BYBtn([res.Btn_bg1,res.Start_btn],	function() {
				game.updateCurrentHp();
				if (this.callBack) {
					if (!INPUT_MODEL && game.getHP() <= 0 && !game.getTwoHourFree()) {
						//-- 弹出购买生命界面
						var addHpLayer = new AddHpLayer({});
						//var mask = new BYMask({});
						//mask.addChild(addHpLayer);
						//cc.director.getRunningScene().addChild(mask, MIDDLE_WIN_TAG, MIDDLE_WIN_TAG);
						//this.playBtn.setState(1);
						return;
					}

					game.startLevel(this.level);

					this.items.sort();

					//-- 重新保存道具数量
					for (var i = 0; i < this.items.length; i++) {
						var itemId = this.items[i];
						game.setItemCountByID(itemId, game.getItemCountByID(itemId) - 1);
						game.use(ITEM_INFOR["item_" + itemId].um_itemId, 1, Number(ITEM_INFOR["item_" + itemId].price));
					}

					this.callBack(this.items);

					this.retryFlag = false;
				}
		}.bind(this),false,true,false,false);

		this.playBtn.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:314,
			y:85
		});
		boxBg.addChild(this.playBtn);
		game.totalGuideBtn[22] = this.playBtn;
		game.totalGuideBtn[32] = this.playBtn;
		game.totalGuideBtn[52] = this.playBtn;

	}

})