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
	 * 附件下载 
	 */
	attachmentDownload: function(className, recordId, fileName, windowNo){
		var requestUrl = "file/attachmentDownload";
		var paramCount = 0;
		if(className != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('className=' + className);
			paramCount ++;
		}
		if(recordId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('recordId=' + recordId);
			paramCount ++;
		}
		if(fileName != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('fileName=' + fileName);
			paramCount ++;
		}
		if(windowNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('windowNo=' + windowNo);
			paramCount ++;
		}


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
								dataType: "octet-stream",
				
				
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
	 * 附件下载路径 
	 */
	attachmentDownloadPath: function(className, recordId, fileName, windowNo, token){
		var requestUrl = "file/attachmentDownloadPath";
		var paramCount = 0;
		if(className != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('className=' + className);
			paramCount ++;
		}
		if(recordId != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('recordId=' + recordId);
			paramCount ++;
		}
		if(fileName != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('fileName=' + fileName);
			paramCount ++;
		}
		if(windowNo != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('windowNo=' + windowNo);
			paramCount ++;
		}
		if(token != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('token=' + token);
			paramCount ++;
		}


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
								dataType: "octet-stream",
				
				
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
	 * 附件上传 
	 */
	attachmentUpload: function(){
		var requestUrl = "file/attachmentUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
				
				
				
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
	 * 类文件上传 
	 */
	classFileUpload: function(){
		var requestUrl = "file/classFileUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
				
				
				
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
	 * 删除附件 
	 */
	deleteAttachment: function(className, windowNo, recordId, fileName){
		var requestUrl = "file/deleteAttachment";

			var formData = {};
			if(className != null){
				formData.className = className;
			}
			if(windowNo != null){
				formData.windowNo = windowNo;
			}
			if(recordId != null){
				formData.recordId = recordId;
			}
			if(fileName != null){
				formData.fileName = fileName;
			}

		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/x-www-form-urlencoded",
								
				
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
	 * 文件下载 
	 */
	fileDownload: function(fileName, className){
		var requestUrl = "file/fileDownload";
		var paramCount = 0;
		if(fileName != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('fileName=' + fileName);
			paramCount ++;
		}
		if(className != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('className=' + className);
			paramCount ++;
		}


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
								dataType: "octet-stream",
				
				
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
	 * 文件上传 
	 */
	fileUpload: function(){
		var requestUrl = "file/fileUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
				
				
				
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
	 * 获取附件 
	 */
	getAttachments: function(className, recordId){
		var requestUrl = "file/getAttachments";

			var formData = {};
			if(className != null){
				formData.className = className;
			}
			if(recordId != null){
				formData.recordId = recordId;
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
	 *  
	 */
	getQRCode: function(content){
		var requestUrl = "file/getQRCode";
		var paramCount = 0;
		if(content != null){
			requestUrl += (paramCount > 0) ? '&' : '?';
			requestUrl += ('content=' + content);
			paramCount ++;
		}


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
								dataType: "octet-stream",
				
				
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
	 * 图片上传 
	 */
	imageUpload: function(){
		var requestUrl = "file/imageUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
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
	 * 截图上传 
	 */
	imgUpload: function(){
		var requestUrl = "file/imgUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
				
				
				
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
	 * 多张图片上传 
	 */
	multipleAttachmentUpload: function(){
		var requestUrl = "file/multipleAttachmentUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
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
	 * 多张图片上传 
	 */
	multipleImageUpload: function(){
		var requestUrl = "file/multipleImageUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
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
	 *  
	 */
	readFile: function(){
		var requestUrl = "file/readFile";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
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
	 * 视频上传 
	 */
	videoUpload: function(){
		var requestUrl = "file/videoUpload";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: false,
				processData: false,
				
				
				
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
	 *  
	 */
	vido: function(){
		var requestUrl = "file/video";


		
		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "get",
								
				
				
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
