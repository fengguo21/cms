<style scoped>
	.image-wall {
		border: 1px solid #ccc;
		padding: 20px;
		width: 80%;
	}
	
	.image-col {
		display: inline-block;
		margin: 10px;
	}
</style>
<template>
	<div>
		<el-form ref="splashParam" :model="splashParam" :rules="rules" label-width="180px" v-loading.body="loading">
			<el-form-item label="启动图类型">
				<el-radio-group v-model="splashParam.type">
					<el-radio label="0">Android</el-radio>
					<!--<el-radio label="1">IOS</el-radio>-->
				</el-radio-group>
			</el-form-item>
			<el-form-item label="图片">
				<imageUpload :imgUrl="splashParam.imageList[0]" :param="splashParam" v-on:postUrl="recieveUrl"></imageUpload>
			</el-form-item>
			<el-form-item label="图片分辨率" prop="resolution">
				<el-input v-model="splashParam.resolution" placeholder="eg:720*1280"></el-input>
			</el-form-item>
			<el-form-item label="启动页面加载时间(s)" prop="stopTime">
				<el-input v-model="splashParam.stopTime" placeholder="eg:3"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('splashParam')">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import imageUpload from './imageUpload.vue';
	import common from '../common/common.js'
	import httpService from '../common/httpService'
	export default {
		data() {
			let _self = this;
			return {
				// sonIsNewAdd,
				loading: false,
				rules: {
					imgUrl: [{
						type: 'array',
						required: true,
						message: '请选择启动图片',
						trigger: 'blur'
					}],
					resolution: [{
						required: true,
						message: '请填写图片分辨率',
						trigger: 'blur'
					}],
					stopTime: [{
						required: true,
						message: '请填写加载时间',
						trigger: 'blur'
					}],
				}
			}
		},
		props: {
			splashParam: {
				default: null
			}
		},
		components: {
			imageUpload,
		},
		methods: {
			recieveUrl(val) {
				this.splashParam.imageList = [val.url];
				console.log(this.splashParam.imageList);
			},
			submitForm(formName) {
				let _self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						_self.loading = true;
						let url = common.urlCommon + common.apiUrl.most;
						let body = {
							biz_module: 'startIconService',
							biz_method: 'addStartIconImage',
							biz_param: {
								imageList: _self.splashParam.imageList,
								type: _self.splashParam.type,
								resolution: _self.splashParam.resolution,
								stopTime: _self.splashParam.stopTime,
							}
						}
						if(this.splashParam.id) {
							body = {
								biz_module: 'startIconService',
								biz_method: 'addStartIconImage',
								biz_param: {
									imageList: _self.splashParam.imageList,
									type: _self.splashParam.type,
									resolution: _self.splashParam.resolution,
									stopTime: _self.splashParam.stopTime
								}
							}
						}
						if(common.KEY) {
							url = common.addSID(url);
							body.version = 1;
							body.time = Date.parse(new Date()) + parseInt(common.difTime);
							body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
						}
						httpService.commonPost(url, body, function(res) {
							_self.loading = false;
							_self.$message({
								type: 'info',
								message: '操作成功'
							});
							_self.$emit("addSplash");

						}, function(err) {
							_self.loading = false;
						})
					} else {
						return false;
					}
				});
			}
		}
	}
</script>