<div class="chatpanel" id="chatpanel">
	<div class="chatlog cscontainer" id="chatlog">
		<mousewheel v-once></mousewheel>
		<chatmsg v-for="(msg,index) in messages" :msg="msg" :index="index" :type="type"></chatmsg>
	</div>
	<div class="inputpanel" id="inputpanel">
		<inputpanel></inputpanel>
		<div id="maskChatInput"></div>
	</div>
</div>
