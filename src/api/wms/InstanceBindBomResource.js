var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 物料实例绑定bom. 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 绑定bom. 
	 */
	bindBom: function(instanceCheckDto){
		var requestUrl = "InstanceBindBomResource/bindBom";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(instanceCheckDto),
				
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
	 * 查询所有bom. 
	 */
	findAll: function(){
		var requestUrl = "InstanceBindBomResource/findAll";


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
	 * 根据epc查询物料实例. 
	 */
	findByEpc: function(instanceCheckDtos){
		var requestUrl = "InstanceBindBomResource/findByEpc";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(instanceCheckDtos),
				
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
	 * 根据inventoryId查询上级Bom 
	 */
	findByInventoryId: function(inventoryId){
		var requestUrl = "InstanceBindBomResource/findByInventoryId";
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
	 * 标识成套设备 
	 */
	updateInventoryClass: function(inventoryNo){
		var requestUrl = "InstanceBindBomResource/updateInventoryClass";
		var paramCount = 0;
		if(inventoryNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('inventoryNo=' + inventoryNo);
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
