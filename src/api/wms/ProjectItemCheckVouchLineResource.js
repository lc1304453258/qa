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
	 * <p>
西门子项目，功能：项目事件物料数据提交之前检查（扫描到epc到后台查询inventoryInstance）
</P>
<ul>
<li>1.项目事件完成以后，操作人员在现场整理物料，然后将物料装箱。</li>
<li>2.装箱完毕以后，现场操作人员进入手持机的项目物料确认页面，输入对应的项目事件，查询项目事件对应的物料信息，然后点击页面下方的【确认】按钮，生成项目检查单。</li>
<li>3.已经生成项目检查单的项目事件不会再生成项目检查单。</li>
<li>4.然后进入手持机的项目物料检查页面，选择项目检查单，查询对应的检查物料信息，扣动扳机，依次扫描成套工具箱，散件工具箱以及散件工具箱内部的工具，系统会将扫描到的物料信息与检查单内的物料信息进行对比。页面信息显示的原则：
<ul>
<li>(1)数量不足，对应的物料卡片边框显示红色。</li>
<li>(2)数量相等，对应的物料卡片边框显示白色。</li>
<li>(3)数量大于，对应的物料卡片边框显示黄色，多出来的物料说明不属于此项目，卡片下方会进行提示。对于多出来的物料，数据传输到后台，并保存成检查单明细实例和检查单明细，并进行特殊标识。</li>
</ul>
<li>
</ul> 
	 */
	check: function(projectItemInventoryInstanceDtos, projectItemCheckVouchId){
		var requestUrl = "ProjectItemCheckVouchLineResource/check/{projectItemCheckVouchId}";
		if(projectItemCheckVouchId != null){
			requestUrl = requestUrl.replace('{projectItemCheckVouchId}', projectItemCheckVouchId);
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(projectItemInventoryInstanceDtos),
				
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
西门子项目，功能：根据事件项目检查单id查询项目事件检查单明细
</P> 
	 */
	findByProjectItemCheckVouchId: function(projectItemCheckVouchId){
		var requestUrl = "ProjectItemCheckVouchLineResource/findByProjectItemCheckVouchId";
		var paramCount = 0;
		if(projectItemCheckVouchId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('projectItemCheckVouchId=' + projectItemCheckVouchId);
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
	 * <p>
西门子项目，功能：项目事件物料检查（缺失生成缺失清单，多余生成误用清单）
</P>
<ul>
<li>1.项目事件完成以后，操作人员在现场整理物料，然后将物料装箱。</li>
<li>2.装箱完毕以后，现场操作人员进入手持机的项目物料确认页面，输入对应的项目事件，查询项目事件对应的物料信息，然后点击页面下方的【确认】按钮，生成项目检查单。</li>
<li>3.已经生成项目检查单的项目事件不会再生成项目检查单。</li>
<li>4.然后进入手持机的项目物料检查页面，选择项目检查单，查询对应的检查物料信息，扣动扳机，依次扫描成套工具箱，散件工具箱以及散件工具箱内部的工具，系统会将扫描到的物料信息与检查单内的物料信息进行对比。页面信息显示的原则：
<ul>
<li>(1)数量不足，对应的物料卡片边框显示红色。</li>
<li>(2)数量相等，对应的物料卡片边框显示白色。</li>
<li>(3)数量大于，对应的物料卡片边框显示黄色，多出来的物料说明不属于此项目，卡片下方会进行提示。对于多出来的物料，数据传输到后台，并保存成检查单明细实例和检查单明细，并进行特殊标识。</li>
</ul>
<li>
<li>5.点击页面下方的【确定】按钮，系统进行项目事件检查，如果物料缺失，系统会形成缺料报表，操作人员根据缺料报表去现场寻找丢失的物料，找到后再进行上述操作，同时也会更新检查单检查明细实例的状态。</li>
</ul> 
	 */
	save: function(projectItemInventoryInstanceDtos, projectItemCheckVouchId){
		var requestUrl = "ProjectItemCheckVouchLineResource/save/{projectItemCheckVouchId}";
		if(projectItemCheckVouchId != null){
			requestUrl = requestUrl.replace('{projectItemCheckVouchId}', projectItemCheckVouchId);
		}
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(projectItemInventoryInstanceDtos),
				
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
