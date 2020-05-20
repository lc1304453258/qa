<template>
	<div class="container-fluid">
		<Navbar title="不良品处理"></Navbar>
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

		<div class="card-group m-card-item" v-if="(inspectRejectDatas == undefined || inspectRejectDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请扫码</p>
			    	<p class="card-text">存货条码：请扫码</p>
			    	<p class="card-text">存货批号：请扫码</p>
			    	<p class="card-text">检验单号：请扫码</p>
			    	<p class="card-text">项目名称：请扫码</p>
			    	<p class="card-text">供应商名称：请扫码</p>
			    	<p class="card-text">不良品数量：请扫码</p>
			    	<p class="card-text">报待处理不良品<small>（拒收/报废）</small> 数量：请扫码</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inspectRejectDatas">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block" @click="showModal(data,index)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text">存货条码：{{data.barCode}}</p>
				    	<p class="card-text" v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
				    	<p class="card-text">检验单号：{{data.incomingInspectionDocumentNo}}</p>
				    	<p class="card-text">项目名称：{{data.projectInventoryName}}</p>
				    	<p class="card-text">供应商名称：{{data.vendorName}}</p>
				    	<p class="card-text">不良品数量：{{data.inferiorQty}}</p>
				    	<p class="card-text">报待处理不良品<small>（拒收/报废）</small> 数量：<span class="text-primary"><b>{{data.quantity}}
						<small>（{{data.refuseQuantity}} / {{data.disposeQuantity}}）</small></b></span></p>
				  	</div>
				</div>
  			</div>
  		</div>

 		<Modal ref="modal" title="报检信息" large="true">
			<div slot="body">
				<div class="form-group">
	  				<label>不良品处理数量:</label>
	  				<input type="number" v-model="quantity" class="form-control" min="0" :max="maxQuantity">
	  			</div>
	  			<div class="form-group">
	  				<label>拒收数量:</label>
	  				<input type="number" v-model="refuseQuantity" class="form-control">
	  			</div>
	  			<div class="form-group">
	  				<label>拒收原因:</label>
	  				<input type="text" class="form-control" v-model="refuseReason">
	  			</div>
	  			<div class="form-group">
	  				<label>报废数量:</label>
	  				<input type="number" class="form-control" v-model="disposeQuantity">
	  			</div>
	  			<div class="form-group">
	  				<label>报废原因:</label>
	  				<input type="text" class="form-control" v-model="disposeReason">
	  			</div>
			</div>
			<div slot="footer">
				<div>
  					<button class="btn btn-primary" @click="modalSave">确定</button>
	  				<button class="btn btn-danger" @click="modalCancel">取消</button>
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
				inspectRejectDatas : [],
				isExist : false,
				refuseReasons : [],
				refuseCode : "",
				disposeCode : "",
				disposeReasons : [],
				quantity : "",
				refuseQty : "",
				disposeQty : "",
				refuseLineArr : [],
				disposeLineArr : [],
				incomingInspectionId : "",
				dealOrgnizations : "",
				disposeDepNo : "",
				refuseDepNo : "",
				refuseQuantity: "",
				disposeQuantity: "",
				refuseReason: "",
				disposeReason: "",
				incomingInspectionId: "",
				obj: null,
				maxQuantity: "",
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
			 * 删除界面一条数据
			 */
			deleteOne: function (index) {
				this.inspectRejectDatas.splice(index, 1);
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
			showModal: function (inspectReject) {
				for (var id in this.obj) {
					if (this.obj[id] == "" && id == inspectReject.incomingInspectionId) {
						this.obj[id] = inspectReject.quantity;
						break;
					}
				}
				this.incomingInspectionId = inspectReject.incomingInspectionId;
				this.quantity = inspectReject.quantity;
				this.maxQuantity = this.obj[this.incomingInspectionId];
				this.$refs.modal.show();
			},

			/**
			 * 保存模态框
			 */
			modalSave: function () {
				//检测是否可以保存
				if (!this.refuseQuantity || !this.disposeQuantity) {
					Notify.info("提示", "报废数量、拒收数量为必填项。", true);
					return;
				}
				if (parseInt(this.refuseQuantity) != this.refuseQuantity || parseInt(this.disposeQuantity) != this.disposeQuantity) {
					Notify.info("提示", "请填写整数。", true);
					return;
				}
				if (parseInt(this.refuseQuantity) + parseInt(this.disposeQuantity) != this.quantity) {
					Notify.info("提示", "请确保报废数量、拒收数量之和等于不良品处理数量。", true);
					return;
				}
				if (this.refuseQuantity < 0 || this.disposeQuantity < 0) {
					Notify.info("提示", "不能小于0。", true);
					return;
				}
				if (this.refuseQuantity != 0) {
					if (this.refuseReason == "") {
						Notify.info("提示", "请填写拒收原因。", true);
						return;
					}
				}
				if (this.disposeQuantity != 0) {
					if (this.disposeQuantity =="") {
						Notify.info("提示", "请填写报废原因。", true);
						return;
					}
				}
				var _self = this;
				var flag = true;
				this.inspectRejectDatas.forEach(function (item) {
					if (flag) {
						if (item.incomingInspectionId == _self.incomingInspectionId) {
							item.quantity = _self.quantity;
							item.refuseQuantity = _self.refuseQuantity;
							item.disposeQuantity = _self.disposeQuantity;
							item.refuseReason = _self.refuseReason;
							item.disposeReason = _self.disposeReason;
							flag = false;
						}
					}
				});
				this.$refs.modal.hide();
				this.refuseQuantity = "";
				this.refuseReason = "";
				this.disposeQuantity = "";
				this.disposeReason = "";
			},

			/**
			 * 关闭模态框
			 */
			modalCancel: function () {
				// $("#modal").modal("hide");
				this.refuseQuantity = "";
				this.refuseReason = "";
				this.disposeQuantity = "";
				this.disposeReason = "";
				this.$refs.modal.hide();
			},

			/**
			 * 查询条码
			 */
		    keyEnter : function(){
				var _self = this;
				_self.isExist = false;
				if(_self.barCode == null || _self.barCode == ""){
					Notify.info("提示", "请输入条码。", true);
					return;
				}
				var barCode = $.trim(_self.barCode);
				_self.inspectRejectDatas.forEach(function(item){
					if(item.barCode == barCode){
						_self.isExist = true;
						Notify.info("提示", "条码重复输入。", true);
					}
				});
				if (_self.isExist) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectRejectResource/inventoryinstance/barCode?barCode=") + barCode,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						_self.barCode = "";
						Loading.hide(uuid);
						var tempObj = {};
						data.forEach(function (item) {
							var id = item.incomingInspectionId;
							tempObj[id] = "";
							item.refuseQuantity = 0;
							item.refuseReason = "";
							item.disposeQuantity = 0;
							item.disposeReason = "";
							_self.inspectRejectDatas.push(item);
						})
						_self.obj = tempObj;
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
			clear : function () {
				this.inspectRejectDatas.splice(0, this.inspectRejectDatas.length);
				this.barCode = "";
			},

			/**
			 * 保存不良品数据
			 */
			save : function(){
				var _self = this;
				var flag = true;
				if (this.inspectRejectDatas.length == 0) {
					Notify.info("提示", "无数据可保存。", true);
					return;
				}
				this.inspectRejectDatas.forEach(function (item) {
					if (flag) {
						if (!item.refuseQuantity || !item.disposeQuantity) {
							Notify.info("提示", "请填写不良品处理结果后再保存。", true);
							flag = false;
						}
					}
				});
				if (!flag) {
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceInspectRejectResource/generateInspectReject"),
					dataType : "json",
					type : "post",
					contentType : "application/json",
					data : JSON.stringify(_self.inspectRejectDatas),
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
		},
		
		watch : {
			"quantity": {
				handler: function(newValue, oldValue) {
					if (newValue) {
						if (parseInt(newValue) != newValue) {
							Notify.info("提示", "请输入整数。", true);
							this.quantity = parseInt(newValue, 10);
							return;
						}
						if (newValue > this.maxQuantity) {
							Notify.info("提示", "不可大于可处理不良品数量。", true);
							this.quantity = this.maxQuantity;
							return;
						}
						if (newValue < 0) {
							Notify.info("提示", "不可小于0。", true);
							this.quantity = 0;
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

