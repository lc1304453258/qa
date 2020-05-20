var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * 盘点单Resource 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * *
<p>
西门子项目，功能：盘点单扫描epc检查（扫描到epc到后台查询inventoryInstance）
</P>
<ul>
<li>1.盘点单生成之后，操作人员在现场整理物料，然后扫描盘点。</li>
<li>2.根据扫描到的物料实例信息，将于盘点单进行比较，显示对应的返回信息：
<ul>
<li>(1)正常盘点物料，对应物料实例卡片边框显示绿色。</li>
<li>(2)已经盘点物料，对应物料实例卡片边框显示黄色。</li>
<li>(3)盘盈盘点物料，对应物料实例卡片边框显示白色。</li>
<li>(4)不识别物料，对应物料实例卡片边框显示红色。</li>
</ul>
<li>
</ul> 
	 */
	check: function(checkVouchInventoryInstanceDtos, checkVouchId){
		var requestUrl = "CheckVouchResource/check/{checkVouchId}";
		var paramCount = 0;
		if(checkVouchId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('checkVouchId=' + checkVouchId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(checkVouchInventoryInstanceDtos),
				
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
西门子项目，功能：查询所有未完成的盘点单
</P> 
	 */
	findByCheckVouchQueryParam: function(checkVouchQueryParam){
		var requestUrl = "CheckVouchResource/findByCheckVouchQueryParam";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(checkVouchQueryParam),
				
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
	 * 根据名称和仓库生成盘点单 
	 */
	generateCheckVouch: function(name, warehouseId){
		var requestUrl = "CheckVouchResource/generateCheckVouch";

		var formData = {};
		if(name != null){
			formData.name = name;
		}
		if(warehouseId != null){
			formData.warehouseId = warehouseId;
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
	 * 查询状态为编辑中且未处理的盘点单 
	 */
	queryEditNoneChecked: function(){
		var requestUrl = "CheckVouchResource/queryEditNoneChecked";


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
	 * *
<p>
西门子项目，功能：盘点单扫描epc检查之后直接提交（扫描到epc到后台查询inventoryInstance）
</P>
<ul>
<li>1.盘点单生成之后，操作人员在现场整理物料，然后扫描盘点。</li>
<li>2.根据扫描到的物料实例信息，将于盘点单进行比较，显示对应的返回信息：
<ul>
<li>(1)正常盘点物料，对应物料实例卡片边框显示绿色。</li>
<li>(2)已经盘点物料，对应物料实例卡片边框显示黄色。</li>
<li>(3)盘盈盘点物料，对应物料实例卡片边框显示白色。</li>
<li>(4)不识别物料，对应物料实例卡片边框显示红色。</li>
</ul>
<li>
</ul> 
	 */
	update: function(checkVouchInventoryInstanceDtos, checkVouchId){
		var requestUrl = "CheckVouchResource/update/{checkVouchId}";
		var paramCount = 0;
		if(checkVouchId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('checkVouchId=' + checkVouchId);
			paramCount ++;
		}


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(checkVouchInventoryInstanceDtos),
				
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
