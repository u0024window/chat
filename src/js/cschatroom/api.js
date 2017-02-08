(function ($) {
    window.ChatApi={};
    var api = {
        UpLoad:['{{upLoadApi}}'],//图片上传
        //@param:agentId,pageNo,pageSize
        HistorySessionList:['{{getHistorySessionLsitApi}}'],//历史客户列表
        //@param:memberId,groupId,agentId,msg,recordId
        AgentSendMessage:['{{AgentsendmessageApi}}'],//发送消息
        //@param:lastMsgId,direction,size,groupId
        MsgList:['{{getMsgLsitApi}}'],//拉取聊天消息
        //@param:agentId
        AgentFindNewMessage:['{{agentfindnewmessageApi}}'], //拉用户
        //@param:agentId
        SignInOrOut:['{{signinoroutApi}}'],//坐席状态
        //@param:agentId,groupId
        CloseSession:['{{closeSessionApi}}'],//关闭会话
        //@param:agentId
        ForceSignIn:['{{forcSignInApi}}'],//强制签入
        //@param:agentId
        QueryAgentStatus:['{{queryagentstatusApi}}'],//客服状态
        //@param:start,limit,sessionTimeStart,sessionTimeEnd,agentId,fromUserId
        SessionList:['{{sessionListApi}}'],//会话记录列表
        //@param:sessionId,groupId
        MsgsFromSession:['{{msgsFromSessionApi}}'],//获取会话记录用户聊天消息
        //@param:groupId,startDate,endDate
        MsgsWithTime:['{{getMsgsWithTimeApi}}'],//根据日期查询聊天消息
        //@param:lastMsgId,direction,size,groupId
        CurrSessionMsgs:['{{getCurrSessionMsgsApi}}'],//获取当前聊天消息
        //@param:type
        ParameterItem:['{{getParameterItemApi}}','get'],//系统快捷语
        //@param:agentId,question
        RobotKnowledgeSearch:['{{robotKnowledgeSearchApi}}'],//知识库搜索
        //@param:null
        WaitQueueLength:['{{waitQueueLengthApi}}'],//排队人数
        //@param:type,status
        QuickWordList:['{{quickWordListApi}}'],//个人快捷语
        //@param:memberId
        GetAppInfo:['{{getAppInfoApi}}'], //获取设备信息接口
        //@param:memberId
        OnlineUseInfo:['{{onlineuseinfoApi}}','get'],//用户信息
        //@param:callDate,mobile,userType
        QueryBaseUserInfo:['{{queryBaseUserInfoApi}}'],
        //@param:memberID,mobile
        JdbQueryUrgentOrder:['{{jdbqueryUrgentOrderApi}}'],
        //@param:memberID,mobile,userType
        JdbQueryUserOverdue:['{{jdbqueryUserOverdueApi}}'],
        //@param:memberID,mobile,userType
        JdbQueryBalance:['{{jdbqueryBalanceApi}}'],//账户余额
        //@param:memberID,mobile,userType
        JdbQueryPhoneArea:['{{jdbqueryPhoneAreaApi}}'],
        //@param:memberID,mobile,userType,orderType
        JdbQueryChargeWithDrawInfo:['{{jdbqueryChargeWithdrawInfoApi}}'],
        //@param:memberID,mobile
        JdbQueryTradingCount:['{{jdbqueryTradingCountApi}}'],//外完结交易
        //@param:limit,start
        PersonalUnreadNews:['{{personalUnreadNewsApi}}']//公告
    };

    for(var key in api){
        ChatApi['do'+key] = Deferred(api[key][0],api[key][1]);
    }
    function Deferred ( api,type ) {
        return function ( data ){
            return $.ajax({
                url:api,
                type:type || 'post',
                dataType:'json',
                data:data || {}
            });
        }
    }
})(jQuery);
