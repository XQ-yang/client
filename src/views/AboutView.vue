<template>
  <el-card>
    <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="handleChange"
        :before-upload="handleBeforeUpload"
        multiple
    >
      <div class="el-upload__text">
        拖拽文件到这或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          Tips：文件大小不能超过5MB
        </div>
      </template>
    </el-upload>
  </el-card>
  <Card style="height: 400px">
    <div class="demo-upload-list" v-for="(item,id) in uploadList" v-bind:key="id">
      <template v-if="item.status === 'finished'">
        <Image :src="item.url" fit="cover" width="100%" height="100%"/>
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess1"
        :format="['jpg','jpeg','png','gif']"
        accept=".jpg, .jpeg, .png, .gif"
        :max-size="5120"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload1"
        multiple
        type="drag"
        :action="uploadUrl"
        style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
  </Card>
  <ImagePreview v-model="visible" :preview-list="['https://file.iviewui.com/images/' + imgName]"/>
</template>

<script>
import {Card} from "view-ui-plus";

export default {
  components: {Card},
  data() {
    return {
      uploadUrl: "http://localhost:8099/aliyunoss/upload",
      defaultList: [
        {
          'name': 'image-demo-1.jpg',
          'url': 'https://file.iviewui.com/images/image-demo-1.jpg'
        },
        {
          'name': 'image-demo-2.jpg',
          'url': 'https://file.iviewui.com/images/image-demo-2.jpg'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: []
    }
  },

  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },

  methods: {

    handleChange(file, fileList) {
      console.log("file---", file);
      console.log("fileList---", fileList);
    },
    handleSuccess(res, file) {
      console.log("file---", file);
      if (res) {
        this.$message.success("上传成功！")
      }
    },

    handleError(error) {
      if (error) {
        this.$message.error("上传失败！")
      }
    },

    // 上传前校验
    handleBeforeUpload(file) {
      let isLt5MB = file.size / 1024 / 1024 > 5;
      if (isLt5MB) {
        this.$message.warning("上传的文件不能超过5MB")
      }
      // 文件类型校验

    },

    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess1(res, file) {
      if (res) {
        this.$Notice.success({
          title: '成功！',
          desc: file.name + '已上传成功'
        })
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + '文件格式不正确，请选择jpg或png'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: file.name + ' 大小超过了5M'
      });
    },
    handleBeforeUpload1() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多可以上传5张图片'
        });
      }
      return check;
    }

  },
}
</script>
<style>
.upload-demo {
  width: 500px;
}

.el-upload__tip {
  color: red;
}
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
