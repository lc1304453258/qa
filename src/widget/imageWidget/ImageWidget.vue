<template>
    <div class="input-group">
        <div class="row">
            <span class="col-md-12">
                <div class='finish_room2'
                     v-if="hasImage">
                    <div class='room_img'>
                        <img v-lazy="imageSrc">
                    </div>
                    <button class="btn btn-danger"
                            @click="emitFieldValue(null)"
                            v-if="!readonly">删除</button>
                </div>
                <div v-else>
                    <button @click="showUploadImageModal"
                            class="btn btn-primary"
                            :readonly="!readonly">添加图片</button>
                </div>
            </span>
        </div>
        <Modal ref="addModal"
               large="true"
               title="添加图片"
               :showOkButton="false"
               :showCanelButton="false"
               @cancel="index=1">
            <!--  <ul class="nav nav-tabs">
                <li role="presentation" v-bind:class="{'active':index==1}">
                    <a @click="index=1">上传文件</a>
                </li>
                <li role="presentation" v-bind:class="{'active':index==2}">
                    <a @click="index=2">扫描图片</a>
                </li>
                <li role="presentation" v-bind:class="{'active':index==3}">
                    <a @click="index=3">拍照</a>
                </li>
            </ul> -->
            <button type="button"
                    class="btn btn-primary"
                    @click="index=3">拍照</button>
            <br>
            <div class="row">
                <div class="col-md-12">
                    <span v-if="index==1">
                        <Cropper :readonly="readonly"
                                 :scale="aspectRatio"
                                 @uploadImage="uploadImage($event)"></Cropper>
                    </span>
                    <span v-if="index==2">
                        <WebSocketImage @uploadImage="uploadImage($event)"
                                        :multiple="false"></WebSocketImage>
                    </span>
                    <span v-if="index==3">
                        <WebRtcImage @uploadImage="uploadImage($event)"
                                     :multiple="false"></WebRtcImage>
                    </span>
                </div>
            </div>
        </Modal>
        <Loading ref="loading"></Loading>
    </div>
</template>

<script>
    var Common = require("../../common/Common.js");
    var Notify = require("../Notify.js");
    var ImageService = require("./ImageService.js");
    var FileService = require("./FileService.js");

    var Modal = require("./Modal.vue");
    var Cropper = require("./Cropper.vue");
    var Loading = require("./Loading.vue");
    var WebRtcImage = require("./WebRtcImage.vue");
    var WebSocketImage = require("./WebSocketImage.vue");

    module.exports = {
        props: ["fieldValue", "className", "type", "readonly", "patternJson"],
        data: function () {
            return {
                show: false,
                aspectRatio: 4 / 3, // 图片裁剪比例,默认1.33
                index: 1
            };
        },

        components: {
            Common,
            Modal,
            WebSocketImage,
            WebRtcImage,
            Loading,
            Cropper
        },

        methods: {
            /**
             * 上传图片
             */
            uploadImage: function (dataURL) {
                console.log(dataURL + "----------");
                var _self = this;

                var blobImg = FileService.dataURLToPngBlob(dataURL);
                var nameImg = new Date().getTime() + ".png";

                var formData = new FormData();
                formData.append("className", this.className);
                formData.append("uploadImage", blobImg, nameImg);

                this.$refs.loading.show();
                ImageService.uploadImage(formData).then(imageName => {
                    if (_self.$refs && _self.$refs.loading) {
                        _self.$refs.loading.hide();
                    }
                    if (_self.$refs && _self.$refs.addModal) {
                        _self.$refs.addModal.show = false;
                    }

                    _self.emitFieldValue(imageName);
                }, errorData => {
                    if (_self.$refs && _self.$refs.loading) {
                        _self.$refs.loading.hide();
                    }
                });
            },

            /**
             * 触发FieldValue发生改变
             * @param {String} imageName 添加的图片名称
             */
            emitFieldValue: function (imageName) {
                var newFieldValue = {
                    displayValue: [],
                    fieldType: "String"
                };
                if (imageName != null) {
                    newFieldValue.displayValue[0] = imageName;
                }
                this.index = 1;
                this.$emit("valueChanged", newFieldValue);
            },

            /**
             * 显示上传图片的模态框
             */
            showUploadImageModal: function () {
                this.$refs.addModal.show = true;
            }
        },
        mounted: function () {
            //判断浏览器是否支持FileReader接口
            if (typeof FileReader == "undefined") {
                Common.showDialog("提示", "当前浏览器不支持FileReader接口", "error");
            }

            if (this.patternJson != undefined && this.patternJson != "") {
                try {
                    var pattern = JSON.parse(this.patternJson);
                    if (pattern.aspectRatio) {
                        this.aspectRatio = pattern.aspectRatio;
                    }
                } catch (e) {
                    console.log("pattern参数解析失败");
                }
            }
        },
        computed: {
            /**
             * 计算图片地址
             * @return {String} 图片URL地址
             */
            imageSrc: function () {
                var _self = this;
                if (
                    this.fieldValue != undefined &&
                    this.fieldValue.displayValue != undefined
                ) {
                    var imageName = this.fieldValue.displayValue[0];
                    return Common.getImageSrc(_self.className, imageName);
                } else {
                    return "";
                }
            },

            /**
             * 判断是否有图片
             * @return {Boolean} 是否有图片
             */
            hasImage: function () {
                if (
                    this.fieldValue != undefined &&
                    this.fieldValue.displayValue != undefined &&
                    this.fieldValue.displayValue[0] != undefined &&
                    this.fieldValue.displayValue[0].length > 0
                ) {
                    return true;
                } else {
                    return false;
                }
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

    .finish_room2>.room_img span {
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

    .room_add_img>span:nth-child(1) {
        margin-top: 20px;
        width: 40px;
        height: 40px;
        overflow: hidden;
    }

    .room_add_img>span:nth-child(2) {
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