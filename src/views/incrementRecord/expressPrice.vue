<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header">韵达信封</div>
            <div class="text item">
                总共：{{yunda.total_num}} 次
            </div>
            <div class="text item">
                已用：{{yunda.used_num}} 次
            </div>
            <div class="text item">
                剩余：{{yunda.remain_num}} 次
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header">快递空包</div>
            <div class="text item">
                余额：{{amount}}
            </div>

        </el-card>
        <el-card class="box-card">
            <div slot="header">礼品包</div>
            <div class="text item">
                余额：{{jpCount}}
            </div>

        </el-card>
        <el-button type="primary" @click="getList">刷新</el-button>
        <el-table v-loading="listLoading" :data="postList" border width="50%">
            <el-table-column label="快递类型" align="center" prop="logiType" :formatter="filterLogi" />
            <el-table-column label="平台类型" align="center" prop="platformType" :formatter="filterPlatform" />
            <el-table-column label="价格" align="center" prop="price" />
        </el-table>

    </div>
</template>

<script>
import {
    expressCount as fetchList,
    YundaCount,
    jpCount
} from "@/api/incrementRecord";
const logiType = [
    { key: 1, value: "百世" },
    { key: 2, value: "圆通" },
    { key: 3, value: "信封" }
];

const platformType = [
    { key: 1, value: "淘宝" },
    { key: 2, value: "拼多多" },
    { key: 3, value: "京东" },
    { key: 4, value: "苏宁" }
];
const logiKV = logiType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});
const platformKV = platformType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});
export default {
    data() {
        return {
            // 遮罩层
            listLoading: false,
            // 岗位表格数据
            postList: [],
            amount: 0,
            yunda: {
                total_num: 0,
                used_num: 0,
                remain_num: 0
            },
            jpCount: 0
        };
    },
    created() {
        this.getList();
    },

    watch: {},
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            let queryCount = 0;
            fetchList(this.queryParams)
                .then(response => {
                    const data = JSON.parse(response.data.replace('\\"', ""))
                        .result;
                    this.amount = data.amount;
                    this.postList = data.priceDetails;
                })
                .finally(e => {
                    if (queryCount > 0) this.listLoading = false;
                    queryCount++;
                });
            YundaCount()
                .then(r => {
                    const data = r.data.response[0];
                    if (data) {
                        Object.assign(this.yunda, data);
                    }
                })
                .finally(r => {
                    if (queryCount > 0) this.listLoading = false;
                    queryCount++;
                });
            jpCount().then(r => {
                this.jpCount = r.data;
            });
        },
        filterLogi(row) {
            return logiKV[row.logiType];
        },
        filterPlatform(row) {
            return platformKV[row.platformType];
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/.cell {
    text-align: center;
}
/deep/.el-card,
/deep/.el-button {
    margin-bottom: 20px;
}
</style>
