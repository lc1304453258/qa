<template>
    <div class="container-fluid">
        <!-- 新增存货模态框 -->
        <Modal ref="modal2"
               title="新增存货"
               large="true">
            <div slot="body">
                <div>
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
                    <div>
                        <ImageEditor :className="'com.leanwo.prodog.model.common.Inventory'"
                                     :recordId="recordId"
                                     :fieldName="'imageName'"
                                     :readonly="isReadonly"
                                     ref="imageEditor"
                                     @getImageURL="getImageURL($event)">
                        </ImageEditor>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="generateInventory">保存</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel2">取消</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
var Common = require("../common/Common.js");
var InventoryResource = require("../api/commom/InventoryResource.js");
var InventoryClassResource = require("../api/commom/InventoryClassResource.js");
var Notify = require("../widget/Notify.js");
var Modal = require("../widget/Modal.vue");
var Loading = require("../common/Loading.js");
var vSelect = require("vue-select");
var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");

module.exports = {
    components: {
        Modal,
        "v-select": vSelect.VueSelect,
        ImageEditor,
    },
    data: function () {
        return {
            message: "",
            recordIds: [],
            quantity: "",
            batchNo: "",
            inventoryInstance: null,
            // inventoryNo: "",
            inventoryName: "",
            inventoryType: "",
            pagination: {
                total: 0,
                per_page: 20,
                current_page: 1,
                last_page: 0,
                from: 1,
                to: 4
            },
            paginationOptions: {
                offset: 5,
                previousText: '上一页',
                nextText: '下一页',
                alwaysShowPrevNext: true
            },
            inventoryClasses: [],
            inventoryClass: null,
            imageURL: null,
            isReadonly: false,
            recordId: undefined,
        }
    },

    methods: {

        getImageURL: function (dataURL) {
            this.imageURL = dataURL.displayValue[0];
        },



        modalCancel2: function () {
            this.inventoryName = "";
            this.inventoryNo = "";
            this.$refs.modal2.hide();
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
            }, errorData =>{
                Common.processException(errorData);
            });
        },

        /**
         * 根据名称创建存货
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
                url: Common.getApiURL("InventoryResource/generateInventory"),
                dataType: "json",
                type: "post",
                data: {
                    inventoryName: _self.inventoryName,
                    inventoryClassId: inventoryClassId,
                    inventoryType: _self.inventoryType,
                    inventoryImageNames: _self.imageURL,
                },
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    Loading.hide(uuid);
                    Notify.success("提示", "存货（名称：" + _self.inventoryName +
                        ", 编号：" + data.no + "）保存成功！", false);
                    _self.inventoryName = "";
                    _self.inventoryNo = "";
                    _self.$refs.modal2.hide();
                    _self.initPagination();
                    var newInventoryInstance = {
                        "inventoryName": data.name,
                        "inventoryCode": data.no,
                        "inventoryType": data.type,
                        "quantity": "",
                        "batchNo": "",
                        "inventoryId": data.id,
                    };
                    _self.$refs.imageEditor.clearFieldValue();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Loading.hide(uuid);
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },

        /**
         * 清空文本框内的文本
         */
        clearText: function () {
            this.message = "";
        },

        showModal: function (inventoryInstance) {
            this.quantity = inventoryInstance.quantity;
            this.batchNo = inventoryInstance.batchNo;
            this.inventoryInstance = inventoryInstance;
            // this.recordId = inventoryInstance.inventoryId;

            this.$refs.modal.show();
            // this.$refs.imageEditor.getFieldValue();
        },

    },

    mounted: function () {
        this.queryInventory();
    }
}
</script>

<style scoped>
.container-fluid {
    overflow-x: hidden;
}
</style>
