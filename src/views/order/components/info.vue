<template>
    <el-row>
        <show-image ref="showImage"></show-image>
        <el-row>

            <el-row>
                <el-row class="xl-mian-header-top">
                    <el-col>基本信息</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="8">任务类型：<span>{{data.taskTypeName}}</span></el-col>
                    <el-col :span="8">任务编号：<span>{{data.taskNo}}</span></el-col>
                    <el-col :span="8">订单编号：<span>{{data.orderNo}}</span></el-col>
                    <el-col :span="8">商家ID：<span>{{data.merId}}</span></el-col>
                    <el-col :span="8">订单状态：<span>{{filterSeller}}</span></el-col>
                    <el-col :span="8">店铺名称：<span>{{data.storeName}}</span></el-col>
                    <el-col :span="8">店铺旺旺ID：<span>{{data.storeAccount}}</span></el-col>
                    <el-col :span="8">用户ID：<span>{{data.buyerId}}</span></el-col>
                    <el-col :span="8">用户买手账号：<span>{{data.buyerAccount}}</span></el-col>
                    <el-col :span="8">任务发布时间：<span>{{data.createTime}}</span></el-col>
                    <el-col :span="8">订单放出时间：<span>{{data.releaseTime}}</span></el-col>
                    <el-col :span="8">买手接单时间：<span>{{data.receiptTime}}</span></el-col>
                    <el-col :span="8">买手付款时间：<span>{{data.buyerPaymentTime}}</span></el-col>
                    <el-col :span="8">返款时间：<span>{{data.rebateTime}}</span></el-col>
                    <el-col :span="8">评价时间：<span>{{data.praiseTime}}</span></el-col>
                    <el-col :span="8">撤销时间：<span>{{data.cancelTime}}</span></el-col>
                    <el-col :span="8">完成时间：<span>{{data.finishTime}}</span></el-col>
                    <el-col :span="8">商家备注：<span>{{data.remark}}</span></el-col>

                    <el-col :span="8">审核状态：<span>{{data.audiSelfStatus==0?'未通过':data.audiSelfStatus==1?'通过':''}}</span></el-col>
                    <el-col :span="8">返款类型：<span>{{data.rebateType==1?'立返':data.rebateType==2?'货返':''}}</span></el-col>
                    <el-col :span="8">电商订单号：<span>{{data.mallOrderNo}}</span></el-col>
                </el-row>
            </el-row>
            <el-row>
                <el-row class="xl-mian-header-top">
                    <el-col>奖金信息</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="8">商家支付本金：<span>{{data.principal}}</span></el-col>
                    <el-col :span="8">商家支付佣金：<span>{{data.commission}}</span></el-col>
                    <el-col :span="8">商家加价佣金：<span>{{data.commissionRaisePrice}}</span></el-col>
                    <el-col :span="8">商品垫付押金：<span>{{data.advanceDeposit}}</span></el-col>
                    <el-col :span="8">买手实付金额：<span>{{data.buyerActualPayment}}</span></el-col>
                    <el-col :span="8">返款金额：<span>{{data.rebateAmount}}</span></el-col>
                    <el-col :span="8">买手提交差价：<span>{{data.spreadAmount}}</span></el-col>
                    <el-col :span="8">已补买手差价:<span>{{data.buyerSuppliedMarginAmout}}</span></el-col>
                    <el-col :span="8">已补商家差价：<span>{{data.merchantSuppliedMarginAmout}}</span></el-col>
                    <el-col :span="8">买手获得的佣金：<span>{{data.actualCommission}}</span></el-col>
                </el-row>
            </el-row>

            <el-row v-if="data.praiseType==1">
                <el-row class="xl-mian-header-top">
                    <el-col>无评价任务</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="24" v-if="data.goodsEntrance==1">关键词：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==2">淘口令：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==3">二维码：<img @click="handleShow(data.keyword)" :src="path+data.keyword+process" alt="" /> </el-col>
                </el-row>
            </el-row>

            <el-row v-else-if="data.praiseType==2">
                <el-row class="xl-mian-header-top">
                    <el-col>指定文字好评任务</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="24" v-if="data.goodsEntrance==1">关键词：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==2">淘口令：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==3">二维码：<img @click="handleShow(data.keyword)" :src="path+data.keyword+process" alt="" /> </el-col>
                    <el-col :span="24">好评内容：<span>{{data.praiseContent}}</span></el-col>
                </el-row>
            </el-row>

            <el-row v-else-if="data.praiseType==3">
                <el-row class="xl-mian-header-top">
                    <el-col>指定图片好评任务</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="24" v-if="data.goodsEntrance==1">关键词：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==2">淘口令：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==3">二维码：<img @click="handleShow(data.keyword)" :src="path+data.keyword+process" alt="" /> </el-col>
                    <el-col :span="24">好评内容：<span>{{data.claim}}</span></el-col>
                    <el-col :span="24">好评图片：
                        <img @click="handleShow(item)" :src="path+item+process" alt="" v-for="item in data.imageUrlLsit" />
                    </el-col>
                </el-row>
            </el-row>

            <el-row v-else-if="data.praiseType==4">
                <el-row class="xl-mian-header-top">
                    <el-col>指定视频好评任务</el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="24" v-if="data.goodsEntrance==1">关键词：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==2">淘口令：<span>{{data.keyword}}</span></el-col>
                    <el-col :span="24" v-else-if="data.goodsEntrance==3">二维码：<img @click="handleShow(data.keyword)" :src="path+data.keyword+process" alt="" /> </el-col>
                    <el-col :span="24">好评内容：<span>{{data.claim}}</span></el-col>
                    <el-col :span="24">好评图片：
                        <img @click="handleShow(item)" :src="path+item+process" alt="" v-for="item in data.imageUrlLsit" />
                    </el-col>
                    <el-col :span="24">好评视频：
                        <video height="200" :src="path+data.videoUrl" controls="controls" />

                    </el-col>
                </el-row>
            </el-row>

            <el-row class="box-card" v-if="data.appendedPraiseStatus">
                <el-row class="xl-mian-header-top">
                    <el-col>追评详情（<span class="xl-red">{{filterAddEvaluate(data.appendedPraiseStatus)}}</span>）

                        <el-button type="warning" @click="handleRevokeAddEvaluation" v-if="data.appendedPraiseStatus<3">撤销追评</el-button>
                    </el-col>
                </el-row>
                <el-row class="xl-task-row">
                    <el-col :span="8">追评发起时间：<span>{{data.appendedPraiseLaunchTime}}</span></el-col>
                    <el-col :span="8">买手操作时间：<span>{{data.appendedPraiseOperateTime}}</span></el-col>
                    <el-col :span="8">商家确认时间：<span>{{data.appendedPraiseFinishedTime}}</span></el-col>
                    <el-col :span="8">商家实付佣金：<span>{{data.appendedPraiseTotalPrice}}</span></el-col>
                    <el-col :span="8">买手获得佣金：<span>{{data.appendedPraiseBuyerPrice}}</span></el-col>
                    <el-col :span="24" v-if="data.appendedPraiseText">文字追评内容：<span>{{data.appendedPraiseText}}</span></el-col>
                    <el-col :span="24" v-if="data.appendedPraiseImgUrlList">图片追评内容：<img @click="handleShow(item)" :src="path+item+process" alt="" v-for="item in data.appendedPraiseImgUrlList" /></el-col>
                    <el-col :span="24" v-if="data.appendedPraiseVideoUrl">视频追评内容：<video height="200" :src="path+data.appendedPraiseVideoUrl" controls="controls" /> </el-col>
                </el-row>
            </el-row>

            <el-row>
                <el-row class="xl-mian-header-top">
                    <el-col>操作信息</el-col>
                </el-row>

                <el-table :data="tableData1" style="width: 100%" border>
                    <el-table-column prop="operName" label="任务步骤">
                        <template slot-scope="{row}">
                            {{row.operName||row.stepName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="operRole" label="操作者" />
                    <el-table-column prop="time" label="操作时间" />
                    <el-table-column prop="address" label="内容">
                        <template slot-scope="{row}">
                            <img @click="handleShow(row.value)" :src="path+row.value+process" alt="">
                        </template>
                    </el-table-column>
                </el-table>

            </el-row>
        </el-row>

    </el-row>
</template>

<script>
import { details as fetchInfo, revokeAddEvaluation } from "@/api/order/order";
import { mapState, mapGetters } from "vuex";
import showImage from "@/components/showImage";

const data = {
    orderNo: null,
    taskNo: null,
    taskTypeId: null,
    taskTypeName: null,
    merId: null,
    orderStatus: null,
    storeId: null,
    storeName: null,
    storeAccount: null,
    buyerId: null,
    buyerAccount: null,
    createTime: null,
    receiptTime: null,
    buyerPaymentTime: null,
    rebateTime: null,
    praiseTime: null,
    cancelTime: null,
    finishTime: null,
    remark: "",
    principal: null,
    commission: null,
    commissionRaisePrice: null,
    advanceDeposit: null,
    buyerActualPayment: null,
    rebateAmount: null,
    spreadAmount: null,
    praiseType: null,
    keyword: null,
    praiseContent: null,
    spec: null,
    claim: null,
    imageUrlLsit: null,
    videoUrl: null,
    orderOperInfo: null,
    releaseTime: "",
    appendedPraiseStatus: null,
    appendedPraiseLaunchTime: "",
    appendedPraiseOperateTime: "",
    appendedPraiseFinishedTime: "",
    appendedPraiseTotalPrice: "",
    appendedPraiseBuyerPrice: "",
    appendedPraiseText: "",
    appendedPraiseImgUrlList: null,
    appendedPraiseVideoUrl: ""
};
export default {
    components: {
        showImage
    },
    data() {
        const step = [
            "needCompareOthersValue",
            "browsGoodsImgValue",
            "goalGoodsImgValue",
            "needCollectGoodsValue",
            "needCollectShopValue",
            "needAddShoppingCartValue",
            "pay",
            "sysReturn",
            "evaluate",
            "grantCommission",
            "appendedEvaluate",
            "appendedCommission"
        ];
        return {
            data,
            process: "?x-oss-process=image/resize,h_100",
            tableData1: [],
            step
        };
    },

    computed: {
        ...mapState(["common"]),
        ...mapGetters({
            sellerKV: "status/mallOrderKV",
            path: "imgOSS/path",
            addEvaluationKV: "status/addEvaluationKV"
        }),
        filterSeller() {
            return this.sellerKV[this.data.orderStatus];
        }
    },

    methods: {
        filterAddEvaluate(praiseType) {
            return this.addEvaluationKV[praiseType];
        },
        handleShow(url) {
            this.$refs.showImage.url = url;
            this.$refs.showImage.dialogVisible = true;
        },
        getList() {
            const orderNo = this.common.orderNo;
            fetchInfo(orderNo).then(({ data }) => {
                Object.assign(this.data, data);
                this.tableData1 = this.step
                    .map(v =>
                        data.orderOperInfo ? data.orderOperInfo[v] : null
                    )
                    .filter(v => v);
            });
            return false;
        },
        handleRevokeAddEvaluation() {
            this.$confirm("确定要撤销该追评吗").then(() => {
                const orderNo = this.data.orderNo;
                revokeAddEvaluation({ orderNo }).then(r => {
                    this.$message.success(r.msg);
                    this.getList();
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.el-row {
    font-size: 14px;
}
.xl-main-pic {
    img {
        width: 100%;
        height: 100%;
    }
}
.xl-mian-header-top {
    & > .el-col {
        background: #d8dde5;
        color: #040404;
        padding: 10px 20px;
    }
}
.xl-main-center {
    text-align: center;
}
.xl-mian-header {
    & > .el-col {
        margin-top: 60px;
        text-align: center;
    }
    .xl-main-first {
        margin-top: 0;
        text-align: left;
    }
}
.xl-main-link {
    overflow: hidden;
    height: 100%;
    white-space: nowrap;
    word-break: break-word;
}
.xl-main-text {
    .el-row {
        margin: 5% 10px;
    }
}
span {
    color: #0098e1;
}
.xl-task-row {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
}
.xl-img-row {
    margin: 20px;
}
</style>