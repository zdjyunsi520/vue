<template>

  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="注意事项">
      必须严格按照模板输入手机号码和QQ，手机号已存在或者手机格式错误，QQ为空将不会注册,注册前请仔细查看
    </el-form-item>

    <el-form-item label="推广员ID" prop="promoterId">
      <el-input v-model="form.promoterId" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-row class="xl-form-item-button">
        <el-button :loading="loading" type="primary" @click="handleExport">导出模板</el-button>
        <el-upload :on-success="handleSuccess" class="upload-demo" :action="action" :headers="headers" :show-file-list="false">
          <el-button :loading="loading" type="warning">导入手机号和QQ</el-button>
        </el-upload>
        <el-button :loading="loading" type="success" @click="handleSubmit">批量添加</el-button>
      </el-row>
    </el-form-item>

  </el-form>

</template>

<script>
import { addMutiple as add, exportTemp as exportExcel } from '@/api/buyer/info';
import { getToken } from '@/utils/auth';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
      promoterId: [emptyRule]
    };
    const form = {
      path: '',
      promoterId: ''
    };
    return {
      form,
      form1: form,
      rules,
      loading: false,
      action: '',
      headers: {}
    };
  },
  created() {
    this.create();
    this.action =
      process.env.VUE_APP_BASE_API + '/system/member/addMerchant/upload';
    this.headers = { Authorization: 'Bearer ' + getToken() };
  },
  methods: {
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.loading = false;
      this.create();
    },
    handleSuccess(r) {
      if (r.code) {
        this.$message.error(r.msg);
      } else {
        this.$message.success(r.msg);
        this.form.path = r.data;
      }
    },
    handleSubmit() {
      this.loading = true;
      this.$refs.form.validate(v => {
        if (v) {
          if (!this.form.path) {
            this.$message.error(new Error('请先导入excel'));
            this.loading = false;
            return;
          }
          var o = add;
          o(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.handleOpen();
            })
            .catch(e => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        exportExcel(this.queryParams)
          .then(r => {
            this.download(r.data, 1);
            this.$message.success(r.data.msg);
          })
          .finally(e => {
            this.loading = false;
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-form-item-button {
  margin-left: 120px;
}

.upload-demo {
  display: inline-block;
}
</style>