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
        <el-dialog style="width: 98%; margin: auto" :title="name" v-model="param.show"  :show-close="false" :close-on-click-modal="false">
            <div style="text-align:left;margin:2% 0;">
            
               <div style="display:inline-block;margin-bottom:2%;margin-right:2%;">
                    <span style="margin-right: 20px;padding-left:15px">类型</span>
                     <el-select v-model="value" placeholder="请选择类型">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                        </el-select>
                </div>
                <div style="display:inline-block;margin-bottom:2%;">
                    <span style="margin-right: 20px;">中文名</span>
                    <el-input style="width: 70%; margin-right: 20px;" v-model="productParam.cName" placeholder="请输入药材中文名称"></el-input>
                </div>
                <div style="display:inline-block;margin-bottom:2%;">
                    <span style="margin-right: 20px;">英文名</span>
                    <el-input style="width: 70%; margin-right: 20px;" v-model="productParam.eName" placeholder="请输入药材英文名称"></el-input>
                </div>
            </div>

            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:48%;margin-bottom:2%;">
                    <span style="margin-right: 20px;float: left;">拉丁名</span>
                    <el-input style="width: 70%; margin-right: 20px;float: left;" v-model="productParam.lName" placeholder="请输入药材拉丁名称"></el-input>
                </div>
                <div v-if="value==1" style="display:inline-block;width:50%;margin-bottom:2%;">
                    <span style="margin-right: 20px;float: left;">粉末性状</span>
                    <el-input style="width: 75%; margin-right: 20px;" type="textarea" :rows="3" :maxlength="200"resize ="none" v-model="productParam.powder" placeholder="请输入药材中文名称"></el-input>
                </div>
            </div>
             <div style="text-align:left;margin:2% 0;">
                <div v-if="value==1" style="display:inline-block;width:48%;margin-bottom:2%;">
                    <span style="margin-right: 20px;">油性状</span>
                    <el-input style="width: 70%; margin-right: 20px;" v-model="productParam.oil" placeholder="请输入药材英文名称"></el-input>
                </div>
                <div v-if="value==1" style="display:inline-block;width:50%;margin-bottom:2%;">
                    <span style="margin-right: 20px;">液体性状</span>
                    <el-input style="width: 75%; margin-right: 20px;" v-model="productParam.liquid" placeholder="请输入药材拉丁名称"></el-input>
                </div>
             </div>


            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:50%">
                    <span style="margin-right: 25px;padding-left:7px;float:left">功效</span>
                    <el-input style="display:inline-block;width:80%;" type="textarea" :rows="3" resize="none" placeholder="请输入内容,最多一百个字符" v-model="productParam.healthBenefits">
                    </el-input>
                </div>
                <div style="display:inline-block;width:50%">
                    <span style="margin-right: 20px;padding-left:7px;float:left">使用部分</span>
                    <el-input style="display:inline-block;width:76%;" type="textarea" :rows="3" :maxlength="100" resize="none" placeholder="请输入内容,最多一百个字符" v-model="productParam.usedPart">
                    </el-input>
                </div>
            </div>
            <div style="text-align:left;margin:2% 0;">
                <div style="display:inline-block;width:100%">
                    <span style="margin-right: 35px;padding-left:7px;">药材图片</span>
                     <multipleUpload :imgUrl="mutiplePic.img" :iconParam='mutiplePic' v-on:postUrl="getPics"></multipleUpload>
                </div>
            </div>
           <!--  <div style="text-align:left;margin:2% 0;">
               <div style="display:inline-block;width:100%">
                   <span style="margin-right: 35px;padding-left:7px;float:left">详情</span>
                   <el-button type="primary"  size="small" @click="toTiny()">编辑详情</el-button>
               </div>
           </div> -->
            <div style="float:right;margin:2%;">
               <el-button type="warning" size="small" @click="cancel()">取消</el-button>
                <el-button type="success" v-if="flag==1" :disabled="validate!='1'" size="small" @click="http()">确认新建</el-button>
                <el-button type="success" v-if="flag==2" :disabled="validate!='1'" size="small" @click="editHttp()">确认编辑</el-button>
            </div>
        </el-dialog>
        <tinymce :param="tinyParam" @received="getData" v-if="tinyParam.show"></tinymce>
    </div>
</template>
<script>
import imageUpload from '../imageUpload.vue';
import multipleUpload from '../multipleUpload.vue'
import tinymce from '../tinymce.vue'
import httpServer from '../../common/newHttp'
export default {
    data() {
        return {
            name: '新建产品',
            productParam:{
               cName:'',
               eName:'',
               lName:'',
               healthBenefits:'',
               usedPart:'',
               powder:'',
               oil:'',
               liquid:''
            },
            httpParam: {
                hotImg: '',
                id: '',
                keyName: 'news',
            },
            mutiplePic:{
                img: [],
                id: '',
                keyName: 'news',
            },
            tinyParam:{
                show:false,
                content:''
            },
            options: [{
                  value: 0,
                  label: '中药材'
                }, {
                  value: 1,
                  label: '提取物'
                }],
                value: ''
                }
    },
    props: ['param','flag'],
    components: {
        imageUpload,
        multipleUpload,
        tinymce
    },
    computed:{
         validate: function () {
            var pass= 1;
            if(this.value==='' ||this.productParam.cName=='' ||this.productParam.eName==''||this.productParam.lName==''||this.mutiplePic.img.length==0){
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
        getPics(val){
            this.mutiplePic.img.push(val.url);
        },
        http() {
            let url = "/product/api/intlProductService/addNewIntlProduct";
            let data = {};
            data.cName = this.productParam.cName;
            data.eName =this.productParam.eName;
            data.lName = this.productParam.lName;
            data.healthBenefits = this.productParam.healthBenefits;
            data.usedPart = this.productParam.usedPart;
            data.icon = this.mutiplePic.img;
            data.productDetail = this.tinyParam.content;
            data.type=this.value;
            data.powder=this.productParam.powder;
            data.oil=this.productParam.oil;
            data.liquid=this.productParam.liquid;
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
            this.spinShow = true;
            let url = "/product/api/intlProductService/updateIntlProduct";
            let data = {};
            data.id=this.productParam.id;
            data.cName = this.productParam.cName;
            data.eName =this.productParam.eName;
            data.lName = this.productParam.lName;
            data.healthBenefits = this.productParam.healthBenefits;
            data.usedPart = this.productParam.usedPart;
            data.icon = this.mutiplePic.img;
            data.type=this.value;
            data.productDetail = this.tinyParam.content;
            data.powder=this.productParam.powder;
            data.oil=this.productParam.oil;
            data.liquid=this.productParam.liquid;
            httpServer.commonAxiosPost(url, data).then(suc => {
                this.spinShow = false;
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
            this.name="编辑产品";
            this.productParam.id=this.param.id;
            this.productParam.cName=this.param.cName;
            this.productParam.eName=this.param.eName;
            this.productParam.lName=this.param.lName;
            this.productParam.powder=this.param.powder;
            this.productParam.healthBenefits=this.param.healthBenefits;
            this.productParam.usedPart=this.param.usedPart;
            this.tinyParam.content=this.param.productDetail;
            this.value=this.param.type
            for(let i=0 ;i<this.param.length;i++){
            this.param[i].icon=this.param[i].icon.slice(1,this.param[i].icon.length-1).split(',');
           }
            this.mutiplePic.img=this.param.icon;
        }
    }
}
</script>