<template>
  <div class="app-container">
    <div class="search-box" style="border-bottom:none">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按岗位展示" name="0"></el-tab-pane>
        <el-tab-pane label="按人员展示" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="值班班组" prop="dutyId">
          <el-select v-model="queryParams.dutyId" clearable placeholder="请选择值班班组">
            <el-option v-for="(item,index) in dutyIds" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年月" prop="time">
          <el-date-picker v-model="queryParams.time" type="month" placeholder="请选择年月" value-format="yyyy-MM" format="yyyy-MM"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
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
            <span>白班<b>08:00:00-20:00:00</b></span>
            <span>晚班<b>20:00:00-08:00:00</b></span>
          </p>
        </div>
      </el-row>
      <div class="scheduletitle">- 班组二 2020年04月排班表 -</div>
      <el-table v-loading="listLoading" :data="dataList" border :height="dataList?tableHeight:'0'">

        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="岗位" align="center" fixed="left" prop="TeamName" />
        <el-table-column label="1号" align="center" prop="TeamName" />
        <el-table-column label="2号" align="center" prop="TeamName" />
        <el-table-column label="3号" align="center" prop="TeamName" />
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
      <el-dialog :title="activeName==1?'人员排班维护':'日期排班维护'" :visible.sync="dialogAddVisible" center width="550px" append-to-body>
        <el-form :model="form" ref="queryForm" class="xl-query" :rules="mrules" label-width="130px">
          <el-form-item label="值班班组" prop="dutyId">
            <el-select v-model="form.dutyId" clearable placeholder="请选择值班班组" style="width:100%">
              <el-option v-for="(item,index) in dutyIds" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值班日期" prop="time">
            <el-date-picker v-model="form.time" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <div v-if='activeName==1'>
            <el-form-item label="人员" prop="memberName">
              <el-input v-model="form.memberName" placeholder="请选择人员" @focus="getMembers"></el-input>
            </el-form-item>
            <el-form-item label="岗位" prop="type" v-if='activeName==1'>
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="白班值班"></el-checkbox>
                <el-checkbox label="晚班值班"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="白班值班" prop="daymemberName">
              <el-input v-model="form.daymemberName" placeholder="请选择人员" @focus="getMembers"></el-input>
            </el-form-item>
            <el-form-item label="晚班值班" prop="eveningmemberName">
              <el-input v-model="form.eveningmemberName" placeholder="请选择人员" @focus="getMembers"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlecheck">保 存</el-button>
          <el-button @click="dialogAddVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="轮值表复制" :visible.sync="dialogRotationVisible" center width="550px" append-to-body>
        <el-form :model="copyform" ref="queryForm" class="xl-query" :rules="mrules" label-width="130px">
          <el-form-item label="排班日期" prop="timebegin">
            <el-date-picker v-model="copyform.timebegin" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="至" prop="timeend">
            <el-date-picker v-model="copyform.timeend" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="复制起始日期" prop="copybegintime">
            <el-date-picker v-model="copyform.copybegintime" type="date" style="width:100%" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
          <el-form-item label="复制次数" prop="count">
            <el-input-number v-model="copyform.count" controls-position="right" :min="1" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleCopyCheck">保 存</el-button>
          <el-button @click="dialogRotationVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-drawer title="人员选择" direction="rtl" :visible.sync="dialogMemberVisible" :show-close='false' center size="300px">
        <el-scrollbar style="height: 86vh;">
          <el-tree :data="memberTree" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        </el-scrollbar>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleMemberscheck">确 定</el-button>
          <el-button @click="dialogMemberVisible = false">取 消</el-button>
        </div>
      </el-drawer>
    </div>

  </div>
</template>

<script>
import { fetchList } from "@/api/runningDuty/sortManager";
import { getTenantEmployees } from "@/api/org";

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
      dutyId: rule,
      time: rule
    };
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
      tableHeight: "0",
      rules: {},
      activeName: "0",
      dialogMemberVisible: false,
      dialogAddVisible: false,
      dialogRotationVisible: false,
      memberTree: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      mrules,
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        dutyId: "",
        time: ""
      },
      dutyIds: [
        {
          id: 1,
          name: "班组一"
        },
        {
          id: 2,
          name: "班组二"
        }
      ],
      form: {
        dutyId: "",
        time: "",
        memberName: "",
        memberId: "",
        type: [],
        daymemberName: "",
        daymemberId: "",
        eveningmemberName: "",
        eveningmemberId: ""
      },
      copyform: {
        timebegin: "",
        timeend: "",
        copybegintime: "",
        count: ""
      }
    };
  },

  created() {
    this.getList();
  },
  mounted() {
    let _this = this;
    window.onresize = () => {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    handleClick(tab, event) {
      // this.resetQuery("queryForm");
      // this.queryParams.patroltimeend = "";
      // this.getList(this.activeName);
    },

    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 210;
    },

    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
          this.setTableHeight();
        });
    },
    // 选择人员
    getMembers() {
      this.dialogMemberVisible = true;
      getTenantEmployees({}).then(response => {
        this.memberTree = response.data;
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

    checkchange(data, checked) {
      if (checked) {
        const target = this.$refs.tree;
        target.setCheckedKeys([data.id]);
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.dialogAddVisible = true;
    },
    // 复制
    handleCopy() {
      this.dialogRotationVisible = true;
    },
    handlecheck() {},
    handleCopyCheck() {},
    handleMemberscheck() {
      var arr = this.$refs.tree.getCheckedNodes();
      if (arr.length) {
        this.form.memberName = arr[0].text;
        this.form.memberId = arr[0].id;
        this.dialogMemberVisible = false;
      } else {
        this.$message.error("请选择人员");
      }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {
          this.msgSuccess("操作失败");
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
  font-weight: bold;
  color: #333333;
}
</style>
