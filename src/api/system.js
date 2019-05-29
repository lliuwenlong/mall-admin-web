import request from '@/utils/request'

export function getCurriculumType() {
  return request({
    url:'/system/getCurriculumType',
    method:'post',
  })
}

export function updateCurriculumType(data) {
  return request({
    url:'/system/updateCurriculumType',
    method:'post',
    data
  })
}
export function delcurriculumType(id) {
  return request({
    url:'/system/delcurriculumType',
    method:'post',
    data:{id}
  })
}
export function Basic() {
  return request({
    url:'/system/Basic',
    method:'post',
   
  })
}
export function setBasic(data) {
  return request({
    url:'/system/setBasic',
    method:'post',
    data
  })
}