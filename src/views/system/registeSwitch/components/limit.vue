<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
      <el-form-item>
        <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
     
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button :loading="loading" type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(null)">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="listLoading" :data="postList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="最上级买手ID" align="center" prop="highestBuyerId" />
      <el-table-column label="付费团名" align="center" prop="groupName" />
      <el-table-column  label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}" class="xl-table-column">
          
        <el-button v-hasPermi="['system:register:buyer:limit:update']" type="warning" :loading="loading"  icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
        <el-button v-hasPermi="['system:register:buyer:limit:delete']" type="danger" :loading="loading"  icon="el-icon-edit" @click="handleDelete(row)">删除</el-button>
   
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <update ref="update" @getList="getList"></update>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  fetchList1 as fetchList,
  deleteData as deleted
} from '@/api/system/registeSwitch';
import update from './update';


export default {

  components: {
    update
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      listLoading: false,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        buyerId: ''
      },
      form: {}
      // 表单校验
    };
  },
  created() {
    this.getList();
  },

  methods: {
    handleUpdate(data) {
      var target = this.$refs.update;
      const f = data;
      
      if(data){
            target.form = data
  
      }else{
            target.create()
      }
      target.dialogVisible = true;
    },
 
    handleReview(index, sts) {
      this.loading = true;
      var data = this.postList[index];
      this.$confirm(
        '确定要进行 ' +
          data.jdAccount +
          ' ' +
          this.review.title[sts] +
          ' 操作吗？'
      )
        .then(r => {
          var d;
          if (sts < 2) {
            d = { id: data.id, isHighQuality: sts };
          } else {
            const note = (data.note123 || data.note).trim()
            if(!note){
              this.$message.error('请选择或填写操作原因')
              this.loading = false;
              return
            }
            d = { id: data.id, note };
          }
          this.review.fn[sts](d)
            .then(r => {
              this.getList();
              this.$message.success(r.msg);
            })
            .finally(e => {
              this.loading = false;
            });
        })
        .catch(r => {
          this.loading = false;
        });
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.id;
      this.$confirm(
        '是否确认ID号为"' + postIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return deleted(row);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function() {});
    },

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
 
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
/deep/.el-select-dropdown__list {
  width: 180px;
}
.xl-row-img {
  max-height: 200px;
  overflow: hidden;
  img {
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
}
.xl-review-2{
  color:#ff4949;
}
.xl-review-0{
  color:#1890ff;
}
.xl-review-1{
  color:#13ce66;
}
</style>