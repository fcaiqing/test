/**
 * Created by beyondray on 2015/8/20.
 * Desc: �ײ�������(����ɣ�
 */

var BottomLayer = cc.Layer.extend({
	ctor: function(params){
		this._super();
		this.initData(params);
		this.initUI();
		this.addTouchEventListenser();
	},
	initData:function(params){
		this.callBack = params.callBack;
		this.scene = params.scene;
		this.size = cc.size(BOTTOM_RECT.width ,BOTTOM_RECT.height);
		this.setContentSize(this.size);
		this.selectedItem = 0;
	},

	resetGroup:function(){
		for(var key in this.group){
			this.group[key] = false;
		}
	},

	refreshItemCountLabel:function(){
		for(i in this.itemCountLabelList){
			var luaIndex=parseInt(i)+1;
			var itemCount = game.getItemCountByID(luaIndex+3);
			var label=this.itemCountLabelList[i];

			//cc.log("In refreshItemCountLabel:"+"[itemId="+luaIndex+"]="+itemCount);
			label.setString(itemCount);

			if(itemCount==0){
				this.addItemIcoList[i].setSpriteFrame(new cc.Sprite(res.Add_normal_png).getSpriteFrame());
				label.setVisible(false);
			}else{
				this.addItemIcoList[i].setSpriteFrame(new cc.Sprite(res.Item_count_bg).getSpriteFrame());
				label.setVisible(true);
			}
		}
	},

	initUI:function(){
		//Bg
		var bg = new cc.Scale9Sprite(res.GAME_BOTTOM_PNG, cc.Rect(0, 0, this.size.width, this.size.height),cc.rect(0,0,0,0));
		bg.attr({x:this.size.width/2, y: this.size.height/2});
		this.addChild(bg);
		this.group=[];
		this.itemBtnList=[];
		this.itemCountLabelList=[];
		this.addItemIcoList=[];
		var posX=[0,display.cx - 250+70, display.cx-50+70, display.cx + 150+70];
		var meBottomLayer=this;
		for(var i= 4;i<=5;i++){

			var itemCount = game.getItemCountByID(i);
			var itemCountLabel;
			var fontDef = new cc.FontDefinition();
			fontDef.fontSize=28;
			fontDef.fontName=BUTTON_FONT;
			fontDef.fillStyle=cc.color(0, 42, 255, 255);
			itemCountLabel=new cc.LabelTTF(itemCount,fontDef);
			itemCountLabel.setPosition(cc.p(22,20));

			var itemBtn = BYBtn([res["Item_ico_off"+i],res["Item_ico_off"+i]],{
				    itemId:i,
					itemCountLabel:itemCountLabel,
					callback:function(){
					var cbObject=this;
					if(game.getItemCountByID(cbObject.itemId)<=0){
						var maskLayer=new BYMask({});
						cc.director.getRunningScene().addChild(maskLayer,POP_WIN_TAG,POP_WIN_TAG);
						var buyLayer = new BuyItemLayer({itemId:cbObject.itemId,callback:function(flag){
							//购买道具成功更新道具数量
							if(flag){
								if(meBottomLayer.selectedItem!=cbObject.itemId){
									meBottomLayer.resetGroup();
								}
								if(!meBottomLayer.group[cbObject.itemId]){
									meBottomLayer.group[cbObject.itemId]=false;
								}
								meBottomLayer.group[cbObject.itemId]=!meBottomLayer.group[cbObject.itemId];
								if(meBottomLayer.group[cbObject.itemId]){
									//-- 临时减少一个道具
									var curItemCount = game.getItemCountByID(cbObject.itemId);
									game.gameData.items[cbObject.itemId]=curItemCount-1;
									meBottomLayer.refreshItemCountLabel();
									//-- 更新显示后恢复道具数量
									game.gameData.items[cbObject.itemId]=curItemCount;
									cbObject.itemCountLabel.setString(curItemCount-1);
									meBottomLayer.selectedItem=cbObject.itemId;
									performWithDelay(meBottomLayer,function(){
										if(meBottomLayer.callBack) {
											meBottomLayer.callBack(meBottomLayer.selectedItem);
										}
									},0);

								}else{
									meBottomLayer.refreshItemCountLabel();
									cbObject.itemCountLabel.setString(game.getItemCountByID(this.itemId));
									meBottomLayer.selectedItem=0;
									performWithDelay(meBottomLayer,function(){
										if(meBottomLayer.callBack) {
											meBottomLayer.callBack(meBottomLayer.selectedItem);
										}
									},0);
								}
							}
						}
						});

						maskLayer.addChild(buyLayer);

						return;
					}

					if(meBottomLayer.selectedItem!=cbObject.itemId){
						meBottomLayer.resetGroup();
					}

					if(!meBottomLayer.group[cbObject.itemId]){
						meBottomLayer.group[cbObject.itemId]=false;
					}
					meBottomLayer.group[cbObject.itemId]=!meBottomLayer.group[cbObject.itemId];

					if(meBottomLayer.group[cbObject.itemId]){
						var curItemCount=game.getItemCountByID(cbObject.itemId);
						//cc.log("when group is true:itemId="+cbObject.itemId+":"+curItemCount);

						game.gameData.items[cbObject.itemId]=curItemCount-1;
						meBottomLayer.refreshItemCountLabel();
						game.gameData.items[cbObject.itemId]=curItemCount;
						cbObject.itemCountLabel.setString(curItemCount-1);
						meBottomLayer.selectedItem=cbObject.itemId;
						if(meBottomLayer.callBack) {
							meBottomLayer.callBack(meBottomLayer.selectedItem);
						}
					}else{
						meBottomLayer.refreshItemCountLabel();
						cbObject.itemCountLabel.setString(game.getItemCountByID(cbObject.itemId));
						meBottomLayer.selectedItem=0;
						if(meBottomLayer.callBack) {
							meBottomLayer.callBack(meBottomLayer.selectedItem);
						}
					}

			    }
		    },false,true,false,false);

			itemBtn.attr({
				anchorX:0.5,
				anchorY:0.5,
				x:posX[i-3],
				y:BOTTOM_RECT.height/2
			});
			this.addChild(itemBtn);

			if(i==4){
				game.totalGuideBtn[1]=itemBtn;
			}else if(i==5){
				game.totalGuideBtn[11]=itemBtn;
			}
			this.itemBtnList.push(itemBtn);
			this.group[i]=false;


			var itemCountBg;
			if(itemCount>0){
				itemCountBg = new cc.Sprite(res.Item_count_bg);
				itemCountBg.scale=0.8;
				itemCountBg.setPosition(cc.p(itemBtn.getContentSize().width,20));
				itemBtn.addChild(itemCountBg);
			}else{
				itemCountBg = new cc.Sprite(res.Add_normal_png);
				itemCountBg.scale=0.8;
				itemCountBg.setPosition(cc.p(itemBtn.getContentSize().width,20));
				itemBtn.addChild(itemCountBg);
				itemCountLabel.setVisible(false);
			}

			this.addItemIcoList.push(itemCountBg);
			itemCountBg.addChild(itemCountLabel);
			this.itemCountLabelList.push(itemCountLabel);
		}

		var itemCount=game.getItemCountByID(ITEM_ID.addThree);
		var itemCountLabel;
		var itemIcoImage = string.format("Item_ico_off%d","%d",ITEM_ID.addThree);

		var flyBubbleEffect;
		var cur_index=0;

		flyBubbleEffect =function(){
		   if(cur_index<3){
			   var flySp=new cc.Sprite(res.Add_bubble_fly_ico);
			   flySp.setAnchorPoint(0.5,0.5);
			   flySp.setPosition(cc.p(posX[ITEM_ID.addThree-3]+15,BOTTOM_RECT.height/2));
			   this.parent.effectLayer.addChild(flySp);
			   var bezier = [cc.p(posX[ITEM_ID.addThree-3],BOTTOM_RECT.height/2),
				   cc.p(display.cx+200,200),
				   cc.p(WAIT_BUBBLE_POS.x - 95,WAIT_BUBBLE_POS.y-25),
			   ];
			   var bezierForward = new cc.BezierTo(0.6,bezier);
			   flySp.runAction(
				   new cc.Sequence(
					   bezierForward,
					   new cc.FadeOut(0.2),
					   new cc.CallFunc(function(){
							meBottomLayer.parent.updateWaitBubbleNum(meBottomLayer.parent.waitBubbleNum+1);
							game.playMusic(MUSIC_CONFIG.addBubbleNum);
					   })
				   )
			    );


		   }else{

		   }
		}.bind(this);
		this.addBubbleBtn =BYBtn([res[itemIcoImage],res[itemIcoImage],game.isTimeModel?res.Item_ico_off6_disable:res[itemIcoImage]],function(){
				var itemCount= game.getItemCountByID(ITEM_ID.addThree);
				if(itemCount<=0){
					var buyLayer=new BuyItemLayer({itemId:ITEM_ID.addThree,callback:function(flag){
						if(flag){
							itemCount= game.getItemCountByID(ITEM_ID.addThree);
							itemCountLabel.setString(itemCount-1);
							game.setItemCountByID(ITEM_ID.addThree,itemCount-1);
							this.refreshItemCountLabel();
							//-- 这里显示加3球的特效
							cur_index=0;
							this.runAction(new cc.Repeat(new cc.sequence(
									new cc.DelayTime(0.2),
									new cc.CallFunc(function(){
										flyBubbleEffect();
										cur_index++;
									})
								),3
							))
						}
					}.bind(this)
					});
					var maskLayer=new BYMask({});
					maskLayer.addChild(buyLayer);

					cc.director.getRunningScene().addChild(maskLayer,POP_WIN_TAG,POP_WIN_TAG);
				}else{
					itemCountLabel.setString(itemCount-1);
					game.setItemCountByID(ITEM_ID.addThree,itemCount-1);
					this.refreshItemCountLabel();
					//-- 这里显示加3球的特效
					cur_index=0;
					this.runAction(new cc.Repeat(new cc.Sequence(
							new cc.DelayTime(0.2),
							new cc.CallFunc(function(){
								flyBubbleEffect();
								cur_index++;
							})
						),3
					))

				}

		}.bind(this),false,true,false,false);
		this.addBubbleBtn.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:posX[ITEM_ID.addThree-3],
			y:BOTTOM_RECT.height/2
		});
		this.addChild(this.addBubbleBtn);
		game.totalGuideBtn[41]=this.addBubbleBtn;

		var fontDef = new cc.FontDefinition();
		fontDef.fontSize=28;
		fontDef.fontName=BUTTON_FONT;
		fontDef.fillStyle=cc.color(0, 42, 255, 255);
		itemCountLabel=new cc.LabelTTF(itemCount,fontDef);
		itemCountLabel.setPosition(cc.p(22,20));
		var itemCountBg;
		if(itemCount>0){
			itemCountBg = new cc.Sprite(res.Item_count_bg);
			itemCountBg.scale=0.8;
			itemCountBg.setPosition(cc.p(this.addBubbleBtn.getContentSize().width,22));
			this.addBubbleBtn.addChild(itemCountBg);
		}else{
			itemCountBg = new cc.Sprite(res.Add_normal_png);
			itemCountBg.scale=0.8;
			itemCountBg.setPosition(cc.p(this.addBubbleBtn.getContentSize().width,22));
			this.addBubbleBtn.addChild(itemCountBg);
			itemCountLabel.setVisible(false);
		}

		this.addItemIcoList.push(itemCountBg);
		itemCountBg.addChild(itemCountLabel);

		if(game.isTimeModel){
			this.addBubbleBtn.setEnable(false);
		}

		this.itemCountLabelList.push(itemCountLabel);

	},
	setEnable:function(enable){
		for(k in this.itemBtnList){
			if(this.parent.waitBubbleNum == 0){
				//-- 最后一球发射后不能使用道具
				this.itemBtnList[k].setTouchEnabled(false);
			}else {
				this.itemBtnList[k].setTouchEnabled(enable);
			}
		}
		if (this.addBubbleBtn) {
			if (game.isTimeModel) {
				this.addBubbleBtn.setEnable(false);
			}else{
				if (this.parent.waitBubbleNum == 0) {
					//-- 最后一球发射后不能使用道具
					this.addBubbleBtn.setEnable(false);
				} else {
					this.addBubbleBtn.setEnable(enable);
				}

			}
		}
	},

	addTouchEventListenser: function () {
		this.touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			caller: this,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan
		});
		cc.eventManager.addListener(this.touchListener, this);
	},
	onTouchBegan:function(touch, event){
		var wp = touch.getLocation();
		var lp = this.caller.convertToNodeSpace(wp);
		var rect = cc.rect(0,0,this.caller.size.width,this.caller.size.height);
		if(cc.rectContainsPoint(rect, lp))
		{
			//cc.log("touch bottomLayer!!");
			return true;
		}
		else
			return false;
	}
})