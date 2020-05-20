<template>
    <div class="container-fluid">
        <Navbar title="标准箱检查">
            <div class="form-inline">
                <button class="btn btn-link btn-sm"
                        type="submit"
                        @click="loadLastData()">历史数据</button>
                <button class="btn btn-link btn-sm"
                        type="submit"
                        @click="clearData()">清空</button>
                <button class="btn btn-link btn-sm"
                        type="submit"
                        @click="bind()">确认</button>
            </div>
        </Navbar>
        <div style="margin-top:10px">
            <div class="form-group">
                <input type="text"
                       class="form-control text-center"
                       v-model="parentInventoryInstance"
                       disabled>
            </div>
        </div>
        <div class="clear-fix"></div>

        <div>
            <ul class="nav nav-pills nav-fill selected-tab">
                <li class="nav-item"
                    @click="selectTab('rfid')">
                    <a class="nav-link"
                       id="nav-link1"
                       :class="{'active': (selectedTab === 'rfid')}"
                       href="javascript:void(0)">RFID检查物料</a>
                </li>
                <li class="nav-item"
                    @click="selectTab('artificial')">
                    <a class="nav-link"
                       id="nav-link2"
                       :class="{'active': (selectedTab === 'artificial')}"
                       href="javascript:void(0)">人工检查物料</a>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab == 'rfid'"
             style="margin-bottom:2.5em;">
            <div v-for="(data, index) in rfidBomComponentDtos"
                 :key="index">
                <div class="card">
                    <div class="card-header"
                         :class="{'bg-danger text-white': (data.baseQty == 0 || data.baseQty > data.actualQuantity), 'bg-success text-white': (data.baseQty > 0 && data.baseQty <= data.actualQuantity)}">
                        {{index+1}}.{{data.inventory.no}},{{data.inventory.name}},{{data.inventory.type}}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPictureOfApp == true">
                                <ShowImage :imageNames="data.inventory.imageNames"
                                           :className="data.inventory.className"></ShowImage>
                            </div>
                            <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">标准数量:{{data.baseQty}},实际数量:{{data.actualQuantity}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center"
                         v-if="data.baseQty == 0">
                        <img v-lazy="'../../static-wms-app/image/dangerous.jpg'"
                             style="height:20px;width:20px;">
                        <font size="2">子件未在BOM中</font>
                    </div>
                </div>
                <div v-show="data.activeBom != undefined">
                    <ShowBom :rfidBomComponentDto="data"
                             :number="index+1"
                             :showPictureOfApp="showPictureOfApp"
                             :isRfid="true"></ShowBom>
                </div>
            </div>
        </div>
        <div v-show="selectedTab == 'artificial'"
             style="margin-bottom:2.5em;">
            <div v-for="(data, index) in artificialBomComponentDtos"
                 :key="index">
                <div class="card">
                    <div class="card-header"
                         :class="{'bg-danger text-white': (data.baseQty == 0 || data.baseQty > (parseInt(data.actualQuantity) + parseInt(data.supplementaryQuantity))), 'bg-success  text-white': (data.baseQty > 0 && data.baseQty <= (parseInt(data.actualQuantity) + parseInt(data.supplementaryQuantity)))}">
                        {{index+1}}.{{data.inventory.no}},{{data.inventory.name}},{{data.inventory.type}}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPictureOfApp == true">
                                <ShowImage :imageNames="data.inventory.imageNames"
                                           :className="data.inventory.className"></ShowImage>
                            </div>
                            <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                                <div class="d-flex justify-content-between"
                                     v-if="data.inventory.rfidManagement == false">
                                    <div>
                                        <font size="2">标准数量：{{data.baseQty}}</font>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between"
                                     v-if="data.inventory.rfidManagement == false">
                                    <div>
                                        实际数量：<input style="width: 4em"
                                               type="number"
                                               v-model="data.actualQuantity"></div>
                                    <div>
                                        补充数量：<input style="width: 4em"
                                               type="number"
                                               v-model="data.supplementaryQuantity"></div>

                                </div>
                                <div class="d-flex justify-content-between"
                                     v-else>
                                    <div class="p-2">
                                        <font size="2">应安装数:{{data.baseQty}}</font>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="data.activeBom != undefined">
                    <ShowBom :rfidBomComponentDto="data"
                             :number="index+index"
                             :showPictureOfApp="showPictureOfApp"
                             :isRfid="false"></ShowBom>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-expand-sm navbar-dark fixed-bottom"
             v-show="selectedTab == 'rfid'">
            <div class="alert alert-info"
                 style=" width: 100%;">
                <strong>应检查数:{{_self.shouldCheckQuantity}}，已检查数:{{_self.checkedQuantity}}，未检查数:{{_self.notChecked}}，多余数:{{_self.surplusNumber}}</strong><br />
            </div>
        </nav>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var InventoryInstanceBindResource = require("../api/wms/InventoryInstanceBindResource.js");
var Notify = require("../widget/Notify.js");
var BomService = require("../service/BomService.js");
var Modal = require("../widget/Modal.vue");
var ScanWidget = require("../widget/ScanWidget.vue");
var VuePicker = require("../widget/VuePicker/VuePicker.vue");
var Navbar = require("../widget/Navbar.vue");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");
var ShowBom = require("../widget/ShowBom.vue");
var WmsSettingResource = require("../api/commom/WmsSettingResource.js");
module.exports = {
    data: function () {
        return {
            selectedTab: 'rfid', //artificial 人工
            inventoryInstanceDtos: [],
            parentInventoryInstance: '父件编号，父件名称', // 主件
            parentInventoryId: undefined, // BOM 标识
            parentInventoryInstanceId: undefined,
            rfidBomComponentDtos: [], // rfid管理的BOM 子件
            bomComponentDtos: [],
            bomComponentDtos2: [],
            artificialBomComponentDtos: [], // 人工管理的BOM 子件
            isRequire: false,
            showPictureOfApp: false,
            bomId: undefined,
            shouldCheckQuantity: 0,
            checkedQuantity: 0,
            notChecked: 0,
            surplusNumber: 0,
        }
    },
    components: {
        Common,
        Modal,
        ScanWidget,
        Navbar,
        VuePicker,
        ShowImage,
        ShowBom
    },
    methods: {
        /**
         * 加载上次的数据
         */
        loadLastData: function () {
            var _self = this;
            if (_self.parentInventoryInstanceId == undefined || _self.parentInventoryInstanceId.length == 0) {
                Notify.error('错误', '请先扫描箱子', false);
                return false;
            }
            InventoryInstanceBindResource.loadingLastBindData(_self.parentInventoryInstanceId).then(successData => {
                if (successData != null && successData.length > 0) {
                    successData.forEach(function (item) {
                        if (item.epc != undefined) {
                            _self.addEpc(item.epc);
                        }
                        _self.bomComponentDtos2.forEach(function (data) {
                            if (item.bomComponentId == data.id && item.inventoryId == data.inventory.id) {
                                data.actualQuantity = item.quantity;
                                data.supplementaryQuantity = item.supplementaryQuantity;
                            }
                        })
                    })
                } else {
                    Notify.error('提示', '该成套工具箱没有绑定记录', false);
                }
            }, errorData => {
                _self.isRequire = false;
                Common.processException(errorData);
            });
        },
        selectTab: function (tab) {
            this.selectedTab = tab;
        },
        // 清空页面数据
        clearData: function () {
            var _self = this;
            _self.inventoryInstanceDtos.splice(0, _self.inventoryInstanceDtos.length);
            _self.parentInventoryInstance = '父件编号，父件名称';
            _self.rfidBomComponentDtos.splice(0, _self.rfidBomComponentDtos.length);
            _self.bomComponentDtos.splice(0, _self.bomComponentDtos.length);
            _self.artificialBomComponentDtos.splice(0, _self.artificialBomComponentDtos.length);
            _self.parentInventoryId = undefined;
            _self.parentInventoryInstanceId = undefined;
            _self.isRequire = false;
            _self.shouldCheckQuantity = 0;
            _self.checkedQuantity = 0;
            _self.notChecked = 0;
            _self.surplusNumber = 0;
        },
        // 绑定检查
        checkBeforeBind: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];

            //图片测试
            //          var temp = { 'inventoryId': 55867, 'quantity': 1, 'epc': '100000000000000000000089', 'barCode': null, 'status': '0' };
            //          updateIventoryInstanceDtos.push(temp);
            //          
            _self.inventoryInstanceDtos.forEach(function (item) {
                if (item.status == '0') {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            if (updateIventoryInstanceDtos.length > 0 && _self.isRequire == false) {
                _self.isRequire = true;
                InventoryInstanceBindResource.inventoryInstanceBindCheck(updateIventoryInstanceDtos).then(successData => {
                    _self.isRequire = false;
                    if (successData) {
                        // 1.如果当前页面无BOM标识，查询后首先调用此方法，看此次查询获得了几个BOM标识（0个，1个，多个）；
                        _self.getBomByInventoryId(successData);
                    }
                }, errorData => {
                    _self.isRequire = false;
                    Common.processException(errorData);
                });
            }
        },
        // 获取BOM标识
        getBomByInventoryId: function (data) {
            var _self = this;
            var number = 0;
            var parentInventoryInstanceNames = []; // 主件名称集合（扫描到多个工具箱时提示）
            if (_self.parentInventoryId != null && _self.parentInventoryId != undefined) {
                number++;
                parentInventoryInstanceNames.push(_self.parentInventoryInstance);
            }
            var parentInventoryNoAndName = '';
            var parentInventoryId = undefined;
            var parentInventoryInstanceId = undefined;
            var bomId = undefined;
            for (var i = 0; i < data.length; i++) {
                if (data[i].isBox == true) {
                    parentInventoryNoAndName = data[i].no + "," + data[i].inventoryNo + "," + data[i].inventoryName;
                    parentInventoryId = data[i].inventoryId;
                    parentInventoryInstanceId = data[i].id;
                    if (data[i].bomId != undefined && data[i].bomId != null) {
                        bomId = data[i].bomId;
                    }
                    number++;
                    parentInventoryInstanceNames.push(parentInventoryNoAndName);
                } else {
                    _self.$set(data[i], 'bomComponentId', null);
                }
            }
            _self.updateEpcStatus(data);
            if (number == 0) {
                _self.clearData();
            } else if (number == 1) {
                if (_self.parentInventoryInstance == null || _self.parentInventoryInstance == undefined || _self.parentInventoryInstance == '父件编号，父件名称') {
                    _self.parentInventoryInstance = parentInventoryNoAndName;
                }
                if (_self.parentInventoryId == null || _self.parentInventoryId == undefined) {
                    _self.parentInventoryId = parentInventoryId;
                }
                if (_self.parentInventoryInstanceId == null || _self.parentInventoryInstanceId == undefined) {
                    _self.parentInventoryInstanceId = parentInventoryInstanceId;
                }
                if (_self.bomId == null || _self.bomId == undefined) {
                    _self.bomId = bomId;
                }
                if (_self.rfidBomComponentDtos.length <= 0) {
                    _self.getBomComponent(_self.parentInventoryId, _self.bomId, data);
                } else {
                    _self.getInventoryAndBaseQty(data);
                }
            } else if (number > 1) {
                var parentInventoryInstanceName = parentInventoryInstanceNames.join(';');
                Notify.error('提示', '扫描到多个工具箱，编号名称为：' + parentInventoryInstanceName, false);
                _self.clearData();
            }
        },
        // 匹配Inventory，计算实际安装数量，如果匹配不到，即说明子件不在BOM中，直接加入列表，显示红色
        getInventoryAndBaseQty: function (newData) {
            var _self = this;
            var components = [];
            components = _self.createBomComponentIdArray(components);
            // 先设置BomComponentId
            newData.forEach(function (data) {
                if (data.isBox == true) {
                    return;
                }
                var bomComponentId = null;
                for (var index = 0; index < components.length; index++) {
                    let component = components[index];
                    if (data.inventoryId == component.inventoryId) {
                        bomComponentId = component.bomComponentId;
                        if (component.baseQty > component.useQuantity) {
                            data.bomComponentId = component.bomComponentId;
                            component.useQuantity = component.useQuantity + 1;
                            break;
                        }
                    }

                }
                if (data.bomComponentId == null || data.bomComponentId == undefined) {
                    data.bomComponentId = bomComponentId;
                }
            })
            // 再匹配数量
            _self.matcingQuantity(newData);
            _self.updateEpcStatus(newData);
        },
        // 创建bomComponentId集合
        createBomComponentIdArray: function (components) {
            var _self = this;
            // 创建集合
            var bomComponents = [];
            _self.bomComponentDtos.forEach(function (item) {
                if (item.inventory.rfidManagement == false) {
                    return;
                }
                if (components.length <= 0) {
                    var successData = {
                        inventoryId: item.inventory.id,
                        baseQty: item.baseQty,
                        bomComponentId: item.id,
                        useQuantity: 0,
                    };
                    components.push(successData);
                } else {
                    var isFlag = false;
                    components.forEach(function (data) {
                        if (data.inventoryId == item.inventory.id && data.bomComponentId == item.id) {
                            isFlag = true;
                        }
                    })
                    if (isFlag == false) {
                        var successData = {
                            inventoryId: item.inventory.id,
                            baseQty: item.baseQty,
                            bomComponentId: item.id,
                            useQuantity: 0,
                        };
                        components.push(successData);
                    }
                }
            })
            return components;
        },
        // 匹配数量
        matcingQuantity: function (newData) {
            var _self = this;
            for (var i = 0; i < newData.length; i++) {
                if (newData[i].isBox == true) {
                    continue;
                }
                // 是否存在
                var isExist = false;
                // 子件计算数量
                for (var j = 0; j < _self.bomComponentDtos.length; j++) {
                    if (newData[i].inventoryId == _self.bomComponentDtos[j].inventory.id && newData[i].bomComponentId == _self.bomComponentDtos[j].id) {
                        isExist = true;
                        _self.bomComponentDtos[j].actualQuantity = _self.bomComponentDtos[j].actualQuantity + newData[i].representQuantity;
                        _self.checkedQuantity = _self.checkedQuantity + newData[i].representQuantity;
                    }
                }
                // 多余物料计算数量
                for (var k = 0; k < _self.rfidBomComponentDtos.length; k++) {
                    if (_self.rfidBomComponentDtos[k].baseQty == 0) {
                        if (newData[i].inventoryId == _self.rfidBomComponentDtos[k].inventory.id && newData[i].bomComponentId == _self.rfidBomComponentDtos[k].id) {
                            isExist = true;
                            _self.rfidBomComponentDtos[k].actualQuantity = _self.rfidBomComponentDtos[k].actualQuantity + newData[i].representQuantity;
                            _self.checkedQuantity = _self.checkedQuantity + newData[i].representQuantity;
                            _self.surplusNumber = _self.surplusNumber + newData[i].representQuantity;
                        }
                    }
                }
                //当前子件不存在BOM中，且属于RFID管理的子件，加入集合
                if (_self.bomComponentDtos.length > 0 && isExist == false && newData[i].rfidManagement == true) {
                    var inventory = {
                        id: newData[i].inventoryId,
                        no: newData[i].inventoryNo,
                        name: newData[i].inventoryName,
                        type: newData[i].inventoryType,
                        imageName: newData[i].imageName,
                        className: newData[i].className,
                    };
                    var rfidBomComponentDto = {
                        id: null,
                        inventory: inventory,
                        baseQty: 0,
                        actualQuantity: newData[i].representQuantity,
                    }
                    _self.checkedQuantity = _self.checkedQuantity + newData[i].representQuantity;
                    _self.surplusNumber = _self.surplusNumber + newData[i].representQuantity;
                    _self.rfidBomComponentDtos.push(rfidBomComponentDto);
                }
            }
            _self.notChecked = 0;
            _self.bomComponentDtos.forEach(function (data) {
                if (data.baseQty > data.actualQuantity) {
                    _self.notChecked = _self.notChecked + (data.baseQty - data.actualQuantity);
                }
            })
        },
        // 处理过后，修改物料实例的状态，下次提交数据的时候，不提交已处理过的
        updateEpcStatus: function (data) {
            var _self = this;
            var count = _self.inventoryInstanceDtos.length;
            for (var k = 0; k < _self.inventoryInstanceDtos.length; k++) {
                for (var m = 0; m < data.length; m++) {
                    if (_self.inventoryInstanceDtos[k].epc == data[m].epc) {
                        _self.inventoryInstanceDtos[k].status = '1';
                        _self.inventoryInstanceDtos[k].bomComponentId = data[m].bomComponentId;
                    }
                }
            }
        },
        // 根据BOM标识去后台查询BOM子件
        getBomComponent: function (parentInventoryId, bomId, inventoryInstanceDtos) {
            var _self = this;
            $.ajax({
                url: Common.getApiURL("BomComponentResource/queryBomDtoByInventoryId"),
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                data: {
                    'inventoryId': null,
                    'bomId': bomId,
                },
                success: function (data) {
                    // 处理RFID管理的数据
                    if (data) {
                        let bomClone1 = BomService.cloneBom(data);
                        BomService.filterRfidManagement1(bomClone1);
                        BomService.filterRfidManagement2(bomClone1);

                        bomClone1.bomComponents.forEach(function (item) {
                            _self.rfidBomComponentDtos.push(item);
                        });
                        _self.createBomComponentDtos(_self.rfidBomComponentDtos);
                        _self.getInventoryAndBaseQty(inventoryInstanceDtos);
                    }

                    // 处理人工校验的数据
                    if (data) {
                        let bomClone2 = BomService.cloneBom(data);
                        BomService.filterManualManagement1(bomClone2);
                        BomService.filterManualManagement2(bomClone2);
                        // bomClone为人工检查的BOM
                        _self.createArtificialBomComponentDtos(bomClone2.bomComponents);
                        bomClone2.bomComponents.forEach(function (item) {
                            _self.artificialBomComponentDtos.push(item);
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
        // 创建bomComponentDtos集合
        createBomComponentDtos: function (newData) {
            var _self = this;
            newData.forEach(function (data) {
                if (data.inventory.rfidManagement == true) {
                    _self.$set(data, 'actualQuantity', 0);
                    _self.shouldCheckQuantity = _self.shouldCheckQuantity + data.baseQty;
                    _self.bomComponentDtos.push(data);
                }
                if (data.activeBom != undefined) {
                    _self.createBomComponentDtos(data.activeBom.bomComponents);
                }
            })
        },
        // 创建人工管理物料集合
        createArtificialBomComponentDtos: function (newData) {
            var _self = this;
            newData.forEach(function (data) {
                if (data.inventory.rfidManagement == null || data.inventory.rfidManagement == false) {
                    _self.$set(data, 'actualQuantity', 0);
                    _self.$set(data, 'supplementaryQuantity', 0);
                    _self.bomComponentDtos2.push(data);
                }
                if (data.activeBom != undefined) {
                    _self.createArtificialBomComponentDtos(data.activeBom.bomComponents);
                }
            })
        },
        // 点击确定开始保存数据
        bind: function () {
            var _self = this;
            var updateIventoryInstanceDtos = [];
            _self.inventoryInstanceDtos.forEach(function (item) {
                if (item.status == '1') {
                    updateIventoryInstanceDtos.push(item);
                }
            })
            _self.bomComponentDtos2.forEach(function (item) {
                if (item.actualQuantity == undefined || item.actualQuantity.length == 0) {
                    item.actualQuantity = 0;
                }
                if (item.supplementaryQuantity == undefined || item.supplementaryQuantity.length == 0) {
                    item.supplementaryQuantity = 0;
                }
                var inventoryInstanceBindDto = {
                    inventoryId: item.inventory.id,
                    bomComponentId: item.id,
                    quantity: parseInt(item.actualQuantity),
                    supplementaryQuantity: parseInt(item.supplementaryQuantity),
                    epc: null,
                    barCode: null,
                    status: null,
                };
                updateIventoryInstanceDtos.push(inventoryInstanceBindDto);
            })
            console.log(updateIventoryInstanceDtos);
            if (updateIventoryInstanceDtos.length > 0) {
                var uuid = Loading.show();
                InventoryInstanceBindResource.inventoryInstanceBind(updateIventoryInstanceDtos).then(successData => {
                    Loading.hide(uuid);
                    if (successData && successData.length > 0) {
                        // 绑定完成后清空数据
                        _self.clearData();
                        Notify.success('提示', '成套工具箱绑定成功', false);
                    }
                }, errorData => {
                    Loading.hide(uuid);
                    Common.processException(errorData);
                });
            } else {
                Notify.error("失败", "没有数据可以提交", false);
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
            var temp = { 'inventoryId': null, 'quantity': null, 'epc': epc, 'barCode': null, 'status': '0', 'bomComponentId': null, 'representQuantity': 0 };
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
        // 定时将epc数组往后台传输一次
        _self.getWmsSettingDto();
        _self.checkBeforeBind();
        _self.interval = window.setInterval(function () {
            _self.checkBeforeBind();
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
    destroyed() {
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
}

#btn-success {
    width: 160px;
}

#btn-danger {
    width: 160px;
}

.card-body row col-3 {
    padding-left: 0px;
    padding-right: 0px;
}
.fixed-bottom {
    margin-bottom: -2em;
}
.alert-info {
    font-size: 0.8em;
}
</style>