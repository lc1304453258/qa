<template>
  <div class="container-fluid">

    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back">{{title}}</span>
      <span class="navbar-text" @click="addInventoryRepairResult">新增&nbsp;&nbsp;</span>
    </nav>

    <h6></h6>
    <div>
      <fieldset class="form-group">
        <div class="input-group">
          <input id="barcode-input" type="text" class="form-control" placeholder="输入单号/条形码/故障信息等..." v-model.trim="message"
            @keydown="keydown($event)">
          <button type="button" class="fa fa-search" @click="queryInventoryRepairResultBtn"></button>
        </div>
      </fieldset>

    </div>

    <div class="card-group m-card-item" v-if="(inventoryRepairResults == undefined || inventoryRepairResults.length == 0)">
      <div class="card bg-light">
        <div class="card-header">序号.报修单号</div>
        <div class="card-body">
          <p class="card-text">物料名称</p>
          <p class="card-text">物料条形码</p>
          <p class="card-text">维修措施</p>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryRepairResults"
        @click="queryInventoryRepirResultById(index)">
        <div class="card bg-light">
          <div class="card-header">{{index + 1}}.报修单号：{{data.documentNo}}</div>
          <div class="card-body">
            <p class="card-text">物料名称：{{data.inventoryInstanceName}}</p>
            <p class="card-text">物料条形码：{{data.barCode}}</p>
            <p class="card-text">维修措施：{{data.maintainMeasure}}</p>
          </div>
        </div>
      </div>
    </div>

    <Modal ref="modal2" title="物料维修单详情" large="true">
      <div slot="body">
        <div>
          <div class="form-group">
            <label>报修单号</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="documentNo">
          </div>
          <div class="form-group">
            <label>物料名称</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceName">
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
            <input type="text" class="form-control" readonly="readonly" v-model.trim="maintainUser">
          </div>
          <div class="form-group">
            <label>维修费用</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="cost">
          </div>
          <div class="form-group">
            <label>维修措施</label>
            <textarea v-model.trim="maintainMeasure" class="form-control" readonly="readonly"></textarea>
          </div>
          <div class="form-group">
            <label>维修结果</label>
            <textarea v-model.trim="maintainResult" class="form-control" readonly="readonly"></textarea>
          </div>
        </div>
      </div>
      <div slot="footer">
        <span class="fa fa-wrench fa-pull-right addTo-icon" @click="edit">编辑</span>
      </div>
    </Modal>

    <Pagination :pagination="pagination" :callback="queryInventoryRepairResult" :options="paginationOptions" v-if="inventoryRepairResults.length > 0"
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
  var InventoryRepairResultResource = require("../api/wms/InventoryRepairResultResource.js");
  var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");

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
        title: "物料维修",
        message: "",
        id: "",
        recordIds: [],
        inventoryInstanceRepairDtos: [],
        inventoryRepairResults: [],
        inventoryInstances: [],
        documentNo: "",
        inventoryInstanceName: "",
        inventoryNo: "",
        barCode: "",
        barCodes: [],
        inventoryInstanceNames: [],
        documentNos: [],
        breakDownDescriptions: [],
        inventoryAdminName: "",
        breakDownDate: "",
        breakDownPosition: "",
        breakDownDescription: "",
        maintainMeasure: "",
        finishDate: "",
        maintainResult: "",
        maintainUser: "",
        cost: "",
        bc: "",
        client: "",
        organization: "",
        remark: "",
        name: "",
        bdd: "",
        dn: "",
        iin: "",
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

      //导航栏返回上一级
      back: function() {
        this.$router.push('/desktop/dashboard');
      },

      //编辑当前报修单
      edit: function() {

        this.$router.push({
          path: '/desktop/InventoryRepairResultUpdate',
          query: {
            client: this.client,
            organization: this.organization,
            documentNo: this.documentNo,
            inventoryName: this.inventoryInstanceName,
            barCode: this.barCode,
            finishDate: this.finishDate,
            maintainUser: this.maintainUser,
            cost: this.cost,
            maintainMeasure: this.maintainMeasure,
            maintainResult: this.maintainResult,
            id: this.id,
            page: this.pagination.current_page,
            oneTime: true,
          }
        })
      },

      queryInventoryRepairResultBtn: function() {
        this.initPagination();
        this.queryInventoryRepairResult();
      },

      queryInventoryRepirResultById: function(index) {
        this.inventoryInstanceName = this.inventoryRepairResults[index].inventoryInstanceName;
        this.documentNo = this.inventoryRepairResults[index].documentNo;
        this.barCode = this.inventoryRepairResults[index].barCode;
        this.finishDate = this.inventoryRepairResults[index].finishDate;
        this.maintainUser = this.inventoryRepairResults[index].maintainUser;
        this.cost = this.inventoryRepairResults[index].cost;
        this.maintainMeasure = this.inventoryRepairResults[index].maintainMeasure;
        this.maintainResult = this.inventoryRepairResults[index].maintainResult;
        this.client = this.inventoryRepairResults[index].client;
        this.organization = this.inventoryRepairResults[index].organization;
        this.id = this.inventoryRepairResults[index].id;
        this.$refs.modal2.show();
      },


      //跳转新的页面
      addInventoryRepairResult: function() {
        this.$router.push({
          path: '/desktop/InventoryRepairResultCreate',
          query: {
            page: this.pagination.current_page,
          }
        })
        this.breakDownPosition = "";
        this.breakDownDescription = "";
        this.remark = "";
        this.barCode = "";
      },

      modalCancel1: function() {
        this.$refs.modal1.hide();
      },

      keydown: function(event) {
        if (event.keyCode == 13) {
          this.pagination.current_page = 1;
          this.queryInventoryRepairResult();
        }
      },

      //全查询物料明细
      queryInventoryRepairResult: function() {
        var _self = this;
        this.inventoryRepairResults = [];
        var uuid = Loading.show();
        InventoryRepairResultResource.queryByNameOrNo(_self.message, _self.pagination.current_page, _self.pagination
          .per_page).then(
          successData => {
            Loading.hide(uuid);
            //添加警告框
            if (successData == null) {
              Notify.error("提示", "当前没有更多数据了！", "true");
              return;
            }
            _self.inventoryRepairResults = successData.inventoryRepairResults;
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

    watch: {
      "bc": {
        handler: function(to) {
          this.$refs.ad.clearSelection();
          var _self = this;
          this.documentNos = [];
          this.breakDownDescriptions = [];
          this.breakDownDescription = "";
          var uuid = Loading.show();
          $.ajax({
            url: Common.getApiURL("inventoryInstanceRepairResource/inventoryInstanceRepairsByBarCode?barCode=") +
              to,
            type: "get",
            beforeSend: function(request) {
              Common.addTokenToRequest(request);
            },
            success: function(data) {
              Loading.hide(uuid);
              for (var i = 0; i < data.length; i++) {
                _self.documentNos.push(data[i].documentNo)
                _self.inventoryInstanceName = data[0].inventoryInstanceName;
                _self.breakDownDescriptions.push(data[i].breakDownDescription);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              Loading.hide(uuid);
              Common.processException(XMLHttpRequest, textStatus, errorThrown);
            }
          });
        },
        deep: true
      },
      "dn": {
        handler: function(to) {
          if (to != null) {
            for (var i = 0; i < this.documentNos.length; i++) {
              if (to == this.documentNos[i]) {
                this.breakDownDescription = this.breakDownDescriptions[i]
              }
            }
          }
        },
        deep: true
      },
    },

    //初始化页面查询
    mounted: function() {
      if (this.$route.query.page == undefined) {
        this.pagination.current_page = 1;
      } else {
        this.pagination.current_page = this.$route.query.page;
      }
      this.queryInventoryRepairResult();
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
