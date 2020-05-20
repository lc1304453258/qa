<template>
	<div class="container-fluid">
		<Navbar title="盘亏"></Navbar>
		
		<h6></h6>
	  	<div>
  		  	<fieldset class="form-group">
		  		<div>
		    		<button type="button" class="btn btn-primary btn-sm" @click="deal">处理</button>
	  			</div>
			</fieldset>
		</div>

		<div class="card-group" v-if="(checkVouchsDatas == undefined || checkVouchsDatas.length == 0)">
			<div class="card bg-light">
			  	<div class="card-header">提示</div>
			  	<div class="card-block">
			  		<p class="card-text">无数据</p>
			  	</div>
			</div>
		</div>
		<div class="row" v-else>
  			<div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in checkVouchsDatas">
  				<div class="card bg-light" @click="showModal(data, index)">
				  	<div class="card-header">{{index + 1}}.存货编号：{{data.invCode}}</div>
				  	<div class="card-block">
				  		<p class="card-text">名称：{{data.invName}}</p>
				    	<p class="card-text">货位：{{data.positionBarCode}}</p>
				    	<p class="card-text">批号：{{data.batchNo}}</p>
				    	<p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
				    	<p class="card-text">账面数量：{{data.accountQuantity}}</p>
				    	<p class="card-text">盘点数量：{{data.checkQuantity}}</p>
				  	</div>
				</div>
  			</div>
  		</div>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var Notify = require("../Widget/Notify.js");
	var Loading = require("../common/Loading.js");
	var Navbar = require("../widget/Navbar.vue");
	
	module.exports = {
		props: ["checkVouchId"],
		components: {
			Common, Notify, Loading, Navbar
		},
		data: function () {
			return {
				checkVouchsDatas: [],
			}
		},

		methods: {
			back: function () {
				var p = {
					page: 1,
				}
				this.$emit("changePage", p);
			},

			queryCheckVouchses: function () {
				var _self = this;
				var uuid = Loading.show();
				$.ajax({
					type : "get",
					dataType : "json",
					url : Common.getApiURL('checkVouchsResource/getCheckLossDatas'),
					data : {"checkVouchId" : _self.checkVouchId},
					beforeSend :function(request) {
						Common.addTokenToRequest(request);
					},
					success : function(data) {
						Loading.hide(uuid);
						_self.checkVouchsDatas = data;
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},

			deal: function () {
				var _self = this;
				this.visible = false;
				if (this.checkVouchsDatas.length == 0) {
					Notify.error("提示", "没有可处理的数据", "notice");
					return;
				}
				var uuid = Loading.show();
				$.ajax({
					type: "post",
					dataType: "json",
					contentType: "application/json",
					url: Common.getApiURL('StockOutResource/saveByCheckLoss'),
					data: JSON.stringify(_self.checkVouchsDatas),	
					beforeSend: function(request) {
						Common.addTokenToRequest(request);
					},
					success: function(data) {
						Loading.hide(uuid);
						Notify.success("提示", "处理成功！", "success");
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						Loading.hide(uuid);
						Common.processException(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			},
		},

		mounted: function () {
			this.queryCheckVouchses();
		}
	}
</script>
