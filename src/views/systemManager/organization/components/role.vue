<template>
  <div>
    <div style="height:60vh;overflow:hidden;" ref="containerbox">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item>
          <!-- <el-checkbox-group v-model="form.powers"> -->
          <el-table :data="moduleList" border :height="tableHeight">
            <el-table-column prop="date" label="角色" width="180">
              <template slot="header">
                <el-checkbox @change="handleChangeFarther">角色</el-checkbox>
              </template>
              <template slot-scope="{row}">
                <el-checkbox @change="handleChange(row)" v-model="row.IsSelect">{{row.RoleName}}</el-checkbox>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="模块配置">
              <template slot-scope="{row}">

                <el-row v-for="item in row.ModuleData" :key="item.ModuleId" class="el-row-box">
                  <el-col :span="24">
                    <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.ModuleName}}</el-checkbox>
                  </el-col>
                  <el-row>
                    <el-col :span="23" :push="1">
                      <el-row class="el-row-box">
                        <el-col :span="6" v-for="checkbox in item.Childs" :key="checkbox.ModuleId">
                          <el-checkbox v-model="checkbox.IsSelect">{{checkbox.ModuleName}}</el-checkbox>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <!-- </el-checkbox-group> -->
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  setRole as update,
  getRole as getInfo
} from "@/api/systemManager/organization";
export default {
  data() {
    const rules = {
      roleName: [
        {
          required: true,
          message: "角色名称不能为空",
          trigger: "blur"
        }
      ],
      roleKey: [
        {
          required: true,
          message: "权限字符不能为空",
          trigger: "blur"
        }
      ],
      roleSort: [
        {
          required: true,
          message: "角色顺序不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      tableHeight: "",
      form: {
        id: "",
        name: "",
        key: "",
        powers: [],
        sortindex: 1
      },
      farther: false,
      rules,
      dialogVisible: false,
      loading: false,
      title: "权限编辑",
      // 角色选项
      roleOptions: [],
      deptType: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      moduleList: [],
      list: []
    };
  },
  created() {
    const data = this.$route.params.data;
    this.getInfo(data);
  },
  mounted() {
    let _this = this;
    window.onresize = () => {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight;
    },
    handleChangeFarther(isSelect) {
      this.moduleList.map(v => {
        v.IsSelect = isSelect;
        this.handleChange(v);
        return v;
      });
    },
    handleChange(data) {
      const isSelect = data.IsSelect;
      const childs = data.Childs || data.ModuleData;
      if (childs)
        childs.forEach(v => {
          v.IsSelect = isSelect;
          this.handleChange(v);
        });
    },
    getInfo(data) {
      this.loading = true;
      getInfo(data)
        .then(({ data }) => {
          this.moduleList = data;
          this.setTableHeight();
        })
        .finally(v => (this.loading = false));

      this.reset(data);
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          name: "",
          key: "",
          powers: [],
          sortindex: 1
        },
        data
      );
    },
    handleOpen(data) {
      let name = "/systemManager/organization/index";
      this.$router.push({
        name: name,
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          this.form.powers = [];
          // this.moduleList.forEach(v => {
          //   if (v.IsSelect) {
          //     const RoleId = v.RoleId;
          //     this.form.powers.push({ RoleId });
          //   }
          // });
          this.moduleList.forEach((v, i) => {
            if (v.IsSelect) this.form.powers.push(v.RoleId);
            if (v.ModuleData)
              v.ModuleData.forEach(v => {
                if (v.IsSelect) this.form.powers.push(v.ModuleId);
                if (v.IsSelect) this.form.powers.push(v.ModuleId);
                if (v.Childs)
                  v.Childs.forEach(v => {
                    if (v.IsSelect) this.form.powers.push(v.ModuleId);
                  });
              });
          });
          // this.form.powers = [...new Set(this.form.powers)];
          this.form.moduleids = this.form.powers.join(",");
          this.form.powers = "";
          //保存修改
          update(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              this.$emit("getList");
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
/deep/.xl-checkbox {
  .el-checkbox__label {
    font-weight: bold;
    color: #f00;
  }
  .el-checkbox__inner {
    border-color: #f00;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #f00;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #f00;
    border-color: #f00;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #f00;
  }
}
</style>