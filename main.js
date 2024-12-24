import {
	createSSRApp
} from 'vue'
import App from './App.vue'

export function createApp() {
	const app = createSSRApp(App)
	// 配置 Vue 警告处理
	// app.config.warnHandler = () => {} // 禁用所有警告
	// app.config.productionTip = false // 关闭生产模式提示
	return {
		app,
	}
}