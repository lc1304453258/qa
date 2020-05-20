<template>
	<div class="container-fluid">
		<div class="card">
		  	<div class="card-header">
		  		检验结果
		    	<div class="text-right">
		    		<button type="button" class="btn btn-primary" @click="save">保存</button>
		    	</div>
		  	</div>
		  	<div class="card-block card-success">
			    <div class="form-inline"> 
					<div class="form-group col-md-3">
					    <label>报检数量 </label>
					    <input type="text" class="form-control" disabled v-model="inspectRequestQty">
					</div>
					<div class="form-group col-md-3">
					    <label>报检单号 </label>
					    <input type="text" class="form-control" disabled v-model="documentNo">
					</div>
				</div>
		  	</div>
		</div>
		<div class="card">
			<div class="card-block card-info">
			    <div class="form-horizontal"> 
					<div class="form-group">
					    <label>合格品数量 </label>
					    <input type="number" class="form-control" v-model="qualifiedQtySum" min="0">
					</div>
					<div class="form-group">
					    <label>不良品数量 </label>
					    <input type="text" class="form-control" disabled v-model="inferiorQtySum">
					</div>
					<div class="form-group">
					    <label>让步接收数量 </label>
					    <input type="text" class="form-control" v-model="concessionAcceptanceQtySum" disabled>
					</div>
				</div>
		  	</div>
	  	</div>
	  	<div class="card">
	  		<div class="card-header">
		  		不良品/让步接收
		  		<div class="text-right">
		    		<button type="button" class="btn btn-danger" @click="clear">清空</button>
		    	</div>
		  	</div>
		  	<div class="card-block card-success">
			    <label>条码</label>
			    <input type="text" class="form-control" placeholder="输入条码" v-model="barCode" @keydown="keydown($event)">
				<div class="row"> 
					<div class="col-sm-2 col-xs-2">序号</div>
					<div class="col-sm-8 col-xs-8">存货名称</div>
					<div class="col-sm-2 col-xs-2" style="text-align:right;">存货编号</div>
				</div>
				<div class="row"> 
					<div class="col-sm-6">工作令</div>
					<div class="col-sm-6" style="text-align:right;">报检单号</div>
				</div>
				<div class="row">
					<div class="col-sm-6">条码</div>
					<div class="col-sm-6" style="text-align:right;">数量</div>
				</div>
				<div class="row">
					<div class="col-sm-6">让步接收数量</div>
					<div class="col-sm-6" style="text-align:right;">不良品数量</div>
				</div>
		  	</div>
		</div>
	  	<div class="card" v-for="inspect,index in inspectRejectDatas[0]">
			<div class="card-block" @click="showRejectModal(inspect.inventoryInstanceInspectRequestId)" v-bind:class="{'card-info': showColor(index), 'card-success': !showColor(index)}">
	  			<div class="row"> 
					<div class="col-sm-2">{{index + 1}}</div>
					<div class="col-sm-8">{{inspect.inventoryName}}</div>
					<div class="col-sm-2 col-xs-2" style="text-align:right;">{{inspect.inventoryCode}}</div>
				</div>
				<div class="row"> 
					<div class="col-sm-6">{{inspect.projectInventoryName}}</div>
					<div class="col-sm-6" style="text-align:right;">{{inspect.inspectionRequestDocumentNo}}</div>
				</div>
				<div class="row"> 
					<div class="col-sm-6">{{inspect.barCode}}</div>
					<div class="col-sm-6" style="text-align:right;">{{inspect.quantity}}</div>
				</div>
				<div class="row"> 
					<div class="col-sm-6">{{actConcessionAcceptanceQty}}</div>
					<div class="col-sm-6" style="text-align:right;">{{actInferiorQty}}</div>
				</div>
			</div>
	  	</div>
	  	
		<div class="modal fade" id="qtyModal" tabindex="-1" role="dialog"  aria-hidden="true">
		    <div class="modal-dialog" role="document">
		        <div class="modal-content">
		        	<div class="modal-header">
		        	  <h4 class="modal-title">输入数量</h4>
			          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			            <span aria-hidden="true">&times;</span>
			            <span class="sr-only">Close</span>
			          </button>
			        </div>
			        <div class="modal-body">
			          <div>
			            <div class="form-group">
			              <label class="control-label">不良品数量:</label>
			              <input type="number" class="form-control" v-model="inferiorQty" min="0">
			            </div>
			            <div class="form-group">
			              <label class="control-label">让步接收数量:</label>
			              <input type="number" class="form-control" v-model="concessionAcceptanceQty" min="0">
			            </div>
			          </div>
			        </div>
			        <div class="modal-footer">
			          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
			          <button type="button" class="btn btn-primary" @click="saveInferiorQty">确定</button>
			        </div>
		      	</div>
	    	</div>
	 	</div>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var storage = window.localStorage;

	module.exports = {
		data : function(){
			return{
				barCode : "",
				inspectRejectDatas : [],
				qualifiedQty : "",
				inferiorQty : "",
				concessionAcceptanceQty : "",
				inspectRequestQty : "",
				documentNo : "",
				receiveData : {},
				inspectRequestLineId : "",
				inventoryInstanceInspectRequestId : "",
				inferiorQtySum : "",
				concessionAcceptanceQtySum : "",
				qualifiedQtySum : "",
				receiveLineArr : [],
				quantity : "",
				actConcessionAcceptanceQty : "",
				actInferiorQty : ""
			}
		},
		methods : {

			init : function(){
				var _self = this;
				_self.inspectRequestQty = storage.getItem("inspectRequestQty");
				_self.documentNo = storage.getItem("documentNo");
				_self.inspectRequestLineId = storage.getItem("inspectRequestLineId");
				_self.qualifiedQtySum = _self.inspectRequestQty;
			},

			keydown : function (event) {
				var _self = this;
		     	if(event.keyCode==13){
		        	_self.loadInspection();
		        }
		     },

			loadInspection : function(){
				var _self = this;
				_self.isExist = false;
				console.log(_self.inspectRequestLineId);
				if(_self.barCode == undefined || _self.barCode == ""){
					Common.showDialog("提示","请输入条码","error");
					_self.inspectRejectDatas.splice(0,_self.inspectRejectDatas.length);
					return;
				}
				var barCode = $.trim(_self.barCode);
				if(_self.inspectRejectDatas.length == 0){
					_self.isExist = false;
				}else{
					_self.inspectRejectDatas[0].forEach(function(item){
						if(item.barCode == barCode){
							_self.isExist = true;
							Notify.error("重复输入","输入的条码已在表格内", true);
						}
					});
				}
				if(_self.isExist == false){
					_self.inspectRejectDatas.splice(0,_self.inspectRejectDatas.length);
					$.ajax({
						url : Common.getApiURL("InventoryInstanceInspectResource/inspect/singleBarCode?barCode=") + _self.barCode,
						type : "get",
						beforeSend : function (request) {
							Common.addTokenToRequest(request);
						},
						success : function (data) {
							console.log(data);
							_self.isExist = true;
							if(data != undefined ){
								console.log(_self.inspectRequestLineId);
								console.log(data[0].inspectionRequestLineId);
								if(_self.inspectRequestLineId != data[0].inspectionRequestLineId){
									Notify.error("错误", "扫描的条码与前一个界面扫描的条码不属于同一个报检单子表。", false);
									_self.barCode = "";
								}else{
									_self.inventoryInstanceInspectRequestId = data[0].inventoryInstanceInspectRequestId;
									_self.quantity = data[0].quantity;
									_self.inspectRejectDatas.push(data);
								}
								console.log(_self.inspectRejectDatas);
								_self.restoreActQty();
							}
							
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
				           Common.processException(XMLHttpRequest, textStatus, errorThrown);
						}
					});
				} 
			},

			restoreActQty : function(){
				var _self = this;
				if(_self.receiveLineArr.length == 0){

				}else{
					var flag = true;
					_self.receiveLineArr.forEach(function(item){
						if(item.inventoryInstanceInspectRequestId == _self.inventoryInstanceInspectRequestId){
							_self.actInferiorQty = item.inferiorQty;
							_self.actConcessionAcceptanceQty = item.concessionAcceptanceQty;
							flag = false;
						}else{
							if(flag){
								_self.actInferiorQty = "";
								_self.actConcessionAcceptanceQty = "";
							}
						}
					});
				}
			},

			showRejectModal : function(inventoryInstanceInspectRequestId,quantity){
				var _self = this;
				$("#qtyModal").modal("show");
				_self.reCalAttribute(inventoryInstanceInspectRequestId);
			},

			reCalAttribute : function(inventoryInstanceInspectRequestId){
				var _self = this;
				if(_self.receiveLineArr.length == 0){

				}else{
					var flag = true;
					_self.receiveLineArr.forEach(function(item){
						if(item.inventoryInstanceInspectRequestId == inventoryInstanceInspectRequestId){
							_self.inferiorQty = item.inferiorQty;
							_self.concessionAcceptanceQty = item.concessionAcceptanceQty;
							flag = false;
						}else{
							if(flag){
								_self.inferiorQty = "";
								_self.concessionAcceptanceQty = "";
							}
						}
					});
				}
			},

			saveInferiorQty : function(){
				var _self = this;
				_self.cumulationInferiorQty();
			},

			cumulationInferiorQty : function(){
				var _self = this;
				if(_self.inferiorQty == "" || _self.inferiorQty == undefined){
					_self.inferiorQty = 0;
				}
				if(_self.concessionAcceptanceQty == "" || _self.concessionAcceptanceQty == undefined){
					_self.concessionAcceptanceQty = 0;
				}
				if(_self.inferiorQtySum == "" || _self.inferiorQtySum == undefined){
					_self.inferiorQtySum = 0;
				}
				if(_self.concessionAcceptanceQtySum == "" || _self.concessionAcceptanceQtySum == undefined){
					_self.concessionAcceptanceQtySum = 0;
				}
				_self.actInferiorQty = _self.inferiorQty;
				_self.actConcessionAcceptanceQty = _self.concessionAcceptanceQty;

				var receiveLine = {
					inferiorQty : _self.inferiorQty,
					concessionAcceptanceQty : _self.concessionAcceptanceQty,
					inventoryInstanceInspectRequestId : _self.inventoryInstanceInspectRequestId
				};
				
				if(_self.receiveLineArr.length == 0){
					_self.receiveLineArr.push(receiveLine);
					_self.inferiorQtySum = Number(_self.inferiorQtySum)  + Number(_self.inferiorQty);
					_self.concessionAcceptanceQtySum = Number( _self.concessionAcceptanceQtySum) + Number(_self.concessionAcceptanceQty);
				}else{
					_self.receiveLineArr.forEach(function(item){
						if(_self.inventoryInstanceInspectRequestId == item.inventoryInstanceInspectRequestId){
							_self.inferiorQtySum = Number(_self.inferiorQtySum) - Number(item.inferiorQty) + Number(_self.inferiorQty);
							_self.concessionAcceptanceQtySum = Number( _self.concessionAcceptanceQtySum) - Number(item.concessionAcceptanceQty) + Number(_self.concessionAcceptanceQty);
							item.inferiorQty = _self.inferiorQty;
							item.concessionAcceptanceQty = _self.concessionAcceptanceQty;
						}else{
							_self.receiveLineArr.push(receiveLine);
							_self.inferiorQtySum = Number(_self.inferiorQtySum)  + Number(_self.inferiorQty);
							_self.concessionAcceptanceQtySum = Number( _self.concessionAcceptanceQtySum) + Number(_self.concessionAcceptanceQty);
						}
					});
				}	
				console.log("不合格数量和 ：" + _self.inferiorQtySum);
				console.log("让步接收数量和 ：" + _self.concessionAcceptanceQtySum);
				console.log(_self.receiveLineArr);
				$("#qtyModal").modal("hide");
			},
			
			save : function(){
				var _self = this;
				var checkedSuccess = true;
				if(_self.inspectRequestLineId == "" || _self.inspectRequestLineId == undefined){
					Notify.error("错误", "数据校验失败或数据已经保存", false);
					checkedSuccess = false;
				}	
				if(_self.inferiorQtySum == "" || _self.inferiorQtySum == undefined){
					_self.inferiorQtySum = 0;
				}
				if(_self.concessionAcceptanceQtySum == "" || _self.concessionAcceptanceQtySum == undefined){
					_self.concessionAcceptanceQtySum = 0;
				}
				_self.receiveData = {
					qualifiedQty : _self.qualifiedQtySum,
					inferiorQty : _self.inferiorQtySum,
					concessionAcceptanceQty : _self.concessionAcceptanceQtySum,
					inspectRequestQuantity : _self.inspectRequestQty,
					inspectRequestDocumentNo : _self.documentNo,
					inspectRequestLineId : _self.inspectRequestLineId,
					inventoryInstanceInspectRequestId : _self.inventoryInstanceInspectRequestId,
					lines : _self.receiveLineArr
				};
				console.log(_self.receiveData);
				console.log(checkedSuccess);
				if(checkedSuccess == true){
					$.ajax({
						url : Common.getApiURL("InventoryInstanceInspectResource/generateInspect"),
						dataType : "json",
						type : "post",
						contentType : "application/json",
						data : JSON.stringify(_self.receiveData),
						beforeSend : function (request) {
							Common.addTokenToRequest(request);
						},
						success : function (data) {
							Notify.success("成功", "保存成功。", true);
							_self.inspectRequestLineId = "";
							_self.inspectRejectDatas.splice(0,_self.inspectRejectDatas.length);
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
				           Common.processException(XMLHttpRequest, textStatus, errorThrown);
						}
					});
				}
			},

			clear : function(){
				var _self = this;
				var len = _self.inspectRejectDatas.length;
				if(len > 0){
					_self.inspectRejectDatas.splice(0,len);
				}
				_self.barCode = "";
				_self.receiveLineArr.splice(0,_self.receiveLineArr.length);
				_self.concessionAcceptanceQtySum = "";
				_self.inferiorQtySum = "";
				_self.qualifiedQtySum = _self.inspectRequestQty;
				_self.actConcessionAcceptanceQty = "";
				_self.actInferiorQty = "";
				_self.inferiorQty = "";
				_self.concessionAcceptanceQty = "";
			},

			showColor: function(index){
				if(index % 2 == 0){
					return true;
				}else{
					return false;
				}
			}
		},
		mounted : function(){
			this.init();
		},
		watch : {
			"inferiorQtySum": {
				handler: function (val, oldVal) {
					var _self = this;
					_self.qualifiedQtySum = _self.inspectRequestQty - _self.inferiorQtySum - _self.concessionAcceptanceQtySum;
					if(Number(_self.qualifiedQtySum) < 0 ){
						_self.inferiorQtySum = oldVal;
						_self.qualifiedQtySum = _self.inspectRequestQty - oldVal - _self.concessionAcceptanceQtySum;
						Notify.error("错误","让步接收总数量(" + _self.concessionAcceptanceQtySum 
									+ ")+不合格总数量(" + _self.inferiorQtySum 
									+ ")总数大于报检数量(" + _self.inspectRequestQty
									+ ")", false);
					}
				},
     			 deep: true
			}, 
			"concessionAcceptanceQtySum": {
				handler: function (val, oldVal) {
					var _self = this;
					_self.qualifiedQtySum = _self.inspectRequestQty - _self.inferiorQtySum - _self.concessionAcceptanceQtySum;
					if(Number(_self.qualifiedQtySum) < 0 ){
						_self.concessionAcceptanceQtySum = oldVal;
						_self.qualifiedQtySum = _self.inspectRequestQty - oldVal - _self.inferiorQtySum;
						Notify.error("错误","让步接收总数量(" + _self.concessionAcceptanceQtySum 
									+ ")+不合格总数量(" + _self.inferiorQtySum 
									+ ")总数大于报检数量(" + _self.inspectRequestQty
									+ ")", false);
					}
				},
     			 deep: true
			}, 
			"inferiorQty": {
				handler: function (val, oldVal) {
					var _self = this;
					var packQty =Number(val) + Number(_self.concessionAcceptanceQty);
					if(packQty > _self.quantity){
						_self.inferiorQty = oldVal;
						Notify.error("错误","让步接收数量+不合格数量总数(" + packQty 
									+ ")大于包装内总数(" + _self.quantity
									+ ")", false);
					}
				},
     			 deep: true
			}, 
			"concessionAcceptanceQty": {
				handler: function (val, oldVal) {
					var _self = this;
					var packQty = Number(val) + Number(_self.inferiorQty);
					if(packQty > _self.quantity){
						_self.concessionAcceptanceQty = oldVal;
						Notify.error("错误","让步接收数量+不合格数量总数(" + packQty 
									+ ")大于包装内总数(" + _self.quantity
									+ ")", false);
					}

				},
     			 deep: true
			}, 
		},
	}
</script>

