<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}配置子项</p>

      <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px" :inline-message="true" style="max-width:370px;">

        <el-form-item label="名称" prop="Name">
          <el-input v-model="form.Name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="代码" prop="Key">
          <el-input v-model="form.Key" placeholder="请输入代码" :disabled='form.Id?true:false' />
        </el-form-item>
        <el-form-item label="值" prop="Value">
          <el-input v-model="form.Value" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="排序号" prop="SortIndex" v-if="form.Type==3">
          <el-input-number v-model="form.SortIndex" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input type="textarea" :rows="6" v-model="form.Description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="是否启用" prop="IsEnable" v-if="form.Type==3">
          <el-switch v-model="form.IsEnable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用">
          </el-switch>
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
import { add, update } from "@/api/commonManager/settings/keyValue";

export default {
  data() {
    const rules = {
      Name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      Key: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      Value: [
        {
          pattern: /^\d{1,300}$/,
          required: true,
          message: "请输入300位以内的数字",
          trigger: "blur"
        }
      ],
      SortIndex: [
        {
          pattern: /^\d{1,4}$/,
          required: true,
          message: "请输入4位以内的数字"
        }
      ],
      Description: [
        {
          pattern: /^.{1,300}$/,
          required: false,
          message: "请输入300位以内的内容",
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
          // Id: "",
          Type: "",
          SettingId: "",
          Name: "",
          Description: "",
          Key: "",
          Value: "",
          SortIndex: 1,
          IsEnable: true
        },
        data
      );
    },

    handleOpen() {
      const Id = this.form.SettingId;
      const Type = this.form.Type;
      const data = { Id, Type };
      this.$router.push({
        name: "/commonManager/settings/keyValue/index",
        params: { data }
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          // this.form.Type = this.form.Type ? 1 : 0;
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
</style>