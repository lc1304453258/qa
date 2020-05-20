<template>
  <div class="container-fluid">

    <!--    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back"></span>
      <span class="navbar-text" v-if="ispicked == false" @click="setPickedConfirmDate">保存</span>
    </nav> -->

    <Navbar title='条码分解'>
      <span class="navbar-text" @click="InsSep" v-if="inventoryDto.inventoryName != '请扫描...'">分解打印</span>
      <span class="navbar-text" @click="clearData">清空</span>
    </Navbar>

    <h6></h6>

    <form>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">物料名称</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.inventoryName" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">物料编号</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.inventoryNo" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">货位&emsp;&emsp;</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.inventoryPosition" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">条形码&emsp;</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.barCode" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">数量&emsp;&emsp;</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.quantity" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">分割数量</span>
        </div>
        <input type="text" class="form-control" v-model.trim="inventoryDto.separateQuantity" onkeyup="this.value=this.value.replace(/[^\d]/g,'')">
      </div>

    </form>



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
  var DateWidget = require("../widget/Date.vue");
  var WmsSettingResource = require("../api/commom/WmsSettingResource.js");
  var InventoryInstanceWmsResource = require("../api/wms/InventoryInstanceWmsResource.js");
  var InventoryInstancePrintResource = require("../api/wms/InventoryInstancePrintResource.js");

  module.exports = {
    components: {
      Common,
      Modal,
      "v-select": vSelect.VueSelect,
      Pagination,
      Navbar,
      DateWidget
    },

    data: function() {
      return {
        epcSet: [],
        inventoryDto: {
          inventoryName: '请扫描...',
          inventoryNo: '请扫描...',
          inventoryPosition: '请扫描...',
          barCode: '请扫描...',
          quantity: '请扫描...',
          separateQuantity: 0,
        },
      }
    },

    methods: {

      /**
       * 扫描到了以后初始加载
       */
      initEvent: function() {
        var _self = this;
        plugin.barCode.scanEvent = function(barCodeStrs) {
          if (barCodeStrs != undefined && barCodeStrs.length > 0) {
            var barCodes = barCodeStrs.split(",");
            _self.barCode = barCodes[0];
            _self.addBarCode(_self.barCode);
          }
        }
      },

      /**
       * 添加barCode到集合中
       */
      addBarCode: function(barCode) {
        var _self = this;
        if (barCode == null || barCode.length == 0) {
          return;
        }
        if (_self.containBarCode(barCode)) {
          return;
        }
        var temp = {
          epc: barCode,
          barCode: null,
          status: 0
        };
        _self.epcSet.splice(0, _self.epcSet.length);
        _self.epcSet.push(temp);
      },

      /**
       * 判断barCode是否重复
       */
      containBarCode: function(barCode) {
        var _self = this;
        if (_self.epcSet != null && barCode != null) {
          for (var i = 0; i < _self.epcSet.length; i++) {
            if (_self.epcSet[i].epc == barCode) {
              return true;
            }
          }
        }
        return false;
      },

      /**
       * 安卓端扫码成功后调用此函数
       */
      scanResult: function(event) {
        var _self = this;
        _self.barCode = event.detail.barCode;
      },

      /**
       * 确认分割
       */
      InsSep: function() {
        var _self = this;
        if (_self.inventoryDto.inventoryName == '请扫描...') {
          //判断是否扫描
          Notify.error('提示', '请先扫描正确的二维码，再执行分解操作!');
          return;
        } else {
          //开始执行分解
          //在这里开始需要分解一下了
          if (_self.inventoryDto.separateQuantity >= _self.inventoryDto.quantity || _self.inventoryDto.separateQuantity <
            1) {
            //判断是否扫描
            Notify.error('提示', '请输入正确的分割数量！');
            return;
          } else {
            let inventoryInstanceDtos = [{
              "inventoryId": _self.inventoryDto.inventoryId,
              "batchNo": '',
              "packageCount": 1,
              "quantity": _self.inventoryDto.separateQuantity,
              "instanceId": _self.inventoryDto.instanceId,
            }];
            InventoryInstanceWmsResource.generateInventoryInstances(inventoryInstanceDtos).then(
              successData => {
                var recordIds = [];
                successData.forEach(function(item) {
                  recordIds.push(item.id);
                  _self.clearData();
                });
                InventoryInstancePrintResource.print(recordIds).then(
                  successData1 => {
                    if (successData1 != null && successData1.length > 0) {
                      plugin.bluetoothPrinter.print(JSON.stringify(successData1[0]));
                      //打印过后查询一下刷新当前页
                      Notify.success('提示', '打印成功！');
                    }
                  },
                  errorData1 => {
                    Common.processException(errorData1);
                  });
              },
              errorData => {
                _self.$refs.modal.hide();
                Common.processException(errorData);
              });
          }
        }
      },

      // 清空页面数据
      clearData: function() {
        var _self = this;
        _self.epcSet = [];
        _self.inventoryDto = {
          inventoryName: '请扫描...',
          inventoryNo: '请扫描...',
          inventoryPosition: '请扫描...',
          barCode: '请扫描...',
          quantity: '请扫描...',
          separateQuantity: 0,
        };
      },

      /**
       * 从后台查询instance
       */
      queryByEpcOrBarCode: function() {
        var _self = this;
        if (_self.epcSet.length == 1 && _self.epcSet[0].status == 0) {
          var epcs = [];
          epcs.push(_self.epcSet[0].epc);
          InventoryInstanceWmsResource.queryByEpcOrBarCode(epcs).then(
            successData => {
              _self.$set(_self.inventoryDto, "inventoryName", successData.inventoryName); //更新值
              _self.$set(_self.inventoryDto, "barCode", successData.barCode); //更新值
              _self.$set(_self.inventoryDto, "inventoryNo", successData.inventoryNo); //更新值
              _self.$set(_self.inventoryDto, "inventoryPosition", successData.positionName); //更新值
              _self.$set(_self.inventoryDto, "quantity", successData.quantity); //更新值

              _self.$set(_self.inventoryDto, "instanceId", successData.instanceId); //更新值
              _self.$set(_self.inventoryDto, "inventoryId", successData.inventoryId); //更新值

              _self.epcSet[0].status = 1;
            },
            errorData => {
              Notify.error("错误", "查询失败。", false);
              Common.processException(errorData);
            });
        }
      },

      /**
       * 获取仓库配置
       */
      getWmsSettingDto: function() {
        var _self = this;
        WmsSettingResource.unique().then(
          successData => {
            _self.showPictureOfApp = successData.showPictureOfApp;
          },
          errorData => {
            Common.processException(XMLHttpRequest);
          }
        );
      }

    },

    //初始化页面查询
    mounted: function() {
      var _self = this;
      _self.getWmsSettingDto();
      _self.interval = window.setInterval(function() {
        _self.queryByEpcOrBarCode();
      }, 1000);
      window.addEventListener("sendScanData", _self.scanResult);
      _self.initEvent();
    },

    beforeDestroy: function() {
      var _self = this;
      window.removeEventListener("sendScanData", _self.scanResult);
    },

    destroyed() {
      var _self = this;
      clearInterval(_self.interval);
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
