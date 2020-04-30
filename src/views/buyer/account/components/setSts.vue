<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form">
      <el-form-item label="旺旺号">
        {{bindAccountName}}
      </el-form-item>
      <el-form-item label="原因" prop="creditLev">
        <el-row v-if="controlIndex==0">
          <el-select v-model="blackNote123" placeholder="">
            <el-option label="无" value="无"/>
            <el-option v-for="item in reason" :key="item.key" :label="item.value" :value="item.value"></el-option>
            <el-option label="其他（点我选择常用理由）" value=""/>
          </el-select>
          <el-input type="textarea" :rows="5" v-if="blackNote123 == ''" v-model="blackNote"></el-input>
        </el-row> 
        <el-input v-model="blackNote" v-else></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">修改</el-button>

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import {mapGetters} from 'vuex'
import { block, disabled } from '@/api/buyer/all';

export default {
  data() {
    const form = {
      isBlack: 0,
      accountStatus: 0,
      control: -1,
      id: 0,
      blackNote: ''
    };

    return {
      form,
      dialogVisible: false,
      loading: false,
      controlIndex: 0,
      titleList: ['拉黑', '解黑', '禁用', '启用'],
      fn: [block, block, disabled, disabled],
      formData: {},
      blackNote: '',
      bindAccountName: '',
      bindAccountType:'',
      blackNote123:'无',
      reasonType:['','reasonTB','','reasonJD','reasonPDD']
    };
  },
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.form.control = -1;
        this.blackNote = '';
      }
    },
    handleSubmit() {
      this.loading = true;
      const blackNote = this.blackNote || this.blackNote123
      if (blackNote == '') {
        this.$message.error('请填写操作原因');
        this.loading = false;
        return;
      }
      var o = this.fn[this.controlIndex];

      this.formData.blackNote = blackNote;
      o(this.formData)
        .then(res => {
          this.$emit('getList');
          this.$message.success(res.msg);
          this.handleOpen();
        })
        .catch(e => {
          this.loading = false;
        });
    }
  },
  computed: {
    ...mapGetters({reasonTB:'status/tb_wang_wang_refuse_remarksType',
    reasonPDD:'status/pdd_wang_wang_refuse_remarksType',
    reasonJD:'status/jd_wang_wang_refuse_remarksType'
    }),
    title() {
      return '旺旺号' + this.titleList[this.controlIndex];
    },
    reason(){
      if(this.bindAccountType){
      return this[this.reasonType[this.bindAccountType]]
      }else{
        return []
      }
    }
  },
  watch: {
  
    'form.control'(control) {
      if (control) {
        if (this.form.isBlack) {
          this.controlIndex = 1;
          this.formData = { id: this.form.id, isBlack: 0 };
        } else {
          this.controlIndex = 0;
          this.formData = { id: this.form.id, isBlack: 1 };
        }
      } else {
        if (this.form.accountStatus != 4) {
          this.controlIndex = 2;
          this.formData = { id: this.form.id, accountStatus: 4 };
        } else {
          this.controlIndex = 3;
          this.formData = { id: this.form.id, accountStatus: 0 };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label {
  width: 30%;
}
/deep/.el-input,
/deep/.el-select {
  width: 45%;
  .el-input {
    width: 100%;
  }
}
/deep/.el-form-item__error {
  left: 45%;
}
.xl-width-150 {
  width: 100px;
}
/deep/.el-input__inner {
  width: 100%;
}
/deep/.el-textarea{
  margin-left:30%;
  width:45%;
}
</style>