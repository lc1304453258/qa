<template>
    <div class="row">
        <!-- 修改存货数量和批号的模态框 -->
        <Modal ref="modal"
               title="待搜索清单"
               large="true">
            <div slot="body">
                <div class="card-group mescroll">
                    <div v-for="(inventoryInstanceSearchDto, index) in inventoryInstanceSearchDtos"
                     :key="inventoryInstanceSearchDto.id">
                        <div class="card bg-light"
                             :key="inventoryInstanceSearchDto.id">
                            <div class="card-header">
                                {{index + 1}}.{{inventoryInstanceSearchDto.inventoryNo}}.{{inventoryInstanceSearchDto.inventoryName}}
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-12">
                                        <p class="card-text">序列号：{{inventoryInstanceSearchDto.inventoryInstanceNo}}</p>
                                        <p class="card-text">电子编号：{{inventoryInstanceSearchDto.epc}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div>
                    <button type="button"
                            class="btn btn-primary"
                            @click="remove">清空</button>
                    <button type="button"
                            class="btn btn-danger"
                            @click="modalCancel">取消</button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>

var Common = require("../common/Common.js");
var InventoryInstanceSearchResource = require("../api/wms/InventoryInstanceSearchResource.js");

var Modal = require("../widget/Modal.vue");

module.exports = {
    components: {
        Modal
    },

    data: function () {
        return {
            inventoryInstanceSearchDtos: [], // 搜索队列
        }
    },
    methods: {

        /**
         * 查询登陆用户的的搜索队列
         */
        findByLoginUserId: function () {
            var _self = this;
            _self.clear();
            return new Promise((resolve, reject) => {
                InventoryInstanceSearchResource.findByLoginUserId().then(successData => {
                    if (successData != undefined) {
                        successData.forEach(function (item) {
                            item.exist = false;
                            item.see = false;
                            item.recentSee = false;
                            item.readCount = false;
                            _self.inventoryInstanceSearchDtos.push(item);
                        });
                    }
                    resolve(successData);
                }, errorData => {
                    Common.processException(errorData);
                    reject();
                });
            });
        },

        /**
         * 清空界面的搜索队列
         */
        clear: function () {
            this.inventoryInstanceSearchDtos.splice(0, this.inventoryInstanceSearchDtos.length);
        },

        /**
         * 删除搜索队列
         */
        remove: function () {
            var _self = this;
            InventoryInstanceSearchResource.delete(_self.inventoryInstanceSearchDtos).then(successData => {
                _self.clear();
                _self.$emit("refreshSearchList");
                _self.modalCancel();
            }, errorData => {
                Common.processException(errorData);
            });
        },


        showModal: function () {
            this.$refs.modal.show();
        },

        modalCancel: function () {
            this.$refs.modal.hide();
        },


    },

}
</script>


<style scoped>
.card {
    margin-top: 5px;
    height: 100%;
}

.card-header {
    padding: 0.3rem 0.3rem;
}

.card-body {
    padding: 0.5rem;
}

.card-footer {
    padding: 0.1rem;
}

.card-body row col-3 {
    padding-left: 0px;
    padding-right: 0px;
}
</style>
