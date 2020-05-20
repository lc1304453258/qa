<template>
	<div style="height:100%">
		<div class="finish_room2">
			<div class="room_img">
				<img class="m-small-img"
					 v-lazy="getThumbnailImageSrc()"
					 @click="previewImg()" />
			</div>
		</div>
		<Loading ref="loading"></Loading>
		<Modal ref="modal"
			   :large="true">
			<div class="modal-img-box">
				<img class="m-img"
					 v-lazy="modalImgSrc" />
			</div>
			<div slot="header">图片查看器</div>
		</Modal>
	</div>
</template>

<script>
	var Common = require("../../common/Common.js");
	var Modal = require("./Modal.vue");
	var Loading = require("./Loading.vue");

	module.exports = {
		props: ["imageNames", "className"],

		data: function () {
			return {
				//imgs : []
				modalImgSrc: null,
				imageSrcs: null
			};
		},



		components: {
			Common,
			Loading,
			Modal
		},


		methods: {
			/**
			 * 预览图片
			 */
			previewImg: function () {
				if (this.imageNames != undefined) {
					this.modalImgSrc = Common.getImageSrc(
						this.className,
						this.imageSrcs
					);
				} else {
					this.modalImgSrc = Common.getImageError();
				}
				//this.modalImgSrc = Common.getImageSrc(this.className,this.imageSrcs);
				this.$refs.modal.show = true;
			},

			getThumbnailImageSrc() {
				if (this.imageNames != undefined) {
					this.imageSrcs = this.imageNames;
					return Common.getThumbnailImageSrc(this.className, this.imageSrcs);
				} else {
					return Common.getImageError();
				}
			}
		},

		mounted: function () {
			this.getThumbnailImageSrc();
		}
	};
</script>

<style>
	.finish_room2 {
		width: 100%;
		height: 100%;
		/*padding-top: 5px;
	padding-bottom: 15px;*/
		display: flex;
		align-items: center;
	}

	.finish_room2 .room_img {
		/* width: 100px; */
		width: 100%;
		height: 100%;
		/*	margin-right: 10px;*/
		position: relative;
		overflow: hidden;
	}

	.finish_room2 .room_img img {
		width: 100%;
		height: 100%;
	}

	.modal-img-box {
		width: 100%;
		text-align: center;
		overflow: auto;
		height: 100%;
	}

	.m-img {
		width: 100%;
		height: auto;
	}

	.m-small-img {
		cursor: pointer;
	}
</style>