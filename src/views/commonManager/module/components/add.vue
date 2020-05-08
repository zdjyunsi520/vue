<template>
  <el-dialog width="500px" :title="title+'分类'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <!-- <el-col :span="24">
          <el-form-item label="父级分类" prop="parentId">
            <el-select v-model="form.parentId" clearable size="small">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in []" />
            </el-select>
          </el-form-item>
        </el-col> -->
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
            <el-input v-model="form.url" placeholder="请输入url" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用图标">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.iconurl" placeholder="点击选择图标" readonly>
                <svg-icon v-if="form.iconurl" slot="prefix" :icon-class="form.iconurl" class="el-input__icon" style="height: 32px;width: 16px;" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
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
import IconSelect from "@/components/IconSelect";
export default {
  components: { IconSelect },
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
  computed: {},
  methods: {
    selected(name) {
      this.form.iconurl = name;
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          url: "",
          name: "",
          key: "",
          type: 1,
          iconurl: "",
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
              this.$emit("getInfo");
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