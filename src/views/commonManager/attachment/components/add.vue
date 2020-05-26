<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <!-- <p class="form-smtitle">{{title}}附件类型</p> -->
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="110px" :inline-message="true">
          <el-row :gutter="20">
            <el-col :span="24">
              <p class="smtitle">基础设置</p>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="名称" prop="Name">
                <el-input v-model="form.Name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="代码" prop="Key">
                <el-input v-model="form.Key" placeholder="请输入代码" />
              </el-form-item>
              <el-form-item class="largelabel" label="是否多版本" prop="IsMultiVersion">
                <el-switch v-model="form.IsMultiVersion" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="是" inactive-text="否" @change="handleUpdateStatus(row)"> </el-switch>
              </el-form-item>
              <el-form-item class="largelabel" label="版本是否来自压缩包" prop="IsMultiVersionFromPackage">
                <el-switch v-model="form.IsMultiVersionFromPackage" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="是" inactive-text="否" @change="handleUpdateStatus(row)"> </el-switch>
              </el-form-item>
              <el-form-item class="largelabel" label="删除数据同时删除文件" prop="IsRemoveFile">
                <el-switch v-model="form.IsRemoveFile" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="是" inactive-text="否" @change="handleUpdateStatus(row)"> </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="描述" prop="Description">
                <el-input type="textarea" :rows="5" v-model="form.Description" placeholder="请输入描述" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs='24'>
              <p class="smtitle">附件路径设置</p>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="目录组织方式" prop="DirectoryMode">
                <el-select v-model="form.DirectoryMode" placeholder="">
                  <el-option label="不分目录" :value="11"></el-option>
                  <el-option label="不分目录保留文件名" :value="12"></el-option>
                  <el-option label="日期组织" :value="21"></el-option>
                  <el-option label="日期组织保留文件名" :value="22"></el-option>
                  <el-option label="附件键组织" :value="31"></el-option>
                  <el-option label="附件键组织保留文件名" :value="32"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="数据存储方式" prop="StorageMode">
                <el-select v-model="form.StorageMode" placeholder="">
                  <el-option label="目录存储" :value="1"></el-option>
                  <el-option label="数据库存储" :value="2"></el-option>
                  <el-option label="FTP存储" :value="3"></el-option>
                  <el-option label="七牛云存储" :value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item label="附件访问方式" prop="AccessMode">
                <el-select v-model="form.AccessMode" placeholder="">
                  <el-option label="普通方式访问" :value="1"></el-option>
                  <el-option label="授权方式访问" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item label="FTP设置" prop="FTPSetting">
                <el-input v-model="form.FTPSetting" placeholder="未使用FTP可不填" />
              </el-form-item>
            </el-col>
            </el-col>
            <el-col :span="24" :xs='24'>
              <p class="smtitle">上传验证设置</p>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="有效的文件后缀" prop="FilterFileExtensions">
                <el-input v-model="form.FilterFileExtensions" placeholder='"*"表示所有类型后缀；多个后缀用","隔开' />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="允许文件最大值" prop="MaxFileSize">
                <el-input v-model="form.MaxFileSize" placeholder="未使用FTP可不填" />kb
              </el-form-item>

            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="是否生成缩略图" prop="IsGenerateThumbnail">
                <el-switch v-model="form.IsGenerateThumbnail" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="是" inactive-text="否" @change="handleUpdateStatus(row)"> </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item label="文件大于该值时生成缩略图" prop="ThumbnailMaxFileSize">
                <el-input v-model="form.ThumbnailMaxFileSize" placeholder="" />kb
              </el-form-item>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item label="缩略图规格" prop="ThumbnailSizes">
                <el-input v-model="form.ThumbnailSizes" placeholder='宽高用"_"隔开,"*"表示自适应;多种规格用","隔开' />
              </el-form-item>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item label="限制大小规格" prop="LimitSize">
                <el-input v-model="form.LimitSize" placeholder="0时为不限制文件大小" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs='24'>
              <p class="smtitle"> 地图定位 </p>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>

              <el-form-item label="水印方式" prop="WatermarkMethod">
                <el-select v-model="form.WatermarkMethod">
                  <el-option label="无水印" :value="1"></el-option>
                  <el-option label="文字水印" :value="2"></el-option>
                  <el-option label="图片水印" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item label="水印文字" prop="WatermarkText">
                <el-input v-model="form.WatermarkText" placeholder="请输入水印文字" />
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item label="水印水平对齐方式" prop="WatermarkHorizontalAlign">
                <el-select v-model="form.WatermarkHorizontalAlign">
                  <el-option label="未设置" value="NotSet"></el-option>
                  <el-option label="居左" value="Left"></el-option>
                  <el-option label="居中" value="Center"></el-option>
                  <el-option label="居右" value="Right"></el-option>
                  <el-option label="两端对齐" value="Justify"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item label="水印图片URL" prop="WatermarkImageUrl">
                <el-input v-model="form.WatermarkImageUrl" placeholder="请输入水印图片URL" />
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item label="水印水平垂直方式" prop="WatermarkVerticalAlign">
                <el-select v-model="form.WatermarkVerticalAlign">
                  <el-option label="未设置" value="NotSet"></el-option>
                  <el-option label="顶部" value="Top"></el-option>
                  <el-option label="居中" value="Middle"></el-option>
                  <el-option label="底部" value="Bottom"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
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
import { add, update, getInfo } from "@/api/commonManager/attachment";
const appNameList = [{ key: 1, value: "用户端" }];
const forceUpdateList = [
  { key: true, value: "是" },
  { key: false, value: "否" }
];
export default {
  data() {
    const rules = {
      Name: [
        {
          required: true,
          message: "名称不能为空",
          trigger: "blur"
        }
      ],
      Key: [
        {
          required: true,
          message: "代码不能为空",
          trigger: "blur"
        }
      ],
      IsMultiVersion: [
        {
          required: true,
          message: "请选择是否多版本",
          trigger: "blur"
        }
      ],
      IsMultiVersionFromPackage: [
        {
          required: true,
          message: "请选择是否来自压缩包",
          trigger: "blur"
        }
      ],
      IsRemoveFile: [
        {
          required: true,
          message: "请选择删除数据同时删除文件",
          trigger: "blur"
        }
      ],
      DirectoryMode: [
        {
          required: true,
          message: "请选择目录组织方式",
          trigger: "blur"
        }
      ],
      StorageMode: [
        {
          required: true,
          message: "请选择数据存储方式",
          trigger: "blur"
        }
      ],
      AccessMode: [
        {
          required: true,
          message: "请选择附件访问方式",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: ""
    };
  },
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
    if (data && data.Id) this.getInfo();
  },
  methods: {
    getInfo() {
      getInfo(this.form).then(r => {
        this.form = r.data;
      });
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          IsMultiVersion: false,
          IsMultiVersionFromPackage: false,
          IsRemoveFile: false,
          IsGenerateThumbnail: false
        },
        data
      );
    },

    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/attachment/index",
        params: {}
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

/deep/.largelabel .el-form-item__label {
  width: 200px !important;
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