/**
 * Created by beyondray on 2015/8/28.
 * Desc: 选择开始游戏的欢迎场景
 */

var WelcomeScene = cc.Scene.extend({
    tokenReturn:false,
    tokenTimer : null,
    openWhenLogin : false,
	ctor:function(options){
		this._super();
		this.setName("WelcomeScene");
        
        if(options && options['firstlogin']){
            this.openWhenLogin = true; // 区分是登录后过来的还是从地图返回的
            try{
			 initpage();
            }
            catch(e){
                
            }
            this.checkLoginState();
            if(game){
                game.updateLoginToken();
                game.keepSessionAlive();
            }
        }
        else{
            if(servermode == "QQ"){
                logout();
            }
            this.initUI();
            if(servermode == "HGAME"){
                var callback = function(rsp){
                    if(rsp.code === 0){
                       window.document.location.href = gameurlfirstpage; 
                    }
                };
                reLogin(callback);
                return;
            }
        }
	},
	onEnter:function(){
		this._super();
		game.playBackMusic();
		game.loadPayCfg();
		this.createSetUpLayer();
		//cc.loader.load(level_resources);
	},
    onExit : function(){
        if(this.tokenTimer){
            clearTimeout(this.tokenTimer);
        }
        this._super();
    },
	createSetUpLayer:function(){
		this.setupLayer = new SetupLayer({name :this.getName(),scene:this });
		this.setupLayer.ignoreAnchor=false;
		this.setupLayer.attr({
			anchorX:0,
			anchorY:0
		});

		this.setupLayer.setPosition(cc.p(display.width>=DESIGN_WIDTH?OFFSET.x:OFFSET.x,0));
		this.addChild(this.setupLayer,SETUP_TAG);
	},
	initUI:function() {
		// 欢迎界面背景
		this.bg = new cc.Sprite(res.WelcomBg_png);
		this.bg.attr({x: display.cx, y: 0, anchorX: 0.5, anchorY: 0});
		this.addChild(this.bg);
        /*
		var loading_txt=new cc.Sprite(res.Loading2_png);
		loading_txt.attr({ x : display.cx, y: display.cy-170, anchorX : 0.5, anchorY : 0.5});
		loading_txt.setVisible(false);

		welcomeScene.addChild(loading_txt,2);
         */
		

		this._addPlayButton();
		if(servermode=="QQ"){	
			this._addLoginButton();
			//this._addLogoutButton();
		}
	},
	_addPlayButton:function(){
		// 显示Play按钮
		 var clickListener = function () {
				 /*
				  LoadingDataScene.preload(play_scene_resources,function() {
				  switchScene("SelectMapScene", {autoScroll: true, enterNext: false});
				  },this);
				  */
				var pbar_bg=new cc.Sprite(res.Progress_bg);
				pbar_bg.attr({ x : display.cx, y: display.cy-230, anchorX : 0.5, anchorY : 0.5});
				pbar_bg.setVisible(false);
				this.addChild(pbar_bg,2);
				var loadingBar = new ccui.LoadingBar();
				loadingBar.loadTexture(res.Progress_bar);
				loadingBar.setDirection(ccui.LoadingBar.TYPE_LEFT);
				loadingBar.x = pbar_bg.width / 2;
				loadingBar.y = pbar_bg.height / 2+ loadingBar.height / 6;
				loadingBar.setVisible(false);
				pbar_bg.addChild(loadingBar);
		
				var loadingBar2=new ccui.LoadingBar();
				loadingBar2.loadTexture(res.Loading2_png);
				loadingBar2.setDirection(ccui.LoadingBar.TYPE_LEFT);
				loadingBar2.x=pbar_bg.width / 2;;
				loadingBar2.y=pbar_bg.height / 2+ loadingBar.height*1.8;
				pbar_bg.addChild(loadingBar2,2);
				  
			     var playBtn=this.getChildByTag(1013);
			     playBtn.setVisible(false);
			     //loading_txt.setVisible(false);
			     pbar_bg.setVisible(true);
			     loadingBar.setVisible(true);
			     loadingBar.setPercent(0);
				 var percent=0;
			     var timer = setInterval(function(){
				     if(percent>=120){
					     percent=0;
				     }
				     loadingBar2.setPercent(percent);
					 percent+=10;
			     },150);

			     setTimeout(function(){
				     cc.loader.load(play_scene_resources,
					     function (result, count, loadedCount) {
						     var percent = (loadedCount / count * 100) | 0;
						     percent = Math.min(percent, 100);
						     loadingBar.setPercent(percent);
					     }, function () {
							 clearInterval(timer);
							 loadingBar2=null;
							 loadingBar=null;
							 pbar_bg=null;
						     switchScene("SelectMapScene", {autoScroll: true, enterNext: false, fromWelcome:true});
					 });
			     },500);
		 }.bind(this);
         //小伙伴平台点击开始游戏需要先获取用户信息
         var clickListenerHGame = function(){
             var onUserInfoCallback = function(rsp){
                 //alert(JSON.stringify(rsp));
                 if(rsp.result && rsp.code === 0){
                    var userid = rsp.userid;
                    devServer.saveUserId(userid);
                    GameDataMgr.loadfromServer(function(){
                        clickListener();
                    }.bind(this));
                 }
                 else{
                     alert(rsp.msg);
                 }
             }.bind(this);
             devServer.getUserinfo(onUserInfoCallback);
         }.bind(this);
		 var playBtn = (servermode=="HGAME" && this.openWhenLogin) ? 
           PYButton(res.Game_start_btn, "", 35, clickListenerHGame, false, true)
         : PYButton(res.Game_start_btn, "", 35, clickListener, false, true) ;
		 playBtn.attr({ x : display.cx, y: display.cy-200, anchorX : 0.5, anchorY : 0.5});
		 playBtn.runAction(cc.sequence(uihelper.getCustomEasingAction(), cc.delayTime(1)).repeatForever());
		 this.addChild(playBtn, 1,1013);
		 if(servermode=="QQ"){	
		 	playBtn.setVisible(false);
		 }
	},
    _loginCallback:function(type,rsp){
        rsp['logintype'] = type;

        if(rsp.result == 0){
            store.write(devServer.getLocaldataKey(), JSON.stringify(rsp));
            GameDataMgr.loadfromServer(function(){
                this._onLoginSuccess();
                if(servermode == "QQ"){
                    devServer.saveUserInfo(rsp);
                }
            }.bind(this)); 
            
        }
        else{
            this._onLoginFailed();
        }
    },
	_addLoginButton:function(){
		var loginQQ = function(){
			login("qq",function(type, rsp){
                this._loginCallback(type,rsp);
            }.bind(this));
		}.bind(this);
		var loginWX = function(){
			login("wx",function(type, rsp){
                this._loginCallback(type,rsp);
            }.bind(this));
		}.bind(this);
		
		var btnLoginQQ = new PYButton(res.BtnQQLogin_png, "", 35, loginQQ, false, true);
		btnLoginQQ.attr({ x : display.cx - 150, y: display.cy-300, anchorX : 0.5, anchorY : 0.5});
		this.addChild(btnLoginQQ, 1,1014);
		
		var btnLoginWX = new PYButton(res.BtnWXLogin_png, "", 35, loginWX, false, true);
		btnLoginWX.attr({ x : display.cx + 150, y: display.cy-300, anchorX : 0.5, anchorY : 0.5});
		this.addChild(btnLoginWX, 1,1015);
	},
	_addLogoutButton:function(){
		var LOGOUT = function(){
			logout(function(rsp){
				//util.debug(rsp);
				store.clear();
				this._changeButtonState(false);
			}.bind(this));
		}.bind(this);
		var btnLogout = new PYButton(res.BtnReLogin_png, "", 35, LOGOUT, false, true);
		btnLogout.attr({ x : display.cx + 300, y: display.cy+460, anchorX : 0.5, anchorY : 0.5});
		this.addChild(btnLogout, 1,1016);
		btnLogout.setVisible(false);
	},
	_changeButtonState:function(islogin){
		if(servermode=="QQ"){
			var playBtn=this.getChildByTag(1013);
			var qqBtn=this.getChildByTag(1014);
			var wxBtn=this.getChildByTag(1015);
			//var reloginBtn=this.getChildByTag(1016);
            var avatar1 = this.getChildByTag(2000);
			var avatar2 = this.getChildByTag(2001);		
            
			playBtn.setVisible(islogin);
			qqBtn.setVisible(!islogin);
			wxBtn.setVisible(!islogin);
			//reloginBtn.setVisible(islogin);
            
            if(avatar1 && islogin){
                avatar1.removeFromParent();
            }
            if(avatar2 && islogin){
                avatar2.removeFromParent();
            }
			
			if(islogin){
				setTimeout(function(){
					if(playBtn){
						playBtn.fireClickEvent();
					}
					
				}.bind(this), 500);
			}
		}
	},
	_onLoginSuccess:function(){
        util.debug("debug:login success");
		if(servermode != "QQ"){
			return;
		}
		this._connectToSocket();
	},
	_onLoginFailed:function(){
		util.debug("登录失败!");
	},
	checkLoginState:function(){
		var userinfo = store.getAll();

		if(servermode == "WANBA"){
			//this._connectToSocket();
			GameDataMgr.loadfromServer(function(){
				this.initUI();
			}.bind(this));
		}
		else if(servermode == "QQ" && userinfo && userinfo["qbopenid"]){
			var qqid = userinfo["qbopenid"];
			var token = userinfo["refreshToken"];
			refreshToken(qqid, token, function(success){
                this.tokenReturn = true;
				if(success){
					this.initUI();
					this._changeButtonState(true);
				}
                else{
                    this.initUIQQBrowser();
                }
			}.bind(this));
            this.tokenTimer = setTimeout(function() {
                if(!this.tokenReturn){
                    this.initUIQQBrowser();
                }
                this.tokenReturn = true;
            }.bind(this), 3000);
		}
		else{
			this.initUIQQBrowser();
		}
	},
    initUIQQBrowser:function(){
        this.initUI();
        if(servermode == "QQ"){
            //获取头像
            var avatarCallback = (function(rsp){
                if(rsp.result == 0){
                    for(var i = 0; i < rsp.loginTypes.length; i++){
                        var logintype = rsp.loginTypes[i].loginType;
                        if(logintype != "qq" && logintype != "wx"){
                            continue;
                        }
                        var logininfo = rsp.loginTypes[i].accInfo;
                        if(logininfo){
                            //util.debug(logininfo.avatarUrl);
                            var avatar = new cc.Sprite(logininfo.avatarUrl);
                            if(logintype == "qq"){
                                avatar.x = display.cx - 150 - 81;
                                avatar.y = display.cy - 300 + 5;
                                avatar.scale = 0.22;
                            }
                            else if(logintype == "wx"){
                                avatar.x = display.cx + 150 - 81;
                                avatar.y = display.cy - 300 + 5;
                                avatar.scale = 0.064;
                            }
                            this.addChild(avatar,2, 2000+i);
                        }
                    }
                    this._resizeAvatar();
                }
                else{
                    util.debug("没有获取到头像："+rsp.msg);
                }
            }).bind(this);
            getAvailableLoginType(avatarCallback);
        }
    },
    _resizeAvatar:function(){
        setTimeout(function(){
            var avatar1 = this.getChildByTag(2000);
			var avatar2 = this.getChildByTag(2001);	
            if((avatar1 && avatar1.getContentSize().width == 0)
            || (avatar2 && avatar2.getContentSize().width == 0)){
                this._resizeAvatar();
                return;
            }
            if(avatar1 && avatar1.getContentSize().width > 0){
                avatar1.scale = 45 / avatar1.getContentSize().width;
            }
            if(avatar2 && avatar2.getContentSize().width > 0){
                avatar2.scale = 45 / avatar2.getContentSize().width;
            }
        }.bind(this), 200);
    },
	_connectToSocket:function(){
		var userinfo = store.getAll();
		if(!userinfo){
            util.debug("warning: userinfo not found");
			return;
		}
		var openqqid = userinfo["qbopenid"];
		if(!openqqid){
            util.debug("warning: openqqid not found");
			return;
		}
		//建立websocket连接
        if(game && game.socket){
            game.socket.disconnect();
            game.socket = null;
        }
        util.debug("debug: connect via socket");
		var socket = game.socket = io.connect('http://115.159.144.182:8011',{'force new connection': true,reconnect: false});
		//收到server的连接确认
		socket.on('token',function(data){
			clientToken = data;
			socket.emit("login",{"token":data,"id":openqqid});
            util.debug("info: send out login request");
			this._changeButtonState(true);
		}.bind(this));
		//表示收到服务器要求退出的请求
		socket.on('logout',function(data){
			game.showAlertMessage("您的账号在其他设备上登录了本游戏！",function(){
				socket.disconnect();
                cc.director.runScene(new WelcomeScene());
			})
		});
		
		//监听message事件，打印消息信息
		socket.on('disconnect',function(){
            util.debug("warning: disconnect");
		});
	}
})
