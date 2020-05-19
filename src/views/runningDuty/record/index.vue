<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <el-container direction="vertical">

          <el-main class=" search-box onlyform-box">

            <p class="form-smtitle">城讯电力</p>
            <el-row class="table-btns">
              <el-button :disabled="disabledSelect" type="primary" icon="el-icon-circle-check" @click="handleConfirm" :loading="loading">确 定</el-button>
              <el-button :disabled="!disabledSelect" icon="el-icon-edit-outline" @click="handleUpdate(null)">修 改</el-button>
            </el-row>
            <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
              <el-row>
                <el-col :span="24" :xs="24">
                  <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期"></el-date-picker>
                </el-col>
                <el-col :span="24">
                  {{dataList}}
                </el-col>
              </el-row>
            </el-form>

          </el-main>

          <el-main class="no-padding">
            <div class="search-box onlyform-box">
              12123132
            </div>
          </el-main>
        </el-container>

      </el-col>
      <el-col :xs="{span: 18}" :span="18" class="comheight">
        <div class="comheight">
          <div class="search-box onlyform-box">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="主记录" name="main"></el-tab-pane>
              <el-tab-pane label="值班记事" name="dutyRecord"></el-tab-pane>
              <el-tab-pane label="交接记录" name="shiftRecord"></el-tab-pane>
              <el-tab-pane label="巡视记录" name="patrolRecord"></el-tab-pane>
            </el-tabs>
            <dutyRecord ref="dutyRecord" v-show="activeName == 'dutyRecord'" />
            <shiftRecord ref="shiftRecord" v-show="activeName == 'shiftRecord'" />
            <patrolRecord ref="patrolRecord" v-show="activeName == 'patrolRecord'" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { fetchList } from "@/api/runningDuty/record";
import dutyRecord from "./dutyRecord";
import shiftRecord from "./shiftRecord";
import patrolRecord from "./patrolRecord";
export default {
  components: { dutyRecord, shiftRecord, patrolRecord },
  data() {
    const rules = {
      teamId: [{ required: true, message: "请选择值班班组" }],
      shifttypeId: [{ required: true, message: "请选择班次类型" }],
      charatype: [{ required: true, message: "请选择角色类型" }]
    };
    return {
      operateId: "",
      loading: false,
      form: {
        teamId: "",
        shifttypeId: "",
        charatype: ""
      },
      rules,
      assetAttributeType: [{ key: 1, value: "asdas" }],
      listLoading: false,
      dataList: [],
      queryParams: {
        pageno: 1,
        pagesize: 30
      },
      total: 1,
      disabledSelect: false,
      activeName: ""
    };
  },

  created() {
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
    handleClick(tab) {
      const target = this.$refs[this.activeName];
      target.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    handleSelectionChange() {},

    getInfo(data) {
      this.data = data;
      this.closeComponent();
      const target = this.$refs["component" + data.type];
      target.visible = true;
      target.showBtn = true;
      target.getInfo(data);
    },
    handleConfirm() {
      this.$refs.form.validate(v => {
        if (v) {
          this.disabledSelect = true;
        }
      });
    },

    handleAdd() {},
    handleUpdate() {},
    handleDelete() {},
    handleSubmit() {}
  }
};
</script>

<style lang="scss" scoped>
.comheight .containerbox {
  height: 100%;
}
.no-padding {
  padding: 0;
  &:nth-of-type(2) {
    margin-top: 20px;
  }
}
</style>