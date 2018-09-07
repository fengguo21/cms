<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog :modal="false" title="上传图片" :visible.sync="dialogVisible">
    <div style="width:88%;height:250px;padding:30px;overflow:auto;">
      <multipleUpload :imgUrl="mutiplePic.img" :iconParam='mutiplePic' v-on:postUrl="getPics"></multipleUpload>
    </div>
    <div style="float:right;margin-bottom:15px;">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="picBack()">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import multipleUpload from '../../multipleUpload.vue'
export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      mutiplePic:{
          img: [],
          id: '',
          keyName: 'news',
      }
    }
  },
  components:{
     multipleUpload
  },
  methods: {
    getPics(val){
        this.mutiplePic.img.push(val.url);
    },
    picBack(){
        this.$emit("successCBK",this.mutiplePic.img);
        this.dialogVisible=false;
    }
  }
}
</script>

<style  scoped>
.editor-slide-upload {
  margin-bottom: 20px;

}
.el-upload--picture-card {
    width: 100%;
  }
</style>
