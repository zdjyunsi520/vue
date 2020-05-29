<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box" style="border-bottom:none">
          <p class="form-smtitle">新增值班</p>
          <el-row class="table-btns">
            <el-tag type="danger">此处写死用电ID，否则无法添加</el-tag>
            <el-button :disabled="disabledSelect" type="primary" icon="el-icon-circle-check" @click="handleConfirm" :loading="loadingConfirm">确 定</el-button>
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
                <el-button type="info" plain icon="el-icon-delete" @click="handleDelete">删除</el-button>
                <el-button type="primary" icon="el-icon-check" @click="handleBack">保 存</el-button>
                <el-button type="info" plain icon="el-icon-delete" @click="handleBack">返回</el-button>
              </el-row>
              <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="height">

                <template slot="empty">
                  <div class="nodata-box">
                    <img src="../../../../assets/image/nodata.png" />
                    <p>暂时还没有数据</p>
                  </div>
                </template>
                <el-table-column type="selection" fixed="left" width="55" />
                <el-table-column label="岗位名称" min-width="100" prop="Name" />
                <el-table-column label="班次" min-width="100" prop="ShiftName" />
                <el-table-column label="角色" min-width="100" prop="CharacterName" />

              </el-table>
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <add-job ref="add" :shiftTypeId="form.ShiftTypeId" :charaType="form.CharaType" :dutyId='dutyId' @getList="getList" />
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
      ShiftTypeId: [{ required: true, message: "请选择班次类型" }],
      CharaType: [{ required: true, message: "请选择角色类型" }]
    };
    const mrules = {
      TeamName: [{ required: true, message: "请输入岗位名称" }],
      ShiftNames: [{ required: true, message: "请选择班次" }],
      Characters: [{ required: true, message: "请选择角色" }]
    };
    return {
      loadingConfirm: false,
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
      dutyId: "",
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
    this.reset();
    this.getList();
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
      var shiftIds = this.$refs.add.classTimeList.map(v => v.Id);
      this.form.ShiftIds = shiftIds.join(",");
      var shiftnames = this.$refs.add.classTimeList.map(v => v.Name);
      this.form.shiftnames = shiftnames.join(",");

      var characterIds = this.$refs.add.roleList.map(v => v.Id);
      this.form.CharacterIds = characterIds.join(",");
      var characters = this.$refs.add.roleList.map(v => v.Name);
      this.form.characters = characters.join(",");

      this.$refs.form.validate(v => {
        if (v) {
          this.loadingConfirm = true;
          const fn = this.form.Id ? update : add;
          fn(this.form)
            .then(r => {
              this.disabledSelect = true;
              this.dutyId = r.data.Id;
              this.$message.success("成功新增值班！");
            })
            .finally(r => (this.loadingConfirm = false));
        }
      });
    },
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          TenantId: "3ad33f15-6456-4263-b417-43286b4f247f",
          // TenantName: "福建迅腾电力科技有限公司",
          TeamId: "",
          // TeamName: "班组二",
          // EmployeeIds: "",
          // EmployeeNames: "京帅",
          ShiftTypeId: "",
          //  ShiftTypeName: "两班制",
          ShiftIds: "",
          shiftnames: "",
          //  ShiftNames: "夜班,白班",
          CharaType: "",
          //  CharaTypeName: "两班制人员",
          CharacterIds: "",
          //  Characters: "夜班人员",
          characters: ""
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
            this.$message.success("删除成功");
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
            this.$message.success("操作成功");
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