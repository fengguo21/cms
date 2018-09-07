<!-- /**
 * 产品
 * @authors DEAN hxj (xxxxxxx@delibal)
 * @date    2018-06-05 13:13:36
 * @version $Id$
 */

 -->
 <style scoped lang="less">
.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
}

.pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}

.table img {
    max-width: 100%;
    padding: 10px;
    max-height: 40px;
}

.sort {
    text-align: center;
    padding: 20px 0;
    background-color: #fff;
}

.sort .top_wrap {
    overflow: hidden;
    width:80%;
    text-align: left;
    margin: auto;
}

.link {
    color: blue;
}

.link:hover {
    text-decoration: underline;
}

.content .hotBreed_img .btn_wrap {
    padding: 10px 0;
    margin-top: 20px;
    text-align: left;
}

.content .table .img_wrap {
    width: 100%;
    text-align: center;
    max-height: 200px;
    padding: 5px 0;
    overflow: hidden;
}

.content .table .img_wrap img {
    display: block;
    width: 100%;
    max-height: 200px;
    vertical-align: baseline;
    padding: 0;
    margin: 0 auto;
}

.content {
    .hotBreed_img {
        .breed_name_wrap {
            margin-bottom: 20px;
        }
    }
}
</style>
<template>
    <div class="content">
        <div class="sort">
          <div class="top_wrap">
              <el-input style="width: 200px; margin-right:10px;" v-model="keyWord"  placeholder="请输入药材英文名称"></el-input>
              <el-button type="primary" @click="getProductlist()" icon="search">搜索</el-button>
              <el-button type="warning" @click="reset()">重置</el-button>
              <el-button type="success" @click="addNew()">新建</el-button>
          </div> 
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="breedList" border style="width: 80%;margin:auto" max-height="600" v-loading.body="spinShow">
                <el-table-column prop="cName" label="药材中文名称" >
                </el-table-column>
                <el-table-column prop="eName" label="药材英文名称" >
                </el-table-column>
                <el-table-column label="药材图片" >
                    <template scope="scope">
                        <div class="img_wrap">
                            <img :src="scope.row.icon[0]">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" >
                    <template scope="scope">
                        <span>{{scope.row.ctime |formatTime2 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" max-width="200">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button  @click.native.prevent="delProduct(scope.row.id)" type="text" size="small">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination :current-page="pageParam.page" @current-change="changePage" layout="total, prev, pager, next, jumper" :total="pageParam.total">
            </el-pagination>
        </div>
        <add-Product :param="productParam" :flag="1" v-if="productParam.show" @add-back="addBack"></add-Product>
        <add-Product :param="editParam" :flag="2" v-if="editParam.show" @edit-back="addBack"></add-Product>
    </div>
    
</template>
<script>
import imageUpload from '../../../components/imageUpload.vue';
import httpServer from '../../../common/newHttp'
import addProduct from '../../../components/international/addProduct.vue'
export default {
    data() {
        return {
            spinShow:false,
            keyWord:'',
            pageParam:{
                page:1,
                pageSize:7
            },
            breedList:[],
            productParam:{
                show:false,
                id:''
            },
            editParam:{
                show:false,
                id:''
            }
        }
    },
    components: {
        imageUpload,
        addProduct
    },
    computed: {
       
    },
    methods: {
        addNew(){
          this.productParam.show=true;
        },
        addBack(){
           this.getProductlist();
        },
        changePage(data){
          this.pageParam.page=data;
          this.getProductlist();
        },
        edit(index){
            let item=this.breedList[index];
            this.editParam=Object.assign({},this.editParam,item);
            this.editParam.show=true;
        },
         delProduct(val) {
            let arr=[];
            arr.push(val);
            this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
               this.deleteProduct(arr);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
       },
        deleteProduct(val){
        let url="/product/api/intlProductService/deleteIntlProduct";
        let data={};
        data.productIdList=val;
        httpServer.commonAxiosPost(url,data).then(suc => {
                   if(suc.code!=200){
                       this.$message.error(suc.msg);
                   }else{
                       this.$message.success(suc.msg);
                       this.getProductlist();
                   }
              }, err => {
                  console.log(err);
              })
        },
        getProductlist(){
        this.spinShow=true;
        let url="/product/api/intlProductService/queryIntlProductList";
        let data={};
        data.page=this.pageParam.page;
        data.pageSize=this.pageParam.pageSize;
        data.type=-1;
        if(this.keyWord){
            data.eName=this.keyWord;
        }
        httpServer.commonAxiosPost(url,data).then(suc => {
                   this.spinShow=false;
                   if(suc.code!=200){
                       this.$message.error(suc.msg);
                   }else{
                       this.$message.success(suc.msg);
                   }
                   this.breedList=suc.result.list;
                   this.pageParam.total=suc.result.total;
                 /*   for(let i=0 ;i<this.breedList.length;i++){
                    this.breedList[i].icon=this.breedList[i].icon.slice(1,this.breedList[i].icon.length-1).split(',');
                   }*/
                   console.log("爱神的箭撒娇的",this.breedList)
              }, err => {
                  console.log(err);
              })
        },
        reset(){
            this.keyWord='';
            this.getProductlist();
        }
    },
    mounted(){
        console.log("阿萨德不可骄傲是空间不大看见不散",this.httpServer)
         this.getProductlist();
    }
}
</script>
