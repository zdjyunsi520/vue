<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <el-container direction="vertical">

          <el-main class=" search-box onlyform-box">

            <el-row>
              <el-col class="form-smtitle">
                城讯电力
              </el-col>
              <el-col>
                <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期"></el-date-picker>
              </el-col>
              <el-col>
                <el-radio-group v-model="radio">
                  <el-radio :label="3">白班 20:00:00-8:00:00</el-radio>
                  <el-radio :label="6">白班 20:00:00-8:00:00</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>

          </el-main>

          <el-main class="no-padding">
            <el-row class="search-box onlyform-box">
              <el-col>正值：张三</el-col>
              <el-col>正值：张三</el-col>
            </el-row>

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
            <mainComponents ref="main" v-show="activeName == 'main'" />
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
import mainComponents from "./main";
export default {
  components: { dutyRecord, shiftRecord, patrolRecord, mainComponents },
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
      activeName: "main"
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
      console.log(this.activeName);
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