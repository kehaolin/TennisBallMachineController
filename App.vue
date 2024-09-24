<template>
	<view>
		<router-view />
	</view>
</template>

<script>
	export default {
		mounted() {
			// 在应用启动时，默认跳转到蓝牙页面
			uni.navigateTo({
				url: '/pages/bluetooth/bluetooth'
			});
		}
	}
</script>

<style>
	/* 在这里添加样式 */
</style>