  // {
    // memberId: '',
    // groupId: '',
    // name: '',
    // mobile: '',
    // avatarUrl: '',
    // msgTime: '',
    // msgContent: {// string 消息内容:富文本格式
    //   msgType: '',// 消息类型；1=文本；2=图片；3=链接；
    //   content: '',// 消息内容
    //   action: '',// 处理方式
    //   ext: ''// 扩展字段
    // },
    // isNewMsg: '',
    // senderType: '',
    // curChat: '',
    // recordId: '',
    // input: '',
    // otherInfo: '',
    // }
var oCustomer = (function (window, r) {
    r.type=0;
    r.lastpage = 0;
    r.historypage=1;
    r.hasCurrent=false;
    r.pageSize=10;
    r.currentls=[];
    r.historyls= [];
    r.laster = [];
    r.current={};
    r.headcache={};
    r.curcache = {};
    r.defaultAvatarUrl = '#resourcePrefix#/img/cschatroom/customer.jpg';
    r.userInfoApiPrefix = "/jiedaibao/userInfo/";
    r.head={//当前聊天客户的头像和name
      name: '',
      avatar_url: r.defaultAvatarUrl
    };
    r.info={//当前客户的信息
      name: '',
      mobile: '',
      sex: '',
      unCompletedOrderCount:'',//jdbqueryUrgentOrder 处理中紧急工单数
      isUrgentOrder:'',//jdbqueryUrgentOrder 处理中紧急工单
      chargeWithException:'',//jdbqueryUrgentOrder 充值异常
      chargeDrawException:'',//jdbqueryUrgentOrder 提现异常
      isloan: '',
      tradingCount:'',//未完结交易
      isOverdueAsCreditor:'',//jdbqueryUserOverdue 是否被逾期
      isOverdueAsDebtor:'',//jdbqueryUserOverdue 是否逾期
      level:'', //queryBaseUserInfo 用户等级
      registerTime:'',//queryBaseUserInfo 注册时间
      friendCount:'',//queryBaseUserInfo 好友数
      idNo:'',//queryBaseUserInfo 证件号码
      faceStatus:'',//queryBaseUserInfo 人脸状态
      status:'',//queryBaseUserInfo 客户状态 int 用户状态：用户状态，1 正常，2 挂失，3 注销，4 失效)",
      cardInfo:[
        {
          "bankName": "",
          "cardNo": ""
        }
      ],//queryBaseUserInfo 绑定银行卡
      balance:'',//jdbqueryBalance balance
      region:'',//jdbqueryPhoneArea 地域
      platform: '',//ios
      deviceType:'',// 6s   queryBaseUserInfo
      systemVersion: '',//3.7.3
      appVersion:''//
    };
    
  return r;
})(window, function () {
  function uphistory(customerlist) {//下拉获取历史服务客户，加入historyls队列
    for (var i =0; i < customerlist.length; i++) {
      var customerCell = {};
      _setCustomerCell(customerlist[i], customerCell);
      //获取头像 name
      customerCell.moblie = "";
      customerCell.name = "";
      customerCell.avatarUrl = oCustomer.defaultAvatarUrl;
      oCustomer.historyls.push(customerCell);
      getNmAurl(oCustomer.historyls[oCustomer.historyls.length - 1]);
    }
    v_chatbody.historys = oCustomer.historyls;
  }

  function upcurrent(scustomer) {
    //是不是已有客户 groupId 判断
    if (_findCustomer(oCustomer.currentls, "groupId", scustomer.groupId) < 0) {//新客户
      var customerCell = {};
      _setCustomerCell(scustomer, customerCell);
      oCustomer.currentls.push(customerCell);
      getNmAurl(oCustomer.currentls[oCustomer.currentls.length - 1]);
      return;
    }
    //不是新客户
    for (var j = 0; j < oCustomer.currentls.length; j++) {
      var ccustomer = oCustomer.currentls[j],
          con = {};
      if (scustomer.groupId == ccustomer.groupId) {//已存在
        ccustomer.newMsgCount = scustomer.newMsgCount;
        if (scustomer.newMsgCount<=0) return;
        oMsg.setMsgContent(scustomer.msgContent, con);
        oCustomer.currentls[j].msgContent = {
            msgType: con.msgType,// 消息类型；1=文本；2=图片；3=链接；
            content: con.content,// 消息内容
            action: con.action,// 处理方式
            ext: con.ext// 扩展字段
        };
        ccustomer.msgTime = scustomer.createTime;
      }
      //
  }
  }

  function upCurMsg() {//发消息和拉取新消息，更新当前客户消息摘要
    var newMsg = oMsg.msgQueue[oMsg.msgQueue.length - 1];//最新消息内容
    oCustomer.current.msgContent = {
      msgType: newMsg.msgContent.msgType, // 消息类型；1=文本；2=图片；3=链接；
      content: newMsg.msgContent.content // 消息内容
    };
    oCustomer.current.msgTime = newMsg.msgTime;
  }

  function click(index,$event) {
    var customers = _getCustomersByType();
    v_chatbody.tabType = 0;
    v_chatbody.msgmask = !1;//消息遮罩层
    _clearInfo();
    //输入框内容
    _saveInput(customers,index);
    // 更改当前客户
    oCustomer.current = customers[index];
    if (oCustomer.type == 0 && !!oCustomer.current) {
       oCustomer.current.newMsgCount = 0;
    }
    // 点击客户列表样式改变
    clickStyle($event.currentTarget);
    // 更新页面头像
    upHead(customers[index].name, customers[index].avatarUrl);
    // 更新客户信息
    _upCurUserInfo();
    // 更新聊天消息
    v_chatbody.messages = oMsg.msgQueue = [];
    var url = oCustomer.type == 0 ? '{{getCurrSessionMsgsApi}}' : '{{msgsFromSessionApi}}';
    oMsg.upMsgLs({
        lastMsgId: 0,
        senderType: '',
        direction: 1,
        size: oMsg.addSize,
        sessionId:(oCustomer.type ==1 && oCustomer.current.sessionId),
        groupId: oCustomer.current.groupId
      },
        url,
        function (arrMsg) {
          v_chatbody.messages = oMsg.msgQueue = oMsg.msgQueue.concat(arrMsg);
          $('#csloading').hide();
          oMsg.scrollBottom('.chatlog');
        }
    );//加入消息
  }

  function _saveInput (customers,index) {
    oCustomer.current.input = $('#sendingmsg').html();
    var input = customers[index].input;
    !!(oCustomer.type==0 && input) ? $('#sendingmsg').html(input)
        : $('#sendingmsg').html('');
  }

  function _getCustomersByType() {//根据客户类型，返回当前操作客户列表
    return oCustomer.type == 0 ? oCustomer.currentls : oCustomer.laster;
  }

  function _setCustomerCell(customeri, customerCell) {
    customerCell.msgContent = {};
    customerCell.memberId = customeri.memberId;
    customerCell.msgTime = customeri.createDate || customeri.msgTime || customeri.createTime;
    customerCell.msgId = customeri.msgId;
    customerCell.groupId = customeri.groupId;
    customerCell.newMsgCount = customeri.newMsgCount;
    oMsg.setMsgContent(customeri.msgContent, customerCell.msgContent);
    customerCell.moblie = "";
    customerCell.name = "";
    customerCell.avatarUrl = oCustomer.defaultAvatarUrl;
  }

  function clickStyle(oe) {//点击要聊天的客户，变换样式
    $(oe).addClass('cust').removeClass('othercust');
    $(oe).siblings().addClass('othercust').removeClass('cust');
  }

  function _upCurUserInfo() {//请求userinfo接口，设置当前窗口的客户信息
    $.ajax({
      type: 'get',
      url: '{{onlineuseinfoApi}}',
      dataType: 'json',
      data: {
        memberId: oCustomer.current.memberId
      },
      success: function (res) {
        try{
          var userinfo = res.data;
          oCustomer.info.name = userinfo.userName;
          oCustomer.info.mobile = userinfo.mobile;
          oCustomer.info.sex = userinfo.sex;
          oCustomer.info.isloan = (userinfo.collected == 1 ? '是' : '否');
        }catch(e){
          oCustomer.current.name='';
          oCustomer.current.avatarUrl = oCustomer.defaultAvatarUrl;
          oCustomer.info.name = '';
          oCustomer.info.mobile = '';
          _getAppInfo();
          oCustomer.info.sex = '';
          oCustomer.info.isloan = '';
          oCustomer.info.isoverdue = '';
        }
        oCustomer.info.mobile && _getAllOtherInfo();

      }
    })
  }

  function isOn() {
    $.ajax({
      type: 'post',
      url: '{{queryagentstatusApi}}',
      dataType: 'json',
      data: {
        agentId: oServer.agentId
      },
      success: function (res) {
        if (res.error.returnCode != 301) {
          if (res.error.returnCode == 308) return;//新签入坐席
          if (csPublic.isError(res)) return;
        }
        //如果需要强制签入
        if (res.error.returnCode == 301) {
          var tag = window.confirm('该用户已登录，是否强制签入？');
          if (tag == true) {
            oServer.forcSignIn(1);
          }
          return;
        }
        //如果正常
        if (res.data == null) return;
        v_head.status = res.data.status;
        v_head.status==1 && oServer.pollMsg();

      }
    })
  }

  function delCur() {//删除当前客户
    var i = csPublic.objFindByKey(oCustomer.currentls, 'memberId', oCustomer.current.memberId);
    oCustomer.current = oCustomer.curcache = {};
    oCustomer.currentls.splice(i, 1);
    $('#current .cust').removeClass('cust');
  }

  function getNmAurl(customeri) {
    $.ajax({
      type: 'get',
      url: '{{onlineuseinfoApi}}',
      dataType: 'json',
      cache:false,
      data: {
        memberId: customeri.memberId,
        datetime: +new Date()
      },
      success: function (res) {
        try{
          var userinfo = res.data;
          customeri.name = userinfo.userName;
          customeri.mobile = userinfo.mobile;
          customeri.avatarUrl = userinfo.thumbnail_url || oCustomer.defaultAvatarUrl;
          v_customerlist.$forceUpdate();
        }catch (e){
          customeri.name = '';
          customeri.mobile = '';
          customeri.avatarUrl = oCustomer.defaultAvatarUrl;
        }

      }
    })
  }
  //没有当前客户不传值
  function upHead(name, avatarUrl) {//更新客户头像和name
    oCustomer.head.name = name || '';
    oCustomer.head.avatar_url = avatarUrl || oCustomer.defaultAvatarUrl;
  }

  function _findCustomer(customers, key, value) {
    for (var i = 0; i < customers.length; i++) {
      if (customers[i][key] == value) {
        return i;
      }
    }
    return -1;
  }

    function getLastCust () {
      if(this.type==1) return;
      v_chatbody.tabType = 1;
      oCustomer.historypage = 1;
      v_chatbody.historys = oCustomer.historyls = [];
      $.ajax({
       type: 'post',
       url: '{{getHistorySessionLsitApi}}',
       dataType: 'json',
       data: {
        agentId: oServer.agentId,
        pageNo: oCustomer.historypage,
        pageSize: oCustomer.pageSize
       },
       success: function (res) {
       if (csPublic.isError(res)) return;
       oCustomer.historypage++;
       var customerlist = res.data.msgList;
       oCustomer.uphistory(customerlist);
       }
       });
      
    }

    function getSessionlist () {
      $.ajax({
        url:'{{sessionListApi}}',
        type:'post',
        dataType:'json',
        data:{
          "start":oCustomer.lastpage*oCustomer.pageSize,
          "limit":oCustomer.pageSize,
          "agentId":oServer.agentId,
          sessionTimeStart:csPublic.GetDateStr(-7),
          sessionTimeEnd:csPublic.GetDateStr(0)
        },
        success:function ( res ) {
          if(csPublic.isError(res)) return;
          var customers = res.data.sessionList;
          if (customers == null || customers.length == 0) {
            csPublic.refreshText('#history','没有更多了');
            return;
          }
          oCustomer.lastpage++;
          for(var i=0;i<customers.length;i++){
            var custcell = {};
            custcell.name = customers[i].customerName;
            custcell.mobile = customers[i].tel;
            custcell.msgTime = customers[i].sessionEndTime;
            custcell.groupId = customers[i].fromUserId;
            custcell.sessionId = customers[i].sessionId;
            custcell.id = customers[i].id;
            custcell.newMsgCount = 0;
            custcell.avatarUrl = oCustomer.defaultAvatarUrl;
            custcell.memberId = customers[i].fromUserId.substring(5);
            custcell.msgContent={// string 消息内容:富文本格式
              msgType: 1,// 消息类型；1=文本；2=图片；3=链接；
              content: "是否建单:"+(customers[i].hasSheetCreated==0 ? '否':'是'),// 消息内容
              action: '',// 处理方式
              ext: ''// 扩展字段
            };
            oCustomer.laster.push(custcell);
            oCustomer.getNmAurl(oCustomer.laster[oCustomer.laster.length-1]);
          }
          v_customerlist.lastSession=oCustomer.laster;
          csPublic.refreshText('#history','历史客户加载成功');
        },
        error: function () {
          csPublic.refreshText('#history','历史客户加载失败');
        }
      });
    }

  function getUserOtherInfo(url,successCB,mobile){
    var mobile = mobile || oCustomer.current.mobile;
    var data = {
      callDate:+new Date(),
      memberID:oCustomer.current.memberId,
      mobile:mobile,
      userType:1
    };
    data = JSON.stringify(data);
      $.ajax({
        // url: oCustomer.userInfoApiPrefix+url,
        url:'/data/cschatroom/userinfo/'+url+'.json',
        type: 'post',
        contentType:'application/json;charset=UTF-8',
        data: data,
        dataType:'json',
        success:successCB
      })
  }
  function _getAllOtherInfo(){
    getUserOtherInfo('queryBaseUserInfo',function(res){
          try{
            oCustomer.info.level = res.data.level;
            oCustomer.info.registerTime = new Date(res.data.registerTime).Format('yyyy-MM-dd hh:mm:ss');
            oCustomer.info.friendCount = res.data.friendCount;
            oCustomer.info.idNo = res.data.idNo;
            oCustomer.info.faceStatus = (res.data.faceStatus==0 ? '未通过':'通过');
            oCustomer.info.cardInfo = res.data.cardInfo || [];
            oCustomer.info.platform = res.data.platform;
            oCustomer.info.appVersion = res.data.appVersion;
            oCustomer.info.systemVersion = res.data.systemVersion;
            oCustomer.info.deviceType = res.data.deviceType;
            if(res.data.status==1) oCustomer.info.status="正常";
            if(res.data.status==2) oCustomer.info.status="挂失";
            if(res.data.status==3) oCustomer.info.status="注销";
            if(res.data.status==4) oCustomer.info.status="失效";
          }catch(e){
            oCustomer.info.platform = '';
            oCustomer.info.systemVersion = '';
            oCustomer.info.appVersion = '';
          }
    });
    getUserOtherInfo('jdbqueryUrgentOrder',function(res){
      try{
        oCustomer.info.unCompletedOrderCount = res.data.unCompletedOrderCount;
        oCustomer.info.isUrgentOrder = res.data.isUrgentOrder;
      }catch(e){
        oCustomer.info.isOverdueAsCreditor = '';
        oCustomer.info.isOverdueAsDebtor = '';
      }
    });
    getUserOtherInfo('jdbqueryUserOverdue',function(res){
      try{
        oCustomer.info.isOverdueAsCreditor = res.data.isOverdueAsCreditor;
        oCustomer.info.isOverdueAsDebtor = res.data.isOverdueAsDebtor;
      }catch(e){}
    });
    getUserOtherInfo('jdbqueryBalance',function(res){
      try{
        oCustomer.info.balance = res.data.balance;
      }catch(e){}
    });
    getUserOtherInfo('jdbqueryPhoneArea',function(res){
      try{
        oCustomer.info.region = res.data.region;
      }catch(e){}
    });
    getUserOtherInfo('jdbqueryChargeWithdrawInfo',function(res){
      try{
        oCustomer.info.chargeWithException = res.data.chargeWithException;
        oCustomer.info.chargeDrawException = res.data.chargeDrawException;
      }catch(e){}
    });
    getUserOtherInfo('jdbqueryTradingCount',function(res){
      try{
        oCustomer.info.tradingCount = res.data.tradingCount;
      }catch(e){}
    });
  }
  //展示最新的sessionList
  function showSessionList(){
    oCustomer.lastpage = 0;
    v_customerlist.lastSession = oCustomer.laster=[];    //会话列表没有未看消息
    $.ajax({
      url:'{{sessionListApi}}',
      type:'post',
      dataType:'json',
      data:{
        "start":1,
        "limit":oMsg.pageSize,
        "agentId":oServer.agentId,
        sessionTimeStart:csPublic.GetDateStr(-7),
        sessionTimeEnd:csPublic.GetDateStr(0)
      },
      success:function ( res ) {
        if(csPublic.isError(res)) return;
        var customers = res.data.sessionList;
        if(customers==null || customers.length==0){
          alert('暂无最近会话');
          return;
        }
        oCustomer.lastpage++;
        var arrLast = [];
        for(var i=0;i<customers.length;i++){
          var custcell = {};
          custcell.name = customers[i].customerName;
          custcell.mobile = customers[i].tel;
          custcell.msgTime = customers[i].sessionEndTime;
          custcell.groupId = customers[i].fromUserId;
          custcell.sessionId = customers[i].sessionId;
          custcell.id = customers[i].id;
          custcell.newMsgCount = 0;
          custcell.avatarUrl = oCustomer.defaultAvatarUrl;
          custcell.memberId = customers[i].fromUserId.substring(5);
          custcell.msgContent={// string 消息内容:富文本格式
            msgType: 1,// 消息类型；1=文本；2=图片；3=链接；
            content: "是否建单:"+(customers[i].hasSheetCreated==0 ? '否':'是'),// 消息内容
            action: '',// 处理方式
            ext: ''// 扩展字段
          };
          arrLast.push(custcell);
          oCustomer.getNmAurl(arrLast[arrLast.length - 1]);
        }
        v_customerlist.lastSession = oCustomer.laster = arrLast;
        if(oCustomer.laster.length ==0){
        v_customerlist.hasResult=false;
      } else{
        v_customerlist.hasResult=true;
      }

      },
      error: function () {
        alert('最近会话加载失败');
      }
    });
  }

  function _clearInfo (  ) {
    // oCustomer.info={//当前客户的信息
        for(var key in oCustomer.info){
          if(key=='cardInfo')
            oCustomer.info['cardInfo'] = [];
          else
            oCustomer.info[key]= '';
        }
  }
  //搜索会话记录
  function searchSessionList(fromUserId,startDate,endDate){
    var startDate = startDate || csPublic.GetDateStr(-7);
    var endDate = endDate || csPublic.GetDateStr(0);
    $.ajax({
      url:'{{sessionListApi}}',
      type:'post',
      dataType:'json',
      data:{
        "start":0,
        "limit":100,
        "agentId":oServer.agentId,
        sessionTimeStart:startDate,
        sessionTimeEnd:endDate,
        fromUserId:fromUserId
      },
      success:function ( res ) {
        if(csPublic.isError(res)) return;
        var customers = res.data.sessionList;
        var arrLast = [];
        for(var i=0;i<customers.length;i++){
          var custcell = {};
          custcell.name = customers[i].customerName;
          custcell.mobile = customers[i].tel;
          custcell.msgTime = customers[i].sessionEndTime;
          custcell.groupId = customers[i].fromUserId;
          custcell.sessionId = customers[i].sessionId;
          custcell.id = customers[i].id;
          custcell.newMsgCount = 0;
          custcell.avatarUrl = oCustomer.defaultAvatarUrl;
          custcell.memberId = customers[i].fromUserId.substring(5);
          custcell.msgContent={// string 消息内容:富文本格式
            msgType: 1,// 消息类型；1=文本；2=图片；3=链接；
            content: "是否建单:"+(customers[i].hasSheetCreated==0 ? '否':'是'),// 消息内容
            action: '',// 处理方式
            ext: ''// 扩展字段
          };
          arrLast.push(custcell);
          oCustomer.getNmAurl(arrLast[arrLast.length - 1]);
        }
        v_customerlist.lastSession = oCustomer.laster = arrLast;
        if(oCustomer.laster.length ==0){
          v_customerlist.hasResult=false;
        } else{
          v_customerlist.hasResult=true;
        }
      },
      error:function (  ) {
        alert('sessionList请求失败');
      }
    });
  }
  return {
    uphistory: uphistory,
    upcurrent: upcurrent,
    upCurMsg: upCurMsg,
    click: click,
    isOn: isOn,
    delCur: delCur,
    upHead: upHead,
    getLastCust:getLastCust,
    getNmAurl:getNmAurl,
    clickStyle:clickStyle,
    getSessionlist:getSessionlist,
    getUserOtherInfo:getUserOtherInfo,
    showSessionList:showSessionList,
    searchSessionList:searchSessionList
  }

}());
