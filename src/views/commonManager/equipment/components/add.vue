<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="90px" :inline-message="true" style="max-width:370px;">
          <el-form-item label="设备类型" prop="type">
            <el-select v-model="form.type" clearable>
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item>

          <el-form-item label="设备编码" prop="serialcode">
            <el-input v-model="form.serialcode" placeholder="请输入设备编码" />
          </el-form-item>

          <el-form-item label="设备校验码" prop="checkcode">
            <el-input v-model="form.checkcode" placeholder="烟感、摄像头必填" />
          </el-form-item>

          <!-- <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="" />
          </el-form-item> -->
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">

        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import { add } from "@/api/commonManager/equipment";
import { mapGetters } from "vuex";
export default {
  data() {
    const rules = {
      type: [
        {
          required: true,
          message: "此处不能为空",
          trigger: "blur"
        }
      ],
      serialcode: [
        {
          pattern: /^[A-Za-z0-9]{1,42}$/,
          required: true,
          message: "请输入42位以内的数字或字母",
          trigger: "blur"
        }
      ],
      checkcode: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          message: "请输入18位以内的数字或字母或特殊符号",
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
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {
    ...mapGetters({ equipmentType: "status/equipmentType" })
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          type: "",
          serialcode: "",
          checkcode: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/equipment/index",
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.type == 4 || this.form.type == 5) {
            if (this.form.checkcode == "") {
              this.$message.error("请输入设备校验码");
              return;
            }
          }
          //按钮转圈圈
          this.loading = true;
          //添加用户
          add(this.form)
            .then(response => {
              //消息提示
              this.$message.success("新增成功！");

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