<template>
	<view class="webview-container">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '', // 用来存储 URL
			};
		},
		onLoad(options) {
			// 获取 URL 参数并解码
			if (options.url) {
				this.url = decodeURIComponent(options.url); // 显示隐私协议链接
			}
		},
	};
</script>

<style>
	.webview-container {
		width: 100%;
		height: 100%;
	}
</style>