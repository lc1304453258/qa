<template>
    <div class="container-fluid">
        <Navbar title="RFID扫描出库"></Navbar>
        <ScanWidget ref="scanWidget"
                    @scanCallback="scanCallback($event)"></ScanWidget>

        <h6></h6>
        <div>
            <div class="card-group m-card-item">
                <div class="card bg-light">
                    <div class="card-header">选择仓库</div>
                    <div>
                        <select v-model="warehouse"
                                class="form-control"
                                @change="queryAllWarehouse">
                            <option v-for="(item,index) in warehouses"
                                    :value="item"
                                    :key="index">
                                {{item.name}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <fieldset class="form-group">
                <div>
                    <button type="button"
                            class="btn btn-primary btn-sm"
                            style="width:150px;"
                            @click="beforeSave">出库</button>
                    <button type="button"
                            class="btn btn-danger btn-sm"
                            style="position:relative;left:25px;width:150px;"
                            @click="clear">清空</button>
                </div>
            </fieldset>
        </div>

        <div class="card-group m-card-item"
             v-if="(currentStocks == undefined || currentStocks.length == 0)">
            <div class="card bg-light">
                <div class="card-header">序号.存货编号</div>
                <div class="card-block">
                    <p class="card-text">存货名称：请扫描</p>
                    <p class="card-text">存货条码：请扫描</p>
                    <p class="card-text">存货批号：请扫描</p>
                    <p class="card-text">入库单号：请扫描</p>
                    <p class="card-text">epc：请扫描</p>
                    <p class="card-text">库存数量：请扫描</p>
                    <p class="card-text">出库数量：请扫描</p>
                    <p class="card-text">状态：请扫描</p>
                </div>
            </div>
        </div>
        <div class="row"
             v-else>
            <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item"
                 v-for="(data, index) in currentStocks">
                <div class="card bg-light"
                     :style="[data.errorReason != null ? warnRecordStyle : '']">
                    <div class="card-header">{{index + 1}}.存货编号：{{data.inventoryInstanceDto.inventoryCode}}
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="card-block">
                        <p class="card-text">存货名称：{{data.inventoryInstanceDto.inventoryName}}</p>
                        <p class="card-text">存货条码：{{data.inventoryInstanceDto.barCode}}</p>
                        <p class="card-text">存货批号：{{data.inventoryInstanceDto.batchNo}}</p>
                        <p class="card-text">入库单号：{{data.stockInDocumentNo}}</p>
                        <p class="card-text">epc：{{data.inventoryInstanceDto.epc}}</p>
                        <p class="card-text">库存数量：{{data.inventoryInstanceDto.stockQuantity}}</p>
                        <p class="card-text">出库数量：<span class="text-primary"><b>{{data.inventoryInstanceDto.quantity}}</b></span></p>
                        <p class="card-text"
                           v-if="data.positionDto != null">当前所在货位：<b>{{data.positionDto.positionBarCode}},{{data.positionDto.positionName}}</b></p>
                        <p class="card-text"
                           v-if="data.errorReason != null">提示：<b>
                                <font color="red">{{data.errorReason}}</font>
                            </b></p>
                    </div>
                </div>
            </div>
        </div>

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
                           v-model.trim="pickNo"
                           disabled>
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
                            @click="modalSave3">保存</button>
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
            epcSet: [],
            barCode: '',
            currentStocks: [],
            warehouses: [],
            warehouse: {},
            index: '',
            warehouseId: '',
            orgnizations: [],
            orgnization: null,
            pickUser: "",
            pickNo: "",
            documentTypeId: 1,
            warnRecordStyle: {
                border: '1px solid red',
            },
        }
    },

    methods: {
        /**刷新 */
        reload: function () {
            var _self = this;
            window.location.reload();
        },
        /**清空 */
        clear: function () {
            var _self = this;
            _self.currentStocks = [];
            _self.epcSet = [];
        },
        /**
		 * 删除索引为index的存货
		 */
        deleteOne: function (index) {
            var epc = this.currentStocks[index].epc;
            for (var i = 0; i < this.epcSet.length; i++) {
                if (this.epcSet[i].epc == epc) {
                    this.epcSet.splice(i, 1);
                }
            }
            this.currentStocks.splice(index, 1);
        },
        //查询所有仓库
        queryAllWarehouse: function () {
            var _self = this;
            $.ajax({
                url: Common.getApiURL("WarehouseResource/all"),
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    if (data) {
                        _self.warehouses = data;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                    Notify.error("错误", "提交失败。", false);
                }
            });
        },
        /**
         * 查询所有部门
         */
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
        /**
         * 自动生称领用人，领用部门，领用单号
         */
        queryStockOutPrepares: function () {
            var _self = this;
            $.ajax({
                url: Common.getApiURL("stockOutPrepareResource/getPrepareDto"),
                type: "post",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    _self.pickUser = data.pickerName;
                    _self.pickNo = data.documentNo;
                    _self.orgnization = data.orgnizationDto;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
        /**
         * 提交之前
         */
        beforeSave: function () {
            this.$refs.modal3.show();
        },
        /**
         * 模态框确定按钮事件
         */
        modalSave3: function () {
            if (!this.documentTypeId) {
                Notify.error("提示", "请输入单据类型", true);
                return;
            }
            this.save();
        },
        /**
         * 模态框取消按钮事件
         */
        modalCancel3: function () {
            this.$refs.modal3.hide();
        },
        //查询存货信息
        queryInventoryInstance: function () {
            var _self = this;
            var epcs = [];
            _self.epcSet.forEach(function (item) {
                if (item.status == 1) {
                    epcs.push(item.epc);
                    item.status = 2;
                }
            });
            if (epcs.length > 0) {
                $.ajax({
                    url: Common.getApiURL("StockOutLineInstanceResource/beforeStockOut"),
                    type: "post",
                    beforeSend: function (request) {
                        Common.addTokenToRequest(request);
                    },
                    contentType: "application/json",
                    data: JSON.stringify(epcs),
                    success: function (data) {
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                _self.currentStocks.unshift(data[i]);
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        Common.processException(XMLHttpRequest, textStatus, errorThrown);
                        Notify.error("错误", "提交失败。", false);
                    }
                });
            }
        },
        /**
         * 出库保存
         */
        save: function (index) {
            var _self = this;
            if (this.currentStocks.length == 0) {
                Notify.error("错误", "无数据可保存。", false);
                return;
            }
            if (!this.orgnization || !this.pickNo || !this.pickUser || !this.documentTypeId || !this.warehouse) {
                Notify.error("提示", "请填写完整再保存。", true);
                return;
            }
            var isFlag = true;
            _self.currentStocks.forEach(function (item) {
                if (item.warehouseDto != null && (item.warehouseDto.id != _self.warehouse.id)) {
                    _self.$set(item, 'errorReason', '物料当前所在货位不属于当前所选仓库');
                    isFlag = false;
                }
                if (item.positionDto == null) {
                    isFlag = false;
                }
            })
            var uuid = Loading.show();
            if (isFlag) {
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: Common.getApiURL('StockOutResource/saveByStockOutScanByRfid') + '/' + _self.orgnization.id + '/' + _self.pickNo + '/' + _self.pickUser + '/' + _self.documentTypeId + '/' + _self.warehouse.id,
                    data: JSON.stringify(_self.currentStocks),
                    contentType: "application/json",
                    beforeSend: function (request) {
                        Common.addTokenToRequest(request);
                    },
                    success: function (data) {
                        _self.$refs.modal3.hide();
                        Loading.hide(uuid);
                        Notify.success("成功", "保存成功。", true);
                        if (data) {
                            _self.clear();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        Loading.hide(uuid);
                        Common.processException(XMLHttpRequest, textStatus, errorThrown);
                    }
                });
            } else {
                Loading.hide(uuid);
                Notify.error("错误", "页面存在错误信息，请检查。", false);
                return;
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
            var temp = { "epc": epc, "status": 1, "message": "", "productNo": "" };
            _self.epcSet.push(temp);
        },
        /**
         * 判断epc是否重复
         */
        contains: function (epc) {
            var _self = this;
            if (_self.epcSet && epc) {
                for (var i = 0; i < _self.epcSet.length; i++) {
                    if (_self.epcSet[i].epc == epc) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    mounted: function () {
        var _self = this;
        _self.queryAllOrgnizations();
        _self.queryStockOutPrepares();
        _self.queryAllWarehouse();
        _self.interval = window.setInterval(function () {
            _self.queryInventoryInstance();
        }, 1000);
        plugin.rfidMiddleware.start();
        plugin.rfidMiddleware.readEvent = function (epc) {
            _self.addEpc(epc);
            return "success";
        }
    },

    beforeDestroy: function () {
        plugin.rfidMiddleware.stop();
        plugin.rfidMiddleware.stopInventory();
    },

    destroyed: function () {
        plugin.rfidMiddleware.stop();
        plugin.rfidMiddleware.stopInventory();
    },
}
</script>

<style scoped>
.container-fluid {
    overflow-x: hidden;
}
</style>
