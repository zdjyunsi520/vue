<template>
  <el-dialog :modal="false" width="500px" :title="title+'值班记事'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="起始日期" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="完成日期" prop="endtime">
            <el-date-picker v-model="form.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="用电单位" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phoneno">
            <el-input v-model="form.phoneno" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="记事类型" prop="type">
            <el-select v-model="form.type">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in recordType" />
            </el-select>
          </el-form-item>
          <el-form-item label="导入下一班" prop="issucceed">
            <el-select v-model="form.issucceed">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in rwType" />
            </el-select>
          </el-form-item>
          <el-form-item label="记事内容" prop="recordcontent">
            <el-input type="textarea" :rows="5" v-model="form.recordcontent" placeholder="请输入记事内容" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或编辑参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/dutyRecord";
export default {
  data() {
    const rules = {
      starttime: [
        {
          required: true,
          message: "请选择起始日期",
          trigger: "blur"
        }
      ],
      endtime: [
        {
          required: true,
          message: "请选择完成日期",
          trigger: "blur"
        }
      ],
      tenantId: [
        {
          required: true,
          message: "请选择用电单位",
          trigger: "blur"
        }
      ],
      type: [
        {
          required: true,
          message: "请选择记事类型",
          trigger: "blur"
        }
      ],
      issucceed: [
        {
          required: true,
          message: "请输入导入下一班",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: ""
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      companyType: "status/companyType",
      recordType: "status/recordType",
      rwType: "status/rwType"
    })
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          starttime: "",
          endtime: "",
          tenantId: "",
          contactperson: "",
          phoneno: "",
          type: "",
          recordcontent: "",
          issucceed: ""
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
        this.$refs.form.clearValidate();
      }
      //表单重置
      this.reset(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.form.tenantname = "asdasd";
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(response => {
              var txt = this.form.id ? '编辑成功！' : '新增成功！';
              this.$message.success(txt);
              this.$emit("getList");
              this.handleOpen();
            })
            .catch(r => {
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