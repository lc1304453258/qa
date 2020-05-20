<template>
    <div class="container-fluid">
    	<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		<Navbar title="货位调整"></Navbar>
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
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="getInventoryPositions">确定</button>
		    		<button type="button" class="btn btn-info btn-sm" @click="clearPosition">清货</button>
		    		<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
		    		<button type="button" class="btn btn-primary btn-sm" @click="save">保存</button>
	  			</div>
			</fieldset>
		</div>

        <div class="card-group  m-card-item" v-if="(adjustPositionsDatas == undefined || adjustPositionsDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">调整前货位：请扫码</p>
			    	<p class="card-text">调整前数量：请扫码</p>
			    	<p class="card-text">调整后货位：请扫码</p>
			    	<p class="card-text">调整数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in adjustPositionsDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryNo}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				 	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.inventoryInstanceBarCode}}</p>
				    	<p class="card-text">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">调整前货位：{{data.positionBarCodeBefore}}</p>
				    	<p class="card-text">调整前数量：{{data.quantity}}</p>
				    	<p class="card-text">调整后货位：<span class="text-primary"><b>{{data.positionBarCodeAfter}}</b></span></p>
				    	<p class="card-text">调整数量：<span class="text-primary"><b>{{data.adjustQuantity}}</b></span></p>
				  	</div>
				</div>
  			</div>
  		</div>


	  	<Modal ref="modal1" title="调整货位" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
	  					<label for="positionSelect">调整后货位</label>
	  					<div class="v-select-container">
	  						<v-select id="positionSelect" label="positionBarCode" :options="positions" v-model="positionAfter"></v-select>
	  					</div>
	  				</div>
	  				<div class="form-group">
	  					<label>调整数量</label>
	  					<input type="number" class="form-control" v-model="adjustQuantity">
	  				</div>
				</div>
			</div>
			<div slot="footer">
				<div>
  					<button class="btn btn-primary" @click="modalSave">确定</button>
	  				<button class="btn btn-danger" @click="modalCancel1">取消</button>
				</div>
			</div>
		</Modal>

 		<Modal ref="modal2" title="选择要调整的货位" large="true">
			<div slot="body">
				<div>
					<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in datas">
  						<div class="card bg-light">
				  			<div class="card-header">
				  				{{index + 1}}.存货编号：{{data.inventoryNo}}
				 			</div>
				  			<div class="card-block">
				  				<p class="card-text">名称：{{data.inventoryName}}</p>
				    			<p class="card-text">批号：{{data.batchNo}}</p>
				    			<p class="card-text">货位：{{data.positionBarCodeBefore}}</p>
				    			<p class="card-text">数量：{{data.quantity}}</p>
				  			</div>
				  			<div class="card-footer text-center">
				  				<button type="button" class="btn btn-primary" @click="choose(data)">选定</button>
				  			</div>
						</div>
  					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
  					<button class="btn btn-danger" @click="modalCancel2">取消</button>
				</div>
			</div>
		</Modal>

    </div>
</template>


<script>
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var Modal = require("../widget/Modal.vue");
	var vSelect = require("vue-select");
	var Loading = require("../common/Loading.js");
	var ScanWidget = require("../widget/ScanWidget.vue");
	var Navbar = require("../widget/Navbar.vue");
	module.exports = {
		components: {
			Common,
			Notify,
			Modal,
			"v-select": vSelect.VueSelect,
			ScanWidget,
			Navbar
		},
		data: function () {
			return {
				adjustPositionsDatas: [],
				barCode: "",
				positionAfter: "",
				adjustQuantity: "",
				positions: [],
				index: "",
				data: "",
				datas: [],
				maxQuantity: "",
			}
		},

		methods: {

			initEvent: function () {
				var _self = this;
				plugin.barCode.scanEvent = function (barCodeStrs) {
				    if(barCodeStrs != undefined && barCodeStrs.length > 0) {
				        var barCodes = barCodeStrs.split(",");
				        _self.barCode = barCodes[0];
						_self.getInventoryPositions();
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

			scanResult: function(event){
				var _self = this;
				_self.barCode = event.detail.barCode;
				_self.getInventoryPositions();
			},

			wechatScan: function(){
				this.$refs.scanWidget.startScan();
			},

			scanCallback: function(result){
				var index = result.indexOf(",");
				var barCode = result.slice(index + 1);
				this.barCode = barCode;
				this.getInventoryPositions();
			},

			/**
			 * 清空文本框内的文本
			 */
			clearText: function(){
				this.barCode = "";
			},

			deleteOne: function(index) {
				this.adjustPositionsDatas.splice(index, 1);
			},

			showModal: function (adjustPositions, index) {
				var _self = this;
				this.index = index;
				var positionGetted = false;
				this.positions.forEach(function (item) {
					if (!positionGetted) {
						if (item.positionBarCode == adjustPositions.positionBarCodeAfter) {
							_self.positionAfter = item;
							positionGetted = true;
						}
					}
				});
				this.adjustQuantity = adjustPositions.adjustQuantity;
				this.maxQuantity = adjustPositions.quantity;
				this.$refs.modal1.show();
			},

			modalCancel1: function () {
				this.positionAfter = "";
				this.$refs.modal1.hide();
			},

			modalCancel2: function () {
				// this.visible2 = false;
				this.$refs.modal2.hide();
			},

			modalSave: function () {
				if (!(this.positionAfter && this.adjustQuantity)) {
					Notify.error("提示", "请填写正确的数量和货位。", true);
					return;
				}
				this.adjustPositionsDatas[this.index].positionBarCodeAfter = this.positionAfter.positionBarCode;
				this.adjustPositionsDatas[this.index].adjustQuantity = this.adjustQuantity;
				this.positionAfter = "";
				this.$refs.modal1.hide();
			},

			keydown: function (event) {
				if (event.keyCode == 13) {
					this.getInventoryPositions();
				}
			},

			getInventoryPositions: function () {
				var _self = this;
				var barCode = $.trim(_self.barCode);
				if (!barCode) {
					Notify.error("提示", "请输入条码", true);
					return;
				}
				var strStart = barCode.indexOf("L");
				if (strStart == 0) {
					this.setPosition();
				} else {
					this.addAdjustPositions(barCode);
				}
			},

			setPosition: function () {
				var _self = this;
				var correctPosition = false;
				this.positions.forEach(function (item) {
					if (item.positionBarCode == _self.barCode) {
						correctPosition = true;
					}
				});
				if (!correctPosition) {
					Notify.error("提示", "该条码没有对应货位。", "true");
					return;
				}
				if (this.adjustPositionsDatas.length == 0) {
					Notify.error("提示", "请先扫描物料。", true);
					return;
				}
				var flag = true;
				this.adjustPositionsDatas.forEach(function (item) {
					if (flag) {
						if (!item.positionBarCodeAfter) {
							item.positionBarCodeAfter = _self.barCode;
							// item.adjustQuantity = 0;
							flag = false;
						}
					}
				});
				var allScaned = true;
				this.adjustPositionsDatas.forEach(function (item) {
					if (!item.positionBarCodeAfter) {
						allScaned = false;
					}
				});
				_self.barCode = '';
			},

			addAdjustPositions: function (barCode) {
				var _self = this;
				var existed = false;
				var uuid = Loading.show();
				if (!existed) {
					$.ajax({
						url : Common.getApiURL("inventoryPositionResource/barCode?barCode=") + barCode,
						type : "get",
						beforeSend : function (request) {
							Common.addTokenToRequest(request);
						},
						success : function (data) {
							Loading.hide(uuid);
							_self.barCode = '';
							data.forEach(function(item) {
								item.adjustQuantity = item.quantity;
								item.positionBarCodeAfter = "";
							});
							if (data.length > 1) {
								_self.selectData(data);
							} else {
								_self.adjustPositionsDatas.unshift(data[0]);
							}
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							Loading.hide(uuid);
					    	Common.processException(XMLHttpRequest, textStatus, errorThrown);
						}
					});
				}
			},

			selectData: function (data) {
				this.datas = data;
				this.$refs.modal2.show();
			},

			choose: function (data) {
				this.adjustPositionsDatas.unshift(data);
				this.$refs.modal2.hide();
			},

			save: function () {
				var _self = this;
				if (this.adjustPositionsDatas.length == 0) {
					Notify.error("提示", "无数据可保存。", false);
					reutrn;
				}
				var hasEmptyData = false;
				this.adjustPositionsDatas.forEach(function (item) {
					if (!(item.positionBarCodeAfter && item.adjustQuantity)) {
						Notify.error("提示", "请填写正确的数量和货位。", true);
						hasEmptyData = true;
					}
				});
				if (hasEmptyData) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("adjustPositionResource/generateAdjustPosition"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.adjustPositionsDatas),
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						Notify.success("提示", "保存成功！", true);
						_self.clear();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
					    Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showColor: function(index){
				return !(index % 2);
			},

			clear: function () {
				this.adjustPositionsDatas.splice(0, this.adjustPositionsDatas.length);
				this.barCode = "";
			},

			clearPosition: function () {
				this.adjustPositionsDatas.forEach(function (item) {
					// item.adjustQuantity = "";
					item.positionBarCodeAfter = "";
				});
			},

			queryPositions: function () {
				var _self = this;
				$.ajax({
					type: "get",
					url: Common.getApiURL('positionResource/positions'),
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						_self.positions = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			}
		},

		mounted: function () {
			var _self = this;
			this.queryPositions();
			// this.scanResult();
			window.addEventListener("sendScanData", _self.scanResult);
			this.initEvent();
		},

		beforeDestroy: function(){
			var _self = this;
			window.removeEventListener("sendScanData", _self.scanResult);
		},

		watch: {
			"adjustQuantity": {
				handler: function (to, from) {
					if (to) {
						if (to != parseInt(to)) {
							Notify.error("提示", "请输入整数。", true);
							this.adjustQuantity = from;
							return;
						}
						if (to > this.maxQuantity) {
							Notify.error("提示", "超过货位总数量。", true);
							this.adjustQuantity = this.maxQuantity;
							return;
						}
						if (to <= 0) {
							Notify.error("提示", "请输入正数。", true);
							this.adjustQuantity = from;
							return;
						}
					}
				},
				deep: true
			},
		}
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>
