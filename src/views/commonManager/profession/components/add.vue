<template>
  <el-dialog width="500px" :title="'新增'+title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24" v-if="hasParentKey" >
          <el-form-item label="父级分类" prop="parentKey">
            <el-select v-model="form.parentKey" clearable size="small">
              <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in dataList" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="代码" prop="key">
            <el-input v-model="form.key" placeholder="请输入代码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
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
import { add, update } from "@/api/commonManager/profession";
export default {
  data() {
    const rules = {
      key: [
        {
          required: true,
          message: "此处不能为空",
          trigger: "blur"
        }
      ],
      name: [
        {
          required: true,
          message: "此处不能为空",
          trigger: "blur"
        }
      ],
     
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
      dataList: [],
      hasParentKey:true
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
          key: "",
          name: "",
          type: 1,
          parentKey:'',
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
      this.$nextTick(()=>{
          this.$refs.form.clearValidate();
      })
    },
    /** 提交按钮 */
    handleSubmit: function() {
      // this.form.parentKey = this.form.parentKey==''?undefined:this.form.parentKey;
      this.form.type = (this.form.parentKey&&this.form.parentKey!='')?2:1;
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
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