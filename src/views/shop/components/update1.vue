<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="'修改会员信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="手机号">
        {{form.buyerAccount}}
      </el-form-item>

      <el-form-item label="京东账号" prop="jdAccount" v-if="$props.platform==2">
        <el-input v-model="form.jdAccount" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="淘宝账号" prop="tbAccount" v-if="$props.platform==1">
        <el-input v-model="form.tbAccount" autocomplete="off" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="拼多多账号" prop="pddAccount" v-if="$props.platform==3">
        <el-input v-model="form.pddAccount" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="信誉等级" prop="creditLev">
        <el-select v-model="form.creditLev" placeholder="">
          <el-option v-for="item in levelList" :key="item.id" :label="item.title" :value="item.id">
            {{item.title}}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="旺旺性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="null">不确定</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收货人姓名">
        <el-input v-model="form.name" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="收货人手机">
        <el-input v-model="form.phone" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="收货人年龄">
        <el-input v-model="form.age" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="收货地区">
        <el-select class="xl-width-150" v-model="form.province" placeholder="请选择省份">
          <el-option v-for="item in areaData.province" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
        <el-select class="xl-width-150" v-model="form.city" placeholder="请选择市">
          <el-option v-for="item in dataCity" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
        <el-select class="xl-width-150" v-model="form.district" placeholder="请选择区县">
          <el-option v-for="item in dataRegion" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="淘宝订单号" prop="tbLastOrderNumber" v-if="$props.platform==1">
        <el-input v-model="form.tbLastOrderNumber" autocomplete="off"></el-input>
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
import area from '@/utils/area_data1';
import { update as jdUpdate } from '@/api/buyer/jd';
import { update as tbUpdate } from '@/api/buyer/tb';
import { update as pddUpdate } from '@/api/buyer/pdd';
import { validMoney } from '@/utils/validate';

const levelList = [
  { id: 0, title: '未设定' },
  { id: 1, title: '3心' },
  { id: 2, title: '4心' },
  { id: 3, title: '5心' },
  { id: 4, title: '1钻' },
  { id: 5, title: '2钻' },
  { id: 6, title: '3钻以上' }
];

export default {
  data() {
    const form = {
      jdAccount: '',
      tbAccount: '',
      creditLev: 0,
      accountLev: 0,
      sex: '',
      name: '',
      phone: '',
      age: '',
      province: '',
      city: '',
      district: '',
      address: '',
      id: '',
      tbLastOrderNumber: ''
    };
    const rules = {
      bankAccountName: [
        { required: true, trigger: 'blur', message: '请填写姓名' }
      ],
      bankCardNumber: [
        { required: true, trigger: 'blur', message: '请填写银行卡卡号' }
      ]
    };
    return {
      form,
      form1: form,
      rules,
      levelList,
      dialogVisible: false,
      loading: false,
      bankList: [],
      areaData: {}
    };
  },
  props: ['platform'],
  created() {
    this.create();
    const all = JSON.parse(area);
    this.areaData.all = all;
    this.areaData.province = all.filter(v => v.l == 1);
    this.areaData.city = all.filter(v => v.l == 2);
    this.areaData.region = all.filter(v => v.l == 3);
  },
  methods: {
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
      }
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true;
          var o;
          if (this.$props.platform == 1) {
            o = jdUpdate;
          } else if (this.$props.platform == 2) {
            o = tbUpdate;
          } else {
            o = pddUpdate;
          }
          o(this.form)
            .then(res => {
              this.$emit('getList');
              this.$message.success(res.msg);
              this.handleOpen();
            })
            .catch(e => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    }
  },
  computed: {
    dataCity() {
      const city = this.areaData.city.filter(v => v.p == this.form.province);
      this.form.city = city.length > 0 ? city[0].c : '';
      return city;
    },
    dataRegion() {
      const region = this.areaData.region.filter(v => v.p == this.form.city);
      this.form.district = region.length > 0 ? region[0].c : '';
      return region;
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
</style>