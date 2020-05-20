<template>
	<nav class="navbar navbar-fixed-top navbar-light bg-light header">
	  	<a class="navbar-brand" href="javascript:void(0);">
	  		<span class="fa fa-arrow-circle-o-left back-icon" @click="back"></span>
	  		{{title}}
	  	</a>

		<slot></slot>
	</nav>
</template>

<script>
module.exports={
	props: [
		"title", //标题
	],

	data : function () {
		return{

		}
	},


	methods : {
		/**
		 * 返回上一页
		 */
		back: function () {
			history.back();
		},
	},
}
</script>
<style scoped>
	.header {
		margin-left:-15px;
		margin-right:-15px;
		padding-left: 15px;
	}

	.back-icon{
		font-size: 1.25em;
    line-height: 1.25em;
	}
</style>
