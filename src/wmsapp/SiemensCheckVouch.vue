<template>

  <div class="container-fluid">
    <Navbar title="物料盘点">
      <div class="form-inline">
        <button class="btn btn-link" type="submit" @click="submit()">提交</button>
      </div>
    </Navbar>
    <div style="margin-top:10px">
      <div class="form-group">
        <input type="button" class="form-control" v-model="checkVouchNoAndName" @click="pickerVisible = true">
      </div>
    </div>

    <div class="clear-fix"></div>

    <div>
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item" @click="selectTab('inventory')">
          <a class="nav-link" id="nav-link1" :class="{'active': (selectedTab === 'inventory')}" href="javascript:void(0)">盘点信息({{_self.inventoryDtos.length}})</a>
        </li>
        <li class="nav-item" @click="selectTab('inventoryInstance')">
          <a class="nav-link" id="nav-link2" :class="{'active': (selectedTab === 'inventoryInstance')}" href="javascript:void(0)">扫描信息({{_self.inventoryInstanceDtos.length}})</a>
        </li>
      </ul>
    </div>

    <MescrollVue ref="mescroll" class="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit" style="margin-top: 10px">

      <div v-if="selectedTab == 'inventory'">
        <div class="card" v-for="(data, index) in inventoryDtos" :key="index">
          <div class="card-header" :class="{'bg-danger': (data.accountQuantity > (data.checkQuantity + data.scanQuantity) && data.scanQuantity == 0), 'bg-success': (data.accountQuantity  <= data.checkQuantity + data.scanQuantity),'bg-primary': (data.scanQuantity > 0 && (data.accountQuantity  < data.checkQuantity + data.scanQuantity))}">
            {{index+1}}.{{data.inventoryNo}}{{data.inventoryName}}
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="p-2" style="font-size:10px">账面数量：{{data.accountQuantity}}</div>
              <div class="p-2" style="font-size:10px">已盘数量：{{data.checkQuantity}}</div>
              <div class="p-2" style="font-size:10px">扫描数量：{{data.scanQuantity}}</div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="selectedTab == 'inventoryInstance'">
        <div class="card" v-for="(data, index) in inventoryInstanceDtos" :key="index">
          <div class="card-header" :class="{'bg-danger': (data.errorCode == 4), 'bg-info': (data.errorCode == 3), 'bg-warning': (data.errorCode == 2) ,'bg-success': (data.errorCode == 1)}">
            {{index+1}}.{{data.inventoryNoAndName}}.{{data.parent}}</div>
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="p-2">
                <img v-lazy="(data.errorCode != 1) ? '../../static-wms-app/image/dangerous.jpg' : '../../static-wms-app/image/greentrue.jpg'"
                  width="20px" height="20px">
              </div>
              <div class="p-2">
                {{data.errorMessage}}
              </div>

              <!-- 0511 -->
              <div class="p-2" v-if="data.isRfid == false">
                检查数量:<input style="width: 4em" type="text" v-model="data.quantity" @change="changeScanQuantity(data)">
              </div>

            </div>
          </div>
          <div class="card-footer" v-if="showEpc == true">
            EPC:{{data.epc}}
          </div>
        </div>
      </div>

    </MescrollVue>

    <VuePicker :data="checkVouchs" :showToolbar="true" @confirm="selectCheckVouch" :visible.sync="pickerVisible" />
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
            扫描数据提交成功
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <Modal ref="modal"
               full="true"
               title="提示"
               :showOkButton="false">
            <div>检查单序列号明细状态更新成功</div>
        </Modal> -->
  </div>
</template>

<script>
  var Common = require("../common/Common.js");
  var Loading = require("../common/Loading.js");
  var Notify = require("../widget/Notify.js");
  var CheckVouchResource = require("../api/wms/CheckVouchResource.js");
  var Modal = require("../widget/Modal.vue");
  var Navbar = require("../widget/Navbar.vue");
  var VuePicker = require("../widget/VuePicker/VuePicker.vue");
  var PullTo = require('vue-pull-to').default;
  var ImageEditor = require("../widget/imageWidget/ImageEditor.vue");

  var MescrollVue = require("mescroll.js/mescroll.vue");

  module.exports = {
    data: function() {
      return {
        epcSet: [],
        clickCount: 0,
        showEpc: false,
        checkVouchNoAndName: '选择盘点单',
        checkVouchId: undefined, //盘点单id
        pickerVisible: false,
        checkVouchs: [
          [{
            "value": null,
            "label": null,
          }]
        ],
        queryCheckVouchs: [],
        selectedTab: 'inventory',
        checkVouchLines: [], //盘点单的盘点详情
        inventoryDtos: [],
        inventoryInstanceDtos: [],

        //0509
        barCode: null,

        start: 0,
        length: 10,
        start2: 0,
        length2: 10,
        inventoryTotalDtos: [],
        inventoryInstanceTotalDtos: [],
        inventoryInstanceQuerys: [],
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
          noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          //避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
          //这就是为什么无更多数据有时候不显示的原因
          toTop: {
            //回到顶部按钮
            src: "/static-wms-app/image/mescroll-totop.png", //图片路径,默认null,支持网络图
            offset: 1000 //列表滚动1000px才显示回到顶部按钮
          },
        },

      }
    },
    components: {
      VuePicker,
      Modal,
      Navbar,
      PullTo,
      ImageEditor,
      MescrollVue
    },
    methods: {

      /**
       * 0511
       */
      changeScanQuantity: function(data) {
        var _self = this;
        var totalNum = 0;
        _self.inventoryInstanceDtos.forEach(function(item) {
          if (data.inventoryNoAndName == item.inventoryNoAndName) {
            var i = item.quantity;
            // if (i.length > 0) {
            totalNum = totalNum + parseInt(i);
            // } else {
            //   totalNum = totalNum + 0;
            // }
          }
        })
        var no = data.inventoryNoAndName.split(",")[0];
        _self.inventoryDtos.forEach(function(inventory) {
          var index = 0;
          if (no == inventory.inventoryNo) {
            inventory.scanQuantity = totalNum;
            // _self.$set(_self.invoiceDtos, index, _self.invoiceDtos[index]); //更新对象
            // _self.$set(inventory, "scanQuantity", totalNum); //更新值
          }
          index++;
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
          epc: null,
          barCode: barCode,
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
       * 0509
       * 安卓端扫码成功后调用此函数
       */
      scanResult: function(event) {
        var _self = this;
        _self.barCode = event.detail.barCode;
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
        _self.checkVouchNoAndName = '选择盘点单';
        _self.inventoryTotalDtos = [];
        _self.inventoryInstanceTotalDtos = [];
        _self.inventoryDtos = [];
        _self.inventoryInstanceDtos = [];
        _self.start = 0;
        _self.start2 = 0;
      },

      // 点击选择盘点单
      selectCheckVouch: function(checkVouch) {
        var _self = this;
        var page = {
          num: 0,
          size: 10
        };
        if (checkVouch != undefined && checkVouch.length > 0) {
          if (_self.checkVouchId != null && _self.checkVouchId != undefined) {
            _self.clear();
          }
          _self.checkVouchId = checkVouch[0].value;
          _self.checkVouchNoAndName = checkVouch[0].label;



          //选择盘点单后再查询盘点详情
          var param = {
            checkVouchId: _self.checkVouchId,
            checkVouchStatus: 'NONECHECKED',
            length: 0,
            loadLines: true
          }
          CheckVouchResource.findByCheckVouchQueryParam(param).then(successData => {
            if (successData != null && successData.dataList != null) {
              _self.checkVouchLines = successData.dataList[0].checkVouchsDtos;
              _self.checkVouchLines.forEach(function(item) {
                item.scanQuantity = 0;
              })
              _self.totalSize = successData.dataList[0].checkVouchsDtos.length;
              _self.pullupRefresh1(page, this.mescroll);
            }
          }, errorData => {
            Common.processException(errorData);
          });
          //_self.pullupRefresh1(page, this.mescroll);
          //_self.matchingLeftTab(this.mescroll);
          //测试
          // _self.submitBefore();

        }
      },

      // mescroll组件初始化的回调,可获取到mescroll对象
      mescrollInit(mescroll) {
        this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },


      // 查询所有物料盘点单
      findByCheckVouchQueryParam: function() {
        var _self = this;
        var param = {
          checkVouchStatus: 'NONECHECKED',
          length: 0,
          loadLines: false
        }
        CheckVouchResource.findByCheckVouchQueryParam(param).then(successData => {
          if (successData != null && successData.dataList != null) {
            successData.dataList.forEach(function(item) {
              var temp = {
                value: item.checkVouchId,
                label: item.name + "," + item.documentNo + "," + item.warehouseName,
              };
              _self.checkVouchs[0].push(temp);
            });
            _self.queryCheckVouchs = successData.dataList;
          }
        }, errorData => {
          Common.processException(errorData);
        });
      },


      // epc集合定时传输到后台进行检查
      submitBefore: function() {
        var _self = this;
        var checkVouchInventoryInstanceDtos = [];
        var page = {
          num: 0,
          size: 10
        };
        console.log(_self.epcSet);
        _self.epcSet.forEach(function(item) {
          if (item.status == '0') {
            var checkVouchInventoryInstanceDto = {
              epc: item.epc,

              //0509
              barCode: item.barCode,

            }
            checkVouchInventoryInstanceDtos.push(checkVouchInventoryInstanceDto);
            item.status = '1';
          }
        })
        if (_self.checkVouchLines.length > 0 && checkVouchInventoryInstanceDtos.length > 0 && _self.isRequire ==
          false) {
          _self.isRequire = true;
          CheckVouchResource.check(checkVouchInventoryInstanceDtos, _self.checkVouchId).then(successData => {
            _self.isRequire = false;
            if (successData && successData.length > 0) {
              successData.forEach(function(item) {
                _self.inventoryInstanceTotalDtos.push(item);
              })
              // _self.epcSet.forEach(function(item){
              //   item.status = '1';
              // })
              //获取每次查询的数据
              _self.inventoryInstanceQuerys = successData;


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
              //_self.updateEpcStatus(successData);
            }
          }, errorData => {
            _self.isRequire = false;
            Common.processException(errorData);
          });
        }
      },
      // 匹配inventory的数量
      matchingLeftTab: function(mescroll) {
        var _self = this;
        for (var i = 0; i < _self.inventoryInstanceQuerys.length; i++) {

          for (var j = 0; j < _self.checkVouchLines.length; j++) {
            if (_self.inventoryInstanceQuerys[i].inventoryId == _self.checkVouchLines[j].inventoryId) {
              _self.checkVouchLines[j].scanQuantity = _self.checkVouchLines[j].scanQuantity + _self.inventoryInstanceQuerys[
                i].quantity;
            }
          }

          //更新显示数据
          for (var k = 0; k < _self.inventoryDtos.length; k++) {
            if (_self.inventoryInstanceQuerys[i].inventoryId == _self.inventoryDtos[k].inventoryId) {
              _self.inventoryDtos[k].scanQuantity = _self.inventoryDtos[k].scanQuantity + 1;
            }
          }
        }

        //清空这次查询信息
        _self.inventoryInstanceQuerys.splice(0, _self.inventoryInstanceQuerys.length);

        var addNumber = 0;
        for (var i = _self.start; i < _self.checkVouchLines.length; i++) {
          if ((i - _self.start) < _self.length) {
            addNumber++;
            var inventoryDto = {
              checkVouchsId: _self.checkVouchLines[i].checkVouchsId,
              inventoryId: _self.checkVouchLines[i].inventoryId,
              inventoryNo: _self.checkVouchLines[i].inventoryNo,
              inventoryName: _self.checkVouchLines[i].inventoryName,
              inventoryType: _self.checkVouchLines[i].inventoryType,
              accountQuantity: _self.checkVouchLines[i].accountQuantity,
              checkQuantity: _self.checkVouchLines[i].checkQuantity,
              scanQuantity: _self.checkVouchLines[i].scanQuantity == null ? 0 : _self.checkVouchLines[i].scanQuantity
            }
            _self.inventoryDtos.push(inventoryDto);
          }
        }

        _self.start = _self.start + addNumber;


        if (mescroll != null) {
          console.log(_self.length + "," + _self.checkVouchLines.length);
          mescroll.endBySize(_self.length, _self.checkVouchLines.length);

        }


      },
      // 显示inventoryInstance
      matchingRightTab: function(mescroll) {
        var _self = this;
        var number = 0;
        for (var i = _self.start2; i < _self.inventoryInstanceTotalDtos.length; i++) {
          if ((i - _self.start2) < _self.length2) {
            number++;
            var inventoryInstanceDto = {
              inventoryNoAndName: _self.inventoryInstanceTotalDtos[i].inventoryNo + "," + _self.inventoryInstanceTotalDtos[
                i].inventoryName,
              epc: _self.inventoryInstanceTotalDtos[i].epc,

              //0511
              isRfid: _self.inventoryInstanceTotalDtos[i].isRfid,
              quantity: _self.inventoryInstanceTotalDtos[i].quantity,

              belongToCurrentProjectItem: _self.inventoryInstanceTotalDtos[i].belongToCurrentProjectItem,
              errorCode: _self.inventoryInstanceTotalDtos[i].errorCode,
              errorMessage: _self.inventoryInstanceTotalDtos[i].errorMessage,
              //parentInventoryInstanceId:_self.inventoryInstanceTotalDtos[i].parentInventoryInstanceId,
              //parentInventoryInstanceNoAndName:_self.inventoryInstanceTotalDtos[i].parentInventoryInstanceNo + ","  + _self.inventoryInstanceTotalDtos[i].parentInventoryInstanceName
            };
            if (_self.inventoryInstanceTotalDtos[i].parentInventoryInstanceId != null) {
              inventoryInstanceDto.parent = "(父件信息:" + _self.inventoryInstanceTotalDtos[i].parentInventoryInstanceNo +
                "," +
                _self.inventoryInstanceTotalDtos[i].parentInventoryInstanceName + ")";
            } else {
              inventoryInstanceDto.parent = "";
            }
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
              _self.$set(_self.epcSet[k], 'status', '1');
            }
          }
        }
      },

      // 更新检查单序列号明细状态
      submit: function() {
        var _self = this;
        var checkVouchInventoryInstanceDtos = [];
        _self.epcSet.forEach(function(item) {
          if (item.status == '1') {
            var checkVouchInventoryInstanceDto = {
              epc: item.epc,

              //0509
              barCode: item.barCode,

            }
            checkVouchInventoryInstanceDtos.push(checkVouchInventoryInstanceDto);
          }
        })
        if (checkVouchInventoryInstanceDtos != null && checkVouchInventoryInstanceDtos.length > 0) {
          var uuid = Loading.show();
          CheckVouchResource.update(checkVouchInventoryInstanceDtos, _self.checkVouchId).then(successData => {
            Loading.hide(uuid);
            if (successData) {
              // _self.$refs.modal.show = true;
              successData.forEach(function(item) {
                //全部数据
                _self.inventoryInstanceTotalDtos.forEach(function(item2) {
                  if (item.epc == item2.epc) {
                    item2.errorMessage = item.errorMessage;
                  }
                })

                //显示数据
                _self.inventoryInstanceDtos.forEach(function(item3) {
                  if (item.epc == item3.epc) {
                    item3.errorMessage = item.errorMessage;
                  }
                })

                _self.epcSet.forEach(function(item3) {
                  if (item.epc == item3.epc) {
                    _self.$set(item3, status, '2');
                  }
                })
              })
              $('#exampleModal').modal('show');

              _self.findByCheckVouchQueryParam();
            }
          }, errorData => {
            Loading.hide(uuid);
            Common.processException(errorData);
          });
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
          _self.matchingLeftTab(mescroll);

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
          barcode: null,
          status: '0'
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
    },

    mounted: function() {
      var _self = this;

      // $('body').scrollspy({ target: '.spy-active' });

      _self.findByCheckVouchQueryParam();

      // 定时将epc数组往后台传输一次
      _self.interval = window.setInterval(function() {
        _self.submitBefore();
      }, 1000);


      plugin.rfidMiddleware.start();
      plugin.rfidMiddleware.readEvent = function(epc) {
        _self.addEpc(epc);
        return "success";
      }

      //0509
      window.addEventListener("sendScanData", _self.scanResult);
      _self.initEvent();

    },
    beforeDestroy: function() {
      plugin.rfidMiddleware.stopInventory();
      plugin.rfidMiddleware.stop();

      //0509
      var _self = this;
      window.removeEventListener("sendScanData", _self.scanResult);

      if (this.interval != null) {
        window.clearInterval(this.interval);
      }
    },
  }
</script>


<style scoped>
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

  .card {
    margin-top: 5px;
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
</style>
