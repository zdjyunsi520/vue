<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="故障受理" name="add"></el-tab-pane>
        <el-tab-pane label="故障抢修" name="repair" v-if="form1.Status>1"></el-tab-pane>
        <el-tab-pane label="故障归档" name="backFile" v-if="form1.Status>2"></el-tab-pane>
      </el-tabs>
      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar>
        <el-form :model="form" ref="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="到达现场时间" prop="arrivetime">
                  <el-date-picker v-model="form.arrivetime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="故障排除时间" prop="processtime">
                  <el-date-picker v-model="form.processtime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="恢复送电时间" prop="recovertime">
                  <el-date-picker v-model="form.recovertime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="处理人" prop="processpersonId">
                  <el-select v-model="form.processpersonId" placeholder="">
                    <el-option v-for="(item,index) in processorIds" :key="index" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item label="现场抢修记录" prop="processrecord">
                <el-input type="textarea" :rows="5" v-model="form.processrecord" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-s-promotion" @click="handleSend" :loading="loading">发 送</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>

      <el-dialog title="人员选择" :visible.sync="dialogEmployeesVisible" center width="500px">
        <el-tree :data="processorIds" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEmpcheck">确 定</el-button>
          <el-button @click="dialogAssetsVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getInfo, add, update } from "@/api/repairOrder/repair";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
export default {
  data() {
    const rules = {
      arrivetime: [
        {
          required: true,
          message: "请选择时间",
          trigger: "blur"
        }
      ],
      processtime: [
        {
          required: true,
          message: "请选择时间",
          trigger: "blur"
        }
      ],
      recovertime: [
        {
          required: true,
          message: "请选择时间",
          trigger: "blur"
        }
      ],
      processpersonId: [
        {
          required: true,
          message: "请选择处理人",
          trigger: "blur"
        }
      ],
      processrecord: [
        {
          required: true,
          message: "现场抢修记录不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {},
      form1: {},
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
      assetsTree: [],
      allassetsTree: [],
      processorTree: [],
      allpatrolusers: [],
      employeesTree: [],
      ischange: false,
      count: 0,
      selectAssets: [],
      activeName: "repair"
    };
  },
  computed: {
    ...mapGetters(["name", "userId", "token"])
  },
  created() {
    this.getTenantEmployees();
    let { data, TenantIds } = this.$route.params;
    this.form1 = data;
    this.TenantIds = TenantIds;
    this.getInfo(data);
  },
  methods: {
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({})
        .then(res => {
          this.allpatrolusers = res.data;
          if (this.form.repairtenantid) this.getProcessor();
        })
        .catch(error => {
          console.log(error);
        });
    },

    changeTenant() {
      this.ischange = true;
      this.getProcessor();
    },
    // 消缺人下拉
    getProcessor() {
      if (this.ischange) {
        this.form.chargepersonId = "";
        this.form.receivepersonId = "";
      }
      this.allpatrolusers.forEach(v => {
        if (v.id == this.form.repairtenantid) {
          this.processorIds = v.childs;
        }
      });
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
          receiveId: "",
          arrivetime: "",
          processtime: "",
          recovertime: "",
          processpersonId: "",
          processrecord: ""
        },
        data
      );
    },
    getInfo(data) {
      this.loading = true;
      if (data && data.Status > 2) {
        const { OrderCode } = data;
        getInfo({ OrderCode })
          .then(res => {
            this.reset(res.data);
          })
          .finally(v => (this.loading = false));
      } else {
        this.loading = false;
        this.reset(data);
      }
    },
    handleOpen(data) {
      this.$router.push({
        name: "/repairOrder/repair/index",
        params: {}
      });
    },
    // 回退
    handleBack() {},
    // 发送
    handleSend() {},
    handleClick(a) {
      const data = this.form1;
      this.$router.push({
        name: "/repairOrder/repair/components/" + a.name,
        params: { data }
      });
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let fn = this.form.Id ? update : add;
          fn(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.handleOpen();
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