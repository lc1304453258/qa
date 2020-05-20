var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * <p>
西门子项目：项目事件物检查资源类
</p> 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * <p>
西门子项目，功能：查询当前登录用户新建的检查单
</P> 
	 */
	findByCreateUserId: function(){
		var requestUrl = "ProjectItemCheckVouchResource/findByCreateUserId";


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
西门子项目，功能：根据项目事件查询项目事件对应的项目检查单
</P> 
	 */
	findByProjectItemId: function(projectItemId){
		var requestUrl = "ProjectItemCheckVouchResource/findByProjectItemId";
		var paramCount = 0;
		if(projectItemId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('projectItemId=' + projectItemId);
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
	wmsapp查询项目物料检查单详情
</P> 
	 */
	findCheckVouchById: function(checkVouchId){
		var requestUrl = "ProjectItemCheckVouchResource/findCheckVouchById";
		var paramCount = 0;
		if(checkVouchId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('checkVouchId=' + checkVouchId);
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
西门子项目，功能：生成项目事件检查单
</P>
<ul>
<li>1.项目事件完成以后，操作人员在现场整理物料，然后将物料装箱。</li>
<li>2.装箱完毕以后，现场操作人员进入手持机的项目物料确认页面，输入对应的项目事件，查询项目事件对应的物料信息，然后点击页面下方的【确认】按钮，生成项目检查单。</li>
<li>3.已经生成项目检查单的项目事件不会再生成项目检查单。</li>
</ul> 
	 */
	saveProjectItemCheckVouch: function(projectItemId){
		var requestUrl = "ProjectItemCheckVouchResource/saveProjectItemCheckVouch/{projectItemId}";
		if(projectItemId != null){
			requestUrl = requestUrl.replace('{projectItemId}', projectItemId);
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
