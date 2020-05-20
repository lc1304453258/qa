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
	 * 保存保养计划明细(2020-1-20) 
	 */
	editInventoryInstanceMaintainLine: function(documentNo, cost, maintainUsedHours, content, inventoryInstanceMaintainLineId, id){
		var requestUrl = "inventoryInstanceMaintainLineResource/editInventoryInstanceMaintainLine";

		var formData = {};
		if(documentNo != null){
			formData.documentNo = documentNo;
		}
		if(cost != null){
			formData.cost = cost;
		}
		if(maintainUsedHours != null){
			formData.maintainUsedHours = maintainUsedHours;
		}
		if(content != null){
			formData.content = content;
		}
		if(inventoryInstanceMaintainLineId != null){
			formData.inventoryInstanceMaintainLineId = inventoryInstanceMaintainLineId;
		}
		if(id != null){
			formData.id = id;
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
	 * 保存保养计划明细(2020-1-20) 
	 */
	generateInventoryInstanceMaintainLine: function(documentNo, cost, planLineId, maintainUsedHours, content, id){
		var requestUrl = "inventoryInstanceMaintainLineResource/generateInventoryInstanceMaintainLine";

		var formData = {};
		if(documentNo != null){
			formData.documentNo = documentNo;
		}
		if(cost != null){
			formData.cost = cost;
		}
		if(planLineId != null){
			formData.planLineId = planLineId;
		}
		if(maintainUsedHours != null){
			formData.maintainUsedHours = maintainUsedHours;
		}
		if(content != null){
			formData.content = content;
		}
		if(id != null){
			formData.id = id;
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
	 * 查询所有保养计划内容(2020-1-20) 
	 */
	queryAllInventoryInstanceMaintainPlan: function(){
		var requestUrl = "inventoryInstanceMaintainLineResource/queryAllInventoryInstanceMaintainPlan";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				
				
				
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
	 * 分页查询物料明细单(2020-1-20) 
	 */
	queryByNameOrNo: function(message, currentPage, pageSize){
		var requestUrl = "inventoryInstanceMaintainLineResource/message1";

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
	}
}
