<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">
      <el-col :span="24" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box" style="border-bottom:none">
          <p class="form-smtitle">值班配置</p>

            <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="80px" style="padding-right: 0px;">
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
                    <el-select v-model="form.ShiftTypeId">
                      <el-option label="请选择" value></el-option>
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="角色类型" prop="charatypeId">
                    <el-select v-model="form.charatypeId">
                      <el-option label="请选择" value></el-option>
                      <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
        </div>

      </el-col>

    </el-row>
    <el-col :span="24" :xs='24' class="absolute-bottom">
      <div class="form-footer">
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
        </el-button>
        <el-button @click="handleBack(null)">
          <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
        </el-button>
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
      ShiftTypeId: [{ required: true, message: "请选择班次类型" }],
      charatypeId: [{ required: true, message: "请选择角色类型" }]
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

      teamList: [],
      charactorTypeList: [],
      shiftTypeList: [],
      tableHeight: "calc(100% - 65px)",
      dialogAddVisible: false,
      dutyId: "",
      ifused: false
    };
  },

  created() {
    const { data, ifused } = this.$route.params;
    if (ifused) {
      this.ifused = true;
    }
    this.getCharactorType();
    this.getShiftType();
    this.reset(data);
    this.getTeam();
  },
  computed: {
    disabledSelect() {
      return this.form.Id ? true : false;
    }
  },
  methods: {
    getTeam() {
      if (this.form.Id) {
        this.teamList = [
          {
            Id: this.form.TeamId,
            Name: this.form.TeamName
          }
        ];
      } else {
        fetchTeam({}).then(r => {
          this.teamList = r.data;
        });
      }
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
              this.$message.success("操作成功！");
              this.handleBack();
            })
            .finally(r => (this.loadingConfirm = false));
        }
      });
    },
    reset(data) {
      data = data || {};
      const { Id, TeamId, ShiftTypeId, CharaType, TeamName } = data;
      this.form = {
        Id,
        TeamId,
        ShiftTypeId,
        charatypeId: CharaType,
        TeamName
      };
    },
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
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

.comheight .containerbox {
  height: 100%;
}
/deep/.onlyform-box .el-form .el-form-item {
  width: 350px;
  display: inline-block;
  vertical-align: text-top;
}
</style>