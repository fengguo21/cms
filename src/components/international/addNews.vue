<!-- /**
 * 
 * @authors DEAN hxj (xxxxxxx@delibal)
 * @date    2018-06-05 17:14:35
 * @version $Id$
 */

 -->
<style>
</style>
<template>
    <div>
        <el-dialog  :title="title" v-model="param.show" :show-close="false" :close-on-click-modal="false">
            <div style="margin:2% 0;">
                <div style="margin:2% 0;">
                    <span style="margin-right: 20px;display:inline-block;">新闻标题</span>
                    <el-input style="width: 80%; margin-right: 20px;" v-model="newsParam.name" placeholder="请输入新闻标题"></el-input>
                </div>
                <div style="margin:2% 0;">
                    <span style="margin-right: 20px;display:inline-block;">发布时间</span>
                    <el-date-picker v-model="newsParam.time" type="datetime" placeholder="选择发布日期时间">
                    </el-date-picker>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:70%">
                    <span style="margin-right: 20px;float:left">新闻简介</span>
                    <el-input style="display:inline-block;width:80%;" type="textarea" :rows="7" resize="none" placeholder="请输入内容" v-model="newsParam.intro">
                    </el-input>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:100%">
                    <span style="margin-right: 35px;padding-left:7px;float:left">新闻图片</span>
                    <imageUpload :imgUrl="httpParam.Img" :param='httpParam' v-on:postUrl="recieveUrlHotImg"></imageUpload>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:100%">
                    <span style="margin-right: 35px;padding-left:7px;float:left">新闻详情</span>
                    <!-- <imageUpload :imgUrl="detailParam.img"  :param='detailParam' v-on:postUrl="recieveImg"></imageUpload> -->
                    <el-button type="primary"  size="small" @click="toTiny()">编辑详情</el-button>
                </div>
            </div>
            <div style="float:right;margin:2%;">
                <el-button type="warning"  size="small" @click="cancel()">取消</el-button>
                <el-button type="success" :disabled="validate!='1'" v-if="flag=='1'" size="small" @click="http()">确认新建</el-button>
                <el-button type="success" :disabled="validate!='1'" v-if="flag=='2'" size="small" @click="editHttp()">确认编辑</el-button>
            </div>
        </el-dialog>
          <tinymce :param="tinyParam" @received="getData" v-if="tinyParam.show"></tinymce>
    </div>
</template>
<script>
import imageUpload from '../imageUpload.vue';
import httpServer from '../../common/newHttp'
import tinymce from '../tinymce.vue'
import tools from '../../common/tools'
export default {
    data() {
        return {
            name: '',
            title:'新建新闻',
            newsParam: {
                name: '',
                time: '',
                intro: ''
            },
            httpParam: {
                Img: '',
                id: '',
                keyName: 'news',
            },
            detailParam: {
                img: '',
                id: '',
                keyName: 'news',
            },
            tinyParam:{
                show:false,
                content:''
            }
        }
    },
    computed:{
         validate: function () {
            var pass= 1;
            if(this.newsParam.name=='' ||this.newsParam.time==''||this.newsParam.intro==''||this.httpParam.Img==''||this.tinyParam.content==''){
                pass=2;
            }
      return pass ;
    }
    },
    props: ['param','flag'],
    components: {
        imageUpload,
        tinymce
    },
    methods: {
        toTiny(){
            this.tinyParam.show=true;
        },
        getData(data){
            this.tinyParam.content=data;
           console.log("阿斯达克啥活动",this.tinyParam.content)
        },
        cancel(){
            this.param.show=false;
        },
        recieveUrlHotImg(val) {
            this.httpParam.Img = val.url;
        },
        recieveImg(val) {
            this.detailParam.img = val.url;
        },
        http() {
            let url = "/news/api/intlNewsService/addIntlNews";
            let data = {};
            data.title = this.newsParam.name;
            data.newsTime =tools.parseDate(this.newsParam.time);
            data.intro = this.newsParam.intro;
            data.imgUrl = this.httpParam.Img;
            data.newsDetail = this.tinyParam.content;
            httpServer.commonAxiosPost(url, data).then(suc => {
                if (suc.code != 200) {
                    this.$message.error(suc.msg);
                } else {
                    this.$message.success(suc.msg);
                    this.param.show=false;
                    this.$emit("add-back")
                }
            }, err => {
                console.log(err);
            })
        },
        editHttp(){
            let url = "/news/api/intlNewsService/updateIntlNews";
            let data = {};
            data.id=this.param.id;
            data.title = this.newsParam.name;
            data.newsTime =this.newsParam.time;
            data.intro = this.newsParam.intro;
            data.imgUrl = this.httpParam.Img;
            data.newsDetail = this.tinyParam.content;
            httpServer.commonAxiosPost(url, data).then(suc => {
                if (suc.code != 200) {
                    this.$message.error(suc.msg);
                } else {
                    this.$message.success(suc.msg);
                    this.param.show=false;
                    this.$emit("edit-back")
                }
            }, err => {
                console.log(err);
            }) 
        }
    },
    created(){
        if(this.flag==2){
            this.title="编辑新闻";
            this.newsParam.name=this.param.title;
            this.newsParam.intro=this.param.intro;
            this.newsParam.time=this.param.ctime;
            this.httpParam.Img=this.param.imgUrl;
            this.tinyParam.content=this.param.newsDetail;
        }
    }
}
</script>