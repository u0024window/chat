<!--chat_type/
--系统消息 3
--客户消息 1
--客服消息 2
--机器人消息 4
----msg_type/
--文字消息 1
--图片消息 2
--链接3
-->
<div class="chatmsg" :data-recordid="msg.recordId" :data-msgid="msg.msgId" >
	<span>{{msg.msgTime | timeFilter(type)}}</span>
	<div v-if="msg.senderType==3" class="system_msg"><i>{{msg.msgContent.content}}</i></div>
	<div v-else :class="{\'customer\':msg.senderType == 1,\'server\':msg.senderType == 2 || msg.senderType == 4}">
		<div class="cs-head"><img :src="msg.avatarUrl" alt=""></div>
		<span v-if="msg.msgContent.msgType==1" v-html="msg.msgContent.content"></span>
		<div class="pic" v-else><!--="msg.msgContent.msgType==2"-->
			<img :src="msg.msgContent.smallUrl" alt="" :width="msg.msgContent.width" :height="msg.msgContent.height" @click="bigImg(msg.msgContent.bigUrl)">
		</div>
		<div class="msgload" v-if="msg.msgStatus==2"></div>
		<div class="msgerror" v-else-if="msg.msgStatus==1"  @click="errorMsg(index)"></div>
	</div>
</div>
