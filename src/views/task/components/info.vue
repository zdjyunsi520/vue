<template>
    <el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>基本信息</el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col :span="8">来源：<span>{{data.storeInfo.deptName}}</span></el-col>
                <el-col :span="8">任务状态：<span>{{filterSeller}}</span></el-col>
                <el-col :span="8">任务编号：<span>{{data.taskInfo.taskNo}}</span></el-col>
                <el-col :span="8">商家ID：<span>{{data.storeInfo.merId}}</span></el-col>
                <el-col :span="8">所属平台：<span>{{filterMall}}</span></el-col>
                <el-col :span="8">任务类型：<span>{{data.taskInfo.taskTypeName}}</span></el-col>
                <el-col :span="8">是否包邮：<span>{{data.taskInfo.isIncludePostage==1?'是':'否'}}</span></el-col>
                <el-col :span="8">是否优质任务：<span>{{data.taskInfo.isHighQuality==1?'是':'否'}}</span></el-col>
                <el-col :span="8">创建时间：<span>{{data.taskInfo.createTime}}</span></el-col>
                <el-col :span="8">任务付款时间：<span>{{data.taskInfo.payTime}}</span></el-col>
            </el-row>
        </el-row>
        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>店铺信息</el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col :span="8">来源：<span>{{data.storeInfo.deptName}}</span></el-col>
                <el-col :span="8">平台：<span>{{data.storeInfo.taskPlatformName}}</span></el-col>
                <el-col :span="8">店铺名称：<span>{{data.storeInfo.storeName}}</span></el-col>
                <el-col :span="8">旺旺ID：<span>{{data.storeInfo.storeAccountId}}</span></el-col>
                <el-col :span="8">店铺ID：<span>{{data.storeInfo.storeId}}</span></el-col>
                <el-col :span="8">电话：<span>{{data.storeInfo.phone}}</span></el-col>

                <el-col :span="8">发货地址：<span>{{filterAll(data.storeInfo.province)}}{{
              filterAll(data.storeInfo.city)}}{{filterAll(data.storeInfo.district)}}{{data.storeInfo.address
              }}</span></el-col>
                <el-col :span="8">创建时间：<span>{{data.storeInfo.createTime}}</span></el-col>
                <el-col :span="24">店铺链接：<span>{{data.storeInfo.storeHomeUrl}}</span>
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, data.storeInfo.storeHomeUrl, $event)">复制链接</el-button>
                </el-col>
            </el-row>
        </el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>商品信息</el-col>
            </el-row>
            <el-row class="xl-task-row" v-for="item in data.taskInfo.taskGoodsInfoList">
                <el-col :span="24">商品名称：<span>{{item.goodsName}}</span></el-col>
                <el-col :span="24">主图：<img :src="path+item.goodsImgUrl+process" alt=""></el-col>
                <el-col :span="24">链接：<span>{{item.goodsUrl}}</span>
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, item.goodsUrl, $event)">复制链接</el-button>
                </el-col>
                <el-col :span="8">展示价：<span>{{item.displayedPrice}}</span></el-col>
                <el-col :span="8">成交价：<span>{{item.actualUnitPrice}}</span></el-col>
                <el-col :span="8">拍下数量：<span>{{item.quantity}}</span></el-col>
                <el-col :span="24">规格：<span>{{item.goodsSpec}}</span></el-col>
            </el-row>
        </el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>如何找到商品</el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col :span="6">商品排序方式：<span>{{data.taskInfo.foundMethod==1?'综合':data.taskInfo.foundMethod==2?'销量':'直通车'}}</span></el-col>
                <el-col :span="6">付款或收货人数：<span>{{data.taskInfo.payerNumber}}</span></el-col>
                <el-col :span="6">价格区间：<span>{{data.taskInfo.priceRangeFrom}}-{{data.taskInfo.priceRangeTo}}</span></el-col>
                <el-col :span="6">商品所在地：<span>{{data.taskInfo.goodsLocation}}</span></el-col>
                <el-col :span="24">订单留言：<span>{{data.taskInfo.orderMessage}}</span></el-col>
            </el-row>
        </el-row>
        <el-row v-if="data.taskInfo.hasOrdinaryTask">
            <el-row class="xl-mian-header-top">
                <el-col>无评价任务</el-col>
            </el-row>
            <el-row class="xl-task-row" v-for="item in data.taskInfo.ordinaryTaskList">

                <el-col :span="8" v-if="data.taskInfo.goodsEntrance==1">关键词：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==2">淘口令：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==3">二维码：<img @click="handleShow(item.keyword)" :src="path+item.keyword+process" alt="" /> </el-col>
                <el-col :span="8">单数：<span>{{item.orderQuantity}}</span></el-col>
            </el-row>
        </el-row>

        <el-row v-if="data.taskInfo.hasSpecifiedTextPraiseTask">
            <el-row class="xl-mian-header-top">
                <el-col>指定文字好评任务</el-col>
            </el-row>
            <el-row class="xl-task-row" v-for="item in data.taskInfo.specifiedTextPraiseTaskList">
                <el-col :span="8" v-if="data.taskInfo.goodsEntrance==1">关键词：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==2">淘口令：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==3">二维码：<img @click="handleShow(item.keyword)" :src="path+item.keyword+process" alt="" /> </el-col>
                <el-col :span="8">单数：<span>{{item.orderQuantity}}</span></el-col>
                <el-col :span="24">好评内容：<span>{{item.praiseContent}}</span></el-col>
            </el-row>
        </el-row>

        <el-row v-if="data.taskInfo.hasSpecifiedImagePraiseTask">
            <el-row class="xl-mian-header-top">
                <el-col>指定图片好评任务</el-col>
            </el-row>
            <el-row class="xl-task-row" v-for="item in data.taskInfo.specifiedImagePraiseTaskList">
                <el-col :span="8" v-if="data.taskInfo.goodsEntrance==1">关键词：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==2">淘口令：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==3">二维码：<img @click="handleShow(item.keyword)" :src="path+item.keyword+process" alt="" /> </el-col>
                <el-col :span="8">单数：<span>{{item.orderQuantity}}</span></el-col>
                <el-col :span="8">规格：<span>{{item.spec}}</span></el-col>
                <el-col :span="24">好评内容：<span>{{item.claim}}</span></el-col>
                <el-col :span="24">好评图片：
                    <img :src="path+item1+process" alt="" v-for="item1 in item.imageUrlLsit" />
                </el-col>
            </el-row>
        </el-row>

        <el-row v-if="data.taskInfo.hasSpecifiedVideoPraiseTask">
            <el-row class="xl-mian-header-top">
                <el-col>指定视频好评任务</el-col>
            </el-row>
            <el-row class="xl-task-row" v-for="item in data.taskInfo.specifiedVideoPraiseTaskList">
                <el-col :span="8" v-if="data.taskInfo.goodsEntrance==1">关键词：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==2">淘口令：<span>{{item.keyword}}</span></el-col>
                <el-col :span="8" v-else-if="data.taskInfo.goodsEntrance==3">二维码：<img @click="handleShow(item.keyword)" :src="path+item.keyword+process" alt="" /> </el-col>
                <el-col :span="8">单数：<span>{{item.orderQuantity}}</span></el-col>
                <el-col :span="8">规格：<span>{{item.spec}}</span></el-col>
                <el-col :span="24">好评内容：<span>{{item.claim}}</span></el-col>
                <el-col :span="24">好评图片：
                    <img :src="path+item1+process" alt="" v-for="item1 in item.imageUrlLsit" />
                </el-col>
                <el-col :span="24">好评视频：
                    <video height="200" :src="path+item.videoUrl" controls="controls" />

                </el-col>
            </el-row>
        </el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>放单计划</el-col>
            </el-row>
            <el-row class="xl-task-row" :key="item.beginTime+index" v-for="(item,index) in data.taskInfo.releasePlanList">
                <el-col>
                    放单计划：从 <span>{{item.beginTime}}</span> 开始，每隔 <span>{{item.interval}}</span> 分钟放出 <span>{{item.quantityUnitTime}}</span> 单，共放 <span>{{item.totalQuantity}}</span> 单
                </el-col>
            </el-row>
        </el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>接单用户淘宝账号属性限制</el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col :span="6" v-if="data.taskInfo.isHighQuality==1">高优质买号：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.isAudiSelf==1">自主审核买号：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.isMandatoryConfirmReceipt==1">强制买手7天内确认收货：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.needCollectShop==1">是否收藏店铺：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.needCollectGoods==1">是否收藏宝贝：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.needFakeChat==1">是否假聊：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.needFullScreenshot==1">是否全程截图：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.needCompareOthers==1">是否货比二家：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.allowUseAntCreditPay==1">允许使用花呗：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.allowUseCreditCard==1">允许使用信用卡：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.needAddShoppingCart==1">是否加购物车：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.allowUseCoupon==1">允许使用优惠券：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.allowCopyKeywords==1">允许复制关键词：<span>是</span></el-col>

                <el-col :span="6" v-if="data.taskInfo.needSuperLabel==1">超级人群标签单：<span>是</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.age!=''">年龄限制：<span>{{showAge(data.taskInfo.age)}}</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.gender!=2">性别限制：<span>{{showGender(data.taskInfo.gender)}}</span></el-col>
                <el-col :span="6" v-if="data.taskInfo.buyerCategory!=''">类目限制：<span>{{data.taskInfo.buyerCategory}}</span></el-col>
                <el-col :span="12" v-if="data.taskInfo.needAboveDiamondLevel==1">仅限钻石级别的买号可接任务：<span>是</span></el-col>
                <el-col :span="12" v-if="data.taskInfo.needFinishedBrowseTask==1">仅限做过此商品浏览任务的账号可接此任务：<span>是</span></el-col>
                <el-col :span="24" v-if="data.taskInfo.excludedArea.length>0">地域限制：<span>{{showArea(data.taskInfo.excludedArea)}}</span></el-col>
                <el-col :span="24" v-if="data.taskInfo.remarkContent">商家备注：<span>{{data.taskInfo.remarkContent}}</span></el-col>
            </el-row>
        </el-row>

        <el-row>
            <el-row class="xl-mian-header-top">
                <el-col>费用详情</el-col>
            </el-row>
            <el-table border :span-method="(obj)=>arraySpendMethod.call(this,obj,tableData.length)" :data="tableData">

                <el-table-column prop="" label="分类" width="250">

                    <template slot-scope="{row}">
                        佣金
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="费用明细">

                    <template slot-scope="{row}">
                        {{row.chargeName}} : {{row.unitPrice}} 金/单
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" width="250">

                    <template slot-scope="{row}">
                        {{row.orderQuantity}} 单
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="小计" width="250">

                    <template slot-scope="{row}">
                        {{row.totalPrice}} 金
                    </template>
                </el-table-column>
            </el-table>

            <el-table border :show-header="false" :span-method="(obj)=>arraySpendMethod.call(this,obj,tableData1.length)" :data="tableData1">

                <el-table-column prop="" label="分类" width="250">

                    <template slot-scope="{row}">
                        本金
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="费用明细">

                    <template slot-scope="{row}">
                        {{row.chargeName}} : {{row.unitPrice}} 金/单
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" width="250">

                    <template slot-scope="{row}">
                        {{row.orderQuantity}} 单
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="小计" width="250">

                    <template slot-scope="{row}">
                        {{row.totalPrice}} 金
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="xl-task-row">
                <el-col>合计单数：<span class="xl-red">{{data.chargeSummary.totalOrderQuantity}} 单</span></el-col>
            </el-row>
            <el-row class="xl-task-row">
                <el-col>合计支付：
                    本金 <span class="xl-red">{{data.chargeSummary.totalPrincipal}} 金</span>
                    佣金 <span class="xl-red">{{data.chargeSummary.totalCommission}} 金</span></el-col>
            </el-row>

        </el-row>
    </el-row>
</template>

<script>
import { detail as fetchInfo } from "@/api/task";
import { mapState, mapGetters } from "vuex";
import handleClipboard from "@/utils/clipboard";
const data = {
    storeInfo: {
        storeId: null,
        merId: null,
        merAccount: null,
        taskPlatformName: null,
        taskPlatformId: null,
        storeName: null,
        storeHomeUrl: null,
        storeAccountId: null,
        province: null,
        city: null,
        district: null,
        address: null,
        phone: null,
        storeState: null,
        deptId: null,
        deptName: null,
        consigner: null,
        createTime: null,
        remarks: null
    },
    taskInfo: {
        taskId: null,
        taskNo: null,
        merId: null,
        merAccount: null,
        deptId: null,
        deptName: null,
        createTime: null,
        payTime: null,
        auditTime: null,
        finishTime: null,
        cancelTime: null,
        totalCommission: null,
        totalPrincipal: null,
        taskStatus: null,
        taskCategory: null,
        taskTypeId: null,
        taskTypeName: null,
        mallType: null,
        storeId: null,
        storeName: null,
        storeAccount: null,
        taskGoodsInfoList: [
            {
                goodsName: null,
                goodsUrl: null,
                goodsImgUrl: null,
                actualUnitPrice: null,
                quantity: null,
                displayedPrice: null,
                goodsSpec: null,
                liveId: null
            }
        ],
        isIncludePostage: null,
        confirmReceiptDays: null,
        foundMethod: null,
        payerNumber: null,
        priceRangeFrom: null,
        priceRangeTo: null,
        goodsLocation: null,
        orderMessage: null,
        goodsEntrance: null,
        needSuperLabel: null,
        allowCopyKeywords: null,
        totalOrderQuantity: null,
        hasOrdinaryTask: null,
        ordinaryTaskList: null,
        hasSpecifiedTextPraiseTask: 0,
        specifiedTextPraiseTaskList: null,
        hasSpecifiedImagePraiseTask: 0,
        specifiedImagePraiseTaskList: null,
        hasSpecifiedVideoPraiseTask: 0,
        specifiedVideoPraiseTaskList: null,
        specifiedPaymentDays: null,
        autoCancelInterval: 24,
        releasePlanList: [
            {
                beginTime: null,
                interval: null,
                quantityUnitTime: null,
                totalQuantity: null
            }
        ],
        appreciationCommission: null,
        emptyParcel: null,
        isAudiSelf: 0,
        isHighQuality: 0,
        isMandatoryConfirmReceipt: 0,
        needFullScreenshot: 0,
        allowUseCoupon: 0,
        needFakeChat: 0,
        allowUseCreditCard: null,
        allowUseAntCreditPay: null,
        needAddShoppingCart: 0,
        needCompareOthers: 0,
        needFinishedBrowseTask: 0,
        needCollectShop: null,
        needCollectGoods: null,
        age: "",
        excludedArea: [],
        gender: null,
        needAboveDiamondLevel: null,
        buyerCategory: "",
        remarkImageUrlList: [],
        remarkContent: ""
    },
    chargeSummary: {
        id: {
            timestamp: 1577377212,
            machineIdentifier: 659986,
            processIdentifier: 10761,
            counter: 3021616,
            date: "2019-12-27 00:20:12",
            time: 1577377212000,
            timeSecond: 1577377212
        },
        taskId: null,
        taskNo: null,
        taskPriceRegionId: null,
        advanceDeposit: null,
        commissionChargeDetails: [],
        principalChargeDetails: [],
        totalOrderQuantity: null,
        totalCommission: null,
        totalPrincipal: null,
        returnRaisePrice: 0,
        commissionRaisePrice: 0
    }
};
export default {
    data() {
        return {
            data,
            process: "?x-oss-process=image/resize,h_100",
            tableData1: [],
            tableData: []
        };
    },

    computed: {
        ...mapState(["common"]),
        ...mapGetters({
            allKV: "area/allKV",
            sellerKV: "status/taskKV",
            path: "imgOSS/path",
            platformKV: "status/platformKV"
        }),
        filterSeller() {
            return this.sellerKV[this.data.taskInfo.taskStatus];
        },
        filterMall() {
            return this.platformKV[this.data.taskInfo.mallType];
        }
    },
    methods: {
        handleClipboard,
        filterAll(id) {
            return this.allKV[id];
        },
        showGender(data) {
            return data == 0 ? "男" : "女";
        },
        showAge(data) {
            let result;
            if (data == "1") {
                result = "25岁以下";
            } else if (data == "2") {
                result = "25-35岁";
            } else {
                result = "35岁以上";
            }
            return result;
        },
        showArea(data) {
            let result = "";
            data.forEach(v => {
                result += this.filterAll(v) + " ";
            });
            return result;
        },
        getList() {
            const taskNo = this.common.taskNo;
            fetchInfo(taskNo).then(({ data }) => {
                Object.assign(this.data, data);
                this.tableData = data.chargeSummary.commissionChargeDetails;
                this.tableData1 = data.chargeSummary.principalChargeDetails;
            });
        },
        arraySpendMethod({ row, column, rowIndex, columnIndex }, l) {
            if (columnIndex == 0) {
                if (rowIndex == 0) {
                    return [l, 1];
                } else {
                    return [0, 0];
                }
            }
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