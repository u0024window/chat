<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<title>历史消息</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<!-- build:css [cssBuildPath] -->
	<link rel="stylesheet" href="/css/cschatroom/historymsg.css">
	<!-- endbuild -->
</head>

<body id="chatroom">
	<div id="historymsg">
		<historymsg :group-id="groupId" :name="name" :avatar-url="avatarUrl" :msgs="msgs"></historymsg>
	</div>
	<div id="csloading"><img src="#resourcePrefix#/img/cschatroom/csloading.gif" alt=""></div>
	<div id="bigimg"><img src="#resourcePrefix#/img/cschatroom/ing.jpg" alt=""></div>
	<!-- build:js [jsBuildPath] -->
	<script type="text/javascript" src="/jquery/dist/jquery.js"></script>
	<script type="text/javascript" src="/js/common/jquery-all.js"></script >
	<script type="text/javascript" src="/vue/dist/vue.js"></script>
	<script type="text/javascript" src="/js/common/twemoji.min.js"></script>
	<script type="text/javascript" src="/js/common/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="/js/common/js.cookie.js"></script>
	<script type="text/javascript" src="/js/common/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="/js/cschatroom/csconfig.js"></script>
	<script type="text/javascript" src="/js/cschatroom/omsg.js"></script>
	<script type="text/javascript" src="/js/cschatroom/ocustomer.js"></script>
	<script type="text/javascript" src="/js/cschatroom/oserver.js"></script>
	<script type="text/javascript" src="/js/cschatroom/csfilter.js"></script>
	<script type="text/javascript" src="/js/cschatroom/addTab.js"></script>
	<script type="text/javascript" src="/js/cschatroom/historymsg.js"></script>
	<!-- endbuild -->
	<script ignore="true" type="text/javascript" src="/app/imview/js/cschatroom/My97DatePicker/WdatePicker.js"></script>
</body>

</html>
