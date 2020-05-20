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
          <label>单位</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="client">
        </div>

        <div class="form-group">
          <label>部门</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="organization">
        </div>

        <div class="form-group">
          <label>报修单号</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="documentNo">
        </div>

        <div class="form-group">
          <label>物料名称</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryName">
        </div>

        <div class="form-group">
          <label>条形码</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="barCode">
        </div>

        <div class="form-group">
          <label>维修时间</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="finishDate">
        </div>

        <div class="form-group">
          <label>维修人员</label>
          <input type="text" class="form-control" v-model.trim="maintainUser">
        </div>

        <div class="form-group">
          <label>维修费用</label>
          <input type="text" class="form-control" v-model.trim="cost" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')">
        </div>

        <div class="form-group">
          <label>维修措施</label>
          <textarea v-model.trim="maintainMeasure" class="form-control"></textarea>
        </div>

        <div class="form-group">
          <label>维修结果</label>
          <textarea v-model.trim="maintainResult" class="form-control"></textarea>
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
  var InventoryRepairResultResource = require("../api/wms/InventoryRepairResultResource.js");
  var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");

  //开始
  module.exports = {

    //1.引入插件
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar,
    },

    //2.双向绑定变量区
    data: function() {
      return {
        title: "编辑物料维修单",
        inventoryInstances: [],
        barCodes: [],
        barCode: "",
        breakDownPosition: "",
        breakDownDescription: "",
        remark: "",
        inventoryName: "",
        finishDate: "",
        no: "",
        client: "",
        organization: "",
        cost: "",
        maintainMeasure: "",
        maintainResult: "",
        documentNo: "",
        breakDownDate: "",
        inventoryAdminName: "",
        maintainUser: "",
        id: "",
        oneTime: true,
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
              _self.barCodes.push(inventoryInstance.barCode)
            });
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

      //修改物料维修单
      save: function() {
        var _self = this;
        if (!this.maintainUser || !this.cost || !this.maintainMeasure || !this.maintainResult || !this.documentNo ||
          !this.barCode) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        InventoryRepairResultResource.editInventoryRepairResult(_self.maintainUser, _self.cost, _self.barCode,
          _self.maintainMeasure, _self.maintainResult, _self.documentNo, _self.id).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("提示", "物料维修单改成功！", true);
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
          path: '/desktop/InventoryRepairResult',
          query: {
            page: this.page,
          }
        })
      },

    },

    //监听条形码的人为选择
    watch: {
      "barCode": {
        handler: function(to) {
          for (var i = 0; i < this.inventoryInstances.length; i++) {
            if (this.inventoryInstances[i].barCode == to) {
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

      if (this.oneTime == this.$route.query.oneTime) {
        this.oneTime = false;
        this.$router.go(0);
      }
      this.client = this.$route.query.client;
      this.organization = this.$route.query.organization;
      this.documentNo = this.$route.query.documentNo;
      this.inventoryName = this.$route.query.inventoryName;
      this.barCode = this.$route.query.barCode;
      this.finishDate = this.$route.query.finishDate;
      this.maintainUser = this.$route.query.maintainUser;
      this.cost = this.$route.query.cost;
      this.maintainMeasure = this.$route.query.maintainMeasure;
      this.maintainResult = this.$route.query.maintainResult;
      this.id = this.$route.query.id;
      this.page = this.$route.query.page;
      // alert(this.id);

      this.queryAllInventoryInstance();
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
