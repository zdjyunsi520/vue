<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}APP</p>

      <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

        <el-form-item label="应用名称" prop="Type">
          <el-select v-model="form.Type" placeholder="">
            <el-option v-for="(item,index) in appNameList" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本名称" prop="VersionName">
          <el-input v-model="form.VersionName" placeholder="请输入版本名称" />
        </el-form-item>
        <el-form-item label="版本号" prop="VersionCode">
          <el-input v-model="form.VersionCode" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="是否强制更新" prop="ForcedUpdate">
          <el-select v-model="form.ForcedUpdate">
            <el-option v-for="(item,index) in forceUpdateList" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新说明" prop="UpdateDescription">
          <el-input type="textarea" :rows="6" v-model="form.UpdateDescription" placeholder="请输入更新说明" />
        </el-form-item>
        <el-form-item label="附件" prop="FileUrl">

          <el-upload action="#" list-type="picture-card" :limit="1" accept=".apk" ref="upload" :before-upload='beforeAvatarUpload' :on-success="handleAvatarSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" name="filekey">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>
      </el-form>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/commonManager/app";
import { imageUpload } from "@/api/biz";
const appNameList = [{ key: 1, value: "用户端" }];
const forceUpdateList = [
  { key: true, value: "是" },
  { key: false, value: "否" }
];
export default {
  data() {
    const rules = {
      VersionName: [
        {
          required: true,
          message: "版本名称不能为空",
          trigger: "blur"
        }
      ],
      VersionCode: [
        {
          required: true,
          message: "版本号不能为空",
          trigger: "blur"
        }
      ],
      UpdateDescription: [
        {
          required: true,
          message: "更新说明不能为空",
          trigger: "blur"
        }
      ],
      FileUrl: [
        {
          required: true,
          message: "请上传更新包",
          trigger: "blur"
        }
      ],
      Type: [
        {
          required: true,
          message: "请选择应用名称",
          trigger: "blur"
        }
      ],
      ForcedUpdate: [
        {
          required: true,
          message: "请选择是否强制更新",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      // 角色选项
      roleOptions: [],
      deptType: "",
      appNameList,
      forceUpdateList
    };
  },
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          VersionName: "",
          VersionCode: "",
          UpdateDescription: "",
          ForcedUpdate: true,
          FileUrl: "",
          //  Status: 1,
          //   CreateTime: "",
          AttachmentKey: "",
          Type: 1
          //  TypeName: "",
          //  StatusName: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/app/index",
        params: {}
      });
      return;
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.reset(data);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.Id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);

              //关闭窗口
              this.handleOpen();
            })
            .catch(r => {
              //取消按钮转圈圈
              this.loading = false;
            });
        }
      });
    },
    // 附件上传成功
    handleAvatarSuccess(res, file) {
      this.form.attachmenturl = URL.createObjectURL(file.raw);
    },
    // 删除附件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览附件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 附件上传之前判断大小
    beforeAvatarUpload(file) {
      console.log(file);
      let fd = new FormData();
      fd.append("filekey", file);
      imageUpload(fd).then(r => {});
      return false;
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}

/deep/.el-form-item__error--inline {
  position: absolute;
  top: 50%;
  margin-top: -10px;
  width: 100%;
}
</style>