<template>
  <div class="container-fluid">

    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back">{{title}}</span>
      <span class="navbar-text" @click="addInventoryInstanceRepair">新增&nbsp;&nbsp;</span>
    </nav>

    <h6></h6>

    <div>
      <fieldset class="form-group">
        <div class="input-group">
          <input id="barcode-input" type="text" class="form-control" placeholder="输入单号/条形码/故障信息等..." v-model.trim="message"
            @keydown="keydown($event)">
          <button type="button" class="fa fa-search" @click="queryInventoryInstanceRepairBtn"></button>
        </div>
      </fieldset>

    </div>

    <div class="card-group m-card-item" v-if="(inventoryInstanceRepairs == undefined || inventoryInstanceRepairs.length == 0)">
      <div class="card bg-light">
        <div class="card-header">序号.报修单号</div>
        <div class="card-body">
          <p class="card-text">物料名称</p>
          <p class="card-text">物料条形码</p>
          <p class="card-text">故障描述</p>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryInstanceRepairs"
        @click="queryInventoryInstanceRepirById(index)">
        <div class="card bg-light">
          <div class="card-header">{{index + 1}}.报修单号：{{data.documentNo}}</div>
          <div class="card-body">
            <p class="card-text">物料名称：{{data.inventoryInstanceName}}</p>
            <p class="card-text">物料条形码：{{data.barCode}}</p>
            <p class="card-text">故障描述：{{data.breakDownDescription}}</p>
          </div>
        </div>
      </div>
    </div>

    <Modal ref="modal2" title="物料报修单详情" large="true">
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
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceName">
          </div>
          <div class="form-group">
            <label>物料编号</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryNo">
          </div>
          <div class="form-group">
            <label>物料条形码</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="barCode">
          </div>
          <div class="form-group">
            <label>物料管理员</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryAdminName">
          </div>
          <div class="form-group">
            <label>故障时间</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="breakDownDate">
          </div>
          <div class="form-group">
            <label>故障地点</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="breakDownPosition">
          </div>
          <div class="form-group">
            <label>故障描述</label>
            <textarea readonly="readonly" v-model.trim="breakDownDescription" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label>备注</label>
            <textarea readonly="readonly" v-model.trim="remark" class="form-control"></textarea>
          </div>
        </div>
      </div>
      <div slot="footer">
        <span class="fa fa-wrench fa-pull-right addTo-icon" @click="edit">编辑</span>
      </div>
    </Modal>

    <Pagination :pagination="pagination" :callback="queryInventoryInstanceRepair" :options="paginationOptions" v-if="inventoryInstanceRepairs.length > 0"
      :size="'small'"></Pagination>

  </div>
</template>

<script>
  var Common = require("../common/Common.js");
  var Notify = require("../widget/Notify.js");
  var Loading = require("../common/Loading.js");
  var Modal = require("../widget/Modal.vue");
  var vSelect = require("vue-select");
  var Pagination = require("../widget/VueBootstrapPagination.vue");
  var Navbar = require("../widget/Navbar.vue");
  var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
  var InventoryInstanceRepairResource = require("../api/wms/InventoryInstanceRepairResource.js");

  module.exports = {
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar,
    },

    data: function() {
      return {
        title: "物料报修",
        message: "",
        recordIds: [],
        inventoryInstanceRepairs: [],
        inventoryInstances: [],
        documentNo: "",
        inventoryInstanceName: "",
        inventoryNo: "",
        barCode: "",
        inventoryAdminName: "",
        breakDownDate: "",
        breakDownPosition: "",
        breakDownDescription: "",



        client: "",
        organization: "",
        remark: "",
        pagination: {
          total: 0,
          per_page: 20,
          current_page: 1,
          last_page: 0,
          from: 1,
          to: 10
        },
        paginationOptions: {
          offset: 5,
          previousText: '上一页',
          nextText: '下一页',
          alwaysShowPrevNext: true
        },
        positionManager: true,
      }
    },

    methods: {
      test: function() {
        printTest();
      },

      //编辑当前报修单
      edit: function() {
        this.$router.push({
          path: '/desktop/InventoryInstanceRepairUpdate',
          query: {
            client: this.client,
            organization: this.organization,
            inventoryInstanceName: this.inventoryInstanceName,
            inventoryNo: this.inventoryNo,
            documentNo: this.documentNo,
            barCode: this.barCode,
            inventoryAdminName: this.inventoryAdminName,
            breakDownDate: this.breakDownDate,
            breakDownPosition: this.breakDownPosition,
            breakDownDescription: this.breakDownDescription,
            remark: this.remark,
            page: this.pagination.current_page,
            oneTime: true,
          }
        })
      },

      //导航栏返回上一级
      back: function() {
        this.$router.push('/desktop/dashboard');
      },

      initPagination: function() {
        this.pagination = {
          total: 0,
          per_page: 20,
          current_page: 1,
          last_page: 0,
          from: 1,
          to: 10
        };
        this.paginationOptions = {
          offset: 5,
          previousText: '上一页',
          nextText: '下一页',
          alwaysShowPrevNext: true
        };
      },

      queryInventoryInstanceRepairBtn: function() {
        this.initPagination();
        this.queryInventoryInstanceRepair();
      },

      //跳转新的页面
      addInventoryInstanceRepair: function() {
        this.$router.push({
          path: '/desktop/InventoryInstanceRepairCreate',
          query: {
            page: this.pagination.current_page
          }
        })
        this.breakDownPosition = "";
        this.breakDownDescription = "";
        this.remark = "";
        this.barCode = "";
      },

      queryInventoryInstanceRepirById: function(index) {
        this.client = this.inventoryInstanceRepairs[index].client;
        this.organization = this.inventoryInstanceRepairs[index].organization;
        this.inventoryInstanceName = this.inventoryInstanceRepairs[index].inventoryInstanceName;
        this.inventoryNo = this.inventoryInstanceRepairs[index].inventoryNo;
        this.documentNo = this.inventoryInstanceRepairs[index].documentNo;
        this.barCode = this.inventoryInstanceRepairs[index].barCode;
        this.inventoryAdminName = this.inventoryInstanceRepairs[index].inventoryAdminName;
        this.breakDownDate = this.inventoryInstanceRepairs[index].breakDownDate;
        this.breakDownPosition = this.inventoryInstanceRepairs[index].breakDownPosition;
        this.breakDownDescription = this.inventoryInstanceRepairs[index].breakDownDescription;
        this.remark = this.inventoryInstanceRepairs[index].remark;
        this.$refs.modal2.show();
      },

      modalCancel1: function() {
        this.$refs.modal1.hide();
      },

      keydown: function(event) {
        if (event.keyCode == 13) {
          this.pagination.current_page = 1;
          this.queryInventoryInstanceRepair();
        }
      },

      //将查询结果在初始化页面
      queryInventoryInstanceRepair: function() {
        var _self = this;
        this.inventoryInstanceRepairs = [];
        var uuid = Loading.show();
        InventoryInstanceRepairResource.queryByNameOrNo(_self.message, _self.pagination.current_page, _self.pagination
          .per_page).then(
          successData => {
            Loading.hide(uuid);
            //添加警告框
            if (successData == null) {
              Notify.error("提示", "当前没有更多数据了！", "true");
              return;
            }
            _self.inventoryInstanceRepairs = successData.inventoryInstanceRepairs;
            var size = successData.totalSize;
            _self.pagination.last_page = Math.ceil(size / _self.pagination.per_page);
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

      //物料卡片全查询
      queryAllInventoryInstance: function() {
        var _self = this;
        this.inventoryInstances = [];
        var uuid = Loading.show();
        InventoryInstanceResource.queryAllInventoryInstance().then(
          successData => {
            Loading.hide(uuid);
            if (successData === undefined && successData.length === 0) {
              return
            }
            successData.inventoryInstanceDtos.forEach(function(inventoryInstance) {
              _self.inventoryInstances.push(inventoryInstance.barCode)
            });
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

    },

    //初始化页面查询
    mounted: function() {
      if (this.$route.query.page == undefined) {
        this.pagination.current_page = 1;
      } else {
        this.pagination.current_page = this.$route.query.page;
      }
      this.queryInventoryInstanceRepair();
      this.queryAllInventoryInstance();
    }
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

  .addTo-icon {
    font-size: 1.25em;
    line-height: 1.25em;
  }
</style>
