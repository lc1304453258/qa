var Common = require("../../common/Common.js");

module.exports = {
    /**
     * 根据参数名称查询参数值
     */
    listByParamName: function(paramName){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Common.getApiURL("userParamResource/listByParamName"),
                type: "get",
                dataType: "json",
                data: {
                    paramName: paramName
                },
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