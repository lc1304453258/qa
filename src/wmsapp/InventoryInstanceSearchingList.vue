<template>
    <div>
        <div class="card-group mescroll">
            <div v-for="(inventoryInstance, index) in targetInventoryInstances"
                 :key="inventoryInstance.id">
                <div class="card"
                     :key="inventoryInstance.id"
                     :class="inventoryInstance.styleName"
                     v-if="inventoryInstance.see">
                    <div class="card-header">
                        {{inventoryInstance.inventoryNo}}.{{inventoryInstance.inventoryName}}({{inventoryInstance.readCount}})
                    </div>
                    <div class="card-body">
                        <div>
                            <p class="card-text">序列号：{{inventoryInstance.inventoryInstanceNo}}</p>
                            <p class="card-text">电子编号：{{inventoryInstance.epc}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

var Common = require("../common/Common.js");
var InventoryInstanceSearchResource = require("../api/wms/InventoryInstanceSearchResource.js");
var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");


module.exports = {
    props: ["searchList"],

    components: {

    },

    data: function () {
        return {
            // ajax 是否正在查询
            ajaxRunning: false,
            inventoryInstances: [], //根据条件显示匹配到的存货实例
            targetInventoryInstances: [],
        }
    },
    methods: {
        /**
         * 清空界面搜索的数据
         */
        clear: function () {
            this.inventoryInstances.splice(0, this.inventoryInstances.length);
            this.targetInventoryInstances.splice(0, this.targetInventoryInstances.length);
        },

        /**
         * 扫描到epc操作流程
         */
        addEpc: function (epc) {
            var _self = this;
            let currentMs = new Date().getTime();

            let target = this.getInventoryInstanceByEpc(epc);
            if (target == null) {
                var temp = {
                    "epc": epc,
                    "inventoryId": "",
                    "inventoryName": "",
                    "inventoryNo": "",
                    "inventoryInstanceNo": "",
                    "status": 0,
                    "readCount": 1,// 读取次数
                    "lastSee": currentMs,
                    "see": false,
                    "styleName": 0,
                };
                _self.inventoryInstances.push(temp);
            } else {
                target.lastSee = currentMs;
                target.readCount++;
            }

        },

        /**
         * 判断epc是否在表格中
         */
        getInventoryInstanceByEpc: function (epc) {
            var _self = this;
            if (_self.inventoryInstances && epc) {
                for (var i = 0; i < _self.inventoryInstances.length; i++) {
                    if (_self.inventoryInstances[i].epc == epc) {
                        return _self.inventoryInstances[i];
                    }
                }
            }
            return null;
        },

        /**
         * 去服务器端查询物料序列号
         */
        findInventoryInstance: function () {
            var _self = this;
            if (_self.ajaxRunning) {
                console.log("上次查询未返回结果，本次查询暂时跳过。");
                return;
            }
            let epcList = [];
            _self.inventoryInstances.forEach(function (inventoryInstance) {
                if (inventoryInstance.status == 0) {
                    epcList.push(inventoryInstance.epc);
                    inventoryInstance.status = 1;
                }
            });

            if (epcList.length > 0) {
                _self.ajaxRunning = true;
                InventoryInstanceResource.findByEpcs(epcList).then(successData => {
                    _self.ajaxRunning = false;
                    for (let index = 0; index < successData.length; index++) {
                        _self.inventoryInstances.forEach(function (item) {
                            if (item.epc == successData[index].epc) {
                                item.inventoryId = successData[index].inventoryId;
                                item.inventoryName = successData[index].inventoryName;
                                item.inventoryNo = successData[index].inventoryNo;
                                item.inventoryInstanceNo = successData[index].no;
                                item.status = 2;
                            }
                        });
                    }
                }, errorData => {
                    _self.ajaxRunning = false;
                    _self.inventoryInstances.forEach(function (item) {
                        item.status = 0;
                    });
                    console.log("InventoryInstanceResource.findByEpcs查询失败。");
                    console.log(errorData);
                });
            }

        },

        /**
         * 计算目标存货实例
         */
        computerTargetInventoryInstances: function () {
            var _self = this;
            let currentMs = new Date().getTime();
            if (_self.searchList != null && _self.inventoryInstances != null) {
                for (let x = 0; x < _self.searchList.length; x++) {
                    let searchItem = _self.searchList[x];

                    if (searchItem.epc != null) {
                        for (let y = 0; y < _self.inventoryInstances.length; y++) {
                            let inventoryInstanceY = _self.inventoryInstances[y];
                            if (searchItem.epc == inventoryInstanceY.epc) {
                                if (inventoryInstanceY.see != true) {
                                    _self.targetInventoryInstances.push(inventoryInstanceY);
                                    inventoryInstanceY.see = true;
                                }
                            }
                        }
                    } else if (searchItem.inventoryId != null) {
                        for (let z = 0; z < _self.inventoryInstances.length; z++) {
                            let inventoryInstanceZ = _self.inventoryInstances[z];
                            if (searchItem.inventoryId == inventoryInstanceZ.inventoryId) {
                                if (inventoryInstanceZ.see != true) {
                                    _self.targetInventoryInstances.push(inventoryInstanceZ);
                                    inventoryInstanceZ.see = true;
                                }
                            }
                        }
                    }
                }
            }

            if (_self.targetInventoryInstances != null) {
                _self.targetInventoryInstances.forEach(function (targetInventoryInstance) {
                    let value = currentMs - targetInventoryInstance.lastSee;
                    if (value <= 1000) {
                        targetInventoryInstance.styleName = "";
                    } else if (value > 1000 && value <= 2000) {
                        targetInventoryInstance.styleName = "bg-danger1";
                    } else if (value > 2000 && value <= 3000) {
                        targetInventoryInstance.styleName = "bg-danger2";
                    } else if (value > 3000 && value <= 4000) {
                        targetInventoryInstance.styleName = "bg-danger3";
                    } else if (value > 4000) {
                        targetInventoryInstance.styleName = "bg-danger4";
                    }
                });
            }
        }
    },

    mounted: function () {
        var _self = this;
        plugin.rfidMiddleware.start();
        plugin.rfidMiddleware.readEvent = function (epc) {
            _self.addEpc(epc);
            return "success";
        }
        _self.interval = window.setInterval(function () {
            _self.findInventoryInstance();
            _self.computerTargetInventoryInstances();
        }, 500);


        // 测试数据
        // _self.testCount = 0;
        // window.setInterval(function () {
        //     _self.testCount++;
        //     if ((parseInt(_self.testCount / 20)) % 2 == 0) {
        //         _self.addEpc("100000000000000000000000");
        //         _self.addEpc("100000000000000000000489");
        //         _self.addEpc("100000000000000000000490");
        //     }
        // }, 250);
    },

    beforeDestroy: function () {
        var _self = this;
        plugin.rfidMiddleware.stop();
        plugin.rfidMiddleware.stopInventory();
        if (_self.interval != null) {
            window.clearInterval(_self.interval);
        }
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

.bg-danger1 {
    background-color: #efa9af !important;
}

.bg-danger2 {
    background-color: #de6e78 !important;
}

.bg-danger3 {
    background-color: #dc505d !important;
}

.bg-danger4 {
    background-color: #dc3545 !important;
}
</style>
