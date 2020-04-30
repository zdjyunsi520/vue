<template>
    <!-- 添加或修改分站对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" center :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="分站佣金比例" prop="deptCommisionRate">
                        <el-input v-model="form.deptCommisionRate" placeholder="" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="刷手上上上级佣金比例" prop="highestBuyerCommissionRate">
                        <el-input v-model="form.highestBuyerCommissionRate" placeholder="" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="刷手上上级佣金比例" prop="firstBuyerCommissionRate">
                        <el-input v-model="form.firstBuyerCommissionRate" placeholder="" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="刷手上级佣金比例" prop="secondaryBuyerCommissionRate">
                        <el-input v-model="form.secondaryBuyerCommissionRate" placeholder="" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="刷手佣金比例" prop="buyerCommissionRate">
                        <el-input v-model="form.buyerCommissionRate" placeholder="" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="空包邮费加价" prop="emptyParcelPostage">
                        <el-input v-model="form.emptyParcelPostage" placeholder="" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="信封收费加价" prop="envelopeFee">
                        <el-input v-model="form.envelopeFee" placeholder="" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="打标签费用加价" prop="labelFee">
                        <el-input v-model="form.labelFee" placeholder="" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="照妖镜费用加价" prop="mirrorFee">
                        <el-input v-model="form.mirrorFee" placeholder="" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { updateExList as updateDept } from "@/api/system/dept";
import { mapGetters, mapActions } from "vuex";
import { validMoney } from "@/utils/validate";
export default {
    data() {
        const rule = [
            {
                required: true,
                trigger: "blur",
                validator: (rule, value, callback) => {
                    if (validMoney(value)) {
                        callback();
                    } else {
                        callback(new Error("这里输入的不正确"));
                    }
                }
            }
        ];
        return {
            accept: ".jpg,.png,.jpeg",
            show: false,
            goodsImgUrl: "",
            title: "",
            open: false,
            form: {},
            // 表单校验
            rules: {
                deptCommisionRate: rule,
                firstBuyerCommissionRate: rule,
                secondaryBuyerCommissionRate: rule,
                buyerCommissionRate: rule,
                emptyParcelPostage: rule,
                envelopeFee: rule,
                labelFee: rule,
                mirrorFee: rule,
                highestBuyerCommissionRate: rule
            }
        };
    },
    computed: {
        ...mapGetters({ path: "imgOSS/path" })
    },
    methods: {
        ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
        // 表单重置
        reset() {
            this.form = {
                deptId: "",
                deptCommisionRate: "",
                firstBuyerCommissionRate: "",
                secondaryBuyerCommissionRate: "",
                buyerCommissionRate: "",
                emptyParcelPostage: "",
                envelopeFee: "",
                labelFee: "",
                mirrorFee: "",
                highestBuyerCommissionRate: ""
            };
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.deptId != "") {
                        updateDept(this.form).then(response => {
                            if (response.code === 0) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.$emit("getList");
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    } else {
                        addDept(this.form).then(response => {
                            if (response.code === 0) {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.$emit("getList");
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    }
                }
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        uploadOSSIMG(params) {
            const file = params.file;
            const accept = this.accept;
            this.ossUpload({ file, accept })
                .then(r => {
                    this.form.indexLogo = r;
                    this.show = true;
                })
                .catch(e => {
                    e = e || "图片上传失败请重新上传";
                    this.$message.error(e);
                });
        }
    }
};
</script>

<style lang="scss" scoped></style>
