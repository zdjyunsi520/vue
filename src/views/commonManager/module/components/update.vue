<template>
    <div class="app-container">
        <div class="search-box onlyform-box">
            <p class="form-smtitle">{{title}} </p>
            <el-scrollbar>
                <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

                    <el-form-item label="父级分类" prop="parentId">
                        <el-select v-model="form.parentId" clearable>
                            <el-option :key="item.id" :label="item.text" :value="item.id" v-for="item in dataList" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入名称" />
                    </el-form-item>

                    <el-form-item label="权限标识" prop="key">
                        <el-input v-model="form.key" placeholder="请输入权限标识" />
                    </el-form-item>

                    <el-form-item label="Url" prop="url">
                        <el-input v-model="form.url" placeholder="请输入url" />
                    </el-form-item>

                    <el-form-item label="组件" prop="component">
                        <el-input v-model="form.component" placeholder="请输入组件" />
                    </el-form-item>

                    <el-form-item label="排序号" prop="sortindex">
                        <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
                    </el-form-item>

                </el-form>
            </el-scrollbar>
            <el-col :span="24" :xs='24' class="absolute-bottom">
                <div class="form-footer">
                    <el-button type="primary" @click="handleSubmit" :loading="loading"><svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存</el-button>
                    <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
import { add, update } from "@/api/commonManager/module";
export default {
    data() {
        const rules = {
            parentId: [
                {
                    required: true,
                    message: "请选择父级分类",
                    trigger: "blur"
                }
            ],
            name: [
                {
                    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
                    required: true,
                    message: "请输入12位以内的汉字或数字或字母",
                    trigger: "blur"
                }
            ],
            key: [
                {
                    pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
                    required: true,
                    message: "请输入18位以内的数字或字母或特殊符号",
                    trigger: "blur"
                }
            ],
            url: [
                {
                    pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
                    required: true,
                    message: "请输入18位以内的数字或字母或特殊符号",
                    trigger: "blur"
                }
            ],

            sortindex: [
                {
                    pattern: /^\d{1,4}$/,
                    required: true,
                    message: "请输入4位以内的整数"
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
            deptType: "",
            dataList: []
        };
    },
    created() {
        let { data, dataList, title } = this.$route.params;
        this.reset(data);
        this.dataList = dataList;
        this.title = title;
    },
    computed: {},
    methods: {
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    id: "",
                    url: "",
                    name: "",
                    key: "",
                    type: 2,
                    iconurl: "",
                    component: "",
                    sortindex: 1,
                    parentId: ""
                },
                data
            );
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
                            this.form.id = response.data.id;
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