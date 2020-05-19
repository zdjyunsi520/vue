<template>
  <el-dialog top="20px" width="1000px" :title="title+'交接班记录'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>
    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用电单位" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="班次" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="交班人" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="接班人" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="记录人" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>
          <el-form-item label="记录内容" prop="contactperson">
            <el-input v-model="form.contactperson" type="textarea" :rows="5" placeholder="请输入记录内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班次" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>
          <el-form-item label="起始日期" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="完成日期" prop="endtime">
            <el-date-picker v-model="form.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="完成日期" prop="endtime">
            <el-date-picker v-model="form.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="完成日期" prop="endtime">
            <el-date-picker v-model="form.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="注意事项" prop="recordcontent">
            <el-input type="textarea" :rows="5" v-model="form.recordcontent" placeholder="请输入注意事项" />
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
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/dutyRecord";
export default {
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "请输入角色",
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
          endtime: 1,
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
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(response => {
              this.msgSuccess(response.msg);
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