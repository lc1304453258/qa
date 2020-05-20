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
	 * 修改报修单 
	 */
	editInventoryInstanceRepairs: function(barCode, breakDownPosition, breakDownDescription, documentNo, remark){
		var requestUrl = "inventoryInstanceRepairResource/editInventoryInstanceRepairs";

		var formData = {};
		if(barCode != null){
			formData.barCode = barCode;
		}
		if(breakDownPosition != null){
			formData.breakDownPosition = breakDownPosition;
		}
		if(breakDownDescription != null){
			formData.breakDownDescription = breakDownDescription;
		}
		if(documentNo != null){
			formData.documentNo = documentNo;
		}
		if(remark != null){
			formData.remark = remark;
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
	 * 保存物料报修单 
	 */
	generateInventoryInstanceRepair: function(barCode, breakDownPosition, breakDownDescription, remark){
		var requestUrl = "inventoryInstanceRepairResource/generateInventoryInstanceRepair";

		var formData = {};
		if(barCode != null){
			formData.barCode = barCode;
		}
		if(breakDownPosition != null){
			formData.breakDownPosition = breakDownPosition;
		}
		if(breakDownDescription != null){
			formData.breakDownDescription = breakDownDescription;
		}
		if(remark != null){
			formData.remark = remark;
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
	 * 根据条形码查询报修单 
	 */
	inventoryInstanceRepairsByBarCode: function(barCode){
		var requestUrl = "inventoryInstanceRepairResource/inventoryInstanceRepairsByBarCode";
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
	 * 分页查询物料报修单 
	 */
	queryByNameOrNo: function(message, currentPage, pageSize){
		var requestUrl = "inventoryInstanceRepairResource/message1";

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
