<template>
	<div>
		<WebSocketCapture ref="webSocketCapture" :multiple="multiple"></WebSocketCapture>
		<div style="height:5px"></div>
		<button class="btn btn-success" type="button" @click="imageUpload" style="width:100%">上传图片</button>
	</div>
</template>

<script>

var Common = require("../../common/Common.js");
var Modal = require("./Modal.vue");
var WebSocketCapture = require("./WebSocketCapture.vue");

module.exports = {

	props: [
		/**
		 * 可以抓拍多张图片
		 */
		"multiple"
	],

	data: function () {
		return {
			
		}
	},
	components: {
		Common,
		Modal,
		WebSocketCapture,
	},
	methods: {
		/**
		 * 上传图片
		 */
		imageUpload: function () {
			var _self = this;

			var imageSrcs = _self.$refs.webSocketCapture.imageSrcs;
			if (imageSrcs && imageSrcs.length == 0) {
				Common.showDialog("提示", "没有图片", "error");
				return;
			}

			if(_self.multiple == true){
				_self.$emit("uploadImage", imageSrcs);
			}else{
				var imageSrc = imageSrcs[0];
				_self.$emit("uploadImage", imageSrc);
			}
		}
	},
}

</script>

<style scoped>
</style>