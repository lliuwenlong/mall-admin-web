import request from '@/utils/request'

export function addOrUpdate(data) {
  return request({
    url:'/underLine/addOrUpdate',
    method:'post',
    data
  })
}
export function getList(data) {
    return request({
      url:'/underLine/getList',
      method:'post',
      data
    })
  }
  export function del(id) {
    return request({
      url:'/underLine/del',
      method:'post',
      data:{id}
    })
  }