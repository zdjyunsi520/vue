<template>
    <div class="app-container">
        <div class="search-box marginbottom15">
            <el-form :inline="true">
                <el-form-item>
                    <!-- <el-button type="primary" icon="el-icon-search"  @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
                    <el-dropdown @command="handleCommand">
                        <el-button type="primary" icon=" el-icon-circle-plus-outline">
                            新增<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">省份</el-dropdown-item>
                            <el-dropdown-item command="b">城市</el-dropdown-item>
                            <el-dropdown-item command="c">区域/县</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" plain @click="handleUpdate" :disabled="!currentNode[this.nodeKey]">
                        <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
                    </el-button>
                    <el-button type="info" icon="el-icon-delete" plain @click="handleDelete" :disabled="!currentNode[this.nodeKey]">删除</el-button>
                </el-form-item>
            </el-form>
        </div>

        <commonTree :nodeKey="nodeKey" :expandKeys="expandKeys" :expandAll="false" :dataList="dataList" :loading="loading" @getInfo="getInfo" :currentNode="currentNode" :needToScroll="needToScroll">
            <div class="form-smtitle marginBottom30">基础信息 </div>
            <el-form label-position="top" :model="smform" v-if="data&&data.Key">
                <el-form-item label="代码">
                    <el-input v-model="smform.Key" disabled></el-input>
                </el-form-item>
                <el-form-item label="父级地区代码" v-if="smform.ParentKey">
                    <el-input v-model="smform.ParentKey" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="smform.Name" disabled></el-input>
                </el-form-item>
                <!-- <el-form-item>
              <el-form-item label="类型">
                <el-input v-model="smform.Type" disabled></el-input>
              </el-form-item>
            </el-form-item> -->
                <el-form-item label="邮编">
                    <el-input v-model="smform.ZipCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="路径">
                    <el-input v-model="smform.Location" disabled></el-input>
                </el-form-item>
            </el-form>
            <div v-else class="tips">
                请稍后...
            </div>
        </commonTree>

    </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/area";
import commonTree from "@/views/commonManager/commonTree/area";
export default {
    components: { commonTree },
    data() {
        return {
            // 遮罩层
            loading: true,
            dataList: [],
            // 搜索参数
            queryParams: {
                menuName: undefined,
                visible: undefined
            },
            defaultProps: {
                children: "childs",
                label: "text"
            },
            addClass: true,
            addId: "",
            operateId: "",
            data: {},
            level: "",
            smform: {},
            currentNode: {},
            needToScroll: 1,
            expandKeys: [],
            nodeKey: "key"
        };
    },
    created() {
        const { data } = this.$route.params;
        this.currentNode = data || {};
        if (this.currentNode[this.nodeKey])
            this.expandKeys = [this.currentNode[this.nodeKey]];
        this.getList();
    },
    methods: {
        handleCommand(commond) {
            if (commond == "a") {
                this.handleAdd();
            } else if (commond == "b") {
                this.handleAddCity();
            } else if (commond == "c") {
                this.handleAddDistract();
            }
        },
        /** 搜索菜单列表 */
        getList() {
            this.loading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.dataList = response.data.map(v => {
                        v.lvl = true;
                        v.Type = 1;
                        return v;
                    });
                })
                .finally(v => (this.loading = false));
        },
        getInfo(node) {
            this.currentNode = node;
            const { key } = this.currentNode;
            getInfo({ key }).then(r => {
                this.data = Object.assign({}, r.data);
                this.smform = Object.assign({}, r.data);
                this.smform.Type =
                    this.smform.Type == 1
                        ? "省级"
                        : this.smform.Type == 2
                        ? "市级"
                        : "区/县";
            });
        },

        handleNodeClick(obj, node, obj2) {
            this.operateId = obj.key;
            this.level = node.level;
            this.getInfo();
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 新增按钮操作 */
        handleAdd() {
            const dataList = this.dataList;
            const hascity = false;
            const hasprovince = false;
            const title = "省份";
            this.$router.push({
                name: "/commonManager/area/components/add",
                params: { dataList, hascity, hasprovince, title }
            });
        },
        handleAddCity() {
            const dataList = this.dataList;
            const hasprovince = true;
            const hascity = false;
            const title = "城市";
            // const p_parentKey = this.currentNode.id;
            const p_parentKey = "";
            const data = { p_parentKey };
            this.$router.push({
                name: "/commonManager/area/components/add",
                params: { data, dataList, hascity, hasprovince, title }
            });
        },
        handleAddDistract() {
            const dataList = this.dataList;
            const hasprovince = true;
            const hascity = true;
            const title = "区域/县";
            let p_parentKey = "";
            let parentKey = "";
            let citydataList = [];
            // if (this.level == 1) {
            //   p_parentKey = this.currentNode.id;
            // } else if (this.level == 2) {
            //   for (let j = 0; j < this.dataList.length; j++) {
            //     const ele = this.dataList[j];
            //     if (ele.childs) {
            //       for (let i = 0; i < ele.childs.length; i++) {
            //         const ele_i = ele.childs[i];
            //         if (ele_i.key == this.operateId) {
            //           p_parentKey = ele.key;
            //           citydataList = ele.childs;
            //         }
            //       }
            //     }
            //   }
            //   parentKey = this.operateId;
            // }

            const data = { p_parentKey, parentKey };
            const params = {
                data,
                dataList,
                hascity,
                hasprovince,
                title,
                citydataList
            };

            this.$router.push({
                name: "/commonManager/area/components/add",
                params
            });
        },
        handleAddClass(num) {
            const target = this.$refs.add;
            if (num == "b") {
                target.hasprovince = true;
                target.hascity = false;
                if (this.level == 1) {
                    const p_parentKey = this.currentNode.id;
                    target.handleOpen({ p_parentKey });
                } else {
                    target.handleOpen();
                }
                target.title = "城市";
            } else {
                const parentKey = this.currentNode.id;
                let p_parentKey = "";
                target.hascity = true;
                target.hasprovince = true;
                for (let j = 0; j < this.dataList.length; j++) {
                    const ele = this.dataList[j];
                    if (ele.childs) {
                        for (let i = 0; i < ele.childs.length; i++) {
                            const ele_i = ele.childs[i];
                            if (ele_i.key == this.currentNode.id) {
                                p_parentKey = ele.key;
                                target.citydataList = ele.childs;
                            }
                        }
                    }
                }
                if (this.level == 2) {
                    target.handleOpen({ parentKey, p_parentKey });
                } else {
                    target.handleOpen();
                }
                target.title = "区域/县";
            }
            target.dataList = this.dataList;
        },
        /** 编辑按钮操作 */
        handleUpdate() {
            let target;
            let data,
                url,
                name,
                key,
                type,
                sortindex,
                parentKey,
                p_parentKey,
                zipCode;
            name = this.data.Name;
            type = this.data.Type;
            url = this.data.Location;
            key = this.data.Key;
            zipCode = this.data.ZipCode;
            sortindex = "";
            let citydataList = [];
            if (type == 2) {
                p_parentKey = this.data.ParentKey;
            } else if (type == 3) {
                for (let j = 0; j < this.dataList.length; j++) {
                    const ele = this.dataList[j];
                    if (ele.childs) {
                        for (let i = 0; i < ele.childs.length; i++) {
                            const ele_i = ele.childs[i];
                            if (ele_i.key == this.data.ParentKey) {
                                p_parentKey = ele.key;
                                parentKey = this.data.ParentKey;
                                citydataList = ele.childs;
                            }
                        }
                    }
                }
            }

            data = {
                url,
                key,
                name,
                type,
                parentKey,
                p_parentKey,
                zipCode,
                sortindex
            };
            const title = "编辑地区信息";
            const dataList = this.dataList;
            this.$router.push({
                name: "/commonManager/area/components/update",
                params: {
                    data,
                    title,
                    dataList,
                    citydataList
                }
            });
        },

        /** 删除按钮操作 */
        handleDelete() {
            this.$confirm("是否确认删除选中的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(v => {
                const key = this.currentNode[this.nodeKey];
                deleted({ key }).then(r => {
                    this.$message.success("删除成功！");
                    this.currentNode = {};
                    this.needToScroll++;
                    this.getList();
                });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>