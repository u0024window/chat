<div class="customer-li" @click="getHisMsg(msgitem)">
	<div class="usimg"><img :src="msgitem.avatarUrl" alt=""></div>
		<span class="name">{{msgitem.name ? msgitem.name : msgitem.mobile}}
			<span>{{msgitem.msgTime | timeFilter}}</span>
		</span>
</div>
