import request from '@/utils/request'

export function getUserList(vipStatus) {
  return request({
    url:'/user/getUserList',
    method:'post',
    data:{vipStatus}
  })
}
