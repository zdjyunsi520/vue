<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">班次信息</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="班次" prop="Name">
                  <el-input v-model="form.Name" placeholder="请输入班次" />
                </el-form-item>
              </el-col>

            </el-col>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="开始时间" prop="StartTime">
                  <el-time-picker v-model="form.StartTime" placeholder="请选择时间" value-format='HH:mm' format='HH:mm'></el-time-picker>

                  <!-- <el-time-select v-model="form.StartTime" placeholder="请选择时间" /> -->
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="间隔天数" prop="Period">
                  <el-input-number v-model="form.Period" :min="0" :max="99" controls-position="right" />
                </el-form-item>
              </el-col>

              <el-col>
                <el-col :span="8" :xs="24">
                  <el-form-item label="结束时间" prop="EndTime">
                    <el-time-picker v-model="form.EndTime" placeholder="请选择时间" value-format='HH:mm' format='HH:mm'></el-time-picker>
                    <!-- <el-time-select v-model="form.EndTime" placeholder="请选择时间" /> -->
                  </el-form-item>
                </el-col>
              </el-col>

              <el-col>
              </el-col>

              <el-col :span="8" :xs="24">
                <el-form-item label="备注" prop="Remark">
                  <el-input v-model="form.Remark" placeholder="" />
                </el-form-item>
              </el-col>
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/classTime";
import { fetchCharactorType } from "@/api/runningDuty/dutyConfiguration";
export default {
  data() {
    const rules = {
      phone1231: [
        {
          pattern: /^1\d{10}$/,
          required: true,
          message: "请输入正确的手机号"
        }
      ],
      Name: [
        {
          pattern: /^[A-Za-z\u4e00-\u9fa5]{1,6}$/,
          required: true,
          message: "请输入6位以内的汉字或字母",
          trigger: "blur"
        }
      ],
      StartTime: [
        {
          required: true,
          message: "请选择开始时间"
        }
      ],
      EndTime: [
        {
          required: true,
          message: "请选择结束时间"
        }
      ],
      Period: [
        {
          pattern: /^(([0-9]\d)|[0-9])$/,
          required: true,
          message: "请输入2位以内的整数"
        }
      ],
      Remark: [
        {
          pattern: /^.{1,50}$/,
          required: false,
          message: "请输入50位以内的内容"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      charactorTypeList: []
    };
  },
  created() {
    const { data } = this.$route.params;
    this.reset(data);
    this.getCharactorType();
  },

  methods: {
    getCharactorType() {
      fetchCharactorType({}).then(r => {
        this.charactorTypeList = r.data;
      });
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          Name: "",
          ShiftTypeId: "",
          EndTime: "",
          Remark: "",
          StartTime: "",
          Period: 0
        },
        data
      );
    },

    handleOpen() {
      const ShiftTypeId = this.form.ShiftTypeId;
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/classTime/components/index",
        params: { ShiftTypeId }
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