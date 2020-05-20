<template>
	<div class="container-fluid">
		<Navbar :title="title">
			<span class="navbar-text"
				  @click="addNewInventory">新增&nbsp;&nbsp;</span>
		</Navbar>

		<div style="margin-top: 0.5em">
			<div class="form-group">
				<div class="input-group">
					<input id="barcode-input"
						   type="text"
						   class="form-control"
						   placeholder="存货名称/编号"
						   v-model.trim="message"
						   v-on:keyup.enter="queryInventory({num: 0, size: 10})">
					<div class="input-group-append">
						<label class="input-group-text"
							   for="inputGroupSelect02"
							   @click="clearText">&times;</label>
					</div>
				</div>
			</div>

			<div class="form-group">
				<div>
					<button type="button"
							class="btn btn-danger"
							@click="clear">清空</button>
					<button type="button"
							class="btn btn-primary"
							@click="queryInventory({num: 0, size: 10})">查询</button>
				</div>
			</div>
		</div>
		<!--mescroll滚动区域的基本结构-->
		<MescrollVue ref="mescroll"
					 class="mescroll"
					 :down="mescrollDown"
					 :up="mescrollUp"
					 @init="mescrollInit">

			<div>
				<div class="card-group"
					 v-if="(inventoryInstanceDatas == undefined || inventoryInstanceDatas.length == 0)">
					<div class="card bg-light">
						<div class="card-header">序号.编码</div>
						<div class="card-body">
							<p class="card-text">名称</p>
							<p class="card-text">规格型号</p>
						</div>
					</div>
				</div>
				<div class="card-group"
					 v-else>
					<div v-for="(data, index) in inventoryInstanceDatas">
						<div class="card bg-light"
							 :key="data.id">
							<div class="card-header">
								{{index + 1}}.编码：{{data.inventoryCode}}
								<span class="fa fa-cog fa-pull-right update-icon"
									  @click="update(data)"></span>
							</div>
							<div class="card-body">
								<div class="row">
									<div class="col-3"
										 v-if="showPictureOfApp == true">
										<ShowImage :imageNames="data.imageName"
												   :className="data.className"></ShowImage>
									</div>
									<div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'"
										 @click="showModal(data,index)">
										<p class="card-text">名称：{{data.inventoryName}}</p>
										<p class="card-text">规格型号：{{data.inventoryType}}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MescrollVue>

		<!-- 修改存货数量和批号的模态框 -->
		<Modal ref="modal"
			   title="打印信息"
			   large="true">
			<div slot="body">
				<div>
					<div class="form-group">
						<label>数量</label>
						<input type="number"
							   class="form-control"
							   v-model="quantity">
					</div>
					<div class="form-group">
						<label>批号</label>
						<input type="text"
							   class="form-control"
							   v-model="batchNo">
					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
					<button type="button"
							class="btn btn-primary"
							@click="generatePack">打印</button>
					<button type="button"
							class="btn btn-danger"
							@click="modalCancel">取消</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var InventoryResource = require("../api/commom/InventoryResource.js");
	var InventoryInstancePrintResource = require("../api/wms/InventoryInstancePrintResource.js");
	var InventoryInstanceWmsResource = require("../api/wms/InventoryInstanceWmsResource.js");
	var Notify = require("../widget/Notify.js");
	var Modal = require("../widget/Modal.vue");
	var Loading = require("../common/Loading.js");
	var vSelect = require("vue-select");
	var Navbar = require("../widget/Navbar.vue");

	var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");

	var MescrollVue = require("mescroll.js/mescroll.vue");
	var ShowImage = require("../widget/imageWidget/ShowImage.vue");
	var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

	module.exports = {
		components: {
			Common,
			Modal,
			"v-select": vSelect.VueSelect,
			Navbar,
			ImageEditor,
			MescrollVue,
			ShowImage,

		},
		data: function () {
			return {
				title: "存货打印",
				message: "",
				inventoryInstanceDatas: [],
				recordIds: [],
				inventoryId: null,
				quantity: "",
				batchNo: "",
				inventoryClasses: [],
				inventoryClass: null,
				imageURL: null,
				isReadonly: false,
				recordId: undefined,
				mescroll: null, // mescroll实例对象
				mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
				mescrollUp: { // 上拉加载的配置.
					auto: true, // 是否在初始化完毕之后自动执行上拉回调callback; 默认true
					callback: this.queryInventory, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
					//以下是一些常用的配置,当然不写也可以的.
					page: {
						num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
						size: 10 //每页数据条数,默认10
					},
					htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
					//避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					//这就是为什么无更多数据有时候不显示的原因
					toTop: {
						//回到顶部按钮
						src: "/static-wms-app/image/mescroll-totop.png", //图片路径,默认null,支持网络图
						offset: 1000 //列表滚动1000px才显示回到顶部按钮
					},
				},
				showPictureOfApp: false,
			}
		},

		methods: {

			getImageURL: function (dataURL) {
				// this.imageURL = dataURL;

				this.imageURL = dataURL.displayValue[0];
				console.log(this.imageURL + "(((((((((((((((((((");
			},

			//存货新增
			addNewInventory: function () {
				this.$router.push({
					path: '/desktop/inventoryPrintCreat',
				})
			},

			//存货编辑
			update: function (data) {
				this.$router.push({
					path: '/desktop/InventoryPrintUpdate',
					query: {
						recordId: data.inventoryId,
					}
				})
			},

			/**
			 * 清空文本框内的文本
			 */
			clearText: function () {
				this.message = "";
			},

			//导航栏返回上一级
			back: function () {
				this.$router.push('/desktop/dashboard');
			},

			/**
			 * 清空数据
			 */
			clear: function () {
				this.inventoryInstanceDatas = [];
				// this.positions = [];
				this.message = "";
				this.mescroll.setPageNum(0);
			},

			showModal: function (inventory) {
				this.quantity = 1;
				this.batchNo = '';
				this.inventoryId = inventory.inventoryId;
				this.$refs.modal.show();
			},

			modalCancel: function () {
				this.$refs.modal.hide();
			},

			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
			},

			/**
			 * 根据存货名称或编号查询
			 */
			queryInventory: function (page, mescroll) {
				var _self = this;
				this.mescroll.setPageNum(page.num);
				
				var message = $.trim(this.message);

				if (page.num == 0) {
					_self.inventoryInstanceDatas.splice(0, _self.inventoryInstanceDatas.length);
				}

				var uuid = Loading.show();
				let inventoryQueryCodition = {
					"name": message,
					"no": message,
					"type": message,
					"start": page.num * page.size,
					"length": page.size
				}
				InventoryResource.findByQueryCodition(inventoryQueryCodition).then(successData => {
					Loading.hide(uuid);
					successData.dataList.forEach(function (item) {
						var newInventoryInstance = {
							"inventoryName": item.name,
							"inventoryCode": item.no,
							"inventoryType": item.type,
							"inventoryClassId": item.inventoryClassId,
							"imageNames": item.imageNames,
							"quantity": 1,
							"batchNo": "",
							"inventoryId": item.id,
							"imageName": item.imageNames,
							"className": item.className,
						};
						_self.inventoryInstanceDatas.push(newInventoryInstance);
					});
					if (mescroll != null) {
						mescroll.endBySize(successData.dataList.length, successData.totalSize);
					}

				}, errorData => {
					Loading.hide(uuid);
					if (mescroll != null) {
						_self.mescroll.endErr();
					}
					Common.processException(errorData);
				});
			},

			/**
			 * 打印存货
			 */
			generatePack: function () {
				var _self = this;

				if (this.quantity) {
					if (parseInt(this.quantity) != this.quantity || this.quantity <= 0) {
						Notify.error("提示", "数量：请填写正整数", true);
						return;
					}
				} else {
					Notify.error("提示", "请填写数量", true);
					return;
				}

				let inventoryInstanceDtos = [{
					"inventoryId": _self.inventoryId,
					"batchNo": _self.batchNo,
					"packageCount": 1,
					"quantity": _self.quantity,
				}];

				InventoryInstanceWmsResource.generateInventoryInstances(inventoryInstanceDtos).then(successData => {
					_self.$refs.modal.hide();

					var recordIds = [];
					successData.forEach(function (item) {
						recordIds.push(item.id);
					});

					InventoryInstancePrintResource.print(recordIds).then(successData1 => {
						if (successData1 != null && successData1.length > 0) {
							plugin.bluetoothPrinter.print(JSON.stringify(successData1[0]));
						}
					}, errorData => {
						Common.processException(errorData);
					});

				}, errorData => {
					_self.$refs.modal.hide();
					Common.processException(errorData);
				});
			},

			/**
			 * 获取仓库配置
			 */
			getWmsSettingDto: function () {
				var _self = this;
				WmsSettingResource.unique().then(
					successData => {
						_self.showPictureOfApp = successData.showPictureOfApp;
					},
					errorData => {
						Common.processException(XMLHttpRequest);
					}
				);
			},

		},

		mounted: function () {
			this.getWmsSettingDto();
		}
	}
</script>

<style scoped>
	.mescroll {
		position: fixed;
		top: 10rem;
		bottom: 0;
		height: auto;
		left: 0;
		right: 0;
		padding-left: 15px;
		padding-right: 15px;
	}
</style>

<style scoped>
	.card {
		margin-top: 5px;
		height: 100%;
	}

	.card-header {
		padding: 0.3rem 0.3rem;
	}

	.card-body {
		padding: 0.5rem;
	}

	.card-footer {
		padding: 0.1rem;
	}

	.card-body row col-3 {
		padding-left: 0px;
		padding-right: 0px;
	}
</style>