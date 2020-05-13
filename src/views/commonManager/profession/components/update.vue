<template>
  <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

          <el-form-item label="父级分类" prop="parentKey">
            <el-select v-model="form.parentKey" clearable size="small">
              <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in dataList" />
            </el-select>
          </el-form-item>

          <el-form-item label="代码" prop="key">
            <el-input v-model="form.key" placeholder="请输入代码" />
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>

          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
          </el-form-item>

        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check"   @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>

  </div>
  </div>
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
  created() {
    let { data, title } = this.$route.params;
    this.title=title;
    this.reset(data);
  },
  computed: {},
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          key: "",
          name: "",
          type: 2,
          sortindex: 1,
          parentKey: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/profession/index",
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          update(this.form)
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
</style>