(function(){
	//鼠标滚动加载模板
	Vue.component('mousewheel',{
		template: require('cschatroom/mousewheel.vue')
	});
	//消息cell
	Vue.component('chatmsg', {
		props: ['msg','index','type'],
		template: require('cschatroom/chatmsg.vue'),
		methods:{
			bigImg:  function(msgId) {
				var startTime =$('.Wdate').eq(0).val() ? $('.Wdate').eq(0).val()+ ' 00:00:00' :'';
                var endTime = $('.Wdate').eq(1).val()?  $('.Wdate').eq(1).val()+ " 23:59:59" : '';
                var loadImgNum=0,imgNum=0;
                $('#bigimg .gallerys').html("");

                $.ajax({
                    type:'post',
                    url:'{{getAllPictureApi}}',
                    dataType:'json',
                    data:{
                        groupId: v_historymsg.groupId,
                        isLastSession: false,
                        startTime: startTime,
                        endTime: endTime
                    },
                    beforeSend:function () {
                       $('#csloading').show();
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
                    	setTimeout(function () {
                            $('#csloading').hide();
                        },500);

                    }
                });
            }
		},
		mounted:function () {
			csPublic.emojiParse(this.$el);
		},
		updated:function () {
			csPublic.emojiParse(this.$el);
		}
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
	//历史消息弹框
	window.v_historymsg = new Vue({
		el:'#historymsg',
		data:{
			msgs:oMsg.lastHisMsg,
			name:'',
			groupId:'',
			avatarUrl:''
		},
		mounted:function hisMsgToastMounted () {
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
			var info = oAddTab.addTab('get');
			this.msgs = oMsg.lastHisMsg = info.msgs;
			this.name = info.name;
			this.groupId = info.groupId;
			this.avatarUrl = info.avatarUrl;
			Vue.nextTick(function (){
				oMsg.scrollBottom('.historymsg');
			});
		}
	});
})();

$('#bigimg').on('click', function (e) {//大图消失
	e = e || window.event;
	e.preventDefault();
	// $(this).hide();
	// $('#bigimg img').attr('src',"#resourcePrefix#/img/cschatroom/ing.jpg")
});
$('#bigimg img').on('click', function (e) {
	e = e || window.event;
	e.stopPropagation();
});
