<template>
	<div class="container-fluid" style="padding:0;">
		<checkVouch v-show="page == 1" @changePage="changePage($event)"></checkVouch>
		<checkProfit v-if="page == 2" @changePage="changePage($event)" :checkVouchId="checkVouchId"></checkProfit>
		<checkLoss v-if="page == 3" @changePage="changePage($event)" :checkVouchId="checkVouchId"></checkLoss>
	</div>
</template>

<script>
	var checkVouch = require("./CheckVouch.vue");
	var checkProfit = require("./CheckProfit.vue");
	var checkLoss = require("./CheckLoss.vue");
	module.exports = {
		components: {
			checkVouch,
			checkProfit,
			checkLoss,
		},
		data: function () {
			return {
				page: 1,
				checkVouchId: '',
			}
		},

		methods: {
			changePage: function (p) {
				this.page = p.page;
				if (p.checkVouchId) {
					this.checkVouchId = p.checkVouchId;
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