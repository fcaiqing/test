var serverAjax = "/index.php/Home/Index/";
//屏幕旋转提示图片
function showRotateTips(){
    $("#screen-rotate-tips").show();
}  
function hideRotateTips(){
    $("#screen-rotate-tips").hide();
} 

window.onorientationchange = function(){

    var orientation = window.orientation;
    // Look at the value of window.orientation:

    if (orientation === 0){
        // iPad is in Portrait mode.
        hideRotateTips();
    }

    else if (orientation === 90){
        // iPad is in Landscape mode. The screen is turned to the left.
        showRotateTips();
    }


    else if (orientation === -90){
        // iPad is in Landscape mode. The screen is turned to the right.
        showRotateTips();
    }

};

var store = {
    lcst: window.localStorage,
    read: function (key) {
        var value = (store.lcst && store.lcst.getItem(key)) || "";
        return value;
    },
    write: function (key, value) {
        store.lcst && store.lcst.setItem(key, value);
    },
    getAll: function () {
        var data = {};
        var key = devServer ? devServer.getLocaldataKey() : "pop_qb_userinfo";
        data = JSON.parse(store.lcst.getItem(key));
         
        return data;
    },
    updateToken : function(token){
        var key = devServer ? devServer.getLocaldataKey() : "pop_qb_userinfo";
        var data = JSON.parse(store.lcst.getItem(key));
        data.qbopenkey = token;
        store.lcst.setItem(key, JSON.stringify(data));
    },
    clear: function () {
        store.lcst && store.lcst.clear();
    }
};
var util = {
    debug: function (msg, level) {
        level = level || 1;
        if (level == 1)
            console.info(msg);
        else if (level == 2)
            console.warn(msg);
        else if (level == 3)
            console.error(msg);
    }
};