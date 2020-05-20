<template>

  <div class="container-fluid">
    <Navbar title="项目物料检查">
      <div class="form-inline">
        <button class="btn btn-link" type="submit" @click="submit()">提交</button>
      </div>
    </Navbar>

    <div class="d-flex" style="margin-top:7px">
      <div class="flex-grow-1">
        <input type="button" class="form-control" v-model="projectNoAndName" @click="pickerVisible1 = true" />
      </div>
      <div class="">
        <button class="btn btn-info select-project" @click="create()">创建</button>
      </div>
    </div>

    <!-- 0514 -->
    <div class="d-flex" style="margin-top:7px">
      <div class="flex-grow-1">
        <input type="button" class="form-control" v-model="checkVouchNoAndName" @click="pickerVisible = true">
      </div>
      <div class="">
        <button class="btn btn-info select-project" @click="toInfo()">详情</button>
      </div>
    </div>
    <!--       <div style="margin-top:7px">
      <div class="form-group">
        <input type="button" class="form-control" v-model="checkVouchNoAndName" @click="pickerVisible = true">
      </div>
    </div> -->
    <h6></h6>
    <div class="clear-fix"></div>

    <div>
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item" @click="selectTab('inventory')">
          <a class="nav-link" id="nav-link1" :class="{'active': (selectedTab === 'inventory')}" href="javascript:void(0)">物料信息({{_self.inventoryDtos.length}})</a>
        </li>
        <li class="nav-item" @click="selectTab('inventoryInstance')">
          <a class="nav-link" id="nav-link2" :class="{'active': (selectedTab === 'inventoryInstance')}" href="javascript:void(0)">序列号信息({{_self.inventoryInstanceDtos.length}})</a>
        </li>
      </ul>
    </div>

    <MescrollVue ref="mescroll" class="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" style="margin-top: 35px">

      <div v-show="selectedTab == 'inventory'">
        <div v-for="(data, index) in inventoryDtos" :key="index">
          <div class="card">
            <div class="card-header" :class="{'bg-danger': (data.quantity > data.scanQuantity || data.quantity == 0), 'bg-info': (data.quantity != 0 && data.quantity < data.scanQuantity)}">
              {{index+1}}.{{data.inventoryNo}},{{data.inventoryName}}{{(data.inventoryClass == undefined || data.inventoryClass == null) ? "" : "("+data.inventoryClass+")"}}
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-3" v-if="showPictureOfApp == true">
                  <ShowImage :imageNames="data.imageName" :className="data.className"></ShowImage>
                </div>
                <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                  <div class="d-flex justify-content-between">
                    <div class="p-2">检查数量：{{data.quantity}}</div>
                    <div class="p-2">扫描数量：{{data.scanQuantity}}</div>
                  </div>
                  <div class="card-text" v-if="data.quantity == 0"><img v-lazy="'../../static-wms-app/image/dangerous.jpg'"
                      width="20px" height="20px">
                    <font size="2">物料不属于当前项目事件检查单</font>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="data.projectItemCheckVouchLineInstanceDtos != undefined && data.projectItemCheckVouchLineInstanceDtos.length > 0">
            <div v-for="(item, number) in data.projectItemCheckVouchLineInstanceDtos" :key="number">
              <div v-show="item.projectItemCheckVouchLineDtos != undefined && item.projectItemCheckVouchLineDtos.length > 0">
                <ShowComponent :component="item" :number="(index+number)" :showPictureOfApp="showPictureOfApp"></ShowComponent>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="selectedTab == 'inventoryInstance'">
        <div v-for="(data, index) in inventoryInstanceDtos" :key="index">
          <div class="card">
            <div class="card-header">{{index+1}}.{{data.inventoryNoAndName}}
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between" v-if="showEpc == true">
                <div class="p-2">序列号：{{data.epc}}</div>
              </div>
              <div class="row">
                <div class="col-3" v-if="showPictureOfApp == true">
                  <ShowImage :imageNames="data.imageName" :className="data.className"></ShowImage>
                </div>
                <div :class="(showPictureOfApp == true) ? 'col-9' : 'col-12'">
                  <div class="d-flex justify-content-between">
                    <div class="p-2">标准数量：{{data.quantity}}</div>
                    <div class="p-2" v-if="data.epc == undefined">
                      实际数量：<input style="width: 4em" type="text" v-model="data.actualQuantity" @input="compluteQuantity(data)">
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="p-2">
                <img v-lazy="(data.errorCode != 0) ? '../../static-wms-app/image/dangerous.jpg' : '../../static-wms-app/image/greentrue.jpg'"
                  width="20px" height="20px">
                <font size="2">{{(data.errorCode != 0) ? '('+data.errorMessage+')':''}}</font>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MescrollVue>

    <VuePicker :data="projectItems" :showToolbar="true" @confirm="selectCheckVouch" :visible.sync="pickerVisible" />
    <VuePicker :data="projects" :showToolbar="true" @confirm="selectProjectItem" :visible.sync="pickerVisible1" />
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">保存提示</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            检查单序列号明细状态更新成功
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal()">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var Common = require("../common/Common.js");
  var Loading = require("../common/Loading.js");
  var Notify = require("../widget/Notify.js");
  var ProjectItemResource = require("../api/commom/ProjectItemResource.js");
  var ProjectItemCheckVouchResource = require("../api/wms/ProjectItemCheckVouchResource.js");
  var ProjectItemCheckVouchLineResource = require("../api/wms/ProjectItemCheckVouchLineResource.js");
  var Modal = require("../widget/Modal.vue");
  var Navbar = require("../widget/Navbar.vue");
  var VuePicker = require("../widget/VuePicker/VuePicker.vue");
  var PullTo = require('vue-pull-to').default;
  var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");
  var MescrollVue = require("mescroll.js/mescroll.vue");
  var ShowImage = require("../widget/imageWidget/ShowImage.vue");
  var ShowComponent = require("../widget/ShowComponent.vue");
  var WmsSettingResource = require("../api/commom/WmsSettingResource.js");

  module.exports = {
    data: function() {
      return {
        projectNoAndName: "选择项目事件",
        projectItemId: undefined, // 项目事件id
        projects: [
          [{
            "value": null,
            "label": null,
          }]
        ], //项目事件
        epcSet: [
          // { epc: null, barCode: '12020030000029', status: '0', quantity: 0, actualQuantity: 0 },
          // { epc: null, barCode: '12020030000009', status: '0', quantity: 0, actualQuantity: 0 }
        ],
        clickCount: 0,
        showEpc: false,
        checkVouchNoAndName: '选择项目检查单',
        checkVouchId: undefined,
        pickerVisible: false,
        pickerVisible1: false,
        projectItems: [
          [{
            "value": null,
            "label": null,
          }]
        ],
        selectedTab: 'inventory',
        inventoryDtos: [],
        inventoryInstanceDtos: [],

        start: 0,
        length: 10,
        start2: 0,
        length2: 10,
        inventoryTotalDtos: [],
        inventoryInstanceTotalDtos: [],
        isRequire: false,
        totalSize: 0,
        mescroll: null, // mescroll实例对象
        mescrollDown: {}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
        mescrollUp: { // 上拉加载的配置.
          auto: true, // 是否在初始化完毕之后自动执行上拉回调callback; 默认true
          callback: this.pullupRefresh, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10 //每页数据条数,默认5
          },
          htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
          noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          //避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          //这就是为什么无更多数据有时候不显示的原因
          toTop: {
            //回到顶部按钮
            src: "/static-wms-app/image/mescroll-totop.png", //图片路径,默认null,支持网络图
            offset: 1000 //列表滚动1000px才显示回到顶部按钮
          },
        },
        showPictureOfApp: false,
        bomComponentDtos: [],
        barCode: null,
      }
    },
    components: {
      VuePicker,
      Modal,
      Navbar,
      PullTo,
      ImageEditor,
      MescrollVue,
      ShowImage,
      ShowComponent
    },
    methods: {

      //0514
      toInfo: function() {
        var _self = this;
        if (_self.checkVouchId != null && _self.checkVouchId != undefined) {
          _self.$router.push({
            path: '/desktop/ProjectItemInventoryInstanceCheckInfo',
            query: {
              checkVouchId: _self.checkVouchId,
              checkVouchNoAndName: _self.checkVouchNoAndName,
            }
          });
        } else {
          Notify.error('提示', '请先选择项目事件检查单');
        }
      },

      /**
       * 计算数量
       */
      compluteQuantity: function(data) {
        var _self = this;
        var belongToCurrentProjectItem = data.belongToCurrentProjectItem;
        var inventoryId = data.inventoryId;
        var epc = data.epc;
        var barCode = data.barCode;
        if (belongToCurrentProjectItem == false) {
          _self.inventoryDtos.forEach(function(item) {
            if (inventoryId == item.inventoryId && item.belongToCurrentProjectItem == false) {
              item.scanQuantity = 0;
            }
          })
          for (var i = 0; i < _self.inventoryInstanceDtos.length; i++) {
            // 计算数量
            var isFlag = false;
            if (_self.inventoryInstanceDtos[i].belongToCurrentProjectItem == false) {
              _self.inventoryDtos.forEach(function(item) {
                if (_self.inventoryInstanceDtos[i].inventoryId == inventoryId && item.belongToCurrentProjectItem ==
                  false) {
                  var data = '';
                  if (_self.inventoryInstanceDtos[i].epc == undefined) {
                    data = _self.inventoryInstanceDtos[i].barCode;
                  } else {
                    data = _self.inventoryInstanceDtos[i].epc;
                  }
                  if (item.scanEpcSet.indexOf(data) >= 0) {
                    item.scanQuantity = parseInt(item.scanQuantity + _self.inventoryInstanceDtos[i].actualQuantity);
                  }
                }
              })
            }
          }
        } else {
          var bomComponentDto = {};
          for (var j = 0; j < _self.bomComponentDtos.length; j++) {
            if (epc != undefined) {
              if (_self.bomComponentDtos[j].epcSet.indexOf(epc) >= 0) {
                bomComponentDto = _self.bomComponentDtos[j];
                _self.bomComponentDtos[j].scanQuantity = 0;
              }
            } else {
              if (_self.bomComponentDtos[j].barCodeSet.indexOf(barCode) >= 0) {
                bomComponentDto = _self.bomComponentDtos[j];
                _self.bomComponentDtos[j].scanQuantity = 0;
              }
            }
          }
          for (var i = 0; i < _self.inventoryInstanceDtos.length; i++) {
            if (epc != undefined && _self.inventoryInstanceDtos[i].epc != undefined) {
              if (bomComponentDto.epcSet.indexOf(_self.inventoryInstanceDtos[i].epc) >= 0) {
                bomComponentDto.scanQuantity = parseInt(bomComponentDto.scanQuantity + _self.inventoryInstanceDtos[
                  i].actualQuantity);
              }
            } else if (barCode != undefined && _self.inventoryInstanceDtos[i].barCode != undefined) {
              if (bomComponentDto.barCodeSet.indexOf(_self.inventoryInstanceDtos[i].barCode) >= 0) {
                bomComponentDto.scanQuantity = parseInt(bomComponentDto.scanQuantity + _self.inventoryInstanceDtos[
                  i].actualQuantity);
              }
            }
          }
        }
      },

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
          epc: null,
          barCode: barCode,
          status: '0',
          quantity: 0,
          actualQuantity: 0
        };

        _self.epcSet.push(temp);
      },

      /**
       * 判断barCode是否重复
       */
      containBarCode: function(barCode) {
        var _self = this;
        if (_self.epcSet != null && barCode != null) {
          for (var i = 0; i < _self.epcSet.length; i++) {
            if (_self.epcSet[i].barCode == barCode) {
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

      // 生成检查单
      create: function() {
        var _self = this;
        if (_self.projectItemId == undefined || _self.projectItemId == null) {
          Notify.error('失败', '请选择项目事件', false);
          return;
        }
        var uuid = Loading.show();
        ProjectItemCheckVouchResource.saveProjectItemCheckVouch(
          _self.projectItemId
        ).then(
          successData => {
            Loading.hide(uuid);
            if (successData != null) {
              Notify.success("成功", "项目事件检查单保存完成.", false);
              var page = {
                num: 1,
                size: 10
              };
              if (_self.checkVouchId != null && _self.checkVouchId != undefined) {
                _self.clear();
                _self.pullupRefresh1(page, this.mescroll);
                _self.pullupRefresh2(page, this.mescroll);
              }
              _self.checkVouchId = successData.projectItemCheckVouchId;
              _self.checkVouchNoAndName = successData.documentNo + "," + successData.projectItemName;//+ "," + successData.chekcUser
              _self.findByProjectItemCheckVouchId();
              // 根据项目事件查询对应的项目检查单
              _self.findByProjectItemId();
            }
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(errorData);
          }
        );
      },
      // 点击查询项目
      selectProjectItem: function(selectProjectItem) {
        var _self = this;
        _self.projectItemId = selectProjectItem[0].value;
        _self.projectNoAndName = selectProjectItem[0].label;
        _self.projectItems[0].splice(0, _self.projectItems[0].length);
        // 根据项目事件查询对应的项目检查单
        _self.findByProjectItemId();
      },
      // 查询所有项目事件
      findAllProjectItem: function() {
        var _self = this;
        ProjectItemResource.queryByCondition(null).then(
          successData => {
            if (successData) {
              var temps = [];
              successData.forEach(function(item) {
                var temp = {
                  value: item.id,
                  label: item.no + "," + item.name
                };
                _self.projects[0].push(temp);
              });
            }
          },
          errorData => {
            Common.processException(errorData);
          }
        );
      },
      selectTab: function(tab) {
        if (this.selectedTab == tab) {
          this.clickCount++;
        } else {
          this.clickCount = 0;
        }

        if (this.clickCount > 10) {
          this.showEpc = true;
        }

        this.selectedTab = tab;
      },
      // 清除
      clear: function() {
        var _self = this;
        _self.epcSet = [];
        _self.checkVouchId = undefined;
        _self.checkVouchNoAndName = '选择项目检查单';
        _self.inventoryTotalDtos = [];
        _self.inventoryInstanceTotalDtos = [];
        _self.inventoryDtos = [];
        _self.inventoryInstanceDtos = [];
        _self.start = 0;
        _self.start2 = 0;
      },

      // 点击查询项目检查单
      selectCheckVouch: function(projectItem) {
        var _self = this;
        var page = {
          num: 1,
          size: 10
        };
        if (projectItem != undefined && projectItem.length > 0) {
          if (_self.checkVouchId != null && _self.checkVouchId != undefined) {
            _self.clear();
            _self.pullupRefresh1(page, this.mescroll);
            _self.pullupRefresh2(page, this.mescroll);
          }
          _self.checkVouchId = projectItem[0].value;
          _self.checkVouchNoAndName = projectItem[0].label;
          _self.findByProjectItemCheckVouchId();
        }
      },

      // mescroll组件初始化的回调,可获取到mescroll对象
      mescrollInit(mescroll) {
        this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },


      // 查询所有项目事件检查单
      findAllCheckVouch: function() {
        var _self = this;
        ProjectItemCheckVouchResource.findByCreateUserId().then(successData => {
          if (successData) {
            _self.projectItems[0].splice(0, _self.projectItems[0].length);
            successData.sort(function(a, b) {
              if (a.documentNo > b.documentNo) {
                return -1;
              } else {
                return 1;
              }
            })
            successData.forEach(function(item) {
              var temp = {
                value: item.projectItemCheckVouchId,
                label: item.documentNo + "," + item.projectItemName,// + "," + item.chekcUser
              };
              _self.projectItems[0].push(temp);
            });
          }
        }, errorData => {
          Common.processException(errorData);
        });
      },

      // 查询项目事件对应的所有项目事件检查单
      findByProjectItemId: function() {
        var _self = this;
        ProjectItemCheckVouchResource.findByProjectItemId(_self.projectItemId).then(successData => {
          if (successData && successData.length > 0) {
            successData.sort(function(a, b) {
              if (a.documentNo > b.documentNo) {
                return -1;
              } else {
                return 1;
              }
            })
            _self.projectItems[0].splice(0, _self.projectItems[0].length);
            successData.forEach(function(item) {
              var temp = {
                value: item.projectItemCheckVouchId,
                label: item.documentNo + "," + item.projectItemName + "," + item.chekcUser,
              };
              _self.projectItems[0].push(temp);
            });
          }
        }, errorData => {
          Common.processException(errorData);
        });
      },


      // 根据项目事件查询存货
      findByProjectItemCheckVouchId: function() {
        var _self = this;
        var page = {
          num: 1,
          size: 10
        };
        if (_self.checkVouchId != undefined && _self.checkVouchId != null) {
          ProjectItemCheckVouchLineResource.findByProjectItemCheckVouchId(_self.checkVouchId).then(successData => {
            if (successData) {
              var temp = [];
              successData.forEach(function(item) {
                temp.push(item);
              })
              _self.inventoryTotalDtos = temp;
              _self.createBomComponentDtos(_self.inventoryTotalDtos);
              _self.totalSize = _self.inventoryTotalDtos.length;
              _self.pullupRefresh1(page, this.mescroll);
            }
          }, errorData => {
            Common.processException(errorData);
          });
        }
      },
      // 拆分树成数组
      createBomComponentDtos: function(newData) {
        var _self = this;
        newData.forEach(function(data) {
          var scanEpcSet = [];
          _self.$set(data, 'scanEpcSet', scanEpcSet);
          if (data.scanQuantity == undefined) {
            _self.$set(data, 'scanQuantity', 0);
          }
          _self.bomComponentDtos.push(data);
          if (data.projectItemCheckVouchLineInstanceDtos != undefined && data.projectItemCheckVouchLineInstanceDtos
            .length > 0) {
            data.projectItemCheckVouchLineInstanceDtos.forEach(function(item) {
              _self.createBomComponentDtos(item.projectItemCheckVouchLineDtos);
            })
          } else if (data.projectItemCheckVouchLineDtos != undefined && data.projectItemCheckVouchLineDtos.length >
            0) {
            _self.createBomComponentDtos(data.projectItemCheckVouchLineDtos);
          }
        })
      },
      // epc集合定时传输到后台进行检查
      submitBefore: function() {
        var _self = this;
        var updateData = [];
        var page = {
          num: 1,
          size: 10
        };
        _self.epcSet.forEach(function(item) {
          if (item.status == '0') {
            updateData.push(item);
          }
        })

        //图片显示测试
        // var temp = { epc: '100000000000000000000089', barCode: null, status: '0' };
        // updateData.push(temp);

        if (_self.inventoryDtos.length > 0 && updateData.length > 0 && _self.isRequire == false) {
          _self.isRequire = true;
          ProjectItemCheckVouchLineResource.check(updateData, _self.checkVouchId).then(successData => {
            _self.isRequire = false;
            if (successData && successData.length > 0) {
              successData.forEach(function(item) {
                if (item.errorCode != 1 && item.isDisplay == true) {
                  _self.inventoryInstanceTotalDtos.push(item);
                }
              })
              if (_self.inventoryInstanceTotalDtos.length > 0 && _self.start2 < _self.inventoryInstanceTotalDtos
                .length) {
                _self.pullupRefresh2(page, this.mescroll);
              }
              // 匹配左页签中inventory的实际扫描数量
              _self.matchingLeftTab();
              // 显示在右页签中的inventoryInstance
              if (_self.start2 < _self.length2) {
                _self.matchingRightTab();
              }
              // 处理后修改epc状态
              _self.updateEpcStatus(successData);
            }
          }, errorData => {
            _self.isRequire = false;
            Common.processException(errorData);
          });
        } else {

        }
      },
      // 匹配inventory的数量
      matchingLeftTab: function(mescroll) {
        var _self = this;
        for (var i = 0; i < _self.inventoryInstanceTotalDtos.length; i++) {
          // 计算数量
          var isFlag = false;
          if (_self.inventoryInstanceTotalDtos[i].belongToCurrentProjectItem == false) {
            _self.inventoryDtos.forEach(function(item) {
              if (_self.inventoryInstanceTotalDtos[i].inventoryId == item.inventoryId && item.belongToCurrentProjectItem ==
                false) {
                isFlag = true;
                var data = '';
                if (_self.inventoryInstanceTotalDtos[i].epc == undefined) {
                  data = _self.inventoryInstanceTotalDtos[i].barCode;
                } else {
                  data = _self.inventoryInstanceTotalDtos[i].epc;
                }
                if (item.scanEpcSet.indexOf(data) < 0) {
                  item.scanEpcSet.push(data);
                  item.scanQuantity = item.scanQuantity + _self.inventoryInstanceTotalDtos[i].quantity;
                }
              }
            })
          }
          if (_self.inventoryInstanceTotalDtos[i].belongToCurrentProjectItem == true) {
            for (var j = 0; j < _self.bomComponentDtos.length; j++) {
              if ((_self.bomComponentDtos[j].epcSet != undefined > 0 && _self.bomComponentDtos[j].epcSet.indexOf(
                  _self.inventoryInstanceTotalDtos[i].epc) >= 0) || (_self.bomComponentDtos[j].barCodeSet !=
                  undefined && _self.bomComponentDtos[j].barCodeSet.indexOf(_self.inventoryInstanceTotalDtos[i].barCode) >=
                  0)) {
                isFlag = true;
                if (_self.bomComponentDtos[j].scanEpcSet.indexOf(_self.inventoryInstanceTotalDtos[i].epc) < 0) {
                  _self.bomComponentDtos[j].scanEpcSet.push(_self.inventoryInstanceTotalDtos[i].epc);
                  _self.bomComponentDtos[j].scanQuantity = _self.bomComponentDtos[j].scanQuantity + _self.inventoryInstanceTotalDtos[
                    i].quantity;
                }
              }
            }
          }
          // 当前子件不存在此检查单中，加入集合
          if (isFlag == false) {
            var epcSet = [];
            if (_self.inventoryInstanceTotalDtos[i].epc == undefined) {
              epcSet.push(_self.inventoryInstanceTotalDtos[i].barCode);
            } else {
              epcSet.push(_self.inventoryInstanceTotalDtos[i].epc);
            }
            var inventoryDto = {
              inventoryId: _self.inventoryInstanceTotalDtos[i].inventoryId,
              inventoryNo: _self.inventoryInstanceTotalDtos[i].inventoryNo,
              inventoryName: _self.inventoryInstanceTotalDtos[i].inventoryName,
              quantity: 0,
              scanQuantity: _self.inventoryInstanceTotalDtos[i].quantity,
              belongToCurrentProjectItem: _self.inventoryInstanceTotalDtos[i].belongToCurrentProjectItem,
              hasParentInventoryInstance: _self.inventoryInstanceTotalDtos[i].hasParentInventoryInstance,
              inventoryClass: _self.inventoryInstanceTotalDtos[i].inventoryClass,
              imageName: _self.inventoryInstanceTotalDtos[i].imageName,
              className: _self.inventoryInstanceTotalDtos[i].className,
              scanEpcSet: epcSet,
            }
            _self.inventoryDtos.push(inventoryDto);
          }
        }

        if (mescroll != null) {
          mescroll.endBySize(_self.length, _self.totalSize);

        }
        //          //测试
        //               _self.submitBefore();
      },
      // 显示inventoryInstance
      matchingRightTab: function(mescroll) {
        var _self = this;
        var number = 0;
        for (var i = _self.start2; i < _self.inventoryInstanceTotalDtos.length; i++) {
          if ((i - _self.start2) < _self.length2 && _self.inventoryInstanceTotalDtos[i].isDisplay == true) {
            number++;
            var inventoryInstanceDto = {
              inventoryId: _self.inventoryInstanceTotalDtos[i].inventoryId,
              inventoryNoAndName: _self.inventoryInstanceTotalDtos[i].inventoryNo + "," + _self.inventoryInstanceTotalDtos[
                i].inventoryName,
              epc: _self.inventoryInstanceTotalDtos[i].epc,
              barCode: _self.inventoryInstanceTotalDtos[i].barCode,
              belongToCurrentProjectItem: _self.inventoryInstanceTotalDtos[i].belongToCurrentProjectItem,
              errorCode: _self.inventoryInstanceTotalDtos[i].errorCode,
              errorMessage: _self.inventoryInstanceTotalDtos[i].errorMessage,
              imageName: _self.inventoryInstanceTotalDtos[i].imageName,
              className: _self.inventoryInstanceTotalDtos[i].className,
              quantity: _self.inventoryInstanceTotalDtos[i].quantity,
              actualQuantity: _self.inventoryInstanceTotalDtos[i].quantity,
            };
            _self.inventoryInstanceDtos.push(inventoryInstanceDto);
          }
        }
        _self.start2 = _self.start2 + number;

        if (mescroll != null) {
          mescroll.endBySize(_self.length2, _self.inventoryInstanceTotalDtos.length);

        }
      },
      // 修改EPC状态
      updateEpcStatus: function(data) {
        var _self = this;
        for (var k = 0; k < _self.epcSet.length; k++) {
          for (var m = 0; m < data.length; m++) {
            if (_self.epcSet[k].epc == data[m].epc) {
              _self.epcSet[k].status = '1';
            }
          }
        }
      },
      // 更新检查单序列号明细状态
      submit: function() {
        var _self = this;
        var updateData = [];
        _self.epcSet.forEach(function(item) {
          _self.inventoryInstanceDtos.forEach(function(data) {
            if (item.epc == undefined) {
              if (item.barCode == data.barCode) {
                item.quantity = data.quantity;
                if (data.actualQuantity == undefined || data.actualQuantity.length == 0) {
                  item.actualQuantity = 0;
                } else {
                  item.actualQuantity = parseInt(data.actualQuantity);
                }
              }
            } else {
              if (item.epc == data.epc) {
                item.quantity = data.quantity;
                if (data.actualQuantity == undefined || data.actualQuantity.length == 0) {
                  item.actualQuantity = 0;
                } else {
                  item.actualQuantity = parseInt(data.actualQuantity);
                }
              }
            }
          })
          if (item.status == '1') {
            updateData.push(item);
          }
        })
        if (updateData && updateData.length > 0) {
          var uuid = Loading.show();
          ProjectItemCheckVouchLineResource.save(updateData, _self.checkVouchId).then(successData => {
            Loading.hide(uuid);
            if (successData) {
              // _self.$refs.modal.show = true;
              successData.forEach(function(item) {
                _self.inventoryInstanceTotalDtos.forEach(function(item2) {
                  if (item.epc == item2.epc) {
                    item2.errorMessage = item.errorMessage;
                  }
                })
                _self.epcSet.forEach(function(item3) {
                  if (item.epc == item3.epc) {
                    _self.$set(item3, status, '2');
                  }
                })
              })
              $('#exampleModal').modal('show');
            }
          }, errorData => {
            Loading.hide(uuid);
            Common.processException(errorData);
          });
        } else {
          Notify.error('错误', '没有数据可以提交', false);
        }
      },
      // 关闭模态框
      closeModal: function() {
        $('#exampleModal').modal('hide');
      },

      pullupRefresh: function(page, mescroll) {
        if (this.selectedTab == "inventory") {
          this.pullupRefresh1(page, mescroll);
        } else if (this.selectedTab == "inventoryInstance") {
          this.pullupRefresh2(page, mescroll);
        }
      },

      //上拉加载
      pullupRefresh1: function(page, mescroll) {
        var _self = this;
        if (_self.checkVouchId == undefined || _self.checkVouchId == null) {
          if (mescroll != null) {
            mescroll.endBySize(_self.length, 0);

          }
        } else {
          for (var i = _self.start; i < _self.inventoryTotalDtos.length; i++) {
            if (i - _self.start < _self.length) {
              _self.inventoryDtos.push(_self.inventoryTotalDtos[i]);
            }
          }
          _self.matchingLeftTab(mescroll);
          _self.start = _self.start + _self.length;

        }
      },
      //上拉加载
      pullupRefresh2: function(page, mescroll) {
        var _self = this;
        if (_self.checkVouchId == undefined || _self.checkVouchId == null) {
          if (mescroll != null) {
            mescroll.endBySize(_self.length, 0);

          }
        } else {
          _self.matchingRightTab(mescroll);
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
          status: '0',
          quantity: 0,
          actualQuantity: 0
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
      },
    },

    mounted: function() {
      var _self = this;

      // $('body').scrollspy({ target: '.spy-active' });

      _self.findAllCheckVouch();

      _self.findAllProjectItem();

      _self.getWmsSettingDto();

      // 定时将epc数组往后台传输一次
      _self.interval = window.setInterval(function() {
        _self.submitBefore();
      }, 1000);

      plugin.rfidMiddleware.start();
      plugin.rfidMiddleware.readEvent = function(epc) {
        _self.addEpc(epc);
        return "success";
      }
      window.addEventListener("sendScanData", _self.scanResult);
      _self.initEvent();
    },
    beforeDestroy: function() {
      var _self = this;
      plugin.rfidMiddleware.stopInventory();
      plugin.rfidMiddleware.stop();
      if (this.interval != null) {
        window.clearInterval(this.interval);
      }
      window.removeEventListener("sendScanData", _self.scanResult);
    },
  }
</script>


<style scoped>
  .nav-fill {
    margin-top: -5px;
  }

  .card {
    margin-top: 5px;
    width: 100%;
  }

  .card-header {
    padding: 0.2rem 0.2rem;
  }

  .card-body {
    font-size: 0.8em;
    padding: 0.2rem;
  }

  .card-footer {
    font-size: 0.8em;
    padding: 0.1rem;
  }

  .mescroll {
    position: fixed;
    top: 10rem;
    bottom: 0;
    height: auto;
    left: 0;
    right: 0;
    padding-left: 15px;
    padding-right: 15px;
  }

  .select-project {
    margin-left: 10px;
    width: 80px;
  }
</style>
