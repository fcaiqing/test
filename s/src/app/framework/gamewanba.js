var servermode="WANBA";
var cfgPayUnit = "星星";
var gameurlfirstpage = "http://m.qzone.com/infocenter?g_f=#000000000/playbar/detail?appid=1104875291"
function initpage(){
	QZAppExternal.setOrientationEx(0);
}

var devServer = {
    getUserinfo: function (succCallBack, errorCallBack) {
        var url = serverAjax+"getWanbaUser.html";
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: succCallBack,
            error: errorCallBack || function errorCallBack(err) {
                util.debug("从开发者服务端获取签名失败！" + err);
            }
        });
    },
    getLocaldataKey : function(){
        return "pop_wanba_userinfo";
    },
    reportProcess : function(level){
        $.get(serverAjax+"reportLevelFinish/level/"+level+".html");
    },
    updateSession : function(){
        $.get(serverAjax+"refreshdSession.html");
    },
    levelRankData : function(callback){
        $.get(serverAjax+"levelRankListData.html", callback);
    },
    reportIntoLevel : function(level){
        $.get(serverAjax+"reportLevelInto/level/"+level+".html");
    }
};


// 参数说明： 产品id，价格，获得金币，回调函数
  /** @expose */
  function pay(product, price, gold,onPayFinish){
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
                        game.showAlertMessage("登录已过期，请重新登录！");
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
                            game.showAlertMessage("登录已过期，请重新登录！");
                            onPayFinish(1001);
                            // setTimeout(function () {
                            //     refreshToken(function () {
                            //         pay(product, price);
                            //     });
                            // }, 3000);
                        } else if (rsp.result === 19) {
                            util.debug("登录已过期，错误码19！");
                            game.showAlertMessage("登录已过期，请重新登录！");
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
function checkVIP(succCallBack){
    var url=serverAjax+"checkGameVIP.html";
    $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(rsp){
                if(rsp && rsp.result==0){
                    succCallBack(rsp.isvip);
                }
                else{
                    succCallBack(0);
                }
            },
            error: function errorCallBack(err) {
                util.debug("获取userinfo失败");
            }
    });
}
function payByWanbaStar(itemid,succCallBack){
    var url=serverAjax+"payByWanbaStar.html";
    $.ajax({
            type: "GET",
            url: url,
            data:{"ITEMID":itemid},
            dataType: "json",
            success: succCallBack,
            error: function errorCallBack(err) {
                util.debug("支付失败");
            }
    });
        
}

$(document).ready(function(){
    var orientation = window.orientation;
    if(typeof(orientation) != "undefined" && orientation!=0){
         showRotateTips();
    }
});

