<div class="customer-li" :groupid="msgitem.groupId">
	<div class="usimg"><img :src="msgitem.avatarUrl" alt=""></div>
		<span class="name">{{msgitem.name ? msgitem.name : msgitem.mobile}}
			<span v-html="timeFormat(msgitem.msgTime,type)"></span>
		</span>
		<span class="question">
			<p v-html="getContent(msgitem.msgContent)"></p>
			<span v-show="msgitem.newMsgCount>0">{{msgitem.newMsgCount}}</span>
		</span>
</div>
