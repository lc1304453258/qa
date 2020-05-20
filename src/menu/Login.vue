<template>
	<div class="login-wrapper">
		<div class="login-form">
			<h1 class="m-header">
				<img @click="showAccount()"
					 v-lazy="'../../static-wms-app/image/logo.png'"
					 onerror="appCommon.imgNotFound(this)">
			</h1>
			<section class="login_content">
				<div>
					<fieldset class="form-group"
							  v-if="accountItems != null && accountItems.length > 1">
						<label for="account"
							   class="sr-only">账套</label>
						<select id="account"
								class="form-control"
								placeholder="请选择账套"
								required
								v-model="accountId">
							<option v-for="accountItem of accountItems"
									v-bind:value="accountItem.key">{{accountItem.value}}</option>
						</select>
					</fieldset>
					<fieldset class="form-group">
						<label for="userName"
							   class="sr-only">用户名</label>
						<input id="userName"
							   type="text"
							   class="form-control"
							   placeholder="请输入用户名"
							   required
							   v-model="userName"
							   @keyup.enter="login">
					</fieldset>
					<fieldset class="form-group">
						<label for="password"
							   class="sr-only">密码</label>
						<input id="password"
							   type="password"
							   class="form-control"
							   placeholder="请输入密码"
							   required
							   v-model="password"
							   @keyup.enter="login">
					</fieldset>
					<fieldset class="form-group">
						<label for="loginDate"
							   class="sr-only">日期</label>
						<DateWidget id="loginDate"
									class="form-control"
									:dateValue="accountDateTime"
									:readonly="false"
									@keyup.enter="login"
									@on-value-change="textChanged" />
					</fieldset>
					<!-- <fieldset class="form-group">
    					<label for="rememberPassword">记住密码</label>
						<switches id="rememberPassword" v-model="rememberPassword" :selected="rememberPassword" color="green" type-bold="true"></switches>
					</fieldset> -->
					<button type="button"
							class="btn btn-primary"
							v-on:click="login">登录</button>
					<div class="clearfix"></div>
					<div class="separator">
						<p style="float: left; cursor: pointer;"
						   class="text-success">
							<a @click="toForgetPassword()">忘记密码</a>
						</p>
						<div class="clearfix"></div>
						<p class="text-center">©2018 上海联物信息科技有限公司</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var axios = require("axios");
	var Switches = require("../widget/Switches.vue");
	var DateWidget = require("../widget/Date.vue");

	module.exports = {
		data: function () {
			return {
				"userName": "",
				"password": "",
				"accountItems": [],
				"accountId": '2',
				"showAccountCount": 1,
				"rememberPassword": false,
				"accountDateTime": null,

			}
		},

		components: {
			Common,
			Switches,
			DateWidget
		},

		methods: {
			login: function (event) {
				var loginData = {
					"userName": this.userName,
					"password": this.password,
					"accountId": this.accountId,
					// "accountDateTime": this.accountDateTime
				};
				var _self = this;
				if (_self.userName.trim() == "" || _self.password.trim() == "") {
					Notify.error("登陆失败", "登录,用户名或密码不允许为空", false);
					return;
				}
				$.ajax({
					url: Common.getApiURL("Login"),
					async: true,
					type: "post",
					data: loginData,
					success: function (loginInfo) {
						Common.clearLocalStorage();
						Common.clearCookie();
						$.cookie('account', _self.accountId, { expires: 7 });
						$.cookie('token', loginInfo.token, { expires: 7 });

						// 访问图片的时候，使用vue-lazyloading进行访问，axios增加访问头。
						axios.defaults.headers.common['token'] = loginInfo.token;
						axios.defaults.headers.common['account'] = _self.accountId;

						$("#input-pwd").attr('type', "text").val("");

						_self.$router.push("/desktop/dashboard");
						_self.setLocalStorage(loginInfo);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},
			//  设置localStorage
			setLocalStorage: function (loginInfo) {
				var _self = this;
				if (_self.accountId == 1) {
					loginInfo.accountId = 1;
					loginInfo.accountName = "系统账套";
				} else {
					loginInfo.accountId = 2;
					loginInfo.accountName = "用户账套";
				}
				if (!window.localStorage) {
					Notify.error("错误", "浏览器不支持localstorage", false);
				} else {
					var storage = window.localStorage;
					var json_LoginInfo = JSON.stringify(loginInfo);
					storage.setItem("json_LoginInfo", json_LoginInfo);
					storage.setItem("token", loginInfo.token);
					storage.setItem("account", _self.accountId);
					if (_self.rememberPassword) {
						storage.setItem("userName", _self.userName);
						storage.setItem("password", _self.password);
						storage.setItem("accountId", _self.accountId);
					}
					storage.setItem("rememberPassword", _self.rememberPassword);
				}
			},
			showAccount: function () {
				var _self = this;
				_self.showAccountCount++;
			},
			/**
			 * 跳转到注册页面
			 * @return {void} 
			 */
			toRegister: function () {
				window.location = "/register.html#signup";
			},
			// 跳转到产品下载页面
			toDownloadPage: function () {
				window.open("/prodogDownload.html");
			},

			toForgetPassword: function () {
				window.location = "/register.html#forget-password";
			},

			/**
			 * 日期选择改变事件
			 * @param  {Date} value 
			 * @return {void} 
			 */
			textChanged: function (value) {
				this.accountDateTime = value;
			},
			/**
			 * 获取服务端当前时间
			 */
			getCurrentDate: function () {
				var _self = this;
				$.ajax({
					url: Common.getApiURL("Login/getCurrentDate"),
					type: "get",
					timeout: 2000,
					success: function (data) {
						if (data != undefined && data != "") {
							_self.accountDateTime = data;
						} else {
							_self.generateCurrentDate();
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						_self.generateCurrentDate();
					}
				})
			},
			/**
			 * 生成当前时间
			 */
			generateCurrentDate: function () {
				var date = new Date();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				if (day < 10) {
					day = "0" + day;
				}
				if (month < 10) {
					month = "0" + month;
				}
				this.accountDateTime = date.getFullYear() + "-" + month + "-" + day;
			},
		},

		created: function () {
			var _self = this;
			$.ajax({
				url: Common.getApiURL("AccountResource"),
				type: "get",
				async: true,
				success: function (msg) {
					console.log(msg);
					for (var i = 0, length = msg.length; i < length; i++) {
						_self.accountItems.push(msg[i]);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest);
					Common.processException(XMLHttpRequest, textStatus, errorThrown);
				}
			})

			var storage = window.localStorage;
			var userName = storage.getItem("userName");
			var password = storage.getItem("password");
			var accountId = storage.getItem("accountId");
			if (userName != null) {
				_self.userName = userName;
			}
			if (password != null) {
				_self.password = password;
			}
			if (accountId != null) {
				_self.accountId = accountId;
			}
			var rememberPassword = storage.getItem("rememberPassword");
			if (rememberPassword != null && rememberPassword == "true") {
				_self.rememberPassword = true;
			} else {
				_self.rememberPassword = false;
			}

		},

		mounted: function () {
			$("body").attr("class", "body-login");
			$("body").children(":first").attr("class", "");
			this.getCurrentDate();
		},

		watch: {
			"rememberPassword": function () {
				var _self = this;
				if (!window.localStorage) {
					Notify.error("错误", "浏览器不支持localstorage", false);
				} else {
					var storage = window.localStorage;
					storage.setItem("rememberPassword", _self.rememberPassword);
				}
			}
		}
	}
</script>

<style scoped>
	@media screen and (max-width: 62em) {
		.login-wrapper {
			margin: 0px auto;
			max-width: 450px;
			position: relative;
		}


		.login-form {
			top: 0px;
			width: 100%;
			padding: 20px;
		}

	}

	@media screen and (min-width: 62em) {
		.login-wrapper {
			margin: 0px auto;
			padding-top: 5%;
			max-width: 350px;
			position: relative;
		}


		.login-form {
			top: 0px;
			width: 100%;
		}
	}


	.separator {
		border-top: 1px solid #D8D8D8;
		margin-top: 10px;
		padding-top: 10px;
	}

	.m-header {
		text-align: center;
	}

	.m-header img {
		width: 100px;
		height: 100px;
	}
</style>