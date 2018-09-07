<template>
  <div class="components-container">
   <el-dialog  :title="title" v-model="param.show" >
    <div>
      <tinymce :height="300" :toolbar="toolbar1" v-model="content"></tinymce>
    </div>
 <!--   <div class="editor-content" v-html="content"></div>  -->
     <div style="float:right;margin:2%;">
          <el-button type="warning"  size="small" @click="cancel()">取消</el-button>
          <el-button type="success"  size="small" @click="save()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from './Tinymce/index.vue'

export default {
  name: 'tinymce-demo',
  components: { Tinymce },
  data() {
    return {
      title:'详情编辑',
      content:``,
       toolbar1: ['table insertfile undo redo formatselect link unlink uploadimg alignleft aligncenter alignright alignjustify outdent indent removeformat', 
         'fontsizeselect forecolor backcolor fontselect bold italic underline strikethrough image media',
         'blockquote undo redo removeformat subscript superscript code codesample hr bullist numlist charmap   preview anchor pagebreak insertdatetime emoticons'],
    }
  },
  props:['param'],
  methods:{
        cancel(){
            this.param.show=false;
        },
        save(){
            this.param.show=false;
            this.$emit("received",this.content);
        }
  },
  created(){
    if(this.param.content){
      this.content=this.param.content;
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>


