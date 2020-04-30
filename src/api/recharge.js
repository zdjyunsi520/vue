import {get, put } from '@/utils/post'
export function fetchList(data) {
    return get('/system/recharge/record/list', data)
}

export function updateSts() {
    return put('/system/recharge/record/', data)
}