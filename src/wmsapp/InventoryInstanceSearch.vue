<template>
    <div class="container-fluid">
        <Navbar title="物料搜索">
            <span @click="showModal()"
                  class="navbar-text">数量({{inventoryInstanceSearchDtos.length}})</span>
        </Navbar>
        <div style="margin-top: 0.5em">
            <div class="form-group">
                <div class="input-group">
                    <input id="barcode-input"
                           type="text"
                           class="form-control"
                           placeholder="请输入查询条件"
                           v-model.trim="searchCondition"
                           v-on:keyup.enter="query">
                    <div class="input-group-append">
                        <label class="input-group-text"
                               for="inputGroupSelect02"
                               @click="searchCondition = ''">&times;</label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div>
                    <button type="button"
                            class="btn btn-danger"
                            @click="clear">清空</button>
                    <button type="button"
                            class="btn btn-primary"
                            @click="query">查询</button>
                </div>
            </div>
        </div>

        <div style="margin-top:-10px;">
            <ul class="nav nav-pills nav-fill tab"
                style="font-size: 11px;">
                <!-- 所有inventory -->
                <li class="nav-item"
                    @click="selectTab('inventorySearch')">
                    <a class="nav-link"
                       id="nav-link1"
                       :class="{'active': (selectedTab === 'inventorySearch')}"
                       href="javascript:void(0)">存货查询</a>
                </li>
                <li class="nav-item"
                    @click="selectTab('inventoryInstanceSearch')">
                    <a class="nav-link"
                       id="nav-link2"
                       :class="{'active': (selectedTab === 'inventoryInstanceSearch')}"
                       href="javascript:void(0)">序列号查询</a>
                </li>
                <li class="nav-item"
                    @click="selectTab('rfidSearch')">
                    <a class="nav-link"
                       id="nav-link3"
                       :class="{'active': (selectedTab === 'rfidSearch')}"
                       href="javascript:void(0)">已扫描序列号</a>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab == 'inventorySearch'">
            <InventoryInstanceSearchInventory ref="inventoryInstanceSearchInventory"
                                              :searchCondition="searchCondition"
                                              :searchList="inventoryInstanceSearchDtos"
                                              @refreshSearchList="refreshSearchList"></InventoryInstanceSearchInventory>
        </div>
        <div v-show="selectedTab == 'inventoryInstanceSearch'">
            <InventoryInstanceSearchInventoryInstance ref="inventoryInstanceSearchInventoryInstance"
                                                      :searchCondition="searchCondition"
                                                      :searchList="inventoryInstanceSearchDtos"
                                                      @refreshSearchList="refreshSearchList"></InventoryInstanceSearchInventoryInstance>
        </div>

        <div v-show="selectedTab == 'rfidSearch'">
            <InventoryInstanceSearchingList ref="inventoryInstanceSearchingList"
                                            :searchList="inventoryInstanceSearchDtos"
                                            @refreshSearchList="refreshSearchList"></InventoryInstanceSearchingList>
        </div>

        <!--序列号查询-->
        <div>
            <InventoryInstanceSearchList ref="inventoryInstanceSearchList"
                                         @refreshSearchList="refreshSearchList"></InventoryInstanceSearchList>
        </div>

    </div>
</template>

<script>
var Common = require("../common/Common.js");
var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
var InventoryInstanceWmsResource = require("../api/wms/InventoryInstanceWmsResource.js");
var Notify = require("../widget/Notify.js");
var Loading = require("../common/Loading.js");
var vSelect = require("vue-select");
var Navbar = require("../widget/Navbar.vue");


var MescrollVue = require("mescroll.js/mescroll.vue");
var InventoryInstanceSearchInventory = require("./InventoryInstanceSearchInventory.vue");
var InventoryInstanceSearchList = require("./InventoryInstanceSearchList.vue");
var InventoryInstanceSearchInventoryInstance = require("./InventoryInstanceSearchInventoryInstance.vue");
var InventoryInstanceSearchingList = require("./InventoryInstanceSearchingList.vue");


module.exports = {
    components: {
        Navbar,
        MescrollVue,
        InventoryInstanceSearchInventory,
        InventoryInstanceSearchInventoryInstance,
        InventoryInstanceSearchList,
        InventoryInstanceSearchingList
    },

    data: function () {
        return {
            selectedTab: 'inventorySearch', //rfid
            searchCondition: "",
            inventoryInstanceSearchDtos: [],
        }
    },

    methods: {
        /**
         * 点击查询按钮
         */
        query: function () {
            this.$refs.inventoryInstanceSearchInventory.clear();
            this.$refs.inventoryInstanceSearchInventoryInstance.clear();
            this.$refs.inventoryInstanceSearchingList.clear();

            this.$refs.inventoryInstanceSearchInventory.query(this.$refs.inventoryInstanceSearchInventory.mescrollUp.page);
            this.$refs.inventoryInstanceSearchInventoryInstance.pullupRefresh(this.$refs.inventoryInstanceSearchInventoryInstance.mescrollUp.page);
        },

        clear: function () {
            this.searchCondition = "";
            this.$refs.inventoryInstanceSearchInventory.clear();
            this.$refs.inventoryInstanceSearchInventoryInstance.clear();
            this.$refs.inventoryInstanceSearchingList.clear();
        },

        selectTab: function (tab) {
            var _self = this;
            this.selectedTab = tab;
        },

        showModal: function () {
            this.$refs.inventoryInstanceSearchList.showModal();
        },

        /**
         * 刷新搜索列表
         */
        refreshSearchList: function () {
            let _self = this;
            _self.inventoryInstanceSearchDtos.splice(0, _self.inventoryInstanceSearchDtos.length);
            this.$refs.inventoryInstanceSearchList.findByLoginUserId().then(successData => {
                if (successData != undefined) {
                    successData.forEach(function (item) {
                        _self.inventoryInstanceSearchDtos.push(item);
                    });
                }
            }, errorData => {

            });
        }
    },


    mounted: function () {
        var _self = this;
        this.$nextTick(function () {
            _self.refreshSearchList();
        });
    }
}
</script>

<style scoped>
.mescroll {
    position: fixed;
    top: 13rem;
    bottom: 0;
    height: auto;
    left: 0;
    right: 0;
    padding-left: 15px;
    padding-right: 15px;
}

.tab {
    border: 1px solid #007bff;
    border-radius: 5px;
}
</style>
