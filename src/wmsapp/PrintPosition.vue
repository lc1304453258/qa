<template>
  <div class="container-fluid">
    <!--    <nav class="navbar navbar-fixed-top navbar-light bg-faded header">
      <a class="navbar-brand" href="javascript:void(0);">
        <span class="fa fa-arrow-circle-o-left back-icon" @click="back">返回</span>
      </a>
    </nav> -->
    <Navbar :title="title">
    </Navbar>

    <h6></h6>
    <div>
      <fieldset class="form-group">
        <div class="input-group">
          <input id="barcode-input" type="text" class="form-control" placeholder="货位名称/编号/所在仓库" v-model.trim="message"
            @keydown="keydown($event)">
          <div class="input-group-append">
            <label class="input-group-text" for="inputGroupSelect02" @click="clearText">&times;</label>
          </div>
        </div>
      </fieldset>

      <fieldset class="form-group">
        <div>
          <!-- <button type="button" class="btn btn-link" @click="back">返回</button> -->
          <button type="button" class="btn btn-danger btn-sm" @click="clear">清空</button>
          <button type="button" class="btn btn-primary btn-sm" @click="queryPositionBtn">查询</button>
          <button type="button" class="btn btn-info btn-sm" @click="addNewWarehouse">新增仓库</button>
          <button type="button" class="btn btn-info btn-sm" @click="addNewPosition">新增货位</button>
        </div>
      </fieldset>
    </div>

    <div class="card-group m-card-item" v-if="(positions == undefined || positions.length == 0)">
      <div class="card bg-light">
        <div class="card-header">序号.货位编号</div>
        <div class="card-block">
          <p class="card-text">货位名称</p>
          <p class="card-text">货位条码</p>
          <p class="card-text">仓库名称</p>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in positions">
        <div class="card bg-light">
          <div class="card-header">
            {{index + 1}}.货位编号：{{data.positionNo}}
            <span class="fa fa-print fa-pull-right update-icon" @click="printPosition(data)">打印</span>
          </div>
          <div class="card-body">
            <p class="card-text">货位名称,条码：{{data.positionName}},{{data.positionBarCode}}</p>
            <!-- <p class="card-text">货位条码：{{data.positionBarCode}}</p> -->
            <p class="card-text">仓库名称：{{data.warehouseName}}</p>
          </div>
          <!--          <div class="card-footer text-center">
            <button type="button" class="btn btn-primary btn-sm" @click="printPosition(data)">打印</button>
          </div> -->
        </div>
      </div>
    </div>

    <Modal ref="modal1" title="新增仓库" large="true">
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
              <input type="checkbox" name="" checked v-model="positionManager">
              启用货位管理
            </label>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div>
          <button type="button" class="btn btn-primary" @click="generateWarehouse">保存</button>
          <button type="button" class="btn btn-danger" @click="modalCancel1">取消</button>
        </div>
      </div>
    </Modal>

    <Modal ref="modal2" title="新增货位" large="true">
      <div slot="body">
        <div>
          <div class="form-group">
            <label>货位名称</label>
            <input type="text" class="form-control" v-model.trim="positionName">
          </div>
          <div class="form-group">
            <label>货位编号</label>
            <input type="text" class="form-control" v-model.trim="positionNo">
          </div>
          <div class="form-group">
            <label for="warehouseSelect">仓库</label>
            <div class="v-select-container">
              <v-select id="warehouseSelect" label="name" :options="warehouses" v-model="warehouse"></v-select>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div>
          <button type="button" class="btn btn-primary" @click="generatePosition">保存</button>
          <button type="button" class="btn btn-danger" @click="modalCancel2">取消</button>
        </div>
      </div>
    </Modal>

    <Pagination :pagination="pagination" :callback="queryPosition" :options="paginationOptions" v-if="positions.length > 0"
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
        title: "货位打印",
        message: "",
        recordIds: [],
        positions: [],
        warehouseName: "",
        warehouseNo: "",
        positionName: "",
        positionNo: "",
        warehouse: null,
        warehouses: [],
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

      queryPositionBtn: function() {
        this.initPagination();
        this.queryPosition();
      },

      queryPositionManagerWarehouse: function() {
        var _self = this;
        $.ajax({
          url: Common.getApiURL("WarehouseResource/queryPositionManagerWarehouse"),
          type: "get",
          beforeSend: function(request) {
            Common.addTokenToRequest(request);
          },
          success: function(data) {
            _self.warehouses = data;
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Common.processException(XMLHttpRequest, textStatus, errorThrown);
          }
        })
      },

      addNewPosition: function() {
        // this.positionName = "";
        // this.positionNo = "";
        // this.warehouse = null;
        // this.$refs.modal2.show();
        // this.queryPositionManagerWarehouse();
        this.$router.push({
          path: '/desktop/PositionCreat',
        })
      },

      modalCancel2: function() {
        this.$refs.modal2.hide();
      },

      generatePosition: function() {
        var _self = this;
        if (!this.positionName || !this.positionNo || !this.warehouse) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        $.ajax({
          url: Common.getApiURL("positionResource/generatePosition"),
          type: "post",
          data: {
            positionName: _self.positionName,
            positionNo: _self.positionNo,
            warehouseId: _self.warehouse.id
          },
          beforeSend: function(request) {
            Common.addTokenToRequest(request);
          },
          success: function(data) {
            Loading.hide(uuid);
            Notify.success("提示", "货位（名称：" + _self.positionName + "，编号：" +
              _self.positionNo + "，仓库：" + _self.warehouse.name + "）保存成功！", true);
            _self.$refs.modal2.hide();
            _self.initPagination();
            _self.positions = [];
            _self.positions.push(data);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest, textStatus, errorThrown);
          }
        })
      },

      addNewWarehouse: function() {
        // this.warehouseName = "";
        // this.warehouseNo = "";
        // this.$refs.modal1.show();
        this.$router.push({
          path: '/desktop/WarehouseCreat',
        })
      },

      modalCancel1: function() {
        this.$refs.modal1.hide();
      },

      generateWarehouse: function() {
        var _self = this;
        if (!this.warehouseName || !this.warehouseNo) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();
        $.ajax({
          url: Common.getApiURL("WarehouseResource/generateWarehouse"),
          type: "post",
          data: {
            warehouseName: _self.warehouseName,
            warehouseNo: _self.warehouseNo,
            positionManager: _self.positionManager,
          },
          beforeSend: function(request) {
            Common.addTokenToRequest(request);
          },
          success: function(data) {
            Loading.hide(uuid);
            Notify.success("提示", "仓库（名称：" + _self.warehouseName + "，编号：" +
              _self.warehouseNo + "）保存成功！", true);
            _self.$refs.modal1.hide();
            _self.queryPosition();
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest, textStatus, errorThrown);
          }
        })
      },

      /**
       * 清空文本框内的文本
       */
      clearText: function() {
        this.message = "";
      },

      clear: function() {
        this.positions = [];
        this.message = "";
      },

      keydown: function(event) {
        if (event.keyCode == 13) {
          this.pagination.current_page = 1;
          this.queryPosition();
        }
      },

      //根据货位名称或编号查询
      queryPosition: function() {
        var _self = this;
        this.positions = [];
        var uuid = Loading.show();
        $.ajax({
          url: Common.getApiURL("positionResource/message1"),
          type: "post",
          data: {
            message: _self.message,
            currentPage: _self.pagination.current_page,
            pageSize: _self.pagination.per_page,
          },
          beforeSend: function(request) {
            Common.addTokenToRequest(request);
          },
          success: function(data) {
            Loading.hide(uuid);
            _self.positions = data.positions;
            var size = data.totalSize;
            _self.pagination.last_page = Math.ceil(size / _self.pagination.per_page);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest, textStatus, errorThrown);
          }
        });
      },

      //打印货位
      // printPosition: function (position) {
      // 	var _self = this;
      // 	var ids = [];
      // 	ids.push(position.positionId);
      // 	var token = Common.getToken();
      // 	var url = "PrintClient://" +  Common.getApiURL('positionResource/printPosition?token=') + token + "&recordIds=" + ids;
      // 	window.open(url,"_self");
      // },

      //打印货位
      printPosition: function(position) {
        var _self = this;
        var ids = [];
        ids.push(position.positionId);
        var token = Common.getToken();
        $.ajax({
          url: Common.getApiURL("positionResource/printPosition?token=") + token + "&recordIds=" + ids,
          type: "get",
          beforeSend: function(request) {
            Common.addTokenToRequest(request);
          },
          success: function(data) {

            var arr = JSON.parse(data);
            if (arr != null && arr.length > 0) {
              var obj = arr[0];
              // alert(JSON.stringify(obj));
              // var Argus = plugin.bluetoothPrinter.PrintSync(JSON.stringify(obj));
              plugin.bluetoothPrinter.print(JSON.stringify(obj));
            }

            // var data1 = data;
            // console.log(data);
            // data1 = data1.substring(0, 1) + data1.substring(2);
            // data1 = data1.substring(0, data1.length-2) + data1.substring(data1.length-1);
            // console.log(data1);

            // var data2 = data1.slice(2, data1.length-2);
            // alert(data2);
            // console.log(data2);
            // if (window.plus) {
            // alert(data1);
            // var Argus = plugin.bluetoothPrinter.PrintSync(data1);
            // }
            // var Argus = plugin.bluetoothPrinter.PrintSync(data);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            Common.processException(XMLHttpRequest, textStatus, errorThrown);
          }
        });
      },

      //打印全部货位
      printAllPosition: function() {
        if (this.positions.length == 0) {
          Notify.error("提示", "无货位可打印。", true);
          return;
        }
        var ids = [];
        this.positions.forEach(function(item) {
          ids.push(item.positionId);
        });
        var token = Common.getToken();
        var url = "PrintClient://" + Common.getApiURL('positionResource/printPosition?token=') + token +
          "&recordIds=" + ids;
        window.open(url, "_self");
      },
    },

    mounted: function() {
      this.queryPosition();
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
</style>
