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
          <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryName">
        </div>
        <div class="form-group">
          <label for="documentNoSelect">保养单号</label>
          <div class="v-select-container">
            <v-select id="documentNoSelect" label="documentNo" :options="documentNos" v-model="documentNo" ref="ad"></v-select>
          </div>
        </div>
        <div class="form-group">
          <label>保养人</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="maintainUserName">
        </div>
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="description">
        </div>
        <div class="form-group">
          <label for="planNoSelect">保养计划单号</label>
          <div class="v-select-container">
            <v-select id="planNoSelect" label="inventoryInstanceMaintainLinePlanDocumentNo" :options="inventoryInstanceMaintainLinePlanDocumentNos"
              v-model="inventoryInstanceMaintainLinePlanDocumentNo"></v-select>
          </div>
        </div>
        <div class="form-group">
          <label>项目名称</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="componentName">
        </div>
        <div class="form-group">
          <label>实际保养内容</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="maintainContent">
        </div>
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" readonly="readonly" v-model.trim="inventoryInstanceMaintainLinePlanDescription">
        </div>
        <div class="form-group">
          <label>保养耗时</label>
          <input type="text" class="form-control" v-model.trim="maintainUsedHours" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')">
        </div>
        <div class="form-group">
          <label>保养费用</label>
          <input type="text" class="form-control" v-model.trim="cost" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')">
        </div>
        <div class="form-group">
          <label>实际保养内容</label>
          <textarea type="text" class="form-control" v-model.trim="content"></textarea>
        </div>
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
  var InventoryInstanceMaintainLineResource = require("../api/wms/InventoryInstanceMaintainLineResource.js");

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
        title: "新增保养单",
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
        inventoryInstanceMaintainPlanLines: [],
        inventoryInstanceMaintainPlanLine: {
          id: "",
          content: "",
          date: "",
          no: "",
        },
        id: "",
        page: "",
        content: "",
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
        if (!this.barCode || !this.documentNo || !this.inventoryInstanceMaintainLinePlanDocumentNo || !this.maintainUsedHours ||
          !this.cost) {
          Notify.error("提示", "请填写完整再添加！", "true");
          // bug
          // _self.$refs.modal1.hide();
          // _self.$refs.modal1.show();
          return;
        }
        for (var i = 0; _self.inventoryInstanceMaintainPlanLines.length; i++) {
          var arr = _self.inventoryInstanceMaintainLinePlanDocumentNo.split(",");
          var str = arr[0];
          if (_self.inventoryInstanceMaintainPlanLines[i].no == str) {
            var planLineId = _self.inventoryInstanceMaintainPlanLines[i].id;
            break;
          }
        }
        var uuid = Loading.show();

        InventoryInstanceMaintainLineResource.generateInventoryInstanceMaintainLine(_self.documentNo, _self.cost,
          planLineId, _self.maintainUsedHours, _self.content, _self.id).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("提示", "保养计划明细保存成功", true);
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
          path: '/desktop/InventoryInstanceMaintainLine',
          query: {
            page: this.page,
            oneTime: true,
          }
        })
      },

      //全查询保养计划
      queryAllInventoryInstanceMaintainPlan: function() {
        var _self = this;
        this.inventoryInstanceMaintainLinePlanDocumentNos = [];
        this.inventoryInstanceMaintainLinePlans = [];
        _self.inventoryInstanceMaintainPlanLines = [];
        var uuid = Loading.show();

        InventoryInstanceMaintainLineResource.queryAllInventoryInstanceMaintainPlan().then(
          successData => {
            Loading.hide(uuid);
            for (var i = 0; i < successData.length; i++) {
              for (var j = 0; j < successData[i].inventoryInstanceMaintainPlanLineDtos.length; j++) {
                _self.inventoryInstanceMaintainPlanLine = {
                  id: "",
                  content: "",
                  date: "",
                  no: "",
                };
                _self.inventoryInstanceMaintainPlanLine.id = successData[i].inventoryInstanceMaintainPlanLineDtos[
                    j]
                  .id;
                _self.inventoryInstanceMaintainPlanLine.content = successData[i].maintainContent;
                var nextMaintainTime = successData[i].inventoryInstanceMaintainPlanLineDtos[j].nextMaintainTime.split(
                  " ");
                _self.inventoryInstanceMaintainPlanLine.date = nextMaintainTime[0];
                _self.inventoryInstanceMaintainPlanLine.no = successData[i].documentNo;
                _self.inventoryInstanceMaintainPlanLines.push(_self.inventoryInstanceMaintainPlanLine);
              };
            };
            _self.inventoryInstanceMaintainLinePlans = successData;
            for (var i = 0; i < _self.inventoryInstanceMaintainPlanLines.length; i++) {
              _self.inventoryInstanceMaintainLinePlanDocumentNos.push(
                _self.inventoryInstanceMaintainPlanLines[i].no +
                "," + _self.inventoryInstanceMaintainPlanLines[i].content +
                ",执行时间:" + _self.inventoryInstanceMaintainPlanLines[i].date
              );
            }
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

    },

    //监听条形码的人为选择
    watch: {

      "barCode": {
        handler: function(to) {
          this.$refs.ad.clearSelection();
          this.maintainUserName = "";
          this.description = "";
          this.inventoryName = "";
          var str = to.split('(')[0];
          for (var i = 0; i < this.inventoryInstances.length; i++) {
            if (str == this.inventoryInstances[i].barCode) {
              this.inventoryName = this.inventoryInstances[i].inventoryName;
            }
          }
          this.documentNos = [];
          for (var i = 0; i < this.inventoryInstanceMaintainLines1.length; i++) {
            if (str == this.inventoryInstanceMaintainLines1[i].barCode) {
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

    //4.初始化页面
    mounted: function() {
      this.queryAllInventoryInstance();
      this.queryAllInventoryInstanceMaintainLine();
      this.queryAllInventoryInstanceMaintainPlan();
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
