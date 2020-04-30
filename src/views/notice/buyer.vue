<template>
  <div class="app-container">
    <el-row>
      <el-button  v-hasPermi="['system:notice:buyer:insert']" @click="handleOpen('add')">添加公告</el-button>
    </el-row>
    <add ref="add" @getList="getList"></add>
    <el-table border v-loading="loading" :data="postList">
      <!-- <el-table-column type="selection" width="55" align="center"  />  :formatter="" -->
      <el-table-column label="ID" width="70px" align="center" prop="id" />
      <el-table-column label="是否置顶" width="80px" align="center" prop="isIndex" :formatter="filterIndex" />
      <el-table-column label="是否弹窗" width="80px" align="center" prop="type" :formatter="filterType" />
      <el-table-column label="公告标题" align="center" prop="title" />
      <el-table-column label="开始显示时间" width="145px" align="center" prop="startTime" />
      <el-table-column label="结束显示时间" width="145px" align="center" prop="endTime" />
      <el-table-column label="添加时间" width="145px" align="center" prop="createTime" />
      <el-table-column label="启用状态" width="80px" align="center" prop="state" :formatter="filterStatus" />
      <el-table-column width="270px" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-hasPermi="['system:notice:buyer:updateNotice']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('add',row)">修改</el-button>
          <el-button v-hasPermi="['system:notice:buyer:updateStatus']" v-if="row.state==1" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleDisable($index)">禁用</el-button>
          <el-button v-hasPermi="['system:notice:buyer:updateStatus']" v-else type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleEnable($index)">启用</el-button>
          <el-button v-hasPermi="['system:notice:buyer:delete']" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleDelete($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchList, disabled, del } from '@/api/notice/buyer';
import add from './components/addBuyer';
export default {
  components: { add },
  data() {
    return {
      // 遮罩层
      loading: false,
      listLoading: false,
      review: {
        title: ['删除'],
        fn: [],
        data: null
      },
      deptList: null,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters({
      deptType: 'status/deptType',
      rechargeType: 'status/rechargeType',
      moneyType: 'status/moneyType'
    }),
    deptKV() {
      if (this.deptType) {
        return this.deptType.reduce((l, v) => {
          l[v.deptId] = v.deptName;
          return l;
        }, {});
      } else {
        return {};
      }
    },
    rechargeKV() {
      return this.rechargeType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    },
    moneyKV() {
      return this.moneyType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    }
  },
  watch: {},
  methods: {
    filterIndex(row) {
      return row.isIndex ? '置顶' : '';
    },filterType(row) {
      return row.type==2 ? '弹窗' : '';
    },
    filterStatus(row) {
      return row.state ? '启用' : '禁用';
    },
    filterMoney(id) {
      return this.moneyKV[id];
    },

    handleOpen(refName, row) {
      var target = this.$refs[refName];
      if (row) {
          Object.assign(target.form, row);
          target.content = row.content;
      } else {
        target.create();
        target.content = '';
      }
      target.dialogVisible = true;
    },

    handleDisable(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id, status: 0 };
      this.$confirm('确定要进行 ID' + data.id + ' 禁用 操作吗？')
        .then(() => disabled(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => (this.loading = false))
        .finally(() => (this.loading = false));
    },
    handleEnable(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id, status: 1 };
      this.$confirm('确定要进行 ID' + data.id + ' 启用 操作吗？')
        .then(() => disabled(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => (this.loading = false))
        .finally(() => (this.loading = false));
    },
    handleDelete(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id };
      this.$confirm('确定要进行 ID' + data.id + ' 删除 操作吗？')
        .then(() => del(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => (this.loading = false))
        .finally(() => (this.loading = false));
    },
    /** 查询岗位列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.postList = response.data.list;
          this.total = response.data.total;
        })
        .finally(e => {
          this.listLoading = false;
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        exportExcel(this.queryParams)
          .then(r => {
            this.download(r.data.data);
            this.$message.success(r.data.msg);
          })
          .finally(e => {
            this.loading = false;
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.xl-query {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input__inner {
    width: 130px;
  }
  /deep/.el-date-editor.el-input {
    width: 200px;

    .el-input__inner {
      width: 200px;
    }
  }
}
/deep/.cell {
  text-align: center;
  .el-row {
    margin-bottom: 2px;
  }
  .el-input__inner {
    width: 88px;
  }
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
/deep/.el-select-dropdown__list {
  width: 180px;
}
</style>