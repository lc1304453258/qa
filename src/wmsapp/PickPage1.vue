<template>
	<div class="container-fluid">
		<Navbar title="领料"></Navbar>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div class="input-group">
		  			<input id="barcode-input" type="text" class="form-control" placeholder="存货名称/编码/规格型号" v-model="inventoryMessage">
				  	<span class="input-group-addon" id="barcode-input" @click="clearText">&times;</span>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="v-select-container">
		  			<v-select :options="projectItems" v-model="projectItem" label="name" placeholder="项目"></v-select>
		  		</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="v-select-container">
		  			<v-select :options="subProjectItems" v-model="subProjectItem" label="name" placeholder="子项目"></v-select>
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
					<button type="button" class="btn btn-primary btn-sm" @click="queryBtn">查询</button>
					<button type="button" class="btn btn-success btn-sm" @click="startStockOut">
						领料车
						{{unProcessedCount}}
					</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group m-card-item" v-if="(currentStocks == undefined || currentStocks.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">序号.存货编号</div>
			  	<div class="card-block">
			  		<p class="card-text">存货名称：请输入查询条件</p>
			  		<p class="card-text">仓库名称：请输入查询条件</p>
			    	<p class="card-text">批号：请输入查询条件</p>
			    	<p class="card-text">库存数量：请输入查询条件</p>
			    	<p class="card-text">待领数量：请输入查询条件</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in currentStocks">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{index + 1}}.存货编号：{{data.inventoryCode}}
				  		<button type="button" class="close" aria-label="Close" @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
				  	</div>
				  	<div class="card-block">
				  		<p class="card-text">存货名称：{{data.inventoryName}}</p>
				  		<p class="card-text">仓库名称：{{data.warehouseName}}</p>
				    	<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				    	<p class="card-text">库存数量：{{data.inventoryQuantity}}</p>
				    	<p class="card-text">待领数量：{{data.pickedQuantity}}</p>
				  	</div>
				  	<div class="card-footer">
						<div class="input-group">
			  				<input id="barcode-input1" type="number" class="form-control" v-model="data.pickQuantity">
					  		<span class="input-group-addon" id="barcode-input1" @click="createStockOutPrepare(data)">添加</span>
						</div>
				  	</div>
				</div>
  			</div>
  		</div>

  		<div>
			<Pagination :pagination="pagination" :callback="query" :options="paginationOptions" :size="'small'" v-if="currentStocks.length > 0"></Pagination>
		</div>

	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Pagination = require("../widget/VueBootstrapPagination.vue");
	var vSelect = require("vue-select");
	var Notify = require("../Widget/Notify.js");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			Common,
			"v-select": vSelect.VueSelect,
			Notify,
			Pagination,
			Navbar
		},
		data: function () {
			return {
				projectItems: [],
				subProjectItems: [],
				message: "",
				warehouses: [],
				projectItem: null,
				subProjectItem: null,
				warehouse: null,
				inventoryMessage: "",
				currentStocks: [],
				unProcessedCount: "",
				visible: false,
				currentStock: null,
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

			deleteOne: function (index) {
				this.currentStocks.splice(index, 1);
			},

			/**
			 * 清空文本框内的文本
			 */
			clearText: function(){
				this.inventoryMessage = "";
			},

			//清空
			clear: function () {
				this.projectItem = null;
				this.subProjectItem = null;
				this.warehouse = null;
				this.inventoryMessage = "";
				this.currentStocks = [];
			},

			queryBtn: function () {
				this.pagination.current_page = 1;
				this.query();
			},

			//根据条件查询仓库库存
			query: function () {
				var _self = this;
				this.currentStocks = [];
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("CurrentStockResource/queryByProjectItemWarehouseInventory"),
					type : "post",
					data : {
						projectItemId: _self.projectItem?_self.projectItem.id:null,
						subProjectItemId: _self.subProjectItem?_self.subProjectItem.id:null,
						warehouseId: _self.warehouse?_self.warehouse.id:null,
						inventoryMessage : _self.inventoryMessage,
						currentPage: _self.pagination.current_page,
						pageSize: _self.pagination.per_page,
					},
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						console.log(data);
						if(data.currentStocks == null || data.currentStocks.length == 0){
							Notify.info("提示", "没有查询到任何数据。", true);
						} else {
							_self.pagination.last_page = Math.ceil(data.totalSize / _self.pagination.per_page);
							data.currentStocks.forEach(function(item) {	
								_self.currentStocks.push(item);
							})
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			//查询所有仓库
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

			//查询所有项目
			queryAllProjectItem: function () {
				var _self = this;
				$.ajax({
					url : Common.getApiURL("ProjectItemResource/all"),
					type : "get",
					beforeSend : function (request) {
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						data.forEach(function (item) {
							_self.projectItems.push(item);
						});
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			//根据主项目id查询所有子项目
			querySubProjectItem: function () {
				var _self = this;
				var projectItemId = this.projectItem.id;
				$.ajax({
					url : Common.getApiURL("ProjectItemResource/querySubProjectItems?projectItemId=") + projectItemId,
					type : "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						_self.subProjectItems = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			//根据仓库库存生成领料
			createStockOutPrepare: function (currentStock) {
				var _self = this;
				if (!currentStock.pickQuantity) {
					Notify.error("提示", "请输入领料数量。", true);
					return;
				}
				if (currentStock.pickQuantity > currentStock.inventoryQuantity) {
					Notify.error("提示", "领料数量不能超过库存数量。", true);
					return;
				}
				if (currentStock.pickQuantity != parseInt(currentStock.pickQuantity) || currentStock.pickQuantity <= 0) {
					Notify.error("提示", "请输入正整数。", true);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("CurrentStockResource/createStockOutPrepare"),
					data: JSON.stringify(currentStock),
					type: "post",
					contentType: "application/json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						currentStock.pickQuantity = null;
						_self.refreshCurrentStock(currentStock);
						_self.queryStockOutPrepare();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			//重新读取仓库库存
			refreshCurrentStock: function(currentStock) {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("CurrentStockResource/refresh"),
					data: JSON.stringify(currentStock),
					type: "post",
					contentType: "application/json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						currentStock.pickedQuantity = data.pickedQuantity;
						currentStock.inventoryQuantity = data.inventoryQuantity;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			//重新读取所有仓库库存
			refreshAllCurrentStock: function() {
				var _self = this;
				if (this.currentStocks.length == 0) {
					return;
				}
				this.currentStocks.forEach(function(item) {
					_self.refreshCurrentStock(item);
				});
			},

			//查询未处理的领料数量
			queryStockOutPrepare: function() {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/queryUnProcessedCount"),
					type : "get",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.unProcessedCount = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			//领料准备
			startStockOut: function () {
				var p = {
					page: 2
				};
				this.$emit("changePage", p);
			}
		},

		watch: {
			"projectItem": {
				handler: function (to, from) {
					if (to) {
						this.querySubProjectItem();
					}
				},
				deep: true
			},
		},

		mounted: function () {
			this.queryAllWarehouse();
			this.queryAllProjectItem();
			this.queryStockOutPrepare();
		}
	}
</script>
