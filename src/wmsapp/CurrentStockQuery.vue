<template>
	<div class="container-fluid">
		<Navbar title="仓库库存查询"></Navbar>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="存货名称/编号/批号" v-model.trim="inventoryMessage">
				  	<span class="input-group-addon" id="barcode-input" @click="clearInventoryText">&times;</span>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<div class="v-select-container">
	  				<v-select label="name" :options="warehouses" v-model="warehouse" placeholder="仓库"></v-select>
	  			</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<button type="button" class="btn btn-primary btn-sm" @click="queryCurrentStockBtn">查询</button>
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(currentStocks == undefined || currentStocks.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称</p>
			  		<p class="card-text">规格型号</p>
			    	<p class="card-text">批号</p>
			    	<p class="card-text">入库单号</p>
			    	<p class="card-text">库存数量</p>
			    	<p class="card-text">仓库名称</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in currentStocks">
  				<div class="card bg-light">
				  	<div class="card-header">{{index + 1}}.存货编号：{{data.inventoryCode}}</div>
				  	<div class="card-block">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text" v-if="data.inventoryType">规格型号：{{data.inventoryType}}</p>
				    	<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				    	<p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
				    	<p class="card-text">库存数量：{{data.inventoryQuantity}}</p>
				    	<p class="card-text">仓库名称：{{data.warehouseName}}</p>
				  	</div>
				</div>
  			</div>
  		</div>

		<Pagination :pagination="pagination" :callback="queryCurrentStock" :options="paginationOptions" v-if="currentStocks.length > 0" :size="'small'"></Pagination>
	</div>
</template>

<script>
	var vSelect = require("vue-select");
	var Common = require("../common/Common.js");
	var Notify = require("../widget/Notify.js");
	var Pagination = require("../widget/VueBootstrapPagination.vue");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			"v-select": vSelect.VueSelect,
			Pagination,
			Navbar
		},

		data: function () {
			return {
				inventoryMessage: '',
				// batchNo: '',
				warehouse: null,
				warehouses: [],
				pagination: {
			        total: 0,
			        per_page: 20,
			        current_page: 1, 
			        last_page: 0,   
			        from: 1,
			        to: 10
			    },
			    paginationOptions: {
			        offset: 5,
			        previousText: '上一页',
			        nextText: '下一页',
			        alwaysShowPrevNext: true
			    },
			    currentStocks: [],
			}
		},

		methods: {
			
			/**
			 *清空存货信息
			 */
			clearInventoryText: function () {
			 	this.inventoryMessage = '';
			},

			/**
			*清空批号信息
			*/
			clearBatchNoText: function () {
				this.batchNo = '';
			},

			/**
			 *清空查询信息
			 */
			clear: function () {
				this.warehouse = null;
				this.inventoryMessage = '';
				this.batchNo = '';
				this.currentStocks = [];
			},

			/**
			 *查询所有仓库
			 */
			queryWarehouse: function () {
				var _self = this;
				$.ajax({
					url: Common.getApiURL("WarehouseResource/all"),
					type: "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						_self.warehouses = data;
					},	
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			/**
			 *点击查询按钮查询
			 */
			queryCurrentStockBtn: function () {
				this.pagination.current_page = 1;
				this.queryCurrentStock();
			},

			/**
			 *根据条件查询仓库库存
			 */
			queryCurrentStock: function () {
				var _self = this;
				var warehouseId = null;
				if (this.warehouse) {
					warehouseId = this.warehouse.id;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("CurrentStockResource/queryCurrentStocks"),
					type: 'post',
					data: {
						inventoryMessage: _self.inventoryMessage,
						warehouseId: warehouseId,
						currentPage: _self.pagination.current_page,
						pageSize: _self.pagination.per_page,
					},
					dataType : "json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.currentStocks = [];
						if (data.currentStocks) {
							_self.currentStocks = data.currentStocks;
						}
						var size = data.totalSize;
						_self.pagination.last_page = Math.ceil(size / _self.pagination.per_page);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			}


		},

		mounted: function () {
			this.queryWarehouse();
			this.queryCurrentStock();
		}
	}

</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>