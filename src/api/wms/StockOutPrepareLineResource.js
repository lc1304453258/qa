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
	 * 根据manufactureTaskInventoryId删除 
	 */
	deleteByManufactureTaskInventoryId: function(manufactureTaskInventoryId){
		var requestUrl = "StockOutPrepareLineResource/deleteByManufactureTaskInventoryId";
		var paramCount = 0;
		if(manufactureTaskInventoryId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('manufactureTaskInventoryId=' + manufactureTaskInventoryId);
			paramCount ++;
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				
				
				
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
	 * 根据Id删除 
	 */
	deleteOne: function(stockOutPrepareLineId){
		var requestUrl = "StockOutPrepareLineResource/deleteOne";
		var paramCount = 0;
		if(stockOutPrepareLineId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutPrepareLineId=' + stockOutPrepareLineId);
			paramCount ++;
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				
				
				
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
	 * 根据生产配套查询领料 
	 */
	queryByManufactureTaskInventoryId: function(manufactureTaskInventoryIds){
		var requestUrl = "StockOutPrepareLineResource/queryByManufactureTaskInventoryId";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(manufactureTaskInventoryIds),
				
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
	 * 根据领料单分页查询领料详情 
	 */
	queryByStockoutPrepare: function(stockOutPrepareQueryDto){
		var requestUrl = "StockOutPrepareLineResource/queryByStockoutPrepare";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(stockOutPrepareQueryDto),
				
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
	 * 根据生产任务配套查询所有待领料数量 
	 */
	queryStockOutPrepareQuantity: function(manufactureTaskInventoryIds){
		var requestUrl = "StockOutPrepareLineResource/queryStockOutPrepareQuantity";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(manufactureTaskInventoryIds),
				
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
		var requestUrl = "StockOutPrepareLineResource/saveByManufactureTaskInventory";
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
	 * 修改还在编辑状态的出库单关联的领料单查询领料单数量 
	 */
	updateLines: function(stockOutPrepareLineDtos){
		var requestUrl = "StockOutPrepareLineResource/updateLines";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(stockOutPrepareLineDtos),
				
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
