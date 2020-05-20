var Common = require("../../common/Common.js");

module.exports = {
    /**
     * 上传图片
     */
    uploadImage: function(formData){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: Common.getApiURL("file/imgUpload"),
                type: "post",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                data: formData,
                contentType: false,
                processData: false,
                success: function (imageName) {
                    resolve(imageName);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                    reject(XMLHttpRequest);
                }
            });
        });
    },
    
}