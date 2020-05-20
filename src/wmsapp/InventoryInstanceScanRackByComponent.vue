<template>
    <div class="container-fluid">
        <Navbar title="子件强制入库">

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
                           @click="changeWatchData(2)">已入库数据</a>
                        <a class="dropdown-item"
                           href="javascript:void(0);"
                           @click="changeWatchData(3)">全部数据</a>
                    </div>
                </div>
            </div>
        </Navbar>
        <div>
            <div class="form-group">
                <DateTime id="stockInDate"
                          dateFormat="YYYY-MM-DD HH:mm:ss"
                          class="form-control"
                          :dateValue="stockInDate"
                          :readonly="false"
                          @on-value-change="textChanged" />
            </div>
            <div class="form-group"
                 style="margin-top:-10px;">
                <input class="form-control"
                       type='button'
                       v-model="positionBarCode"
                       @click="pickerVisible = true; selectedInventoryInstanceStockInDto = null;" />
            </div>
        </div>
        <div class="clear-fix"></div>
        <div style="margin-top:-10px;">
            <ul class="nav nav-pills nav-fill selected-tab">
                <li class="nav-item"
                    @click="selectTab('artificial')">
                    <a class="nav-link"
                       id="nav-link1"
                       :class="{'active': (selectedTab === 'artificial')}"
                       href="javascript:void(0)">物料详细信息({{_self.displayStockInLineInstanceDtos.length}})</a>
                </li>
                <li class="nav-item"
                    @click="selectTab('rfid')">
                    <a class="nav-link"
                       id="nav-link2"
                       :class="{'active': (selectedTab === 'rfid')}"
                       href="javascript:void(0)">无父件物料({{_self.noParentInventoryInstances.length}})</a>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab == 'rfid'">
            <div v-for="(data, index) in noParentInventoryInstances"
                 :key="index">
                <div class="card">
                    <div class="card-header">
                        {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}},{{data.inventoryType}}
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
                                    <div>扫描数量：{{data.quantity}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="selectedTab == 'artificial'">
            <div v-for="(data, index) in displayStockInLineInstanceDtos"
                 :key="index">
                <div class="card">
                    <div class="card-header text-white"
                         :class="{'bg-danger':(data.errorCode > 0),'bg-success':(data.errorCode == 0),'bg-info':(data.errorCode == -1)}">
                        {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}},{{data.inventoryType}}
                        <span class="badge badge-pill badge-primary">{{data.inventoryId != undefined && data.barCode != undefined?'二维码物料':(data.inventoryId != undefined && data.epc != undefined?'RFID物料':'')}}</span>
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
                                    <div class="d-flex justify-content-between">
                                        <div class="p-2">标准数量：{{data.quantity}}</div>
                                    </div>
                                    <div class="p-2"
                                         v-if="data.epc == undefined">
                                        实际数量：<input style="width: 4em"
                                               type="text"
                                               v-model="data.actualQuantity"
                                               @input="compluteQuantity(data)">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="p-2"
                                 v-if="data.errorCode == 0 || data.errorCode == 4">选择货位：
                                <a href="javascript:void(0)"
                                   @click="pickerVisible = true; selectedInventoryInstanceStockInDto = data;"
                                   class="card-link">{{data.positionBarCode == null ? '选择货位' : data.positionBarCode}}</a>

                            </div>
                            <div class="p-2"
                                 v-else>货位信息：
                                {{data.positionBarCode == null ? '选择货位' : data.positionBarCode}}
                            </div>
                        </div>

                    </div>
                    <div class="card-footer">
                        <img class="error-img"
                             v-lazy="(data.errorCode ==  0) ? '../../static-wms-app/image/greentrue.jpg' : '../../static-wms-app/image/dangerous.jpg'">
                        <font size="2">{{data.errorCode == 0 ? (data.errorMessage+(data.stockInNo == undefined ? '':',手工单号:'+data.stockInNo)):data.errorMessage}}</font>
                    </div>

                </div>
            </div>
        </div>

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
                            @click="submitBefore">保存</button>
                </div>
            </div>
        </Modal>

        <VuePicker :data="positions"
                   :showToolbar="true"
                   @confirm="selectPosition"
                   :visible.sync="pickerVisible" />
        <nav class="navbar navbar-expand-sm navbar-dark fixed-bottom">
            <button class="btn btn-dark btn-sm"
                    id="btn-danger"
                    type="submit"
                    @click="clearData()">清空</button>
            <button class="btn btn-info btn-sm"
                    id="btn-success"
                    type="submit"
                    @click="scanRack()">确认</button>
        </nav>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var Notify = require("../widget/Notify.js");
var StockInResource = require("../api/wms/StockInResource.js");
var PositionResource = require("../api/wms/PositionResource.js");
var Modal = require("../widget/Modal.vue");
var ScanWidget = require("../widget/ScanWidget.vue");
var VuePicker = require("../widget/VuePicker/VuePicker.vue");
var DateTime = require("../widget/DateTime.vue");
var Navbar = require("../widget/Navbar.vue");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");
var WmsSettingResource = require("../api/commom/WmsSettingResource.js");
module.exports = {
    data: function () {
        return {
            titleMessage: '查看其它数据',
            selectedTab: 'artificial', //rfid
            stockInDate: undefined,
            inventoryInstanceDtos: [],
            noParentInventoryInstances: [], // 无父件物料集合
            positionId: undefined,
            positionBarCode: '选择货位',
            warehouseId: undefined,
            showEpc: false, // 是否显示epc
            clickCount: 0, // 点击次数
            require: false, //正在查询
            positions: [
                []
            ],
            selectedInventoryInstanceStockInDto: null,
            pickerVisible: false,
            pickerVisible1: false,
            watchDataErrorCode: 3,
            showPictureOfApp: false,
            displayStockInLineInstanceDtos: [],
            barCode: null,
            tagNo: undefined,//编号
        }
    },
    components: {
        Common,
        Modal,
        ScanWidget,
        Navbar,
        Loading,
        VuePicker,
        DateTime,
        ShowImage
    },
    methods: {

        /**
        * 计算数量
        */
        compluteQuantity: function (data) {
            var _self = this;
            var inventoryId = data.inventoryId;
            for (var i = 0; i < _self.noParentInventoryInstances.length; i++) {
                var noParentInventoryInstance = _self.noParentInventoryInstances[i];
                if (noParentInventoryInstance.inventoryId == inventoryId) {
                    noParentInventoryInstance.quantity = 0;
                    break;
                }
            }
            var oQuantity = 0;
            _self.inventoryInstanceDtos.forEach(function (item) {
                if (item.inventoryId == inventoryId) {
                    item.actualQuantity = parseInt(item.actualQuantity);
                    oQuantity = (oQuantity + item.actualQuantity);
                }
            })
            _self.noParentInventoryInstances.forEach(function (inventoryStockInDto) {
                if (inventoryStockInDto.inventoryId == inventoryId) {
                    inventoryStockInDto.quantity = oQuantity;
                }
            })
        },

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
                'epc': null,
                'barCode': barCode,
                'inventoryId': null,
                'hasBom': null,
                'inventoryNo': '查询中',
                'inventoryName': '查询中',
                'inventoryType': '查询中',
                'inventoryInstanceId': null,
                'positionId': null, // 要入的库位id
                'positionBarCode': '查询中', // 要入的货位名称
                'warehouseId': null, // 要入的仓库id
                'errorCode': null,
                'errorMessage': '查询中',
                'imageName': null,
                'className': null,
                'stockInId': null,
                'quantity': 0,//包装内数量
                'actualQuantity': 0,
                'stockInNo': null,
            };

            _self.inventoryInstanceDtos.push(temp);
        },

        /**
         * 判断barCode是否重复
         */
        containBarCode: function (barCode) {
            var _self = this;
            if (_self.inventoryInstanceDtos != null && barCode != null) {
                for (var i = 0; i < _self.inventoryInstanceDtos.length; i++) {
                    if (_self.inventoryInstanceDtos[i].barCode == barCode) {
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
            _self.inventoryInstanceDtos.forEach(function (data) {
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
         * 日期选择改变事件
         * @param  {Date} value
         * @return {void}
         */
        textChanged: function (value) {
            this.stockInDate = value;
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
        // 工具单独选择position
        selectPosition: function (position) {
            var _self = this;
            if (_self.selectedInventoryInstanceStockInDto == null) {
                if (position != undefined && position.length > 0) {
                    _self.positionId = position[0].value;
                    _self.positionBarCode = position[0].label;
                    _self.warehouseId = position[0].warehouseId;
                }
            } else {
                if (position != null && position.length > 0) {
                    _self.selectedInventoryInstanceStockInDto.positionId = position[0].value;
                    _self.selectedInventoryInstanceStockInDto.positionBarCode = position[0].label;
                    _self.selectedInventoryInstanceStockInDto.warehouseId = position[0].warehouseId;
                    _self.inventoryInstanceDtos.forEach(function (item) {
                        if (item.epc == _self.selectedInventoryInstanceStockInDto.epc) {
                            item.positionId = position[0].value;
                            item.positionBarCode = position[0].label;
                            item.warehouseId = position[0].warehouseId;
                        }
                    })
                }
            }
        },
        /**
         * 删除索引为index的存货
         */
        deleteOne: function (index) {
            var inventoryId = this.displayStockInLineInstanceDtos[index].inventoryId;
            var epc = this.displayStockInLineInstanceDtos[index].epc;
            var quantity = this.displayStockInLineInstanceDtos[index].actualQuantity;
            // 删除所有工具内的数据
            this.displayStockInLineInstanceDtos.splice(index, 1);
            for (var i = 0; i < this.inventoryInstanceDtos.length; i++) {
                var inventoryInstanceDto = this.inventoryInstanceDtos[i];
                if (inventoryInstanceDto.epc == epc) {
                    this.inventoryInstanceDtos.splice(i, 1);
                }
            }
            // 删除无父件内的工具
            for (var i = 0; i < this.noParentInventoryInstances.length; i++) {
                if (this.noParentInventoryInstances[i].inventoryId == inventoryId) {
                    if (this.noParentInventoryInstances[i].quantity > quantity) {
                        this.noParentInventoryInstances[i].quantity = this.noParentInventoryInstances[i].quantity - quantity;
                    } else {
                        this.noParentInventoryInstances.splice(i, 1);
                    }
                }
            }
        },
        // 清空页面数据
        clearData: function () {
            var _self = this;
            _self.inventoryInstanceDtos.splice(0, _self.inventoryInstanceDtos.length);
            _self.displayStockInLineInstanceDtos.splice(0, _self.displayStockInLineInstanceDtos.length);
            _self.noParentInventoryInstances.splice(0, _self.noParentInventoryInstances.length);
            _self.positionId = undefined;
            _self.positionBarCode = '选择货位';
            _self.warehouseId = undefined;
        },
        // 绑定检查
        checkBeforeScanRack: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];

            //图片显示测试
            // var temp = { 'epc': '100000000000000000000089', 'barCode': null, 'status': '0', 'positionId': null };
            // updateIventoryInstanceDtos.push(temp);

            _self.inventoryInstanceDtos.forEach(function (item) {
                if (item.errorCode == null) {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            if (updateIventoryInstanceDtos.length > 0 && _self.require == false) {
                _self.require = true;
                StockInResource.stockInCheckByComponent(updateIventoryInstanceDtos).then(successData => {
                    _self.require = false;
                    if (successData) {
                        // 显示无父件物料，相同的inventory，数量+1，如果是工具箱，只显示工具箱
                        _self.getNoParentInventoryInstances(successData);
                        // epc处理过后，修改状态，不再传到后台
                        _self.updateEpcStatus(true, successData);
                    }
                }, errorData => {
                    _self.require = false;
                    Common.processException(errorData);
                });
            }
        },
        // 无父件物料
        getNoParentInventoryInstances: function (data) {
            var _self = this;
            for (var i = 0; i < data.length; i++) {
                var noParentInventoryInstance = {};
                if (data[i].errorCode == 1) {
                    noParentInventoryInstance = {
                        inventoryId: null,
                        inventoryNo: '异常物料',
                        inventoryName: '',
                        inventoryType: '',
                        quantity: data[i].quantity,
                    };
                } else {
                    noParentInventoryInstance = {
                        inventoryId: data[i].inventoryId,
                        inventoryNo: data[i].inventoryNo,
                        inventoryName: data[i].inventoryName,
                        inventoryType: data[i].inventoryType,
                        quantity: data[i].quantity,
                        imageName: data[i].imageName,
                        className: data[i].className,
                    };
                }
                if (_self.noParentInventoryInstances.length <= 0) {
                    _self.noParentInventoryInstances.push(noParentInventoryInstance);
                } else {
                    var isExist = false;
                    for (var j = 0; j < _self.noParentInventoryInstances.length; j++) {
                        if (_self.noParentInventoryInstances[j].inventoryId == data[i].inventoryId) {
                            isExist = true;
                            _self.noParentInventoryInstances[j].quantity = _self.noParentInventoryInstances[j].quantity + data[i].quantity;
                        }
                    }
                    if (!isExist) {
                        _self.noParentInventoryInstances.push(noParentInventoryInstance);
                    }
                }
            }
        },
        // 修改EPC状态
        updateEpcStatus: function (isCheck, data) {
            var _self = this;
            if (data != null) {
                data.forEach(function (newData) {
                    let count = _self.inventoryInstanceDtos.length;
                    for (var k = 0; k < count; k++) {
                        let existInventoryInstanceStockInDto = _self.inventoryInstanceDtos[k];
                        if ((existInventoryInstanceStockInDto.epc != null && existInventoryInstanceStockInDto.epc == newData.epc) || (existInventoryInstanceStockInDto.barCode != null && existInventoryInstanceStockInDto.barCode == newData.barCode)) {
                            if (isCheck == true) {
                                existInventoryInstanceStockInDto.actualQuantity = newData.quantity;
                                existInventoryInstanceStockInDto.positionId = newData.positionId;
                                existInventoryInstanceStockInDto.positionBarCode = newData.positionBarCode;
                                existInventoryInstanceStockInDto.inventoryId = newData.inventoryId;
                                existInventoryInstanceStockInDto.inventoryNo = newData.inventoryNo;
                                existInventoryInstanceStockInDto.inventoryName = newData.inventoryName;
                                existInventoryInstanceStockInDto.inventoryType = newData.inventoryType;
                                existInventoryInstanceStockInDto.inventoryInstanceId = newData.inventoryInstanceId;
                                existInventoryInstanceStockInDto.warehouseId = newData.warehouseId;
                                existInventoryInstanceStockInDto.imageName = newData.imageName;
                                existInventoryInstanceStockInDto.className = newData.className;
                                existInventoryInstanceStockInDto.quantity = newData.quantity;
                            }
                            existInventoryInstanceStockInDto.stockInNo = newData.manualDocumentNo;
                            existInventoryInstanceStockInDto.stockInId = newData.stockInId;
                            existInventoryInstanceStockInDto.errorCode = newData.errorCode;
                            existInventoryInstanceStockInDto.errorMessage = newData.errorMessage;
                        }
                    }
                })
                if (_self.watchDataErrorCode != undefined) {
                    _self.changeWatchData(_self.watchDataErrorCode);
                } else {
                    _self.changeWatchData(3);
                }
            }
        },
        // 查询仓库所有货位
        queryAllPosition: function () {
            var _self = this;
            PositionResource.queryPositions().then(successData => {
                if (successData) {
                    successData.forEach(function (item) {
                        var temp = {
                            value: item.positionId,
                            label: item.positionBarCode,
                            warehouseId: item.warehouseId,
                        }
                        _self.positions[0].push(temp);
                    })
                }
            }, errorData => {
                Common.processException(errorData);
            });
        },
        scanRack: function () {
            var _self = this;
            _self.$refs.modal.show();
        },
        /**
         * 扫描入库
         */
        save: function (updateIventoryInstanceDtos) {
            var _self = this;
            if (_self.tagNo == undefined || _self.tagNo == null) {
                Notify.error('错误', '请填写编号', false);
                return;
            }
            if (updateIventoryInstanceDtos.length > 0 && _self.tagNo != undefined) {
                var uuid = Loading.show();
                var currentDate = _self.stockInDate;
                StockInResource.stockInByComponent(updateIventoryInstanceDtos, currentDate, _self.tagNo).then(successData => {
                    Loading.hide(uuid);
                    _self.$refs.modal.hide();
                    if (successData && successData.length > 0) {
                        var trueLength = 0; // 成功的数量
                        var falseLength = 0; // 失败的数量
                        var stockInIdArray = [];
                        for (var k = 0; k < successData.length; k++) {
                            if (successData[k].errorCode != 0) {
                                falseLength++;
                            } else {
                                trueLength++;
                            }
                            if (successData[k].stockInId != null && successData[k].stockInId != undefined && stockInIdArray.indexOf(successData[k].stockInId) < 0) {
                                stockInIdArray.push(successData[k].stockInId);
                            }
                        }
                        // 修改状态
                        _self.updateEpcStatus(false, successData);
                        Notify.success('提示', '本次入库成功的工具共' + trueLength + "个,入库失败的工具共" + falseLength + "个,生成了" + stockInIdArray.length + "张其他入库单", false);
                    }
                }, errorData => {
                    Loading.hide(uuid);
                    Common.processException(errorData);
                });
            } else { }
        },
        // 页面信息提交检查
        submitBefore: function () {
            var _self = this;
            // 提交入库必须选择库位
            // 一次入库提交，只能是一个仓库，不能一次提交属于多个仓库的工具
            var warehouseIds = [];
            var updateIventoryInstanceDtos = [];
            _self.inventoryInstanceDtos.forEach(function (item) {
                if (item.warehouseId != null && item.warehouseId != undefined) {
                    if (warehouseIds.indexOf(item.warehouseId) < 0) {
                        warehouseIds.push(item.warehouseId);
                    }
                }
            })
            if (_self.warehouseId != null && warehouseIds.indexOf(_self.warehouseId) < 0) {
                warehouseIds.push(_self.warehouseId);
            }
            if (warehouseIds.length > 1) {
                Notify.error('提示', '当前入库的物料隶属于多个仓库', false);
                return;
            }
            // 选择库位优先级别：每个工具选择的库位 > 页面上方的选择库位 > 默认库位
            for (var k = 0; k < _self.inventoryInstanceDtos.length; k++) {
                let existInventoryInstanceDto = _self.inventoryInstanceDtos[k];
                //2.如果没单独选择库位，先看是否选择了页面上方的库位
                if (existInventoryInstanceDto.positionId == null || existInventoryInstanceDto.positionId == undefined) {
                    existInventoryInstanceDto.positionId = _self.positionId;
                    existInventoryInstanceDto.warehouseId = _self.warehouseId;
                }
            }
            // 把值传给inventoryInstanceScanRackDto,传输到后台
            for (var k = 0; k < _self.inventoryInstanceDtos.length; k++) {
                if (_self.inventoryInstanceDtos[k].actualQuantity == undefined || _self.inventoryInstanceDtos[k].actualQuantity.length == 0) {
                    _self.inventoryInstanceDtos[k].actualQuantity = 0;
                }
                if (_self.inventoryInstanceDtos[k].errorCode != null) {
                    updateIventoryInstanceDtos.push(_self.inventoryInstanceDtos[k]);
                }
            }
            _self.save(updateIventoryInstanceDtos);
        },
        // 日期控件
        selectDate: function () {
            var _self = this;
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
                'inventoryId': null,
                'inventoryNo': '查询中',
                'inventoryName': '查询中',
                'inventoryType': '查询中',
                'inventoryInstanceId': null,
                'positionId': null, // 要入的库位id
                'positionBarCode': '查询中', // 要入的货位名称
                'warehouseId': null, // 要入的仓库id
                'errorCode': null,
                'errorMessage': '查询中',
                'imageName': null,
                'className': null,
                'stockInId': null,
                'quantity': 0,// 标准数量
                'actualQuantity': 0,
                'stockInNo': null,
            };
            _self.inventoryInstanceDtos.push(temp);
        },
        /**
         * 判断epc是否重复
         */
        contains: function (epc) {
            var _self = this;
            if (_self.inventoryInstanceDtos && epc) {
                for (var i = 0; i < _self.inventoryInstanceDtos.length; i++) {
                    if (_self.inventoryInstanceDtos[i].epc == epc) {
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
        _self.queryAllPosition();
        _self.getWmsSettingDto();
        // 定时将epc数组往后台传输一次
        _self.interval = window.setInterval(function () {
            _self.checkBeforeScanRack();
        }, 1000);
        _self.stockInDate = moment().format('YYYY-MM-DD HH:mm:ss');
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

.error-img {
    height: 20px;
    width: 20px;
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
    padding: 0.15rem;
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