<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <!-- <p class="form-smtitle">{{title}}附件类型</p> -->
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="班组名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入班组名称" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="班组成员" prop="employeenames">
                  <TreeSelect showText="text" :data="allpatrolusers" @change="handleConfirm" :checkedKeys="personId" />

                </el-form-item>
              </el-col>
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/group";
import { mapActions } from "vuex";
import { getTrees, getTenantEmployees } from "@/api/org";
import TreeSelect from "@/views/components/TreeSelect";
const appNameList = [{ key: 1, value: "用户端" }];
const forceUpdateList = [
  { key: true, value: "是" },
  { key: false, value: "否" }
];
export default {
  components: { TreeSelect },
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "班组名称不能为空",
          trigger: "blur"
        }
      ],
      employeeIds: [
        {
          required: true,
          message: "请选择班组成员"
        }
      ],
      employeenames: [
        {
          required: true,
          message: "请选择班组成员"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      roleList: [],
      props: {
        label: "text",
        children: "childs"
      },
      personId: [],
      dialogMemberVisible: false,
      ischange: 0,
      allpatrolusers: []
    };
  },
  created() {
    this.getTenantEmployees();
  },
  computed: {
    personList() {
      let list = [];
      if (this.ischange > 1) {
        this.personId = [];
      }
      this.ischange++;
      this.allpatrolusers.forEach(v => {
        if (v.id == this.form.tenantId) {
          list = v.childs;
        }
      });
      return list;
    }
  },
  methods: {
    ...mapActions({ employee: "common/employee" }),

    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },

    handleConfirm(data) {
      this.personId = data.map(v => v.id);
      this.form.employeeIds = this.personId.join(",");
      this.form.employeenames = data.map(v => v.text).join(",");
      this.$refs.form.clearValidate("employeenames");
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          // tenantId: "cb1618fe-0c4c-4cc9-bfb4-08f3a243d7af",
          name: "",
          employeenames: "",
          employeeIds: ""
        },
        data
      );
    },

    handleOpen(data) {
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/group/index",
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