
<template>
	<div class="container-fluid">
		<Navbar title="检验"></Navbar>
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

		<div class="card-group m-card-item" v-if="(inspectDatas == undefined || inspectDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">报检单号：请扫码</p>
			    	<p class="card-text">项目名称：请扫码</p>
			    	<p class="card-text">供应商名称：请扫码</p>
			    	<p class="card-text">报检数量：请扫码</p>
			    	<p class="card-text">检验<small>(合格/让步接收/不良品)</small>数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inspectDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">报检单号：{{data.inspectionRequestDocumentNo}}</p>
				    	<p class="card-text">项目名称：{{data.projectInventoryName}}</p>
				    	<p class="card-text">供应商名称：{{data.vendorName}}</p>
				    	<p class="card-text">报检数量：{{data.inspectRequestQuantity}}</p>
				    	<p class="card-text">检验<small>（合格/让步接收/不良品）</small>数量：<span class="text-primary"><b>{{data.quantity}} <small>（{{data.qualifiedQty}} / {{data.concessionAcceptanceQty}} / {{data.inferiorQty}}）</small></b></span></p>
				  	</div>
				</div>
  			</div>
  		</div>

	  	<Modal ref="modal" title="检验信息" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
	  					<label>检验数量:</label>
	  					<input type="number" class="form-control" v-model="inspectQty" min="0" :max="maxQuantity">
	  				</div>
	  				<div class="form-group">
	  					<label>合格数量:</label>
	  					<input type="number" class="form-control" v-model="qualifiedQty">
	  				</div>
	  				<div class="form-group">
	  					<label>让步接收数量:</label>
	  					<input type="number" class="form-control" v-model="concessionAcceptanceQty">
	  				</div>
	  				<div class="form-group">
	  					<label>不良品数量:</label>
	  					<input type="number" class="form-control" v-model="inferiorQty">
	  				</div>
				</div>
			</div>
			<div slot="footer">
				<div>
  					<button class="btn btn-primary" type="button" @click="modalSave">
	  						确定
	  				</button>
	  				<button class="btn btn-danger" type="button" @click="modalCancel">
	  					取消
	  				</button>
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
				inspectDatas : [],
				isExist : false,
				documentNo : "",
				inspectRequestQty : "",
				inspectRequestLineId : "",
				inventoryInstanceInspectRequestId : "",
				qualifiedQty : "",  //合格数量
				inferiorQty : "", //不良品数量
				concessionAcceptanceQty : "", //让步接收数量
				inspectQty : "",  //检验数量
				maxQuantity : "",  //剩余可检验数量
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
				// var _self = this;
				// _self.barCode = event.detail.barCode;
				// _self.keyEnter();

				if(typeof(ZXING_SCANNER) == "undefined"){
       		 		this.wechatScan();
    			} else {
    				plugin.barCode.scan(false);
    			}
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
				this.inspectDatas.splice(index, 1);
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
			showModal : function (inspect) {
				for (var id in this.obj) {
					if (id == inspect.inventoryInstanceInspectRequestId && this.obj[id] == "") {
						this.obj[id] = inspect.quantity;
						break;
					}
				}
				var idA = inspect.inventoryInstanceInspectRequestId;
				this.maxQuantity = this.obj[idA];
				this.inspectQty = inspect.quantity;
				this.inventoryInstanceInspectRequestId = inspect.inventoryInstanceInspectRequestId;
				this.$refs.modal.show();
			},

			/**
			 * 保存模态框
			 */
			modalSave : function () {
				if (this.inferiorQty < 0 || this.qualifiedQty < 0 || this.concessionAcceptanceQty < 0) {
					Notify.info("提示", "合格数量、让步接收数量、不良品数量不可小于0。", true);
					return;
				}
				if (this.inferiorQty == "" || this.qualifiedQty == "" || this.concessionAcceptanceQty == "" || this.inspectQty == "") {
					Notify.info("提示", "有未填写的选项。", true);
					return;
				}
				if (this.inferiorQty != parseInt(this.inferiorQty) || this.qualifiedQty != parseInt(this.qualifiedQty) || this.concessionAcceptanceQty != parseInt(this.concessionAcceptanceQty)) {
					Notify.info("提示", "合格数量、让步接收数量、不良品数量必须为整数。", true);
					return;
				}
				var inspectQuantity = parseInt(this.qualifiedQty,10) + parseInt(this.inferiorQty,10) + parseInt(this.concessionAcceptanceQty,10);
				if (this.inspectQty != inspectQuantity) {
					Notify.info("提示", "请确保和个数量、让步接收数量、不良品数量之和等于检验数量。", true);
					return;
				}
				var _self = this;
				_self.inspectDatas.forEach(function (item) {
					if (item.inventoryInstanceInspectRequestId == _self.inventoryInstanceInspectRequestId) {
						item.qualifiedQty = _self.qualifiedQty;
						item.concessionAcceptanceQty = _self.concessionAcceptanceQty;
						item.inferiorQty = _self.inferiorQty;
						item.quantity = _self.inspectQty;
						_self.qualifiedQty = "";
						_self.inferiorQty = "";
						_self.concessionAcceptanceQty = "";
					}
				});
				this.$refs.modal.hide();
			},

			/**
			 * 关闭模态框
			 */
			modalCancel : function () {
				this.qualifiedQty = "";
				this.inferiorQty = "";
				this.concessionAcceptanceQty = "";
				this.$refs.modal.hide();
			},

			/**
			 * 查询条码
			 */
			keyEnter : function(){
				var _self = this;
				var barCode = _self.barCode;
				_self.isExist = false;
				if(!barCode){
					Notify.error("提示", "请输入条码", true);
					return;
				}
				_self.inspectDatas.forEach(function(item){
					if(item.barCode == barCode){
						_self.isExist = true;
						Notify.info("提示", "您已扫描过该条码。", true);
						return;
					}
				});
				if (_self.isExist) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectResource/inspect/barCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.barCode = "";
						Loading.hide(uuid);
						var tempObj = {};
						data.forEach(function (item) {
							var id = item.inventoryInstanceInspectRequestId;
							tempObj[id] = "";
							item.qualifiedQty = 0;
							item.concessionAcceptanceQty = 0;
							item.inferiorQty = 0;
							_self.inspectDatas.push(item);
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
			 * 保存检验数据
			 */
			save: function(barCode){
				var flag = true;
				if (this.inspectDatas.length == 0) {
					Notify.info("提示", "无数据可保存。", true);
					return;
				}
				this.inspectDatas.forEach(function(item) {
					if (flag) {
						if (!item.qualifiedQty || !item.inferiorQty || !item.concessionAcceptanceQty) {
							Notify.info("提示", "请填写检验结果后再保存。", true);
							flag = false;
						}
					}
				});
				var _self = this;
				_self.inventoryInstanceInspectRequestId = "";
				if (_self.inspectDatas.length == 0) {
					Notify.info("提示", "无数据可保存。", true);
					return;
				}
				if (!flag) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectResource/generateInspect"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.inspectDatas),
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
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
			 * 清空数据
			 */
			clear : function(){
				var _self = this;
				_self.inventoryInstanceInspectRequestId = "";
				var len = _self.inspectDatas.length;
				if(len > 0){
					_self.inspectDatas.splice(0,len);
				}
				_self.barCode = "";
			},
		},

		watch : {
			"inspectQty" : {
				handler : function (to, from) {
					if (to != "") {
						if (to != parseInt(to)) {
							Notify.info("提示", "请输入整数。", true);
							this.inspectQty = parseInt(to);
							return;
						}
						if (to > this.maxQuantity) {
							Notify.info("提示", "不可大于可检验数量。", true);
							this.inspectQty = this.maxQuantity;
							return;
						}
						if (to < 0) {
							Notify.info("提示", "不可小于0。", true);
							this.inspectQty = 0;
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
