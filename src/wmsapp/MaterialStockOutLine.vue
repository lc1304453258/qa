<template>
	<div class="container-fluid">
		<Navbar :title="'出库('+ materialStockOut.documentNo + ')'"></Navbar>
		
		<h6></h6>
	  	<div>
			<fieldset class="form-group">
				<div class="card-group" style="font-size:0.8em;">
					<div class="card bg-light">
					  	<div class="card-block">
					  		<p class="card-text" v-if="materialStockOut.projectInventoryName">项目名称：{{materialStockOut.projectInventoryName}}</p>
					    	<p class="card-text">仓库名称：{{materialStockOut.warehouseName}}</p>
					    	<p class="card-text">领料人：{{materialStockOut.pickUser}}</p>
					    	<p class="card-text">制单时间：{{materialStockOut.createDate}}</p>
					  	</div>
					</div>
				</div>
			</fieldset>

  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="approve">
							审批
					</button>
	  			</div>
			</fieldset>
		</div>

		<div class="row">
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in stockOutLines">
  				<div class="card bg-light" @click="showPosition(data)">
				  	<div class="card-header">{{index + 1}}.存货编号：{{data.inventoryCode}}</div>
				  	<div class="card-block">
				  		<p class="card-text" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text" v-if="data.inventoryType">规格型号：{{data.inventoryType}}</p>
				    	<p class="card-text" v-if="data.projectInventoryName">子项目：{{data.projectInventoryName}}</p>
				    	<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				    	<p class="card-text">出库数量：{{data.quantity}}</p>
				    	<p class="card-text">
				    		已拣货数量：<span class="text-success" v-if="data.pickedQuantity == data.quantity">{{data.pickedQuantity}}</span>
				    		<span class="text-danger" v-else>{{data.pickedQuantity}}</span>
				    	</p>
				  	</div>
				</div>
  			</div>
  		</div>

	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		props: ["materialStockOut"],
		components: {
			Common, Navbar
		},
		data: function () {
			return {
				stockOutLines: [],
			}
		},

		methods: {

			//审批
			approve: function () {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("StockOutResource/approve"),
					type : "post",
					data : JSON.stringify(this.materialStockOut),
					contentType: "application/json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						Notify.success("成功", "审批成功！", true);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			queryStockOutLines: function () {
				var _self = this;
				var stockOutId = this.materialStockOut.stockOutId;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("StockOutLineResource/queryStockOutLines?stockOutId=") + stockOutId,
					type : "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						console.log(data);
						data.forEach(function (item) {
							item.materialStockOut = _self.materialStockOut;
							_self.stockOutLines.push(item);
						});
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showPosition: function (materialStockOutLine) {
				var p = {
					page: 3
				};
				p.materialStockOutLine = materialStockOutLine;
				this.$emit("changePage", p);
			},

			showColor: function (index) {
				return !(index % 2);
			},

			goBack: function () {
				var p = {
					page: 1
				};
				this.$emit("changePage", p);
			},
		},


		mounted: function () {
			this.queryStockOutLines();
		}
	}
</script>
