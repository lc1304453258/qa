var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 存货档案资源类 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 *  
	 */
	findByIdAndClientId: function(id){
		var requestUrl = "InventoryResource/findByIdAndClientId";
		var paramCount = 0;
		if(id != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('id=' + id);
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
	 * 根据条件分页查询存货 
	 */
	findByQueryCodition: function(inventoryQueryCodition){
		var requestUrl = "InventoryResource/findByQueryCodition";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryQueryCodition),
				
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
	 * APP端存货新增字段查询dto 
	 */
	findInventoryFieldByClientId: function(){
		var requestUrl = "InventoryResource/findByClientId";


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
	 * 根据存货编号、名称保存新的存货 
	 */
	insert: function(inventoryDto){
		var requestUrl = "InventoryResource/insert";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryDto),
				
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
	 * 根据存货id、编号、名称更新存货 
	 */
	update: function(inventoryDto){
		var requestUrl = "InventoryResource/update";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryDto),
				
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
