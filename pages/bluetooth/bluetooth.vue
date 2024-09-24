<template>
	<view v-if="batteryLevel !== null">
		<text>当前电量: {{ batteryLevel }}%</text>
	</view>
	<view>
		<button @click="openBluetoothAdapter">打开蓝牙</button>
		<button @click="startBluetoothDevicesDiscovery" v-if="!connectedDeviceId">搜索蓝牙设备</button>
		<button @click="stopBluetoothDevicesDiscovery" v-if="!connectedDeviceId">停止搜索蓝牙设备</button>

		<view v-if="connectedDeviceId">
			<text>当前连接的设备：</text>
			<view v-if="currentDevice">
				<text>{{ currentDevice.name || '未命名设备' }}</text>
				<text>设备 ID: {{ currentDevice.deviceId }}</text>
			</view>
			<button @click="disconnectDevice">断开连接</button>
		</view>

		<view v-else-if="devices.length > 0">
			<text>发现的蓝牙设备：</text>
			<view v-for="device in devices" :key="device.deviceId" style="margin: 10px 0;">
				<text>{{ device.name || '未命名设备' }}</text>
				<button @click="connectToDevice(device.deviceId)">连接设备</button>
			</view>
		</view>

		<view>
			<text>速度数值: {{ speed }}</text>
			<slider :value="speed" min="0" max="100" step="1" @change="handleSliderChange('speed', $event)"></slider>

			<text>频率数值: {{ frequency }}</text>
			<slider :value="frequency" min="0" max="100" step="1" @change="handleSliderChange('frequency', $event)">
			</slider>

			<text>角度数值: {{ angle }}</text>
			<slider :value="angle" min="0" max="360" step="1" @change="handleSliderChange('angle', $event)"></slider>
		</view>

		<button @click="toggleTraining" v-if="connectedDeviceId">
			{{ isTraining ? '结束训练' : '开始训练' }}
		</button>

		<button @click="closeBluetoothAdapter">关闭蓝牙</button>

		<view v-if="commandHistory.length > 0" class="command-history">
			<text>发送的指令历史：</text>
			<view ref="commandHistory">
				<text v-for="(command, index) in commandHistory" :key="index" class="command">
					{{ command }}
				</text>
			</view>
		</view>

		<view v-if="receivedMessages.length > 0" class="received-messages">
			<text>接收到的消息：</text>
			<view ref="receivedMessages">
				<text v-for="(message, index) in receivedMessages" :key="index" :style="{ color: message.color }"
					class="message">
					{{ message.text }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: [],
				deviceId: '',
				connectedDeviceId: null,
				currentDevice: null,
				batteryLevel: null,
				batteryInterval: null,
				isTraining: false,
				commandHistory: [],
				receivedMessages: [],
				trainingMode: 'moonball',
				speed: 10,
				frequency: 5,
				angle: 0,
				serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
				// characteristicId: '0000FFF2-0000-1000-8000-00805F9B34FB',
				TX_UUID: '49535343884143f4a8d4ecbe34729bb3', // 接收指令UUID
				RX_UUID: '495353431e4d4bd9ba6123c647249616' // 发送指令UUID
			};
		},
		methods: {
			openBluetoothAdapter() {
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('蓝牙模块初始化成功', res);
						this.checkBluetoothState();
					},
					fail: (err) => {
						console.log('蓝牙模块初始化失败', err);
						uni.showToast({
							title: '请打开蓝牙',
							icon: 'none'
						});
					}
				});
			},
			startBluetoothDevicesDiscovery() {
				if (this.connectedDeviceId) return;
				this.devices = [];
				uni.startBluetoothDevicesDiscovery({
					success: (res) => {
						console.log('开始搜索附近的蓝牙设备', res);
						this.onBluetoothDeviceFound();
					},
					fail: (err) => {
						console.log('搜索蓝牙设备失败', err);
					}
				});
			},
			checkBluetoothState() {
				uni.getBluetoothAdapterState({
					success: (res) => {
						if (res.available) {
							console.log('蓝牙模块可用');
						} else {
							console.log('蓝牙模块不可用');
						}
					},
					fail: (err) => {
						console.log('获取蓝牙状态失败', err);
					}
				});
			},
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {
					res.devices.forEach(device => {
						// 直接将找到的设备添加到 devices 数组中，不进行筛选
						this.devices.push(device);
					});
					// 如果需要调试或查看发现的设备，可以取消注释以下行
					console.log('发现的新设备', this.devices);
				});
			},

			connectToDevice(deviceId) {
				uni.createBLEConnection({
					deviceId: deviceId,
					success: (res) => {
						console.log('连接成功', res);
						this.connectedDeviceId = deviceId;
						this.currentDevice = this.devices.find(d => d.deviceId === deviceId);
						this.devices = [];
						this.deviceId = deviceId;
						this.stopBluetoothDevicesDiscovery();

						// 启动接收通知功能
						let This = this
						setTimeout(() => {
							uni.getBLEDeviceServices({
								deviceId,
								success(res) {
									console.log('device services:', res.services)
									This.receiveBLEData();
								}
							});
						}, 1000);
						uni.navigateTo({
							url: `/pages/index/index?bluetoothName=${res.deviceName}`
						});
					},
					fail: (err) => {
						console.log('连接失败', err);
					}
				});
				this.batteryLevel = 100;
				this.batteryInterval = setInterval(() => {
					this.writeBLECharacteristicValue('getBattery\n', this.RX_UUID);
				}, 60000);
			},
			toggleTraining() {
				if (this.isTraining) {
					this.sendEndTrainingCommand();
				} else {
					this.sendStartTrainingCommand();
				}
				this.isTraining = !this.isTraining;
			},
			sendStartTrainingCommand() {
				const command = `AT+START=${this.trainingMode},${this.speed},${this.frequency},${this.angle}\n`;
				this.writeBLECharacteristicValue(command, this.RX_UUID);
				this.addCommandToHistory(command);
			},
			handleSliderChange(param, event) {
				this[param] = event.detail.value;
				if (this.isTraining) {
					this.sendUpdateCommand();
				}
			},
			sendUpdateCommand() {
				const command = `AT+UPDATE=${this.trainingMode},${this.speed},${this.frequency},${this.angle}\n`;
				this.writeBLECharacteristicValue(command);
				this.addCommandToHistory(command);
			},
			sendEndTrainingCommand() {
				const command = 'AT+END\n';
				this.writeBLECharacteristicValue(command, this.RX_UUID);
				this.addCommandToHistory(command);
				this.commandHistory = [];
				this.receivedMessages = [];
			},

			receiveBLEData() {
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: '49535343-8841-43F4-A8D4-ECBE34729BB3',
					state: true,
					success: () => {
						console.log('成功启用接收通知');
					},
					fail: (err) => {
						console.log('启用接收通知失败', err, this.serviceId);
					}
				});

				// 监听蓝牙特性值变化事件
				uni.onBLECharacteristicValueChange((res) => {
					const receivedData = this.arrayBufferToString(res.value);
					console.log('收到的数据:', receivedData);
					// 判断接收到的是电量信息，并更新 batteryLevel
					if (receivedData.startsWith('battery:')) {
						this.batteryLevel = receivedData.split(':')[1]; // 提取电量值
					}
					this.receivedMessages.push({
						text: `收: ${receivedData}`,
						color: '#008000' // 可以根据需要自定义颜色
					});
					this.updateCommandHistoryDisplay();
					this.processReceivedCommand(receivedData);
				});
			},
			processReceivedCommand(command) {
				if (command.startsWith('training:start')) {
					// 当收到 'training:start' 指令时，开始训练逻辑		
					console.log('this.isTraining++++++', this.isTraining)
					if (this.isTraining) return
					this.sendStartTrainingCommand();
					this.isTraining = true;
				} else if (command.startsWith('training:end')) {
					// 当收到 'training:end' 指令时，结束训练逻辑
					if (this.isTraining) {
						this.sendEndTrainingCommand();
						this.isTraining = false;
					}
				}
			},
			writeBLECharacteristicValue(command, characteristicId) {
				if (!this.connectedDeviceId) return;
				let buffer = new ArrayBuffer(command.length);
				let dataview = new DataView(buffer);
				for (let i = 0; i < command.length; i++) {
					dataview.setUint8(i, command.charAt(i).charCodeAt());
				}
				//let buffer =  this.stringToArrayBuffer(command);
				let This = this;
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
					characteristicId: '49535343-1E4D-4BD9-BA61-23C647249616',
					value: buffer,
					success(res) {
						//This.addCommandToHistory("发送数据成功:"+res);
						console.log('发送数据成功', res);
					},
					fail(err) {
						//This.addCommandToHistory("发送数据失败:"+err);
						console.log('发送数据失败', err);
					}
				});
			},
			disconnectDevice() {
				if (!this.connectedDeviceId) {
					uni.showToast({
						title: '未连接设备',
						icon: 'none'
					});
					return;
				}
				if (this.batteryInterval) {
					clearInterval(this.batteryInterval);
					this.batteryInterval = null;
				}
				uni.closeBLEConnection({
					deviceId: this.connectedDeviceId,
					success: (res) => {
						console.log('断开连接成功', res);
						this.connectedDeviceId = null;
						this.currentDevice = null;
						this.batteryLevel = null;
					},
					fail: (err) => {
						console.log('断开连接失败', err);
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
					}
				});
			},
			stringToArrayBuffer(str) {
				const base64 = btoa(unescape(encodeURIComponent(str)));
				const len = base64.length;
				const bytes = new Uint8Array(len);
				for (let i = 0; i < len; i++) {
					bytes[i] = base64.charCodeAt(i);
				}
				return bytes.buffer;
			},
			arrayBufferToString(buffer) {
				const bytes = new Uint8Array(buffer);
				const binary = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
				return decodeURIComponent(escape(binary));
			},
			updateCommandHistoryDisplay() {
				const commandHistoryEl = this.$refs.commandHistory;
				if (commandHistoryEl) {
					commandHistoryEl.scrollTop = commandHistoryEl.scrollHeight;
				}
			},
			addCommandToHistory(command) {
				this.commandHistory.push(`发送: ${command}`);
				this.updateCommandHistoryDisplay();
			}
		}
	};
</script>

<style>
	.command-history {
		max-height: 300px;
		overflow-y: auto;
	}

	.received-messages {
		max-height: 300px;
		overflow-y: auto;
	}
</style>