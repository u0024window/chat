/**********
 * timefilter
时间：
当日小于1分钟显示：刚刚；
当日大于等于1分钟小于60分钟，则四舍五入显示「x分钟前」；
当日大于等于60分钟小于24小时，则显示「hh:mm」；
当日之前，则显示「yy:mm:dd」
*/
Vue.filter('timeFilter', function (timestamp,type) {
    // 当前毫秒
    var curdate = +new Date(),
        ms = 86400000,//24*60*60*1000,
    //timediff = (curdate - timestamp) / 1000,//时间差/秒
        history_time = new Date(+timestamp);
    todayTime0 = curdate-curdate%ms;
    var y = history_time.getFullYear(),//年
        m = history_time.getMonth() + 1,//月
        d = history_time.getDate(),//日
        hh = history_time.getHours(),//小时
        mm = history_time.getMinutes(),//分钟
        ss = history_time.getSeconds();//miao

    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    if(type == 0 && todayTime0<timestamp){
        return hh+':'+mm+':'+ss;
    }else {
        return y+'/'+m+'/'+d+' '+hh+':'+mm+':'+ss;
    }
});
/*对话摘要：
*文字：取前x字为摘要，超过则以「...」截断，x为设计根据实际情况确定；
*图片：如果用户最新消息为图片，则摘要显示「[图片]」；
*/
Vue.filter('msgAbstract_f', oMsg.msgAbstract);

Vue.filter('wordBreak',function (item) {
    var str = item.value || item.content;
    if(str.length>22){
        return  str.substr(0,22)+'...';
    }
    return str;
});
