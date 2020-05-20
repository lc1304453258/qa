<template>
  <div class="container-fluid">

    <!--    <nav class="navbar navbar-fixed-top navbar-light bg-light header">
      <span class="fa fa-arrow-circle-o-left back-icon" @click="back"></span>
      <span class="navbar-text" v-if="ispicked == false" @click="setPickedConfirmDate">保存</span>
    </nav> -->

    <Navbar title='返回'>
      <span class="navbar-text" v-if="ispicked == false" @click="setPickedConfirmDate">保存</span>
    </Navbar>

    <h6></h6>

    <form>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">单位名称</span>
        </div>
        <input type="text" class="form-control" v-model.trim="clientName" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">发货单号</span>
        </div>
        <input type="text" class="form-control" v-model.trim="documentNo" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">项目名称</span>
        </div>
        <input type="text" class="form-control" v-model.trim="projectItemName" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">发货件数</span>
        </div>
        <input type="text" class="form-control" v-model.trim="totalNum" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md">
        <div class="input-group-prepend">
          <span class="input-group-text">收货人&emsp;</span>
        </div>
        <input type="text" class="form-control" v-model.trim="pickedUserName" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md" v-if="ispicked == true">
        <div class="input-group-prepend">
          <span class="input-group-text">收货日期</span>
        </div>
        <input type="text" class="form-control" v-model.trim="pickConfirmDate" readonly="readonly">
      </div>

      <div class="input-group mb-1 input-group-md" v-else>
        <div class="input-group-prepend">
          <span class="input-group-text">收货日期</span>
        </div>
        <DateWidget class="form-control" style="width: 100%;" dateFormat="YYYY-MM-DD" v-model="pickConfirmDate"
          :dateValue="pickConfirmDate" @on-value-change="selectDate" />
        <!-- <input type="text" class="form-control" v-model.trim="pickConfirmDate" @click="selectDate()"> -->
      </div>


      <div class="row" v-if="invoiceLineDtos.length == 0">
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 m-card-item">
          <div class="card bg-light">
            <div class="card-body">
              <p class="card-text">该出库单下暂无物料明细</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-else>
        <div class="col-12 col-sm-1 col-md-1 col-lg-4 col-xl-4 m-card-item" v-for="(data, index) in invoiceLineDtos">
          <div class="card bg-light">
            <div class="card-body">
              <p class="card-text" :class="{'bg-danger text-white': (data.isScan == undefined || data.isScan == false), 'bg-success text-white': (data.isScan == true)}">{{index + 1}}.物料编码,名称,数量：{{data.inventoryNo}},{{data.inventoryName}},{{data.num}}件</p>
            </div>
          </div>
        </div>
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
  var ProjectItemResource = require("../api/commom/ProjectItemResource.js");
  var StockOutResource = require("../api/wms/StockOutResource.js");
  var DateWidget = require("../widget/Date.vue");
  var InvoiceResource = require("../api/wms/InvoiceResource.js");

  //0511
  var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

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

        // 0511
        epcSet: [],

        totalNum: "",
        ispicked: "",
        clientName: "",
        documentNo: "",
        projectItemName: "",
        description: "",
        pickedUserName: "",
        pickConfirmDate: "",
        invoiceDtos: [],
        invoiceLineDtos: [],
        invoiceQueryDto: {
          loadLines: true,
          start: 1,
          length: 1,
        },
      }
    },

    methods: {

      /**
       * 0511扫描工具箱
       */
      checkInstance: function() {
        var _self = this;
        _self.epcSet.forEach(function(item) {
          _self.invoiceLineDtos.forEach(function(item0) {
            var i = 0;
            if (item.epc == item0.epc) {
              item0.isScan = true;
              _self.$set(_self.invoiceLineDtos, i, _self.invoiceLineDtos[i]);//更新对象
              _self.$set(item0, "isScan", true);//更新值
            }
            i++;
          })
        });
      },
      /**
       * 0511添加epc到集合中
       */
      addEpc: function(epc) {
        var _self = this;
        if (epc == null || epc.length == 0) {
          return;
        }
        if (_self.contains(epc)) {
          return;
        }
        var temp = {
          "epc": epc,
        };
        _self.epcSet.push(temp);
      },
      /**
       * 0511判断epc是否重复
       */
      contains: function(epc) {
        var _self = this;
        if (_self.epcSet != null && epc != null) {
          for (var i = 0; i < _self.epcSet.length; i++) {
            if (_self.epcSet[i].epc == epc) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * 0511获取仓库配置
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
      },

      //导航栏返回上一级
      back: function() {
        history.back();
      },

      // 保存更新结果
      setPickedConfirmDate: function() {
        var _self = this;

        //货物是否齐全
        // alert(JSON.stringify(_self.epcSet));
        // var temp = {
        //   epc: '100000000000000000000617',
        // };
        // _self.epcSet.push(temp);

        // alert(JSON.stringify(_self.invoiceLineDtos))
        var isSet = false;
        // _self.invoiceLineDtos.forEach(function(item){
        //   if(item.isScan == undefined || item.isScan == false){
        //     Notify.error("提示", "当前发货单扫描不全，无法收货");
        //     isSet = true;
        //     throw new Error("stop");
        //   }
        // });
        for(var i = 0;i < _self.invoiceLineDtos.length;i++){
          if(_self.invoiceLineDtos[i].isScan == undefined || _self.invoiceLineDtos[i].isScan == false){
            Notify.error("提示", "当前发货单扫描不全，无法收货");
            isSet = true;
            break;
          }
        }
        if(!isSet){
          var uuid = Loading.show();
          _self.invoiceDtos[0].pickConfirmDate = new Date(_self.pickConfirmDate);
          InvoiceResource.setConfirmDate(_self.invoiceDtos[0]).then(
            successData => {
              Loading.hide(uuid);
              Notify.success("提示", "收货成功");
              _self.findByCondition();
            },
            errorData => {
              Loading.hide(uuid);
              Common.processException(XMLHttpRequest);
            }
          );
        }
      },

      // 日期控件
      selectDate: function(value) {
        var _self = this;
        _self.pickConfirmDate = value;
        console.log(_self.pickConfirmDate);
      },

      //查询出库单明细
      findByCondition: function() {
        var _self = this;
        var uuid = Loading.show();
        InvoiceResource.findByInvoiceQueryDto(_self.invoiceQueryDto).then(
          successData => {
            Loading.hide(uuid);
            _self.invoiceDtos = successData;
            if (successData != null && successData[0].invoiceLineList != null) {
              _self.invoiceLineDtos = successData[0].invoiceLineList;

              //0511
              // _self.totalNum = _self.invoiceLineDtos[0].totalNum
              _self.totalNum = 0;
              _self.invoiceLineDtos.forEach(function(item) {
                _self.totalNum = _self.totalNum + item.num;
                // alert(item.epc);
              });

            }
            _self.pickedUserName = _self.invoiceDtos[0].pickedUserName;
            _self.clientName = _self.invoiceDtos[0].clientName;
            _self.documentNo = _self.invoiceDtos[0].documentNo;
            _self.projectItemName = _self.invoiceDtos[0].projectItemName;
            if (_self.invoiceDtos[0].pickConfirmDate == undefined) {
              var date = new Date();
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              var dateFormat = year + "-" + month + "-" + day;
              _self.pickConfirmDate = dateFormat;
              _self.ispicked = false;
            } else {
              _self.pickConfirmDate = _self.invoiceDtos[0].pickConfirmDate.substr(0, 10);
              _self.ispicked = true;
            }
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
      var _self = this;
      this.invoiceQueryDto.invoiceId = this.$route.query.invoiceId;
      this.findByCondition();

      //0511
      _self.getWmsSettingDto();
      _self.interval = window.setInterval(function() {
        _self.checkInstance();
      }, 1000);
      plugin.rfidMiddleware.start();
      plugin.rfidMiddleware.readEvent = function(epc) {
        _self.addEpc(epc);
        return "success";
      }

    },

    //0511
    beforeDestroy: function() {
      var _self = this;
      if (_self.interval != null) {
        window.clearInterval(_self.interval);
        _self.interval = null;
      }
      plugin.rfidMiddleware.stopInventory();
      plugin.rfidMiddleware.stop();
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
</style>
