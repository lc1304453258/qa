var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 *  
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 添加一个包装 
	 */
	addPack: function(purchaseOrderLineId, quantity, batchNo){
		var requestUrl = "InventoryInstanceResource/addPack";

		var formData = {};
		if(purchaseOrderLineId != null){
			formData.purchaseOrderLineId = purchaseOrderLineId;
		}
		if(quantity != null){
			formData.quantity = quantity;
		}
		if(batchNo != null){
			formData.batchNo = batchNo;
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
				
				
				
				data: formData,
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 添加多个包装 
	 */
	addPacks: function(purchaseOrderLineId, quantity, packageQuantity, batchNo){
		var requestUrl = "InventoryInstanceResource/addPacks";

		var formData = {};
		if(purchaseOrderLineId != null){
			formData.purchaseOrderLineId = purchaseOrderLineId;
		}
		if(quantity != null){
			formData.quantity = quantity;
		}
		if(packageQuantity != null){
			formData.packageQuantity = packageQuantity;
		}
		if(batchNo != null){
			formData.batchNo = batchNo;
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
				
				
				
				data: formData,
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据epc获取存货信息 
	 */
	beforeStockIn: function(epcs){
		var requestUrl = "InventoryInstanceResource/beforeStockIn";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(epcs),
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * ------------------------------------------------------------------------------------------------------------------------------------//-------------------------------------------------------------Android客户端------------------------------------------------------//------------------------------------------------------------------------------------------------------------------------------------//修改InventoryInstance 的数量
在修改数量之前，判断InventoryInstanceArrival中是否有到货数据，如果有到货数据，则抛出异常 
	 */
	changeInventoryInstanceQuantity: function(inventoryInstanceId, quantity){
		var requestUrl = "InventoryInstanceResource/quantity";

		var formData = {};
		if(inventoryInstanceId != null){
			formData.inventoryInstanceId = inventoryInstanceId;
		}
		if(quantity != null){
			formData.quantity = quantity;
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
				
				dataType: "json",
				
				data: formData,
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据存货档案实例Id删除存货档案 
	 */
	deleteInventoryInstanceById: function(inventoryInstanceId){
		var requestUrl = "InventoryInstanceResource/deleteByInventoryInstanceId";
		var paramCount = 0;
		if(inventoryInstanceId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('inventoryInstanceId=' + inventoryInstanceId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				contentType: "application/json",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据存货名称、条码保存新的存货 
	 */
	generateInventoryByNameBarCode: function(inventoryName, inventoryType, barCode, inventoryClassId){
		var requestUrl = "InventoryInstanceResource/generateInventory2";

		var formData = {};
		if(inventoryName != null){
			formData.inventoryName = inventoryName;
		}
		if(inventoryType != null){
			formData.inventoryType = inventoryType;
		}
		if(barCode != null){
			formData.barCode = barCode;
		}
		if(inventoryClassId != null){
			formData.inventoryClassId = inventoryClassId;
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
				
				
				
				data: formData,
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 生成物料实例 【存货标签打印】-【打印】 
	 */
	generateInventoryInstances: function(inventoryInstanceDtos, type){
		var requestUrl = "InventoryInstanceResource/generateInventoryInstances";
		var paramCount = 0;
		if(type != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('type=' + type);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstanceDtos),
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据采购订单明细Id加载InventoryInstance 
	 */
	loadInventoryInstance: function(purchaseOrderLineId){
		var requestUrl = "InventoryInstanceResource/loadInventoryInstance";
		var paramCount = 0;
		if(purchaseOrderLineId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('purchaseOrderLineId=' + purchaseOrderLineId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据采购订单明细Id加载未打印InventoryInstance 
	 */
	loadNotPrintedInventoryInstance: function(purchaseOrderLineId){
		var requestUrl = "InventoryInstanceResource/notPrintedInventoryInstance";
		var paramCount = 0;
		if(purchaseOrderLineId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('purchaseOrderLineId=' + purchaseOrderLineId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				contentType: "application/json",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据条码查询存货档案实例 
	 */
	queryByBarCode: function(barCode){
		var requestUrl = "InventoryInstanceResource/barCode2";
		var paramCount = 0;
		if(barCode != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('barCode=' + barCode);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 查询物料 
	 */
	queryByEpcOrBarCode: function(epcs){
		var requestUrl = "InventoryInstanceResource/queryByEpcOrBarCode";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(epcs),
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据采购订单明细Id查询 
	 */
	queryByPurchaseOrderLine: function(purchaseOrderLineId){
		var requestUrl = "InventoryInstanceResource/queryByPurchaseOrderLine";
		var paramCount = 0;
		if(purchaseOrderLineId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('purchaseOrderLineId=' + purchaseOrderLineId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据条码查询存货档案 
	 */
	queryInventoryByBarCode: function(barCode){
		var requestUrl = "InventoryInstanceResource/queryInventoryByBarCode";
		var paramCount = 0;
		if(barCode != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('barCode=' + barCode);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据条码获取到货信息(退货) 
	 */
	queryReturnByBarCode: function(barCode){
		var requestUrl = "InventoryInstanceResource/purchaseOrderReturn/queryByBarCode";
		var paramCount = 0;
		if(barCode != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('barCode=' + barCode);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "json",
				
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	},

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 保存InventoryInstances
<ul>
<li>遍历inventoryInstanceDtos</li>
<li>如果inventoryInstanceDto中有Id则更新数据，否则插入数据，如果插入数据则设置printCount = 0</li>
<li></li>
</ul>
保存的时候需要处理字段purchaseOrderLineId、quantity 其他字段不需要处理 
	 */
	saveInventoryInstances: function(inventoryInstanceDtos){
		var requestUrl = "InventoryInstanceResource/saveInventoryInstances";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstanceDtos),
				
				beforeSend: function(request) {
					Common.addTokenToRequest(request);
				},
				success: function(data) {
					resolve(data);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					reject(XMLHttpRequest);
				}
			});
		});
	}
}
