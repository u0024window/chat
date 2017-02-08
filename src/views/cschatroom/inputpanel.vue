<div>
	<div class="toolbar">
		<div class="emo" @click="emoc($event)"></div>
		<div class="picload">
			<input id="fileToUpload" type="file" class="uploader_input" name="file" multiple data-sequential-uploads="true" data-form-data=\'{"script": "true"}\' accept="image/jpg,image/jpeg,image/png">
		</div>
		<div class="picmask"></div>
		<div class="shortcut" id="shortcut" @click="quickList($event)">
			<div class="shotls">
				<div class="fix">
					<div class="person-null" v-show="person && shortCutType==1">您没有设置个人快捷语</div>
					<ul>
						<li v-for="(item,index) in shortcut" @click="getOneQuick($event,item)" @mouseenter="detailcon($event,item)" @mouseout="mouseout">{{item | wordBreak}}</li>
					</ul>
				</div>
				<div class="set">
					<span class="system" :class="shortCutType==0 && \'selected\'" @click="systemc($event)">系统</span>
					<span class="person" :class="shortCutType==1 && \'selected\'" @click="personc($event)">个人</span>
				</div>
			</div>
		</div>
		<div class="detailcon"></div>
		 <div class="picloading"></div>
		<emoji :range="range"></emoji>
		<div class="extended" @click="extended">&and;</div>
	</div>

	<div contenteditable="plaintext-only" class="inputmsg" @keydown.enter="sendMessage($event)" id="sendingmsg" @paste="paste($event)" @click="inputC" @keyup="inputKeyUp"></div>
	<div class="send" @click="sendMessage($event)">发送</div>
</div>

