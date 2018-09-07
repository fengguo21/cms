import httpService from '../../common/httpService'

const state = {
	androidSplashList: {
		list: []
	},
	iosSplashList: {
		list: []
	}
}

// getters
const getters = {
	androidSplashList: state => state.androidSplashList,
	iosSplashList: state => state.iosSplashList,
}

// actions
const actions = {
	getAndroidSplashList({
		commit,
		state
	}, param) {
		return new Promise((resolve, reject) => {
			httpService.commonPost(param.path, param.body,
				function(res) {
					commit('initAndroidSplashList', res);
					resolve(res);
				},
				function(err) {
					reject(err);
				})
		})
	},
	getIosSplashList({
		commit,
		state
	}, param) {
		return new Promise((resolve, reject) => {
			httpService.commonPost(param.path, param.body,
				function(res) {
					commit('initIosSplashList', res);
					resolve(res);
				},
				function(err) {
					reject(err);
				})
		})
	},
}

// mutations
const mutations = {
	initAndroidSplashList(state, res) {
		state.androidSplashList = res.biz_result;
	},
	initIosSplashList(state, res) {
		state.iosSplashList = res.biz_result;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}