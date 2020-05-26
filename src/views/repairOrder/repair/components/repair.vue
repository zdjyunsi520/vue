<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="故障受理" name="add"></el-tab-pane>
        <el-tab-pane label="故障抢修" name="repair"></el-tab-pane>
        <el-tab-pane label="故障归档" name="backFile"></el-tab-pane>
      </el-tabs>
      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar>
        <el-form :model="form" ref="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="到达现场时间" prop="receivetime">
                  <el-date-picker v-model="form.receivetime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="故障排除时间" prop="receivetime">
                  <el-date-picker v-model="form.receivetime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="恢复送电时间" prop="receivetime">
                  <el-date-picker v-model="form.receivetime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="处理人" prop="receivepersonId">
                  <el-select v-model="form.receivepersonId" placeholder="">
                    <el-option v-for="(item,index) in processorIds" :key="index" :label="item.text" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" :xs="24">
              <el-form-item label="现场抢修记录" prop="situation">
                <el-input type="textarea" :rows="5" v-model="form.situation" placeholder="" />
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
import { add, update } from "@/api/repairOrder";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
export default {
  data() {
    const rules = {
      // tenantId: [
      //   {
      //     required: true,
      //     message: "用电单位不能为空",
      //     trigger: "change"
      //   }
      // ]
      // assetsIds: [
      //   {
      //     required: true,
      //     message: "设备不能为空",
      //     trigger: "change"
      //   }
      // ],
      // rank: [
      //   {
      //     required: true,
      //     message: "缺陷等级不能为空",
      //     trigger: "change"
      //   }
      // ],
      // detecterId: [
      //   {
      //     required: true,
      //     message: "发现人不能为空",
      //     trigger: "blur"
      //   }
      // ],
      // detecttime: [
      //   {
      //     required: true,
      //     message: "发现时间不能为空",
      //     trigger: "change"
      //   }
      // ],
      // processorId: [
      //   {
      //     required: true,
      //     message: "消缺人不能为空",
      //     trigger: "change"
      //   }
      // ],
      // processdue: [
      //   {
      //     required: true,
      //     message: "处理期限不能为空",
      //     trigger: "change"
      //   }
      // ],
      // description: [
      //   {
      //     required: true,
      //     message: "缺陷内容不能为空",
      //     trigger: "blur"
      //   }
      // ]
    };
    return {
      form: {},
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
    let { data, title, TenantIds, ranks } = this.$route.params;
    this.title = title;
    this.TenantIds = TenantIds;
    this.ranks = ranks;
    if (data && data.Id) {
      this.getInfo(data);
    } else {
      this.reset(data);
    }
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
    checkchange1(data, checked, node) {
      this.count++;
      if (this.count % 2 === 0) {
        if (checked) {
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.tree.setCheckedKeys([data.id]);
          this.form.assetsIds = data.id;
          this.form.assetsIdtext = data.text;
          this.count = 1;
          //交叉点击节点
        } else {
          this.$refs.tree.setCheckedKeys([]);
          this.form.assetsIds = "";
          this.form.assetsIdtext = "";
          this.count = 0;
          //点击已经选中的节点，置空
        }
      } else {
        this.form.assetsIds = data.id;
        this.form.assetsIdtext = data.text;
        this.count = 1;
      }
    },

    //设备选择确定
    handlecheck() {
      var arr = this.$refs.tree.getCheckedNodes();
      if (arr.length) {
        this.form.assetsIdtext = arr[0].text;
        this.form.assetsIds = arr[0].id;
        this.dialogAssetsVisible = false;
      } else {
        this.$message.error("请选择一个设备");
      }
    },
    //人员选择确定
    handleEmpcheck() {
      this.dialogEmployeesVisible = false;
    },

    // 缺陷关联发现时间
    changeTime() {
      var d = new Date(this.form.detecttime);
      var dtime;
      if (this.form.rank == 1) {
        dtime = d.setMonth(d.getMonth() + 6);
      } else if (this.form.rank == 2) {
        dtime = d.setMonth(d.getMonth() + 1);
      } else {
        dtime = d.setDate(d.getDate() + 1);
      }
      this.form.processdue = d;
    },

    // 表单重置
    reset(data) {
      const now = Date.now();
      var nowTime = new Date(now);
      var processdueTime = new Date(now);
      processdueTime.setMonth(processdueTime.getMonth() + 6);
      this.form = Object.assign({}, data);
    },
    getInfo(data) {
      this.loading = true;
      if (data) {
        const id = { id: data.Id };
        if (id) {
          getInfo(id)
            .then(res => {
              this.reset(data);
              this.form = res.data;
              // this.form.StartTime = new Date(res.data.StartTime).getTime();
            })
            .finally(v => (this.loading = false));
        }
      } else {
        this.loading = false;
        this.reset(data);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
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
      const data = {};
      this.$router.push({
        name: "/repairOrder/repair/components/" + a.name,
        params: { data }
      });
    },
    /** 提交按钮 */
    handleSubmit() {
      console.log(123);
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          let fn;
          if (this.form.id) fn = update;
          else fn = add;
          this.form.AttachmentKey = this.imageUrl.map(v => v.uid).join(",");
          fn(this.form)
            .then(res => {
              //消息提示
              this.$message.success(res.msg);
              //刷新列表
              this.$emit("getList");
              //关闭窗口
              this.handleOpen();
            })
            .catch(r => {
              //取消按钮转圈圈
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