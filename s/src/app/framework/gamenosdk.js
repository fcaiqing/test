var servermode="NOSDK";
var appid="";
var gameforumurl = "";
var clientToken = 0;
var cfgPayUnit = "免费";
var sessionInfo = {
    qbopenid: "",
    qbopenkey: "",
    refreshToken: '',
    nickName: '',
    avatarUrl: ''
};
var devServer = {
    getSig: function (api, option, succCallBack, errorCallBack) {
        
    },
    checkFirstShare: function(successCallback,errorCallBack){
        
    },
    getLocaldataKey : function(){
        return "pop_nosdk_userinfo";
    }
};

function checkLoginSession(){
    return true;
}
/** @expose */
function login(logintype, callback){
    
}
/** @expose */
function logout(callback) {

}
/** @expose */
function refreshToken(qqid, token, onRefreshToken) {
    
}
// 参数说明： 产品id，价格，获得金币，回调函数
  /** @expose */
function pay(product, price, gold,onPayFinish){
    
}
var sendToDesktop=function(info,callback){
    
}

function func_app_enter_background(){
  
}
function func_app_enter_foreground(){

}

function initpage(){

}
