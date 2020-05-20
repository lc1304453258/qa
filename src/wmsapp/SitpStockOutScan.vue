<template>
	<div class="container-fluid">
		<Navbar title="扫码出库"></Navbar>
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="条码" v-model.trim="barCode" @keyup.enter="keyEnter">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				  	<span class="input-group-addon fa fa-barcode" @click="beginScan($event)"></span>
				</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="keyEnter">确定</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
    				<button type="button" class="btn btn-primary btn-sm" @click="generateStockOutLineDtos">保存</button>
	  			</div>
			</fieldset>
		</div>
		
		<div class="card-group m-card-item" v-if="(stockOutLineDtos == undefined || stockOutLineDtos.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.出库单号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			  		<p class="card-text">规格型号：请扫码</p>
			  		<p class="card-text">封装形式：请扫码</p>
			    	<p class="card-text">军标号：请扫码</p>
			    	<p class="card-text">生产单位：请扫码</p>
			    	<p class="card-text">出库数量：请扫码</p>
			    	<p class="card-text">出库条形码：请扫码</p>
			    	<p class="card-text">入库条形码：请扫码</p>
			    	<p class="card-text">入库单号：请扫码</p>
			    	<p class="card-text">指定货位数量：请扫码</p>
			  	</div>
			  	<div class="card-footer">
			  		<p class="card-text">货位条码：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in stockOutLineDtos">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.出库单号：{{data.documentNo}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text">规格型号：{{data.inventoryType}}</p>
				  		<p class="card-text">封装形式：{{data.packageForm}}</p>
				    	<p class="card-text">军标号：{{data.armyGrade}}</p>
				    	<p class="card-text">生产单位：{{data.manufacturer}}</p>
				    	<p class="card-text">出库数量：{{data.quantity}}</p>
				    	<p class="card-text">出库条形码：{{data.stockOutLineBarCode}}</p>
				    	<p class="card-text">
				    		<span v-if="!data.stockInLineBarCode" class="text-danger">
				    			入库条形码：{{data.stockInLineBarCode}}
				    		</span>
				    		<span v-else>
				    			入库条形码：{{data.stockInLineBarCode}}
				    		</span>
				    	</p>
				    	<p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
				    	<p class="card-text">
						    <label for="exampleInputName2">指定货位数量：</label>
						    <input class="form-control" type="number" v-model="data.positionQuantity"/>
				    	</p>
				    	
				  	</div>
				  	<div class="card-footer">
				  		货位条码：
				  		<span class="text-primary">
				  			<b>
				  				<select v-model="data.positionBarCode" class="form-control">
				  					<option v-for="ip in data.inventoryPositionDtos" :value="ip.positionBarCode">{{ip.positionBarCode}}</option>
				  				</select>
				  			</b>
				  		</span>
				  		<button type="button" class="btn btn-info btn-sm pull-right" @click="deleteOnePosition(index)">清货</button>
				  	</div>
				</div>
  			</div>
  		</div>
		
	</div>
</template>

<script>
	var vSelect = require("vue-select");
	var Common = require("../common/Common.js");
	var Loading = require("../common/Loading.js");
	var Notify = require("../widget/Notify.js");
	var Modal = require("../widget/Modal.vue");
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
		data: function () {
			return {
				barCode: "",
				documentTypeId: 1,
				stockOutLineDtos: [],
				stockOutLineDto:{},
				outTurn: true,
			}
		},
		
		methods: {

			initEvent: function () {
				var _self = this;
				plugin.barCode.scanEvent = function (barCodeStrs){
				    if(barCodeStrs != undefined && barCodeStrs.length > 0){
				        var barCodes = barCodeStrs.split(",");
				        _self.barCode = barCodes[0];
						_self.keyEnter();
				    }
				}
			},

			/**
			 * 点击扫码按钮开始扫描
			 */
			beginScan: function (event) {
				if(typeof(ZXING_SCANNER) == "undefined"){
       		 		this.scanResult(event);
    			} else {
    				plugin.barCode.scan(false);
    			}
			},

			/**
			 * 安卓端扫码成功后调用此函数
			 */
			scanResult: function(event){
				var _self = this;
				_self.barCode = event.detail.barCode;
				_self.keyEnter();
			},
			/**
			 * 清除索引为index的存货的货位
			 */
			deleteOnePosition: function (index) {
				this.stockOutLineDtos[index].positionBarCode = null;
				if (!this.stockOutLineDtos[index].stockInLineBarCode) {
					this.outTurn = true;
				}
			},

			/**
			 * 清除已扫描的所有存货的货位
			 */
			clearPosition: function () {
				this.stockOutLineDtos.forEach(function (item) {
					item.positionBarCode = null;
				});
			},

			/**
			 * 删除索引为index的存货
			 */
			deleteOne: function(index) {
				this.stockOutLineDtos.splice(index, 1);
				this.outTurn = true;
			},

			/**
			 * 清空文本框内的文本
			 */
			clearText: function(){
				this.barCode = "";
			},
			
			/**
			 * 清空数据
			 */
			clear: function () {
				this.barCode = "";
				this.stockOutLineDtos.splice(0, this.stockOutLineDtos.length);
			},

			/**
			 * 保存修改后的数量、货位
			 */
			keyEnter: function () {
				var _self = this;
				if (!this.barCode) {
					Notify.error("错误", "请输入条码。", false);
					return;
				}
				var lastChar = this.barCode.substring(this.barCode.length - 1);
				// if (lastChar == "D") {
				// 	if (this.outTurn == false) {
				// 		this.stockOutLineDtos[0].stockInLineBarCode = this.barCode;
				// 		this.outTurn = true;
				// 		this.barCode = "";
				// 	} else {
				// 		Notify.error("提示", "请先扫描出库条码再扫描入库条码。", true);
				// 	}
				// } else if (lastChar = "Z") {
				// 	if (this.outTurn) {
				// 		_self.getStockOutLineDto(this.barCode);
				// 	} else {
				// 		Notify.error("提示", "请扫描入库条形码。", true);
				// 	}
				// } else {
				// 	Notify.error("提示", "该条码不正确。", true);
				// }
				if (lastChar == "D") {
					if (_self.stockOutLineDtos.length == 0) {
						Notify.error("提示", "请先扫描出库条码。", true);
					} else {
						for (var i = 0; i < _self.stockOutLineDtos.length; i++) {
							if (!_self.stockOutLineDtos[i].stockInLineBarCode) {
								_self.stockOutLineDtos[i].stockInLineBarCode = _self.barCode; 
								break;
							}
						}
					}
				} else {
					_self.getStockOutLineDto(this.barCode);
				}
			},

			/**
			 * 将barCode加入StockOutLineDto中
			 * @param {Object} item
			 */
			addStockOutLineDto:function(item1){
				var _self = this;
				var isflag = false;
				if(_self.stockOutLineDtos.length > 0) {
					_self.stockOutLineDtos.forEach(function (item) {
						if((item.stockOutLineBarCode == "" ||  item.stockOutLineBarCode == null) && isflag == false) {
							item.stockOutLineBarCode = item1.stockOutLineBarCode;
							item.inventoryName = item1.inventoryName;
							item.inventoryType = item1.inventoryType;
							item.packageForm = item1.packageForm;
							item.armyGrade = item1.armyGrade;
							item.manufacturer = item1.manufacturer;
							item.stockOutLineBarCode = item1.stockOutLineBarCode;
							item.stockInDocumentNo = item1.stockInDocumentNo;
							item.quantity = item1.quantity;
							item.positionQuantity = item1.positionQuantity;
							isflag = true;
						}
					});
					if(isflag == false){
						_self.stockOutLineDtos.unshift(item1);
					}
				}else{
					_self.stockOutLineDtos.unshift(item1);
				}
			},
			/**
			 * 根据条码查询出库详情
			 */
			getStockOutLineDto: function (barCode) {
				var _self = this;
				_self.stockOutLineDtos = [];
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("StockOutLineResource/stockOutScan?documentNo=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.outTurn = false;
						Loading.hide(uuid);
						_self.barCode = '';
						data.forEach(function (item) {
							_self.addStockOutLineDto(item);
						})
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 根据条码和出库详情生成存货并保存
			 */
			generateStockOutLineDtos: function () {
				var _self = this;
				var isflag = false;
				var isflag1 = false;
				var isflag2 = false;
				_self.stockOutLineDtos.forEach(function (item) {
					if((item.stockOutLineBarCode == "" ||  item.stockOutLineBarCode == null)){
						isflag = true;
					}
					if((item.positionQuantity == "" || item.positionQuantity == null) && item.positionQuantity <= 0){
						isflag1 = true;
					}
					if(item.positionBarCode == "" || item.positionBarCode == null){
						isflag2 = true;
					}
				});
				if(isflag){
					Notify.error("提示", "出库详单不能为空。", true);
					return;
				}
				if(isflag1){
					Notify.error("提示", "指定货位数量不能为空。", true);
					return;
				}
				if(isflag2){
					Notify.error("提示", "货位不能为空。", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("StockOutLineResource/stockOutScanSave"),
					dataType : "json",
					type : "post",
					contentType: "application/json",
					data : JSON.stringify(_self.stockOutLineDtos),
					beforeSend : function (request){
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						Notify.error("提示", "保存成功", true);
						_self.barCode = '';
						_self.clear();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},
		},

		mounted: function () {
			var _self = this;
			window.addEventListener("sendScanData", _self.scanResult);
			this.initEvent();
		},

		beforeDestroy: function(){
			var _self = this;
			window.removeEventListener("sendScanData", _self.scanResult);
		},

		watch: {
		}

	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>


