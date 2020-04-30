<template>
  <el-row class="xl-padding">
    <el-form :status-icon="true" :show-message="false" ref="form" :model="form">
      <el-table border v-loading="listLoading" :data="postList" :highlight-current-row="false">
        <el-table-column label="任务类型" width="250px">
          <template slot-scope="{$index,row}">
            <el-select  v-model="row.taskTypeId" class="xl-width-100" v-if="superMode">
              <el-option :key="item.taskName" :label="item.taskName" :value="item.id" v-for="item in orderList" />
            </el-select>
           <el-row v-else>{{filterTask(row)}}</el-row>
          </template>
        </el-table-column>
        <el-table-column label="价格区间" width="250px">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="superMode" prop="0" :rules="handleRule('keykeykey',$index,'priceRange')">
              <el-input class="xl-width-150" v-model="row.priceMin"></el-input>-
              <el-input class="xl-width-150" v-model="row.priceMax"></el-input>
            </el-form-item>
             <el-row v-else>
              {{row.priceMin}}-{{row.priceMax}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="基础价格">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="superMode" prop="0" :rules="handleRule('basePrice',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.basePrice"></el-input>
            </el-form-item>
                   <el-row v-else>
              {{row.basePrice}}
            </el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column label="总站收费">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="row.superMode" prop="0" :rules="handleRule('deptAllAmount',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.deptAllAmount"></el-input>
            </el-form-item>
            <el-row v-if="!row.superMode">
              {{row.deptAllAmount}}
            </el-row>
          </template>
        </el-table-column> -->
        <el-table-column label="加价">
          <template slot-scope="{$index,row}">
            <el-form-item prop="0" :rules="handleRule('raisePrice',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.raisePrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- <el-table-column label="分站利润">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="row.superMode" prop="0" :rules="handleRule('deptProfit',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.deptProfit"></el-input>
            </el-form-item>
               <el-row v-if="!row.superMode">
              {{row.deptProfit}}
            </el-row>
          </template>
        </el-table-column> -->
            <el-table-column label="系统返款服务费">
          <template slot-scope="{$index,row}">
            <el-form-item v-if="superMode" prop="0" :rules="handleRule('sysReturnMoney',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.sysReturnMoney"></el-input>
            </el-form-item>
             <el-row v-else>
              {{row.sysReturnMoney}}
            </el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column label="服务费加价">
          <template slot-scope="{$index,row}">
            <el-form-item prop="0" :rules="handleRule('returnRaisePrice',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.returnRaisePrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column> -->
        <el-table-column label="最终价格">
          <template slot-scope="{$index,row}">
            <!-- <el-form-item v-if="row.superMode" prop="0" :rules="handleRule('totalPrice',$index,'handlePrice')">
              <el-input class="xl-width-100" v-model="row.totalPrice"></el-input>
            </el-form-item> -->
           {{calculate(row,$index)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="superMode">
          <template slot-scope="{$index,row}">
            <el-form-item >
              <el-button v-hasPermi="['system:task:price:delete']" type="danger" @click="handleDeleteKey($index,row.id)">删除</el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row class="text-align-center">
      <el-button v-if="!superMode" :loading="loading" type="warning" @click="handleSuperMode(1)"  v-hasPermi="['system:task:price:superMode']">超级编辑模式</el-button>
      <el-button v-else :loading="loading" type="warning" @click="handleSuperMode(0)"  v-hasPermi="['system:task:price:superMode']">退出编辑模式</el-button>
      <el-button :loading="loading" type="success" @click="handleAdd"  v-hasPermi="['system:task:price:superMode']">添加价格配置</el-button>
      <el-button :loading="loading" type="danger" @click="handleSave"  v-hasPermi="['system:task:price:update']">保存价格配置</el-button>
    </el-row>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  fetchList1,
  fetchList2,
  fetchList3,
  update,
  del
} from '@/api/taskPrice';
const task = {
  taskTypeId: "",
  priceMin: '',
  priceMax: '',
  basePrice: '',
  deptAllAmount: '',
  raisePrice: '',
  deptProfit: '',
  sysReturnMoney: '',
  totalPrice: '',
  superMode:1,
  returnRaisePrice:''
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
      platformType: 1,
      fetchList: [null, fetchList1, fetchList2, fetchList3],

      superMode:false
    };
  },
  created() {
  },
  computed: {
    ...mapGetters({ orderType: 'status/orderType',orderKV:'status/orderKV' }),
    orderList() {
      const platformType =this.platformType ==2 ? 4: this.platformType
      const orderList = this.orderType
        ? this.orderType.filter(
            v => v.fId > 0 && v.platformId == platformType
          )
        : [];
      return orderList
    }
  },
  methods: {
    filterTask(row){
      return this.orderKV?this.orderKV[row.taskTypeId]:''
    },
    calculate(row,index){
      const total =(parseFloat(row.basePrice)*100 + parseFloat(row.raisePrice)*100 + parseFloat(row.sysReturnMoney)*100)/100
      if(total||total==0){
        this.postList[index].totalPrice = total
        return total
      }else{
        return ''
      }
    },
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
      this.fetchList[this.platformType]()
        .then(response => {
          this.postList = response.data.list;
        })
        .finally(e => {
          this.listLoading = false;
        });
    },
    handleSuperMode(isSuperMode){
      // this.loading=true
      // this.postList = this.postList.map(v=>{
      //   v.superMode = 1
      //   return v
      // })
      this.superMode = isSuperMode
      //this.loading=false
    },
    handleSave() {
      this.loading = true;
      this.$refs.form.validate(r => {
        if (r) {
          update(this.postList, this.platformType)
            .then(res => {
              this.$message.success(res.msg);
              this.getList();
              this.$refs.form.clearValidate();
              this.superMode = false
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
    border: 0;
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
  padding:20px 20px 100px;
}
.text-align-center{
  position:fixed;
  bottom:30px;

}
</style>