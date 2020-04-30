<template>
    <div class="xl-container">

        <div class="xl-wrap">
            <div style="width:40%;display:inline-block;">
                <el-input placeholder="旺旺号" v-model="account" @keyup.enter.native.prevent="handleSearch"></el-input>
            </div>
            <el-button type="primary" @click="handleSearch" :loading="loading">查询</el-button>
        </div>

        <div v-if="showDetail" class="xl-hide">
            <div class="clearfix xl-second ">
                <ul>
                    <li>
                        买家：<span>{{ nick }}</span>
                    </li>
                    <li>
                        实名认证：<span class="green">{{ nameconform == 1 ? '已实名认证' : '暂无实名认证'}}</span><span class="gold">{{ sup == 0 ? '普通会员' : '超级会员'}}</span>
                        <span class="gold">{{ level }}</span>
                    </li>
                    <li>
                        买家信誉：<span>{{ buyNum }}</span>
                    </li>
                    <li>
                        注册日期：<span>{{ registDate}}</span>
                    </li>
                    <li>
                        商家信誉：<span class="red">{{ sellNum == '' ? '非商家' : sellNum}}</span>
                    </li>

                    <li>
                        淘龄：<span>{{ amoyAge }}</span>
                    </li>

                    <li>
                        性别：<span>{{ gender}}</span>
                    </li>
                    <li>
                        买家总周平均：<span>{{ parseFloat( totalWeeklyReview).toFixed(2) }}</span>
                    </li>
                    <li>
                        收到好评率：<span>{{ goodPercent }}</span>
                    </li>
                    <li>
                        发出好评率：<span>{{ goodPercent }}</span>
                    </li>
                    <li>
                        查询时间：<span>{{ searchTime }}</span>
                    </li>
                </ul>
            </div>

            <h2 class="xl-mark">用户被打标情况
                <!-- <span @click="handleHelp">点我了解什么是用户被打标?</span> -->
            </h2>
            <div class="clearfix xl-third">
                <ul>
                    <li><span>兔子</span>{{blackNick.type1 }}</li>
                    <li><span>蜜獾</span>{{ blackNick.type2 }}</li>
                    <li><span>狐狸</span>{{ blackNick.type3 }}</li>
                    <li><span>鳄鱼</span>{{ blackNick.type4 }}</li>
                    <li><span>野狗</span>{{ blackNick.type5 }}</li>
                    <li><span>老鼠</span>{{ blackNick.type6 }}</li>
                    <li><span>降权</span>{{ downNum }}</li>
                </ul>
            </div>
            <div class="clearfix xl-fourth">
                <ul>
                    <li>
                        好评：<b>{{ blackNick.goodNum }}</b>
                    </li>
                    <li>
                        差评：<b>{{ blackNick.badNum  }}</b>
                    </li>
                    <li>
                        证明：<b>{{ blackNick.proveNum}}</b>
                    </li>
                </ul>
            </div>
            <div class="clearfix xl-fifth">
                <ul>
                    <li>
                        本周查询过商家：<span class="red">{{ week }}</span>
                    </li>
                    <li>
                        上周查询过商家：<span class="red">{{ week1 }}</span>
                    </li>
                </ul>
            </div>

            <div class="xl-sixth clearfix" v-loading="loading1">
                <ul v-for="item in honourList">
                    <li><span>开始时间:</span>{{ item.update_time_small }}</li>
                    <li><span>结束时间:</span> {{ item.update_time_big }}</li>
                    <li><span>区间天数:</span>{{ item.days }}</li>
                    <li><span>区间总信誉:</span>{{ item.num }}</li>
                    <li><span>日均点数:</span> {{ item.avgDay }}</li>
                    <li><span>周均点数:</span>{{ item.avgWeek }}</li>
                </ul>
            </div>
        </div>

        <div v-show="showHelp" @click="handleHelp" class="xl-hide">
            <div class="xl-help">
                <ul>
                    <li>兔子：拿完了商家的返款就恶意退款跑了！</li>
                    <li>蜜獾：用各种方式威胁你给钱！</li>
                    <li>狐狸：用各种方式骗你钱了！</li>
                    <li>鳄鱼：用工商、发票、字体、商标、假货各种方式来坑你钱了！</li>
                    <li>野狗：接完单给了你差评进行要挟！</li>
                    <li>老鼠：用了淘客链接来拍你的单！</li>
                    <li>降权：被稽查系统判定虚假交易过导致商家单品降权的账号</li>
                    <li>下面的数字为照妖镜用户数，实际降权的店铺是大于等于显示出来的数字的！</li>
                    <li>评价：没有实质证据证明对方是坏人，只是合作不愉快，请用评价功能吧</li>
                    <li>当然请别涉及隐私，否则可能被剥夺举报权！</li>
                    <li class="xl-tips">单击任意地方关闭</li>
                </ul>
            </div>
            <div class="xl-modal"></div>
        </div>
    </div>
</template>
    <script>
import { getWWInfo, getWWRange } from "@/api/showReal";
const p1 = new Promise((resolve, reject) => {
    var data = {
        data: {
            msg: null,
            buyNum: "1黄钻",
            gender: "男",
            blackNick: {
                "日余量：": "99997(剩余时间：290天)",
                type1: 0,
                type0: 0,
                type3: 0,
                type2: 0,
                type5: 0,
                "总余量：": 83698,
                type4: 0,
                type6: 0,
                "日总量：": 100000
            },
            level: "淘宝V3会员",
            sup: "0",
            result: "正常",
            buycity: "",
            nick: "zdjyunsi",
            goodPercent: "100%",
            nameconform: 1,
            amoyAge: 4111,
            totalWeeklyReview: 0.4273899294575529,
            downNum: 0,
            sellNum: "",
            registDate: "2008-08-19"
        },
        code: 0,
        msg: "操作成功",
        date: 1574335028212,
        sign: null,
        success: true
    };
    setTimeout(v => {
        resolve(data);
    }, 5000);
});

Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

export default {
    data() {
        return {
            loading1: false,
            loading: false,
            showDetail: false,
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
            bPhone: 18939612278,
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
            downNum: 0
        };
    },
    created() {},
    methods: {
        handleHelp: function() {
            this.showHelp = !this.showHelp;
        },
        handleSearch: function() {
            if (this.account) {
                this.showDetail = false;
                this.loading = true;
                getWWInfo({ nick: this.account, type: 0 })
                    .then(r => {
                        this.dt = new Date();
                        this.$message.success(r.msg);
                        Object.assign(this, r.data);
                        this.showDetail = true;
                    })
                    .finally(r => {
                        this.loading = false;
                    });
                this.handleHonour();
            } else {
                this.$message.error("请输入要查询的旺旺号");
            }
        },
        handleHonour: function() {
            this.honourList = [];
            this.loading1 = true;
            getWWRange({ nick: this.account })
                .then(r => {
                    if (r.data.list && r.data.list.length) {
                        this.honourList = r.data.list.reverse();
                    } else {
                        this.honourList = [];
                    }
                })
                .finally(r => {
                    this.loading1 = false;
                });
        }
    },
    computed: {
        getYestoday() {
            var month = this.now.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var date = this.now.getDate() - 1;
            date = date < 10 ? "0" + date : date;

            return month + "" + date;
        },
        searchTime: function() {
            if (this.dt) {
                return this.dt.format("yyyy-MM-dd hh:mm:ss");
            } else {
                return "";
            }
        }
    }
};
</script>
    <style lang="scss" scoped>
.xl-container {
    margin: 50px 0;
}
.xl-container ul li {
    float: left;
    list-style: none;
}
.xl-container div {
    width: 100%;
}
.clearfix:after,
.clearfix:before {
    content: "";
    display: table;
}
.clearfix:after {
    clear: both;
}
.clearfix {
    *zoom: 1;
}
.xl-container input,
.xl-container a {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    text-align: center;
}

.xl-input {
    position: relative;
}
.xl-input:after {
    position: absolute;
    border-radius: 2.5rem;
    content: "";
    pointer-events: none;
    border: 1px solid #ababab;
    top: 0;
    left: 0;
    background: none;
    right: -100%;
    bottom: -100%;
    transform: scale(0.5);
    transform-origin: 0 0;
}
.search {
    height: 30px;
    width: 30%;
    display: inline-block;
}
.search a {
    background: #ff5277;
    box-shadow: 0 0 0.05rem 0.01rem rgba(255, 82, 119, 0.29);
    display: block;
    border-radius: 20px;
    text-align: center;
    color: #fff;
}
input:hover,
a:hover {
    cursor: pointer;
}
.xl-search-text {
    width: 50%;
    display: inline-block;
}
.xl-first,
.xl-second,
.xl-fourth,
.xl-fifth,
.xl-sixth {
    margin-top: 30px;
    background: #fafafa;
}
.xl-first {
    font-size: 26px;
    font-weight: bold;
    text-align: center;
}
.xl-first li,
.xl-second li {
    width: 100%;
    padding: 2px;
}
.xl-first li span {
    float: right;
    color: #999;
}

.xl-second li {
    float: left;
    width: 49%;
}
.xl-second li span {
    color: #999;
}
.xl-second li span.green {
    color: green;
}
.xl-second li span.gold {
    color: rgb(255, 124, 0);
}
.red,
.xl-second li span.red {
    color: #f00;
}

.xl-third ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.xl-third ul li {
    text-align: center;
}
.xl-third ul li span {
    display: block;
    margin-bottom: 20px;
    padding: 5px;
    border-radius: 10px;
    background: #f8f8f8;
}
h2 {
    text-align: center;
}
.xl-fourth,
.xl-fifth {
    padding: 20px 0;
    margin-top: 5px;
}

.xl-fourth ul,
.xl-fifth ul {
    display: flex;
    justify-content: space-around;
}
.xl-sixth ul {
    padding: 20px 0;
    padding-bottom: 40px;
}
.xl-sixth ul li {
    width: 16%;
    font-size: 12px;
}
.xl-sixth ul li span {
    padding-right: 5px;
    color: #ff5277;
}
.search1 {
    float: none;
    margin: 0 auto;
    display: block;
    margin-top: 20px;
}
.xl-wrap {
    text-align: center;
}
.xl-container {
    max-width: 924px;
    margin: 0 auto;
    overflow: hidden;
    padding: 50px;
}
.xl-container div.xl-help {
    width: 500px;
    height: 220px;
    position: fixed;
    top: 50%;
    left: 50%;
    background: #fff;
    margin-left: -272px;
    margin-top: -85px;
    z-index: 1000;
    border-radius: 8px;
}
.xl-container div.xl-help li {
    width: 100%;
}
.xl-tips {
    color: #ff6900;
    font-weight: bold;
    text-align: center;
    width: 100%;
}
.xl-container div.xl-modal {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
    background: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
}

.xl-container div.loading {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    opacity: 0.7;
}
.xl-container div.loadimg {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 50%;
    margin-top: -25px;
    margin-left: -25px;
}
.xl-container div.loadimg img {
    width: 100%;
    height: 100%;
}
.xl-mark {
    margin: 50px 0;
}
.xl-mark span {
    font-weight: normal;
    color: #666;
    font-size: 14px;
    padding-left: 20px;
    cursor: help;
}
.xl-margin-top {
    margin-top: 50px;
}
.h3 {
    margin: 0px auto;
    color: #f75d39;
    font-size: 14px;
    width: 95%;
    line-height: 20px;
    text-align: left;
}
.h4 {
    color: #5e6d82;
}
</style>