<style scoped>
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
    <el-row>
        <el-form ref="iconForm" :model="iconParam" :rules="rules" label-width="250px" v-loading.body="loading">
            <el-form-item label="图片类型：" prop="fileType">
                <el-autocomplete
                    v-model="iconParam.fileType"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择上传的图片类型"
                    @select="handleSelect"
                    >
                    <!-- <template slot="prepend">图片类型</template> -->
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="图片比率：">
                <el-select v-model="iconParam.ratio" placeholder="请选择">
                  <el-option
                    v-for="item in ratioOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片是否为原图：">
                <el-switch
                v-model="iconParam.type"
                on-color="#13ce66"
                off-color="#ccc"
                on-text="是"
                off-text="否"
                on-value="1"
                off-value="0"
                >
                </el-switch>  
            </el-form-item>
            <el-form-item label="图片:" >
                <!-- <imageUpload> :imgUrl="iconParam.imgUrl" :param="iconParam" v-on:postUrl="recieveUrl"></imageUpload> -->
                <el-row  :gutter="10" class="image-wall" style="flex" justify="start" > 
                  <span  class="image-col" v-for="(item,index) in imageUrls.length">
                    <uploadImageWall :index="index" :imgUrl="imageUrls[index]" :iconParam="iconParam" @postUrl="recieveUrl">
                    </uploadImageWall>
                  </span>
                </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('iconForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-row>
</template>
<script>
// import imageUpload from './imageUpload.vue';
import common from "../common/common.js";
import * as filters from "../filters/index.js";
import httpService from "../common/httpService";
import uploadImageWall from "./imageWallUpload.vue";

export default {
  data() {
    return {
      imageNum: 1,
      loading: false,
      dialogVisible: false,
      // imageUrls: ["", "", "", "", "", "", "", "", "", ""],
      rules: {
        fileType: [
          {
            required: true,
            message: "请输入图片类型",
            trigger: "blur"
          }
        ]
        // imgs: [
        //   {
        //     required: true,
        //     message: "请上传图片",
        //     trigger: "blur"
        //   }
        // ],
      },
      timeout: null,
      httpParam: {
        fileType: "",
        type: "",
        imageList: []
      },
      ratioOptions: [
        {
          value: "1",
          label: "1倍"
        },
        {
          value: "2",
          label: "2倍"
        },
        {
          value: "3",
          label: "3倍"
        }
      ]
    };
  },
  props: {
    iconParam: {
      default: null
    },
    imageUrls: {
      type: Array,
      default: ["", "", "", "", "", "", "", ""]
    }
  },
  components: {
    uploadImageWall
  },
  methods: {
    recieveUrl(val) {
      this.imageUrls.splice(val.index, 1, val.url);
    },
    handleSelect(val) {
      this.httpParam.fileType = val.index;
    },
    //图标类型建议
    querySearch(queryString, cb) {
      let iconTypes = Object.keys(this.iconParam.iconList);
      let fileTypes = [];
      for (let i = 0; i < iconTypes.length; i++) {
        fileTypes[i] = {
          value: filters.iconFileType(iconTypes[i]),
          index: iconTypes[i]
        };
      }
      let results = queryString
        ? fileTypes.filter(filters.iconFileTypeRecommend(queryString))
        : fileTypes;
      // 调用 callback 返回建议列表的数据

      cb(results);
    },
    // 提交表单
    submitForm(formName) {
      let _self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _self.loading = true;
          let url = common.urlCommon + common.apiUrl.most;
          let body = {
            biz_module: "iconService",
            biz_method: "addIconImage",
            biz_param: {
              type: _self.iconParam.type,
              imageList: _self.imageUrls,
              ratio: _self.iconParam.ratio,
              fileType: _self.httpParam.fileType
            }
          };
          //如果有id，就是编辑图标
          if (this.iconParam.id) {
            body = {
              biz_module: "iconService",
              biz_method: "updateIconImage",
              biz_param: {
                id: _self.iconParam.id,
                type: _self.iconParam.type,
                path: _self.imageUrls[0],
                fileType: _self.iconParam.fileTypeIndex
              }
            };
          }
          if (common.KEY) {
            url = common.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign(
              "biz_module=" +
                body.biz_module +
                "&biz_method=" +
                body.biz_method +
                "&time=" +
                body.time
            );
          }
          httpService.commonPost(
            url,
            body,
            function(res) {
              _self.loading = false;
              _self.$message({
                type: "info",
                message: "操作成功"
              });
              _self.$emit("addIcon");
            },
            function(err) {
              _self.loading = false;
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>