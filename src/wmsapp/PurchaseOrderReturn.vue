<template>
	<div class="container-fluid">
		<ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>
		<!-- <nav class="navbar navbar-fixed-top navbar-light bg-faded header">
		  	<a class="navbar-brand" href="javascript:void(0);">
		  		<span class="fa fa-arrow-circle-o-left" @click="back"></span>
		  		采购退货
		  	</a>
		</nav> -->
		<Navbar title="采购退货"></Navbar>
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
		

		<div class="card-group m-card-item" v-if="(purchaseOrderReturnDatas == undefined || purchaseOrderReturnDatas.length == 0)">
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
			    	<p class="card-text">退货数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in purchaseOrderReturnDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号{{data.inventoryNo}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(index, data)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">到货单号：{{data.arrivalDoc}}</p>		    	
				    	<p class="card-text">项目名称：{{data.projectItem}}</p>
				    	<p class="card-text">供应商名称：{{data.vendor}}</p>
				    	<p class="card-text">到货数量：{{data.arrivalQuantity}}</p>
				    	<p class="card-text">
				    		退货数量：<span class="text-primary"><b>{{data.returnQuantity}}</b></span>
				    	</p>
				  	</div>
				</div>
  			</div>
  		</div>

  		<Modal ref="modal" title="退货信息" large="true">
			<div slot="body">
				<div class="form-group">
				    <label class="control-label">退货数量:</label>
				    <input type="number" class="form-control" min="0" v-model="returnQuantity">
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
	var Navbar = require("../widget/Navbar.vue");
	module.exports={
		components: {
			Modal,
			ScanWidget,
			Navbar,
		},
		data: function () {
			return {
				barCode: "",
				purchaseOrderReturnDatas: [],
				returnQuantity: "",
				purchaseOrderReturn: null,
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

			deleteOne: function (index) {
				this.purchaseOrderReturnDatas.splice(index, 1);
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
			 * 返回上一页
			 */
			back: function () {
				history.back();
			},

			clearText: function () {
				this.barCode = "";
			},

			keyEnter : function() {
				var _self = this;
				var barCode = this.barCode;
				_self.isExist = false;
				if(!barCode) {
					Notify.info("提示", "请输入条码。", true);
					return;
				}
				_self.purchaseOrderReturnDatas.forEach(function (item) {
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
					url : Common.getApiURL("InventoryInstanceResource/purchaseOrderReturn/queryByBarCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.barCode = "";
						Loading.hide(uuid);
						data.forEach(function (item) {
							_self.purchaseOrderReturnDatas.push(item);
						})	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				      	Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showModal: function (index, data) {
				this.purchaseOrderReturn = data;
				this.returnQuantity = data.returnQuantity;
				this.$refs.modal.show();
			},

			modalCancel: function () {
				this.$refs.modal.hide();
			},

			modalSave: function () {
				this.purchaseOrderReturn.returnQuantity = this.returnQuantity;
				this.$refs.modal.hide();
			},

			clear: function () {
				this.purchaseOrderReturnDatas = [];
				this.barCode = "";
			},

			save: function () {
				var _self = this;
				if(_self.purchaseOrderReturnDatas.length == 0){
					Notify.info("提示", "无数据可保存。", true);
					return ;
				}
				var allFilled = true;
				_self.purchaseOrderReturnDatas.forEach(function (item) {
					if (!item.returnQuantity) {
						allFilled = false;
					}
				})
				if (!allFilled) {
					Notify.error("提示", "存在退货数量未填写。", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("inventoryInstanceReturnResource/generateOrderReturn"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.purchaseOrderReturnDatas),
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
			"returnQuantity": {
				handler: function (to, from) {
					if (to) {
						if (to <= 0) {
							Notify.error("提示", "不可小于等于0.", true);
							this.returnQuantity = from;
							return
						}
						if (parseInt(to) != to) {
							Notify.error("提示", "请输入整数。", true);
							this.returnQuantity = from;
						}
					}
				}
			}
		}
	}
</script>

<style scoped>
	.m-card-item{
		margin-bottom: 10px;
		font-size: 0.8em;
	}

	.header-img{
		width: 36px;
		height: 36px;
	}

	.header {
		margin-bottom:15px;
		margin-left:-29px;
		margin-right:-29px;
	}

	.container-fluid {
		overflow-x: hidden;
	}
</style>