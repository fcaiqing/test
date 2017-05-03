/**
 * Created by Administrator on 2015/7/24.
 * Desc: 一些公共函数
 */

var getCurTime = function(){
	return Math.floor(Date.now()/1000);
}
// 时间转换
var timeConvert = function(value, key){
	var hour = Math.floor(value/3600);
	var min = Math.floor((value - hour*3600)/60);
	var sec = value%60;

	if(key == "hour")return hour;
	if(key == "min")return min;
	if(key == "sec")return sec;
	return {hour:hour, min:min, sec:sec};
}

// 秒数转成 00:00:00 格式 小时：分钟:秒
var sec_3_Format = function(sec){
	var time = timeConvert(sec);
	var hourStr = string.PRE_ZERO(time.hour, 2);
	var minStr = string.PRE_ZERO(time.min, 2);
	var secStr = string.PRE_ZERO(time.sec, 2);
	return hourStr+":"+minStr+":"+secStr;
}

// 秒数转成 00:00 格式 分钟:秒
var sec_2_Format = function(sec){
	var time = timeConvert(sec);
	var minStr = string.PRE_ZERO(time.min, 2);
	var secStr = string.PRE_ZERO(time.sec, 2);
	return minStr+":"+secStr;
}