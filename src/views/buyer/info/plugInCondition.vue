<template>
  <div class="app-container">
    <el-form :model="queryParams" :rules="rules" :form="queryParams" ref="queryForm" :inline="true" label-width="120px" class="xl-query">
      <el-form-item prop="buyerAcccount">
        <el-input placeholder="买手账号" v-model="queryParams.buyerAcccount" clearable size="small" @keyup.enter.native="getList" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
        {{data}}
    </el-row>
  </div>
</template>

<script>
import { plugInCondition as fetchList } from '@/api/buyer/info';

export default {
    name:'查询外挂买手',
  data() {
      const emptyRule = [{required:true,message:'此处不能为空'}];
      const rules = {
          buyerAcccount:emptyRule
      }
    return {
      // 遮罩层
      loading: false,
      data:'',
      rules,
      // 查询参数
      queryParams: {
        buyerAcccount: ''
      }
    };
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
        this.$refs.queryForm.validate(v=>{
            if(v){
                    this.loading = true;
                    fetchList(this.queryParams)
                        .then(response => {
                        this.data=response.data
                        })
                        .finally(e => {
                        this.loading = false;
                        });
            }
        })
     
    },
  }
};
</script>
<style lang="scss" scoped>

</style>