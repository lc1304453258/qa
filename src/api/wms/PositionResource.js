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
	 * 根据编号、名称、仓库生成货位 
	 */
	generatePosition: function(positionName, positionNo, warehouseId){
		var requestUrl = "positionResource/generatePosition";

		var formData = {};
		if(positionName != null){
			formData.positionName = positionName;
		}
		if(positionNo != null){
			formData.positionNo = positionNo;
		}
		if(warehouseId != null){
			formData.warehouseId = warehouseId;
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
	 * 根据入库单id查询货位 
	 */
	positionsByStockIn: function(stockInId){
		var requestUrl = "positionResource/listPositionsByStockInId";
		var paramCount = 0;
		if(stockInId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockInId=' + stockInId);
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
	 * 打印货位 
	 */
	printInventoryInstance: function(token, recordIds){
		var requestUrl = "positionResource/printPosition";
		var paramCount = 0;
		if(token != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('token=' + token);
			paramCount ++;
		}
		if(recordIds != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('recordIds=' + recordIds);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				
				dataType: "text",
				
				
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
	 * 根据货位名称或编码查询 
	 */
	queryByNameOrNo: function(message, start, length){
		var requestUrl = "positionResource/message";
		var paramCount = 0;
		if(message != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('message=' + message);
			paramCount ++;
		}
		if(start != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('start=' + start);
			paramCount ++;
		}
		if(length != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('length=' + length);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
				contentType: "application/x-www-form-urlencoded",
				
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
	 * 根据货位名称或编码查询（分页） 
	 */
	queryByNameOrNo: function(message, currentPage, pageSize){
		var requestUrl = "positionResource/message1";

		var formData = {};
		if(message != null){
			formData.message = message;
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
	 * 根据仓库查询货位 
	 */
	queryByWarehouse: function(warehouseId){
		var requestUrl = "positionResource/positionsByWarehouse";
		var paramCount = 0;
		if(warehouseId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('warehouseId=' + warehouseId);
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
	 * 查询所有货位 
	 */
	queryPositions: function(){
		var requestUrl = "positionResource/positions";


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
	 * 根据出库单id查询货位 
	 */
	queryPostionByStockOut: function(stockOutId){
		var requestUrl = "positionResource/positionsByStockOut";
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
	 * 根据仓库保存 
	 */
	saveByWarehouse: function(positionDtos, warehouseId){
		var requestUrl = "positionResource/saveByWarehouse/{warehouseId}";
		if(warehouseId != null){
			requestUrl = requestUrl.replace('{warehouseId}', warehouseId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(positionDtos),
				
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
