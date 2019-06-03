import request from '@/utils/request'

export function uploadFile(file) {
    return request({
        url: '/common/uploadFile',
        method: 'post',
        data: {
            file
        }
    })
}
export function getCity(pid) {
    return request({
        url: '/common/getCity',
        method: 'post',
        data: {
            pid
        }
    })
}