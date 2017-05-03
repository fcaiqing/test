/**
 * Created by zhengliming  on 2015/10/27.
 * Desc: 新手引导层
 */

var ForceGuideLayer = cc.Layer.extend({
	ctor: function (params) {
		this._super();
		//this.setTouchEnabled(false);
	},

	showGuideById:function(id) {
		game.inGuide = true;
		var node = game.totalGuideBtn[id];
		if (cc.director.getRunningScene().getChildByTag(1000)) {
			cc.director.getRunningScene().removeChildByTag(1000);
		}
		//-- 检查新手引导
		var tab = GUIDE[id];
		if (tab) {
			if (node) {
				tab.imagePos = node.getParent().convertToWorldSpace(cc.p(tab.initPos.x + node.getPositionX(), tab.initPos.y + node.getPositionY()));
			}
			this.layer = G_createGuideLayer(tab, tab.swallow, function () {
				if (cc.director.getRunningScene().getChildByTag(1000)) {
					cc.director.getRunningScene().removeChildByTag(1000);
					game.inGuide = false;
				}
				game.setGuideId(id);
			}, function () {

				game.setGuideId(id);
				//-- 如果有连续的引导则继续
				if (GUIDE[id + 1]) {
					this.showGuideById(id + 1);
				} else {

					//cc.log("*****before remove child 1000");
					if (cc.director.getRunningScene().getChildByTag(1000)) {
						cc.director.getRunningScene().removeChildByTag(1000);
						//cc.log("*****remove child 1000");
					}
					game.inGuide = false;
					game.setGuideId(0);
					if (id == 22) {
						//-- 冰球
						game.setGuideId(24);
					} else if (id == 52) {
						//-- 魔法球
						game.setGuideId(54);
					}
				}

			}.bind(this));
			cc.director.getRunningScene().addChild(this.layer, 1000, 1000);

		}

	}


})