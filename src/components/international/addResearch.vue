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
        <el-dialog style="width: 98%; margin: auto" :title="title" v-model="param.show" :show-close="false" :close-on-click-modal="false">
            <div style="margin:2% 0;">
                <div style="margin:2% 0;">
                    <span style="margin-right: 20px;display:inline-block;">研发标题</span>
                    <el-input style="width: 80%; margin-right: 20px;" v-model="researchParam.name" placeholder="请输入研发标题"></el-input>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:70%">
                    <span style="margin-right: 20px;float:left">研发简介</span>
                    <el-input style="display:inline-block;width:80%;" type="textarea" :rows="7"  resize="none" placeholder="请输入内容" v-model="researchParam.intro">
                    </el-input>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:100%">
                    <span style="margin-right: 35px;padding-left:7px;float:left">研发图片</span>
                     <imageUpload :imgUrl="httpParam.hotImg" :param='httpParam' v-on:postUrl="recieveUrlHotImg"></imageUpload>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:100%">
                    <span style="margin-right: 35px;padding-left:7px;float:left">研发详情</span>
                   <!--  <imageUpload :imgUrl="detailParam.img"  :param='detailParam' v-on:postUrl="recieveImg"></imageUpload> -->
                   <el-button type="primary"  size="small" @click="toTiny()">编辑详情</el-button>
                </div>
            </div>
            <div style="float:right;margin:2%;">
               <el-button type="warning"  size="small" @click="cancel()">取消</el-button>
                <el-button type="success" v-if="flag=='1'" :disabled="validate!='1'" size="small" @click="http">确认新建</el-button>
                 <el-button type="success" v-if="flag=='2'" :disabled="validate!='1'" size="small" @click="editHttp">确认编辑</el-button>
            </div>
        </el-dialog>
        <tinymce :param="tinyParam" @received="getData" v-if="tinyParam.show"></tinymce>
    </div>
</template>
<script>
import imageUpload from '../imageUpload.vue';
import tinymce from '../tinymce.vue'
import httpServer from '../../common/newHttp'
export default {
    data() {
        return {
            title: '新建研发',
            researchParam: {
                name: '',
                time: '',
                intro: ''
            },
            httpParam: {
                hotImg: '',
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
    props: ['param','flag'],
    components: {
        imageUpload,
        tinymce
    },
    computed:{
         validate: function () {
            var pass= 1;
            if(this.researchParam.name=='' ||this.researchParam.intro==''||this.httpParam.Img==''||this.tinyParam.content==''){
                pass=2;
            }
      return pass ;
    }
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
            this.httpParam.hotImg = val.url;
        },
        recieveImg(val) {
            this.detailParam.img = val.url;
        },
        http() {
            let url = "/develop/api/intlDevelopService/addIntlDevelop";
            let data = {};
            data.title = this.researchParam.name;
            data.intro = this.researchParam.intro;
            data.imgUrl = this.httpParam.hotImg;
            data.detail = this.tinyParam.content;
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
        editHttp() {
            let url = "/develop/api/intlDevelopService/updateIntlDevelop";
            let data = {};
            data.id=this.param.id;
            data.title = this.researchParam.name;
            data.intro = this.researchParam.intro;
            data.imgUrl = this.httpParam.hotImg;
            data.detail = this.tinyParam.content;
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
        },
    },
     created(){
        if(this.flag==2){
            this.title="编辑研发";
            this.researchParam.name=this.param.title;
            this.researchParam.intro=this.param.intro;
            this.researchParam.time=this.param.ctime;
            this.httpParam.hotImg=this.param.imgUrl;
            this.tinyParam.content=this.param.detail;
        }
    }
}
</script>
