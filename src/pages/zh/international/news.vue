<!-- /**
 * 新闻
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
              <el-input style="width: 200px; margin-right:10px;" v-model="keyWord"  placeholder="请输入新闻标题"></el-input>
              <el-button type="primary" @click="getNewstlist()" icon="search">搜索</el-button>
              <el-button type="warning" @click="reset()">重置</el-button>
              <el-button type="success" @click="addNew()">新建</el-button>
          </div> 
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="newsList" border style="width: 80%;margin:auto" max-height="600" v-loading.body="spinShow">
                <el-table-column prop="title" label="新闻标题">
                </el-table-column>
                <el-table-column prop="intro" label="新闻简介">
                </el-table-column>
                <el-table-column label="新闻图片">
                    <template scope="scope">
                        <div class="img_wrap">
                            <img :src="scope.row.imgUrl">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="新闻时间">
                    <template scope="scope">
                        <span>{{scope.row.ctime |formatTime2 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" max-width="200">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button  @click.native.prevent="delNews(scope.row.id)" type="text" size="small">
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
        <add-News :param="newsParam" flag="1" v-if="newsParam.show" @add-back="addBack"></add-News>
        <add-News :param="editParam" flag="2" v-if="editParam.show" @edit-back="addBack"></add-News>
    </div>
    
</template>
<script>
import imageUpload from '../../../components/imageUpload.vue';
import httpServer from '../../../common/newHttp'
import addNews from '../../../components/international/addNews.vue'
export default {
    data() {
        return {
            spinShow:false,
            keyWord:'',
            pageParam:{
                page:1,
                pageSize:7
            },
            newsList:[],
            newsParam:{
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
        addNews
    },
    computed: {
       
    },
    methods: {
        addNew(){
          this.newsParam.show=true;
        },
        addBack(){
            this.getNewstlist();
        },
        edit(index){
            let item=this.newsList[index];
            this.editParam=Object.assign({},this.editParam,item);
            this.editParam.show=true;
        },
        changePage(data){
          this.pageParam.page=data;
          this.getNewstlist();
        },
        delNews(val) {
            let arr=[];
            arr.push(val);
            this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                console.log("艾斯比空间打开撒娇",arr)
               this.deleteNews(arr);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
       },
        deleteNews(val){
            console.log("艾斯比空间打开撒娇",val)
        let url="/news/api/intlNewsService/deleteIntlNews";
        let data={};
        data.newsIdList=val;
        httpServer.commonAxiosPost(url,data).then(suc => {
                   if(suc.code!=200){
                       this.$message.error(suc.msg);
                   }else{
                       this.$message.success(suc.msg);
                       this.getNewstlist();
                   }
              }, err => {
                  console.log(err);
              })
        },
        getNewstlist(){
        this.spinShow=true;
        let url="/news/api/intlNewsService/queryIntlNewsList";
        let data={};
        data.page=this.pageParam.page;
        data.pageSize=this.pageParam.pageSize;
        if(this.keyWord){
            data.title=this.keyWord;
        }
        httpServer.commonAxiosPost(url,data).then(suc => {
                   this.spinShow=false;
                   if(suc.code!=200){
                       this.$message.error(suc.msg);
                   }else{
                       this.$message.success(suc.msg)
                   }
                   this.newsList=suc.result.list
                   this.pageParam.total=suc.result.total;
                   console.log("爱神的箭撒娇的",this.newsList)
              }, err => {
                  console.log(err);
              })
        },
        reset(){
            this.keyWord='';
            this.getNewstlist();
        }
    },
    mounted(){
        console.log("阿萨德不可骄傲是空间不大看见不散",this.httpServer)
         this.getNewstlist();
    }
}
</script>