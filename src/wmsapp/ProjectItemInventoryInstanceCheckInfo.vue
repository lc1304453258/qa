<template>
  <div class="container-fluid">
    <Navbar title="项目检查单详情"></Navbar>
    <h6></h6>

    <div class="d-flex" style="margin-top:7px">
      <div class="flex-grow-1">
        <input type="button" class="form-control" v-model="checkVouchNoAndName" />
      </div>
    </div>
    <p></p>
    <div class="clear-fix"></div>

    <div style="margin-top:-10px;">
      <ul class="nav nav-pills nav-fill tab" style="font-size: 11px;">
        <!-- 所有inventory -->
        <li class="nav-item" @click="selectTab('instance')">
          <a class="nav-link" id="nav-link1" :class="{'active': (selectedTab === 'instance')}" href="javascript:void(0)">物料信息{{instanceDto.length}}</a>
        </li>
        <li class="nav-item" @click="selectTab('lostInstance')">
          <a class="nav-link" id="nav-link2" :class="{'active': (selectedTab === 'lostInstance')}" href="javascript:void(0)">缺失物料{{lostInstance.length}}</a>
        </li>
        <li class="nav-item" @click="selectTab('errorInstance')">
          <a class="nav-link" id="nav-link3" :class="{'active': (selectedTab === 'errorInstance')}" href="javascript:void(0)">误用物料{{errorInstance.length}}</a>
        </li>
      </ul>
    </div>

    <div v-show="selectedTab == 'instance'">
      <div v-for="(data, index) in instanceDto" :key="index">
        <div class="card">
          <div class="card-header" :class="'bg-light'">
            {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}{{(data.inventoryClassName == "") ? "" : "("+data.inventoryClassName+")"}}
          </div>
          <div class="card-body">
              <div class="p-2">epc：{{data.epc}}</div>
              <div class="d-flex justify-content-between">
                <div class="p-2">数量：{{data.quantity}}</div>
                <div class="p-2">检查数量：{{data.scanQuantity}}</div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="selectedTab == 'lostInstance'">
      <div v-for="(data, index) in lostInstance" :key="index">
        <div class="card">
          <div class="card-header" :class="'bg-light'">
            {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}{{(data.inventoryClassName == "") ? "" : "("+data.inventoryClassName+")"}}
          </div>
          <div class="card-body">
              <div class="p-2">epc：{{data.epc}}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="selectedTab == 'errorInstance'">
      <div v-for="(data, index) in errorInstance" :key="index">
        <div class="card">
          <div class="card-header" :class="'bg-light'">
            {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}{{(data.inventoryClassName == "") ? "" : "("+data.inventoryClassName+")"}}
          </div>
          <div class="card-body">
              <div class="p-2">epc：{{data.epc}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  var Common = require("../common/Common.js");
  var Loading = require("../common/Loading.js");
  var Notify = require("../widget/Notify.js");
  var ProjectItemResource = require("../api/commom/ProjectItemResource.js");
  var ProjectItemCheckVouchResource = require("../api/wms/ProjectItemCheckVouchResource.js");
  var ProjectItemCheckVouchLineResource = require("../api/wms/ProjectItemCheckVouchLineResource.js");
  var Modal = require("../widget/Modal.vue");
  var Navbar = require("../widget/Navbar.vue");
  var VuePicker = require("../widget/VuePicker/VuePicker.vue");
  var PullTo = require('vue-pull-to').default;
  var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");
  var MescrollVue = require("mescroll.js/mescroll.vue");
  var ShowImage = require("../widget/imageWidget/ShowImage.vue");
  var ShowComponent = require("../widget/ShowComponent.vue");
  var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

  module.exports = {

    components: {
      VuePicker,
      Modal,
      Navbar,
      PullTo,
      ImageEditor,
      MescrollVue,
      ShowImage,
      ShowComponent
    },

    data: function() {
      return {
        checkVouchId: "",
        checkVouchNoAndName: "",
        selectedTab: 'instance',
        showEpc: false,
        clickCount: 0,
        instanceDto: [],
        lostInstance: [],
        errorInstance: [],
      }
    },

    methods: {
      /**
       *  选择页签?
       */
      selectTab: function(tab) {
        if (this.selectedTab == tab) {
          this.clickCount++;
        } else {
          this.clickCount = 0;
        }
        if (this.clickCount > 10) {
          this.showEpc = true;
        }
        this.selectedTab = tab;
      },
      /**
       *  根据id查询项目物料检查单?
       */
      findCheckVouchById: function(checkVouchId) {
        var _self = this;
        ProjectItemCheckVouchResource.findCheckVouchById(checkVouchId).then(
          successData => {
            successData.forEach(function(item) {
              item.isDisplay = true;
              _self.instanceDto.push(item)
              if (item.checkType == 2) {
                _self.lostInstance.push(item)
              } else if (item.checkType == 3) {
                _self.errorInstance.push(item)
              }
            });
          },
          errorData => {
            Common.processException(errorData);
          });
      },
    },

    mounted: function() {
      var _self = this;
      _self.checkVouchId = _self.$route.query.checkVouchId;
      _self.checkVouchNoAndName = _self.$route.query.checkVouchNoAndName;
      var id = _self.checkVouchId;
      _self.findCheckVouchById(id);
    }
  }
</script>

<style scoped>
  .nav-fill {
    margin-top: -5px;
  }

  .card {
    margin-top: 5px;
    width: 100%;
  }

  .card-header {
    padding: 0.2rem 0.2rem;
  }

  .card-body {
    font-size: 0.8em;
    padding: 0.2rem;
  }

  .card-footer {
    font-size: 0.8em;
    padding: 0.1rem;
  }

  .mescroll {
    position: fixed;
    top: 10rem;
    bottom: 0;
    height: auto;
    left: 0;
    right: 0;
    padding-left: 15px;
    padding-right: 15px;
  }

  .select-project {
    margin-left: 10px;
    width: 80px;
  }
</style>
