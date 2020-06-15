<template>
  <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="100px">
      <el-col :span="12">
        <el-form-item label="所属单位" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密码" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="确认密码" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="预留手机号" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-form-item label="菜单权限">
        <el-checkbox-group v-model="form.moduleids" v-for="item in moduleList" :key="item.ModuleId">
          <el-row>
            <el-col :span="24">
              <el-checkbox :label="item.ModuleId">{{item.ModuleName}}</el-checkbox>
            </el-col>
            <el-col :span="4" v-for="chekcbox in item.Childs" :key="chekcbox.ModuleId">
              <el-checkbox :label="chekcbox.ModuleId">{{chekcbox.ModuleName}}</el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading"><svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存</el-button>
      <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
    </div>
    <!-- 添加或编辑参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { update, getInfo, add } from "@/api/commonManager/role";

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
            this.moduleList = data.ModuleData;
            this.form.moduleids = [];
            this.moduleList.forEach(v => {
              if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
              if (v.Childs)
                v.Childs.forEach(v => {
                  if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
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
            //保存编辑
            update(this.form)
              .then(response => {
                //消息提示
                this.$message.success('编辑成功！');
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
                this.$message.success('新增成功！');
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