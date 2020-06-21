<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">确认描述</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="8" :xs="24">
              <el-form-item label="确认描述：" prop="description">
                <el-input type="textarea" :rows="6" v-model="form.description" placeholder="请输入确认描述" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
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
import { confirm } from "@/api/operationMonitoring/realtimeAlarm";

export default {
  data() {
    const rules = {
      // description: [
      //   {
      //     required: true,
      //     message: "确认描述不能为空",
      //     trigger: "blur"
      //   }
      // ]
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
    const { data } = this.$route.params;
    this.reset(data);
  },

  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          description: ""
        },
        data
      );
    },
    handleOpen() {
      this.$router.push({
        name: "/operationMonitoring/realtimeAlarm/index",
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          confirm(this.form)
            .then(r => {
              this.$message.success("保存成功！");
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
</style>