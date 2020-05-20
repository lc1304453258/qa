<template>
    <div class="container-fluid">
        <Navbar title="入库"></Navbar>
        <ScanWidget ref="scanWidget"
                    @scanCallback="scanCallback($event)"></ScanWidget>

        <h6></h6>
        <div>
            <div class="input-group mb-3">
                <div class="input-group mb-3">
                    <input type="text"
                           class="form-control"
                           placeholder="条码"
                           v-model.trim="barCode"
                           @keyup.enter="keyEnter">
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
                            @click="keyEnter">确定</button>
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
                            class="btn btn-success btn-sm"
                            @click="autoSetPosition">复制货位</button>
                    <button type="button"
                            class="btn btn-info btn-sm"
                            @click="beginScan">扫描</button>
                </div>
            </fieldset>
        </div>

        <div class="card-group m-card-item"
             v-if="(inventoryInstances == undefined || inventoryInstances.length == 0)">
            <div class="card bg-light">
                <div class="card-header">序号.存货编号</div>
                <div class="card-block">
                    <p class="card-text">存货名称：请扫码</p>
                    <p class="card-text">规格型号：请扫码</p>
                    <p class="card-text">存货批号：请扫码</p>
                    <p class="card-text">存货条码：请扫码</p>
                    <p class="card-text">入库数量：请扫码</p>
                </div>
                <div class="card-footer">
                    <p class="card-text">货位条码：请扫码</p>
                </div>
            </div>
        </div>
        <div class="row"
             v-else>
            <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item"
                 v-for="(data, index) in inventoryInstances">
                <div class="card bg-light">
                    <div class="card-header">
                        {{index + 1}}.存货编号：{{data.inventoryInstance.inventoryCode}}
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="card-block"
                         @click="showModal(data,index)">
                        <p class="card-text">存货名称：{{(data.inventoryInstance) ? data.inventoryInstance.inventoryName: undefined}}</p>
                        <p class="card-text">规格型号：{{(data.inventoryInstance) ? data.inventoryInstance.inventoryType: undefined}}</p>
                        <p class="card-text"
                           v-if="data.inventoryInstance && data.inventoryInstance.batchNo">存货批号：{{(data.inventoryInstance) ? data.inventoryInstance.batchNo : undefined}}</p>
                        <p class="card-text">存货条码：{{(data.inventoryInstance) ? data.inventoryInstance.barCode : undefined}}</p>
                        <p class="card-text">入库数量：<span class="text-primary"><b>{{(data.inventoryInstance) ? data.inventoryInstance.quantity : undefined}}</b></span></p>

                    </div>
                    <div class="card-footer">
                        货位条码：<span class="text-primary"><b>{{(data.position) ? data.position.positionBarCode : undefined}}</b></span>
                        <button type="button"
                                class="btn btn-info btn-sm pull-right"
                                @click="deleteOnePosition(index)">清货</button>
                    </div>
                </div>
            </div>
        </div>

        <Modal ref="modal"
               title="入库信息"
               large="true">
            <div slot="body">
                <div>
                    <div class="form-group">
                        <label for="stockInQuantityInput">入库数量</label>
                        <input id="stockInQuantityInput"
                               type="number"
                               class="form-control"
                               v-model="stockInQuantity">
                    </div>
                    <div class="form-group">
                        <label for="positionSelect">货位</label>
                        <div class="v-select-container">
                            <v-select id="positionSelect"
                                      label="positionBarCode"
                                      :options="positions"
                                      v-model="position"></v-select>
                        </div>
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
                            @click="modalCancel">取消</button>
                </div>
            </div>
        </Modal>

        <Modal ref="modal2"
               title="提示"
               large="true">
            <div slot="body">
                未找到该条码对应的存货，需要新建吗？
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="modalSave2">确定</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel2">取消</button>
                </div>
            </div>
        </Modal>

        <Modal ref="modal3"
               title="存货信息"
               large="true">
            <div slot="body">
                <div clas="form-group">
                    <label>条码</label>
                    <!-- <p class="form-control-static">{{barCode}}</p> -->
                    <input type="text"
                           class="form-control"
                           :value="barCode"
                           readonly>
                </div>
                <div class="form-group">
                    <label>存货名称</label>
                    <input type="text"
                           class="form-control"
                           v-model.trim="inventoryName">
                </div>
                <div class="form-group">
                    <label>规格型号</label>
                    <input type="text"
                           class="form-control"
                           v-model.trim="inventoryType">
                </div>
                <div class="form-group">
                    <label>存货分类</label>
                    <div class="v-select-container">
                        <v-select :options="inventoryClasses"
                                  v-model="inventoryClass"
                                  label="cInvCName"></v-select>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="generateInventory">确定</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel3">取消</button>
                </div>
            </div>
        </Modal>

        <Modal ref="modal4"
               title="单据类型"
               large="true">
            <div slot="body">
                <select v-model="documentTypeId"
                        class="form-control">
                    <option value="1">采购入库</option>
                    <option value="2">产成品入库</option>
                    <option value="3">其他入库</option>
                </select>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="modalSave4">确定</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel4">取消</button>
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
var Modal = require("../widget/Modal.vue");
var InventoryClassResource = require("../api/commom/InventoryClassResource.js");
var ScanWidget = require("../widget/ScanWidget.vue");
var Navbar = require("../widget/Navbar.vue");

module.exports = {
    components: {
        Common,
        "v-select": vSelect.VueSelect,
        Modal,
        ScanWidget,
        Navbar
    },
    data: function () {
        return {
            inventoryInstances: [],
            warehouses: [],
            vendors: [],
            barCode: "",
            positions: [],
            position: "",
            index: "",
            stockInQuantity: "",
            inventoryInstance: "",
            inventoryName: "",
            inventoryType: "",
            inventoryClasses: [],
            inventoryClass: null,
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
                    _self.keyEnter();
                }
            }
        },

        /**
         * 点击扫码按钮开始扫描
         */
        beginScan: function () {
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

        /**
         * 安卓端扫码成功后调用此函数
         */
        scanResult: function (event) {
            var _self = this;
            _self.barCode = event.detail.barCode;
            _self.keyEnter();
        },

        /**
         * 复制货位
         */
        autoSetPosition: function () {
            var indexOfEmpty = -1;
            for (var i = 0; i < this.inventoryInstances.length; i++) {
                if (!this.inventoryInstances[i].position) {
                    indexOfEmpty = i - 1;
                    break;
                }
            }
            var position = this.inventoryInstances[indexOfEmpty].position;
            if (indexOfEmpty != -1) {
                for (; indexOfEmpty < this.inventoryInstances.length - indexOfEmpty + 1; indexOfEmpty++) {
                    if (!this.inventoryInstances[indexOfEmpty + 1].position) {
                        this.inventoryInstances[indexOfEmpty + 1].position = position;
                    }
                }
            }
        },

        /**
         * 微信端开始扫描
         */
        wechatScan: function () {
            this.$refs.scanWidget.startScan();
        },

        /**
         * 微信端扫码成功调用此函数
         */
        scanCallback: function (result) {
            var index = result.indexOf(",");
            var barCode = result.slice(index + 1);
            this.barCode = barCode;
            this.keyEnter();
        },

        /**
         * 清除索引为index的存货的货位
         */
        deleteOnePosition: function (index) {
            this.inventoryInstances[index].position = null;
            this.position = null;
        },

        /**
         * 清除已扫描的所有存货的货位
         */
        clearPosition: function () {
            this.inventoryInstances.forEach(function (item) {
                item.position = null;
            });
        },

        /**
         * 删除索引为index的存货
         */
        deleteOne: function (index) {
            this.inventoryInstances.splice(index, 1);
        },

        /**
         * 清空文本框内的文本
         */
        clearText: function () {
            this.barCode = "";
        },

        /**
         * 清空数据
         */
        clear: function () {
            this.barCode = "";
            this.inventoryInstances.splice(0, this.inventoryInstances.length);
        },

        /**
         * 显示修改存货数量、货位模态框
         */
        showModal: function (data, index) {
            this.inventoryInstance = data;
            this.position = data.position;
            this.stockInQuantity = data.inventoryInstance.quantity;
            this.index = index;
            this.$refs.modal.show();
        },

        /**
         * 保存修改后的数量、货位
         */
        modalSave: function () {
            if (!this.stockInQuantity || !this.position) {
                Notify.error("提示", "请填写正确的数量和货位。", "true");
                return;
            }
            this.inventoryInstances[this.index].position = this.position;
            this.inventoryInstances[this.index].inventoryInstance.quantity = this.stockInQuantity;
            this.$refs.modal.hide();
        },

        /**
         * 取消显示模态框
         */
        modalCancel: function () {
            this.$refs.modal.hide();
        },

        /**
         * 保存修改后的数量、货位
         */
        keyEnter: function () {
            var _self = this;
            if (!this.barCode) {
                Notify.error("错误", "请输入条码。", false);
                return;
            }
            var strStart = this.barCode.indexOf("L");
            if (strStart == 0) {
                // 货位标签
                if (this.positions.length == 0) {
                    Notify.error("错误", "无货位数据。", false);
                } else {
                    var flag = false;
                    this.positions.forEach(function (item) {
                        if (!flag) {
                            if (_self.barCode == item.positionBarCode) {
                                _self.position = item;
                                flag = true;
                            }
                        }
                    });
                    if (flag) {
                        this.setPosition();
                    } else {
                        Notify.error("提示", "该条码无对应货位。", true);
                    }
                }
            } else {
                // 物料标签
                this.getInventoryInstance(this.barCode);
            }
        },


        /**
         * 根据输入框中的条码设置货位
         */
        setPosition: function () {
            var _self = this;
            //验证是否同一仓库
            var isSameWarehouse = true;
            this.inventoryInstances.forEach(function (item1) {
                if (isSameWarehouse) {
                    if (item1.position) {
                        if (item1.position.warehouseId != _self.position.warehouseId) {
                            isSameWarehouse = false;
                        }
                    }
                }
            });
            if (!isSameWarehouse) {
                Notify.error("提示", "请在同一仓库内操作。", true);
                return;
            }
            var flag = false;
            this.inventoryInstances.forEach(function (item) {
                if (!flag) {
                    if (!item.position) {
                        item.position = _self.position;
                        flag = true;
                    }
                }
            });
            if (!flag && this.inventoryInstances.length > 0) {
                Notify.error("提示", "所有物料已指定货位，如需继续指定货位，请先扫描物料。", true);
                return;
            } else if (!flag && this.inventoryInstances.length == 0) {
                Notify.error("提示", "请先扫描物料", "true");
                return;
            }
            _self.barCode = '';
        },

        /**
         * 根据条码查询存货序列号
         */
        getInventoryInstance: function (barCode) {
            var _self = this;
            var exist = false;
            this.inventoryInstances.forEach(function (item) {
                if (!exist) {
                    if (item.inventoryInstance.barCode == barCode) {
                        item.inventoryInstance.quantity = parseInt(item.inventoryInstance.quantity) + parseInt(item.originalQuantity);
                        exist = true;
                    }
                }
            });
            if (exist) {
                _self.barCode = "";
                return;
            }
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("InventoryInstanceResource/barCode2?barCode=") + barCode,
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    Loading.hide(uuid);
                    _self.barCode = '';
                    if (!data.position) {
                        data.position = null;
                    }
                    data.originalQuantity = data.inventoryInstance.quantity;
                    data.maxQuantity = data.inventoryInstance.quantity;
                    _self.inventoryInstances.unshift(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    _self.$refs.modal2.show();
                }
            });
        },

        modalCancel2: function () {
            this.$refs.modal2.hide();
        },

        modalSave2: function () {
            this.$refs.modal2.hide();
            this.$refs.modal3.show();
            this.queryInventoryClass();
        },

        modalCancel3: function () {
            this.inventoryName = "";
            this.$refs.modal3.hide();
        },

        /**
         * 查询所有存货分类
         */
        queryInventoryClass: function () {
            var _self = this;
            let inventoryClassQueryConditionDto = {
                start: 0,
                length: 10000,
            }
            InventoryClassResource.findByQueryCondition(inventoryClassQueryConditionDto).then(successData => {
                _self.inventoryClasses = successData.dataList;
            }, errorData => {
                Common.processException(errorData);
            });
        },

        /**
         * 根据条码和名称生成存货并保存
         */
        generateInventory: function () {
            var _self = this;
            if (!this.inventoryName) {
                Notify.error("提示", "请填写存货名称。", true);
                return;
            }
            var inventoryClassId = null;
            if (this.inventoryClass) {
                inventoryClassId = this.inventoryClass.id;
            }
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("InventoryInstanceResource/generateInventory2"),
                dataType: "json",
                type: "post",
                data: {
                    inventoryName: _self.inventoryName,
                    inventoryType: _self.inventoryType,
                    barCode: _self.barCode,
                    inventoryClassId: inventoryClassId,
                },
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    Loading.hide(uuid);
                    _self.$refs.modal3.hide();
                    _self.inventoryName = "";
                    _self.barCode = '';
                    if (!data.position) {
                        data.position = null;
                    }
                    data.originalQuantity = data.inventoryInstance.quantity;
                    data.maxQuantity = data.inventoryInstance.quantity;
                    _self.inventoryInstances.unshift(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    _self.inventoryName = "";
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        beforeSave: function () {
            this.$refs.modal4.show();
        },

        modalSave4: function () {
            if (!this.documentTypeId) {
                Notify.error("提示", "请输入单据类型", true);
                return;
            }
            this.save();
        },

        modalCancel4: function () {
            this.$refs.modal4.hide();
        },

        /**
         * 入库保存
         */
        save: function (index) {
            var _self = this;
            if (this.inventoryInstances.length == 0) {
                Notify.error("错误", "无数据可保存。", false);
                return;
            }
            //验证是否还有物料未扫描货位
            var emptyPosition = false;
            this.inventoryInstances.forEach(function (item) {
                if (!emptyPosition) {
                    if (item.position == null || item.position == undefined) {
                        emptyPosition = true;
                    }
                }
            });
            if (emptyPosition) {
                Notify.error("提示", "存在物料未扫描货位。", true);
                return;
            }
            //验证是否同一仓库
            var isSameWarehouse = true;
            this.inventoryInstances.forEach(function (item2) {
                if (isSameWarehouse) {
                    if (item2.position.warehouseId != _self.position.warehouseId) {
                        isSameWarehouse = false;
                    }
                }
            });
            if (!isSameWarehouse) {
                Notify.error("提示", "请在同一仓库内操作。", true);
                return;
            }
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("stockInResource/saveByInventoryInstance/") + _self.documentTypeId,
                type: "post",
                data: JSON.stringify(_self.inventoryInstances),
                dataType: "json",
                contentType: "application/json",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    _self.$refs.modal4.hide();
                    Loading.hide(uuid);
                    Notify.success("成功", "保存成功。", true);
                    _self.inventoryInstances.splice(0, _self.inventoryInstances.length);
                    _self.barCode = "";
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        /**
         * 加载公司所有货位
         */
        queryAllPositions: function () {
            var _self = this;
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("positionResource/positions"),
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    Loading.hide(uuid);
                    _self.positions = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
    },

    mounted: function () {
        var _self = this;
        this.queryAllPositions();
        window.addEventListener("sendScanData", _self.scanResult);
        this.initEvent();
    },

    beforeDestroy: function () {
        var _self = this;
        window.removeEventListener("sendScanData", _self.scanResult);
    },

    watch: {
        "stockInQuantity": {
            handler: function (to, from) {
                if (to) {
                    if (to <= 0 || parseInt(to) != to) {
                        Notify.error("错误", "请输入正整数。", false);
                        this.stockInQuantity = from;
                        return;
                    }
                }
            },
            deep: true
        },
    }

}
</script>

<style scoped>
.container-fluid {
    overflow-x: hidden;
}
</style>


