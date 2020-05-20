<template>
    <!--mescroll滚动区域的基本结构-->
    <MescrollVue ref="mescroll"
                 class="mescroll"
                 :up="mescrollUp"
                 :down="mescrollDown"
                 @init="mescrollInit">
        <div>
            <div class="card-group"
                 v-if="(inventoryInstanceDtos == undefined || inventoryInstanceDtos.length == 0)">
                <div class="card bg-light">
                    <div class="card-header">序号.存货编码.存货名称</div>
                    <div class="card-body">
                        <p class="card-text">序列号</p>
                        <p class="card-text">电子编号</p>
                    </div>
                </div>
            </div>
            <div class="card-group"
                 v-else>
                <div v-for="(data, index) in inventoryInstanceDtos">
                    <div class="card bg-light"
                         :key="data.id">
                        <div class="card-header">
                            {{index + 1}}.{{data.no}}.{{data.name}}
                            <span v-if="!data.exist"
                                  class="fa fa-plus fa-pull-right update-icon"
                                  @click="addInventoryInstance(data)"></span>
                            <span v-else
                                  class="pull-right">已添加</span>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                                    <p class="card-text">序列号:{{data.no}}</p>
                                    <p class="card-text">电子编号:{{data.epc}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MescrollVue>
</template>


<script>

var Common = require("../common/Common.js");
var Loading = require("../common/Loading.js");
var MescrollVue = require("mescroll.js/mescroll.vue");
var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
var InventoryInstanceSearchResource = require("../api/wms/InventoryInstanceSearchResource.js");

module.exports = {
    props: ['searchCondition', "searchList"],

    components: {
        MescrollVue
    },

    data: function () {
        return {
            inventoryInstanceDtos: [],
            start: 0,
            length: 10,
            showPictureOfApp: false,
            mescroll: null, // mescroll实例对象
            mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                // 上拉加载的配置.
                auto: true, // 是否在初始化完毕之后自动执行上拉回调callback; 默认true
                callback: this.pullupRefresh, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认5
                },
                htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                //避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                //这就是为什么无更多数据有时候不显示的原因
                toTop: {
                    //回到顶部按钮
                    src: "/static-wms-app/image/mescroll-totop.png", //图片路径,默认null,支持网络图
                    offset: 1000 //列表滚动1000px才显示回到顶部按钮
                }
            },
        }

    },


    methods: {

        clear: function () {
            this.mescrollUp.page.num = 1;
            this.mescrollUp.page.size = 10;
            this.inventoryInstanceDtos.splice(0, this.inventoryInstanceDtos.length);
        },

        // mescroll组件初始化的回调,可获取到mescroll对象
        mescrollInit(mescroll) {
            this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },

        pullupRefresh: function (page, mescroll) {
            this.query(page);
        },

        query: function (page) {
            var _self = this;
            var searchCondition = $.trim(this.searchCondition);
            var uuid = Loading.show();
            var start = 0;
            if (page.num > 0) {
                start = (page.num - 1) * page.size
            }
            let inventoryQueryCodition = {
                "condition": searchCondition,
                "start": start,
                "length": page.size
            }
            InventoryInstanceResource.findByInventoryInstanceQueryCondition(inventoryQueryCodition).then(successData => {
                Loading.hide(uuid);
                successData.dataList.forEach(function (item) {
                    var newInventoryInstance = {
                        "id": item.id,
                        "name": item.name,
                        "no": item.no,
                        "epc": item.epc,
                        "inventoryNo": item.inventoryNo,
                        "exist": item.exist,
                    };
                    _self.inventoryInstanceDtos.push(newInventoryInstance);
                });

                _self.checkInSearchList();

                var totalSize = successData != null ? successData.totalSize : 0;

                if (this.mescroll != null) {
                    this.mescroll.endBySize(successData.dataList.length, totalSize);
                }
            }, errorData => {
                Loading.hide(uuid);
                if (this.mescroll != null) {
                    this.mescroll.endErr();
                }
                Common.processException(errorData);
            });
        },

        /**
         * 新增物料序列号
         */
        addInventoryInstance: function (inventoryInstance) {
            var _self = this;
            var inventoryInstanceSearchDto = {
                inventoryInstanceId: inventoryInstance.id,
                epc: inventoryInstance.epc
            }
            InventoryInstanceSearchResource.addInventoryInstance(inventoryInstanceSearchDto).then(successData => {
                inventoryInstance.exist = true;
                _self.$emit("refreshSearchList");
            }, errorData => {
                Common.processException(errorData);
            });
        },

        checkInSearchList: function () {
            var _self = this;
            for (let y = 0; y < _self.inventoryInstanceDtos.length; y++) {
                _self.inventoryInstanceDtos[y].exist = false;
            }

            if (_self.searchList != null && _self.inventoryInstanceDtos != null) {
                for (let x = 0; x < _self.searchList.length; x++) {
                    if (_self.searchList[x].epc != null) {
                        for (let y = 0; y < _self.inventoryInstanceDtos.length; y++) {
                            if (_self.searchList[x].epc == _self.inventoryInstanceDtos[y].epc) {
                                _self.inventoryInstanceDtos[y].exist = true;
                            }
                        }
                    }
                }
            }
        }
    },

    watch: {
        searchList: function (newValue, oldValue) {
            this.checkInSearchList();
        },
    }
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
