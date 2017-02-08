/**
 * @下拉刷新
 * 善有部分不完善之处，后续稍稍进行扩展
 */
(function(){
	
	var isValid = false,	// 是否生效
		isTouching = false,	// 触摸中标识
		isEfec = false,	// 触摸是否生效
		isDestory = false, 	// 是否销毁
		startX, startY, disY = 0,	// 起始触摸X、y坐标， 移动Y坐标
		loadingH = 0,	// laodingEl高度
		options = {
			$el: '',	// 默认容器
			$loadingEl: null,	// 刷新提示容器
			autoHide: true,	// 自动隐藏
			url: undefined,	// 请求数据地址
			sendData: null,	// 获取下拉刷新发送数据，动态传入，使用function返回数据
			// 触发拖动像素距离(触发灵敏度),
			// 浏览器中下拉默认事件一旦触发后，就不能再通过冒泡阻止此事件。
			// chrome浏览器中大概是15PX左右的下拉后触发默认刷新，微信中大概是6像素左右。
			// 如需在微信中使用，建议设置为6像素
			startPX: 30, 	
			callbacks: {
				pullStart: null,	// 拖动开始
				start: null,	// 开始请求数据
				success: null,	// 数据请求成功
				error: null,	// 下拉流程结束
				end: null,	// 下拉流程结束
			}
		};

	var getPos = function(event){

		var pos = {
			x: event.pageX || event.clientX,
			y: event.pageY || event.clientY
		}

		return pos;
	}

	/**
	 * 重置
	 * @param Boolean isAnim 是否需要过度动画
	 */
	var reset = function(params) {
		isValid = false,	// 是否生效
		isEfec = false,	// 触摸是否生效
		startX, startY, disY = 0;
		params.$loadingEl.animate({'margin-top': -loadingH}, 0, function() {
    		isTouching = false;
    		runCb(params, 'end');
    	});
	}
	
	/**
     *下拉刷新
     */
	var touchStart = function(evt, params) {
		var scrollTop = parseInt(params.$el.scrollTop());
		
		if(scrollTop > 0) return;
		if(isDestory) return;
		if(isTouching) return;
		
		isTouching = true;
		isEfec = true;
		
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
        var touch = evt.touches[0], //获取第一个触点
			x = parseInt(touch.pageX), //页面触点X坐标
        	y = parseInt(touch.pageY); //页面触点Y坐标

        //记录触点初始位置
        startX = x;
        startY = y;
	}
	
	/**
	 * 触摸移动过程
	 */
	var touchMove = function(evt, params) {

		if(isDestory) return;
		if(!isTouching) return;
		if(!isEfec) return;

		var $loadingEl = params.$loadingEl,
        	touch = evt.touches[0], //获取第一个触点
        	x = parseInt(touch.pageX), //页面触点X坐标
        	y = parseInt(touch.pageY), //页面触点Y坐标
        	t = y - startY;			// 触摸距离

        //  距离必须大于灵敏距离触摸才生效
        if(!isValid && t > params.startPX) {
        	isValid = true;
        	runCb(params, 'pullStart');
        }
        
        if(!isValid) return;

        if(evt.preventDefault) evt.preventDefault();

        // 向上拖动
        if(t < 0){
        	$loadingEl.css('margin-top', -loadingH);
        }

        // 拖动高度未超过刷新显示容器高度
        if(t > 0 && t <= loadingH){
        	$loadingEl.css('margin-top', -(loadingH-t));
        	$loadingEl.height(loadingH);	
        } 
        // 拖动高度超过刷新显示容器高度
        else if(t > loadingH){
        	$loadingEl.css('margin-top', 0);
        	$loadingEl.height(t);
        } 

        disY = t;
	}

	/**
	 * 执行回调函数
	 */
	var runCb = function(params, name, data){
		if(params.callbacks[name]) params.callbacks[name].call(null, data);
	}

	/**
	 * 触摸结束，请求数据
	 */
	var touchEnd = function(evt, params) {

		if(isDestory) return;
		if(!isValid) return;	// 当前已生效
		if(!isTouching) return;
		if(evt.preventDefault) evt.preventDefault();

		isValid = false;
		isEfec = false;
		disY = 0;

		var $loadingEl = params.$loadingEl,
	    	touch = evt.touches[0] || evt.changedTouches[0], 	//获取第一个触点
	    	x = parseInt(touch.pageX), 	//页面触点X坐标
	    	y = parseInt(touch.pageY), 	//页面触点Y坐标
	    	t = y - startY;

	    // 拖动高度未超过刷新显示容器高度
	    if(t <= loadingH){
	    	$loadingEl.css('margin-top', -(loadingH-t));
	    	$loadingEl.height(loadingH);
	    	$loadingEl.animate({'margin-top': -loadingH}, 200, function() {
	    		isTouching = false;
	    	});
	    }
	    
	    // 拖动高度超过刷新显示容器高度
	    else if(t > loadingH) {
	    	if(params.cb) params.cb();
	    	$loadingEl.animate({'height': loadingH}, 200, function() {});
	    }

	    var sendData = $.isFunction(params.sendData) ? params.sendData() : params.sendData;

	    if(params.url){
	    	runCb(params, 'start');

	    	$.post(params.url, sendData, function(response, textStatus, xhr) {
	        	runCb(params, 'success', response);
	        	if(params.autoHide) reset(params);
	        }).error(function(){
	        	runCb(params, 'error');
	        	if(params.autoHide) reset(params);
	        });
	    } else {
	    	if(params.callbacks)
	    	reset(params);
	    }
	}
	
	/**
	 * 设置是否销毁
	 */
	var setDestroy = function(destroy){
		isDestory = destroy || false;
	}

	/**
	 * 初始化
	 *   定义loading容器高度
	 *   绑定处理事件
	 */
	var initlize = function(params) {
		loadingH = params.$loadingEl.height();

		$el = params.$el;
	    $el[0].addEventListener('touchstart', function(e) {
			touchStart(e, params);
		}, false);
	   	$el[0].addEventListener('touchmove', function(e) {
			   touchMove(e, params);
		}, false);
	    $el[0].addEventListener('touchend', function(e) {
			touchEnd(e, params);
		}, false);
	}

    var pullDown = function(params){
    	initlize(params);

    	return {
    		reset: reset,
    		setDestroy: setDestroy
    	}
    }

    $.pPullRefresh = function(settings){
    	$.extend(true, options, (settings || {}));
    	options.$el = options.$el || $('body');
		var params = $.extend(true, {}, options);
    	return pullDown(params);
    }

    $.fn.pPullRefresh = function(settings){
		
    	settings.$el = $(this);
    	
    	return $.pPullRefresh(settings);
    }

})();