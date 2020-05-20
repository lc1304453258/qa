<template>
	<div class="container-fluid">
		<Navbar title="出库"></Navbar>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="出库单号" v-model.trim="documentNo" @keydown="keydown($event)">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<div class="v-select-container">
		  			<v-select :options="warehouses" v-model="warehouse" label="name" placeholder="仓库"></v-select>
		  		</div>
			</fieldset>
			
  		  	<fieldset class="form-group">
		  		<div>
		  			<!-- <button type="button" class="btn btn-link" @click="back">返回</button> -->
		  			<button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
					<button type="button" class="btn btn-primary btn-sm" @click="queryMaterialStockOutBtn">查询</button>
					<button type="button" class="btn btn-primary btn-sm">保存</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(materialStockOutDatas == undefined || materialStockOutDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.出库单号</div>
			  	<div class="card-block">
			  		<p class="card-text">制单时间</p>
			    	<p class="card-text">仓库名称</p>
			    	<p class="card-text">出库存货</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in materialStockOutDatas">
  				<div class="card bg-light" @click="showLines(data)">
				  	<div class="card-header">{{index + 1}}.出库单号：{{data.documentNo}}</div>
				  	<div class="card-block">
				  		<p class="card-text">制单时间：{{data.createDate}}</p>
				    	<p class="card-text">仓库名称：{{data.warehouseName}}</p>
				    	<p class="card-text">出库存货：
				    		<span v-for="(inventory, index) in data.inventorys">
				    			{{inventory.inventoryName}}（{{inventory.inventoryCode}}）* {{inventory.quantity}}
				    			<span v-if="index + 1 < data.inventorys.length">，</span>
				    		</span>
				    	</p>
				  	</div>
				</div>
  			</div>
  		</div>

		<div>
			<Pagination :pagination="pagination" :callback="queryMaterialStockOut" :options="paginationOptions" :size="'small'"></Pagination>
		</div>

	</div>
</template>


<script>
	var Common = require("../common/Common.js");
	var Pagination = require("../widget/VueBootstrapPagination.vue");
	var Notify = require("../widget/Notify.js");
	var vSelect = require("vue-select");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			Pagination, Common, Notify, "v-select": vSelect.VueSelect, Navbar
		},
		data: function () {
			return {
				materialStockOutDatas: [],
				documentNo: "",
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
			}
		},

		methods: {

			/**
			 * 清空文本框内的文本
			 */
			clearText: function(){
				this.documentNo = "";
			},

			//按下enter键时执行该函数
			keydown: function (event) {
				if (event.keyCode == 13) {
					this.pagination.current_page = 1;
					this.queryMaterialStockOut();
				}
			},

			queryMaterialStockOutBtn: function () {
				this.pagination.current_page = 1;
				this.queryMaterialStockOut();
			},

			//根据documentNo和仓库查询对应的出库单
			queryMaterialStockOut: function () {
				this.materialStockOutDatas.splice(0, this.materialStockOutDatas.length);	
				var _self = this;
				var documentNo = $.trim(_self.documentNo);
				var warehouseId;
				if (this.warehouse) {
					warehouseId = this.warehouse.id;
				} else {
					warehouseId = "";
				}
				if (warehouseId == undefined) {
					warehouseId = "";
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("StockOutResource/queryStockOuts"),
					dataType: "json",
					type : "post",
					data: {
						documentNo: documentNo,
						warehouseId: warehouseId,
						currentPage: _self.pagination.current_page,
						pageSize: _self.pagination.per_page,
					},
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						console.log(data);
						data.stockOuts.forEach(function (item) {
							_self.materialStockOutDatas.push(item);
						});
						var size = data.totalCount;
						_self.pagination.last_page = Math.ceil(size / _self.pagination.per_page);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			queryAllWarehouse: function () {
				var _self = this;
				$.ajax({
					url : Common.getApiURL("WarehouseResource/all"),
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						data.forEach(function (item) {
							_self.warehouses.push(item);
						});
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			showColor: function (index) {
				return !(index % 2);
			},

			clear: function () {
				this.pagination.last_page = 0;
				this.materialStockOutDatas.splice(0, this.materialStockOutDatas.length);
				// this.warehouseId = "";
				this.warehouse = null;
				this.documentNo = "";
			},

			showLines: function (materialStockOut) {
				var p = {
					page: 2
				};
				p.materialStockOut = materialStockOut;
				this.$emit("changePage", p);
			}
		},

		mounted: function () {
			this.queryAllWarehouse();
			this.queryMaterialStockOut();
		},

		watch: {
			"warehouse": {
				handler: function (to, from) {
					if (to) {
						this.pagination.current_page = 1;
						this.queryMaterialStockOut();
					}
				},
				deep: true
			},
		}
	}
</script>
