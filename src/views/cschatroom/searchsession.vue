<div class="search-session">
	<div>
		<label for="tel">注册号码:</label><input type="number" v-model.number="tel" id="tel">
	</div>
	<div>
		<label for="startSessionDate">日期:</label><input type="text"  class="Wdate" onclick="WdatePicker({isShowClear:false,position:{left:-3}})" id="startSessionDate" readOnly placeholder="选择日期">
		<label for="endSessionDate">到</label><input type="text" class="Wdate" onclick="WdatePicker({isShowClear:false,position:{left:-3}})" id="endSessionDate" readOnly placeholder="选择日期">
	</div>
	<div>
		<span @click="reset" :class="activeBtn==0 && \'active-btn\'">重置</span>
		<span @click="searchSessionLs" :class="activeBtn==1 && \'active-btn\'">查询</span>
	</div>
</div>

