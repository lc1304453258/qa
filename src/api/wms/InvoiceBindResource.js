var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 发货绑定资源类 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * <ul>
<li>项目：西门子。功能：发货绑定。</li>
<li>1.操作人员将需要发货绑定的物料拉到空闲区域。</li>
<li>2.操作人员点击【确认】按钮。</li>
<li>3.epc数组传到后台，服务器检查询物料信息，以及判断是否可以进行绑定，将绑定的结果返回给前台。</li>
</ul>
</li>
</ul> 
	 */
	invoiceBind: function(invoiceInstanceDtos, stockOutDate, stockOutPrepareId, description){
		var requestUrl = "InvoiceBindResource/invoiceBind/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
		}
		var paramCount = 0;
		if(stockOutDate != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutDate=' + stockOutDate);
			paramCount ++;
		}
		if(description != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('description=' + description);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(invoiceInstanceDtos),
				
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
	 * <ul>
<li>项目：西门子。功能：发货绑定检查。</li>
<li>1.操作人员将需要发货绑定的物料拉到空闲区域。</li>
<li>2.操作人员扣动手持机扳机，扫描物料。</li>
<li>3.epc数组传到后台，服务器检查询物料信息，以及判断是否可以进行绑定，将检查结果返回给前台。</li>
</ul>
</li>
</ul> 
	 */
	invoiceBindCheck: function(invoiceInstanceDtos, stockOutPrepareId){
		var requestUrl = "InvoiceBindResource/invoiceBindCheck/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(invoiceInstanceDtos),
				
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
