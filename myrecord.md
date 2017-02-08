心路历程
#1.第三方中间件版本
## server接口
* 获取历史消息列表、支持分页加载   调server http://git.jdb-dev.com/platform/IMServer/wikis/getHistorySessionLsit
* 点击某一条消息获取用户信息及状态接口（用户头像、用户名称、手机号、性别等； 客户信息）  先调中间件，再调用server http://git.jdb-dev.com/lijk/crmservice/wikis/onlineUseInfo
* 调用获取历史信息接口 http://git.jdb-dev.com/platform/IMServer/wikis/findMessages
* 发送消息：图片上传接口 https://tradeapi.jiedaibao.com/mybankv21/upload/partImage

## vue 模块
### v_head 
* el '#head'
*  btn //当前展示的是当前客户列表还是历史客户列表
*  switch //客服在线还是离线
*  userhead {name avatar_url} //客户姓名和头像
### v_userinfo
* el:'.userinfo'
* data userinfo //客户信息 json
* userinfo = {
*       name:'Emey',
*       phone_munber:18516890182,
*       sex:'男',
*       phone_type:'iPhone',
*       version:'2.3.1',
*       app_version:'2.2.2',
*       isloan:'是',
*       isoverdue:'是'
*   }
### v_chatlog
* el:'.chatlog' 
* msgs msgs   //
*     {
*        msg_id:'32423',
*        msg_time:'1465557360822',
*        chat_type:1,//0客户->客服，1客服->客户，2系统
*        avatar_url:'/img/cschatroom/test.jpg',
*        msgContent:{// string 消息内容:富文本格式
*             msg_type:'1',// 消息类型；1=文本；2=图片；3=链接；
*             content:'城市到处是大势大势大势大打算打算的势大势大势大势大势大势大的是的撒打算打算',// 消息内容
*             action:'',// 处理方式
*             ext:''// 扩展字段
*            },
*        msgerror:0
*    }
### v_inputpanel
* el:'.inputpanel'
* {
*            img:{
*                name:'',
*                size:'',
*                mineType:'',
*                filename:'',
*                filedata:''
*            },
*            sendmsg:{
*                msgtype:'',
*                msgcontent:''
*            }
* }
### v_list
* el:'.sidelist'
* data customerlist
*               {
*                  customerid:'',
*                  name:'Emey60',
*                  avatar_url:'/img/cschatroom/test.jpg',
*                  msg_time:'1465557360822',
*                  msgContent:{// string 消息内容:富文本格式
*                       msgType:'1',// 消息类型；1=文本；2=图片；3=链接；
*                       content:'这里是题这这里是题这里问题是问题',// 消息内容
*                       action:'',// 处理方式
*                       ext:''// 扩展字段
*                      },
*                  msgnum:15,
*                  cur_chat:true
*              }
* methods li_click
### 过滤器
* timeFilter //时间
* msgAbstract  //消息
### 全局变量
* csConfig = {
*    agentID:'110',//客服ID
*    online:true,
*    cur_ustomer:{
*        id: 123,//客户ID
*        lastMsg:{
*            id:'123',
*            chatType:1//1普通聊天 2系统消息
*        },
*    }       
* } 
### emoji
* 通过twemoji 翻译表情为img图片
### 下拉刷新
* 插件
### 图片上传
* e.files[0] 图片信息 formData

## 中间件接口
* 客户信息 //调用userinfo
* 在线客户
* 发送消息 先调用sendmsg接口再调用SPublic Function SendMsg(String strContactID, String strMsgID) As Boolean
* strContactID String 会话 ID
* strMsgID String 消息 ID
* 在线 离线
* //结束会话接口
* 调用

# 2.自研中间件版本
## ajax轮询
## 7.29 待完善问题
* 默认头像，onunload 消息顺序 过滤HTML转译 适配屏幕 
* 离线删除本地存储，.key = value
* .setItem(key,value)
* .getItem(key)
* .removeItem(key)
* .clear()

* 状态码 
* 没有memberId

## 8.2 
* 下拉插件 遮罩 排序 存储
## 8.3 
* 空格输入 客户列表表情
* END  待解决 客户列表表情  下拉触不到
## 8.4
* 乱序 客户列表表情 退出离线 信息缺失 消息没有更新 富文本换行  发送图片
* TG IE遮罩 消息排序
## 8.7
* 消息乱序 发很多消息没有实时更新 历史列表实时更新 历史tag 
## 8.10
* 端收到<>有问题  消息换行 滚动条 
* 历史没遮住 消息遮罩
## 到9.9
* 图片上传 recordId计算
## 到9.23
* 二期富文本消息更新 离开弹窗 滚动条
## 到9.24
* 机器人回答

##10.14 二期完成    最近历史
