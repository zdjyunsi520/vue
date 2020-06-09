<template>
    <el-dialog :modal="false" width="500px" :title="title+'值班记事'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

        <!-- 添加或编辑参数配置对话框 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="起始日期" prop="StartTime">
                        <el-date-picker v-model="form.StartTime" Type="date" placeholder="请选择日期" clearable></el-date-picker>
                    </el-form-item>

                    <el-form-item label="完成日期" prop="EndTime">
                        <el-date-picker v-model="form.EndTime" Type="date" placeholder="请选择日期" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="用电单位" prop="TenantId">
                        <el-select v-model="form.TenantId" @change="hanldeChange">
                            <el-option label="请选择" value></el-option>
                            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人" prop="ContactPerson">
                        <el-input v-model="form.ContactPerson" placeholder="请输入联系人" />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="PhoneNo">
                        <el-input v-model="form.PhoneNo" placeholder="请输入联系电话" />
                    </el-form-item>
                    <el-form-item label="记事类型" prop="Type">
                        <el-select v-model="form.Type">
                            <el-option label="请选择" value></el-option>
                            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in recordType" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导入下一班" prop="IsSucceed">
                        <el-select v-model="form.IsSucceed">
                            <el-option label="请选择" value></el-option>
                            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in rwType" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="记事内容" prop="RecordContent">
                        <el-input Type="textarea" :rows="5" v-model="form.RecordContent" placeholder="请输入记事内容" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button Type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
            <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
        <!-- 添加或编辑参数配置对话框 end -->
    </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { add, update } from "@/api/runningDuty/record/dutyRecord";
import { getInfo } from "@/api/systemManager/organization";
export default {
    data() {
        const rules = {
            StartTime: [
                {
                    required: true,
                    message: "请选择起始日期",
                    trigger: "blur"
                }
            ],
            EndTime: [
                {
                    required: true,
                    message: "请选择完成日期",
                    trigger: "blur"
                }
            ],
            TenantId: [
                {
                    required: true,
                    message: "请选择用电单位",
                    trigger: "blur"
                }
            ],
            Type: [
                {
                    required: true,
                    message: "请选择记事类型",
                    trigger: "blur"
                }
            ],
            IsSucceed: [
                {
                    required: true,
                    message: "请输入导入下一班",
                    trigger: "blur"
                }
            ]
        };
        return {
            form: {},
            rules,
            dialogVisible: false,
            loading: false,
            title: ""
        };
    },
    created() {},
    computed: {
        ...mapGetters({
            companyType: "status/companyType",
            recordType: "status/recordType",
            rwType: "status/rwType",
            UserId: "userId"
        })
    },
    methods: {
        hanldeChange() {
            console.log("hanldeChange");
            getInfo({ Id: this.form.TenantId }).then(r => {
                this.form.ContactPerson = r.data.ContactPerson;
                this.form.PhoneNo = r.data.PhoneNo;
            });
        },
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    Id: "",
                    StartTime: "",
                    EndTime: "",
                    TenantId: "",
                    ContactPerson: "",
                    PhoneNo: "",
                    Type: "",
                    RecordContent: "",
                    IsSucceed: true,
                    UserId: this.UserId
                },
                data
            );
        },
        handleOpen(data) {
            //改变窗口状态
            this.dialogVisible = !this.dialogVisible;
            if (!this.dialogVisible) {
                //关闭窗口时取消按钮转圈圈
                this.loading = false;
                this.$refs.form.clearValidate();
            }
            //表单重置
            this.reset(data);
        },
        /** 提交按钮 */
        handleSubmit: function() {
            this.form.tenantname = "asdasd";
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    const fn = this.form.Id ? update : add;
                    fn(this.form)
                        .then(response => {
                            var txt = this.form.id
                                ? "编辑成功！"
                                : "新增成功！";
                            this.$message.success(txt);
                            this.$emit("getList");
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
/deep/.el-select {
    width: 100%;
}
</style>