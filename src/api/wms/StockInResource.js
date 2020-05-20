var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 入库资源 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 到货单生成入库单生单 
	 */
	generateArrivalStockInModelData: function(documentModelData){
		var requestUrl = "stockInResource/generateArrivalStockInModelData";


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
	 * 物料生成入库单 
	 */
	generateModelDataByInventory: function(documentModelData){
		var requestUrl = "stockInResource/generateModelDataByInventory";


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
	 * 订单生成入库单 
	 */
	generateOrderToInModelData: function(documentModelData){
		var requestUrl = "stockInResource/generateOrderToInModelData";


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
	 * 仓库库存生成红字入库单生单 
	 */
	generateRedModelData: function(documentModelData){
		var requestUrl = "stockInResource/generateRedModelData";


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
	 * 红色入库单生单 
	 */
	generateRedStockInModelData: function(documentModelData){
		var requestUrl = "stockInResource/generateRedStockInModelData";


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
	 * 销售订单生成入库单 
	 */
	generateSaleOrderToInModelData: function(documentModelData){
		var requestUrl = "stockInResource/save";


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
	 * 订单生成入库单 
	 */
	generateStockInByOrder: function(documentModelData){
		var requestUrl = "stockInResource/generateStockInByOrder";


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
	 * 到货单生成入库单 
	 */
	generateStockInModelDataByArrival: function(documentModelData){
		var requestUrl = "stockInResource/generateStockInModelDataByArrival";


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
	 * 检验单生成入库单 
	 */
	generateStockInModelDataByInspection: function(documentModelData){
		var requestUrl = "stockInResource/generateStockInModelDataByInspection";


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
	 * <ul>
<li>1. 操作人员将需要入货架的物料拉到空闲区域。</li>
<li>2. 操作人员扣动手持机扳机，扫描物料。</li>
<li>3. 扫描完成后，手持机界面显示物料信息，包括SKU、物料名称、规格型号、默认放置货位、是否已采购入库。</li>
<li>4.
对每个物料，可以修改其放置的货位。物料真实存储货位的优先级如下：人工输入的货位（高）>物料注册时选择的仓库货位（中）>物料在仓库中默认存放的货位（低）。</li>
<li>5.
如果发现标签对应的物料未进行过采购入库，那么在手持机页面上选择“仓库”，选择“库位”，点击【入库】按钮，系统会自动生成采购入库单。</li>
<li>
<ul>
<li>(1) 采购入库单包括：单据号，仓库，入库时间，制单人，制单时间，备注等字段。</li>
<li>(2) 采购入库单明细包括：SKU，物料名称，供应商，数量，备注等字段。</li>
<li>(3) 采购入库单序列号明细包括：物料序列号，采购入库单明细，扫描人，扫描时间等字段。</li>
</ul>
</li>
</ul> 
	 */
	purchaseStockIn: function(inventoryInstances, tagNo){
		var requestUrl = "stockInResource/purchaseStockIn";
		var paramCount = 0;
		if(tagNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('tagNo=' + tagNo);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
<li>1. 操作人员将需要采购入货架的物料拉到空闲区域。</li>
<li>2. 操作人员扣动手持机扳机，扫描物料。</li>
<li>3. 扫描完成后，把数据发送到服务端。</li>
<li>4. 服务端检查物料是否可以生成采购入库单
<ul>
<li>如果可以，则生成采购入库单，则返回物料的信息(包括物料编码、物料名称、规格型号、默认放置货位、是否已采购入库)</li>
<li>如果不可以，则生成采购入库单，则返回不能生成的原因，不能生成的原因如下：
<ol>
<li>0：可以采购入库</li>
<li>-1：不能采购入库，已经完成采购入库</li>
<li>1：不能采购入库：数据异常（缺少epc、barCode、positionBarCode）</li>
<li>2：不能采购入库：物料不识别</li>
<li>3：不能采购入库：货位不识别</li>
<li>4：不能采购入库：该批物料入库货位隶属多个仓库</li>
</ol>
</li>
</ul>
</li>
</ul> 
	 */
	purchaseStockInCheck: function(inventoryInstances){
		var requestUrl = "stockInResource/purchaseStockInCheck";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
	 * 盘盈数据处理生成入库单 
	 */
	save: function(dtos){
		var requestUrl = "stockInResource/saveByCheckProfit";


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
	 * 直接入库扫描生成入库单 
	 */
	saveByInventoryInstance: function(dtos, documentTypeId){
		var requestUrl = "stockInResource/saveByInventoryInstance/{documentTypeId}";
		if(documentTypeId != null){
			requestUrl = requestUrl.replace('{documentTypeId}', documentTypeId);
		}


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
	 * RFID扫描生成入库单 
	 */
	saveByInventoryInstanceByRfid: function(dtos, stockInType){
		var requestUrl = "stockInResource/saveByInventoryInstanceByRfid/{documentTypeId}";
		if(stockInType != null){
			requestUrl = requestUrl.replace('{stockInType}', stockInType);
		}


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
	 * 扫描退料 
	 */
	saveRedByInventoryInstance: function(dtos, stockInType){
		var requestUrl = "stockInResource/saveRedByInventoryInstance/{documentTypeId}";
		if(stockInType != null){
			requestUrl = requestUrl.replace('{stockInType}', stockInType);
		}


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
	 * <ul>
<li>项目：西门子。功能：入库。</li>
<li>1.操作人员将需要扫描上架的物料拉到空闲区域。</li>
<li>2.操作人员扣动手持机扳机，扫描物料。</li>
<li>3.epc数组传到后台，服务器检查询物料信息，以及判断是否可以入库，将检查结果返回给前台。</li>
<li>4.检查结果返回到前台，手持机界面显示物料信息，包括2个页签：
<ul>
<li>(1)物料信息：显示物料的SKU，名称，扫描数量。</li>
<li>(2)物料详细信息：这个页面的信息精确到每一把工具，子件SKU，子件名称，epc，货位。</li>
</ul>
</li>
<li>5.前台显示物料信息遵循如下原则：
<ul>
<li>(1)如果物料有父件，只显示父件的物料信息（成套工具箱）。</li>
<li>(2)如果物料没有父件，就显示物料。</li>
</ul>
</li>
<li>6.页面信息显示完整后，选择库位（也可以不选择库位，如果InventoryInstance有默认货位，可以使用默认货位），然后点击【入库】按钮，系统会自动生成入库单，工具箱和物料上架。
<ul>
<li>(1)入库单包括：单据号，仓库，供应商，入库时间，制单人，制单时间，备注等字段。</li>
<li>(2)入库单明细包括：SKU，物料名称，数量，备注等字段。</li>
<li>(3)入库单序列号明细包括：物料序列号，入库单明细，扫描人，扫描时间等字段。</li>
</ul>
</li>
<li>7.注意：
<ul>
<li>(1)如果选择的库位与某一个物料当前的位置相同，则忽略处理，入库完成后，填充InventoryInstance的position，清除InventoryInstance的projectItem。</li>
<li>(2)物料出库后，清除InventoryInstance的position，填充projectItem，。</li>
<li>(3)StockInLine：关联inventory，还包括position，quantity等信息。</li>
<li>(4)StockInLineInstance：关联的是InventoryInstance，还包括stockInLine，position等信息，quantity默认都是1。</li></li>
</ul> 
	 */
	stockIn: function(inventoryInstances, stockInDate, tagNo){
		var requestUrl = "stockInResource/stockIn";
		var paramCount = 0;
		if(stockInDate != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockInDate=' + stockInDate);
			paramCount ++;
		}
		if(tagNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('tagNo=' + tagNo);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
	 * <p>
项目：西门子项目，子件强制入库。
</p> 
	 */
	stockInByComponent: function(inventoryInstances, stockInDate, tagNo){
		var requestUrl = "stockInResource/stockInByComponent";
		var paramCount = 0;
		if(stockInDate != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockInDate=' + stockInDate);
			paramCount ++;
		}
		if(tagNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('tagNo=' + tagNo);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
<li>项目：西门子。功能：入库检查。</li>
<li>1.操作人员将需要扫描上架的物料拉到空闲区域。</li>
<li>2.操作人员扣动手持机扳机，扫描物料。</li>
<li>3.epc数组传到后台，服务器检查询物料信息，以及判断是否可以入库，将检查结果返回给前台。</li>
<li>4.检查结果返回到前台，手持机界面显示物料信息，包括2个页签：
<ul>
<li>(1)物料信息：显示物料的SKU，名称，扫描数量。</li>
<li>(2)物料详细信息：这个页面的信息精确到每一把工具，子件SKU，子件名称，epc，货位。</li>
</ul>
</li>
<li>5.前台显示物料信息遵循如下原则：
<ul>
<li>(1)如果物料有父件，只显示父件的物料信息（成套工具箱）。</li>
<li>(2)如果物料没有父件，就显示物料。</li>
</ul>
</li>
</ul> 
	 */
	stockInCheck: function(inventoryInstances){
		var requestUrl = "stockInResource/stockInCheck";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
	 * <p>
项目：西门子项目，子件强制入库检查。
</p> 
	 */
	stockInCheckByComponent: function(inventoryInstances){
		var requestUrl = "stockInResource/stockInCheckByComponent";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(inventoryInstances),
				
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
	 * 根据id 查询单据类型 
	 */
	uniqueIsRedByStockInId: function(stockInId){
		var requestUrl = "stockInResource/uniqueIsRedByStockInId";
		var paramCount = 0;
		if(stockInId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockInId=' + stockInId);
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
