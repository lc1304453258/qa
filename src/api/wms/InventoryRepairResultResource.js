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
	 * 修改维修单明细 
	 */
	editInventoryRepairResult: function(maintainUser, cost, barCode, maintainMeasure, maintainResult, documentNo, id){
		var requestUrl = "inventoryRepairResultResource/editInventoryRepairResult";

		var formData = {};
		if(maintainUser != null){
			formData.maintainUser = maintainUser;
		}
		if(cost != null){
			formData.cost = cost;
		}
		if(barCode != null){
			formData.barCode = barCode;
		}
		if(maintainMeasure != null){
			formData.maintainMeasure = maintainMeasure;
		}
		if(maintainResult != null){
			formData.maintainResult = maintainResult;
		}
		if(documentNo != null){
			formData.documentNo = documentNo;
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
	 * 保存物料明细单 
	 */
	generateInventoryRepairResult: function(dn, maintainUser, cost, maintainResult, maintainMeasure){
		var requestUrl = "inventoryRepairResultResource/generateInventoryRepairResult";

		var formData = {};
		if(dn != null){
			formData.dn = dn;
		}
		if(maintainUser != null){
			formData.maintainUser = maintainUser;
		}
		if(cost != null){
			formData.cost = cost;
		}
		if(maintainResult != null){
			formData.maintainResult = maintainResult;
		}
		if(maintainMeasure != null){
			formData.maintainMeasure = maintainMeasure;
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
	 * 根据物料明细全查询 
	 */
	queryAllInventoryRepairResullt: function(){
		var requestUrl = "inventoryRepairResultResource/queryAllInventoryRepairResullt";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
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
	 * 根据物料名称或编码查询（分页） 
	 */
	queryByNameOrNo: function(message, currentPage, pageSize){
		var requestUrl = "inventoryRepairResultResource/message1";

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
