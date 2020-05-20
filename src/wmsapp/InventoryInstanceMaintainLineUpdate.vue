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
            onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')">
        </div>

        <div class="form-group">
          <label>保养费用</label>
          <input type="text" class="form-control" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.cost" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')">
        </div>

        <div class="form-group">
          <label>实际保养内容</label>
          <textarea type="text" class="form-control" v-model.trim="inventoryInstanceMaintainLinesOfOneClick.content"></textarea>
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
        title: "编辑保养单",
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
        page: "",
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
        inventoryInstanceMaintainLineId: "",
        content: "",
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

      //修改物料报修单
      save: function() {
        var _self = this;
        for (var i = 0; i < _self.inventoryInstanceMaintainLinePlans.length; i++) {
          if (_self.inventoryInstanceMaintainLinesOfOneClick.documentNo == _self.inventoryInstanceMaintainLinePlans[
              i].documentNo) {
            _self.maintainContent = _self.inventoryInstanceMaintainLinePlans[i].maintainContent;
            _self.componentName = _self.inventoryInstanceMaintainLinePlans[i].componentName;
            _self.inventoryInstanceMaintainLinePlanDescription = _self.inventoryInstanceMaintainLinePlans[i].description;
            _self.id = _self.inventoryInstanceMaintainLinePlans[i].id;
          }
        }
        if (!this.inventoryInstanceMaintainLinesOfOneClick.maintainUsedHours || !this.inventoryInstanceMaintainLinesOfOneClick
          .cost || !this.inventoryInstanceMaintainLinesOfOneClick.content) {
          Notify.error("提示", "请填写完整再添加！", "true");
          return;
        }
        var uuid = Loading.show();

        var data = {
          documentNo: _self.inventoryInstanceMaintainLinesOfOneClick.documentNo,
          cost: _self.inventoryInstanceMaintainLinesOfOneClick.cost,
          maintainUsedHours: _self.inventoryInstanceMaintainLinesOfOneClick.maintainUsedHours,
          id: _self.id,
          content: _self.inventoryInstanceMaintainLinesOfOneClick.content,
          inventoryInstanceMaintainLineId: _self.inventoryInstanceMaintainLinesOfOneClick.id,
        };
        InventoryInstanceMaintainLineResource.editInventoryInstanceMaintainLine(_self.inventoryInstanceMaintainLinesOfOneClick
          .documentNo, _self.inventoryInstanceMaintainLinesOfOneClick.cost, _self.inventoryInstanceMaintainLinesOfOneClick
          .maintainUsedHours, _self.inventoryInstanceMaintainLinesOfOneClick.content,
          _self.inventoryInstanceMaintainLinesOfOneClick.id, _self.id).then(
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
        // alert("page = "+ this.page)
        this.$router.push({
          path: '/desktop/InventoryInstanceMaintainLine',
          query: {
            page: this.page,
          }
        })
      },

      //根据搜索框的信息message 和 当前页码 与每页信息条数来查询基础信息
      queryInventoryInstanceMaintainLine: function() {
        var _self = this;
        this.inventoryInstanceMaintainLines = [];
        var uuid = Loading.show();

        var data = {
          message: _self.message,
          currentPage: _self.pagination.current_page,
          pageSize: _self.pagination.per_page,
        };
        InventoryInstanceMaintainLineResource.queryByNameOrNo(_self.message, _self.pagination.current_page, _self.pagination
          .per_page).then(
          successData => {
            Loading.hide(uuid);
            if (successData == null) {
              Notify.error("提示", "当前没有更多数据了！", "true");
              return;
            }
            _self.inventoryInstanceMaintainLines = successData.inventoryInstanceMaintainLines;
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

        InventoryInstanceMaintainLineResource.queryByNameOrNo("", _self.pageOfUpdate, _self.pagination.per_page).then(
          successData => {
            Loading.hide(uuid);
            _self.inventoryInstanceMaintainLines1 = successData.inventoryInstanceMaintainLines
            _self.inventoryInstanceMaintainLinesOfOneClick = successData.inventoryInstanceMaintainLines[_self.indexOfUpdate];
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
      };
      this.indexOfUpdate = this.$route.query.indexOfUpdate;
      this.pageOfUpdate = this.$route.query.pageOfUpdate;
      this.page = this.$route.query.page;
      this.queryAllInventoryInstance();
      this.queryAllInventoryInstanceMaintainLine();
      this.queryAllInventoryInstanceMaintainPlan();
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
