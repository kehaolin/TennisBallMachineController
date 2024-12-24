<template>
	<modal v-if="showModal">
		<view class="overlay" @click="closeModePicker"></view> <!-- 透明遮罩层 -->
		<view class="modeSelect-content" @click.stop> <!-- 阻止点击事件向上传递 -->
			<!-- 顶部文字 -->
			<view class="modeSelect-header">
				<span class="selectMode">{{ translations.selectMode[currentLanguage] }}</span>
			</view>

			<!-- 分割线 -->
			<view class="modeSelect-line"></view>

			<!-- 模式选项列表 -->
			<view class="mode-item-container" ref="modeItemContainer">
				<view v-for="(mode, index) in modeNames" :key="index"
					:class="['mode-item', { 'selected-mode-item': index === temporarySelectedMode }]"
					@click="setTemporaryMode(index)">
					{{ mode }}
				</view>
			</view>
		</view>
	</modal>
</template>

<script>
	export default {
		name: 'ModePickerModal',
		props: {
			showModal: {
				type: Boolean,
				required: true
			},
			modeNames: {
				type: Array,
				required: true
			},
			translations: {
				type: Object,
				required: true
			},
			currentLanguage: {
				type: String,
				required: true
			},
			temporarySelectedMode: {
				type: Number,
				required: true
			}
		},
		methods: {
			closeModePicker() {
				this.$emit('closeModal'); // 向父组件发送关闭弹窗的事件
			},
			setTemporaryMode(index) {
				this.$emit('setTemporaryMode', index); // 向父组件发送选中模式的事件
			}
		}
	}
</script>

<style scoped>
	/* 样式 */
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

	.modeSelect-content {
		width: 100vw;
		/* 430px */
		height: 50.5vh;
		/* 470.13px */
		opacity: 1;
		border-radius: 3.37vw 3.37vw 0px 0px;
		/* 14.48px */
		background: rgba(255, 255, 255, 1);
		z-index: 9999;
		position: absolute;
		/* 绝对定位 */
		bottom: 0;
		/* 紧贴底部 */
		left: 50%;
		/* 水平居中 */
		transform: translateX(-50%);
		/* 将其中心点调整到父元素中心 */
	}

	.modeSelect-header {
		height: 6.43vh;
		/* 60px */
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* 左右分布对齐 */
		position: relative;
		/* 提供相对定位以便后续使用 */
	}

	.selectMode {
		font-size: 4.79vw;
		/* 20.64px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 3.10vh;
		/* 28.9px */
		color: rgba(1, 1, 1, 1);
		text-align: center;
		/* 确保文本在该区域内居中 */
		position: absolute;
		/* 绝对定位 */
		left: 50%;
		/* 左边距为50% */
		transform: translateX(-50%);
		/* 向左移动自身宽度的一半以实现完全居中 */
	}

	.modeSelect-line {
		width: 100%;
		/* 仍然使用100% */
		height: 0.25vh;
		/* 2.29px */
		opacity: 1;
		background: rgba(246, 244, 245, 1);
	}

	.mode-item-container {
		max-height: 39.8vh;
		/* 固定高度 */
		overflow-y: auto;
		/* 当内容超出时滚动 */
		padding: 10px 0;
		/* 给列表一些内边距 */
	}


	/* 未选中项样式 */
	.mode-item {
		width: 89.3vw;
		/* 固定宽度 */
		height: 5.5vh;
		/* 固定高度 */
		border-radius: 11.47px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* 居中展示 */
		margin: 10px auto;
		/* 自动水平居中 */
		font-size: 4vw;
		/* 未选中的字体大小 */
		font-weight: 400;
		/* 未选中的字体权重 */
		letter-spacing: 0px;
		line-height: 2.6vh;
		/* 行高 */
		color: rgba(153, 153, 153, 1);
		/* 未选中的字体颜色 */
		text-align: left;
		vertical-align: top;
		background: transparent;
		overflow-y: auto;
		/* 未选中没有背景色 */
	}


	/* 选中项样式 */
	.selected-mode-item {
		background: rgba(250, 250, 252, 1);
		/* 选中的背景色 */
		font-weight: 500;
		/* 选中的字体权重 */
		color: rgba(51, 51, 51, 1);
		/* 选中的字体颜色 */
	}
</style>