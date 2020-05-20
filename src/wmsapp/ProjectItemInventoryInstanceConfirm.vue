<template>
	<div class="container-fluid">
		<Navbar title="项目物料清单">
			<div class="form-inline">
				<button type="button"
						class="btn btn-success"
						@click="submit()">提交</button>
			</div>
		</Navbar>
		<div>
			<div class="form-group">
				<input class="form-control"
					   type="button"
					   v-model="projectNoAndName"
					   @click="pickerVisible = true" />
			</div>
		</div>

		<div style="margin-top:-10px;">
			<ul class="nav nav-pills nav-fill selected-tab">
				<li class="nav-item"
					@click="selectTab('inventory')">
					<a class="nav-link"
					   id="nav-link1"
					   :class="{'active': (selectedTab === 'inventory')}"
					   href="javascript:void(0)">物料信息({{_self.inventoryDtos.length}})</a>
				</li>
				<li class="nav-item"
					@click="selectTab('inventoryInstance')">
					<a class="nav-link"
					   id="nav-link2"
					   :class="{'active': (selectedTab === 'inventoryInstance')}"
					   href="javascript:void(0)">物料详细信息({{_self.inventoryInstanceDtos.length}})</a>
				</li>
			</ul>
		</div>

		<MescrollVue ref="mescroll"
					 class="mescroll"
					 :down="mescrollDown"
					 :up="mescrollUp"
					 @init="mescrollInit"
					 style="margin-top: 10px">
			<div v-show="selectedTab == 'inventory'">
				<div v-for="(data, index) in inventoryDtos"
					 :key="index"
					 style="display :flex;">
					<div class="card">
						<div class="card-header"
							 @click="displayComponents(data)">
							{{index+1}}.{{data.no}},{{data.name}}{{(data.inventoryClass == undefined || data.inventoryClass == null) ? "" : "("+data.inventoryClass+")"}}
						</div>
						<div class="card-body">
							<div class="row">
								<div class="col-3"
									 v-if="showPictureOfApp == true">
									<ShowImage :imageNames="data.imageNames"
											   :className="data.className"></ShowImage>
								</div>
								<div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
									<div class="d-flex justify-content-between">
										<div class="p-2">数量:{{data.quantity}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-show="selectedTab == 'inventoryInstance'">
				<div v-for="(data, index) in inventoryInstanceDtos"
					 :key="index">
					<div class="card">
						<div class="card-header">{{index+1}}.{{data.no}},{{data.inventoryName}}</div>
						<div class="card-body">
							<div class="row">
								<div class="col-3"
									 v-if="showPictureOfApp == true">
									<ShowImage :imageNames="data.inventoryInstanceImageName"
											   :className="data.className"></ShowImage>
								</div>
								<div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
									<div class="d-flex justify-content-between">
										<div>EPC:{{data.epc}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MescrollVue>

		<VuePicker :data="projectItems"
				   :showToolbar="true"
				   @confirm="selectProjectItem($event, null)"
				   :visible.sync="pickerVisible" />

		<!-- 模态框 -->
		<div class="modal fade"
			 id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">

					<!-- 模态框头部 -->
					<div class="modal-header">
						<h5 class="modal-title">{{projectItemInventoryDto.no}},{{projectItemInventoryDto.name}},{{projectItemInventoryDto.type}}</h5>
						<button type="button"
								class="close"
								data-dismiss="modal">&times;</button>
					</div>

					<!-- 模态框主体 -->
					<div class="modal-body">
						<div v-for="(data, index) in projectItemInventoryDto.projectItemComponentInventoryDtos"
							 :key="index">
							<div class="card">
								<div class="card-body">
									<div class="row">
										<div class="col-3"
											 v-if="showPictureOfApp == true">
											<ShowImage :imageNames="data.inventoryInstanceImageName"
													   :className="data.className"></ShowImage>
										</div>
										<div class="{'col': (showPictureOfApp == true ? '12' : '9')}">
											<div class="d-flex justify-content-between">
												<div class="p-2">{{index+1}},{{data.no}},{{data.name}},{{data.type}}</div>
												<div class="p-2">数量:{{data.quantity}}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 模态框底部 -->
					<div class="modal-footer">
						<button type="button"
								class="btn btn-secondary"
								data-dismiss="modal">关闭</button>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Loading = require("../common/Loading.js");
	var Notify = require("../widget/Notify.js");
	var ProjectItemResource = require("../api/commom/ProjectItemResource.js");
	var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
	var ProjectItemCheckVouchResource = require("../api/wms/ProjectItemCheckVouchResource.js");
	var Modal = require("../widget/Modal.vue");
	var ScanWidget = require("../widget/ScanWidget.vue");
	var Navbar = require("../widget/Navbar.vue");
	var VuePicker = require("../widget/VuePicker/VuePicker.vue");
	var PullTo = require("vue-pull-to").default;
	var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");

	var MescrollVue = require("mescroll.js/mescroll.vue");
	var ShowImage = require("../widget/imageWidget/ShowImage.vue");
	var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

	module.exports = {
		data: function () {
			return {
				projectNoAndName: "选择项目事件",
				projectItemId: undefined,
				projectItems: [
					[]
				],
				selectedTab: "inventory",
				inventoryDtos: [],
				inventoryInstanceDtos: [],
				start: 0,
				length: 10,
				count: 1,
				pageToSize: 0,
				start2: 0,
				length2: 10,
				count2: 1,
				pageToSize2: 0,
				pickerVisible: false,

				mescroll: null, // mescroll实例对象
				mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
				mescrollUp: {
					// 上拉加载的配置.
					auto: true, // 是否在初始化完毕之后自动执行上拉回调callback; 默认true
					callback: this.pullupRefresh, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
					//以下是一些常用的配置,当然不写也可以的.
					page: {
						num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
						size: 10 //每页数据条数,默认5
					},
					htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
					//避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					//这就是为什么无更多数据有时候不显示的原因
					toTop: {
						//回到顶部按钮
						src: "/static-wms-app/image/mescroll-totop.png", //图片路径,默认null,支持网络图
						offset: 1000 //列表滚动1000px才显示回到顶部按钮
					}
				},
				showPictureOfApp: false,
				projectItemInventoryDto: {},
			};
		},
		components: {
			Common,
			Modal,
			ScanWidget,
			Navbar,
			VuePicker,
			PullTo,
			ImageEditor,
			MescrollVue,
			ShowImage
		},
		methods: {
			// 点击查看工具箱内部内容
			displayComponents: function (data) {
				var _self = this;
				if (data.projectItemComponentInventoryDtos.length <= 0) {
					return;
				}
				_self.projectItemInventoryDto = data;
				$('#myModal').modal('show');
			},
			// 点击查询项目
			selectProjectItem: function (selectProjectItem) {
				var _self = this;
				_self.projectItemId = selectProjectItem[0].value;
				_self.projectNoAndName = selectProjectItem[0].label;

				_self.inventoryDtos = [];
				_self.inventoryInstanceDtos = [];
				_self.start = 0;
				_self.length = 10;
				_self.count = 1;
				_self.pageToSize = 0;
				_self.start2 = 0;
				_self.length2 = 10;
				_self.count2 = 1;
				_self.pageToSize2 = 0;
				_self.findInventoryByProjectItem(this.mescroll);
				// _self.findInventoryInstanceByProjectItem(this.mescroll);
			},

			selectTab: function (tab) {
				this.selectedTab = tab;
			},

			// 刷新
			reload: function () {
				location.reload();
			},

			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
			},

			// 清空
			clear: function () {
				var _self = this;
				_self.projectItemId = undefined;
				_self.projectNoAndName = "请选择项目事件";
				_self.inventoryDtos = [];
				_self.inventoryInstanceDtos = [];
				_self.start = 0;
				_self.length = 10;
				_self.count = 1;
				_self.pageToSize = 0;
				_self.start2 = 0;
				_self.length2 = 10;
				_self.count2 = 1;
				_self.pageToSize2 = 0;
			},
			// 点击物料
			clickInventory: function () {
				this.clickTab = "inventory";
			},
			// 点击物料详细信息
			clickInventoryInstance: function () {
				this.clickTab = "inventoryInstance";
			},

			// 查询所有项目事件
			findAllProjectItem: function () {
				var _self = this;
				ProjectItemResource.queryByCondition(null).then(
					successData => {
						if (successData) {
							var temps = [];
							successData.forEach(function (item) {
								var temp = {
									value: item.id,
									label: item.no + "," + item.name
								};
								_self.projectItems[0].push(temp);
							});
						}
					},
					errorData => {
						Common.processException(errorData);
					}
				);
			},

			// 根据项目事件查询存货
			findInventoryByProjectItem: function (mescroll) {
				var _self = this;
				var range = {
					start: _self.start,
					length: _self.length
				};

				if (_self.projectItemId != undefined && _self.projectItemId != null) {
					InventoryInstanceResource.findInventoryByProjectItem(
						_self.projectItemId,
						range
					).then(
						successData => {
							var totalSize = successData != null ? successData.totalSize : 0;
							if (successData) {
								if (successData && successData.totalSize > 0) {
									_self.inventoryDtos = _self.inventoryDtos.concat(
										successData.dataList
									);
									_self.start = _self.start + _self.length;
									_self.pageToSize = Math.round(
										successData.totalSize / _self.length
									);
								}
							}

							if (mescroll != null) {
								mescroll.endBySize(_self.length, totalSize);
							}
						},
						errorData => {
							if (mescroll != null) {
								_self.mescroll.endErr();
							}
							Common.processException(errorData);
						}
					);
				}
			},
			// 根据项目事件查询存货实例
			findInventoryInstanceByProjectItem: function (mescroll) {
				var _self = this;
				var range = {
					start: _self.start2,
					length: _self.length2
				};
				if (_self.projectItemId != undefined && _self.projectItemId != null) {
					InventoryInstanceResource.findByProjectItem(
						_self.projectItemId,
						range
					).then(
						successData => {
							if (successData && successData.totalSize > 0) {
								_self.inventoryInstanceDtos = _self.inventoryInstanceDtos.concat(
									successData.dataList
								);
								_self.start2 = _self.start2 + _self.length2;
								_self.pageToSize2 = Math.round(
									successData.totalSize / _self.length2
								);
							}

							var totalSize = successData != null ? successData.totalSize : 0;

							if (mescroll != null) {
								console.log(
									totalSize +
									"______" +
									_self.pageToSize2 +
									"____" +
									_self.length2
								);
								mescroll.endBySize(_self.length2, totalSize);
							}
						},
						errorData => {
							if (mescroll != null) {
								_self.mescroll.endErr();
							}
							Common.processException(errorData);
						}
					);
				}
			},

			pullupRefresh: function (page, mescroll) {
				if (this.selectedTab == "inventory") {
					this.pullupRefresh1(page, mescroll);
				} else if (this.selectedTab == "inventoryInstance") {
					this.pullupRefresh2(page, mescroll);
				}
			},

			//上拉加载
			pullupRefresh1: function (page, mescroll) {
				var _self = this;
				if (_self.projectItemId == undefined || _self.projectItemId == null) {
					if (mescroll != null) {
						mescroll.endBySize(_self.length, 0);
					}
				} else {
					_self.findInventoryByProjectItem(mescroll);
				}
			},

			//上拉加载
			pullupRefresh2: function (page, mescroll) {
				var _self = this;
				if (_self.projectItemId == undefined || _self.projectItemId == null) {
					if (mescroll != null) {
						mescroll.endBySize(_self.length, 0);
					}
				} else {
					_self.findInventoryInstanceByProjectItem(mescroll);
				}
			},

			// 生成检查单
			submit: function () {
				var _self = this;
				var uuid = Loading.show();
				ProjectItemCheckVouchResource.saveProjectItemCheckVouch(
					_self.projectItemId
				).then(
					successData => {
						Loading.hide(uuid);
						if (successData == true) {
							Notify.success("成功", "项目事件检查单保存完成.", false);
						}
					},
					errorData => {
						Loading.hide(uuid);
						Common.processException(errorData);
					}
				);
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
			}
		},

		mounted: function () {
			var _self = this;
			_self.findAllProjectItem();
			_self.getWmsSettingDto();
		}
	};
</script>

<style scoped>
	.card {
		margin-top: 5px;
		width: 100%;
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