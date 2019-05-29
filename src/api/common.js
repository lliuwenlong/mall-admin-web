import request from '@/utils/request'

export function uploadFile(file) {
  return request({
    url:'/common/uploadFile',
    method:'post',
    data:{
        file
    }
  })
}