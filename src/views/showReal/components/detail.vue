<template>
    <el-dialog width="80%" title="照妖镜" :visible.sync="dialogVisible" :modal-append-to-body="false" center>
        <el-row v-loading="loading">

            <el-row class="xl-task-row">
                <el-col :span="6">买家：<span>{{ nick }}</span></el-col>
                <el-col :span="12">实名认证：
                    <span class="green">{{nameconform == 1 ? "已实名认证" : "暂无实名认证"}}</span>
                    <span class="gold">{{ sup == 0 ? "普通会员" : "超级会员" }}</span>
                    <span class="gold">{{ level }}</span>
                </el-col>
                <el-col :span="6">买家信誉：<span>{{ buyNum }}</span></el-col>
                <el-col :span="6">注册日期：<span>{{ registDate }}</span></el-col>
                <el-col :span="6">商家信誉：<span class="red">{{sellNum == "" ? "非商家" : sellNum}}</span></el-col>
                <el-col :span="6">淘龄：<span>{{ amoyAge }}</span></el-col>
                <el-col :span="6">性别：<span>{{ gender }}</span></el-col>
                <el-col :span="6">买家总周平均：<span>{{parseFloat(totalWeeklyReview).toFixed(2)}}</span></el-col>
                <el-col :span="6">收到好评率：<span>{{ goodPercent }}</span></el-col>
                <el-col :span="6">发出好评率：<span>{{ goodPercent }}</span></el-col>
                <el-col :span="6">查询时间：<span>{{ dt }}</span></el-col>
                <el-col :span="24" class="red"><span>{{ updateMsg }}</span></el-col>
            </el-row>
            <el-row class="xl-mian-header-top">
                <el-col>用户被打标情况</el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col :span="3"><span>兔子</span>{{ blackNick.type1 }}</el-col>
                <el-col :span="3"><span>蜜獾</span>{{ blackNick.type2 }}</el-col>
                <el-col :span="3"><span>狐狸</span>{{ blackNick.type3 }}</el-col>
                <el-col :span="3"><span>鳄鱼</span>{{ blackNick.type4 }}</el-col>
                <el-col :span="3"><span>野狗</span>{{ blackNick.type5 }}</el-col>
                <el-col :span="3"><span>老鼠</span>{{ blackNick.type6 }}</el-col>
                <el-col :span="3"><span>降权</span>{{ downNum }}</el-col>
                <el-col :span="8"><span>好评</span>{{ blackNick.goodNum }}</el-col>
                <el-col :span="8"><span>差评</span>{{ blackNick.badNum }}</el-col>
                <el-col :span="8"><span>证明</span>{{ blackNick.proveNum }}</el-col>
            </el-row>
            <el-row class="xl-mian-header-top">
                <el-col>信誉区间</el-col>
            </el-row>
            <el-table :data="honourList" border v-loading="loading1">
                <el-table-column label="开始时间" align="center" prop="update_time_small" />
                <el-table-column label="结束时间" align="center" prop="update_time_big" />
                <el-table-column label="区间天数" align="center" prop="days" />
                <el-table-column label="区间总信誉" align="center" prop="num" />
                <el-table-column label="日均点数" align="center" prop="avgDay" />
                <el-table-column label="周均点数" align="center" prop="avgWeek" />
            </el-table>
        </el-row>
    </el-dialog>
</template>

<script>
import { getWWInfo, getWWRange } from "@/api/showReal";
import { dateFortmat } from "@/utils";
export default {
    data() {
        return {
            dialogVisible: false,
            loading: false,
            loading1: false,
            //七天
            total: 0,
            //打标
            dabiao: 0,
            //昨天打标
            dabiao1: 0,
            //降权
            jiangquan: 0,
            //昨天降权
            jiangquan1: 0,
            //挽回
            wanhui: 0,
            jiangquan2: 0,
            dabiao2: 0,
            searchTime: null,
            now: new Date(),
            nick: "",
            nameconform: "",
            sup: "",
            buyNum: "",
            registDate: "",
            sellNum: "",
            amoyAge: "",
            gender: 1,
            totalWeeklyReview: "",
            receive: "",
            goodPercent: "",
            level: "",
            g: 0,
            b: 0,
            r: 0,
            week: 0,
            week1: 0,
            money: 0.0,
            froze: 0.0,
            bFreeze: 0.0,
            bPhone: "",
            showHelp: false,
            account: "",
            dt: null,
            honourList: [],
            blackNick: {
                type1: 0,
                type0: 0,
                type3: 0,
                type2: 0,
                type5: 0,
                type4: 0,
                type6: 0
            },
            downNum: 0,
            row: { levelName: "" },
            updateMsg: ""
        };
    },
    methods: {
        getList(nick) {
            this.loading = true;
            this.loading1 = true;
            this.honourList = [];
            getWWInfo({ nick, type: 1 })
                .then(r => {
                    Object.assign(this, r.data);
                    this.dt = dateFortmat(new Date(), "yyyy-MM-dd hh:mm:ss");
                    this.row.levelName = this.buyNum;
                })
                .catch(() => (this.dialogVisible = false))
                .finally(r => {
                    this.loading = false;
                });

            getWWRange({ nick })
                .then(r => {
                    if (r.data.list && r.data.list.length) {
                        this.honourList = r.data.list.reverse();
                    } else {
                        this.honourList = [];
                    }
                })
                .finally(() => (this.loading1 = false));
        }
    }
};
</script>

<style lang="scss" scoped>
.xl-mian-header-top {
    & > .el-col {
        background: #d8dde5;
        color: #040404;
        padding: 10px 20px;
    }
}
.xl-task-row {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    span {
        color: #00f;
        padding-right: 10px;
    }
}
</style>