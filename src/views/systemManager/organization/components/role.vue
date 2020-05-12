<template>
  <el-dialog width="80%" top="20px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item>
        <!-- <el-checkbox-group v-model="form.powers"> -->
        <el-table :data="moduleList">
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

              <el-row v-for="item in row.ModuleData" :key="item.ModuleId">
                <el-col :span="24" class="xl-checkbox">
                  <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.ModuleName}}</el-checkbox>
                </el-col>
                <el-col :span="6" v-for="checkbox in item.Childs" :key="checkbox.ModuleId">
                  <el-checkbox v-model="checkbox.IsSelect">{{checkbox.ModuleName}}</el-checkbox>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- </el-checkbox-group> -->
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
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
      title: "",
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
  created() {},
  methods: {
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
      console.log(data);
      this.loading = true;

      getInfo(data)
        .then(({ data }) => {
          this.moduleList = data;
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
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.getInfo(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          this.form.powers = [];
          this.moduleList.forEach(v => {
            if (v.IsSelect) {
              const RoleId = v.RoleId;
              this.form.powers.push({ RoleId });
            }
          });
          // this.moduleList.forEach((v, i) => {
          //   if (v.IsSelect) this.form.powers.push(v.RoleId);
          //   if (v.ModuleData)
          //     v.ModuleData.forEach(v => {
          //      if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //       if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //       if (v.Childs)
          //         v.Childs.forEach(v => {
          //           if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //         });
          //     });
          // });
          //this.form.powers = [...new Set(this.form.powers)];
          //this.form.powers = this.form.powers.join(",");

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