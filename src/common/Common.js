var Notify = require("../widget/Notify.js");

module.exports = {
	pageSize: 20,

	// 异常处理
	processException: function (XMLHttpRequest, textStatus, errorThrown) {
		var _self = this;
		console.log(XMLHttpRequest);
		if (XMLHttpRequest.status == 400) {
			// 400 Bad Request
			Notify.error("提示", XMLHttpRequest.responseText, true);
		} else if (XMLHttpRequest.status == 401) {
			Notify.error("提示", XMLHttpRequest.responseText, true);
		} else if (XMLHttpRequest.status == 500) {
			// 500 Internal Server Error
			Notify.error("提示", XMLHttpRequest.responseText, true);
			if (XMLHttpRequest.responseText.indexOf("登录超时") > 0) {
				// 如果异常信息包含“登录超时”，则2秒后跳转到登录页面
				setTimeout(function () {
					window.location = _self.getRedirectUrl("/index.html?#/login");
				}, 2 * 1000);
			}
		} else {
			Notify.error("服务器异常", XMLHttpRequest.responseText, true);
		}
	},


	/**
	 * 获取跳转的路径
	 * @param {*} url 
	 */
	getRedirectUrl: function (url) {
		var href = window.location.href;
		if (href.indexOf("wmsapp") >= 0) {
			return "/wmsapp/" + url;
		} else {
			return url;
		}
	},

	// 获取API的地址
	getApiURL: function (apiName) {
		return "/api/" + apiName;
	},

	// 给请求头中加上account和token信息
	addTokenToRequest: function (request) {
		var token = $.cookie('token');
		var account = $.cookie('account');
		if (token == undefined) {
			localStorageToken = localStorage.getItem('token');
			if (localStorageToken != undefined) {
				token = localStorageToken;
			}
		}
		if (account == undefined) {
			localStorageAccount = localStorage.getItem('account');
			if (localStorageAccount != undefined) {
				account = localStorageAccount;
			}
		}
		request.setRequestHeader("account", account);
		request.setRequestHeader("token", token);

	},

	/**
	 * 获取Token
	 */
	getToken: function () {
		return $.cookie('token');
	},


	// 清空 Cookie
	clearCookie: function () {
		document.cookie.split(";").forEach(function (c) {
			document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		});
	},

	clearLocalStorage: function () {
		// 清理localStorage时需要保留的参数列表
		var reserveParams = ["hostPageBaseURL", "workShopId", "resourceInstanceId",
			"resourceInstanceName", "apsBaseUrl", "cameraBaseURL"
		];
		//存放的信息
		var reserveParamValues = [];

		//获取参数信息 
		var len = reserveParams.length;
		for (var i = 0; i < len; i++) {
			var reserveParam = reserveParams[i];
			var reserveParamValue = "";
			if (localStorage.getItem(reserveParam) != undefined) {
				reserveParamValue = localStorage.getItem(reserveParam);
			}
			reserveParamValues.push(reserveParamValue);
		}

		//清理localStorage
		window.localStorage.clear();

		//还原参数信息
		for (var i = 0; i < len; i++) {
			localStorage.setItem(reserveParams[i], reserveParamValues[i]);
		}
	},

	/**
	 * 修复多个模态框的BUG
	 * bootstrap中如果在模态框弹出模态框，即多重模态框，那么在关闭模态框后，上一级的模态框无法滚动，
	 * 而且滚动事件会穿透到body层。原理是只要有modal被打开，body会被赋予modal-open这个类，
	 * 使其overflow变为hidden，无法滚动；而只要有modal被关闭，body的modal-open这个类就会被remove掉。
	 * 所以解决方法如上代码，非最老的一层modal监听隐藏事件，为body重新添加modal-open类。
	 * @param {Object} uuid
	 */
	fixModalBug: function (uuid) {
		$('#' + uuid).on("hidden.bs.modal", function () {
			$(document.body).addClass("modal-open");
		});
	},


	getImageSrc: function (className, imageName) {
		var accountId = localStorage.getItem("account");
		return this.getFileServerUrl() + "Files/" + accountId + "/Images/" + className + "/" + imageName;
	},

	// 获取略缩图图片路径
	getThumbnailImageSrc: function (className, imageName) {
		var accountId = localStorage.getItem("account");
		return this.getFileServerUrl() + "Files/" + accountId + "/Images/" + className + "/thumbnail/" + imageName;

	},

	getImageError: function () {
		if (this.clientRunningEnvironment == 'BROWSER') {
			return "../../static/image/imageNotFound.png";
		} else {
			return "../static/image/imageNotFound.png";
		}
	},

	/**
	 * 图片找不到，加载默认的图片
	 */
	imgNotFound: function (event) {
		var img = event;
		if (this.clientRunningEnvironment == 'BROWSER') {
			img.src = "../../static/image/imageNotFound.png";
		} else {
			img.src = "../static/image/imageNotFound.png";
		}
		img.onerror = null;
	},

	/**
	 * 获取主机地址
	 */
	getRootPath: function () {
		//获取当前网址，如： http://localhost:8083/myproj/view/my.jsp
		var curWwwPath = window.document.location.href;
		//获取主机地址之后的目录，如： myproj/view/my.jsp
		var pathName = window.document.location.pathname;
		var pos = curWwwPath.indexOf(pathName);
		//获取主机地址，如： http://localhost:8083
		var localhostPaht = curWwwPath.substring(0, pos);
		return localhostPaht;
	},

	getHostPageBaseURL: function () {
		return this.getRootPath() + "/"
	},

	// 获取图片路径url
	getFileServerUrl: function () {
		return this.getRootPath() + "/"
	},
}