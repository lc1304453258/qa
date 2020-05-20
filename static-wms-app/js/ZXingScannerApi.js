if(typeof(plugin) == "undefined"){
    var plugin = {};
}

plugin.barCode = {};

/**
 * 启动摄像头扫码
 * continuous: true:连续扫描, false:不连续扫描
 */
plugin.barCode.scan = function (continuous){
    if(typeof(ZXING_SCANNER) == "undefined"){
        alert("设备不支持摄像头扫码。");
    }else{
        ZXING_SCANNER.start((continuous == true) ? "continuous" : "notContinuous");
    }
}

/**
 * ZXING读取到数据的事件
 * 外部js需要覆盖该方法
 */
plugin.barCode.scanEvent = function (barCodeStrs){
    if(barCodeStrs != undefined && barCodeStrs.length > 0){
        var barCodes = barCodeStrs.split(",");
        alert("读取到" + barCodes.length + "个条码。");
    }
}

