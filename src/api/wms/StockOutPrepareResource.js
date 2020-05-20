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
	 * 修改领料数量 
	 */
	changeQuantity: function(stockOutPrepareId, quantity){
		var requestUrl = "StockOutPrepareResource/changeQuantity";

		var formData = {};
		if(stockOutPrepareId != null){
			formData.stockOutPrepareId = stockOutPrepareId;
		}
		if(quantity != null){
			formData.quantity = quantity;
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
	 * 删除领料 
	 */
	deleteOne: function(dtos){
		var requestUrl = "StockOutPrepareResource/deleteDatas";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(dtos),
				
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
	 * 删除领料单 
	 */
	deleteStockOutPrepare: function(stockOutPrepareId){
		var requestUrl = "StockOutPrepareResource/deleteStockOutPrepare";
		var paramCount = 0;
		if(stockOutPrepareId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutPrepareId=' + stockOutPrepareId);
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
	 * 扫描二维码获取领料单号查询领料单 
	 */
	findByDocumentNo: function(documentNo, type){
		var requestUrl = "StockOutPrepareResource/findByDocumentNo";
		var paramCount = 0;
		if(documentNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('documentNo=' + documentNo);
			paramCount ++;
		}
		if(type != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('type=' + type);
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
	 * 查询未发货完成的领料单 
	 */
	findNoComplete: function(){
		var requestUrl = "StockOutPrepareResource/findNoComplete";


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
	 * 销售订单生单 
	 */
	generateSaleOrderToPrepareModelData: function(documentModelData){
		var requestUrl = "StockOutPrepareResource/generateSaleOrderToPrepareModelData";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(documentModelData),
				
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
	 * 获取领料信息（APP页面自动生成领用部门，领用单号，领用人） 
	 */
	getPrepareDto: function(){
		var requestUrl = "StockOutPrepareResource/getPrepareDto";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				
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
	 * 查询领料单 
	 */
	list: function(stockOutPrepareQueryDto){
		var requestUrl = "StockOutPrepareResource/list";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutPrepareQueryDto),
				
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
	 * 查询已处理处理的领料（分页） 
	 */
	queryProcessedData: function(pageSize, currentPage){
		var requestUrl = "StockOutPrepareResource/queryProcessedData";

		var formData = {};
		if(pageSize != null){
			formData.pageSize = pageSize;
		}
		if(currentPage != null){
			formData.currentPage = currentPage;
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
	 * 查询未处理的领料数量 
	 */
	queryUnProcessed: function(){
		var requestUrl = "StockOutPrepareResource/queryUnProcessedCount";


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
	 * 查询未处理的领料（分页） 
	 */
	queryUnProcessedData: function(pageSize, currentPage){
		var requestUrl = "StockOutPrepareResource/queryUnProcessedData";

		var formData = {};
		if(pageSize != null){
			formData.pageSize = pageSize;
		}
		if(currentPage != null){
			formData.currentPage = currentPage;
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
	 * <ul>
<li>项目：西门子。功能：需求模板生成新的领料单。</li>
<li>领料数量不能大于可领数量，同时也要大于0</li>
</ul> 
	 */
	saveByTemplate: function(stockOutPrepareQueryDto){
		var requestUrl = "StockOutPrepareResource/saveByTemplate";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutPrepareQueryDto),
				
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
<li>项目：西门子物料管理</li>
<li>领料车直接生成新的领料单。</li>
<li>领料车在原有的领料单直接添加。</li>
<li>领料数量不能大于可领数量，同时也要大于0</li>
<li>注意，如果领取100个东西，其有2个CurrentStock，那么此时要生成2个领料明细</li>
</ul> 
	 */
	saveManual: function(stockOutPrepareQueryDto){
		var requestUrl = "StockOutPrepareResource/saveManual";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(stockOutPrepareQueryDto),
				
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
