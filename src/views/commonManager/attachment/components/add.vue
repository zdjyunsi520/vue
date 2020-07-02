<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <!-- <p class="form-form-smtitle">{{title}}附件类型</p> -->
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" :inline-message="true">
          <el-row>
            <el-col :span="24">
              <p class="form-smtitle">基础设置</p>
            </el-col>
          </el-row>
          <el-row class='rowbox'>
            <el-col :span="12" :xs='24'>
              <el-form-item label="名称：" label-width='70px' prop="Name">
                <el-input v-model="form.Name" placeholder="请输入名称" />
              </el-form-item>
              <el-form-item label="代码：" label-width='70px' prop="Key">
                <el-input v-model="form.Key" placeholder="请输入代码" />
              </el-form-item>
              <el-form-item label="描述：" label-width='70px' prop="Description">
                <el-input type="textarea" :rows="5" v-model="form.Description" placeholder="请输入描述" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs='24'>
            <el-form-item label="是否多版本：" label-width='200px' prop="IsMultiVersion">
              <el-switch v-model="form.IsMultiVersion" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="是" inactive-text="否"> </el-switch>
            </el-form-item>
            <el-form-item label="版本是否来自压缩包：" label-width='200px' prop="IsMultiVersionFromPackage">
              <el-switch v-model="form.IsMultiVersionFromPackage" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="是" inactive-text="否"> </el-switch>
            </el-form-item>
            <el-form-item label="删除数据同时删除文件：" label-width='200px' prop="IsRemoveFile">
              <el-switch v-model="form.IsRemoveFile" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle">附件路径设置</p>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="目录组织方式：" label-width='120px' prop="DirectoryMode">
              <el-select v-model="form.DirectoryMode" placeholder="请选择目录组织方式">
                <el-option label="不分目录" :value="11"></el-option>
                <el-option label="不分目录保留文件名" :value="12"></el-option>
                <el-option label="日期组织" :value="21"></el-option>
                <el-option label="日期组织保留文件名" :value="22"></el-option>
                <el-option label="附件键组织" :value="31"></el-option>
                <el-option label="附件键组织保留文件名" :value="32"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据存储方式：" label-width='120px' prop="StorageMode">
              <el-select v-model="form.StorageMode" placeholder="请选择数据存储方式">
                <el-option label="目录存储" :value="1"></el-option>
                <el-option label="数据库存储" :value="2"></el-option>
                <el-option label="FTP存储" :value="3"></el-option>
                <el-option label="七牛云存储" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="附件访问方式：" label-width='120px' prop="AccessMode">
              <el-select v-model="form.AccessMode" placeholder="请选择附件访问方式">
                <el-option label="普通方式访问" :value="1"></el-option>
                <el-option label="授权方式访问" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="FTP设置：" label-width='120px' prop="FTPSetting">
              <el-input v-model="form.FTPSetting" placeholder="未使用FTP可不填" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle">上传验证设置</p>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="有效文件后缀：" label-width='120px' prop="FilterFileExtensions">
              <el-input v-model="form.FilterFileExtensions" placeholder='"*"表示所有类型后缀；多个后缀用","隔开' />
            </el-form-item>
            <el-form-item label="文件最大值(kb)：" label-width='120px' prop="MaxFileSize">
              <el-input v-model="form.MaxFileSize" placeholder="请输入最大值" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle">上传图片设置</p>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="生成缩略图：" prop="IsGenerateThumbnail" label-width='120px'>
              <el-switch v-model="form.IsGenerateThumbnail" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="是" inactive-text="否"> </el-switch>
            </el-form-item>
            <el-form-item label="生成条件(kb)：" label-width='120px' prop="ThumbnailMaxFileSize">
              <el-input v-model="form.ThumbnailMaxFileSize" placeholder="文件大于该值时生成缩略图" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="缩略图规格：" label-width='120px' prop="ThumbnailSizes">
              <el-input v-model="form.ThumbnailSizes" placeholder='宽高用"_"隔开,"*"表示自适应;多种规格用","隔开' />
            </el-form-item>
            <el-form-item label="限制大小规格：" label-width='120px' prop="LimitSize">
              <el-input v-model="form.LimitSize" placeholder="0时为不限制文件大小" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle">水印设置</p>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="水印方式：" label-width='120px' prop="WatermarkMethod">
              <el-select v-model="form.WatermarkMethod" placeholder="请选择水印方式" >
                <el-option label="无水印" :value="1"></el-option>
                <el-option label="文字水印" :value="2"></el-option>
                <el-option label="图片水印" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="水印文字：" label-width='120px' prop="WatermarkText">
              <el-input v-model="form.WatermarkText" placeholder="请输入水印文字" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="水平对齐方式：" label-width='120px' prop="WatermarkHorizontalAlign">
              <el-select v-model="form.WatermarkHorizontalAlign" placeholder="请选择水平对齐方式" >
                <el-option label="未设置" value="NotSet"></el-option>
                <el-option label="居左" value="Left"></el-option>
                <el-option label="居中" value="Center"></el-option>
                <el-option label="居右" value="Right"></el-option>
                <el-option label="两端对齐" value="Justify"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片URL：" label-width='120px' prop="WatermarkImageUrl">
              <el-input v-model="form.WatermarkImageUrl" placeholder="请输入水印图片URL" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="水平垂直方式：" label-width='120px' prop="WatermarkVerticalAlign">
              <el-select v-model="form.WatermarkVerticalAlign" placeholder="请选择水平垂直方式" >
                <el-option label="未设置" value="NotSet"></el-option>
                <el-option label="顶部" value="Top"></el-option>
                <el-option label="居中" value="Middle"></el-option>
                <el-option label="底部" value="Bottom"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
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
          pattern: /^.{1,18}$/,
          required: true,
          message: "请输入18位以内的内容",
          trigger: "blur"
        }
      ],
      Key: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,36}$/,
          required: true,
          message: "请输入36位以内的数字或字母或特殊字符",
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
    handleUpdateStatus(row) {},
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

/deep/.largelabel {
  .el-form-item__label {
    width: 180px !important;
  }
  .el-form-item__content {
    margin-left: 180px !important;
  }
}

/deep/.largelabel1 {
  .el-form-item__label {
    width: 140px !important;
  }
  .el-form-item__content {
    margin-left: 140px !important;
  }
}
/deep/.largelabel2 {
  .el-form-item__label {
    width: 140px !important;
  }
  .el-form-item__content {
    margin-left: 140px !important;
  }
}
.rowbox{width:800px}
.mobile{
  .rowbox{width:100%}
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
/deep/.onlyform-box .el-form .el-form-item {
  width: 390px;
  display: inline-block;
  vertical-align: text-top;
}
</style>