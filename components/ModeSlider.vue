<template>
	<view class="slider-container">
		<view class="slider-container-bbox">
			<!-- 频率 -->
			<view class="slider frequency-slider">
				<view class="param-container"
					style="display: flex; align-items: center;justify-content: space-between;">
					<view class="param-label">
						<text class="param-text1">{{ translations.frequency[currentLanguage] }}:</text>
						<text class="param-value">{{ frequency }}</text>
					</view>
					<view v-if="selectedMode === 8" class="frequency-slider switch-container"
						style="margin-left: 10px;">
						<text class="random-label">{{ translations.random[currentLanguage] }}</text>
						<switch :checked="isFrequencyRandom" @change="toggleFrequencyRandom"
							color="rgba(95, 186, 232, 1)" style="transform:scale(0.9)" />
					</view>
				</view>
				<slider class="custom-slider" :value="frequency" min="1" max="10" block-size="16"
					activeColor="rgba(95, 186, 232, 1)" backgroundColor="background: rgba(240, 242, 251, 1);"
					:disabled="(isFrequencyRandom && selectedMode === 8) || selectedMode === 0 "
					@changing="handleFrequencyChanging" @change="handleFrequencyChange"
					:style="{ opacity: (isFrequencyRandom && selectedMode === 8) || selectedMode === 0 ? 0.5 : 1 }" />
				<view class="range-label">
					<text>1</text>
					<text>10</text>
				</view>
			</view>

			<!-- 速度 -->
			<view v-if="selectedMode != 8" class="slider speed-slider">
				<view class="param-label">
					<text class="param-text1">{{ translations.speed[currentLanguage] }}:</text>
					<text class="param-value">{{ speed }}</text>
				</view>
				<slider class="custom-slider" :value="speed" min="20" max="120" block-size="16"
					activeColor="rgba(95, 186, 232, 1)" backgroundColor="background: rgba(240, 242, 251, 1);"
					:disabled="(isSpeedRandom && selectedMode === 8) || selectedMode === 0"
					@changing="handleSpeedChanging" @change="handleSpeedChange"
					:style="{ opacity: (isSpeedRandom && selectedMode === 8) || selectedMode === 0 ? 0.5 : 1 }" />
				<view class="range-label">
					<text>20</text>
					<text>120</text>
				</view>
				<view v-if="selectedMode === 8" class="switch-container" style="margin-left: -10px;">
					<text class="random-label">{{ translations.random[currentLanguage] }}</text>
					<switch :checked="isSpeedRandom" @change="toggleSpeedRandom" color=" rgba(95, 186, 232, 1)"
						style="transform:scale(0.9)" />
				</view>
			</view>

			<!-- 旋转角度 -->
			<view class="slider rotate-slider">
				<view class="param-container"
					style="display: flex; align-items:center; justify-content: space-between;">
					<view class="param-label">
						<text class="param-text1">{{ translations.rotate[currentLanguage] }}:</text>
						<text class="param-value">{{ rotate }}</text>
					</view>
					<view v-if="selectedMode === 8" class="rotate-slider switch-container" style="margin-left: 10px;">
						<text class="random-label">{{ translations.random[currentLanguage] }}</text>
						<switch :checked="isRotateRandom" @change="toggleRotateRandom" color="rgba(95, 186, 232, 1)"
							style="transform:scale(0.9)" />
					</view>
				</view>
				<slider class="custom-slider" :value="rotate" min="-5" max="5" block-size="16"
					activeColor="rgba(95, 186, 232, 1)" backgroundColor="background: rgba(240, 242, 251, 1);"
					:disabled="(isRotateRandom && selectedMode === 8) || selectedMode === 0 "
					@changing="handleRotateChanging" @change="handleRotateChange"
					:style="{ opacity: (isRotateRandom && selectedMode === 8) || selectedMode === 0  ? 0.5 : 1 }" />
				<view class="range-label">
					<text>-5</text>
					<text>5</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			selectedMode: Number,
			translations: Object,
			currentLanguage: String,
			frequency: Number,
			speed: Number,
			rotate: Number,
			isFrequencyRandom: Boolean,
			isSpeedRandom: Boolean,
			isRotateRandom: Boolean,
		},
		methods: {
			handleFrequencyChanging(event) {
				this.$emit('update:frequency', event.detail.value);
			},
			handleFrequencyChange(event) {
				this.$emit('change:frequency', event.detail.value);
			},
			toggleFrequencyRandom() {
				this.$emit('toggleFrequencyRandom');
			},

			handleSpeedChanging(event) {
				this.$emit('update:speed', event.detail.value);
			},
			handleSpeedChange(event) {
				this.$emit('change:speed', event.detail.value);
			},
			toggleSpeedRandom() {
				this.$emit('toggleSpeedRandom');
			},

			handleRotateChanging(event) {
				this.$emit('update:rotate', event.detail.value);
			},
			handleRotateChange(event) {
				this.$emit('change:rotate', event.detail.value);
			},
			toggleRotateRandom() {
				this.$emit('toggleRotateRandom');
			}
		}
	};
</script>

<style scoped>
	.slider-container {
		margin-left: 2.3vw;
		/* 自适应左边距 */
		margin-top: 1.2vh;
		/* 自适应上边距 */
		width: 94.7vw;
		/* 自适应宽度 */
		height: 27.9vh;
		/* 自适应高度 */
		opacity: 1;
		border-radius: 2.7vw;
		/* 自适应圆角 */
		background: rgba(206, 230, 249, 1);
		box-shadow: 0px 0.26vh 3vh rgba(0, 0, 0, 0.25);
		/* 自适应阴影 */
		position: relative;
		/* 子元素绝对定位 */
	}


	.slider-container-bbox {
		position: absolute;
		/* 绝对定位 */
		top: 50%;
		/* 垂直居中 */
		left: 50%;
		/* 水平居中 */
		transform: translate(-50%, -50%);
		/* 根据自身大小调整居中 */
		width: 86.7vw;
		/* 自适应宽度 */
		height: 24.2vh;
		/* 自适应高度 */
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}


	.slider {
		width: 86.7vw;
		/* 自适应宽度 */
		height: 7.1vh;
		/* 自适应高度 */
		opacity: 1;
	}


	/* 整个滑块样式 */
	.custom-slider>>>.uni-slider-handle-wrapper {
		position: relative;
		margin-left: -5vw;
		/* 自适应左边距 */
		width: 86vw;
		/* 自适应宽度 (约为372.67px 在430px宽度下) */
		height: 0.5vh;
		/* 自适应高度 (约为4.59px) */
		border-radius: 1vw;
		/* 自适应圆角 (约为3.44px) */
		background-color: rgba(240, 242, 251, 1);
		transition: background-color 0.3s ease;
		-webkit-tap-highlight-color: transparent;
	}


	.custom-slider>>>.uni-slider-thumb {
		width: 3.1vw !important;
		/* 宽度约为13.2px，在430px宽度下的对应值 */
		height: 3.1vw !important;
		/* 高度保持与宽度一致 */
		margin-top: -4vh !important;
		/* 顶部边距 */
		opacity: 1;
		background: rgba(255, 255, 255, 1);
		border: 0.67vw solid rgba(95, 186, 232, 1) !important;
		/* 边框宽度约为2.87px */
		box-shadow: 0px 0px 4.59px rgba(59, 83, 205, 0.2) !important;
	}

	/* 可选：在媒体查询中进行适配 */
	@media (max-width: 430px) {
		.custom-slider>>>.uni-slider-thumb {
			width: 13.2px !important;
			/* 在小屏幕上使用原始值 */
			height: 13.2px !important;
			margin-top: -8px !important;
			border: 2.87px solid rgba(95, 186, 232, 1) !important;
			/* 边框宽度保持原值 */
		}
	}

	/* 上方的文字：与滑动条的间隔设置为20px */
	.param-label {
		margin-bottom: -0.5rem;
		/* 使用 rem 进行微调 */
		font-size: 1rem;
		/* 基于根元素大小的自适应字体 */
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.5rem;
		/* 基于根元素大小的自适应行高 */
		color: rgba(34, 34, 34, 1);
	}

	@media (max-width: 600px) {
		.param-label {
			font-size: 0.9rem;
			/* 小屏幕上的字体微调 */
			line-height: 1.2rem;
			/* 调整行高 */
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.param-label {
			font-size: 1rem;
			/* 中等屏幕上的自适应字体 */
			line-height: 1.5rem;
			/* 调整行高 */
		}
	}


	/* 下方的文字：与滑动条的间隔设置为10px */
	.range-label {
		margin-top: -1vh;
		/* 调整与滑动条的间隔 */
		font-size: 3vw;
		/* 自适应字体大小 */
		font-weight: 500;
		letter-spacing: 0;
		line-height: 4vh;
		/* 自适应行高 */
		color: rgba(95, 186, 232, 1);
		text-align: left;
		vertical-align: top;
	}

	/* 媒体查询进行细调 */
	@media (max-width: 600px) {
		.range-label {
			margin-top: -2vh;
			/* 在小屏幕上微调间距 */
			font-size: 4vw;
			/* 更小的屏幕上使用自适应字体大小 */
			line-height: 3vh;
			/* 自适应行高 */
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.range-label {
			font-size: 3.5vw;
			/* 中等屏幕上的自适应字体大小 */
			line-height: 4vh;
			/* 行高 */
		}
	}

	.param-text1 {
		font-size: 3.5vw;
		/* 根据之前的 17.2px 适度增大 */
		font-weight: 600;
		letter-spacing: 0;
		line-height: 4.5vw;
		/* 根据原来的 24.08px 调整行高 */
		color: rgba(34, 34, 34, 1);
	}

	/* 媒体查询进行细调 */
	@media (max-width: 600px) {
		.param-text1 {
			font-size: 4vw;
			/* 在小屏幕上使用稍大的字体 */
			line-height: 5vw;
			/* 增加行高以改善可读性 */
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.param-text1 {
			font-size: 3.8vw;
			/* 中等屏幕的字体大小 */
			line-height: 4.8vw;
			/* 行高 */
		}
	}

	.param-value {
		font-size: 3.5vw;
		/* 根据 17.2px 调整，保持可读性 */
		font-weight: 600;
		letter-spacing: 0;
		line-height: 4.5vw;
		/* 根据原来的 24.08px 调整行高 */
		color: rgba(95, 186, 232, 1);
		/* 文本颜色 */
		margin-left: 1.5vw;
		/* 根据 10px 增加一点左边距 */
	}

	/* 媒体查询进行细调 */
	@media (max-width: 600px) {
		.param-value {
			font-size: 4vw;
			/* 小屏幕上使用稍大的字体 */
			line-height: 5vw;
			/* 增加行高以改善可读性 */
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.param-value {
			font-size: 3.8vw;
			/* 中等屏幕的字体大小 */
			line-height: 4.8vw;
			/* 行高 */
		}
	}


	.range-label {
		display: flex;
		justify-content: space-between;
	}
</style>