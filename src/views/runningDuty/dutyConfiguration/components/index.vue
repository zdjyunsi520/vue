<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box" style="border-bottom:none">
          <p class="form-smtitle">新增值班</p>
          <el-row class="table-btns">
            <el-button :disabled="disabledSelect" type="primary" icon="el-icon-circle-check" @click="handleConfirm" :loading="loading">确 定</el-button>
            <el-button :disabled="!disabledSelect" @click="handleUpdate(null)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>修 改
            </el-button>
          </el-row>
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
                <el-form-item label="班次类型" prop="ShiftTypeId">
                  <el-select v-model="form.ShiftTypeId" :disabled="disabledSelect">
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

        </div>

      </el-col>
      <el-col :xs="{span: 18}" :span="18" class="comheight">
        <div class="comheight">
          <div class="search-box onlyform-box" style="border-bottom:none">
            <p class="form-smtitle">岗位设置</p>
            <div class="bg-white containerbox" style="padding:0">
              <el-row class="table-btns">
                <el-button :disabled="!disabledSelect" type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
                <el-button :disabled="!disabledSelect" icon="el-icon-delete" @click="handleDelete">删除</el-button>
              </el-row>
              <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="height">
                <el-table-column type="selection" fixed="left" width="55" align="center" />
                <el-table-column label="岗位名称" align="center" prop="TeamName" />
                <el-table-column label="班次" align="center" prop="ShiftNames" />
                <el-table-column label="角色" align="center" prop="Characters" />

              </el-table>
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="新增岗位" :visible.sync="dialogAddVisible" center width="550px" append-to-body>
      <el-form :model="teamform" ref="queryForm" class="xl-query" :rules="mrules" label-width="130px">
        <el-form-item label="岗位名称" prop="TeamName">
          <el-input type="text" v-model="teamform.TeamName"></el-input>
        </el-form-item>
        <el-form-item label="班次" prop="ShiftNames">
          <el-select v-model="teamform.ShiftNames" style="width:100%;">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item,index) in shifts" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="Characters">
          <el-select v-model="teamform.Characters" style="width:100%;">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item,index) in character" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddCheck">保 存</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import {
  fetchList,
  fetchTeam,
  fetchShiftType,
  fetchCharactorType,
  update,
  add
} from "@/api/runningDuty/dutyConfiguration";
export default {
  components: {},
  data() {
    const rules = {
      TeamId: [{ required: true, message: "请选择值班班组" }],
      ShiftTypeId: [{ required: true, message: "请选择班次类型" }],
      CharaType: [{ required: true, message: "请选择角色类型" }]
    };
    const mrules = {
      TeamName: [{ required: true, message: "请输入岗位名称" }],
      ShiftNames: [{ required: true, message: "请选择班次" }],
      Characters: [{ required: true, message: "请选择角色" }]
    };
    return {
      loading: false,
      listLoading: false,
      form: {},
      teamform: {},
      rules,
      mrules,
      listLoading: false,
      dataList: [],
      tableHeight: "0",
      queryParams: {
        pageno: 1,
        pagesize: 30
      },
      total: 1,
      disabledSelect: false,
      teamList: [],
      charactorTypeList: [],
      shiftTypeList: [],
      height: "calc(100% - 65px)",
      dialogAddVisible: false,
      shifts: [
        {
          id: 1,
          name: "白班"
        },
        {
          id: 2,
          name: "晚班"
        }
      ],
      character: [
        {
          id: 1,
          name: "正值"
        },
        {
          id: 2,
          name: "副值"
        }
      ]
    };
  },

  created() {
    this.getCharactorType();
    this.getTeam();
    this.getShiftType();
  },
  computed: {
    addDisabled() {
      return (
        !this.form.teamId || !this.form.shifttypeId || !this.form.charatype
      );
    }
  },
  methods: {
    getTeam() {
      fetchTeam(this.queryParams).then(r => {
        this.teamList = r.data;
      });
    },
    getShiftType() {
      fetchShiftType(this.queryParams).then(r => {
        this.shiftTypeList = r.data;
      });
    },
    getCharactorType() {
      fetchCharactorType(this.queryParams).then(r => {
        this.charactorTypeList = r.data;
      });
    },
    handleSelectionChange() {},

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
          this.disabledSelect = true;
        }
      });
    },
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          TenantId: "",
          // TenantName: "福建迅腾电力科技有限公司",
          TeamId: "",
          // TeamName: "班组二",
          EmployeeIds: "",
          // EmployeeNames: "京帅",
          ShiftTypeId: "",
          //  ShiftTypeName: "两班制",
          ShiftIds: "",
          //  ShiftNames: "夜班,白班",
          CharaType: "",
          //  CharaTypeName: "两班制人员",
          CharacterIds: "",
          //  Characters: "夜班人员",
          PositionIds: ""
          //  Positions: null
        },
        data
      );
    },
    handleAdd() {
      this.dialogAddVisible = true;
    },
    handleUpdate() {},
    handleDelete() {},
    handleAddCheck() {},
    handleSubmit() {}
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