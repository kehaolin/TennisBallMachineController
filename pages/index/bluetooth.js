export default {
	data() {
		return {
			showBluetoothPopup: false,
			bluetoothDevices: [],
			connectedDeviceId: null,
			deviceId: null,
			batteryLevel: null,
			launcherVersion: null,
			launcherPosition: null,
			isAnyDeviceConnected: false,
			isManualDisconnect: false,
			reconnecting: false,
			pendingCommand: null,
			batteryTimer: null,
			hasShownPermissionDialog: false,
			hasShownPermissionDialog: false,
			_state: 0,// 设备状态,
		};
	},
	methods: {
		openBluetoothPopup() {
			this.showBluetoothPopup = true; // 显示蓝牙弹窗
			if (!this.hasShownPermissionDialog) {
				// 如果未展示过权限声明弹窗，则显示并设置标记
				this.showLocationPermissionDialog(() => {
					this.hasShownPermissionDialog = true; // 标记为已展示
					this.openBluetoothAdapter();
				});
			} else {
				// 已展示过权限声明弹窗，直接初始化蓝牙
				this.openBluetoothAdapter();
			}
		},

		// 初始化蓝牙
		openBluetoothAdapter() {
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
						title: '蓝牙初始化失败，请检查设备设置',
						icon: 'none',
						duration: 2000
					});
				}
			});
		},

		// 显示位置权限声明弹窗
		showLocationPermissionDialog(callback) {
			uni.showModal({
				title: '权限说明',
				content: '蓝牙功能需要获取您的位置信息权限，以便扫描并连接附近的蓝牙设备。该信息仅用于蓝牙功能，不会保存或上传您的位置信息。',
				confirmText: '同意',
				cancelText: '拒绝',
				success: (res) => {
					if (res.confirm) {
						console.log('用户同意位置权限声明');
						if (typeof callback === 'function') callback(); // 执行回调
					} else {
						console.log('用户拒绝位置权限声明');
						uni.showToast({
							title: '需要位置信息权限以使用蓝牙功能',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},

		// ------

		// 提示用户开启蓝牙权限
		promptBluetoothPermission() {
			uni.showModal({
				title: '蓝牙权限请求失败',
				content: '请开启蓝牙权限后重试。',
				success: (res) => {
					if (res.confirm) {
						// 提示用户前往设置页面手动授权
						this.openAppSettings();
					}
				}
			});
		},

		// 打开应用设置页面，引导用户手动授权
		openAppSettings() {
			uni.openSetting({
				success: (res) => {
					console.log('用户授权设置：', res);
					if (res.authSetting['scope.bluetooth']) {
						// 用户已授权，重新初始化蓝牙
						this.reopenBluetoothAdapter();
					} else {
						uni.showToast({
							title: '未授权蓝牙权限',
							icon: 'none',
							duration: 2000
						});
					}
				}
			});
		},

		// 重新拉起蓝牙授权
		reopenBluetoothAdapter() {
			uni.openBluetoothAdapter({
				success: (res) => {
					console.log('蓝牙模块初始化成功', res);
					this.checkBluetoothState();
					this.setupBluetoothListeners();
				},
				fail: (err) => {
					console.log('蓝牙模块初始化失败', err);
					uni.showToast({
						title: this.getTranslation('bluetoothInitFailed'),
						icon: 'none',
						duration: 2000
					});
				}
			});
		},


		// 关闭蓝牙弹窗
		closeBluetoothPopup() {
			this.showBluetoothPopup = false;
		},
		// 完成蓝牙连接
		completeBluetoothConnection() {
			this.showBluetoothPopup = false;
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
				// 判断返回数据是否包含 'ok' 字符串
				if (batteryData.includes('ok')) {
					// 电池数据格式: RS_Bat=ok,0
					const batteryLevel = batteryData.split(',')[1]; // 获取'0'这个值
					console.log('电池电量:', batteryLevel);
					this.batteryLevel = batteryLevel;
				} else {
					console.log('获取电池电量失败，返回数据格式错误:', batteryData);
				}
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

		// 状态检查方法
		getMotors(type) { return (this._state & type) !== 0; },
		getBattery(type) { return (this._state & type) === 0; },
		get(type) { return type >= 0x0100 ? this.getBattery(type) : this.getMotors(type); },
		isOK() { return (this._state & 0x00ff) === 0xff && (this._state & 0xff00) === 0; },
		
		// 状态码对应的错误提示
		getErrorMessage(state) {
			const errors = [];
			if (state & 0x01) errors.push('转盘异常');
			if (state & 0x02) errors.push('方位角传感器异常');
			if (state & 0x04) errors.push('仰角传感器异常');
			if (state & 0x08) errors.push('上发球轮异常');
			if (state & 0x0f) errors.push('下发球轮异常');
			if (state & 0x0100) errors.push('电池高温');
			if (state & 0x0200) errors.push('电池过流');
			if (state & 0x0400) errors.push('电池低电压');
			if (state & 0x0800) errors.push('电池低电量');
			if (state & 0x0f00) errors.push('电池关机');
			return errors.length ? errors.join('，') : '设备状态正常';
		},
				
		// 监听并处理异常状态
	// 监听并处理异常状态
	handleDeviceState(state) {
	  console.log('state:', state);
	  console.log(this.trainingActive); // 检查 isTrainingActive 的状态
	  
	  this._state = state;
	  const errorMessage = this.getErrorMessage(state);
	
	  if (errorMessage) {
	    uni.showToast({
	      title: `设备异常: ${errorMessage}`,
	      icon: 'none',
	      duration: 3000
	    });
	
	    // 判断父组件是否处于训练状态，如果是，则终止训练
	    if (this.trainingActive) {  // 使用 this 直接访问 isTrainingActive
	      this.endTraining(); // 触发父组件事件
	    }
	  }
	},

		
		// 发送蓝牙指令
			sendBLEData(command, onSuccess) {
				if (!this.connectedDeviceId) {
					console.log('未找到有效的连接设备');
					return;
				}
	
				const serviceId = '55535343-FE7D-4AE5-8FA9-9FAFD205E455';
				const characteristicId = '49535343-1E4D-4BD9-BA61-23C647249616';
	
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
						this.pendingCommand = { command, onSuccess };
					},
					fail: (err) => {
						console.log('发送数据失败', err);
						uni.showToast({ title: '蓝牙发送失败', icon: 'none', duration: 2000 });
					}
				});
			},
	
			// 监听蓝牙数据接收
			receiveBLEData() {
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: this.deviceId,
					serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
					characteristicId: '49535343-8841-43F4-A8D4-ECBE34729BB3',
					success: () => { console.log('成功启用接收通知'); },
					fail: (err) => {
						console.log('启用接收通知失败', err);
						uni.showToast({ title: '启用接收通知失败', icon: 'none', duration: 2000 });
					}
				});
	
				uni.onBLECharacteristicValueChange((res) => {
					let data = String.fromCharCode.apply(null, new Uint8Array(res.value));
					console.log('接收到的数据:', data);
	
					if (data.startsWith('RS_State=-3')) {
						let state = parseInt(data.split('=')[1], 10);
						this.handleDeviceState(state);
					} else if (this.pendingCommand && this.pendingCommand.onSuccess) {
						this.pendingCommand.onSuccess(data);
						this.pendingCommand = null;
					}
				});
			},
		
		// // 统一发送蓝牙指令的方法
		// sendBLEData(command, onSuccess) {
		// 	if (!this.connectedDeviceId) {
		// 		console.log('未找到有效的连接设备');
		// 		return;
		// 	}

		// 	const serviceId = '55535343-FE7D-4AE5-8FA9-9FAFD205E455';
		// 	const characteristicId = '49535343-1E4D-4BD9-BA61-23C647249616';

		// 	// 将字符串命令转换为 ArrayBuffer
		// 	let buffer = new ArrayBuffer(command.length);
		// 	let dataview = new DataView(buffer);
		// 	for (let i = 0; i < command.length; i++) {
		// 		dataview.setUint8(i, command.charCodeAt(i));
		// 	}

		// 	uni.writeBLECharacteristicValue({
		// 		deviceId: this.deviceId,
		// 		serviceId,
		// 		characteristicId,
		// 		value: buffer,
		// 		success: (res) => {
		// 			console.log('发送数据成功', res);
		// 			// 成功发送后，等待回调接收数据
		// 			this.pendingCommand = {
		// 				command,
		// 				onSuccess
		// 			}; // 保存当前命令和回调
		// 		},
		// 		fail: (err) => {
		// 			console.log('发送数据失败', err);
		// 			uni.showToast({
		// 				title: this.getTranslation('bluetoothSendDataFailed'),
		// 				icon: 'none',
		// 				duration: 2000
		// 			});
		// 		}
		// 	});
		// },

		// // 接收蓝牙数据的方法
		// receiveBLEData() {
		// 	uni.notifyBLECharacteristicValueChange({
		// 		state: true,
		// 		deviceId: this.deviceId,
		// 		serviceId: '55535343-FE7D-4AE5-8FA9-9FAFD205E455',
		// 		characteristicId: '49535343-8841-43F4-A8D4-ECBE34729BB3',
		// 		success: () => {
		// 			console.log('成功启用接收通知');
		// 		},
		// 		fail: (err) => {
		// 			console.log('启用接收通知失败', err);
		// 			uni.showToast({
		// 				title: this.getTranslation('enableReceiveNotifyFailed'),
		// 				icon: 'none',
		// 				duration: 2000
		// 			});
		// 		}
		// 	});

		// 	// 监听蓝牙设备数据变化
		// 	uni.onBLECharacteristicValueChange((res) => {
		// 		let data = String.fromCharCode.apply(null, new Uint8Array(res.value));
		// 		console.log('接收到的数据:', data);

		// 		// 如果有待处理的命令且存在对应的成功回调
		// 		if (this.pendingCommand && this.pendingCommand.onSuccess) {
		// 			// 执行回调函数并传入接收到的数据
		// 			this.pendingCommand.onSuccess(data);
		// 			this.pendingCommand = null; // 清除待处理的命令
		// 		}
		// 	});
		// },

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

	}
};