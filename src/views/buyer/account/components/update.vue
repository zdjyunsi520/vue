<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="'修改会员信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="手机号">
        {{form.buyerAccount}}
      </el-form-item>
      <el-form-item label="京东账号" prop="jdAccount" v-if="platform==3">
        <el-input v-model="form.jdAccount" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="淘宝账号" prop="tbAccount" v-if="platform==1">
        <el-input v-model="form.tbAccount" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="拼多多账号" prop="pddAccount" v-if="platform==2">
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
          <el-radio :label="2">不确定</el-radio>
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
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
      <el-form-item label="原收货地区">
        {{form.province}} {{form.city}} {{form.district}}
      </el-form-item>
      <el-form-item label="修改后地区">
        <el-select class="xl-width-150" v-model="province" placeholder="请选择省份">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in areaData.province" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
        <el-select class="xl-width-150" v-model="city" placeholder="请选择市">
          <el-option v-for="item in dataCity" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
        <el-select class="xl-width-150" v-model="district" placeholder="请选择区县">
          <el-option v-for="item in dataRegion" :key="item.c" :label="item.a" :value="item.c">
            {{item.a}}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="淘宝订单号" prop="tbLastOrderNumber" v-if="platform==1">
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
import { getInfoById, update } from '@/api/buyer/all';
import { validMoney } from '@/utils/validate';

const levelList = [
  { id:-2, title: '未设定' },
  { id:-1, title: '1心' },
  { id: 0, title: '2心' },
  { id: 1, title: '3心' },
  { id: 2, title: '4心' },
  { id: 3, title: '5心' },
  { id: 4, title: '黄钻' },
  { id: 5, title: '皇冠' },
  { id: 6, title: '紫金皇冠' }
];

export default {
  data() {
    const form = {
      jdAccount: '',
      tbAccount: '',
      pddAccount: '',
      creditLev: -2,
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
      tbLastOrderNumber: '',
      bindAccountId: '',
      bindAccountType: '',
      platform: 0
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
      areaData: {},
      bindAccountId: 0,
      platform: null,
      province: '',
      city: '',
      district: ''
    };
  },
  created() {
    const all = JSON.parse(area);
    this.areaData.all = all;
    this.areaData.province = all.filter(v => v.l == 1);
    this.areaData.city = all.filter(v => v.l == 2);
    this.areaData.region = all.filter(v => v.l == 3);
    this.areaData.allKV = all.reduce((l, v) => {
      l[v.c] = v.a;
      return l;
    }, {});
  },
  methods: {
    filterAll(code) {
      return this.areaData.allKV[code];
    },
    getInfo() {
      this.loading = true;
      getInfoById({
        bindAccountId: this.bindAccountId,
        bindAccountType: this.platform
      })
        .then(r => {
          Object.assign(this.form, r.data);
          const creditLev = r.data.creditLev
          this.form.creditLev = creditLev!=null?creditLev:-2
        })
        .finally(() => (this.loading = false));
    },
    create() {
      // this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
        this.province = '';
      }
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true;
          var o;
          if (this.platform == 1) {
            this.form.bindAccountName = this.form.tbAccount;
          } else if (this.platform == 3) {
            this.form.bindAccountName = this.form.jdAccount;
          } else {
            this.form.bindAccountName = this.form.pddAccount;
          }
          this.form.bindAccountType = this.platform;
          this.form.bindAccountId = this.bindAccountId;
          if (this.province && this.city) {
            this.form.province = this.filterAll(this.province);
            this.form.city = this.filterAll(this.city);
            const district = this.filterAll(this.district);
            this.form.district = district ? district : '';
            this.form.addressCode =
              this.province + ',' + this.city + ',' + this.district;
          }
          o = update;
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
      const city = this.areaData.city.filter(v => v.p == this.province);
      this.city = city.length > 0 ? city[0].c : '';
      return city;
    },
    dataRegion() {
      const region = this.areaData.region.filter(v => v.p == this.city);
      this.district = region.length > 0 ? region[0].c : '';
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