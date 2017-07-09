var csPublic = (function (window, r) {
  r.regExpTel = new RegExp('((\\+86-?)?(\\d{5,15})|((\\d{7,8})|(\\d{3,4})-(\\d{7,8})|(\\d{3,4})-(\\d{7,8}|\\d{3,4})-(\\d{1,4})|(\\d{7,8})-(\\d{1,4})))', 'g');
  r.regExpUrl = new RegExp('(((http|ftp|https):\\/\\/)?[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?)', 'g');
  r.regExpBr = new RegExp('\n', 'g');
  r.emotag = true;
  r.clicktag = 0;
  r.titleTimer = null;
  r.titleStop = false;
  var peopleemo = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '☺', '🙂', '🤗', '😇', '🤓', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '😷', '🤒', '🤕', '☹', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👦', '👧', '👨', '👩', '👴', '👵', '👶', '👱', '👮', '👲', '👳', '👷', '⛑', '👸', '💂', '🕵', '🎅', '👰', '👼', '💆', '💇', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🙌', '🙏', '🗣', '👤', '👥', '🚶', '🏃', '👯', '💃', '🕴', '👫', '👬', '👭', '💏', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '💪', '👈'
      ], // 150
      animals = ['🙈', '🙉', '🙊', '💦', '💨', '🐵', '🐒', '🐶', '🐕', '🐩', '🐺', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🐻', '🐨', '🐼', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🐸', '🐊', '🐢', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🐙', '🐚', '🦀', '🐌', '🐛', '🐜', '🐝', '🐞', '🕷', '🕸', '🦂', '💐', '🌸', '💮', '🏵', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀', '🌝', '🌞', '⭐', '🌟', '🌠', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '☂', '☔', '⚡', '❄', '☃', '☄', '🔥', '💧', '🌊'
      ], // 141
      food = ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🍅', '🍆', '🌽', '🌶', '🍄', '🌰', '🍞', '🧀', '🍖', '🍗', '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🍳', '🍲', '🍿', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🍽', '🍴'
      ], // 69
      activity = ['👾', '🕴', '🎪', '🎭', '🎨', '🎰', '🚣', '🛀', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎾', '🎱', '🎳', '🏏', '🏑', '🏒', '🏓', '🏸', '⛳', '🏌', '⛸', '🎣', '🎽', '🎿', '⛷', '🏂', '🏄', '🏇', '🏊', '⛹', '🏋', '🚴', '🚵', '🎯', '🎮', '🎲', '🎷', '🎸', '🎺', '🎻', '🎬', '🏹'
      ], // 52
      places = ['🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🏘', '🏙', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🕍', '⛩', '🕋', '⛲', '🌁', '🌃', '🌆', '🌇', '🌉', '🌌', '🎠', '🎡', '🎢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚏', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚚', '🚛', '🚜', '🚲', '⛽', '🛤', '🚨', '🚥', '🚦', '🚧', '⚓', '⛵', '🚣', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '💺', '🚁', '🚟', '🚠', '🚡', '🚀', '🛰', '🎑', '🏎', '🏍', '💴', '💵', '💶', '💷', '🗿', '🛂', '🛃', '🛄', '🛅'
      ], // 114
      objects = ['☠', '💌', '💣', '🕳', '🛍', '📿', '💎', '🔪', '🏺', '🗺', '💈', '🖼', '🛎', '🚪', '🛌', '🛏', '🛋', '🚽', '🚿', '🛁', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🌡', '⛱', '🎈', '🎉', '🎊', '🎎', '🎏', '🎐', '🎀', '🎁', '🕹', '📯', '🎙', '🎚', '🎛', '📻', '📱', '📲', '☎', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🎥', '🎞', '📽', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🔬', '🔭', '📡', '🕯', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨'
      ], // 150
      symbols = ['👁‍🗨', '💘', '❤', '💓', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '💜', '💝', '💞', '💟', '❣', '💤', '💢', '💬', '🗯', '💭', '💮', '♨', '💈', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌀', '♠', '♥', '♦', '♣', '🀄', '🎴', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '⚠', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '🔞', '☢', '☣', '⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖', '↕', '↔', '↩', '↪', '⤴', '⤵', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛', '🕉', '✡', '☸', '☯', '✝', '☦', '☪', '☮', '🕎', '🔯', '♻', '📛', '🔰', '🔱', '⭕', '✅', '☑', '✔', '✖', '❌', '❎', '➕', '➖', '➗', '➰', '➿', '〽', '✳', '✴', '❇', '‼', '⁉', '❓', '❔', '❕', '❗', '©', '®', '™', '♈', '♉', '♊'
      ], // 150
      flags = ['🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰'
      ] ,// 150
      emo = {
        0: peopleemo,
        1: animals,
        2: food,
        3: activity,
        4: places,
        5: objects,
        6: symbols,
        7: flags
      };
      r.emo = emo;
  return r;
})(window, (function () {

  function init() {
    try {
      document.execCommand("AutoUrlDetect", false, false);
    } catch (e) {}
    oServer.agentId = getCookie('eccrmContext.username');
    Cookies.set('onlineSt', '1', { expires: 1 });
    oCustomer.isOn();
    setInterval(function (  ) {
      timeUp(oCustomer.currentls, 'msgTime');
    },10000);

    window.onload = load;
    window.top.onbeforeunload = onbeforeunload_handler;
    window.top.onunload = unloadform;
  }
  function load() {
    $(document).on("click", function () {
      $(".emtions").hide();
      $(".shotls").hide();
      $('.bank-info').hide();
    });
  }
  function onbeforeunload_handler() {
    var warning = "是否确认离线?";
    return warning;
  }

  function unloadform() {
    Cookies.remove('onlineSt');
    $.ajax({
      type: 'post',
      url: '{{signinoroutApi}}',
      dataType: 'json',
      async: false,
      data: {
        agentId: oServer.agentId,
        status: 0,// 0离线1在线2忙碌
        busyReson: 0//0=默认 1=开会 2=休息 3=培训 4=学习，status为busy时必选
      }
    });
  }

  function isType(obj, strType) {
    return Object.prototype.toString.call(obj) === '[object ' + strType + ']';
  }

  function isError(res) {
    if (res.error.returnCode != 0) {
      alert(res.error.returnMessage);
      return true;
    }
  }

  function objFindByKey(arrobj, key, value) {
    if (arrobj.length == 0) {
      return -1;
    }
    for (var i = 0; i < arrobj.length; i++) {
      if (arrobj[i][key] == value) {
        return i;
      }
    }
    return -1;
  }

  function emojiParse(dom) {
      twemoji.parse(dom, {
        callback: function (icon, options) {
          return '#resourcePrefix#/img/cschatroom/' + options.size + '/' + icon + '.png';
        },
        size: 72
      });
  }

  function refreshText(domTag, txt) {
      $(domTag+' .text').text(txt);
      var timer = setTimeout(function () {
        $(domTag+' .loading-warp').css('marginTop', '-5.8rem');
        $(domTag+' .text').text('下拉开始刷新');
        clearTimeout(timer);
      }, 500)
  }

  function bubbleSort(elements) {
    for (var i = 0; i < elements.length - 1; i++) {
      for (var j = 0; j < elements.length - i - 1; j++) {
        if (elements[j] > elements[j + 1]) {
          var swap = elements[j];
          elements[j] = elements[j + 1];
          elements[j + 1] = swap
        }
      }
    }
  }

  function msgsort(array, k) {
    if (array == null || array.length == 0) return;
    var i = 0;
    var j = array.length - 1;
    var Sort = function (i, j) {
      // 结束条件
      if (i == j) {
        return
      }
      var key = array[i];
      var stepi = i; // 记录开始位置
      var stepj = j; // 记录结束位置
      while (j > i) {
        // j <<-------------- 向前查找
        if (array[j][k] >= key[k]) {
          j--;
        } else {
          array[i] = array[j];
          //i++ ------------>>向后查找
          while (j > ++i) {
            if (array[i][k] > key[k]) {
              array[j] = array[i];
              break;
            }
          }
        }
      }
      // 如果第一个取出的 key 是最小的数
      if (stepi == i) {
        Sort(++i, stepj);
        return;
      }
      // 最后一个空位留给 key
      array[i] = key;
      // 递归
      Sort(stepi, i);
      Sort(j, stepj);
    }
    Sort(i, j);
    return array;
  }

  function noEscapeHtml(html) {
    return html.replace(/(\&|\&)gt;/g, ">")
        .replace(/(\&|\&)lt;/g, "<")
        .replace(/(\&|\&)nbsp;/g, " ")
        .replace(/(\&|\&)amp;/g, "&")
        .replace(/(\&|\&)quot;/g, "\"")
        .replace(/<p>|<\/p>/g,'<br>')
        .replace(/<span>|<\/span>/g,'<br>')
        .replace(/<div>|<\/div>/g,'<br>')
        .replace(/(<br>|<br\/>)+/g,'<br>')
        .replace(/^(<br>|<br\/>)+/g,'')
        .replace(/(<br>|<br\/>)+$/g,'')
  }

  function getCookie(name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  function scrollTitle() {
    if(csPublic.titleStop) return;
    clearTimeout(csPublic.titleTimer);
    top.window.document.title=top.window.document.title.substring(1,top.window.document.title.length)+top.window.document.title.substring(0,1);
    top.window.document.title=top.window.document.title.substring(0,top.window.document.title.length);
    csPublic.titleTimer = setTimeout("csPublic.scrollTitle()", 500);
  }
  
  function arrUnique(arr,key) {
     var n = {},r=[]; //n为hash表，r为临时数组
     for(var i = 0; i < arr.length; i++) {
      if (!n[arr[i][key]]) {
        n[arr[i][key]] = true; //存入hash表
        r.push(arr[i]); //把当前数组的当前项push到临时数组里面
      }
    }
    return r;
  }
  
  function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+m+"-"+d;
  }

  function timeUp(arr, k) {
    if (arr == null) {
      return;
    }

    if ((+new Date()) % 2 == 0) {
      for (var i = 0; i < arr.length; i++) {
        arr[i][k]++;
      }
    } else {
      for (var i = 0; i < arr.length; i++) {
        arr[i][k]--;
      }
    }
  }
  // 历史消息已页签打开
  function openHisMsgTab(groupId,info){
    var exist = false;
    $(top.document).find('.nav-tabs li').each(function(){
      if($(this).data('groupid')==groupId){
        exist = true;
        $(this).trigger('click');
      }
    });
    !exist && oAddTab.addTab({
        title: info.name || '历史消息',
        url: 'app/imview/partials/cschatroom/historymsg.jsp',
        isRoot:false,
        data:info,
        groupId:groupId,
        onClose: function(){
          oAddTab.back();
        }
      });
  }
  return {
    init: init,
    isType: isType,
    isError: isError,
    objFindByKey: objFindByKey,
    emojiParse: emojiParse,
    refreshText: refreshText,
    bubbleSort: bubbleSort,
    msgsort: msgsort,
    noEscapeHtml: noEscapeHtml,
    getCookie: getCookie,
    scrollTitle:scrollTitle,
    arrUnique:arrUnique,
    GetDateStr:GetDateStr,
    openHisMsgTab:openHisMsgTab
  }

})());
