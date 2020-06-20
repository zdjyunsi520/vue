<template>
    <div class="app-container">
        <div class="search-box onlyform-box">
            <p class="form-smtitle">角色信息</p>
            <el-scrollbar>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-row>
                        <el-col>
                            <el-col :span="8" :xs="24">
                                <el-form-item label="角色" prop="Name">
                                    <el-input v-model="form.Name" placeholder="请输入角色" />
                                </el-form-item>
                            </el-col>

                        </el-col>
                        <el-col>
                            <el-col :span="8" :xs="24">
                                <el-form-item label="所属角色类型" prop="charatypeId">
                                    <el-select v-model="form.charatypeId">
                                        <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col>
                            <el-col :span="8" :xs="24">
                                <el-form-item label="最少人数" prop="MinPersonCount">
                                    <el-input-number v-model="form.MinPersonCount" :min="1" :max="99" controls-position="right" />
                                </el-form-item>
                            </el-col>
                            <el-col>
                            </el-col>

                            <el-col :span="8" :xs="24">
                                <el-form-item label="备注" prop="Remark">
                                    <el-input v-model="form.Remark" placeholder="" />
                                </el-form-item>
                            </el-col>
                        </el-col>
                    </el-row>
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/role";
import { fetchCharactorType } from "@/api/runningDuty/dutyConfiguration";
export default {
    data() {
        const rules = {
            Name: [
                {
                    pattern: /^[A-Za-z\u4e00-\u9fa5]{1,12}$/,
                    required: true,
                    message: "请输入12位以内的汉字或字母",
                    trigger: "blur"
                }
            ],
            charatypeId: [
                {
                    required: true,
                    message: "请选择所属角色类型"
                }
            ],
            MinPersonCount: [
                {
                    required: true,
                    message: "请输入2位以内的整数"
                }
            ],
            Remark: [
                {
                    pattern: /^.{1,50}$/,
                    required: false,
                    message: "请输入50位以内的内容"
                }
            ]
        };
        return {
            form: {},
            rules,
            dialogVisible: false,
            loading: false,
            title: "",
            charactorTypeList: []
        };
    },
    created() {
        const { data } = this.$route.params;
        this.reset(data);
        this.getCharactorType();
    },

    methods: {
        getCharactorType() {
            fetchCharactorType({}).then(r => {
                this.charactorTypeList = r.data;
            });
        },

        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    Id: "",
                    Name: "",
                    charatypeId: "",
                    MinPersonCount: 1,
                    Remark: ""
                },
                data
            );
        },

        handleOpen() {
            const charatypeId = this.form.charatypeId;
            this.$router.push({
                name: "/runningDuty/dutyConfiguration/role1/components/index",
                params: { charatypeId }
            });
        },
        /** 提交按钮 */
        handleSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    //按钮转圈圈
                    this.loading = true;
                    const fn = this.form.Id ? update : add;
                    //添加用户
                    fn(this.form)
                        .then(response => {
                            //消息提示
                            var txt = this.form.Id
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

/deep/.el-form-item__error--inline {
    position: absolute;
    top: 50%;
    margin-top: -10px;
    width: 100%;
}

/deep/.largelabel {
    .el-form-item__label {
        width: 180px !important;
    }
    .el-form-item__content {
        margin-left: 180px !important;
    }
}

/deep/.largelabel1 {
    .el-form-item__label {
        width: 140px !important;
    }
    .el-form-item__content {
        margin-left: 140px !important;
    }
}
/deep/.largelabel2 {
    .el-form-item__label {
        width: 140px !important;
    }
    .el-form-item__content {
        margin-left: 140px !important;
    }
}
.avatar {
    width: 100%;
    height: 100%;
}
.avatar-wrap {
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
}
</style>