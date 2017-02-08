<div>
    <div class="weui-search-bar" id="searchBar">
        <div class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="" @keyup.enter="search" v-model.trim="question">
                <!--<a href="javascript:" class="weui-icon-clear" id="searchClear"></a>-->
            </div>
            <label class="weui-search-bar__label" id="searchText" style="transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1);">
                <i class="weui-icon-search"></i>
                <span>搜索</span>
            </label>
        </div>
    </div>
    <div id="result" v-show="type !=\'no\'">
        <div v-show="type.search(\'result\')>-1">
            <h4>搜索结果</h4>
            <ul v-show="type==\'result\'">
                <li v-for="(item,index) in result"><a href="javascript:;" v-html="(index*1+1)+\'.\'+item.knowledge" @click="answerDetail(item.detailUrl)"></a></li>
            </ul>
            <!--无搜索结果-->
            <div v-show="type==\'noresult\'" class="noresult">
                <p>没有搜索到"<span style="color: red"></span>"相关知识</p>
            </div>
        </div>
        <div class="resultdetail" v-show="type==\'detail\'">
            <div>
                <span @click="backQuestion">返回</span>
                <span @click="copyKownLedgeAnswer">复制</span>
            </div>
            <iframe :src="detailUrl" frameborder="0" id="resultdetail" name="resultdetail"></iframe>
        </div>

    </div>
</div>
