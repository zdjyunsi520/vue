<template>
  <div class="app-container">
    <div class="search-box xl-querybox">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="关键词：" prop="name" label-width="61px">
          <el-input v-model="queryParams.name" placeholder="值班班组/班组人员" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <!-- <el-form-item label="值班班组：" prop="teamname">
          <el-input v-model="queryParams.teamname" placeholder="请输入班组名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item label="班次类型：" prop="shifttypeId">
          <el-select v-model="queryParams.shifttypeId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色类型：" prop="charatypeId">
          <el-select v-model="queryParams.charatypeId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="班组人员：" prop="employeename">
          <el-input v-model="queryParams.employeename" placeholder="请输入班组人员" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns"> 
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增值班
        </el-button>

        <el-dropdown @command="handleCommand">
          <el-button type="primary" icon=" el-icon-circle-plus-outline">
            设置<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/runningDuty/dutyConfiguration/group/index">设置班组</el-dropdown-item>
            <el-dropdown-item command="/runningDuty/dutyConfiguration/classTime/index">设置班次</el-dropdown-item>
            <el-dropdown-item command="/runningDuty/dutyConfiguration/role1/index">设置角色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight" @sort-change="handleSortChange" @row-dblclick="dbhandleUpdate">

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" fixed="left" width="50"  /> -->
        <el-table-column label="值班班组" min-width='130' prop="TeamName" />
        <el-table-column label="值班人员" min-width='220' prop="EmployeeNames" />
        <el-table-column label="班次类型" width='130' prop="ShiftTypeName" />
        <el-table-column label="班次" min-width='220' prop="ShiftNames" />
        <el-table-column label="角色类型" width='130' prop="CharaTypeName" />
        <el-table-column label="角色" min-width='150' prop="Characters" />
        <!-- <el-table-column label="岗位" min-width='150' prop="Positions" /> -->
        <el-table-column label="操作" width='270' fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlePosition(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>岗位设置
            </el-button>
            <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button type="primary" plain size="mini" @click="handleDelete(scope.row)">
              <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import {
  fetchList,
  fetchTeam,
  fetchShiftType,
  fetchCharactorType,
  deleted
} from "@/api/runningDuty/dutyConfiguration";

import { fetchJobList } from "@/api/runningDuty/dutyConfiguration/job";

export default {
  name: "user",
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
      tableHeight: "calc(100% - 130px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        teamname: "",
        shifttypeId: "",
        charatypeId: "",
        employeename: ""
      },
      teamList: [],
      charactorTypeList: [],
      shiftTypeList: []
    };
  },

  created() {
    this.getList();
    // this.getTeam();
    this.getShiftType();
    this.getCharactorType();
  },
  methods: {
    // getTeam() {
    //   fetchTeam({}).then(r => {
    //     this.teamList = r.data;
    //   });
    // },
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
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增";
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/components/index",
        params: { data: {}, title }
      });
    },
    handlePosition(data) {
      let { ShiftIds, ShiftNames, CharacterIds, Characters, Id } = data;
      const dutyId = Id;
      let shiftTypeList, charactorTypeList;
      if (ShiftIds && ShiftNames) {
        ShiftIds = ShiftIds.split(",");
        ShiftNames = ShiftNames.split(",");
        shiftTypeList = ShiftIds.map((v, i) => {
          const Id = v;
          const Name = ShiftNames[i];
          return { Id, Name };
        });
      }
      if (CharacterIds && Characters) {
        CharacterIds = CharacterIds.split(",");
        Characters = Characters.split(",");
        charactorTypeList = CharacterIds.map((v, i) => {
          const Id = v;
          const Name = Characters[i];
          return { Id, Name };
        });
      }

      this.$router.push({
        name: "/runningDuty/dutyConfiguration/job/index",
        params: { shiftTypeList, charactorTypeList, dutyId }
      });
    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },
    /** 编辑按钮操作 */
    handleUpdate(data) {
      fetchJobList({ pagesize: 999, pageno: 1, dutyId: data.Id }).then(
        response => {
          if (response.total == 0) {
            const title = "编辑用户";
            this.$router.push({
              name: "/runningDuty/dutyConfiguration/components/index",
              params: { data, title, ifused: true }
            });
          } else {
            this.$message.error(
              "该班组的值班配置中已存在岗位，请先删除相关岗位！"
            );
          }
        }
      );
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
      let Id = row.Id;
      this.$confirm("是否确认删除选中的数据项？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleted({ Id }).then(r => {
            this.getList();
            this.$message.success("删除成功！");
          });
        })
        .catch(() => {});
    },
    // handleLock(row, lock) {
    //   let ids = row
    //     ? (ids = [row.Id])
    //     : this.ids.filter(v => v.IsLock == lock).map(v => v.Id);
    //   if (ids.length) {
    //     const islock = !lock;
    //     ids = ids.join(",");
    //     locklock({ ids, islock }).then(r => {
    //       this.$message.success('已保存');
    //       this.getList();
    //     });
    //   }
    // },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
</style>
