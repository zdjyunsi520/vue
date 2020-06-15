<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}配置</p>

      <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

        <el-form-item label="类型" prop="Type">
          <el-select v-model="form.Type" :disabled='form.Id?true:false'>
            <el-option label="键值" :value="1" />
            <el-option label="枚举" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input v-model="form.Name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="代码" prop="Key">
          <el-input v-model="form.Key" placeholder="请输入代码" />
        </el-form-item>

        <el-form-item label="描述" prop="Description">
          <el-input type="textarea" :rows="6" v-model="form.Description" placeholder="请输入描述" />
        </el-form-item>

      </el-form>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/commonManager/settings";

export default {
  data() {
    const rules = {
      Type: [
        {
          required: true,
          message: "请选择类型",
          trigger: "blur"
        }
      ],
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
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          Type: 1,
          Name: "",
          Key: "",
          Description: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/settings/index",
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
              var txt = this.form.Id ?'编辑成功！':'新增成功！'
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
</style>