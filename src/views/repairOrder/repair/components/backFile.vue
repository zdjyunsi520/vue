<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="故障受理" name="add"></el-tab-pane>
        <el-tab-pane label="故障抢修" name="repair" v-if="(!ReadOnly&&form1.Status>1)||(ReadOnly&&form1.Status>2)"></el-tab-pane>
        <el-tab-pane label="故障归档" name="backFile" v-if="(!ReadOnly&&form1.Status>2)||(ReadOnly&&form1.Status>3)"></el-tab-pane>
      </el-tabs>
      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar class="marginright-fx">
        <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="80px" style="width:370px">
          <el-row>

            <el-form-item label="归档人" prop="FilePersonId">
              <TreeSelect :disabled="disabled" showText="text" :mutiple="false" :data="allpatrolusers" @change="handleConfirm" :checkedKeys="processpersonId" />
            </el-form-item>

            <el-form-item label="归档时间" prop="FileTime">
              <el-date-picker :disabled="disabled" v-model="form.FileTime" type="datetime" placeholder="请选择时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-s-promotion" @click="handleSubmit" :loading="loading" v-if="form1.Status == 3">发 送</el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import { getInfo, add, senderOrder } from "@/api/repairOrder/backFile";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import TreeSelect from "@/views/components/TreeSelect";
export default {
  components: { TreeSelect },
  data() {
    const rules = {
      FileTime: [
        {
          required: true,
          message: "请选择时间",
          trigger: "blur"
        }
      ],
      FilePersonId: [
        {
          required: true,
          message: "请选择归档人"
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

      imageUrl: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogAssetsVisible: false,
      dialogEmployeesVisible: false,
      assetsTree: [],
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
      fromUrl: false
    };
  },
  computed: {
    ...mapGetters(["name", "userId", "token"]),
    disabled() {
      return this.form1.Status > 3 || this.ReadOnly;
    }
  },
  created() {
    this.getTenantEmployees();
    let { data, ReadOnly, fromUrl } = this.$route.params;
    this.ReadOnly = ReadOnly;
    this.fromUrl = fromUrl;
    this.form1 = Object.assign({}, data);

    this.getInfo(data);
  },
  methods: {
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({}).then(res => {
        this.allpatrolusers = res.data;
      });
    },
    handleConfirm(data) {
      this.processpersonId = data.map(v => v.id);
      this.form.FilePersonId = this.processpersonId.join(",");
      this.$refs.form.clearValidate("FilePersonId");
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
          FilePersonId: "",
          FileTime: ""
        },
        data
      );
      this.form.FileTime = this.form.FileTime ? this.form.FileTime : new Date();
    },
    getInfo(data) {
      this.loading = true;
      if (data) {
        this.form1 = data;
        const { Id } = data;

        if (data.Status > 3) {
          getInfo({ Id })
            .then(res => {
              this.reset(res.data);
              this.processpersonId = this.form.FilePersonId
                ? this.form.FilePersonId.split(",")
                : [];
            })
            .finally(v => (this.loading = false));
        } else {
          this.loading = false;
          this.reset({ Id });
        }
      }
    },
    handleOpen() {
      let url = this.fromUrl
        ? "/operationMonitoring/realtimeAlarm/index"
        : "/repairOrder/repair/index";
      this.$router.push({
        name: url,
        params: {}
      });
    },
    handleClick(a) {
      const data = this.form1;
      const ReadOnly = this.ReadOnly;
      this.$router.push({
        name: "/repairOrder/repair/components/" + a.name,
        params: { data, ReadOnly }
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