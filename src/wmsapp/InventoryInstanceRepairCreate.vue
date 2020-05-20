<template>

  <div class="container-fluid">

    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back">{{title}}</span>
      <span class="navbar-text" @click="save">保存&nbsp;&nbsp;</span>
    </nav>

    <h6></h6>

    <div slot="body">
      <div>

        <div class="form-group">
          <label for="barCodeSelect">条形码</label>
          <div class="v-select-container">
            <v-select id="barCodeSelect" label="barCode" :options="barCodes" v-model="barCode"></v-select>
          </div>
        </div>

        <div class="form-group">
          <label>物料名称</label>
          <input type="text" class="form-control" v-model.trim="inventoryName" readonly="readonly">
        </div>

        <div class="form-group">
          <label>物料编码</label>
          <input type="text" class="form-control" v-model.trim="no" readonly="readonly">
        </div>

        <div class="form-group">
          <label>故障地点</label>
          <input type="text" class="form-control" v-model.trim="breakDownPosition">
        </div>

        <div class="form-group">
          <label>故障描述</label>
          <textarea v-model.trim="breakDownDescription" class="form-control"></textarea>
        </div>

        <div class="form-group">
          <label>备注</label>
          <textarea v-model.trim="remark" class="form-control"></textarea>
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
  var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
  var InventoryInstanceRepairResource = require("../api/wms/InventoryInstanceRepairResource.js");

  //开始
  module.exports = {

    //1.引入插件
    components: {
      Common,
      Notify,
      Loading,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar
    },

    //2.双向绑定变量区
    data: function() {
      return {
        title: "新增报修单",
        inventoryInstances: [],
        barCodes: [],
        barCode: "",
        breakDownPosition: "",
        breakDownDescription: "",
        remark: "",
        inventoryName: "",
        no: "",
        client: "",
        page: "",
        organization: "",
      }
    },

    //3.方法区
    methods: {

      //测试方法
      test: function() {
        alert("Successful entry method~!!!");
      },

      //物料实例查询
      queryAllInventoryInstance: function() {
        var _self = this;
        this.barCodes = [];
        this.inventoryInstances = [];
        var uuid = Loading.show();
        InventoryInstanceResource.queryAllInventoryInstance().then(
          successData => {
            Loading.hide(uuid);
            if (successData === undefined && successData.length === 0) {
              return
            }
            _self.inventoryInstances = successData.inventoryInstanceDtos;
            successData.inventoryInstanceDtos.forEach(function(inventoryInstance) {
              _self.barCodes.push(inventoryInstance.barCode + "(" + inventoryInstance.inventoryName + "," +
                inventoryInstance.no + ")")
            });
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

      //保存物料报修单
      save: function() {
        var _self = this;
        if (!this.barCode || !this.breakDownPosition || !this.breakDownDescription || !this.remark) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        InventoryInstanceRepairResource.generateInventoryInstanceRepair(_self.barCode.split("(")[0], _self.breakDownPosition,
          _self.breakDownDescription, _self.remark).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("提示", "物料报修单保存成功！", true);
            _self.back();
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
          path: '/desktop/InventoryInstanceRepair',
          query: {
            page: this.page
          }
        })
      },

    },

    //监听条形码的人为选择
    watch: {
      "barCode": {
        handler: function(to) {
          this.inventoryName = "";
          this.no = "";
          var str = to.split('(')[0];
          for (var i = 0; i < this.inventoryInstances.length; i++) {
            if (this.inventoryInstances[i].barCode == str) {
              this.inventoryName = this.inventoryInstances[i].inventoryName;
              this.no = this.inventoryInstances[i].no;
            }
          }
        },
        deep: true
      },
    },

    //4.初始化页面
    mounted: function() {
      this.queryAllInventoryInstance();
      this.page = this.$route.query.page;
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
