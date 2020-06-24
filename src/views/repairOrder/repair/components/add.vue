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
                <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="80px">
                    <el-row>
                        <el-form-item label="用电单位" prop="SourceTenantId">
                            <el-select v-model="form.SourceTenantId" placeholder="" :disabled="disabled" @change="hanldeChange">
                                <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地址" prop="Address">
                            <el-input v-model="form.Address" placeholder="" :disabled="disabled" />
                        </el-form-item>
                    </el-row>
                    <el-row>

                        <el-form-item label="联系人" prop="ContactPerson">
                            <el-input v-model="form.ContactPerson" placeholder="请输入联系人" :disabled="disabled" />
                        </el-form-item>
                        <el-form-item label="联系电话" prop="ContactPhoneNo">
                            <el-input v-model="form.ContactPhoneNo" placeholder="请输入联系电话" :disabled="disabled" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="业务来源" prop="RepairSource">
                            <el-select v-model="form.RepairSource" :disabled="true">
                                <el-option label="用户报修" :value="1"></el-option>
                                <el-option label="故障告警" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="紧急程度" prop="EmergencyLevel">
                            <el-select v-model="form.EmergencyLevel" placeholder="请选择设备" :disabled="disabled">
                                <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="抢修单位" prop="RepairTenantId">
                            <el-select v-model="form.RepairTenantId" placeholder="" :disabled="disabled">
                                <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="负责人" prop="ChargePersonId">
                            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm" :checkedKeys="ChargePersonId" :disabled="disabled" />
                        </el-form-item>
                        <el-form-item label="联系电话" prop="ChargePhoneNo">
                            <el-input v-model="form.ChargePhoneNo" placeholder="请输入负责人联系电话" :disabled="disabled" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="受理人" prop="ReceivePersonId">
                            <TreeSelect showText="text" :mutiple="false" :data="personList" @change="handleConfirm1" :checkedKeys="ReceivePersonId" :disabled="disabled" />
                        </el-form-item>
                        <el-form-item label="联系电话" prop="ReceivePhoneNo">
                            <el-input v-model="form.ReceivePhoneNo" placeholder="请输入受理人联系电话" :disabled="disabled" />
                        </el-form-item>
                    </el-row>
                    <el-row style="display:none">
                        <el-form-item label="受理时间" prop="ReceiveTime">
                            <el-date-picker :disabled="disabled" v-model="form.ReceiveTime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="工单编号" prop="OrderCode" v-if="form.OrderCode">
                            <el-input v-model="form.OrderCode" disabled placeholder="" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="故障现象" prop="Situation">
                            <el-input :disabled="disabled" type="textarea" :rows="5" v-model="form.Situation" placeholder="请输入故障现象" />
                        </el-form-item>
                    </el-row>
                </el-form>

            </el-scrollbar>
            <el-col :span="24" :xs="24" class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary" @click="handleSubmit" :loading="loading" v-if="form1.Status<2&&!ReadOnly">
                        <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
                    </el-button>
                    <el-button type="primary" icon="el-icon-s-promotion" @click="handleSend" :loading="loading" v-if="form1.Status<2&&!ReadOnly">发 送</el-button>
                    <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
                </div>
            </el-col>

        </div>
    </div>
</template>

<script>
import { add, update, senderOrder } from "@/api/repairOrder";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import TreeSelect from "@/views/components/TreeSelect";
import { getChildrenList } from "@/api/org";
import { getInfo } from "@/api/systemManager/organization";
import { getInfo as getEmployeeInfo } from "@/api/systemManager/user";
export default {
    components: { TreeSelect },
    data() {
        const rules = {
            SourceTenantId: [
                {
                    required: true,
                    message: "请选择用电单位",
                    trigger: "blur"
                }
            ],
            RepairSource: [
                {
                    required: true,
                    message: "请选择业务来源",
                    trigger: "blur"
                }
            ],
            EmergencyLevel: [
                {
                    required: true,
                    message: "请选择紧急程度",
                    trigger: "blur"
                }
            ],
            RepairTenantId: [
                {
                    required: true,
                    message: "请选择抢修单位",
                    trigger: "blur"
                }
            ],
            ChargePersonId: [
                {
                    required: true,
                    message: "请选择负责人"
                }
            ],
            ReceivePersonId: [
                {
                    required: true,
                    message: "请选择受理人"
                }
            ],
            ReceiveTime: [
                {
                    required: true,
                    message: "请选择受理时间",
                    trigger: "blur"
                }
            ],
            Address: [
                {
                    pattern: /^.{1,300}$/,
                    required: false,
                    message: "请输入300位以内的内容"
                }
            ],
            ContactPerson: [
                {
                    pattern: /^[A-Za-z\u4e00-\u9fa5]{1,12}$/,
                    message: "请输入12位以内的汉字或字母",
                    trigger: "blur"
                }
            ],
            ChargePhoneNo: [
                {
                    pattern: /^1\d{10}$/,
                    message: "请输入正确的手机号"
                }
            ],
            ReceivePhoneNo: [
                {
                    pattern: /^1\d{10}$/,
                    message: "请输入正确的手机号"
                }
            ],
            ContactPhoneNo: [
                {
                    pattern: /^1\d{10}$/,
                    message: "请输入正确的手机号"
                }
            ],
            Situation: [
                {
                    pattern: /^.{1,300}$/,
                    message: "请输入300位以内的内容"
                }
            ]
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
            ranks: [
                { name: "一般", id: 1 },
                { name: "紧急", id: 2 },
                { name: "严重", id: 3 }
            ],
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
            ischange: 0,
            count: 0,
            selectAssets: [],
            activeName: "add",
            ChargePersonId: [],
            ReceivePersonId: [],
            form1: {},
            ReadOnly: false,
            fromUrl: false
        };
    },
    computed: {
        ...mapGetters(["name", "userId", "token"]),
        personList() {
            let list = [];
            if (this.ischange > 1) {
                this.ChargePersonId = [];
                this.ReceivePersonId = [];
            }
            this.ischange++;
            this.allpatrolusers.forEach(v => {
                if (v.id == this.form.RepairTenantId) {
                    list = v.childs;
                }
            });
            return list;
        },
        disabled() {
            return this.form1.Status > 1 || this.ReadOnly;
        }
    },
    created() {
        this.getTenants();
        this.getTenantEmployees();
        let { data, ReadOnly, fromUrl } = this.$route.params;
        this.ReadOnly = ReadOnly;
        this.fromUrl = fromUrl;
        this.form1 = Object.assign(
            {
                Status: 0
            },
            data
        );
        this.reset(data);
    },
    methods: {
        hanldeChange() {
            getInfo({ Id: this.form.SourceTenantId }).then(r => {
                this.form.ContactPerson = r.data.ContactPerson;
                this.form.ContactPhoneNo = r.data.MobilePhone;
                this.form.Address = r.data.Address;
            });
        },
        getEmployeeInfo(Id, target) {
            this.form[target] = "";
            getEmployeeInfo({ Id }).then(r => {
                this.form[target] = r.data.MobilePhone;
            });
        },

        // 巡视单位列表
        getTenants() {
            getChildrenList().then(res => {
                this.TenantIds = res.data;
            });
        },
        handleConfirm(data) {
            this.ChargePersonId = data.map(v => v.id);
            this.form.ChargePersonId = this.ChargePersonId.join(",");
            this.getEmployeeInfo(this.form.ChargePersonId, "ChargePhoneNo");
            this.$refs.form.clearValidate("ChargePersonId");
        },
        handleConfirm1(data) {
            this.ReceivePersonId = data.map(v => v.id);
            this.form.ReceivePersonId = this.ReceivePersonId.join(",");
            this.getEmployeeInfo(this.form.ReceivePersonId, "ReceivePhoneNo");
            this.$refs.form.clearValidate("ReceivePersonId");
        },
        // 巡视人员
        getTenantEmployees() {
            getTenantEmployees({}).then(res => {
                this.allpatrolusers = res.data;
                if (this.form.repairtenantid) this.getProcessor();
            });
        },

        changeTenant() {
            this.ischange = true;
            this.getProcessor();
        },
        // 消缺人下拉
        getProcessor() {
            if (this.ischange) {
                this.ChargePersonId = [];
                this.form.receivepersonId = "";
            }

            this.allpatrolusers.forEach(v => {
                if (v.id == this.form.repairtenantid) {
                    this.processorIds = v.childs;
                }
            });
        },

        // 获取设备列表
        getChargePerson() {
            this.dialogChargePersonVisible = true;
            getTrees()
                .then(res => {
                    this.allassetsTree = res.data;
                    this.allassetsTree.forEach(v => {
                        if (v.id == this.form.tenantId) {
                            this.assetsTree = v.childs;
                            if (this.form.assetsIds) {
                                this.$refs.tree.setCheckedKeys([
                                    this.form.assetsIds
                                ]);
                            }
                            return;
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        },

        checkchange(data, checked) {
            if (checked) {
                const target = this.$refs.tree;
                target.setCheckedKeys([data.id]);
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
            this.form = Object.assign(
                {
                    Id: "",
                    OrderCode: "",
                    SourceTenantId: "",
                    // SourceTenantName: "",
                    Address: "",
                    ContactPerson: "",
                    ContactPhoneNo: "",
                    RepairSource: 2,
                    RepairTenantId: "",
                    //RepairTenantName: "1",
                    ChargePersonId: "",
                    // ChargePersonName: "",
                    ChargePhoneNo: "",
                    ReceivePersonId: "",
                    // ReceivePersonName: "",
                    ReceivePhoneNo: "",
                    ReceiveTime: new Date(),
                    EmergencyLevel: 1,
                    Situation: "",
                    Status: 0
                    // CreateTime: "",
                    // CreateUser: "",
                    // UpdateTime: "",
                    // UpdateUser: "",
                    // CreateUserId: ""
                },
                data
            );
            if (this.form.ChargePersonId)
                this.ChargePersonId = this.form.ChargePersonId.split(",");
            if (this.form.ReceivePersonId)
                this.ReceivePersonId = this.form.ReceivePersonId.split(",");
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            });

            this.form.ReceiveTime = new Date();
            if (!this.form.Id && this.form.SourceTenantId) this.hanldeChange();
        },
        getInfo(data) {
            this.loading = true;
            if (data) {
                const id = { id: data.Id };
                if (id) {
                    getInfo(id)
                        .then(res => {
                            this.reset(res.data);
                            // this.form.StartTime = new Date(res.data.StartTime).getTime();
                        })
                        .finally(v => (this.loading = false));
                }
            } else {
                this.loading = false;
                this.reset(data);
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
        // 回退
        handleBack() {},
        // 发送
        handleSend() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    let { Id } = this.form;
                    this.loading = true;
                    let fn = Id ? update : add;
                    fn(this.form)
                        .then(res => {
                            Id = Id ? Id : res.data.Id;
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
                    let fn = this.form.Id ? update : add;
                    fn(this.form)
                        .then(res => {
                            var txt = this.form.Id
                                ? "编辑成功！"
                                : "新增成功！";
                            this.$message.success(txt);
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
/deep/.onlyform-box .el-form .el-form-item {
    width: 350px;
    display: inline-block;
    vertical-align: text-top;
}
</style>