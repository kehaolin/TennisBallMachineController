// config.js
export default {
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
			en: 'Selected Height'
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
	modeConfig: {
		0: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		},
		1: {
			ballCount: 2,
			positions: [
				[2, 2],
				[3, 4]
			]
		},
		2: {
			ballCount: 2,
			positions: [
				[2, 0],
				[2, 4]
			]
		},
		3: {
			ballCount: 2,
			positions: [
				[0, 2],
				[3, 2]
			]
		},
		4: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		},
		5: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		},
		6: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		},
		7: {
			ballCount: 20,
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
				[3, 4]
			]
		},
		8: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		},
		9: {
			ballCount: 1,
			positions: [
				[2, 2]
			]
		}
	},
	modeParams: [{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '',
			angle: 20
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '中',
			angle: null
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '',
			angle: 30
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '中',
			angle: null
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '',
			angle: 30
		},
		{
			frequency: 7,
			speed: 50,
			rotate: 0,
			heights: '',
			angle: 30
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '中',
			angle: null
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '',
			angle: null
		},
		{
			frequency: 7,
			speed: 20,
			rotate: 0,
			heights: '',
			angle: 30
		},
		{
			frequency: 7,
			speed: 80,
			rotate: 0,
			heights: '',
			angle: 30
		}
	]
};