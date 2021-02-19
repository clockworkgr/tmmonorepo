import { createStore, createLogger } from 'vuex'
import init from './config'

const store = createStore({
	state() {
		return {}
	},
	mutations: {},
	actions: {},
	chain: {},
	plugins: [createLogger()]
})
init(store)
export default store
