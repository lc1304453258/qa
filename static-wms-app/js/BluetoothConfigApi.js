if(typeof(plugin) == "undefined"){
    var plugin = {};
}

plugin.bluetoothConfig = {};

/**
 * 打开蓝牙配置界面
 */
plugin.bluetoothConfig.start = function (){
    if(typeof(BLUETOOTH_CONFIG) == "undefined"){
        alert("设备不支持蓝牙配置。");
    }else{
        BLUETOOTH_CONFIG.start();
    }
}