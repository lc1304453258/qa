<template>

  <div class="container-fluid">

    <Navbar :title="title">
      <span class="navbar-text" @click="save">保存&nbsp;&nbsp;</span>
    </Navbar>

    <h6></h6>

    <div slot="body">
      <div class="form-group">
        <label for="warehouseSelect">仓库</label>
        <div class="v-select-container">
          <v-select id="warehouseSelect" label="name" :options="warehouses" v-model="warehouse"></v-select>
        </div>
      </div>
      <div class="form-group">
        <label>货位名称</label>
        <input type="text" class="form-control" v-model.trim="positionName">
      </div>
      <div class="form-group">
        <label>货位编号</label>
        <input type="text" class="form-control" v-model.trim="positionNo">
      </div>
    </div>

  </div>



</template>

<script>
  //声明插件变量
  var Common = require("../common/Common.js");
  var Notify = require("../widget/Notify.js");
  var Loading = require("../common/Loading.js");
  var Modal = require("../widget/Modal.vue");
  var vSelect = require("vue-select");
  var Pagination = require("../widget/VueBootstrapPagination.vue");
  var Navbar = require("../widget/Navbar.vue");
  var WarehouseResource = require("../api/wms/WarehouseResource.js");
  var PositionResource = require("../api/wms/PositionResource.js");
  //开始
  module.exports = {

    //1.引入插件
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar,
      mui,
    },

    //2.双向绑定变量区
    data: function() {
      return {
        title: "新增货位",
        positionName: "",
        positionNo: "",
        warehouse: null,
        warehouses: [],

      }
    },

    //3.方法区
    methods: {

      //查询需要货位管理的仓库
      findByPositionManager: function() {
        var _self = this;
        var uuid = Loading.show();
        WarehouseResource.queryPositionManagerWarehouse().then(
          successData => {
            Loading.hide(uuid);
            _self.warehouses = successData;
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

      //保存新增货位
      save: function() {
        var _self = this;
        if (!this.positionName || !this.positionNo || !this.warehouse) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        PositionResource.generatePosition(_self.positionName, _self.positionNo, _self.warehouse.id).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("提示", "货位（名称：" + _self.positionName + "，编号：" +
              _self.positionNo + "，仓库：" + _self.warehouse.name + "）保存成功！", true);
            _self.findByPositionManager();
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

      //导航栏返回上一级
      back: function() {
        this.$router.push({
          path: '/desktop/PrintPosition',
        })
      },

    },

    //4.初始化页面
    mounted: function() {
      this.findByPositionManager();
    },

  }
</script>

<style scoped>


</style>
