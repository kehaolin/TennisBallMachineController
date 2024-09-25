<template>
	<view class="container">
		<!-- 第一层: 蓝牙功能，中英文切换，电量显示 -->
		<view class="header">
			<button @click="navigateToBluetooth">{{ bluetoothName || '蓝牙' }}</button>
			<button class="btn-lang" @click="toggleLanguage">{{ translations.language[currentLanguage] }}</button>
			<image class="battery-icon" src="/static/image/battery.png" />
		</view>

		<!-- 显示已搜索到的蓝牙设备列表 -->
		<view v-if="showActionSheet" class="modal">
			<view class="modal-content">
				<view class="modal-header">
					<text>选择蓝牙设备</text>
					<button @click="showActionSheet = false">关闭</button>
				</view>
				<view class="modal-body">
					<view v-for="device in BluetoothList" :key="device.deviceId" class="device-item">
						<text>{{ device.name || '未知设备' }}</text>
						<button @click="connectDevice(device.deviceId)">连接</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 模式选择功能 -->
		<view class="mode-selection">
			<picker :range="modeNames" :disabled="!modeSelectable" @change="onModeChange">
				<view class="selected-mode" style="border: 1px solid red;">
					{{ translations.currentMode[currentLanguage] }}：{{ modeNames[selectedMode] }}
				</view>
			</picker>
		</view>

		<!-- 第二层: 网球场和网球图片 -->
		<view class="court-container">
			<!-- 背景图 -->
			<img class="tennis-court" src="/static/image/tennis-court.jpg" alt="Tennis Court" />
			<!-- 网球容器 -->
			<view class="ball" v-for="(ball, index) in balls" :key="index" :style="getBallPosition(index)"
				@click="handleBallInteraction(index)">
				<span v-if="showBallNumbers">
					{{ index + 1 }}</span>
			</view>
		</view>

		<!-- 第三层: 开始训练按钮和方向控制按钮 -->
		<view class="controls">
			<!-- //编程模式时使用的文本框，用于记录选择的球 -->
			<view v-if="showInputWithClear" class="input-container">
				<text class="input-label">请选择发球顺序：</text>
				<input type="text" :value="inputData" readonly class="input-field" />
				<button class="clear-button" @click="clearInputData">x</button>
			</view>

			<!-- 发球高度选择 -->
			<view v-if="showHeightSelector" class="height-selector">
				<span>{{ translations.selectedHeight[currentLanguage] }}: {{ selectedHeight }}</span>
				<view class="height-options">
					<div class="dot" :class="{selected: selectedHeight === translations.low[currentLanguage] }"
						@click="selectHeight(translations.low[currentLanguage])"></div>
					<div class="dot" :class="{ selected: selectedHeight === '中' }" @click="selectHeight('中')"></div>
					<div class="dot" :class="{ selected: selectedHeight === '高' }" @click="selectHeight('高')"></div>
				</view>
			</view>

			<!-- 下层按钮（方向按钮、角度调整、启动按钮） -->
			<view class="lower-controls">
				<button ref="startButton" class="btn-start" :style="{ backgroundColor: buttonColor }"
					@click="startTraining">{{ buttonText }}</button>
				<view v-if="showDirectionButtons" class="direction-buttons">
					<view class="up-down-buttons">
						<button @click="handleDirectionKey('up')"
							:disabled="upDownButtonsDisabled">{{ translations.up[currentLanguage] }}</button>
						<button @click="handleDirectionKey('down')"
							:disabled="upDownButtonsDisabled">{{ translations.down[currentLanguage] }}</button>
					</view>
					<view class="left-right">
						<button @click="handleDirectionKey('left')"
							:disabled="leftRightButtonsDisabled">{{ translations.left[currentLanguage] }}</button>
						<button @click="handleDirectionKey('right')"
							:disabled="leftRightButtonsDisabled">{{ translations.right[currentLanguage] }}</button>
					</view>
				</view>

				<view v-if="showAngleControl" class="angle-control">
					<button @click="adjustAngle(-1)">-</button>
					<span>{{ translations.angle[currentLanguage] }}: {{ angle }}</span>
					<button @click="adjustAngle(1)">+</button>
				</view>
				<view v-if="selectedMode === 1 || selectedMode === 2 || selectedMode === 3" class="ball-selection">
					<label>{{ translations.selectBall[currentLanguage] }}</label>
					<button :class="{ selected: selectedBall === 1 }" @click="selectBall(1)">1号球</button>
					<button :class="{ selected: selectedBall === 2 }" @click="selectBall(2)">2号球</button>
				</view>
			</view>
		</view>



		<!-- 第四层: 参数滑动条 -->
		<view class="slider-container">
			<!-- 频率 -->
			<view class="slider">
				<view class="param-label">
					{{ translations.frequency[currentLanguage] }}:<text class="param-value">{{ frequency }}</text>
				</view>
				<slider :value="frequency" min="1" max="10" block-size="16" block-color="#87ceeb" activeColor="#87ceeb"
					backgroundColor="#d3d3d3" @changing="handleFrequencyChanging" @change="handleFrequencyChange" />
				<view class="range-label">
					<text>1</text>
					<text>10</text>
				</view>
			</view>

			<!-- 速度 -->
			<view v-if="selectedMode !== 6" class="slider">
				<view class="param-label">
					{{ translations.speed[currentLanguage] }}:<text class="param-value">{{ speed }}</text>
				</view>
				<slider :value="speed" min="20" max="140" block-size="16" block-color="#87ceeb" activeColor="#87ceeb"
					backgroundColor="#d3d3d3" @changing="handleSpeedChanging" @change="handleSpeedChange" />
				<view class="range-label">
					<text>20</text>
					<text>140</text>
				</view>
			</view>

			<!-- 旋转角度 -->
			<view class="slider">
				<view class="param-label">
					{{ translations.rotate[currentLanguage] }}:<text class="param-value">{{ rotate }}</text>
				</view>
				<slider :value="rotate" min="-6" max="6" block-size="16" block-color="#87ceeb" activeColor="#87ceeb"
					backgroundColor="#d3d3d3" @changing="handleRotateChanging" @change="handleRotateChange" />
				<view class="range-label">
					<text>-6</text>
					<text>6</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bluetoothName: '',
				currentLanguage: 'zh',
				showDirectionButtons: true, // 控制方向按钮的显示与隐藏
				upDownButtonsDisabled: false, // 控制上下方向按钮的禁用状态
				leftRightButtonsDisabled: false, // 控制左右方向按钮的禁用状态
				showAngleControl: true, // 控制角度调整功能的显示与隐藏
				showHeightSelector: false, // 控制发球高度选择功能的显示与隐藏
				showInputWithClear: false, // 控制输入框和清除按钮的显示与隐藏
				inputData: '', // 输入框显示的数据
				angle: 30, // 初始角度				
				heights: 30,
				minAngle: 20, // 角度最小值
				maxAngle: 50, // 角度最大值
				heightOptions: ['低', '中', '高'], // 发球高度选项
				selectedHeight: '中', // 默认选择的发球高度
				selectedBall: 1,
				showBallNumbers: false,
				// 默认生成35个网球
				balls: Array.from({
					length: 35
				}, () => ({
					color: 'gray'
				})),
				courtWidth: 300,
				courtHeight: 200,
				BluetoothList: [], // 存储发现的蓝牙设备
				showActionSheet: false, // 控制弹窗显示
				deviceId: null, // 当前连接的设备ID
				services: null, // 蓝牙服务ID
				notifyUuid: null, // 通知特征值的UUID
				buttonText: '开始训练',
				buttonColor: '#87ceeb', // 默认颜色
				modeSelectable: true,
				translations: {
					bluetooth: {
						zh: '蓝牙连接',
						en: 'Bluetooth'
					},
					language: {
						zh: '中文',
						en: 'English'
					},
					currentMode: {
						zh: '当前模式',
						en: 'Current Mode'
					},
					startTraining: {
						zh: '开始训练',
						en: 'Start Training'
					},
					endTraining: {
						zh: '结束训练',
						en: 'End Training'
					},
					up: {
						zh: '上',
						en: 'Up'
					},
					down: {
						zh: '下',
						en: 'Down'
					},
					left: {
						zh: '左',
						en: 'Left'
					},
					angle: {
						zh: '角度',
						en: 'Angle'
					},
					selectedHeight: {
						zh: '设置发球高度',
						en: 'SelectedHeight'
					},
					low: {
						zh: '低',
						en: 'Low'
					},
					medium: {
						zh: '中',
						en: 'Medium'
					},
					height: {
						zh: '高',
						en: 'High'
					},
					selectBall: {
						zh: '选择球',
						en: 'selectBall'
					},
					right: {
						zh: '右',
						en: 'Right'
					},
					frequency: {
						zh: '频率',
						en: 'Frequency'
					},
					speed: {
						zh: '速度',
						en: 'Speed'
					},
					rotate: {
						zh: '旋转程度',
						en: 'Rotate'
					}
				},
				modes: [{
						zh: '定点练习',
						en: 'Fixed Point Practice'
					},
					{
						zh: '交叉循环',
						en: 'Cross Cycle'
					},
					{
						zh: '水平循环',
						en: 'Horizontal Cycle'
					},
					{
						zh: '垂直循环',
						en: 'Vertical Cycle'
					},
					{
						zh: '敲击练习',
						en: 'Smash Practice'
					},
					{
						zh: '高压练习',
						en: 'High Pressure Practice'
					},
					{
						zh: '全场随机',
						en: 'Full Court Random'
					},
					{
						zh: '编程练习',
						en: 'Program Practice'
					},
					{
						zh: '入门练习',
						en: 'Beginner Practice'
					},
					{
						zh: '月亮球',
						en: 'Moon Ball'
					}
				],
				modeConfig: {
					0: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 定点练习
					1: {
						ballCount: 2,
						positions: [
							[2, 2],
							[3, 4]
						]
					}, // 交叉循环
					2: {
						ballCount: 2,
						positions: [
							[2, 0],
							[2, 4]
						]
					}, // 水平循环
					3: {
						ballCount: 2,
						positions: [
							[0, 2],
							[3, 2]
						]
					}, // 垂直循环
					4: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 截击练习
					5: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 高压练习
					6: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 全场随机
					7: {
						ballCount: 35,
						positions: [ // 编程练习
							[0, 0],
							[0, 1],
							[0, 2],
							[0, 3],
							[0, 4],
							[1, 0],
							[1, 1],
							[1, 2],
							[1, 3],
							[1, 4],
							[2, 0],
							[2, 1],
							[2, 2],
							[2, 3],
							[2, 4],
							[3, 0],
							[3, 1],
							[3, 2],
							[3, 3],
							[3, 4],
							[4, 0],
							[4, 1],
							[4, 2],
							[4, 3],
							[4, 4],
							[5, 0],
							[5, 1],
							[5, 2],
							[5, 3],
							[5, 4],
							[6, 0],
							[6, 1],
							[6, 2],
							[6, 3],
							[6, 4]
						]
					}, // 编程练习
					8: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 入门练习
					9: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					} // 月亮球
				},
				modeParams: [{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '',
						angle: 20
					}, // 定点练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '中',
						angle: null
					}, // 交叉循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '',
						angle: 30
					}, // 水平循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '中',
						angle: null
					}, // 垂直循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '',
						angle: 30
					}, // 截击练习
					{
						frequency: 7,
						speed: 50,
						rotate: 0,
						heights: '',
						angle: 30
					}, // 高压练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '中',
						angle: null
					}, // 全场随机
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '',
						angle: null
					}, // 编程练习
					{
						frequency: 7,
						speed: 20,
						rotate: 0,
						heights: '',
						angle: 30
					}, // 入门练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0,
						heights: '',
						angle: 30
					} // 月亮球
				],
				modeSettings: {
					0: {
						upDown: true,
						leftRight: true
					}, // 定点练习
					1: {
						upDown: true,
						leftRight: true
					}, // 交叉循环
					2: {
						upDown: true,
						leftRight: true
					}, // 水平循环
					3: {
						upDown: true,
						leftRight: true
					}, // 垂直循环
					4: {
						upDown: true,
						leftRight: true
					}, // 截击练习
					5: {
						upDown: true,
						leftRight: true
					}, // 高压练习
					6: {
						upDown: false,
						leftRight: false
					}, // 全场随机
					7: {
						upDown: false,
						leftRight: false
					}, // 编程练习
					8: {
						upDown: true,
						leftRight: true
					}, // 入门练习
					9: {
						upDown: true,
						leftRight: true
					}, // 月亮球
				},
				selectedMode: 0,
				frequency: 5,
				speed: 20,
				rotate: 0,
				ballCount: 1, // 网球个数
				selectedBalls: [], // 记录被点击的网球索引
				selectedSequence: [], // 用于记录选中的网球序号
				ballColors: [], // 用于记录每个网球的颜色状态
				defaultPositions: [], // 网球默认位置
				ballPosition: {
					x: 2,
					y: 2
				}, // 记录网球的位置
				trainingActive: false,
				initialParams: {
					frequency: 5,
					speed: 20,
					rotate: 0,
					heights: '',
					angle: 20
				},
				initialBallPosition: {
					x: 0,
					y: 0
				}
			};
		},
		computed: {
			modeNames() {
				return this.modes.map(mode => mode[this.currentLanguage]);
			},
			ballStyle() {
				const cellSize = Math.min(300 / 5, 400 / 7); // 网球场宽度为300px，高度为400px，分成5列7行，网球大小适应格子
				const backgroundColor = this.selectedMode === 7 ? this.ballColors[index] || 'gray' : 'red';
				return {
					top: `${this.ballPosition.y * cellSize}px`, // 更新top坐标，基于7行布局
					left: `${this.ballPosition.x * cellSize}px`, // left坐标仍基于5列
					width: `${cellSize * 0.8}px`, // 增大网球的大小，保持比例
					height: `${cellSize * 0.8}px`,
					backgroundColor // 根据颜色状态设置背景颜色
				};
			}
		},
		watch: {
			selectedBall(newValue) {
				this.updateButtonStates(); // 选中的球发生变化时更新按钮状态
			},
			selectedMode(newValue) {
				this.updateButtonStates(); // 选中的模式发生变化时更新按钮状态
			}
		},
		onLoad(options) {
			// 检查是否传递了 bluetoothName
			if (options.bluetoothName) {
				this.bluetoothName = options.bluetoothName;
			}
		},
		methods: {
			navigateToBluetooth() {
				// 返回蓝牙页面
				uni.navigateTo({
					url: '/pages/bluetooth/bluetooth'
				});
			},
			updateButtonStates() {
				// 更新上下和左右按钮的禁用状态
				this.upDownButtonsDisabled = this.selectedMode === 2 && this.selectedBall === 2;
				this.leftRightButtonsDisabled = this.selectedMode === 3 && this.selectedBall === 2;
			},
			// 获取网球场大小
			getCourtSize() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.tennis-court').boundingClientRect(rect => {
					this.courtWidth = rect.width;
					this.courtHeight = rect.height;
					this.updateBallPositions(0);
				}).exec();
			},

			selectBall(ballNumber) {
				this.selectedBall = ballNumber; // 选择球
			},

			// 计算网球在网球场上的位置（基于4x5网格）
			calculatePosition(row, col) {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				const numCols = 5; // 列数
				const numRows = 7; // 行数

				const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
				const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距

				const top = verticalPadding + row * (ballSize + verticalPadding);
				const left = horizontalPadding + col * (ballSize + horizontalPadding);

				return {
					top,
					left
				};
			},

			// 获取网球的样式
			getBallPosition(index) {
				const ball = this.balls[index];
				if (!ball) {
					// 如果 ball 未定义，返回默认样式
					return {
						top: '0px',
						left: '0px',
						width: '20px',
						height: '20px',
						backgroundColor: 'gray'
					};
				}
				return {
					top: ball.top || '0px',
					left: ball.left || '0px',
					width: ball.width || '20px',
					height: ball.height || '20px',
					backgroundColor: ball.color || 'gray'
				};
			},

			handleBallInteraction(index) {
				// 确保只有在模式7下生效
				if (this.selectedMode !== 7) return;

				// 获取当前点击的球
				const ball = this.balls[index];

				// 如果球是灰色，点击后变为红色
				if (ball.color === 'gray') {
					this.$set(this.balls, index, {
						...ball,
						color: 'red'
					});
					console.log(`球 ${index + 1} 变为红色`); // 调试输出
					this.selectedBalls.push(index + 1); // 记录被点击的球，+1为了显示从1开始
				}
				// 如果球是红色，点击后变为灰色
				else {
					this.$set(this.balls, index, {
						...ball,
						color: 'gray'
					});
					console.log(`球 ${index + 1} 变为灰色`); // 调试输出
					this.selectedBalls = this.selectedBalls.filter(ballIndex => ballIndex !== (index + 1));
				}

				// 更新展示的输入框内容
				this.inputData = this.selectedBalls.join(',');
			},

			clearInputData() {
				this.inputData = []
				this.selectedBalls = []
				// 重置所有球的颜色为灰色
				this.balls = this.balls.map(ball => ({
					...ball,
					color: 'gray'
				}));
			},

			restoreDefaultBallPositions() {
				const selectedModeConfig = this.modeConfig[this.selectedMode];

				// 检查是否存在默认位置
				if (selectedModeConfig && selectedModeConfig.positions) {
					// 重新设置球的位置为 modeConfig 中的初始位置
					selectedModeConfig.positions = selectedModeConfig.positions.map(position => [...position]);

					// 更新球的位置显示
					this.updateBallPositions(this.selectedMode);
				} else {
					console.error("未找到默认位置！");
				}
			},

			updateBallPositions(mode) {
				console.log('进来了+++++', mode)
				let modeConfig = this.modeConfig
				// 获取当前模式的球数和初始位置
				const config = modeConfig[mode] || {
					ballCount: 1,
					positions: [
						[2, 2]
					]
				};
				const {
					ballCount,
					positions
				} = config;

				this.balls = positions.map(([row, col]) => {
					const position = this.calculatePosition(row, col);
					return {
						width: '20px',
						height: '20px',
						top: `${position.top}px`,
						left: `${position.left}px`,
						color: mode === 7 ? 'gray' : 'red' // 模式7下为灰色，其他模式为红色
					};
				});

				// 如果是模式7，确保有35个球
				if (mode === 7) {
					while (this.balls.length < 35) {
						this.balls.push({
							width: '20px',
							height: '20px',
							top: '0px',
							left: '0px',
							color: mode === 7 ? 'gray' : 'red' // 模式7下为灰色，其他模式为红色
						});
					}
				}
				// 初始化球的颜色状态为灰色
				this.ballColors = new Array(this.balls.length).fill('gray');
			},


			// 计算网球在网球场上的位置（基于4x5网格）
			calculatePosition(row, col) {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				const numCols = 5; // 列数
				const numRows = 7; // 行数

				// 确保 courtWidth 和 courtHeight 是网球场的实际宽度和高度
				const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
				const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距

				const top = verticalPadding + row * (ballSize + verticalPadding);
				const left = horizontalPadding + col * (ballSize + horizontalPadding);

				return {
					top,
					left
				};
			},

			// 将字符串转换成ArrayBuffer
			string2buffer(str) {
				let val = "";
				if (!str) return;
				const length = str.length;
				let index = 0;
				const array = [];
				while (index < length) {
					array.push(str.substring(index, index + 2));
					index = index + 2;
				}
				val = array.join(",");
				return new Uint8Array(val.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16))).buffer;
			},

			// 将ArrayBuffer转换成字符串
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					(bit) => ('00' + bit.toString(16)).slice(-2)
				);
				return hexArr.join('');
			},
			toggleLanguage() {
				this.currentLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
			},
			onModeChange(event) {
				const index = event.detail.value;
				this.selectedMode = index;

				// 更新参数的默认值，根据所选模式
				this.updateParametersForMode(index);

				// 控制 UI 部件显示隐藏
				this.showBallNumbers = [1, 2, 3, 7].includes(this.selectedMode);
				// 编程练习显示数字
				this.toggleDirectionButtons(this.selectedMode); // 控制方向按钮显示
				this.toggleAngleControl(this.selectedMode); // 控制角度调整显示
				this.toggleHeightSelector(this.selectedMode); // 控制发球高度选择功能
				this.showInputWithClear = (this.selectedMode === 7); // 编程练习模式下的输入框

				// 根据模式设置网球个数及默认位置
				this.updateBallPositions(index);
				this.resetToInitialValues();
			},

			toggleDirectionButtons(selectedMode) {
				// 定义一个对象来映射每个模式的上下移动和左右移动状态
				const modeSettings = this.modeSettings

				// 默认隐藏方向按钮
				this.showDirectionButtons = false;
				this.upDownButtonsDisabled = false;
				this.leftRightButtonsDisabled = false;

				// 根据 selectedMode 设置方向按钮的显示和禁用状态
				const settings = modeSettings[selectedMode] || {
					upDown: false,
					leftRight: false
				};
				if (settings.upDown || settings.leftRight) {
					this.showDirectionButtons = true; // 显示方向按钮
				}
				this.upDownButtonsDisabled = !settings.upDown;
				this.leftRightButtonsDisabled = !settings.leftRight;
			},

			// 控制角度调整功能的显示与隐藏
			toggleAngleControl(selectedMode) {
				if ([0, 2, 4, 5, 8, 9].includes(selectedMode)) {
					this.showAngleControl = true;
				} else {
					this.showAngleControl = false;
				}
			},

			// 控制发球高度选择功能的显示与隐藏
			toggleHeightSelector(selectedMode) {
				if ([1, 3, 6].includes(selectedMode)) {
					this.showHeightSelector = true;
				} else {
					this.showHeightSelector = false;
				}
			},
			// 调整角度
			adjustAngle(change) {
				this.angle = Math.min(Math.max(this.angle + change, this.minAngle), this.maxAngle);
			},

			// 选择发球高度
			selectHeight(height) {
				this.selectedHeight = height;
			},
			updateParametersForMode(modeIndex) {
				// 定义每个模式的默认参数
				const modeParams = this.modeParams

				// 获取所选模式的参数，如果模式索引超出范围，则使用初始参数
				const params = modeParams[modeIndex] || this.initialParams;

				// 更新参数值
				this.frequency = params.frequency;
				this.speed = params.speed;
				this.rotate = params.rotate;
				this.heights = params.heights
				this.angle = params.angle

				// 重置球的位置
				this.resetBallPosition();
			},

			// 处理方向键按下事件
			handleDirectionKey(direction) {
				// 模式1: 选中的球可以自由移动
				if (this.selectedMode === 1) {
					this.moveBall(this.selectedBall, direction);
				}
				// 模式2: 1号球可以自由移动，上下移动时2号球跟随，2号球只能左右移动
				else if (this.selectedMode === 2) {
					if (this.selectedBall === 1) {
						this.moveBall(1, direction); // 1号球可以上下左右移动
						if (direction === 'up' || direction === 'down') {
							this.moveBall(2, direction); // 2号球跟随上下移动
						}
					} else if (this.selectedBall === 2 && (direction === 'left' || direction === 'right')) {
						this.moveBall(2, direction); // 2号球只能左右移动
					}
				}
				// 模式3: 1号球可以自由移动，左右移动时2号球跟随，2号球只能上下移动
				else if (this.selectedMode === 3) {
					if (this.selectedBall === 1) {
						this.moveBall(1, direction); // 1号球可以上下左右移动
						if (direction === 'left' || direction === 'right') {
							this.moveBall(2, direction); // 2号球跟随左右移动
						}
					} else if (this.selectedBall === 2 && (direction === 'up' || direction === 'down')) {
						this.moveBall(2, direction); // 2号球只能上下移动
					}
				} else {
					this.moveBall(1, direction)
				}
			},

			moveBall(ballNumber, direction) {
				const maxRows = 6; // 网球场的行数
				const maxCols = 4; // 网球场的列数
				const selectedModeConfig = this.modeConfig[this.selectedMode];
				const ballPositions = selectedModeConfig.positions;

				// 复制当前球的位置，防止直接修改原数组
				let newPositions = ballPositions.map(position => [...position]);

				// 获取当前球的位置
				let [row, col] = newPositions[ballNumber - 1]; // ballNumber 从 1 开始，数组索引从 0 开始

				// 根据按下的方向键更新选中球的位置
				switch (direction) {
					case 'up':
						if (row > 0) row -= 1; // 向上移动一行
						break;
					case 'down':
						if (row < maxRows) row += 1; // 向下移动一行
						break;
					case 'left':
						if (col > 0) col -= 1; // 向左移动一列
						break;
					case 'right':
						if (col < maxCols) col += 1; // 向右移动一列
						break;
				}

				// 更新选中球的位置
				newPositions[ballNumber - 1] = [row, col];

				// 根据不同模式，更新其他球的位置
				if (this.selectedMode === 2 && ballNumber === 1) {
					// 模式2: 1号球上下移动时，2号球跟随上下移动，但2号球只能水平移动
					newPositions[1][0] = row; // 2号球的行号跟随1号球
				} else if (this.selectedMode === 2 && ballNumber === 2) {
					// 2号球只能左右移动，行保持不变
					newPositions[1] = [newPositions[0][0], col]; // 保证2号球与1号球保持水平
				} else if (this.selectedMode === 3 && ballNumber === 1) {
					// 模式3: 1号球左右移动时，2号球跟随左右移动，但2号球只能垂直移动
					newPositions[1][1] = col; // 2号球的列号跟随1号球
				} else if (this.selectedMode === 3 && ballNumber === 2) {
					// 2号球只能上下移动，列保持不变
					newPositions[1] = [row, newPositions[0][1]]; // 保证2号球与1号球保持垂直
				}

				// 更新球的位置
				selectedModeConfig.positions = newPositions;

				// 更新球在界面上的显示位置
				this.updateBallPositions(this.selectedMode);
			},


			startTraining() {
				if (!this.trainingActive) {
					this.trainingActive = true;
					this.buttonText = this.translations.endTraining[this.currentLanguage];
					this.buttonColor = '#ff6347'; // 训练中按钮颜色
					this.modeSelectable = false; // 禁用模式选择

					// 确定发球顺序
					this.determineServingOrder();

					// 打印信息
					this.printTrainingInfo();
				} else {
					this.endTraining()
				}
			},

			endTraining() {
				this.trainingActive = false;
				this.buttonText = this.translations.startTraining[this.currentLanguage];
				this.buttonColor = '#87ceeb'; // 结束训练按钮颜色
				this.modeSelectable = true; // 启用模式选择		
				this.resetToInitialValues(); // 恢复初始值
				this.sendTrainingParams(); // 发送结束参数
				// 重置 UI 控件的值（如需要）
				// this.resetSlidersToDefault();
			},

			resetToInitialValues() {
				// 恢复所有模式的默认参数
				const modeParams = this.modeParams[this.selectedMode] || {};
				this.frequency = this.initialParams.frequency;
				this.speed = this.initialParams.speed;
				this.rotate = this.initialParams.rotate;
				this.angle = this.initialParams.angle;
				this.heights = this.initialParams.heights;
				this.selectedBall = 1
				console.log('训练结束', this.selectedMode)
				this.restoreDefaultBallPositions()
			},

			handleFrequencyChange(event) {
				this.frequency = event.detail.value;
				this.sendTrainingParams(); // 发送调整后的参数
			},
			handleSpeedChange(event) {
				this.speed = event.detail.value;
				this.sendTrainingParams(); // 发送调整后的参数
			},
			handleRotateChange(event) {
				this.rotate = event.detail.value;
				this.sendTrainingParams(); // 发送调整后的参数
			},
			resetBallPosition() {
				// 重置网球的位置
				this.ballPosition = {
					...this.initialBallPosition
				};
			},

			determineServingOrder() {
				if (this.selectedMode === 7) {
					// 模式7：使用用户定义的发球顺序
					this.servingOrder = this.inputData.split(',').map(Number);
				} else {
					// 其他模式：从左到右、从上到下的顺序
					this.servingOrder = this.balls.map((_, index) => index + 1);
				}
			},

			printTrainingInfo() {
				const mode = this.selectedMode; // 当前模式
				const positions = this.balls.map(ball => ({
					top: ball.top || '0px',
					left: ball.left || '0px'
				})); // 每个球的位置

				// 直接使用实例变量中的当前参数
				const angles = this.balls.map(() => this.angle || '-'); // 角度信息
				const heights = this.balls.map(() => this.heights || '-'); // 高度信息
				const frequencies = this.balls.map(() => this.frequency || '-'); // 频率信息
				const speeds = this.balls.map(() => this.speed || '-'); // 速度信息
				const rotations = this.balls.map(() => this.rotate || '-'); // 旋转信息

				// 组织成一个对象
				const trainingInfo = {
					mode: mode,
					positions: positions,
					angles: angles,
					heights: heights,
					frequencies: frequencies,
					speeds: speeds,
					rotations: rotations
				};

				// 输出为 JSON 格式
				console.log('训练信息:', JSON.stringify(trainingInfo, null, 2));
			},

			sendTrainingParams() {
				console.log('训练结束')
			},
		},
		mounted() {
			this.updateParametersForMode(this.selectedMode);
			this.getCourtSize();
			this.updateBallPositions(0)
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		background-color: white;
		border-radius: 10px;
		width: 80%;
		max-width: 500px;
		padding: 20px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.modal-body {
		max-height: 400px;
		overflow-y: auto;
	}

	.device-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.device-item text {
		flex: 1;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
	}

	.btn-bluetooth,
	.btn-lang {
		margin: 0 10px;
	}

	.battery-icon {
		width: 30px;
		height: 30px;
	}

	.mode-selection {
		margin: 10px;
	}

	.court-container {
		position: relative;
		/* 根据需求调整网球场的高度 */
	}

	.tennis-court {
		width: 100%;
		/* 网球场自适应屏幕宽度 */
		height: auto;
		/* 高度自动调整 */
	}

	.ball-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.ball {
		position: absolute;
		background: rgba(255, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		/* 使用 flex 布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		width: 30px;
		/* 网球的宽度 */
		height: 30px;
		/* 网球的高度 */
		color: #fff;
		font-size: 14px;
		z-index: 10;
		/* 提升 z-index 确保它接收点击事件 */
	}

	.tennis-ball-gray {
		background-color: gray;
	}

	.tennis-ball-red {
		background-color: red;
	}

	.controls {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
	}

	.height-selector {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		white-space: nowrap;
		/* 防止文字与单选框换行 */
	}

	.height-options {
		display: flex;
		justify-content: space-between;
		margin-left: 10px;
		/* 距离文字的间距 */
	}

	.dot {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: lightgray;
		margin: 0 5px;
		cursor: pointer;
	}

	.selected {
		background-color: green;
	}

	.btn-start {
		padding: 10px 20px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 5px;
	}

	.lower-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		/* 控制整个下层按钮组的宽度 */
		flex-wrap: nowrap;
		/* 防止换行 */
	}

	.direction-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.direction-buttons .left-right {
		display: flex;
		justify-content: space-between;
		width: 150px;
	}

	.angle-control {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: auto;
	}

	.angle-control button {
		width: 40px;
		height: 40px;
	}

	.angle-control span {
		margin: 10px 0;
		/* 在上下按钮与文字之间添加间距 */
	}


	button {
		padding: 10px 20px;
		margin: 0 5px;
		/* 调整按钮之间的间距 */
	}

	.input-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 10px;
		/* 在按钮组和输入框之间添加间距 */
	}


	input[type="text"] {
		border: 1px solid #ccc;
		padding: 5px;
		margin-right: 10px;
		width: 150px;
		text-align: center;
		/* 设置输入框宽度和对齐方式 */
	}

	.clear-button {
		background-color: #f44;
		color: #fff;
		border: none;
		padding: 5px 10px;
		cursor: pointer;
		font-size: 16px;
		cursor: pointer;
	}

	.clear-button:hover {
		background-color: #d33;
	}



	.slider-container {
		padding: 10px;
	}

	.slider {
		margin-bottom: 10px;
	}

	.param-label {
		display: flex;
		justify-content: space-between;
	}

	.param-value {
		font-weight: bold;
	}

	.range-label {
		display: flex;
		justify-content: space-between;
	}
</style>