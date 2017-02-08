var oAddTab = function () {
    function CommonUtils() {
    }
    function getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }
    var context;    // 用于CommonUtils中的方法间调用
    CommonUtils.prototype = {
        // Debounce延迟函数
        // delay: Debounce.delay,

        // 返回上一个页面
        // 如果当前页面是IFRAME，并且ID是以iframe_开头的，则表示当前窗口为页签，当调用该方法时，移除此页签
        back: function (target) {
            if (self.frameElement.tagName == "IFRAME" && self.frameElement.id && self.frameElement.id.indexOf("iframe_") == 0) {
                (context || new CommonUtils()).addTab('remove', self.frameElement.id, target);
            } else {
                window.history.back();
            }
        },

        // 从Cookie中获取登录上下文信息
        // 返回值：{}
        // 对象中可获取的信息有id（员工id）、username（用户名）、employeeName（员工名称）
        loginContext: function () {
            var id, username, employeeName;
            if (getCookie('eccrmContext.id')) {
                id = getCookie('eccrmContext.id');
                username = decodeURI(decodeURI(getCookie('eccrmContext.username')));
                employeeName = decodeURI(decodeURI(getCookie('eccrmContext.employeeName')));
            } else if (getCookie('AuthUser_LoginId')) {
                username = getCookie('AuthUser_LoginId');
            }
            return {
                id: id,
                username: username,
                employeeName: employeeName
            }
        },

        // 获取基于ContextPath的访问路径
        // 每一个使用此js的页面都要求提供在页面中window或window.angular对象中提供一个contextPathURL属性或者在页面中提供一个id为contextPath的属性
        // 如果以上两个都没有提供，则使用相对路径(./url)
        // 参数URL：一般以/开头
        contextPathURL: function (url) {
            if (!url) return '';
            var contextPath;
            if (typeof window.contextPathURL == 'string') {
                contextPath = window.contextPathURL;
            } else if (window.angular && typeof window.angular.contextPathURL == 'string') {
                contextPath = window.angular.contextPathURL;
            } else {
                var cp = $('head base').attr('href') || $('#contextPath').val();
                if (typeof cp === 'string') {
                    contextPath = cp;
                } else {
                    contextPath = '/';
                }
            }

            var lastChar = contextPath.charAt(contextPath.length - 1);
            var urlStartChar = url.charAt(0);
            if (lastChar === '/' && urlStartChar === '/') {
                return contextPath + url.substr(1);
            } else if (lastChar !== '/' && urlStartChar !== '/') {
                return contextPath + '/' + url;
            }
            return contextPath + url;
        }
        ,
        // 使用artDialog插件弹出一个提示框，当只有一个参数时，标题即为内容
        // 参数1（可选）：标题
        // 参数2（必须）：内容
        // 参数3（可选）：图标
        /**
         * 使用artDialog插件弹出一个提示框，当只有一个参数时，标题即为内容
         * @param {string} title 标题
         * @param {string} content 内容
         * @param {string} icon 图标
         * @returns {ArtDialog}
         */
        artDialog: function (title, content, icon) {
            content = content || title;
            if (!title || content == title) title = '信息';
            if (art && $.isFunction(art.dialog)) {
                var obj = {
                    title: title,
                    content: content
                };
                if (typeof icon === 'string') {
                    obj.icon = icon;
                }
                art.dialog(obj);
                return art;
            } else {
                alert(title + ':' + content);
                throw '没有获得art对象!请确保加载了artDialog插件相关的js和css!';
            }
        }
        ,
        /**
         *@description 使用artDialog弹出一个带有success图标的成功提示框
         * @param {string} content 内容
         * @param {string} title [optional] 标题
         */
        successDialog: function (content, title) {
            title = title || '信息';
            this.artDialog(title, content, 'succeed');
        }
        ,

        /**
         * 使用artDialog弹出一个带有error图标的错误提示框
         * @param {string} content 要显示的错误信息内容
         * @param {string} title  [optional] 标题，默认为”错误“
         */
        errorDialog: function (content, title) {
            title = title || '错误';
            this.artDialog(title, content, 'error');
        }
        ,
        /**
         * @description 对字符串使用encodeURI进行两次编码，如果不是字符串，则直接返回
         * @param {string} str 要被编码的字符串
         * @returns {string} 编码后的字符串
         */
        encode: function (str) {
            if (typeof str === 'string') {
                return encodeURI(encodeURI(str));
            }
            return str;
        }
        ,
        /**
         * @description 生成随机ID：值从0-9,a-z,A-Z以及_中随机产生
         * @param {number} length [length=16] 要生成的id的长度
         * @returns {string} 指定长度的随机字符串
         */
        randomID: function (length) {
            // 调整长度
            length = parseInt(length);
            if (length < 1) {
                length = 16;
            }
            // 设置id元素
            var keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');
            var keyMaxIndex = keys.length;
            // 产生id
            var id = '';
            (function () {
                for (var i = length; i > 0; i--) {
                    var index = Math.floor(Math.random() * keyMaxIndex);
                    id += keys[index];
                }
            })();
            return id;
        }
        ,
        /**
         * 关闭当前页签
         * @param target 当前页签所在的容器（即target对象）
         */
        closeTab: function (target) {
            var frameElement = self.frameElement;
            var frameId = frameElement.id;
            if (frameElement.tagName == "IFRAME" && frameId && frameId.indexOf("iframe_") == 0) {
                (context || new CommonUtils()).addTab('remove', frameId, {target: target || window});
                var el = frameElement;
                if (el) {
                    el.src = 'about:blank';
                    try {
                        var iframe = el.contentWindow;
                        iframe.document.readyState = "complete";
                        iframe.document.write('');
                        iframe.close();
                    } catch (e) {
                    }
                }
            } else {
                alert('不是页签!');
            }
        },
        /**
         * @description 页签组件
         * @param {object|string} options 方法名称或者配置对象
         * @param {*} _data [optional] 任意数据
         * @param {object} _target [optional] 目标对象，用于指定作用的window
         * @returns {*}
         */
        addTab: function (options, _data, _target) {
            function Tab() {
            }

            Tab.prototype = {
                title: '新页签',// 必须，页签的标题
                url: '',// 必须，页签要打开的url
                isRoot: false,// 是否是根页签，只能有一个
                canClose: true,// 是否允许关闭，根不允许被关闭
                onClose: null,// 可选，当当前页签被关闭时需要做的操作（该事件会被打开当前页签的那个对象所捕获）
                onUpdate: null,// 可选，当当前页签的内容被更新之后，被手动设置了更新，则当前事件会被触发
                targetObj: window.parent,// 页签在哪个窗口中显示，默认将当前窗口的上级窗口
                targetElm: '#tab',// 页签在指定窗口的哪一个元素上显示
                lazy: true,     // 是否懒加载（即当点击的时候才真正加载这个页面）
                data: null, // 额外传递的数据，可以通过get来获取
                active: true,// 添加玩页签后是否激活，默认为true
                groupId:''
            };
            var context = this;

            // 获取数据
            var tab = new Tab();
            if ($.isPlainObject(options)) {
                $.extend(tab, options);
                tab.targetObj = tab.targetObj || window.parent || window;
            }
            var target = tab.targetObj;
            var element = $(target.document).find(tab.targetElm);
            var groupId = tab.groupId;
            var iframeId = 'iframe_' + this.randomID(4);
            // 获取模板
            var isRoot = tab.isRoot;
            if (isRoot) {                   // 当为root时，清空之前的数据
                target['_data'] = {};
                target['_eve'] = {};
            }
            var events = target['_eve'];    // 保存事件
            var data = target['_data'];     // 保存额外的数据
            var canClose = tab.canClose;
            var getTemplate = function () {
                var tpl =
                    '<div class="panel panel-tab" style="height: 100%;margin: 0;position: relative;" >' +
                    '   <ul class="nav nav-tabs" style="position: absolute;margin: 5px 0 0 0;width:100%;"></ul >' +
                    '   <div class="tab-content" style="height: 100%;width:100%;padding-top: 35px;position: absolute;" ></div >' +
                    '</div >';
                if (isRoot) {
                    var frame = element.find('.panel.panel-tab').find('iframe');
                    if (frame) {
                        $.each(frame, function(n, el){
                            try {
                                el.src = 'about:blank';
                                var iframe = el.contentWindow;
                                iframe.document.readyState = "complete";
                                iframe.document.write('');
                                iframe.close();
                            } catch (e) {
                            }
                        });
                    };

                    element.find('.panel.panel-tab').remove();
                    var foo = $(tpl);
                    element.append(foo);
                    return foo;
                }
                return element.find('.panel.panel-tab');
            };

            // 当前的window对象（也是打开页签的对象）
            var currentWindow = window;
            var hasInit = false;
            // 添加click事件
            var addListener = function () {
                var current = this;
                current.bind('click', function (e, isActive) {
                    e.stopPropagation();
                    if ($(e.target) == current) {
                        return;
                    }
                    if (isActive == true || isActive === undefined) {

                        current.siblings().removeClass('active');
                        current.addClass('active');
                        // 以前激活状态的iframe隐藏
                        var iframeContainer = current.parent('.nav.nav-tabs').siblings('.tab-content');
                        iframeContainer.find('iframe:visible').hide();
                        var activeIFrame = null;
                        if (hasInit == false) {
                            activeIFrame = createIFrame();
                            iframeContainer.append(activeIFrame);
                            var _w = activeIFrame[0].contentWindow; // 如果曾经有通知，则触发通知
                            $(_w).bind('load', function () {
                                current.attr('tab-init', true);        // 表示懒加载完成
                                var tabData = current.data('tab-data'); // 获取在懒加载期间其他页签通知过来的数据
                                if (tabData) {
                                    current.removeData('tab-data');
                                    $.isFunction(_w.tabDataChange) && _w.tabDataChange(tabData);
                                }
                                $(_w).unbind('load');
                            });
                        } else {
                            var iframeId = current.find('i').attr('target');
                            activeIFrame = iframeContainer.find('#' + iframeId);
                        }

                        if (activeIFrame.length < 1) {
                            alert('没有可显示的iframe!');
                        }
                        activeIFrame.show();
                    }
                });
            };


            var createIFrame = function () {
                hasInit = true;
                return $('<iframe name="' + iframeId + '" id="' + iframeId + '" src="' + context.contextPathURL(tab.url) + '" frameborder="0" style = "border: 0;height: 100%;width: 100%;margin: 0;padding: 0;display:none;" > </iframe>');
            };

            // 添加tab
            var createTab = function (root) {
                var li =
                    '<li data-groupId='+groupId+'>' +
                    '    <i target="' + iframeId + (isRoot ? '" >' : '" style="padding-right:25px;">') + tab.title + '</i >' +
                    ((!isRoot && canClose) ? ('<span id="span_' + iframeId + '" class="icons fork" style="top: 2px; right: 0px; position: absolute; cursor: pointer;" title="关闭"></span >') : '') +
                    '</li >';
                var $li = $(li);
                $li.attr('tab', iframeId);

                root.find('.nav.nav-tabs').append($li);
                // 是否使用懒加载(根必须加载，lazy不为true时必须加载）
                if (tab.lazy === false || isRoot) {
                    root.find('.tab-content').append(createIFrame());
                    $li.attr('tab-init', true);
                } else {
                    $li.attr('tab-init', false);
                }
                // 绑定关闭按钮
                $li.find('span').bind('click', function (e) {
                    // 删除注册的事件
                    delete events[iframeId];

                    // 移除传递的数据
                    delete data[iframeId];

                    // 激活其他选项
                    $li.siblings(':last').trigger('click');

                    // 移除iframe
                    var pFrame = root.find('#' + iframeId);
                    var frame = pFrame.contents().find("iframe") || [];
                    frame.push(pFrame);
                    if (frame) {
                        $.each(frame, function(n, el){
                            try {
                                el.src = 'about:blank';
                                var iframe = el.contentWindow;
                                iframe.document.readyState = "complete";
                                iframe.document.write('');
                                iframe.close();
                            } catch (e) {
                            }
                        });
                    }

                    // 移除当前tab
                    $li.remove();

                    // 触发onClose事件
                    if ($.isFunction(tab.onClose)) {
                        tab.onClose();
                    }

                });

                // 添加更新时通知事件
                if ($.isFunction(tab.onUpdate)) {
                    events[iframeId] = tab.onUpdate;
                }
                if (!isRoot && tab.data) {
                    data[iframeId] = tab.data;
                }
                // 绑定点击事件
                addListener.call($li);
                return $li;

            };

            // 将参数数组转换成普通数组

            var argFoo = arguments;
            var getArgumentArray = function () {
                var args = [];
                $.each(argFoo, function (o, index) {
                    args.push(o);
                });
                return args;
            };

            // 功能操作
            if (typeof options == 'string') {
                var _data = arguments[1];       // 要传递的数据
                var _options = arguments[2];    // 额外的配置对象，一般用于指定target和document
                var tabId = currentWindow.frameElement.id;  // 目标页签ID
                if (typeof _options === 'object' && typeof _options.target === 'object') {
                    if (!_options.target.frameElement) {
                        alert('页签调用方法[' + options + ']错误!错误的配置对象,无效的target属性!');
                        return false;
                    }
                    tabId = _options.target.frameElement.id;
                    if (typeof tabId !== 'string') {
                        alert('页签调用方法[' + options + ']错误!错误的配置对象,无效的target属性,没有获得对应的页签ID!');
                        return false;
                    }
                    // 如果指定了目标窗口，则通过目标窗口获得其上级的document对象
                    element = $(_options.target.frameElement.contentWindow.document);
                    target = _options.target;
                }
                if ("remove" === options) {// 移除页签
                    _data = _data || tabId;
                    element.find('#span_' + _data).trigger('click');
                } else if ("update" === options) {  // 通知更新
                    if (events[tabId]) {
                        events[tabId].call(target, _data);
                    }
                } else if ("get" === options) {     // 获取创建当前页签时额外传递过来的数据
                    return data[tabId];
                } else if ("notify" === options) { // 触发事件
                    var doc = target.document;
                    // 绑定通知数据
                    $(doc).find('li[tab-init=false]').data('tab-data', _data);
                    $(doc).find('iframe[id^="iframe_"]').each(function (o) {
                        var $w = this.contentWindow;
                        $($w.document).ready(function () {
                            $.isFunction($w.tabDataChange) && $w.tabDataChange.call($w, _data);
                        });
                    });
                } else {
                    alert('未知的操作类型:' + options);
                }
            } else {
                // 创建tab并手动触发事件
                if (element.length < 1) {
                    alert('创建页签时,配置错误!没有找到对应的页签容器!');
                    return;
                }
                var tabElement = createTab(getTemplate());
                tabElement.trigger('click', tab.active);
                return iframeId;    // 返回新创建的页签所属iframe的id
            }

        }

    };
    context = new CommonUtils();
    return context;
}();
