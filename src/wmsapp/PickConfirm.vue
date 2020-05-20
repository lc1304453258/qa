<template>
  <div class="container-fluid">

    <Navbar title='收货确认'>

      <div class="form-inline">
        <button type="button" class="btn btn-info btn-sm" @click="beginScan">扫描</button>
      </div>

    </Navbar>

    <ScanWidget ref="scanWidget" @scanCallback="scanCallback($event)"></ScanWidget>

    <h6></h6>

    <div class="form-group">
      <div class="v-select-container">
        <v-select id="projectItemSelect" ref="projectItemSelect" label="noName" :options="projectItemList" v-model="selectedProjectItem"
          @input="selectedProjectItemChanged" placeholder=""></v-select>
      </div>
    </div>

    <div class="card-group" v-if="(invoiceList == undefined || invoiceList.length == 0)">
      <div class="card bg-light">
        <div class="card-header">序号.发货单单号</div>
        <div class="card-body">
          <p class="card-text">项目事件名称</p>
          <p class="card-text">发货仓库</p>
          <p class="card-text">收货人</p>
          <p class="card-text">收货状态</p>
        </div>
      </div>
    </div>

    <div class="card-group" v-else>
      <template v-for="(data, index) in invoiceList">
        <div class="card bg-light" :key="data.id" @click="findByConditionForStockLine(data)">
          <div class="card-header" :class="{'bg-danger text-white': (data.pickConfirmDate == undefined), 'bg-success text-white': (data.pickConfirmDate != undefined)}">{{index + 1}}.发货单单号：{{data.documentNo}}</div>
          <div class="card-body">
            <p class="card-text">项目事件名称：{{data.projectItemName}}</p>
            <p class="card-text">发货仓库：{{data.warehouseBarCode}}</p>
            <p class="card-text">收货人：{{data.pickedUserName}}</p>
            <p class="card-text">收货状态：{{ data.pickConfirmDate == undefined ? "未收货" : "已收货" }}</p>
          </div>
        </div>
      </template>
    </div>

    <Pagination :pagination="pagination" :callback="findByCondition" :options="paginationOptions" v-if="invoiceList.length > 0"
      :size="'small'" style="margin-top: 10px;"></Pagination>

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
  var ProjectItemResource = require("../api/commom/ProjectItemResource.js");
  var StockOutResource = require("../api/wms/StockOutResource.js");
  var InvoiceResource = require("../api/wms/InvoiceResource.js");

  var ScanWidget = require("../widget/ScanWidget.vue");

  module.exports = {
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,

      ScanWidget,

      Navbar,
    },

    data: function() {
      return {

        barCode: "请扫码...",

        projectItemList: [],
        selectedProjectItem: {},
        invoiceList: [],
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

      /**
       * 清空文本框内的文本
       */
      clearText: function() {
        this.barCode = "请扫码...";
      },

      scanInvoice: function(barCode) {
        //清空selectProjectItem下拉框里面的值
        var _self = this;
        _self.selectedProjectItem = {};
        _self.invoiceList = [];
        var invoiceQueryDto = {
          documentNo: barCode,
          start: _self.pagination.current_page,
          length: _self.pagination.per_page,
        };
        InvoiceResource.findByInvoiceQueryDto(invoiceQueryDto).then(
          successData => {
            _self.invoiceList = successData;
            if (successData.length != 0) {
              _self.pagination.last_page = Math.ceil(successData[0].totalSize / _self.pagination.per_page);
            }
          },
          errorData => {
            Common.processException(XMLHttpRequest)
          }
        );
      },

      initEvent: function() {
        var _self = this;
        plugin.barCode.scanEvent = function(barCodeStrs) {
          if (barCodeStrs != undefined && barCodeStrs.length > 0) {
            var barCodes = barCodeStrs.split(",");
            _self.barCode = barCodes[0];

            //↑过滤二维码中IV的标识符
            _self.barCode = _self.barCode.replace('IV', '');

            _self.scanInvoice(_self.barCode);
          }
        }
      },

      /**
       * 点击扫码按钮开始扫描
       */
      beginScan: function() {
        if (typeof(ZXING_SCANNER) == "undefined") {
          this.wechatScan();
        } else {
          plugin.barCode.scan(false);
        }
      },

      /**
       * 微信端开始扫描
       */
      wechatScan: function() {
        this.$refs.scanWidget.startScan();
      },

      /**
       * 微信端扫码成功调用此函数
       */
      scanCallback: function(result) {
        var index = result.indexOf(",");
        var barCode = result.slice(index + 1);
        this.barCode = barCode;
        this.scanInvoice(this.barCode);
      },

      /**
       * 安卓端扫码成功后调用此函数
       */
      scanResult: function(event) {
        var _self = this;
        _self.barCode = event.detail.barCode;
        _self.scanInvoice(_self.barCode);
      },


      /**
       * 选择的项目事件发生改变
       */
      selectedProjectItemChanged: function(value) {

        this.clearText();
        this.invoiceList = [];

        if (value == undefined) {
          this.findByCondition();
          return;
        }
        this.findByCondition(value.id);
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

      // 1.查询公司所有项目
      // /ProjectItemResource/all
      projectItem: function() {
        var _self = this;
        var uuid = Loading.show();

        ProjectItemResource.projectItem().then(
          successData => {
            Loading.hide(uuid);
            if (successData === undefined && successData.length === 0) {
              return
            }
            successData.forEach(function(projectItem) {
              projectItem.noName = projectItem.no + "," + projectItem.name;
            });

            _self.projectItemList = successData;
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );

      },

      // 2.根据pickUser(or projectItemId)查询出库单
      // /StockOutResource/findByCondition
      findByCondition: function(projectItemId) {
        var _self = this;
        var invoiceQueryDto = {
          projectItemId: projectItemId,
          start: _self.pagination.current_page,
          length: _self.pagination.per_page,
        };
        InvoiceResource.findByInvoiceQueryDto(invoiceQueryDto).then(
          successData => {
            successData.sort(function(a, b) {
              if (a.documentNo > b.documentNo) {
                return -1;
              } else {
                return 1;
              }
            });
            _self.invoiceList = successData;
            if (successData.length != 0) {
              _self.pagination.last_page = Math.ceil(successData[0].totalSize / _self.pagination.per_page);
            }
          },
          errorData => {
            Common.processException(XMLHttpRequest)
          }
        );
      },

      findByConditionForStockLine: function(data) {
        this.$router.push({
          path: '/desktop/PickConfirmUpdate',
          query: {
            invoiceId: data.invoiceId,
          }
        })
      },

    },


    //初始化页面查询
    mounted: function() {
      this.projectItem();
      this.findByCondition();

      var _self = this;
      window.addEventListener("sendScanData", _self.scanResult);
      this.initEvent();

    },

    beforeDestroy: function() {
      var _self = this;
      window.removeEventListener("sendScanData", _self.scanResult);
    },

  }
</script>

<style scoped>
  .card {
    margin-top: 15px;
  }
</style>
