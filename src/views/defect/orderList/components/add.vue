<template>
    <div class="app-container">
        <div class="search-box onlyform-box" style="padding-bottom: 150px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="登记情况" name="add"></el-tab-pane>
                <el-tab-pane label="消缺情况" name="repair" v-if="(!ReadOnly&&form1.Status>1)||(ReadOnly&&form1.Status>2)"></el-tab-pane>
                <el-tab-pane label="验收情况" name="backFile" v-if="(!ReadOnly&&form1.Status>2)||(ReadOnly&&form1.Status>3)"></el-tab-pane>
            </el-tabs>
            <el-scrollbar class="marginright-fx">
                <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="80px">
                    <el-row>
                        <el-form-item label="用电单位" prop="TenantId">
                            <el-select :disabled="disabled" v-model="form.TenantId" placeholder="请选择用电单位" @change="changeTenant">
                                <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="缺陷设备" prop="AssetsId">
                            <TreeSelect showText="text" :mutiple="false" :getCheckedNodes="false" :data="assetsTree" @change="handleConfirm1" :checkedKeys="ChargePersonId1" :disabled="disabled" />
                            <!-- <el-input :disabled="disabled" v-model="form.assetsIdtext" placeholder="请选择设备" auto-complete="off" @focus="getAssets" /> -->
                        </el-form-item>
                    </el-row>
                    <el-row>

                        <el-form-item label="缺陷等级" prop="Rank">
                            <el-select :disabled="disabled" v-model="form.Rank" placeholder="请选择设备" @change="changeTime">
                                <el-option v-for="(item,index) in Ranks" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>

                        <el-form-item label="发现人" prop="Detecter">
                            <el-input :disabled="disabled" v-model="form.Detecter" placeholder="请输入发现人" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="发现时间" prop="DetectTime">
                            <el-date-picker :disabled="disabled" v-model="form.DetectTime" type="datetime" placeholder="请选择发现时间" @change="changeTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="安排消缺人" prop="ProcessorId" label-width="100px">
                            <TreeSelect showText="text" :mutiple="false" :data="ProcessorIds" @change="handleConfirm" :checkedKeys="ChargePersonId" :disabled="disabled" />
                            <!-- <el-select v-model="form.ProcessorId" placeholder="请选择消缺人">
                  <el-option v-for="(item,index) in ProcessorIds" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select> -->
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="处理期限" prop="ProcessDue">
                            <el-date-picker :disabled="disabled" v-model="form.ProcessDue" type="datetime" placeholder="请选择处理期限" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="缺陷内容" prop="Description">
                            <el-input :disabled="disabled" v-model="form.Description" type="textarea" :rows="5" placeholder="请输入缺陷内容" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="附件" prop="AttachmentKey" class='xswidth'>
                            <el-upload :disabled="disabled" :file-list="imageUrl" action="http://apicommont.xtioe.com/File/Upload" :data="{Token:token,filekey:'patroljob'}" :headers="{methods:'post'}" list-type="picture-card" ref="upload" accept=".jpg,.jpeg,.png" :on-success="handleAvatarSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                            </el-upload>

                            <el-dialog :visible.sync="dialogVisible" size="tiny">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>

                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.Id">
                        <el-form-item label="缺陷编号" prop="No">
                            <el-input v-model="form.No" disabled placeholder="自动生成" />
                        </el-form-item>
                        <el-form-item label="填报单位" prop="ReportTenantName">
                            <el-input v-model="form.ReportTenantName" disabled />
                        </el-form-item>

                    </el-row>
                    <el-row>
                        <el-form-item label="填报人" prop="Reporter">
                            <el-input v-model="form.Reporter" disabled />
                        </el-form-item>

                        <el-form-item label="填报时间" prop="ReportTime">
                            <el-date-picker v-model="form.ReportTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" disabled format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-row>
                </el-form>

            </el-scrollbar>
            <el-col :span="24" :xs="24" class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary" @click="handleSubmit" :loading="loading1" v-if="form1.Status<2&&!ReadOnly">
                        <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
                    </el-button>
                    <el-button type="primary" icon="el-icon-s-promotion" @click="handleSend" :loading="loading" v-if="form1.Status<2&&!ReadOnly">发 送</el-button>
                    <!-- <el-button type="primary" icon="el-icon-s-release" v-else @click="handleBack" :loading="loading">回 退</el-button> -->
                    <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
                </div>
            </el-col>

        </div>
    </div>
</template>

<script>
import {
    add,
    getInfo,
    update,
    imageUpload,
    senderOrder,
    getAssetsTenant
} from "@/api/biz";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";
import { getChildrenList } from "@/api/org";
import TreeSelect from "@/views/components/TreeSelect";
export default {
    components: { TreeSelect },
    data() {
        const rules = {
            TenantId: [
                {
                    required: true,
                    message: "用电单位不能为空",
                    trigger: "change"
                }
            ],
            AssetsId: [
                {
                    required: true,
                    message: "设备不能为空",
                    trigger: "change"
                }
            ],
            Rank: [
                {
                    required: true,
                    message: "缺陷等级不能为空",
                    trigger: "change"
                }
            ],

            Detecter: [
                {
                    pattern: /^[A-Za-z\u4e00-\u9fa5]{1,12}$/,
                    required: true,
                    message: "请输入12位以内的汉字或字母",
                    trigger: "blur"
                }
            ],
            DetectTime: [
                {
                    required: true,
                    message: "发现时间不能为空",
                    trigger: "change"
                }
            ],
            ProcessorId: [
                {
                    required: true,
                    message: "消缺人不能为空",
                    trigger: "change"
                }
            ],
            ProcessDue: [
                {
                    required: true,
                    message: "处理期限不能为空",
                    trigger: "change"
                }
            ],
            Description: [
                {
                    pattern: /^[\s\S]{1,300}$/,
                    required: true,
                    message: "请输入300位以内的内容"
                }
            ]
        };
        return {
            form: {},
            form1: {
                Status: 1
            },
            rules,
            dialogVisible: false,
            loading: false,
            loading1: false,
            title: "",
            deptType: "",
            AssetsIdss: [],
            ProcessorIds: [],
            defaultProps: {
                children: "childs",
                label: "text"
            },
            Ranks: [
                { name: "一般缺陷", id: 1 },
                { name: "紧急缺陷", id: 2 },
                { name: "严重缺陷", id: 3 }
            ],
            TenantIds: [],
            imageUrl: [],
            dialogImageUrl: "",
            dialogVisible: false,
            dialogAssetsVisible: false,
            dialogEmployeesVisible: false,
            // assetsTree: [],
            allassetsTree: [],
            processorTree: [],
            allpatrolusers: [],
            employeesTree: [],
            ischange: false,
            count: 0,
            selectAssets: [],
            activeName: "add",
            ChargePersonId: [],
            ChargePersonId1: [],
            ReadOnly: false,
            Id: ""
        };
    },
    computed: {
        ...mapGetters(["name", "userId", "token"]),
        disabled() {
            return this.form1.Status > 1 || this.ReadOnly;
        },
        assetsTree() {
            const list = this.TenantIds.filter(
                v => v.id == this.form.TenantId
            )[0];
            return list ? list.childs : [];
        }
    },

    created() {
        let { Id, ReadOnly } = this.$route.params;
        this.Id = Id;
        this.ReadOnly = ReadOnly;
        this.getInfo();
        this.getTenants();
        this.getTenantEmployees();
        this.getAssets();
    },
    methods: {
        getInfo() {
            if (this.Id) {
                this.loading = true;
                const Id = this.Id;
                getInfo({ Id })
                    .then(res => {
                        this.form1 = Object.assign({}, res.data);
                        this.reset(res.data);
                    })
                    .finally(v => (this.loading = false));
            } else {
                this.reset();
            }
        },
        handleClick(a) {
            const Id = this.Id;
            const ReadOnly = this.ReadOnly;
            this.$router.push({
                name: "/defect/orderList/components/" + a.name,
                params: { Id, ReadOnly }
            });
        },
        handleConfirm(data) {
            this.ChargePersonId = data.map(v => v.id);
            this.form.ProcessorId = this.ChargePersonId.join(",");
            this.$refs.form.clearValidate("ProcessorId");
        },
        handleConfirm1(data) {
            this.ChargePersonId1 = data.map(v => v.id);
            this.form.AssetsId = this.ChargePersonId1.join(",");
            this.$refs.form.clearValidate("AssetsId");
        },
        // 巡视单位列表
        getTenants() {
            getAssetsTenant().then(res => {
                this.TenantIds = res.data;
            });
        },
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
                if (this.form.TenantId) this.getProcessor();
            });
        },
        changeTenant() {
            this.ischange = true;
            this.getProcessor();
        },
        // 消缺人下拉
        getProcessor() {
            if (this.ischange) {
                this.form.ProcessorId = "";
            }
            this.allpatrolusers.forEach(v => {
                if (v.id == this.form.TenantId) {
                    this.ProcessorIds = v.childs;
                }
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
                this.form.AssetsId = arr[0].id;
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
            var d = new Date(this.form.DetectTime);
            var dtime;
            if (this.form.Rank == 1) {
                dtime = d.setMonth(d.getMonth() + 6);
            } else if (this.form.Rank == 2) {
                dtime = d.setMonth(d.getMonth() + 1);
            } else {
                dtime = d.setDate(d.getDate() + 1);
            }
            this.form.ProcessDue = d;
        },
        // 表单重置
        reset(data) {
            const now = Date.now();
            var nowTime = new Date(now);
            var ProcessDueTime = new Date(now);
            ProcessDueTime.setMonth(ProcessDueTime.getMonth() + 6);
            this.form = Object.assign(
                {
                    Id: "",
                    TenantId: "",
                    AssetsId: "",
                    Rank: 1,
                    Detecter: "",
                    DetectTime: nowTime,
                    ProcessorId: "",
                    ProcessDue: ProcessDueTime,
                    Description: "",
                    AttachmentKey: "",
                    AttachmentUrl: "",
                    ReporterId: this.userId,
                    ReportTime: nowTime,
                    Status: 1
                },
                data
            );
            if (this.form.ProcessorId)
                this.ChargePersonId = this.form.ProcessorId.split(",");
            if (this.form.AssetsId)
                this.ChargePersonId1 = this.form.AssetsId.split(",");
            if (this.form.AttachmentUrl)
                this.imageUrl = this.form.AttachmentUrl.split(",").map(v => {
                    return {
                        name: v,
                        url: "http://admint.xtioe.com" + v,
                        uid: v
                    };
                });
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            });
        },
        handleOpen(data) {
            this.$router.push({
                name: "/defect/orderList/index",
                params: {}
            });
        },
        // 回退
        handleBack() {},
        // 发送
        handleSend() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    let fn;
                    let { Id } = this.form;
                    let form = {};
                    if (this.form.Id) {
                        fn = update;
                        form.Id = this.form.Id;
                    } else {
                        fn = add;
                    }
                    form.TenantId = this.form.TenantId;
                    form.AssetsId = this.form.AssetsId;
                    form.Rank = this.form.Rank;
                    form.Description = this.form.Description;

                    form.Detecter = this.form.Detecter;
                    form.DetectTime = this.form.DetectTime;
                    form.ProcessorId = this.form.ProcessorId;
                    form.ProcessorPhone = this.form.ProcessorPhone;
                    form.ProcessDue = this.form.ProcessDue;
                    form.AttachmentKey = this.form.AttachmentKey;
                    form.AttachmentUrl = this.imageUrl
                        .map(v => v.uid)
                        .join(",");

                    fn(form)
                        .then(res => {
                            Id = Id ? Id : res.data.Id;
                            senderOrder({ Id })
                                .then(r => {
                                    this.$message.success("发送成功");
                                    this.handleOpen();
                                })
                                .catch(e => (this.loading = false));
                        })
                        .catch(r => {
                            //取消按钮转圈圈
                            this.loading = false;
                        });
                }
            });
        },
        /** 提交按钮 */
        handleSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading1 = true;
                    let fn;
                    let form = {};
                    if (this.form.Id) {
                        fn = update;
                        form.Id = this.form.Id;
                    } else {
                        fn = add;
                    }
                    form.TenantId = this.form.TenantId;
                    form.AssetsId = this.form.AssetsId;
                    form.Rank = this.form.Rank;
                    form.Description = this.form.Description;

                    form.Detecter = this.form.Detecter;
                    form.DetectTime = this.form.DetectTime;
                    form.ProcessorId = this.form.ProcessorId;
                    form.ProcessorPhone = this.form.ProcessorPhone;
                    form.ProcessDue = this.form.ProcessDue;
                    form.AttachmentKey = this.form.AttachmentKey;
                    form.AttachmentUrl = this.imageUrl
                        .map(v => v.uid)
                        .join(",");
                    fn(form)
                        .then(res => {
                            //消息提示
                            var txt = this.form.Id
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
                            this.loading1 = false;
                        });
                }
            });
        },
        // 附件上传成功
        handleAvatarSuccess(res, file, fileList) {
            file.uid = res.data.FileUrls[0].Url;
            this.form.AttachmentKey = res.data.AttachmentKey;
            this.imageUrl = fileList;
        },
        // 删除附件
        handleRemove(file, fileList) {
            //fileList.splice( fileList.findIndex(v=>v.uid=file.uid),1)
            this.imageUrl = fileList;
        },
        // 预览附件
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 附件上传之前判断大小
        beforeAvatarUpload(file) {
            let fd = new FormData();
            fd.append("filekey", file);
            imageUpload(fd).then(r => {
                this.form.AttachmentKey = r.data.AttachmentKey;
                const fileReader = new FileReader();
                fileReader.onload = e => {
                    this.imageUrl.push({ src: e.target.result, uid: file.uid });
                };
                fileReader.readAsDataURL(file);
            });
            return false;
            // const isJPG = file.type === "image/jpeg";
            // const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPG) {
            //   this.$message.error("上传图片只能是 JPG 格式!");
            // }
            // if (!isLt2M) {
            //   this.$message.error("上传图片大小不能超过 2MB!");
            // }
            // return isJPG && isLt2M;
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
.xswidth {
    width: 800px !important;
}

@media screen and (max-width: 768px) {
    .xswidth {
        width: auto !important;
    }
}
</style>