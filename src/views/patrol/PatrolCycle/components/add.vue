<template>
    <div class="app-container">
        <div class="search-box onlyform-box">
            <p class="form-smtitle">{{title}} </p>

            <el-scrollbar>
                <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="110px" style="width:600px">
                    <el-form-item label="巡视单位" prop="tenantid">
                        <el-select v-model="form.tenantid" placeholder="请选择巡视单位" style="width:100%" @change="changeTenant">
                            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="巡视周期(天)" prop="cycleday">
                        <el-input v-model="form.cycleday" placeholder="请输入天数"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="starttime">
                        <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期" style="width:100%"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="巡视人员" prop="patroluserid">
                        <el-select v-model="form.patroluserid" placeholder="请选择巡视人员" style="width:100%">
                            <el-option v-for="(item,index) in patrolusers" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="巡视成员" prop="patrolmemberids">
                        <el-select v-model="patrolmemberids" placeholder="请选择巡视成员" multiple style="width:100%">
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
import { add, update, getInfo } from "@/api/patrol";
import { getTenantEmployees } from "@/api/org";
import { dateFortmat } from "@/utils";
export default {
    data() {
        return {
            form: {},
            rules: {
                tenantid: [
                    {
                        required: true,
                        message: "请选择巡视单位",
                        trigger: "change"
                    }
                ],
                cycleday: [
                    {
                        pattern: /^\d{1,2}$/,
                        required: true,
                        message: "请输入2位以内的整数"
                    }
                ],
                starttime: [
                    {
                        required: true,
                        message: "请选择开始时间",
                        trigger: "change"
                    }
                ],
                patroluserid: [
                    {
                        required: true,
                        message: "请选择巡视人员",
                        trigger: "change"
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
            loading: false,
            title: "",
            form: {},
            TenantIds: [],
            patrolusers: [],
            allpatrolusers: [],
            ischange: false,
            patrolmemberids: []
        };
    },
    created() {
        this.getTenantEmployees();
        let { data, title, TenantIds } = this.$route.params;
        this.title = title;
        this.TenantIds = TenantIds;
        // data.starttime = new Date(data.starttime).getTime();
        if (data && data.patrolmemberids)
            this.patrolmemberids = data.patrolmemberids.split(",");
        this.reset(data);
        return;
        // if (data && data.id) {
        //   this.getInfo(data);
        // } else {

        // }
    },
    methods: {
        // 巡视人员
        getTenantEmployees() {
            getTenantEmployees({})
                .then(res => {
                    this.allpatrolusers = res.data;
                    if (this.form.tenantid) this.getPatrolusers();
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //获取关联的巡视人员下拉列表
        changeTenant() {
            this.ischange = true;
            this.getPatrolusers();
        },
        getPatrolusers() {
            if (this.ischange) {
                this.form.patroluserid = "";
                this.patrolmemberids = [];
            }
            this.allpatrolusers.forEach(v => {
                if (v.id == this.form.tenantid) {
                    this.patrolusers = v.childs;
                }
            });
        },
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    id: "",
                    tenantid: "",
                    cycleday: "",
                    starttime: "",
                    patroluserid: "",
                    patrolmemberids: "",
                    patrolscope: ""
                },
                data
            );
        },
        getInfo(data) {
            this.loading = true;
            if (data) {
                const id = { id: data.id };
                if (id) {
                    getInfo(id)
                        .then(res => {
                            this.form = res.data;
                            this.reset(data);
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
                name: "/patrol/PatrolCycle/index",
                params: {}
            });
        },
        /** 提交按钮 */
        handleSubmit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    //按钮转圈圈
                    this.loading = true;

                    // this.form.id = this.form.Id;
                    // this.form.tenantid = this.form.TenantId;
                    // this.form.cycleday = this.form.CycleDay;
                    // this.form.starttime = dateFortmat(this.form.StartTime, "yyyy-MM-dd");
                    // this.form.patroluserid = this.form.PatrolUserId;
                    // this.form.patrolmemberids = this.form.PatrolMemberIds.split(",");
                    // this.form.patrolscope = this.form.PatrolScope;
                    this.form.patrolmemberids = this.patrolmemberids.join(",");
                    let fn;
                    if (this.form.id) fn = update;
                    else fn = add;
                    fn(this.form)
                        .then(response => {
                            //消息提示
                            var txt = this.form.id
                                ? "编辑成功！"
                                : "新增成功！";
                            this.$message.success(txt);

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