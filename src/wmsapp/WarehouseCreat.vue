<template>

  <div class="container-fluid">

    <!--    <nav class="navbar navbar-fixed-top navbar-light bg-faded header">
      <a class="navbar-brand" href="javascript:void(0);">
        <span class="fa fa-arrow-circle-o-left back-icon" @click="back">返回</span>

        <span class="fa fa-save fa-pull-right save-icon" @click="save">保存</span>
      </a>
    </nav> -->
    <Navbar :title="title">
      <span class="navbar-text" @click="save">保存&nbsp;&nbsp;</span>
    </Navbar>
    <h6></h6>

    <div slot="body">
      <div>
        <div class="form-group">
          <label>仓库名称</label>
          <input type="text" class="form-control" v-model.trim="warehouseName">
        </div>
        <div class="form-group">
          <label>仓库编号</label>
          <input type="text" class="form-control" v-model.trim="warehouseNo">
        </div>
        <div class="checkbox">
          <label>
            是否货位管理
            <input type="checkbox" v-model="positionManager">
          </label>
        </div>
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
        title: "新增仓库",
        warehouseName: "",
        warehouseNo: "",
        positionManager: true,
      }
    },

    //3.方法区
    methods: {

      //保存新增仓库
      save: function() {
        var _self = this;
        if (!this.warehouseName || !this.warehouseNo) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        WarehouseResource.generateWarehouse(_self.warehouseName, _self.warehouseNo, _self.positionManager).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("提示", "仓库（名称：" + _self.warehouseName + "，编号：" +
              _self.warehouseNo + "）保存成功！", true);
            _self.warehouseName = "";
            _self.warehouseNo = "";
            _self.positionManager = true;
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(errorData);
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

    },

  }
</script>

<style scoped>
  .container-fluid {
    overflow-x: hidden;
  }

  /* 导航栏样式 */
  .header {
    margin-left: -29px;
    margin-right: -29px;
    padding-left: 29px;
  }

  .back-icon {
    font-size: 1.25em;
    line-height: 1.25em;
  }

  .save-icon {
    font-size: 1.25em;
    line-height: 1.25em;
  }
</style>
