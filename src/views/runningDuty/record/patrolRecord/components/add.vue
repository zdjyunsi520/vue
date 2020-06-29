<template>
  <el-dialog width="830px" :title="title+'巡视记录'" :visible.sync="dialogVisible" :modal-append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>
    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row>
        <el-col :span="12" :xs="24">
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

          <el-form-item label="巡视人" prop="PatrolId">
            <div>
              <TreeSelect showText="text" :mutiple="false" :data="personList" :placeholder='"请选择巡视人"'  @change="handleConfirm" :checkedKeys="personId" />
            </div>
          </el-form-item>
          <el-form-item label="巡视开始时间" prop="PatrolStartTime">
            <el-date-picker v-model="form.PatrolStartTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="记录人" prop="RecorderId">
            <div>
              <TreeSelect showText="text" :mutiple="false" :data="personList" :placeholder='"请选择记录人"'  @change="handleConfirm1" :checkedKeys="personId1" />
            </div>
          </el-form-item>
          <el-form-item label="巡视内容" prop="RecordContent">
            <el-input v-model="form.RecordContent" type="textarea" :rows="5" placeholder="请输入巡视内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="值班班组" prop="TeamId">
            <el-select v-model="form.TeamId" @change="getInfo">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in teamList" />
            </el-select>
          </el-form-item>
          <el-form-item label="值班时间" prop="StartTime">
            <el-date-picker v-model="form.StartTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endtime">
            <div style="height: 36px;">
              &nbsp;
            </div>
          </el-form-item>

          <el-form-item label="巡视结束时间" prop="PatrolEndTime">
            <el-date-picker v-model="form.PatrolEndTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="记录时间" prop="RecordTime">
            <el-date-picker v-model="form.RecordTime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="巡视情况" prop="Situation">
            <el-input type="textarea" :rows="5" v-model="form.Situation" placeholder="请输入巡视情况" />
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
    <!-- 添加或编辑参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/patrolRecord";
import { getTrees, getTenantEmployees } from "@/api/org";
import { fetchTeam, fetchShiftType } from "@/api/runningDuty/dutyConfiguration";
import TreeSelect from "@/views/components/TreeSelect";
import { getInfo } from "@/api/runningDuty/dutyConfiguration/group";
export default {
  props: {
    shifts: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: { TreeSelect },
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
      PatrolId: [
        {
          required: true,
          message: "请选择巡视人",
          trigger: "blur"
        }
      ],
      PatrolStartTime: [
        {
          required: true,
          message: "请选择巡视开始时间",
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
      PatrolEndTime: [
        {
          required: true,
          message: "请选择巡视结束时间",
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
      Situation: [
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
      shiftList: [],
      teamList: [],
      ischange: 0,
      personList: []
    };
  },
  created() {
    this.getTenantEmployees();
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
    //弹框选择人员--satrt
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },
    handleConfirm(data) {
      this.personId = data.map(v => v.id);
      this.form.PatrolId = this.personId.join(",");
      this.$refs.form.clearValidate("PatrolId");
    },
    handleConfirm1(data) {
      this.personId1 = data.map(v => v.id);
      this.form.RecorderId = this.personId1.join(",");
      this.$refs.form.clearValidate("RecorderId");
    },
    //弹框选择人员--end
    fetchTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.teamList = r.data;
      });
      fetchShiftType({}).then(r => {
        this.shiftList = r.data;
      });
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          TenantId: "",
          TeamId: "",
          ShiftId: "",
          PatrolId: "",
          PatrolStartTime: "",
          PatrolEndTime: "",
          RecorderId: "",
          RecordTime: "",
          RecordContent: "",
          Situation: "",
          StartTime: ""
        },
        data
      );
      this.personList = [];
      if (this.form.Id) {
        this.getInfo();
      }
      this.form.RecorderId = this.form.RecorderId ? this.form.RecorderId : "";
      this.personId = this.form.PatrolId.split(",").filter(v => v);
      this.personId1 = this.form.RecorderId.split(",").filter(v => v);
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