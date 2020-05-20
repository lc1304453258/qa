<template>
	<div class="container-fluid" style="padding:0px;">
		<purchaseOrderPrint1 v-show="page == 1" @changePage="changePage($event)">
		</purchaseOrderPrint1>

		<purchaseOrderPrint2 v-if="page == 2" :purchaseOrderLine="purchaseOrderLine" @changePage="changePage($event)">
		</purchaseOrderPrint2>
	</div>
</template>

<script>
	var purchaseOrderPrint1 = require("./PurchaseOrderPrint1.vue");
	var purchaseOrderPrint2 = require("./PurchaseOrderPrint2.vue");
	// var purchaseOrderPrint3 = require("./PurchaseOrderPrint3.vue");
	module.exports = {
		components: {
			purchaseOrderPrint1,
			purchaseOrderPrint2,
			// purchaseOrderPrint3,
		},
		data: function () {
			return {
				page: 1,
				purchaseOrderLine: null,
			}
		},
		methods: {
			changePage: function (p) {
				this.page = p.page;
				if (p.purchaseOrderLine) {
					this.purchaseOrderLine = p.purchaseOrderLine;
				}
			},
		}
	}
</script>

<style scoped>
	.container-fluid {
		overflow-x: hidden;
	}
</style>