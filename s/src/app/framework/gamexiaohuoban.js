var servermode="HGAME";
var cfgPayUnit = "元";
var hgameSDK = null;
var gameurlfirstpage = "http://gc.hgame.com/home/game/appid/100021/gameid/100239/review/1";
function initpage(){
    //donothing;
}

//根据QueryString参数名称获取值
function getQueryStringByName(name){
     var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
     if(result == null || result.length < 1){
         return "";
     }
     return result[1];
}

$(document).ready(function(){
try{
    hgameSDK = new hGame({
        "game_key": 'c19084fe91b3c339',
        "debug": true
    });
    var orientation = window.orientation;
    if(typeof(orientation) != "undefined" && orientation!=0){
         showRotateTips();
    }
}
catch(err){
    util.debug(err.message);
}
});

function reLogin(callback){
    // 调用登录界面
    hgameSDK.gameLogin(callback);
}

var sendToDesktop=function(info,callback){
    var callback = function(data){
            util.debug(data);
    };
    // 调用登录界面
    hgameSDK.sentToDesk(callback);
    
};
var shareGame = function(callback){
  var shareData = {
        title: "一起来玩糖心泡泡吧", //默认为游戏名称
        message: "精美的画面，可爱的音乐，让你爱不释手！全新旋转玩法，转转转，根本停不下来！",
        //imgUrl: , //默认为当前游戏的icon
        url: gameurlfirstpage,
        extend: {}  //option, 这里是额外的参数，接入各平台不同
    }
    hgameSDK.share(shareData, function(rsp){
        if(rsp.code === 0){
            //分享成功
            devServer.checkFirstShare(function(rsp){
                rsp = JSON.parse(rsp);
                if(rsp.error === 0){
                    callback();
                }
                else{
                    util.debug(rsp.msg);
                }
            });
        }
        else{
            util.debug(rsp.message, 3);
        }
    }); 
};

var devServer = {
    getUserinfo: function (succCallBack, errorCallBack) {
        var url = serverAjax+"hGameUserInfo.html";
        var logintype = getQueryStringByName('logintype');
        var ticket = getQueryStringByName('ticket');
        var option = {
            "logintype":logintype,
            "ticket":ticket
        }
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "GET",
            url: url,
            data : option,
            dataType: "json",
            success: succCallBack,
            error: errorCallBack || function errorCallBack(err) {
                util.debug("从开发者服务端获取签名失败！" + err);
            }
        });
    },
    saveUserId:function(id){
        store.write("hgame-user-pop", id);
    },
    getUserId:function(){
       return store.read("hgame-user-pop");
    },
    getPayParam: function(totalfee, itemid, name, succCallback){
        var url = serverAjax+"hGamePayParam.html";
        var userid = devServer.getUserId();
        var options = {'totalfee':totalfee, 'itemid':itemid, 'name':name, 'userid':userid};
        var onParamReturn = function(rsp){
            if(rsp.error === 0){
                hgameSDK.pay(rsp.data, "", succCallback)
            }
            else{
                alert(rsp.msg);
            }
        }
        //请求开发者服务端,并返回签名
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            data : options,
            success: onParamReturn,
            error: function errorCallBack(err) {
                util.debug("从服务器获取支付参数失败！" + err);
            }
        });
    },
    getLocaldataKey : function(){
        return "pop_hgame_userinfo";
    },
    reportProcess : function(level){
        var userid = devServer.getUserId();
        $.get(serverAjax+"reportLevelFinish/level/"+level+".html", {"userid":userid});
    },
    levelRankData : function(callback){
        var userid = devServer.getUserId();
        $.get(serverAjax+"levelRankListData.html", {"userid":userid}, callback);
    },
    updateSession : function(){
        var userid = devServer.getUserId();
        $.get(serverAjax+"refreshSession.html", {"userid":userid});
    },
    checkFirstShare : function(callback){
        var userid = devServer.getUserId();
        $.get(serverAjax+"checkFirstShareOut.html", {"userid":userid}, callback);
    },
    reportIntoLevel : function(level){
        var userid = devServer.getUserId();
        $.get(serverAjax+"reportLevelInto/level/"+level+".html", {"userid":userid});
    }
};

