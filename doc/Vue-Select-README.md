中文 | [English](https://github.com/naihe138/vue-picker/blob/master/README-en.md)


`vue-select`的组件，可以存储对象集合供前台选择，并且根据值的改变，做出相应的动作


![vue-pick.gif][1]


## Demo(快点去复制代码体验一波吧)

[https://naihe138.github.io/vue-picker/index.html][3]


## Install

`npm install vue-select --save` or `yarn add vue-select`


## 使用


````javascript
<template>
    <div class="form-group">
      <div class="v-select-container">
        <v-select id="projectItemSelect" label="noName" :options="xxxList" v-model="selectedxxx" @input="selectedxxxChanged"
          placeholder="请输入名称或编号"></v-select>
      </div>
    </div>
</template>

<script>
  var vSelect = require("vue-select");

  export default {
    components: {
      "v-select": vSelect.VueSelect,
    },
    data () {
      return {
        xxxList: [],
        selectedxxx: {},
      }
    },
    methods: {

      xxx: function() {
        var _self = this;
        var uuid = Loading.show();
        ProjectItemResource.xxx().then(
          successData => {
            Loading.hide(uuid);
            if (successData === undefined && successData.length === 0) {
              return
            }
            successData.forEach(function(projectItem) {
              xxx.noName = xxx.no + "," + xxx.name;
            });

            _self.xxxList = successData;
          },
          errorData => {
            Loading.hide(uuid);
            Common.processException(XMLHttpRequest);
          }
        );
      },

        /**
         * 选择的项目事件发生改变
         */
        selectedxxxChanged: function(value) {
          <!-- if(value == undefined){
            this.findByCondition();
            return;
          }
          this.findByCondition(value.id); -->
        },
    }
  }
</script>
````

## 属性参数说明

参数 | 说明 | 是否必须 | 类型 |默认值
---- | --- | --- | --- | ---
label | 显示字段 | 是 | 字段 | false
options | 接受选项的集合  | 是 | Array | []

## 事件说明

参数 | 说明 | 是否必须 | 类型 |默认值
---- | --- | --- | --- | ---
selectedxxxChanged | 数据变化事件 | 否 | function(val) | 无


[1]: http://ypimg.naice.me/vue-picker.gif
[3]: https://naihe138.github.io/vue-picker/index.html
