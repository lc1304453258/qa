module.exports = {
    imgNotFound : function(event){
        var img = event;
        if(this.clientRunningEnvironment == 'BROWSER'){
        	img.src = "../static-wms-app/image/imageNotFound.png";
        }else{
        	img.src = "./static-wms-app/image/imageNotFound.png";
        }
        img.onerror = null;
    },
    clientRunningEnvironment:function(){
		var href = window.location.href;
	  	if(href.indexOf("http") == 0){
	        return "BROWSER";
	    }else{
	        return "LOCAL";
	    }
    }
}