<template>
    <label :class="classObject">
        <input type="checkbox" :disabled="disabled" v-model="value">
        <div></div>
        <span class="vue-switcher__label">
            <span v-if="value" v-text="textTrue"></span>
            <span v-if="!value" v-text="textFalse"></span>
        </span>
    </label>
</template>

<script>
	
	module.exports = {
	    name: 'switches',
	    props: [
	        "selected", // 选择状态, false
	        "disabled", // 禁用, false
	        "textTrueIn",  // True状态下的文字
	        "textFalseIn", // False状态下的文字
	        "color",    // 显示的颜色default,primary,success,info,warning,danger
	        "type-bold",    // 大图标
	        ],
	
	    data: function(){
	        var tempValue = false;
	        if(this.selected != undefined){
	            tempValue = (this.selected == 'true' || this.selected == true);
	        }
	
	        return {
	            "value": tempValue,
	            "textTrue": (this.textTrueIn == undefined) ? "是" : this.textTrueIn,
	            "textFalse": (this.textFalseIn == undefined) ? "否" : this.textFalseIn,
	            "theme": "default",
	        }
	    },
	
	    watch: {
	        value: function(val, oldVal) {
	            this.$emit('input', val);
	        },
	
	        selected: function(val, oldVal) {
	            if(val != undefined){
	                this.value = (val == 'true' || val == true);
	            }
	        }
	    },
	
	    computed: {
	        classObject : function() {
	            var _self = this;
	
	            return {
	                'vue-switcher' : true,
	                ['vue-switcher--unchecked'] : !_self.value,
	                ['vue-switcher--disabled'] : !!_self.disabled,
	                ['vue-switcher--bold']: !!_self.typeBold,
	                ['vue-switcher--bold--unchecked']: !!_self.typeBold && !_self.value,
	                [`vue-switcher-theme--${_self.theme}`] : _self.theme,
	                [`vue-switcher-color--${_self.color}`] : _self.color,
	            };
	
	        }
	    }
	}
</script>

<style>
	.vue-switcher {
	  position: relative;
	  display: inline-block;
	  width: 100px;
	  height: 26px;
	  line-height: 26px;
	  margin-bottom: 0px;
	  top: 7px;
	}
	.vue-switcher__label {
	  position: absolute;
	  left: 60px;
	  top: 0px;
	  height: 26px;
	  line-height: 26px;
	  display: block;
	  font-size: 10px;
	  margin-bottom: 0px;
	}
	.vue-switcher input {
	  position: absolute;
	  left: 0px;
	  top: 0px;
	  width: 60px;
	  height: 26px;
	  line-height: 26px;
	  opacity: 0;
	  z-index: 1;
	  cursor: pointer;
	  margin: 0px !important;
	}
	.vue-switcher div {
	  position: absolute;
	  left: 0px;
	  top: 8px;
	  width: 40px;
	  height: 10px;
	  border-radius: 30px;
	  display: -webkit-flex;
	  display: -ms-flex;
	  display: flex;
	  align-items: center;
	  justify-content: flex-start;
	  cursor: pointer;
	}
	.vue-switcher div:after {
	  position: absolute;
	  top: -4;
	  left: 100%;
	  content: '';
	  height: 18px;
	  width: 18px;
	  border-radius: 100px;
	  display: block;
	  transition: all ease 0.3s;
	  margin-left: -17px;
	  cursor: pointer;
	}
	.vue-switcher--unchecked div {
	  justify-content: flex-end;
	}
	.vue-switcher--unchecked div:after {
	  left: 15px;
	}
	.vue-switcher--disabled div {
	  opacity: 0.3;
	}
	.vue-switcher--disabled input {
	  cursor: not-allowed;
	}
	.vue-switcher--bold div {
	  top: 0px;
	  height: 26px;
	  width: 51px;
	}
	.vue-switcher--bold div:after {
	  margin-left: -22px;
	  top: 4px;
	}
	.vue-switcher--bold--unchecked div:after {
	  left: 26px;
	}
	.vue-switcher--bold .vue-switcher__label span {
	  padding-bottom: 7px;
	  display: inline-block;
	}
	.vue-switcher-theme--default.vue-switcher-color--default div {
	  background-color: #b7b7b7;
	}
	.vue-switcher-theme--default.vue-switcher-color--default div:after {
	  background-color: #9d9d9d;
	}
	.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked div {
	  background-color: #aaa;
	}
	.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked div:after {
	  background-color: #c4c4c4;
	}
	.vue-switcher-theme--default.vue-switcher-color--blue div {
	  background-color: #77b0c8;
	}
	.vue-switcher-theme--default.vue-switcher-color--blue div:after {
	  background-color: #539bb9;
	}
	.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked div {
	  background-color: #c0dae5;
	}
	.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked div:after {
	  background-color: #77b0c8;
	}
	.vue-switcher-theme--default.vue-switcher-color--red div {
	  background-color: #c87777;
	}
	.vue-switcher-theme--default.vue-switcher-color--red div:after {
	  background-color: #b95353;
	}
	.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked div {
	  background-color: #e5c0c0;
	}
	.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked div:after {
	  background-color: #c87777;
	}
	.vue-switcher-theme--default.vue-switcher-color--yellow div {
	  background-color: #c9c377;
	}
	.vue-switcher-theme--default.vue-switcher-color--yellow div:after {
	  background-color: #bab353;
	}
	.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked div {
	  background-color: #e6e3c0;
	}
	.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked div:after {
	  background-color: #c9c377;
	}
	.vue-switcher-theme--default.vue-switcher-color--orange div {
	  background-color: #c89577;
	}
	.vue-switcher-theme--default.vue-switcher-color--orange div:after {
	  background-color: #b97953;
	}
	.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked div {
	  background-color: #e5cec0;
	}
	.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked div:after {
	  background-color: #c89577;
	}
	.vue-switcher-theme--default.vue-switcher-color--green div {
	  background-color: #77c88d;
	}
	.vue-switcher-theme--default.vue-switcher-color--green div:after {
	  background-color: #53b96e;
	}
	.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked div {
	  background-color: #c0e5ca;
	}
	.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked div:after {
	  background-color: #77c88d;
	}
</style>