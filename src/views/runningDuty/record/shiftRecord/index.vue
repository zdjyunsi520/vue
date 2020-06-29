<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox" style="padding: 15px 0 0;">
      <div class='sm-searchbox'>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules" :style="isOpen?'height:'+baseformHeight+'px;overflow: hidden;padding-right: 62px;':'padding-right: 62px;'" >
        <el-form-item label="用电单位：" prop="tenantId">

          <el-select v-model="queryParams.tenantId">
            <el-option label="全部" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>

        </el-form-item>
        <el-form-item label="值班班组：" prop="TeamId">
          <el-select v-model="queryParams.TeamId">
            <el-option label="全部" value></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in teamList" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位：" prop="ShiftId">
          <el-select v-model="queryParams.ShiftId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="item.Id" :label="item.PositionName" :value="item.PositionId" v-for="item in userPositions" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyword" label-width="61px">
          <el-input v-model="queryParams.keyword" placeholder="记事内容/注意事项" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- 
        <el-form-item label="记事内容：" prop="recordcontent">
          <el-input v-model="queryParams.recordcontent" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="注意事项：" prop="caution">
          <el-input v-model="queryParams.caution" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item label="值班日期：" prop="starttime">
          <el-date-picker v-model="queryParams.starttime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
          至 <el-date-picker v-model="queryParams.endtime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="text" @click="handleHighSearch"   class="hightsearchbtn">高级筛选<i :class="isOpen?'el-icon-arrow-down':'el-icon-arrow-up'" /></el-button>
    </div>
    </div>
    <div class="bg-white containerbox " ref="containerbox" style="padding:0;">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
        <el-button type="primary" plain @click="handleUpdate" :disabled="single">
          <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
        </el-button>
        <el-button type="info" plain icon="el-icon-delete" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-row>
      <el-table :data="dataList" @selection-change="handleSelectionChange" border :height="height" @sort-change="handleSortChange">

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="用电单位" min-width='230' prop="TenantName" />
        <el-table-column label="值班日期" width='180' prop="StartTime" />
        <el-table-column label="值班班组" width='140' prop="TeamName" />
        <el-table-column label="岗位" width='100' prop="ShiftName" />
        <el-table-column label="交班人" width='120' prop="HandoverName" />
        <el-table-column label="交班时间" width='180' prop="HandoverTime" />
        <el-table-column label="接班人" width='110' prop="SuccessorName" />
        <el-table-column label="接班时间" width='180' prop="SuccessTime" />
        <el-table-column label="记录内容" min-width='200' prop="RecordContent" />
        <el-table-column label="注意事项" min-width='200' prop="Caution" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <add ref="add" @getList="getList" :shifts="shifts" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/shiftRecord";
import { fetchTeam } from "@/api/runningDuty/dutyConfiguration";

import add from "./components/add";
export default {
  props: {
    shifts: {
      type: Array,
      default() {
        return [];
      }
    },
    userPositions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  name: "user",
  components: { add },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      height: "calc(100% - 128px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        keyword: "",
        TeamId: "",
        caution: "",
        recordcontent: "",
        starttime: "",
        endtime: "",
        ShiftId: ""
        // jieban:"",
        // jiaoban:""
      },
      teamList: [],
      isOpen: true,
      formHeight: "",
      baseformHeight: 47,
    };
  },

  created() {
    this.getTeam();
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    }),
    single() {
      return this.ids.length != 1;
    },
    multiple() {
      return this.ids.length == 0;
    }
  },
  watch:{
      'formHeight': function(newVal){
          this.$nextTick(()=>{
            var newheight = this.$refs.queryForm.$el.clientHeight;
            this.isOpen=newheight > this.baseformHeight?true:false;
          })
      },
  },
  methods: {
     // 高级筛选
    handleHighSearch() {
      this.isOpen = !this.isOpen;
    },
    getTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.teamList = r.data;
      });
    },
    handleCommand(commond) {
      this.$router.push({
        name: commond,
        params: {}
      });
    },

    filterCancel(row) {
      return row.IsCancel ? "已注销" : "正常";
    },
    handleSortChange(row) {
      this.queryParams.orderby = `${row.prop} ${
        row.order == "ascending" ? "asc" : "desc"
      }`;
      this.getList();
    },
    /** 搜索用户列表 */
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      const target = this.$refs.add;
      const data = this.ids[0];
      target.handleOpen(data);
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const id = row.Id;
      const username = row.UserName;
      const data = { id, username };
      const title = "编辑密码";
      this.$router.push({
        name: "/commonManager/user/components/password",
        params: { data, title }
      });
    },
    handleUpdateRole(row) {
      const id = row.Id;
      const data = { id };
      const title = "权限设置";
      this.$router.push({
        name: "/commonManager/user/components/role",
        params: { data, title }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("确定要删除选中的数据吗？")
        .then(r => {
          const Ids = this.ids.map(v => v.Id);
          deleted({ Ids }).then(r => {
            this.getList();
            this.$message.success("删除成功！");
          });
        })
        .catch(e => {});
    },
   
  }
};
</script>
<style lang="scss">
</style>
