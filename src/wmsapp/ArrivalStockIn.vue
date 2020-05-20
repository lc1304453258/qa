<template>
	<div class="container-fluid">
		<Navbar title="到货入库"></Navbar>
		
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

		<div class="card-group m-card-item" v-if="(arrivalStockInDatas == undefined || arrivalStockInDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">到货单号：请扫码</p>
			    	<p class="card-text">项目名称：请扫码</p>
			    	<p class="card-text">供应商名称：请扫码</p>
			    	<p class="card-text">到货数量：请扫码</p>
			    	<p class="card-text">入库数量：请扫码</p>
			    	<!-- <p class="card-text">入库货位：请扫码</p> -->
			  	</div>
			  	<div class="card-footer">
			  		<p class="card-text">入库货位：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in arrivalStockInDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">到货单号：{{data.documentNo}}</p>
				    	<p class="card-text">项目名称：{{data.projectName}}</p>
				    	<p class="card-text">供应商名称：{{data.vendorName}}</p>
				    	<p class="card-text">到货数量：{{data.arrivalQuantity}}</p>
				    	<p class="card-text">入库数量：<span class="text-primary"><b>{{data.stockInQuantity}}</b></span></p>
				    	<!-- <p class="card-text">入库货位：{{data.positionBarCode}}</p> -->
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
		
	  	<Modal ref="modal" title="入库信息" large="true">
			<div slot="body">
				<div class="form-group">
	  				<label>入库数量:</label>
	  				<input type="number" class="form-control" v-model="quantity" min="0" :max="maxQuantity">
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
  					<button class="btn btn-primary" type="button" @click="modalSave">确定</button>
	  				<button class="btn btn-danger" type="button" @click="modalCancel">取消</button>
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
	var vSelect = require("vue-select");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	module.exports = {
		components: {
			Common,
			Notify,
			Modal,
			ScanWidget,
			"v-select": vSelect.VueSelect,
			Loading,
			Navbar
		},
		data : function(){
			return{
				barCode : "",
				isExist : false,
				arrivalStockInDatas : [],
				positions : [],
				positionBarCode1 : "",
				stockInQty : "",
				inventoryInstanceArrivalId : "",
				quantity : "",
				stockInQuantity : "",
				purchaseOrderArrivalId : "",
				arrivalQuantity : "",
				realQuantity : "",
				tempArr : [],
				position: "",
				maxQuantity : "",
				obj : null,
			}
		},
		methods : {

			/**
			 * 删除一个数据
			 */
			deleteOne: function (index) {
				this.arrivalStockInDatas.splice(index, 1);
			},

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
			 * 清空条码输入框
			 */
			clearText: function(){
				this.barCode = "";
			},

			/**
			 * 显示模态框
			 */
			showModal : function (arrivalStockIn) {
				for (var id in this.obj) {
					if (id == arrivalStockIn.inventoryInstanceArrivalId && this.obj[id] == "") {
						this.obj[id] = arrivalStockIn.stockInQuantity;
					}
				}
				this.inventoryInstanceArrivalId = arrivalStockIn.inventoryInstanceArrivalId;
				this.maxQuantity = this.obj[this.inventoryInstanceArrivalId]
				this.quantity = arrivalStockIn.stockInQuantity;
				var _self = this;
				var flag = true;
				this.positions.forEach(function (item) {
					if (flag) {
						if (arrivalStockIn.positionBarCode == item.positionBarCode) {
							_self.position = item;
							flag = false;
						}
					}
				})
				this.$refs.modal.show();
			},

			/**
			 * 关闭模态框
			 */
			modalCancel : function () {
				this.$refs.modal.hide();
			},

			/**
			 * 保存模态框填写的数据
			 */
			modalSave : function () {
				if (!this.quantity || !this.position) {
					Notify.info("提示", "存在未填写的选项。", true);
					return;
				}
				var _self = this;
				this.arrivalStockInDatas.forEach(function (item) {
					if (item.inventoryInstanceArrivalId == _self.inventoryInstanceArrivalId) {
						item.stockInQuantity = _self.quantity;
						item.positionBarCode = _self.position.positionBarCode;
						item.positionName = _self.position.positionName;
						_self.quantity = "";
						_self.position = "";
					}
				})
				this.$refs.modal.hide();
			},

			/**
			 * 输入条码后查询
			 */
		    keyEnter : function(){
		     	var _self = this;
		     	var barCode = _self.barCode;
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
							var flag1 = true;
							_self.arrivalStockInDatas.forEach(function (item) {
								if (!item.positionBarCode) {
									flag1 = false;
								}
							})
							if (flag1) {
								Notify.success("提示", "货位已经全部指定。", true);
								return;
							}
							_self.insertPositionBarCode(barCode);
						}else{
							Notify.info("提示", "该条码无对应货位。", true);
						}
					}
				} else if (strStart == -1){
					_self.getArrivalStockIn(barCode);
				}
		    },

		    insertPositionBarCode : function(positionBarCode){
		     	var _self = this;
		     	if(_self.arrivalStockInDatas.length == 0){
		     		Notify.info("提示", "请先扫描物料。", true);
		     	} else {
		     		var flag = true;
		     		var isAllExist = true;
					_self.arrivalStockInDatas.forEach(function(item){
						if (flag) {
							if (!item.positionBarCode) {
								item.positionBarCode = positionBarCode;
								_self.positions.forEach(function (item1) {
									if (item1.positionBarCode == positionBarCode) {
										item.positionName = item1.positionName;
									}
								});
								flag = false;
								_self.barCode = "";
							}
						}
	     			});
	     			_self.arrivalStockInDatas.forEach(function(item){
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
		     	var _self = this;
		     	$.ajax({
					url : Common.getApiURL("positionResource/positions"),
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

		    /**
			 * 根据条码获取到货信息
			 */
		    getArrivalStockIn : function(barCode){
		     	var _self = this;
				_self.isExist = false;
				if(barCode == undefined || barCode == ""){
					Notify.info("提示", "请输入条码。", true);
					return;
				}
				_self.arrivalStockInDatas.forEach(function (item) {
					if (item.barCode == _self.barCode) {
						Notify.info("提示", "您已扫描过该条码。", true);
						_self.isExist = true;
					}
				})
				if(_self.isExist == false){
					$.ajax({
						url : Common.getApiURL("InventoryInstanceStockInResource/arrivalStockIn/queryStockInDtoByBarCode?barCode=") + barCode,
						type : "get",
						beforeSend : function (request) {
							Common.addTokenToRequest(request);
						},
						success : function (data) {
							_self.barCode = "";
							var tempObj = {};
							data.forEach(function (item) {
								var id = item.inventoryInstanceArrivalId;
								tempObj[id] = "";
								if (_self.positions.length == 1) {
									item.positionBarCode = _self.positions[0].positionBarCode;
								}
								_self.arrivalStockInDatas.push(item);
							});
							_self.obj = tempObj;
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
				      		Common.processException(XMLHttpRequest, textStatus, errorThrown);
						}
					});
				}
			},


			/**
			 * 清除所有指定的货位
			 */
			clearPosition : function (){
				var _self = this;
				if(_self.arrivalStockInDatas.length != 0){
					_self.arrivalStockInDatas.forEach(function(item){
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
			 * 入库保存
			 */
			save: function(){
				var _self = this;
				if (this.arrivalStockInDatas.length == 0) {
					Notify.info("提示", "无数据可保存。", true);
					return;
				}
				_self.inventoryInstanceArrivalId = "";
				var checkSuccess = true;
				_self.arrivalStockInDatas.forEach(function (item) {
					if (item.positionBarCode == null || item.positionBarCode == "" || item.positionBarCode == undefined) {
						Notify.error("提示", "存货（名称：" + item.inventoryName + "，编号：" + item.inventoryCode + "）未指定货位。", true);
						checkSuccess = false;
					}
				});
				if (!checkSuccess) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceStockInResource/generateArrivalStockIn"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.arrivalStockInDatas),
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


			/**
			 * 清空
			 */
			clear : function(){
				var _self = this;
				_self.inventoryInstanceArrivalId = "";
				var len = _self.arrivalStockInDatas.length;
				if(len > 0){
					_self.arrivalStockInDatas.splice(0,len);
				}
				_self.barCode = "";
			},
		},
		
		watch : {
			"quantity": {
				handler: function (val, oldVal) {
					if (val) {
						if (val > this.maxQuantity) {
							Notify.info("提示", "不可大于剩余可入库数量。", true);
							this.quantity = this.maxQuantity;
							return;
						}
						if (val < 0) {
							Notify.info("提示", "不可小于0。", true);
							this.quantity = 0;
							return;
						}
						if (val != parseInt(val)) {
							Notify.info("提示", "请输入整数", true);
							this.quantity = parseInt(val);
							return;
						}
					}
				},
     			deep: true
			}, 
		},
		mounted: function () {
			var _self = this;
			this.loadPositions();
			window.addEventListener("sendScanData", _self.scanResult);
			this.initEvent();
		},

		beforeDestroy: function(){
			var _self = this;
			window.removeEventListener("sendScanData", _self.scanResult);
		},
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>
