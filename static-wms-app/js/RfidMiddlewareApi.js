if (typeof (plugin) == "undefined") {
    var plugin = {};
}

plugin.rfidMiddleware = {};

/**
 * 启动
 */
plugin.rfidMiddleware.start = function () {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        RFID_MIDDLEWARE.start();
    }
};

/**
 * 停止
 */
plugin.rfidMiddleware.stop = function () {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        RFID_MIDDLEWARE.stop();
    }
};

/**
 * 启动读取
 */
plugin.rfidMiddleware.startInventory = function () {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        return RFID_MIDDLEWARE.startInventory();
    }
};

/**
 * 停止读取
 */
plugin.rfidMiddleware.stopInventory = function () {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        return RFID_MIDDLEWARE.stopInventory();
    }
};

/**
 * 设置EPC MASK
 */
plugin.rfidMiddleware.setEpcMask = function (epcMask) {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        try {
            RFID_MIDDLEWARE.setEpcMask(epcMask);
        }
        catch (err) {
            console.log(err);
        }
    }
};

/**
 * 设置发射功率
 * @returns "true":字符串，设置成功， "其他":获取失败的原因
 */
plugin.rfidMiddleware.setOutputPower = function (powerStr) {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        RFID_MIDDLEWARE.setOutputPower(powerStr);
    }
};


/**
 * 获取发射功率
 * @returns "10-30":字符串，获取成功， "其他":获取失败的原因
 */
plugin.rfidMiddleware.getOutputPower = function () {
    if (typeof (RFID_MIDDLEWARE) == "undefined") {
        alert("设备不支持RFID功能。");
    } else {
        return RFID_MIDDLEWARE.getOutputPower();
    }
};

/**
 * 读取事件，js中需要覆盖该事件
 */
plugin.rfidMiddleware.readEvent = function (epc) {
    alert("读取到EPC:" + epc);
}

/**
 * 清空MASK
 */
if (typeof (RFID_MIDDLEWARE) != "undefined") {
    plugin.rfidMiddleware.setEpcMask(null);
}