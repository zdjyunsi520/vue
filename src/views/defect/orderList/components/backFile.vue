<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登记情况" name="add"></el-tab-pane>
        <el-tab-pane label="消缺情况" name="repair" v-if="(!ReadOnly&&form1.Status>0)||(ReadOnly&&form1.Status>1)"></el-tab-pane>
        <el-tab-pane label="验收情况" name="backFile" v-if="(!ReadOnly&&form1.Status>1)||(ReadOnly&&form1.Status>2)"></el-tab-pane>
      </el-tabs>
      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar>
        <el-form :model="form" ref="form" label-position="left" :rules="rules" label-width="110px">

          <el-row>
            <el-col :span="11" :xs="24">
              <el-col :span="24" :xs="24">
                <el-form-item label="验收结果" prop="IsReceived">
                  <el-select :disabled="disabled" v-model="form.IsReceived" placeholder="请选择">
                    <el-option label="合格" :value="true"></el-option>
                    <el-option label="不合格" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :xs="24">
                <el-form-item label="消缺结果" prop="IsProcessed">
                  <el-select :disabled="disabled" v-model="form.IsProcessed" placeholder="请选择">
                    <el-option label="已消缺" :value="true"></el-option>
                    <el-option label="未消缺" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :xs="24">
                <el-form-item label="验收情况" prop="Situation">
                  <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.Situation" placeholder="请输入验收情况" />
                </el-form-item>
              </el-col>
              <el-col v-if="form1.Status>2">
                <el-col :span="24" :xs="24">
                  <el-form-item label="验收人" prop="Receiver">
                    <el-input disabled="disabled" v-model="form.Receiver" placeholder="" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" :xs="24">
                  <el-form-item label="验收时间" prop="ReceiveTime">
                    <el-date-picker disabled="disabled" v-model="form.ReceiveTime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </el-form>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-s-promotion" @click="handleSubmit" :loading="loading" v-if="form1.Status == 2&&!ReadOnly">发 送</el-button>
          <el-button type="primary" icon="el-icon-s-release"  @click="handleBack" :loading="loading" v-if="form1.Status == 2&&!ReadOnly">回 退</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import { getInfo, add, senderOrder, backOrder } from "@/api/biz/backFile";
import { getInfo as getInfoRepair } from "@/api/biz/solution";
import { getInfo as getInfoAdd } from "@/api/biz";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import TreeSelect from "@/views/components/TreeSelect";
export default {
  components: { TreeSelect },
  data() {
    const rules = {
      IsProcessed: [
        {
          required: true,
          message: "请选择消缺结果"
        }
      ],
      IsReceived: [
        {
          required: true,
          message: "请选择验收结果",
          trigger: "change"
        }
      ],

      Situation: [
        {
          required: true,
          message: "请填写验收情况"
        }
      ]
    };
    return {
      form: {},
      form1: { Status: 0 },
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      deptType: "",
      assetsIdss: [],
      processorIds: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      ranks: [],
      TenantIds: [],
      imageUrl: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogAssetsVisible: false,
      dialogEmployeesVisible: false,
      allassetsTree: [],
      processorTree: [],
      allpatrolusers: [],
      employeesTree: [],
      ischange: false,
      count: 0,
      selectAssets: [],
      activeName: "backFile",
      processpersonId: [],
      ReadOnly: false,
      assetsTreeId: [],
      processTreeId: [],
      Id: ""
    };
  },
  computed: {
    ...mapGetters(["name", "userId", "token"]),
    disabled() {
      return this.form1.Status > 2 || this.ReadOnly;
    },
    assetsTree() {
      const list = this.allassetsTree
        .filter(v => v.id == this.form1.TenantId)
        .map(v => v.childs);
      return list.length ? list[0] : [];
    },
    processTree() {
      const list = this.allpatrolusers
        .filter(v => v.id == this.form1.TenantId)
        .map(v => v.childs);
      return list.length ? list[0] : [];
    }
  },
  created() {
    let { Id, ReadOnly } = this.$route.params;
    this.Id = Id;
    this.ReadOnly = ReadOnly;
    this.getInfo();
    this.getTenantEmployees();
    this.getAssets();
  },
  methods: {
    // 获取设备列表
    getAssets() {
      getTrees().then(res => {
        this.allassetsTree = res.data;
      });
    },
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },
    handleConfirm(data) {
      this.assetsTreeId = data.map(v => v.id);
      this.form.assetsids = this.assetsTreeId.join(",");
      this.$refs.form.clearValidate("assetsids");
    },
    handleConfirm1(data) {
      this.processTreeId = data.map(v => v.id);
      this.form.ReceiverId = this.processTreeId.join(",");
      this.$refs.form.clearValidate("ReceiverId");
    },
    changeTenant() {
      this.ischange = true;
      this.getProcessor();
    },

    checkchange(data, checked) {
      if (checked) {
        const target = this.$refs.tree;
        target.setCheckedKeys([data.id]);
      }
    },
    //人员选择确定
    handleEmpcheck() {
      this.dialogEmployeesVisible = false;
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          IsProcessed: true,
          IsReceived: true,
          Situation: "",
          ReceiverId: "",
          ReceiveTime: new Date()
        },
        data
      );
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    getInfo() {
      let Id = this.Id;
      if (Id) {
        getInfoAdd({ Id }).then(r => {
          this.form1 = Object.assign({}, r.data);
          if (this.form1.Status > 2) {
            getInfo({ Id }).then(res => {
              this.reset(res.data);
            });
          } else {
            getInfoRepair({ Id }).then(r => {
              let data = { Id };
              data.ReceiverId = r.data.ReceiverId;
              this.reset(data);
            });
          }
        });
      }
    },
    handleOpen() {
      this.$router.push({
        name: "/defect/orderList/index",
        params: {}
      });
    },
    handleClick(a) {
      const Id = this.Id;
      const ReadOnly = this.ReadOnly;
      this.$router.push({
        name: "/defect/orderList/components/" + a.name,
        params: { Id, ReadOnly }
      });
    },
    handleBack() {
      const Id = this.form1.Id;
      backOrder({ Id }).then(r => {
        this.$message.success("回退成功！");
        this.handleOpen();
      });
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let fn = add;
          fn(this.form)
            .then(res => {
              let Id = this.Id;
              senderOrder({ Id })
                .then(r => {
                  this.$message.success("发送成功！");
                  this.handleOpen();
                })
                .catch(e => (this.loading = false));
            })
            .catch(r => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  height: 60vh;
  overflow: auto;
}
/deep/.el-checkbox:last-of-type {
  margin-right: 10px !important;
}
.avatar {
  width: 100%;
  height: 100%;
}
</style>