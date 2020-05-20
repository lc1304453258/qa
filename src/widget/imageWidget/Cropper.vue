<template>
    <div>
        <div>
           <!--  <button @click="selectFile" class="btn btn-primary" id="fileSelect" :readonly="!readonly">选择图片</button> -->
           <!--  <button class="btn btn-success" type="button" id="button2" @click="cropImage">上传</button> -->
            <input ref="fileInput" type="file" id="file" class="form-control" @change="previewAfterUpload" :readonly="!readonly" v-show="false" />
        </div>
        <div style="height:5px"></div>
        <div id="modal-contain">
            <div id="preview-image-div">
                <img id="crop-image" />
            </div>
        </div>
    </div>
</template>

<script>
var Common = require("../../common/Common.js");
var Notify = require("../Notify.js");

module.exports = {
    props: [
        /**
         * 图片裁剪比例,默认1.33
         */
        "scale",
        /**
         * 只读
         */
        "readonly"
    ],
    data: function () {
        return {
            croppable: false,
            croppedCanvas: "",
            roundedCanvas: "",
            dataURL: "",
            aspectRatio: 4 / 3, // 图片裁剪比例,默认1.33
            errorMessage: "",
        };
    },

    components: {
        Common,
    },

    methods: {
        getRoundedCanvas: function (sourceCanvas) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var width = sourceCanvas.width;
            var height = sourceCanvas.height;

            canvas.width = width;
            canvas.height = height;
            context.beginPath();
            context.arc(
                width / 2,
                height / 2,
                Math.min(width, height) / 2,
                0,
                2 * Math.PI
            );
            context.strokeStyle = "rgba(0,0,0,0)";
            context.stroke();
            context.clip();
            context.drawImage(sourceCanvas, 0, 0, width, height);

            return canvas;
        },

        /**
         * 圆形截图的方法，目前未调用，保留
         */
        roundImage: function () {
            if (this.croppable == false) {
                return;
            }
            this.croppedCanvas = this.image1.cropper("getCroppedCanvas");
            this.roundedCanvas = this.getRoundedCanvas(this.croppedCanvas);
            this.dataURL = this.roundedCanvas.toDataURL();
        },

        /**
         * 裁剪图片
         */
        cropImage: function () {
            if (this.croppable == false) {
                return;
            }
            this.croppedCanvas = this.image1.cropper("getCroppedCanvas");
            this.roundedCanvas = this.getRoundedCanvas(this.croppedCanvas);
            this.dataURL = this.croppedCanvas.toDataURL();
            this.$emit("uploadImage", this.dataURL);
        },

        /**
         * 创建图片裁剪控件
         */
        createCropper: function () {
            var _self = this;
            this.image1 = $("#crop-image");
            this.image1.cropper({
                aspectRatio: _self.aspectRatio,
                viewMode: 1,
                ready: function () {
                    _self.croppable = true;
                }
            });
        },

        /**
         * 选择了文件
         */
        selectFile: function (e) {
            var fileElem = document.getElementById("file");
            if (fileElem) {
                fileElem.click();
            }
            e.preventDefault(); // prevent navigation to "#"
        },

        /**
         * 选择图片后，马上预览
         */
        previewAfterUpload: function (e) {
            $("#preview-image-div").remove();
            $("#modal-contain").append(
                "<div id='preview-image-div'><img id='crop-image'/></div>"
            );

            var _self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            var file = files[files.length - 1];

            console.log("file.size = " + file.size); //file.size 单位为byte

            if (file.size > 5000 * 1024) {
                Notify.error("错误", "图片大小超过限制，最大5M", true);
                e.target.value = "";
                return;
            }

            var reader = new FileReader();

            //读取文件过程方法
            reader.onloadstart = function (e) {
                console.log("开始读取....");
            };
            reader.onprogress = function (e) {
                console.log("正在读取中....");
            };
            reader.onabort = function (e) {
                console.log("中断读取....");
            };
            reader.onerror = function (e) {
                console.log("读取异常....");
            };
            reader.onload = function (e) {
                console.log("成功读取....");
                var img = document.getElementById("crop-image");
                img.src = e.target.result;
                _self.createCropper();
                _self.$refs.fileInput.value = "";
            };
            reader.readAsDataURL(file);
        },
    },
    
    mounted: function () {
        //判断浏览器是否支持FileReader接口
        if (typeof FileReader == "undefined") {
            Common.showDialog("提示", "当前浏览器不支持FileReader接口", "error");
        }
    },

    watch: {
        "scale": function(newValue, oldValue){
            this.aspectRatio = newValue;
        }
    }
};
</script>

<style scoped>
.input-group {
    width: 100%;
}

img {
    max-width: 100%;
}

/* Override Cropper's styles */
.cropper-view-box,
.cropper-face {
    border-radius: 50%;
}

.finish_room {
    width: 400px;
    height: auto;
}

.finish_room2 {
    width: 100%;
    height: auto;
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    align-items: center;
}

.finish_room2 .room_img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    position: relative;
    overflow: hidden;
}

.finish_room2 .room_img img {
    width: 100%;
    height: 100%;
}

.finish_room2 > .room_img span {
    position: absolute;
    width: auto;
    height: auto;
    right: 5px;
    bottom: 3px;
}

.room_add_img {
    width: 148px;
    height: 98px;
    border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.room_add_img > span:nth-child(1) {
    margin-top: 20px;
    width: 40px;
    height: 40px;
    overflow: hidden;
}

.room_add_img > span:nth-child(2) {
    margin-bottom: 10px;
}

.room_add_img input {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    opacity: 0;
}
</style> 



