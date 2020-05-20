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
	 * APP出库审批 
	 */
	approve: function(stockOutDto){
		var requestUrl = "StockOutResource/approve";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutDto),
				
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
	 * 根据projectItemId查询所有的出库单 
	 */
	findByCondition: function(stockOutConfirmQueryDto){
		var requestUrl = "StockOutResource/findByCondition";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutConfirmQueryDto),
				
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
	 * 仓库库存生成出库单生单 
	 */
	genearateModelData: function(documentModelData){
		var requestUrl = "StockOutResource/generateModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 红色出库单生单 
	 */
	genearateRedModelData: function(documentModelData){
		var requestUrl = "StockOutResource/generateRedModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 红色出库单生单 
	 */
	genearateRedStockOutModelData: function(documentModelData){
		var requestUrl = "StockOutResource/generateRedStockOutModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 领料生成出库单 
	 */
	generatePrepareToOutModelData: function(documentModelData){
		var requestUrl = "StockOutResource/generatePrepareToOutModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 销售订单生成出库单 
	 */
	generateSaleOrderToOutModelData: function(documentModelData){
		var requestUrl = "StockOutResource/generateSaleOrderToOutModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 根据inventoryId查询货物出入库记录 
	 */
	getHistoryEventByInventory: function(inventoryId, startDate, endDate){
		var requestUrl = "StockOutResource/getHistoryEventByInventory";

		var formData = {};
		if(inventoryId != null){
			formData.inventoryId = inventoryId;
		}
		if(startDate != null){
			formData.startDate = startDate;
		}
		if(endDate != null){
			formData.endDate = endDate;
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
	 * 根据inventoryId查询货物出入库记录 
	 */
	getStockInfoByInventory: function(inventoryId){
		var requestUrl = "StockOutResource/getStockInfoByInventory";
		var paramCount = 0;
		if(inventoryId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('inventoryId=' + inventoryId);
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
	 * 根据单号、仓库查询出库出库单 
	 */
	queryStockOuts: function(documentNo, warehouseId, currentPage, pageSize){
		var requestUrl = "StockOutResource/queryStockOuts";

		var formData = {};
		if(documentNo != null){
			formData.documentNo = documentNo;
		}
		if(warehouseId != null){
			formData.warehouseId = warehouseId;
		}
		if(currentPage != null){
			formData.currentPage = currentPage;
		}
		if(pageSize != null){
			formData.pageSize = pageSize;
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
	 * 盘亏数据处理生成材料出库单 
	 */
	save: function(dtos){
		var requestUrl = "StockOutResource/saveByCheckLoss";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dtos),
				
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
	 * 根据存货和数量生成出库单 
	 */
	saveByInventory: function(dtos, warehouseIdsStr){
		var requestUrl = "StockOutResource/saveByInventory/{warehouseIdsStr}";
		if(warehouseIdsStr != null){
			requestUrl = requestUrl.replace('{warehouseIdsStr}', warehouseIdsStr);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dtos),
				
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
	 * 根据存货和数量生成出库单,不抛出异常， 只处理可以处理的数据 
	 */
	saveByInventoryNoException: function(dtos, warehouseIdsStr){
		var requestUrl = "StockOutResource/saveByInventoryNoException/{warehouseIdsStr}";
		if(warehouseIdsStr != null){
			requestUrl = requestUrl.replace('{warehouseIdsStr}', warehouseIdsStr);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dtos),
				
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
	 * 生产配套根据仓库库存和数量生成出库单，并修改生产配套中已配套数量 
	 */
	saveByManufactureTaskInventory: function(dtos){
		var requestUrl = "StockOutResource/saveByManufactureTaskInventory";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dtos),
				
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
	 * 领料生成出库单 
	 */
	saveByStockOutPrepare: function(dto){
		var requestUrl = "StockOutResource/saveByStockOutPrepare";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dto),
				
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
	 * 扫描生成出库单 
	 */
	saveByStockOutScan: function(currentStocks, orgnizationId, pickNo, pickUser, documentTypeId){
		var requestUrl = "StockOutResource/saveByStockOutScan/{orgnizationId}/{pickNo}/{pickUser}/{documentTypeId}";
		if(orgnizationId != null){
			requestUrl = requestUrl.replace('{orgnizationId}', orgnizationId);
		}
		if(pickNo != null){
			requestUrl = requestUrl.replace('{pickNo}', pickNo);
		}
		if(pickUser != null){
			requestUrl = requestUrl.replace('{pickUser}', pickUser);
		}
		if(documentTypeId != null){
			requestUrl = requestUrl.replace('{documentTypeId}', documentTypeId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(currentStocks),
				
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
	 * RFID扫描生成出库单 
	 */
	saveByStockOutScanByRfid: function(currentStocks, orgnizationId, pickNo, pickUser, documentTypeId, warehouseId){
		var requestUrl = "StockOutResource/saveByStockOutScanByRfid/{orgnizationId}/{pickNo}/{pickUser}/{documentTypeId}/{warehouseId}";
		if(orgnizationId != null){
			requestUrl = requestUrl.replace('{orgnizationId}', orgnizationId);
		}
		if(pickNo != null){
			requestUrl = requestUrl.replace('{pickNo}', pickNo);
		}
		if(pickUser != null){
			requestUrl = requestUrl.replace('{pickUser}', pickUser);
		}
		if(documentTypeId != null){
			requestUrl = requestUrl.replace('{documentTypeId}', documentTypeId);
		}
		if(warehouseId != null){
			requestUrl = requestUrl.replace('{warehouseId}', warehouseId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(currentStocks),
				
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
	 * 扫描生成红色出库单 
	 */
	saveRedByStockOutScan: function(currentStocks, documentTypeId){
		var requestUrl = "StockOutResource/saveRedByStockOutScan/{documentTypeId}";
		if(documentTypeId != null){
			requestUrl = requestUrl.replace('{documentTypeId}', documentTypeId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(currentStocks),
				
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
	 * 根据日期与登录用户更新出库单的领料日期与领料人 
	 */
	setPickedConfirmDate: function(stockOutConfirmDto){
		var requestUrl = "StockOutResource/setPickedConfirmDate";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutConfirmDto),
				
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
	 * 根据出库单id查询单据是否是红色出库单 
	 */
	uniqueIsRedDocByStockOutId: function(stockOutId){
		var requestUrl = "StockOutResource/uniqueIsRedDocByStockOutId";
		var paramCount = 0;
		if(stockOutId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutId=' + stockOutId);
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
	}
}
