
<template>
	<div class="container-fluid">
		<Navbar title="报检"></Navbar>
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
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
		    		<button type="button" class="btn btn-primary btn-sm" @click="save">保存</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(inspectionRequestDatas == undefined || inspectionRequestDatas.length == 0)">
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
			    	<p class="card-text">报检数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inspectionRequestDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">到货单号：{{data.purchaseOrderArrivalDocumentNo}}</p>
				    	<p class="card-text">项目名称：{{data.projectInventoryName}}</p>
				    	<p class="card-text">供应商名称：{{data.vendorName}}</p>
				    	<p class="card-text">
				    		到货数量：{{data.arrivalQuantity}}
				    	</p>
				    	<p class="card-text">
				    		报检数量：<span class="text-primary"><b>{{data.quantity}}</b></span>
				    	</p>
				  	</div>
				</div>
  			</div>
  		</div>

	  	<Modal ref="modal" title="报检信息" large="true">
			<div slot="body">
				<div class="form-group">
	  				<label>报检数量:</label>
	  				<input type="number" class="form-control" v-model="quantity" min="0" :max="maxQuantity">
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
	var Loading = require("../common/Loading.js");
	var ScanWidget = require("../widget/ScanWidget.vue");
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
				inspectionRequestDatas : [],
				isExist : false,
				inventoryInstanceArrivalId : "",
				quantity : "",
				maxQuantity : "",
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
			 * 删除一条数据
			 */
			deleteOne: function (index) {
				this.inspectionRequestDatas.splice(index, 1);
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
			showModal : function (inspectionRequest) {
				for (var id in this.obj) {
					if (id == inspectionRequest.inventoryInstanceArrivalId && this.obj[id] == "") {
						this.obj[id] = inspectionRequest.quantity;
						break;
					}
				}
				var idA = inspectionRequest.inventoryInstanceArrivalId;
				this.maxQuantity = this.obj[idA];
				this.quantity = inspectionRequest.quantity;
				this.inventoryInstanceArrivalId = inspectionRequest.inventoryInstanceArrivalId;
				this.$refs.modal.show();
			},

			/**
			 * 保存模态框
			 */
			modalSave : function () {
				var _self = this;
				var flag = true;
				_self.inspectionRequestDatas.forEach(function (item) {
					if (item.inventoryInstanceArrivalId == _self.inventoryInstanceArrivalId) {
						if (_self.quantity == "" || _self.quantity == null || _self.quantity == undefined) {
							Notify.info("提示", "请输入报检数量。", true);
							flag = false;
						} else {
							item.quantity = _self.quantity;
						}
					}
				});
				if (flag) {
					this.$refs.modal.hide();
				}
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
				_self.isExist = false;
				if(_self.barCode == undefined || _self.barCode == "" || _self.barCode == null){
					Notify.info("提示", "请输入条码。", true);
					return;
				}
				var barCode = $.trim(_self.barCode);
				
				_self.inspectionRequestDatas.forEach(function(item){
					if(item.barCode == barCode){
						_self.isExist = true;
						Notify.info("提示", "您已扫描过该条码。", true);
					}
				});
				if (_self.isExist) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectRequestResource/inspectRequest/barCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.barCode = "";
						var tempObj = {};
						data.forEach(function(item){
							item.inspectedRequestQuantity = item.quantity;
							var id = item.inventoryInstanceArrivalId;
							tempObj[id] = "";
							_self.inspectionRequestDatas.push(item);
						});
						_self.obj = tempObj;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				      	Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			/**
			 * 保存报检数据
			 */
			save : function(){
				var _self = this;
				_self.inventoryInstanceArrivalId = "";
				if(_self.inspectionRequestDatas.length == 0){
					Notify.info("提示", "无数据可保存。", true);
					return ;
				}
				var inspectionRequestArr = [];
				_self.inspectionRequestDatas.forEach(function(item){
					inspectionRequestArr.push(item);
				});
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectRequestResource/generateInspectRequest"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(inspectionRequestArr),
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						console.log(data);
						_self.clear();
						Notify.info("提示", "保存成功！", true);
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
				var len = _self.inspectionRequestDatas.length;
				if(len > 0){
					_self.inspectionRequestDatas.splice(0,len);
				}
				_self.barCode = "";
			},
		},

		watch : {
			"quantity" : {
				handler : function (to, from) {
					if (to) {
						if (parseInt(to) != to) {
							Notify.info("提示", "请输入整数。", true);
							this.quantity = parseInt(to);
							return;
						}
						if (to > this.maxQuantity) {
							Notify.info("提示", "不可大于剩余可报检数量。", true);
							this.quantity = this.maxQuantity;
							return;
						}
						if (to < 0) {
							Notify.info("提示", "不可小于0。", true);
							this.quantity = 0;
							return;
						}
					}
				},
				deep : true
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
