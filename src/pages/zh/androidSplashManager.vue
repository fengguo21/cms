<style scoped>
	.newAdd {
		text-align: right;
		padding: 20px 0;
		padding-right: 100px;
		background-color: #fff;
	}
	
	.table {
		padding-top: 20px;
		text-align: center;
		background-color: #fff;
	}
	
	.table img {
		max-width: 100%;
		vertical-align: bottom;
	}
	
	.table a {
		color: blue;
	}
	
	.pagination {
		text-align: center;
		background-color: white;
		padding: 20px;
	}
</style>
<template>
	<div class="content">
		<div class="newAdd">
			<el-button type="primary" @click="add()" style="margin-left:50px">新增启动图</el-button>
		</div>
		<div class="table">
			<el-table :data="splashData" border style="width: 1150px; margin:auto" max-height="600" v-loading.body="loading">
				<el-table-column prop="ctime" label="时间" width=180>
				</el-table-column>
				<el-table-column prop="description" label="描述" width=160>
				</el-table-column>
				<el-table-column label="图片" width=200>
					<template slot-scope="scope">
						<img :src="scope.row.path" width="150px" />
					</template>
				</el-table-column>
				<el-table-column prop="stopTime" label="展示时长（s）" width=140></el-table-column>
				<el-table-column prop="resolution" label="分辨率" width=120></el-table-column>
				<el-table-column prop="jumpUrl" label="app跳转url" width=180></el-table-column>
				<el-table-column prop="status" label="状态" width=80>
					<template scope="scope">
						{{scope.row.status==1?"可用":"不可用"}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button @click.native.prevent="openSplash(scope.$index,1)" type="text" size="small">开启</el-button>
						<el-button @click="openSplash(scope.$index,0)" type="text" size="small">关闭</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="pagination">
			<el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-dialog title="banner" v-model="dialogShow.diaglogMediaDetail">
			<addAndroidSplash :splashParam="splashDetail" v-on:addSplash="recieveAdd">
			</addAndroidSplash>
		</el-dialog>
	</div>

</template>
<script>
	import {
		mapGetters
	} from 'vuex'
	import common from '../../common/common.js'
	import addAndroidSplash from '../../components/addAndroidSplash.vue'
	let param = {
		pn: 1,
		pSize: 10,
		type: "0",// 0/1 android/ios
		cmsType:0,//cms专用参数
	};

	function fetchItem(store, val) {
		let cookie = val.cookie;
		var cookiesObj = {};
		cookie && cookie.split(';').forEach(function(Cookie) {
			function Trim(str) {
				return str.replace(/(^\s*)|(\s*$)/g, "");
			}
			Cookie = Trim(Cookie);
			var parts = [];
			parts[0] = Cookie.substr(0, 3);
			parts[1] = Cookie.substr(4, Cookie.length);
			if(parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || '').trim();
		});
		let url = common.urlCommon + common.apiUrl.most;
		let body = {
			biz_module: 'startIconService',
			biz_method: 'queryStartIcon',
			biz_param: param
		};
		if(cookiesObj.SID) {
			common.SID = cookiesObj.SID;
			common.KEY = cookiesObj.KEY;
			common.difTime = val.time;
			url = common.addSID(url);
			body.version = 1;
			let localTime = new Date().getTime();
			body.time = localTime + common.difTime;
			body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
		}
		return store.dispatch('getAndroidSplashList', {
			body: body,
			path: url
		});
	}
	export default {
		data() {
			return {
				splashDetail: {
					id: 0,
					imageList: [],
					type: "0",
					resolution: "0",
					stopTime: 0,
					keyName: 'common'
				},
				//				splashData: [{
				//					path: "http://icon.image.yaocaimaimai.com/adroidstart1.png",
				//					utime: "",
				//					ctime: "2018-04-17 14:03:44.0",
				//					description: "安卓请求图片",
				//					stopTime: 3,
				//					id: 1,
				//					type: 0,
				//					resolution: "720*1040",
				//					jumpUrl: "",
				//					status: 1
				//				}],
				dialogShow: {
					diaglogMediaDetail: false
				},
				loading: false,
				httpParam: param,
			}
		},
		components: {
			addAndroidSplash
		},
		computed: {
			langConfig() {
				return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
			},
			splashData() {
				//				console.log(this.$store.state.splash.androidSplashList);
				return this.$store.state.splash.androidSplashList.list;
			},
			total() {
				console.log(this.$store.state.splash.androidSplashList.list);
				return this.$store.state.splash.androidSplashList.list.length;
			}
		},
		created() {
			if(this.$store.state.splash.androidSplashList.list.length == 0) {
				this.getHttp();
			}
		},
		methods: {
			add() {
				this.splashDetail.id = 0;
				this.splashDetail.imageList = [];
				this.splashDetail.type = "0";
				this.splashDetail.resolution = '';
				this.splashDetail.stopTime = 0;

				this.dialogShow.diaglogMediaDetail = true;
				this.splashDetail = {
					id: 0,
					imageList: [],
					type: "0",
					resolution: '',
					stopTime: 0,
					keyName: 'common'
				};
			},
			handleClick(row) {
				//管理启动图
			},
			openSplash(index, status) {
				let idList = [this.splashData[index].id];
				let _self = this;
				this.loading = true
				let url = common.urlCommon + common.apiUrl.most;
				let body = {
					biz_module: 'startIconService',
					biz_method: 'updateStartIconStatus',
					biz_param: {
						idList: idList,
						status: status
					}
				}
				if(common.KEY) {
					url = common.addSID(url);
					body.version = 1;
					body.time = Date.parse(new Date()) + parseInt(common.difTime);
					body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
				}
				this.$store.dispatch('getAndroidSplashList', {
					body: body,
					path: url
				}).then(() => {
					_self.$message({
						type: 'info',
						message: '修改成功'
					});
					_self.getHttp();
				}, () => {
					_self.loading = false;
				});
			},
			handleCurrentChange(val) {
				this.httpParam.pn = val;
				this.getHttp();
			},
			recieveAdd() {
				if(!this.splashDetail.id) this.httpParam.pn = 1;
				this.getHttp();
				this.dialogShow.diaglogMediaDetail = false;
			},
			getHttp() {
				let _self = this;
				this.loading = true
				let url = common.urlCommon + common.apiUrl.most;
				let body = {
					biz_module: 'startIconService',
					biz_method: 'queryStartIcon',
					biz_param: _self.httpParam
				}
				if(common.KEY) {
					url = common.addSID(url);
					body.version = 1;
					body.time = Date.parse(new Date()) + parseInt(common.difTime);
					body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
				}
				this.$store.dispatch('getAndroidSplashList', {
					body: body,
					path: url
				}).then(() => {
					_self.loading = false
				}, () => {
					_self.loading = false
				});
			},
		},
		preFetch: fetchItem
	}
</script>