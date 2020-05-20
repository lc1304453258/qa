<template>
	<div class="container-fluid">
		<Navbar title="采购订单打印"></Navbar>
		<h6></h6>
		
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="存货名称/编号/规格型号" v-model.trim="inventoryMessage" @keyup.enter="keyEnter">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="v-select-container">
		  			<v-select :options="documentNos" v-model="documentNo" placeholder="订单号">
		  				<span slot="no-options">查询不到数据，请更换条件</span>
		  			</v-select>
	  			</div>
			</fieldset>
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="query">查询</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(purchaseOrderLines == undefined || purchaseOrderLines.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.订单号</div>
			  	<div class="card-block m-card-block">
			  		<p class="card-text">存货名称：请输入查询条件</p>
			  		<p class="card-text">存货编号：请输入查询条件</p>
			    	<p class="card-text">规格型号：请输入查询条件</p>
			    	<!-- <p class="card-text">订单号：请输入查询条件</p> -->
			    	<!-- <p class="card-text">下单时间：请输入查询条件</p> -->
			    	<p class="card-text">订单数量：请输入查询条件</p>
			    	<p class="card-text">已到货数量：请输入查询条件</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in purchaseOrderLines">
  				<div class="card bg-light">
				  	<div class="card-header">{{index + 1}}.订单号：{{data.documentNo}}（{{data.createDate | dateTransfrom}}）</div>
				  	<div class="card-block m-card-block" @click="changePage2(data)">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text">存货编号：{{data.inventoryCode}}</p>
				    	<p class="card-text" v-if="data.inventoryType">规格型号：{{data.inventoryType}}</p>
				    	<!-- <p class="card-text">订单号：{{data.documentNo}}</p> -->
				    	<!-- <p class="card-text">下单时间：{{data.createDate}}</p> -->
				    	<p class="card-text">订单数量：{{data.quantity}}</p>
				    	<p class="card-text">已到货数量：{{data.receivedQuatity}}</p>
				  	</div>
				</div>
  			</div>
  		</div>

	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var vSelect = require("vue-select");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			"v-select": vSelect.VueSelect, Navbar
		},
		data: function () {
			return {
				documentNos: [],
				documentNo: "",
				inventoryMessage: "",
				purchaseOrderLines: [],
			}
		},
		methods: {

			/**
			 * 清空数据
			 */
			clear: function () {
				this.inventoryMessage = "";
				this.documentNo = "";
				this.purchaseOrderLines = [];
			},

			/**
			 * 清空存货查询信息
			 */
			clearText: function () {
				this.inventoryMessage = "";
			},

			/**
			 * 查询所有订单号
			 */
			listPurchaseOrderNo: function () {
				var _self = this;
				$.ajax({
					url: Common.getApiURL("PurchaseOrderResource/listPurchaseOrderNo"),
					type: "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						_self.documentNos = data;
					},	
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},


			/**
			 * 根据存货信息、订单号查询订单
			 */
			query: function () {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("PurchaseOrderLineResource/queryByNoInventory"),
					type: 'post',
					data: {
						documentNo: _self.documentNo,
						inventoryMessage: _self.inventoryMessage,
					},
					dataType : "json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.purchaseOrderLines = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			/**
			 * 切换到包装页面
			 */
			changePage2: function (purchaseOrderLine) {
				var p = {
					page: 2,
					purchaseOrderLine: purchaseOrderLine,
				};
				this.$emit("changePage", p);
			},
		},
		filters: {
			dateTransfrom: function (data) {
				return data.slice(0, 10);
			}
		},
		mounted: function () {
			this.listPurchaseOrderNo();
		},
		watch: {
			"documentNo": {
				handler: function (to, from) {
					this.query();
				},
				deep: true
			},
		}
	}
</script>
