<template>
  <el-dialog width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item>
        <el-checkbox-group v-model="form.moduleids">
          <el-table :data="moduleList">
            <el-table-column prop="date" label="角色" width="180">
              <template slot-scope="{row}">
                <el-checkbox :label="row.RoleId">{{row.RoleName}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="模块配置">
              <template slot-scope="{row}">
                <el-row v-for="item in row.ModuleData" :key="item.ModuleId">
                  <el-col :span="24">
                    <el-checkbox :label="item.ModuleId">{{item.ModuleName}}</el-checkbox>
                  </el-col>
                  <el-col :span="6" v-for="chekcbox in item.Childs" :key="chekcbox.ModuleId">
                    <el-checkbox :label="chekcbox.ModuleId">{{chekcbox.ModuleName}}</el-checkbox>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
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
  updateRole as update,
  getRole as getInfo
} from "@/api/commonManager/user";

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
        moduleids: [],
        sortindex: 1
      },
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
      moduleList: []
    };
  },
  created() {},
  methods: {
    getInfo(data) {
      this.loading = true;
      if (data && data.id) {
        const id = data.id;
        getInfo({ id })
          .then(({ data }) => {
            this.moduleList = data;
            this.form.moduleids = [];
            this.moduleList.forEach(v => {
              if (v.IsSelect) this.form.moduleids.push(v.RoleId);
              if (v.ModuleData)
                v.ModuleData.forEach(v => {
                  if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
                  if (v.Childs)
                    v.Childs.forEach(v => {
                      if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
                    });
                });
            });
          })
          .finally(v => (this.loading = false));
      } else {
        this.loading = false;
      }
      this.reset(data);
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          name: "",
          key: "",
          moduleids: [],
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
          this.form.moduleids = this.form.moduleids.join(",");
          if (this.form.id) {
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
          } else {
            //添加用户
            add(this.form)
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
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>