<template>
  <div class="container-fluid">
    <Navbar title="物料调拨">
      <div class="form-inline">
        <button class="btn btn-link" type="submit" @click="clearData()">清空</button>

        <button type="button" class="btn btn-link" @click="submitBefore()">确认</button>
      </div>
    </Navbar>
    <div style="margin-top:10px">
      <div class="form-group">
        <DateTime id="loginDate" dateFormat="YYYY-MM-DD HH:mm:ss" class="form-control pull left" :dateValue="projectItemAdjustDate"
          :readonly="false" @on-value-change="textChanged" style="width: 65%;" />
        <button class="btn btn-info pull-right" style="width: 30%;" @click="stopBefor">结束调拨</button>
      </div>

      <div class="form-group" style="margin-top:10px;">
        <input class="form-control" type="button" v-model="projectItemAdjustNo" @click="pickerVisible = true" />
      </div>
    </div>
    <div class="clear-fix"></div>
    <div style="margin-top:10px;">
      <ul class="nav nav-pills nav-fill selected-tab">
        <li class="nav-item" @click="selectTab('artificial')">
          <a class="nav-link" id="nav-link1" :class="{'active': (selectedTab === 'artificial')}" href="javascript:void(0)">
            <button type="text" class="form-control">物料信息</button>
          </a>
        </li>
        <li class="nav-item" @click="selectTab('rfid')">
          <a class="nav-link" :class="{'active': (selectedTab === 'rfid')} ">
            <select class="form-control" v-model="total" @click="totalChange()">
              <option value="0">全部物料({{totalSize1}})</option>
              <option value="1">正常物料({{totalSize2}})</option>
              <option value="2">无需求物料({{totalSize3}})</option>
              <option value="3">非项目物料({{totalSize4}})</option>
            </select>
          </a>
        </li>
      </ul>
    </div>

    <div v-show="selectedTab == 'artificial'">
      <div v-for="(data, index) in inventoryInstances" :key="index" style="margin-top:10px;">
        <div class="card">
          <div class="card-header" :class="{'bg-danger':(data.needQuantity == null || data.needQuantity > data.scanQuantity),'bg-success':(data.needQuantity <= data.scanQuantity)}">
            {{index+1}}.{{data.inventoryNoAndName}}</div>
          <div class="card-body">
            <div class="row">
              <div class="col-3" v-if="showPictureOfApp == true">
                <ShowImage :imageNames="data.imageName" :className="data.className"></ShowImage>
              </div>
              <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                <div class="d-flex justify-content-between">
                  <div class="p-2">需求数量：{{data.needQuantity}}</div>
                  <div class="p-2">扫描数量：{{data.scanQuantity}}</div>
                </div>
                <div class="d-flex justify-content-between" v-if="(data.errorCode == 3 || data.errorCode == 2)">
                  <div class="p-2">
                    <img v-lazy="'../../static-wms-app/image/dangerous.jpg'" width="20px" height="20px" />
                  </div>
                  <div class="p-2">{{data.errorMessage}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="selectedTab == 'rfid'">
      <div v-for="(data, index) in inventoryInstanceDetails" v-show="data.show" :key="index" style="margin-top:10px;">
        <div class="card">
          <div class="card-header text-white" :class="{'bg-danger':(data.errorCode != 0),'bg-success':(data.errorCode == 0)}">
            {{data.inventoryNoAndName}}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="deleteOne(index)">&times;</span>
            </button>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-3" v-if="showPictureOfApp == true">
                <ShowImage :imageNames="data.imageName" :className="data.className"></ShowImage>
              </div>
              <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                <div class="d-flex justify-content-between" v-if="showEpc == true">
                  <div class="p-2">epc：{{data.epc}}</div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="p-2">货位：{{data.positionName}}</div>
                </div>

                <div class="form-inline" v-if="data.errorCode == 3">
                  <label>状态:</label>
                  <select class="form-control" v-model="data.errorStatus1">
                    <option value="0">强制调拨</option>
                    <option value="1">删除</option>
                  </select>
                </div>

                <div class="form-inline" v-if="data.errorCode == 2">
                  <label>状态:</label>
                  <select class="form-control" v-model="data.errorStatus2">
                    <option value="0">删除</option>
                  </select>
                </div>

                <!-- 0511 -->
                <div class="form-inline" v-if="data.isRfid == false">
                  <label>实际数量:</label>
                  <input style="width: 4em" type="text" v-model="data.quantity" @change="changeScanQuantity(data)">
                </div>

              </div>
            </div>
          </div>
          <div class="card-footer">
            <img class="error-img" v-lazy="data.errorCode == 0 ? '../../static-wms-app/image/greentrue.jpg':'../../static-wms-app/image/dangerous.jpg'" />
            <font size="2">{{data.errorMessage}}</font>
          </div>
        </div>
      </div>
    </div>
    <VuePicker :data="projectItemAdjusts" :showToolbar="true" @confirm="selectProjectItemAdjust($event, null)"
      :visible.sync="pickerVisible" />

    <div class="modal fade" id="myModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">是否确认提交</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>{{information}}</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="scanRack">确定</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">是否确认强制结束调拨</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>{{context}}</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="stop">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var Common = require("../common/Common.js");
  var Loading = require("../common/Loading.js");
  var ProjectItemAdjustResource = require("../api/wms/ProjectItemAdjustResource.js");
  var Notify = require("../widget/Notify.js");
  var Modal = require("../widget/Modal.vue");
  var ScanWidget = require("../widget/ScanWidget.vue");
  var Navbar = require("../widget/Navbar.vue");
  var DateTime = require("../widget/DateTime.vue");
  var VuePicker = require("../widget/VuePicker/VuePicker.vue");
  var ShowImage = require("../widget/imageWidget/ShowImage.vue");
  var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

  module.exports = {
    data: function() {
      return {
        selectedTab: "artificial", //rfid
        projectItemAdjustId: undefined,
        projectItemAdjustNo: "请选择调拨单",
        projectItemAdjusts: [
          []
        ],
        stockOutPrepareLineDtos: [], // 领料单明细
        inventoryInstances: [], // 物料信息
        inventoryInstanceDetails: [], // 物料详细信息
        projectItemAdjustDate: undefined,
        epcSet: [],
        warnRecordStyle: {
          border: "2px solid red"
        },
        warmRecordStyle: {
          border: "2px solid yellow"
        },
        clickCount: 0,
        positionName: "选择货位",
        displayEpc: undefined, // 是否显示epc
        clickNumber: 0, // 点击次数
        isInquire: false, //是否正在查询
        total: 0,
        pickerVisible: false, // pick 是否显示
        totalSize1: 0,
        totalSize2: 0,
        totalSize3: 0,
        totalSize4: 0,
        showEpc: false,
        information: "",
        projectItemAdjustLines: [],
        context: "",

        //0509
        barCode: null,

        showPictureOfApp: false
      };
    },
    components: {
      Common,
      Modal,
      Loading,
      ScanWidget,
      Navbar,
      DateTime,
      VuePicker,
      ShowImage
    },
    methods: {

      /**
       * 0511
       */
      changeScanQuantity: function(data) {
        var _self = this;

        var totalNum = 0;

        _self.inventoryInstanceDetails.forEach(function(item){
          if(data.inventoryNoAndName == item.inventoryNoAndName){
            totalNum = totalNum + parseInt(item.quantity);
          }
        })

        _self.inventoryInstances.forEach(function(inventoryInstance) {
          if (data.inventoryNoAndName == inventoryInstance.inventoryNoAndName) {
            inventoryInstance.scanQuantity = totalNum;
          }
        });
      },

      /**
       * 0509
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
       * 0509
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
        _self.epcSet.push(temp);
      },
      /**
       * 0509
       * 判断barCode是否重复
       */
      containBarCode: function(barCode) {
        var _self = this;
        // var index = _self.epcSet.contains(barCode);
        // if(index != -1){
        //   return false;
        // }else{
        //   return true;
        // }
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
       * 0509
       * 安卓端扫码成功后调用此函数
       */
      scanResult: function(event) {
        var _self = this;
        _self.barCode = event.detail.barCode;
      },

      selectTab: function(tab) {
        var _self = this;
        if (this.selectedTab == tab) {
          _self.clickCount++;
        } else {
          _self.clickCount = 0;
        }

        if (_self.clickCount > 10) {
          this.showEpc = true;
        }

        this.selectedTab = tab;
      },

      /**
       * 日期选择改变事件
       * @param  {Date} value
       * @return {void}
       */
      textChanged: function(value) {
        this.projectItemAdjustDate = value;
      },

      /**
       * 选择菜单
       * @param {Object} data
       */
      totalChange: function() {
        var _self = this;
        //_self.total = _self.totalChange;
        _self.showDetail();
      },

      // 选择调拨单,显示调拨单的物料信息
      selectProjectItemAdjust: function(selectProjectItemAdjust) {
        var _self = this;

        if (selectProjectItemAdjust[0] != undefined) {
          _self.projectItemAdjustId = selectProjectItemAdjust[0].value;
          _self.projectItemAdjustNo = selectProjectItemAdjust[0].label;
          _self.inventoryInstances =
            selectProjectItemAdjust[0].projectItemAdjustLineDtos;
        }

        _self.total = 0;
        _self.inventoryInstanceDetails.splice(
          0,
          _self.inventoryInstanceDetails.length
        );

        _self.scanCheck();
      },
      // 查询所有调拨单
      queryAllProjectItemAdjust: function() {
        var _self = this;
        var param = {
          documentStatus: "EDIT",
          loadLines: true,
          start: 0,
          length: 0
        };

        //先清空以前的数据
        _self.projectItemAdjusts[0].splice(0, _self.projectItemAdjusts[0].length);

        ProjectItemAdjustResource.list(param).then(
          successData => {
            if (successData) {
              successData.dataList.forEach(function(item) {
                var projectItemAdjustLineDtos = [];
                item.projectItemAdjustLineDtos.forEach(function(item2) {
                  var inventoryInstance = {
                    inventoryId: item2.inventoryId,
                    inventoryNo: item2.inventoryNo,
                    inventoryName: item2.inventoryName,
                    inventoryNoAndName: item2.inventoryNo + "," + item2.inventoryName,
                    needQuantity: item2.quantity,
                    scanQuantity: 0,
                    imageName: item2.imageName,

                    //0511
                    isRfid: item2.isRfid,

                    className: item2.className
                  };
                  projectItemAdjustLineDtos.push(inventoryInstance);
                });
                var temp = {
                  value: item.id,
                  label: item.documentNo + "," + item.userName,
                  projectItemAdjustLineDtos: projectItemAdjustLineDtos
                };
                _self.projectItemAdjusts[0].push(temp);
              });
            }
          },
          errorData => {
            Notify.error("错误", "查询失败。", false);
            Common.processException(errorData);
          }
        );

        console.log(_self.projectItemAdjusts);
      },

      stopBefor: function() {
        var _self = this;
        if (_self.projectItemAdjustId == null) {
          Notify.error("错误", "请选择要结束调拨的调拨单。", false);
          return;
        }

        _self.context =
          "是否确定要强制结束还未调拨完成的调拨单：" +
          _self.projectItemAdjustNo +
          "。如果是，请点击【确定】；如果否，请点击【取消】。";
        $("#myModal2").modal("show");
      },

      //强制结束调拨
      stop: function() {
        var _self = this;
        if (_self.projectItemAdjustId == null) {
          Notify.error("错误", "请选择要结束调拨的调拨单。", false);
          return;
        }
        $("#myModal2").modal("hide");
        var uuid = Loading.show();
        ProjectItemAdjustResource.forcedCompletion(
          _self.projectItemAdjustId
        ).then(
          successData => {
            Loading.hide(uuid);
            Notify.success("成功", successData.errorMessage, false);
            _self.epcSet = [];
            _self.projectItemAdjustId = undefined;
            _self.projectItemAdjustNo = "请选择调拨单";
            _self.inventoryInstances = [];
            _self.inventoryInstanceDetails = [];
            _self.total = 0;
            _self.clickCount = 0;
            _self.totalSize1 = 0;
            _self.totalSize2 = 0;
            _self.totalSize3 = 0;
            _self.totalSize4 = 0;
            _self.projectItemAdjustLines = [];
            (_self.information = ""), _self.queryAllProjectItemAdjust();
          },
          errorData => {
            Loading.hide(uuid);
            Notify.error("错误", "查询失败。", false);
            Common.processException(errorData);
          }
        );
      },
      /**
       * 删除索引为index的存货
       */
      deleteOne: function(index) {
        var _self = this;
        var inventoryInstance = this.inventoryInstanceDetails[index];
        _self.totalSize1--;
        //计算数量
        if (inventoryInstance.errorCode == 0) {
          //正常
          _self.totalSize2--;
        }

        if (inventoryInstance.errorCode == 2) {
          _self.totalSize4--;
        }

        if (inventoryInstance.errorCode == 3) {
          //调拨单中没有具体的需求
          _self.totalSize3--;
        }

        var inventoryNo = this.inventoryInstanceDetails[index].inventoryNo;
        var epc = this.inventoryInstanceDetails[index].epc;
        for (var i = 0; i < this.epcSet.length; i++) {
          if (this.epcSet[i].epc == epc) {
            // 删除epc集合内的数据
            this.epcSet.splice(i, 1);
          }
        }

        // 删除所有工具内的数据
        this.inventoryInstanceDetails.splice(index, 1);

        _self.showDetail();
        // 删除无父件内的工具
        for (var i = 0; i < this.inventoryInstances.length; i++) {
          if (this.inventoryInstances[i].inventoryNo == inventoryNo) {
            this.inventoryInstances[i].scanQuantity =
              this.inventoryInstances[i].scanQuantity - 1;
          }
        }
      },
      // 清空页面数据
      clearData: function() {
        var _self = this;
        _self.epcSet = [];
        _self.projectItemAdjustId = undefined;
        _self.projectItemAdjustNo = "请选择调拨单";
        _self.inventoryInstances = [];
        _self.inventoryInstanceDetails = [];
        _self.total = 0;
        _self.clickCount = 0;
        _self.totalSize1 = 0;
        _self.totalSize2 = 0;
        _self.totalSize3 = 0;
        _self.totalSize4 = 0;
        _self.projectItemAdjustLines = [];
        (_self.information = ""), Notify.success("成功", "页面数据已清空", false);
        _self.queryAllProjectItemAdjust();
      },
      // RFID管理
      rfidManagement: function() {
        this.selectedTab = "rfid";
      },
      // 人工管理
      artificialManagement: function() {
        this.selectedTab = "artificial";
      },
      // 调拨扫描检查
      scanCheck: function() {
        var _self = this;
        //如果正在查询则返回
        if (_self.isInquire) {
          return;
        }
        var titi = 0;
        var projectItemAdjustLineDtos = [];
        _self.epcSet.forEach(function(item) {
          if (item.status == 0) {
            var projectItemAdjustLineDto = {
              epc: item.epc
            };
            projectItemAdjustLineDtos.push(projectItemAdjustLineDto);
          }
        });
        //图片显示测试
        // var temp = { 'epc': '100000000000000000000567', 'barCode': null, 'status': 0 };
        // if (_self.totalSize1 == 0) {
        // 	projectItemAdjustLineDtos.push(temp);
        // }
        // projectItemAdjustLineDtos.push(temp);

        var param = {
          id: _self.projectItemAdjustId,
          projectItemAdjustLineDtos: projectItemAdjustLineDtos
        };

        if (_self.inventoryInstances.length > 0 && projectItemAdjustLineDtos != null && projectItemAdjustLineDtos.length >
          0) {
          var uuid = Loading.show();
          _self.isInquire = true;

          ProjectItemAdjustResource.queryByEpc(param).then(
            successData => {


              Loading.hide(uuid);
              _self.isInquire = false;
              if (
                successData.projectItemAdjustInventoryInstanceResultDtos !=
                null &&
                successData.projectItemAdjustInventoryInstanceResultDtos.length >
                0
              ) {
                var projectItemAdjustInventoryInstanceResultDtos =
                  successData.projectItemAdjustInventoryInstanceResultDtos;
                // 匹配数量
                _self.matchingLeftTabData(
                  projectItemAdjustInventoryInstanceResultDtos
                );
                // 显示物料详细信息
                _self.matchingRightTabData(
                  projectItemAdjustInventoryInstanceResultDtos
                );
                _self.epcSet.forEach(function(item) {
                  successData.projectItemAdjustInventoryInstanceResultDtos.forEach(function(data) {

                    //0509
                    if (item.epc == data.epc || item.epc == data.barCode) {
                      item.status = 1;
                    }
                    // if (item.epc == data.epc) {
                    //   item.status = 1;
                    // }

                  })
                })
              }
            },
            errorData => {
              Loading.hide(uuid);
              _self.isInquire = false;
              Notify.error("错误", "查询失败。", false);
              Common.processException(errorData);
            }
          );
        }
      },
      //  匹配数量
      matchingLeftTabData: function(data) {
        var _self = this;
        data.forEach(function(item) {
          var isExist = false;
          _self.inventoryInstances.forEach(function(inventoryInstance) {
            if (item.inventoryId == inventoryInstance.inventoryId) {
              isExist = true;
              _self.$set(inventoryInstance, "errorCode", item.errorCode);
              _self.$set(inventoryInstance, "errorMessage", item.errorMessage);
              inventoryInstance.scanQuantity = inventoryInstance.scanQuantity + item.quantity;
            }
          });
          if (!isExist) {
            if (item.errorCode == 3) {
              var noInventoryInstance = {
                inventoryId: item.inventoryId,
                inventoryNo: item.inventoryNo,
                inventoryName: item.inventoryName,
                inventoryNoAndName: item.inventoryNo + "," + item.inventoryName,
                needQuantity: null,
                scanQuantity: 1,
                quantity: item.quantity,
                errorCode: item.errorCode,
                errorMessage: item.errorMessage,
                imageName: item.imageName,
                className: item.className
              };
              _self.inventoryInstances.push(noInventoryInstance);
            }
          }
        });
      },
      // 所有工具
      matchingRightTabData: function(data) {
        var _self = this;
        data.forEach(function(item) {
          var inventoryInstanceDetail = {
            inventoryNo: item.inventoryNo,

            //0511
            isRfid: item.isRfid,
            quantity: item.quantity,

            inventoryName: item.inventoryName,
            inventoryNoAndName: item.inventoryNo + "," + item.inventoryName,
            epc: item.epc,
            positionName: item.positionName,
            errorCode: item.errorCode,
            errorMessage: item.errorMessage,
            imageName: item.imageName,
            className: item.className
          };
          if (item.errorCode == 3) {
            //调拨单中没有具体的需求
            _self.$set(inventoryInstanceDetail, "errorStatus1", 0);
            _self.totalSize3++;
          }
          if (item.errorCode == 2) {
            //不属于对应项目事件下的物料，只能删除
            _self.$set(inventoryInstanceDetail, "errorStatus2", 0);
            _self.totalSize4++;
          }
          if (item.errorCode == 0) {
            //正常
            _self.totalSize2++;
          }

          if (item.errorCode != 1) {
            //BOM子件物料，不显示在里面

            _self.inventoryInstanceDetails.push(inventoryInstanceDetail);
            _self.totalSize1++;
          }
        });
        _self.showDetail();
      },

      // 确定调拨
      scanRack: function() {
        var _self = this;
        $("#myModal1").modal("hide");
        if (
          _self.projectItemAdjustLines == null ||
          _self.projectItemAdjustLines.length < 1
        ) {
          Notify.error("错误", "没有可以提交的数据.", false);
          return;
        }
        var param = {
          id: _self.projectItemAdjustId,
          projectItemAdjustLineDtos: _self.projectItemAdjustLines
        };
        var uuid = Loading.show();


        ProjectItemAdjustResource.transferOut(param).then(
          successData => {
            Loading.hide(uuid);
            if (successData) {
              Notify.success("成功", successData.errorMessage, false);
              _self.epcSet = [];
              _self.projectItemAdjustId = undefined;
              _self.projectItemAdjustNo = "请选择调拨单";
              _self.inventoryInstances = [];
              _self.inventoryInstanceDetails = [];
              _self.total = 0;
              _self.clickCount = 0;
              _self.totalSize1 = 0;
              _self.totalSize2 = 0;
              _self.totalSize3 = 0;
              _self.totalSize4 = 0;
              _self.projectItemAdjustLines = [];
              (_self.information = ""), _self.queryAllProjectItemAdjust();
            }
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(errorData);
          }
        );
      },
      // 提交之前检查数据
      submitBefore: function() {
        var _self = this;
        if (_self.projectItemAdjustId == null) {
          Notify.error("错误", "请选择一个调拨单.", false);
          return;
        } else {
          if (
            _self.inventoryInstances.length <= 0 ||
            _self.inventoryInstanceDetails.length <= 0
          ) {
            Notify.error("错误", "没有物料数据可以提交.", false);
            return;
          } else {
            var errorCode = 0;
            //不属于当前项目事件下的物料数量
            var errorCode2 = 0;
            //不属于当前调拨单中的需求物料，但是选择了强制调拨操作的数量
            var errorCode3 = 0;

            //确定调拨的物料实例
            var projectItemAdjustLineDtos = [];

            for (var i = 0; i < _self.inventoryInstanceDetails.length; i++) {
              if (_self.inventoryInstanceDetails[i].errorCode == 0) {
                //正常调拨物料
                var projectItemAdjustLineDto = {
                  epc: _self.inventoryInstanceDetails[i].epc
                };
                projectItemAdjustLineDtos.push(projectItemAdjustLineDto);
                errorCode++;
              }

              if (_self.inventoryInstanceDetails[i].errorCode == 2) {
                //不属于当前项目事件下
                errorCode2++;
              }

              if (
                _self.inventoryInstanceDetails[i].errorCode == 3 &&
                _self.inventoryInstanceDetails[i].errorStatus1 == "0"
              ) {
                //不属于当前调拨单中的需求物料，但是选择了强制调拨操作
                errorCode3++;

                var projectItemAdjustLineDto = {
                  epc: _self.inventoryInstanceDetails[i].epc
                };
                projectItemAdjustLineDtos.push(projectItemAdjustLineDto);
              }
            }

            if (errorCode2 > 0 || errorCode3 > 0) {
              //var information = "";
              if (errorCode2 > 0) {
                _self.information =
                  "当前提交数据中有" +
                  errorCode2 +
                  "个物料不属于原项目事件，会自动剔除。";
              }
              if (errorCode3 > 0) {
                _self.information =
                  _self.information +
                  "有" +
                  errorCode3 +
                  "个物料是未在调拨单的需求详情中，但是选择了强制调拨操作。";
              }
              $("#myModal1").modal("show");
              _self.projectItemAdjustLines = projectItemAdjustLineDtos;
            } else {
              _self.information =
                "当前提交数据中一共扫描到" + errorCode + "个物料。";
              $("#myModal1").modal("show");
              _self.projectItemAdjustLines = projectItemAdjustLineDtos;
            }
          }
        }
      },

      /**
       * 添加epc到集合中
       */
      addEpc: function(epc) {
        var _self = this;
        if (_self.contains(epc)) {
          return;
        }
        var temp = {
          epc: epc,
          barCode: null,
          status: 0
        };
        _self.epcSet.push(temp);
      },
      /**
       * 判断epc是否重复
       */
      contains: function(epc) {
        var _self = this;
        if (_self.epcSet && epc) {
          for (var i = 0; i < _self.epcSet.length; i++) {
            if (_self.epcSet[i].epc == epc) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * 是否显示epc，保存在localStorage中
       */
      getIsDisplayEpc: function() {
        var _self = this;
        var storage = window.localStorage;
        if (!storage) {
          alert("浏览器不支持localstorage");
        } else {
          var isDisaplay = storage.getItem("isDisaplay");
          if (isDisaplay) {
            _self.displayEpc = true;
          } else {
            _self.displayEpc = false;
          }
        }
      },
      /**
       * 设置是否显示epc
       */
      setIsDisplayEpc: function() {
        var _self = this;
        _self.clickNumber = _self.clickNumber + 1;
        if (_self.clickNumber == 5) {
          var storage = window.localStorage;
          if (!storage) {
            alert("浏览器不支持localstorage");
          } else {
            if (_self.displayEpc) {
              _self.displayEpc = false;
            } else {
              _self.displayEpc = true;
            }
            storage.setItem("isDisaplay", _self.displayEpc);
          }
          _self.clickNumber = 0;
        }
      },

      /**
       * 详情显示
       */
      showDetail: function() {
        var _self = this;
        if (_self.total == 0) {
          for (var i = 0; i < _self.inventoryInstanceDetails.length; i++) {
            _self.inventoryInstanceDetails[i].show = true;
          }
        }
        if (_self.total == 1) {
          for (var i = 0; i < _self.inventoryInstanceDetails.length; i++) {
            _self.inventoryInstanceDetails[i].show = false;
            if (_self.inventoryInstanceDetails[i].errorCode == 0) {
              //正常调拨物料
              _self.inventoryInstanceDetails[i].show = true;
            }
          }
        }
        if (_self.total == 2) {
          for (var i = 0; i < _self.inventoryInstanceDetails.length; i++) {
            _self.inventoryInstanceDetails[i].show = false;
            if (_self.inventoryInstanceDetails[i].errorCode == 3) {
              //不属于当前调拨单中的需求物料
              _self.inventoryInstanceDetails[i].show = true;
            }
          }
        }
        if (_self.total == 3) {
          for (var i = 0; i < this.inventoryInstanceDetails.length; i++) {
            _self.inventoryInstanceDetails[i].show = false;
            if (this.inventoryInstanceDetails[i].errorCode == 2) {
              //不是原项目事件下的物料
              _self.inventoryInstanceDetails[i].show = true;
            }
          }
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
    mounted: function() {
      var _self = this;
      _self.getIsDisplayEpc();
      _self.getWmsSettingDto();
      _self.queryAllProjectItemAdjust();

      _self.projectItemAdjustDate = moment().format("YYYY-MM-DD HH:mm:ss");
      //_self.scanCheck();
      // 定时将epc数组往后台传输一次
      _self.interval = window.setInterval(function() {
        _self.scanCheck();
      }, 1000);
      plugin.rfidMiddleware.start();
      plugin.rfidMiddleware.readEvent = function(epc) {
        _self.addEpc(epc);
        return "success";
      };

      //0509
      window.addEventListener("sendScanData", _self.scanResult);
      _self.initEvent();

    },

    watch: {
      total: function(total) {
        if (total == 0) {
          this.showDetail();
        }
        if (total == 1) {
          this.showDetail();
        }
        if (total == 2) {
          this.showDetail();
        }
        if (total == 3) {
          this.showDetail();
        }
      }
    },

    beforeDestroy: function() {
      plugin.rfidMiddleware.stop();
      plugin.rfidMiddleware.stopInventory();

      //0509
      var _self = this;
      window.removeEventListener("sendScanData", _self.scanResult);

    },
    destroyed() {
      var _self = this;
      clearInterval(_self.interval);
    }
  };
</script>

<style scoped>
  .li {
    border: 0px;
  }

  .error-img {
    height: 20px;
    width: 20px;
  }

  .card {
    margin-top: 5px;
    width: 100%;
  }

  .card-header {
    padding: 0.3rem 0.3rem;
  }

  .card-body {
    padding: 0.5rem;
  }

  .card-footer {
    padding: 0.1rem;
  }

  .selected-tab {
    border-radius: 5px;
    height: 41px;
  }

  .card-body .form-inline label {
    text-align: left;
    padding: 0.5rem !important;
  }

  .card-body .form-inline select {
    width: auto;
  }

  .card-body row col-3 {
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
