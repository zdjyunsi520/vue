<template>
  <div class="app-container">
    <div class="search-box xl">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="值班记事" name="dutyRecord"></el-tab-pane>
        <el-tab-pane label="交接记录" name="shiftRecord"></el-tab-pane>
        <el-tab-pane label="巡视记录" name="patrolRecord"></el-tab-pane>
      </el-tabs>
    </div>
      <dutyRecord ref="dutyRecord" v-show="activeName == 'dutyRecord'" />
      <shiftRecord ref="shiftRecord" :shifts="shifts" v-show="activeName == 'shiftRecord'" />
      <patrolRecord ref="patrolRecord" :shifts="shifts" v-show="activeName == 'patrolRecord'" />
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import {
    GetShifts
} from "@/api/runningDuty/record";
import dutyRecord from "./dutyRecord";
import shiftRecord from "./shiftRecord";
import patrolRecord from "./patrolRecord";
export default {
  name: "user",
  components: { dutyRecord, shiftRecord, patrolRecord},
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      tableHeight:"calc(100% - 80px)",
      rules: {},
      activeName: "dutyRecord",
            shifts: [],
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        teamId: "",
        shifttypeId: "",
        charatypeId: "",
        employeename: ""
      },
    };
  },

    created() {
        this.getShiftsList();
    },
  mounted() {
      const target = this.$refs[this.activeName];
      target.getList();
     
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    })
  },
  methods: {
    
    handleClick(tab) {
        const target = this.$refs[this.activeName];
        target.getList();
    },
     getShiftsList() {
        GetShifts({}).then(r => {
            this.shifts = r.data;
        });
     }
    
  }
};
</script>
<style lang="scss" scpoed>
.search-box.xl {
    padding: 15px 20px 0px;
    border-bottom: none;
    margin-bottom: -10px;
}

</style>
