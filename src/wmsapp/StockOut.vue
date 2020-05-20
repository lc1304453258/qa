<template>
	<div class="container-fluid" style="padding: 0px;">
		<materialStockOut v-show="page == 1" @changePage="changePage($event)">
		</materialStockOut>
		<materialStockOutLine v-if="page == 2" :materialStockOut="materialStockOut" @changePage="changePage($event)">
		</materialStockOutLine>
	</div>
</template>


<script>
	var materialStockOut = require("./MaterialStockOut.vue");
	var materialStockOutLine = require("./MaterialStockOutLine.vue");
	var Common = require("../common/Common.js");

	module.exports = {
		components: {
			materialStockOut,
			materialStockOutLine,
			materialStockOutLinePosition,
			Common
		},

		data: function () {
			return {
				page: 1,
				materialStockOut: null,
				materialStockOutLine: null,
			}
		},

		methods: {
			changePage: function(p) {
				if (p.materialStockOut != null && p.materialStockOut != undefined) {
					this.materialStockOut = p.materialStockOut;
				}
				if (p.materialStockOutLine != null && p.materialStockOutLine != undefined) {
					this.materialStockOutLine = p.materialStockOutLine;
				}
				this.page = p.page;
			}
		}
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>