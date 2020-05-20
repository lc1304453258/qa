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
	 * 根据epc查询相关库存信息 
	 */
	beforeStockIn: function(epcSet){
		var requestUrl = "CurrentStockResource/beforeStockIn";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(epcSet),
				
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
	 * 根据仓库库存生成StockOutPrepare 
	 */
	createStockOutPrepare: function(dto){
		var requestUrl = "CurrentStockResource/createStockOutPrepare";
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
	 * 根据登录公司分页查询仓库库存 
	 */
	getCurrentStock: function(currentStockQueryDto){
		var requestUrl = "CurrentStockResource/getCurrentStock";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(currentStockQueryDto),
				
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
	 * 根据条码查询仓库库存 
	 */
	queryByBarCode: function(barCode){
		var requestUrl = "CurrentStockResource/barCode";
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
	 * 根据存货和部门查询库存 
	 */
	queryByInventoryStockQuery: function(dtos, warehouseIdsStr){
		var requestUrl = "CurrentStockResource/queryByInventoryStockQuery/{warehouseIdsStr}";
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
	 * 根据条件查询仓库库存 
	 */
	queryByProjectItemWarehouseInventory: function(projectItemId, subProjectItemId, warehouseId, inventoryMessage, currentPage, pageSize){
		var requestUrl = "CurrentStockResource/queryByProjectItemWarehouseInventory";
		var formData = new FormData();
		if(projectItemId != null){
			formData.append('projectItemId', projectItemId);
		}
		if(subProjectItemId != null){
			formData.append('subProjectItemId', subProjectItemId);
		}
		if(warehouseId != null){
			formData.append('warehouseId', warehouseId);
		}
		if(inventoryMessage != null){
			formData.append('inventoryMessage', inventoryMessage);
		}
		if(currentPage != null){
			formData.append('currentPage', currentPage);
		}
		if(pageSize != null){
			formData.append('pageSize', pageSize);
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
	 * 根据条件查询仓库库存 
	 */
	queryCurrentStocks: function(inventoryMessage, warehouseId, currentPage, pageSize){
		var requestUrl = "CurrentStockResource/queryCurrentStocks";
		var formData = new FormData();
		if(inventoryMessage != null){
			formData.append('inventoryMessage', inventoryMessage);
		}
		if(warehouseId != null){
			formData.append('warehouseId', warehouseId);
		}
		if(currentPage != null){
			formData.append('currentPage', currentPage);
		}
		if(pageSize != null){
			formData.append('pageSize', pageSize);
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
	 * 重新读取仓库库存 
	 */
	refresh: function(dto){
		var requestUrl = "CurrentStockResource/refresh";
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
	}
}
