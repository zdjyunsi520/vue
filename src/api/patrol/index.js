import { post } from "@/utils/request";
const commonUrl = "Biz";

//巡视周期设置列表
export function fetchList (data) {
    return post("/PatrolCycle/Gets", data, commonUrl);
}
//新增巡视周期
export function add (data) {
    return post("/PatrolCycle/Create", data, commonUrl);
}
//编辑巡视周期
export function update (data) {
    return post("/PatrolCycle/Modify", data, commonUrl);
}
//巡视周期详细
export function getInfo (data) {
    return post("/PatrolCycle/Get", data, commonUrl);
}
//删除巡视周期
export function deleted (data) {
    return post("/PatrolCycle/Remove", data, commonUrl);
}

//巡视任务单
export function fetchListJob (data) {
    return post("/PatrolJob/Gets", data, commonUrl);
}
//新增任务单
export function addJob (data) {
    return post("/PatrolJob/Create", data, commonUrl);
}
//编辑任务单
export function updateJob (data) {
    return post("/PatrolJob/Modify", data, commonUrl);
}
//任务单详细
export function getInfoJob (data) {
    return post("/PatrolJob/Get", data, commonUrl);
}
//删除任务单
export function deletedJob (data) {
    return post("/PatrolJob/Remove", data, commonUrl);
}

// 回退
export function fallbackJob (data) {
    return post("/PatrolJob/Fallback", data, commonUrl);
}



//巡视报告单列表
export function fetchReport (data) {
    return post("/PatrolJob/GetReports", data, commonUrl);
}
// 报告详情
export function getReportInfo (data) {
    return post("/PatrolJob/GetReport", data, commonUrl);
}

// 巡视统计-年
export function userReportByYear (data) {
    return post("/PatrolJobReport/ReportByYear", data, 'Report');
}
// 巡视统计-性质
export function userReportByNature (data) {
    return post("/PatrolJobReport/ReportByNature", data, 'Report');
}
//巡视统计-完成情况
export function userReportByExecute (data) {
    return post("/PatrolJobReport/ReportByExecute", data, 'Report');
}