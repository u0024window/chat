<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<title>在线客服</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<!-- build:css [cssBuildPath] -->
	<link rel="stylesheet" href="/css/common/base.css">
	<link rel="stylesheet" href="/sass/cschatroom/cs.scss">
	<link rel="stylesheet" href="/sass/cschatroom/toast.scss">
	<link rel="stylesheet" href="/sass/cschatroom/csheader.scss">
	<link rel="stylesheet" href="/sass/cschatroom/customerli.scss">
	<link rel="stylesheet" href="/sass/cschatroom/listbtn.scss">
	<link rel="stylesheet" href="/sass/cschatroom/userinfo.scss">
	<link rel="stylesheet" href="/sass/cschatroom/switch.scss">
	<link rel="stylesheet" href="/sass/cschatroom/chatmsg.scss">
	<link rel="stylesheet" href="/sass/cschatroom/inputpanel.scss">
	<link rel="stylesheet" href="/sass/cschatroom/historymsg.scss">
	<link rel="stylesheet" href="/sass/cschatroom/kownledge.scss">
	<link rel="stylesheet" href="/sass/cschatroom/searchsession.scss">
	<!-- endbuild -->
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/bootstrap-v3.0/css/bootstrap.min.css">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/style/standard/css/eccrm-common-new.css">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/zTree/css/ztree.css">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/angular-motion-v0.3.2/angular-motion.css">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/bootstrap-select/css/bootstrap-select.min.css">
</head>

<body id="chatroom">
	<header id="head">
		<cs-header :head='head' :msg-num='msgNum' :line-num="lineNum" :status='status'></cs-header>
	</header>
	<div class="sidelist " id="sidelist">
		<div id="history">
			<search-session></search-session>
			<div class="cscontainer">
				<mousewheel v-once></mousewheel>
				<customer-li v-for="(customer,index) in lastSession" :msgitem='customer' @click.native="click(index,$event)" type='1'></customer-li>
				<div class="no-session" v-show="!hasResult">
					<p>没有查询到会话!</p>
				</div>
			</div>
		</div>
		<div id="current">
			<customer-li v-for="(customer,index) in currents" :msgitem='customer' @click.native="click(index,$event)" type='0'></customer-li>
		</div>
		<div class="cmask" id="nosession1" v-show="show">
			<p>暂无会话</p>
		</div>
	</div>
	<div class="chatbody" id="chatbody">
		<chatpanel :messages="messages" :type="type"></chatpanel>
		<rightside :historys="historys" :type="tabType"></rightside>
		<div class="msgmask" v-show="msgmask">
			<p>未选择会话</p>
		</div>
	</div>
	<div id="historymsg">
		<historymsg :group-id="groupId" :name="name" :avatar-url="avatarUrl" :msgs="msgs"></historymsg>
	</div>
	<div id="csloading"><img src="#resourcePrefix#/img/cschatroom/csloading.gif" alt=""></div>
    <div id="bigimg">
        <div class="gallerys" style="display: none"></div>
    </div>
	<marquee behavior="scroll" direction="left" id="marquee" scrollamount="5">
		<span v-for="item in news">
			<span v-html="'【'+item.categoryName+'】'"></span>
			<span v-html="item.title"></span>
		</span>
	</marquee>
	<!-- build:js [jsBuildPath] -->
	<script type="text/javascript" src="/jquery/dist/jquery.js"></script>
	<script type="text/javascript" src="/js/common/jquery-all.js"></script >
	<script type="text/javascript" src="/js/common/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="/js/common/jquery.iframe-transport.js"></script>
	<script type="text/javascript" src="/js/common/jquery.fileupload.js"></script>
	<script type="text/javascript" src="/vue/dist/vue.js"></script>
	<script type="text/javascript" src="/js/common/twemoji.min.js"></script>
	<script type="text/javascript" src="/js/common/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="/js/common/js.cookie.js"></script>
	<script type="text/javascript" src="/js/common/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="/js/common/toast.js"></script>
	<script type="text/javascript" src="/js/common/dateFormat.js"></script>
	<script type="text/javascript" src="/js/cschatroom/csconfig.js"></script>
	<script type="text/javascript" src="/js/cschatroom/omsg.js"></script>
	<script type="text/javascript" src="/js/cschatroom/ocustomer.js"></script>
	<script type="text/javascript" src="/js/cschatroom/oserver.js"></script>
	<script type="text/javascript" src="/js/cschatroom/csfilter.js"></script>
	<script type="text/javascript" src="/js/cschatroom/addTab.js"></script>
	<script type="text/javascript" src="/js/cschatroom/app.js"></script>
	<script type="text/javascript" src="/js/cschatroom/chatmsg.js"></script>

	<!-- endbuild -->
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/static/ycrl/javascript/angular-all.js" ></script >
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/static/ycrl/javascript/angular-strap-all.js" ></script >

	<script ignore="true" src="/app/imview/js/cschatroom/cschatroom.js"></script>
	<script ignore="true" type="text/javascript" src="/app/imview/js/cschatroom/My97DatePicker/WdatePicker.js"></script>
    <script ignore="true" type="text/javascript" src="/app/imview/js/cschatroom/jquery-photo-gallery/jquery.photo.gallery.js"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/vendor/bootstrap-v3.0/js/bootstrap.min.js" ></script >
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/vendor/bootstrap-select/js/bootstrap-select.min.js" ></script >
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/workOrder.js"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/screen/service/userInfo.js"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/imdcsBase.js" ></script >
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/edit/workOrder_quick_add.js" ></script >
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/screen/service/customerFile.js"></script>

</body>

</html>
