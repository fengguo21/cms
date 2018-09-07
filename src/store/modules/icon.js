import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
const state = {
    allIcon: { list: [] },
}

// getters
const getters = {
    allIcon: state => state.allIcon,
}

// actions
const actions = {
    getIconList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function (res) {
                    resolve(res);
                    commit('initIconList', res);
                },
                function (err) {
                    reject(err);
                })
        })
    },
    addIcon({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function (res) {
                    resolve(res);
                    commit();
                }
            )
        })
    },
    updateIconStatus({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function (res) {
                    resolve(res);
                    // commit("");
                })
        })
    },
    iconUp({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function (res) {
                    resolve(res);
                },
                function (err) {
                    reject(err);
                })
        })
    }

}

// mutations
const mutations = {
    initIconList(state, res) {
        // for (let i = 0; i < res.biz_result.list.length; i++) {
        //     let item = res.biz_result.list[i];
        //     item.state = config.iconState[item.state]
        //     console.log("icon的图标管理",item);
        // }
        console.log("icon的图标管理", state, res);
        state.allIcon = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
