<template>
  <div class="container-fluid">

    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back">{{title}}</span>
      <span class="navbar-text" @click="addInventoryInstanceMaintainLine">新增&nbsp;&nbsp;</span>
    </nav>

    <h6></h6>

    <div>
      <fieldset class="form-group">
        <div class="input-group">
          <input id="barcode-input" type="text" class="form-control" placeholder="输入单号/保养人/物料名称/备注等..." v-model.trim="message"
            @keydown="keydown($event)">
          <button type="button" class="fa fa-search" @click="queryInventoryInstanceMaintainLineBtn"></button>
        </div>
      </fieldset>
    </div>

    <div class="card-group m-card-item" v-if="(inventoryInstanceMaintainLines == undefined || inventoryInstanceMaintainLines.length == 0)">
      <div class="card bg-light">
        <div class="card-header">序号.物料保养单号</div>
        <div class="card-body">
          <p class="card-text">物料名称</p>
          <p class="card-text">保养人</p>
          <p class="card-text">备注</p>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in inventoryInstanceMaintainLines"
        @click="queryInventoryInstanceMaintainLineByOneClick(index)">
        <div class="card bg-light">
          <div class="card-header">{{index + 1}}.物料保养单号：{{data.documentNo}}</div>
          <div class="card-body">
            <p class="card-text">物料名称：{{data.inventoryInstanceName}}</p>
            <p class="card-text">保养人：{{data.maintainUserName}}</p>
            <p class="card-text">备注：{{data.description}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 点击查看详情页面 -->
    <Modal ref="modal2" title="物料保养单详情" large="true">
      <div slot="body">
        <div>
          <div class="form-group">
            <label>物料保养单号</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.documentNo">
          </div>
          <div class="form-group">
            <label>物料名称</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.inventoryInstanceName">
          </div>
          <div class="form-group">
            <label>物料编号</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.barCode">
          </div>
          <div class="form-group">
            <label>保养人</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.maintainUserName">
          </div>
          <div class="form-group">
            <label>保养耗时</label>
            <input type="text" class="form-control" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.maintainUsedHours"
              readonly="readonly">
          </div>
          <div class="form-group">
            <label>保养费用</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.cost">
          </div>
          <div class="form-group">
            <label>实际保养内容</label>
            <textarea type="text" class="form-control" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.content"
              readonly="readonly"></textarea>
          </div>
          <div class="form-group">
            <label>应保养时间</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.shouldMaintainTime">
          </div>
          <div class="form-group">
            <label>实际保养时间</label>
            <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.actualMaintainTime">
          </div>
        </div>
      </div>
      <div slot="footer">
        <span class="fa fa-wrench fa-pull-right addTo-icon" @click="edit">编辑</span>
      </div>
    </Modal>
    <!-- 分页插件 -->
    <Pagination :pagination="pagination" :callback="queryInventoryInstanceMaintainLine" :options="paginationOptions"
      v-if="inventoryInstanceMaintainLines.length > 0" :size="'small'"></Pagination>

  </div>
</template>

<script>
  //引入插件1
  var Common = require("../common/Common.js");
  var Notify = require("../widget/Notify.js");
  var Loading = require("../common/Loading.js");
  var Modal = require("../widget/Modal.vue");
  var vSelect = require("vue-select");
  var Pagination = require("../widget/VueBootstrapPagination.vue");
  var Navbar = require("../widget/Navbar.vue");
  var InventoryInstanceResource = require("../api/commom/InventoryInstanceResource.js");
  var InventoryInstanceMaintainLineResource = require("../api/wms/InventoryInstanceMaintainLineResource.js");

  module.exports = {

    //引入插件2
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar,
    },

    //定义返回值
    data: function() {
      return {
        title: "物料保养",

        message: "", //搜索框内的字符串信息
        recordIds: [],
        inventoryInstanceMaintainLines: [], //查询保养单明细详情
        inventoryInstanceMaintainLines1: [],
        inventoryInstanceMaintainLinesOfOneClick: [], //点击查看的单条保养单详情
        barCodes: [], //物料卡片编号数组
        barCode: "", //物料卡片编号
        inventoryInstances: [], //物料卡片数组
        inventoryName: "", //物料卡片名称
        documentNos: [],
        documentNo: "",
        maintainUserName: "",
        description: "",
        inventoryInstanceMaintainLinePlans: [],
        inventoryInstanceMaintainLinePlanDocumentNos: [],
        inventoryInstanceMaintainLinePlanDocumentNo: "",
        maintainContent: "", //保养内容
        componentName: "",
        description: "",
        cost: "",
        maintainUsedHours: "",
        inventoryInstanceMaintainLinePlanDescription: "",
        id: "",
        content: "",

        oneTime: true,

        //分页相关变量1
        pagination: {
          total: 0,
          per_page: 20,
          current_page: 1,
          last_page: 0,
          from: 1,
          to: 10
        },

        //分页相关变量2
        paginationOptions: {
          offset: 5,
          previousText: '上一页',
          nextText: '下一页',
          alwaysShowPrevNext: true
        },
        positionManager: true,
      }
    },

    //方法区
    methods: {

      //设置当前页为首页
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

      //查询按钮事件
      queryInventoryInstanceMaintainLineBtn: function() {
        this.initPagination(); //设置当前页为首页
        this.queryInventoryInstanceMaintainLine(); //根据搜索框的信息message 和 当前页码 与每页信息条数来查询基础信息
      },

      //添加按钮事件
      addInventoryInstanceMaintainLine: function() {
        this.$router.push({
          path: '/desktop/InventoryInstanceMaintainLineCreate',
          query: {
            page: this.pagination.current_page,
            oneTime: true,
          }
        })
      },

      //点击查看详情
      queryInventoryInstanceMaintainLineByOneClick: function(index) {
        this.indexOfUpdate = index;
        this.inventoryInstanceMaintainLinesOfOneClick = this.inventoryInstanceMaintainLines[index];
        this.$refs.modal2.show();
      },

      //编辑当前报修单
      edit: function() {
        this.$router.push({
          path: '/desktop/InventoryInstanceMaintainLineUpdate',
          query: {
            indexOfUpdate: this.indexOfUpdate,
            pageOfUpdate: this.pagination.current_page,
            page: this.pagination.current_page,
            oneTime: true,
          }
        })
      },

      modalCancel1: function() {
        this.$refs.modal1.hide();
      },


      //回车按键事件
      keydown: function(event) {
        if (event.keyCode == 13) {
          this.pagination.current_page = 1;
          this.queryInventoryInstanceMaintainLine();
        }
      },

      //物料卡片全查询
      queryAllInventoryInstance: function() {
        var _self = this;
        this.inventoryInstances = [];
        var uuid = Loading.show();

        InventoryInstanceResource.queryAllInventoryInstance().then(
          successData => {
            Loading.hide(uuid);
            _self.inventoryInstances = successData.inventoryInstanceDtos
            if (successData === undefined && successData.length === 0) {
              return
            }
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

      //根据搜索框的信息message 和 当前页码 与每页信息条数来查询基础信息
      queryInventoryInstanceMaintainLine: function() {
        var _self = this;
        this.inventoryInstanceMaintainLines = [];
        var uuid = Loading.show();

        InventoryInstanceMaintainLineResource.queryByNameOrNo(_self.message, _self.pagination.current_page, _self.pagination
          .per_page).then(
          successData => {
            Loading.hide(uuid);
            if (successData == null) {
              Notify.error("提示", "当前没有更多数据了！", "true");
              return;
            }
            _self.inventoryInstanceMaintainLines = successData.inventoryInstanceMaintainLines;
            var size = successData.totalSize;
            _self.pagination.last_page = Math.ceil(size / _self.pagination.per_page);

          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );

      },

      //全查询物料保养明细
      queryAllInventoryInstanceMaintainLine: function() {
        var _self = this;
        this.inventoryInstanceMaintainLines = [];
        var uuid = Loading.show();

        InventoryInstanceMaintainLineResource.queryByNameOrNo("", 1, _self.pagination.per_page).then(
          successData => {
            Loading.hide(uuid);
            _self.inventoryInstanceMaintainLines1 = successData.inventoryInstanceMaintainLines
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );

      },

      //全查询保养计划
      queryAllInventoryInstanceMaintainPlan: function() {
        var _self = this;
        this.inventoryInstanceMaintainLinePlanDocumentNos = [];
        this.inventoryInstanceMaintainLinePlans = [];
        var uuid = Loading.show();

        InventoryInstanceMaintainLineResource.queryAllInventoryInstanceMaintainPlan().then(
          successData => {
            Loading.hide(uuid);
            _self.inventoryInstanceMaintainLinePlans = successData;
            for (var i = 0; i < successData.length; i++) {
              _self.inventoryInstanceMaintainLinePlanDocumentNos.push(successData[i].documentNo);
            }
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );

      },

      //导航栏返回上一级
      back: function() {
        this.$router.push('/desktop/dashboard');
      },

    },

    //监听添加框的改变事件
    watch: {

      "barCode": {
        handler: function(to) {
          this.$refs.ad.clearSelection();
          this.maintainUserName = "";
          this.description = "";
          for (var i = 0; i < this.inventoryInstances.length; i++) {
            if (to == this.inventoryInstances[i].barCode) {
              this.inventoryName = this.inventoryInstances[i].inventoryName;
            }
          }
          this.documentNos = [];
          for (var i = 0; i < this.inventoryInstanceMaintainLines1.length; i++) {
            if (to == this.inventoryInstanceMaintainLines1[i].barCode) {
              if (!this.documentNos.includes(this.inventoryInstanceMaintainLines1[i].documentNo)) {
                this.documentNos.push(this.inventoryInstanceMaintainLines1[i].documentNo);
              }
            }
          }
        },
        deep: true
      },

      "documentNo": {
        handler: function(to) {
          for (var i = 0; i < this.inventoryInstanceMaintainLines1.length; i++) {
            if (this.documentNo == this.inventoryInstanceMaintainLines1[i].documentNo) {
              this.maintainUserName = this.inventoryInstanceMaintainLines1[i].maintainUserName;
              this.description = this.inventoryInstanceMaintainLines1[i].description;
            }
          }
        },
        deep: true
      },

      "inventoryInstanceMaintainLinePlanDocumentNo": {
        handler: function(to) {
          for (var i = 0; i < this.inventoryInstanceMaintainLinePlans.length; i++) {
            if (this.inventoryInstanceMaintainLinePlanDocumentNo == this.inventoryInstanceMaintainLinePlans[i].documentNo) {
              this.maintainContent = this.inventoryInstanceMaintainLinePlans[i].maintainContent;
              this.componentName = this.inventoryInstanceMaintainLinePlans[i].componentName;
              this.inventoryInstanceMaintainLinePlanDescription = this.inventoryInstanceMaintainLinePlans[i].description;
              this.id = this.inventoryInstanceMaintainLinePlans[i].id;
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
      this.queryInventoryInstanceMaintainLine();
      this.queryAllInventoryInstance();
      this.queryAllInventoryInstanceMaintainLine();
      this.queryAllInventoryInstanceMaintainPlan();
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
