<template>
	<view class="container">
		<!-- 第一层: 蓝牙功能，中英文切换，电量显示 -->
		<view class="header">
			<button class="btn-bluetooth" @click="player">{{ translations.bluetooth[currentLanguage] }}</button>
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
			<view class="ball-container">
				<view class="ball" v-for="(ball, index) in balls" :key="index" :style="getBallPosition(index)">
					<span v-if="showBallNumbers">{{ index + 1 }}</span>
				</view>
			</view>
		</view>

		<!-- 第三层: 开始训练按钮和方向控制按钮 -->
		<view class="controls">
			<!-- //编程模式时使用的文本框，用于记录选择的球 -->
			<view v-if="showInputWithClear" class="input-container">
				<input type="text" :value="inputData" readonly />
				<button class="clear-button" @click="clearInput">x</button>
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
						<button @click="moveBall('up')"
							:disabled="upDownButtonsDisabled">{{ translations.up[currentLanguage] }}</button>
						<button @click="moveBall('down')"
							:disabled="upDownButtonsDisabled">{{ translations.down[currentLanguage] }}</button>
					</view>
					<view class="left-right">
						<button @click="moveBall('left')"
							:disabled="leftRightButtonsDisabled">{{ translations.left[currentLanguage] }}</button>
						<button @click="moveBall('right')"
							:disabled="leftRightButtonsDisabled">{{ translations.right[currentLanguage] }}</button>
					</view>
				</view>
				<view v-if="showAngleControl" class="angle-control">
					<button @click="adjustAngle(-1)">-</button>
					<span>{{ translations.angle[currentLanguage] }}: {{ angle }}</span>
					<button @click="adjustAngle(1)">+</button>
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
			<view class="slider">
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
				currentLanguage: 'zh',
				showDirectionButtons: true, // 控制方向按钮的显示与隐藏
				upDownButtonsDisabled: false, // 控制上下方向按钮的禁用状态
				leftRightButtonsDisabled: false, // 控制左右方向按钮的禁用状态
				showAngleControl: true, // 控制角度调整功能的显示与隐藏
				showHeightSelector: true, // 控制发球高度选择功能的显示与隐藏
				showInputWithClear: false, // 控制输入框和清除按钮的显示与隐藏
				inputData: '请按顺序点击网球', // 输入框显示的数据
				angle: 30, // 初始角度
				minAngle: 20, // 角度最小值
				maxAngle: 50, // 角度最大值
				heightOptions: ['低', '中', '高'], // 发球高度选项
				selectedHeight: '中', // 默认选择的发球高度
				showBallNumbers: false,
				// 默认生成20个网球
				balls: Array.from({
					length: 1
				}),
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
				selectedMode: 0,
				frequency: 5,
				speed: 20,
				rotate: 0,
				ballCount: 1, // 网球个数
				defaultPositions: [], // 网球默认位置
				ballPosition: {
					x: 0,
					y: 0
				}, // 记录网球的位置
				trainingActive: false,
				initialParams: {
					frequency: 5,
					speed: 20,
					rotate: 0
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
				const cellSize = Math.min(300 / 5, 50); // 设定网球场宽度为300px，分成5格，网球大小适应格子
				return {
					top: `${this.ballPosition.y * cellSize}px`,
					left: `${this.ballPosition.x * cellSize}px`,
					width: `${cellSize * 0.8}px`, // 增大网球的大小
					height: `${cellSize * 0.8}px`
				};
			}
		},
		methods: {
			player() {
				uni.openBluetoothAdapter({
					success: (res) => {
						uni.showToast({
							title: '初始化成功',
							icon: 'success',
							duration: 800
						});
						this.findBlue(); // 开始搜索蓝牙设备
					},
					fail: () => {
						uni.showToast({
							title: '请打开蓝牙',
							icon: 'none'
						});
					}
				});
			},

			// 搜索蓝牙
			findBlue() {
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: false,
					interval: 0,
					success: () => {
						uni.showLoading({
							title: '正在搜索设备',
						});
						this.getBlue(); // 获取搜索到的设备
					}
				});

				// 停止搜索设备的时间设置为10秒
				setTimeout(() => {
					uni.stopBluetoothDevicesDiscovery({
						success: () => {
							console.log('停止蓝牙搜索');
						}
					});
				}, 10000); // 10秒后停止搜索
			},

			// 获取搜索到的设备信息
			getBlue() {
				uni.getBluetoothDevices({
					success: (res) => {
						uni.hideLoading();
						this.BluetoothList = res.devices;
						console.log('-----------' + res.devices)
						this.showActionSheet = true; // 显示设备列表弹窗
					},
					fail: () => {
						console.log("搜索蓝牙设备失败");
					}
				});
			},

			// 处理设备点击事件
			connectDevice(deviceId) {
				uni.createBLEConnection({
					deviceId: deviceId,
					success: () => {
						uni.showToast({
							title: '连接成功',
							icon: 'success',
							duration: 800
						});
						uni.stopBluetoothDevicesDiscovery({
							success: () => {
								console.log('连接蓝牙成功之后关闭蓝牙搜索');
							}
						});
						this.deviceId = deviceId;
						this.getServiceId(); // 获取服务ID
					},
					fail: (err) => {
						console.log('连接失败', err);
					}
				});
			},

			// 获取服务ID
			getServiceId() {
				uni.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						console.log(res);
						this.readyservices = res.services[0].uuid;
						this.services = res.services[1].uuid;
						this.getCharacteId(); // 获取特征值ID
					}
				});
			},

			// 获取特征值ID
			getCharacteId() {
				uni.getBLEDeviceCharacteristics({
					deviceId: this.deviceId,
					serviceId: this.services,
					success: (res) => {
						console.log(res);
						for (let i = 0; i < res.characteristics.length; i++) {
							const model = res.characteristics[i];
							if (model.properties.write) {
								this.sendMy(model.uuid);
							}
							if (model.properties.notify) {
								this.notifyUuid = model.uuid;
							}
						}
					}
				});
			},

			// 写入数据到蓝牙设备
			sendMy(buffer) {
				const buff = this.string2buffer('3a0a0b0c0d02423122');
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.services,
					characteristicId: buffer,
					value: buff,
					success: () => {
						console.log("写入成功");
						this.startNotice(); // 开始接收数据
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},

			// 启用通知功能，接收设备返回的数据
			startNotice() {
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: this.deviceId,
					serviceId: this.services,
					characteristicId: this.notifyUuid,
					success: () => {
						uni.onBLECharacteristicValueChange((res) => {
							const nonceId = this.ab2hex(res.value);
							console.log('返回数据:', nonceId);
						});
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},
			// 获取网球场大小
			getCourtSize() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.tennis-court').boundingClientRect(rect => {
					this.courtWidth = rect.width;
					this.courtHeight = rect.height;
					this.updateBallPositions();
				}).exec();
			},

			// 更新球的位置
			// updateBallPositions() {
			// 	const ballSize = 30; // 网球的宽度和高度（单位：px）
			// 	const numCols = 5; // 列数
			// 	const numRows = 4; // 行数

			// 	const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
			// 	const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距

			// 	this.balls = this.balls.map((ball, index) => {
			// 		const row = Math.floor(index / numCols);
			// 		const col = index % numCols;

			// 		const top = verticalPadding + row * (ballSize + verticalPadding);
			// 		const left = horizontalPadding + col * (ballSize + horizontalPadding);

			// 		return {
			// 			...ball,
			// 			top: `${top}px`,
			// 			left: `${left}px`,
			// 			width: `${ballSize}px`,
			// 			height: `${ballSize}px`,
			// 		};
			// 	});
			// },

			updateBallPositions() {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				const numCols = 5; // 列数
				const numRows = 4; // 行数

				// 确保 courtWidth 和 courtHeight 是网球场的实际宽度和高度
				const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
				const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距

				this.balls = this.balls.map((ball, index) => {
					const row = Math.floor(index / numCols);
					const col = index % numCols;

					const top = verticalPadding + row * (ballSize + verticalPadding);
					const left = horizontalPadding + col * (ballSize + horizontalPadding);

					return {
						...ball,
						top: `${top}px`,
						left: `${left}px`,
						width: `${ballSize}px`,
						height: `${ballSize}px`,
					};
				});
			},

			// // 将网球的初始位置设置为第三行第三列
			setInitialBallPosition() {
				const thirdRow = 2;
				const thirdCol = 2;

				// 设置第三行第三列网球的位置
				const initialBall = this.calculatePosition(thirdRow, thirdCol);

				// 只设置第一个网球的位置，其他网球保持默认
				this.balls[0] = {
					top: `${initialBall.top}px`,
					left: `${initialBall.left}px`,
					width: '30px',
					height: '30px',
				};

				// 更新其他球的位置
				this.updateBallPositions();
			},

			// 计算网球在网球场上的位置（基于4x5网格）
			// calculatePosition(row, col) {
			// 	const ballSize = 30; // 网球的宽度和高度（单位：px）
			// 	const numCols = 5; // 列数
			// 	const numRows = 4; // 行数

			// 	const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
			// 	const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距

			// 	const top = verticalPadding + row * (ballSize + verticalPadding);
			// 	const left = horizontalPadding + col * (ballSize + horizontalPadding);

			// 	return {
			// 		top,
			// 		left
			// 	};
			// },
			calculatePosition(row, col) {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				const numCols = 5; // 列数
				const numRows = 4; // 行数

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
						width: '30px',
						height: '30px',
					};
				}
				return {
					top: ball.top || '0px',
					left: ball.left || '0px',
					width: ball.width || '30px',
					height: ball.height || '30px',
				};
			},

			setBallCountAndPositions(mode) {
				// 定义模式配置
				const modeConfig = {
					0: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 定点练习
					1: {
						ballCount: 2,
						positions: [
							[1, 1],
							[2, 2]
						]
					}, // 交叉循环
					2: {
						ballCount: 2,
						positions: [
							[1, 1],
							[1, 2]
						]
					}, // 水平循环
					3: {
						ballCount: 2,
						positions: [
							[1, 1],
							[2, 1]
						]
					}, // 垂直循环
					4: {
						ballCount: 1,
						positions: [
							[1, 1]
						]
					}, // 截击练习
					5: {
						ballCount: 1,
						positions: [
							[1, 1]
						]
					}, // 高压练习
					6: {
						ballCount: 1,
						positions: [
							[1, 1]
						]
					}, // 全场随机
					7: {
						ballCount: 20,
						positions: [
							[1, 1],
							[1, 2],
							[1, 3],
							[1, 4],
							[1, 5],
							[2, 1],
							[2, 2],
							[2, 3],
							[2, 4],
							[2, 5],
							[3, 1],
							[3, 2],
							[3, 3],
							[3, 4],
							[3, 5],
							[4, 1],
							[4, 2],
							[4, 3],
							[4, 4],
							[4, 5]
						]
					}, // 编程练习
					8: {
						ballCount: 1,
						positions: [
							[1, 1]
						]
					}, // 入门练习
					9: {
						ballCount: 1,
						positions: [
							[1, 1]
						]
					}, // 月亮球
				};

				// 获取模式的球数和位置
				const config = modeConfig[mode] || {
					ballCount: 1,
					positions: [
						[1, 1]
					]
				};
				const {
					ballCount,
					positions
				} = config;

				// 设置球的数量和初始位置
				this.balls = positions.map(([row, col]) => {
					const position = this.calculatePosition(row, col);
					return {
						top: `${position.top}px`,
						left: `${position.left}px`,
						width: '30px',
						height: '30px',
					};
				});

				// 更新球的位置
				this.updateBallPositions();
			},

			// 计算网球在网球场上的位置（基于4x5网格）
			calculatePosition(row, col) {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				const numCols = 5; // 列数
				const numRows = 4; // 行数

				// 确保 courtWidth 和 courtHeight 是网球场的实际宽度和高度
				const horizontalPadding = (this.courtWidth - numCols * ballSize) / (numCols + 1); // 横向边距
				const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1); // 纵向边距
				console.log('horizontalPadding,verticalPadding', horizontalPadding, verticalPadding)

				const top = verticalPadding + row * (ballSize + verticalPadding);
				const left = horizontalPadding + col * (ballSize + horizontalPadding);
				console.log('top,left', top, left)

				return {
					top,
					left
				};
			},


			// 更新球的位置
			updateBallPositions() {
				// 具体实现更新球的位置
			},


			// setBallCount(mode) {
			// 	const modeBallCounts = {
			// 		0: 1, // 定点练习
			// 		1: 2, // 交叉循环
			// 		2: 2, // 水平循环
			// 		3: 2, // 垂直循环
			// 		4: 1, // 截击练习
			// 		5: 1, // 高压练习
			// 		6: 1, // 全场随机
			// 		7: 20, // 编程练习
			// 		8: 1, // 入门练习
			// 		9: 1, // 月亮球
			// 	};

			// 	// 根据模式设置网球的个数
			// 	const ballCount = modeBallCounts[mode] || 1;

			// 	this.balls = Array.from({
			// 		length: ballCount
			// 	}, () => ({
			// 		top: '0px',
			// 		left: '0px',
			// 		width: '30px',
			// 		height: '30px',
			// 	}));

			// 	// 更新球的位置
			// 	this.updateBallPositions();
			// },

			// setDefaultPositions(mode) {
			// 	const modeDefaultPositions = {
			// 		0: [
			// 			[2, 2]
			// 		], // 定点练习
			// 		1: [
			// 			[1, 1],
			// 			[2, 2]
			// 		], // 交叉循环
			// 		2: [
			// 			[1, 1],
			// 			[1, 2]
			// 		], // 水平循环
			// 		3: [
			// 			[1, 1],
			// 			[2, 1]
			// 		], // 垂直循环
			// 		4: [
			// 			[1, 1]
			// 		], // 截击练习
			// 		5: [
			// 			[1, 1]
			// 		], // 高压练习
			// 		6: [
			// 			[1, 1]
			// 		], // 全场随机
			// 		7: [
			// 			[1, 1],
			// 			[1, 2],
			// 			[1, 3],
			// 			[1, 4],
			// 			[1, 5], // 第一行
			// 			[2, 1],
			// 			[2, 2],
			// 			[2, 3],
			// 			[2, 4],
			// 			[2, 5], // 第二行
			// 			[3, 1],
			// 			[3, 2],
			// 			[3, 3],
			// 			[3, 4],
			// 			[3, 5], // 第三行
			// 			[4, 1],
			// 			[4, 2],
			// 			[4, 3],
			// 			[4, 4],
			// 			[4, 5] // 第四行
			// 		], // 编程练习

			// 		8: [
			// 			[1, 1]
			// 		], // 入门练习
			// 		9: [
			// 			[1, 1]
			// 		], // 月亮球
			// 	};

			// 	// 设置默认位置
			// 	const defaultPositions = modeDefaultPositions[mode] || [
			// 		[1, 1]
			// 	];

			// 	// 根据默认位置更新网球的坐标
			// 	this.balls = defaultPositions.map(([row, col]) => {
			// 		const position = this.calculatePosition(row, col);
			// 		return {
			// 			top: `${position.top}px`,
			// 			left: `${position.left}px`,
			// 			width: '30px',
			// 			height: '30px'
			// 		};
			// 	});

			// 	// 更新球的位置
			// 	this.updateBallPositions();
			// },
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
				this.showBallNumbers = (this.selectedMode === 7); // 编程练习显示数字
				this.toggleDirectionButtons(this.selectedMode); // 控制方向按钮显示
				this.toggleAngleControl(this.selectedMode); // 控制角度调整显示
				this.toggleHeightSelector(this.selectedMode); // 控制发球高度选择功能
				this.showInputWithClear = (this.selectedMode === 7); // 编程练习模式下的输入框

				// 根据模式设置网球个数及默认位置
				this.setBallCountAndPositions(this.selectedMode);
			},

			toggleDirectionButtons(selectedMode) {
				// 定义一个对象来映射每个模式的上下移动和左右移动状态
				const modeSettings = {
					0: {
						upDown: true,
						leftRight: true
					}, // 定点练习
					1: {
						upDown: false,
						leftRight: false
					}, // 交叉循环
					2: {
						upDown: false,
						leftRight: true
					}, // 水平循环
					3: {
						upDown: true,
						leftRight: false
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
				};

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
			clearInput() {
				this.inputData = '';
				// this.inputData = '请按顺序点击网球'; // 清空输入框内容
			},

			// 选择发球高度
			selectHeight(height) {
				this.selectedHeight = height;
			},
			updateParametersForMode(modeIndex) {
				// 定义每个模式的默认参数
				const modeParams = [{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 定点练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 交叉循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 水平循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 垂直循环
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 截击练习
					{
						frequency: 7,
						speed: 50,
						rotate: 0
					}, // 高压练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 全场随机
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					}, // 编程练习
					{
						frequency: 7,
						speed: 20,
						rotate: 0
					}, // 入门练习
					{
						frequency: 7,
						speed: 80,
						rotate: 0
					} // 月亮球
				];

				// 获取所选模式的参数，如果模式索引超出范围，则使用初始参数
				const params = modeParams[modeIndex] || this.initialParams;

				// 更新参数值
				this.frequency = params.frequency;
				this.speed = params.speed;
				this.rotate = params.rotate;

				// 重置球的位置
				this.resetBallPosition();
			},

			moveBall(direction) {
				const step = 1; // 每次移动一个格子
				if (direction === 'up') {
					this.ballPosition.y = Math.max(0, this.ballPosition.y - step);
				} else if (direction === 'down') {
					this.ballPosition.y = Math.min(5, this.ballPosition.y + step);
				} else if (direction === 'left') {
					this.ballPosition.x = Math.max(0, this.ballPosition.x - step);
				} else if (direction === 'right') {
					this.ballPosition.x = Math.min(5, this.ballPosition.x + step);
				}
				this.sendTrainingParams(); // 发送更新后的球位置
			},
			startTraining() {
				if (!this.trainingActive) {
					// 开始训练
					console.log(JSON.stringify({
						mode: this.modeNames[this.selectedMode],
						ballPosition: this.ballPosition,
						frequency: this.frequency,
						speed: this.speed,
						rotate: this.rotate
					}));
					this.trainingActive = true;
					this.buttonText = this.translations.endTraining[this.currentLanguage];
					this.buttonColor = '#ff6347'; // 训练中按钮颜色
					this.modeSelectable = false; // 禁用模式选择
					this.sendTrainingParams(); // 发送初始参数
				} else {
					// 结束训练
					console.log('Ending training');
					this.trainingActive = false;
					this.buttonText = this.translations.startTraining[this.currentLanguage];
					this.buttonColor = '#87ceeb'; // 结束训练按钮颜色
					this.resetToInitialValues(); // 恢复初始值
					this.modeSelectable = true; // 启用模式选择
					this.sendTrainingParams(); // 发送结束参数
				}
			},
			sendTrainingParams() {
				if (this.trainingActive) {
					console.log(JSON.stringify({
						mode: this.modeNames[this.selectedMode],
						ballPosition: this.ballPosition,
						frequency: this.frequency,
						speed: this.speed,
						rotate: this.rotate
					}));
				}
			},
			resetToInitialValues() {
				this.frequency = this.initialParams.frequency;
				this.speed = this.initialParams.speed;
				this.rotate = this.initialParams.rotate;
				this.ballPosition = {
					...this.initialBallPosition
				};
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
			}
		},
		mounted() {
			this.updateParametersForMode(this.selectedMode);
			this.getCourtSize();
			this.setInitialBallPosition();
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
		text-align: center;
		line-height: 30px;
		color: #fff;
		font-size: 14px;
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