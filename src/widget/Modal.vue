<template>
    <div :id="uuid" class="modal fade">
        <div class="modal-dialog" :class="modalClass" role="document">
            <div class="modal-content">
                <!--Header-->
                <div class="modal-header">
                    <slot name="header">                        
				        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
				          <span aria-hidden="true">&times;</span>
				          <span class="sr-only">Close</span>
				        </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </slot>
                </div>
                <!--Container-->
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <!--Footer-->
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-info" @click="cancel">取消</button>
                        <button type="button" class="btn btn-primary" @click="ok">确定</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	
var UUID = require("../common/Uuid.js");

module.exports = {
    props: [
        // String
        "title", 
        // Boolean
        "large"],

    data: function(){
        return {
            uuid: UUID.createUUID(),
        };
    },

    computed: {
        modalClass : function() {        	
            return {
                'modal-lg': this.large,
                'modal-sm': !this.large
            }
        }
    },


    methods: {
    	/**
    	 * 显示
    	 */
    	show: function(){
			$('#' + this.uuid).modal('show');
    	},
    	
    	/**
    	 * 隐藏
    	 */
    	hide: function(){
    		$('#' + this.uuid).modal('hide');
    	},
    	
    	/**
    	 * 确定
    	 */
        ok: function() {
            this.$emit('ok');
            this.hide();
        },

		/**
		 * 取消
		 */
        cancel: function () {
            this.$emit('cancel');
            this.hide();
        },
    },
    
    created: function(){
    	var _self = this;
    	// 初始化modal组件
    	this.$nextTick(function(){
			$('#' + _self.uuid).modal({
				keyboard: true,
				backdrop: false,
				show: false,
			});
       	});
    }
}
</script>