<template>
    <div v-show="show" :transition="transition">
        <div class="modal" @click.self="clickMask">
            <div class="modal-dialog" :class="modalClass" name="dialog">
                <div class="modal-content">
                    <!--Header-->
                    <div class="modal-header">
                        <slot name="header">
                            <a type="button" class="close" @click="cancel">x</a>
                            <h4 class="modal-title">
                                <slot name="title">
                                    {{title}}
                                </slot>
                            </h4>
                        </slot>
                    </div>
                    <!--Container-->
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <!--Footer-->
                    <div class="modal-footer">
                        <slot name="footer">
                            <button type="button" class="btn btn-info" v-if="showCanelButton" @click="cancel">{{cancelText}}</button>
                            <button type="button" class="btn btn-primary" v-if="showOkButton" @click="ok">{{okText}}</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop in"></div>
    </div>
</template>

<script>

var ModalFix = require("./ModalFix.js");

module.exports = {
    props: {
        title: String,
        small: [Boolean, String],
        large: [Boolean, String],
        full: [Boolean, String],
        // 为true时无法通过点击遮罩层关闭modal
        force: Boolean,
        // 自定义组件transition
        transition: String,
    	// 显示确定按钮
    	showOkButton: {
			type: Boolean,
			default: true
    	},
    	// 显示取消按钮
    	showCanelButton: {
			type: Boolean,
			default: true
    	},
    },

    data: function(){
        return {
            show: false,
            okText: "确定",
            cancelText: "取消",
            okClass : "",
            cancelClass : ""
        };
    },

    computed: {
        modalClass : function() {
            return {
                'modal-lg': this.large || this.large == 'true',
                'modal-sm': this.small || this.small == 'true',
                'modal-full': this.full || this.full == 'true'
            }
        }
    },
        
    created: function() {
        if (this.show) {
            if(document.body.className.indexOf('modal-open') < 0){
                document.body.className += ' modal-open';
            }
        }
    },

    watch: {
        show : function (value) {
            console.log("modal watch show = " + value);
            // 在显示时去掉body滚动条，防止出现双滚动条
            if (value) {
                if(document.body.className.indexOf('modal-open') < 0){
                    document.body.className += ' modal-open';
                }
            } else {
                this.$nextTick(function(){
                    ModalFix.fix();
                });
            }
        }
    },

    methods: {
        ok: function() {
            this.$emit('ok');
            this.show = false;
            this.$nextTick(function(){
                ModalFix.fix();
            });           
        },

        cancel: function () {
            this.$emit('cancel');
            this.show = false;
            this.$nextTick(function(){
                ModalFix.fix();
            });
        },

        // 点击遮罩层
        clickMask: function () {
            if (!this.force) {
                this.cancel();
                this.$nextTick(function(){
                    ModalFix.fix();
                });
            }
        },
        
        /**
         * 显示
         */
        showModal: function(){
        	this.show = true;
        },
        
        /**
         * 隐藏
         */
        hideModal: function(){
        	this.show = false;
        }
    },
    
    mounted: function(){
    	
    }
}
</script>


<style scoped>
    .modal {
        display: block;
    }
    .modal-transition {
        transition: all .6s ease;
    }
    .modal-leave {
        /* 样式没什么用，但可以让根标签的transitionEnd生效，以去掉modal-leave */
        border-radius: 1px !important;
    }
    .modal-transition .modal-dialog, .modal-transition .modal-backdrop {
        transition: all .5s ease;
    }
    .modal-enter .modal-dialog, .modal-leave .modal-dialog {
        opacity: 0;
        transform: translateY(-30%);
    }

    .modal-enter .modal-backdrop, .modal-leave .modal-backdrop {
        opacity: 0;
    }

    .modal-full{
        width: 95%;
    }

    .modal-lg{
        width: 75%;
    }

    .modal-sm{
        width: 50%;
    }
</style>