import request from '@/libs/request'

let src = 'plat/'
/**
 * 获取用户列表
 */
export const getUserList = (obj) => {
  const data = obj
  return request({
    url: src + 'user/list',
    data,
    method: 'post'
  })
}
/**
 * 修改状态
 */
export const changeUserState = (obj) => {
  const data = obj
  return request({
    url: src + 'user/batch/change',
    data,
    method: 'post'
  })
}
/**
 * 获取用户详情
 */
export const getUserInfo = (id) => {
  const data = { userId: id }
  return request({
    url: src + 'user/detail',
    data,
    method: 'post'
  })
}
/**
 * 获取用户来源
 */
export const getType = () => {
  return request({
    url: src + 'user/source/list',
    method: 'post'
  })
}
/**
* 推送到客户管理
*/
export const pushClientSystem = (obj) => {
  const data = obj
  return request({
    url: 'plat/user/batch/push',
    data,
    method: 'post'
  })
}
/**
*导出列表
*/
export const exportList = (obj) => {
  const data = obj
  return request({
    url: 'plat/user/list/export',
    data,
    method: 'post'
  })
}
