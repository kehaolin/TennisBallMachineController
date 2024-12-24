<template>
	<view class="modeConfig1">
		<!-- 模式选择功能 -->
		<view class="mode-selection" @click="showModePicker">
			<view class="mode-label">
				{{ translations.currentMode[currentLanguage] }}
			</view>
			<view class="mode-value">
				{{ modeNames[selectedMode] }}
			</view>
		</view>

		<view class="divider-line"></view>

		<!-- 设置发球高度和选择球 -->
		<view class="setHeightAndBall" :style="{
      'justify-content': (selectedMode === 2 || selectedMode === 4) ? 'space-between' : (selectedMode === 0 || selectedMode === 3 ? 'flex-end' : 'space-evenly')
    }">
			<view v-if="selectedMode === 0" class="difficulty-selector">
				<span>{{ translations.selectedDifficulty[currentLanguage] }}</span>
				<view class="difficulty-options-container">
					<div class="difficulty-options">
						<div class="dot" :class="{ selected: selectedDifficulty === '1.0' }"
							@click="selectDifficulty('1.0')">
							<span class="difficulty-text"
								:class="{ selectedText: selectedDifficulty === '1.0' }">1.0</span>
						</div>
						<div class="dot" :class="{ selected: selectedDifficulty === '2.0' }"
							@click="selectDifficulty('2.0')">
							<span class="difficulty-text"
								:class="{ selectedText: selectedDifficulty === '2.0' }">2.0</span>
						</div>
					</div>
				</view>
			</view>

			<!-- 展示高度选择功能 -->
			<view v-if="showHeightSelector" class="height-selector">
				<span>{{ translations.selectedHeight[currentLanguage] }}</span>
				<view class="height-options-container">
					<div class="height-options">
						<div class="dot"
							:class="{ selected: selectedHeight === '低' && !(isHeightRandom && selectedMode === 8) }"
							@click="selectHeight('低')">
							<span class="height-text"
								:class="{ selectedText: selectedHeight === '低' && !(isHeightRandom && selectedMode === 8) }">{{translations.low[currentLanguage]}}</span>
						</div>
						<div class="dot"
							:class="{ selected: selectedHeight === '中' && !(isHeightRandom && selectedMode === 8) }"
							@click="selectHeight('中')">
							<span class="height-text"
								:class="{ selectedText: selectedHeight === '中' && !(isHeightRandom && selectedMode === 8) }">{{translations.medium[currentLanguage]}}</span>
						</div>
						<div class="dot"
							:class="{ selected: selectedHeight === '高' && !(isHeightRandom && selectedMode === 8) }"
							@click="selectHeight('高')">
							<span class="height-text"
								:class="{ selectedText: selectedHeight === '高' && !(isHeightRandom && selectedMode === 8) }">{{translations.height[currentLanguage]}}</span>
						</div>
					</div>
				</view>
			</view>

			<!-- 选择球功能 -->
			<view v-if="selectedMode === 2 || selectedMode === 3 || selectedMode === 4" class="ball-selection">
				<view class="ball-options-container">
					<button :class="{ selected: selectedBall === 1 }" @click="selectBall(1)"
						:style="selectedBall === 1 ? selectedBallStyle : unselectedBallStyle">
						{{ translations.ball1[currentLanguage] }}
					</button>
					<button :class="{ selected: selectedBall === 2 }" @click="selectBall(2)"
						:style="selectedBall === 2 ? selectedBallStyle : unselectedBallStyle">
						{{ translations.ball2[currentLanguage] }}
					</button>
				</view>
			</view>

			<!-- 随机开关 -->
			<view v-if="selectedMode == 8" class="switch-container">
				<text class="random-label">{{ translations.random[currentLanguage] }}</text>
				<switch :checked="isHeightRandom" @change="toggleHeightRandom" color=" rgba(95, 186, 232, 1)"
					style="transform:scale(0.9)" />
			</view>
		</view>

		<!-- 第三层: 开始训练按钮和方向控制按钮 -->
		<view class="controls">
			<!-- 编程模式时使用的文本框，用于记录选择的球 -->
			<view v-if="showInputWithClear" class="input-container">
				<text class="input-label">{{ translations.selectServingOrder[currentLanguage] }}</text>
				<view class="input-area">
					<view class="number-container">
						<div v-if="!inputData" class="placeholder-text"></div>
						<div v-else v-for="item in inputData.split(',')" :key="item" class="number-box">
							<text class="number-text">{{ item }}</text>
						</div>
					</view>
					<button hover-class="none" class="clear-button" @click="clearInputData">
						<img :src="images.clearButton" class="clear-icon" />
					</button>
				</view>
			</view>

			<!-- 下层按钮（角度调整、方向按钮、启动按钮） -->
			<view class="lower-controls">
				<view v-if="showHeightControl" class="height-control">
					<img @click="adjustHeight(-1)" class="setHeight-top" :src="images.minus" alt="Minus" />
					<view class="height-text-container">
						<span class="height-label">{{ translations.heights[currentLanguage] }}:</span>
						<span class="height-value">{{ serveHeight }}</span>
					</view>
					<span v-if="realHeight"
						class="height-value">{{ realHeight + translations.meter[currentLanguage] }}</span>
					<img @click="adjustHeight(1)" class="setHeight-bottom" :src="images.add" alt="Add" />
				</view>

				<!-- 方向键 -->
				<view v-if="showDirectionButtons" class="new-direction-buttons">
					<view class="new-outer-border">
						<img :src="upDownButtonsDisabled ? images.up : images.up_dis" alt="上" class="new-up-button"
							@click="handleDirectionKey('up')" :disabled="upDownButtonsDisabled" />
						<view class="new-middle-row">
							<img :src="leftRightButtonsDisabled ? images.left : images.left_dis" alt="左"
								class="new-left-button" @click="handleDirectionKey('left')"
								:disabled="leftRightButtonsDisabled" />
							<view class="new-circle"><span>DIR</span></view>
							<img :src="leftRightButtonsDisabled ? images.right : images.right_dis" alt="右"
								class="new-right-button" @click="handleDirectionKey('right')"
								:disabled="leftRightButtonsDisabled" />
						</view>
						<img :src="upDownButtonsDisabled ? images.down : images.down_dis" alt="下"
							class="new-down-button" @click="handleDirectionKey('down')"
							:disabled="upDownButtonsDisabled" />
					</view>
				</view>

				<!-- 开始训练按钮 -->
				<button ref="startButton" class="btn-start" :style="{
          backgroundColor: buttonColor,
          ...((selectedMode === 0  || selectedMode === 8) ? startButtonStyle[1] : startButtonStyle[0]),
          marginTop: selectedMode === 9 ? '-0.6vh' : '0' // -6px 转换为自适应的 vh
        }" @click="startTraining">
					<span class="btn-text">
						{{ trainingActive ? translations.endTraining[currentLanguage] : translations.startTraining[currentLanguage] }}
					</span>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			realHeight: Number,
			selectedMode: Number,
			selectedDifficulty: String,
			selectedHeight: String,
			selectedBall: Number,
			inputData: String,
			serveHeight: Number,
			isHeightRandom: Boolean,
			showHeightSelector: Boolean,
			showInputWithClear: Boolean,
			showHeightControl: Boolean,
			showDirectionButtons: Boolean,
			upDownButtonsDisabled: Boolean,
			leftRightButtonsDisabled: Boolean,
			translations: Object,
			currentLanguage: String,
			modeNames: Array,
			selectedBalls: Array,
			images: Object,
			trainingActive: Boolean,
			buttonColor: String,
			startButtonStyle: Array
		},
		methods: {
			showModePicker() {
				this.$emit('showModePicker');
			},
			selectDifficulty(difficulty) {
				this.$emit('selectDifficulty', difficulty);
			},
			selectHeight(height) {
				this.$emit('selectHeight', height);
			},
			selectBall(ball) {
				this.$emit('selectBall', ball);
			},
			toggleHeightRandom() {
				this.$emit('toggleHeightRandom');
			},
			clearInputData() {
				this.$emit('clearInputData');
			},
			adjustHeight(value) {
				this.$emit('adjustHeight', value);
			},
			handleDirectionKey(direction) {
				this.$emit('handleDirectionKey', direction);
			},
			startTraining() {
				this.$emit('startTraining');
			}
		}
	};
</script>

<style scoped>
	.modeConfig1 {
		margin-left: 2.33vw;
		/* 从 10px 改为 2.33vw */
		margin-top: -0.86vh;
		/* 从 -8px 改为 -0.86vh */
		width: 94.63vw;
		/* 从 407.07px 改为 94.63vw */
		opacity: 1;
		border-radius: 2.67vw;
		/* 从 11.47px 改为 2.67vw */
		background: rgba(206, 230, 249, 1);
		box-shadow: 0px 1.15px 13.76px rgba(0, 0, 0, 0.15);
	}


	.mode-selection {
		display: flex;
		justify-content: space-between;
		/* 左右分布 */
		align-items: center;
		/* 垂直居中 */
		padding: 2.33vw;
		/* 从 10px 改为 2.33vw */
		border: 0.23vw solid #ccc;
		/* 从 1px 改为 0.23vw */
		border-radius: 0.93vw;
		/* 从 4px 改为 0.93vw */
		cursor: pointer;
		/* 鼠标悬停时显示手形光标 */
	}

	.mode-label {
		font-size: 5.07vw;
		/* 从 21.79px 改为 5.07vw */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 3.27vh;
		/* 从 30.5px 改为 3.27vh */
		color: rgba(34, 34, 34, 1);
		text-align: left;
		vertical-align: top;
	}

	.mode-value {
		font-size: 5.07vw;
		/* 从 21.79px 改为 5.07vw */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 3.27vh;
		/* 从 30.5px 改为 3.27vh */
		color: rgba(95, 186, 232, 1);
		text-align: right;
		vertical-align: top;
	}

	.divider-line {
		width: 94.7vw;
		/* 从 407.07px 改为 94.7vw */
		height: 0.061vh;
		/* 从 0.57px 改为 0.061vh */
		opacity: 1;
		background: rgba(0, 0, 0, 0.1);
	}

	.setHeightAndBall {
		display: flex;
		flex-direction: row;
		margin-top: 0.537vh;
		/* 从 5px 改为 0.537vh */
	}

	.difficulty-selector {
		display: flex;
		align-items: center;
		white-space: nowrap;
		margin-left: 2.33vw;
		margin-right: 10px;
		/* 从 10px 改为 2.33vw */
	}

	.difficulty-options-container {
		width: 22.92vw;
		/* 从 145.83px 改为 33.92vw */
		height: 3.81vh;
		/* 从 35.55px 改为 3.81vh */
		border-radius: 6.88px;
		background: rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 3.02vw;
		/* 从 13px 改为 3.02vw */
	}

	.difficulty-options {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.dot {
		width: 11.74vw;
		/* 50.45px / 430px * 100 */
		height: 3.08vh;
		/* 28.67px / 932px * 100 */
		margin: 0 0.7vw;
		/* 3px / 430px * 100 */
		border-radius: 1.07vw;
		/* 4.59px / 430px * 100 */
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 1;
	}

	.dot.selected {
		background: rgba(95, 186, 232, 1);
		/* 选中的背景色 */
	}

	.difficulty-text {
		font-size: 3.20vw;
		/* 13.76px / 430px * 100 */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 4.63vh;
		/* 19.26px / 932px * 100 */
		color: rgba(127, 135, 161, 1);
		text-align: center;
		vertical-align: top;
	}

	.selectedText {
		color: rgba(255, 255, 255, 1);
		/* 选中的文本颜色 */
	}

	.height-selector {
		display: flex;
		align-items: center;
		white-space: nowrap;
		/* 防止文字与单选框换行 */
		margin-left: 2.33vw;
		/* 从 10px 改为 2.33vw */
	}


	.height-options-container {
		width: 33.92vw;
		/* 从 145.83px 改为 33.92vw */
		height: 3.81vh;
		/* 从 35.55px 改为 3.81vh */
		border-radius: 6.88px;
		background: rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 3.02vw;
		/* 从 13px 改为 3.02vw */
	}


	.height-options {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.dot {
		width: 11.74vw;
		/* 50.45px / 430px * 100 */
		height: 3.08vh;
		/* 28.67px / 932px * 100 */
		margin: 0 0.7vw;
		/* 3px / 430px * 100 */
		border-radius: 1.07vw;
		/* 4.59px / 430px * 100 */
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 1;
	}


	.dot.selected {
		background: rgba(95, 186, 232, 1);
		/* 选中的背景色 */
	}

	.height-text {
		font-size: 3.20vw;
		/* 13.76px / 430px * 100 */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 4.63vh;
		/* 19.26px / 932px * 100 */
		color: rgba(127, 135, 161, 1);
		text-align: center;
		vertical-align: top;
	}

	.selected {
		background-color: green;
	}

	.selectedText {
		color: rgba(255, 255, 255, 1);
		/* 选中的文本颜色 */
	}


	.ball-options-container {
		width: 28.53vw;
		/* 宽度使用 vw 单位 */
		height: 3.81vh;
		/* 高度使用 vh 单位 */
		opacity: 1;
		border-radius: 1.60vw;
		/* 边角半径使用 vw 单位 */
		background: rgba(196, 219, 237, 1);
		display: flex;
		justify-content: space-between;
		/* 两个按钮之间自动拉开距离 */
		align-items: center;
		/* 垂直居中对齐 */
		margin-right: 10px;
		/* 右外边距保持 px 单位 */
	}

	.ball-options-container button {
		border: none;
		/* 确保没有边框 */
		cursor: pointer;
		font-size: 3.20vw;
		/* 13.76px / 430px * 100 */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 4.63vh;
		/* 19.26px / 932px * 100 */
		text-align: center;
		vertical-align: top;
		width: 13.47vw;
		/* 57.91px / 430px * 100 */
		height: 3.08vh;
		/* 28.67px / 932px * 100 */
		border-radius: 1.07vw;
		/* 4.59px / 430px * 100 */
		white-space: nowrap;
		display: flex;
		align-items: center;
		/* 垂直居中 */
		justify-content: center;
		/* 水平居中 */
		background: none;
		/* 确保未选中时没有背景色 */
	}


	.ball-options-container button.selected {
		background: rgba(95, 186, 232, 1);
		/* 选中球的背景颜色 */
		color: rgba(255, 255, 255, 1);
		/* 选中文字颜色 */
		border: none;
		/* 确保选中时没有边框 */
	}

	.ball-options-container button:not(.selected) {
		background: none;
		/* 未选中时无背景色 */
		color: rgba(127, 135, 161, 1);
		/* 未选中球的文字颜色 */
		border: none;
		/* 确保未选中时没有边框 */
	}

	.switch-container {
		display: flex;
		align-items: center;
		margin-left: 30px;
	}


	.random-label {
		font-size: 13.76px;
		/* 字体大小 */
		font-weight: 500;
		/* 字体粗细 */
		letter-spacing: 0px;
		/* 字母间距 */
		line-height: 19.26px;
		/* 行高 */
		color: rgba(127, 135, 161, 1);
		/* 字体颜色 */
		text-align: center;
		/* 文本对齐方式 */
		vertical-align: top;
		/* 垂直对齐方式 */
		margin-right: 8px;
		/* 右侧间距，增加文本和开关之间的距离 */
	}

	.controls {
		display: flex;
		/* 使用 flexbox 布局 */
		flex-direction: row;
		/* 行方向排列 */
		justify-content: space-around;
		/* 子元素均匀分布 */
		padding: 0 2vw;
		/* 使用 vw 单位设置左右内边距 */
	}


	.lower-controls {
		display: flex;
		/* 使用 flexbox 布局 */
		justify-content: space-around;
		/* 子元素均匀分布 */
		align-items: center;
		/* 垂直居中对齐子元素 */
		margin: 0.6vh 0;
		/* 使用 vh 单位保持上下间距 */
		width: 100%;
		/* 控制整个下层按钮组的宽度 */
		flex-wrap: nowrap;
		/* 防止换行 */
	}

	.height-control {
		width: 21.5vw;
		/* 原为 91.73px，转换为 vw */
		height: 17.9vh;
		/* 原为 166.27px，转换为 vh */
		opacity: 1;
		border-radius: 1.5vw;
		/* 原为 9.17px，转换为 vw */
		border: 0.93vw solid rgba(95, 186, 232, 1);
		/* 更新后的 border */
		display: flex;
		/* 使用 Flexbox 布局 */
		flex-direction: column;
		/* 纵向排列 */
		justify-content: space-between;
		/* 上下分布 */
		align-items: center;
		/* 水平居中对齐 */
	}

	.setHeight-top {
		width: 9.55vw;
		height: 9.55vw;
		/* 将高度也改为 vw 单位 */
		border-radius: 5.73px;
		background: rgba(187, 209, 225, 1);
		margin-top: 1.20vh;
	}

	.setHeight-bottom {
		width: 9.55vw;
		height: 9.55vw;
		/* 将高度也改为 vw 单位 */
		border-radius: 5.73px;
		background: rgba(187, 209, 225, 1);
		margin-bottom: 1.20vh;
	}

	.height-text-container {
		display: flex;
		align-items: center;
		margin: 0;
		/* 取消默认的上下边距 */
		/* margin: 1vh 1.1vw; */
		/* 左右边距从 5px 转换为约 1.1vw */
	}

	.height-label {
		font-size: 1.48vh;
		/* 约 13.76px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.07vh;
		/* 约 19.26px */
		color: rgba(51, 51, 51, 1);
	}

	.height-value {
		font-size: 1.48vh;
		/* 约 13.76px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.07vh;
		/* 约 19.26px */
		color: rgba(95, 186, 232, 1);
		text-align: left;
		vertical-align: top;
	}

	.angle-text {
		margin: 1.07vh 0;
		/* 上下文字之间的间距 */
	}


	button {
		padding: 1.07vh 4.76vw;
		/* 使用 vh 和 vw 单位 */
		margin: 0 1.19vw;
		/* 使用 vw 单位调整按钮之间的间距 */
	}


	.new-direction-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.new-outer-border {
		width: 30.95vw;
		/* 使用相同的 vw 单位，保持正方形 */
		height: 30.95vw;
		/* 高度与宽度相同，确保圆形 */
		border: 0.71vw solid rgba(95, 186, 232, 1);
		/* 保持边框相对宽度 */
		border-radius: 50%;
		/* 设置为圆形 */
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}



	.new-up-button,
	.new-down-button {
		width: 8.21vw;
		/* 使用 vw 单位 */
		height: 3.70vh;
		/* 使用 vh 单位 */
		opacity: 1;
		/* 保持不变 */
		position: absolute;
		/* 保持不变 */
		display: flex;
		/* 保持不变 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		cursor: pointer;
		/* 保持不变 */
	}

	.new-up-button {
		top: 0.54vh;
		/* 使用 vh 单位 */
	}

	.new-down-button {
		bottom: 0.54vh;
		/* 使用 vh 单位 */
	}


	.new-left-button,
	.new-right-button {
		width: 8.21vw;
		/* 使用 vw 单位 */
		height: 8.21vw;
		/* 使用 vw 单位 */
		opacity: 1;
		position: absolute;
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		cursor: pointer;
	}


	.new-left-button {
		left: 1.19vw;
		/* 使用 vw 单位 */
	}

	.new-right-button {
		right: 1.19vw;
		/* 使用 vw 单位 */
	}


	.new-middle-row {
		display: flex;
		justify-content: center;
		align-items: center;
		/* 垂直居中 */
	}

	.new-circle {
		width: 10.65vw;
		/* 使用 vw 单位 */
		height: 10.65vw;
		/* 使用 vw 单位 */
		opacity: 1;
		background: rgba(95, 186, 232, 1);
		border-radius: 50%;
		/* 圆形 */
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}


	.new-circle span {
		font-size: 4.08vw;
		/* 使用 vw 单位 */
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 10.65vw;
		/* 使用 vw 单位 */
		/* 文字垂直居中 */
	}


	img {
		width: 130vw;
		/* 使用 vw 单位 */
		height: auto;
		/* 维护宽高比 */
		cursor: pointer;
	}

	.btn-start {
		width: 21.3vw;
		/* 基于430px宽度计算 */
		height: 17.8vh;
		/* 基于932px高度计算 */
		opacity: 1;
		border-radius: 9.17px;
		background: rgba(95, 186, 232, 1);
		display: flex;
		align-items: center;
		/* 垂直居中对齐 */
		justify-content: center;
		/* 水平居中对齐 */
		text-align: center;
		/* 确保文本居中 */
	}


	.btn-start .btn-text {
		font-size: 4.27vw;
		/* 字体大小使用 vw 单位 */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.75vh;
		/* 行高使用 vh 单位 */
		color: rgba(255, 255, 255, 1);
		text-align: center;
		/* 确保文本在span内居中 */
	}

	uni-button:after {
		content: none;
		/* 移除伪元素 */
		display: none;
		/* 确保它不占据空间 */
	}


	.input-container {
		width: 66.77vw;
		/* 宽度使用 vw 单位 */
		height: 17.83vh;
		/* 高度使用 vh 单位 */
		opacity: 1;
		border-radius: 2.13vw;
		/* 边角半径使用 vw 单位 */
		background: rgba(95, 186, 232, 1);
		display: flex;
		flex-direction: column;
		padding-left: 8px;
		/* 左边距保持 px 单位 */
	}

	.input-label {
		font-size: 3.20vw;
		/* 字体大小使用 vw 单位 */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.07vh;
		/* 行高使用 vh 单位 */
		color: rgba(255, 255, 255, 1);
		text-align: left;
		vertical-align: top;
		margin-bottom: 1px;
		/* 下边距保持 px 单位 */
		margin-top: 3px;
		/* 上边距保持 px 单位 */
	}

	.input-area {
		margin-right: 8px;
		/* 右边距保持 px 单位 */
		width: 64.05vw;
		/* 宽度使用 vw 单位 */
		height: 14.77vh;
		/* 高度使用 vh 单位 */
		opacity: 1;
		border-radius: 5.73px;
		background: rgba(255, 255, 255, 1);
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.number-box {
		width: 4.41vw;
		/* 原宽度 18.93px */
		height: 4.41vw;
		/* 原高度 18.93px，与宽度保持一致 */
		border-radius: 50%;
		background: rgba(227, 227, 227, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1.16vw;
		/* 原边距 5px */
	}

	.number-container {
		display: flex;
		flex-wrap: wrap;
		/* 允许换行展示 */
	}

	.number-text {
		font-size: 2.94vw;
		/* 原字体大小 12.61px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 3.90vw;
		/* 原行高 17.66px */
		color: rgba(102, 102, 102, 1);
		text-align: right;
		vertical-align: top;
	}

	.clear-button {
		position: absolute;
		bottom: 5px;
		right: 3px;
		width: 28.67px;
		height: 20.64px;
		opacity: 1;
		background: none;
		border: none;
		padding: 0;
	}

	.clear-button:active {
		background-color: transparent;
		/* 去掉点击后的背景色 */
		box-shadow: none;
		/* 去掉点击后的阴影 */
	}

	.clear-icon {
		width: 6.67vw;
		/* 根据430px宽度计算 */
		height: 2.31vh;
		/* 根据932px高度计算 */
		color: rgba(102, 102, 102, 1);
		text-align: center;
		vertical-align: top;
		display: inline-block;
		/* 确保图标可以正常对齐 */
	}
</style>