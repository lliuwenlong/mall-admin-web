import request from '@/utils/request'

export function getList() {
    return request({
        url: '/unicorn/getList',
        method: 'post',
        data: {}
    })
}

export function del(id) {
    return request({
        url: '/unicorn/del',
        method: 'post',
        data: {
            id
        }
    })
}
export function getTag() {
    return request({
        url: '/label/labelShow',
        method: 'post'
    })
}
export function addOrUpdate(data) {
    return request({
        url: '/unicorn/addOrUpdate',
        method: 'post',
        data
    })
}


