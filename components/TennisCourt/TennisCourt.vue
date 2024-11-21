<template>
	<view class="court-container">
		<!-- 背景图 -->
		<!-- 前场 -->
		<div class="tennis-court-container">
			<img class="tennis-court1" :src="images.tennisCourt1" alt="Tennis Court">
			<div class="launcher-container" :style="{ top: launcherTop }">
				<img class="launcher" :src="images.launcher" alt="Launcher">
			</div>
		</div>

		<img ref="courtImage" class="tennis-court2" :src="images.tennisCourt2" alt="Tennis Court" />

		<!-- 网球容器 -->
		<view class="ball" v-for="(ball, index) in balls" :key="index" :style="getBallPosition(index)"
			@click="handleBallInteraction(index)">
			<!-- 仅当球可以展示时，才显示序号 -->
			<span v-if="ball.canDisplay && showBallNumbers" class="ball-text">
				{{ getDisplayableIndex(index) + 1 }}
			</span>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TennisCourt',
		props: {
			balls: Array, // 网球的数据数组
			images: Object, // 图片资源
			launcherTop: String, // 发球机的位置
			showBallNumbers: Boolean, // 是否显示球的序号
		},
		methods: {
			getBallPosition(index) {
				const ball = this.balls[index];

				// 根据球的状态选择图片
				const imageUrl = (ball && ball.color === 'yellow') ? this.images.yellowBall : this.images.grayBall
				return {
					top: ball ? ball.top || '0px' : '0px',
					left: ball ? ball.left || '0px' : '0px',
					width: ball ? ball.width || '4.65vw' : '4.65vw', // 自适应宽度
					height: ball ? ball.height || '2.14vh' : '2.14vh', // 自适应高度
					backgroundImage: `url(${imageUrl})`, // 根据颜色选择图片
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundColor: 'transparent' // 确保背景色透明
				};
			},
			// 获取可以显示的序号
			getDisplayableIndex(index) {
				// 获取所有可展示的球的索引
				const displayableBalls = this.balls.filter(ball => ball.canDisplay);
				// 返回对应的序号
				return displayableBalls.findIndex(ball => ball === this.balls[index]);
			},
			// 处理球的交互
			handleBallInteraction(index) {
				this.$emit('ball-interacted', index);
			}
		},
	};
</script>

<style scoped>
	.court-container {
		display: flex;
		flex-direction: column;
		padding: 0;
		border: none;
	}

	.tennis-court-container {
		position: relative;
		/* 作为定位的参考容器 */
		width: 100vw;
		/* 根据需要设置宽度 */
	}

	.tennis-court1 {
		width: 100vw;
		height: 14.4vw;
		position: relative;
		/* 设置相对定位，作为 .launcher 的定位参考 */
	}

	.launcher-container {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		/* 不设置固定 top 值，由 JavaScript 动态控制 */
		z-index: 1;
		/* 确保 launcher 在最上层 */
	}

	.launcher {
		width: 3.95vw;
		/* 宽度转换为 vw */
		height: 3.43vh;
		/* 高度转换为 vh */
	}

	.tennis-court1,
	.tennis-court2 {
		display: block;
		margin: 0;
		padding: 0;
		border: none;
	}

	.tennis-court2 {
		width: 100vw;
		height: 48.3vw;
	}

	.ball {
		position: absolute;
		background: rgba(255, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		width: calc(6.98vw);
		/* 适应宽度 */
		height: calc(6.98vw);
		/* 保持宽高一致 */
		color: #fff;
		font-size: calc(3.22vw);
		/* 这里也可以设置为与宽度一致，确保适应 */
		z-index: 10;
		transition: top 0.05s ease, left 0.05s ease;
	}

	.ball-text {
		font-size: 4.19vw;
		/* 原字体大小 18px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 8.22vw;
		/* 原行高 36.4px */
		color: rgba(0, 0, 0, 1);
		text-align: center;
		vertical-align: top;
	}
</style>