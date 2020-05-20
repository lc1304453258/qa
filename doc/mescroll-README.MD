mescroll.js 1.4.2 文档 2019-08-01

 GitHub  Star
mescroll QQ群: 633126761 ( 答案: mescroll.js交流群 )
mescroll.js 是在 H5端 运行的下拉刷新和上拉加载插件

您如果是开发 uni-app , 那么请阅读 mescroll 的 uni版本 文档

快速开始 :

1. 下载并引用 mescroll.min.css , mescroll.min.js
```
// unpkg的CDN:
<link rel="stylesheet" href="https://unpkg.com/mescroll.js@1.4.1/mescroll.min.css">
<script src="https://unpkg.com/mescroll.js@1.4.1/mescroll.min.js" charset="utf-8"></script>

// jsdelivr的CDN:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mescroll.js@1.4.1/mescroll.min.css">
<script src="https://cdn.jsdelivr.net/npm/mescroll.js@1.4.1/mescroll.min.js" charset="utf-8"></script>
```

2. 拷贝以下布局结构 :
```
<div id="mescroll" class="mescroll"> //id可以改,而"mescroll"的class不能删
	<div> //这个div不能删,否则上拉加载的布局会错位.(可以改成ul或者其他容器标签)
			//内容...
	</div>
</div>
```

3. 固定mescroll的div高度. 推荐通过定位的方式,简单快捷: (点此查看其他方法)
```		
.mescroll{
	position: fixed;
	top: 44px;
	bottom: 0;
	height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
}
```
		       	
4. 创建mescroll对象 :
```
var mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
	//如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
	//解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
	down: {
		callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
	},
	up: {
		callback: upCallback, //上拉加载的回调
		//以下是一些常用的配置,当然不写也可以的.
		page: {
			num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
			size: 10 //每页数据条数,默认10
		},
		htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
		noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
				避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				这就是为什么无更多数据有时候不显示的原因.
		toTop: {
			//回到顶部按钮
			src: "../img/mescroll-totop.png", //图片路径,默认null,支持网络图
			offset: 1000 //列表滚动1000px才显示回到顶部按钮	
		},
		empty: {
			//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
			warpId:	"xxid", //父布局的id (1.3.5版本支持传入dom元素)
			icon: "../img/mescroll-empty.png", //图标,默认null,支持网络图
			tip: "暂无相关数据~" //提示
		},
		lazyLoad: {
				use: true // 是否开启懒加载,默认false
				attr: 'imgurl' // 标签中网络图的属性名 : <img imgurl='网络图  src='占位图''/>
			}
	}
});
```
		       	
5. 处理回调 :
```
//下拉刷新的回调
function downCallback() {
	$.ajax({
		url: 'xxxxxx',
		success: function(data) {
			//联网成功的回调,隐藏下拉刷新的状态;
			mescroll.endSuccess(); //无参. 注意结束下拉刷新是无参的
			//设置数据
			//setXxxx(data);//自行实现 TODO
		},
		error: function(data) {
			//联网失败的回调,隐藏下拉刷新的状态
			mescroll.endErr();
		}
	});
}

//上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
function upCallback(page) {
	var pageNum = page.num; // 页码, 默认从1开始 如何修改从0开始 ?
	var pageSize = page.size; // 页长, 默认每页10条
	$.ajax({
		url: 'xxxxxx?num=' + pageNum + "&size=" + pageSize,
		success: function(data) {
			var curPageData = data.xxx; // 接口返回的当前页数据列表
			var totalPage = data.xxx; // 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
			var totalSize = data.xxx; // 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
			var hasNext = data.xxx; // 接口返回的是否有下一页 (true/false)
			
			//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
			//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空,显示empty配置的内容;
			//列表如果无下一页数据,则提示无更多数据,(注意noMoreSize的配置)
			
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			//必传参数(当前页的数据个数, 总页数)
			//mescroll.endByPage(curPageData.length, totalPage);
					
			//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
			//必传参数(当前页的数据个数, 总数据量)
			//mescroll.endBySize(curPageData.length, totalSize);
					
			//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
			//必传参数(当前页的数据个数, 是否有下一页true/false)
			//mescroll.endSuccess(curPageData.length, hasNext);
					
			//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
			//如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
			//如果传了hasNext,则翻到第二页即可显示无更多数据.
			//mescroll.endSuccess(curPageData.length);
			
			//curPageData.length必传的原因:
			1. 使配置的noMoreSize 和 empty生效
			2. 判断是否有下一页的首要依据: 
				当传的值小于page.size时(说明不满页了),则一定会认为无更多数据;
				比传入的totalPage, totalSize, hasNext具有更高的判断优先级;
			3. 当传的值等于page.size时,才会取totalPage, totalSize, hasNext判断是否有下一页
			传totalPage, totalSize, hasNext目的是避免方法四描述的小问题
			
			//设置列表数据
			//setListData(curPageData);//自行实现 TODO
		},
		error: function(e) {
			//联网失败的回调,隐藏下拉刷新和上拉加载的状态
			mescroll.endErr();
		}
	});
}
```
		       	
upCallback推荐的三个方法mescroll.endByPage(), mescroll.endBySize(), mescroll.endSuccess()是mescroll 1.2.1新增的, 请检查更新~
至此 mescroll 还更新了许多内容哦,点此查看~ 请保持star,这阵子都会有新功能加入~


------ 以上为mescroll最基本的用法,强烈建议您下载并查看 mescroll基础案例 , 发现mescroll更强大的功能 ~

------ 特别建议您, 手动改改 mescroll-options 的每项配置, 观察修改后的效果, 可让您轻松理解各项参数, 还会有意想不到的发现哦~

------ 如使用中有疑问, 请先查看 常见问题专区 ~

------ 自定义loading动画推荐: https://loading.io 和 https://icons8.com/preloaders/

mescroll图片懒加载的使用 ,一分钟入门:

1. 确保mescroll至少到1.4.1版本

2. 初始化mescroll的时候,在up中配置lazyLoad的use为true :
```
var mescroll = new MeScroll("mescroll", {
	up: {
		lazyLoad: {
				use: true, // 是否开启懒加载,默认false
				attr: 'imgurl', // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
				showClass: 'mescroll-lazy-in', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
				delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
				offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
			}
	}
})
```       	
3. 设置img或div的 imgurl 属性, 值为图片的网络地址
```
	img标签: <img imgurl="网络图" src="占位图"/> // 占位图直接在src设置; 图片加载成功,就会替换src的占位图
	div或其他标签: <div imgurl="网络图" style="background-image: url(占位图)"><div> // 占位图在css中设置; 图片以背景图的形式展示
```	       	
4. 至此mescroll的懒加载功能已经可以正常使用了,mescroll在列表滚动时会自动加载可视区域内的图片.
另外,有时候您可能会动态添加或修改图片,希望手动触发一下懒加载,
那么只需调用 mescroll.lazyLoad() 或 mescroll.endByPage() 或 mescroll.endBySize() 或 mescroll.endSuccess() 即可.

5. mescroll的所有案例都开启了懒加载,您可参考体验. 当然这里还有专门介绍懒加载的案例~

NPM :

```
npm install --save mescroll.js   //不要使用cnpm安装, 因为更新下来有可能是旧的版本
```  	
在 vue-cli 中 mescroll组件的使用:

1. 执行npm命令安装mescroll :   npm install --save mescroll.js

2. 引入mescroll组件 :   import MescrollVue from 'mescroll.js/mescroll.vue'

3. 页面示例代码 :
```
<template>
	<div>
	<!--mescroll滚动区域的基本结构-->
	<mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
		<!--内容...-->
	</mescroll-vue>
	</div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from 'mescroll.js/mescroll.vue'

export default {
	components: {
	MescrollVue // 注册mescroll组件
	},
	data () {
	return {
		mescroll: null, // mescroll实例对象
		mescrollDown:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
		mescrollUp: { // 上拉加载的配置.
		callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
		//以下是一些常用的配置,当然不写也可以的.
	page: {
		num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
		size: 10 //每页数据条数,默认10
	},
	htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
	noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
				避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				这就是为什么无更多数据有时候不显示的原因
	toTop: {
		//回到顶部按钮
		src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
		offset: 1000 //列表滚动1000px才显示回到顶部按钮
	},
	empty: {
		//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
		warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
		icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
		tip: "暂无相关数据~" //提示
	}
		},
		dataList: [] // 列表数据
	}
	},
	beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
	next(vm => {
		// 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
		vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
	})
	},
	beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
	// 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
	this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
	next()
	},
	methods: {
	// mescroll组件初始化的回调,可获取到mescroll对象
	mescrollInit (mescroll) {
		this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
	},
	// 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
	upCallback (page, mescroll) {
		// 联网请求
		axios.get('xxxxxx', {
		params: {
			num: page.num, // 页码
			size: page.size // 每页长度
		}
		}).then((response) => {
		// 请求的列表数据
		let arr = response.data
		// 如果是第一页需手动置空列表
		if (page.num === 1) this.dataList = []
		// 把请求到的数据添加到列表
		this.dataList = this.dataList.concat(arr)
		// 数据渲染成功后,隐藏下拉刷新的状态
		this.$nextTick(() => {
			mescroll.endSuccess(arr.length)
		})
		}).catch((e) => {
		// 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
		mescroll.endErr()
		})
	}
	}
}
</script>

<style scoped>
	/*通过fixed固定mescroll的高度*/
	.mescroll {
	position: fixed;
	top: 44px;
	bottom: 0;
	height: auto;
	}
</style>

```
参数说明 :
```
var mescroll = new MeScroll ( 
	id或dom对象 , 
	{
		down : { 下拉刷新的配置参数 } , 
		up : { 上拉加载的配置参数 } 
	}
);
```
##  down 下拉刷新的配置参数 


| 参数名 | 默认值 | 说明 |
| ----- | -----| -------- |
| use | true | 是否启用下拉刷新.如果配置false,则不会初始化下拉刷新的布局 |
| auto | true | 是否在初始化完毕之后自动执行一次下拉刷新的回调 callback |
| autoShowLoading | false | 如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ) ,那么是否显示下拉刷新的进度，需配置down的callback才生效 |
| isLock | false | 是否锁定下拉刷新，如果配置true,则会锁定不可下拉,可通过调用mescroll.lockDownScroll(false)解锁 |
| isBoth | false | 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载 |
| offset | 80 | 在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调 |
| inOffsetRate (1.4.0新增) | 1 | 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉 |
| outOffsetRate | 0.2 | 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值越接近0,高度变化越小,表现为越往下越难拉 |
| bottomOffset | 20 | 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行，这是1.2.1版本新增的配置,请检查最新版~ |
| minAngle | 45 | 触发下拉最少要偏移的角度(滑动的轨迹与水平线的锐角值),取值区间 [0,90];默认45度,即向下滑动的角度大于45度(方位角为45°~145°及225°~315°)则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;注意:没有必要配置超出[0,90]区间的值,否则角度限制无效; 因为假设配置60, 生效的方位角就已经是60°到120° 和 240°到300°的范围了;
这是1.1.6版本新增的配置,请检查更新最新版~ |
| hardwareClass | "mescroll-hardware" | 硬件加速样式,解决iOS下拉因隐藏进度条而闪屏的问题 |
| warpClass | "mescroll-downwarp" | 下拉刷新的布局容器样式 |
| mustToTop 1.3.7版本新增 | false | 是否滚动条必须在顶部,才可以下拉刷新.默认false.当您发现下拉刷新会闪白屏时,设置true即可修复 |
| warpId | null | 可配置下拉刷新的布局添加到指定id的div |
| resetClass | "mescroll-downwarp-reset" | 下拉刷新高度重置的动画 |
| textInOffset 1.3.7版本新增 | '下拉刷新' | 下拉的距离在offset范围内的提示文本 |
| textOutOffset 1.3.7版本新增 | '释放更新' | 下拉的距离大于offset范围的提示文本 |
| textLoading 1.3.7版本新增 | '加载中 ...' | 加载中的提示文本
| htmlContent | '<p class="downwarp-progress"></p><p class="downwarp-tip"></p>' | 下拉刷新的布局内容 |
| inited | function ( mescroll, downwarp ) { ... } | 下拉刷新初始化完毕的回调 (mescroll实例对象,下拉刷新容器dom对象) |
| inOffset | function ( mescroll ) { ... } | 下拉的距离进入offset范围内那一刻的回调 (mescroll实例对象) |
| outOffset | function ( mescroll ) { ... } | 下拉的距离大于offset那一刻的回调 (mescroll实例对象) |
| onMoving | function ( mescroll, rate, downHight ) { ... } | 下拉过程中的回调,滑动过程一直在执行; rate : 拉区域当前高度与指定距离的比值 ( inOffset: rate<1; outOffset: rate>=1 ) downHight : 当前下拉区域的高度 |
| beforeLoading | function ( mescroll , downwarp ) { return false;} | 准备触发下拉刷新的回调; 如果return true,将不触发showLoading和callback常用来完全自定义下拉刷新, 具体用法参考【淘宝 v6.8.0】 |
| showLoading | function ( mescroll ) { ... } | 显示下拉刷新进度的回调 |
| afterLoading | function(mescroll) { return 0 } | 结束加载中,准备隐藏下拉的回调,返回结束下拉的延时执行时间,默认0ms,常用于结束下拉之前再显示另外一小段动画,才去隐藏下拉刷新的场景,具体用法参考【dotJump】 |
| callback | function ( mescroll ) {  mescroll.resetUpScroll(); | 下拉刷新的回调; 默认重置上拉加载列表为第一页 |



## up 上拉加载的配置参数
| 参数名 | 默认值 | 说明 | 
| ----- | -----| -------- |
| use | true | 是否启用上拉加载,如果配置false,则不会初始化上拉加载的布局| 
| auto | 1.3.1以前版本默认false 1.3.1版本默认true | 是否在初始化完毕之后自动执行一次上拉加载的回调 |
| isLock | false | 是否锁定上拉加载，如果配置true,则会锁定不可上拉,可通过调用mescroll.lockUpScroll(false)解锁 |
| isBoth | false | 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新 |
| isBounce | true | 是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增) 必读事项 |
| offset | 100 | 列表滚动到距离底部小于100px,即可触发上拉加载的回调 |
| noMoreSize | 5 | 如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看,这就是为什么无更多数据 有时候不显示的原因了 |
| toTop	 | { warpId : null , src : null , html: null , offset : 1000 , warpClass : "mescroll-totop" , showClass : "mescroll-fade-in" , hideClass : "mescroll-fade-out" , duration : 300 , supportTap : false
  btnClick : null} | 回到顶部按钮的配置: warpId: 父布局的id; 默认添加在body中 (1.3.5版本支持传入dom元素) src : 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示 html: 标签内容,默认null; 如果同时设置了src,则优先取src (2017/12/10新增) offset : 列表滚动1000px显示回到顶部按钮 warpClass : 按钮样式 showClass : 显示样式hideClass : 隐藏样式 duration : 回到顶部的动画时长, 默认300ms supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) btnClick: 点击按钮的回调; 提示:如果在回调里return true,将不执行回到顶部的操作 |
| loadFull | {  use : false ,  delay : 500} | use : 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或无数据; 默认false,因为可调大page.size使数据满屏. delay : 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕; |
| empty | {  warpId : null ,  icon : null ,  tip : "暂无相关数据~" ,  btntext : "" ,  btnClick : null  supportTap : false} | 列表第一页无任何数据时,显示的空布局 (需配置warpId才生效)  warpId : 父布局的id (1.3.5版本支持传入dom元素) icon : 空布局的图标路径 tip : 提示文本 btntext : 按钮文本 btnClick : 点击按钮的回调 supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) |
| clearId | null | 加载第一页时需清空数据的列表id，如果此项有值,将不使用clearEmptyId的值，在vue中使用,不能配置此项 |
| clearEmptyId | null | 相当于同时设置了clearId和empty.warpId 简化写法;在vue中使用,不能配置此项 |
| hardwareClass | "mescroll-hardware" | 硬件加速样式,使动画更流畅 |
| warpId | null | 可配置上拉加载的布局添加到指定id的div |
| warpClass | "mescroll-upwarp" | 上拉加载的布局容器样式 |
| htmlLoading | '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>' | 上拉加载中的布局 |
| htmlNodata | '<p class="upwarp-nodata">-- END --</p>' | 无数据的布局 |
| inited | function ( mescroll , upwarp ) { } | 初始化完毕的回调,回调(mescroll实例, upwarp上拉加载的布局Dom对象) |
| showLoading | function ( mescroll , upwarp ) { ... } | 显示上拉加载中的回调,回调(mescroll实例, upwarp上拉加载的布局Dom对象) |
| showNoMore | function ( mescroll , upwarp ) { ... } | 显示无更多数据的回调,回调(mescroll实例, upwarp上拉加载的布局Dom对象) |
| onScroll | null | 列表滑动监听, 默认null,例 onScroll : function(mescroll, y, isUp){ ... };y为列表当前滚动条的位置;isUp=true向上滑,isUp=false向下滑)isUp是1.2.1版本新增的配置,请检查最新版~ |
| callback | function ( page, mescroll ) { } | 上拉加载的回调; 回调 ( page对象, mescroll实例 ) |
| page | {  num : 0 ,  size : 10 ,  time : null} | num : 当前页码,默认0,回调之前加1,即callback(page)从1开始; 如何修改从0开始 ?size : 每页数据的数量;time : 加载第一页数据服务器返回的时间 (可空); 防止用户翻页时,后台新增了数据从而导致下一页数据重复; |
| scrollbar | {  use : ... ,  barClass : "mescroll-bar"} | use : 是否开启自定义滚动条;PC端默认true开启自定义滚动条; 移动端默认false不使用, barClass : 自定义滚动条的样式; |
| lazyLoad | {use: false,attr: 'imgurl',showClass: 'mescroll-lazy-in',delay: 500,offset: 200} | use: 是否开启懒加载,默认false, attr: 标签中网络图片地址的属性名,默认"imgurl", showClass: 显示样式:渐变显示,参见mescroll.css, delay: 列表滚动的过程中检查一次图片是否在可视区域的时间间隔,默认500 (单位ms), offset: 超出可视区域多少px的图片仍可触发懒加载 默认200 |

### 常用方法 :

| 方法名 | 说明 |
| --- | --- | 
 | mescroll.endByPage(dataSize, totalPage, systime); | (v 1.2.1 新增)	隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用 | 
 | dataSize :  | 当前页获取的数据总数(注意是当前页) | 
 | totalPage :  | 列表的总页数 | 
 | systime :  | 加载第一页数据的服务器时间 (可空); | 
 | mescroll.endBySize(dataSize, totalSize, systime);(v 1.2.1 新增)	 | 隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用 | 
 | dataSize :  | 当前页获取的数据总数(注意是当前页) | 
 | totalSize :  | 列表的总数据量 | 
 | systime :  | 加载第一页数据的服务器时间 (可空); | 
 | mescroll.endSuccess(dataSize, hasNext, systime);(v 1.2.1 调整) | 隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用 | 
 | dataSize :  | 当前页获取的数据量(注意是当前页) | 
 | hasNext :  | 是否有下一页数据true/false | 
 | systime :  | 加载第一页数据的服务器时间 (可空); | 
 | mescroll.endErr(); | 隐藏下拉刷新和上拉加载的状态, 在联网获取数据失败后调用; mescroll内部会自动恢复原来的页码,时间等变量; | 
 | mescroll.resetUpScroll( isShowLoading ); | 重置列表为第一页 (常用于列表筛选条件变化或切换菜单时重新刷新列表数据) 内部实现: 把page.num=1,再主动触发up.callback,isShowLoading 是否显示进度布局;1.默认null,不传参,则显示上拉加载的进度布局2.传参true, 则显示下拉刷新的进度布局3.传参false,则不显示上拉和下拉的进度 (常用于静默更新列表数据) | 
 | mescroll.triggerDownScroll(); | 主动触发下拉刷新 | 
 | mescroll.triggerUpScroll(); | 主动触发上拉加载 | 
 | mescroll.setPageNum(num);(v 1.2.5 新增) | 设置当前page.num的值.
 | mescroll.setPageSize(size); (v 1.2.5 新增) | 设置当前page.size的值 | 
 | mescroll.scrollTo( y, t ); | 滚动列表到指定位置y=0,则回到列表顶部; 如需滚动到列表底部,可设置y很大的值,比如y=99999,t时长,单位ms,默认300; 如果不需要动画缓冲效果,则传0 (需更新至1.2.3版本) | 
 | mescroll.optDown; | 获取下拉刷新的配置 | 
 | mescroll.optUp; | 获取上拉加载的配置 | 
 | mescroll.lockDownScroll( isLock ); | 锁定下拉刷新 ( isLock=ture,null 锁定 ; isLock=false 解锁 ) | 
 | mescroll.lockUpScroll( isLock ); | 锁定上拉加载 ( isLock=ture,null 锁定 ; isLock=false 解锁 ) | 
 | mescroll.os(v 1.2.5 新增) | mescroll.os.ios 为true, 则是ios设备;mescroll.os.android 为true, 则是android设备;mescroll.os.pc 为true, 则是PC端; | 
 | mescroll.setBounce(boolean)(v 1.3.0 新增) | mescroll.setBounce(true) 允许bounce; | 
 | mescroll.setBounce(false) | 禁止bounce | 
 | mescroll.lazyLoad(delay)(v 1.3.6 新增) | 主动触发懒加载: 自动加载可视区域的图片.delay:延时加载图片的时间,默认500ms.目的是确保dom元素已渲染完成. | 

## 其他方法 :

以下方法不常用,您可灵活运用于更复杂的场景
 | 方法名 | 说明 | 
 | ----- | ----- | 
 | mescroll.showDownScroll(); | 显示下拉刷新的进度布局，mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() | 内部有调用 | 
 | mescroll.endDownScroll(); | 隐藏下拉刷新的进度布局，mescroll.endSuccess() 和 mescroll.endErr() | 内部有调用 | 
 | mescroll.endUpScroll(isShowNoMore) | 结束上拉加载的状态isShowNoMore=true, 显示无更多数据;isShowNoMore=false, 隐藏上拉加载;isShowNoMore=null, 保持当前状态 | 
 | mescroll.showUpScroll(); | 显示上拉加载的进度布局，mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() | 内部有调用 | 
 | mescroll.showNoMore(); | 显示上拉无更多数据的布局，mescroll.endUpScroll() 内部有调用 | 
 | mescroll.hideUpScroll(displayAble); | 隐藏上拉加载的布局，mescroll.endUpScroll() 内部有调用，1.3.5新增参数 displayAble: 是否通过display:none隐藏，默认false通过visibility:hidden的方式隐藏 | 
 | mescroll.clearDataList(); | 清空上拉加载的数据列表 mescroll.resetUpScroll() 和 mescroll.endSuccess() 内部有调用 | 
 | mescroll.showEmpty(); | 显示无任何数据的空布局，mescroll.endSuccess() 内部有调用 | 
 | mescroll.removeEmpty(); | 移除无任何数据的空布局，mescroll.endSuccess() 内部有调用  | 
 | mescroll.showTopBtn(time); | 显示回到顶部的按钮，time: 显示的动画时长,默认0.5秒 (1.3.5版本新增参数) | 
 | mescroll.hideTopBtn(time); | 隐藏回到顶部的按钮，time: 隐藏的动画时长,默认0.5秒 (1.3.5版本新增参数) | 
 | mescroll.setTopBtnFadeDuration(time); | (1.3.5版本新增)	设置回到顶部按钮的显示和隐藏的动画时长，time: 显示隐藏动画时长,默认0.5秒 | 
 | mescroll.getScrollTop(); | 获取滚动条的位置y; 也可以在up配置onScroll监听滚动条的位置 | 
 | mescroll.getBodyHeight(); | 获取body的高度 | 
 | mescroll.getClientHeight(); | 获取滚动容器的高度 | 
 | mescroll.getScrollHeight(); | 获取滚动内容的高度 | 
 | mescroll.getToBottom();(v 1.3.0新增) | 获取当前滚动条到底部的距离 | 
 | mescroll.getStep(star, end, callback, t, rate);(v 1.2.8 新增) | star : 开始值;end : 结束值;callback(step,timer) : 回调 function(step,timer),t : 计步时长; 传0则直接回调end值; 不传则默认300ms ;rate : 周期; 不传则默认30ms计步一次 ;此方法相当于默认在300ms内,每30ms返回star到end之间的阶梯值step; 可用于模拟帧动画比如mescroll的回到顶部缓冲动画,轮播导航案例的顶部菜单滚动都是通过getStep实现(注: 您可根据实际情况在 callback 通过 window.clearInterval(timer) 提前结束计步器) | 
 | mescroll.version;(v 1.3.0新增) | mescroll的版本号， | 
 | mescroll.destroy(); | 销毁mescroll | 
