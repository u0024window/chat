/*姓名 手机号 性别 未完结交易 处理中紧急工单 充值异常 提现异常 是否借贷 是否被逾期 是否逾期 用户等级
注册时间 好友数 证件号码 人脸状态 客户状态 绑定银行卡 余额 地域 终端APP版本
*/
<div>
	<table>
		<tr><td>姓名：</td><td id="nameVal">{{userinfo.name}}</td></tr>
		<tr><td>手机号：</td><td id="mobileVal">{{userinfo.mobile}}</td></tr>
		<tr><td>性别：</td><td>{{userinfo.sex}}</td></tr>
		<tr><td>未完结交易：</td>
			<td v-if="userinfo.tradingCount<=0" v-html="userinfo.tradingCount"></td>
			<td v-else v-html="\'<i>\'+userinfo.tradingCount+\'</i>\'"></td>
		</tr>
		<tr><td>处理中紧急工单：</td>
			<td v-if="userinfo.unCompletedOrderCount<=0" v-html="userinfo.unCompletedOrderCount +\' \'+ userinfo.isUrgentOrder"></td>
			<td v-else v-html="\'<i>\'+userinfo.unCompletedOrderCount +\' \'+ userinfo.isUrgentOrder+\'</i>\'"></td>
		</tr>
		<tr><td>充值异常：</td>
			<td v-if="userinfo.chargeWithException==\'否\'" v-html="userinfo.chargeWithException"></td>
			<td v-else v-html="\'<i>\'+userinfo.chargeWithException+\'</i>\'"></td>
		</tr>
		<tr><td>提现异常：</td>
			<td v-if="userinfo.chargeDrawException==\'否\'" v-html="userinfo.chargeDrawException"></td>
			<td v-else v-html="\'<i>\'+userinfo.chargeDrawException+\'</i>\'"></td>
		</tr>
		<tr><td>是否借贷：</td><td>{{userinfo.isloan}}</td></tr>
		<tr><td>是否被逾期：</td>
			<td v-if="userinfo.isOverdueAsCreditor==\'否\'" v-html="userinfo.isOverdueAsCreditor"></td>
			<td v-else v-html="\'<i>\'+userinfo.isOverdueAsCreditor+\'</i>\'"></td>
		</tr>
		<tr><td>是否逾期：</td>
			<td v-if="userinfo.isOverdueAsDebtor==\'否\'" v-html="userinfo.isOverdueAsDebtor"></td>
			<td v-else v-html="\'<i>\'+userinfo.isOverdueAsDebtor+\'</i>\'"></td>
		</tr>
		<tr><td>用户等级：</td><td>{{userinfo.level}}</td></tr>
		<tr><td>注册时间：</td><td>{{"20"+userinfo.registerTime}}</td></tr>
		<tr><td>好友数：</td><td>{{userinfo.friendCount}}</td></tr>
		<tr><td>证件号码：</td><td>{{userinfo.idNo}}</td></tr>
		<tr><td>人脸状态：</td><td>{{userinfo.faceStatus}}</td></tr>
		<tr><td>客户状态：</td><td>{{userinfo.status}}</td></tr>
		<tr @click="bankInfoC($event,userinfo.cardInfo)"><td>绑定银行卡：</td>
			<td class="bank-color">
				<span v-if="userinfo.cardInfo.length>0">{{userinfo.cardInfo[0].bankName+"..."}}</span>
				<span v-else>无</span>
				<ul class="bank-info" v-show="!!bankInfoTag">
					<li v-for="item in userinfo.cardInfo"><span>{{item.bankName}}</span><span>{{item.cardNo}}</span></li>
				</ul>
			</td>
		</tr>
		<tr><td>余额：</td><td>{{userinfo.balance}}</td></tr>
		<tr><td>地域：</td><td>{{userinfo.region}}</td></tr>
		<tr><td>终端APP版本：</td><td>{{userinfo.platform +" " + userinfo.systemVersion + "; " + userinfo.appVersion}}</td></tr>
	</table>
	<div class="jian-dan" ng-app="eccrm.cschatroom" ng-controller="Controller">
		<a class="additem" href="javascript:;" type="button" ng-click="quickAddWorkOrder()">快速建单</a>
		<a class="additem" href="javascript:;" type="button" ng-click="detail()">建单</a>
	</div>
</div>

