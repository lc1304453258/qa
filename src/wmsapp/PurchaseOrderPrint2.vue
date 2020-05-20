<template>
	<div class="container-fluid">
		<Navbar title="打印包装"></Navbar>
		
		<h6></h6>

	  	<div>
	  		<fieldset class="form-group">
				<div class="card-group m-card-item0">
					<div class="card bg-light">
					  	<div class="card-block m-card-block">
					  		<p class="card-text">订单号：{{purchaseOrderLine.documentNo}}</p>
					  		<p class="card-text">存货编号：{{purchaseOrderLine.inventoryCode}}</p>
					  		<p class="card-text">存货名称：{{purchaseOrderLine.inventoryName}}</p>
					    	<p class="card-text" v-if="purchaseOrderLine.inventoryType">规格型号：{{purchaseOrderLine.inventoryType}}</p>
					    	<p class="card-text">订单数量：{{purchaseOrderLine.quantity}}</p>
					    	<p class="card-text">已到货数量：{{purchaseOrderLine.receivedQuatity}}</p>
					  	</div>
					</div>
				</div>
			</fieldset>

			<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="beforeAddPack">添加包装</button>
		  			<button type="button" class="btn btn-primary btn-sm" @click="beforeAddPacks">添加多个包装</button>
		  			<button type="button" class="btn btn-primary btn-sm" @click="printAll">打印全部</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group" v-if="(inventoryInstances == undefined || inventoryInstances.length == 0)">
			<div class="card bg-light m-card-item">
			  	<div class="card-header">序号.包装内数量</div>
			  	<div class="card-block m-card-block">
			  		<p class="card-text">批号</p>
			  		<p class="card-text">包装时间</p>
			  		<p class="card-text">条码</p>
			  		<p class="card-text">打印次数</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryInstances">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.包装内数量：{{data.quantity}}
				  		<button type="button" class="close" aria-label="Close" @click="deletePack(data)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block m-card-block">
				  		<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				  		<p class="card-text">包装时间：{{data.createDate}}</p>
				  		<p class="card-text">条码：{{data.barCode}}</p>
				  		<p class="card-text">打印次数：{{data.printCount}}</p>
				  	</div>
				  	<div class="card-footer text-center">
				  		<button class="btn btn-sm btn-primary" @click="print(data)">打印</button>
				  	</div>
				</div>
  			</div>
  		</div>

		<Modal ref="modal" title="添加包装" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
  						<label>包装内数量</label>
  						<input type="number" class="form-control" v-model.trim="quantity">
  					</div>
  					<div class="form-group">
  						<label>批号</label>
  						<input type="text" class="form-control" v-model.trim="batchNo">
  					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
					<button type="button" class="btn btn-primary" @click="addPack">确定</button>
  					<button type="button" class="btn btn-danger" @click="modalCancel">取消</button>
				</div>
			</div>
		</Modal>

		<Modal ref="modal2" title="添加多个包装" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
  						<label>包装数量</label>
  						<input type="number" class="form-control" v-model.trim="packageQuantity">
  					</div>
					<div class="form-group">
  						<label>包装内数量</label>
  						<input type="number" class="form-control" v-model.trim="quantity">
  					</div>
  					<div class="form-group">
  						<label>批号</label>
  						<input type="text" class="form-control" v-model.trim="batchNo">
  					</div>
				</div>
			</div>
			<div slot="footer">
				<div>
					<button type="button" class="btn btn-primary" @click="addPacks">确定</button>
  					<button type="button" class="btn btn-danger" @click="modalCancel2">取消</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Modal = require("../widget/Modal.vue");
	var Loading = require("../common/Loading.js");
	var Notify = require("../widget/Notify.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		props: ["purchaseOrderLine"],
		components: {
			Modal,Navbar
		},
		data: function () {
			return {
				quantity: "",
				packageQuantity: "",
				batchNo: "",
				inventoryInstances: [],
			}
		},
		methods: {

			/**
			 * 打印全部
			 */
			printAll: function () {
				var _self = this;
				this.inventoryInstances.forEach(function (item) {
					_self.print(item);
				});
			},

			/**
			 * 打印存货
			 */
			print: function (inventoryInstance) {
				var _self = this;
				var ids = [];
				ids.push(inventoryInstance.id);
				var token = Common.getToken();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceResource/print?token=") + token + "&recordIds=" + ids,
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data1) {
						var arr = JSON.parse(data1);
						if(arr != null && arr.length > 0){
							var obj = arr[0];
							// var Argus = plugin.bluetoothPrinter.PrintSync(JSON.stringify(obj));
							plugin.bluetoothPrinter.print(JSON.stringify(obj));
						}
						// _self.loadInventoryInstance();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						  Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			deletePack : function (inventoryInstance){
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceResource/deleteByInventoryInstanceId?inventoryInstanceId=") + inventoryInstance.id,
					type : "get",
					beforeSend : function(request){
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.loadInventoryInstance();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
			            Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			beforeAddPacks: function () {
				this.packageQuantity = "";
				this.batchNo = "";
				this.quantity = "";
				this.$refs.modal2.show();
			},

			beforeAddPack: function () {
				this.batchNo = "";
				this.quantity = "";
				this.$refs.modal.show();
			},

			addPacks: function () {
				var _self = this;
				if (!this.quantity) {
					Notify.error("提示", "请输入包装内数量", true);
					return;
				}
				if (!this.packageQuantity) {
					Notify.error("提示", "请输入包装数量", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("InventoryInstanceResource/addPacks"),
					type: 'post',
					data: {
						purchaseOrderLineId: _self.purchaseOrderLine.id,
						quantity: _self.quantity,
						packageQuantity: _self.packageQuantity,
						batchNo: _self.batchNo,
					},
					dataType : "json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.$refs.modal2.hide();
						_self.loadInventoryInstance();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			addPack: function () {
				var _self = this;
				if (!this.quantity) {
					Notify.error("提示", "请输入数量", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("InventoryInstanceResource/addPack"),
					type: 'post',
					data: {
						purchaseOrderLineId: _self.purchaseOrderLine.id,
						quantity: _self.quantity,
						batchNo: _self.batchNo,
					},
					dataType : "json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.$refs.modal.hide();
						_self.loadInventoryInstance();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			loadInventoryInstance: function () {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("InventoryInstanceResource/queryByPurchaseOrderLine?purchaseOrderLineId=") + _self.purchaseOrderLine.id,
					type : "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.inventoryInstances = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			modalCancel: function () {
				this.$refs.modal.hide();
			},

			modalCancel2: function () {
				this.$refs.modal2.hide();
			},


			/**
			 * 返回上一页
			 */
			back: function () {
				var p = {
					page: 1,
				};
				this.$emit("changePage", p);
			},
		},
		mounted: function () {
			this.loadInventoryInstance();
		}
	}
</script>

<style scoped>
	.m-card-item0{
		font-size: 0.8em;
	}
	
</style>