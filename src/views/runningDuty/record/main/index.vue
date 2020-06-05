<template>
  <div class="comheight">
    <el-scrollbar>
      <el-row class="rowbox">
        <div class="leftcard">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>接班信息</span>
            </div>
            <div class="text item">
              <el-form ref="form" :model="form" :rules="rules" :inline="true">
                <el-form-item prop="contactperson">
                  <el-input value='正值：' disabled />
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input value="接班时间：" disabled />
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input value="接班人：" disabled />
                </el-form-item>
                <el-form-item prop="tenantId">
                  <el-select v-model="form.tenantId" placeholder="请选择天气">
                    <el-option label="1" value>晴</el-option>
                    <el-option label="2" value>阴</el-option>
                    <el-option label="3" value>雨</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input v-model="form.contactperson" placeholder="请输入温度" />
                </el-form-item>
                <el-form-item class="cardbtns">
                  <el-button type="primary" size="mini">接班</el-button>
                  <el-button type="info" size="mini" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <div class="databtnbox left">
            <el-button type="primary" circle size="mini">接</el-button>
            <label>2020-04-29 早班 08:00:00</label>
          </div>
        </div>
        <div class="rightcard">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>交班信息</span>
            </div>
            <div class="text item">
              <el-form ref="form" :model="form" :rules="rules" :inline="true">
                <el-form-item prop="contactperson">
                  <el-input value='正值：' disabled />
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input value="交班时间：" disabled />
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input value="交班人：" disabled />
                </el-form-item>
                <el-form-item prop="tenantId">
                  <el-select v-model="form.tenantId" placeholder="请选择天气">
                    <el-option label="1" value>晴</el-option>
                    <el-option label="2" value>阴</el-option>
                    <el-option label="3" value>雨</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="contactperson">
                  <el-input v-model="form.contactperson" placeholder="请输入温度" />
                </el-form-item>
                <el-form-item class="cardbtns">
                  <el-button type="primary" size="mini">交班</el-button>
                  <el-button type="primary" size="mini" plain>召回</el-button>
                  <el-button type="info" size="mini" plain>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <div class="databtnbox right">
            <label>2020-04-10 早班 18:00:00</label>
            <el-button type="primary" plain circle disabled size="mini">交</el-button>
          </div>
        </div>
      </el-row>

    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/shiftRecord";

export default {
  name: "user",
  components: {},
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
      height: "calc(100% - 50px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        contactperson: "",
        charatypeId: "",
        recordcontent: "",
        starttime: "",
        endtime: ""
      },
      form: {}
    };
  },

  created() {},
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
  methods: {
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
      const row = this.ids[0];
      const Id = row.Id;
      const starttime = row.StartTime;
      const endtime = row.EndTime;
      const tenantId = row.TenantId;
      const contactperson = row.ContactPerson;
      const phoneno = row.PhoneNo;
      const type = row.Type;
      const recordcontent = row.RecordContent;
      const issucceed = row.IsSucceed;
      const data = {
        name,
        starttime,
        endtime,
        tenantId,
        contactperson,
        phoneno,
        type,
        recordcontent,
        issucceed,
        Id
      };
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
    // handleLock(row, lock) {
    //   let ids = row
    //     ? (ids = [row.Id])
    //     : this.ids.filter(v => v.IsLock == lock).map(v => v.Id);
    //   if (ids.length) {
    //     const islock = !lock;
    //     ids = ids.join(",");
    //     locklock({ ids, islock }).then(r => {
    //       this.$message.success(r.msg);
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
<style lang="scss" scoped>
/deep/.el-card {
  width: 360px;
  .el-card__header {
    padding: 15px 30px;
    border-bottom: none;
    box-sizing: border-box;
    background-color: #f9fafd;
  }
  .el-card__body {
    padding: 20px 30px;
    .el-form {
      padding-right: 0px;
      .el-form-item {
        margin-bottom: 15px;
        margin-right: 0;
        width: 100%;
      }
      .el-form-item--medium .el-form-item__label {
        line-height: inherit;
        margin-bottom: 15px;
      }
      .el-form-item--medium .el-form-item__content {
        width: 100%;
      }
    }
    .cardbtns {
      margin-bottom: 0 !important;
      text-align: center;
    }
  }
}
.rowbox {
  padding: 30px 0px;
  width: 750px;
  margin-left: -420px;
  position: relative;
  left: 50%;
}
.databtnbox {
  position: absolute;
  z-index: 1;
  .el-button--mini.is-circle {
    height: 40px;
    line-height: 38px;
    padding: 0;
    width: 40px;
    font-size: 18px;
    span {
      font-size: 18px;
    }
  }
  label {
    color: #303133;
    font-weight: normal;
    font-size: 14px;
    margin: 0 15px;
  }
  &.left {
    right: -305px;
    top: 42%;
    label {
      color: #558cf7;
    }
    &::before {
      content: "";
      width: 70px;
      height: 0;
      border-top: solid 1px #dcdfe4;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.right {
    left: -305px;
    top: 42%;
    label {
      color: #303133;
    }
    &::after {
      content: "";
      width: 70px;
      height: 0;
      border-top: solid 1px #dcdfe4;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.leftcard {
  display: inline-block;
  position: relative;
  margin-bottom: 70px;
  .el-card {
    float: right;
  }
  &::after {
    content: "";
    width: 1px;
    height: 70vh;
    background-color: #ebeef5;
    display: inline-block;
    position: absolute;
    right: -86px;
    top: 0;
  }
}
.rightcard {
  top: 220px;
  margin-left: -210px;
  left: 50%;
  display: inline-block;
  position: relative;
}
</style>
