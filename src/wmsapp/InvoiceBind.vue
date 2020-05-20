<template>
    <div class="container-fluid">
        <Navbar title="发货绑定">
            <div class="form-inline">
                <div class="dropdown">
                    <button type="button"
                            class="btn btn-primary dropdown-toggle btn-sm"
                            data-toggle="dropdown">
                        {{_self.titleMessage}}({{_self.displayStockOutLineInstanceDtos.length}})
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(0)">正常数据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(1)">异常数据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(2)">不属于此单据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(3)">未入库数据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(4)">已出库数据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(5)">全部数据</a>
                    </div>
                </div>
            </div>
        </Navbar>

        <div style="margin-top:10px">
            <div class="form-group">
                <DateTime id="loginDate"
                          dateFormat="YYYY-MM-DD HH:mm:ss"
                          class="form-control"
                          :dateValue="stockOutDate"
                          :readonly="false"
                          @on-value-change="textChanged" />
            </div>
        </div>

        <div class="form-inline"
             style="margin-top:-15px;">

            <input class="form-control"
                   type='button'
                   style="width:80%;"
                   v-model="stockOutPrepareNo"
                   @click="pickerVisible = true" />
            <button type="button"
                    style="width:18%;height:38px;margin-left:0.4em;"
                    class="btn btn-info btn-sm"
                    @click="beginScan">扫描</button>
        </div>
        <div v-if="(inventoryInstanceStockOutDtoList == undefined || inventoryInstanceStockOutDtoList.length == 0)">
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
            <div v-for="(data, index) in displayStockOutLineInstanceDtos"
                 :key="index"
                 style="display: flex;">
                <div class="card w-100">
                    <div class="card-header"
                         :class="{'bg-danger text-white': (data.errorCode > 0),'bg-info text-white':(data.errorCode == -1)}">
                        {{index+1}}.{{data.no}},{{data.name}},{{data.type}}
                        <span class="badge badge-pill badge-primary"
                              v-show="data.inventoryClassName != undefined && data.inventoryClassName != null">{{data.inventoryClassName}}</span>
                        <span :class="data.finished == true ? 'badge badge-pill badge-success':'badge badge-pill badge-info'"
                              v-show="data.finished != undefined">{{data.finished == true ? '已补齐':'未补齐'}}</span>
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
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
                                    <div class="p-2">标准数量：{{data.quantity}}</div>
                                    <div class="p-2"
                                         v-if="data.epc == undefined">
                                        实际数量：<input style="width: 4em"
                                               type="text"
                                               v-model="data.actualQuantity">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <img class="error-img"
                             v-lazy="(data.errorCode == 0) ? '../../static-wms-app/image/greentrue.jpg':'../../static-wms-app/image/dangerous.jpg'">
                        <font size="2">{{data.errorMessage}}</font>
                    </div>
                </div>
            </div>
        </div>

        <VuePicker :data="stockOutPrepares"
                   :showToolbar="true"
                   @confirm="selectStockOutPrepare"
                   :visible.sync="pickerVisible" />

        <div class="modal fade"
             id="exampleModal1"
             tabindex="-1"
             role="dialog"
             aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog"
                 role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"
                            id="exampleModalLabel">删除提示</h5>
                        <button type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        确定要删除页面数据吗，删除后需要重新扫描
                    </div>
                    <div class="modal-footer">
                        <button type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal">取消</button>
                        <button type="button"
                                class="btn btn-primary"
                                @click="clearData()">确认</button>
                    </div>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-expand-sm navbar-dark fixed-bottom">
            <button class="btn btn-dark btn-sm"
                    type="button"
                    id="btn-danger"
                    data-toggle="modal"
                    data-target="#exampleModal1">清空</button>
            <button type="button"
                    id="btn-success"
                    class="btn btn-info btn-sm"
                    data-toggle="modal"
                    @click="submitBefore()">确认</button>
        </nav>

        <Modal ref="modal"
               title="填写信息"
               large="true">
            <div slot="body">
                <div>
                    <div class="form-group">
                        <label>本次操作只有散件，没有散件箱，如果需要发货，请填写散件临时存放的物品名称</label>
                        <input type="text"
                               class="form-control"
                               v-model="description">
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="save()">保存</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var Notify = require("../widget/Notify.js");
var StockOutPrepareResource = require("../api/wms/StockOutPrepareResource.js");
var InvoiceBindResource = require("../api/wms/InvoiceBindResource.js");
var Modal = require("../widget/Modal.vue");
var ScanWidget = require("../widget/ScanWidget.vue");
var Navbar = require("../widget/Navbar.vue");
var DateTime = require("../widget/DateTime.vue");
var VuePicker = require("../widget/VuePicker/VuePicker.vue");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");
var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

module.exports = {
    data: function () {
        return {
            titleMessage: '全部数据',
            isRequire: false,
            clickCount: 0,
            showEpc: false,
            stockOutPrepareId: undefined,
            stockOutPrepareNo: '选择领用单',
            stockOutDate: undefined,
            stockOutPrepares: [
                []
            ],
            pickerVisible: false, // pick 是否显示
            boxId: undefined,
            boxNumber: 0,
            boxIds: [],
            inventoryInstanceStockOutDtoList: [],
            displayStockOutLineInstanceDtos: [],
            watchDataErrorCode: undefined,
            showPictureOfApp: false,
            barCode: undefined,
            description: null,
        }
    },
    components: {
        DateTime,
        Modal,
        ScanWidget,
        Navbar,
        VuePicker,
        ShowImage,
    },
    methods: {
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
                'epc': null,
                'barCode': barCode,
                'no': '查询中',
                'name': '查询中',
                'type': '查询中',
                'inventoryId': null,
                'inventoryClassName': null,
                'finished': null,
                'errorCode': null,
                'errorMessage': null,
                'status': '0',
                'quantity': 0,//标准数量
                'actualQuantity': 0,
                'component': null,
                'id': null,
                'inventoryClassNo': null,
            };

            _self.inventoryInstanceStockOutDtoList.push(temp);
        },

        /**
         * 判断barCode是否重复
         */
        containBarCode: function (barCode) {
            var _self = this;
            if (_self.inventoryInstanceStockOutDtoList != null && barCode != null) {
                for (var i = 0; i < _self.inventoryInstanceStockOutDtoList.length; i++) {
                    if (_self.inventoryInstanceStockOutDtoList[i].barCode == barCode) {
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
        initEvent: function () {
            var _self = this;
            plugin.barCode.scanEvent = function (barCodeStrs) {
                if (barCodeStrs != undefined && barCodeStrs.length > 0) {
                    var barCodes = barCodeStrs.split(",");
                    _self.barCode = barCodes[0];
                    if (_self.barCode.indexOf('SOP') >= 0) {
                        _self.findByDocumentNo();
                    } else {
                        _self.addBarCode(_self.barCode);
                    }
                }
            }
        },
        /**
         * 根据单据号查询领料单
         */
        findByDocumentNo: function () {
            var _self = this;
            _self.barCode = _self.barCode.trim();
            _self.barCode = _self.barCode.slice(3, _self.barCode.length);
            StockOutPrepareResource.findByDocumentNo(_self.barCode, 1).then(successData => {
                if (successData) {
                    var temp = {
                        value: successData.stockOutPrepareId,
                        label: successData.documentNo + "," + successData.projectItemName + "," + successData.pickUser,
                    }
                    _self.stockOutPrepareId = temp.value;
                    _self.stockOutPrepareNo = temp.label;
                } else {
                    Notify.error('提示', '领料单号为' + _self.barCode + '的单据不存在或已发货完毕', true);
                }
            }, errorData => {
                Common.processException(errorData);
            });
        },
        /**
         * 安卓端扫码成功后调用此函数
         */
        scanResult: function (event) {
            var _self = this;
            _self.barCode = event.detail.barCode;
        },
        /**
         * 点击扫码按钮开始扫描
         */
        beginScan: function () {
            if (typeof (ZXING_SCANNER) == "undefined") {
                Notify.error('错误', '设备不支持扫描功能', true);
            } else {
                plugin.barCode.scan(false);
            }
        },
        /**
         * 选择查看其他类型的数据
         */
        changeWatchData: function (type) {
            var _self = this;
            _self.displayStockOutLineInstanceDtos.splice(0, _self.displayStockOutLineInstanceDtos.length);
            _self.watchDataErrorCode = type;

            _self.inventoryInstanceStockOutDtoList.forEach(function (data) {
                if (data.component == true) {
                    return;
                }
                if (type == 0) {
                    _self.titleMessage = '正常数据';
                    if (data.errorCode == 0) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 1) {
                    _self.titleMessage = '异常数据';
                    if (data.errorCode == 1) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 2) {
                    _self.titleMessage = '不属于此单据';
                    if (data.errorCode == -1) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 3) {
                    _self.titleMessage = '未入库数据';
                    if (data.errorCode == 5) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 4) {
                    _self.titleMessage = '已出库数据';
                    if (data.errorCode == 6) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 5) {
                    _self.titleMessage = '全部数据';
                    if (data.errorCode != null) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
            })
            _self.displayStockOutLineInstanceDtos.sort(function (a, b) {
                var aNo = parseInt(a.inventoryClassNo);
                var bNo = parseInt(a.inventoryClassNo);
                if (aNo != undefined && aNo >= 1) {
                    return -1;
                } else {
                    return 1;
                }
            })
        },

        /**
         * 日期选择改变事件
         * @param  {Date} value 
         * @return {void} 
         */
        textChanged: function (value) {
            this.stockOutDate = value;
        },

        // 选择领用单,显示领用单的物料信息
        selectStockOutPrepare: function (selectedStockOutPrepares) {
            var _self = this;
            if (selectedStockOutPrepares != undefined && selectedStockOutPrepares.length > 0) {
                _self.stockOutPrepareId = selectedStockOutPrepares[0].value;
                _self.stockOutPrepareNo = selectedStockOutPrepares[0].label;
            }
        },

        // 查询所有领料单
        queryAllStockOutPrepare: function () {
            var _self = this;
            StockOutPrepareResource.findNoComplete().then(successData => {
                if (successData) {
                    successData.forEach(function (item) {
                        var temp = {
                            value: item.stockOutPrepareId,
                            label: item.documentNo + "," + item.projectItemName + "," + item.pickUser,
                        }
                        _self.stockOutPrepares[0].push(temp);
                    });
                    _self.stockOutPrepares[0].sort(function (a, b) {
                        var aNo = parseInt(a.documentNo);
                        var bNo = parseInt(b.documentNo);
                        if (aNo > bNo) {
                            return 1;
                        } else {
                            return -1;
                        }
                    })
                }
            }, errorData => {
                Common.processException(errorData);
            });
        },
        /**
         * 删除索引为index的存货
         */
        deleteOne: function (index) {
            var _self = this;
            var inventoryId = this.displayStockOutLineInstanceDtos[index].inventoryId;
            var epc = this.displayStockOutLineInstanceDtos[index].epc;
            var quantity = this.displayStockOutLineInstanceDtos[index].quantity;
            // 删除所有工具内的数据
            this.displayStockOutLineInstanceDtos.splice(index, 1);
            for (var i = 0; i < this.inventoryInstanceStockOutDtoList.length; i++) {
                var inventoryInstanceStockOutDto = this.inventoryInstanceStockOutDtoList[i];
                if (inventoryInstanceStockOutDto.epc == epc) {
                    if (inventoryInstanceStockOutDto.inventoryClassNo == '001' || inventoryInstanceStockOutDto.inventoryClassNo == '002') {
                        _self.boxNumber--;
                    }
                    this.inventoryInstanceStockOutDtoList.splice(i, 1);
                }
            }
        },

        // 清空页面数据
        clearData: function () {
            var _self = this;
            _self.inventoryInstanceStockOutDtoList.splice(0, _self.inventoryInstanceStockOutDtoList.length);
            _self.displayStockOutLineInstanceDtos.splice(0, _self.displayStockOutLineInstanceDtos.length);
            _self.boxNumber = 0;
            $('#exampleModal1').modal('hide');
        },
        // 发货绑定检查检查
        stockOutCheck: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                if (item.status == "0") {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            if (updateIventoryInstanceDtos.length > 0 && _self.isRequire == false && _self.stockOutPrepareId != undefined) {
                _self.isRequire = true;
                InvoiceBindResource.invoiceBindCheck(updateIventoryInstanceDtos, _self.stockOutPrepareId).then(successData => {
                    _self.isRequire = false;
                    if (successData) {
                        var number = 0;
                        successData.forEach(function (item) {
                            if (item.inventoryClassNo == '001' || item.inventoryClassNo == '002') {
                                number++;
                            }
                        })
                        if (number > 0) {
                            _self.boxNumber = _self.boxNumber + number;
                            if (_self.boxNumber > 1) {
                                Notify.error('提示', '扫描到了' + _self.boxNumber + '个箱子', false);
                            }
                        }
                        // 处理后更新epc状态
                        _self.updateEpcStatus(successData, true);
                    }
                }, errorData => {
                    _self.isRequire = false;
                    Common.processException(errorData);
                });
            }
        },
        // 修改EPC状态
        updateEpcStatus: function (data, isCheck) {
            var _self = this;
            data.forEach(function (newData) {
                let count = _self.inventoryInstanceStockOutDtoList.length;
                for (var index = 0; index < count; index++) {
                    let existInventoryInstanceStockInDto = _self.inventoryInstanceStockOutDtoList[index];
                    if (existInventoryInstanceStockInDto.epc == newData.epc) {
                        if (isCheck == true) {
                            if (newData.errorCode != 1) {
                                existInventoryInstanceStockInDto.actualQuantity = newData.quantity;
                                existInventoryInstanceStockInDto.id = newData.id;
                                existInventoryInstanceStockInDto.inventoryId = newData.inventoryId;
                                existInventoryInstanceStockInDto.name = newData.name;
                                existInventoryInstanceStockInDto.no = newData.no;
                                existInventoryInstanceStockInDto.imageName = newData.imageName;
                                existInventoryInstanceStockInDto.className = newData.className;
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                                existInventoryInstanceStockInDto.type = newData.type;
                                existInventoryInstanceStockInDto.inventoryClassNo = newData.inventoryClassNo;
                                existInventoryInstanceStockInDto.inventoryClassName = newData.inventoryClassName;
                                existInventoryInstanceStockInDto.finished = newData.finished;
                                existInventoryInstanceStockInDto.component = newData.component;
                                if (newData.errorCode == -1) {
                                    _self.$set(existInventoryInstanceStockInDto, 'errorStatus1', 0);
                                }
                            } else {
                                existInventoryInstanceStockInDto.name = '物料';
                                existInventoryInstanceStockInDto.no = '异常';
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                                existInventoryInstanceStockInDto.component = newData.component;
                            }
                        }
                        existInventoryInstanceStockInDto.errorCode = newData.errorCode;
                        existInventoryInstanceStockInDto.errorMessage = newData.errorMessage;
                        existInventoryInstanceStockInDto.status = "1";
                    }
                }
            });
            if (_self.watchDataErrorCode != undefined) {
                _self.changeWatchData(_self.watchDataErrorCode);
            } else {
                _self.changeWatchData(5);
            }
        },
        // 扫描出库
        scanRack: function (uploadData) {
            var _self = this;
            if (uploadData != null && uploadData.length > 0) {
                var uuid = Loading.show();
                var currentDate = _self.stockOutDate;
                InvoiceBindResource.invoiceBind(uploadData, currentDate, _self.stockOutPrepareId, _self.description).then(successData => {
                    Loading.hide(uuid);
                    _self.$refs.modal.hide();
                    if (successData) {
                        var trueLength = 0; // 成功的数量
                        var falseLength = 0; // 失败的数量
                        var otherStockInIdArray = [];
                        var purchaseStockInIdArray = [];
                        for (var k = 0; k < successData.length; k++) {
                            if (successData[k].component == true) {
                                continue;
                            }
                            if (successData[k].errorCode > 0) {
                                falseLength++;
                            } else {
                                trueLength++;
                            }
                            _self.updateEpcStatus(successData, false);
                        }
                        Notify.success('提示', '保存完成，本次绑定成功的工具共' + trueLength + '个' + '，绑定失败的工具共' + falseLength + '个');
                    }
                }, errorData => {
                    Loading.hide(uuid);
                    Common.processException(errorData);
                });
            }
        },
        // 提交之前检查数据
        submitBefore: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            if (_self.stockOutPrepareId == null) {
                Notify.error('提示', '请选择一个领料单', false);
                return;
            } else {
                if (_self.displayStockOutLineInstanceDtos.length <= 0 || _self.displayStockOutLineInstanceDtos.length <= 0) {
                    Notify.error('提示', '没有物料数据可以提交', false);
                    return;
                } else {
                    var onlyPart = true;
                    _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                        if (item.actualQuantity == undefined || item.actualQuantity.length == 0) {
                            item.actualQuantity = 0;
                        }
                        if (item.status == '1') {
                            updateIventoryInstanceDtos.push(item);
                        }
                        if (item.errorCode == 4) {
                            return;
                        }
                        if (item.inventoryClassNo == '001' || item.inventoryClassNo == '002') {
                            onlyPart = false;
                        }
                    })
                    if (onlyPart == true) {
                        _self.$refs.modal.show();
                    } else {
                        _self.scanRack(updateIventoryInstanceDtos);
                    }
                }
            }
        },
        save: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            if (_self.description == undefined || _self.description == "") {
                Notify.error('提示', '请填写信息', false);
                return;
            }
            _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                if (item.status == '1') {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            _self.scanRack(updateIventoryInstanceDtos);
        },

        /**
         * 添加epc到集合中
         */
        addEpc: function (epc) {
            var _self = this;
            if (_self.contains(epc)) {
                return;
            }
            var temp = {
                'epc': epc,
                'barCode': null,
                'no': '查询中',
                'name': '查询中',
                'type': '查询中',
                'inventoryId': null,
                'inventoryClassName': null,
                'finished': null,
                'errorCode': null,
                'errorMessage': null,
                'status': '0',
                'quantity': 0,//标准数量
                'actualQuantity': 0,
                'component': null,
                'id': null,
                'inventoryClassNo': null,
            };
            _self.inventoryInstanceStockOutDtoList.push(temp);
        },
        /**
         * 判断epc是否重复
         */
        contains: function (epc) {
            var _self = this;
            if (_self.inventoryInstanceStockOutDtoList && epc) {
                for (var i = 0; i < _self.inventoryInstanceStockOutDtoList.length; i++) {
                    if (_self.inventoryInstanceStockOutDtoList[i].epc == epc) {
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
        _self.queryAllStockOutPrepare();
        _self.getWmsSettingDto();
        _self.interval = window.setInterval(function () {
            _self.stockOutCheck();
        }, 1000);
        _self.stockOutDate = moment().format('YYYY-MM-DD HH:mm:ss');
        plugin.rfidMiddleware.start();
        plugin.rfidMiddleware.readEvent = function (epc) {
            _self.addEpc(epc);
            return "success";
        }
        window.addEventListener("sendScanData", _self.scanResult);
        _self.initEvent();
    },
    beforeDestroy: function () {
        var _self = this;
        plugin.rfidMiddleware.stopInventory();
        plugin.rfidMiddleware.stop();
        window.removeEventListener("sendScanData", _self.scanResult);
    },
    destroyed() {
        var _self = this;
        clearInterval(_self.interval);
    }
}
</script>

<style scoped>
.container-fluid {
    margin-bottom: 45px;
}

.card {
    margin-top: 5px;
    width: 100%;
}

.card-header {
    padding: 0.3rem 0.3rem;
}

.card-body {
    padding: 0.1rem;
    font-size: 0.8em;
}

.card-footer {
    padding: 0.1rem;
}

.selected-tab {
    border: 1px solid #007bff;
    border-radius: 5px;
    height: 41px;
}

#btn-success {
    width: 160px;
}

#btn-danger {
    width: 160px;
}

.dropdown-toggle {
    width: 150px;
}

.card-body row col-3 {
    padding-left: 10px;
    padding-right: 0px;
}

.error-img {
    height: 20px;
    width: 20px;
}
</style>