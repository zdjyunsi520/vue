<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}岗位</p>
      <el-scrollbar class="marginright-fx">
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/job";

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
      dutyId,
      title
    } = this.$route.params;
    this.shiftTypeList = shiftTypeList || [];
    this.charactorTypeList = charactorTypeList || [];
    this.title = title;
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