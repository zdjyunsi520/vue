<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <!-- <p class="form-smtitle">{{title}}附件类型</p> -->
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="岗位名称" prop="Name">
                  <el-input v-model="form.Name" placeholder="请输入岗位名称" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="班次" prop="ShiftId">
                  <el-select v-model="form.ShiftId">
                    <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>

              <el-col>
                <el-col :span="8" :xs="24">
                  <el-form-item label="角色" prop="CharacterId">
                    <el-select v-model="form.CharacterId">
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/job";

export default {
  data() {
    const rules = {
      Name: [
        {
          required: true,
          message: "班组名称不能为空",
          trigger: "blur"
        }
      ],
      ShiftId: [
        {
          required: true,
          message: "请选择班次"
        }
      ],
      CharacterId: [
        {
          required: true,
          message: "请选择角色"
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
        name: "/runningDuty/dutyConfiguration/job/index",
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