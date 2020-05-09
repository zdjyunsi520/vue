import { post } from "@/utils/request";
const commonUrl = "Biz";

//巡视周期设置列表
export function getPatrolCycle(data) {
    return post("/PatrolCycle/Gets", data, commonUrl);
}
//新增巡视周期
export function createPatrolCycle(data) {
    return post("/PatrolCycle/Create", data, commonUrl);
}
//修改巡视周期
export function modifyPatrolCycle(data) {
    return post("/PatrolCycle/Modify", data, commonUrl);
}
//巡视周期详细
export function detailPatrolCycle(data) {
    return post("/PatrolCycle/Get", data, commonUrl);
}
//删除巡视周期
export function deletePatrolCycle(data) {
    return post("/PatrolCycle/Remove", data, commonUrl);
}

//巡视任务单
export function getPatrolJob(data) {
    return post("/PatrolJob/Gets", data, commonUrl);
}
//新增任务单
export function createPatrolJob(data) {
    return post("/PatrolJob/Create", data, commonUrl);
}
//修改任务单
export function modifyPatrolJob(data) {
    return post("/PatrolJob/Modify", data, commonUrl);
}
//任务单详细
export function detailPatrolJob(data) {
    return post("/PatrolJob/Get", data, commonUrl);
}
//删除任务单
export function deletePatrolJob(data) {
    return post("/PatrolJob/Remove", data, commonUrl);
}

// 人员巡视统计-年
export function userReportByYear(data) {
    return post("/PatrolJobReport/ReportByYear", data, commonUrl);
}
// 人员巡视统计-性质
export function userReportByNature(data) {
    return post("/PatrolJobReport/ReportByNature", data, commonUrl);
}
// 人员巡视统计-完成情况
export function userReportByExecute(data) {
    return post("/PatrolJobReport/ReportByExecute", data, commonUrl);
}