<template>
    <div class="app-container">
        <div class="search-box onlyform-box" style="padding-bottom: 150px;">

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="登记情况" name="add"></el-tab-pane>
                <el-tab-pane label="消缺情况" name="repair" v-if="(!ReadOnly&&form1.Status>1)||(ReadOnly&&form1.Status>2)"></el-tab-pane>
                <el-tab-pane label="验收情况" name="backFile" v-if="(!ReadOnly&&form1.Status>2)||(ReadOnly&&form1.Status>3)"></el-tab-pane>
            </el-tabs>
            <!-- <p class="form-smtitle">{{title}}</p> -->
            <el-scrollbar class="marginright-fx">
                <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="100px">
                    <el-row>
                        <el-form-item label="消缺结果" prop="IsProcessed">
                            <el-select disabled v-model="form.IsProcessed" placeholder="请选择">
                                <el-option label="已消缺" :value="true"></el-option>
                                <el-option label="未消缺" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="消缺设备" prop="AssetsIds">
                            <TreeSelect :disabled="disabled" :getCheckedNodes="false" showText="text" :mutiple="false" :data="assetsTree" @change="handleConfirm" :checkedKeys="assetsTreeId" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="提交验收人" prop="ReceiverId">
                            <TreeSelect :disabled="disabled" showText="text" :mutiple="false" :data="processTree" @change="handleConfirm1" :checkedKeys="processTreeId" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="缺陷原因" prop="Reason">
                            <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.Reason" placeholder="" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="处理说明" prop="Statement">
                            <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.Statement" placeholder="" />
                        </el-form-item>
                    </el-row>
                    <el-form-item label="消缺人" style="display:none">
                        <el-input disabled v-model="form.Processor" placeholder="" />
                    </el-form-item>
                    <el-form-item label="消缺时间" prop="ProcessTime" style="display:none">
                        <el-date-picker disabled v-model="form.ProcessTime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-form>

            </el-scrollbar>
            <el-col :span="24" :xs="24" class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary" icon="el-icon-s-promotion" @click="handleSubmit" :disabled="!form.IsProcessed" :loading="loading" v-if="form1.Status == 2&&!ReadOnly">发 送</el-button>
                    <el-button type="primary" icon="el-icon-s-release"  @click="handleBack" :loading="loading" v-if="form1.Status == 2&&!ReadOnly">回 退</el-button>
                    <el-button @click="handleOpen(null)">
                        <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
                    </el-button>
                </div>
            </el-col>

        </div>
    </div>
</template>

<script>
import { getInfo as getInfoAdd } from "@/api/biz";
import { getInfo, add, senderOrder, backOrder } from "@/api/biz/solution";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import TreeSelect from "@/views/components/TreeSelect";
export default {
<<<<<<< HEAD
    components: { TreeSelect },
    data() {
        const rules = {
            IsProcessed: [
                {
                    required: true,
                    message: "请选择消缺结果"
                }
            ],
            AssetsIds: [
                {
                    required: true,
                    message: "请选择消缺设备",
                    trigger: "change"
                }
            ],
            ReceiverId: [
                {
                    required: true,
                    message: "请选择提交验收人"
                }
            ],
            Reason: [
                {
                    pattern: /^[\s\S]{1,300}$/,
                    required: true,
                    message: "请输入300位以内的内容"
                }
            ],
            Statement: [
                {
                    pattern: /^[\s\S]{1,300}$/,
                    required: true,
                    message: "请输入300位以内的内容"
                }
            ]
        };
        return {
            form: {},
            form1: { Status: 1 },
            rules,
            dialogVisible: false,
            loading: false,
            title: "",
            deptType: "",
            AssetsIdss: [],
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
            processTreeId: [],
            Id: ""
        };
=======
  components: { TreeSelect },
  data() {
    const rules = {
      IsProcessed: [
        {
          required: true,
          message: "请选择消缺结果"
        }
      ],
      AssetsId: [
        {
          required: true,
          message: "请选择消缺设备",
          trigger: "change"
        }
      ],
      ReceiverId: [
        {
          required: true,
          message: "请选择提交验收人"
        }
      ],
      Reason: [
        {
          pattern: /^[\s\S]{1,300}$/,
          required: true,
          message: "请输入300位以内的内容"
        }
      ],
      Statement: [
        {
          pattern: /^[\s\S]{1,300}$/,
          required: true,
          message: "请输入300位以内的内容"
        }
      ]
    };
    return {
      form: {},
      form1: { Status: 1 },
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      deptType: "",
      AssetsIds: [],
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
      processTreeId: [],
      Id: ""
    };
  },
  computed: {
    ...mapGetters(["name", "userId", "token"]),
    disabled() {
      return this.form1.Status > 2 || this.ReadOnly;
>>>>>>> ee4cf1ddf75a1b162ea52adad796fb3f1f1c215d
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

<<<<<<< HEAD
        this.getTenantEmployees();
        this.getAssets();
=======
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
      this.form.AssetsId = this.assetsTreeId.join(",");
      this.$refs.form.clearValidate("AssetsId");
    },
    handleConfirm1(data) {
      this.processTreeId = data.map(v => v.id);
      this.form.ReceiverId = this.processTreeId.join(",");
      this.$refs.form.clearValidate("ReceiverId");
    },
    changeTenant() {
      this.ischange = true;
      this.getProcessor();
>>>>>>> ee4cf1ddf75a1b162ea52adad796fb3f1f1c215d
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
            this.form.AssetsIds = this.assetsTreeId.join(",");
            this.$refs.form.clearValidate("AssetsIds");
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

<<<<<<< HEAD
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
                    AssetsIds: "",
                    ReceiverId: "",
                    Reason: "",
                    Statement: "",
                    ProcessorId: "",
                    ProcessTime: new Date()
                },
                data
            );
            this.assetsTreeId = this.form.AssetsIds.split(",").filter(v => v);
            this.processTreeId = this.form.ReceiverId.split(",").filter(v => v);
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
=======
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
          AssetsId: "",
          ReceiverId: "",
          Reason: "",
          Statement: "",
          ProcessorId: "",
          ProcessTime: new Date()
        },
        data
      );
      this.assetsTreeId = this.form.AssetsId.split(",").filter(v => v);
      this.processTreeId = this.form.ReceiverId.split(",").filter(v => v);
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
>>>>>>> ee4cf1ddf75a1b162ea52adad796fb3f1f1c215d
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
                        let data = { Id };
                        data.ProcessorId = this.form1.ProcessorId;
                        this.reset(data);
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
/deep/.onlyform-box .el-form .el-form-item {
    width: 350px;
    display: inline-block;
    vertical-align: text-top;
}
</style>