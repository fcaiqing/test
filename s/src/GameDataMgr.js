/**
 * Created by beyondray on 2015/8/31.
 * Desc: 游戏玩家主要数据及管理
 */

var GameDataMgr = {};

GameDataMgr.initDefaultData = function(){
	var initItems = [];
	for(var i = 1;i <= getOwnProperyLength(ITEM_ID);i++){
		initItems[i] =0;
	}
	initItems[0]=0;

	GameDataMgr.defaultData = {
		// userId : 0,
		userId: parseInt(location.href.match(/uid=\d*/)[0].match(/\d+/)[0]),
		leadingFlipx : false, // 控制主角在地图中是否水平翻转
		musicOn : true,
		soundOn : true,
		lastLevel :1,
		HP : MAX_HP,
		items : initItems,
		gold : 0, 
		resetTime : 0,
		todayFail : {}, //没用--------->
		dailyLogin : { prevLoginTime : 0, loginCount : 0},//没用--------->
		invite : {},//没用--------->
		levelInfor : {},
		obstacleInfor : {},// 记录各障碍信息
		unlockItemTipShowed : {},// 记录所有显示过解锁道具记录  //没用--------->
		rated : false, // 记录是否评价过
		guideId:0,
		isFirstNoLife : true,
		isFirstFail:true,
		buyonce:{"p1":0,"p2":0}
	}
	return GameDataMgr.defaultData;
}

GameDataMgr.save = function(jsonObj, savetoserver){
    if(typeof(savetoserver) == "undefined"){
        savetoserver = true;  //如果未指定，默认保存到服务器
    }
	var stringData = JSON.stringify(jsonObj);
	var oldData = cc.sys.localStorage.getItem("CandyPop_Data");
	if(stringData == oldData){
		return;
	}
	cc.sys.localStorage.setItem("CandyPop_Data", stringData);
	if(savetoserver){
        GameDataMgr.savetoServer(stringData);
    }
}

GameDataMgr.load = function(){
	var jsonData = JSON.parse(cc.sys.localStorage.getItem("CandyPop_Data"));
	return jsonData;
}

GameDataMgr.clear = function(){
	cc.sys.localStorage.removeItem("CandyPop_Data");
}

GameDataMgr.loadfromServer = function(onSuccess){
	var userdata = store.getAll();
	if(servermode == "QQ" && (!userdata || !userdata["qbopenid"])){
		return;
	}
	var urlstr = serverAjax+"getServerParam.html";
	var options = servermode == "QQ" ? {"userid":userdata["qbopenid"]} : null;
	if(servermode == "HGAME"){
        var userid=devServer.getUserId();
        options = {"userid":userid};
    }
	$.get(urlstr,options,function(res){
		//cc.log(res);
		try {
            var param = JSON.parse(res);
			if(param && param.error==0){
				//保存本地数据
				var stringData = JSON.stringify(param.data);
				cc.sys.localStorage.setItem("CandyPop_Data", stringData);
				game.gameData = param.data;
                onSuccess();
			}
			else if(param && param.error==1){
				//重置数据
				game.gameData = GameDataMgr.initDefaultData();
				cc.sys.localStorage.setItem("CandyPop_Data", JSON.stringify(game.gameData));
                onSuccess();
			}
            else if(param && param.error==2){
                //需要重新登录
                //alert(param.msg);
                if(servermode == "QQ"){
                    window.document.location.href = gameurlfirstpage;
                }
                else if(servermode == "HGAME"){
                    alert(param.msg);
                }
            }
            else if(param && param.error==100){
                if(servermode == "WANBA" || servermode == "HGAME"){
                    window.document.location.href = gameurlfirstpage;
                }
            }
		} catch (error) {
			util.log(error.message);
		}
		
	});
	
}
GameDataMgr.savetoServer = function(stringData){
	if(servermode == "NOSDK"){
		return;
	}
	var userdata = store.getAll();
		if(servermode == "QQ" && (!userdata || !userdata["qbopenid"])){
		return;
	}
	
	stringData = encodeURIComponent(stringData);
	var urlstr = serverAjax+"saveServerParam.html";
	var paramdata = {};
    if(servermode == "QQ"){
        paramdata = {"userid":userdata["qbopenid"], "param":stringData};
    }
    else if(servermode == "HGAME"){
        var userid=devServer.getUserId();
        paramdata = {"userid":userid, "param":stringData};
    }
	else{
        paramdata = {"param":stringData};
    }
	$.post(urlstr,paramdata);
}
