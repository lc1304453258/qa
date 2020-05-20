var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 西门子项目：出库资源类 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * <ul>
<li>项目：西门子。功能：出库。</li>
<li>1.项目经理在系统上领料。</li>
<li>2.仓库人员打印领料单，领料单带货位信息。</li>
<li>3.仓库人员根据领料单去仓库的库位上进行拣货，拣货遵循如下原则。
<ul>
<li>(1).如果是成套工具箱，那么直接从货架上拿成套工具箱，货架上的成套工具箱里面配套的工具都是齐全的，不存在缺少的情况。如果货架上没有成套工具箱，那么先执行成套工具箱上架的流程</li>
<li>(2).如果不是成套工具箱，那么首先从货架上拿非成套工具箱，然后从货架上拿额外散件，然后把额外散件放到非成套工具箱内。如果货架上没有非成套工具箱或额外散件，那么先执行非成套工具箱或散件上架的流程</li>
</ul>
</li>
<li>4.所有工具箱全部拣货完成以后，把该项目所有的工具箱放在开始划定的4米*3米的空闲区域。</li>
<li>5.操作人员首先进入扫描出库页面，点击领料单号下拉框，选择要发货的领料单，系统自动将领料单对应的项目事件显示在项目事件文本框内。然后再扣动扳机，依次扫描成套工具箱、非成套工具箱以及非成套工具箱内的额外散件，页面分两个页签显示工具信息，暂时设计如下：
<ul>
<li>(1).左页签：显示工具信息，包括工具SKU，工具名称，应发数量，扫描数量等信息</li>
<li>(2).右页签：显示工具详细信息，包括工具SKU，工具名称，epc，货位等信息</li>
<li>(3).注意：成套工具箱绑定的子件工具信息不显示</li>
</ul>
</li>
<li>6.仓库人员查看页面信息，确认无误后，选择页面上方的出库时间（不选默认当前时间），点击页面下方的【确认】按钮，系统生成出库信息：
<ul>
<li>(1).出库单（StockOut）：包括单据号，项目事件，供应商，仓库，出库时间，制单人，备注等信息</li>
<li>(2).出库明细（StockOutLine）：关联的是inventory，包括SKU，名称，货位，数量，备注等信息</li>
<li>(3).出库单序列号明细（StockOutLineInstance）：关联的是inventoryInstance，包括出库明细，货位，数量（默认是1），物料序列号，扫描人，扫描时间等信息</li>
<li>(4).注意：成套工具箱出库，那么成套工具箱所绑定的所有子件工具都做出库操作，即保存StockOutLineInstance信息</li>
</ul>
</li>
<li>7.出库操作遵循如下原则：
<ul>
<li>(1).物料有入库记录，正常出库，生成出库单据</li>
<li>(2).物料无入库记录，补采购入库单，然后生成出库单据</li>
<li>(3).物料已有出库记录，补生产入库单，然后生成出库单据</li>
</ul>
</li>
</ul> 
	 */
	stockOut: function(inventoryInstances, stockOutDate, stockOutPrepareId, tagNo){
		var requestUrl = "StockOutGeneratorResource/stockOut/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
		}
		var paramCount = 0;
		if(stockOutDate != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutDate=' + stockOutDate);
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
	 * 西门子项目：针对成套工具箱子件进行强制出库 
	 */
	stockOutByComponent: function(inventoryInstances, stockOutDate, stockOutPrepareId, tagNo){
		var requestUrl = "StockOutGeneratorResource/stockOutByComponent/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
		}
		var paramCount = 0;
		if(stockOutDate != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('stockOutDate=' + stockOutDate);
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
<li>项目：西门子。功能：出库检查。</li>
<li>1.项目经理在系统上领料。</li>
<li>2.仓库人员打印领料单，领料单带货位信息。</li>
<li>3.仓库人员根据领料单去仓库的库位上进行拣货，拣货遵循如下原则。
<ul>
<li>(1).如果是成套工具箱，那么直接从货架上拿成套工具箱，货架上的成套工具箱里面配套的工具都是齐全的，不存在缺少的情况。如果货架上没有成套工具箱，那么先执行成套工具箱上架的流程</li>
<li>(2).如果不是成套工具箱，那么首先从货架上拿非成套工具箱，然后从货架上拿额外散件，然后把额外散件放到非成套工具箱内。如果货架上没有非成套工具箱或额外散件，那么先执行非成套工具箱或散件上架的流程</li>
</ul>
</li>
<li>4.所有工具箱全部拣货完成以后，把该项目所有的工具箱放在开始划定的4米*3米的空闲区域。</li>
<li>5.操作人员首先进入扫描出库页面，点击领料单号下拉框，选择要发货的领料单，系统自动将领料单对应的项目事件显示在项目事件文本框内。然后再扣动扳机，依次扫描成套工具箱、非成套工具箱以及非成套工具箱内的额外散件，页面分两个页签显示工具信息，暂时设计如下：
<ul>
<li>(1).左页签：显示工具信息，包括工具SKU，工具名称，应发数量，扫描数量等信息</li>
<li>(2).右页签：显示工具详细信息，包括工具SKU，工具名称，epc，货位等信息</li>
<li>(3).注意：成套工具箱绑定的子件工具信息不显示</li>
</ul>
</li>
</ul> 
	 */
	stockOutCheck: function(inventoryInstances, stockOutPrepareId){
		var requestUrl = "StockOutGeneratorResource/stockOutCheck/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
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
	 * 西门子项目：针对成套工具箱子件进行强制出库检查 
	 */
	stockOutCheckByComponent: function(inventoryInstances, stockOutPrepareId){
		var requestUrl = "StockOutGeneratorResource/stockOutCheckByComponent/{stockOutPrepareId}";
		if(stockOutPrepareId != null){
			requestUrl = requestUrl.replace('{stockOutPrepareId}', stockOutPrepareId);
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
	}
}
