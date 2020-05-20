<template>
	<div>
        <div v-if="errorMessage == ''">
            <div class="bs-example" v-if="imageSrcs && imageSrcs.length > 0">
                <img class="img-thumbnail m-img-thumbnail" :src="item" v-for="(item,index) in imageSrcs" :key="index" @click="showImage(item)"/>
            </div>
            <Modal ref="fullImage" full="true" title="查看图片" :showOkButton="false">
                <img style="height: 100%;width: 100%" :src="selectedImageSrc" v-if="selectedImageSrc && selectedImageSrc.length > 0"/>
            </Modal>
        </div>
        <div v-if="errorMessage && errorMessage.length > 0" class="alert alert-danger" role="alert">{{errorMessage}}</div>
	</div>
</template>

<script>
var Common = require("../../common/Common.js");
var Uuid = require("../../common/Uuid.js");
var UserParamResource = require("./UserParamResource.js");

var Modal = require("./Modal.vue");

module.exports = {
    props: [
        /**
         * 可以抓拍多张图片
         */
        "multiple"
    ],
    data: function() {
        return {
            imageSrcs: [],
            selectedImageSrc:"",
            wsUrl: "",
            errorMessage: "",
        };
    },

    components: {
        Modal,
    },

    methods: {
        /**
		 * 查询websocket端口并初始化
		 */
        queryPortAndInit: function() {
			var _self = this;
			UserParamResource.listByParamName("VideoWebSocket").then(successData => {
				if (successData && successData.length > 0) {
					_self.wsUrl = successData[0].value;
				}
				_self.initWebSocket();
			}, errorData => {
				Common.processException(XMLHttpRequest);
			});
		},
		
        /**
		 * 初始化webSocket对象
		 */
        initWebSocket: function() {
            var _self = this;
            // 连接WebSocket服务器
            try {
                this.ws = new WebSocket(_self.wsUrl);
            } catch (e) {
                this.errorMessage = "WebSocket打开失败(" + _self.wsUrl + ")";
            }

            //配置客户端连接成功的回调方法
            if (this.ws) {
                this.ws.onopen = function(event) {
                    _self.errorMessage = "";
                };

                //配置客户端处理消息的回调方法
                this.ws.onmessage = function(event) {
                    //创建FileReader对象，该对象时html5中的特有对象，详细用法可以//参照html5相关资料
                    var reader = new FileReader();
                    //设置FileReader对象的读取文件回调方法
                    reader.onload = function(eve) {
                        //判断文件是否读取完成
                        if (eve.target.readyState == FileReader.DONE) {
                            //读取文件完成后，创建img标签来显示服务端传来的字节数//组
                            if (_self.multiple == true) {
                                _self.imageSrcs.push(this.result);
                            }else{
                                _self.imageSrcs = [];
                                _self.imageSrcs.push(this.result);
							}
                        }
                    };
                    //调用FileReader的readAsDataURL的方法自动就会触发onload事件
                    reader.readAsDataURL(event.data);
                    
				};
				
				this.ws.onclose = function(evt) {
                    _self.errorMessage = "WebSocket已关闭";
				}
            }
		},
		
        /**
		 * 关闭webSocket
		 */
        closeWebSocket: function() {
            this.imageSrcs.splice(0, this.imageSrcs.length);
            if (this.ws) {
                this.ws.close();
            }
        },
        
        /**
         * 显示图片
         */
        showImage:function(item){
            this.selectedImageSrc = item;
            this.$refs.fullImage.show = true;
        }
    },
	
	mounted: function(){
		this.queryPortAndInit();
	},

	destroyed: function(){
		this.closeWebSocket();
	}
};
</script>

<style scoped>
.bs-example {
    position: relative;
	margin-bottom: 10px;
}

.m-img-thumbnail{
    width: 140px;
    height: 140px;
    margin-right: 10px;
}
</style>
