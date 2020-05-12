<template>
  <div class="search-box" style="height:100%;position: relative;padding-bottom:90px">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline-message="true">

          <el-form-item label="父级分类" prop="parentKey" v-if="form.type!=1">
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
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" style="width:100px" />
          </el-form-item>

        </el-form>
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
      </el-col>

    </el-row>
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
    let { data, title, dataList } = this.$route.params;
    this.dataList = dataList;
    this.reset(data);
  },
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
          parentKey: "",
          sortindex: 1
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
          const fn = this.form.key ? update : add;
          fn(this.form)
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