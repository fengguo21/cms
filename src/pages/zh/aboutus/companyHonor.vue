<style scoped>
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

.sort {
    text-align: right;
    padding: 20px 0;
    padding-right: 100px;
    background-color: #fff;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <el-button type="primary" @click="add()" style="margin-left:50px">新增企业荣誉</el-button>
        </div>
        <div class="table">
            <el-table v-bind:data="companyHonorList" border style="
            width:1329px;margin:auto" max-height="600" v-loading.body="loading">
                <el-table-column prop="title" label="标题" width="400">
                </el-table-column>
                
                <el-table-column label="图片地址" width="400" max-height="300">
                    <template scope="scope">
                        <img :src="scope.row.imgUrl[0]">
                    </template>
                </el-table-column>
                <el-table-column prop="newsTime" label="时间" width="200">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="150">
                	<template scope="scope">
						{{scope.row.status==1?"可用":"不可用"}}
					</template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="open(scope.$index,1)" type="text" size="small">开启</el-button>
						<el-button @click="open(scope.$index,0)" type="text" size="small">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="企业荣誉" v-model="dialogShow.diaglogMediaDetail">
            <addCompanyHonor :companyHonorParam="companyHonorDetail" v-on:addMedia="recieveAdd">
            </addCompanyHonor>
        </el-dialog>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../../../common/common.js'
import addCompanyHonor from '../../../components/aboutus/addCompanyHonor.vue'

let param = {
    pn: 1,
    pSize: 10,
    type: 1,
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
        if (parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || '').trim();
    });
    let url = common.urlCommon + common.apiUrl.most;
    let body = {
        biz_module: 'newsService',
        biz_method: 'queryCompanyHonorList',
        biz_param: param
    };
    if (cookiesObj.SID) {
        common.SID = cookiesObj.SID;
        common.KEY = cookiesObj.KEY;
        common.difTime = val.time;
        url = common.addSID(url);
        body.version = 1;
        let localTime = new Date().getTime();
        body.time = localTime + common.difTime;
        body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
    }
    return store.dispatch('companyHonorList', {
        body: body,
        path: url
    });
}

export default {
    name: 'media-view',
    data() {
        return {
            loading: false,
            httpParam: param,
            dialogShow: {
                diaglogMediaDetail: false
            },
            companyHonorDetail: {
                id: '',
                type: 1,
                imgUrl: ['',''],
                title: '',
                newsTime: '',
                keyName: 'news'
            }
        }
    },
    components: {
        addCompanyHonor
    },
    computed: {
        langConfig() {
            return require('../../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        companyHonorList() {
            return this.$store.state.aboutus.companyHonor.list
        },
        total() {
            return this.$store.state.aboutus.companyHonor.list.length
        }
    },
    created() {
        if (this.$store.state.aboutus.companyHonor.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        open(index, status) {
				let idList = [this.companyHonorList[index].id];
				let _self = this;
				this.loading = true
				let url = common.urlCommon + common.apiUrl.most;
				let body = {
					biz_module: 'newsService',
					biz_method: 'updateCompanyHonorStatus',
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
				this.$store.dispatch('companyHonorList', {
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
            if (!this.companyHonorDetail.id) this.httpParam.pn = 1;
            this.getHttp();
            this.dialogShow.diaglogMediaDetail = false;
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
               biz_module: 'newsService',
                biz_method: 'queryCompanyHonorList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('companyHonorList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            this.companyHonorDetail.id = this.companyHonorList[index].id;
            this.companyHonorDetail.imgUrl = this.companyHonorList[index].imgUrl;
            this.companyHonorDetail.title = this.companyHonorList[index].title;
            this.companyHonorDetail.newsTime = this.companyHonorList[index].newsTime;
            this.companyHonorDetail.url = this.companyHonorList.imgUrl;
            this.dialogShow.diaglogMediaDetail = true;
        },
        add() {
            this.companyHonorDetail.id = '';
            this.companyHonorDetail.imgUrl = ['',''];
            this.companyHonorDetail.title = '';
            this.companyHonorDetail.newsTime = '';
            this.companyHonorDetail.url = '';
            this.dialogShow.diaglogMediaDetail = true;
        },
        
    },
    preFetch: fetchItem
}
</script>
