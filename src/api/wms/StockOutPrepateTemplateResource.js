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
	 * 根据条件查询公司需求模板 
	 */
	queryByCondition: function(name){
		var requestUrl = "StockOutPrepateTemplateResource/queryByCondition";
		var paramCount = 0;
		if(name != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('name=' + name);
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
	 * 根据条件查询领料模板及详情 
	 */
	queryStockOutPrepateTemplateDto: function(stockOutPrepateTemplateQueryDto){
		var requestUrl = "StockOutPrepateTemplateResource/queryStockOutPrepateTemplateDto";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(stockOutPrepateTemplateQueryDto),
				
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
