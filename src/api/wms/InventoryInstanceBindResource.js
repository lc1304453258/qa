var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 成套工具箱与工具绑定资源类 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * <ul>
<li>1. 操作人员将需要需要绑定的物料拉到空闲区域。</li>
<li>2. 操作人员扣动手持机扳机，扫描物料。</li>
<li>3. 页面信息输入完毕后（操作人员输入实际安装数），点击页面下方的确定按钮，开始进行BOM绑定</li>
<li>4. 后台对前台传入的工具信息和工具箱进行BOM绑定</li>
<li>5. 然后将绑定结果返回到前台
<ul>
<li>0：绑定成功/li>
<li>-1：绑定不成功：数据异常（缺少epc、barCode）</li>
<li>1：绑定不成功：物料不识别</li>
</ul>
</li>
</ul> 
	 */
	inventoryInstanceBind: function(inventoryInstances){
		var requestUrl = "InventoryInstanceBindResource/inventoryInstanceBind";


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
<li>1. 操作人员将需要需要绑定的物料拉到空闲区域。</li>
<li>2. 操作人员扣动手持机扳机，扫描物料。</li>
<li>3. 扫描完成后，把数据发送到后台。</li>
<li>4. 后台将物料的BOM标识（如果存在），id，名称，编号，规格型号，是否有BOM，是否RFID管理等信息返回前台。</li>
<li>5. 前台对拿到的BOM标识进行判断
<ul>
<li>如果有一个BOM标识，则返回物料的信息(包括BOM标识，实例id，实例名称，实例编号，规格型号，是否有BOM，是否RFID管理)</li>
<li>如果没有，页面处于清空状态</li>
<li>如果有多个BOM标识，页面报警（例如：您当前扫描到2个工具箱，分别是工具箱1、工具箱2，请保证当前操作范围内只有一个工具箱。）</li>
</ul>
</li>
</ul> 
	 */
	inventoryInstanceBindCheck: function(inventoryInstances){
		var requestUrl = "InventoryInstanceBindResource/inventoryInstanceBindCheck";


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
	 * 加载上次的绑定数据 
	 */
	loadingLastBindData: function(rootInventoryInstanceId){
		var requestUrl = "InventoryInstanceBindResource/loadingLastBindData";
		var paramCount = 0;
		if(rootInventoryInstanceId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('rootInventoryInstanceId=' + rootInventoryInstanceId);
			paramCount ++;
		}


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
	}
}
