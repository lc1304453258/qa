<template>
    <div :id="accordion">
        <div class="card">
            <div class="card-header text-center bg-info">
                <span class="card-link text-white"
                      data-toggle="collapse"
                      :href="href">
                    {{bomInventory.no}},{{bomInventory.name}},{{bomInventory.type}}
                </span>
            </div>
            <div :id="id"
                 class="collapse"
                 :data-parent="dataParent">
                <div v-for="(data, index) in rfidBomComponentDtos"
                     :key="index">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>{{index+1}},{{data.inventory.no}},{{data.inventory.name}},{{data.inventory.type}}</div>
                        </div>
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPicture == true">
                                <ShowImage :imageNames="data.inventory.imageNames"
                                           :className="data.inventory.className"></ShowImage>
                            </div>
                            <div :class="(showPicture == true) ? 'col-9' : 'col-12'">
                                <div class="d-flex justify-content-between"
                                     v-if="rfidManagement == true">
                                    <div class="p-2">标准数量:{{data.baseQty}},实际数量:{{data.actualQuantity}}</div>
                                </div>
                                <div class="d-flex justify-content-between"
                                     v-if="rfidManagement == false && data.inventory.rfidManagement == true">
                                    <div class="p-2">
                                        <font size="2">标准数量:{{data.baseQty}}</font>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between"
                                     v-if="rfidManagement == false && data.inventory.rfidManagement == false">
                                    <div>
                                        <font size="2">标准数量:{{data.baseQty}}</font>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between"
                                     v-if="rfidManagement == false && data.inventory.rfidManagement == false">
                                    <div>
                                        实际数量:<input style="width: 4em"
                                               type="number"
                                               v-model="data.actualQuantity"></div>
                                    <div>
                                        补充数量:<input style="width: 4em"
                                               type="number"
                                               v-model="data.supplementaryQuantity"></div>

                                </div>
                            </div>
                        </div>
                        <div v-if="data.activeBom != undefined && data.activeBom != null">
                            <ShowBom :rfidBomComponentDto="data"
                                     :number="(index+num)"
                                     :showPictureOfApp="showPicture"
                                     :isRfid="rfidManagement"></ShowBom>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
var Common = require("../common/Common.js");
var ShowImage = require("../widget/imageWidget/ShowImage.vue");


module.exports = {
    name: "ShowBom",
    props: ["rfidBomComponentDto", "number", "showPictureOfApp", "isRfid"],

    data: function () {
        return {
            rfidBomComponentDtos: [],
            bom: {},
            bomInventory: {},
            id: 'collapseOne',
            href: '#collapseOne',
            dataParent: '#accordion',
            accordion: 'accordion',
            num: 0,
            showPicture: false,
            rfidManagement: undefined,
        }
    },

    components: {
        Common,
        ShowImage
    },

    methods: {
        queryData: function () {
            var _self = this;
            this.bom = this.rfidBomComponentDto;
            this.bomInventory = this.bom.inventory;
            if (this.rfidBomComponentDto.activeBom != undefined && this.rfidBomComponentDto.activeBom != null) {
                this.rfidBomComponentDto.activeBom.bomComponents.forEach(function (item) {
                    _self.rfidBomComponentDtos.push(item);
                });
            }
        }
    },

    mounted: function () {
        var _self = this;
        this.showPicture = this.showPictureOfApp;
        this.num = this.number + 1;
        this.id = this.id + this.num;
        this.href = this.href + this.num;
        this.dataParent = this.dataParent + this.num;
        this.accordion = this.accordion + this.num;
        this.rfidManagement = this.isRfid;
        _self.queryData();
    },
}
</script>

<style scoped>
.card-header {
    padding: 0.5rem 0.5rem;
}

.card-body {
    font-size: 0.8em;
    padding: 0.1rem;
}

.card-footer {
    padding: 0.1rem;
}
</style>