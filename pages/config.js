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
				this.modifyBallConfig();
				break;
			default:
				console.error("Unknown operation type:", type);
				return;
		}

		//更新当前机器参数
		//判断训练是否已经开始，如果已经开始了，则更新指令，发送更新后的机器指令
	},

	updateBallConfig(params) {
		//获取当前球在ballConfig中的索引
		const index = -1,
			// 根据模式判断应该使用哪个球的参数
			if (this.selectedMode === 9) {
				// 模式 9，获取最后一个选中的球
				index = selectedBalls.length - 1;
			} else if ([2, 3, 4].includes(this.selectedMode)) {
			// 模式 2, 3, 4，获取所选的球
			index = this.selectedBall - 1; //
		} else {
			index = 0
		}

		//获取当前修改的参数
		this.machineConfigs[index] = params
	}