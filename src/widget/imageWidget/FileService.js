module.exports = {

    /**
     * canvas转dataURL：canvas对象、转换格式、图像品质
     */
    canvasToDataURL: function(canvas, format, quality) {
        return canvas.toDataURL(format || "image/jpeg", quality || 1.0);
    },

    /**
     * DataURL转canvas
     */
    dataURLToCanvas: function(dataurl, cb) {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            cb(canvas);
        };
        img.src = dataurl;
    },
    
    /**
     * image转canvas：图片地址
     */
    imageToCanvas: function(src, cb) {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = src;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            cb(canvas);
        };
    },
    /**
     * canvas转image
     */
    canvasToImage: function(canvas) {
        var img = new Image();
        img.src = canvas.toDataURL("image/jpeg", 1.0);
        return img;
    },

    /**
     * File/Blob对象转DataURL
     */
    fileOrBlobToDataURL: function(obj, cb) {
        var a = new FileReader();
        a.readAsDataURL(obj);
        a.onload = function(e) {
            cb(e.target.result);
        };
    },

    /**
     * DataURL转Blob对象
     */
    dataURLToBlob: function(dataurl) {
        var arr = dataurl.split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },

    
    /**
     * DataURL转Png Blob对象
     */
    dataURLToPngBlob: function(dataurl) {
        var arr = dataurl.split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: "image/png" });
    },

    /**
     * Blob转image
     */
    blobToImage: function(blob, cb) {
        fileOrBlobToDataURL(blob, function(dataurl) {
            var img = new Image();
            img.src = dataurl;
            cb(img);
        });
    },

    /**
     * image转Blob
     */
    imageToBlob: function(src, cb) {
        imageToCanvas(src, function(canvas) {
            cb(dataURLToBlob(canvasToDataURL(canvas)));
        });
    },

    /**
     * Blob转canvas
     */
    BlobToCanvas: function(blob, cb) {
        fileOrBlobToDataURL(blob, function(dataurl) {
            dataURLToCanvas(dataurl, cb);
        });
    },

    /**
     * canvas转Blob
     */
    canvasToBlob: function(canvas, cb) {
        cb(dataURLToBlob(canvasToDataURL(canvas)));
    },

    /**
     * image转dataURL
     */
    imageToDataURL: function(src, cb) {
        imageToCanvas(src, function(canvas) {
            cb(canvasToDataURL(canvas));
        });
    },

    /**
     * dataURL转image，这个不需要转，直接给了src就能用
     */
    dataURLToImage: function(dataurl) {
        var img = new Image();
        img.src = d;
        return img;
    }
};
