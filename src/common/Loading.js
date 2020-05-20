var UUID = require("./Uuid.js");

module.exports = {	
	/**
	 * 创建并显示Loading组件
	 * @param {Object} uuid
	 */
	show: function(){
		var uuid = UUID.createUUID();
		$('body').append("<div id='" + uuid + "' style='position: static'></div>");
		
		$("#" + uuid).mLoading({
		    text: "加载中...",//加载文字，默认值：加载中...
		    mask: true//是否显示遮罩效果，默认显示
		});

		$("#" + uuid).mLoading("show");
		return uuid;
	},
	
	/**
	 * 隐藏Loading组件
	 * @param {Object} uuid
	 */
	hide: function(uuid){
		var uuidElement = $("#" + uuid);
		if(uuidElement){
			uuidElement.mLoading("hide");	
			uuidElement.remove();	
		}
	},
}