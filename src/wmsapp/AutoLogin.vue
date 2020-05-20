<template>
	<div class="container-fluid">
		<div>请耐心等待...</div>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Loading = require("../common/Loading.js");
	var Notify = require("../widget/Notify.js");
	module.exports={
		components: {

		},
		data: function() {
			return {
				userName: "18016261657",
				password: "a123123",
				accountId: 2,
				"accountDateTime": null,
			}
		},
		methods: {

			login: function (event) {
				var loginData = {
					"userName": this.userName,
					"password": this.password,
					"accountId": this.accountId,
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

						$("#input-pwd").attr('type', "text").val("");

						// _self.$router.push("/desktop/dashboard");
						_self.$router.push("/desktop/checkSN/" + _self.$route.params.code);
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
				if(_self.accountId == 1){
					loginInfo.accountId = 1;
					loginInfo.accountName = "系统账套";
				}else{
					loginInfo.accountId = 2;
					loginInfo.accountName = "用户账套";
				}
				if (!window.localStorage) {
					Notify.error("错误", "浏览器不支持localstorage", false);
				} else {
					var storage = window.localStorage;
					var json_LoginInfo = JSON.stringify(loginInfo);
					storage.setItem("json_LoginInfo", json_LoginInfo);
					storage.setItem("token",loginInfo.token);
					storage.setItem("account",_self.accountId);
					if (_self.rememberPassword) {
						storage.setItem("userName", _self.userName);
						storage.setItem("password", _self.password);
					}
					storage.setItem("rememberPassword", _self.rememberPassword);
				}
			},
		},
		mounted: function() {
			this.login();
		},

	}
</script>