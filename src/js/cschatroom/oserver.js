var oServer = (function (window, r) {
    r.clicktag = '';
    r.status = 0;
    r.agentId = 'admin';
    r.agentName = '';
    r.sendTimer = null;
    r.avatarUrl = '#resourcePrefix#/img/cschatroom/server.png';
    r.robotName = '机器人';
    r.robotAvatar = '#resourcePrefix#/img/cschatroom/test.png';
    return r;
})(window, (function () {

    function statusChange(status, busyReson, callback) {
        $('.switch ul').hide();
        if (oServer.status == status) {
            return;
        }
        $.ajax({
            type: 'post',
            url: '{{signinoroutApi}}',
            dataType: 'json',
            data: {
                agentId: oServer.agentId,
                status: status,// 0离线1在线2忙碌
                busyReson: (busyReson || 0)//0=默认 1=开会 2=休息 3=培训 4=学习，status为busy时必选
            },
            success: function (res) {
                if (status != 0 && res.error.returnCode == 301) {
                    var tag = window.confirm('该用户已登录，是否强制签入？');
                    if (tag == true) {
                        forcSignIn(1);
                    }
                    return;
                }
                if (csPublic.isError(res)) return;//样式改变待加
                //成功后的样式改变
                if (callback && csPublic.isType(callback, 'Function')) {//
                    callback();
                }

            },
            beforeSend: function () {
                $('#csloading').show();
            },
            error: function () {
                alert('请求错误');
            },
            complete: function () {
                $('#csloading').hide();
            }
        })
    }

    function closeContact() {
        if (oCustomer.type != 0 || jQuery.isEmptyObject(oCustomer.current)) {
            return;
        }
        var tag = window.confirm('是否关闭该用户？');
        if (tag != true) {
            return;
        }
        $.ajax({
            type: 'post',
            url: '{{closeSessionApi}}',
            dataType: 'json',
            data: {
                agentId: oServer.agentId,
                groupId: oCustomer.current.groupId
            },
            success: function (res) {
                if (csPublic.isError(res)) return;
                oMsg.msgQueue=[];
                oCustomer.delCur();
                oCustomer.upHead();
            }
        });
    }

    function alwaySt() {
        //离线
        oCustomer.currentls.splice(0,oCustomer.currentls.length);
        if (oCustomer.type == 0) {
            oCustomer.current = {};
        }
        oCustomer.upHead();
        oCustomer.curcache = {};
        clearInterval(oServer.sendTimer);
    }

    function pollMsg() {//通过server返回的json判断是否有结束会话的客户，有新消息的客户，如果是当前聊天客户再调用拉取消息接口,如果是新来的加入list
        clearInterval(oServer.sendTimer);
        oServer.sendTimer = setInterval(function () {
            $.ajax({
                type: 'post',
                url: '{{agentfindnewmessageApi}}',
                dataType: 'json',
                data: {
                    agentId: oServer.agentId
                },
                success: function (res) {
                    //强制签入
                    if (res.error.returnCode == 301 || res.error.returnCode == 302) {
                        clearInterval(oServer.sendTimer);
                        Cookies.remove('onlineSt');
                        if (res.error.returnCode == 301) Toast('该坐席已经登录');
                        if (res.error.returnCode == 302) {
                            Toast('签入过期');
                            window.top.opener=null;
                            window.top.open('','_self');
                            window.top.close();
                        }
                        v_head.status = oServer.status = 0;
                        alwaySt();
                        return;
                    }
                    if (csPublic.isError(res)) return;
                    var newCustomers = res.data;
                    if (newCustomers == null){
                        oCustomer.type==0 && (oCustomer.current = oCustomer.curcache = {});
                        v_customerlist.currents =  oCustomer.currentls=[];
                        v_customerlist.$forceUpdate();
                        return;
                    }
                    for (var i = 0; i < newCustomers.length; i++) {
                        var scustomer = newCustomers[i];
                        oCustomer.upcurrent(scustomer);//更新客户列表
                        if (oCustomer.current != null && scustomer.groupId == oCustomer.current.groupId) {//如果是当前聊天客户还需要拉取消息
                            if (oCustomer.current.newMsgCount==0) {
                                continue;
                            }
                            oCustomer.type==0 && (oCustomer.current.newMsgCount = 0);//当前客户票新消失
                            var index = oMsg.findLastCmsg();
                            var cLast = null;

                            if (index && oCustomer.type == 0) {
                                cLast = oMsg.msgQueue[index];//把客户给客服发的最后一条消息得到
                            } else if (index && oCustomer.type == 1) {
                                cLast = oMsg.msgQueueCache[index];//把客户给客服发的最后一条消息得到
                            }
                            //获取lastMsgId
                            var lastMsgId = 0;
                            var chatType = '';
                            if (cLast != null) {
                                lastMsgId = cLast.msgId;
                                chatType = cLast.chatType;
                            }
                            //fix-bug:解决偶发 同时为0的情况
                            if(lastMsgId==0) return;

                            oMsg.upMsgLs({
                                    lastMsgId: lastMsgId,
                                    chatType: chatType,
                                    direction: 0,
                                    size: oMsg.addSize,
                                    groupId: oCustomer.current.groupId
                                },
                                "{{getCurrSessionMsgsApi}}",
                                function (arrMsg) {
                                    v_chatbody.messages = oMsg.msgQueue = csPublic.arrUnique(oMsg.msgQueue.concat(arrMsg),'recordId') ;
                                    Vue.nextTick(function () {
                                        oCustomer.upCurMsg();
                                        oMsg.scrollBottom('.chatlog');
                                    });
                                    $('#csloading').hide();
                                }
                            );
                        }
                    }
                    delOutCur(newCustomers);
                    v_customerlist.currents = oCustomer.currentls;
                    v_customerlist.$forceUpdate();

                },
                error:function (xhr) {
                    if( xhr.status == "200"){ // 兼容调试时301/302重定向导致触发error的问题
                        Toast('当前账号在当前电脑已经退出');
                        window.top.opener=null;
                        window.top.open('','_self');
                        window.top.close();
                        return;
                    }
                    console.log('请求失败');
                }
            })
        }, 3000)
    }

    function forcSignIn(status) {
        $.ajax({
            type: 'post',
            url: '{{forcSignInApi}}',
            dataType: 'json',
            data: {
                agentId: oServer.agentId
            },
            success: function (res) {
                if (csPublic.isError(res)) return;
               v_head.status = oServer.status = status;//更改变量状态
                pollMsg();
            },
            beforeSend: function () {
                $('#csloading').show();
            },
            error: function () {
                alert('请求错误');
            },
            complete: function () {
                $('#csloading').hide();
            }
        })
    }

    function sendMessage($event) {
        if($event.shiftKey) return;
            var msgs = $('.inputmsg').html();
            msgs = msgs.trim();
            if (msgs.length == 0) {
                alert('发送内容不能为空');
                $event.preventDefault();
                return;
            }
            if (msgs.length > 2000) {
                alert('一次最多能发送2000字');
                $event.preventDefault();
                return;
            }
            if (oCustomer.type == 1) {
                alert('会话已结束，不能发消息');
                $event.preventDefault();
                return;
            }
            var msgContent = oMsg.getFormatMsg(oMsg.sendMsgParse(csPublic.noEscapeHtml(msgs)));
            msgContent = JSON.stringify(msgContent);
            oMsg.msgQueue.push({
                msgId: '', // res.msgId
                msgTime: +new Date(),
                senderType: 2, // 系统消息，客户，客服
                avatarUrl: oServer.avatarUrl,
                msgContent: {
                    msgType: '1', // 消息类型；1=文本；2=图片；3=链接；
                    content: msgs, // 消息内容1
                    action: '', // 处理方式
                    ext: '' // 扩展字段
                },
                recordId: oMsg.computeRecordId(oMsg.msgQueue[oMsg.msgQueue.length - 1].recordId),
                msgStatus: 2
            });
            Vue.nextTick(function () {
                oMsg.scrollBottom('.chatlog');
            });
            oCustomer.upCurMsg();
            oMsg.sendMsg(msgContent, oMsg.msgQueue[oMsg.msgQueue.length - 1]);
            $('.inputmsg').html("");
            $event.preventDefault();
        
    }
    function showCur () {
        if(oCustomer.type == 0) return;
        v_customerlist.type = oCustomer.type =v_chatbody.type =v_chatbody.tabType = 0;
        oCustomer.historyls = [];//清空历史列表
        oMsg.msgQueue = oMsg.msgQueueCache;
        v_chatbody.messages = oMsg.msgQueue;
        oCustomer.upHead(oCustomer.curcache.name,oCustomer.curcache.avatarUrl);
        v_head.head = oCustomer.head;
        $('input[type="file"]').show();
        $('#maskChatInput').removeClass('maskChatInput');
        $('.cur_customer').removeClass('csbtnshow');
        $('.history-btn').addClass('csbtnshow');
        $('#current').show();
        $('#history').hide();
        oCustomer.current = oCustomer.curcache;
        if ($.isEmptyObject(oCustomer.current)) {
            v_chatbody.msgmask=!1;
        } else {
            v_chatbody.msgmask=!0;
            if(oCustomer.current.newMsgCount>0) {
                var index = oMsg.findLastCmsg();
                var cLast = null;

                if (index && oCustomer.type == 0) {
                    cLast = oMsg.msgQueue[index];//把客户给客服发的最后一条消息得到
                } else if (index && oCustomer.type == 1) {
                    cLast = oMsg.msgQueueCache[index];//把客户给客服发的最后一条消息得到
                }
                //获取lastMsgId
                var lastMsgId = 0;
                var chatType = '';
                if (cLast != null) {
                    lastMsgId = cLast.msgId;
                    chatType = cLast.chatType;
                }
                oMsg.upMsgLs({
                        lastMsgId: lastMsgId,
                        chatType: chatType,
                        direction: 0,
                        size: oMsg.addSize,
                        groupId: oCustomer.current.groupId
                    },
                    "{{getCurrSessionMsgsApi}}",
                    function (arrMsg) {
                        v_chatbody.messages = oMsg.msgQueue = oMsg.msgQueue.concat(arrMsg);
                        oMsg.scrollBottom('.chatlog');
                        $('#csloading').hide();
                    }
                );
                oCustomer.current.newMsgCount = 0;
            }
        }
    }
    
    function showHistory () {
        if(oCustomer.type == 1) return;
        oCustomer.type = v_customerlist.type =v_chatbody.tabType = 1;
        $('#history .cust').removeClass('cust');
        oCustomer.curcache = oCustomer.current;
        oCustomer.current = {};
        oCustomer.head.name = "";
        oCustomer.head.avatar_url = oCustomer.defaultAvatarUrl;
        oMsg.msgQueueCache = oMsg.msgQueue;
        $('input[type="file"]').hide();
        $('#maskChatInput').addClass('maskChatInput');
        $('.cur_customer').addClass('csbtnshow');
        $('.history-btn').removeClass('csbtnshow');

        $('#current').css('display', 'none');
        $('#history').css('display', 'block');
        var tel = $('#tel').val();
        var start =$('#startSessionDate').val();
        var end =$('#endSessionDate').val();

        tel ? oCustomer.getUserOtherInfo('queryBaseUserInfo',function(res){
            try{
                var groupId = "kefu_"+res.data.memberId;
                oCustomer.searchSessionList(groupId,start,end);

            }catch(e){
                alert('queryBaseUserInfo获取memberId失败');
            }
        },tel) : oCustomer.searchSessionList('',start,end);
    }
    
    function switchSt (status) {
        if(status==0 && oCustomer.currentls && oCustomer.currentls.length>0){
            Toast('当前有会话,不能切换状态为离线');
            return;
        }
        oServer.statusChange(status, 0, function () {//回调函数为请求成功后做的事
            v_head.status = oServer.status = status;
            if (oServer.status == 1) {
                oServer.pollMsg();
            }
            if (oServer.status == 0) {
                oServer.alwaySt();
            }
            if (oServer.status == 2) {
                v_head.status = 2;
            }
        });
    }
    function getShortCut () {
        _self = this;
        $.ajax({
            type:'get',
            url:'{{getParameterItemApi}}',
            data:{
                type:'commonLanguage'
            },
            dataType:'json',
            beforeSend:function () {
                $('csloading').show();
            },
            success:function (res) {
                _self.shortcut = oMsg.shortCut =res.data;
            },
            error:function () {
                alert('快捷语请求失败');
            },
            complete:function () {
                $('csloading').hide();
            }
        })
    }
    function getPersonCut ( ) {
        _self = this;
        $.ajax({
            type:'post',
            url:'{{quickWordListApi}}',
            data:{
                type:'2',
                status:'1'
            },
            dataType:'json',
            beforeSend:function () {
                $('csloading').show();
            },
            success:function (res) {
                if(res.data.length ==0){
                    _self.person = 1;
                    return;
                }
                _self.person = 0;
                _self.shortcut = oMsg.personQuickList =res.data;
            },
            error:function () {
                alert('快捷语请求失败');
            },
            complete:function () {
                $('csloading').hide();
            }
        })
    }
    //删除当前断开连接的用户
    function delOutCur(scustomers){
        var  c,isExist = !1,
         curgId = oCustomer.current.groupId;
        for(var i=0;i<oCustomer.currentls.length;i++){
            c=oCustomer.currentls[i];
            isExist = !1;
            for(var j=0;j<scustomers.length; j++){
                if(c.groupId == scustomers[j].groupId){
                    isExist = !0;
                }
            }
            if(isExist) continue;
            oCustomer.currentls.splice(i,1);
            console.log(c);
            console.log(curgId);
            if( c.groupId == curgId){
                oCustomer.current = oCustomer.curcache = {};
            }
        }
    }
    //获取客服姓名
    function findNameByAgentId () {
        $.ajax({
            url:'{{findByAgentApi}}',
            type:'get',
            dataType:'json',
            data:{
                agent:oServer.agentId
            },
            success:function ( res ) {
                oServer.agentName=res.data.employeeName;
            }
        });
    }
    //获取排队人数
    function getLineNum (){
        _self = this;
        $.ajax({
            type:'post',
            url:'{{waitQueueLengthApi}}',
            dataType:'json',
            data:{},
            success:function (res) {
                if(csPublic.isError(res)) return;
                v_head.lineNum = res.data;
            }
        })
    }
    
    return {
        statusChange: statusChange,
        closeContact: closeContact,
        alwaySt: alwaySt,
        pollMsg: pollMsg,
        forcSignIn: forcSignIn,
        sendMessage:sendMessage,
        showCur:showCur,
        showHistory:showHistory,
        switchSt:switchSt,
        getShortCut:getShortCut,
        getLineNum:getLineNum,
        getPersonCut:getPersonCut
    }
})());
