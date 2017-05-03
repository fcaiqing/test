/**
 * Created by beyondray on 2015/7/21.
 * Desc: �ַ���չ
 */

var string = {};

string.format = function(str, regexp, replacement) {
    return str.replace(regexp,replacement);
};

string.ZERO_PRE_MODE = function(integer){
    var value = parseInt(integer);
    return  value <10?"0"+integer:integer;
};

string.PRE_ZERO = function(interger, zeroBits){
	var stringValue = interger.toString();
	var zeroNums = zeroBits - stringValue.length;
	var zeroPrefix = "";
	for(var i = 1; i <= zeroNums;i++)zeroPrefix+="0";
	return (zeroPrefix + stringValue);
}

