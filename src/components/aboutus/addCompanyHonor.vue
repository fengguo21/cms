<style scoped>
	.content {
		width: 80%;
	}
	
	.companyHonorImg {
		width: 40%;
	}
	
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
	<div class="content">
		<el-form ref="companyHonorParam" :model="companyHonorParam" :rules="rules" label-width="80px" v-loading.body="loading">
			<el-form-item label="标题" prop="title">
				<el-input v-model="companyHonorParam.title"></el-input>
			</el-form-item>
			<!--<el-form-item label="图片" prop="imgUrl">
				<imageUpload class="companyHonorImg" :imgUrl="companyHonorParam.imgUrl[0]" :param="companyHonorParam" v-on:postUrl="recieveUrl"></imageUpload>
			</el-form-item>-->
			<el-form-item label="图片:">
				<el-row :gutter="10" class="image-wall" style="flex" justify="start">
					<span class="image-col" v-for="(item,index) in (companyHonorParam.imgUrl.length > 2 ? companyHonorParam.imgUrl.length : 2)">
                    <uploadImageWall :index="index" :imgUrl="companyHonorParam.imgUrl[index]" :iconParam="companyHonorParam" @postUrl="recieveUrl">
                    </uploadImageWall>
                  </span>
				</el-row>
			</el-form-item>

			<el-form-item label="时间">
				<el-date-picker type="date" value-format="yyyy-MM-dd" @change="getDate" placeholder="选择日期" v-model="companyHonorParam.newsTime" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('companyHonorParam')">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import uploadImageWall from "../imageWallUpload.vue";
	import common from '../../common/common.js'
	import httpService from '../../common/httpService'
	export default {
		data() {
			let _self = this;
			return {
				// sonIsNewAdd,
				loading: false,
				formatDate: '',
				rules: {
					title: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					imgUrl: [{
						required: true,
						message: '请选择活动图片',
						trigger: 'blur'
					}],
					//					newsTime:[{
					//						type:'date',
					//						required:true,
					//						message:'请选择活动时间',
					//						trigger:'change'
					//					}]
				}
			}
		},
		props: {
			companyHonorParam: {
				default: null
			},
		},
		components: {
			uploadImageWall
		},
		methods: {
			getDate(val) {
				this.formatDate = val;
				console.log("时间getDate：：：：" + this.formatDate);
			},
			recieveUrl(val) {
      			this.companyHonorParam.imgUrl.splice(val.index, 1, val.url);
    		},
			submitForm(formName) {
				let _self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						_self.loading = true;
						_self.companyHonorParam.newsTime = this.formatDate;
						let url = common.urlCommon + common.apiUrl.most;
						let body = {
							biz_module: 'newsService',
							biz_method: 'addCompanyHonor',
							biz_param: {
								type: _self.companyHonorParam.type,
								imgUrl: _self.companyHonorParam.imgUrl,
								title: _self.companyHonorParam.title,
								newsTime: _self.companyHonorParam.newsTime,
							}
						}
						if(this.companyHonorParam.id) {
							body = {
								biz_module: 'newsService',
								biz_method: 'updateCompanyHonor',
								biz_param: {
									id: _self.companyHonorParam.id,
									type: _self.companyHonorParam.type,
									imgUrl: _self.companyHonorParam.imgUrl,
									title: _self.companyHonorParam.title,
									newsTime: _self.companyHonorParam.newsTime,
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
							_self.$emit("addMedia");

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