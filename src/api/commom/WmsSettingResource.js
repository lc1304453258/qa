var Common = require("../../common/Common.js");

/**
 * 工具类自动生成的API，请勿做任何修改，请勿做任何修改，请勿做任何修改（重要的事情说3遍）
 * 工具作者: 杨志杰
 * WMS 配置资源根据条码号获取商品信息@GET
@Path("/getBarCodeStatus")
@AuthoriseResource
@Produces(MediaType.APPLICATION_JSON)
public GoodsBarCodeLine getBarCodeStatus(@QueryParam("barCode") String barCode){
GoodsBarCodeLine goodsBarCodeLine = barCodeProvider.unique( barCode).getResult();
return goodsBarCodeLine;
} 
 */
module.exports = {

	/**
	 * 工具类自动生成的方法
	 * 工具作者: 杨志杰
	 * 创建默认WmsSetting 
	 */
	createDefaultWmsSetting: function(){
		var requestUrl = "WmsSettingResource/createDefaultWmsSetting";


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
	 * 根据快递单号获取快递信息@GET
@Path("/getExpressStatus")
@AuthoriseResource
@Produces(MediaType.APPLICATION_JSON)
public ProviderResultLineDto getExpressStatus(@QueryParam("number") String number){
ProviderResultLineDto providerResultLineDto = expressQueryProvider.unique( number).getResult();
return providerResultLineDto;
}获取条码供应商名称 
	 */
	getBarCodeName: function(){
		var requestUrl = "WmsSettingResource/getBarCodeName";


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
	 * 获取快递供应商名称 
	 */
	getExpressName: function(){
		var requestUrl = "WmsSettingResource/getExpressName";


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
	 * 处理更新或者新增仓库配置数据请求 
	 */
	saveOrUpdateWmsSetting: function(wmsSettingDto){
		var requestUrl = "WmsSettingResource/saveOrUpdate";


		return new Promise((resolve, reject) => {
			$.ajax({
				url: Common.getApiURL(requestUrl),
				type: "post",
				contentType: "application/json",
				
				dataType: "json",
				data: JSON.stringify(wmsSettingDto),
				
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
	 * 处理根据clientId查询仓库配置信息的请求 
	 */
	unique: function(){
		var requestUrl = "WmsSettingResource/unique";


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
