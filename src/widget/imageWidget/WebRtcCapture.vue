<template>
	<div>
		<div>
			<div class="embed-responsive embed-responsive-16by9" style="max-height: 400px;">
				<video :id="videoUuid" autoplay playsinline></video>
			</div>

            <div style="height:5px"></div>

			<canvas :id="canvasUuid" hidden="hidden"></canvas>

			<div class="row">
				<div class="col-xs-6 col-md-3" v-for="(item,index) in imageSrcs" :key="index">
					<div class="thumbnail">
						<img :src="item">
						<div class="caption">
							<a href="javascript:void(0)" class="btn btn-primary" role="button" @click="deleteImage(index)">删除</a>
						</div>
					</div>
				</div>
			</div>

            <div style="height:5px"></div>

			<div>
				<input class="btn btn-success" type="button" title="抓拍" value="抓拍" @click="capture" style="width:100%"/>
			</div>

			<div class="alert alert-danger" role="alert" v-if="errorMessage != null && errorMessage.length > 0">{{errorMessage}}</div>
		</div>
	</div>
</template>

<script>
var Common = require("../../common/Common.js");
var Uuid = require("../../common/Uuid.js");

module.exports = {
	props: [
		/**
		 * 可以抓拍多张图片
		 */
		"multiple"
	],

	data: function () {
		return {
			imageSrcs: [],
			videoUuid: Uuid.createUUID(),
			canvasUuid: Uuid.createUUID(),
			width: undefined,
			height: undefined,
			errorMessage: "",
		}
	},
	components: {
		Common,
	},
	methods: {
		/**
		 * 初始化摄像头
		 */
		init: function () {
			var _self = this;
			//  由于IOS必须在版本11以上才能使用webrtc，并且只有Safari支持，所以做一个小小的判断，限定在
			if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent) && navigator.vender.indexOf("apple") > -1) {
				return;
			}
			// 实现在浏览器中打开摄像头，并且将摄像头内容显示在页面中
			// 想要实现这一功能，需要了解webRTC（Web Real-Time Communication）网络实时通话技术，它允许浏览器实现视频、音频、P2P文件分享等功能。
			// 开启视频功能，依赖window的navigator对象，采用getUserMedia方法，有版本差异，所以需要判断区分
			// 需要IE(Edge)15+， Safari 11+， IOS Safari 11.2+, Android 64+, UC 不支持， QQ、百度部分支持
			// 所以首先需要对浏览器支持情况进行判断
			// 先判断浏览器是否支持
			if (navigator.mediaDevices === undefined ||
				navigator.mediaDevices.enumerateDevices === undefined ||
				navigator.mediaDevices.getUserMedia === undefined) {
				// 再判断具体是那个方法不支持，并向用户显示
				if (navigator.mediaDevices === undefined) {
					var fctName = 'navigator.mediaDevices'
				} else if (navigator.mediaDevices.enumerateDevices === undefined) {
					var fctName = 'navigator.mediaDevices.enumerateDevices'
				} else if (navigator.mediaDevices.getUserMedia === undefined) {
					var fctName = 'navigator.mediaDevices.getUserMedia'
				} else {
					console.assert(false)
				}
			}
			_self.video = document.getElementById(_self.videoUuid);
			_self.video.crossOrigin = "Anonymous";
			_self.canvas = document.getElementById(_self.canvasUuid);
			_self.context = _self.canvas.getContext('2d');
			// 如果浏览器支持，该方法的更新是向后兼容，新版将所有功能都使用navigator.mediaDevices进行了封装
			navigator.mediaDevices.enumerateDevices().then(function (sourceInfos) {
				// 如果支持新的方法，那么就使用新的方法来获取，当然这是一种比较主流的判断方法
				// 如果是想旧的方法兼容，可以使用下面作为判断条件，除IOS和PC以外，均使用旧的获取方式
				// !(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || !/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent))

				// 无论是旧的写法还是新的标准，思路都是通过设备信息，获取摄像头的视频流，通过转换变成blob的格式交给video的src

				if (!navigator.mediaDevices.getUserMedia) {
					// 声明一个数组，用于装载设备媒体设备的相关信息，由于回调中sourceInfos对象中携带有所有媒体对象的相关信息
					// 这里对信息进行遍历筛选，只选出摄像头的Id并保存在数组中
					var exArray = [];
					for (var i = 0; i < sourceInfos.length; ++i) {
						if (sourceInfos[i].kind == 'videoinput') {
							exArray.push(sourceInfos[i].deviceId);
						}
					}
					_self.getMedia();
				} else {
					// 当采用最新的标准方式获取视频时,这里对生成视频进行配置
					var userMediaConstraints = {
						audio: false, // 是否获取音频
						video: {
							facingMode: 'environment' // 环境表示后置摄像头，使用user表示采用前置
						}
					}
					// 这里就采用新的方法来获取视频
					navigator.mediaDevices.getUserMedia(userMediaConstraints).then(function success(stream) {
						_self.video.srcObject = stream;
						_self.stream = stream.getTracks()[0];
					}).catch(function (error) {
						alert(error.name + error.message)
					});
				}
			}).catch(function (error) {
				alert(error.name + error.message)
			})

			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		},

		/**
		 * 获取媒体
		 */
		getMedia: function () {
			var _self = this;
			if (navigator.getUserMedia) {
				// 该方法可以传递3个参数，分别为获取媒体信息的配置，成功的回调函数和失败的回调函数
				navigator.getUserMedia({
					audio: false, // 表明是否获取音频
					video: { // 对视频信息进行配置
						optional: [{
							'sourceId': exArray[1] // 下标为0是前置摄像头，1为后置摄像头，所以PC不能进入该判断，否则画面会保持在第一帧不动
						}]
					},
				}, stream => {
					_self.stream = stream;
					// 对FireFox进行兼容，这里对返回流数据的处理不同
					if (_self.video.mozSrcObject !== undefined) {
						//Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持  
						_self.video.mozSrcObject = stream;
					} else {
						// 一般的浏览器需要使用createObjectURL对流数据进行处理，再交给video元素的src
						_self.video.src = window.URL && window.URL.createObjectURL(stream) || stream;
					}
					_self.errorMessage = null;
				}, error => {
					_self.errorMessage = "抓拍失败:" + e;
				});
			} else {
				_self.errorMessage = "当前的设备不支持摄像头。";
			}
		},


		/**
		 * 删除图片
		 *@author GuoZhiBo 20171201
		 */
		deleteImage(index) {
			var _self = this;
			_self.imageSrcs.splice(index, 1);
		},

		/**
		 * 抓拍图片
		 */
		capture: function () {
			var _self = this;
			_self.canvas.width = _self.video.videoWidth;
			_self.canvas.height = _self.video.videoHeight;
			_self.context.drawImage(_self.video, 0, 0, _self.canvas.width, _self.canvas.height); //将video对象内指定的区域捕捉绘制到画布上指定的区域，实现拍照。
			var img = _self.canvas.toDataURL('image/png');
			_self.height = _self.canvas.height * 0.25;
			_self.width = _self.canvas.width * 0.25;
			if(_self.multiple != true){
				_self.imageSrcs.splice(0, _self.imageSrcs.length);
			}
			_self.imageSrcs.push(img);
		},
	},

	mounted: function () {
		var _self = this;
		_self.video = undefined;
		_self.audio = undefined;
		_self.canvas = undefined;
		_self.context = undefined;
		_self.stream = undefined;
		_self.$nextTick(function () {
			_self.init();
		});
	},

	destroyed: function () {
		// 关闭摄像头
		this.stream.stop();
		this.imageSrcs.splice(0, this.imageSrcs.length);
	}
}
</script>

<style scoped>
.imgDiv {
    display: inline-block;
    position: relative;
}

.imgDiv .delete {
    position: absolute;
    top: 0px;
    right: 12px;
    width: 0px;
    height: 0px;
    color: red;
}

.thumbnail {
    display: block;
    padding: 4px;
    margin-bottom: 20px;
    line-height: 1.42857143;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    -webkit-transition: border 0.2s ease-in-out;
    -o-transition: border 0.2s ease-in-out;
    transition: border 0.2s ease-in-out;
}
</style>