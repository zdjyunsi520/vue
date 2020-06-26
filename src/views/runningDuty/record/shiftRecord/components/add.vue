<template>
  <el-dialog width="780px" :title="title+'交接班记录'" :visible.sync="dialogVisible" :modal-append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>
    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用电单位" prop="TenantId">
            <el-select v-model="form.TenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="班次" prop="ShiftId">
            <el-select v-model="form.ShiftId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in shifts" />
            </el-select>
          </el-form-item>

          <el-form-item label="交班人" prop="HandoverId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm" :checkedKeys="personId" />
          </el-form-item>

          <el-form-item label="接班人" prop="SuccessorId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm1" :checkedKeys="personId1" />
          </el-form-item>

          <el-form-item label="记录人" prop="RecorderId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm2" :checkedKeys="personId2" />
          </el-form-item>

          <el-form-item label="记录内容" prop="RecordContent">
            <el-input v-model="form.RecordContent" type="textarea" :rows="5" placeholder="请输入记录内容" />
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="值班班组" prop="TeamId">
            <el-select v-model="form.TeamId" @change="getInfo">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in teamList" />
            </el-select>
          </el-form-item>
          <el-form-item label="值班时间" prop="StartTime">
            <el-date-picker v-model="form.StartTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="交班时间" prop="HandoverTime">
            <el-date-picker v-model="form.HandoverTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="接班时间" prop="SuccessTime">
            <el-date-picker v-model="form.SuccessTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="记录时间" prop="CreateTime">
            <el-date-picker v-model="form.CreateTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="注意事项" prop="Caution">
            <el-input type="textarea" :rows="5" v-model="form.Caution" placeholder="请输入注意事项" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
      </el-button>
      <el-button @click="handleOpen(null)">
        <svg-icon icon-class='ic_cancel' class='cancelsvgicon '></svg-icon>取 消
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/shiftRecord";
import { getTrees, getTenantEmployees } from "@/api/org";
import { fetchTeam, fetchShiftType } from "@/api/runningDuty/dutyConfiguration";
import TreeSelect from "@/views/components/TreeSelect";
import { getInfo } from "@/api/runningDuty/dutyConfiguration/group";
export default {
  components: { TreeSelect },
  props: {
    shifts: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    const rules = {
      TenantId: [
        {
          required: true,
          message: "请选择用电单位",
          trigger: "blur"
        }
      ],
      ShiftId: [
        {
          required: true,
          message: "请选择班次",
          trigger: "blur"
        }
      ],
      HandoverId: [
        {
          required: true,
          message: "请选择交班人",
          trigger: "blur"
        }
      ],
      SuccessorId: [
        {
          required: true,
          message: "请选择接班人",
          trigger: "blur"
        }
      ],
      TeamId: [
        {
          required: true,
          message: "请选择值班班组",
          trigger: "blur"
        }
      ],
      StartTime: [
        {
          required: true,
          message: "请选择值班时间",
          trigger: "blur"
        }
      ],
      HandoverTime: [
        {
          required: true,
          message: "请选择交班时间",
          trigger: "blur"
        }
      ],
      SuccessTime: [
        {
          required: true,
          message: "请选择接班时间",
          trigger: "blur"
        }
      ],
      RecordContent: [
        {
          pattern: /^.{0,300}$/,
          required: true,
          message: "请输入300位以内的内容",
          trigger: "blur"
        }
      ],
      Caution: [
        {
          pattern: /^.{0,300}$/,
          required: true,
          message: "请输入300位以内的内容",
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
      //弹框选择人员--satrt
      ProcessorIds: [],
      allpatrolusers: [],
      personId: [],
      personId1: [],
      personId2: [],
      //弹框选择人员--end
      ischange: 0,
      teamList: [],
      shiftList: [],
      personList: []
    };
  },
  created() {
    //   this.getTenantEmployees();
    this.fetchTeam();
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType",
      recordType: "status/recordType",
      rwType: "status/rwType"
    })
  },
  methods: {
    getInfo() {
      if (this.ischange > 1) {
        this.personId = [];
        this.personId1 = [];
        this.personId2 = [];
      }
      this.ischange++;
      getInfo({ id: this.form.TeamId }).then(r => {
        let name = r.data.EmployeeNames.split(",");
        let list = r.data.EmployeeIds.split(",")
          .filter(v => v)
          .map((v, i) => {
            return { id: v, text: name[i] };
          });
        this.personList = list;
      });
    },
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },
    fetchTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.teamList = r.data;
      });
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          TenantId: "",
          ShiftId: "",
          HandoverId: "",
          SuccessorId: "",
          RecorderId: "",
          RecordContent: "",
          TeamId: "",
          StartTime: "",
          HandoverTime: "",
          SuccessTime: "",
          Caution: ""
          // teamname: "测试班组二",
          // shiftname: "晚班",
          // handovername: "网页测试",
          // successorname: "测试员工Size"
        },
        data
      );
      this.personList = [];
      if (this.form.Id) {
        this.getInfo();
      }
      this.form.RecorderId = this.form.RecorderId ? this.form.RecorderId : "";
      this.personId = this.form.HandoverId.split(",").filter(v => v);
      this.personId1 = this.form.SuccessorId.split(",").filter(v => v);
      this.personId2 = this.form.RecorderId.split(",").filter(v => v);
    },
    handleOpen(data) {
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
        this.$refs.form && this.$refs.form.clearValidate();
      }
      //表单重置
      this.reset(data);
    },
    handleConfirm(data) {
      this.personId = data.map(v => v.id);
      this.form.HandoverId = this.personId.join(",");
      this.$refs.form.clearValidate("HandoverId");
    },
    handleConfirm1(data) {
      this.personId1 = data.map(v => v.id);
      this.form.SuccessorId = this.personId1.join(",");
      this.$refs.form.clearValidate("SuccessorId");
    },
    handleConfirm2(data) {
      this.personId2 = data.map(v => v.id);
      this.form.RecorderId = this.personId2.join(",");
      this.$refs.form.clearValidate("RecorderId");
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(response => {
              var txt = this.form.Id ? "编辑成功！" : "新增成功！";
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
/deep/.el-dialog__body .onlyform-box .el-form .el-form-item {
  margin-bottom: 15px;
}
/deep/.el-select {
  width: 100%;
}
@media screen and (max-width: 768px) {
  /deep/.el-dialog {
    width: 100% !important;
  }
}
</style>