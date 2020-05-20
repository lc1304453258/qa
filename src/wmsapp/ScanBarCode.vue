<template>
    <div class="container-fluid">
        <Navbar title="扫码出库">
            <div class="form-inline">
                <div class="dropdown">
                    <button type="button"
                            class="btn btn-primary dropdown-toggle btn-sm"
                            data-toggle="dropdown">
                        {{_self.titleMessage}}
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
                   v-model="stockOutPrepareNo"
                   @click="pickerVisible = true" />
        </div>

        <div style="margin-top:5px;">
            <ul class="nav nav-pills nav-fill selected-tab">
                <li class="nav-item"
                    @click="selectTab('artificial')">
                    <a class="nav-link"
                       id="nav-link1"
                       :class="{'active': (selectedTab === 'artificial')}"
                       href="javascript:void(0)">物料信息({{inventoryStockOutDtoList.length}})</a>
                </li>
                <li class="nav-item"
                    @click="selectTab('rfid')">
                    <a class="nav-link"
                       id="nav-link2"
                       :class="{'active': (selectedTab === 'rfid')}"
                       href="javascript:void(0)">序列号信息({{displayStockOutLineInstanceDtos.length}})</a>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab == 'artificial'">
            <div v-for="(data, index) in inventoryStockOutDtoList"
                 :key="index">
                <div class="card">
                    <div class="card-header"
                         :class="{'bg-success text-white': (data.needQuantity != null && data.needQuantity <= data.scanQuantity), 'bg-danger text-white': (data.needQuantity != null && data.needQuantity > data.scanQuantity)}">
                        {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPictureOfApp == true">
                                <ShowImage :imageNames="data.imageName"
                                           :className="data.className"></ShowImage>
                            </div>
                            <div class="{'col': (showPictureOfApp == true ? '12' : '9')}">
                                <div class="d-flex justify-content-between">
                                    <div class="p-2"
                                         v-if="data.needQuantity != null">需求数量：{{data.needQuantity}}</div>
                                    <div class="p-2">扫描数量：{{data.scanQuantity}}</div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">货位分布：{{(data.position != undefined && data.position.length > 0) ? data.position.join(',') : ''}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer"
                         v-if="(data.errorCode != null && data.errorCode != 0)">
                        <img src="../../static-wms-app/image/dangerous.jpg"
                             width="20px"
                             height="20px">
                        <font size="2">{{data.errorMessage}}</font>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="selectedTab == 'rfid'">
            <div v-for="(data, index) in displayStockOutLineInstanceDtos"
                 :key="index">
                <div class="card">
                    <div class="card-header">
                        {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}
                        <span class="badge badge-pill badge-warning">{{data.inventoryId != undefined && data.barCode != undefined?'二维码物料':(data.inventoryId != undefined && data.epc != undefined?'RFID物料':'')}}</span>
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"
                                style="margin-right:10px;"><span aria-hidden="true">&times;</span></button>

                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between"
                             v-if="showEpc == true">
                            <div class="p-2">序列号：{{data.epc}}</div>
                        </div>
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPictureOfApp == true">
                                <ShowImage :imageNames="data.imageName"
                                           :className="data.className"></ShowImage>
                            </div>
                            <div class="{'col': (showPictureOfApp == true ? '12' : '9')}">
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">标准数量：{{data.quantity}}</div>
                                    <div class="p-2"
                                         v-if="data.epc == undefined">
                                        实际数量：<input style="width: 4em"
                                               type="number"
                                               v-model="data.actualQuantity"
                                               @input="compluteQuantity(data)">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="p-2">货位信息：{{data.positionBarCode}}</div>
                            <div class="p-2"
                                 v-if="data.errorCode <= -3">状态：<select class="selectpicker"
                                        v-model="data.errorStatus1">
                                    <option value="0">强制出库</option>
                                    <option value="1">删除</option>
                                </select></div>
                            <div class="p-2"
                                 v-if="data.errorCode <0 && data.errorCode > -3">状态：
                                <select class="selectpicker"
                                        v-model="data.errorStatus2">
                                    <option value="1">删除</option>
                                    <option value="2">补单</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <img :src="(data.errorCode >  0) ? '../../static-wms-app/image/dangerous.jpg' : '../../static-wms-app/image/greentrue.jpg'"
                             width="20px"
                             height="20px">
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
             id="exampleModal"
             tabindex="-1"
             role="dialog"
             aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog"
                 role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"
                            id="exampleModalLabel">保存提示</h5>
                        <button type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{message}}
                    </div>
                    <div class="modal-footer">
                        <button type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal">取消</button>
                        <button type="button"
                                class="btn btn-primary"
                                @click="submitBefore1()">确认</button>
                    </div>
                </div>
            </div>
        </div>
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
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var Notify = require("../widget/Notify.js");
var StockOutPrepareResource = require("../api/wms/StockOutPrepareResource.js");
var StockOutGeneratorResource = require("../api/wms/StockOutGeneratorResource.js");
var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
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
            selectedTab: 'rfid', //rfid
            stockOutPrepareId: undefined,
            stockOutPrepareNo: '请选择领用单',
            stockOutPrepareLineDtos: [], // 领料单明细
            inventoryStockOutDtoList: [], // 物料信息
            stockOutDate: undefined,
            stockOutPrepares: [
                []
            ],
            pickerVisible: false, // pick 是否显示
            message: '', //提示信息
            inventoryInstanceStockOutDtoList: [],
            displayStockOutLineInstanceDtos: [],
            watchDataErrorCode: undefined,
            showPictureOfApp: false,
            barCode: undefined,
            checked: false,//全选
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
         * 计算数量
         */
        compluteQuantity: function (data) {
            var _self = this;
            if (data.quantity < data.actualQuantity) {
                Notify.error('错误', '实际数量不能大于标准数量', false);
                return false;
            }
            var stockOutPrepareLineId = data.stockOutPrepareLineId;
            var inventoryId = data.inventoryId;
            for (var i = 0; i < _self.inventoryStockOutDtoList.length; i++) {
                var inventoryStockOutDto = _self.inventoryStockOutDtoList[i];
                if (inventoryStockOutDto.inventoryId == inventoryId && inventoryStockOutDto.stockOutPrepareLineId == stockOutPrepareLineId) {
                    inventoryStockOutDto.scanQuantity = 0;
                    break;
                }
            }
            var oQuantity = 0;
            _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                if (item.stockOutPrepareLineId == stockOutPrepareLineId && item.inventoryId == inventoryId) {
                    item.actualQuantity = parseInt(item.actualQuantity);
                    oQuantity = (oQuantity + item.actualQuantity);
                }
            })
            _self.inventoryStockOutDtoList.forEach(function (inventoryStockInDto) {
                if (inventoryStockInDto.inventoryId == inventoryId && inventoryStockInDto.id == stockOutPrepareLineId) {
                    inventoryStockInDto.scanQuantity = oQuantity;
                }
            })
        },

        initEvent: function () {
            var _self = this;
            plugin.barCode.scanEvent = function (barCodeStrs) {
                if (barCodeStrs != undefined && barCodeStrs.length > 0) {
                    var barCodes = barCodeStrs.split(",");
                    _self.barCode = barCodes[0];

                    //↑判断扫描的是领料单的二维码还是物料的二维码
                    var fdStart = barCodes[0].indexOf("SOP");
                    if (fdStart == 0) {
                        //SOP开头的是 领料单
                        _self.findByDocumentNo();
                    } else if (fdStart == -1) {
                        //不是SOP开头的是 扫描物料
                        _self.addBarCode(_self.barCode);
                    }

                    ///↓需要先判断扫描到的是那种类型的二维码
                    // _self.findByDocumentNo();

                }
            }
        },

        /**
         * ↑添加barCode到集合中
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
                'inventoryNo': '查询中',
                'inventoryName': '查询中',
                'inventoryId': null,
                'positionId': null,
                'positionBarCode': '查询中',
                'errorCode': null,
                'errorMessage': null,
                'status': '0',
                'quantity': 0, //标准数量
                'actualQuantity': 0,
                'stockOutPrepareLineId': null,
            };
            _self.inventoryInstanceStockOutDtoList.push(temp);
        },

        /**
         * ↑判断barCode是否重复
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
         * 根据单据号查询领料单
         */
        findByDocumentNo: function () {
            var _self = this;
            _self.barCode = _self.barCode.trim();
            _self.barCode = _self.barCode.slice(3, _self.barCode.length);
            StockOutPrepareResource.findByDocumentNo(_self.barCode, 0).then(successData => {
                if (successData != null) {
                    var stockOutPrepareLineDtos = [];
                    successData.stockOutPrepareLineDtos.forEach(function (item2) {
                        var inventoryInstance = {
                            id: item2.id,
                            inventoryId: item2.inventoryId,
                            inventoryNo: item2.inventoryNo,
                            inventoryName: item2.inventoryName,
                            needQuantity: item2.needQuantity,
                            scanQuantity: 0,
                            position: [],
                            errorCode: null,
                            errorMessage: null,
                            imageName: item2.imageName,
                            className: item2.className,
                        };
                        stockOutPrepareLineDtos.push(inventoryInstance);
                    })
                    var temp = {
                        value: successData.stockOutPrepareId,
                        label: successData.documentNo + "," + successData.projectItemName + "," + successData.pickUser,
                        stockOutPrepareLineDtos: stockOutPrepareLineDtos,
                    }
                    _self.stockOutPrepareId = temp.value;
                    _self.stockOutPrepareNo = temp.label;
                    _self.inventoryStockOutDtoList = temp.stockOutPrepareLineDtos;
                } else {
                    Notify.error('提示', '单据不存在或已领料完毕', true);
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
                if (type == 0) {
                    _self.titleMessage = '正常数据';
                    if (data.errorCode == 0) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 1) {
                    _self.titleMessage = '异常数据';
                    if (data.errorCode == 2 || data.errorCode >= 6) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 2) {
                    _self.titleMessage = '不属于此单据';
                    if (data.errorCode == 3) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 3) {
                    _self.titleMessage = '未入库数据';
                    if (data.errorCode == -1) {
                        _self.displayStockOutLineInstanceDtos.push(data);
                    }
                    return;
                }
                if (type == 4) {
                    _self.titleMessage = '已出库数据';
                    if (data.errorCode == 1) {
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
        },
        selectTab: function (tab) {
            if (this.selectedTab == tab) {
                this.clickCount++;
            } else {
                this.clickCount = 0;
            }

            if (this.clickCount > 10) {
                this.showEpc = true;
            }

            this.selectedTab = tab;
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
                _self.inventoryStockOutDtoList = selectedStockOutPrepares[0].stockOutPrepareLineDtos;
            }
        },

        // 查询所有领料单
        queryAllStockOutPrepare: function () {
            var _self = this;
            var stockOutPrepareQueryDto = {
                userId: null,
                projectItemId: null,
                documentStatus: null,
                stockOutPrepareId: null,
                loadLines: true,
                start: 0,
                length: 0,
            };
            StockOutPrepareResource.list(stockOutPrepareQueryDto).then(successData => {
                if (successData) {
                    successData.dataList.forEach(function (item) {
                        var stockOutPrepareLineDtos = [];
                        item.stockOutPrepareLineDtos.forEach(function (item2) {
                            var inventoryInstance = {
                                id: item2.id,
                                inventoryId: item2.inventoryId,
                                inventoryNo: item2.inventoryNo,
                                inventoryName: item2.inventoryName,
                                needQuantity: item2.needQuantity,
                                scanQuantity: 0,
                                position: [],
                                errorCode: null,
                                errorMessage: null,
                                imageName: item2.imageName,
                                className: item2.className,
                            };
                            stockOutPrepareLineDtos.push(inventoryInstance);
                        })
                        var temp = {
                            value: item.stockOutPrepareId,
                            label: item.documentNo + "," + item.projectItemName + "," + item.pickUser,
                            stockOutPrepareLineDtos: stockOutPrepareLineDtos,
                        }
                        _self.stockOutPrepares[0].push(temp);
                    });
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
            var quantity = this.displayStockOutLineInstanceDtos[index].actualQuantity;
            var errorCode = this.displayStockOutLineInstanceDtos[index].errorCode;
            // 删除所有工具内的数据
            this.displayStockOutLineInstanceDtos.splice(index, 1);
            for (var i = 0; i < this.inventoryInstanceStockOutDtoList.length; i++) {
                var inventoryInstanceStockOutDto = this.inventoryInstanceStockOutDtoList[i];
                if (inventoryInstanceStockOutDto.epc == epc) {
                    this.inventoryInstanceStockOutDtoList.splice(i, 1);
                }
            }
            // 删除无父件内的工具
            for (var i = 0; i < this.inventoryStockOutDtoList.length; i++) {
                if (this.inventoryStockOutDtoList[i].inventoryId == inventoryId) {
                    if (this.inventoryStockOutDtoList[i].scanQuantity == quantity && (errorCode != 0)) {
                        this.inventoryStockOutDtoList.splice(i, 1);
                        i--;
                    } else {
                        this.inventoryStockOutDtoList[i].scanQuantity = this.inventoryStockOutDtoList[i].scanQuantity -
                            quantity;
                    }
                }
            }
        },

        // 清空页面数据
        clearData: function () {
            var _self = this;
            for (var i = 0; i < _self.inventoryStockOutDtoList.length; i++) {
                if (_self.inventoryStockOutDtoList[i].needQuantity == null) {
                    _self.inventoryStockOutDtoList.splice(i, 1);
                    i--;
                } else {
                    _self.inventoryStockOutDtoList[i].scanQuantity = 0;
                }
            }
            _self.inventoryInstanceStockOutDtoList.splice(0, _self.inventoryInstanceStockOutDtoList.length);
            _self.displayStockOutLineInstanceDtos.splice(0, _self.displayStockOutLineInstanceDtos.length);
            $('#exampleModal1').modal('hide');
        },
        // 出库检查
        stockOutCheck: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                if (item.status == "0") {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            if (_self.inventoryStockOutDtoList.length > 0 && updateIventoryInstanceDtos.length > 0 && _self.isRequire ==
                false) {
                _self.isRequire = true;
                StockOutGeneratorResource.stockOutCheckByComponent(updateIventoryInstanceDtos, _self.stockOutPrepareId).then(
                    successData => {
                        _self.isRequire = false;
                        if (successData) {
                            // 匹配数量
                            _self.matchingLeftTabData(successData);
                            // 处理后更新epc状态
                            _self.updateEpcStatus(successData, true);
                        }
                    }, errorData => {
                        _self.isRequire = false;
                        Common.processException(errorData);
                    });
            }
        },
        // 左页签
        matchingLeftTabData: function (data) {
            var _self = this;
            data.forEach(function (item) {
                var isExist = false;
                _self.inventoryStockOutDtoList.forEach(function (inventoryStockInDto) {
                    if (item.stockOutPrepareLineId == undefined || item.stockOutPrepareLineId == null) {
                        if (inventoryStockInDto.inventoryId == item.inventoryId) {
                            isExist = true;
                            inventoryStockInDto.scanQuantity = inventoryStockInDto.scanQuantity + item.quantity;
                            if (item.positionBarCode != undefined && item.positionBarCode != null) {
                                if (inventoryStockInDto.position == null) {
                                    inventoryStockInDto.position.push(item.positionBarCode);
                                } else {
                                    if (inventoryStockInDto.position.indexOf(item.positionBarCode) < 0) {
                                        inventoryStockInDto.position.push(item.positionBarCode);
                                    }
                                }
                            }
                        }
                    } else {
                        if (inventoryStockInDto.inventoryId == item.inventoryId && item.stockOutPrepareLineId ==
                            inventoryStockInDto.id) {
                            isExist = true;
                            inventoryStockInDto.scanQuantity = inventoryStockInDto.scanQuantity + item.quantity;
                            if (item.positionBarCode != undefined && item.positionBarCode != null) {
                                if (inventoryStockInDto.position == null) {
                                    inventoryStockInDto.position.push(item.positionBarCode);
                                } else {
                                    if (inventoryStockInDto.position.indexOf(item.positionBarCode) < 0) {
                                        inventoryStockInDto.position.push(item.positionBarCode);
                                    }
                                }
                            }
                        }
                    }
                })
                if (!isExist) {
                    var noInventoryInstance = {};
                    if (item.errorCode == 1) {
                        noInventoryInstance = {
                            id: null,
                            inventoryId: null,
                            inventoryNo: '异常',
                            inventoryName: '物料',
                            needQuantity: null,
                            scanQuantity: item.quantity,
                            errorCode: item.errorCode,
                            errorMessage: item.errorMessage,
                            position: null,
                        }
                    } else {
                        var positions = [];
                        positions.push(item.positionBarCode);
                        noInventoryInstance = {
                            id: null,
                            inventoryId: item.inventoryId,
                            inventoryNo: item.inventoryNo,
                            inventoryName: item.inventoryName,
                            needQuantity: null,
                            scanQuantity: item.quantity,
                            errorCode: item.errorCode,
                            errorMessage: item.errorMessage,
                            imageName: item.imageName,
                            className: item.className,
                            position: positions,
                        }
                    }
                    _self.inventoryStockOutDtoList.push(noInventoryInstance);
                }
            })
        },
        // 修改EPC状态
        updateEpcStatus: function (data, isCheck) {
            var _self = this;
            data.forEach(function (newData) {
                let count = _self.inventoryInstanceStockOutDtoList.length;
                for (var index = 0; index < count; index++) {
                    let existInventoryInstanceStockInDto = _self.inventoryInstanceStockOutDtoList[index];
                    if ((existInventoryInstanceStockInDto.epc != null && existInventoryInstanceStockInDto.epc == newData.epc) || (existInventoryInstanceStockInDto.barCode != null && existInventoryInstanceStockInDto.barCode == newData.barCode)) {
                        if (isCheck == true) {
                            if (newData.errorCode != 1) {
                                existInventoryInstanceStockInDto.actualQuantity = newData.quantity;
                                existInventoryInstanceStockInDto.stockOutPrepareLineId = newData.stockOutPrepareLineId;
                                existInventoryInstanceStockInDto.positionId = newData.positionId;
                                existInventoryInstanceStockInDto.inventoryId = newData.inventoryId;
                                existInventoryInstanceStockInDto.inventoryName = newData.inventoryName;
                                existInventoryInstanceStockInDto.inventoryNo = newData.inventoryNo;
                                existInventoryInstanceStockInDto.positionBarCode = newData.positionBarCode;
                                existInventoryInstanceStockInDto.imageName = newData.imageName;
                                existInventoryInstanceStockInDto.className = newData.className;
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                                if (newData.errorCode <= -3) {
                                    _self.$set(existInventoryInstanceStockInDto, 'errorStatus1', 0);
                                }
                                if (newData.errorCode < 0 && newData.errorCode > -3) {
                                    _self.$set(existInventoryInstanceStockInDto, 'errorStatus2', 2);
                                }
                            } else {
                                existInventoryInstanceStockInDto.inventoryName = '物料';
                                existInventoryInstanceStockInDto.inventoryNo = '异常';
                                existInventoryInstanceStockInDto.positionBarCode = null;
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                                existInventoryInstanceStockInDto.actualQuantity = newData.quantity;
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
        scanRack: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            for (var i = 0; i < _self.inventoryInstanceStockOutDtoList.length; i++) {
                if (_self.inventoryInstanceStockOutDtoList[i].errorStatus2 == "1") {
                    _self.deleteOne(i);
                    i--;
                }
                if (_self.inventoryInstanceStockOutDtoList[i].errorStatus1 == "1") {
                    _self.deleteOne(i);
                    i--;
                }
                if (_self.inventoryInstanceStockOutDtoList[i].actualQuantity == undefined || _self.inventoryInstanceStockOutDtoList[i].actualQuantity.length == 0) {
                    _self.inventoryInstanceStockOutDtoList[i].actualQuantity = 0;
                }
            }
            _self.inventoryInstanceStockOutDtoList.forEach(function (item) {
                if (item.status == '1') {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            if (updateIventoryInstanceDtos != null && updateIventoryInstanceDtos.length > 0) {
                var uuid = Loading.show();
                var currentDate = _self.stockOutDate;
                var tagNo = "";
                StockOutGeneratorResource.stockOutByComponent(updateIventoryInstanceDtos, currentDate, _self.stockOutPrepareId, tagNo).then(
                    successData => {
                        Loading.hide(uuid);
                        if (successData) {
                            var trueLength = 0; // 成功的数量
                            var falseLength = 0; // 失败的数量
                            var otherStockInIdArray = [];
                            var purchaseStockInIdArray = [];
                            for (var k = 0; k < successData.length; k++) {
                                if (successData[k].otherStockInId != null && otherStockInIdArray.indexOf(successData[k].otherStockInId) <
                                    0) {
                                    otherStockInIdArray.push(successData[k].otherStockInId);
                                }
                                if (successData[k].purchaseStockInId != null && purchaseStockInIdArray.indexOf(successData[k].purchaseStockInId) <
                                    0) {
                                    purchaseStockInIdArray.push(successData[k].purchaseStockInId);
                                }
                                if (successData[k].errorCode == 2 || successData[k].errorCode == 6 || successData[k].errorCode ==
                                    7 || successData[k].errorCode == 8 || successData[k].errorCode == 9) {
                                    falseLength++;
                                } else {
                                    trueLength++;
                                }
                                _self.updateEpcStatus(successData, false);
                            }
                            Notify.success('提示', '保存完成，本次扫描出库成功的工具共' + trueLength + '个' + '，出库失败的工具共' + falseLength + '个，补录了' +
                                otherStockInIdArray.length + '张其他入库单，' + purchaseStockInIdArray.length + '张采购入库单', false);
                        }
                    }, errorData => {
                        Loading.hide(uuid);
                        Common.processException(errorData);
                    });
            } else {
                Notify.error('提示', '没有可操作的数据', false);
            }
        },
        // 提交之前检查数据
        submitBefore1: function () {
            var _self = this;
            $('#exampleModal').modal('hide');
            _self.scanRack();
        },
        // 提交之前检查数据
        submitBefore: function () {
            var _self = this;
            if (_self.stockOutPrepareId == null) {
                Notify.error('提示', '请选择一个领料单', false);
                return;
            } else {
                if (_self.inventoryInstanceStockOutDtoList.length <= 0 || _self.inventoryInstanceStockOutDtoList.length <=
                    0) {
                    Notify.error('提示', '没有物料数据可以提交', false);
                    return;
                } else {
                    var errorLength = 0;
                    var errorLength1 = 0;
                    for (var i = 0; i < _self.inventoryInstanceStockOutDtoList.length; i++) {
                        if (_self.inventoryInstanceStockOutDtoList[i].errorStatus2 == "2") {
                            errorLength++;
                        }
                        if (_self.inventoryInstanceStockOutDtoList[i].errorStatus1 == "0") {
                            errorLength1++;
                        }
                    }
                    if (errorLength > 0 || errorLength1 > 0) {
                        if (errorLength > 0) {
                            isOnlyOne = false;
                            _self.message = "本次出库扫描到了" + errorLength + "个已出库的物料，状态为补单，如果需要删除，请您点击取消，然后更改物料的状态，如果不需要删除，请您点击确认";
                        }
                        if (errorLength1 > 0) {
                            isOnlyOne = false;
                            _self.message = "本次出库扫描到了" + errorLength1 +
                                "个不属于此领料单的物料，状态为强制出库，如果需要删除，请您点击取消，然后更改物料的状态，如果不需要删除，请您点击确认";
                        }
                        if (errorLength > 0 && errorLength1 > 0) {
                            _self.message = "本次出库扫描到了" + errorLength + "个已出库的物料，状态为补单，" + errorLength1 +
                                "个不属于此领料单的物料，状态为强制出库，如果需要删除，请您点击取消，然后更改物料的状态，如果不需要删除，请您点击确认";
                        }
                        $('#exampleModal').modal('show');
                    } else {
                        _self.scanRack();
                    }
                }
            }
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
                'inventoryNo': '查询中',
                'inventoryName': '查询中',
                'inventoryId': null,
                'positionId': null,
                'positionBarCode': '查询中',
                'errorCode': null,
                'errorMessage': null,
                'status': '0',
                'quantity': 0, //标准数量
                'actualQuantity': 0,
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
    font-size: 0.8em;
    padding: 0.1rem;
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

.row {
    margin-right: 0px;
    margin-left: 0px;
}

.dropdown-toggle {
    width: 110px;
}

.card-body row col-3 {
    padding-left: 10px;
    padding-right: 0px;
}
</style>
