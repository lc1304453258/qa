<template>
	<div class="container-fluid" style="padding:0px;">
		<pickPage1 v-show="page == 1" @changePage="changePage($event)" ref="page1"></pickPage1>
		<pickPage2 v-if="page == 2" @changePage="changePage($event)"></pickPage2>
	</div>
</template>

<script>
	var Common = require("../common/Common.js");
	var pickPage1 = require("./PickPage1.vue");
	var pickPage2 = require("./PickPage2.vue");
	module.exports = {
		components: {
			pickPage1,
			pickPage2,
			Common
		},

		data: function () {
			return {
				page: 1
			}
		},

		methods: {
			changePage: function (p) {
				this.page = p.page;
				if(this.page == 1){
					// this.$refs.page1.query();
					this.$refs.page1.refreshAllCurrentStock();
					this.$refs.page1.queryStockOutPrepare();
				}
			}
		}
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>
