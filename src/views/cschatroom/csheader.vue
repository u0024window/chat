<div style="height:100%">
<div class="hd-left">
    <div class="listbtn">
        <div class="cur_customer" @click="showCur">
            <span v-if="msgNum"></span>
        </div>
        <div class="history-btn csbtnshow" @click="lastHistoryc">
        </div>
    </div>
    <div class="kefu-status" @click="stClick">
        <div :class="stStyle"></div>
        <ul v-show="!!listDisplay" >
            <li class="online"  @click="changeSt(1)"></li>
            <li class="busy"  @click="changeSt(2)"></li>
            <li class="outline"  @click="changeSt(0)"></li>
        </ul>
    </div>

</div>
<div class="hd-right">
    <div class="customerinfo">
        <div><img :src="head.avatar_url" alt=""></div>
        <span>{{head.name}}</span>
    </div>
    <div class="line-up" v-show="status !=0">当前排队用户数:{{lineNum}}人</div>
    <div class="closelj" @click="close"></div>
</div>
</div>
