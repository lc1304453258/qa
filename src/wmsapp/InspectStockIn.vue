<template>
	<div class="container-fluid">
		<Navbar title="检验入库"></Navbar>
		<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="条码" v-model.trim="barCode" @keyup.enter="keyEnter" autofocus="autofocus">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				  	<span class="input-group-addon fa fa-barcode" @click="beginScan"></span>
				</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="keyEnter">确定</button>
		  			<button type="button" class="btn btn-info btn-sm" @click="clearPosition">清货</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
		    		<button type="button" class="btn btn-primary btn-sm" @click="save">保存</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(inspectStockInDatas == undefined || inspectStockInDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">检验单号：请扫码</p>
			    	<p class="card-text">项目名称：请扫码</p>
			    	<p class="card-text">供应商名称：请扫码</p>
			    	<p class="card-text">检验可入库数量：请扫码</p>
			    	<p class="card-text">入库数量：请扫码</p>
			    	
			  	</div>
			  	<div class="card-footer">
			  		<p class="card-text">入库货位：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inspectStockInDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">检验单号：{{data.incomingInspectionDocumentNo}}</p>
				    	<p class="card-text">项目名称：{{data.projectInventoryName}}</p>
				    	<p class="card-text">供应商名称：{{data.vendorName}}</p>
				    	<p class="card-text">检验可入库数量：{{data.quantity}}</p>
				    	<p class="card-text">入库数量：<span class="text-primary"><b>{{data.stockInQuantity}}</b></span></p>
				    	<!-- <p class="card-text">入库货位：<span class="text-primary"><b>{{data.positionBarCode}}</b></span></p> -->
				  	</div>
				  	<div class="card-footer">
				  		入库货位：<span class="text-primary"><b>{{data.positionBarCode}}</b></span>
				  		<button type="button" class="btn btn-info btn-sm pull-right" @click="deleteOnePosition(data)">
				  			清货
				  		</button>
				  	</div>
				</div>
  			</div>
  		</div>

 		<Modal ref="modal" title="检验入库信息" large="true">
			<div slot="body">
				<div class="form-group">
	  				<label>入库数量:</label>
	  				<input type="number" v-model="quantity" class="form-control" min="0" :max="tempQuantity" checked>
	  			</div>
	  			<div class="form-group">
	  				<label>货位:</label>
	  				<div class="v-select-container">
						<v-select :options="positions" v-model="position" label="positionBarCode"></v-select>
					</div>
	  			</div>
			</div>
			<div slot="footer">
				<div>
  					<button type="button" class="btn btn-primary" @click="modalSave">确定</button>
	  				<button type="button" class="btn btn-danger" @click="modalCancel">取消</button>
				</div>
			</div>
		</Modal>

	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var Modal = require("../widget/Modal.vue");
	var ScanWidget = require("../widget/ScanWidget.vue");
	var Loading = require("../common/Loading.js");
	var vSelect = require("vue-select");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			Common,
			Notify,
			Modal,
			ScanWidget,
			"v-select": vSelect.VueSelect,
			Navbar,
		},
		data : function(){
			return{
				barCode : "",
				isExist : false,
				inspectStockInDatas : [],
				positions : [],
				positionBarCode1 : "",
				stockInQty : "",
				inventoryInstanceInspectId : "",
				quantity : "",
				tempQuantity : "",
				position : "",
				obj : {},
			}
		},
		methods : {

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
			beginScan: function () {
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

			/**
			 * 安卓端扫码成功后调用此函数
			 */
			scanResult: function(event){
				var _self = this;
				_self.barCode = event.detail.barCode;
				_self.keyEnter();
			},

			/**
			 * 微信端开始扫描
			 */
			wechatScan: function(){
				this.$refs.scanWidget.startScan();
			},

			/**
			 * 微信端扫码成功调用此函数
			 */
			scanCallback: function(result){
				var index = result.indexOf(",");
				var barCode = result.slice(index + 1);
				this.barCode = barCode;
				this.keyEnter();
			},

			/**
			 * 删除界面一条数据
			 */
			deleteOne: function (index) {
				this.inspectStockInDatas.splice(index, 1);
			},

			/**
			 * 清空条码输入框
			 */
			clearText: function(){
				this.barCode = "";
			},

			/**
			 * 显示模态框
			 */
			showModal : function (inspectStockIn) {
				for (var id in this.obj) {
					if (id == inspectStockIn.inventoryInstanceInspectId && this.obj[id] == "") {
						this.obj[id] = inspectStockIn.stockInQuantity;
					}
				}
				var idA = inspectStockIn.inventoryInstanceInspectId;
				this.tempQuantity = this.obj[idA];
				this.quantity = inspectStockIn.stockInQuantity;
				this.inventoryInstanceInspectId = inspectStockIn.inventoryInstanceInspectId;
				this.$refs.modal.show();
			},

			/**
			 * 保存模态框
			 */
			modalSave : function () {
				var _self = this;
				if (this.quantity == "" || this.quantity == null || this.quantity == undefined) {
					Notify.info("提示", "请输入入库数量。", true);
					return;
				}
				_self.inspectStockInDatas.forEach(function (item) {
					if (item.inventoryInstanceInspectId == _self.inventoryInstanceInspectId) {
						item.stockInQuantity = _self.quantity;
						item.positionBarCode = _self.position.positionBarCode;
						item.positionName = _self.position.positionName;
						//_self.quantity = "";
						_self.position = "";
					}
				});
				this.$refs.modal.hide();
			},

			/**
			 * 关闭模态框
			 */
			modalCancel : function () {
				this.$refs.modal.hide();
			},

			/**
			 * 查询条码
			 */
		    keyEnter : function(){
		     	var _self = this;
		     	var barCode = $.trim(_self.barCode);
		     	var strStart = barCode.indexOf("L");
				if(strStart == 0){
					if(_self.positions.length == 0){
						Notify.info("提示", "无货位数据。", true);
					}else{
						var flag = false;
						_self.positions.forEach(function(item){
							if(barCode == item.positionBarCode){
								flag = true;
							}
						});
						if(flag){
							_self.insertPositionBarCode(barCode);
						}else{
							Notify.info("提示", "该条码无对应货位。", true);
						}	
					}
				}else if(strStart == -1){
					_self.getInspectStockIn(barCode);
				}
		    },

		    insertPositionBarCode : function(positionBarCode){
		     	var _self = this;
		     	console.log("当前扫描货位条码 " + positionBarCode);
		     	if (_self.inspectStockInDatas.length == 0) {
		     		Notify.info("提示", "请先扫描物料。", true);
		     	} else {
		     		var isAllExist = true;
		     		var flag = true;
					_self.inspectStockInDatas.forEach(function(item) {
						if (flag) {
							if(!item.positionBarCode) {
								item.positionBarCode = positionBarCode;
								var flag1 = true;
								_self.positions.forEach(function (item1) {
									if (flag1) {
										if (item1.positionBarCode == positionBarCode) {
											item.positionName = item1.positionName;
											flag1 = false;
										}
									}
								});
								flag = false;
							}
						}
						_self.barCode = "";
	     			});
	     			_self.inspectStockInDatas.forEach(function(item){
						if(item.positionBarCode == undefined || item.positionBarCode == null || item.positionBarCode == ""){
							isAllExist = false;
						}
	     			});
		     	}
		     },

		    /**
			 * 加载所有货位
			 */
		    loadPositions : function(){
		     	//加载货位
		     	var _self = this;
		     	$.ajax({
					url : Common.getApiURL("positionResource/positions"),
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						console.log(data);
						if(data != undefined ){
							_self.positions = data;
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
			      Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
		     },

		     /**
			 * 根据条码查询检验日志
			 */
		     getInspectStockIn : function(barCode){
		     	var _self = this;
				_self.isExist = false;
				if(barCode == undefined || barCode == ""){
					return;
				}
				if(_self.inspectStockInDatas.length != 0){			
					_self.inspectStockInDatas.forEach(function(item){
						if(item.barCode == barCode){
							_self.isExist = true;
							Notify.info("提示", "您已扫描过该条码。", true);
						}
					});
				}
				if (_self.isExist) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceStockInResource/inspectStockIn/barCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.barCode = "";
						Loading.hide(uuid);
						var tempObj = {};
						if(data != undefined ){
							data.forEach(function (item) {
								var id = item.inventoryInstanceInspectId;
								tempObj[id] = "";
								item.positionName = "";
								_self.inspectStockInDatas.push(item);
							});
						}
						_self.obj = tempObj;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				      	Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 清除所有货位
			 */
			clearPosition : function (){
				var _self = this;
				if (_self.inspectStockInDatas.length != 0) {
					_self.inspectStockInDatas.forEach(function (item) {
						item.positionBarCode = "";
						item.positionName = "";
					});
				}
			},

			/**
			 * 清除一个货位
			 */
			deleteOnePosition : function (data){
				data.positionBarCode = "";
				data.positionName = "";
			},

			/**
			 * 保存入库数据
			 */
			save : function(){
				var _self = this;
				_self.inventoryInstanceInspectId = "";
				var checkSuccess = true;
				if (_self.inspectStockInDatas.length == 0) {
					Notify.info("提示", "无数据可保存，请先扫描入库条码。", true);
					checkSuccess = false;
				} else {
					_self.inspectStockInDatas.forEach(function (item) {
						if(item.positionBarCode == undefined || item.positionBarCode == "" || item.positionBarCode == null) {
							Notify.info("提示", "存货名称：" + item.inventoryName + ",存货编码："+ item.inventoryCode + "没有指定货位。", true);
							checkSuccess = false;
						}
					});
				}
				if (!checkSuccess) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceStockInResource/generateInspectStockIn"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.inspectStockInDatas),
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						Notify.info("提示", "保存成功！", true);
						_self.clear();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				    	Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 清空数据
			 */
			clear : function(){
				var _self = this;
				_self.inventoryInstanceInspectId = "";
				var len = _self.inspectStockInDatas.length;
				if(len > 0){
					_self.inspectStockInDatas.splice(0,len);
				}
				_self.barCode = "";
			},

		},

		mounted: function () {
			var _self = this;
			window.addEventListener("sendScanData", _self.scanResult);
			this.loadPositions();
			this.initEvent();
		},

		beforeDestroy: function(){
			var _self = this;
			window.removeEventListener("sendScanData", _self.scanResult);
		},
		
		watch : {
			"quantity": {
				handler: function (val, oldVal) {
					if (val != "") {
						if (val != parseInt(val)) {
							Notify.info("提示", "请输入整数。", true);
							this.quantity = parseInt(val);
							return;
						}
						if(val > this.tempQuantity){
							Notify.info("提示", "不可大于可入库数量。", true);
							this.quantity = this.tempQuantity;
							return;
						}
						if (val < 0) {					
							Notify.info("提示", "不可小于0。", true);
							this.quantity = 0;
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
