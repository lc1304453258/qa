<template>
    <div class="container-fluid">
        <Navbar title="RFID扫描入库"></Navbar>
        <ScanWidget ref="scanWidget"
                    @scanCallback="scanCallback($event)"></ScanWidget>

        <h6></h6>
        <div>
            <div class="card-group m-card-item">
                <div class="card bg-light">
                    <div class="card-header">选择货位</div>
                    <div>
                        <select v-model="position"
                                class="form-control">
                            <option v-for="(item,index) in positions"
                                    :value="item"
                                    :key="index">
                                {{item.positionName}}
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
                            @click="beforeSave">入库</button>
                    <button type="button"
                            class="btn btn-danger btn-sm"
                            style="position:relative;left:25px;width:150px;"
                            @click="clear">清空</button>
                </div>
            </fieldset>
        </div>
        <div class="card-group m-card-item"
             v-if="(inventoryInstances == undefined || inventoryInstances.length == 0)">
            <div class="card bg-light">
                <div class="card-header">序号.存货编号</div>
                <div class="card-block">
                    <p class="card-text">存货名称：请扫描</p>
                    <p class="card-text">规格型号：请扫描</p>
                    <p class="card-text">存货批号：请扫描</p>
                    <p class="card-text">存货条码：请扫描</p>
                    <p class="card-text">epc：请扫描</p>
                    <p class="card-text">状态/货位：请扫描</p>
                </div>
            </div>
        </div>
        <div class="row"
             v-else>
            <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item"
                 v-for="(data, index) in inventoryInstances"
                 :key="index">
                <div class="card bg-light">
                    <div class="card-header">
                        {{index + 1}}.存货编号：{{data.inventoryInstanceDto.inventoryCode}}
                        <button type="button"
                                class="close"
                                aria-label="Close"
                                @click="deleteOne(index)"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="card-block">
                        <p class="card-text">存货名称：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.inventoryName: undefined}}</p>
                        <p class="card-text">规格型号：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.inventoryType: undefined}}</p>
                        <p class="card-text"
                           v-if="data.inventoryInstanceDto && data.inventoryInstanceDto.batchNo">存货批号：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.batchNo : undefined}}</p>
                        <p class="card-text">存货条码：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.barCode : undefined}}</p>
                        <p class="card-text">epc：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.epc : undefined}}</p>
                        <p class="card-text">入库数量：{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.quantity : undefined}}</p>
                        <p class="card-text">状态/货位：
                            <b>{{(data.inventoryInstanceDto) ? data.inventoryInstanceDto.inventoryInstanceStatus : undefined}}</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
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
var ScanWidget = require("../widget/ScanWidget.vue");
var Navbar = require("../widget/Navbar.vue");
module.exports = {
    components: {
        Common,
        "v-select": vSelect.VueSelect,
        Modal,
        ScanWidget,
        Navbar,
    },
    data: function () {
        return {
            inventoryInstances: [],
            epcSet: [],
            positions: [],
            position: {},
            documentTypeId: 1,
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
            _self.inventoryInstances = [];
            _self.epcSet = [];
        },
        /**
		 * 删除索引为index的存货
		 */
        deleteOne: function (index) {
            var epc = this.inventoryInstances[index].inventoryInstanceDto.epc;
            for (var i = 0; i < this.epcSet.length; i++) {
                if (this.epcSet[i].epc == epc) {
                    this.epcSet.splice(i, 1);
                }
            }
            this.inventoryInstances.splice(index, 1);
        },
        /**
         * 提交之前
         */
        beforeSave: function () {
            this.$refs.modal4.show();
        },
        /**
         * 模态框确定按钮事件
         */
        modalSave4: function () {
            if (!this.documentTypeId) {
                Notify.error("提示", "请输入单据类型", true);
                return;
            }
            this.save();
        },
        /**
        * 模态框取消按钮事件
        */
        modalCancel4: function () {
            this.$refs.modal4.hide();
        },
        //查询选择的仓库下货位
        queryAllPosition: function () {
            var _self = this;
            _self.positions = [];
            $.ajax({
                url: Common.getApiURL("positionResource/positions"),
                type: "get",
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                data: {},
                success: function (data) {
                    if (data) {
                        data.forEach(function (item) {
                            item.positionName = item.positionName + "(" + item.warehouseName + ")";
                        })
                        _self.positions = data;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                    Notify.error("错误", "提交失败。", false);
                }
            });
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
                    url: Common.getApiURL("StockInLineInstanceResource/beforeStockIn"),
                    type: "post",
                    beforeSend: function (request) {
                        Common.addTokenToRequest(request);
                    },
                    contentType: "application/json",
                    data: JSON.stringify(epcs),
                    success: function (data) {
                        if (data) {
                            for (var i = 0; i < data.length; i++) {
                                _self.inventoryInstances.unshift(data[i]);
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
         * 入库保存
         */
        save: function (index) {
            var _self = this;
            if (this.inventoryInstances.length == 0) {
                Notify.error("错误", "无数据可保存。", false);
                return;
            }
            if (_self.position.positionId == undefined) {
                Notify.error("错误", "请选择货位。", false);
                return;
            }
            var uuid = Loading.show();
            $.ajax({
                url: Common.getApiURL("StockInLineInstanceResource/saveByInventoryInstanceByRfid/") + _self.documentTypeId + "/" + _self.position.positionId,
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
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < _self.inventoryInstances.length; j++) {
                                if (data[i].inventoryInstanceDto.epc == _self.inventoryInstances[j].inventoryInstanceDto.epc) {
                                    _self.$set(_self.inventoryInstances, j, data[i]);
                                }
                            }
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
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
        _self.interval = window.setInterval(function () {
            _self.queryInventoryInstance();
        }, 1000)
        _self.queryAllPosition();
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


