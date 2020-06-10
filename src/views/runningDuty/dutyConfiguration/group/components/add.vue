<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">班组信息</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
              <el-col :span="8" :xs="24">
                <el-form-item label="班组名称" prop="Name">
                  <el-input v-model="form.Name" placeholder="请输入班组名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="班组成员" prop="EmployeeNames">
                  <TreeSelect showText="text" :data="allpatrolusers" @change="handleConfirm" :checkedKeys="personId" />
                </el-form-item>
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
import {
  add,
  update,
  getEmployees as getTenantEmployees
} from "@/api/runningDuty/dutyConfiguration/group";
import { mapActions } from "vuex";
import { getTrees } from "@/api/org";
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
      Name: [
        {
          required: true,
          message: "班组名称不能为空",
          trigger: "blur"
        }
      ],
      EmployeeIds: [
        {
          required: true,
          message: "请选择班组成员"
        }
      ],
      EmployeeNames: [
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
    const { data } = this.$route.params;
    this.reset(data);
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
      getTenantEmployees({ dutyteamId: this.form.Id }).then(res => {
        this.allpatrolusers = res.data;
      });
    },

    handleConfirm(data) {
      this.personId = data.map(v => v.id);
      this.form.EmployeeIds = this.personId.join(",");
      this.form.EmployeeNames = data.map(v => v.text).join(",");
      this.$refs.form.clearValidate("EmployeeNames");
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          Name: "",
          EmployeeNames: "",
          EmployeeIds: ""
        },
        data
      );
      if (this.form.EmployeeIds)
        this.personId = this.form.EmployeeIds.split(",");
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