<template>
  <el-dialog width="500px" :title="title+typeText" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="父级分类" prop="parentId">
            <el-select v-model="form.parentId" clearable size="small">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in []" />
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
          <el-form-item label="url" prop="url">
            <el-input v-model="form.url" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-form-item label="排序号" prop="sortindex">
          <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
        </el-form-item>
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
import { getInfo } from "@/api/commonManager/module";
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
      deptType: ""
    };
  },
  created() {},
  computed: {
    typeText() {
      return this.form.type == 1
        ? "分类"
        : this.form.type == 2
        ? "应用"
        : this.form.type == 3
        ? "权限"
        : "";
    }
  },
  methods: {
    getInfo(data) {
      this.loading = true;
      if (data) {
        const id = data.id;
        const parentId = data.parentId;
        if (id) {
          getInfo({ id })
            .then(res => {
              const o = {};
              for (let key in res.data) {
                o[key.toLowerCase()] = res.data[key];
              }
              o.parentId = res.data.ParentId;
              this.reset(o);
            })
            .finally(v => (this.loading = false));
        } else if (parentId) {
          this.loading = false;
          data.parentId = parentId;
          this.reset(data);
        }
      } else {
        this.loading = false;
        this.reset(data);
      }
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          parentId: null,
          path: "",
          name: "",
          key: "",
          type: "",
          IconUrl: "",
          sortindex: 1,
          url: ""
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
          //添加用户
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
/deep/.el-select {
  width: 100%;
}
</style>