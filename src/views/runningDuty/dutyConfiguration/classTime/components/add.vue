<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">班次信息</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="8" :xs="24">
              <el-form-item label="班次类型" prop="Name">
                <el-input v-model="form.Name" placeholder="请输入班次类型名称" />
              </el-form-item>
            </el-col>
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/classTimeType";

export default {
  data() {
    const rules = {
      Name: [
        {
          pattern: /^[A-Za-z\u4e00-\u9fa5]{1,6}$/,
          required: true,
          message: "请输入6位以内的汉字或字母",
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

      shiftTypeList: [],
      charactorTypeList: []
    };
  },
  created() {
    const {
      data,
      shiftTypeList,
      charactorTypeList,
      dutyId
    } = this.$route.params;
    this.shiftTypeList = shiftTypeList || [];
    this.charactorTypeList = charactorTypeList || [];

    this.reset(data);
  },

  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          Name: "",
          ShiftId: "",
          CharacterId: "",
          DutyId: ""
        },
        data
      );
    },

    handleOpen() {
      const shiftTypeList = this.shiftTypeList,
        charactorTypeList = this.charactorTypeList,
        dutyId = this.form.DutyId;
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/classTime/index",
        params: { shiftTypeList, charactorTypeList, dutyId }
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

/deep/.onlyform-box .el-form .el-form-item {
  width: 350px;
  display: inline-block;
  vertical-align: text-top;
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