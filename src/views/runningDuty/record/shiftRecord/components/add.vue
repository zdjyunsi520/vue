<template>
  <el-dialog :modal="false" width="1000px" :title="title+'交接班记录'" :visible.sync="dialogVisible" :modal-append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>
    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用电单位" prop="tenantId">
            <el-select v-model="form.tenantId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>

          <el-form-item label="班次" prop="shiftId">
            <el-select v-model="form.shiftId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in shiftList" />
            </el-select>
          </el-form-item>

          <el-form-item label="交班人" prop="handoverId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm" :checkedKeys="personId" />
          </el-form-item>

          <el-form-item label="接班人" prop="successorId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm1" :checkedKeys="personId1" />
          </el-form-item>

          <el-form-item label="记录人" prop="recorderId">
            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm2" :checkedKeys="personId2" />
          </el-form-item>
          <el-form-item label="记录内容" prop="recordcontent">
            <el-input v-model="form.recordcontent" type="textarea" :rows="5" placeholder="请输入记录内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值班班组" prop="teamId">
            <el-select v-model="form.teamId">
              <el-option label="请选择" value></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in teamList" />
            </el-select>
          </el-form-item>
          <el-form-item label="值班时间" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="交班时间" prop="handovertime">
            <el-date-picker v-model="form.handovertime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="接班时间" prop="successtime">
            <el-date-picker v-model="form.successtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="记录时间" prop="endtime">
            <el-date-picker v-model="form.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>

          <el-form-item label="注意事项" prop="caution">
            <el-input type="textarea" :rows="5" v-model="form.caution" placeholder="请输入注意事项" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/dutyRecord";
import { getTrees, getTenantEmployees } from "@/api/org";
import { fetchTeam, fetchShiftType } from "@/api/runningDuty/dutyConfiguration";
import TreeSelect from "@/views/components/TreeSelect";
export default {
  components: { TreeSelect },
  data() {
    const rules = {
      tenantId: [
        {
          required: true,
          message: "请选择用电单位",
          trigger: "blur"
        }
      ],
      shiftId: [
        {
          required: true,
          message: "请选择班次",
          trigger: "blur"
        }
      ],
      handoverId: [
        {
          required: true,
          message: "请选择交班人",
          trigger: "blur"
        }
      ],
      successorId: [
        {
          required: true,
          message: "请选择接班人",
          trigger: "blur"
        }
      ],
      teamId: [
        {
          required: true,
          message: "请选择值班班组",
          trigger: "blur"
        }
      ],
      starttime: [
        {
          required: true,
          message: "请选择值班时间",
          trigger: "blur"
        }
      ],
      handovertime: [
        {
          required: true,
          message: "请选择交班时间",
          trigger: "blur"
        }
      ],
      successtime: [
        {
          required: true,
          message: "请选择接班时间",
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
      shiftList: []
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
    }),
    personList() {
      let list = [];
      if (this.ischange > 1) {
        this.personId = [];
        this.personId1 = [];
      }
      this.ischange++;
      this.allpatrolusers.forEach(v => {
        if (v.id == this.form.tenantId) {
          list = v.childs;
        }
      });
      return list;
    }
  },
  methods: {
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },
    fetchTeam() {
      fetchTeam({}).then(r => {
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
          tenantId: "",
          shiftId: "",
          handoverId: "",
          successorId: "",
          recorderId: "",
          recordcontent: "",
          teamId: "",
          starttime: "",
          handovertime: "",
          successtime: "",
          endtime: "",
          caution: ""
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
    handleConfirm(data) {
      this.personId = data.map(v => v.id);
      this.form.handoverId = this.personId.join(",");
      this.$refs.form.clearValidate("handoverId");
    },
    handleConfirm1(data) {
      this.personId1 = data.map(v => v.id);
      this.form.successorId = this.personId.join(",");
      this.$refs.form.clearValidate("successorId");
    },
    handleConfirm2(data) {
      this.personId2 = data.map(v => v.id);
      this.form.recorderId = this.personId.join(",");
      this.$refs.form.clearValidate("recorderId");
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(response => {
              var txt = this.form.Id ? '编辑成功！' : '新增成功！';
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
</style>