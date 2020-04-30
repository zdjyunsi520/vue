<template>
  <el-row class="xl-padding">
    
            <el-select  v-model="taskTypeId" class="xl-width-100">
              <el-option :key="item.taskName" :label="item.taskName" :value="item.id" v-for="item in orderList" />
            </el-select>
    <el-form :status-icon="true" :show-message="false" ref="form" :model="form">
      <el-table border v-loading="listLoading" :data="taskList" :highlight-current-row="false">
        <el-table-column label="任务名称" prop="appreciationName"/>
        <el-table-column label="价格">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="row.superMode" prop="0" :rules="handleRule('price',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.price"></el-input>
            </el-form-item>
             <el-row v-if="!row.superMode">
              {{row.price}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{$index,row}">
              <el-button v-if="!row.superMode" v-hasPermi="['system:task:price:additional_services:update']" type="warning" @click="handleUpdate(row)">修改</el-button>
              <el-button v-else v-hasPermi="['system:task:price:additional_services:update']" type="success" @click="handleSave(row)">保存</el-button>
              <!-- <el-button v-hasPermi="['system:task:price:delete']" type="danger" @click="handleDeleteKey($index)">删除</el-button> -->
              <!-- <el-button v-hasPermi="['system:task:price:delete']" type="danger" @click="handleDeleteKey($index,row.id)">禁用</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  fetchList,
  update
} from '@/api/taskPrice/task';
const task = {
  id: "",
  price: ''
};
const empty = callback => {
  callback(new Error(''));
};
export default {
  data() {
    return {
      loading: false,
      listLoading: false,
      postList: [],
      form: {},
     orderKV:{},
     superMode:false,
     taskTypeId:3
    };
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters({ orderType: 'status/orderType' }),
    orderList() {
      return this.orderType?this.orderType.filter(v=>v.fId>0):[]
    },
    taskList(){
      return this.postList.filter(v=>v.taskTypeId == this.taskTypeId)
    }
  },
  methods: {
    
    newTemp() {
      return Object.assign({}, task);
    },
    handleAdd() {
      this.postList.push(this.newTemp());
    },
    handleDeleteKey(index, id) {
      if(id){
      this.loading = true;
      del(id)
        .then(r => {
          this.$message.success(r.msg);
        })
        .finally(() => (this.loading = false));
      }
          this.postList.splice(index, 1);

    },
    /** 查询岗位列表 */
    getList() {
      this.listLoading = true;
      fetchList()
        .then(response => {
          this.postList = response.data.map(v=>{
        v.superMode = 0
        return v
      });
        })
        .finally(e => {
          this.listLoading = false;
        });
    },
    handleUpdate(row){
    row.superMode = 1
    },
    handleSave(row) {
      this.loading = true;
      this.$refs.form.validate(r => {
        if (r) {
          update(row)
            .then(res => {
              this.$message.success(res.msg);
              row.superMode = 0
              this.$refs.form.clearValidate();
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    handleRule(key, index, ruleName) {
      return [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) =>
            this[ruleName].call(this, key, index, callback)
        }
      ];
    },
    priceRange(key, index, callback) {
      const reg = new RegExp(/^[0-9]+(.[0-9]{1,2})?$/);
      const min = this.postList[index].priceMin;
      const max = this.postList[index].priceMax;
      if (reg.test(min) && reg.test(max) && parseFloat(min) < parseFloat(max)) {
        callback();
      } else {
        return empty(callback);
      }
    },
    handleEmpty(key, index, callback) {
      if (this.postList[index][key] == '') {
        return empty(callback);
      } else {
        callback();
      }
    },
    handlePrice(key, index, callback) {
      const reg = new RegExp(/^[0-9]+(.[0-9]{1,2})?$/);
      if (reg.test(this.postList[index][key])) {
        callback();
      } else {
        return empty(callback);
      }
    },
    handleNumber(key, index, callback) {
      const reg = new RegExp(/^[0-9]+$/);
      if (reg.test(this.postList[index][key])) {
        callback();
      } else {
        return empty(callback);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.cell {
  text-align: center;
  .el-row {
    margin-bottom: 2px;
  }
  .el-input__inner {
    //width: 100%;
    text-align: center;
  }
  .xl-width-150 {
    width: auto;

    .el-input__inner {
      width: 110px;
    }
  }
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
/deep/.el-select-dropdown__list {
  width: 180px;
}
/deep/.el-table .el-table__body-wrapper tbody tr:hover > td {
  background-color: transparent !important;
}
/deep/.el-form-item {
  margin-bottom: 0;
}
.xl-padding{
  padding:20px;
}
</style>