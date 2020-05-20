<template>
	<div>
	</div>
</template>
<script>
	var Common = require("../common/Common.js");
	export default {
		data: function() {
			return {
				
			}
		},
		components: {
			Common
		},
		methods: {
			/**
			 * 获取JS-SDK配置信息
			 */
			getConfig: function(){
				var _self = this;
				var url = location.href.split('#')[0];
				$.ajax({
					url: Common.getApiURL('WeixinResource/getJsSdkConfig'),
					type: 'POST',
					dataType: "json",
					contentType: "application/json",
					data: url,
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						_self.processConfig(data);
					},
					error: function(e) {
					}
				});
			},
			
			/**
			 * 获取JS-SDK
			 */
			processConfig: function(config){
				wx.config({
		            debug: false,
		            appId: config.appId,
		            timestamp: config.timestamp,
		            nonceStr: config.nonceStr,
		            signature: config.signature,
		            jsApiList : [ 'checkJsApi', 'scanQRCode' ]
	            });
	            wx.error(function(res) {
	            	alert(JSON.stringify(res));
			    });
			    wx.ready(function() {
			        wx.checkJsApi({
			             jsApiList : ['scanQRCode'],
			             success : function(res) {
			
			             }
			        });
			    });
			},
			
			/**
			 * 开始扫码
			 */
			startScan: function(){
				var _self = this;
				wx.scanQRCode({
	                needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
	                scanType : ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
	                success : function(res) {
		                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
		                _self.$emit("scanCallback", result);
	                }
	            });
			}
		},
		mounted: function() {
			this.getConfig();
		}
	}
</script>
<style scoped>

</style>