<template>
	<div>
        <ImageWidget 
            :fieldValue="fieldValue" 
            :className="className" 
            :readonly="readonly"
            @valueChanged = "valueChanged"
           ></ImageWidget>
	</div>
</template>

<script>
var Common = require("../../common/Common.js");
var Notify = require("../Notify.js");
var ImageWidget = require("./ImageWidget.vue");

module.exports = {
    props: [
        /**
         * 类名(String)
         */
        "className",
        /**
         * 记录Id(Number)
         */
        "recordId",
        /**
         * 字段名称(String)
         */
        "fieldName",
        /**
         * 是否只读(Boolean)
         */
        "readonly"
    ],

    data: function() {
        return {
            fieldValue: {
                displayValue: [],
                fieldType: "String"
            }
        };
    },

    components: {
        Common,
        ImageWidget
    },

    methods: {

        clearFieldValue: function () {
            this.fieldValue = {
                displayValue: [],
                fieldType: "String"
            }
        },
      

        // 值改变事件
        valueChanged: function(newFieldValue) {
            if (!newFieldValue) {
                this.fieldValue.displayValue = [];
            }
            this.fieldValue = newFieldValue;
            this.$emit("getImageURL", this.fieldValue);
            // this.updateFieldValue();   //delete by zhanghao
        },

        /**
         * 从后台获取字段值的
         */
        getFieldValue: function() {
            var _self = this;
            $.ajax({
                url: Common.getApiURL("fieldResource/getFieldValue"),
                type: "post",
                dataType: "text",
                data: {
                    className: _self.className,
                    recordId: _self.recordId,
                    fieldName: _self.fieldName
                },
                beforeSend: function(request) {
                    Common.addTokenToRequest(request);
                },
                success: function(data) {
                    _self.fieldValue.displayValue.push(data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(
                        XMLHttpRequest,
                        textStatus,
                        errorThrown
                    );
                }
            });
        },
        /**
         * 更新字段的值
         */
        updateFieldValue: function() {
            var _self = this;
            var value;
            if (
                _self.fieldValue &&
                _self.fieldValue.displayValue &&
                _self.fieldValue.displayValue.length > 0
            ) {
                value = _self.fieldValue.displayValue[0];
            } else {
                value = undefined;
                return; //add by zhanghao
            }
            $.ajax({
                url: Common.getApiURL("fieldResource/updateStringField"),
                type: "post",
                dataType: "text",
                data: {
                    className: _self.className,
                    recordId: _self.recordId,
                    fieldName: _self.fieldName,
                    fieldValue: value
                },
                beforeSend: function(request) {
                    Common.addTokenToRequest(request);
                },
                success: function(data) {
                    _self.getFieldValue();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(
                        XMLHttpRequest,
                        textStatus,
                        errorThrown
                    );
                }
            });
        }
    },
    mounted: function() {
        var _self = this;
        // _self.getFieldValue();
    }
};
</script>

<style scoped>
</style>
