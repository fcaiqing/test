var servermode="QQ";
var appid="8692742228";
var cfgPayUnit = "Q米";
var gameforumurl = "http://circle.html5.qq.com/?from=011&ch=20&gameId=8692742228&ispagegame=1#circle/q_11833288344_1449647476184926";

var clientToken = 0;
var sessionInfo = {
    qbopenid: "",
    qbopenkey: "",
    refreshToken: '',
    nickName: '',
    avatarUrl: ''
};

var devServer = {
    getSig: function (api, option, succCallBack, errorCallBack) {
        var url = serverAjax+"getQQSign.html";
        option.api = api;
        option.method = "POST";
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "POST",
            url: url,
            data: option,
            dataType: "json",
            success: succCallBack,
            error: errorCallBack || function errorCallBack(err) {
                util.debug("从开发者服务端获取签名失败！" + err);
            }
        });
    },
    checkFirstShare: function(successCallback,errorCallBack){
        checkLoginSession();
        var option = {"qbopenid":sessionInfo.qbopenid};
        var url = serverAjax+"checkFirstShare.html";
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "GET",
            url: url,
            data: option,
            dataType: "json",
            success: successCallback,
            error: errorCallBack || function errorCallBack(err) {
                //util.debug("从开发者服务端获取签名失败！" + err);
            }
        });
    },
    getLocaldataKey : function(){
        return "pop_qb_userinfo";
    },
    reportProcess : function(level){
        checkLoginSession();
        
        var Option = {"level":level, "qqid":sessionInfo.qbopenid,"nickname":sessionInfo.nickName}
        $.ajax({
            type: "GET",
            url: serverAjax+"reportLevelFinish.html",
            data: Option,
            dataType: "json",
            success: function(rsp){},
            error: function errorCallBack(err) {
                util.debug("写入排行榜失败" + err);
            }
        });
    },
    levelRankData : function(callback){
        checkLoginSession();
        var Option = {"qqid":sessionInfo.qbopenid}
        $.ajax({
            type: "GET",
            url: serverAjax+"levelRankListData.html",
            data: Option,
            dataType: "text",
            success: callback,
            error: function errorCallBack(err) {
                util.debug("获取排行榜失败:" + err);
            }
        });
    },
    saveUserInfo : function(rsp){
        $.ajax({
            type: "GET",
            url: serverAjax+"saveQQUserInfo.html",
            data: rsp,
            dataType: "json",
            success: null,
            error: function errorCallBack(err) {
                //util.debug("保存用户信息失败:" + err);
            }
        });
    }
};

function checkLoginSession(){
    var info = sessionInfo = store.getAll();
    if (!info || !info.qbopenid || !info.qbopenkey) {
        return false;
    }
    return true;
}
/** @expose */
function login(logintype, callback){
    var onLoginCallback = function(rsp){
        var option = {
            appid: appid,
            appsig: rsp.appsig,
            appsigData:rsp.datasig,
            loginType: logintype
        };
        var browserCallback = function(rsp){
            callback(logintype,rsp);
        };
        try{
            browser.x5gameplayer.login(option, browserCallback);
        }
        catch(error){
            util.debug(error.message);
        }
    };
        var url = serverAjax+"getAppSig.html";
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "GET",
            url: url,
            dataType:"json",
            success: onLoginCallback
        });
    
}
/** @expose */
function logout(callback) {
    var option = {
        appid: appid,
        qbopenid: store.read("qbopenid"),
        loginType: store.read("loginType")
    };
    browser.x5gameplayer.logout(option, callback);
    store.clear();
}
/** @expose */
function refreshToken(qqid, token, onRefreshToken) {
    var option = {
        appid: appid,
        qbopenid: qqid,
        refreshToken: token
    };

    var callback = function (rspObj) {
        if (typeof rspObj === "object") {
            if (rspObj.result === 0 && rspObj.qbopenkey) {
                store.updateToken(rspObj.qbopenkey);
                if(onRefreshToken){
                    onRefreshToken(true);
                }
                
            } else if (rspObj.result == 11) {
                util.debug("登录已经过期，请重新登录！");
                onRefreshToken(false);
            } else {
                //util.toast("刷新Token失败！");
                //util.debug("刷新Token失败！" + JSON.stringify(rspObj), 2);
                onRefreshToken(false);
            }
        }
        else{
            onRefreshToken(false);
        }
    };
    browser.x5gameplayer.refreshToken(option, callback);
}
function getAvailableLoginType(callback){
    var option = {appid:appid};
try{
    browser.x5gameplayer.getAvailableLoginType(option, callback);
}
catch(exception){
    
}
}
// 参数说明： 产品id，价格，获得金币，回调函数
  /** @expose */
  function pay(product, price, gold,onPayFinish){
    checkLoginSession();
    if(!sessionInfo){
        return;
    }
    //到开发者服务端请求生成签名及返回相关的明细信息
    var option = {
        appid: appid,
        appsig: "",
        paysig: "",
        qbopenid: sessionInfo.qbopenid,
        qbopenkey: sessionInfo.qbopenkey,
        payItem: product + "*" + gold + "*" + price + "*" + 1,
        payInfo: "兑换金币 "+gold,
        reqTime: parseInt(new Date().getTime() / 1000),
        customMeta: product + " x " + 1
    };

    devServer.getSig("pay", option, function succCallBack(rspDev) { //开发者服务端签名成功
        if (rspDev.result == 0) {
            option.paysig = rspDev.data.reqsig;
            option.reqTime = rspDev.data.reqTime;
            //option.payItem = rspDev.data.payItem;
            //option.payInfo = rspDev.data.payInfo;
            //option.customMeta = rspDev.data.customMeta;
            
            var payCallback = function(rsp){
                if (typeof rsp === "object") {
                    if (rsp.msg == "order error, ErrorCode(1101)") {
                       onPayFinish(1001);
                    } else {
                        if (rsp.result === 0) {
                            util.debug("支付操作完成");
                            onPayFinish(0);
                        }
                        else if (rsp.result === -1 || rsp.result === 903) {
                            util.debug("已取消支付！");
                            onPayFinish(-1);
                        }
                        else if (rsp.result === -3) {
                            util.debug("登录已过期，程序将自动刷新授权！");
                            onPayFinish(1001);
                            
                            // setTimeout(function () {
                            //     refreshToken(function () {
                            //         pay(product, price);
                            //     });
                            // }, 3000);
                        } else if (rsp.result === 19) {
                            util.debug("登录已过期，错误码19！");
                            onPayFinish(1001);
                            
                            // setTimeout(function () {
                            //     logout();
                            // }, 3000);
                        } else {
                            util.debug("支付失败！(" + rsp.result + "," + rsp.msg + ")");
                            onPayFinish(-2);
                        }
                    }
                } else {
                    //util.toast("支付完成！可跳到应用自定义界面(如显示发货结果)。");
                    //util.debug(rsp);
                    //onPayFinish(rsp.result);
                    onPayFinish(1002);
                }
            }
            util.debug("请求支付接口"+JSON.stringify(option));
            browser.x5gameplayer.pay(option, payCallback);
        } else {
            util.debug("从开发者服务端获取签名失败！")
            if(rspDev){
                game.showAlertMessage(rspDev.msg);
            }
            
        }
    });
}
var sendToDesktop=function(info,callback){
    browser.x5gameplayer.sendToDesktop(info,function(r){
        if(r && r.result==0){
            devServer.checkFirstShare(function(rsp){
                if(rsp && rsp.result!=0){
                    return;
                }
                if(callback){
                    callback()
                }
            }.bind(this));
        }
    }.bind(this));
    
}

function func_app_enter_background(){
    cc.director.stopAnimation();
    if(game){
        game.stopMusic();
    }    
}
function func_app_enter_foreground(){
    cc.director.startAnimation();
    if(game){
        game.playBackMusic();
    }  
}

function initpage(){
    var browser = window['browser'];
    if(browser){
        browser.execWebFn = browser.execWebFn || {};
        browser.execWebFn.postX5GamePlayerMessage=function(message){
            var msg =  message.type;
            
            if(msg == "app_enter_background"){
                func_app_enter_background();
            }
            else if(msg == "app_enter_foreground"){
                func_app_enter_foreground();
            }
        };
    }
}