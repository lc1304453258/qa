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
	 * 打印包装@GET@Path("/print")@Produces(MediaType.TEXT_PLAIN)public String printInventoryInstance(@QueryParam("token") String token, @QueryParam("recordIds") String recordIds){return inventoryInstancePrintService.printInventoryInstance(token, recordIds);TODO: 待重写return null;}打印存货序列号 
	 */
	print: function(recordIds){
		var requestUrl = "InventoryInstancePrintResource/print";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(recordIds),
				
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
	 * 根据userId、printed查询打印队列 
	 */
	queryInventoryInstancePrint: function(printed, documentNo, inventoryName, inventoryCode, inventoryType){
		var requestUrl = "InventoryInstancePrintResource/queryInventoryInstancePrint";
		var formData = new FormData();
		if(printed != null){
			formData.append('printed', printed);
		}
		if(documentNo != null){
			formData.append('documentNo', documentNo);
		}
		if(inventoryName != null){
			formData.append('inventoryName', inventoryName);
		}
		if(inventoryCode != null){
			formData.append('inventoryCode', inventoryCode);
		}
		if(inventoryType != null){
			formData.append('inventoryType', inventoryType);
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
	 * 查询打印队列中未打印总记录数 
	 */
	queryInventoryInstancePrintCount: function(){
		var requestUrl = "InventoryInstancePrintResource/queryInventoryInstancePrintCount";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				
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
	 * 查询已打印打印队列 
	 */
	queryPrintedInventoryInstancePrint: function(printed, currentPage, pageSize, documentNo, inventoryName, inventoryCode, inventoryType){
		var requestUrl = "InventoryInstancePrintResource/queryPrintedInventoryInstancePrint";
		var formData = new FormData();
		if(printed != null){
			formData.append('printed', printed);
		}
		if(currentPage != null){
			formData.append('currentPage', currentPage);
		}
		if(pageSize != null){
			formData.append('pageSize', pageSize);
		}
		if(documentNo != null){
			formData.append('documentNo', documentNo);
		}
		if(inventoryName != null){
			formData.append('inventoryName', inventoryName);
		}
		if(inventoryCode != null){
			formData.append('inventoryCode', inventoryCode);
		}
		if(inventoryType != null){
			formData.append('inventoryType', inventoryType);
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
	 * 根据存货档案Id把存货档案放入到打印队列(printed IS NULL or printed = false)中
<ul>
	<li>如果存货档案Id对应的存货档案已经在打印队列中  throws ProcessException</li>
	<li>如果不存在打印队列中，把对应的存货序列号和打印人放入到打印队列中</li>
</ul> 
	 */
	saveInventoryInstancesToInventoryInstancePrint: function(inventoryInstanceId){
		var requestUrl = "InventoryInstancePrintResource/saveInventoryInstancesToInventoryInstancePrint";
		var formData = new FormData();
		if(inventoryInstanceId != null){
			formData.append('inventoryInstanceId', inventoryInstanceId);
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
	 * 根据存货序列号Id 把未打印的存货序列号放入打印队列
<ul>
	<li>如果存货档案Id对应的未打印存货档案已经在打印队列中  throws ProcessException</li>
	<li>如果不存在打印队列中，把对应的未打印存货序列号和打印人放入到打印队列中</li>
</ul> 
	 */
	saveNotPrintedInventoryInstancesToInventoryInstancePrint: function(inventoryInstanceIds){
		var requestUrl = "InventoryInstancePrintResource/saveNotPrintedInventoryInstancesToInventoryInstancePrint";
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(inventoryInstanceIds),
				
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
