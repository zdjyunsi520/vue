<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登记情况" name="add"></el-tab-pane>
        <el-tab-pane label="消缺情况" name="repair" v-if="form1.Status>0&&(ReadOnly?form1.Status>1:true)"></el-tab-pane>
        <el-tab-pane label="验收情况" name="backFile" v-if="form1.Status>1&&(ReadOnly?form1.Status>2:true)"></el-tab-pane>
      </el-tabs>
      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar>
        <el-form :model="form" ref="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="11" :xs="24">
              <el-form-item label="消缺结果" prop="isprocessed">
                <el-select :disabled="disabled" v-model="form.isprocessed" placeholder="请选择">
                  <el-option label="已消缺" :value="true"></el-option>
                  <el-option label="未消缺" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="消缺设备" prop="assetsids">
                  <TreeSelect :disabled="disabled" showText="text" :mutiple="false" :data="assetsTree" @change="handleConfirm" :checkedKeys="assetsTreeId" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="提交验收人" prop="receiverId">
                  <TreeSelect :disabled="disabled" showText="text" :mutiple="false" :data="processTree" @change="handleConfirm1" :checkedKeys="processTreeId" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="缺陷原因" prop="reason">
                  <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.reason" placeholder="" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="处理说明" prop="statement">
                  <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.statement" placeholder="" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24" v-if="form1.Processor">
              <el-col :span="11" :xs="24">
                <el-form-item label="消缺人">
                  <el-input disabled="disabled" v-model="form1.Processor" placeholder="" />
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24" v-if="form1.processtime">
              <el-col :span="11" :xs="24">
                <el-form-item label="消缺时间" prop="processtime">
                  <el-date-picker disabled="disabled" v-model="form.processtime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-s-promotion" @click="handleSubmit" :loading="loading" v-if="form1.Status == 1">发 送</el-button>
          <el-button type="primary" icon="el-icon-s-release"  @click="handleBack" :loading="loading" v-if="form1.Status == 1">回 退</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import { getInfo, add, senderOrder, backOrder } from "@/api/biz/solution";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import TreeSelect from "@/views/components/TreeSelect";
export default {
  components: { TreeSelect },
  data() {
    const rules = {
      isprocessed: [
        {
          required: true,
          message: "请选择消缺结果"
        }
      ],
      assetsids: [
        {
          required: true,
          message: "请选择消缺设备",
          trigger: "change"
        }
      ],
      receiverId: [
        {
          required: true,
          message: "请选择提交验收人"
        }
      ],
      reason: [
        {
          required: true,
          message: "请填写缺陷原因"
        }
      ],
      statement: [
        {
          required: true,
          message: "请填写处理说明"
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
      activeName: "repair",
      processpersonId: [],
      ReadOnly: false,
      assetsTreeId: [],
      processTreeId: []
    };
  },
  computed: {
    ...mapGetters(["name", "userId", "token"]),
    disabled() {
      return this.form1.Status > 1 || this.ReadOnly;
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
    this.getTenantEmployees();
    this.getAssets();
    let { data, ReadOnly } = this.$route.params;
    this.ReadOnly = ReadOnly;
    this.form1 = Object.assign({}, data);
    data && this.getInfo(data);
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
    },
    handleConfirm1(data) {
      this.processTreeId = data.map(v => v.id);
      this.form.receiverId = this.processTreeId.join(",");
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
          isprocessed: "",
          assetsids: "",
          receiverId: "",
          reason: "",
          statement: ""
        },
        data
      );
    },
    getInfo(data) {
      let { Id } = data;
      if (data.Status > 1) {
        this.loading = true;
        const { Id } = data;
        getInfo({ Id })
          .then(res => {
            this.reset(res.data);
          })
          .finally(v => (this.loading = false));
      } else {
        this.reset({ Id });
      }
    },
    handleOpen() {
      this.$router.push({
        name: "/defect/orderList/index",
        params: {}
      });
    },
    handleClick(a) {
      const data = this.form1;
      const ReadOnly = this.ReadOnly;
      this.$router.push({
        name: "/defect/orderList/components/" + a.name,
        params: { data, ReadOnly }
      });
    },
    handleBack() {
      const Id = this.form.Id;
      backOrder({ Id })
        .then(r => {
          this.$message.success("回退成功！");
          this.handleOpen();
        })
        .catch(r => {
          this.loading = false;
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
              let Id = res.data.Id;
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