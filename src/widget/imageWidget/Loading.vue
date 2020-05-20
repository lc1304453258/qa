<template>
	<div class="loading" v-show="visible">
		<input ref="focusInput" class="focus-input"></input>
		<div :id="id" class="spinner" >
			<div class="circ1"></div>
			<div class="circ2"></div>
			<div class="circ3"></div>
			<div class="circ4"></div>
			<h4>{{text}}</h4>
		</div>
	</div>
</template>

<script>
	var UUID = require("../../common/Uuid.js");

	module.exports = {
		props: ["text"],
		data: function(){
			return{
				"id" : 'loading_' + UUID.createUUID(),
				"visible" : false,
				"uuid": UUID.createUUID(),
			}
		},

		methods:{
			// 居中显示
	        centerLoader: function () {
	        	var _self = this;
	            var winW = $(window).width();
	            var winH = $(window).height();
	            
	            var id = '#' + _self.id;
	            var spinnerW = $(id).outerWidth();
	            var spinnerH = $(id).outerHeight();
	            
	            $(id).css({
	                'position':'absolute',
	                'left':((winW/2)-(spinnerW/2)) + 'px',
	                'top':((winH/2)-(spinnerH/2)) + 'px'
	            });
	        },

	        // 显示加载中的界面
	        show: function(){
	        	var _self = this;
	        	_self.visible = true;
	        	
	        	window[_self.uuid] = document.activeElement;
	        	
	        	_self.$nextTick(function() { 
　　　　　　　　		_self.centerLoader();
		        	$(window).resize(function(){
	                	_self.centerLoader();
	              	});
	        		$(_self.$refs.focusInput).focus();
　　　　　　　　	});
	        },

	        // 隐藏加载中的界面
	        hide: function(){
	        	var _self = this;
	        	if(window[_self.uuid] != undefined){
	        		console.log("loading uuid:" + window[_self.uuid]);
	        		window[_self.uuid].focus();
	        		window[_self.uuid] = undefined;
	        	}
	        	_self.visible = false;
	        }
		},

		mounted: function(){
			this.hide();
		}
	}

</script>

<style scoped>
	.loading{
		display: block;
		position: fixed;
	    width:100%;
	    height:100%;
	    top: 0px;
	    left: 0px;
	    z-index: 99999;
	    background-color:#2ecc71;
	    opacity:0.5;
	}

	.circle1 { top: 0; left: 0; }
	.circle2 { top: 0; right: 0; }
	.circle3 { right: 0; bottom: 0; }
	.circle4 { left: 0; bottom: 0; }

  	.spinner {
      width: 90px;
      height: 30px;
      text-align: center;
    }

    .spinner > div {
      background-color: #fff;
      height: 15px;
      width: 15px;
      margin-left:3px;
      border-radius: 50%;
      display: inline-block;
      
      -webkit-animation: stretchdelay 0.7s infinite ease-in-out;
      animation: stretchdelay 0.7s infinite ease-in-out;
    }

    .spinner .circ2 {
      -webkit-animation-delay: -0.6s;
      animation-delay: -0.6s;
    }

    .spinner .circ3 {
      -webkit-animation-delay: -0.5s;
      animation-delay: -0.5s;
    }

    .spinner .circ4 {
      -webkit-animation-delay: -0.4s;
      animation-delay: -0.4s;
    }

    .spinner .circ5 {
      -webkit-animation-delay: -0.3s;
      animation-delay: -0.3s;
    }

    @-webkit-keyframes stretchdelay {
      0%, 40%, 100% { -webkit-transform: translateY(-10px) }  
      20% { -webkit-transform: translateY(-20px) }
    }

    @keyframes stretchdelay {
      0%, 40%, 100% { 
        transform: translateY(-10px);
        -webkit-transform: translateY(-10px);
      } 20% {
        transform: translateY(-20px);
        -webkit-transform: translateY(-20px);
      }
    }

    .focus-input{
    	position: absolute;
    	left: -10px;
    	top: -10px;
    	width: 0px;
    	height: 0px;
    }
</style>