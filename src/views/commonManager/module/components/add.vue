<template>
    <div class="app-container">
        <div class="search-box  onlyform-box">
            <p class="form-smtitle">{{title}} </p>
            <el-scrollbar>
                <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="120px" :inline-message="true">
                    <el-col>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入名称" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label="权限标识" prop="key">
                                <el-input v-model="form.key" placeholder="请输入权限标识" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col>

                        <el-col :span='12' :xs='24'>
                            <el-form-item label="url" prop="url">
                                <el-input v-model="form.url" placeholder="请输入url" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label="组件" prop="component">
                                <el-input v-model="form.component" placeholder="请输入组件" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label="排序号" prop="sortindex">
                                <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
                            </el-form-item>
                        </el-col>
                    </el-col>

                    <!-- <el-form-item label="应用图标">
            <el-popover placement="bottom-start" width="500" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.iconurl" placeholder="点击选择图标" readonly>
                <svg-icon v-if="form.iconurl" slot="prefix" :icon-class="form.iconurl" class="el-input__icon" style="height: 32px;width: 16px;" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item> -->

                    <el-col>
                    <el-col :span='22' :xs='24'>
                        <el-form-item label="应用图标">
                            <IconSelect ref="iconSelect" @selected="selected" />
                        </el-form-item>
                    </el-col>
                    </el-col>
                </el-form>
            </el-scrollbar>
            <el-col :span="24" :xs='24' class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
                    <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
                </div>
            </el-col>

        </div>
    </div>
</template>

<script>
import { add, update } from "@/api/commonManager/module";
import IconSelect from "@/components/IconSelect";
export default {
    components: { IconSelect },
    data() {
        const rules = {
            name: [
                {
                    required: true,
                    message: "输入有误",
                    trigger: "blur"
                }
            ],
            key: [
                {
                    required: true,
                    message: "输入有误",
                    trigger: "blur"
                }
            ],
            url: [
                {
                    required: true,
                    message: "输入有误",
                    trigger: "blur"
                }
            ],

            sortindex: [
                {
                    required: true,
                    message: "'输入有误",
                    trigger: "blur"
                }
            ],
            phonenumber: [
                {
                    pattern: /^1\d{10}$/,
                    message: "请输入正确的手机号码",
                    trigger: "blur"
                }
            ]
        };
        return {
            form: {},
            rules,
            dialogVisible: false,
            loading: false,
            title: "",
            // 角色选项
            roleOptions: [],
            deptType: ""
        };
    },
    mounted() {
        let { data, title } = this.$route.params;
        this.title = title;
        this.reset(data);
    },

    computed: {},
    methods: {
        selected(name) {
            this.form.iconurl = name;
        },
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    id: "",
                    url: "",
                    name: "",
                    key: "",
                    type: 1,
                    component: "",
                    iconurl: "",
                    sortindex: 1
                },
                data
            );
            this.$refs.iconSelect.name = this.form.iconurl;
        },
        handleOpen() {
            const data = this.form;
            this.$router.push({
                name: "/commonManager/module/index",
                params: { data }
            });
        },
        /** 提交按钮 */
        handleSubmit: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    //按钮转圈圈
                    this.loading = true;
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

                            this.form.id = response.data.Id;
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
</style>