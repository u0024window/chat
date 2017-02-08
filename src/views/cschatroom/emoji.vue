<div class="emtions" @click.stop="emtionsc">
<div class="contianer">
	<span v-for="n in 50" :index="n" @click="selectEmoji($event)"></span>
</div>
<div class="ddd">
	<ul>
		<li v-for="n in 3" :data-nth="n-1" @click="pageChange($event)"></li>
	</ul>
</div>
<div class="categroys">
	<div class="mask"></div>
	<ul>
		<li v-for="n in 8" :data-type="n-1" :class=" n==1 && \'current\' " @click="emojiTypeC($event)"></li>
	</ul>
</div>
</div>
