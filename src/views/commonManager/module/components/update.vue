<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="父级分类" prop="parentId">
            <el-select v-model="form.parentId" clearable size="small">
              <el-option :key="item.id" :label="item.text" :value="item.id" v-for="item in dataList" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限标识" prop="key">
            <el-input v-model="form.key" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Url" prop="url">
            <el-input v-model="form.url" placeholder="请输入url" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
<<<<<<< HEAD
          <el-form-item label="component" prop="url">
            <el-input v-model="form.component" placeholder="请输入组件" />
=======
          <el-form-item label="Component" prop="component">
            <el-input v-model="form.component" placeholder="请输入component" />
>>>>>>> a9e032c5db44669079099c08e96ca3e3d30343d2
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" style="width:100px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { add, update } from "@/api/commonManager/module";
export default {
  data() {
    const rules = {
      userName: [
        {
          required: true,
          message: "用户名不能为空",
          trigger: "blur"
        }
      ],
      nickName: [
        {
          required: true,
          message: "用户昵称不能为空",
          trigger: "blur"
        }
      ],
      deptId: [
        {
          required: true,
          message: "归属分站不能为空",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          message: "用户密码不能为空",
          trigger: "blur"
        }
      ],
      email: [
        {
          type: "email",
          message: "'请输入正确的邮箱地址",
          trigger: ["blur", "change"]
        }
      ],
      phonenumber: [
        {
          pattern: /^1\d{10}$/,
          message: "请输入正确的手机号码",
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
      // 角色选项
      roleOptions: [],
      deptType: "",
      dataList: []
    };
  },
  created() {},
  computed: {},
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          url: "",
          name: "",
          key: "",
          type: 2,
          iconurl: "",
          component:'',
          sortindex: 1,
          parentId: ""
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
      this.reset(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          let fn;
          if (this.form.id) fn = update;
          else fn = add;
          fn(this.form)
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
/deep/.el-select {
  width: 100%;
}
</style>