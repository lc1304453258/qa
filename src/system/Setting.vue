<template>
    <div class="container-fluid">
        <Navbar title="设置"></Navbar>
        <fieldset class="form-group">
            <div class="row">
                <legend class="col-form-label col-sm-2 pt-0 text-muted">设置发射功率({{power}})</legend>
                <div class="col-sm-10">
                    10
                    <input type="range"
                           min="10"
                           max="30"
                           step="1"
                           id="rangeWidth"
                           v-model="power">
                    30
                </div>
            </div>
            <div class="row">
                <legend class="col-form-label col-sm-2 pt-0 text-muted">图片压缩质量</legend>
                <div class="col-sm-10">
                    <div class="form-check">
                        <input class="form-check-input"
                               type="radio"
                               name="imageQuanlity"
                               id="gridRadios1"
                               value="0"
                               checked
                               style="">
                        <label class="form-check-label"
                               for="gridRadios1">
                            不压缩
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input"
                               type="radio"
                               name="imageQuanlity"
                               id="gridRadios2"
                               value="1">
                        <label class="form-check-label"
                               for="gridRadios2">
                            1080P
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input"
                               type="radio"
                               name="imageQuanlity"
                               id="gridRadios3"
                               value="2">
                        <label class="form-check-label"
                               for="gridRadios3">
                            720P
                        </label>
                    </div>
                    <div>
                        <label>打印角度</label>
                        <input id="print-angle"
                               type="number"
                               placeholder="请输入角度:0/90/180/270"
                               style="border: none;">
                    </div>
                </div>
            </div>
            <div>
                <p>
                    <button type="button"
                            class="btn btn-primary btn-xs btn-block"
                            id="btn-config">配置蓝牙</button>
                    <button type="button"
                            class="btn btn-primary btn-xs btn-block"
                            id="btn-save"
                            @click="save">保存配置</button>
                    <button type="button"
                            class="btn btn-danger btn-xs btn-block"
                            id="btn-quit"
                            @click="quitLogin">退出登录</button>
                </p>
            </div>
        </fieldset>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var Notify = require("../widget/Notify.js");

var Modal = require("../widget/Modal.vue");
var Navbar = require("../widget/Navbar.vue");

module.exports = {

    components: {
        Modal,
        Navbar
    },

    data: function () {
        return {
            power: 10,
        }
    },

    methods: {

        /**
         *  退出登录
         */
        quitLogin: function () {
            this.$router.push('../login');
        },
        // 保存配置
        save: function () {
            var _self = this;
            var printRotateAngle = $("#print-angle").val();
            plugin.settingConfig.setSetting("printRotateAngle", printRotateAngle);
            plugin.rfidMiddleware.setOutputPower(_self.power);
            Notify.success("提示", "配置保存成功！")
        }

    },

    mounted: function () {
        var _self = this;
        var assetConfig = null;

        var imageQuality = localStorage.getItem("imageQuality");
        if (imageQuality == null) {
            localStorage.setItem("imageQuality", "0");
            $("input:radio[value=0]").attr('checked', 'true');
        } else {
            $("input:radio[value=" + imageQuality + "]").attr('checked', 'true');
        }

        var powerStr = plugin.rfidMiddleware.getOutputPower();
        if (powerStr != undefined) {
            powerStr = parseInt(powerStr);
            _self.power = powerStr;
        }

        $("input:radio[name=imageQuanlity]").click(function () {
            localStorage.setItem("imageQuality", $(this).val());
        })

        // 打印旋转角度
        var printRotateAngle = plugin.settingConfig.getSetting("printRotateAngle");
        if (printRotateAngle == undefined || printRotateAngle.length == 0) {
            printRotateAngle = 0;
        }
        $("#print-angle").val(Number(printRotateAngle));


        // 打开蓝牙配置
        $("#btn-config").click(function () {
            plugin.bluetoothConfig.start();
        });

        // 退出登录
        document.getElementById("btn-quit").addEventListener("tap", function () {
            window.location.href = "./index.html";
        })

    },
}
</script>

<style scoped>
#rangeWidth {
    width: 285px;
}
</style>
