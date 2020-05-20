<template>
	<div>
		<!--
        	作者：GuoZhiBo
        	时间：2020-04-20
        	描述：必须先npn install axios，才能使用，主要测试v-lazy是否能够正常访问图片
        -->
		<h1>测试图片界面,测试v-lazy</h1>
		<img v-lazy="'http://127.0.0.1/Files/2/Images/1.jpg'">
	</div>
</template>

<style>
</style>