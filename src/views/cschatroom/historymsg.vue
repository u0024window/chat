<div class="bdy">
	<div class="title">
		<div><span :data-groupid="groupId">{{name}}</span></div>
		<div class="date-select">
			<span>从</span>
			<input type="text" class="Wdate" onclick="WdatePicker({isShowClear:false,position:{left:-3}})" readOnly="true"/>
			<span>到</span>
			<input type="text" class="Wdate" onclick="WdatePicker({isShowClear:false,position:{left:-3}})" readOnly="true"/>
			<span class="search" @click="searchByDate(groupId)">确定</span>
		</div>
		<div class="close" @click="close"></div>
	</div>
	<div class="historymsg cscontainer">
		<mousewheel v-once></mousewheel>
		<chatmsg v-for="(msg,index) in msgs" :msg="msg" :index="index" type="2"></chatmsg>
	</div>
</div>
