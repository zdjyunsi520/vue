<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">
      <el-col :span="24" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box" style="border-bottom:none">
          <p class="form-smtitle">值班配置</p>

          <el-col :span="6" :xs="{span:24}">
            <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="88px" style="padding-right: 0px;">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="值班班组" prop="TeamId">
                    <el-select v-model="form.TeamId" :disabled="disabledSelect">
                      <el-option label="请选择" value></el-option>
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in teamList" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="班次类型" prop="ShiftIds">
                    <el-select v-model="form.ShiftIds" :disabled="disabledSelect">
                      <el-option label="请选择" value></el-option>
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="角色类型" prop="CharaType">
                    <el-select v-model="form.CharaType" :disabled="disabledSelect">
                      <el-option label="请选择" value></el-option>
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </div>

      </el-col>

    </el-row>
    <el-col :span="24" :xs='24' class="absolute-bottom">
      <div class="form-footer">
        <el-button type="primary" icon="el-icon-check" @click="handleConfirm" :loading="loading">保 存</el-button>
        <el-button icon="el-icon-arrow-left" @click="handleBack(null)">返 回</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import {
  fetchTeam,
  fetchShiftType,
  fetchCharactorType,
  update,
  add
} from "@/api/runningDuty/dutyConfiguration";

import { fetchList, deleted } from "@/api/runningDuty/dutyConfiguration/job";
import addJob from "./components/add";
export default {
  components: { addJob },
  data() {
    const rules = {
      TeamId: [{ required: true, message: "请选择值班班组" }],
      ShiftIds: [{ required: true, message: "请选择班次类型" }],
      CharaType: [{ required: true, message: "请选择角色类型" }]
    };

    return {
      loadingConfirm: false,
      loading: false,
      listLoading: false,
      form: {},
      teamform: {},
      rules,
      listLoading: false,
      dataList: [],
      queryParams: {
        pageno: 1,
        pagesize: 30
      },
      total: 1,
      disabledSelect: false,
      teamList: [],
      charactorTypeList: [],
      shiftTypeList: [],
      tableHeight: "calc(100% - 65px)",
      dialogAddVisible: false,
      dutyId: ""
    };
  },

  created() {
    this.getCharactorType();
    this.getTeam();
    this.getShiftType();
    this.reset();
    this.getList();
  },
  computed: {
    addDisabled() {
      return !this.form.teamId || !this.form.ShiftIds || !this.form.charatype;
    }
  },
  methods: {
    getTeam() {
      fetchTeam({}).then(r => {
        this.teamList = r.data;
      });
    },
    getShiftType() {
      fetchShiftType({}).then(r => {
        this.shiftTypeList = r.data;
      });
    },
    getCharactorType() {
      fetchCharactorType({}).then(r => {
        this.charactorTypeList = r.data;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection;
    },

    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(r => {
          this.dataList = r.data;
        })
        .finally(r => (this.listLoading = false));
    },
    handleConfirm() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loadingConfirm = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(r => {
              this.disabledSelect = true;
              this.dutyId = r.data.Id;
              this.$message.success("新增值班成功！");
            })
            .finally(r => (this.loadingConfirm = false));
        }
      });
    },
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          // TenantId: "3ad33f15-6456-4263-b417-43286b4f247f",
          // TenantName: "福建迅腾电力科技有限公司",
          TeamId: "",
          // TeamName: "班组二",
          // EmployeeIds: "",
          // EmployeeNames: "京帅",

          //  ShiftTypeName: "两班制",
          ShiftIds: "",

          //  ShiftNames: "夜班,白班",
          CharaType: ""
          //  CharaTypeName: "两班制人员",

          //  Characters: "夜班人员",

          //  Positions: null
        },
        data
      );
    },
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
    },
    handleUpdate() {
      this.disabledSelect = false;
    },
    handleDelete() {
      this.$confirm("确定要删除选中的岗位吗？")
        .then(r => {
          const Ids = this.ids.map(v => v.Id);
          deleted({ Ids }).then(r => {
            this.getList();
            this.$message.success("删除成功！");
          });
        })
        .catch(e => {});
    },
    handleBack() {
      this.$router.push({ name: "/runningDuty/dutyConfiguration/index" });
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          add(this.form).then(r => {
            this.$message.success("提交成功！");
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.search-box .el-form .el-form-item {
  margin-right: 0;
}
/deep/.form-smtitle {
  margin-bottom: 5px;
}
.comheight .containerbox {
  height: 100%;
}
</style>