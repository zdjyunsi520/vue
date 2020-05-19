<template>

  <div class="app-container">

    <div class="comheight">
      <div class="search-box onlyform-box">
        <p class="form-smtitle">设置班组</p>

        <div class="bg-white containerbox">

          <el-row class="table-btns">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
            <el-button icon="el-icon-remove-outline" @click="handleAdd">删除</el-button>
          </el-row>
          <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border height="calc(100% - 180px)">
            <el-table-column type="selection" fixed="left" width="55" align="center" />
            <el-table-column label="班组" align="center" prop="Name" />
            <el-table-column label="班组人员" align="center" prop="EmployeeNames" />
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
        </div>
        <el-col :span="24" :xs="24" class="absolute-bottom">
          <div class="form-footer">
            <el-button type="primary" icon="el-icon-check" @click="handleBack" :loading="loading">保 存</el-button>
            <el-button icon="el-icon-arrow-left" @click="handleBack">返 回</el-button>
          </div>
        </el-col>
      </div>

    </div>
    <add ref="add" @getList="getList" />
  </div>

</template>

<script>
import { fetchGroup as fetchList } from "@/api/runningDuty/dutyConfiguration";
import add from "./components/addGroup";
export default {
  components: { add },
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
      tableHeight: "0",
      queryParams: {
        pageno: 1,
        pagesize: 30
      },
      total: 0,
      disabledSelect: false
    };
  },

  created() {
    this.getList();
  },
  computed: {},
  methods: {
    getList() {
      fetchList(this.queryParams).then(r => {
        this.dataList = r.data;
        this.total = r.total;
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

    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
    },
    handleUpdate() {},
    handleDelete() {},
    handleBack() {
      this.$router.push({ name: "/runningDuty/dutyConfiguration/index" });
    }
  }
};
</script>

<style lang="scss">
.comheight .containerbox {
  height: 100%;
}
</style>