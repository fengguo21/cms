<style scoped>
	.table {
		/* padding-top: 20px; */
		text-align: center;
		background-color: #fff;
		max-width: 100%;
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
	
	.sort {
		text-align: center;
		padding: 15px 0;
		background-color: #fff;
	}
	
	.content {
		text-align: center;
		padding: 20px 20px;
		background-color: #fff;
	}
</style>
<template>
	<el-row>
		<el-row class="content">
			<el-row class="sort" type="flex" justify="start" :gutter="20">

				<el-col class="top_wrap" :span="12">
					<el-button type="primary" @click="add()">新增Icon</el-button>
					<el-button type="primary" @click="enableIcon()">启用</el-button>
					<el-button type="primary" @click="disableIcon()">关闭</el-button>
				</el-col>
				<el-col :span="12">
					<div>
						<span style="font-weight:bold">
                  启用选项:&nbsp;&nbsp;
                </span>
						<el-radio class="radio" v-model="chioce" label="0">图标启用</el-radio>
						<el-radio class="radio" v-model="chioce" label="1">IOS图片加载</el-radio>
						<el-radio class="radio" v-model="chioce" label="2">IOS动态图片</el-radio>
					</div>
				</el-col>

			</el-row>
			<el-row class="table" type="flex" justify="center">
				<el-col :span="18">
					<el-tabs>
						<el-tab-pane :key="key" :label="key|iconFileType" :name="key" v-for="(item, key, index) in iconList">
							<el-table align="center" :data="item" border style="width:100%;margin:auto" max-height="600" v-loading.body="loading" @selection-change="selectionChange">
								<el-table-column type="selection" width="55">
								</el-table-column>
								<el-table-column prop="id" label="ID" width="100">
								</el-table-column>
								<el-table-column label="图标ICON" min-width="170" align="center">
									<template scope="scope" style="margin:auto">
										<img :src="scope.row.path" style="width: 100px; height: 100px;margin:10px;padding:5px">
									</template>
								</el-table-column>
								<el-table-column label="是否原图" width="75">
									<template scope="scope">
										{{scope.row.type?'否':'是'}}
									</template>
								</el-table-column>
								<el-table-column label="启用状态" width="75">
									<template scope="scope">
										<span>{{scope.row.status |formatOpenType}}</span>
									</template>
								</el-table-column>
								<el-table-column label="IOS图片加载" width="75">
									<template scope="scope">
										<span>{{scope.row.urgentType?'失败':'成功' }}</span>
									</template>
								</el-table-column>
								<el-table-column label="IOS动态图片" width="75">
									<template scope="scope">
										<span>{{scope.row.isDynamic?'否':'是'}}</span>
									</template>
								</el-table-column>
								<el-table-column label="图标比率" min-width="75">
									<template scope="scope">
										<span>{{scope.row.ratio}}倍</span>
									</template>
								</el-table-column>
								<el-table-column label="创建时间" min-width="175">
									<template scope="scope">
										<span>{{scope.row.ctime|formatTime2}}</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" min-width="170">
									<template scope="scope">
										<el-button @click.native.prevent="edit(scope,index)" type="text" size="small">
											编辑
										</el-button>
										<el-button @click.native.prevent="disableIcon(scope.row.id)" type="text" size="small" v-if="scope.row.status==1">
											关闭
										</el-button>
										<el-button @click.native.prevent="move(scope.row.id,scope.store.states.data[scope.$index-1].id)" type="text" size="small" v-if="scope.$index > 0 ">
											上移
										</el-button>
										<el-button @click.native.prevent="move(scope.row.id,scope.store.states.data[scope.$index+1].id)" type="text" size="small" v-if="scope.$index < item.length - 1 ">
											下移
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-tab-pane>
					</el-tabs>
				</el-col>
			</el-row>
		</el-row>
		<el-dialog custom-class="iconDialog" v-model="dialogShow.dialogIconDetail" @close="closeDialog">
			<add-icon ref="addOrUpdateIcon" :imageUrls="imageUrls" :iconParam="iconDetail" @addIcon="recieveAdd"></add-icon>
			<template slot="title">
				<h2 style="display:inline-block">
              {{dialogTitle}}
            </h2>
			</template>
		</el-dialog>
	</el-row>
</template>
<script>
	import { mapGetters } from "vuex";
	import common from "../../common/common.js";
	import addIcon from "../../components/addIcon.vue";
	import * as filters from "../../filters/index.js";

	let param = {
		pn: 1,
		pSize: 100,
		type: 0,
		title: ""
	};
	//
	function fetchItem(store, val) {
		let cookie = val.cookie;
		var cookiesObj = {};
		cookie &&
			cookie.split(";").forEach(function(Cookie) {
				function Trim(str) {
					return str.replace(/(^\s*)|(\s*$)/g, "");
				}
				Cookie = Trim(Cookie);
				var parts = [];
				parts[0] = Cookie.substr(0, 3);
				parts[1] = Cookie.substr(4, Cookie.length);
				if(parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || "").trim();
			});
		let url = common.urlCommon + common.apiUrl.most;
		let body = {
			biz_module: "iconService",
			biz_method: "queryIconList",
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
			body.sign = common.getSign(
				"biz_module=" +
				body.biz_module +
				"&biz_method=" +
				body.biz_method +
				"&time=" +
				body.time
			);
		}
		// console.log("12333333333333333333333333",this.$store);
		return store.dispatch("getIconList", {
			body: body,
			path: url
		});
	}

	export default {
		name: "icon-view",
		data() {
			return {
				loading: false,
				// isIos: false,
				chioce: "0", //开启或关闭什么
				sv: true,
				httpParam: param,
				stateValue: "",
				dialogShow: {
					dialogIconDetail: false
				},
				state: [{
						label: "全部",
						value: ""
					},
					{
						label: "启用",
						value: "1"
					},
					{
						label: "未启用",
						value: "0"
					}
				],
				// iconTabs:[

				// ],
				iconDetail: {},
				iconIds: [],
				dialogTitle: "",
				imageUrls: []
			};
		},
		components: {
			addIcon
		},
		computed: {
			langConfig() {
				return require("../../i18n/" + this.$route.meta.lang + ".i18n.json");
			},
			iconList() {
				let list = this.$store.state.iconManager.allIcon.list;
				let iconFiles = {};
				for(let i = 0; i < list.length; i++) {
					let type = list[i];
					iconFiles[type.fileType] = type.path;
				}
				return iconFiles;
			},
			total() {
				return this.$store.state.iconManager.allIcon.total;
			}
		},
		created() {
			if(this.$store.state.iconManager.allIcon.list.length == 0) {
				this.getHttp();
			}
		},
		methods: {
			enableIcon() {
				this.updateIconStatus(1); //1为开启，0为关闭
			},
			disableIcon(id) {
				this.updateIconStatus(0); //1为开启，0为关闭
				if(id) {
					// 传入id则为单个关闭
					this.iconIds = [id];
				}
			},
			// 批量更改icon状态
			updateIconStatus(iconStatus) {
				console.log("1222344444444444444", iconStatus);
				if(this.iconIds.length == 0) {
					this.$message({
						message: "请选择至少一个图标！",
						type: "warning"
					});
				} else {
					let _self = this;
					this.loading = true;
					let url = common.urlCommon + common.apiUrl.most;
					let body = {
						biz_module: "iconService",
						biz_method: "updateIconStatus",
						biz_param: {
							idList: _self.iconIds,
							status: iconStatus,
							type: this.chioce
						}
					};
					// console.log("))))))))))))))))))))))))",!iconStatus);
					if(this.chioce == "1" || this.chioce == "2") {
						body.biz_param.status = iconStatus ? "0" : "1";
					}
					if(common.KEY) {
						url = common.addSID(url);
						body.version = 1;
						body.time = Date.parse(new Date()) + parseInt(common.difTime);
						body.sign = common.getSign(
							"biz_module=" +
							body.biz_module +
							"&biz_method=" +
							body.biz_method +
							"&time=" +
							body.time
						);
					}
					this.$store
						.dispatch("updateIconStatus", {
							body: body,
							path: url
						})
						.then(
							res => {
								this.$message({
									message: "更改状态成功！",
									type: "success"
								});
								_self.getHttp();
								_self.iconIds.length = 0;
								console.log("************************", _self);
							},
							err => {
								_self.loading = false;
							}
						);
				}
			},

			selectionChange(selection) {
				// console.log("1111111111111111111 selectionChange", selection);
				for(let i = 0; i < selection.length; i++) {
					this.iconIds[i] = selection[i].id;
				}
			},
			handleCurrentChange(val) {
				this.httpParam.pn = val;
				this.getHttp();
			},
			recieveAdd() {
				if(!this.iconDetail.id) this.httpParam.pn = 1;
				this.getHttp();
				// console.log("recieveAdd()", this.$refs.addIcon);
				this.dialogShow.dialogIconDetail = false;
			},
			getHttp() {
				let _self = this;

				this.loading = true;
				let url = common.urlCommon + common.apiUrl.most;
				let body = {
					biz_module: "iconService",
					biz_method: "queryIconList",
					biz_param: _self.httpParam
				};
				if(common.KEY) {
					url = common.addSID(url);
					body.version = 1;
					body.time = Date.parse(new Date()) + parseInt(common.difTime);
					body.sign = common.getSign(
						"biz_module=" +
						body.biz_module +
						"&biz_method=" +
						body.biz_method +
						"&time=" +
						body.time
					);
				}
				this.$store
					.dispatch("getIconList", {
						body: body,
						path: url
					})
					.then(
						() => {
							_self.loading = false;
						},
						() => {
							_self.loading = false;
						}
					);
			},
			// 编辑图标对象
			edit(scope, index) {
				this.dialogTitle = "编辑icon";
				let icon = scope.row;
				// this.iconDetail.id = icon.id;
				// this.iconDetail.iconList = this.iconList;
				// this.iconDetail.imgList = [icon.path];
				// // this.$nextTick(() => {
				// //   this.$refs.addOrUpdateIcon.imageUrls = [icon.path];
				// // });
				// this.iconDetail.type = String(icon.type);
				// this.iconDetail.fileType = filters.iconFileType(String(index));
				// this.iconDetail.keyName = "common";
				console.log("woshi bianji ---------", icon);
				this.dialogShow.dialogIconDetail = true;

				this.iconDetail = {
					id: icon.id,
					iconList: this.iconList,
					type: String(icon.type == "0" ? "1" : "0"),
					fileType: filters.iconFileType(String(index)),
					keyName: "common",
					fileTypeIndex: String(index),
					ratio: String(icon.ratio)
				};
				console.log("woshi iconDetail-----", this.iconDetail);
				this.imageUrls = [icon.path];
			},
			add() {
				this.dialogTitle = "新增icon";
				this.dialogShow.dialogIconDetail = true;
				this.iconDetail = {
					id: "",
					type: 0,
					// imgList: [],
					fileType: "",
					keyName: "common",
					ratio: "3",
					iconList: this.iconList
				};
				this.imageUrls = ["", "", "", "", "", "", "", ""];
			},

			// 移动，上移或下移，id:当前id；besideId：相邻行的id
			move(id, besideId) {
				if(this.loading) {
					this.$message({
						type: "info",
						message: "操作过快!!!"
					});
					return;
				}
				// && besideId !== 0

				// console.log("905462 9453923421389472`", id, besideId, this.iconList);
				if(id && besideId && id !== 0 && besideId !== 0) {
					this.isMakeToFlag = false;
					let _self = this;
					this.loading = true;
					let url = common.urlCommon + common.apiUrl.most;
					let body = {
						biz_module: "iconService",
						biz_method: "moveIconPosition",
						biz_param: {
							currentId: id,
							moveId: besideId
						}
					};
					// console.log("905462 __---------`", body.biz_param);
					this.loading = false;
					if(common.KEY) {
						url = common.addSID(url);
						body.version = 1;
						body.time = Date.parse(new Date()) + parseInt(common.difTime);
						body.sign = common.getSign(
							"biz_module=" +
							body.biz_module +
							"&biz_method=" +
							body.biz_method +
							"&time=" +
							body.time
						);
					}
					let obj = {
						body: body,
						path: url
					};
					this.$store.dispatch("iconUp", obj).then(
						() => {
							_self.httpParam.pn = 1;
							_self.getHttp();
						},
						() => {
							_self.loading = false;
						}
					);
				} else {
					this.$message({
						type: "error",
						message: "参数错误,请重试"
					});
					_self.loading = false;
				}
			},
			//关闭对话框时清空表单
			closeDialog() {
				// this.iconDetail = {};
				// this.$refs.addIcon.imageUrls = ["", "", "", "", "", "", "", "", "", ""];
			}
		},
		preFetch: fetchItem
	};
</script>