/**
 * Created by beyondray on 2015/8/28.
 * Desc: 读取数据的过度场景（作为cc.LoaderScene的备份，可以按需要定制修改)
 */

TIP = {
	checkingTip: "Checking version ...", //正在检查版本...
	DetectedNew: "Detected a new version, updated!", //检测到新版本需要更新
	UpdateSize: "Update size: ", // 更新包大小
	nextTime: "Next time", // 这次算了
	Update: "Update", // "更新"
	Downloading: "Downloading update file", //"正在下载更新文件..."
	Retry: "Retry", // 重试
	Skip: "Skip", //跳过
	ReadyToDown: "Ready to download the update file...", // 准备下载更新文件...
	updateDateError: "Update Failed! Please make sure your network is open and retry", // 更新数据出错！请确保您的网络畅通，并重试
	versionTip: "Version", // 版本号
	checkFailed: "Version check failed, error code:", // 版本检查失败, 错误码
	connectionFailed: "Connection Failed, Please try again later." // http请求失败！请确保您的网络畅通，并重试,
}

LoadingDataScene = cc.Scene.extend({
	_interval : null,
	_label : null,
	_className:"LoadingDataScene",
	cb: null,
	target: null,
	/**
	 * Contructor of cc.LoaderScene
	 * @returns {boolean}
	 */
	init : function(){
		var self = this;

		//logo
		var logoWidth = 160;
		var logoHeight = 200;

		// bg
		var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
		self.addChild(bgLayer, 0);

		//image move to CCSceneFile.js
		var fontSize = 35, lblHeight =  -logoHeight / 2 + 200;
		if(cc._loaderImage){
			//loading logo
			cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false }, function(err, img){
				logoWidth = img.width;
				logoHeight = img.height;
				self._initStage(img, cc.visibleRect.center);
			});
			fontSize = 25;
			lblHeight = -logoHeight / 2- 80;
		}
		//loading percent
		var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
		label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
		label.setColor(cc.color(180, 180, 180));
		bgLayer.addChild(this._label, 10);
		return true;
	},

	_initStage: function (img, centerPos) {
		var self = this;
		var texture2d = self._texture2d = new cc.Texture2D();
		texture2d.initWithElement(img);
		texture2d.handleLoadedTexture();
		var logo = self._logo = new cc.Sprite(texture2d);
		logo.setScale(cc.contentScaleFactor());
		logo.x = centerPos.x;
		logo.y = centerPos.y;
		self._bgLayer.addChild(logo, 10);
	},
	/**
	 * custom onEnter
	 */
	onEnter: function () {
		var self = this;
		cc.Node.prototype.onEnter.call(self);
		self.schedule(self._startLoading, 0.3);
	},
	/**
	 * custom onExit
	 */
	onExit: function () {
		cc.Node.prototype.onExit.call(this);
		var tmpStr = "Loading... 0%";
		this._label.setString(tmpStr);
	},

	/**
	 * init with resources
	 * @param {Array} resources
	 * @param {Function|String} cb
	 * @param {Object} target
	 */
	initWithResources: function (resources, cb, target) {
		if(cc.isString(resources))
			resources = [resources];
		this.resources = resources || [];
		this.cb = cb;
		this.target = target;
	},

	_startLoading: function () {
		var self = this;
		self.unschedule(self._startLoading);
		var res = self.resources;
		cc.loader.load(res,
			function (result, count, loadedCount) {
				var percent = (loadedCount / count * 100) | 0;
				percent = Math.min(percent, 100);
				self._label.setString("Loading... " + percent + "%");
			}, function () {
				if (self.cb)
					self.cb.call(self.target);
			});
	},
	initUI : function(){
	// 欢迎界面背景
	this.bg = new cc.Sprite(res.WelcomBg_png);
	this.bg.attr({x:display.cx, y:0, anchorX:0.5, anchorY:0});
	this.addChild(this.bg);

	// 经验槽
	this.loadingBg = new cc.Sprite();
	this.loadingBg.attr({x:display.cx, y:400});
	this.addChild(this.loadingBg);

	// 读取进度面板
	var loadingBarBottom = new cc.Sprite( res.Update_progress_bottom_png);
	var size = this.loadingBg.getContentSize();
	loadingBarBottom.attr({x:size.width/2, y:size.height/2-25});
	this.loadingBg.addChild(loadingBarBottom, -2);

	var loadingSlot = new cc.Sprite( res.StarProgressBarBg);
	loadingSlot.setPosition(cc.p(size.width/2, size.height/2));
	this.loadingBg.addChild(loadingSlot, -1);
	this.loadingProgress = new cc.ProgressTimer(new cc.Sprite(res.StarProgressBar));
	this.loadingProgress.type = cc.ProgressTimer.TYPE_BAR;
	this.loadingProgress.setMidpoint(cc.p(0, 0.5))
	this.loadingProgress.setBarChangeRate(cc.p(1,0))
	this.loadingProgress.setPercentage(100);
	this.loadingProgress.setPosition(cc.p(loadingSlot.getContentSize().width/2, loadingSlot.getContentSize().height/2));
	loadingSlot.addChild(this.loadingProgress);

	this.loadingHead = new cc.Sprite(res.Update_progress_head_png);
	this.loadingHead.attr({x:0, y:30, anchorX:0, anchorY:0.5});
	loadingSlot.addChild(this.loadingHead, 3);

	var fontDef = new cc.FontDefinition();
	fontDef.fontName = "framd";
	fontDef.fontSize = 24;
	this.loadingLabel = new cc.LabelTTF(0+"%", fontDef);
	this.setAnchorPoint(cc.p(0.5, 0/5));
	this.setPosition(cc.p(size.width/2, size.height/2));
	this.loadingBg.addChild(this.loadingLabel, 4);

	var loadingBarTop = new cc.Sprite(res.Update_progress_top_png);
	loadingBarTop.setPosition(cc.p(loadingSlot.getContentSize().width/2, loadingSlot.getContentSize().height/2-18));
	loadingSlot.addChild(loadingBarTop, 2);

	// 更新文字
	//fontDef.fontStyle = cc.color(0, 0, 255, 255);
	this.descLabel = new cc.LabelTTF(TIP.checkingTip, fontDef);
	this.descLabel.attr({x:this.getContentSize().width/2, y:90, anchorX:0.5, anchorY:0.5});
	this.addChild(this.descLabel);
}
});
/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @param target
 * @returns {cc.LoaderScene|*}
 * @example
 * //Example
 * cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
 */
LoadingDataScene.preload = function(resources, cb, target){
	var _cc = cc;
	if(!_cc.loaderScene) {
		_cc.loaderScene = new LoadingDataScene();

		cc.loader.loadImg(res.Update_progress_bottom_png);
		cc.loader.loadImg(res.WelcomBg_png);
		cc.loader.loadImg(res.StarProgressBar);
		cc.loader.loadImg(res.Update_progress_head_png);
		cc.loader.loadImg(res.Update_progress_top_png);
		_cc.loaderScene.init();
	}
	_cc.loaderScene.initWithResources(resources, cb, target);

	cc.director.runScene(_cc.loaderScene);
	return _cc.loaderScene;
};


