var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 领料车 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * <ul>
<li>项目：西门子。功能：手工领料加入领料车。</li>
<li>加入到领料车不限制填写的数量（必须要大于0）</li>
</ul> 
	 */
	addToPickingCar: function(projectItemId, warehouseId, currentStockDtos){
		var requestUrl = "PickingCarResource/addToPickingCar";
		var paramCount = 0;
		if(projectItemId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('projectItemId=' + projectItemId);
			paramCount ++;
		}
		if(warehouseId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('warehouseId=' + warehouseId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(currentStockDtos),
				
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
	 * 选择删除领料车中的领料 
	 */
	deletePickingCar: function(stockOutPrepareQueryDto){
		var requestUrl = "PickingCarResource/deletePickingCar";


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
	 * 分页查询当前登录人领料车信息 
	 */
	list: function(pickingCarQueryDto){
		var requestUrl = "PickingCarResource/list";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(pickingCarQueryDto),
				
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
	 * 查询登陆人领料车中的领料数量 
	 */
	queryPickingCarCount: function(){
		var requestUrl = "PickingCarResource/queryPickingCarCount";


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
