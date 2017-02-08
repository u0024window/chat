<div class="rightside" id="rightside">
	<div>
		<span :class=" type==0 && \'b-b\' " @click="userInfoc">客户信息</span>
		<span :class=" type==1 && \'b-b\' " class="last-history" @click="showHistory">历史会话</span>
		<span :class=" type==2 && \'b-b\' " @click="kownledgec">知识库</span>
	</div>
	<div class="tab-info">
		<section id="last" class="last cscontainer" v-show="type==1">
			<mousewheel v-once></mousewheel>
			<lastSession v-for="customer in historys" :msgitem="customer"></lastSession>
		</section>
		<section id="userinfo" v-show="type==0">
			<right-userinfo></right-userinfo>
		</section>
		<section id="kownledge" v-show="type==2">
			<kownledge></kownledge>
		</section>
	</div>
</div>
