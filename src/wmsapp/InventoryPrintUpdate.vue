<template>

	<div class="container-fluid">

		<!--    <nav class="navbar navbar-fixed-top navbar-light bg-faded header">
      <a class="navbar-brand" href="javascript:void(0);">
        <span class="fa fa-arrow-circle-o-left back-icon" @click="back">返回</span>

        <span class="fa fa-save fa-pull-right save-icon" @click="save">保存</span>
      </a>
    </nav> -->
		<Navbar :title="title">
			<span class="navbar-text"
				  @click="save">保存&nbsp;&nbsp;</span>
		</Navbar>

		<h6></h6>

		<div slot="body">
			<div>

				<div class="form-group">
					<label>存货名称</label>
					<input type="text"
						   class="form-control"
						   v-model.trim="inventoryDto.name">
				</div>

				<div class="form-group">
					<label>存货编号</label>
					<input type="text"
						   class="form-control"
						   v-model.trim="inventoryDto.no">
				</div>

				<div class="form-group">
					<label for="barCodeSelect">存货分类</label>
					<div class="v-select-container">
						<v-select id="barCodeSelect"
								  label="barCode"
								  :options="inventoryNoAndNames"
								  v-model="inventoryClassNoAndName"></v-select>
					</div>
				</div>

				<div class="form-group">
					<label>规格型号</label>
					<input type="text"
						   class="form-control"
						   v-model.trim="inventoryDto.type">
				</div>

				<div>

					<div>
						<label>图片选择</label>
					</div>

					<div class="file-box">
						<input type="file"
							   accept="image/*"
							   capture="camera"
							   id="btn-camear"
							   @change="onTake($event)"
							   class="file-btn">
						<span style="font-size:15px">上传图片</span>
						<span class="mui-icon mui-icon-upload"
							  style="float:right;position:relative;color: #fff; width: 20px;height: 20px;"></span>
					</div>

					<div class="image-box">
						<img id="image"
							 v-lazy="getImage()"
							 data-preview-src=""
							 data-preview-group="1"
							 v-if="imageName != ''"
							 style="width: 60%;height: 60%;" />
					</div>

				</div>

			</div>
		</div>
	</div>
</template>

<script>
	//声明插件变量
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var Loading = require("../common/Loading.js");
	var Modal = require("../widget/Modal.vue");
	var vSelect = require("vue-select");
	var Pagination = require("../widget/VueBootstrapPagination.vue");
	var Navbar = require("../widget/Navbar.vue");
	var InventoryClassResource = require("../api/commom/InventoryClassResource.js");
	var InventoryResource = require("../api/commom/InventoryResource.js");
	var FileResource = require("../api/dic/FileResource.js");
	//开始
	module.exports = {

		//1.引入插件
		components: {
			Common,
			Modal,
			"v-select": vSelect.VueSelect,
			Pagination,
			Navbar,
		},

		//2.双向绑定变量区
		data: function () {
			return {
				title: "存货编辑",
				showImages: {
					who: undefined,
					images: undefined
				}, //选择的图片[]
				inventoryDto: {
					id: "",
					name: "",
					no: "",
					imageNames: "",
					type: "",
					inventoryClassId: "",
				},
				inventoryClassNoAndName: "",
				inventoryNoAndNames: [],
				inventoryClassDto1s: [],
				recordId: "",
				className: 'com.leanwo.prodog.model.common.Inventory',
				imageName: '',

			}
		},

		//3.方法区
		methods: {
			//捕获图片
			onTake: function (dataURL) {
				var _self = this;
				// var eImgBase64 = null;
				// var canVas = $('#cropper').cropper("getCroppedCanvas", {});
				// eImgBase64 = canVas.toDataURL();
				// _self.compressFile(eImgBase64);
				var file = document.getElementById('btn-camear').files[0];
				if (file == undefined) {
					return false;
				}
				var reader = new FileReader();
				reader.onload = function (e) {
					_self.compressFile(e.target.result).then(function (successData) {
						// 上传图片，得到imageName
						_self.uploadImage(successData);
					}, function (errorData) {});
				}
				reader.readAsDataURL(file);


			},

			//压缩图片
			compressFile: function (targetResult) {
				let image = new Image(); //新建一个img标签（还没嵌入DOM节点)
				image.src = targetResult;

				var imageQuality = localStorage.getItem("imageQuality");

				var imageWidth, imageHeight;
				if (imageQuality == 1) {
					// 1080P  1920*1080
					imageWidth = 1920;
					imageHeight = 1080;
				} else if (imageQuality == 2) {
					// 720P 1280x720
					imageWidth = 1280;
					imageHeight = 720;
				} else {
					imageWidth = 1024;
					imageHeight = 768;
				}

				return new Promise(function (resolve, reject) {
					image.onload = function () {
						let canvas = document.createElement('canvas');
						let context = canvas.getContext('2d');
						let data = '';


						if (image.width > imageWidth || image.height > imageHeight) {
							canvas.width = imageWidth;
							canvas.height = imageHeight;
							context.drawImage(image, 0, 0, imageWidth, imageHeight);
						} else {
							canvas.width = image.width;
							canvas.height = image.height;
							context.drawImage(image, 0, 0, image.width, image.height);
						}

						data = canvas.toDataURL('image/jpeg');
						resolve(data);
					}

					image.onerror = function () {
						reject();
					}
				});
			},

			/**
			 * 上传图片
			 * @param  {File} selectedFile 选择的文件
			 */
			uploadImage: function (dataURL) {
				var _self = this;
				var formData = new FormData();
				formData.append("className", _self.className);
				for (var i = 0; i < dataURL.split("|").length; i++) {
					var nameImg = new Date().getTime() + ".png";
					var blobImg = _self.dataURLToPngBlob(dataURL.split("|")[i]);
					formData.append("uploadImage", blobImg, nameImg);

					$.ajax({
						url: Common.getApiURL("file/imgUpload"),
						async: false,
						type: "post",
						beforeSend: function (request) {
							Common.addTokenToRequest(request);
						},
						data: formData,
						contentType: false,
						processData: false,
						success: function (data) {
							_self.imageName = data;

						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							Common.processException(XMLHttpRequest, textStatus, errorThrown);
						}
					});
				}
			},

			/**
			 * DataURL转Png Blob对象
			 */
			dataURLToPngBlob: function (dataurl) {
				var arr = dataurl.split(",");
				var mime = arr[0].match(/:(.*?);/)[1];
				var bstr = atob(arr[1]);
				var n = bstr.length;
				var u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: "image/png"
				});
			},

			getImage: function () {
				var _self = this;
				var imageUrl = Common.getImageSrc(_self.className, _self.imageName);
				return imageUrl;
			},

			//保存新增存货
			save: function () {
				var _self = this;
				if (_self.inventoryDto.name == "" || _self.inventoryDto.no == "" || _self.inventoryDto.type == "" || _self.inventoryClassNoAndName ==
					"" || _self.inventoryClassNoAndName == null) {
					Notify.error("错误", "请填写完整后重试", true);
					return;
				} else {
					var arr = _self.inventoryClassNoAndName.split(",");
					for (var i = 0; i < _self.inventoryClassDto1s.length; i++) {
						if (_self.inventoryClassDto1s[i].no == arr[0] && _self.inventoryClassDto1s[i].name == arr[1]) {
							_self.inventoryDto.inventoryClassId = _self.inventoryClassDto1s[i].id;
						}
					};
				};
				var uuid = Loading.show();
				_self.inventoryDto.imageNames = _self.imageName;
				//校验数据完整
				console.log(JSON.stringify("传入后台数据 => " + _self.inventoryDto));
				InventoryResource.update(_self.inventoryDto).then(
					successData => {
						Loading.hide(uuid);
						Notify.success("提示", "成功修改存货档案");
					},
					errorData => {
						Loading.hide(uuid);
						Common.processException(errorData);
					}
				);
			},

			queryAll: function () {
				var _self = this;
				var uuid = Loading.show();
				InventoryClassResource.findByClientId().then(
					successData => {
						Loading.hide(uuid);
						_self.inventoryClassDto1s = successData;
						for (var i = 0; i < successData.length; i++) {
							_self.inventoryNoAndNames.push(successData[i].no + "," + successData[i].name)
							if (successData[i].id == _self.inventoryDto.inventoryClassId) {
								_self.inventoryClassNoAndName = successData[i].no + "," + successData[i].name;
							}
						}
					},
					errorData => {
						Loading.hide(uuid);
						Common.processException(errorData);
					}
				);
			},

			findByIdAndClientId: function (recordId) {
				var _self = this;
				var uuid = Loading.show();
				_self.inventoryDto = {};
				var id = recordId;
				InventoryResource.findByIdAndClientId(id).then(
					successData => {
						Loading.hide(uuid);
						_self.inventoryDto = successData;
						console.log("_self.inventoryDto.imageNames ==> " + _self.inventoryDto.imageNames);
						if (_self.inventoryDto.imageNames != undefined) {
							_self.imageName = _self.inventoryDto.imageNames;
						}
					},
					errorData => {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest);
					}
				);
			},

			//导航栏返回上一级
			back: function () {
				this.$router.push({
					path: '/desktop/PrintInventory',
				})
			},

		},

		//4.初始化页面
		mounted: function () {
			var id = this.$route.query.recordId;
			this.findByIdAndClientId(id);
			this.queryAll();
		},

	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}

	/* 导航栏样式 */
	.header {
		margin-left: -29px;
		margin-right: -29px;
		padding-left: 29px;
	}

	.back-icon {
		font-size: 1.25em;
		line-height: 1.25em;
	}

	.save-icon {
		font-size: 1.25em;
		line-height: 1.25em;
	}

	/* 图片上传样式 */
	.mui-btn {
		margin-bottom: 10px;
		text-align: left;
		margin: 0px 0px 15px 0px;
	}

	.btn-print {
		height: 30px;
		line-height: 16px;
		padding: 0px 15px;
	}

	.file-box {
		display: inline-block;
		position: relative;
		padding: 3px 5px;
		overflow: hidden;
		color: #fff;
		background-color: #007AFF;
		border-radius: 5px;

	}

	.file-btn {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		outline: none;
		background-color: transparent;
		filter: alpha(opacity=0);
		-moz-opacity: 0;
		-khtml-opacity: 0;
		opacity: 0;
	}
</style>