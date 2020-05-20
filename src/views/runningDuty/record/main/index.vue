<template>
  <div class="comheight">
    <el-row>
      <el-col :span="10" :push="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>交班信息</span>

          </div>

          <div class="text item">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item label="正值" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>

              <el-form-item label="交班时间" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="交班人" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="天气" prop="tenantId">
                <el-select v-model="form.tenantId">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                </el-select>
              </el-form-item>
              <el-form-item label="温度(℃)" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item>
                <el-button>交班</el-button>
                <el-button>召回</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" :push="3">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接班信息</span>

          </div>

          <div class="text item">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item label="正值" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>

              <el-form-item label="接班时间" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="接班人" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item label="天气" prop="tenantId">
                <el-select v-model="form.tenantId">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                </el-select>
              </el-form-item>
              <el-form-item label="温度(℃)" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
              <el-form-item>
                <el-button>接班</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

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
      // 查询参数
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
    /** 修改按钮操作 */
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
      const title = "修改密码";
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
      this.$confirm("确定要删除选中的数据吗")
        .then(r => {
          const Ids = this.ids.map(v => v.Id);
          deleted({ Ids }).then(r => {
            this.getList();
            this.$message.success("删除成功");
          });
        })
        .catch(e => {});
    },
    handleLock(row, lock) {
      let ids = row
        ? (ids = [row.Id])
        : this.ids.filter(v => v.IsLock == lock).map(v => v.Id);
      if (ids.length) {
        const islock = !lock;
        ids = ids.join(",");
        locklock({ ids, islock }).then(r => {
          this.$message.success(r.msg);
          this.getList();
        });
      }
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
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
