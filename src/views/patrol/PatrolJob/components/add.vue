<template>
    <div class="app-container">
        <div class="search-box onlyform-box">
            <p class="form-smtitle">{{title}} </p>

            <el-scrollbar>
                <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="140px" style="width:115%;max-width:600px;">
                    <el-form-item label="巡视单位" prop="tenantId">
                        <el-select v-model="form.tenantId" placeholder="请选择巡视单位" @change="handleChangeTenantId">
                            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址" prop="patroladdress">
                        <el-input v-model="form.patroladdress" placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactusername">
                        <el-input v-model="form.contactusername" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="contactphone">
                        <el-input v-model="form.contactphone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="巡视日期" prop="patroltime">
                        <el-date-picker v-model="form.patroltime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="巡视人员" prop="patroluserid">
                        <el-select v-model="form.patroluserid" placeholder="请选择巡视人员">
                            <el-option v-for="(item,index) in patrolusers" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="巡视人员联系电话" prop="patroluserphone">
                        <el-input v-model="form.patroluserphone"></el-input>
                    </el-form-item>
                    <el-form-item label="巡视成员" prop="patrolmemberids">
                        <el-select v-model="patrolmemberids" placeholder="请选择巡视成员" multiple>
                            <el-option v-for="(item,index) in patrolusers" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="巡视内容" prop="patrolscope">
                        <el-input type="textarea" :rows="4" placeholder="请输入巡视内容" v-model="form.patrolscope"></el-input>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <el-col :span="24" :xs='24' class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary"  @click="handleSubmit" :loading="loading"><svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存</el-button>
                    <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
import { addJob, getInfoJob, updateJob } from "@/api/patrol";
import { getInfo } from "@/api/systemManager/organization";
import { getTenantEmployees } from "@/api/org";
export default {
    data() {
        return {
            form: {},
            rules: {
                tenantId: [{ required: true, message: "请选择巡视单位" }],
                patroluserid: [
                    {
                        required: true,
                        message: "请请选择巡视人员",
                        trigger: "blur"
                    }
                ],
                patroltime: [
                    {
                        required: true,
                        message: "请选择巡视日期",
                        trigger: "blur"
                    }
                ],
                patroladdress: [
                    {
                        pattern: /^.{1,300}$/,
                        required: true,
                        message: "请输入300位以内的内容"
                    }
                ],
                contactusername: [
                    {
                        pattern: /^[A-Za-z\u4e00-\u9fa5]{1,12}$/,
                        required: true,
                        message: "请输入12位以内的汉字或字母",
                        trigger: "blur"
                    }
                ],
                contactphone: [
                    {
                        pattern: /^1\d{10}$/,
                        required: true,
                        message: "请输入正确的手机号"
                    }
                ],
                patrolscope: [
                    {
                        pattern: /^.{1,300}$/,
                        required: true,
                        message: "请输入300位以内的内容"
                    }
                ]
            },
            dialogVisible: false,
            loading: false,
            title: "",
            form: {},
            TenantIds: [],
            allpatrolusers: [],
            once: 2,
            patroluserid: "",
            patrolmemberids: []
        };
    },
    created() {
        this.getTenantEmployees();
        let { data, title, TenantIds } = this.$route.params;
        this.title = title;
        this.TenantIds = TenantIds;

        if (data && data.id) {
            this.getInfoJob(data);
        } else {
            this.reset(data);
        }
    },
    computed: {
        patrolusers() {
            if (this.once) {
                this.once--;
            } else {
                this.form.patroluserid = "";
                this.patrolmemberids = [];
            }
            return this.allpatrolusers
                .filter(v => v.id == this.form.tenantId)
                .map(v => v.childs)[0];
        }
    },
    methods: {
        // 巡视人员
        getTenantEmployees() {
            getTenantEmployees({})
                .then(res => {
                    this.allpatrolusers = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    // PtrolNature: 2,
                    tenantId: "",
                    patroladdress: "",
                    contactusername: "",
                    contactphone: "",
                    patroltime: "",
                    patroluserid: "",
                    patroluserphone: "",
                    patrolmemberids: "",
                    patrolscope: "",
                    id: ""
                },
                data
            );
        },
        getInfoJob({ id }) {
            this.loading = true;
            getInfoJob({ id })
                .then(res => {
                    const row = res.data;
                    const tenantId = row.TenantId;
                    const patroladdress = row.PatrolAddress;
                    const contactusername = row.ContactUserName;
                    const contactphone = row.ContactPhone;
                    const patroltime = row.PatrolTime;
                    const patroluserid = row.PatrolUserId;
                    const patroluserphone = row.PatrolUserPhone;
                    const patrolmemberids = row.PatrolMemberIds;
                    const patrolscope = row.PatrolScope;
                    this.patrolmemberids = patrolmemberids.split(",");
                    const data = {
                        tenantId,
                        patroladdress,
                        contactusername,
                        contactphone,
                        patroltime,
                        patroluserid,
                        patroluserphone,
                        patrolmemberids,
                        patrolscope
                    };
                    this.reset(data);
                })
                .finally(v => (this.loading = false));
        },
        // 获取单位的信息：电话地址联系人
        handleChangeTenantId() {
            const id = this.form.tenantId;
            getInfo({ id }).then(res => {
                this.form.patroladdress = res.data.Address;
                this.form.contactusername = res.data.ContactPerson;
                this.form.contactphone = res.data.MobilePhone;
            });
        },

        handleOpen(data) {
            this.$router.push({
                name: "/patrol/PatrolJob/index",
                params: {}
            });
        },
        /** 提交按钮 */
        handleSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    //按钮转圈圈
                    this.loading = true;
                    let fn;
                    if (this.form.id) fn = updateJob;
                    else fn = addJob;
                    this.form.patrolmemberids = this.patrolmemberids.join(",");
                    fn(this.form)
                        .then(response => {
                            //消息提示
                            var txt = this.form.id
                                ? "编辑成功！"
                                : "新增成功！";
                            this.$message.success(txt);
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
/deep/.el-select {
    width: 100%;
}
</style>