var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 物料实例Resource 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据资产EPC查询物料详情 
	 */
	findByEpcs: function(epcList){
		var requestUrl = "InventoryInstanceResource/findByEpcs";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(epcList),
				
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
	 * 物料实例分页搜索 
	 */
	findByInventoryInstanceQueryCondition: function(inventoryInstanceQueryCondition){
		var requestUrl = "InventoryInstanceResource/findByInventoryInstanceQueryCondition";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstanceQueryCondition),
				
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
	 * <p>
西门子项目，功能：根据项目事件id查询对应的所有存货实例（inventoryInstance）
</P> 
	 */
	findByProjectItem: function(projectItemId, range){
		var requestUrl = "InventoryInstanceResource/findByProjectItem/{projectItemId}";
		if(projectItemId != null){
			requestUrl = requestUrl.replace('{projectItemId}', projectItemId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(range),
				
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
	 * 根据物料SKU或名称查询所有实例 
	 */
	findBySKU: function(message){
		var requestUrl = "InventoryInstanceResource/findBySKU";
		var paramCount = 0;
		if(message != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('message=' + message);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
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
	 * <p>
西门子项目，功能：根据项目事件id查询对应的所有存货（inventory）
</P> 
	 */
	findInventoryByProjectItem: function(projectItemId, range){
		var requestUrl = "InventoryInstanceResource/findInventoryByProjectItem/{projectItemId}";
		if(projectItemId != null){
			requestUrl = requestUrl.replace('{projectItemId}', projectItemId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(range),
				
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
	 * 根据物料类型查询物料在项目分部情况 
	 */
	findProjectItemInventoryQuantityByInventoryAndWarehouse: function(inventoryId, warehouseId){
		var requestUrl = "InventoryInstanceResource/findProjectItemInventoryQuantityByInventoryAndWarehouse";
		var paramCount = 0;
		if(inventoryId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('inventoryId=' + inventoryId);
			paramCount ++;
		}
		if(warehouseId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('warehouseId=' + warehouseId);
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
	 * 根据货位和类别查询存货实例(西门子生成盘点明细使用) 
	 */
	getByPositionAndCategory: function(queryParam){
		var requestUrl = "InventoryInstanceResource/getByPositionAndCategory";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(queryParam),
				
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
	 * 根据资产EPC查询物料详情 
	 */
	getInventoryMessagesByEpc: function(epc){
		var requestUrl = "InventoryInstanceResource/getInventoryMessagesByEpc";

		var formData = {};
		if(epc != null){
			formData.epc = epc;
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
	 * 物料实例搜索 
	 */
	inventoryInstanceSearch: function(queryParam){
		var requestUrl = "InventoryInstanceResource/inventoryInstanceSearch";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(queryParam),
				
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
	 * 分页查询物料报修单 
	 */
	queryAllInventoryInstance: function(){
		var requestUrl = "InventoryInstanceResource/queryAllInventoryInstance";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
				
				
				
				
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
