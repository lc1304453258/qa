<template>
	<div class="container-fluid">
		<Navbar title="扫码入库"></Navbar>
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<!-- <span class="input-group-addon fa fa-barcode" @click="startScan"></span> -->
		  			<input id="barcode-input" type="text" class="form-control" placeholder="条码" v-model.trim="barCode" @keyup.enter="keyEnter">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				  	<span class="input-group-addon fa fa-barcode" @click="beginScan($event)"></span>
				</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="keyEnter">确定</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
    				<button type="button" class="btn btn-primary btn-sm" @click="generateStockInLineDtos">保存</button>
    				<button type="button" class="btn btn-default btn-sm" v-if="this.positionBarCode">
    					当前扫描货位：{{positionBarCode}}
    				</button>
	  			</div>
			</fieldset>
		</div>
		
		<div class="card-group m-card-item" v-if="(stockInLineDtos == undefined || stockInLineDtos.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.入库单号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			  		<p class="card-text">规格型号：请扫码</p>
			  		<p class="card-text">封装形式：请扫码</p>
			    	<p class="card-text">军标号：请扫码</p>
			    	<p class="card-text">生产单位：请扫码</p>
			    	<p class="card-text">入库数量：请扫码</p>
			    	<p class="card-text">入库条形码：请扫码</p>
			    	<p class="card-text">生产批次：请扫码</p>
			    	<p class="card-text">指定货位数量：请扫码</p>
			  	</div>
			  	<div class="card-footer">
			  		<p class="card-text">货位条码：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in stockInLineDtos">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.入库单号：{{data.stockInDocumentNo}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text">规格型号：{{data.inventoryType}}</p>
				  		<p class="card-text">封装形式：{{data.packageForm}}</p>
				    	<p class="card-text">军标号：{{data.armyGrade}}</p>
				    	<p class="card-text">生产单位：{{data.manufacturer}}</p>
				    	<p class="card-text">入库数量：{{data.quantity}}</p>
				    	<p class="card-text">入库条形码：{{data.stockInLineBarCode}}</p>
				    	<p class="card-text">生产批次：{{data.batchNo}}</p>
				    	<p class="card-text">
						    <label for="exampleInputName2">指定货位数量：</label>
						    <input class="form-control" type="number" v-model="data.positionQuantity"/>
				    	</p>
				    	
				  	</div>
				  	<div class="card-footer">
				  		货位条码：<span class="text-primary"><b>{{data.positionBarCode}}</b></span>
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
			Navbar,
			positionBarCode: '',
		},
		data: function () {
			return {
				barCode: "",
				documentTypeId: 1,
				stockInLineDtos:[],
				stockInLineDto:{}
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
				this.stockInLineDtos[index].positionBarCode = null;
			},

			/**
			 * 清除已扫描的所有存货的货位
			 */
			clearPosition: function () {
				this.stockInLineDtos.forEach(function (item) {
					item.positionBarCode = null;
				});
			},

			/**
			 * 删除索引为index的存货
			 */
			deleteOne: function(index) {
				this.stockInLineDtos.splice(index, 1);
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
				this.stockInLineDtos.splice(0, this.stockInLineDtos.length);
				this.positionBarCode = "";
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
				var strStart = this.barCode.indexOf("L");
				if (strStart == 0) {
					_self.positionBarCode = this.barCode;
					_self.stockInLineDtoBarCode(this.barCode);
				} else {
					// 物料标签
					_self.getStockInLineDto(this.barCode);
				}
			},

			/**
			 * 将货位条码加入stockInLineDto中
			 */
			stockInLineDtoBarCode:function(barCode){
				var _self = this;
				var isflag = false;
				if(_self.stockInLineDtos.length > 0){
					_self.stockInLineDtos.forEach(function (item) {
						if(!item.positionBarCode) {
							item.positionBarCode = barCode;
							// isflag = true;
						}
					});
					// if(isflag == false){
					// 	var item = {};
					// 	item.positionBarCode = barCode;
					// 	_self.stockInLineDtos.unshift(item);
					// }
				}
				// else{
				// 	var item = {};
				// 	item.positionBarCode = barCode;
				// 	_self.stockInLineDtos.unshift(item);
				// }
				this.barCode = "";
			},

			/**
			 * 将barCode加入StockInLineDto中
			 * @param {Object} item
			 */
			addStockInLineDto:function(item1){
				var _self = this;
				var isflag = false;
				if(_self.stockInLineDtos.length > 0){
					_self.stockInLineDtos.forEach(function (item) {
						if((item.stockInLineBarCode == "" ||  item.stockInLineBarCode == null)&& isflag == false){
							item.stockInLineBarCode = item1.stockInLineBarCode;
							item.inventoryName = item1.inventoryName;
							item.inventoryType = item1.inventoryType;
							item.packageForm = item1.packageForm;
							item.armyGrade = item1.armyGrade;
							item.manufacturer = item1.manufacturer;
							item.quantity = item1.quantity;
							item.batchNo = item1.batchNo;
							item.positionQuantity = item1.positionQuantity;
							item.stockInDocumentNo = item1.stockInDocumentNo;
							item.id = item1.id;
							isflag = true;
						}
					});
					if(isflag == false){
						_self.stockInLineDtos.unshift(item1);
					}
				}else{
					_self.stockInLineDtos.unshift(item1);
				}
			},
			/**
			 * 根据条码查询入库详情
			 */
			getStockInLineDto: function (barCode) {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockInLineResource/getStockInLine?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.barCode = '';
						if(data.stockInLineBarCode != ""){
							if (_self.positionBarCode) {
								data.positionBarCode = _self.positionBarCode;
							}
							_self.addStockInLineDto(data);
						}else{
							Notify.error("提示", "找不到对应的入库详情。", true);
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 根据条码和入库详情生成存货并保存
			 */
			generateStockInLineDtos: function () {
				var _self = this;
				var isflag = false;
				var isflag1 = false;
				var isflag2 = false;
				_self.stockInLineDtos.forEach(function (item) {
					if((item.stockInLineBarCode == "" ||  item.stockInLineBarCode == null)){
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
					Notify.error("提示", "入库详单不能为空。", true);
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
					url : Common.getApiURL("stockInLineResource/stockInScanSave"),
					dataType : "json",
					type : "post",
					contentType: "application/json",
					data : JSON.stringify(_self.stockInLineDtos),
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


