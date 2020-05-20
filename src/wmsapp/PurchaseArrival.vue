<template>
	<div class="container-fluid">
		<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		<Navbar title="采购到货"></Navbar>
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="条码" v-model.trim="barCode" @keyup.enter="keyEnter">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				  	<span class="input-group-addon fa fa-barcode" @click="beginScan"></span>
				</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="keyEnter">确定</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
		    		<button type="button" class="btn btn-primary btn-sm" @click="save">保存</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(purchaseArrivalDatas == undefined || purchaseArrivalDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">订单号：请扫码</p>
			    	<p class="card-text">项目名称：请扫码</p>
			    	<p class="card-text">供应商名称：请扫码</p>
			    	<p class="card-text">包装内数量：请扫码</p>
			    	<p class="card-text">到货数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in purchaseArrivalDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showQtyModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">订单号：{{data.purchaseOrderDocumentNo}}</p>		    	
				    	<p class="card-text">项目名称：{{data.projectInventoryName}}</p>
				    	<p class="card-text">供应商名称：{{data.supplier}}</p>
				    	<p class="card-text">包装内数量：{{data.quantity}}</p>
				    	<p class="card-text">
				    		到货数量：<span class="text-primary"><b>{{data.realQuantity}}</b></span>
				    	</p>
				  	</div>
				</div>
  			</div>
  		</div>

	 	<Modal ref="modal" title="到货信息" large="true">
			<div slot="body">
				<div class="form-group">
				    <label class="control-label">到货数量:</label>
				    <input type="number" class="form-control" min="0" v-model="realQuantity" :max="fullQuantity">
				</div>
			</div>
			<div slot="footer">
				<div>
  					<button type="button" class="btn btn-primary" @click="saveQuantity">确定</button>
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
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			Common,
			Notify,
			Modal,
			ScanWidget,
			Navbar
		},
		data : function(){
			return{
				barCode : "",
				purchaseArrivalDatas : [],
				isExist : false,
				inventoryInstanceId : "",
				realQuantity : "",
				fullQuantity : "",
				no : "",
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
			 * 删除页面一条数据
			 */
			deleteOne: function (index) {
				this.purchaseArrivalDatas.splice(index, 1);
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
			 * 查询条码
			 */
			keyEnter : function() {
				var _self = this;
				var barCode = $.trim(_self.barCode);
				_self.isExist = false;
				if(!barCode) {
					Notify.info("提示", "请输入条码。", true);
					return;
				}
				_self.purchaseArrivalDatas.forEach(function (item) {
					if (item.barCode == barCode) {
						Notify.info("提示", "您已扫描过该条码。", true);
						_self.isExist = true;
					}
				})
				if (_self.isExist == true) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("inventoryInstanceArrivalResource/barCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.barCode = "";
						Loading.hide(uuid);
						_self.purchaseArrivalDatas.push(data);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				      	Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 保存到货数据
			 */
			save : function(){
				var _self = this;
				if (_self.purchaseArrivalDatas.length == 0) {
					Notify.info("提示", "无数据可保存。", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("inventoryInstanceArrivalResource/generatePurchaseArrival"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.purchaseArrivalDatas),
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
			 * 清空数据
			 */
			clear : function(){
				var _self = this;
				var len = _self.purchaseArrivalDatas.length;
				if(len > 0){
					_self.purchaseArrivalDatas.splice(0,len);
				}
				_self.barCode = "";
			},

			/**
			 * 关闭模态框
			 */
			modalCancel: function () {
				this.$refs.modal.hide();
			},

			/**
			 * 显示模态框
			 */
			showQtyModal : function(purchaseArrival, no){
				var _self = this;
				_self.fullQuantity = this.realQuantity;
				_self.inventoryInstanceId = purchaseArrival.inventoryInstanceId;
				_self.no = no;
				purchaseArrival.no = no;
				console.log(_self.inventoryInstanceId);
				this.$refs.modal.show();
				_self.restoreQty();
			},

			/**
			 * 恢复数量
			 */
			restoreQty : function(){
				var _self = this;
				_self.purchaseArrivalDatas.forEach(function(item){
					if(item.inventoryInstanceId == _self.inventoryInstanceId){
						_self.fullQuantity = item.reservedQuantity;
						if(item.realQuantity == undefined || item.realQuantity == null || item.realQuantity == ""){
							_self.realQuantity = item.quantity;
						}else{
							_self.realQuantity = item.realQuantity;
						}
					}
				});
			},

		    /**
			 * 保存模态框修改的数量
			 */
			saveQuantity : function(){
				if (this.realQuantity == "" || this.realQuantity == null || this.realQuantity == undefined) {
					Notify.info("提示", "请输入到货数量。", true);
					return;
				}
				var _self = this;
				var flag = true;
				var tempArr = [];
				_self.purchaseArrivalDatas.forEach(function(item,index){
					if(item.inventoryInstanceId == _self.inventoryInstanceId && item.no == _self.no){
						item.realQuantity = _self.realQuantity;
						flag = false;
						console.log("数量" + item.realQuantity);
						tempArr.push(item);
					}else{
						tempArr.push(item);
					}
				});
				_self.purchaseArrivalDatas = tempArr;
				console.log(_self.purchaseArrivalDatas);
				this.$refs.modal.hide();
			},
		},
		watch : {
			"realQuantity": {
				handler: function (val, oldVal) {
					if (val) {
						if (parseInt(val) != val) {
							Notify.info("提示", "请输入整数。", true);
							this.realQuantity = parseInt(val);
							return;
						}
						if(val > this.fullQuantity){
							Notify.info("提示", "不可大于包装内剩余数量。", true);
							this.realQuantity = this.fullQuantity;
							return;
						}
						if (val < 0) {
							Notify.info("提示", "不可小于0。", true);
							this.realQuantity = 0;
							return;
						}
					}
				},
     			deep: true
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
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>
