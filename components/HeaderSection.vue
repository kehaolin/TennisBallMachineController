<template>
	<view class="header">
		<button
			:style="{ backgroundColor: isAnyDeviceConnected ? 'rgba(95, 186, 232, 1)' : 'rgba(187, 209, 225, 1)',  width: currentLanguage === 'zh' ? '22vw' : (isAnyDeviceConnected ? '28vw' : '32vw') }"
			@click="$emit('openBluetoothPopup')" class="bluetooth">
			<img :src="images.BluetoothIcon" alt="Bluetooth Icon" class="bluetooth-icon" />

			<span class="bluetooth-text"
				:style="{ color: isAnyDeviceConnected ?  'rgba(255, 255, 255, 1)':'rgba(93, 104, 112, 1)' }">
				{{ isAnyDeviceConnected ? translations.connected[currentLanguage] : translations.disconnected[currentLanguage] }}
			</span>
		</button>

		<view class="launcher-position-container">
			<button :class="{ selected: selectedLauncherPosition === 'Baseline' }" :style="{
							fontSize: currentLanguage === 'en' ? '2.20vw' : '3.20vw',
							fontWeight: currentLanguage === 'en' ? '700' : '500'
						}" @click="$emit('selectLauncherPosition', 'Baseline')">
				{{ translations.Baseline[currentLanguage] }} <!-- 使用 translations 获取对应文本 -->
			</button>
			<button :class="{ selected: selectedLauncherPosition === 'Midline' }" :style="{
							fontSize: currentLanguage === 'en' ? '2.20vw' : '3.20vw',
							fontWeight: currentLanguage === 'en' ? '700' : '500'
						}" @click="$emit('selectLauncherPosition', 'Midline')">
				{{ translations.Midline[currentLanguage] }} <!-- 使用 translations 获取对应文本 -->
			</button>
			<button :class="{ selected: selectedLauncherPosition === 'Midcourt' }" :style="{
							fontSize: currentLanguage === 'en' ? '2.20vw' : '3.20vw',
							fontWeight: currentLanguage === 'en' ? '700' : '500'
						}" @click="$emit('selectLauncherPosition', 'Midcourt')">
				{{ translations.Midcourt[currentLanguage] }} <!-- 使用 translations 获取对应文本 -->
			</button>
		</view>

		<view class="battery-container">
			<image class="battery-icon" :src="images.batteryIcon" />
			<view class="battery-content">
				<!-- 黄色背景随电量变化，宽度从右侧减少 -->
				<view class="battery-level">
					<!-- 电量条宽度根据 batteryLevel 动态变化 -->
					<view class="battery-fill" :style="{ width: (batteryLevel * 8.64 / 100) + 'vw' }">
					</view>
				</view>
				<!-- 电量文字保持不动 -->
				<view class="battery-percentage">{{ batteryLevel }}%</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isAnyDeviceConnected: Boolean,
			selectedLauncherPosition: String,
			currentLanguage: String,
			translations: Object,
			images: Object,
			batteryLevel: Number
		}
	};
</script>

<style scoped>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2.3vw;
		/* 自适应的 padding */
	}

	uni-button:after {
		content: none;
		/* 移除伪元素 */
		display: none;
		/* 确保它不占据空间 */
	}

	button {
		padding: 1.07vh 4.76vw;
		/* 使用 vh 和 vw 单位 */
		margin: 0 1.19vw;
		/* 使用 vw 单位调整按钮之间的间距 */
	}

	.bluetooth {
		width: 22vw;
		/* 自适应宽度 */
		height: 4vh;
		/* 调整后的自适应高度 */
		opacity: 1;
		border-radius: 1.5vw;
		/* 使用 vw 单位调整圆角 */
		background-color: rgba(187, 209, 225, 1);
		/* 默认背景颜色 */
		display: flex;
		/* 使用 flex 布局 */
		align-items: center;
		/* 垂直居中对齐子元素 */
		padding: 0 2.3vw;
		/* 使用 vw 单位设置左右边距 */
		box-sizing: border-box;
		/* 确保 padding 不影响按钮的总宽度 */
	}

	.bluetooth-connected {
		background: rgba(95, 186, 232, 1);
	}

	.bluetooth-icon {
		width: 4.3vw;
		/* 自适应宽度 */
		height: 4.3vw;
		/* 自适应高度，与宽度保持一致 */
		margin-right: 2.3vw;
		/* 图标与文字之间的自适应间隔 */
	}


	.bluetooth-text {
		font-size: 3.5vw;
		/* 自适应字体大小 */
		font-weight: 500;
		letter-spacing: 0;
		line-height: 5vw;
		/* 自适应行高 */
		color: rgba(255, 255, 255, 1);
		text-align: left;
		vertical-align: top;
	}


	.battery-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.launcher-position-container {
		width: 28.53vw;
		/* 宽度使用 vw 单位 */
		height: 3.81vh;
		/* 高度使用 vh 单位 */
		border-radius: 1.60vw;
		/* 边角半径使用 vw 单位 */
		background: rgba(196, 219, 237, 1);
		/* 背景颜色 */
		display: flex;
		justify-content: center;
		/* 按钮之间自动拉开距离 */
		align-items: center;
		/* 垂直居中对齐 */
		margin-right: 10px;
		/* 右外边距保持 px 单位 */
		padding: 0 15px;
		/* 添加内边距 */
	}

	.launcher-position-container button {
		border: none;
		/* 确保没有边框 */
		cursor: pointer;
		/* 鼠标悬停时显示为手指 */
		font-size: 2.20vw;
		/* 根据需要调整字体大小 */
		font-weight: 700;
		/* 字体加粗 */
		letter-spacing: 0;
		/* 字符间距 */
		line-height: 4.63vh;
		/* 行高 */
		text-align: center;
		/* 文字居中 */
		vertical-align: top;
		/* 垂直对齐 */
		width: 13.47vw;
		/* 按钮宽度 */
		height: 3.08vh;
		/* 按钮高度 */
		border-radius: 1.07vw;
		/* 按钮圆角 */
		white-space: nowrap;
		/* 防止文字换行 */
		display: flex;
		/* 使用 Flexbox */
		align-items: center;
		/* 垂直居中 */
		justify-content: center;
		/* 水平居中 */
		background: none;
		/* 确保未选中时没有背景色 */
	}

	.launcher-position-container button.selected {
		background: rgba(95, 186, 232, 1);
		/* 选中按钮的背景颜色 */
		color: rgba(255, 255, 255, 1);
		/* 选中文字颜色 */
	}

	.launcher-position-container button:not(.selected) {
		background: none;
		/* 未选中时无背景色 */
		color: rgba(127, 135, 161, 1);
		/* 未选中按钮的文字颜色 */
	}

	.battery-icon {
		width: 10.5vw;
		/* 原宽度 45px，基于430计算 */
		height: 2.2vh;
		/* 原高度 21px，基于932计算 */
	}

	.battery-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.battery-level {
		position: absolute;
		left: 0.47vw;
		/* 距离电池icon左侧2px，基于430计算 */
		top: 0.2vh;
		/* 电量 100% 时最大高度，基于932计算 */
		height: 2.53vh;
		/* 原高度 16.8px，基于932计算 */
		border-radius: 0.47vh;
		/* 圆角，基于932计算 */
		background-color: rgba(232, 218, 67, 1);
		display: flex;
		align-items: center;
	}

	.battery-percentage {
		position: absolute;
		font-size: 2.5vw;
		left: -0.27vw;
		/* 原字体大小 10.8px，基于430计算 */
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		z-index: 2;
		/* 确保文字在最上层 */
		width: 100%;
	}

	.battery-fill {
		height: 1.8vh;
		/* 原高度 16.8px，基于932计算 */
		border-radius: 0.17vh;
		/* 圆角，基于932计算 */
		background-color: rgba(232, 218, 67, 1);
		transition: width 0.5s;
		/* 添加平滑动画效果 */
		position: absolute;
		left: 0;
		top: 0;
	}
</style>