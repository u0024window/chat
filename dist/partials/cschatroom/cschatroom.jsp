<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<title>&#x5728;&#x7EBF;&#x5BA2;&#x670D;</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<link rel="stylesheet" href="/app/imview/css/cschatroom/cschatroom.min.css?_=20170105182148">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/bootstrap-v3.0/css/bootstrap.min.css?_=20170105182148">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/style/standard/css/eccrm-common-new.css?_=20170105182148">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/zTree/css/ztree.css?_=20170105182148">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/angular-motion-v0.3.2/angular-motion.css?_=20170105182148">
	<link ignore="true" rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/vendor/bootstrap-select/css/bootstrap-select.min.css?_=20170105182148">
</head>

<body id="chatroom">
	<header id="head">
		<cs-header :head="head" :msg-num="msgNum" :line-num="lineNum" :status="status"></cs-header>
	</header>
	<div class="sidelist " id="sidelist">
		<div id="history">
			<search-session></search-session>
			<div class="cscontainer">
				<mousewheel v-once=""></mousewheel>
				<customer-li v-for="(customer,index) in lastSession" :msgitem="customer" @click.native="click(index,$event)" type="1"></customer-li>
				<div class="no-session" v-show="!hasResult">
					<p>&#x6CA1;&#x6709;&#x67E5;&#x8BE2;&#x5230;&#x4F1A;&#x8BDD;!</p>
				</div>
			</div>
		</div>
		<div id="current">
			<customer-li v-for="(customer,index) in currents" :msgitem="customer" @click.native="click(index,$event)" type="0"></customer-li>
		</div>
		<div class="cmask" id="nosession1" v-show="show">
			<p>&#x6682;&#x65E0;&#x4F1A;&#x8BDD;</p>
		</div>
	</div>
	<div class="chatbody" id="chatbody">
		<chatpanel :messages="messages" :type="type"></chatpanel>
		<rightside :historys="historys" :type="tabType"></rightside>
		<div class="msgmask" v-show="msgmask">
			<p>&#x672A;&#x9009;&#x62E9;&#x4F1A;&#x8BDD;</p>
		</div>
	</div>
	<div id="historymsg">
		<historymsg :group-id="groupId" :name="name" :avatar-url="avatarUrl" :msgs="msgs"></historymsg>
	</div>
	<div id="csloading"><img src="/app/imview/img/cschatroom/csloading.gif" alt=""></div>
	<div id="bigimg"><img src="/app/imview/img/cschatroom/ing.jpg" alt=""></div>
	<marquee behavior="scroll" direction="left" id="marquee" scrollamount="5">
		<span v-for="item in news">
			<span v-html="&apos;&#x3010;&apos;+item.categoryName+&apos;&#x3011;&apos;"></span>
			<span v-html="item.title"></span>
		</span>
	</marquee>
	<script src="/app/imview/js/cschatroom/cschatroom.min.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/static/ycrl/javascript/angular-all.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/static/ycrl/javascript/angular-strap-all.js?_=20170105182148"></script>

	<script ignore="true" src="/app/imview/js/cschatroom/cschatroom.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="/app/imview/js/cschatroom/My97DatePicker/WdatePicker.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/vendor/bootstrap-v3.0/js/bootstrap.min.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/vendor/bootstrap-select/js/bootstrap-select.min.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/workOrder.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/screen/service/userInfo.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/imdcsBase.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/screen/service/customerFile.js?_=20170105182148"></script>
	<script ignore="true" type="text/javascript" src="<%=request.getContextPath()%>/app/workorder/edit/workOrder_quick_add.js?_=20170105182148"></script>
</body>

</html>
