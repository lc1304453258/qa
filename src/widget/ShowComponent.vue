<template>
    <div :id="accordion">
        <div class="card">
            <div class="card-header text-center bg-info">
                <span class="card-link text-white"
                      data-toggle="collapse"
                      :href="href">
                    {{componentDto.no == undefined ? componentDto.inventoryNo:componentDto.no}},{{componentDto.name == undefined ? componentDto.inventoryName:componentDto.name}}
                </span>
            </div>
            <div :id="id"
                 class="collapse"
                 :data-parent="dataParent">
                <div v-for="(data, index) in componentDtos"
                     :key="index">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div>{{index+1}},{{data.inventoryNo}},{{data.inventoryName}}</div>
                        </div>
                        <div class="row">
                            <div class="col-3"
                                 v-if="showPicture == true">
                                <ShowImage :imageNames="data.imageName"
                                           :className="data.className"></ShowImage>
                            </div>
                            <div :class="(showPicture == true) ? 'col-9' : 'col-12'">
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">检查数量:{{data.quantity}},扫描数量:{{data.scanQuantity}}</div>
                                </div>
                            </div>
                        </div>
                        <div v-show="data.projectItemCheckVouchLineDtos != undefined && data.projectItemCheckVouchLineDtos.length > 0">
                            <ShowComponent :component="data"
                                           :number="index+num"
                                           :showPictureOfApp="showPicture"></ShowComponent>
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
    name: "ShowComponent",
    props: ["component", "number", "showPictureOfApp"],

    data: function () {
        return {
            componentDtos: [],
            componentDto: {},
            id: 'collapseOne',
            href: '#collapseOne',
            dataParent: '#accordion',
            accordion: 'accordion',
            num: 0,
            showPicture: false,
        }
    },

    components: {
        Common,
        ShowImage
    },

    methods: {
        queryData: function () {
            var _self = this;
            this.componentDto = this.component;
            this.componentDtos = this.component.projectItemCheckVouchLineDtos;
            this.showPicture = this.showPictureOfApp;
        }
    },

    mounted: function () {
        this.showPicture = this.showPictureOfApp;
        this.num = this.number + 1;
        this.id = this.id + this.num;
        this.href = this.href + this.num;
        this.dataParent = this.dataParent + this.num;
        this.accordion = this.accordion + this.num;
        this.queryData();
    },
}
</script>

<style scoped>
.card-body {
    padding: 0.25rem;
}
</style>