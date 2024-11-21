<template>
	<modal v-if="showBluetoothPopup" @close="closeBluetoothPopup">
		<view class="overlay" @click="closeBluetoothPopup"></view>
		<view class="popup-content" @click.stop> <!-- 阻止点击事件向上传递 -->
			<!-- 顶部文字 -->
			<view class="popup-header">
				<span class="cancel-button"
					@click="closeBluetoothPopup">{{ translations.cancel[currentLanguage] }}</span>
				<span class="bluetoothConnectivity">{{ translations.bluetoothConnectivity[currentLanguage] }}</span>
			</view>

			<!-- 分割线 -->
			<view class="popup-line"></view>

			<!-- 搜索设备中 -->
			<view v-if="!bluetoothDevices.length" class="searching-container">
				<image :src="images.searchingImage" class="searching-image" />
				<text class="searching-text">{{ translations.searching[currentLanguage] }}</text>
			</view>

			<!-- 设备列表 -->
			<view class="device-list">
				<view v-for="device in bluetoothDevices" :key="device.id" class="device-item" ref="deviceItem">
					<view class="device-info">
						<img :src="images.deviceInfo" alt="Bluetooth Icon" class="device-icon" />
						<text class="device-name">{{ device.name }}</text>
					</view>

					<!-- 判断设备连接状态 -->
					<button v-if="device.isConnected" @click="unbindDevice(device)" class="bluetooth-unbind">
						{{ translations.unbind[currentLanguage] }}
					</button>

					<button v-else :disabled="isAnyDeviceConnected" @click="bindDevice(device)"
						:class="isAnyDeviceConnected ? 'bluetooth-disabled' : 'bluetooth-bind'">
						{{ translations.bind[currentLanguage] }}
					</button>
				</view>
			</view>

			<!-- 完成按钮 -->
			<button @click="completeBluetoothConnection" class="complete-btn">
				{{ translations.complete[currentLanguage] }}
			</button>
		</view>
	</modal>
</template>

<script>
	export default {
		props: {
			showBluetoothPopup: Boolean, // 控制弹窗的显示与否
			bluetoothDevices: Array, // 设备列表
			isAnyDeviceConnected: Boolean, // 是否有设备已连接
			currentLanguage: String, // 当前语言
			translations: Object, // 翻译内容
			images: Object, // 图片资源
		},
		methods: {
			closeBluetoothPopup() {
				this.$emit('closeBluetoothPopup'); // 关闭弹窗
			},
			bindDevice(device) {
				this.$emit('bindDevice', device); // 绑定设备
			},
			unbindDevice(device) {
				this.$emit('unbindDevice', device); // 解绑设备
			},
			completeBluetoothConnection() {
				this.$emit('completeBluetoothConnection'); // 完成蓝牙连接
			},
		},
	};
</script>

<style scoped>
	/* 样式内容保持不变，放在组件内部 */
	.overlay {
		position: fixed;
		/* 让遮罩层覆盖整个视窗 */
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		/* 半透明背景 */
		z-index: 1000;
		/* 确保遮罩层在模态框之下 */
	}

	uni-button:after {
		content: none;
		/* 移除伪元素 */
		display: none;
		/* 确保它不占据空间 */
	}

	button {
		background-color: #1E90FF;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.popup-content {
		width: 100vw;
		/* 430px */
		height: 50.4vh;
		/* 470.13px */
		opacity: 1;
		border-radius: 3.37vw 3.37vw 0px 0px;
		/* 14.48px */
		background: rgba(255, 255, 255, 1);
		position: absolute;
		/* 绝对定位 */
		bottom: 0;
		/* 紧贴底部 */
		left: 50%;
		/* 水平居中 */
		transform: translateX(-50%);
		/* 将其中心点调整到父元素中心 */
		z-index: 1001;
	}

	.popup-header {
		height: 6.43vh;
		/* 60px */
		display: flex;
		align-items: center;
		position: relative;
		/* 提供相对定位以便后续使用 */
	}

	.cancel-button {
		margin-left: 4.65vw;
		/* 20px */
		font-size: 4.00vw;
		/* 17.2px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.58vh;
		/* 24.08px */
		color: rgba(135, 142, 159, 1);
		text-align: left;
	}

	.bluetoothConnectivity {
		font-size: 4.3vw;
		/* 相当于430px宽度的20.64px */
		font-weight: 500;
		letter-spacing: 0;
		line-height: 6.7vw;
		/* 相当于430px宽度的28.9px */
		color: rgba(1, 1, 1, 1);
		text-align: center;
		/* 确保文本在该区域内居中 */
		position: absolute;
		left: 50%;
		/* 左边距为50% */
		transform: translateX(-50%);
		/* 向左移动自身宽度的一半以实现完全居中 */
	}

	.popup-line {
		width: 100%;
		height: 2.29px;
		opacity: 1;
		background: rgba(246, 244, 245, 1);
	}

	.searching-container {
		display: flex;
		/* 使用 flexbox 布局 */
		flex-direction: column;
		/* 纵向排列子元素 */
		justify-content: center;
		/* 垂直居中对齐 */
		align-items: center;
		/* 水平居中对齐 */
	}

	.searching-image {
		width: 76.7vw;
		/* 430px 中的 330px 大约占 76.7% */
		height: 23.1vh;
		/* 932px 中的 215px 大约占 23.1% */
		margin-bottom: 2.1vh;
		/* 20px 在 932px 中大约占 2.1% */
	}

	.searching-text {
		font-size: 3.7vw;
		/* 字体大小根据屏幕宽度比例设置 */
		color: #333;
		/* 文字颜色保持不变 */
	}

	.device-list {
		max-height: 34vh;
		/* 最大高度为视口高度的 25% */
		overflow-y: auto;
		/* 圆角边框 */
		margin-bottom: 2vh;
		/* 留出与完成按钮的间距 */
		padding: 1vh;
		/* 内边距 */
	}

	.device-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #f0f0f0;
	}

	.device-item text {
		flex: 1;
	}

	.device-info {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.device-icon {
		width: 6.36vw;
		/* 根据视口大小调整图标宽度 */
		height: 6.36vw;
		/* 根据视口大小调整图标高度 */
		margin-right: 1.18vw;
		/* 适当调整图标与文字之间的间距 */
	}

	.device-name {
		font-size: 4.18vw;
		/* 根据视口大小调整字体大小 */
		font-weight: 500;
		/* 字体粗细 */
		color: rgba(68, 68, 68, 1);
		/* 字体颜色 */
	}

	.bluetooth-bind {
		width: 81.41px;
		height: 38.41px;
		background: rgba(95, 186, 232, 1);
		/* 蓝牙未连接时 */
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 45.87px;
		font-size: 14.91px;
		/* 字体大小 */
		color: rgba(255, 255, 255, 1);
		/* 字体颜色 */
	}

	.bluetooth-unbind {
		width: 81.41px;
		height: 38.41px;
		background: rgba(246, 244, 246, 1);
		/* 蓝牙已连接时 */
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 45.87px;
		font-size: 14.91px;
		/* 字体大小 */
		color: rgba(153, 153, 153, 1);
		/* 字体颜色 */
	}

	.bluetooth-disabled {
		width: 81.41px;
		height: 38.41px;
		background: rgba(246, 244, 246, 1);
		/* 禁用时的背景色 */
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 45.87px;
		font-size: 14.91px;
		/* 字体大小 */
		color: rgba(189, 189, 189, 1);
		/* 禁用时的字体颜色 */
	}

	.complete-btn {
		width: 91.79vw;
		/* 原始宽度393.31px */
		height: 6.27vh;
		/* 原始高度58.48px */
		opacity: 1;
		border-radius: 2.13vw;
		/* 原始圆角9.17px */
		background: rgba(95, 186, 232, 1);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: absolute;
		/* 绝对定位 */
		bottom: 2.14vh;
		/* 原始底部距离20px */
		left: 50%;
		/* 水平中心对齐 */
		transform: translateX(-50%);
		/* 使元素中心对齐父元素中心 */
	}
</style>