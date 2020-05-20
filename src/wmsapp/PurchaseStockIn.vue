<template>
    <div class="container-fluid">
        <Navbar title="采购入库">
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle"
                   href="javaScript:void(0)"
                   id="navbarDropdown"
                   role="button"
                   data-toggle="dropdown"
                   aria-haspopup="true"
                   aria-expanded="false">
                    {{_self.titleMessage}}({{_self.displayStockInLineInstanceDtos.length}})
                </a>

                <div class="dropdown-menu">
                    <a class="dropdown-item"
                       href="javascript:void(0);"
                       @click="changeWatchData(0)">正常数据</a>
                    <a class="dropdown-item"
                       href="javascript:void(0);"
                       @click="changeWatchData(1)">异常数据</a>
                    <a class="dropdown-item"
                       href="javascript:void(0);"
                       @click="changeWatchData(2)">已入库数据</a>
                    <a class="dropdown-item"
                       href="javascript:void(0);"
                       @click="changeWatchData(3)">全部数据</a>
                </div>
            </div>
        </Navbar>

        <div style="margin-top: 0.5em">
            <div class="form-group"
                 style="margin-bottom: 0.5em">
                <label class="sr-only"
                       for="positionPicker">选择货位</label>

                <VuePicker :data="positionDtos"
                           :showToolbar="true"
                           @confirm="selectPosition($event)"
                           :visible.sync="pickerVisible" />

                <input @click="pickerVisible = true; selectedInventoryInstanceStockInDto = null;"
                       id='positionPicker'
                       class="form-control"
                       type='button'
                       v-model="selectedPositionBarCode" />
            </div>
        </div>

        <div v-if="(inventoryInstanceStockInDtoList == undefined || inventoryInstanceStockInDtoList.length == 0)">
            <div class="card w-100">
                <div class="card-header">序号.存货编号,存货名称,规格型号</div>
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div class="p-2">放置货位</div>
                        <div class="p-2">校验信息</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else
             style="margin-bottom:2.5em;">
            <div v-for="(data, index) in displayStockInLineInstanceDtos"
                 :key="index"
                 style="display: flex;">
                <div class="card w-100">
                    <div class="card-header"
                         :class="{'bg-danger text-white': (data.errorCode != 0 && data.errorCode != -1), 'bg-success text-white': (data.errorCode == 0),'bg-info text-white':(data.errorCode == -1)}">
                        {{index+1}}.{{data.no}},{{data.name}},{{data.type}}
                        <span class="badge badge-pill badge-primary">{{data.id != undefined && data.barCode != undefined?'二维码物料':(data.id != undefined && data.epc != undefined?'RFID物料':'')}}</span>
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="remove(data)"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPictureOfApp == true">
                                <ShowImage :imageNames="data.imageName"
                                           :className="data.className"></ShowImage>
                            </div>
                            <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">
                                        标准数量：{{data.quantity}}
                                    </div>
                                    <div class="p-2"
                                         v-if="data.epc == undefined">
                                        实际数量：<input style="width: 4em"
                                               type="text"
                                               v-model="data.actualQuantity">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                选择货位：<a href="javascript:void(0)"
                                   @click="pickerVisible = true; selectedInventoryInstanceStockInDto = data;"
                                   class="card-link">{{data.positionBarCode == undefined ? '选择货位' : data.positionBarCode}}</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        {{data.errorCode == 0 ? (data.errorMessage+(data.stockInNo == undefined ? '':',手工单号:'+data.stockInNo)):data.errorMessage}}
                    </div>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-expand-sm navbar-dark fixed-bottom">
            <button class="btn btn-info btn-sm"
                    type="button"
                    id="btn-danger"
                    @click="openModal">入库</button>
            <button type="button"
                    id="btn-success"
                    class="btn btn-dark btn-sm"
                    @click="clear">清空</button>
        </nav>
        <Modal ref="modal"
               title="填写手工单号"
               large="true">
            <div slot="body">
                <div>
                    <div class="form-group">
                        <label>手工单号</label>
                        <input type="text"
                               class="form-control"
                               v-model="tagNo">
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="save">保存</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
var vSelect = require("vue-select");
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var Notify = require("../widget/Notify.js");
var StockInResource = require("../api/wms/StockInResource.js");
var PositionResource = require("../api/wms/PositionResource.js");
var VuePicker = require("../widget/VuePicker/VuePicker.vue");

var Modal = require("../widget/Modal.vue");
var Navbar = require("../widget/Navbar.vue");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");
var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

module.exports = {
    components: {
        VuePicker,
        "v-select": vSelect.VueSelect,
        Modal,
        Navbar,
        ShowImage,
    },

    data: function () {
        return {
            titleMessage: '全部数据',
            watchDataErrorCode: 3, //数据类型
            inventoryInstanceStockInDtoList: [],
            selectedPositionId: null,
            selectedPositionBarCode: '选择货位',
            selectedInventoryInstanceStockInDto: null,
            position: {},
            purchaseStockInCheckRunning: false,
            pickerVisible: false,
            positionDtos: [
                []
            ],
            showPictureOfApp: false,
            displayStockInLineInstanceDtos: [],
            barCode: null,
            tagNo: undefined,
        }
    },

    methods: {

        initEvent: function () {
            var _self = this;
            plugin.barCode.scanEvent = function (barCodeStrs) {
                if (barCodeStrs != undefined && barCodeStrs.length > 0) {
                    var barCodes = barCodeStrs.split(",");
                    _self.barCode = barCodes[0];
                    _self.addBarCode(_self.barCode);
                }
            }
        },
        /**
         * 添加barCode到集合中
         */
        addBarCode: function (barCode) {
            var _self = this;

            if (barCode == null || barCode.length == 0) {
                return;
            }

            if (_self.containBarCode(barCode)) {
                return;
            }

            var temp = {
                "epc": null,
                "barCode": barCode,
                "positionId": null,
                "id": null,
                "name": "查询中",
                "no": "查询中",
                "type": "查询中",
                "positionBarCode": null,
                "errorCode": null,
                "errorMessage": null,
                "quantity": 0,//标准数量
                "actualQuantity": 0,
                "stockInNo": null,
            };

            _self.inventoryInstanceStockInDtoList.push(temp);
        },

        /**
         * 判断barCode是否重复
         */
        containBarCode: function (barCode) {
            var _self = this;
            if (_self.inventoryInstanceStockInDtoList != null && barCode != null) {
                for (var i = 0; i < _self.inventoryInstanceStockInDtoList.length; i++) {
                    if (_self.inventoryInstanceStockInDtoList[i].barCode == barCode) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 安卓端扫码成功后调用此函数
         */
        scanResult: function (event) {
            var _self = this;
            _self.barCode = event.detail.barCode;
        },
        /**
         * 选择查看其他类型的数据
         */
        changeWatchData: function (type) {
            var _self = this;
            _self.displayStockInLineInstanceDtos.splice(0, _self.displayStockInLineInstanceDtos.length);
            _self.watchDataErrorCode = type;
            if (type == 0) {
                _self.titleMessage = '正常数据';
            }
            if (type == 1) {
                _self.titleMessage = '异常数据';
            }
            if (type == 2) {
                _self.titleMessage = '已入库数据';
            }
            if (type == 3) {
                _self.titleMessage = '全部数据';
            }
            _self.inventoryInstanceStockInDtoList.forEach(function (data) {
                if (type == 0) {
                    _self.titleMessage = '正常数据';
                    if (data.errorCode == 0) {
                        _self.displayStockInLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 1) {
                    _self.titleMessage = '异常数据';
                    if (data.errorCode > 0) {
                        _self.displayStockInLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 2) {
                    _self.titleMessage = '已入库数据';
                    if (data.errorCode == -1) {
                        _self.displayStockInLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 3) {
                    _self.titleMessage = '全部数据';
                    if (data.errorCode != null) {
                        _self.displayStockInLineInstanceDtos.push(data);
                    }
                    return;
                }
            })
        },

        /**
         * 导入测试数据
         */
        addTest: function () {
            // for (var i = 0; i < 100; i++) {
            //     this.addEpc(i + "");
            // }
            this.addEpc("100000000000000000000089");
        },

        /**
         * 初始化货位控件
         */
        initPositionWidget: function () {
            var _self = this;
            PositionResource.queryPositions().then(
                successData => {
                    if (successData) {
                        successData.forEach(function (item) {
                            var positionDto = {
                                value: item.positionId,
                                label: item.positionBarCode,
                            };
                            _self.positionDtos[0].push(positionDto);
                        });
                    }
                },
                errorData => {
                    Common.processException(errorData);
                }
            );
        },

        /**
         * 选择了货位
         */
        selectPosition: function (selectedProjectItems) {
            var _self = this;

            if (_self.selectedInventoryInstanceStockInDto == null) {
                if (selectedProjectItems != null && selectedProjectItems.length > 0) {
                    _self.selectedPositionId = selectedProjectItems[0].value;
                    _self.selectedPositionBarCode = selectedProjectItems[0].label;
                } else {
                    _self.selectedPositionId = null;
                    _self.selectedPositionBarCode = null;
                }
            } else {

                if (selectedProjectItems != null && selectedProjectItems.length > 0) {
                    _self.selectedInventoryInstanceStockInDto.positionId = selectedProjectItems[0].value;
                    _self.selectedInventoryInstanceStockInDto.positionBarCode = selectedProjectItems[0].label;
                } else {
                    _self.selectedInventoryInstanceStockInDto.positionId = null;
                    _self.selectedInventoryInstanceStockInDto.positionBarCode = null;
                }
            }
        },

        /**
         * 清空列表
         */
        clear: function () {
            var _self = this;
            _self.inventoryInstanceStockInDtoList.splice(0, _self.inventoryInstanceStockInDtoList.length);
            _self.displayStockInLineInstanceDtos.splice(0, _self.displayStockInLineInstanceDtos.length);
            _self.purchaseStockInCheckRunning = false;
            _self.selectedPositionId = null;
            _self.selectedPositionBarCode = '选择货位';
        },

        /**
         * 删除存货
         */
        remove: function (inventoryInstanceStockInDto) {
            let index = this.displayStockInLineInstanceDtos.indexOf(inventoryInstanceStockInDto);
            if (index >= 0) {
                this.displayStockInLineInstanceDtos.splice(index, 1);
            }
            var epc = inventoryInstanceStockInDto.epc;
            for (var i = 0; i < this.inventoryInstanceStockInDtoList.length; i++) {
                var inventoryInstanceStockInDto = this.inventoryInstanceStockInDtoList[i];
                if (inventoryInstanceStockInDto.epc == epc) {
                    this.inventoryInstanceStockInDtoList.splice(i, 1);
                }
            }
        },


        /**
         * 采购入库检查
         */
        purchaseStockInCheck: function () {
            var _self = this;

            // 如果上次查询没有完成，本次查询忽略
            if (_self.purchaseStockInCheckRunning == true) {
                return;
            }
            var epcs = [];

            _self.inventoryInstanceStockInDtoList.forEach(function (item) {
                if (item.errorCode == null) {
                    epcs.push({
                        "epc": item.epc,
                        "barCode": item.barCode,
                        "actualQuantity": item.actualQuantity,
                    });
                }
            });

            if (epcs.length > 0) {
                _self.purchaseStockInCheckRunning = true;

                StockInResource.purchaseStockInCheck(epcs).then(
                    successData => {
                        _self.purchaseStockInCheckRunning = false;
                        _self.updateInventoryInstanceStockInDtoList(true, successData);
                    },
                    errorData => {
                        _self.purchaseStockInCheckRunning = false;
                        Common.processException(errorData);
                    }
                );
            }
        },
        openModal: function () {
            var _self = this;
            _self.$refs.modal.show();
        },

        /**
         * 入库保存
         */
        save: function () {
            var _self = this;
            if (_self.tagNo == undefined || _self.tagNo == null) {
                Notify.error('错误', '请填写手工单号', false);
                return;
            }
            if (this.inventoryInstanceStockInDtoList.length == 0) {
                Notify.error("错误", "无数据可保存。", false);
                return;
            }
            this.inventoryInstanceStockInDtoList.forEach(function (item) {
                if (item.actualQuantity == undefined || item.actualQuantity.length == 0) {
                    item.actualQuantity = 0;
                }
                if (item.positionId == null || item.positionId == undefined) {
                    item.positionId = _self.selectedPositionId;
                }
            })
            var uuid = Loading.show();
            StockInResource.purchaseStockIn(_self.inventoryInstanceStockInDtoList, _self.tagNo).then(
                successData => {
                    Loading.hide(uuid);
                    _self.$refs.modal.hide();
                    _self.updateInventoryInstanceStockInDtoList(false, successData);

                    let successCount = 0;
                    let repeatCount = 0;
                    let errorCount = 0;

                    let count = successData.length;

                    for (var i = 0; i < count; i++) {
                        if (successData[i].errorCode < 0) {
                            repeatCount++;
                        } else if (successData[i].errorCode == 0) {
                            successCount++;
                        } else {
                            errorCount++;
                        }
                    }

                    Notify.success("成功", successCount + "条数据采购入库成功，" + repeatCount + "条数据重复采购入库（已忽略），" + errorCount + "条数据采购入库失败(请人工在界面上检查)。", false);
                },
                errorData => {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest)
                }
            );
        },

        /**
         * 更新界面的入库数据集合
         */
        updateInventoryInstanceStockInDtoList: function (isCheck, newDatas) {
            var _self = this;
            if (newDatas != null) {
                newDatas.forEach(function (newData) {
                    let count = _self.inventoryInstanceStockInDtoList.length;
                    for (var index = 0; index < count; index++) {
                        let existInventoryInstanceStockInDto = _self.inventoryInstanceStockInDtoList[index];
                        if ((newData.epc != null && existInventoryInstanceStockInDto.epc == newData.epc) || (newData.barCode != null && existInventoryInstanceStockInDto.barCode != null && existInventoryInstanceStockInDto.barCode == newData.barCode)) {
                            existInventoryInstanceStockInDto.positionId = newData.positionId;
                            existInventoryInstanceStockInDto.errorCode = newData.errorCode;
                            existInventoryInstanceStockInDto.errorMessage = newData.errorMessage;
                            existInventoryInstanceStockInDto.imageName = newData.imageName;
                            existInventoryInstanceStockInDto.className = newData.className;
                            existInventoryInstanceStockInDto.stockInNo = newData.manualDocumentNo;
                            if (isCheck == true) {
                                existInventoryInstanceStockInDto.actualQuantity = newData.quantity;
                                existInventoryInstanceStockInDto.id = newData.id;
                                existInventoryInstanceStockInDto.name = newData.name;
                                existInventoryInstanceStockInDto.no = newData.no;
                                existInventoryInstanceStockInDto.type = newData.type;
                                existInventoryInstanceStockInDto.positionBarCode = newData.positionBarCode;
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                            }
                        }
                    }
                });
                if (_self.watchDataErrorCode != undefined) {
                    _self.changeWatchData(_self.watchDataErrorCode);
                } else {
                    _self.changeWatchData(3);
                }
            }
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
                "barCode": null,
                "positionId": null,
                "id": null,
                "name": "查询中",
                "no": "查询中",
                "type": "查询中",
                "positionBarCode": null,
                "errorCode": null,
                "errorMessage": null,
                "quantity": 0,//标准数量
                "actualQuantity": 0,
                "stockInNo": null,
            };

            _self.inventoryInstanceStockInDtoList.push(temp);
        },

        /**
         * 判断epc是否重复
         */
        contains: function (epc) {
            var _self = this;
            if (_self.inventoryInstanceStockInDtoList != null && epc != null) {
                for (var i = 0; i < _self.inventoryInstanceStockInDtoList.length; i++) {
                    if (_self.inventoryInstanceStockInDtoList[i].epc == epc) {
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
        _self.getWmsSettingDto();
        _self.interval = window.setInterval(function () {
            _self.purchaseStockInCheck();
        }, 1000);


        _self.initPositionWidget();

        window.addEventListener("sendScanData", _self.scanResult);
        _self.initEvent();

        plugin.rfidMiddleware.start();
        plugin.rfidMiddleware.readEvent = function (epc) {
            _self.addEpc(epc);
            return "success";
        }
    },

    beforeDestroy: function () {
        var _self = this;

        if (_self.interval != null) {
            window.clearInterval(_self.interval);
            _self.interval = null;
        }

        window.removeEventListener("sendScanData", _self.scanResult);
        plugin.rfidMiddleware.stopInventory();
        plugin.rfidMiddleware.stop();
    },

}
</script>

<style scoped>
.card {
    margin-top: 5px;
    float: right;
    width: 100%;
}

.card-header {
    padding: 0.2rem 0.2rem;
}

.card-body {
    font-size: 0.8em;
    padding: 0.15rem;
}

.card-footer {
    font-size: 0.8em;
    padding: 0.1rem;
}

#btn-success {
    width: 160px;
}

#btn-danger {
    width: 160px;
}

.card-body row col-3 {
    padding-left: 10px;
    padding-right: 0px;
}
</style>