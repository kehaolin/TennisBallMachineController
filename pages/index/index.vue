(){
<template>

	<!-- 隐私协议弹窗 -->
	<view v-if="showPrivacyModal" class="privacy-modal">
		<view class="privacy-content">
			<text class="privacy-title">用户隐私协议</text>
			<text class="privacy-text">
				请阅读并同意我们的
				<text @click="openPrivacyPolicy" class="privacy-link">用户隐私协议</text>
				后继续使用本软件。
			</text>

			<view class="privacy-checkbox">
				<checkbox-group @change="togglePrivacyCheck" class="checkbox-style">
					<checkbox value="agree" :checked="privacyChecked">我已阅读并同意</checkbox>
				</checkbox-group>
			</view>

			<button :disabled="!privacyChecked" @click="acceptPrivacyPolicy" class="confirm-button">确认</button>
		</view>
	</view>

	<view class="container">
		<!-- 顶部占位区域 -->
		<view
			:style="{ height: statusBarHeight + 'px', backgroundColor: 'linear-gradient(180deg, rgba(206, 230, 249, 1) 0%, rgba(196, 230, 255, 1) 100%)' }">
		</view>
		<!-- 第一层: 蓝牙功能，电量显示 -->
		<HeaderSection :statusBarHeight="statusBarHeight" :batteryLevel="batteryLevel"
			:isAnyDeviceConnected="isAnyDeviceConnected" :selectedLauncherPosition="selectedLauncherPosition"
			:currentLanguage="currentLanguage" :translations="translations" :images="images"
			@openBluetoothPopup="openBluetoothPopup" @selectLauncherPosition="selectLauncherPosition" />

		<view>
			<!-- 在父组件中监听子组件的事件 -->
			<BluetoothPopup :showBluetoothPopup="showBluetoothPopup" :bluetoothDevices="bluetoothDevices"
				:isAnyDeviceConnected="isAnyDeviceConnected" :translations="translations" :images="images"
				:currentLanguage="currentLanguage" @closeBluetoothPopup="closeBluetoothPopup" @bindDevice="bindDevice"
				@unbindDevice="unbindDevice" @completeBluetoothConnection="completeBluetoothConnection" />
		</view>

		<!-- 第二层: 网球场和网球图片 -->
		<TennisCourt :images="images" :balls="balls" :launcherTop="launcherTop" :showBallNumbers="showBallNumbers"
			:selectedLauncherPosition="selectedLauncherPosition" @ball-interacted="handleBallInteraction" />


		<!-- 自定义模式选择弹窗 -->
		<ModePickerModal :showModal="showModePickerModal" :modeNames="modeNames" :translations="translations"
			:currentLanguage="currentLanguage" :temporarySelectedMode="temporarySelectedMode"
			@closeModal="closeModePicker" @setTemporaryMode="setTemporaryMode" />

		<!-- 模式配置区 -->
		<ModeConfig :selectedMode="selectedMode" :selectedDifficulty="selectedDifficulty" :realHeight="realHeight"
			:selectedHeight="selectedHeight" :selectedBall="selectedBall" :inputData="inputData"
			:selectedBalls="selectedBalls" :serveHeight="serveHeight" :isHeightRandom="isHeightRandom"
			:showInputWithClear="showInputWithClear" :showHeightControl="showHeightControl"
			:showDirectionButtons="showDirectionButtons" :showHeightSelector="showHeightSelector"
			:upDownButtonsDisabled="upDownButtonsDisabled" :leftRightButtonsDisabled="leftRightButtonsDisabled"
			:translations="translations" :currentLanguage="currentLanguage" :modeNames="modeNames" :images="images"
			:trainingActive="trainingActive" :buttonColor="buttonColor" :startButtonStyle="startButtonStyle"
			@showModePicker="showModePicker" @selectDifficulty="selectDifficulty" @selectHeight="selectHeight"
			@selectBall="selectBall" @toggleHeightRandom="toggleHeightRandom" @clearInputData="clearInputData"
			@adjustHeight="adjustHeight" @handleDirectionKey="handleDirectionKey" @startTraining="startTraining" />

		<!-- 参数滑动区 -->
		<!-- <ModeSlider :selectedMode="selectedMode" :translations="translations" :currentLanguage="currentLanguage"
			:frequency="frequency" :speed="speed" :rotate="rotate" :isFrequencyRandom="isFrequencyRandom"
			:isSpeedRandom="isSpeedRandom" :isRotateRandom="isRotateRandom" @update:frequency="updateFrequency"
			@change:frequency="changeFrequency" @toggleFrequencyRandom="toggleFrequencyRandom"
			@handleSpeedChange="handleSpeedChange" @update:speed="updateSpeed" @change:speed="changeSpeed"
			@toggleSpeedRandom="toggleSpeedRandom" @update:rotate="updateRotate" @change:rotate="changeRotate"
			@toggleRotateRandom="toggleRotateRandom" /> -->

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
						<text class="param-value">{{ speed + ' km/h' }}</text>
					</view>
					<slider class="custom-slider" :value="speed" :min="minRealSpeed" :max="maxRealSpeed" block-size="16"
						activeColor="rgba(95, 186, 232, 1)" backgroundColor="background: rgba(240, 242, 251, 1);"
						:disabled="(isSpeedRandom && selectedMode === 8) || selectedMode === 0"
						@changing="handleSpeedChanging" @change="handleSpeedChange"
						:style="{ opacity: (isSpeedRandom && selectedMode === 8) || selectedMode === 0 ? 0.5 : 1 }" />
					<view class="range-label">
						<text>{{minRealSpeed}}</text>
						<text>{{maxRealSpeed}}</text>
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
						<view v-if="selectedMode === 8" class="rotate-slider switch-container"
							style="margin-left: 10px;">
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
	</view>
</template>

<script>
	import baselineParameters from './js/baselineParameterLookupTable.js';
	import midlineParameters from './js/midlineParameterLookupTable.js';
	import midcourtParameters from './js/midcourtParameterLookupTable.js';
	import HeaderSection from '../../components/HeaderSection.vue';
	import TennisCourt from '../../components/TennisCourt/TennisCourt.vue';
	import ModeSlider from '../../components/ModeSlider.vue';
	import images from '../../static/images.json';



	export default {
		components: {
			HeaderSection,
			ModeSlider,
			TennisCourt
			// BluetoothPopup,
			// CourtSection,
			// ModeConfigSection,
		},
		data() {
			return {
				showPrivacyModal: false,
				privacyChecked: false,
				minRealSpeed: 20,
				maxRealSpeed: 120,
				realHeight: null,
				images: {},
				tableMapping: {
					Baseline: baselineParameters.baselineParameters,
					Midline: midlineParameters.midlineParameters,
					Midcourt: midcourtParameters.midcourtParameters
				},
				statusBarHeight: 48,
				startButtonStyle: [{
						width: '21.3vw', // 第一个按钮的宽度
						height: '17.8vh', // 第一个按钮的高度
						opacity: 1,
						borderRadius: '9.17px',
					},
					{
						width: '86.6vw', // 第二个按钮的宽度
						height: '6.1vh', // 第二个按钮的高度
						opacity: 1,
						borderRadius: '9.17px',
					}
				],
				deviceId: '',
				serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
				TX_UUID: '49535343-8841-43F4-A8D4-ECBE34729BB3', // 接收指令UUID
				RX_UUID: '49535343-1E4D-4BD9-BA61-23C647249616', // 发送指令UUID
				currentDevice: '',
				connectedDeviceId: '',
				isManualDisconnect: false, // 标记是否是主动断开
				reconnecting: false,
				pendingCommand: '',
				batteryLevel: 100,
				batteryTimer: null, // 定时器引用
				showModePickerModal: false, // 控制弹窗显示
				temporarySelectedMode: 0, // 临时选中的模式，在点击"Complete"前记录
				showBluetoothPopup: false, // 控制弹窗显示
				bluetoothDevices: [], // 模拟的蓝牙设备列表
				isAnyDeviceConnected: false,
				bluetoothName: '',
				currentLanguage: 'zh',
				courtSizes: [{
						type: 'singles',
						length: 23.77,
						width: 8.23
					}, // 单打场地
					{
						type: 'doubles',
						length: 23.77,
						width: 10.97
					} // 双打场地
				],
				cannonX: 0,
				cannonY: 0,
				selectedCourtType: 'doubles', // 默认选择单打场地
				launcherPositions: ['底线', '中线', '中场'],
				selectedLauncherPosition: 'Baseline', // 默认选择
				isPickerVisible: false,
				isFrequencyRandom: true,
				isRotateRandom: true,
				isHeightRandom: true,
				showDirectionButtons: false, // 控制方向按钮的显示与隐藏
				upDownButtonsDisabled: true, // 控制上下方向按钮的禁用状态
				leftRightButtonsDisabled: true, // 控制左右方向按钮的禁用状态
				showHeightControl: false, // 控制高调整功能的显示与隐藏
				showHeightSelector: false, // 控制发球高度选择功能的显示与隐藏
				showInputWithClear: false, // 控制输入框和清除按钮的显示与隐藏
				inputData: '', // 输入框显示的数据
				selectedDifficulty: '1.0',
				angle: 30, // 初始角度				
				heights: 30,
				serveHeight: 5,
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
				// 训练参数
				Hmin: 1, // 最低高度
				Hmax: 10, // 最大高度
				Vmin: 20, // 最小速度
				Vmax: 120, // 最大速度
				AngleVmin: 10, // 最小仰角
				AngleVMax: 45, // 最大仰角
				AngleHmin: -45, // 最小水平角
				AngleHMax: 45, // 最大水平角
				ballIndices: [], // 存储转换后的球位置
				tennisMachineIndices: {}, // 存储网球机器的索引分段
				launcherPosition: {
					x0: 0, // 大炮旋转中心的 x 坐标，您可以设置默认值
					y0: 0, // 大炮旋转中心的 y 坐标
					z0: 1, // 大炮旋转中心的 z 坐标
					r: 0.5 // 炮口与旋转中心的距离，单位：米
				}, // 存储发射机位置
				gridConfig: {
					version1: {
						rows: 7, // 版本1行数
						cols: 5 // 版本1列数
					},
					version2: {
						rows: 6, // 版本2行数
						cols: 4 // 版本2列数
					}
				},
				BluetoothList: [], // 存储发现的蓝牙设备
				showActionSheet: false, // 控制弹窗显示
				buttonText: '开始训练',
				buttonColor: 'rgba(95, 186, 232, 1)', // 默认颜色
				modeSelectable: true,
				translations: {
					Toast: {
						zh: {
							endTrainingFirst: '请先结束当前训练',
							bluetoothInitFailed: '蓝牙初始化失败，请打开蓝牙后重试',
							bluetoothDisconnectedReconnecting: '蓝牙连接已断开，正在尝试重连',
							bluetoothSearchFailed: '蓝牙设备搜索失败，请重试',
							bluetoothConnectSuccess: '蓝牙连接成功',
							bluetoothConnectFailed: '蓝牙连接失败',
							bluetoothConnectFailedRange: '蓝牙连接失败，请确保设备在范围内',
							bluetoothReconnectSuccess: '蓝牙重连成功',
							bluetoothReconnectFailed: '蓝牙重连失败，请检查设备',
							bluetoothSendDataFailed: '蓝牙数据发送失败',
							enableReceiveNotifyFailed: '启用接收通知失败',
							stopSearchBluetoothFailed: '停止搜索蓝牙设备失败',
							noDeviceConnected: '未连接设备',
							bluetoothDisconnectFailed: '蓝牙断开连接失败',
							endTrainingFirstAgain: '请先结束训练',
							chooseTennisBallFirst: '请先选择网球',
							connectBluetoothFirst: '请先连接蓝牙',
							bluetoothOff: '蓝牙已关闭，请重新打开'
						},
						en: {
							endTrainingFirst: 'Please end the current training first',
							bluetoothInitFailed: 'Bluetooth initialization failed, please turn on Bluetooth and try again',
							bluetoothDisconnectedReconnecting: 'Bluetooth connection lost, reconnecting...',
							bluetoothSearchFailed: 'Bluetooth device search failed, please try again',
							bluetoothConnectSuccess: 'Bluetooth connected successfully',
							bluetoothConnectFailed: 'Bluetooth connection failed',
							bluetoothConnectFailedRange: 'Bluetooth connection failed, please ensure the device is in range',
							bluetoothReconnectSuccess: 'Bluetooth reconnected successfully',
							bluetoothReconnectFailed: 'Bluetooth reconnection failed, please check the device',
							bluetoothSendDataFailed: 'Bluetooth data sending failed',
							bluetoothOff: 'Bluetooth is off, please turn it on',
							enableReceiveNotifyFailed: 'Failed to enable receive notifications',
							stopSearchBluetoothFailed: 'Failed to stop Bluetooth device search',
							noDeviceConnected: 'No device connected',
							bluetoothDisconnectFailed: 'Bluetooth disconnection failed',
							endTrainingFirstAgain: 'Please end the training first',
							chooseTennisBallFirst: 'chooseTennisBallFirst',
							connectBluetoothFirst: 'Please connect Bluetooth first'
						}
					},
					meter: {
						zh: '米',
						en: 'm'
					},
					Baseline: {
						zh: '底线',
						en: 'Baseline'
					},
					Midline: {
						zh: '中线',
						en: 'Midline'
					},
					Midcourt: {
						zh: '中场',
						en: 'Midcourt'
					},
					selectMode: {
						zh: '选择模式',
						en: 'Select Mode'
					},
					cancel: {
						zh: '取消',
						en: 'Cancel'
					},
					complete: {
						zh: '完成',
						en: 'Complete'
					},
					bluetoothConnectivity: {
						zh: '蓝牙设备连接',
						en: 'Bluetooth  Connectivity'
					},
					searching: {
						zh: '设备搜索中...',
						en: 'searching devices...'
					},
					bind: {
						zh: '绑定',
						en: 'Bind'
					},
					unbind: {
						zh: '解绑',
						en: 'Unbind'
					},
					connected: {
						zh: '已连接',
						en: 'connected'
					},
					disconnected: {
						zh: '未连接',
						en: 'disconnected'
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
					selectedDifficulty: {
						'en': 'Difficulty',
						'zh': '难度',
					},
					heights: {
						zh: '高度',
						en: 'heights'
					},
					selectedHeight: {
						zh: '高度',
						en: 'Height'
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
					heightOptions: {
						'低': {
							zh: '低',
							en: 'Low'
						},
						'中': {
							zh: '中',
							en: 'Medium'
						},
						'高': {
							zh: '高',
							en: 'High'
						}
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
					},
					ball1: {
						zh: '球1',
						en: 'Ball 1'
					},
					ball2: {
						zh: '球2',
						en: 'Ball 2'
					},
					selectServingOrder: {
						zh: '请选择发球顺序',
						en: 'Please Select Serving Order'
					},
					random: {
						zh: '随机',
						en: 'Random'
					}
				},
				modes: [{
						zh: '初学者练习',
						en: 'Beginner Practice'
					},
					{
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
						zh: '高压练习',
						en: 'High Pressure Practice'
					},
					{
						zh: '截击练习',
						en: 'Smash Practice'
					},
					{
						zh: '月亮球',
						en: 'Moon Ball'
					},
					{
						zh: '全场随机',
						en: 'Full Court Random'
					},
					{
						zh: '编程练习',
						en: 'Program Practice'
					},
				],
				modeConfig: {
					0: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 初学者练习
					1: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 定点练习
					2: {
						ballCount: 2,
						positions: [
							[2, 2],
							[3, 3]
						]
					}, // 交叉循环
					3: {
						ballCount: 2,
						positions: [
							[2, 0],
							[2, 4]
						]
					}, // 水平循环
					4: {
						ballCount: 2,
						positions: [
							[0, 2],
							[3, 2]
						]
					}, // 垂直循环
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
					}, // 截击练习
					7: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 月亮球
					8: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 全场随机
					9: {
						ballCount: 35,
						positions: [
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
					} // 编程练习
				},
				modeParams: [
					// 初学者练习
					[{
						frequency: 3,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 定点练习
					[{
						frequency: 1,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 交叉循环
					[{
							frequency: 5,
							speed: 20,
							rotate: 0,
							heights: '',
							serveHeight: 5
						},
						{
							frequency: 2,
							speed: 60,
							rotate: 0,
							heights: '',
							serveHeight: 5
						}
					],
					// 水平循环
					[{
							frequency: 2,
							speed: 50,
							rotate: 0,
							heights: '',
							serveHeight: 5
						},
						{
							frequency: 2,
							speed: 50,
							rotate: 0,
							heights: '',
							serveHeight: 5
						}
					],
					// 垂直循环
					[{
							frequency: 2,
							speed: 50,
							rotate: 0,
							heights: '',
							serveHeight: 5
						},
						{
							frequency: 2,
							speed: 50,
							rotate: 0,
							heights: '',
							serveHeight: 5
						}
					],
					// 截击练习
					[{
						frequency: 1,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 高压练习
					[{
						frequency: 1,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 月亮球
					[{
						frequency: 1,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 全场随机
					[{
						frequency: 1,
						speed: 50,
						rotate: 0,
						heights: '',
						serveHeight: 5
					}],
					// 编程练习
					[
						...Array(35).fill({
							frequency: 6, // 默认发球频率
							speed: 80, // 默认发球速度
							rotate: 0, // 默认旋转
							heights: '', // 默认高度信息
							serveHeight: 5 // 默认发球高度
						})
					]
				],
				machineConfigs: {},
				modeSettings: {
					0: {
						upDown: false,
						leftRight: false
					}, // 练习
					1: {
						upDown: true,
						leftRight: true
					}, // 定点练习
					2: {
						upDown: true,
						leftRight: true
					}, // 交叉循环
					3: {
						upDown: true,
						leftRight: true
					}, // 水平循环
					4: {
						upDown: true,
						leftRight: true
					}, // 垂直循环
					5: {
						upDown: true,
						leftRight: true
					}, // 高压练习
					6: {
						upDown: true,
						leftRight: true
					}, // 截击练习
					7: {
						upDown: true,
						leftRight: true
					}, // 月亮球
					8: {
						upDown: false,
						leftRight: false
					}, // 全场随机
					9: {
						upDown: false,
						leftRight: false
					} // 编程练习
				},
				selectedMode: 0,
				frequency: 5,
				speed: 50,
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
				initialParams: [{
					frequency: 3,
					speed: 50,
					rotate: 0,
					heights: '',
					serveHeight: 2 // 初学者练习，发球角度较低，适合新手
				}, {
					frequency: 5,
					speed: 60,
					rotate: 0,
					heights: '',
					serveHeight: 3 // 定点练习，发球高度适中，便于控制
				}, {
					frequency: 5,
					speed: 20,
					rotate: 1,
					heights: '中',
					serveHeight: 4 // 交叉循环，适当增加发球高度，增加挑战
				}, {
					frequency: 7,
					speed: 80,
					rotate: 0,
					heights: '',
					serveHeight: 5 // 水平循环，发球高度适中，适合节奏训练
				}, {
					frequency: 8,
					speed: 70,
					rotate: -1,
					heights: '中',
					serveHeight: 6 // 垂直循环，增加上下移动训练的难度
				}, {
					frequency: 9,
					speed: 130,
					rotate: 2,
					heights: '',
					serveHeight: 7 // 高压练习，适度增加发球高度以提高压力感
				}, {
					frequency: 7,
					speed: 100,
					rotate: 0,
					heights: '',
					serveHeight: 5 // 截击练习，发球高度适中，便于快速反应
				}, {
					frequency: 6,
					speed: 70,
					rotate: -3,
					heights: '',
					serveHeight: 4 // 月亮球，发球高度适中，适应高弧度球
				}, {
					frequency: 6,
					speed: 100,
					rotate: 0,
					heights: '中',
					serveHeight: 6 // 全场随机，适度发球高度，增加变化
				}, {
					frequency: 7,
					speed: 50,
					rotate: 0,
					heights: '',
					serveHeight: 5 // 编程练习，发球高度适中，用户可自行调整
				}],
				initialBallPosition: {
					x: 2,
					y: 2
				},
				defaultParams: {
					horizontalAngle: 0, // 默认水平角度
					verticalAngle: 0, // 默认仰角
					speed: 50, // 默认发球速度
					rotation: 0, // 默认旋转程度（0表示无旋转）
					frequency: 5 // 默认发球间隔（1-10秒）
				},
				currentParams: {}, // 初始化当前参数为空对象
				launcherTop: '-1.29vh', // 初始值为顶部
				x0: 0,
				y0: 0,
				z0: 0,
				r: 0,
				z1: 0,
				command: '',
				device: {}
			};
		},
		computed: {
			modeNames() {
				return this.modes.map(mode => mode[this.currentLanguage]);
			},
		},
		watch: {
			selectedBall(newValue) {
				this.updateButtonStates(); // 选中的球发生变化时更新按钮状态
			},
			selectedMode(newValue) {
				this.updateButtonStates(); // 选中的模式发生变化时更新按钮状态
			}
		},
		methods: {
			// 勾选复选框时触发的事件
			togglePrivacyCheck(event) {
				console.log('event', event)
				this.privacyChecked = event.detail.value.length > 0; // 更新复选框状态
			},
			// 用户点击 "我已阅读并同意" 后
			acceptPrivacyPolicy() {
				console.log('点击了确认')
				this.showPrivacyModal = false; // 隐藏弹窗
				uni.setStorageSync('privacyAccepted', true); // 记录用户同意隐私协议
			},
			// 用户点击隐私协议链接时，打开 WebView 页面
			openPrivacyPolicy() {
				const url = 'https://www.baidu.com'; // 临时使用百度链接
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + encodeURIComponent(url) // 传递 URL 参数
				});
			},
			selectDifficulty(difficulty) {
				if (this.trainingActive) {
					uni.showToast({
						title: this.getTranslation('endTrainingFirst'), // 使用国际化的提示文字
						icon: 'none',
						duration: 1000
					});
					return
				}
				this.selectedDifficulty = difficulty; // 更新选中的难度
				this.updateParametersForMode(this.selectedMode)
				this.generateDefaultBallCommand()
				this.modifyMachineConfigs('updateDifficulty')
			},

			async selectLauncherPosition(position) {
				if (this.trainingActive) {
					uni.showToast({
						title: this.getTranslation('endTrainingFirst'),
						icon: 'none',
						duration: 1000
					});
					return
				}

				// 原有逻辑：更新发射器位置的显示
				if (position === 'Baseline') {
					this.launcherTop = '-1.29vh'; // 定位到 tennis-court1 顶部
				} else if (position === 'Midline') {
					this.launcherTop = 'calc(50% - 16px)'; // 定位到 tennis-court1 中间，调整为中心对齐
				} else if (position === 'Midcourt') {
					this.launcherTop = 'calc(100% - 32px)'; // 定位到 tennis-court1 底部
				}
				this.selectedLauncherPosition = position;

				if (this.selectedMode === 9) {
					this.clearInputData()
				}

				// 调用计算发射器位置的方法
				this.calculateLauncherPosition();
				// this.updateBallPositions(this.selectedMode);
				this.resetToInitialValues();
				await this.modifyMachineConfigs('updateLauncherPosition')
			},

			/**
			 * 根据网球位置生成网球机器参数
			 * @param {Array} positions 当前模式的球位置数组，例如 [[2, 2], [3, 4]]
			 * @returns {Array} 包含速度和高度索引的对象数组
			 */
			generateMachineParams(positions) {
				// 假设三个发射器位置对应的表格数据
				const tableMapping = this.tableMapping

				// 根据选定的发射器位置获取表格
				const selectedTable = tableMapping[this.selectedLauncherPosition];

				if (!selectedTable) {
					console.error("未找到对应的发射器位置表格。");
					return [];
				}

				// 遍历位置并生成对应的参数
				return positions.map(([row, col]) => {
					const linearIndex = row * 5 + col; // 计算线性索引

					// 检查表格数据是否有效
					if (!selectedTable[linearIndex] || selectedTable[linearIndex].length === 0) {
						return {
							position: [row, col],
							speedIndices: [], // 无效数据，返回空索引
							heightIndices: []
						};
					}

					const totalLength = selectedTable[linearIndex].length;

					// 生成速度和高度索引
					const speedIndices = this.calculateIndices(totalLength, 100); // 分成 100 份
					const heightIndices = this.calculateIndices(totalLength, 10); // 分成 10 份

					return {
						position: [row, col],
						speedIndices,
						heightIndices
					};
				});
			},

			/**
			 * 计算分段索引
			 * @param {Number} totalLength 数据的总长度
			 * @param {Number} divisions 分段数
			 * @returns {Array} 索引列表
			 */
			calculateIndices(totalLength, divisions) {
				const step = totalLength / divisions; // 每份的步长
				return Array.from({
						length: divisions
					}, (_, i) =>
					Math.min(Math.round(i * step), totalLength - 1) // 确保索引不超过最大值
				);
			},

			updateBallPositions(mode) {
				let modeConfig = this.modeConfig;
				// 获取当前模式的球数和初始位置
				const config = modeConfig[mode] || {
					ballCount: 1,
					positions: [
						[2, 2]
					]
				};
				const {
					positions
				} = config;

				// 调用生成网球机器参数的方法
				this.tennisMachineIndices = this.generateMachineParams(positions);

				const ballSize = 6.29; // 自适应的球大小，以 vw 为单位

				// 更新每个球的信息
				this.balls = positions.map(([row, col], index) => {
					// 检查当前球是否可以显示
					const canDisplay = this.canMoveOrDisplayBall([row, col]);

					// 获取查表内容
					const machineParams = this.tennisMachineIndices[index] || {
						speedIndices: [],
						heightIndices: []
					};

					const position = this.calculatePosition(row, col);

					return {
						ballIndex: [row, col], // 默认的球位置 [row, col]
						width: canDisplay ? `${ballSize}vw` : '0vw', // 显示与否
						height: canDisplay ? `${ballSize}vw` : '0vw', // 显示与否
						top: canDisplay ? `${position.top}px` : '0px', // 保持布局
						left: canDisplay ? `${position.left}px` : '0px', // 保持布局
						color: mode === 9 ? 'gray' : 'yellow', // 模式9下为灰色，其他模式为黄色
						canDisplay, // 标记该球是否可显示
						// 绑定查表内容
						speedIndices: machineParams.speedIndices,
						heightIndices: machineParams.heightIndices
					};
				});

				// 如果是模式9，确保有35个球
				if (mode === 9) {
					while (this.balls.length < 35) {
						this.balls.push({
							ballIndex: [0, 0], // 默认网格位置 [0, 0]
							width: `${ballSize}vw`, // 使用自适应宽度
							height: `${ballSize}vw`, // 使用自适应高度
							top: '0px',
							left: '0px',
							color: 'gray', // 模式9下为灰色
							speedIndices: [], // 默认空的速度索引
							heightIndices: [] // 默认空的高度索引
						});
					}
				}

				// 初始化球的颜色状态为灰色
				this.ballColors = new Array(this.balls.length).fill('gray');

				// 获取网球场图片的顶部偏移量
				uni.createSelectorQuery().in(this)
					.select('.tennis-court2') // 选择类名为 .tennis-court2 的元素
					.boundingClientRect(data => {
						if (data) {
							const courtTopOffset = data.top; // 获取图片顶部的偏移量

							// 更新每个球的位置
							this.balls = this.balls.map((ball, index) => {
								const [row, col] = positions[index];
								const position = this.calculatePosition(row, col,
									courtTopOffset); // 传入 courtTopOffset
								return {
									...ball,
									top: `${position.top}px`,
									left: `${position.left}px`
								};
							});
						} else {
							console.error("未找到网球场图片");
						}
					})
					.exec();

			},

			openBluetoothPopup() {
				this.showBluetoothPopup = true;
				this.openBluetoothAdapter();
			},
			// 关闭蓝牙弹窗
			closeBluetoothPopup() {
				this.showBluetoothPopup = false;
			},

			//初始化蓝牙
			openBluetoothAdapter() {
				// 如果当前已连接设备，则不再执行蓝牙初始化
				if (this.connectedDeviceId) {
					console.log('设备已连接，跳过蓝牙初始化');
					return;
				}
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('蓝牙模块初始化成功', res);
						this.checkBluetoothState();
						this.setupBluetoothListeners();
					},
					fail: (err) => {
						console.log('蓝牙模块初始化失败', err);
						uni.showToast({
							title: this.getTranslation('bluetoothInitFailed'), // 使用国际化的提示文字
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			// 设置蓝牙状态变化和设备连接状态的监听
			setupBluetoothListeners() {
				// 蓝牙适配器状态变化监听
				uni.onBluetoothAdapterStateChange((res) => {
					if (!res.available) {
						console.log('蓝牙适配器不可用');
						uni.showToast({
							title: this.getTranslation('bluetoothOff'),
							icon: 'none',
							duration: 2000
						});
						this.disconnectDevice(); // 如果蓝牙关闭，自动断开设备
					}
				});

				// 设备连接状态变化监听
				uni.onBLEConnectionStateChange((res) => {

					// 如果是主动断开，则不做重连
					if (this.isManualDisconnect) {
						console.log('主动断开，跳过重连');
						return;
					}

					// 如果设备已断开，尝试重连
					if (!res.connected) {
						console.log('蓝牙设备已断开');
						uni.showToast({
							title: this.getTranslation(
								'bluetoothDisconnectedReconnecting'), // 使用国际化的提示文本
							icon: 'none',
							duration: 2000 // 可选：可以设置持续时间为2000ms（2秒），避免提示框太短时间消失
						});
						this.reconnectDevice(res.deviceId); // 断开时自动重连
					}
				});
			},


			//检查蓝牙状态
			checkBluetoothState() {
				uni.getBluetoothAdapterState({
					success: (res) => {
						if (res.available) {
							console.log('蓝牙模块可用');
							this.startBluetoothSearch()
						} else {
							console.log('蓝牙模块不可用');
						}
					},
					fail: (err) => {
						console.log('获取蓝牙状态失败', err);
					}
				});
			},

			// 模拟蓝牙设备搜索
			startBluetoothSearch() {
				if (this.isAnyDeviceConnected) return;
				if (!this.showBluetoothPopup) return;
				this.devices = [];
				uni.startBluetoothDevicesDiscovery({
					success: (res) => {
						console.log('开始搜索附近的蓝牙设备', res);
						this.onBluetoothDeviceFound();
					},
					fail: (err) => {
						console.log('搜索蓝牙设备失败', err);
						uni.showToast({
							title: this.getTranslation('bluetoothSearchFailed'), // 使用国际化的提示文本
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			onBluetoothDeviceFound() {
				// 搜索到蓝牙后更新蓝牙设备
				uni.onBluetoothDeviceFound((res) => {
					res.devices.forEach(device => {
						// 只将设备名以 'Vidor' 开头的设备添加到 devices 数组中
						if (device.name && device.name.startsWith('Vidor')) {
							// 避免重复添加相同的设备
							const exists = this.bluetoothDevices.some(d => d.deviceId === device.deviceId);
							if (!exists) {
								this.bluetoothDevices.push(device);
								console.log('这里是发现设备的时候   ', JSON.stringify(device))
							}
						}
					});
					// 如果需要调试或查看发现的设备，可以取消注释以下行
					console.log('发现的新设备', this.bluetoothDevices);
				});
			},

			bindDevice(device) {
				// 调用 connectToDevice，并根据返回结果判断是否继续执行
				this.connectToDevice(device.deviceId)
					.then((isConnected) => {
						if (isConnected) {
							// 如果连接成功，更新设备状态
							device.isConnected = true; // 更新设备连接状态
							this.isAnyDeviceConnected = true; // 有设备连接时禁用其他设备的绑定按钮
							this.$forceUpdate(); // 强制刷新视图
							setTimeout(() => {
								this.showBluetoothPopup = false;
							}, 1500);
							uni.showToast({
								title: this.getTranslation('bluetoothConnectSuccess'),
								icon: 'none',
								duration: 1500
							})
						} else {
							// 如果连接失败，提示用户
							uni.showToast({
								title: this.getTranslation('bluetoothConnectFailed'),
								icon: 'none',
								duration: 1000
							});
						}
					});
			},

			// 连接到蓝牙设备
			connectToDevice(deviceId) {
				return new Promise((resolve) => {
					uni.createBLEConnection({
						deviceId: deviceId,
						success: (res) => {
							console.log('连接成功', res);
							this.connectedDeviceId = deviceId;
							this.deviceId = deviceId;
							this.stopBluetoothDevicesDiscovery(); // 停止设备搜索

							// 设置一个1秒的定时器来启动接收通知功能
							setTimeout(() => {
								this.receiveBLEData();
							}, 1000); // 延迟1秒执行接收通知

							// 立即获取电池电量和设备信息
							setTimeout(() => {
								this.getBatteryLevel(deviceId);
							}, 2000); // 延迟3秒执行接收通知

							setTimeout(() => {
								this.getDeviceInfo(deviceId)
							}, 3000); // 延迟3秒执行接收通知

							// 每60秒发送一次电池请求
							this.batteryTimer = setInterval(() => {
								this.getBatteryLevel(deviceId);
							}, 60000); // 每分钟获取一次电池电量

							resolve(true); // 连接成功
						},
						fail: (err) => {
							console.log('连接失败', err);
							uni.showToast({
								title: this.getTranslation(
									'bluetoothConnectFailedRange'),
								icon: 'none',
								duration: 2000
							});
							resolve(false); // 连接失败
						}
					});
				});
			},

			// 获取电池电量
			getBatteryLevel(deviceId) {
				// 获取电池电量
				this.sendBLEData('RS_Bat?\r\n', (batteryData) => {
					// 电池数据格式: RS_Bat=ok,0
					const batteryLevel = batteryData.split(',')[1]; // 获取'0'这个值
					console.log('电池电量:', batteryLevel);
					this.batteryLevel = batteryLevel;
				});
			},

			// 获取设备信息
			getDeviceInfo(deviceId) {
				// 获取设备信息
				this.sendBLEData('RS_Info?\r\n', (infoData) => {
					if (infoData.startsWith('RS_Info=ok')) {
						// 提取设备信息数据
						let infoParts = infoData.split(',');
						if (infoParts.length === 5) {
							// 解析版本号
							this.launcherVersion = infoParts[1];

							// 解析位置数据
							this.launcherPosition = {
								x0: parseFloat(infoParts[2]),
								y0: parseFloat(infoParts[3]),
								z0: parseFloat(infoParts[4])
							};

							console.log('设备信息:', {
								version: this.launcherVersion,
								position: this.launcherPosition
							});
						} else {
							console.log('设备信息数据格式错误:', infoData);
						}
					} else {
						console.log('设备信息数据格式错误:', infoData);
					}
				});
			},

			// 重新连接蓝牙设备
			reconnectDevice(deviceId) {
				if (this.isManualDisconnect) return
				if (!deviceId) {
					console.log('没有设备 ID，无法重连');
					return;
				}

				// 如果设备已经在重连中，避免重复重连
				if (this.reconnecting) {
					console.log('正在重连中，跳过');
					return;
				}

				this.reconnecting = true; // 标记为正在重连状态
				console.log('尝试重新连接设备', deviceId);

				// 获取设备对象，假设设备列表是 this.bluetoothDevices
				const device = this.getDeviceById(deviceId);
				if (!device) {
					console.log('设备未找到，无法进行重连');
					this.reconnecting = false; // 重连状态恢复
					return;
				}

				this.connectToDevice(deviceId).then((isConnected) => {
					if (isConnected) {
						// 如果连接成功，更新设备状态
						device.isConnected = true; // 更新设备连接状态
						this.isAnyDeviceConnected = true; // 有设备连接时禁用其他设备的绑定按钮
						this.$forceUpdate(); // 强制刷新视图
						setTimeout(() => {
							this.showBluetoothPopup = false;
						}, 1500);
						uni.showToast({
							title: this.getTranslation('bluetoothReconnectSuccess'),
							icon: 'none',
							duration: 1500
						})
					} else {
						console.log('蓝牙重连失败');
						uni.showToast({
							title: this.getTranslation('bluetoothReconnectFailed'),
							icon: 'none'
						});
					}
					this.reconnecting = false; // 重连完成，重置状态
				});
			},

			// 获取设备对象的方法
			getDeviceById(deviceId) {
				return this.bluetoothDevices.find(device => device.deviceId === deviceId);
			},

			// 统一发送蓝牙指令的方法
			sendBLEData(command, onSuccess) {
				console.log('command', command)
				if (!this.connectedDeviceId) {
					console.log('未找到有效的连接设备');
					return;
				}

				const serviceId = '55535343-FE7D-4AE5-8FA9-9FAFD205E455';
				const characteristicId = '49535343-1E4D-4BD9-BA61-23C647249616';

				// 将字符串命令转换为 ArrayBuffer
				let buffer = new ArrayBuffer(command.length);
				let dataview = new DataView(buffer);
				for (let i = 0; i < command.length; i++) {
					dataview.setUint8(i, command.charCodeAt(i));
				}

				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId,
					characteristicId,
					value: buffer,
					success: (res) => {
						console.log('发送数据成功', res);
						// 成功发送后，等待回调接收数据
						this.pendingCommand = {
							command,
							onSuccess
						}; // 保存当前命令和回调
					},
					fail: (err) => {
						console.log('发送数据失败', err);
						uni.showToast({
							title: this.getTranslation('bluetoothSendDataFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			// 接收蓝牙数据的方法
			receiveBLEData() {
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: this.deviceId,
					serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
					characteristicId: '49535343-8841-43F4-A8D4-ECBE34729BB3',
					success: () => {
						console.log('成功启用接收通知');
					},
					fail: (err) => {
						console.log('启用接收通知失败', err);
						uni.showToast({
							title: this.getTranslation('enableReceiveNotifyFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});

				// 监听蓝牙设备数据变化
				uni.onBLECharacteristicValueChange((res) => {
					let data = String.fromCharCode.apply(null, new Uint8Array(res.value));
					console.log('接收到的数据:', data);

					// 如果有待处理的命令且存在对应的成功回调
					if (this.pendingCommand && this.pendingCommand.onSuccess) {
						// 执行回调函数并传入接收到的数据
						this.pendingCommand.onSuccess(data);
						this.pendingCommand = null; // 清除待处理的命令
					}
				});
			},

			stopBluetoothDevicesDiscovery() {
				uni.stopBluetoothDevicesDiscovery({
					success: (res) => {
						console.log('停止搜索蓝牙设备成功', res);
					},
					fail: (err) => {
						console.log('停止搜索蓝牙设备失败', err);
						uni.showToast({
							title: this.getTranslation('stopSearchBluetoothFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			unbindDevice(device) {
				// 解绑设备
				device.isConnected = false; // 更新设备连接状态
				this.isAnyDeviceConnected = false; // 恢复所有设备按钮为可绑定状态
				this.$forceUpdate(); // 强制刷新视图
				this.disconnectDevice()
			},

			// 断开蓝牙连接
			disconnectDevice() {
				if (!this.connectedDeviceId) {
					uni.showToast({
						title: this.getTranslation('noDeviceConnected'),
						icon: 'none'
					});
					return;
				}

				// 标记为主动断开
				this.isManualDisconnect = true;

				if (this.batteryTimer) {
					clearInterval(this.batteryTimer);
					this.batteryTimer = null;
				}

				uni.closeBLEConnection({
					deviceId: this.connectedDeviceId,
					success: (res) => {
						console.log('断开连接成功', res);
						this.connectedDeviceId = null;
						this.currentDevice = null;
						this.batteryLevel = 100;
						// 清除电池信息定时器
						if (this.batteryTimer) {
							clearInterval(this.batteryTimer);
							this.batteryTimer = null;
						}
					},
					fail: (err) => {
						console.log('断开连接失败', err);
						uni.showToast({
							title: this.getTranslation('bluetoothDisconnectFailed'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},

			showModePicker() {
				if (this.trainingActive) {
					uni.showToast({
						title: this.getTranslation('endTrainingFirst'),
						icon: 'none',
						duration: 1000
					});
					return
				}
				this.temporarySelectedMode = this.selectedMode; // 默认选中当前模式
				this.showModePickerModal = true; // 显示 modal
				this.$nextTick(() => {
					// 等待 DOM 更新后滚动到选中的模式
					const selectedModeElement = this.$el.querySelector('.mode-item.selected-mode-item');
					if (selectedModeElement) {
						selectedModeElement.scrollIntoView({
							behavior: 'smooth',
							block: 'nearest'
						});
					}
				});
			},

			// 记录临时选择的模式索引
			setTemporaryMode(index) {
				this.temporarySelectedMode = index;
				this.selectedMode = index; // 直接确认选择的模式
				this.closeModePicker(); // 关闭模式选择弹窗
				this.onModeChange(this.selectedMode); // 执行模式变化操作
			},


			closeModePicker() {
				this.showModePickerModal = false; // 关闭弹窗
			},

			// 完成蓝牙连接
			completeBluetoothConnection() {
				this.showBluetoothPopup = false;
			},

			toggleFrequencyRandom(event) {
				this.isFrequencyRandom = event.detail.value;
				if (this.isFrequencyRandom) {
					// 如果是随机模式，不做额外处理
					this.frequency = null; // 可以将frequency设置为null或其他默认值，表示启用随机
				} else {
					// 如果不是随机模式，直接设置频率
					this.frequency = event.detail.value;
				}
				// 调整参数后
				this.generateDefaultBallCommand(); // 生成新的指令

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			toggleRotateRandom(event) {
				this.isRotateRandom = event.detail.value;
				if (this.isRotateRandom) {
					// 如果是随机模式，不做额外处理
					this.rotate = null; // 可以将rotate设置为null或其他默认值，表示启用随机
				} else {
					// 如果不是随机模式，直接设置旋转角度
					this.rotate = event.detail.value;
				}
				// 调整参数后
				this.generateDefaultBallCommand() // 生成新的指令

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			toggleHeightRandom(event) {
				this.isHeightRandom = event.detail.value;
				if (this.isHeightRandom) {
					// 如果是随机模式，不做额外处理
					this.height = null; // 可以将height设置为null或其他默认值，表示启用随机
				} else {
					// 如果不是随机模式，直接设置高度
					this.height = event.detail.value;
				}
				// 调整参数后
				this.generateDefaultBallCommand() // 生成新的指令

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			updateButtonStates() {
				// 如果 selectedMode 是 0 或 1，则禁用上下左右按钮
				if (this.selectedMode === 0) {
					this.upDownButtonsDisabled = true;
					this.leftRightButtonsDisabled = true;
				} else {
					// 否则，根据其他条件更新上下和左右按钮的禁用状态
					this.upDownButtonsDisabled = this.selectedMode === 3 && this.selectedBall === 2;
					this.leftRightButtonsDisabled = this.selectedMode === 4 && this.selectedBall === 2;
				}
			},

			// 获取网球场大小
			getCourtSize() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.tennis-court2').boundingClientRect(rect => {
					this.courtWidth = rect.width;
					this.courtHeight = rect.height;
					this.updateBallPositions(0);
				}).exec();
			},

			calculatePosition(row, col, courtTopOffset) {
				const ballSize = 30; // 网球的宽度和高度（单位：px）
				// const numCols = 5; // 列数（固定为5列）
				// const numRows = 7; // 行数（固定为7行）

				const numCols = this.gridConfig.version1.cols; // 版本1的列数（固定为5列）
				const numRows = this.gridConfig.version1.rows; // 版本1的行数（固定为7行）

				// 梯形的上底和下底宽度
				const topWidthPercent = 37.5; // 上底占总宽度的百分比
				const bottomWidthPx = this.courtWidth; // 下底宽度根据courtWidth动态变化

				// 根据当前球场宽度计算自适应的上底宽度（单位：px）
				const topWidthPx = (topWidthPercent / 100) * bottomWidthPx; // 自适应上底宽度（单位：px）

				// 计算当前行的宽度，确保不超过上边界和下边界
				const currentRowWidth = topWidthPx + (bottomWidthPx - topWidthPx) * (row / (numRows - 1));

				// 每一行的水平基准偏移量，确保球在左右两边对称
				const horizontalBasePadding = (this.courtWidth - currentRowWidth) / 2;

				// 定义列的横向偏移量，确保第三列竖直对齐，左右两边对称偏移
				const colPositions = [
					-2, // 第一列偏左
					-1, // 第二列稍偏左
					0, // 第三列保持竖直对齐
					1, // 第四列稍偏右
					2 // 第五列偏右
				];

				// 根据列数调整偏移，使第三列保持竖直，左右两边分别偏移，适当缩小列间距
				const colOffset = colPositions[col] * (currentRowWidth / (numCols * 1)); // 将列间距缩小，使布局更紧凑

				// 计算纵向的边距
				const verticalPadding = (this.courtHeight - numRows * ballSize) / (numRows + 1);

				// 计算每个球的实际位置    (网球位置)
				const left = horizontalBasePadding + currentRowWidth / 2 + colOffset - (ballSize / 2);
				const top = courtTopOffset - 10 + verticalPadding + row * (ballSize +
					verticalPadding); // 加入图片顶部的偏移量

				return {
					top,
					left
				};
			},

			// 获取网球的样式
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

			// 获取可展示的球的索引
			getDisplayableIndex(index) {
				// 获取所有可展示的球的索引
				const displayableBalls = this.balls.filter(ball => ball.canDisplay);
				// 返回对应的序号
				return displayableBalls.findIndex(ball => ball === this.balls[index]);
			},

			handleBallInteraction(index) {
				console.log('被点击的球序号', index);

				// 如果训练正在进行中，则禁止操作
				if (this.trainingActive) {
					uni.showToast({
						title: this.getTranslation('endTrainingFirstAgain'),
						icon: 'none',
						duration: 1000
					});
					return;
				}

				// 确保只有在模式9下生效
				if (this.selectedMode !== 9) return;

				// 获取当前点击的球
				const ball = this.balls[index];

				// 仅当球可以展示时才进行交互
				if (!ball.canDisplay) {
					console.log('该球不可交互');
					return; // 如果球不可交互，直接返回
				}

				// 如果球是灰色，点击后变为黄色
				if (ball.color === 'gray') {
					this.$set(this.balls, index, {
						...ball,
						color: 'yellow'
					});
					// 将球的真实下标存入 selectedBalls
					this.selectedBalls.push(index); // 使用原始 index
				} else {
					// 如果球是黄色，点击后变为灰色
					this.$set(this.balls, index, {
						...ball,
						color: 'gray'
					});
					// 从 selectedBalls 中移除该球的真实下标
					this.selectedBalls = this.selectedBalls.filter(ballIndex => ballIndex !== index);
				}

				// 使用 getDisplayableIndex 获取展示序号并加1
				this.inputData = this.selectedBalls
					.map(realIndex => this.getDisplayableIndex(realIndex) + 1) // 获取展示序号
					.join(',');

				this.updateParametersForMode(this.selectedMode)
				this.modifyMachineConfigs('highlightBalls')
			},


			clearInputData() {
				if (this.trainingActive) {
					uni.showToast({
						title: this.getTranslation('endTrainingFirstAgain'),
						icon: 'none',
						duration: 1000
					})
					return
				}
				this.inputData = ''
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
				if ([1, 3, 5, 6, 7].includes(selectedMode)) {
					this.showHeightControl = true;
				} else {
					this.showHeightControl = false;
				}
			},

			// 控制发球高度选择功能的显示与隐藏
			toggleHeightSelector(selectedMode) {
				if ([2, 4, 8].includes(selectedMode)) {
					// if ([1, 3, 6].includes(selectedMode)) {  原来的
					this.showHeightSelector = true;
				} else {
					this.showHeightSelector = false;
				}
			},

			// 计算发球机位置
			calculateLauncherPosition() {
				const court = this.courtSizes.find(c => c.type === this.selectedCourtType);
				if (court) {
					// 水平方向始终在场地宽度的中间
					this.cannonX = court.width / 2;

					// 根据 selectedLauncherPosition 设置垂直方向的位置
					if (this.selectedLauncherPosition === 'Baseline') {
						this.cannonY = 0; // 底线位置
					} else if (this.selectedLauncherPosition === 'Midline') {
						this.cannonY = court.length / 6; // 距离底线1/6处
					} else if (this.selectedLauncherPosition === 'Midcourt') {
						this.cannonY = court.length / 2; // 场地正中间
					}
				} else {
					// 如果没有找到对应的场地，默认值
					this.cannonX = 0;
					this.cannonY = 0;
				}
				this.generateDefaultBallCommand()
			},

			//调整速度
			handleSpeedChange(event) {
				this.speed = event.detail.value;
				this.modeParams[this.selectedMode][this.selectedBall - 1].speed = event.detail.value

				// 调整参数后
				this.modifyMachineConfigs('updateSpeed')

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			getCurBallInfo(tableIndex) {
				const tableMapping = this.tableMapping;
				const selectedTable = tableMapping[this.selectedLauncherPosition];

				if (!selectedTable) {
					console.error("选定的位置无效");
					return;
				}

				// let tableIndex = this.getCurBallIndex()

				const ballData = selectedTable[tableIndex];

				return {
					minH: ballData.minH,
					maxH: ballData.maxH,
					launchParams: ballData.launchParams
				};
			},

			getCurBallIndex() {
				let tableIndex;
				if (this.selectedMode === 9) {
					const ballIndex = this.selectedBalls.length - 1;
					if (this.balls[ballIndex]) {
						const row = this.balls[ballIndex].ballIndex[0];
						const col = this.balls[ballIndex].ballIndex[1];
						tableIndex = row * 5 + col;
					}
				} else if ([2, 3, 4].includes(this.selectedMode)) {
					const ballIndex = this.selectedBall - 1;
					if (this.balls[ballIndex]) {
						const row = this.balls[ballIndex].ballIndex[0];
						const col = this.balls[ballIndex].ballIndex[1];
						tableIndex = row * 5 + col;
					}
				} else {
					if (this.balls[0]) {
						const row = this.balls[0].ballIndex[0];
						const col = this.balls[0].ballIndex[1];
						tableIndex = row * 5 + col;
					}
				}

				return tableIndex
			},


			heightToUI(h, minH, maxH, intervalCounts) {
				//将真实高度转化成界面高度
				if (minH == 10000 && maxH == -10000)
					return null;

				let step = (maxH - minH) / intervalCounts;

				this.serveHeight = Math.floor((h - minH) / step) + 1
			},


			// 调整发球高度
			adjustHeight(change) {
				this.serveHeight = Math.min(Math.max(this.serveHeight + change, this.Hmin), this.Hmax);

				this.modeParams[this.selectedMode][this.selectedBall - 1].serveHeight = this.serveHeight
				// 调整参数后
				// this.generateDefaultBallCommand() // 生成新的指令
				this.modifyMachineConfigs('updateHeight')
				// this.UIToHeight()

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			UIToHeight() {
				//根据档位获取真实高度值
				const tableIndex = this.getCurBallIndex()
				const {
					minH,
					maxH,
					launchParams
				} = this.getCurBallInfo(tableIndex)
				const intervalCounts = 10
				const i = this.serveHeight

				if (minH == 10000 && maxH == -10000)
					return null;
				let step = (maxH - minH) / intervalCounts;
				const realHeight = minH + (i - 1) * step
				this.realHeight = Number(realHeight.toFixed(2));
				console.log('realHeight', realHeight)
				//根据真实高度值找到真实速度值
				this.heightToSpeed(realHeight, launchParams)
			},

			updateParametersForMode(modeIndex) {
				// 定义每个模式的默认参数
				const modeParams = this.modeParams;

				if (modeIndex === 0 && this.selectedDifficulty === '2.0') {
					// 如果是模式0，且难度为 '2.0'，单独设置默认参数
					this.frequency = 6;
					this.speed = 50;
					this.rotate = 0;
					this.heights = '';
					this.serveHeight = 4; // 初学者练习，发球角度较低，适合新手
				} else {
					// 获取当前模式的第一个球参数
					const firstBallParams = modeParams[modeIndex]?.[0];

					if (firstBallParams) {
						// 使用模式的第一个球参数
						this.frequency = firstBallParams.frequency;
						this.speed = firstBallParams.speed;
						this.rotate = firstBallParams.rotate;
						this.heights = firstBallParams.heights;
						this.serveHeight = firstBallParams.serveHeight;
					} else {
						// 如果没有参数，使用初始默认参数
						this.frequency = this.initialParams.frequency;
						this.speed = this.initialParams.speed;
						this.rotate = this.initialParams.rotate;
						this.heights = this.initialParams.heights;
						this.serveHeight = this.initialParams.serveHeight;
					}
				}

				// 重置球的位置
				this.resetBallPosition();
			},

			// 获取当前选定球场的真实大小
			fetchSelectedCourtSize() {
				return this.courtSizes.find(court => court.type === this.selectedCourtType);
			},

			// 转化球坐标，将传入的相对坐标 [row, col] 转为球场的真实坐标
			convertBallPosition(position) {
				// console.log('开始转换网球位置，输入位置:', position);

				const courtSize = this.fetchSelectedCourtSize(); // 获取当前球场的尺寸
				// console.log('获取球场尺寸:', courtSize);

				if (!courtSize) {
					console.warn('球场尺寸未定义，返回默认坐标 {x: 0, y: 0}');
					return {
						x: 0,
						y: 0
					};
				}

				const courtWidth = courtSize.width; // 球场宽度（米）
				const courtLength = courtSize.length; // 球场长度（米）
				const halfCourtLength = courtLength / 2; // 球场长度的一半（米）
				// console.log('球场宽度:', courtWidth, '球场长度:', courtLength, '半场长度:', halfCourtLength);

				const rowCount = this.gridConfig.version1.rows; // 行数（版本1）
				const colCount = this.gridConfig.version1.cols; // 列数（版本1）
				// console.log('网格配置 - 行数:', rowCount, '列数:', colCount);

				const ballDiameter = 0.0635; // 网球直径，单位为米

				// 列间距：确保第一列和最后一列的网球球心紧贴左右边缘
				const firstBallX = ballDiameter / 2; // 第一列的网球球心位置
				const lastBallX = courtWidth - ballDiameter / 2; // 最后一列的网球球心位置
				const spacingX = (lastBallX - firstBallX) / (colCount - 1); // 计算列间距，确保第一列和最后一列网球球心紧贴左右边界

				// 行间距：计算确保最后一行的网球球心紧贴球场底边
				const lastBallY = halfCourtLength - ballDiameter / 2; // 最后一行的网球球心位置
				const spacingY = (halfCourtLength - ballDiameter) / (rowCount - 1); // 计算行间距，确保最后一行球心紧贴底线

				// 计算传入位置的实际坐标
				const x = firstBallX + position[1] * spacingX; // 根据列的索引计算 x 坐标
				const y = halfCourtLength + (position[0] * spacingY) - (ballDiameter / 2); // 根据行的索引计算 y 坐标，并加上球场的半场高度

				return {
					x,
					y
				};
			},

			onModeChange(mode) {
				const index = mode
				this.selectedMode = index;
				this.selectedDifficulty = '1.0'

				// 控制 UI 部件显示隐藏
				this.showBallNumbers = [2, 3, 4, 9].includes(this.selectedMode);

				// 更新模式的默认参数	
				this.updateParametersForMode(mode);

				this.selectedBalls = []

				// 编程练习显示数字
				this.toggleDirectionButtons(this.selectedMode); // 控制方向按钮显示
				this.toggleAngleControl(this.selectedMode); // 控制角度调整显示
				this.toggleHeightSelector(this.selectedMode); // 控制发球高度选择功能
				this.showInputWithClear = (this.selectedMode === 9); // 编程练习模式下的输入框

				// 根据模式设置网球个数及默认位置
				// this.updateBallPositions(index);
				this.resetToInitialValues();
				this.generateBallConfig()
				this.generateDefaultBallCommand()
			},

			getRealParams(tableIndex) {
				// if (this.selectedMode === 9 && this.selectedBalls.length <= 0) {
				// 	return
				// }
				const {
					minH,
					maxH,
					launchParams
				} = this.getCurBallInfo(tableIndex)

				if (minH == 10000 && maxH == -10000)
					return null

				// 初始化最大值和最小值
				let maxSpeed = -Infinity;
				let minSpeed = Infinity;

				let closestHeight = null;
				let closestParam = null;
				let closestIndex = -1; // 用于记录 closestParam 的索引
				let epsilon = 100000;

				for (let i = 0; i < launchParams.length; i++) {
					let curParam = launchParams[i];
					let delta = Math.abs(this.speed - curParam[2]);

					// 更新最大值和最小值
					if (curParam[2] > maxSpeed) maxSpeed = curParam[2];
					if (curParam[2] < minSpeed) minSpeed = curParam[2];

					if (delta < epsilon) {
						closestHeight = curParam[3]; //假设下标3是高度
						closestParam = curParam;
						closestIndex = i; // 记录当前索引
						epsilon = delta;
					}
				}
				this.minRealSpeed = minSpeed
				this.maxRealSpeed = maxSpeed
				this.speed = closestParam[2]
				this.realHeight = this.realHeight = Number(closestHeight.toFixed(2));
				return closestParam
			},

			heightToSpeed(realHeight, launchParams) {
				//根据真实高度找到真实速度
				let closestSpeed = null;
				let closestParam = null;

				// 初始化最大值和最小值
				let maxSpeed = -Infinity;
				let minSpeed = Infinity;

				let closestIndex = -1; // 用于记录 closestParam 的索引
				let epsilon = 100000;

				for (let i = 0; i < launchParams.length; i++) {
					let curParam = launchParams[i];
					let delta = Math.abs(realHeight - curParam[3]);


					// 更新最大值和最小值
					if (curParam[2] > maxSpeed) maxSpeed = curParam[2];
					if (curParam[2] < minSpeed) minSpeed = curParam[2];

					if (delta < epsilon) {
						closestSpeed = curParam[2]; //假设下标3是高度
						closestParam = curParam;
						closestIndex = i; // 记录当前索引
						epsilon = delta;
					}
				}

				this.speed = closestSpeed
				this.minRealSpeed = minSpeed
				this.maxRealSpeed = maxSpeed
				this.updateBallConfig(closestParam)
			},

			speedToheight() {
				const tableIndex = this.getCurBallIndex()
				const {
					minH,
					maxH,
					launchParams
				} = this.getCurBallInfo(tableIndex)

				let closestHeight = null;
				let closestParam = null;
				let closestIndex = -1; // 用于记录 closestParam 的索引
				let epsilon = 100000;

				// 初始化最大值和最小值
				let maxSpeed = -Infinity;
				let minSpeed = Infinity;

				for (let i = 0; i < launchParams.length; i++) {
					let curParam = launchParams[i];
					let delta = Math.abs(this.speed - curParam[2]);

					// 更新最大值和最小值
					if (curParam[2] > maxSpeed) maxSpeed = curParam[2];
					if (curParam[2] < minSpeed) minSpeed = curParam[2];

					if (delta < epsilon) {
						closestHeight = curParam[3]; //假设下标3是高度
						closestParam = curParam;
						closestIndex = i; // 记录当前索引
						epsilon = delta;
					}
				}

				//将真实高度转化成界面高度
				this.realHeight = this.realHeight = Number(closestHeight.toFixed(2));
				this.speed = closestParam[2]
				this.minRealSpeed = minSpeed
				this.maxRealSpeed = maxSpeed
				this.updateBallConfig(closestParam)
				this.heightToUI(closestHeight, minH, maxH, 10)
			},

			updateBallConfig(params) {
				// 获取当前球在 ballConfig 中的索引
				let index = -1; // 初始化为 -1

				// 根据模式判断应该使用哪个球的参数
				if (this.selectedMode === 9) {
					// 模式 9，获取最后一个选中的球
					if (this.selectedBalls && this.selectedBalls.length > 0) {
						index = this.selectedBalls.length - 1;
					} else {
						console.error("selectedBalls 未定义或为空");
					}
				} else if ([2, 3, 4].includes(this.selectedMode)) {
					// 模式 2, 3, 4，获取所选的球
					index = this.selectedBall - 1; // 确保 this.selectedBall 有效
				} else {
					index = 0; // 默认情况下取第一个球
				}

				if (index < 0 || index >= this.machineConfigs.length) {
					console.error(`无效的球索引: ${index}`);
					return;
				}

				const configKeys = ['launchAngle', 'horizontalAngleDeg', 'realSpeed', 'finalMaxHeight']; // 定义按顺序对应的配置键
				const config = {};

				// 根据 params 动态赋值到 config 对象中
				for (let i = 0; i < configKeys.length; i++) {
					if (params[i] !== undefined) {
						config[configKeys[i]] = params[i];
					}
				}

				// 将生成的 config 对象存入 machineConfigs
				this.machineConfigs[index] = config;
				console.log('更新后的机器配置参数', this.machineConfigs);

			},

			//生成每个模式每个球的默认机器配置参数
			async generateBallConfig() {
				// 1. 获取当前模式的参数
				const currentModeParams = this.modeParams[this.selectedMode];
				if (!currentModeParams) {
					console.error("未找到当前模式的配置参数");
					return;
				}

				// 2. 初始化配置参数数组
				const machineConfigs = [];

				// if (this.selectedMode === 9 && this.selectedBalls.length <= 0) {
				// 	return
				// }

				// 3. 遍历球，生成每个球的配置
				for (let index = 0; index < this.balls.length; index++) {
					const ball = this.balls[index];
					const ballIndex = index;

					if (!currentModeParams[ballIndex]) {
						console.log(`未找到下标为 ${ballIndex} 的默认参数`);
						continue;
					}

					const {
						speed,
						serveHeight
					} = currentModeParams[ballIndex];

					const row = ball.ballIndex[0];
					const col = ball.ballIndex[1];

					const tableIndex = row * 5 + col; // 转换成一维索引

					const result = this.getRealParams(tableIndex);

					let launchAngle, horizontalAngleDeg, realSpeed, finalMaxHeight;

					if (result) {
						// 如果 result 不为 null，则使用 result 的值
						launchAngle = result[0];
						horizontalAngleDeg = result[1];
						realSpeed = result[2];
						finalMaxHeight = result[3];
					} else {
						// 如果 result 为 null，则使用默认值 -1
						launchAngle = -1;
						horizontalAngleDeg = -1;
						realSpeed = -1;
						finalMaxHeight = -1;
					}

					// 构造当前球的配置对象
					const config = {
						launchAngle,
						horizontalAngleDeg,
						realSpeed,
						finalMaxHeight,
					};

					// 将配置对象添加到数组
					machineConfigs.push(config);
				}

				// 4. 更新到 data 并打印
				this.machineConfigs = machineConfigs;
				console.log("生成的机器配置参数：", machineConfigs);
			},


			generateDefaultBallCommand() {
				//判断当前模式，根据模式编辑指令
				//获取所有球的机器配置
				let commandStr = ""; // 最终指令字符串

				const mode = this.selectedMode

				const getRotationPercentage = (index) =>
					this.convertRotationToPercentage(this.modeParams[this.selectedMode][index].rotate);
				const getServeInterval = (index) =>
					this.modeParams[this.selectedMode][index].frequency;
				const getMachineConfig = (index) => this.machineConfigs[index];

				if ([0, 1, 5, 6, 7].includes(mode)) {
					// 单球模式
					const config = getMachineConfig(0);
					const rotationPercentage = getRotationPercentage(0);
					const serveInterval = getServeInterval(0);
					commandStr =
						`RS_Single=${config.horizontalAngleDeg},${config.launchAngle},${config.realSpeed},${rotationPercentage},${serveInterval}\n`;
				} else if ([3, 4].includes(mode)) {
					// 循环模式（水平和垂直）
					const isVertical = mode === 4 ? "H" : "V"; // 区分水平和垂直模式
					const firstConfig = getMachineConfig(0);
					const secondConfig = getMachineConfig(1);
					const firstRotationPercentage = getRotationPercentage(0);
					const firstServeInterval = getServeInterval(0);
					const secondRotationPercentage = getRotationPercentage(1);
					const secondServeInterval = getServeInterval(1);

					commandStr =
						`RS_Double=${isVertical},${firstConfig.horizontalAngleDeg},${firstConfig.launchAngle},${firstConfig.realSpeed},${firstRotationPercentage},${firstServeInterval};${secondConfig.horizontalAngleDeg},${secondConfig.launchAngle},${secondConfig.realSpeed},${secondRotationPercentage},${secondServeInterval}\n`;
				}

				// 全场随机（模式8）
				else if (mode === 8) {
					const command = {
						horizontalAngleRange: {
							min: this.AngleHmin,
							max: this.AngleHMax
						},
						launchAngleRange: {
							min: this.AngleVmin,
							max: this.AngleVMax
						},
						speedRange: {
							min: this.Vmin,
							max: this.Vmax
						},
						intervalRange: {
							min: 1,
							max: 10
						},
						rotationRange: {
							min: -100,
							max: 100
						}
					};

					const heightRange = this.isHeightRandom ?
						`${command.horizontalAngleRange.min},${command.horizontalAngleRange.max}` : '/* 此处添加非随机情况下的逻辑 */';
					const frequencyRange = this.isFrequencyRandom ?
						`${command.intervalRange.min},${command.intervalRange.max}` : serveInterval;
					const rotationRange = this.isRotateRandom ?
						`${command.rotationRange.min},${command.rotationRange.max}` : rotationPercentage;

					commandStr =
						`RS_Random=${heightRange},${command.launchAngleRange.min},${command.launchAngleRange.max},${command.speedRange.min},${command.speedRange.max},${frequencyRange},${rotationRange}\n`;
				}

				// 编程练习（模式2, 9）
				else if ([2, 9].includes(mode)) {
					// 筛选需要写指令的球
					const ballsToUse = mode === 9 ?
						this.selectedBalls.map(index => this.balls[index]) :
						this.balls;

					console.log('ballsToUse', ballsToUse);

					// 遍历所有球，拼接指令
					const ballCommands = ballsToUse.map((ball, index) => {
						console.log('index', index);

						// 如果 mode === 9，获取球的原始索引；否则直接使用当前索引
						const originalIndex = mode === 9 ? this.selectedBalls[index] : index;

						// 使用原始索引获取配置
						const config = getMachineConfig(originalIndex);
						const rotationPercentage = getRotationPercentage(originalIndex);
						const serveInterval = getServeInterval(originalIndex);

						return `${config.horizontalAngleDeg},${config.launchAngle},${config.realSpeed},${rotationPercentage},${serveInterval}`;
					}).join(";"); // 使用分号分隔多个球的参数

					commandStr = `RS_Program=${ballCommands}\n`;
				}

				console.log("Generated command:", commandStr);
				this.command = commandStr;
			},

			// 节流函数，用于限制移动频率
			throttle(fn, delay) {
				let lastTime = 0;
				return function(...args) {
					const now = Date.now();
					if (now - lastTime >= delay) {
						lastTime = now;
						fn.apply(this, args);
					}
				};
			},

			// 调用 moveBall 时加上节流
			moveBallThrottled(ballNumber, direction) {
				// 使用节流包装 moveBall 调用
				const throttledMove = this.throttle(() => this.moveBall(ballNumber, direction), 100);
				throttledMove(); // 调用包装后的节流函数
			},

			// 处理方向键按下事件
			handleDirectionKey(direction) {
				// 模式1: 选中的球可以自由移动
				if (this.selectedMode === 2) {
					this.moveBallThrottled(this.selectedBall, direction);
				}
				// 模式2: 1号球可以自由移动，上下移动时2号球跟随，2号球只能左右移动
				else if (this.selectedMode === 3) {
					if (this.selectedBall === 1) {
						this.moveBallThrottled(1, direction); // 1号球可以上下左右移动
						if (direction === 'up' || direction === 'down') {
							this.moveBallThrottled(2, direction); // 2号球跟随上下移动
						}
					} else if (this.selectedBall === 2 && (direction === 'left' || direction === 'right')) {
						this.moveBallThrottled(2, direction); // 2号球只能左右移动
					}
				}
				// 模式3: 1号球可以自由移动，左右移动时2号球跟随，2号球只能上下移动
				else if (this.selectedMode === 4) {
					if (this.selectedBall === 1) {
						this.moveBallThrottled(1, direction); // 1号球可以上下左右移动
						if (direction === 'left' || direction === 'right') {
							this.moveBallThrottled(2, direction); // 2号球跟随左右移动
						}
					} else if (this.selectedBall === 2 && (direction === 'up' || direction === 'down')) {
						this.moveBallThrottled(2, direction); // 2号球只能上下移动
					}
				} else {
					this.moveBallThrottled(1, direction);
				}
			},

			moveBall(ballNumber, direction) {
				const maxRows = this.gridConfig.version1.rows - 1; // 网球场的行数
				const maxCols = this.gridConfig.version1.cols - 1; // 网球场的列数
				const selectedModeConfig = this.modeConfig[this.selectedMode];
				const ballPositions = selectedModeConfig.positions;

				// 复制当前球的位置，防止直接修改原数组
				let newPositions = ballPositions.map(position => [...position]);

				// 获取当前球的位置
				let [row, col] = newPositions[ballNumber - 1]; // ballNumber 从 1 开始，数组索引从 0 开始

				// 计算即将移动到的位置
				let targetRow = row;
				let targetCol = col;

				switch (direction) {
					case 'up':
						if (row > 0) targetRow -= 1; // 向上移动一行
						break;
					case 'down':
						if (row < maxRows) targetRow += 1; // 向下移动一行
						break;
					case 'left':
						if (col > 0) targetCol -= 1; // 向左移动一列
						break;
					case 'right':
						if (col < maxCols) targetCol += 1; // 向右移动一列
						break;
				}

				// 判断即将移动到的位置是否有效
				if (!this.canMoveOrDisplayBall([targetRow, targetCol])) {
					console.log(`球 ${ballNumber} 无法移动到目标位置`);
					return; // 如果目标位置不能移动，则退出
				}

				// 更新选中球的位置
				newPositions[ballNumber - 1] = [targetRow, targetCol];

				// 根据不同模式，更新其他球的位置
				if (this.selectedMode === 3 && ballNumber === 1) {
					// 模式2: 1号球上下移动时，2号球跟随上下移动，但2号球只能水平移动
					newPositions[1][0] = targetRow; // 2号球的行号跟随1号球
				} else if (this.selectedMode === 3 && ballNumber === 2) {
					// 2号球只能左右移动，行保持不变
					newPositions[1] = [newPositions[0][0], targetCol]; // 保证2号球与1号球保持水平
				} else if (this.selectedMode === 4 && ballNumber === 1) {
					// 模式3: 1号球左右移动时，2号球跟随左右移动，但2号球只能垂直移动
					newPositions[1][1] = targetCol; // 2号球的列号跟随1号球
				} else if (this.selectedMode === 4 && ballNumber === 2) {
					// 2号球只能上下移动，列保持不变
					newPositions[1] = [targetRow, newPositions[0][1]]; // 保证2号球与1号球保持垂直
				}

				// 更新球的位置
				selectedModeConfig.positions = newPositions;

				console.log('newPositions', newPositions)
				let curBallPos = []; // 改为 let 以允许重新赋值
				if (this.selectedMode === 2 || this.selectedMode === 3 || this.selectedMode === 4) {
					curBallPos = newPositions[this.selectedBall - 1];
				} else {
					curBallPos = newPositions[0];
				}

				// 将 [row, col] 转换为线性索引
				const [curRow, curCol] = curBallPos;
				console.log('curBallPos', curBallPos)
				const linearIndex = curRow * 5 + curCol; // 7 行 5 列，转换为 1D 索引

				this.getRealParams(linearIndex)

				// 更新球在界面上的显示位置
				this.updateBallPositions(this.selectedMode);

				// 更新球的参数
				// this.updateParametersForMode(this.selectedMode);

				// 调整参数后
				// t	this.generateDefaultBallCommand() // 生成新的指令

				this.modifyMachineConfigs('updateBallPosition')

				// // 如果已经开始训练，则发送指令
				// if (this.trainingActive) {
				// 	this.sendBLEData(this.command); // 发送新的指令
				// }
			},

			canMoveOrDisplayBall(ballIndex) {
				const tableMapping = this.tableMapping

				// 获取当前选择的表格
				const selectedTable = tableMapping[this.selectedLauncherPosition];

				if (!selectedTable) {
					console.error("未找到对应的发射器位置表格。");
					return false; // 如果没有找到有效的表格，返回 false
				}

				// 将 [row, col] 转换为线性索引
				const [row, col] = ballIndex;
				const linearIndex = row * 5 + col; // 7 行 5 列，转换为 1D 索引

				// 判断该索引对应的数组是否存在，并且长度是否大于 0
				return selectedTable[linearIndex].launchParams && selectedTable[linearIndex].launchParams.length > 0;
			},

			// 选择发球高度
			selectHeight(height) {
				if (this.isHeightRandom && this.selectedMode === 8) return; // 模式9中高度随机

				// 设置高度
				if (height === '低') {
					this.serveHeight = 1;
				} else if (height === '中') {
					this.serveHeight = 5;
				} else {
					this.serveHeight = 10;
				}
				this.modeParams[this.selectedMode][this.selectedBall - 1].serveHeight = this.serveHeight
				this.selectedHeight = height;

				// 调整参数后
				// this.generateDefaultBallCommand() // 生成新的指令
				this.modifyMachineConfigs('updateHeight')
				// this.UIToHeight()

				// // 如果已经开始训练，则发送指令
				// if (this.trainingActive) {
				// 	this.sendBLEData(this.command); // 发送新的指令
				// }
			},

			// 辅助函数：将旋转程度转换为百分比
			convertRotationToPercentage(rotate) {
				return Math.round((rotate / 5) * 100); // -5 ~ 5 转换为 -100 ~ 100
			},

			getTranslation(key) {
				return this.translations.Toast[this.currentLanguage][key] || key;
			},

			startTraining() {
				if (this.selectedMode === 9 && this.inputData === '') {
					uni.showToast({
						title: this.getTranslation('chooseTennisBallFirst'),
						icon: 'none',
						duration: 1000
					});
					return;
				}
				if (!this.isAnyDeviceConnected) {
					uni.showToast({
						title: this.getTranslation('connectBluetoothFirst'),
						icon: 'none',
						duration: 1000
					});
					return;
				}

				if (!this.trainingActive) {
					this.trainingActive = true;
					this.buttonText = this.translations.endTraining[this.currentLanguage];
					this.buttonColor = 'rgba(232, 95, 95, 1)'; // 训练中按钮颜色
					this.modeSelectable = false; // 禁用模式选择

					// this.generateDefaultBallCommand()
					// 发送训练参数
					this.sendBLEData(this.command);

					// 确定发球顺序
					this.determineServingOrder();

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
				// this.generateDefaultBallCommand() // 发送结束参数
				if (this.selectedMode === 9) {
					this.clearInputData()
				}
				this.sendBLEData('RS_Stop=1\n')
			},

			resetToInitialValues() {
				// 恢复所有模式的默认参数
				const modeconfig = {
					0: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 初学者练习
					1: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 定点练习
					2: {
						ballCount: 2,
						positions: [
							[2, 2],
							[3, 4]
						]
					}, // 交叉循环
					3: {
						ballCount: 2,
						positions: [
							[2, 0],
							[2, 4]
						]
					}, // 水平循环
					4: {
						ballCount: 2,
						positions: [
							[0, 2],
							[3, 2]
						]
					}, // 垂直循环
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
					}, // 截击练习
					7: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 月亮球
					8: {
						ballCount: 1,
						positions: [
							[2, 2]
						]
					}, // 全场随机
					9: {
						ballCount: 35,
						positions: [
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
					} // 编程练习	
				}

				const modeParams = this.modeParams[this.selectedMode] || {};
				this.modeConfig = modeconfig
				this.frequency = this.initialParams[this.selectedMode].frequency;
				this.speed = this.initialParams[this.selectedMode].speed;
				this.rotate = this.initialParams[this.selectedMode].rotate;
				this.serveHeight = this.initialParams[this.selectedMode].serveHeight;
				this.heights = this.initialParams[this.selectedMode].heights;
				this.realHeight = null
				this.selectedBall = 1
				this.selectedBalls = []
				this.inputData = ''
				this.restoreDefaultBallPositions()
			},

			handleFrequencyChange(event) {
				this.frequency = event.detail.value;
				this.modeParams[this.selectedMode][this.selectedBall - 1].frequency = event.detail.value
				// 调整参数后
				this.generateDefaultBallCommand() // 生成新的指令

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},
			handleRotateChange(event) {
				this.rotate = event.detail.value;
				this.modeParams[this.selectedMode][this.selectedBall - 1].rotate = event.detail.value
				// 调整参数后
				this.generateDefaultBallCommand() // 生成新的指令

				// 如果已经开始训练，则发送指令
				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			resetBallPosition() {
				// 重置网球的位置
				this.ballPosition = {
					...this.initialBallPosition
				};
			},

			determineServingOrder() {
				if (this.selectedMode === 9) {
					// 模式9：使用用户定义的发球顺序
					this.servingOrder = this.inputData.split(',').map(Number);
				} else {
					// 其他模式：从左到右、从上到下的顺序
					this.servingOrder = this.balls.map((_, index) => index + 1);
				}
			},

			selectBall(ballNumber) {
				this.selectedBall = ballNumber; // 选择球
				const modeParams = this.modeParams[this.selectedMode]; // 获取当前模式的参数

				const row = this.balls[ballNumber - 1].ballIndex[0];
				const col = this.balls[ballNumber - 1].ballIndex[1];

				const tableIndex = row * 5 + col; // 转换成一维索引

				this.getRealParams(tableIndex)

				if (modeParams && modeParams[ballNumber - 1]) {
					const {
						frequency,
						speed,
						serveHeight
					} = modeParams[ballNumber - 1];
					this.frequency = frequency; // 将频率赋值给 this.frequency
					this.speed = speed; // 将速度赋值给 this.speed
					this.serveHeight = serveHeight; // 将发球高度赋值给 this.serveHeight
					const heightMapping = {
						1: '低',
						5: '中',
						10: '高',
					};
					this.selectedHeight = heightMapping[this.modeParams[this.selectedMode][this.selectedBall - 1]
						.serveHeight] || ''; // 如果不在映射中，赋值为空字符串
					// this.modifyMachineConfigs('selectBalls')
				} else {
					console.error(`未找到球 ${ballNumber} 的配置参数`);
				}
			},

			async modifyMachineConfigs(type) {
				// 1. 获取当前的机器配置参数
				const machineConfigs = this.machineConfigs;

				// 2. 判断传入的 type 类型
				switch (type) {
					case "updateLauncherPosition": // 修改网球机位置√
					case "updateDifficulty": // 修改难度√
						await this.generateBallConfig();
						break;
					case "updateBallPosition": // 添加 selectBalls 的 case
						// this.modifyBallConfig(); // 调用函数以调整高度
						break;
					case "updateSpeed": // 修改速度
						this.speedToheight()
						break;
					case "updateHeight": // 修改高度
						this.UIToHeight()
						break;
					case "highlightBalls": // 点选网球
						await this.generateBallConfig();
						break;
					default:
						console.error("Unknown operation type:", type);
						return;
				}

				this.generateDefaultBallCommand()

				if (this.trainingActive) {
					this.sendBLEData(this.command); // 发送新的指令
				}
			},

			setLanguage() {
				// 获取系统信息
				const systemInfo = uni.getSystemInfoSync();
				const language = systemInfo.language; // 获取设备语言

				// 根据语言设置切换
				if (language.includes('en')) {
					this.currentLanguage = 'en'; // 英文
				} else {
					this.currentLanguage = 'zh'; // 中文
				}
			},
		},

		onReady() {
			this.getCourtSize();
			this.generateBallConfig()
		},

		mounted() {
			const accepted = uni.getStorageSync('privacyAccepted');
			if (!accepted) {
				this.showPrivacyModal = true;
			}
			this.images = images
			this.updateParametersForMode(this.selectedMode);
			// this.getCourtSize();
			// this.updateBallPositions(0)
			this.calculateLauncherPosition()
			this.setLanguage();
			// 在组件加载后，确保 DOM 可用
			this.$nextTick(() => {
				// 调用 calculatePosition 或其他需要 DOM 的方法
				const position = this.calculatePosition(0, 0); // 示例参数
			});
		},
		beforeDestroy() {
			// 清除所有监听事件，避免内存泄漏
			uni.offBluetoothAdapterStateChange();
			uni.offBLEConnectionStateChange();
			uni.offBluetoothDeviceFound();
			uni.offBLECharacteristicValueChange();

			// 停止电池信息获取定时器
			if (this.batteryTimer) {
				clearInterval(this.batteryTimer);
			}
			console.log('组件销毁前，已清除蓝牙监听事件和定时器');
		}
	};
</script>

<style scoped>
	/* 隐私协议弹窗背景 */
	.privacy-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		/* 半透明背景 */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		/* 确保在最上层 */
	}

	/* 弹窗内容区域 */
	.privacy-content {
		background-color: #ffffff;
		/* 背景为白色 */
		border-radius: 15px;
		padding: 15px;
		/* 更紧凑的内边距 */
		width: 80%;
		max-width: 360px;
		/* 最大宽度 */
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		/* 不使用 space-between，避免间距过大 */
		text-align: left;
		min-height: 200px;
		/* 最小高度，防止内容过少时弹窗太小 */
	}

	/* 标题样式 */
	.privacy-title {
		font-size: 20px;
		font-weight: bold;
		color: #333333;
		text-align: center;
		/* 标题居中 */
		margin-bottom: 10px;
		/* 标题和内容之间的间距 */
	}

	/* 文字内容样式 */
	.privacy-text {
		font-size: 14px;
		color: #555555;
		line-height: 1.6;
		/* 调整行高，使内容更紧凑 */
		margin-bottom: 8px;
		/* 减少文字和复选框之间的间距 */
		white-space: pre-wrap;
		/* 保持换行 */
	}

	/* 超链接样式 */
	.privacy-link {
		color: #007aff;
		text-decoration: underline;
		cursor: pointer;
	}

	/* 复选框区域 */
	.privacy-checkbox {
		font-size: 14px;
		color: #555555;
		margin-bottom: 15px;
		/* 调整复选框和按钮之间的间距 */
		display: flex;
		justify-content: flex-start;
	}

	/* 按钮样式 */
	.confirm-button {
		background-color: #007aff;
		/* 按钮背景颜色 */
		color: white;
		/* 按钮文字颜色 */
		border: none;
		padding: 10px;
		border-radius: 5px;
		font-size: 16px;
		width: 100%;
		cursor: pointer;
	}

	/* 按钮禁用状态 */
	.confirm-button:disabled {
		background-color: #d3d3d3;
		/* 禁用按钮背景 */
		cursor: not-allowed;
		/* 禁用状态下禁用点击 */
	}

	/* --------- */
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: linear-gradient(180deg, rgba(206, 230, 249, 1) 0%, rgba(196, 230, 255, 1) 100%);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2.3vw;
		/* 自适应的 padding */
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

	/* 蓝牙弹窗样式 */
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


	.selCancel-button {
		margin-left: 4.65vw;
		/* 设置左边距 */
		font-size: 4.00vw;
		/* 17.2px */
		font-weight: 500;
		letter-spacing: 0px;
		line-height: 2.58vh;
		/* 24.08px */
		color: rgba(135, 142, 159, 1);
		text-align: left;
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


	.complete-modeSelect {
		margin-right: 4.65vw;
		/* 20px */
		font-size: 4.00vw;
		/* 17.2px */
		font-weight: 600;
		letter-spacing: 0px;
		line-height: 2.58vh;
		/* 24.08px */
		color: rgba(95, 186, 232, 1);
		text-align: right;
		/* 将文字右对齐 */
		vertical-align: top;
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


	.complete-btn {
		width: 100%;
		/* 使按钮占据整个宽度 */
		height: 40px;
		/* 设定按钮的高度 */
		border-radius: 5px;
		/* 圆角 */
		background: rgba(95, 186, 232, 1);
		color: white;
		/* 字体颜色 */
		border: none;
		/* 无边框 */
		cursor: pointer;
		/* 指针样式 */
		font-size: 16px;
		/* 字体大小 */
	}

	/* 其他样式保持不变 */
	.device-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #f0f0f0;
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

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button {
		background-color: #1E90FF;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:active {
		background-color: #104E8B;
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

	.modal-content {
		background-color: white;
		border-radius: 2.33vw;
		/* Original border-radius: 10px */
		width: 80%;
		/* Maintains responsive width */
		max-width: 116.28vw;
		/* Original max-width: 500px */
		padding: 2.15vh;
		/* Original padding: 20px */
		box-shadow: 0 0.43vh 0.86vh rgba(0, 0, 0, 0.2);
		/* Adjusted shadow offset */
	}


	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.61vh;
		/* Original margin-bottom: 15px */
	}


	.modal-body {
		max-height: 42.92vh;
		/* Original max-height: 400px */
		overflow-y: auto;
	}


	/* .device-item {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
} */

	.device-item text {
		flex: 1;
	}

	.btn-bluetooth,
	.btn-lang {
		margin: 0 2.33vw;
		/* Original margin: 0 10px */
	}


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

	.tennis-ball-gray {
		background-color: gray;
	}

	.tennis-ball-red {
		background-color: red;
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

	.number-container {
		display: flex;
		flex-wrap: wrap;
		/* 允许换行展示 */
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


	.selectedText {
		color: rgba(255, 255, 255, 1);
		/* 选中的文本颜色 */
	}

	.selected {
		background-color: green;
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

	/* mark */
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
		font-size: 2.5vw;
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
			font-size: 3.8vw;
			/* 小屏幕上使用稍大的字体 */
			line-height: 5vw;
			/* 增加行高以改善可读性 */
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.param-value {
			font-size: 2.8vw;
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
}