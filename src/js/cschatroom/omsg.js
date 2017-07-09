var oMsg = (function (window, r) {
  r.msgQueue = [];
  r.msgQueueCache = [];
  r.lastHisMsg = [];
  r.addSize = 50;
  r.historyMsgTag = 0;//控制弹窗历史消息下拉
  r.noReadMsg = 0;
  r.shortCut = [];
  r.personQuickList = [];
  r.pageSize = 10;//用户下拉个数
  return r;
})(window, (function () {
  function sendMsg(msgContent, msgObj, memberId, groupId) {
    memberId = memberId || oCustomer.current.memberId;
    groupId = groupId || oCustomer.current.groupId;
    $.ajax({
      type: 'post',
      url: '{{AgentsendmessageApi}}',
      dataType: 'json',
      data: {
        recordId: msgObj.recordId,
        memberId: memberId,
        agentId: oServer.agentId,
        msg: msgContent,
        groupId: groupId
      },
      success: function (res) {
        if (res.error.returnCode == 101 || res.error.returnCode == 100) {
          msgObj.msgStatus = 1;
          oCustomer.delCur();
          alert(res.error.returnMessage);
          return;
        }
        if (res.error.returnCode != 0) {
          msgObj.msgStatus = 1;
          alert(res.error.returnMessage);
          return;
        }
        msgObj.msgStatus = 0;
        msgObj.msgId = res.data.msgId;
        
      },
      error: function (req, st, error) {
        msgObj.msgStatus = 1;
      }
    })
  }

  function getFormatMsg(msg) {
    var msgContent = []; // 发送消息内容
    var arrCon = _getRichMsg(msg);
    for (var i = 0; i < arrCon.length; i++) {
      if (csPublic.regExpTel.test(arrCon[i])) {
        msgContent.push({
          msgType: 3, // 消息类型；1=文本；2=图片；3=链接；
          content: arrCon[i], // 消息内容
          action: 'jdbtel:'+arrCon[i], // 处理方式
          ext: '' // 扩展字段
        });
      } else if(csPublic.regExpUrl.test(arrCon[i])){
        msgContent.push({
          msgType: 3, // 消息类型；1=文本；2=图片；3=链接；
          content: arrCon[i], // 消息内容
          action: 'jdburl:'+arrCon[i], // 处理方式
          ext: '' // 扩展字段
        });
      } else {
        msgContent.push({
          msgType: 1, // 消息类型；1=文本；2=图片；3=链接；
          content: arrCon[i], // 消息内容
          action: '', // 处理方式
          ext: '' // 扩展字段
        });
      }
    }
    msgContent[0].content=='' && msgContent.shift();
    msgContent[msgContent.length-1].content=='' && msgContent.pop();
    return msgContent;
  }

  function _setMsgCell(msgi, msgcell) {
    msgcell.msgContent = {};
    msgcell.msgId = msgi.msgId;
    msgcell.msgTime = msgi.createDate || msgi.createTime || msgi.msgTime;
    msgcell.senderType = msgi.senderType;
    msgcell.chatType = msgi.chatType;
    msgcell.avatarUrl = _setAvatarUrl(msgi);
    setMsgContent(msgi.msgContent, msgcell.msgContent);
    if (msgcell.msgContent.msgType == 1) {
      msgcell.msgContent.content = msgcell.msgContent.content.replace(csPublic.regExpBr, '<br/>');
    }
    if (msgcell.senderType == 2) {
      msgcell.recordId = msgi.recordId;
    } else {
      msgcell.recordId = msgi.msgId + '00';
    }
    msgcell.msgContent.action = '';
    msgcell.msgContent.ext = '';
    msgcell.msgStatus = 0;
  }

  function _setAvatarUrl(msg) {
      if (msg.senderType == 1) {
        return oCustomer.current.avatarUrl || oCustomer.defaultAvatarUrl;
      } else if(msg.senderType == 2){
        return oServer.avatarUrl;
      }else if (msg.senderType == 3){ 
        return '';
      }else if (msg.senderType == 4){
        return oServer.robotAvatar;
      }
  
  }

  function upMsgLs(data,url,callback) {//主要用于下拉刷新，拉取消息
    $.ajax({
      type: 'post',
      url: url,
      dataType: 'json',
      data: data,
      success: function (res) {
        // 显示客户信息
        if (res.error.returnCode != 0) {
          alert(res.error.returnMessage);
          return;
        }
        var msgls = res.data.msgList || res.data;//2接口,getMsgls,getSessionId
        var arrMsg = [];
        if (data.direction == 0) {
          if (msgls == null || msgls.length == 0) {
            return;
          }
        } else if (data.direction == 1) {
          if (msgls == null || msgls.length == 1) {
            csPublic.refreshText('#chatpanel', '没有更多消息了');
            csPublic.refreshText('.historymsg', '没有更多消息了');
          }
        }
        for (var i = 0; i < msgls.length; i++) {
          var msgCell = {};
          _setMsgCell(msgls[i], msgCell);
          var findRecord = csPublic.objFindByKey(arrMsg, 'recordId', msgCell.recordId);
          if (findRecord >= 0) {
            continue;
          }
          arrMsg.push(msgCell);
        }
        if(typeof callback =='function'){
          callback(arrMsg);
        }
      },
      // beforeSend: function () {
      //   $('#csloading').show();
      // },
      // complete: function () {
      //   $('#csloading').hide(); 
      // },
      error: function () {
        csPublic.refreshText('#chatpanel', '消息加载失败');
      }
    })
  }

  function setMsgContent(msg, msgContent) { // 整合好消息内容
    if (msg == null) return;
    if (typeof msg == 'string') {
      msg = JSON.parse(msg);
    }
    msgContent.content = '';
    for (var j = 0; j < msg.length; j++) {
      if (msg[j].msgType == 1) {
        // 消息内容为文本
        msgContent.msgType = 1;
        msgContent.content += msg[j].content;
      } else if (msg[j].msgType == 2) {
        // 消息内容为图片
        var ext = msg[j].ext;
        if (typeof msg[j].ext == 'string') {
          ext = JSON.parse(msg[j].ext);
        }

        //计算要加的w,h
        var WH = _computeImg({
          w: ext.small_w,
          h: ext.small_h
        });
        msgContent.width = WH.w;
        msgContent.height = WH.h;
        msgContent.msgType = 2;
        msgContent.bigUrl = ext.big_url;
        msgContent.smallUrl = ext.small_url;
      } else if (msg[j].msgType == 3) {
        // 消息内容为链接
        msgContent.msgType = 1;
        msgContent.content += msg[j].content;
      }
    }
  }
  function _X(num) { 
    var a = '';
    for(var i=0;i<num;i++){
      a +='X';
    }
    return a;
   }
  function _getRichMsg(msg) {//富文本转换为数组
    var content = [];
    var index = [];
    var m = msg;
    msg.replace(csPublic.regExpTel, function (word) {
      index.push(msg.indexOf(word));
      index.push(msg.indexOf(word) + word.length);
      var X = _X(word.length);
      msg = msg.replace(word,X);
    });
    msg.replace(csPublic.regExpUrl, function (word) {
      index.push(msg.indexOf(word));
      index.push(msg.indexOf(word) + word.length);
      var X = _X(word.length);
      msg = msg.replace(word,X);
    });
    csPublic.bubbleSort(index);
    index.unshift(0);
    index.push(msg.length);
    for (var i = 0; i < index.length - 1; i++) {
      var str = m.substring(index[i], index[i + 1]);
      content.push(str);
    }
    return content;
  }

  function findLastCmsg() {
    if (!oMsg.msgQueue || oMsg.msgQueue.length == 0) return;
    for (var i = oMsg.msgQueue.length - 1; i >= 0; i--) {
      if (oMsg.msgQueue[i].senderType == 1 || oMsg.msgQueue[i].senderType == 3) {
        return i;
      }
    }
  }

  function scrollBottom(str) {//有新消息弹出 滚到底部
    var timer = setTimeout(function () {
      $(str).scrollTop(100000);
      clearTimeout(timer);
    }, 10);
  }

  function _computeImg(attr) {
    //消息图片宽
    if (attr.w < 300) {
      return {
        w: attr.w,
        h: attr.h
      };
    } else {
      return {
        w: 300,
        h: ( 300 * attr.h) / attr.w
      };
    }

  }

  function computeRecordId(recordId) {
    var r = String(recordId);
    var h = r.substring(0, r.length - 2);
    var t = Number(r.substring(r.length - 2, r.length));
    if (t >= 9) {
      t = t + 1
    } else {
      t = '0' + (t + 1);
    }
    return h + '' + t;
  }

  function picContent(d) {
    var WH = _computeImg({
      w: d.data.width,
      h: d.data.height
    });
    var picContent = [{ // string 消息内容:富文本格式
      msgType: 2, // 消息类型；1=文本；2=图片；3=链接；
      content: d.data.url, // 消息内容
      action: '', // 处理方式
      ext: {
        big_h: WH.h,
        big_w: WH.w,
        small_h: 75,
        small_w: 75,
        big_url: d.data.url,
        small_url: d.data.thumbUrl
      } // 扩展字段
    }];

    return JSON.stringify(picContent);
  }

  function getHisMsg (customer) {
    var info = {};
    info.msgs = [];
    info.name = customer.name;
    info.groupId = customer.groupId;
    info.avatarUrl = customer.avatarUrl;
    oMsg.upMsgLs({
          lastMsgId: 0,
          chatType: '',
          direction: 1,
          size: oMsg.addSize,
          groupId: customer.groupId
        },
        "/crmim/getMsgLsit",
        function (arrMsg) {
          info.msgs = arrMsg;
          //更新历史客户头像
          for(var i=0;i<info.msgs.length;i++){
            if(info.msgs[i].senderType == 1){
              info.msgs[i].avatarUrl = customer.avatarUrl;
            }
          }
          //历史消息Tab打开
          csPublic.openHisMsgTab(customer.groupId,info);
        }
    );
  }

  function searchMsgByDate (groupId) {
    var start = $('.date-select .Wdate').eq(0).val(), end = $('.date-select .Wdate').eq(1).val();
    if(!start){
      alert("请选择开始");
      return;
    }
    $.ajax({
      url:'{{getMsgsWithTimeApi}}',
      type:'post',
      dataType: 'json',
      data:{
        groupId:groupId,
        startDate:start,
        endDate:end
      },
      // beforeSend:function () {
      //   $('#csloading').show();
      // },
      success:function (res) {
        if (csPublic.isError(res)) return;
        oMsg.historyMsgTag = 1;
        var msgls = res.data;
        if(!msgls || msgls.length==0){
          alert('从'+start+'到'+end+'无聊天记录');
        }
        var arrMsg = [];
        for(var i=0; i<msgls.length;i++){
          var msgCell = {};
          _setMsgCell(msgls[i], msgCell);
          arrMsg.push(msgCell);
        }
        //更新历史客户头像
        for(var i=0;i<arrMsg.length;i++){
          if(arrMsg[i].senderType == 1){
            arrMsg[i].avatarUrl = v_historymsg.avatarUrl;
          }
        }
        v_historymsg.msgs = oMsg.lastHisMsg = [];
        v_historymsg.msgs = oMsg.lastHisMsg = arrMsg;
        Vue.nextTick(function () {
          $('.historymsg').scrollTop(0);
        })
      },
      error:function () {
        alert('getMsgsWithTime接口请求错误');
      },
      complete:function () {
        $('#csloading').hide();
      }
    })
  }

  function sendMsgParse (msg) {
    //吧发送框的内容转为可以发送的消息
    return msg.replace(/<img.*?src=".*?72\/(.*?).png".*?>/g,function (match, $1 ) {
      return twemoji.convert.fromCodePoint($1);
    }).replace(/<br>/g,'\n');
    
  }
  function msgAbstract (newMsg) {
    var content = oMsg.sendMsgParse(newMsg.content);
    if (newMsg.msgType == 1) {
      if (content.length > 12) {
         return  content.substr(0, 12) + "...";
      }
      return  content;
    } else if (newMsg.msgType == 2) {
        return '[图片]';
    } else if (newMsg.msgType == 3) {
       return '[链接]';
    }
  }
  function timeFormat(timestamp,type){
      // 当前毫秒
      var curdate = +new Date(),
          ms = 86400000,//24*60*60*1000,
          timediff = parseInt((curdate - timestamp)/1000),//时间差
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
      var mmTime = parseInt( timediff / 60 ) + '分' + Math.floor(timediff % 60 / 10)*10 + '秒';
      if(type == 0 && todayTime0<timestamp){
        if (timediff / 60 < 1) {
          return "刚刚";
        } else if (parseInt(timediff / 60 )<3) {
          return mmTime;//「x分钟前」
        }else if(timediff / (60*60)<1){
            return '<i>'+mmTime+'</i>'
        } else if (todayTime0<timestamp) {
          return hh + ':' + mm + ':' + ss;
        }
      }else {
        return y+'/'+m+'/'+d+' '+hh+':'+mm+':'+ss;
      }
  }
  return {
    sendMsg: sendMsg,
    getFormatMsg: getFormatMsg,
    upMsgLs: upMsgLs,
    setMsgContent: setMsgContent,
    findLastCmsg: findLastCmsg,
    scrollBottom: scrollBottom,
    computeRecordId: computeRecordId,
    picContent: picContent,
    getHisMsg:getHisMsg,
    searchMsgByDate:searchMsgByDate,
    sendMsgParse:sendMsgParse,
    msgAbstract:msgAbstract,
    setMsgCell:_setMsgCell,
    timeFormat:timeFormat
  }

})());
