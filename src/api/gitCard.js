import request from '@/utils/request'

export function getGiftCardList() {
  return request({
    url:'/giftCard/getGiftCardList',
    method:'post',
  })
}
export function addGiftCard(data) {
    return request({
      url:'/giftCard/addGiftCard',
      method:'post',
      data
    })
  }
  export function delGiftCard(id) {
    return request({
      url:'/giftCard/delGiftCard',
      method:'post',
      data:{id}
    })
  }
