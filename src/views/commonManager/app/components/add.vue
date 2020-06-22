<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}APP</p>
      <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="100px" :inline-message="true" style="width:390px;">
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
        <el-form-item label="强制更新" prop="ForcedUpdate">
          <el-select v-model="form.ForcedUpdate">
            <el-option v-for="(item,index) in forceUpdateList" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新说明" prop="UpdateDescription">
          <el-input type="textarea" :rows="6" v-model="form.UpdateDescription" placeholder="请输入更新说明" />
        </el-form-item>
        <el-form-item label="上传更新包" prop="FileUrl">

          <el-upload class="avatar-wrap" action="http://apicommont.xtioe.com/File/Upload" :on-remove="handleRemove" :data="{Token:token,filekey:'appversion'}" accept=".apk" :headers="{methods:'post'}" list-type="picture-card" ref="upload" :on-success="handleAvatarSuccess">
            <i v-if="showPlus" class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/commonManager/app";
import { mapGetters } from "vuex";
import apk from "@/assets/logo/apk.jpg";
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
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],

      VersionCode: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],

      UpdateDescription: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,300}$/,
          required: true,
          message: "请输入300位以内的数字或字母或特殊符号",
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
      dialogImageUrl: "",
      forceUpdateList,
      showPlus: true
    };
  },
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: { ...mapGetters(["token"]) },
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
              var txt = this.form.Id ? "编辑成功！" : "新增成功！";
              this.$message.success(txt);

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
    handleAvatarSuccess(res, file, fileList) {
      this.form.FileUrl = res.data.FileUrls[0].Url;
      this.form.AttachmentKey = res.data.AttachmentKey;
      file.url = apk;
    },
    handleRemove() {
      this.form.FileUrl = "";
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

.avatar {
  width: 100%;
  height: 100%;
}
.avatar-wrap {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
}
</style>