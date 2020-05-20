var Common = require("../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 *  
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 根据自定义窗口编号查询自定义窗口DTO 
	 */
	uniqueByNo: function(no){
		var requestUrl = "CustomerWindowResource/uniqueByNo";
		var paramCount = 0;
		if(no != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('no=' + no);
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
	}
	
}
