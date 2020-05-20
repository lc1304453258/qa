<template>
    <div class="container-fluid">
        <Navbar title="出库"></Navbar>
        <ScanWidget ref="scanWidget"
                    @scanCallback="scanCallback($event)"></ScanWidget>

        <h6></h6>
        <div>
            <div class="input-group mb-3">
                <div class="input-group mb-3">
                    <input id="barcode-input"
                           type="text"
                           class="form-control"
                           placeholder="条码"
                           v-model.trim="barCode"
                           @keydown.enter="keydown">
                    <div class="input-group-append">
                        <span class="input-group-text"
                              @click="clearText">&times;</span>
                    </div>
                </div>
            </div>

            <fieldset class="form-group">
                <div>
                    <button type="button"
                            class="btn btn-primary btn-sm"
                            @click="keydown">确定</button>
                    <button type="button"
                            class="btn btn-info btn-sm"
                            @click="clearPosition">清货</button>
                    <button type="button"
                            class="btn btn-danger btn-sm"
                            @click="clear">清空</button>
                    <button type="button"
                            class="btn btn-primary btn-sm"
                            @click="beforeSave">保存</button>
                    <button type="button"
                            class="btn btn-info btn-sm"
                            @click="startScan">扫描</button>
                </div>
            </fieldset>
        </div>

        <div class="card-group m-card-item"
             v-if="(currentStocks == undefined || currentStocks.length == 0)">
            <div class="card bg-light">
                <div class="card-header">序号.存货编号</div>
                <div class="card-block">
                    <p class="card-text">存货名称：请扫码</p>
                    <p class="card-text">存货条码：请扫码</p>
                    <p class="card-text">存货批号：请扫码</p>
                    <p class="card-text">库存数量：请扫码</p>
                    <p class="card-text">出库数量：请扫码</p>
                </div>
                <div class="card-footer">
                    <p class="card-text">货位条码：请扫码</p>
                </div>
            </div>
        </div>
        <div class="row"
             v-else>
            <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item"
                 v-for="(data, index) in currentStocks">
                <div class="card bg-light">
                    <div class="card-header">{{index + 1}}.存货编号：{{data.inventoryCode}}
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="card-block"
                         @click="showModal(data, index)">
                        <p class="card-text">存货名称：{{data.inventoryName}}</p>
                        <p class="card-text">存货条码：{{data.barCode}}</p>
                        <p class="card-text"
                           v-if="data.batchNo">存货批号：{{data.batchNo}}</p>
                        <p class="card-text">库存数量：{{data.inventoryQuantity}}</p>
                        <p class="card-text">出库数量：<span class="text-primary"><b>{{data.quantity}}</b></span></p>
                    </div>
                    <div class="card-footer">
                        货位条码：<span class="text-primary"><b>{{data.positionBarCode}}</b></span>
                        <button type="button"
                                class="btn btn-info btn-sm pull-right"
                                @click="deleteOnePosition(index)">清货</button>
                    </div>
                </div>
            </div>
        </div>

        <Modal ref="modal1"
               title="出库信息"
               large="true">
            <div slot="body">
                <div class="form-group">
                    <label>出库数量</label>
                    <input type="number"
                           class="form-control"
                           v-model="stockOutQuantity">
                </div>
                <div class="form-group">
                    <label for="positionSelect">货位</label>
                    <div class="v-select-container">
                        <v-select id="positionSelect"
                                  label="message"
                                  :options="currentStock.inventoryPositions"
                                  v-model="currentStock.inventoryPosition"></v-select>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="modalSave">确定</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel1">取消</button>
                </div>
            </div>
        </Modal>

        <Modal ref="modal2"
               title="选择要出库的库存"
               large="true">
            <div slot="body">
                <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item"
                     v-for="(data, index) in datasForSelect">
                    <div class="card bg-light">
                        <div class="card-header">{{index + 1}}.{{data.inventoryCode}}
                        </div>
                        <div class="card-block">
                            <p class="card-text">名称：{{data.inventoryName}}</p>
                            <p class="card-text">批号：{{data.batchNo}}</p>
                            <p class="card-text">仓库：{{data.warehouseName}}</p>
                            <p class="card-text">库存数量：{{data.inventoryQuantity}}</p>
                            <p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary btn-sm"
                                    type="button"
                                    @click="select(data)">选定</button>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel2">取消</button>
                </div>
            </div>
        </Modal>

        <Modal ref="modal3"
               title="领用信息"
               large="true">
            <div slot="body">
                <div clas="form-group">
                    <label>领用部门</label>
                    <div class="v-select-container">
                        <v-select label="name"
                                  :options="orgnizations"
                                  v-model="orgnization"></v-select>
                    </div>
                </div>
                <div class="form-group">
                    <label>领用人</label>
                    <input type="text"
                           class="form-control"
                           v-model.trim="pickUser">
                </div>
                <div class="form-group">
                    <label>领用单号</label>
                    <input type="text"
                           class="form-control"
                           v-model.trim="pickNo">
                </div>
                <div class="form-group">
                    <label>单据类型</label>
                    <select v-model="documentTypeId"
                            class="form-control">
                        <option value="1">材料出库</option>
                        <option value="2">销售出库</option>
                        <option value="3">其他出库</option>
                    </select>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="save">保存</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel3">取消</button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
var Common = require("../common/Common.js");
var Modal = require("../widget/Modal.vue");
var Notify = require("../widget/Notify.js");
var Loading = require("../common/Loading.js");
var vSelect = require("vue-select");
var ScanWidget = require("../widget/ScanWidget.vue");
var Navbar = require("../widget/Navbar.vue");

module.exports = {
    components: {
        Common,
        Modal,
        Notify,
        "v-select": vSelect.VueSelect,
        ScanWidget,
        Navbar
    },
    data: function () {
        return {
            barCode: '',
            currentStocks: [],
            datasForSelect: [],
            stockOutQuantity: '',
            index: '',
            currentStock: {
                inventoryPosition: [],
                inventoryPosition: null,
            },
            warehouseId: '',
            orgnizations: [],
            orgnization: null,
            pickUser: "",
            pickNo: "",
            documentTypeId: 1,
        }
    },
    methods: {

        initEvent: function () {
            var _self = this;
            plugin.barCode.scanEvent = function (barCodeStrs) {
                if (barCodeStrs != undefined && barCodeStrs.length > 0) {
                    var barCodes = barCodeStrs.split(",");
                    _self.barCode = barCodes[0];
                    _self.keydown();
                }
            }
        },

        startScan: function () {
            // if (window.plugin) {
            // 	plugin.barCode.scan(false);
            // } else {
            // 	this.wechatScan();
            // }

            if (typeof (ZXING_SCANNER) == "undefined") {
                this.wechatScan();
            } else {
                plugin.barCode.scan(false);
            }
        },


        scanResult: function (event) {
            var _self = this;
            _self.barCode = event.detail.barCode;
            _self.keydown();
        },


        wechatScan: function () {
            this.$refs.scanWidget.startScan();
        },
        scanCallback: function (result) {
            var index = result.indexOf(",");
            var barCode = result.slice(index + 1);
            this.barCode = barCode;
            this.keydown();
        },

        /**
         * 清空文本框内的文本
         */
        clearText: function () {
            this.barCode = "";
        },

        clearPosition: function () {
            this.currentStocks.forEach(function (item) {
                item.positionBarCode = "";
            })
        },

        deleteOnePosition: function (index) {
            this.currentStocks[index].positionBarCode = "";
            // this.$refs.modal1.hide();
        },

        showModal: function (currentStock, index) {
            var _self = this;
            this.currentStock = currentStock;
            this.index = index;
            this.stockOutQuantity = currentStock.quantity;
            this.$refs.modal1.show();
        },

        modalCancel1: function () {
            this.$refs.modal1.hide();
        },

        modalCancel2: function () {
            this.$refs.modal2.hide();
        },

        modalSave: function () {
            if (!this.stockOutQuantity) {
                Notify.error("错误", "请输入数量再保存。", false);
                return;
            }
            this.currentStocks[this.index].quantity = this.stockOutQuantity;
            this.currentStocks[this.index].positionBarCode = this.currentStock.inventoryPosition.positionBarCode;
            this.$refs.modal1.hide();
        },

        deleteOne: function (index) {
            this.currentStocks.splice(index, 1);
            if (this.currentStocks.length == 0) {
                this.warehouseId = "";
            }
            // this.$refs.modal1.hide();
        },

        //回车
        keydown: function () {
            var _self = this;
            if (!this.barCode) {
                Notify.error("错误", "请输入条码。", false);
                return;
            }
            var strStart = this.barCode.indexOf("L");
            if (strStart == 0) {
                //验证物料是否全部指定了货位
                var noInventory = true;
                this.currentStocks.forEach(function (item) {
                    if (noInventory) {
                        if (!item.positionBarCode) {
                            noInventory = false;
                        }
                    }
                });
                if (noInventory) {
                    Notify.error("错误", "请先扫描物料。", false);
                    return;
                }
                this.setPosition();
            } else {
                this.queryCurrentStockByBarCode();
            }
        },

        //设置出库货位
        setPosition: function () {
            var _self = this;
            var currentStock = null;
            //验证货位条码是否正确

            var findEmptyPosition = false;
            var currentStock = null;
            this.currentStocks.forEach(function (item) {
                if (!findEmptyPosition) {
                    if (!item.positionBarCode) {
                        findEmptyPosition = true;
                        currentStock = item;
                    }
                }
            });
            var illigalPosition = true;
            if (findEmptyPosition) {
                currentStock.inventoryPositions.forEach(function (item) {
                    if (illigalPosition) {
                        if (item.positionBarCode == _self.barCode) {
                            illigalPosition = false;
                            currentStock.positionBarCode = _self.barCode;
                            currentStock.inventoryPosition = item;
                        }
                    }
                });
            } else {
                Notify.error("错误", "请先扫描物料。", false);
                return;
            }
            if (illigalPosition) {
                Notify.error("错误", "该货位条码在该仓库没有对应货位库存。", false);
                return;
            }
            _self.barCode = '';
        },

        beforeSave: function () {
            if (!this.currentStocks.length) {
                Notify.error("错误", "无数据可保存。", false);
                return;
            }
            var allNumberFilled = true;
            var allPositionFilled = true;
            var currentStock = null;
            this.currentStocks.forEach(function (item) {
                if (allPositionFilled && allNumberFilled) {
                    if (!item.positionBarCode || !item.quantity) {
                        allPositionFilled = false;
                        currentStock = item;
                    }
                }
            });
            if (!allPositionFilled || !allNumberFilled) {
                Notify.error("错误", "存货（名称：" + currentStock.inventoryName + "，编号：" + currentStock.inventoryCode + "）未扫描货位或未填写数量。", false);
                return;
            }
            this.pickUser = "";
            this.pickNo = "";
            this.orgnization = null;
            this.$refs.modal3.show();
        },

        modalCancel3: function () {
            this.$refs.modal3.hide();
        },

        //保存
        save: function () {
            var _self = this;
            if (!this.orgnization || !this.pickNo || !this.pickUser || !this.documentTypeId) {
                Notify.error("提示", "请填写完整再保存。", true);
                return;
            }
            this.currentStocks.forEach(function (item) {
                // var inventoryPositions = [];
                // for (var i = 0; i < item.inventoryPositions.length; i++) {
                // 	if (item.inventoryPositions[i].positionBarCode == item.positionBarCode) {
                // 		inventoryPositions.push(item.inventoryPositions[i]);
                // 		break;
                // 	}
                // }
            });
            var uuid = Loading.show();
            $.ajax({
                type: "post",
                dataType: "json",
                url: Common.getApiURL('StockOutResource/saveByStockOutScan') + '/' + _self.orgnization.id + '/' + _self.pickNo + '/' + _self.pickUser + '/' + _self.documentTypeId,
                data: JSON.stringify(_self.currentStocks),
                contentType: "application/json",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    _self.$refs.modal3.hide();
                    _self.currentStocks.splice(0, _self.currentStocks.length);
                    _self.barCode = "";
                    _self.warehouseId = "";
                    Loading.hide(uuid);
                    Notify.success("成功", "保存成功。", true);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        //根据条码查询库存
        queryCurrentStockByBarCode: function () {
            var _self = this;
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("CurrentStockResource/barCode?barCode=") + _self.barCode,
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    Loading.hide(uuid);
                    data.forEach(function (item) {
                        item.positionBarCode = item.positionBarCode;
                        item.originalQuantity = item.quantity;
                        item.barCode = item.barCode;
                        // item.inventoryPosition = null;
                        // item.inventoryPositions.forEach(function (item2) {
                        // 	item2.message = item2.positionBarCode + "（数量：" + item2.quantity + "）";
                        // });
                        // if (item.inventoryPositions.length == 1) {
                        // 	item.inventoryPosition = item.inventoryPositions[0];
                        // 	item.positionBarCode = item.inventoryPosition.positionBarCode;
                        // }
                    });
                    _self.barCode = '';
                    if (data.length > 1) {
                        _self.selectOne(data);
                    } else {
                        var warehouseId = data[0].warehouseId;
                        if (!_self.warehouseId) {
                            _self.warehouseId = warehouseId;
                        } else {
                            if (parseInt(_self.warehouseId) != parseInt(warehouseId)) {
                                var uuid1 = Notify.success("提示", "请在同一个仓库操作。", true);
                                Common.fixModalBug(uuid1);
                                return;
                            }
                        }
                        var exist = false;
                        var tmpCurrentStock = null;
                        _self.currentStocks.forEach(function (item) {
                            if (!exist) {
                                if (item.id == data[0].id) {
                                    exist = true;
                                    tmpCurrentStock = item;
                                }
                            }
                        });
                        if (exist) {
                            tmpCurrentStock.quantity = parseInt(tmpCurrentStock.originalQuantity) + parseInt(tmpCurrentStock.quantity);
                        } else {
                            _self.currentStocks.unshift(data[0]);
                        }
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        //选择要出库的库存
        selectOne: function (data) {
            this.datasForSelect = data;
            this.$refs.modal2.show();
        },

        queryAllOrgnizations: function () {
            var _self = this;
            $.ajax({
                url: Common.getApiURL("orgnizationResource/all"),
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    _self.orgnizations = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        select: function (currentStock) {
            var warehouseId = currentStock.warehouseId;
            if (!this.warehouseId) {
                this.warehouseId = warehouseId;
            } else {
                if (parseInt(this.warehouseId) != parseInt(warehouseId)) {
                    var uuid1 = Notify.success("提示", "请在同一个仓库操作。", true);
                    Common.fixModalBug(uuid1);
                    return;
                }
            }
            var exist = false;
            var tmpCurrentStock = null;
            this.currentStocks.forEach(function (item) {
                if (!exist) {
                    if (item.id == currentStock.id) {
                        exist = true;
                        tmpCurrentStock = item;
                    }
                }
            });
            if (exist) {
                tmpCurrentStock.quantity = parseInt(tmpCurrentStock.originalQuantity) + parseInt(tmpCurrentStock.quantity);
            } else {
                this.currentStocks.unshift(currentStock);
            }
            // this.currentStocks.unshift(currentStock);
            this.$refs.modal2.hide();
        },

        showColor: function (index) {
            return !(index % 2);
        },

        clear: function () {
            this.barCode = "";
            this.currentStocks.splice(0, this.currentStocks.length);
            this.warehouseId = "";
        }
    },

    mounted: function () {
        var _self = this;
        window.addEventListener("sendScanData", _self.scanResult);
        this.queryAllOrgnizations();
        this.initEvent();
    },

    beforeDestroy: function () {
        var _self = this;
        window.removeEventListener("sendScanData", _self.scanResult);
    },

    watch: {
        "stockOutQuantity": {
            handler: function (to, from) {
                if (to) {
                    if (to <= 0) {
                        Notify.error("错误", "出库数量必须大于0", false);
                        this.stockOutQuantity = from;
                        return;
                    }
                    if (to != parseInt(to)) {
                        Notify.error("错误", "请输入整数。", false);
                        this.stockOutQuantity = from;
                        return;
                    }
                    if (to > this.currentStock.inventoryQuantity) {
                        Notify.error("错误", "超过库存数量。", false);
                        this.stockOutQuantity = from;
                        return;
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.container-fluid {
    overflow-x: hidden;
}
</style>
