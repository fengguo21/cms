<style scoped>

</style>
<template>
    <div>
        <el-form ref="teamMineParam" :model="teamMineParam" :rules="rules" label-width="80px" v-loading.body="loading">
            <el-form-item label="标题" prop="title">
                <el-input v-model="teamMineParam.title"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imgUrl">
                <imageUpload :imgUrl="teamMineParam.imgUrl" :param="teamMineParam" v-on:postUrl="recieveUrl"></imageUpload>
            </el-form-item>
            <el-form-item label="时间" >
            	<el-date-picker type="date" placeholder="选择日期" @change="getDate" value-format="yyyy-MM-dd" v-model="teamMineParam.newsTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
                <el-input type="textarea" v-model="teamMineParam.intro"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('teamMineParam')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import imageUpload from '../imageUpload.vue';
    import common from '../../common/common.js'
    import httpService from '../../common/httpService'
    export default {
        data() {
            let _self = this;
            return {
                // sonIsNewAdd,
                loading: false,
                formatDate:'',//临时保存时间
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
//                  newsTime:[{
//                  	type:'date',
//                  	required:true,
//                  	message:'请选择活动时间',
//                  	trigger:'blur'
//                  }],
                    intro: [{
                        required: true,
                        message: '请选择活动图片',
                        trigger: 'blur'
                    }]
                }
            }
        },
        props: {
            teamMineParam: {
                default: null
            }
        },
        components: {
            imageUpload
        },
        methods: {
        	getDate(val){
        		this.formatDate=val;
        	},
            recieveUrl(val) {
                this.teamMineParam.imgUrl = val.url;
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.loading = true;
                        if(this.formatDate){
                        	_self.teamMineParam.newsTime = this.formatDate;
                        }
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'newsService',
                            biz_method: 'addCompanyHonor',
                            biz_param: {
                                type: _self.teamMineParam.type,
                                imgUrl: _self.teamMineParam.imgUrl,
                                title: _self.teamMineParam.title,
                                intro: _self.teamMineParam.intro,
                                newsTime:_self.teamMineParam.newsTime
                            }
                        }
                        if (this.teamMineParam.id) {
                            body = {
                                biz_module: 'newsService',
                                biz_method: 'updateCompanyHonor',
                                biz_param: {
                                    id: _self.teamMineParam.id,
                                    type: _self.teamMineParam.type,
                                    imgUrl: _self.teamMineParam.imgUrl,
                                    title: _self.teamMineParam.title,
                                    intro: _self.teamMineParam.intro,
                                    newsTime: _self.teamMineParam.newsTime
                                }
                            }
                        }
                        if (common.KEY) {
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