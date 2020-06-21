<template>
  <div class="app-container">
    <div class="search-box xl-querybox" style="border-bottom:none">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按岗位展示" name="0"></el-tab-pane>
        <el-tab-pane label="按人员展示" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="值班班组：" prop="dutyteamId">
          <el-select @change="handleChangeDutyTeam" v-model="queryParams.dutyteamId" clearable placeholder="请选择值班班组">
            <el-option v-for="(item,index) in dutyteamIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年月：" prop="time">
          <el-date-picker v-model="queryParams.time" type="month" placeholder="请选择年月" value-format="yyyy-MM" format="yyyy-MM"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="primary" plain icon="el-icon-document-copy" @click="handleCopy">复制</el-button>
        <el-button icon="el-icon-delete" @click="handleDelete">删除</el-button>
        <div class="timetips">
          <label>值班班次</label>
          <p>
            <span :key="index" v-for="(item,index) in shifts">{{item.Name}}<b>{{item.StartTime}}-{{item.EndTime}}</b></span>
          </p>
        </div>
      </el-row>
      <div class="scheduletitle">- {{dutyName}} {{year}}年{{month}}月排班表 -</div>
      <el-table @row-click="handleRowClick" v-loading="listLoading" :data="tableList" border :height="tableHeight" ref="table">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column :label="activeName=='1'?'人员':'岗位'" fixed="left" prop="name" min-width="120" />
        <el-table-column align="center" v-for="(item,index) in columns" :key="index" :label="item.sortDate" :prop="item.date" min-width="100">
          <template slot="header">
            <div class="cellthbox">
              <div>{{item.sortDate}}号</div>
              <p>{{item.name}}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />

      <el-dialog :title="'排班维护'" :visible.sync="dialogAddVisible" center width="550px" append-to-body>
        <el-form :model="form" ref="queryForm" class="xl-query" :rules="mrules" label-width="130px">
          <el-form-item label="值班班组" prop="dutyteamId">
            <el-select disabled v-model="form.dutyteamId" clearable placeholder="请选择值班班组" style="width:100%">
              <el-option v-for="(item,index) in dutyteamIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值班日期" prop="Date">
            <el-date-picker :picker-options="pickerOptions" v-model="form.Date" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <div v-if="type==1">
            <el-form-item :label="item.PositionName" :key="index" v-for="(item,index) in Data">
              <el-input :value="item.Employees.filter(v=>v.IsSelect).map(v=>v.Name).join(',')" placeholder="请选择人员" @focus="getMembers(item)"></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="人员">
              <el-input :value="Employee.EmployeeName" placeholder="请选择人员" @focus="getMembers"></el-input>
            </el-form-item>
            <el-form-item label="岗位">
              <el-checkbox v-model="item.IsSelect" v-for="(item,index) in Employee.Positions" :key="index">{{item.Name}}</el-checkbox>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlecheck" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="dialogAddVisible = false" :loading="loading">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="轮值表复制" :visible.sync="dialogRotationVisible" center width="550px" append-to-body>
        <el-form :model="copyform" ref="queryCopyForm" class="xl-query" :rules="mrules" label-width="130px">
          <el-form-item label="排班日期" prop="starttime">
            <el-date-picker :picker-options="pickerOptions" v-model="copyform.starttime" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="endtime">
            <el-date-picker :picker-options="pickerOptions" v-model="copyform.endtime" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="复制起始日期" prop="copystart">
            <el-date-picker :picker-options="pickerOptions" v-model="copyform.copystart" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="复制次数" prop="copytime">
            <el-input-number v-model="copyform.copytime" controls-position="right" :min="1" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleCopyCheck">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="dialogRotationVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-drawer title="人员选择" direction="rtl" :visible.sync="dialogMemberVisible" :show-close='false' center size="300px">
        <el-scrollbar style="height: 86vh;">
          <el-tree :data="memberTree" :props="defaultProps" :check-strictly='true' node-key="Id" ref="tree" show-checkbox :highlight-current="true" @check-change="checkchange" :default-expand-all="false" :expand-on-click-node="false"></el-tree>
        </el-scrollbar>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleMemberscheck">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="dialogMemberVisible = false">取 消</el-button>
        </div>
      </el-drawer>

    </div>

  </div>
</template>

<script>
import {
  fetchList,
  addByPosition,
  addByPerson,
  add,
  deleted,
  copycopy
} from "@/api/runningDuty/sortManager";
import { getTenantEmployees } from "@/api/org";
import { fetchTeam } from "@/api/runningDuty/dutyConfiguration";
import { GetShifts } from "@/api/runningDuty/record";
import { getInfo } from "@/api/runningDuty/sortManager";
export default {
  name: "user",
  data() {
    const rule = [
      {
        required: true,
        message: "此处不能为空",
        trigger: "blur"
      }
    ];
    const mrules = {
      dutyteamId: rule,
      Date: rule,
      starttime: rule,
      endtime: rule,
      copystart: rule,
      copytime: [
        {
          required: true,
          message: "请输入2位以内的整数",
          trigger: "blur"
        }
      ]
    };
    return {
      // 遮罩层
      listLoading: true,
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: [],
      tableHeight: "calc(100% - 210px)",
      rules: {},
      activeName: "0",
      dialogMemberVisible: false,
      dialogAddVisible: false,
      dialogRotationVisible: false,

      mrules,
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        dutyteamId: "",
        time: ""
      },
      dutyteamIds: [],
      form: {
        dutyteamId: "",
        Date: ""
      },
      copyform: {
        starttime: "",
        endtime: "",
        copystart: "",
        copytime: 1,
        dutyteamId: ""
      },
      time: "",
      year: "",
      month: "",
      dutyName: "",
      shifts: [],
      memberTree: [],
      checkPositionId: "",
      Data: [],
      type: 1,
      Employee: {}
    };
  },

  created() {
    this.queryParams.time = this.parseTime(new Date(), "{y}-{m}");
    this.getDutyTeam();
    this.getShifts();
  },
  computed: {
    defaultProps() {
      return { children: "childs", label: "Name" };
    },
    columns() {
      const list = [];

      if (this.year && this.month) {
        for (
          let i = 1, l = this.getMonthDay(this.year, parseInt(this.month)) + 1;
          i < l;
          i++
        ) {
          const date = `${this.year}-${this.month}-${i < 10 ? "0" + i : i}`;
          const name = this.getWeek(date);
          const sortDate = i + "";
          list.push({ date, name, sortDate });
        }
      }
      return list;
    },
    tableList() {
      let nameList;
      let propName;
      let propName1;
      if (this.activeName == "1") {
        propName = "EmployeeName";
        propName1 = "PositionName";
      } else {
        propName = "PositionName";
        propName1 = "EmployeeName";
      }
      nameList = [...new Set(this.dataList.map(v => v[propName]))];

      return nameList.map(v => {
        const name = v;
        const data = { name };
        this.columns.forEach(i => {
          const value = this.dataList
            .filter(v => {
              return v.Time.substr(0, 10) == i.date && v[propName] == name;
            })
            .map(v => v[propName1])
            .join(",");
          this.$set(data, i.date, value);
        });
        return data;
      });
    },
    tableList1() {
      return this.dataList
        ? this.dataList.map(v => {
            const data = {};
            data.PositionName = v.PositionName;
            this.columns.forEach(i => {
              const list = v.origin.filter(v => {
                return v.Time.substr(0, 10) == i.date;
              });
              this.$set(data, i.date, list.length ? list[0].EmployeeName : "");
            });
            return data;
          })
        : [];
    },
    pickerOptions() {
      let _this = this;
      return {
        disabledDate(date) {
          if (
            date < new Date(_this.columns[0].date + " 00:00:00") ||
            date >
              new Date(
                _this.columns[_this.columns.length - 1].date + " 23:59:59"
              )
          )
            return true;
          return false;
        }
      };
    }
  },
  methods: {
    getWeek(dateString) {
      var dateArray = dateString.split("-");
      let date = new Date(
        dateArray[0],
        parseInt(dateArray[1] - 1),
        dateArray[2]
      );
      return "日一二三四五六".charAt(date.getDay());
    },
    getTeamInfo() {
      getInfo({ Id: this.queryParams.teamId });
    },
    handleChangeDutyTeam() {
      this.form.dutyteamId = this.queryParams.dutyteamId;
      this.copyform.dutyteamId = this.queryParams.dutyteamId;
    },
    getShifts() {
      GetShifts({}).then(r => {
        this.shifts = r.data;
      });
    },

    getDutyTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.dutyteamIds = r.data;
        if (this.dutyteamIds && this.dutyteamIds.length) {
          this.queryParams.dutyteamId = this.dutyteamIds[0].Id;
          this.handleChangeDutyTeam();
          this.getList();
        }
      });
    },
    getMonthDay(year, month) {
      return new Date(year, month, 0).getDate();
    },
    handleClick(tab, event) {},
    handleRowClick(tab, event) {
      if (this.activeName == "1") {
        this.handleAdd1();
      }
    },
    /** 搜索用户列表 */
    getList() {
      const time = this.queryParams.time.split("-");
      if (time.length != 2 || !this.queryParams.dutyteamId) {
        return;
      }
      this.year = time[0];
      this.month = time[1];
      this.dutyName = this.dutyteamIds.filter(
        v => v.Id == this.queryParams.dutyteamId
      )[0].Name;

      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data || [];
          this.total = response.total;
          return;
          var afterData = [];
          response.data.forEach(item => {
            let flag = afterData.find(
              item1 => item1.PositionName === item.PositionName
            );
            if (!flag) {
              afterData.push({
                PositionName: item.PositionName,
                origin: [item]
              });
            } else {
              flag.origin.push(item);
            }
          });
          this.dataList = afterData;
          this.$nextTick(() => {
            this.$refs.table.doLayout();
          });
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    // 选择人员
    getMembers(item) {
      if (this.type == 1) {
        this.checkPositionId = item.PositionId;
        this.memberTree = item.Employees;
      } else {
        this.memberTree = this.Data;
      }

      this.dialogMemberVisible = true;
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

    checkchange(data, checked) {
      if (this.type == 1) return;
      if (checked) {
        const target = this.$refs.tree;
        target.setCheckedKeys([data.Id]);
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.type = 1;
      this.form.Date = "";
      this.Data = [];
      const dutyteamId = this.form.dutyteamId;
      if (!dutyteamId) {
        this.$message.error("请先选择一个班组");
        return;
      }
      addByPosition({ dutyteamId }).then(r => {
        this.Data = r.data || [];
      });

      this.dialogAddVisible = true;
    },
    handleAdd1() {
      this.type = 0;
      this.form.Date = "";
      this.Employee = {};
      this.Data = [];
      const dutyteamId = this.form.dutyteamId;
      if (!dutyteamId) {
        this.$message.error("请先选择一个班组");
        return;
      }
      addByPerson({ dutyteamId }).then(r => {
        this.Data = r.data || [];
        this.Data.map(v => {
          v.Name = v.EmployeeName;
        });
      });

      this.dialogAddVisible = true;
    },
    // 复制
    handleCopy() {
      this.dialogRotationVisible = true;
    },
    handlecheck() {
      this.$refs.queryForm.validate(v => {
        if (v) {
          const Data = [];
          let error = false;
          let error1 = false;
          if (this.type == 1) {
            this.Data.forEach(v => {
              const PositionId = v.PositionId;
              const PositionName = v.PositionName;
              let list = v.Employees.filter(v => v.IsSelect);
              if (list.length == 0) {
                error = true;
              }
              list.forEach(v => {
                const EmployeeId = v.Id;
                const EmployeeName = v.Name;
                Data.push({
                  PositionId,
                  PositionName,
                  EmployeeId,
                  EmployeeName
                });
              });
            });
          } else {
            const EmployeeId = this.Employee.EmployeeId;
            if (EmployeeId) {
              const EmployeeName = this.Employee.EmployeeName;
              this.Employee.Positions.filter(v => v.IsSelect).forEach(v => {
                const PositionId = v.Id;
                const PositionName = v.Name;
                Data.push({
                  PositionId,
                  PositionName,
                  EmployeeId,
                  EmployeeName
                });
              });
              if (Data.length == 0) {
                error1 = true;
              }
            } else error = true;
          }
          if (error) {
            this.$message.error("请选择值班人员");
            return;
          }
          if (error1) {
            this.$message.error("请选择岗位");
            return;
          }
          this.loading = true;
          const dutyteamId = this.form.dutyteamId;
          const Date = this.form.Date;
          add({
            model: {
              dutyteamId,
              Date,
              Data
            }
          })
            .then(r => {
              this.getList();
              this.$message.success("添加成功");
              this.dialogAddVisible = false;
            })
            .finally(() => (this.loading = false));
        }
      });
    },
    handleCopyCheck() {
      this.$refs.queryCopyForm.validate(v => {
        if (v) {
          copycopy(this.copyform).then(r => {
            this.getList();
            this.$message.success("复制成功");
            this.dialogRotationVisible = false;
          });
        }
      });
    },
    handleMemberscheck() {
      if (this.type == 1) {
        var arr = this.$refs.tree.getCheckedKeys();
        if (arr.length) {
          this.Data.forEach(v => {
            if (v.PositionId == this.checkPositionId) {
              v.Employees.forEach(v => {
                v.IsSelect = false;
                arr.forEach(i => {
                  if (i == v.Id) v.IsSelect = true;
                });
              });
            }
          });
          this.dialogMemberVisible = false;
        } else {
          this.$message.error("请选择人员");
        }
      } else {
        let node = this.$refs.tree.getCheckedNodes();
        if (node.length) {
          this.Employee = node[0];
          this.dialogMemberVisible = false;
        } else {
          this.$message.error("请选择人员");
        }
      }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = this.dataList.map(v => v.Id);
      this.$confirm("是否确认删除排班数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleted({ ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功！");
        });
    }
  }
};
</script>
<style lang="scss" >
.timetips {
  position: absolute;
  right: 15px;
  top: -5px;
  color: #313033;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  label {
    display: block;
    font-weight: normal;
    margin-right: 20px;
  }
  p {
    span {
      display: block;
      padding: 5px 0;
      font-weight: normal;
      b {
        margin-left: 10px;
        font-weight: normal;
      }
      &::before {
        content: "";
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
        color: #909399;
        border-radius: 100%;
        width: 6px;
        height: 6px;
        background-color: #7098ff;
      }
    }
  }
}
.scheduletitle {
  text-align: center;
  font-size: 20px;
  padding: 20px 0 40px;
  color: #333333;
}
.el-table th div.cellthbox {
  line-height: 1;
  padding-top: 15px;
  & > div {
    line-height: 1;
  }
  & > p {
    font-size: 12px;
    color: #999;
    line-height: 2;
    display: block;
    margin: 0;
  }
}
</style>
