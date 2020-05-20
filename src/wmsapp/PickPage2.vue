<template>
	<div class="container-fluid">
		<Navbar title="领料车"></Navbar>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group text-center">
		  		<div class="btn-group text-center">
		  			<button type="button" class="btn btn-default btn-sm" :class="{'btn-primary':content == '未处理'}" @click="notProcessedContent" >
		  				<span :class="{'text-primary':content == '已处理'}">
						未处理&nbsp;&nbsp;&nbsp;{{totalSizeOfNotHandled}}
						</span>
					</button>
					<button type="button" class="btn btn-default btn-sm" :class="{'btn-primary':content == '已处理'}" @click="processedContent" >
						<span  :class="{'text-primary':content == '未处理'}">
						已处理&nbsp;&nbsp;&nbsp;{{totalSizeOfHandled}}
						</span>
					</button>
	  			</div>
			</fieldset>
		</div>


		
		<div class="row" v-if="content == '未处理'">
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in notHandled">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		<!-- <input type='checkbox' v-model='stockOutPrepares' :value="data" :id="data.id"> -->
				  		{{(pagination1.current_page - 1) * pagination1.per_page + index + 1}}.存货编号：{{data.inventoryCode}}
						<button type="button" class="close" aria-label="Close" @click="deleteData(data)"><span aria-hidden="true">&times;</span></button>
					</div>
				  	<div class="card-block"  @click="showModal(data, index)">
				  		<p class="card-text" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				    	<p class="card-text">仓库名称：{{data.warehouseName}}</p>
				    	<p class="card-text">领料数量：<span class="text-primary"><b>{{data.quantity}}</b></span></p>
				  	</div>
				  	<div class="card-footer text-center">
				  		<div class="btn-group">
				  			<button type="button" class="btn btn-primary btn-sm" @click="pickInventory(data)">
				  				确认领料
				  			</button>
				  		</div>
				  	</div>
				</div>
  			</div>
  		</div>

		<div class="row" v-if="content == '已处理'">
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in handled">
  				<div class="card bg-light">
				  	<div class="card-header">
				  		{{(pagination2.current_page - 1) * pagination2.per_page + index + 1}}.存货编号：{{data.inventoryCode}}
					</div>
				  	<div class="card-block">
				  		<p class="card-text"  style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">存货名称：{{data.inventoryName}}</p>
				    	<p class="card-text" v-if="data.batchNo">批号：{{data.batchNo}}</p>
				    	<p class="card-text">仓库名称：{{data.warehouseName}}</p>
				    	<p class="card-text">领料数量：{{data.quantity}}</p>
				    	<p class="card-text">领料时间：{{data.date}}</p>
				  	</div>
				</div>
  			</div>
  		</div>


		<div v-if="content == '未处理'">
			<Pagination :pagination="pagination1" :callback="queryUnProcessedData" :options="paginationOptions1" :size="'small'"></Pagination>
		</div>

		<div v-if="content == '已处理'">
			<Pagination :pagination="pagination2" :callback="queryProcessedData" :options="paginationOptions2" :size="'small'"></Pagination>
		</div>


		<!-- 修改领料数量模态框 -->
		<Modal ref="modal" title="领料信息" large="true">
			<div slot="body">
				<div>
					<div class="form-group">
	  					<label>数量</label>
	  					<input type="number" class="form-control" v-model="quantity">
	  				</div>
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
	var Pagination = require("../widget/VueBootstrapPagination.vue");
	var Notify = require("../widget/Notify.js");
	var Modal = require("../widget/Modal.vue");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		components: {
			Common,
			Pagination,
			Modal,
			Navbar
		},
		data: function () {
			return {
				stockOutPrepare: "",
				quantity: "",
				maxQuantity: "",
				totalSizeOfHandled: "",  
				totalSizeOfNotHandled: "",
				handled: [],
				notHandled: [],
				content: "未处理",
				pagination1: {
			        total: 0,
			        per_page: 20,
			        current_page: 1, 
			        last_page: 0,   
			        from: 1,
			        to: 10
			    },
			    paginationOptions1: {
			        offset: 5,
			        previousText: '上一页',
			        nextText: '下一页',
			        alwaysShowPrevNext: true
			    },
			    pagination2: {
			        total: 0,
			        per_page: 20,
			        current_page: 1, 
			        last_page: 0,   
			        from: 1,
			        to: 10
			    },
			    paginationOptions2: {
			        offset: 5,
			        previousText: '上一页',
			        nextText: '下一页',
			        alwaysShowPrevNext: true
			    },
			    // processingData: []
			    stockOutPrepares: [],
			    checkAll: false,
			    index: ""
			}
		},
		methods: {

			selectAll: function (event) {
				var _self = this;
				if (event.currentTarget.checked) {
					this.stockOutPrepares = [];
					this.notHandled.forEach(function (item) {
						_self.stockOutPrepares.push(item);
					})
				} else {
					this.stockOutPrepares.splice(0, this.stockOutPrepares.length);
				}
			},

			showModal: function(stockOutPrepare, index) {
				this.stockOutPrepare = stockOutPrepare;
				this.quantity = stockOutPrepare.quantity;
				this.maxQuantity = stockOutPrepare.inventoryQuantity;
				this.index = index;
				this.$refs.modal.show();
			},

			deleteData: function(data) {
				var _self = this;
				var stockOutPrepares = [];
				stockOutPrepares.push(data);
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/deleteDatas"),
					type : "post",
					data : JSON.stringify(stockOutPrepares),
					contentType: "application/json",
					beforeSend : function (request){
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.queryUnProcessedData();
						_self.stockOutPrepares = [];
						this.$refs.modal.hide();
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})	
			},

			deleteDatas: function() {
				var _self = this;
				if (_self.stockOutPrepares.length == 0) {
					Notify.error("错误", "请选择要删除的数据。", false);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/deleteDatas"),
					type : "post",
					data : JSON.stringify(_self.stockOutPrepares),
					contentType: "application/json",
					beforeSend : function (request){
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.queryUnProcessedData();
						_self.stockOutPrepares = [];
						this.$refs.modal.hide();
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})	
			},

			modalSave: function() {
				var _self = this;
				this.stockOutPrepare.quantity = this.quantity;
				this.$refs.modal.hide();
				var stockOutPrepareId = this.stockOutPrepare.id;
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/changeQuantity"),
					async : true,
					dataType : "json",
					type : "post",
					data : {
						stockOutPrepareId : stockOutPrepareId,
						quantity : _self.quantity
					},
					beforeSend : function (request){
						Common.addTokenToRequest(request);
					},
					success : function (data) {
						Loading.hide(uuid);
						_self.queryUnProcessedData();
						this.$refs.modal.hide();
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			modalCancel: function() {
				this.$refs.modal.hide();
			},

			back: function () {
				var p = {
					page: 1
				}
				this.$emit("changePage", p);
			},

			notProcessedContent: function () {
				this.content = "未处理";
				this.queryUnProcessedData();
			},
			processedContent: function () {
				this.content = "已处理";
				this.queryProcessedData();
			},

			//查询未处理的领料
			queryUnProcessedData: function () {
				var _self = this;
				this.notHandled = [];
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/queryUnProcessedData"),
					type : "post",
					dataType : "json",
					data : {
						currentPage: _self.pagination1.current_page,
						pageSize: _self.pagination1.per_page
					},
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						data.stockOutPrepareDtos.forEach(function (item) {
							_self.notHandled.push(item);
						});
						var size = data.totalCount;
						_self.pagination1.last_page = Math.ceil(size / _self.pagination1.per_page);
						_self.totalSizeOfNotHandled = size;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			//查询已处理的领料
			queryProcessedData: function() {
				var _self = this;
				this.handled = [];
				var uuid = Loading.show();
				$.ajax({
					url : Common.getApiURL("stockOutPrepareResource/queryProcessedData"),
					type : "post",
					dataType : "json",
					data : {
						currentPage: _self.pagination2.current_page,
						pageSize: _self.pagination2.per_page
					},
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						data.stockOutPrepareDtos.forEach(function (item) {
							_self.handled.push(item);
						});
						var size = data.totalCount;
						_self.pagination2.last_page = Math.ceil(size / _self.pagination2.per_page);
						_self.totalSizeOfHandled = size;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			pickInventory: function (data) {
				var _self = this;
				if (data.quantity > data.inventoryQuantity) {
					Notify.error("提示", "领料数量不可大于库存数量。");
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("StockOutResource/saveByStockOutPrepare"),
					type: "post",
					data: JSON.stringify(data),
					contentType: "application/json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.stockOutPrepares = [];
						_self.queryUnProcessedData();
						_self.queryProcessedData();	
						Notify.success("成功", "领料成功！", true);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},

			pickInventorys: function () {
				var _self = this;
				var stockOutPrepares = this.stockOutPrepares;
				if (stockOutPrepares.length == 0) {
					Notify.error("错误", "请选择要处理的数据。", false);
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					url: Common.getApiURL("StockOutResource/saveByStockOutPrepare"),
					type: "post",
					data: JSON.stringify(stockOutPrepares),
					contentType: "application/json",
					beforeSend: function (request) {
						Common.addTokenToRequest(request);
					},
					success: function (data) {
						Loading.hide(uuid);
						_self.stockOutPrepares = [];
						_self.queryUnProcessedData();
						_self.queryProcessedData();	
						Notify.success("成功", "领料成功！", true);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
				        Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				})
			},
		},
		mounted: function () {
			this.queryProcessedData();
			this.queryUnProcessedData();
		},

		watch: {
			"quantity": {
				handler: function(to, from) {
					if (to) {
						if (to != parseInt(to)) {
							Notify.error("提示", "请输入整数", true);
							this.quantity = from;
							return;
						}
						if (to <= 0) {
							Notify.error("提示", "请输入正数", true);
							this.quantity = 1;
							return;
						}
						if (to > this.maxQuantity) {
							Notify.error("提示", "领料数量不能超过库存数量", true);
							this.quantity = this.maxQuantity;
							return;
						}
					}
				},
				deep: true
			},
			"stockOutPrepares": {
				handler: function(to, from) {
					if (to.length == this.notHandled.length) {
						this.checkAll = true;
						return;
					} else {
						this.checkAll = false;
						return;
					}
				},
				deep: true
			},
		}
	}
</script>
