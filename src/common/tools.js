/*/**
 * common fun
 * @authors DEAN hxj (xxxxxxx@delibal)
 * @date    2018-06-06 15:37:45
 * @version $Id$
 */
/*
 * @Author: huili.sun
 * @Date:   2017-03-03 14:45:00
 * @Last Modified by:   huili.sun
 * @Last Modified time: 2017-03-03 14:45:05
 */

'use strict';

var util = {
    add: accAdd,
    sub: subtr,
    mul: accMul,
    div: accDiv,
    getDate: getDate,
    getMonday: getMonday,
    dateFormat:dateFormat,
    parseDate:parseDate,
    parseDate2: parseDate2,
    getFileType: getFileType,
    afterDate:afterDate,
    deepClone:deepClone,
    init:init,
    isEmptyObject:isEmptyObject
}

//加法 
function accAdd(arg1, arg2) {
    let r1, r2, m;
    if (!arg1) {
        arg1 = 0;
    }
    if (!arg2) {
        arg2 = 0;
    }
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));

    return (arg1 * m + arg2 * m) / m;
}
//减法 
function subtr(arg1, arg2) {
    let r1, r2, m, n;
    if (!arg1) {
        arg1 = 0;
    }
    if (!arg2) {
        arg2 = 0;
    }
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//乘法 
function accMul(arg1, arg2) {
    if (!arg1) {
        arg1 = 0;
    }
    if (!arg2) {
        arg2 = 0;
    }
    let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {

    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {

    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//除法
function accDiv(arg1, arg2) {
    let t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {

    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {

    }

    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return accMul((r1 / r2), pow(10, t2 - t1));

}
//获取今日(距离今天days天)时间,current表示是否为当前时分秒
function getDate(days, type, current) {
    let now = new Date();
    //获取当前时分秒
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let today = now.toLocaleDateString();
    let realDate = new Date(Date.parse(today) + days * 86400000);
    //获取days天后的年月日
    let year = realDate.getFullYear();
    let month = realDate.getMonth() + 1;
    let day = realDate.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var realDateStr = '';
    if (type) {
        realDateStr = year + type + month + type + day + " 00:00:00";
    } else {
        realDateStr = year + "-" + month + "-" + day + " 00:00:00";
    }
    if (current) {
        realDateStr = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    return realDateStr;
}

//获取本周的第一天(星期一)的时间
function getMonday() {
    let now = new Date();
    let week = now.getDay();
    if (week != 0) { //如果week!=0
        return getDate(1 - week);
    } else {
        return getDate(-6);
    }
}
//获取周一,周日 
function getLastDateOfWeek(type, dates) {
    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var longTime = 24 * 60 * 60 * 1000;
    var n = longTime * 7 * (dates || 0);
    if (type == "s") {
        var dd = nowTime - (day - 1) * longTime + n;
    };
    if (type == "e") {
        var dd = nowTime + (8 - day) * longTime + n;
    };
    dd = new Date(dd);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    var day = y + "-" + m + "-" + d + ' ' + '00:00:00';
    return day;
};
//时间格式化,date表示需要被格式化的时间字符串,dateSign表示日期分隔符,timeSign表示时分秒分割符
function dateFormat(date, dateSign, timeSign) {
    let arr = date.split(" ");
    let dateStr = "";
    let timeStr = "";
    let year = "1970";
    let month = "01";
    let day = "01";
    let hour = "00";
    let minute = "00";
    let second = "00";
    let formatStr = "1970";
    let pattern = new RegExp("[-\/._~:*,]", "g");
    if (arr.length >= 1) {
        dateStr = arr[0];
        let dateArr = dateStr.split(pattern);
        year = dateArr[0];
        month = dateArr[1];
        day = dateArr[2];
    }
    if (arr.length > 1) {
        timeStr = arr[1];
        let timeArr = timeStr.split(pattern);
        hour = timeArr[0];
        minute = timeArr[1];
        second = timeArr[2];
    }
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    if (second.length == 1) {
        second = "0" + second;
    }
    return year + dateSign + month + dateSign + day + " " + hour + timeSign + minute + timeSign + second;

}
//时间格式化，将Date类型转化成指定格式的字符串类型,默认为yyyy-MM-dd HH:mm:ss
function parseDate(date, dateSign, timeSign) {
    if (dateSign == undefined) {
        dateSign = "-";
    }
    if (timeSign == undefined) {
        timeSign = ":";
    }
    //如果date不是Date类型，那么返回1970-01-01 00:00:00
    if (!(date instanceof Date)) {
        return "1970-01-01 00:00:00";
    }
    var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return dateFormat(result, dateSign, timeSign);
}
//时间格式化，将Date类型转化成指定格式的字符串类型,默认为yyyy-MM-dd HH:mm:ss
function parseDate2(date, dateSign, timeSign) {
    if (dateSign == undefined) {
        dateSign = "/";
    }
    if (timeSign == undefined) {
        timeSign = ":";
    }
    //如果date不是Date类型，那么返回1970-01-01 00:00:00
    if (!(date instanceof Date)) {
        return "1970/01/01 00:00:00";
    }
    var result = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return dateFormat(result, dateSign, timeSign);
}
//获取文件类型
function getFileType(url) {
    let arr = url.split('.');
    let type = arr[arr.length - 1]
    if (type == 'png' || type == 'bmp' || type == 'jpg' || type == 'jpeg' || type == 'gif') {
        type = 'image';
    } else if (type == 'pdf') {
        type = 'pdf';
    } else if (type == 'doc' || type == 'docx') {
        type = 'word';
    } else if (type == 'xls' || type == 'xlsx') {
        type = 'excel';
    } else {
        type = 'other';
    }
    return type;
}

//去除日期时分秒
function afterDate(val){
   return val.substring(0, 10);
}
//数组对象深拷贝
function deepClone(values) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == values || "object" != typeof values) return values;

    // Handle Date
    if (values instanceof Date) {
        copy = new Date();
        copy.setTime(values.getTime());
        return copy;
    }

    // Handle Array
    if (values instanceof Array) {
        copy = [];
        for (var i = 0, len = values.length; i < len; i++) {
            copy[i] = deepClone(values[i]);
        }
        return copy;
    }

    // Handle Object
    if (values instanceof Object) {
        copy = {};
        for (var attr in values) {
            if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy values! Its type isn't supported.");
}
function init(object) {
   for(var i in object){
        if(object[i]  instanceof Object && !(object[i]  instanceof Array)){
           for(var j in object[i]){
             object[i][j]=''; 
           }
        }else if(Array.isArray(object[i]) ){
            object[i]=object[i].splice(0,object[i].length); 
        }else{
           object[i]="";
        }
    }
    return object ;
}
function isEmptyObject(obj){ //empty obj
      for(var key in obj){
           return false;
      };
      return true;
};
module.exports = util;

