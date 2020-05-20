if(typeof(plugin) == "undefined"){
    var plugin = {};
}

plugin.settingConfig = {};

/**
 * 是否支持该功能
 */
plugin.settingConfig.isSupport = function(){
    if(typeof(SETTING_CONFIG) == "undefined"){
        return false;
    }else{
        return true;
    }
}

/**
 * 设置参数
 */
plugin.settingConfig.setSetting = function (key, value){
    if(typeof(SETTING_CONFIG) == "undefined"){
        alert("设备不支持配置功能。");
    }else{
        SETTING_CONFIG.setSetting(key, value);
    }
}

/**
 * 获取参数
 */
plugin.settingConfig.getSetting = function (key){
    if(typeof(SETTING_CONFIG) == "undefined"){
        alert("设备不支持配置功能。");
    }else{
        return SETTING_CONFIG.getSetting(key);
    }
}