 (function ( factory,oMsg,oCustomer,oServer,csPublic,$) {
    //头部
    Vue.component('cs-header', {
        props: ['head','msgNum','lineNum','status'],
        template: require('cschatroom/csheader.vue'),
        data:function () {
            return {
                getLineNumTimer:null,
                listDisplay:0
            }
        },
        computed:{
            stStyle:function () {
                var st = ['outline','online','busy'];
                return st[this.status]+' curStatus';
            }
        },
        methods:{
            close:oServer.closeContact,
            showCur:oServer.showCur,
            changeSt:oServer.switchSt,
            lastHistoryc:oServer.showHistory,
            stClick:function () {
                $('.kefu-status ul').toggle();
            }
        },
        mounted:function () {
            _self = this;
            this.getLineNumTimer = setInterval(function () {
                oServer.getLineNum.apply(_self);
            },5000);
        }
    });
     //客户cell
     Vue.component('customer-li', {
        props: ['msgitem','type'],
        template: require('cschatroom/customerli.vue'),
         methods:{
             getContent:oMsg.msgAbstract,
             timeFormat:oMsg.timeFormat
         },
         mounted:function () {
             csPublic.emojiParse(this.$el);
         },
        updated:function () {
            if(oCustomer.type==0){
                if(oCustomer.current && oCustomer.current.groupId==this.msgitem.groupId){
                    $(this.$el).addClass('cust').removeClass('othercust');
                }else {
                    $(this.$el).addClass('othercust').removeClass('cust');
                }
            }

            csPublic.emojiParse(this.$el);
        }

    });
     //消息cell
    Vue.component('chatmsg', {
        props: ['msg','index','type'],
        template: require('cschatroom/chatmsg.vue'),
        methods:{
            errorMsg:factory.errorMsg,
            bigImg:factory.bigImg
        },
        mounted:function () {
            csPublic.emojiParse(this.$el);
        },
        updated:function () {
            csPublic.emojiParse(this.$el);
        }
    });
     //发送框
     Vue.component('inputpanel',{
        data:function () {
            return {
                shortcut:oMsg.shortCut,
                extendTag:0,//折叠
                shortCutType:0,//快捷语
                person:0,
                range:null
            }
        },
        template: require('cschatroom/inputpanel.vue'),
        methods:{
            sendMessage:oServer.sendMessage,
            getOneQuick:factory.getOneQuick,
            quickList:factory.quickList,
            detailcon:factory.detailcon,
            mouseout:function () {
                $('.detailcon').hide();
            },
            inputC:function (  ) {
                factory.saveSelection.apply(this);
            },
            inputKeyUp:function (  ) {
                factory.saveSelection.apply(this);
            },
            systemc:factory.getSystemCut,
            personc:factory.getPersonCut,
            paste:factory.paste,
            emoc:factory.emoc,
            extendedUp:factory.extendedUp,
            extended:function () {
                this.extendTag ? factory.extendedDown.apply(this) : factory.extendedUp.apply(this);
            }
        },
         mounted:factory.inputpanelMounted,
        updated:function () {
            csPublic.emojiParse(this.$el);
        }
    });
     //客户信息
    Vue.component('right-userinfo', {
        data:function () {
            return {
                userinfo: oCustomer.info,
                bankInfoTag:0
            }
        },
        methods:{
            bankInfoC:function ($event,bankInfo) {
                if(bankInfo.length==0) return;
                $event.stopPropagation();
                $('.bank-info').toggle();
            }
        },
        template: require('cschatroom/userinfo.vue')
    });
     //历史消息
    Vue.component('lastSession', {
        props: ['msgitem'],
        template: require('cschatroom/lastSession.vue'),
        methods:{
            getHisMsg:oMsg.getHisMsg
        }

    });
     //表情
     Vue.component('emoji', {
         props:['range'],
        data:function () {
            return {
                emojitype:0,
                nthtype:0
            }
        },
        template: require('cschatroom/emoji.vue'),
        methods:{
            pageChange:factory.pageChange,
            emojiTypeC:factory.emojiTypeC,
            emojitrans:factory.emojitrans,
            emtionsc:function () {
            },
            selectEmoji:factory.selectEmoji
        },
        mounted:function () {
            this.emojitrans();
        }
    });
     //知识库
     Vue.component('kownledge', {
         data:function () {
             return {
                 result:[],
                 question:'',
                 noQuestion:'',
                 detailUrl:'',
                 type:'no'
             }
         },
         methods:{
             search:factory.kownledgeSearch,
             answerDetail:factory.answerDetail,
             backQuestion:factory.backQuestion,
             copyKownLedgeAnswer:factory.copyKownLedgeAnswer
         },
         mounted:factory.klgmounted,
         template: require('cschatroom/kownledge.vue')
     });
     //聊天框
     Vue.component('chatpanel',{
         props:['messages','type'],
         mounted:factory.chatpanelMounted,
         template:require('cschatroom/chatpanel.vue')
     });
    //tab栏 客户信息,历史客户,知识库
    Vue.component('rightside',{
        props:['historys','type'],
        methods:{
            userInfoc:factory.userInfoc,
            kownledgec:factory.kownledgec,
            showHistory:oCustomer.getLastCust
        },
        mounted:factory.rightSideMounted,
        template: require('cschatroom/rightside.vue')
    });
     //鼠标滚动加载模板
     Vue.component('mousewheel',{
         template: require('cschatroom/mousewheel.vue')
     });
     //历史消息弹框
     Vue.component('historymsg',{
         props:['name','groupId','msgs'],
         methods:{
             close:function () {
                 oMsg.historyMsgTag = 0;
                 $('#historymsg').hide();
                 $('.Wdate').eq(0).val("");
                 $('.Wdate').eq(1).val("");
             },
             searchByDate:oMsg.searchMsgByDate
         },
         template:require('cschatroom/historymsg.vue')
     });
     //搜索sessionlist
     Vue.component('search-session',{
         data:function () {
            return {
                tel:'',
                startDate:'',
                endDate:'',
                activeBtn:-1
            }
        },
         methods:{
             search:function (){
                 this.activeBtn=1;
                 v_customerlist.mouseWheelTag = 0;
                 var start = $('.search-session .Wdate').eq(0).val(), end = $('.search-session .Wdate').eq(1).val();
                 this.tel ? oCustomer.getUserOtherInfo('queryBaseUserInfo',function(res){
                     try{
                         var groupId = "kefu_"+res.data.memberId;
                         oCustomer.searchSessionList(groupId,start,end);

                     }catch(e){
                         alert('queryBaseUserInfo获取memberId失败');
                     }
                 },this.tel) : oCustomer.searchSessionList('',start,end);
             },
             reset:function (){
                 this.activeBtn=0;
                 $('.search-session .Wdate').eq(0).val("");
                 $('.search-session .Wdate').eq(1).val("");
                 this.tel= "";
                 v_chatbody.msgmask = !0;
                 v_customerlist.mouseWheelTag = 1;
                 oCustomer.showSessionList();
             }
         },
         template:require('cschatroom/searchsession.vue')
     });
     //头部
     window.v_head = new Vue({
        el: '#head',
        data: {
            head: oCustomer.head,
            msgNum: !1,
            lineNum:0,
            status:0
        }
    });
     //坐席列表
     window.v_customerlist = new Vue({
        el: '#sidelist',
        data: {
            lastSession: oCustomer.laster,//最近客户列表
            currents: oCustomer.currentls,//当前客户列表
            type: 0,//客户类型
            mouseWheelTag:1,
            hasResult:true
        },
        methods:{
            click:oCustomer.click
        },
        beforeUpdate:function () {
            $.isEmptyObject(oCustomer.current) ? v_chatbody.msgmask=!0 : v_chatbody.msgmask=!1;
        },
        updated:factory.curlistUp,
        computed: {
            show: factory.computShow
        }
    });
     //聊天面板
     window.v_chatbody = new Vue({
        el:'#chatbody',
        data:{
            type:0,
            tabType:0,
            historys: oCustomer.historyls,//历史客户列表
            msgmask:!0,
            messages:oMsg.msgQueue
        },
        methods:{
           
        },
         mounted:factory.chatBodyMounted
    });
     //历史消息弹框
     window.v_historymsg = new Vue({
        el:'#historymsg',
        data:{
            msgs:oMsg.lastHisMsg,
            name:'',
            groupId:'',
            avatarUrl:''
        },
        mounted:factory.hisMsgToastMounted
    });
     //新闻公告滚动
     window.v_marquee = new Vue({
         el:'#marquee',
         data:{
             news:[]
         },
         mounted:function () {
             factory.scrollNews();
             var _self = this;
             var marqueeTimer = setInterval(factory.scrollNews,60000)
         }
     });
     //init
     csPublic.init();
})(function(){
    function curlistUp(val, oldVal) {
        //如果当前聊天用户断线
        var c = this.currents;
        var onlineNum = 0;
        for (var i = 0; i < c.length; i++) {
            if (c[i].newMsgCount>0) {
                onlineNum++;
            }
        }
        v_head.msgNum = !!onlineNum && (oCustomer.type==1);
        if(onlineNum == 0){
            csPublic.titleStop = true;
            $(window.top.document).find('title').html('在线客服');
        }else{
            csPublic.titleStop = false;
            $(window.top.document).find('title').html(onlineNum + '人:' + '未读消息客户');
            csPublic.scrollTitle();
        }
    }
    function computShow() {
        if (this.type == 0) {
            return this.currents.length <= 0;
        } else {
            return false;
        }
    }
     // 右侧tab栏点击客户信息
    function userInfoc () {
        v_chatbody.tabType=0;
    }
     // 发送消息失败重新发送消息
    function errorMsg (index) {
        oMsg.msgQueue[index].msgStatus = 2;
        var msgc = oMsg.msgQueue[index].msgContent;
        if(msgc.msgType==2) return;//IE9图片没法再取
        var msgContent = oMsg.getFormatMsg(msgc.content);
        msgContent = JSON.stringify(msgContent);
        oMsg.sendMsg(msgContent,oMsg.msgQueue[index]);
    }
     // tab 栏点击知识库
    function kownledgec () {
        v_chatbody.tabType = 2;
    }
     // 快捷语 展示/收起
    function quickList ($event) {
        $event.stopPropagation();
        $(".shotls").toggle();
        this.shortCutType = 0;
        oServer.getShortCut.apply(this);
    }
     //点击快捷语
    function getOneQuick (e,cut) {
        cut = cut.value || cut.content;
        e.stopPropagation();
        $(".shotls").hide();
        $('#sendingmsg').html($('#sendingmsg').html()+cut);
    }
     //hover 快捷语显示完整
    function detailcon ($event,cut) {
        var value = cut.value || cut.content;
        value.length>22 && $('.detailcon').show().html(value);
    }
     // 向输入框粘贴文字
    function paste ($event) {
        $event.preventDefault();
        var text = null;

        if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = ($event.originalEvent || $event).clipboardData.getData('text/plain') || prompt('在这里输入文本');
        }
        if (document.body.createTextRange) {
            if (document.selection) {
                textRange = document.selection.createRange();
            } else if (window.getSelection) {
                sel = window.getSelection();
                var range = sel.getRangeAt(0);

                // 创建临时元素，使得TextRange可以移动到正确的位置
                var tempEl = document.createElement("span");
                tempEl.innerHTML = "&#FEFF;";
                range.deleteContents();
                range.insertNode(tempEl);
                textRange = document.body.createTextRange();
                textRange.moveToElementText(tempEl);
                tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        } else {
            // Chrome之类浏览器
            document.execCommand("insertText", false, text);
        }
    }
     // 同类表情翻页
     function pageChange ($event) {
         this.nthtype = $($event.currentTarget).data('nth');
         $($event.currentTarget).css('backgroundImage', 'url(#resourcePrefix#/img/cschatroom/dyuan.png)').siblings().css('backgroundImage', 'url(#resourcePrefix#/img/cschatroom/yuan.png)');
         this.emojitrans()
     }
     // 表情类型变化
     function emojiTypeC ($event) {
         var i = $($event.currentTarget).data('type');
         $('.mask').removeClass().addClass('mask emotype' + i);
         $($event.currentTarget).addClass("current").siblings("li").removeClass("current");
         $('.ddd ul li:first').css('backgroundImage', 'url(#resourcePrefix#/img/cschatroom/dyuan.png)').siblings().css('backgroundImage', 'url(#resourcePrefix#/img/cschatroom/yuan.png)')
         this.emojitype = $($event.currentTarget).data('type');
         this.nthtype = 0;
         this.emojitrans();
     }
     // 表情解析
     function emojitrans() {
         _self = this;
         $ ( '.emtions span' ).each ( function ( i, dom ) {
             $ (dom).html ( '' );
             if ( csPublic.emo[ _self.emojitype ][ _self.nthtype * 50 + i ] ) {
                 dom.innerHTML = csPublic.emo[ _self.emojitype ][ _self.nthtype * 50 + i ]
             }
         } );
         csPublic.emojiParse($('.emtions')[0]);
     }

     // enter 知识库搜索
    function kownledgeSearch () {
        var key = this.question;
        _self = this;
        $.ajax({
            url:'{{robotKnowledgeSearchApi}}',
            type:'post',
            data:{
                agentId:oServer.agentId,
                // agentId:'1',
                question:this.question
            },
            // crossDomain:true,
             dataType:'json',
            success:function (res) {
                if(csPublic.isError(res)) return;
                var result = res.data.knowledgeList;
                if(result == null || result.length==0){
                    _self.type = 'noresult';
                    $('.noresult p span').html(_self.question);
                    //_self.noQuestion = _self.question.slice(0);
                    return;
                }
                _self.type = 'result';
                for(var i=0; i<result.length; i++){
                    result[i].knowledge = result[i].knowledge.replace(key,function (word) {
                        return '<span style="color: red">'+word+'</span>'
                    });
                }
                _self.result = result;
            }

        })
    }
     // 进入知识库问题答案
     function answerDetail (url) {
         this.type = 'detail';
         this.detailUrl = url+'&aaa='+Math.random();
         var h = parseInt($('#kownledge').css('height'))-parseInt($('#searchBar').css('height'))-41;
         $('.resultdetail iframe').css('height',h+'px');
     }
     // 返回搜索问题
     function backQuestion () {
         this.type = 'result';
     }
     // 复制问题答案
     function copyKownLedgeAnswer () {
         if(oCustomer.type ==1) return;
         var $answer = $(window.frames["resultdetail"].document).find(".article-content");
         if(!$answer[0]) return;
         selectText($answer);
     }
     // Format answer content
     function selectText ($dom) {
         var $childP = $dom.find('p');
         if($childP.length>0){
             for(var i=0;i<$childP.length;i++){
                 selectText($childP.eq(i));
             }
         }else {
             if(!!$.trim($dom.text())){
                 $('#sendingmsg').html($('#sendingmsg').html()+"<p>"+$dom.text()+"</p>");
             }
         }
     }
     // 聊天消息查看大图
     function bigImg (msgId) {
         $('#bigimg .gallerys').html("");
         var loadImgNum=0,imgNum=0;
         $.ajax({
             type:'post',
             url:'{{getAllPictureApi}}',
             dataType:'json',
             data:{
                 groupId:oCustomer.current.sessionId ? '': oCustomer.current.groupId,
                 sessionId:oCustomer.current.sessionId,
                 isLastSession:oCustomer.current.sessionId ? false : true
             },
             success:function (data) {
                 if( !!data.error.returnCode || !data.data || data.data.length == 0){
                     alert(data.error.returnMessage);
                     return;
                 }
                 imgNum = data.data.length;
                 for(var i =0 ;i <data.data.length ; i++ ){
                     var img = '<img class="gallery-pic" src="'+JSON.parse(data.data[i].url).big_url+'" msg-id="'+data.data[i].msgId+'" onclick="$.openPhotoGallery(this)" >';
                     $('#bigimg .gallerys').append(img);
                     var image = new Image();
                     image.src = JSON.parse(data.data[i].url).big_url;
                     image.onload = function () {
                         loadImgNum++;
                         if(loadImgNum == imgNum){
                             $('[msg-id='+msgId+']').click();
                             $('#bigimg').show();

                         }
                     }
                 }
             },
             error:function () {
                 alert(" getAllPictureApi 请求错误 ");
             },
             complete:function () {

             }
         });
     }
     // 输入框展开
     function extendedUp () {
         this.extendTag = 1;
         $('#chatlog').css('height','60%');
         $('#inputpanel').css('height','40%');
         $('.extended').html('&or;');
     }
     // 输入框折叠
     function extendedDown () {
         this.extendTag = 0;
         $('#chatlog').css('height','81%');
         $('#inputpanel').css('height','18%');
         $('.extended').html('&and;');
     }
     // 搜索框 挂载
     function klgmounted () {
         $(function(){
             var $searchBar = $('#searchBar'),
                 $searchResult = $('#searchResult'),
                 $searchText = $('#searchText'),
                 $searchInput = $('#searchInput');

             function hideSearchResult(){
                 $searchResult.hide();
                 $searchInput.val('');
             }
             function cancelSearch(){
                 hideSearchResult();
                 $searchBar.removeClass('weui-search-bar_focusing');
                 $searchText.show();
             }

             $searchText.on('click', function(){
                 $searchBar.addClass('weui-search-bar_focusing');
                 $searchInput.focus();
             });
             $searchInput
                 .on('blur', function () {
                     if(!this.value.length) cancelSearch();
                 })
                 .on('input', function(){
                     if(this.value.length) {
                         $searchResult.show();
                     } else {
                         $searchResult.hide();
                     }
                 });
         });
     }
     // 聊天面板 挂载
     function chatpanelMounted () {
         $(function () {//加载历史消息
             var timer = null;
             $('#chatlog').on('mousewheel', function (event) {
                 if(v_customerlist.type==1) return;
                 var istop = $('#chatlog').scrollTop() == 0 && event.deltaY > 0;
                 if (istop) {
                     $('#chatlog .loading-warp').css('marginTop', '0px');
                     window.clearTimeout(timer);
                     if(!oMsg.msgQueue && !oMsg.msgQueue[0]) return;
                     timer = setTimeout(function () {
                         oMsg.upMsgLs({
                                 lastMsgId: oMsg.msgQueue[0].msgId,
                                 chatType: oMsg.msgQueue[0].chatType,
                                 direction: 1,
                                 size: oMsg.addSize,
                                 groupId: oCustomer.current.groupId
                             },
                             "{{getCurrSessionMsgsApi}}",
                             function (arrMsg) {
                                 v_chatbody.messages = oMsg.msgQueue = csPublic.arrUnique(arrMsg.concat(oMsg.msgQueue),'recordId');
                                 csPublic.refreshText('#chatpanel', '消息加载成功');
                             }
                         );
                     }, 1000);
                 }
             });

         });
     }
     // chatbody 挂载
     function chatBodyMounted (  ) {
         $(function () {//拉取会话记录
             var timer = null;
             $('#history .cscontainer').on('mousewheel', function (event) {
                 if(v_customerlist.mouseWheelTag == 0) return;
                 var istop = $('#history .cscontainer').scrollTop() == 0 && event.deltaY > 0;
                 if (istop) {
                     $('#history .loading-warp').css('marginTop', '0px');
                     window.clearTimeout(timer);
                     timer = setTimeout(function () {
                         oCustomer.getSessionlist();
                     }, 1000);
                 }
             });
         });
     }
     // 历史消息toast 挂载
     function hisMsgToastMounted () {
         $(function () {//加载历史消息
             var timer = null;
             $('.historymsg').on('mousewheel', function (event) {
                 if(oMsg.historyMsgTag == 1) return;
                 var istop = $('.historymsg').scrollTop() == 0 && event.deltaY > 0;
                 if (istop) {
                     $('.historymsg .loading-warp').css('marginTop', '0px');
                     window.clearTimeout(timer);

                     timer = setTimeout(function () {
                         oMsg.upMsgLs({
                                 lastMsgId: oMsg.lastHisMsg[0].msgId,
                                 senderType: oMsg.lastHisMsg[0].senderType,
                                 direction: 1,
                                 size: oMsg.addSize,
                                 groupId: v_historymsg.groupId
                             },
                             '{{getMsgLsitApi}}',
                             function (arrMsg) {
                                 for(var i=0;i<arrMsg.length;i++){
                                     if(arrMsg[i].senderType == 1){
                                         arrMsg[i].avatarUrl = v_historymsg.avatarUrl;
                                     }
                                 }
                                 v_historymsg.msgs = oMsg.lastHisMsg= csPublic.arrUnique(arrMsg.concat(oMsg.lastHisMsg),'recordId');
                                 csPublic.refreshText('.historymsg', '消息加载成功');
                             }
                         );
                     }, 1000);
                 }
             });

         });
     }
     // 输入框 挂载
     function inputpanelMounted () {
         $(function () {
             var I,
                 recordId,
                 customer;
             $('#fileToUpload').fileupload({
                     url: '{{upLoadApi}}',
                     sequentialUploads: true,
                     dataType: 'json'
                 })
                 .bind('fileuploadsend', function (e, d) {
                     $('#fileToUpload').hide();
                     $('.picloading').show();
                     d = d.result;
                     oMsg.msgQueue.push({
                         msgId: '',
                         msgTime: +new Date(),
                         senderType: 2, // 系统消息，客户，客服
                         avatarUrl: oServer.avatarUrl,
                         msgContent: {
                             msgType: 2, // 消息类型；1=文本；2=图片；3=链接；
                             content: "#resourcePrefix#/img/cschatroom/ing.jpg", // 消息内容
                             action: '', // 处理方式
                             ext: '', // 扩展字段
                             width: 75,
                             height: 75,
                             bigUrl: "#resourcePrefix#/img/cschatroom/ing.jpg",
                             smallUrl: "#resourcePrefix#/img/cschatroom/ing.jpg"
                         },
                         recordId: oMsg.computeRecordId(oMsg.msgQueue[oMsg.msgQueue.length - 1].recordId),
                         msgStatus: 2
                     });
                     oMsg.scrollBottom('.chatlog');

                     customer = oCustomer.current;
                     recordId = oMsg.msgQueue[oMsg.msgQueue.length - 1].recordId;
                 })
                 .bind('fileuploaddone', function (e, d) {
                     I = csPublic.objFindByKey(oMsg.msgQueue, 'recordId', recordId);
                     d = d.result;
                     if (d.error.returnCode != 0) {
                         I > 0 && oMsg.msgQueue.splice(I, 1);//发送消息撤回
                         alert('发给'+customer.name+'的图片失败'+'原因：'+d.error.returnMessage);
                         return;
                     }
                     if (I > 0) {
                         oMsg.msgQueue[I].msgContent.content = d.data.showThumbUrl;
                         oMsg.msgQueue[I].msgContent.bigUrl = d.data.showUrl;
                         oMsg.msgQueue[I].msgContent.smallUrl = d.data.showThumbUrl;
                         oMsg.msgQueue[I].msgStatus = 0;
                     }
                     var msgObj = I > 0 ? oMsg.msgQueue[I] : {
                         recordId: recordId
                     };
                     oMsg.sendMsg(oMsg.picContent(d), msgObj, customer.memberId, customer.groupId);
                     customer.msgContent  = {
                         msgType: '2',// 消息类型；1=文本；2=图片；3=链接；
                         content: '',// 消息内容
                         action: '',// 处理方式
                         ext: ''// 扩展字段
                     };
                     customer.msgTime = +new Date();

                 })
                 .bind('fileuploadfail', function (e, d) {
                     I > 0 && (oMsg.msgQueue[I].msgStatus = 1);
                 })
                 .bind('fileuploadalways', function (e, d) {
                     $('#fileToUpload').show();
                     $('.picloading').hide();
                 })
         });
     }
     // 获取系统快捷语
     function getSystemCut ($event) {
         $event.stopPropagation();
         this.shortCutType = 0;
         this.shortcut = oMsg.shortCut=[];
         oServer.getShortCut.apply(this);
     }
     // 获取个人快捷语
     function getPersonCut ($event) {
         $event.stopPropagation();
         this.shortCutType = 1;
         this.shortcut = oMsg.shortCut=[];
         oServer.getPersonCut.apply(this);
     }
     // 显示客服状态list
     function showList(){
         this.listDisplay = 1;
     }
     // 隐藏客服显示列表
     function hideList(){
         this.listDisplay = 0;
     }
     //rightSide 挂载
     function rightSideMounted () {
         $(function () {//拉取历史坐席列表
             var cstatu = $('.customer-ls .text'),
                 timer = null;
             $('#last').on('mousewheel', function (event) {
                 if(v_chatbody.tabType != 1) return;
                 var istop = $('#last').scrollTop() == 0 && event.deltaY > 0;
                 if (istop) {
                     $('#last .loading-warp').css('marginTop', '0px');
                     window.clearTimeout(timer);
                     timer = setTimeout(function () {
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
                                 customerlist = res.data.msgList;
                                 if (customerlist == null || customerlist.length == 0) {
                                     csPublic.refreshText('#last','没有更多了');
                                     return;
                                 }
                                 oCustomer.historypage++;
                                 oCustomer.uphistory(customerlist);
                                 csPublic.refreshText('#last','历史客户加载成功');
                             },
                             error: function () {
                                 csPublic.refreshText('#sidelist','历史客户加载失败');
                             }
                         });
                     }, 1000);
                 }
             });
         });
     }
     // 表情 展示/收起
     function emoc ($event) {
         $event.stopPropagation();
         $(".emtions").toggle();
         $('.mask').removeClass().addClass('mask emotype0');
         var oIndex = $('.categroys ul li.current').index();
         $('.categroys ul li').eq(oIndex).addClass("current");
         $('.mask').removeClass().addClass('mask emotype' + oIndex);
     }
     // 点击表情,加入输入框
     function selectEmoji ($event) {
         $(".emtions").hide();
         try{
             restoreSelection(this.range);
             var url = $event.target.src;
             document.execCommand('InsertImage',false,url);
             restoreSelection(getSelection().getRangeAt(0));
             this.range = getSelection().getRangeAt(0);
         }catch(e){
             
         }
     }
     //恢复选区
     function restoreSelection (thisRange){
         var selection = getSelection();
         if(!thisRange){
             $('#sendingmsg').focus();
             thisRange = getSelection().getRangeAt(0);
         }
         thisRange.collapse(false);
         selection.removeAllRanges();
         selection.addRange(thisRange);
     }
     //保存选区
     function saveSelection(){
         var selection = window.getSelection();
         this.range = selection.getRangeAt(0).cloneRange();
     }
     //滚动新闻
     function scrollNews() {
         $.ajax({
             url:'{{personalUnreadNewsApi}}',
             type:'post',
             dataType:'json',
             data:{
                 limit:10,
                 start:0
             },
             success:function ( res ) {
                 try{
                     v_marquee.news=res.data.data;
                 }catch(e){};

             }
         })
     }
    return  {
        userInfoc:userInfoc,
        curlistUp:curlistUp,
        computShow:computShow,
        errorMsg:errorMsg,
        kownledgec:kownledgec,
        getOneQuick:getOneQuick,
        quickList:quickList,
        detailcon:detailcon,
        paste:paste,
        pageChange:pageChange,
        emojiTypeC:emojiTypeC,
        emojitrans:emojitrans,
        emoc:emoc,
        selectEmoji:selectEmoji,
        kownledgeSearch:kownledgeSearch,
        answerDetail:answerDetail,
        backQuestion:backQuestion,
        copyKownLedgeAnswer:copyKownLedgeAnswer,
        bigImg:bigImg,
        extendedUp:extendedUp,
        extendedDown:extendedDown,
        getSystemCut:getSystemCut,
        getPersonCut:getPersonCut,
        showList:showList,
        hideList:hideList,
        saveSelection:saveSelection,
        scrollNews:scrollNews,
        klgmounted:klgmounted,
        chatpanelMounted:chatpanelMounted,
        chatBodyMounted:chatBodyMounted,
        hisMsgToastMounted:hisMsgToastMounted,
        inputpanelMounted:inputpanelMounted,
        rightSideMounted:rightSideMounted
    };
}(),oMsg,oCustomer,oServer,csPublic,$);
