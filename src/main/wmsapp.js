'use strict';

require("babel-polyfill");


var Vue = require('vue').default;
var VueRouter = require('vue-router').default;

var App = require('../App.vue');
var DicRoutes = require('../router/wmsapp_routes.js');

window.appCommon = require('../common/AppCommon.js');

Vue.use(VueRouter);

import "vue-select/dist/vue-select.css";
// import "mescroll.js/mescroll.min.css";
import VueLazyload from '../../static-wms-app/js/vue-lazyload/vue-lazyload.js';
import axios from 'axios';


// 加载错误以后显示的图片
let errorImage = 'data:image/png;base64,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';
// 加载过程中显示的图片
let loadingImage = 'data:image/gif;base64,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';


// 图片懒加载
Vue.use(VueLazyload,{
	preLoad: 1.3,
	error: errorImage,
	loading: loadingImage,
	attempt: 0
});

const router = new VueRouter({
	routes: DicRoutes.routes
});

const app = new Vue({
	el: '#app',
	render: h => h(App),
  	router
})


/**
 * 路由钩子
 * @param  {[type]} (to, from,         next [description]
 * @return {[type]}      [description]
 */
router.beforeEach((to, from, next) => {
	// to : 即将要进入的目标 路由对象
	// from: 当前导航正要离开的路由
	// next: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数
	console.log(to);
	if(to != undefined 
		&& to.path != undefined
		&& ((to.path.indexOf("desktop") == 0)
			|| (to.path.indexOf("desktop") == 1))
		){
		// 判断是否已登录		
		var token = $.cookie('token');
		if(token == undefined || token.length == 0){
			// 如果没有登录则直接返回
			next({ path: '/' })
		}else{
			next();
			return;
		}
	}else{
		next();
		return;
	}
})