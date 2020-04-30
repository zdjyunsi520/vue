<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">

      <el-form-item>
        <el-select v-model="queryParams.auditState" clearable>
          <el-option label="审核状态" value="" />
          <el-option v-for="item in accountType" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="真实姓名" v-model="queryParams.realName" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="手机号码" v-model="queryParams.phone" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="买手ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="上级买手ID" v-model="queryParams.promoterId" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.promoterLev" clearable>
          <el-option label="下级层级" value="" />
          <el-option label="下级" :value="1" />
          <el-option label="下下级" :value="2" />
          <el-option label="下下下级" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="身份证号码" v-model="queryParams.bindIdentityCard" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="listLoading" :data="postList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column width="60px" label="用户ID" align="center" prop="id" />
      <el-table-column width="110px" label="手机号码" align="center" prop="buyerAccount" />
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="绑定银行卡信息" align="center" width="160px">
        <template slot-scope="{row}">
          <div>{{row.bbuyerBindBank.bankBindName}}</div>
          <div>{{row.bbuyerBindBank.bankName}}</div>
          <div>{{row.bbuyerBindBank.bankCardNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column label="身份证信息" prop="" width="180px">
        <template slot-scope="{row}">
          <div>{{row.bindIdentityCard}}</div>
          <div>{{row.identityAddress}}</div>
          <div>{{row.birthday}}</div>

        </template>
      </el-table-column>
      <el-table-column label="手持身份证比2" align="center" prop="accountUrl">
        <template slot-scope="{row,$index}">
          <el-row class="xl-row-img">
            <img @click="handleShow(row.accountDentityFrontUrl)" :src="path+row.accountDentityFrontUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="身份正面" align="center" prop="accountUrl">
        <template slot-scope="{row,$index}">
          <el-row class="xl-row-img">
            <img @click="handleShow(row.identityFrontUrl)" :src="path+row.identityFrontUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column>
   
      <el-table-column width="95px" label="提交时间" align="center" prop="createTime" />
      <el-table-column label="审核状态" align="center" prop="auditState" :formatter="filterAccount" />
      <!-- <el-table-column label="审核失败理由" align="center" prop="auditNote" /> -->
        <el-table-column label="审核理由" align="center">
     <template slot-scope="{row}">
          <el-select v-model="row.note123" v-if="row.auditState!=2">
            <el-option label="无" value="无"/>
            <el-option v-for="item in reason" :key="item.key" :label="item.value" :value="item.value"></el-option>
            <el-option label="其他" value=""/>
          </el-select>
          <div v-else-if="row.auditState>1">{{row.auditNote}}</div>
          <el-input type="textarea" :rows="6" v-if="row.note123 == ''" v-model="row.auditNote"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="审核操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}" class="xl-table-column">
          <el-row>
            <el-button v-show="row.auditState!=1" v-hasPermi="['system:member:audit:by']" type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handlePass($index)">通过</el-button>
          </el-row>
           <el-row>
            <el-button v-hasPermi="['system:member:audit:guarantee']" type="warning"  :loading="loading" size="small" icon="el-icon-edit" @click="handleReviewPromise(row)">担保审核</el-button>
          </el-row>
          <el-row>
            <el-button v-show="row.auditState!=2" v-hasPermi="['system:member:audit:turnDown']" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleRefuse(row)">拒绝</el-button>
          </el-row>
         
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <update ref="update" @getList="getList"></update>
    <refuse ref="setSts" @getList="getList"></refuse>
    <show-image ref="showImage"></show-image>
    <promise ref="promise" @getList="getList"></promise>
  </div>
</template>

<script>
import { dateFortmat } from '@/utils';
import { mapGetters } from 'vuex';
import { list as fetchList, pass as review,refuse as refuse123 } from '@/api/buyer/info';
import update from './components/update';
import refuse from './components/refuse';
import area from '@/utils/area_data1';
import showImage from '@/components/showImage';
import promise from './components/promise'

const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);

const allKV = all.reduce((l, v) => {
  l[v.c] = v.a;
  return l;
}, {});

export default {
  name:'买手身份审核',
  components: {
    update,
    refuse,
    showImage,
    promise
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
      process: "?x-oss-process=image/resize,h_60",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        auditState: '',
        id: '',
        phone: '',
        realName: '',
        bindIdentityCard:'',
        promoterId:'',
        promoterLev:1
      }
    };
  },
  created() {
    this.getList();
  },
  filters: {
    filterAddress(code) {
      return allKV[code];
    }
  },
  computed: {
    ...mapGetters({ accountType: 'status/accountType', path: 'imgOSS/path' ,reason:'status/Identity_audit_refuse_remarksType'}),
    accountKV() {
      return this.accountType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    }
  },
  watch: {},
  methods: {
       handleReviewPromise(data){
      var target =  this.$refs.promise
     target.dialogVisible = true
     target.form = data
    },
    handleShow(url) {
      this.$refs.showImage.url = url;
      this.$refs.showImage.dialogVisible = true;
    },
    filterAccount(row) {
      return this.accountKV[row.auditState];
    },
    handleRefuse(data){
       this.loading = true;
      this.$confirm(
        '确定要进行 ' +
          data.realName +
          ' 审核拒绝操作吗？'
      )
        .then(r => {
          var d;
         
             const auditNote = (data.note123 || data.auditNote || '').trim()
            if(!auditNote){
              this.$message.error('请选择或填写操作原因')
              this.loading = false;
              return
            }
            const state = 1
            d = { id: data.id, auditNote,state };
          refuse123(d)
            .then(r => {
              this.$message.success(r.msg);
              this.getList();
            })
            .finally(e => {
              this.loading = false;
            });
        })
        .catch(r => {
          this.loading = false;
        });
    },
    handleOpen(refName, index, sts) {
      var target = this.$refs[refName];
      const f = this.postList[index];
      if (sts == undefined) {
        target.form.id = f.id;
        target.buyerAccount = f.buyerAccount;
        target.getInfo();
      } else {
        target.form.id = f.id;
        target.form.auditNote = '';
        target.form.state = '';
        target.storeName = f.realName;
        if (!sts) {
          target.form.state = 1;
        }
      }
      target.dialogVisible = true;
    },
    handleDelete(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id };
      this.$confirm('确定要进行 ' + data.realName + ' 删除 操作吗？')
        .then(() => del(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .finally(() => (this.loading = false));
    },
    handlePass(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id };
      this.$confirm('确定要进行 ' + data.realName + ' 审核通过 操作吗？')
        .then(() => review(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => ((this.loading = false), console.log(123123)))
        .finally(() => (this.loading = false));
    },
    handleEnable(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id, note: '', state: 0 };
      this.$confirm('确定要进行 ' + data.realName + ' 启用 操作吗？')
        .then(() => disabled(postData))
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
      this.$confirm('是否确认导出?', '警告', {
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
  .el-button{
    width:100%;
    margin-top:4px;
  }
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
</style>