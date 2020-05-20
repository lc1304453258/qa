<template>
    <div class="container-fluid">
        <Navbar title="物料BOM绑定">
            <div class="form-inline">
                <button type="button"
                        class="btn btn-primary btn-sm"
                        @click="clear">清空</button>
            </div>
        </Navbar>

        <h6></h6>

        <div v-if="instanceCheckResultDtos.length == 0">
            <div>
                <div class="card">
                    <div class="card-header"
                         :class="'bg-danger'">
                        序号.编号,名称,序列号
                    </div>
                    <div class="card-body">
                        <div class="">
                            <div>BOM：编号,名称(版本号)</div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <font size="2">提示信息（请扫码）</font>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="instanceCheckResultDtos"
                 v-for="(data, index) in instanceCheckResultDtos"
                 :key="index">
                <div class="card">
                    <div class="card-header"
                         :class="{'bg-danger text-white': (data.errorCode != 0), 'bg-success text-white': (data.errorCode == 0)}">
                        {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}},{{data.inventoryInstanceNo}}
                        <span class="fa fa-cog fa-pull-right update-icon"
                              @click="updateBom(data)"></span>
                    </div>
                    <div class="card-body"
                         v-if="data.errorCode == 0">
                        <div class="">
                            <div>BOM：{{data.parentInventoryNo}},{{data.parentInventoryName}}({{data.versionNo}})</div>
                        </div>
                    </div>
                    <div class="card-footer text-center"
                         v-if="data.errorCode != 0">
                        <img v-lazy="'../../static-wms-app/image/dangerous.jpg'"
                             style="height:20px;width:20px;">
                        <font size="2">{{data.errorMessage}}</font>
                    </div>
                </div>
            </div>
        </div>

        <!-- 点击出现修改bom模态框 -->
        <Modal ref="modal"
               title="修改bom"
               large="true">
            <div slot="body">
                <div>
                    <div class="form-group">
                        <label>选择BOM</label>
                        <div class="v-select-container">
                            <v-select id="bomSelect"
                                      label="bomInfo"
                                      :options="bomQueryDtos"
                                      v-model="bomQueryDto"
                                      @input="selectedBomChanged"></v-select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>物料名称</label>
                        <input type="text"
                               class="form-control"
                               v-model="inventoryName"
                               readonly="readonly">
                    </div>
                    <div class="form-group">
                        <label>物料编号</label>
                        <input type="text"
                               class="form-control"
                               v-model="inventoryNo"
                               readonly="readonly">
                    </div>
                    <div class="form-group">
                        <label>修改序列号</label>
                        <input type="text"
                               class="form-control"
                               v-model="inventoryInstanceNo">
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="bindBomBefore">保存</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="cancelModal">取消</button>
                </div>
            </div>
        </Modal>
        <!-- 点击出现强制标识模态框 -->
        <Modal ref="modal2"
               title="标识成套设备"
               large="true">
            <div slot="body">
                <p>{{_self.inventoryName}}未在系统中标识为成套设备，将进行强制标识</p>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="closeModal">确定</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var InventoryInstanceBindResource = require("../api/wms/InventoryInstanceBindResource.js");
var Notify = require("../widget/Notify.js");
var Modal = require("../widget/Modal.vue");
var ScanWidget = require("../widget/ScanWidget.vue");
var VuePicker = require("../widget/VuePicker/VuePicker.vue");
var Navbar = require("../widget/Navbar.vue");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");
var ShowBom = require("../widget/ShowBom.vue");
var InstanceBindBomResource = require("../api/wms/InstanceBindBomResource.js");
var WmsSettingResource = require("../api/commom/WmsSettingResource.js");
var vSelect = require("vue-select");
module.exports = {
    data: function () {
        return {
            epc: "",
            epcSet: [
                // {
                //     "epc": "100000000000000000000053",
                //     "status": '0',
                // }
            ],
            inventoryNo: "",
            inventoryName: "",
            inventoryInstanceNo: "",
            bomQueryDtos: [],
            bomQueryDto: {},
            instanceCheckResultDtos: [],
            tagNo: undefined,
            first: false,
        }
    },
    components: {
        Common,
        Modal,
        ScanWidget,
        Navbar,
        VuePicker,
        ShowImage,
        "v-select": vSelect.VueSelect,
        ShowBom
    },
    methods: {
        closeModal: function () {
            var _self = this;
            _self.$refs.modal2.hide();
            _self.updateInventoryClass(_self.inventoryNo);
        },
        // 标识存货为成套设备
        updateInventoryClass: function (inventoryNo) {
            var _self = this;
            InstanceBindBomResource.updateInventoryClass(inventoryNo).then(
                successData => {
                    if (successData == true) {
                        console.log("标识成套设备成功");
                        _self.bindBom();
                    }
                },
                errorData => {
                    Common.processException(errorData);
                }
            );
        },

        clear: function () {
            var _self = this;
            _self.instanceCheckResultDtos.splice(0, _self.instanceCheckResultDtos.length);
            _self.epcSet.splice(0, _self.epcSet.length);
        },

        findByEpc: function () {
            var _self = this;
            var instanceCheckDtos = [];
            _self.epcSet.forEach(function (item) {
                if (item.status == '0') {
                    var instanceCheckDto = {
                        epc: item.epc
                    };
                    instanceCheckDtos.push(instanceCheckDto);
                }
            });
            if (instanceCheckDtos.length > 0) {
                InstanceBindBomResource.findByEpc(instanceCheckDtos).then(
                    successData => {
                        // _self.bomQueryDtos = successData;
                        if (successData) {
                            successData.forEach(function (data) {
                                if (data.errorCode != 1) {
                                    _self.instanceCheckResultDtos.push(data);
                                }
                            })
                            instanceCheckDtos.forEach(function (instance) {
                                _self.epcSet.forEach(function (item) {
                                    if (item.epc == instance.epc) {
                                        item.status = '1';
                                    }
                                })
                            })
                            console.log(_self.epcSet);
                        }
                    },
                    errorData => {
                        Common.processException(XMLHttpRequest);
                    }
                );
            }
        },

        findAllBom: function (data) {
            var _self = this;
            var inventoryId = data.inventoryId;
            InstanceBindBomResource.findByInventoryId(inventoryId).then(
                successData => {
                    // console.log(successData)
                    _self.bomQueryDtos = [];
                    _self.bomQueryDtos = successData;
                    // var bomQueryDtos1 = [];
                    // _self.bomQueryDtos.forEach(function(bomQueryDto) {
                    //   //包含显示 不包含不显示 最父级也显示|| bomQueryDto.isMogami == true
                    //   if (bomQueryDto.inventoryId == data.inventoryId) {
                    //     bomQueryDtos1.push(bomQueryDto);
                    //   }
                    // });
                    // _self.bomQueryDtos = bomQueryDtos1;
                    // // console.log(_self.bomQueryDtos);

                    _self.bomQueryDtos.forEach(function (item) {
                        item.bomInfo = item.inventoryNo + "," + item.inventoryName + "(" + item.versionNo + ")";
                        if (item.bomId == data.bomId) {
                            _self.bomQueryDto = item;
                        }
                    });
                    if (data.bomId == undefined) {
                        _self.bomQueryDto = {};
                    }
                },
                errorData => {
                    Common.processException(XMLHttpRequest);
                }
            );
        },

        bindBomBefore: function () {
            var _self = this;
            $(".instanceCheckResultDtos").css({
                "overflow-x": "hidden",
                "overflow-y": "hidden"
            });
            if (_self.first == true && (_self.tagNo == undefined || _self.tagNo != '001') && _self.bomQueryDto.bomId != undefined) {
                _self.$refs.modal2.show();
            } else {
                _self.bindBom();
            }
        },
        bindBom: function () {
            var _self = this;
            var uuid = Loading.show();
            var instanceCheckDto = {};
            instanceCheckDto.epc = _self.epc;
            instanceCheckDto.bomId = _self.bomQueryDto.bomId;
            instanceCheckDto.inventoryName = _self.inventoryName;
            instanceCheckDto.inventoryInstanceNo = _self.inventoryInstanceNo;
            InstanceBindBomResource.bindBom(instanceCheckDto).then(
                successData => {
                    Loading.hide(uuid);
                    $(".instanceCheckResultDtos").css({
                        "overflow-x": "auto",
                        "overflow-y": "auto"
                    });
                    Notify.success("提示", instanceCheckDto.inventoryName + "修改成功!");
                    for (var i = 0; i <= _self.instanceCheckResultDtos.length; i++) {
                        if (_self.instanceCheckResultDtos[i].epc == successData.epc) {
                            // item = {};
                            _self.instanceCheckResultDtos[i].bomId = successData.bomId;
                            _self.instanceCheckResultDtos[i].inventoryInstanceNo = successData.inventoryInstanceNo;
                            _self.instanceCheckResultDtos[i].errorCode = successData.errorCode;
                            _self.instanceCheckResultDtos[i].parentInventoryNo = successData.parentInventoryNo;
                            _self.instanceCheckResultDtos[i].parentInventoryName = successData.parentInventoryName;
                            _self.instanceCheckResultDtos[i].versionNo = successData.versionNo;
                            _self.instanceCheckResultDtos[i].first = successData.first;
                            _self.instanceCheckResultDtos[i].tagNo = successData.tagNo;
                            console.log(successData.versionNo);
                            _self.$set(_self.instanceCheckResultDtos, i, _self.instanceCheckResultDtos[i]); //更新对象
                            _self.$set(_self.instanceCheckResultDtos[i], "versionNo", successData.versionNo); //更新值
                            if (successData.versionNo == undefined) {
                                _self.instanceCheckResultDtos[i].errorCode = 2;
                                _self.instanceCheckResultDtos[i].errorMessage = "物料实例当前未绑定任何bom";
                            }
                            return;
                        }
                    }
                },
                errorData => {
                    Common.processException(XMLHttpRequest);
                    Loading.hide(uuid);
                    $(".instanceCheckResultDtos").css({
                        "overflow-x": "auto",
                        "overflow-y": "auto"
                    });
                }
            );
            _self.epc = "";
            _self.inventoryInstanceNo = "";
            _self.inventoryName = "";
            _self.inventoryNo = "";
            _self.bomQueryDto = {};
            _self.$refs.modal.hide();
        },


        cancelModal: function () {
            var _self = this;
            _self.epc = "";
            _self.inventoryInstanceNo = "";
            _self.inventoryName = "";
            _self.inventoryNo = "";
            _self.bomQueryDto = {};
            _self.$refs.modal.hide();
        },

        selectedBomChanged: function (value) {
            var _self = this;
            if (value == null) {
                _self.bomQueryDto = {};
            }
        },

        updateBom: function (data) {
            var _self = this;
            _self.$refs.modal.show();
            _self.inventoryName = data.inventoryName;
            _self.inventoryNo = data.inventoryNo;
            _self.inventoryInstanceNo = data.inventoryInstanceNo;
            _self.epc = data.epc;
            _self.tagNo = data.tagNo;
            _self.first = data.first;

            //筛选可以显示的bom
            _self.findAllBom(data);
        },

        /**
         * 添加epc到集合中
         */
        addEpc: function (epc) {
            var _self = this;

            if (epc == null || epc.length == 0) {
                return;
            }

            if (_self.contains(epc)) {
                return;
            }

            var temp = {
                "epc": epc,
                "status": '0',
            };

            _self.epcSet.push(temp);
        },

        /**
         * 判断epc是否重复
         */
        contains: function (epc) {
            var _self = this;
            if (_self.epcSet != null && epc != null) {
                for (var i = 0; i < _self.epcSet.length; i++) {
                    if (_self.epcSet[i].epc == epc) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 获取仓库配置
         */
        getWmsSettingDto: function () {
            var _self = this;
            WmsSettingResource.unique().then(
                successData => {
                    _self.showPictureOfApp = successData.showPictureOfApp;
                },
                errorData => {
                    Common.processException(XMLHttpRequest);
                }
            );
        },

    },
    mounted: function () {
        var _self = this;
        // 定时将epc数组往后台传输一次
        _self.getWmsSettingDto();
        _self.interval = window.setInterval(function () {
            _self.findByEpc();
        }, 1000)
        plugin.rfidMiddleware.start();
        plugin.rfidMiddleware.readEvent = function (epc) {
            _self.addEpc(epc);
            return "success";
        }
    },
    beforeDestroy: function () {
        plugin.rfidMiddleware.stopInventory();
        plugin.rfidMiddleware.stop();
    },
    destroyed: function () {
        var _self = this;
        clearInterval(_self.interval);
    }
}
</script>

<style scoped>
.container-fluid {
    user-select: none;
}

.card {
    margin-top: 5px;
}

.card-header {
    padding: 0.5rem 0.5rem;
}

.card-body {
    padding: 0.5rem;
}

.card-footer {
    padding: 0.1rem;
}

.selected-tab {
    border: 1px solid #007bff;
    border-radius: 5px;
}

.image-box {
    margin-top: 5px;
    float: left;
    width: 20%;
    position: relative;
    overflow: hidden;
    /*padding-bottom: 100%;/*重要属性*/
    padding-bottom: 1000000em;
    margin-bottom: -10000000em;
}

.image-box img {
    width: 100%;
    position: relative;
}
</style>