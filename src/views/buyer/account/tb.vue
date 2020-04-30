<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
      <el-form-item>
        <el-select v-model="state" clearable>
          <el-option label="审核状态" value="" />
          <el-option v-for="item in accountType" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.creditLev" clearable>
          <el-option label="信誉等级" value="" />
          <el-option v-for="item in levelList" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="手机号码" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="淘宝账号" v-model="queryParams.tbAccount" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
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
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button v-hasPermi="['system:account:tbinfo:excel']" :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table border v-loading="listLoading" :data="postList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column width="35px" label="优质" align="center" prop="isHighQuality">
        <template slot-scope="{row}">
          <span>{{row.isHighQuality|filterExcellent}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" label="买手ID" align="center" prop="buyerId" />
      <el-table-column width="110px" label="手机号码" align="center" prop="buyerAccount" />
      <el-table-column label="淘宝账号" align="center" prop="tbAccount" />
      <el-table-column width="110px" label="收货人资料" align="center">
        <template slot-scope="{row}">
          {{row.name}}<br />
          {{row.phone}}<br />
          {{row.sex | filterGender}}
        </template>
      </el-table-column>
      <el-table-column label="收货人地址" align="center" prop="createTime">
        <template slot-scope="{row}" class="xl-one-line">
          <!-- <div>
            {{row.province|filterAddress}}<br />
            {{row.city|filterAddress}}<br />
            {{row.district|filterAddress}}<br />
            {{row.address}}
          </div> -->
          <el-row>
            {{row.province}}{{row.city}}{{row.district}}
          </el-row>
          <el-row>
            {{row.address}}
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="收货地址截图" align="center" prop="creditRul">
        <template slot-scope="{row,$index}">
          <el-row class="xl-row-img">
            <img @click="handleShow(row.addressUrl)" :src="path+row.addressUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="实名认证截图" align="center" prop="realNameUrl">
        <template slot-scope="{row,$index}">
          <el-row class="xl-row-img">
            <img @click="handleShow(row.realNameUrl)" :src="path+row.realNameUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="信誉等级" align="center" prop="creditLev">
        <template slot-scope="{row}" class="xl-one-line">
          <el-row>
            {{row.levelName || filterLevel(row.creditLev)}}</el-row>
          <el-row class="xl-row-img">
            <img @click="handleShow(row.creditRul)" :src="path+row.creditRul+process" alt="">
          </el-row>
        </template>

      </el-table-column>
      <!-- <el-table-column label="淘气值" align="center" prop="realNameUrl">
        <template slot-scope="{row,$index}">
          <el-row>
            {{row.naughtyValue}}</el-row>
          <el-row class="xl-row-img">
            <img @click="handleShow(row.naughtyValueUrl)" :src="path+row.naughtyValueUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="花呗截图" align="center" prop="realNameUrl">
        <template slot-scope="{row,$index}">
          <el-row class="xl-row-img">
            <img @click="handleShow(row.antUrl)" :src="path+row.antUrl+process" alt="">
          </el-row>
        </template>
      </el-table-column> -->
      <el-table-column width="95px" label="绑定时间" align="center" prop="bindTime" />
      <el-table-column width="95px" label="审核状态" align="center">
        <template slot-scope="{row}">
          <div><span :class="'xl-review-'+row.auditState">{{filterAccount( row.auditState)}}</span></div>
          <div>{{row.auditName}}</div>
          <div>{{row.auditTime}}</div>
        </template>
      </el-table-column>
      <el-table-column label="审核理由" align="center">
     <template slot-scope="{row}">
          <el-select v-model="row.note123" v-if="row.auditState==0">
            <el-option label="无" value="无"/>
            <el-option v-for="item in reason" :key="item.key" :label="item.value" :value="item.value"></el-option>
            <el-option label="其他" value=""/>
          </el-select>
          <div v-else-if="row.auditState>1">{{row.note}}</div>
          <el-input type="textarea" :rows="6" v-if="row.note123 == ''" v-model="row.note"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="110px" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}" class="xl-table-column">
            
          <div v-if="row.auditState==0">
            <el-row>
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleShowReal(row)">照妖镜</el-button>
            </el-row>
            <el-row>
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,1)">审核优质</el-button>
            </el-row>
            <el-row>
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="primary" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,0)">审核普通</el-button>
            </el-row>
            <el-row>
              <el-button v-hasPermi="['system:account:tbinfo:turnDown']" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,2)">审核驳回</el-button>
            </el-row>
            <el-row>
              <el-button v-hasPermi="['system:account:tbinfo:pullBlack']" type="info" :loading="loading" size="small" icon="el-icon-delete" @click="handleReview($index,3)">旺旺拉黑</el-button>
            </el-row>
          </div>
          <div v-else-if="row.isBlack == 0">
            <el-row>
            <el-button v-hasPermi="['system:account:tbinfo:update']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('update',$index)">修改</el-button>
            </el-row>
            <el-row v-if="row.auditState==2">
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleShowReal(row)">照妖镜</el-button>
            </el-row>
             <el-row v-if="row.auditState==2">
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,1)">审核优质</el-button>
            </el-row>
            <el-row v-if="row.auditState==2">
              <el-button v-hasPermi="['system:account:tbinfo:quality']" type="primary" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,0)">审核普通</el-button>
            </el-row>
           
          </div>
          <div v-else>
            旺旺号拉黑
          </div>
        </template>
      </el-table-column>
    </el-table>
    <show-image ref="showImage"></show-image>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <update ref="update" @getList="getList"></update>
    <showReal ref="showReal"></showReal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import showImage from '@/components/showImage';
import {
  fetchList,
  excellent,
  block,
  refuse,
  exportExcel
} from '@/api/buyer/tb';
import showReal from '../../showReal/components/detail'
import update from './components/update';
const levelList = [
  // { id:-2, title: '未设定' },

  { id:-1, title: '1心' },
  { id: 0, title: '2心' },
  { id: 1, title: '3心' },
  { id: 2, title: '4心' },
  { id: 3, title: '5心' },
  { id: 4, title: '黄钻' },
  { id: 5, title: '皇冠' },
  { id: 6, title: '紫金皇冠' }
];
const excellentKV = {
  0: '',
  1: '优'
};

const genderKeyValue = {
  2: '',
  0: '男',
  1: '女'
};

const reason = [
  { id: 0, title: '无' },
  { id: 1, title: '账号用户名截图错误' },
  { id: 2, title: '淘宝实名认证截图错误' },
  { id: 3, title: '淘宝账号不符合要求' },
  { id: 4, title: '照妖镜存在跑单记录' },
  {
    id: 5,
    title:
      '此账号不符合平台绑定要求，不要再申请这个账号绑定，一样会被驳回。请更换其他账号进行审核绑定，请更换其他没有被删除评价的账号进行绑定审核即可，无需联系客服咨询，结果是一样的。'
  }
];
const reasonKV = reason.reduce((l, v) => {
  l[v.id] = v.title;
  return l;
}, {});

const levelKV = levelList.reduce((l, v) => {
  l[v.id] = v.title;
  return l;
}, {});
export default {
    name:'淘宝账号审核',
  components: {
    update,
    showImage,
    showReal,
    
  },
  data() {
    return {
      process: "?x-oss-process=image/resize,h_60",
      levelList,
      // 遮罩层
      loading: false,
      listLoading: false,
      review: {
        title: ['审核普通账号', '审核优质账号', '审核回驳', '旺旺号拉黑'],
        fn: [excellent, excellent, refuse, block],
        data: null
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merId: '',
        auditState: '',
        buyerAccount: '',
        tbAccount: '',
        buyerId: '',
        isBlack: '',
        creditLev: '',
        promoterId:'',
        promoterLev:1
      },
      state: '',
      // 表单参数
      form: {}
      // 表单校验
    };
  },
  created() {
    this.getList();
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data;
    });
  },
  filters: {
    filterGender(gender) {
      return genderKeyValue[gender];
    },
    filterExcellent(type) {
      return excellentKV[type];
    },
    filterReason(type) {
      return reasonKV[type];
    }
  },
  watch: {
    state(v) {
      if (v == 3) {
        this.queryParams.auditState = '';
        this.queryParams.isBlack = 1;
      } else {
        this.queryParams.auditState = v;
        this.queryParams.isBlack = '';
      }
    }
  },
  computed: {
    ...mapGetters({ accountType: 'status/accountType', path: 'imgOSS/path',
     reason:'status/tb_wang_wang_refuse_remarksType'}),
    accountKV() {
      return this.accountType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    }
  },
  methods: {
 
    handleShowReal(row){
     var target= this.$refs.showReal 
     target.dialogVisible=true
     target.loading=true
     target.row = row
     target.getList(row.tbAccount)
     
    },
    filterLevel(type) {
      return levelKV[type];
    },
    handleShow(url) {
      this.$refs.showImage.url = url;
      this.$refs.showImage.dialogVisible = true;
    },
    filterAccount(key) {
      return this.accountKV[key];
    },
    handleOpen(refName, index) {
      var target = this.$refs[refName];
      const f = this.postList[index];
      target.bindAccountId = f.id;
      target.platform = 1;
      target.getInfo();
      // Object.assign(target.form, f);
      target.dialogVisible = true;
    },
    showReason(remark) {
      return remark == '';
    },
    handleReview(index, sts) {
      this.loading = true;
      var data = this.postList[index];
      this.$confirm(
        '确定要进行 ' +
          data.tbAccount +
          ' ' +
          this.review.title[sts] +
          ' 操作吗？'
      )
        .then(r => {
          var d;
          if (sts < 2) {
            d = { id: data.id, isHighQuality: sts };
          } else {
             const note = (data.note123 || data.note || '').trim()
            if(!note){
              this.$message.error('请选择或填写操作原因')
              this.loading = false;
              return
            }
            d = { id: data.id, note };
          }
          this.review.fn[sts](d)
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
    /** 查询岗位列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.postList = response.data.list.map(v=>{v.levelName='';return v});
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加岗位';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids;
      getPost(postId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改岗位';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPost(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids;
      this.$confirm(
        '是否确认删除岗位编号为"' + postIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delPost(postIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据?', '警告', {
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