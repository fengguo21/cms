import httpService from '../../common/httpService'
const state = {
	teamMine: {
		list: []
	},
	companyHonor: {
		list: []
	}
}
const getters = {
	teamMine: state => state.teamMine,
	companyHonor:state=>state.companyHonor
}
const actions = {
	updateTeamMineState({
		commit,
		state
	}, param) {
		return new Promise((resolve, reject) => {
			httpService.commonPost(param.path, param.body,
				function(res) {
					resolve(res);
				},
				function(err) {
					reject(err);
				}
			)
		})
	},
	teamMineList({
		commit,
		state
	}, param) {
		return new Promise((resolve, reject) => {
			httpService.commonPost(param.path, param.body,
				function(res) {
					resolve(res);
					commit("initTeamMineList", res);
				},
				function(err) {
					reject(err);
				}
			)
		})
	},
	updateCompanyHonorState({
		commit,
		state
	},param){
		return new Promise((resolve,reject)=>{
			httpService.commonPost(param.path,param.body,
				function(res){
					resolve(res);
				},
				function(err){
					reject(err);
				}
			)
		})
	},
	companyHonorList({
		commit,
		state
	},param){
		return new Promise((resolve,reject)=>{
			httpService.commonPost(param.path,param.body,
				function(res){
					resolve(res);
					commit("initCompanyHonorList",res);
				},
				function(err){
					reject(err);
				}
			)
		})
	}
}
const mutations = {
	initTeamMineList(state, res) {
		state.teamMine = res.biz_result;
	},
	initCompanyHonorList(state,res){
		state.companyHonor=res.biz_result;
	}
}
export default {
	state,
	getters,
	actions,
	mutations
}