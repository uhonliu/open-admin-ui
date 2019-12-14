import request from '@/libs/request'

let src = 'pay/'
/**
 * 获取支付列表
 */
export const getPayList = (obj) => {
  const params = obj
  return request({
    url: src + 'order/list',
    params,
    method: 'get'
  })
}
/**
 * 获取支付订单详情
 */
export const getPayInfo = (id) => {
  const params = { payOrderId: id }
  return request({
    url: src + 'order/detail',
    params,
    method: 'get'
  })
}
/**
 * 获取转账列表
 */
export const getTranList = (obj) => {
  const params = obj
  return request({
    url: src + 'trans_order/list',
    params,
    method: 'get'
  })
}
/**
 * 获取转账订单详情
 */
export const getTranInfo = (id) => {
  const params = { transOrderId: id }
  return request({
    url: src + 'trans_order/detail',
    params,
    method: 'get'
  })
}
/**
 * 获取退款列表
 */
export const getRefundList = (obj) => {
  const params = obj
  return request({
    url: src + 'refund_order/list',
    params,
    method: 'get'
  })
}
/**
 * 获取退款订单详情
 */
export const getBackInfo = (id) => {
  const params = { refundOrderId: id }
  return request({
    url: src + 'refund_order/detail',
    params,
    method: 'get'
  })
}
/**
 * 获取商户列表
 */
export const getsaleList = (obj) => {
  const params = obj
  return request({
    url: src + 'mch_info/list',
    params,
    method: 'get'
  })
}
/**
 * 获取商户详情
 */
export const getsaleInfo = (id) => {
  const params = { mchId: id }
  return request({
    url: src + 'mch_info/detail',
    params,
    method: 'get'
  })
}
/**
* 修改商户
*/
export const editsale = (obj) => {
  const data = obj
  return request({
    url: src + 'mch_info/update',
    data,
    method: 'post'
  })
}
/**
* 新增商户
*/
export const addsale = (obj) => {
  const data = obj
  return request({
    url: src + 'mch_info/save',
    data,
    method: 'post'
  })
}
/**
 * 获取支付渠道列表
 */
export const getChannelList = (obj) => {
  const params = obj
  return request({
    url: src + 'channel/list',
    params,
    method: 'get'
  })
}
/**
 * 获取商户详情
 */
export const getpayWayInfo = (id) => {
  const params = { channelId: id }
  return request({
    url: src + 'channel/detail',
    params,
    method: 'get'
  })
}
/**
* 修改商户
*/
export const editpayWay = (obj) => {
  const data = obj
  return request({
    url: src + 'channel/update',
    data,
    method: 'post'
  })
}
/**
* 新增商户
*/
export const addpayWay = (obj) => {
  const data = obj
  return request({
    url: src + 'channel/save',
    data,
    method: 'post'
  })
}
/**
 * 获取所有渠道
 */
export const getAllpayWay = () => {
  return request({
    url: src + 'channel/codeToName',
    method: 'get'
  })
}
/**
 * 获取商户通知列表
 */
export const getNotifyList = (obj) => {
  const params = obj
  return request({
    url: src + 'mch_notify/list',
    params,
    method: 'get'
  })
}
/**
 * 获取通知详情
 */
export const getNotifyInfo = (id) => {
  const params = { orderId: id }
  return request({
    url: src + 'mch_notify/detail',
    params,
    method: 'get'
  })
}
