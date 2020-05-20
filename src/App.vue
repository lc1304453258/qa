<template>
	<div>
			<router-view></router-view>
	</div>
</template>

<style>
	/*修复模态框的BUG*/
	.modal-header
	{
		display: block!important;
	}
	
	.modal-title
	{
		float: left;
	}
	
	.modal-header .close
	{
		float: right;
	}
	
	/** 自定义卡片的样式 */
	.m-card-item{
		margin-bottom: 10px;
		font-size: 0.8em;
	}
</style>