<template>
	<div class="container-fluid">
		<Navbar title="盘点"></Navbar>
		
		<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="条码" v-model="barCode" @keydown="keydown($event)">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				  	<span class="input-group-addon fa fa-barcode" @click="startScan"></span>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<div class="v-select-container">
					<v-select label="message" :options="checkVouchDatas" v-model="checkVouch" placeholder="盘点单"></v-select>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<div class="v-select-container">
					<v-select label="positionBarCode" :options="positions" v-model="position" placeholder="货位"></v-select>
				</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="getCheckVouch">确定</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
					<button type="button" class="btn btn-primary btn-sm" @click="save">保存</button>
					<button type="button" class="btn btn-default btn-sm" @click="addNewCheckVouch">创建盘点单</button>
					<br>
					<button type="button" class="btn btn-info btn-sm" @click="checkProfit">盘盈</button>
					<button type="button" class="btn btn-info btn-sm" @click="checkLoss">盘亏</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(checkVouchsDatas == undefined || checkVouchsDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">货位条码：请扫码</p>
			    	<p class="card-text">入库单号：请扫码</p>
			    	<p class="card-text">账面数量：请扫码</p>
			    	<p class="card-text">盘点数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in checkVouchsDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.invCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block"  @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.invName}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">存货条码：{{data.inventoryBarCode}}</p>
				    	<p class="card-text">货位条码：{{data.positionBarCode}}</p>
				    	<p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
				    	<p class="card-text">账面数量：{{data.accountQuantity}}</p>
				    	<p class="card-text">盘点数量：<span class="text-primary"><b>{{data.checkQuantity}}</b></span></p>
				  	</div>
				</div>
  			</div>
  		</div>

	  	<Modal ref="modal1" title="盘点信息" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
	  					<label>盘点数量</label>
	  					<input type="number" v-model="checkQuantity" class="form-control">
	  				</div>
				</div>
			</div>
			<div slot="footer">
				<div>
  					<button type="button" class="btn btn-primary" @click="modalSave">确定</button>
	  				<button type="button" class="btn btn-danger" @click="modalCancel1">取消</button>
				</div>
			</div>
		</Modal>

		<Modal ref="modal2" title="请选择要盘点的明细" large="true">
			<div slot="body">
				<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in datas">
  					<div class="card bg-light">
				  		<div class="card-header">
				  			{{index + 1}}.存货编号：{{data.invCode}}
				  		</div>
				  		<div class="card-block">
					  		<p class="card-text">名称：{{data.invName}}</p>
					    	<p class="card-text">批号：{{data.batchNo}}</p>
					    	<p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
					    	<p class="card-text">账面数量：{{data.accountQuantity}}</p>
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
	  					<input type="text" class="form-control" v-model.trim="checkVouchName">
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
  					<button type="button" class="btn btn-primary" @click="generateCheckVouch">添加</button>
	  				<button type="button" class="btn btn-danger" @click="modalCancel3">取消</button>
				</div>
			</div>
		</Modal>

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
			Navbar,
		},
		data: function () {
			return {
				positions: [],
				positionBarCode: "",
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
				checkVouchName: "",
			}
		},

		methods: {

			deleteOne: function (index) {
				this.checkVouchsDatas.splice(index, 1);
			},

			initEvent: function () {
				var _self = this;
				plugin.barCode.scanEvent = function (barCodeStrs){
				    if(barCodeStrs != undefined && barCodeStrs.length > 0){
				        var barCodes = barCodeStrs.split(",");
				        _self.barCode = barCodes[0];
						_self.getCheckVouch();
				    }
				}
			},

			startScan: function () {
				// if (window.plugin) {
				// 	plugin.barCode.scan(false);
				// } else {
				// 	this.wechatScan();
				// }

				if(typeof(ZXING_SCANNER) == "undefined"){
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

			wechatScan: function(){
				this.$refs.scanWidget.startScan();
			},
			scanCallback: function(result){
				var index = result.indexOf(",");
				var barCode = result.slice(index + 1);
				this.barCode = barCode;
				this.getCheckVouch();
			},
			
			checkProfit: function () {
				if (!this.checkVouch) {
					Notify.error("提示", "您还未选择盘点单。", true);
					return;
				}
				var p = {
					page: 2,
					checkVouchId: this.checkVouch.id,
				}
				this.$emit("changePage", p);
			},

			checkLoss: function () {
				if (!this.checkVouch) {
					Notify.error("提示", "您还未选择盘点单。", true);
					return;
				}
				var p = {
					page: 3,
					checkVouchId: this.checkVouch.id,
				}
				this.$emit("changePage", p);
			},

			queryWarehouse: function () {
				var _self = this;
				$.ajax({
					url: Common.getApiURL("WarehouseResource/all"),
					type: "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						_self.warehouses = data;
						if (data.length == 1) {
							_self.warehouse = data[0];
						}
					},	
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			addNewCheckVouch: function () {
				this.warehouse = null;
				this.checkVouchName = "";
				this.$refs.modal3.show();
				this.queryWarehouse();
			},

			modalCancel3: function () {
				this.$refs.modal3.hide();
			},

			generateCheckVouch: function () {
				var _self = this;
				if (!this.checkVouchName || !this.warehouse) {
					Notify.error("提示", "请填写完整再添加！", "true");
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("checkVouchResource/generateCheckVouch"),
					data: {
						name: _self.checkVouchName,
						warehouseId: _self.warehouse.id,
					},
					type: "post",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						Notify.success("提示", "盘点单（名称：" + _self.checkVouchName + "）添加成功！");
						_self.$refs.modal3.hide();
						data.message = data.name + "（" + data.documentNo + "）";
						_self.checkVouch = data;
						_self.queryCheckVouchDatas();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},
			/**
			 * 清空文本框内的文本
			 */
			clearText: function(){
				this.barCode = "";
			},

			save: function () {
				var _self = this;
				if (this.checkVouchsDatas.length == 0) {
					Notify.info("提示", "没有可保存的数据。", "true");
					return;
				}
				var flag = false;
				this.checkVouchsDatas.forEach(function (item) {
					if (!flag) {
						if (!item.checkQuantity) {
							Notify.info("提示", "请填写完整。", "true");
							flag = true;
						}
					}
				});
				if (flag) {
					return;
				}
				this.checkVouchsDatas.forEach(function (item) {
					item.checkVouchId = _self.checkVouch.id;
					item.positionBarCode = _self.position.positionBarCode;
				})
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("checkVouchsResource/saveCheckVouchses"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.checkVouchsDatas),
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						Notify.success("成功", "保存成功！", true);
						_self.checkVouchsDatas = [];
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
					    Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			clear: function () {
				this.checkVouchsDatas.splice(0, this.checkVouchsDatas.length);
				this.barCode = "";
				this.checkVouch = "";
				this.position = "";
			},
			showModal: function (checkVouchs, index) {
				this.index = index;
				this.checkQuantity = checkVouchs.checkQuantity;
				this.$refs.modal1.show();
			},

			modalSave: function () {
				if (!this.checkQuantity) {
					Notify.info("提示", "请输入盘点数量。", "true");
					return;
				}
				this.checkVouchsDatas[this.index].checkQuantity = this.checkQuantity;
				this.$refs.modal1.hide();
			},

			modalCancel1: function () {
				this.$refs.modal1.hide();
			},

			modalCancel2: function () {
				this.$refs.modal2.hide();
			},

			keydown: function (event) {
				if (event.keyCode == 13) {
					// if (!this.checkVouch) {
					// 	Notify.info("提示", "请先选择盘点单。", "true");
					// } else {
					// 	this.getCheckVouch();
					// }
					this.getCheckVouch();
				}
			},

			getCheckVouch: function () {
				var _self = this;
				if (!this.checkVouch) {
					Notify.info("提示", "请先选择盘点单。", "true");
					return;
				}
				var barCode = $.trim(_self.barCode);
				if (!barCode) {
					Notify.error("提示", "请输入条码。", "true");
					return;
				}
				var strStart = barCode.indexOf("L");
				if (strStart == 0) {
					var correctBarCode = false;
					this.positions.forEach(function (item) {
						if (item.positionBarCode == barCode) {
							_self.position = item;
							correctBarCode = true;
						}
					});
					if (!correctBarCode) {
						Notify.error("提示", "正在盘点的仓库没有该条码对应的货位。", "true");
						return;
					}
					_self.barCode = '';
				} else {
					if (!this.position) {
						Notify.error("提示", "请先扫描货位。", "true");
						return;
					} else {
						this.getCheckVouchses(barCode);
					}
				}
			},

			getCheckVouchses: function (barCode) {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("checkVouchsResource/queryCheckVouchses"),
					dataType: "json",
					type : "post",
					data: {
						checkVouchId: _self.checkVouch.id,
						positionBarCode: _self.position.positionBarCode,
						inventoryBarCode: barCode,
					},
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						data.forEach(function (item) {
							if (!item.checkQuantity) {
								item.checkQuantity = "";
							}
							item.positionBarCode = _self.position.positionBarCode;
							item.inventoryBarCode = _self.barCode;
						})
						_self.barCode = '';
						if (data.length > 1) {
							_self.choose(data)
						} else {
							_self.checkVouchsDatas.unshift(data[0]);
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			choose: function (data) {
				this.datas = data;
				this.$refs.modal2.show();
			},

			chooseData: function (data) {
				var flag = false;
				this.checkVouchsDatas.forEach(function (item) {
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

			queryPositionsByCheckVouch: function (checkVouch) {
				var _self = this;
				var warehouseId = checkVouch.warehouseId;
				$.ajax({
					url : Common.getApiURL("positionResource/positionsByWarehouse?warehouseId=") + warehouseId,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.positions = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},


			queryCheckVouchDatas: function () {
				var _self = this;
				$.ajax({
					type: "get",
					url: Common.getApiURL('checkVouchResource/queryEditNoneChecked'),
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						data.forEach(function (item) {
							item.message = item.name + "（" + item.documentNo + "）";
						});
						_self.checkVouchDatas = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showColor: function (index) {
				return !(index % 2);
			}


		},

		watch: {
			"checkVouch": {
				handler: function (to, from) {
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

		mounted: function () {
			var _self = this;
			this.queryCheckVouchDatas();
			window.addEventListener("sendScanData", _self.scanResult);
			this.initEvent();
		},

		beforeDestroy: function(){
			var _self = this;
			window.removeEventListener("sendScanData", _self.scanResult);
		},

	}
</script>
