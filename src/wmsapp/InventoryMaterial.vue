<template>
	<div class="container-fluid">

		<Navbar title="物料RFID盘点"></Navbar>
		<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		<h6></h6>
		<div class="form-horizontal">
			<div class="form-group">
				<fieldset class="form-group">
					<div class="mui-content-padded">
						<div class="row">
							<div class="col-10 col-xs-10">
								<v-select label="message" :options="checkVouchDatas" v-model="checkVouch" placeholder="盘点单名称 (单据号)"></v-select>
							</div>
							<div class="col-2 col-xs-2">
								<button @click="addNewInventoryMaterial" class="btn btn-primary btn-sm" style="margin-left: -28px;width: 61px;height: 33px;left: 32px;" type='button'>新增</button>
							</div>
						</div>
					</div>
				</fieldset>
			</div>

			<fieldset class="form-group">
				<div class="v-select-container">
					<v-select label="positionBarCode" :options="positions" v-model="position" placeholder="货位"></v-select>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<div>
					<button class="btn btn-info btn-sm">盘点总数：{{inventoryInstances.length}}</button>
					<button type="button" class="btn btn-danger btn-sm" @click="clear">清空信息</button>
					<button type="button" class="btn btn-primary btn-sm" @click="submitData">提交</button>
				</div>
			</fieldset>
		</div>
		
		<div class="card-group m-card-item" v-if="(inventoryInstances == undefined || inventoryInstances.length == 0)">
			<div class="card bg-light">
				<div class="card-header">序号 存货编号</div>
				<div class="card-block">
					存货名称：
					存货编号：
				</div>
			</div>
		</div>
		<div class="row" v-else>
			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryInstances">
				<div class="card bg-light">
					<div class="card-header">
						{{index + 1}}.存货编号：{{data.no}}
						<button type="button" class="close" aria-label="Close" @click="deleteOneInstance(index)"><span aria-hidden="true">&times;</span></button>
					</div>
					<div class="card-block" @click="showModal(data,index)">
						存货名称：{{data.inventoryName}}
						存货编号：{{data.no}}
					</div>
				</div>
			</div>
		</div>
		
		
		<Modal ref="modal2" title="请选择要盘点的明细" large="true">
			<div slot="body">
				<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryInstances">
					<div class="card bg-light">
						<div class="card-header">
							{{index + 1}}.存货编号：{{data.no}}
						</div>
						<div class="card-block">
							<p class="card-text">名称：{{data.inventoryName}}</p>
							<p class="card-text">编号：{{data.no}}</p>
						</div>
						<div class="card-footer text-center">
							<button type="button" class="btn btn-primary" @click="chooseData(data)">选定</button>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
					<button type="button" class="btn btn-danger btn-sm" @click="modalCancel2">取消</button>
				</div>
			</div>
		</Modal>

		<Modal ref="modal3" title="创建盘点单" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
						<label>单据名称</label>
						<input type="text" class="form-control" v-model.trim="name">
					</div>
					<div class="form-group">
						<label>盘点仓库</label>
						<div class="v-select-container">
							<v-select label="name" :options="warehouses" v-model="warehouse"></v-select>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
					<button type="button" class="btn btn-primary" @click="generateInventoryMaterial">添加</button>
					<button type="button" class="btn btn-danger" @click="modalCancel3">取消</button>
				</div>
			</div>
		</Modal>
		<Modal ref="modal4" title="删除盘点数据" large="true">
			<div slot="footer">
				<div>
					<button type="button" class="btn btn-primary" @click="deleteOne(index)">删除</button>
					<button type="button" class="btn btn-danger" @click="modalCancel4">取消</button>
				</div>
			</div>
		</Modal>
		
		<!-- <div class="row">
			<div class="col-md-12">
				<ul class="nav nav-tabs">
				  <li role="presentation" v-bind:class="{active: functionType==1}" @click = "selectPage(1)"><a href="javascript:void(0)">盘点</a></li>
				  <li role="presentation" v-bind:class="{active: functionType==2}" @click = "selectPage(2)"><a href="javascript:void(0)">未盘点</a></li>
				  <li role="presentation" v-bind:class="{active: functionType==3}" @click = "selectPage(3)"><a href="javascript:void(0)">已盘点</a></li>
				</ul>
			</div>
		</div> -->
		
		
		
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var vSelect = require("vue-select");
	var Modal = require("../widget/Modal.vue");
	var Loading = require("../common/Loading.js");
	var ScanWidget = require("../widget/ScanWidget.vue");
	var Navbar = require("../widget/Navbar.vue");

	module.exports = {
		components: {
			Common,
			"v-select": vSelect.VueSelect,
			Modal,
			ScanWidget,
			Navbar
		},
		data: function() {
			return {
				inventoryInstances: [],
				epcSet: [],
				positions: [],
				positionBarCode: "",
				positionId : "",
				checkVouchDatas: [],
				checkVouch: "",
				barCode: "",
				checkVouchsDatas: [],
				datas: "",
				index: "",
				checkQuantity: "",
				position: "",
				warehouses: [],
				warehouse: null,
				name: "",
				unMaterialDatas: [],
			}
		},

		methods: {
			
			clear: function() {
				this.checkVouchsDatas.splice(0, this.checkVouchsDatas.length);
				this.inventoryInstances.splice(0, this.inventoryInstances.length);
				this.epcSet =[];
				//this.cacheData.splice(0, this.cacheData.length);
			},
			
			/**
			 * 删除索引为index的存货
			 */
			deleteOne: function (index) {
			    var epc = this.inventoryInstances[index].epc;
			    for (var i = 0; i < this.epcSet.length; i++) {
			        if (this.epcSet[i].epc == epc) {
			            this.epcSet.splice(i, 1);
			        }
			    }
			    this.inventoryInstances.splice(index, 1);
				this.modalCancel4();
			},

			addEpc: function(epc) {
				var _self = this;
				if (_self.contains(epc)) {
					return;
				}
				var temp = {
					"epc": epc,
					"status": 1,
					"message": "",
					"productNo": ""
				};
				_self.epcSet.push(temp);
			},
			
			contains: function(epc) {
				var _self = this;
				if (_self.epcSet && epc) {
					for (var i = 0; i < _self.epcSet.length; i++) {
						if (_self.epcSet[i].epc == epc) {
							return true;
						}
					}
				}
				return false;
			},
			

			initEvent: function() {
				var _self = this;
				plugin.barCode.scanEvent = function(barCodeStrs) {
					if (barCodeStrs != undefined && barCodeStrs.length > 0) {
						var barCodes = barCodeStrs.split(",");
						_self.barCode = barCodes[0];
						_self.getCheckVouch();
					}
				}
			},

			startScan: function() {
				if (typeof(ZXING_SCANNER) == "undefined") {
					this.wechatScan();
				} else {
					plugin.barCode.scan(false);
				}
			},

			scanResult: function(event) {
				var _self = this;
				_self.barCode = event.detail.barCode;
				_self.getCheckVouch();
			},

			wechatScan: function() {
				this.$refs.scanWidget.startScan();
			},
			scanCallback: function(result) {
				var index = result.indexOf(",");
				var barCode = result.slice(index + 1);
				this.barCode = barCode;
				this.getCheckVouch();
			},
			
			/**
			 * 查询未盘点清单
			 */
			needMaterIalLines: function() {
				if (!this.checkVouch) {
					Notify.error("提示", "您还未选择盘点单。", true);
					return;
				}
				//alert(this.checkVouch.id);
				var inventoryMaterialId = this.checkVouch.id;
				var _self = this;
				$.ajax({
					url: Common.getApiURL("inventoryMaterialAppResource/queryNeedMaterialLine"),
					type: "get",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					data: {
						"inventoryMaterialId": inventoryMaterialId,
					},	
					success: function(data) {
						_self.needInventoryInstances = data;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);	
					}
				})
			},

			/**
			*  查询已盘点清单
			*/
			checkLoss: function() {
				if (!this.checkVouch) {
					Notify.error("提示", "您还未选择盘点单。", true);
					return;
				}
				var inventoryMaterialId = this.checkVouch.id;
				var _self = this;
				$.ajax({
					url: Common.getApiURL("inventoryMaterialAppResource/queryMaterialLine"),
					type: "get",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					data: {
						"inventoryMaterialId": inventoryMaterialId,
					},	
					success: function(data) {
						_self.inventoryInstances = data;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);	
					}
				})
			},
			
			
			queryWarehouse: function() {
				var _self = this;
				$.ajax({
					url: Common.getApiURL("WarehouseResource/all"),
					type: "get",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						_self.warehouses = data;
						if (data.length == 1) {
							_self.warehouse = data[0];
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			addNewInventoryMaterial: function() {
				this.warehouse = null;
				this.name = "";
				this.$refs.modal3.show();
				this.queryWarehouse();
			},

			modalCancel3: function() {
				this.$refs.modal3.hide();
			},
			
			deleteOneInstance: function(index){
				this.index=index;
				this.$refs.modal4.show();
			},
			//删除盘点明细窗口
			modalCancel4: function() {
				this.$refs.modal4.hide();
			},

			generateInventoryMaterial: function() {
				var _self = this;
				if (!this.name || !this.warehouse) {
					Notify.error("提示", "请填写完整再添加！", "true");
					return;
				}
				var uuid = Loading.show();
				var saveInventoryDto ={};
				saveInventoryDto.name =  _self.name;
				saveInventoryDto.warehouseId = _self.warehouse.id;
				$.ajax({
					url: Common.getApiURL("inventoryMaterialAppResource/save"),
					type: "post",
					data: JSON.stringify(saveInventoryDto),
					contentType: "application/json",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						Loading.hide(uuid);
						Notify.success("提示", "盘点单（名称：" + _self.name + "）添加成功！");
						_self.$refs.modal3.hide();
						data.message = data.name + "（" + data.documentNo + "）";
						_self.checkVouch = data;
						_self.queryCheckVouchDatas();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},
			/**
			 * 清空文本框内的文本
			 */
			clearText: function() {
				this.barCode = "";
			},

			submitData: function() {
				var _self = this;
				if (_self.inventoryInstances.length == 0) {
					Notify.info("提示", "没有可保存的数据。", "true");
					return;
				} 
				var flag = false;
				this.inventoryInstances.forEach(function(item) {
					if (!flag) {
						
						if (!item.quantity) {
							Notify.info("提示", "请填写完整。", "true");
							flag = true;
						}
					}
				});
				if (flag) {
					return;
				}
				var saveInventoryDto ={};
				saveInventoryDto.inventoryMaterialId=_self.checkVouch.id;
				saveInventoryDto.inventoryInstances=_self.inventoryInstances;
				saveInventoryDto.positionId=_self.position.positionId;
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("inventoryMaterialAppResource/check"),
					dataType: "json",
					data: JSON.stringify(saveInventoryDto),
					type: "post",
					contentType: "application/json",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						Loading.hide(uuid);
						Notify.success("成功", "保存成功！", true);
						/* _self.inventoryInstances.splice(0, _self.inventoryInstances.length);
						_self.epcSet = []; */
						_self.clear();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},
			
			showModal: function(checkVouchs, index) {
				this.index = index;
				this.checkQuantity = checkVouchs.checkQuantity;
				this.$refs.modal1.show();
			},

			modalSave: function() {
				if (!this.checkQuantity) {
					Notify.info("提示", "请输入盘点数量。", "true");
					return;
				}
				this.checkVouchsDatas[this.index].checkQuantity = this.checkQuantity;
				this.$refs.modal1.hide();
			},

			modalCancel1: function() {
				this.$refs.modal1.hide();
			},

			modalCancel2: function() {
				this.$refs.modal2.hide();
			},

			keydown: function(event) {
				if (event.keyCode == 13) {
					// if (!this.checkVouch) {
					// 	Notify.info("提示", "请先选择盘点单。", "true");
					// } else {
					// 	this.getCheckVouch();
					// }
					this.getCheckVouch();
				}
			},


			choose: function(data) {
				this.datas = data;
				this.$refs.modal2.show();
			},

			chooseData: function(data) {
				var flag = false;
				this.checkVouchsDatas.forEach(function(item) {
					if (!flag) {
						if (item.inventoryPositionId == data.inventoryPositionId) {
							var uuid1 = Notify.error("错误", "该数据已经添加。", "true");
							flag = true;
						}
					}
				})
				if (flag) {
					return;
				}
				this.checkVouchsDatas.unshift(data);
				this.$refs.modal2.hide();
			},

			queryPositionsByCheckVouch: function(checkVouch) {
				var _self = this;
				var warehouseId = checkVouch.warehouseId;
				$.ajax({
					url: Common.getApiURL("positionResource/positionsByWarehouse"),
					type: "get",
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					data: {
						"warehouseId": warehouseId,
					},
					success: function(data) {
						_self.positions = data;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			//查询存货信息
			queryInventoryInstance: function() {
				var _self = this;
				var epcs = [];
				_self.epcSet.forEach(function(item) {
					if (item.status == 1) {
						epcs.push(item.epc);
						item.status = 2;
					}
				});
				if (epcs.length > 0) {
					
					$.ajax({
						url: Common.getApiURL("inventoryMaterialAppResource/beforeInventoryMaterial"),
						type: "post",
						beforeSend: function(request) {
							Common.addTokenToRequest(request);
						},
						contentType: "application/json",
						data: JSON.stringify(epcs),
						success: function(data) {
							_self.barCode = '';
							if (data) {
								for (var i = 0; i < data.length; i++) {
									_self.inventoryInstances.unshift(data[i]);
								}
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							Common.processException(XMLHttpRequest, textStatus, errorThrown);
							mui.toast("提交失败");
						}
					});
				}
			},

			queryCheckVouchDatas: function() {
				var _self = this;
				$.ajax({
					type: "get",
					url: Common.getApiURL('inventoryMaterialAppResource/getInventoryMaterials'),
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						data.forEach(function(item) {
							item.message = item.name + "（" + item.documentNo + "）";
						});
						_self.checkVouchDatas = data;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showColor: function(index) {
				return !(index % 2);
			}


		},
		/**
		 * 点击未盘点按钮
		 */
		showUnCheck : function(){
			var inventoryMaterialId = this.checkVouch.id;
			var _self = this;
			$.ajax({
					type:"get",
					url: Common.getApiURL('inventoryMaterialAppResource/queryNeedMaterialLine'),
					data: {
						"inventoryMaterialId": inventoryMaterialId,
					},
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						data.forEach(function(item) {
							item.message = item.name + "（" + item.documentNo + "）";
						});
						_self.unMaterialDatas = data;
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}	
					
			});			
		},

		watch: {
			"checkVouch": {
				handler: function(to, from) {
					if (to) {
						this.queryPositionsByCheckVouch(to);
						this.position = "";
						this.checkVouchsDatas.splice(0, this.checkVouchsDatas.length);
					} else {
						this.positions.splice(0, this.positions.length);
					}
				},
				deep: true
			},
		},

		mounted: function() {
			var _self = this;
			_self.interval = window.setInterval(function() {
				_self.queryInventoryInstance();
			}, 1000)
			_self.queryCheckVouchDatas();
			_self.queryWarehouse();
			plugin.rfidMiddleware.start();
			plugin.rfidMiddleware.readEvent = function(epc) {
				_self.addEpc(epc);
				return "success";
			}
		},

		beforeDestroy: function() {
			plugin.rfidMiddleware.stop();
			plugin.rfidMiddleware.stopInventory();
		},

		destroyed: function() {
			plugin.rfidMiddleware.stop();
			plugin.rfidMiddleware.stopInventory();
		},
		
	}
</script>

<style type="text/css">
	.mui-plus .plus {
		display: inline;
	}

	.plus {
		display: none;
	}

	#topPopover {
		position: fixed;
		top: 16px;
		right: 6px;
	}

	#topPopover .mui-popover-arrow {
		left: auto;
		right: 6px;
	}

	.mui-popover {
		height: 320px;
	}

	.m-text-1 {
		font-size: 14px;
		color: #8f8f94;
	}

	.m-list {
		/* padding-left: 0px !important; */
		/* padding-right: 0px !important; */
		padding-top: 5px !important;
		padding-bottom: 5px !important;
	}

	.m-title {
		height: 32px;
		line-height: 32px;
	}

	.m-row {
		margin-bottom: 5px;
	}
</style>
